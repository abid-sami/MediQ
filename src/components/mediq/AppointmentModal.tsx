import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CheckCircle2, Loader2, Clock, Hash, AlertTriangle, ShieldCheck, Stethoscope, Sparkles, User, DollarSign, Calendar as CalendarIcon, Ban } from "lucide-react";
import { format } from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { doctorCategories } from "@/data/mediq";
import { getPatientDoctorCards } from "@/data/patient-data";
import { cn } from "@/lib/utils";
import {
  getDoctorSchedules,
  incrementDoctorBookings,
  DoctorScheduleConfig,
  isDoctorAvailableOnDay,
  generateDoctorTimeSlots,
  getBookedSlotsForDoctorAndDate,
  markSlotBooked,
  syncDoctorSchedulesFromProfiles,
} from "@/data/doctor-schedule-store";

import { useMediQActions } from "./actions-context";
import { useAuth } from "@/hooks/use-auth";

type Booking = {
  id: string;
  serialNo: string;
  doctor: string;
  department: string;
  consultationHours: string;
  date: string;
  time: string;
  patientName: string;
  patientPhone: string;
  fee: number;
};

export function AppointmentModal() {
  const { appointmentOpen, closeAppointment, preselectedDoctorId } = useMediQActions();
  const { profile, user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [category, setCategory] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  const [schedules, setSchedules] = useState<Record<string, DoctorScheduleConfig>>(() =>
    getDoctorSchedules()
  );
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [doctorsSyncFailed, setDoctorsSyncFailed] = useState(false);

  const syncDoctors = () => {
    setDoctorsLoading(true);
    setDoctorsSyncFailed(false);
    syncDoctorSchedulesFromProfiles()
      .then((merged) => setSchedules(merged))
      .catch(() => setDoctorsSyncFailed(true))
      .finally(() => setDoctorsLoading(false));
  };

  // Refresh directly from Supabase every time the modal is opened, rather
  // than relying only on the one-time sync at app startup — this closes the
  // gap where doctors added after the page first loaded (or a sync that
  // failed silently on first load) wouldn't show up without a hard refresh.
  useEffect(() => {
    if (appointmentOpen) {
      syncDoctors();
    }
  }, [appointmentOpen]);

  useEffect(() => {
    const handleUpdate = () => {
      setSchedules(getDoctorSchedules());
    };
    window.addEventListener("mediq_schedule_updated", handleUpdate);
    window.addEventListener("mediq_slots_updated", handleUpdate);
    return () => {
      window.removeEventListener("mediq_schedule_updated", handleUpdate);
      window.removeEventListener("mediq_slots_updated", handleUpdate);
    };
  }, []);

  // When opened from a doctor card ("Book Appointment" on a specific
  // doctor), prefill their department + selection instead of starting blank.
  useEffect(() => {
    if (appointmentOpen && profile) {
      setName((current) => current || profile.name || user?.user_metadata?.full_name || "");
      setPhone((current) => current || profile.phone || user?.user_metadata?.phone || "");
    }
  }, [appointmentOpen, profile, user]);

  useEffect(() => {
    if (appointmentOpen && preselectedDoctorId) {
      const doctor = getPatientDoctorCards().find((d) => d.id === preselectedDoctorId);
      if (doctor) {
        setCategory(doctor.category);
        setDoctorId(doctor.id);
      }
    }
  }, [appointmentOpen, preselectedDoctorId]);

  const availableCategories = useMemo(() => {
    const fromDoctors = Array.from(
      new Set(Object.values(schedules).map((s) => s.department).filter(Boolean))
    ).sort();
    // Fall back to the generic list only if no real doctors are synced yet,
    // so the dropdown is never completely empty on first render.
    return fromDoctors.length > 0 ? fromDoctors : [...doctorCategories];
  }, [schedules]);

  const availableDoctors = useMemo(() => {
    return getPatientDoctorCards().filter((d) => {
      const matchesCat = category ? d.category === category : true;
      const sched = schedules[d.id];
      const isVacation = sched?.onVacation;
      return matchesCat && !isVacation;
    });
  }, [category, schedules]);

  const selectedDoctorObj = useMemo(() => {
    return getPatientDoctorCards().find((d) => d.id === doctorId) || null;
  }, [doctorId]);

  const activeDoctorSchedule = useMemo(() => {
    if (!doctorId) return null;
    return schedules[doctorId] || null;
  }, [doctorId, schedules]);

  // Dynamic time slots for the selected doctor
  const dynamicDoctorSlots = useMemo(() => {
    return generateDoctorTimeSlots(
      activeDoctorSchedule?.startTime,
      activeDoctorSchedule?.endTime
    );
  }, [activeDoctorSchedule]);

  // Booked slots for selected doctor and date
  const bookedSlots = useMemo(() => {
    if (!doctorId || !date) return [];
    const dateStr = format(date, "yyyy-MM-dd");
    return getBookedSlotsForDoctorAndDate(doctorId, dateStr);
  }, [doctorId, date]);

  const reset = () => {
    setBooking(null);
    setName("");
    setPhone("");
    setCategory("");
    setDoctorId("");
    setDate(undefined);
    setTime("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = selectedDoctorObj;
    if (!name.trim() || !phone.trim() || !doctor || !date || !time) {
      toast.error("Please complete every step to confirm your appointment.");
      return;
    }

    if (activeDoctorSchedule && (activeDoctorSchedule.onVacation || !activeDoctorSchedule.isAcceptingBookings)) {
      toast.error(`${doctor.name} is currently on vacation / not accepting online bookings.`);
      return;
    }

    const dateStr = format(date, "yyyy-MM-dd");
    const currentBooked = getBookedSlotsForDoctorAndDate(doctorId, dateStr);
    if (currentBooked.includes(time)) {
      toast.error(`The time slot ${time} on ${dateStr} has already been booked. Please select another slot.`);
      return;
    }

    if (
      activeDoctorSchedule &&
      activeDoctorSchedule.currentBookedCount >= activeDoctorSchedule.dailyPatientLimit
    ) {
      toast.error(
        `Daily limit reached for ${doctor.name} (${activeDoctorSchedule.currentBookedCount}/${activeDoctorSchedule.dailyPatientLimit} slots full). Please select another date.`
      );
      return;
    }

    setSubmitting(true);

    // Increment booking count and get serial
    const newSerialNum = incrementDoctorBookings(doctorId);
    const formattedSerial = `Serial #${String(newSerialNum).padStart(2, "0")}`;
    const hoursText = activeDoctorSchedule
      ? `${activeDoctorSchedule.startTime} - ${activeDoctorSchedule.endTime}`
      : "09:00 AM - 05:00 PM";
    const aptId = `APT-${Math.floor(10000 + Math.random() * 89999)}`;
    const feeAmount = Math.max(0, Number(activeDoctorSchedule?.consultationFee ?? 0));

    // Mark slot booked locally & dispatch event
    markSlotBooked(doctorId, dateStr, time);

    // Asynchronously sync with Supabase Database & localStorage
    import("@/services/supabase-service").then(({ createSupabaseAppointment }) => {
      createSupabaseAppointment({
        appointmentId: aptId,
        patientName: name,
        patientPhone: phone,
        doctorName: doctor.name,
        doctorId,
        specialty: `${doctor.category} - ${doctor.title}`,
        appointmentDate: dateStr,
        appointmentTime: time,
        serialNumber: newSerialNum,
        serialToken: formattedSerial,
        fee: feeAmount,
      });
    });

    window.setTimeout(() => {
      setBooking({
        id: aptId,
        serialNo: formattedSerial,
        doctor: doctor.name,
        department: `${doctor.category} - ${doctor.title}`,
        consultationHours: hoursText,
        date: format(date, "EEEE, d MMMM yyyy"),
        time,
        patientName: name,
        patientPhone: phone,
        fee: feeAmount,
      });
      setSubmitting(false);
      toast.success(`Appointment Booked Successfully! ${formattedSerial}`);
    }, 600);
  };

  return (
    <Dialog open={appointmentOpen} onOpenChange={closeAppointment}>
      <DialogContent className="max-w-lg p-6 rounded-2xl bg-card border-border max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-[17px]">Book Doctor Appointment</DialogTitle>
              <DialogDescription className="text-xs">
                Select your preferred doctor, schedule date, and consultation time slot.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {booking ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4 text-center py-2"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <Badge className="bg-primary/20 text-primary font-mono text-xs mb-1">
                {booking.id}
              </Badge>
              <h3 className="text-lg font-bold text-foreground">Appointment Confirmed</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your serial token has been registered in MediQ Patient Dispatch System.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-muted/40 border border-border text-xs text-left space-y-2 font-medium">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Serial Token:</span>
                <span className="font-bold text-foreground font-mono">{booking.serialNo}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Doctor Name:</span>
                <span className="font-bold text-foreground">{booking.doctor}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Specialization:</span>
                <span className="font-bold text-foreground">{booking.department}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Consultation Fee:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">৳{booking.fee.toLocaleString("en-BD")}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-bold text-foreground">{booking.date}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Time Slot:</span>
                <span className="font-bold text-teal">{booking.time}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Patient:</span>
                <span className="font-bold text-foreground">{booking.patientName} ({booking.patientPhone})</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Consultation Hours:</span>
                <span className="font-bold text-foreground">{booking.consultationHours}</span>
              </div>
            </div>

            <Button onClick={reset} className="w-full gradient-primary font-bold rounded-xl py-5">
              Book Another Appointment
            </Button>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="space-y-4 text-xs mt-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="apt-name">Patient Name *</Label>
                <Input
                  id="apt-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Abid Sami"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="apt-phone">Phone Number *</Label>
                <Input
                  id="apt-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apt-category">Medical Category / Department *</Label>
              <Select
                value={category}
                onValueChange={(value) => {
                  setCategory(value);
                  setDoctorId("");
                  setDate(undefined);
                  setTime("");
                }}
              >
                <SelectTrigger id="apt-category">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="apt-doctor">Select Specialist Doctor *</Label>
              <Select
                value={doctorId}
                onValueChange={(val) => {
                  setDoctorId(val);
                  setDate(undefined);
                  setTime("");
                }}
                disabled={!category || doctorsLoading}
              >
                <SelectTrigger id="apt-doctor">
                  <SelectValue
                    placeholder={
                      doctorsLoading
                        ? "Loading doctors..."
                        : !category
                        ? "Select a category first"
                        : availableDoctors.length === 0
                        ? "No doctors in this department yet"
                        : "Select doctor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableDoctors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} - {d.category} - {d.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {doctorsSyncFailed && (
                <p className="flex items-center gap-1.5 text-xs text-destructive">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Couldn't load doctors right now.{" "}
                  <button type="button" onClick={syncDoctors} className="underline">
                    Retry
                  </button>
                </p>
              )}
              {!doctorsLoading && !doctorsSyncFailed && category && availableDoctors.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No doctors are available in this department yet. Please check back soon.
                </p>
              )}
            </div>

            {/* Prominently Highlighted Doctor Information Card */}
            {selectedDoctorObj && activeDoctorSchedule && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-teal/5 to-primary/5 border border-primary/25 space-y-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider block">
                      SELECTED SPECIALIST
                    </span>
                    <h3 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4 text-primary" /> {selectedDoctorObj.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 font-bold text-[11px]">
                        {selectedDoctorObj.category} - {selectedDoctorObj.title}
                      </Badge>
                      <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                        Available for Booking
                      </Badge>
                    </div>
                  </div>

                  <div className="text-right shrink-0 bg-card/80 p-2.5 rounded-xl border border-border">
                    <span className="text-[10px] text-muted-foreground block font-bold">CONSULTATION FEE</span>
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                      ৳{Number(activeDoctorSchedule.consultationFee ?? 0).toLocaleString("en-BD")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60 text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-teal" />
                    <span>Hours: <strong className="text-foreground">{activeDoctorSchedule.startTime} - {activeDoctorSchedule.endTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    <span>Days: <strong className="text-foreground">{activeDoctorSchedule.workingDays.join(", ")}</strong></span>
                  </div>
                </div>
              </div>
            )}

            {/* Schedule-Restricted Calendar Picker */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Select Available Appointment Date *</Label>
                {activeDoctorSchedule && (
                  <span className="text-[10px] text-muted-foreground">
                    Available Days: <strong className="text-primary">{activeDoctorSchedule.workingDays.join(", ")}</strong>
                  </span>
                )}
              </div>
              <div className="rounded-2xl border border-border bg-surface p-2">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setTime("");
                  }}
                  disabled={(d) => {
                    // Disable past dates
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (d < today) return true;
                    // Disable non-working days for this doctor
                    if (activeDoctorSchedule) {
                      return !isDoctorAvailableOnDay(activeDoctorSchedule.workingDays, d);
                    }
                    return false;
                  }}
                  className="mx-auto"
                />
              </div>
              {date && (
                <p className="text-[11px] text-teal font-semibold text-center">
                  Selected Date: {format(date, "EEEE, MMMM d, yyyy")}
                </p>
              )}
            </div>

            {/* Dynamic Time Slots with Booked State Prevention */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Select Preferred Time Slot *</Label>
                {date && bookedSlots.length > 0 && (
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                    {bookedSlots.length} slot(s) already booked for this date
                  </span>
                )}
              </div>

              {!date ? (
                <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/40 border border-border text-center">
                  Please select an available date above to view time slots.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {dynamicDoctorSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setTime(slot)}
                        className={cn(
                          "rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 text-center flex flex-col items-center justify-center",
                          isBooked
                            ? "border-dashed border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60 line-through"
                            : time === slot
                            ? "border-transparent gradient-primary text-primary-foreground shadow-soft font-bold scale-[1.02]"
                            : "border-border bg-card text-foreground hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        <span>{slot}</span>
                        {isBooked && (
                          <span className="text-[9px] text-destructive font-mono no-underline uppercase">
                            Booked
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting || !doctorId || !date || !time}
              className="w-full rounded-xl gradient-primary py-6 text-base font-bold tracking-wide text-primary-foreground hover:opacity-95 shadow-md mt-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> GENERATING SERIAL TOKEN...
                </>
              ) : (
                "CONFIRM APPOINTMENT & GET SERIAL NO"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
