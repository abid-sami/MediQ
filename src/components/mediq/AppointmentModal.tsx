import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, CheckCircle2, Loader2, Clock, Hash, AlertTriangle, ShieldCheck } from "lucide-react";
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
import { doctorCategories, doctors, timeSlots } from "@/data/mediq";
import { cn } from "@/lib/utils";
import {
  getDoctorSchedules,
  incrementDoctorBookings,
  DoctorScheduleConfig,
} from "@/data/doctor-schedule-store";

import { useMediQActions } from "./actions-context";

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
};

export function AppointmentModal() {
  const { appointmentOpen, closeAppointment } = useMediQActions();
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

  useEffect(() => {
    const handleUpdate = () => {
      setSchedules(getDoctorSchedules());
    };
    window.addEventListener("mediq_schedule_updated", handleUpdate);
    return () => window.removeEventListener("mediq_schedule_updated", handleUpdate);
  }, []);

  const availableDoctors = useMemo(
    () => doctors.filter((d) => d.category === category),
    [category],
  );

  const activeDoctorSchedule = useMemo(() => {
    if (!doctorId) return null;
    return schedules[doctorId] || schedules["doc-101"] || null;
  }, [doctorId, schedules]);

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
    const doctor = doctors.find((d) => d.id === doctorId);
    if (!name.trim() || !phone.trim() || !category || !doctor || !date || !time) {
      toast.error("Please complete every step to confirm your appointment.");
      return;
    }

    if (activeDoctorSchedule && !activeDoctorSchedule.isAcceptingBookings) {
      toast.error(`${doctor.name} is currently not accepting new online bookings.`);
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

    window.setTimeout(() => {
      // Increment booking count and get serial
      const newSerialNum = incrementDoctorBookings(doctorId);
      const formattedSerial = `Serial #${String(newSerialNum).padStart(2, "0")}`;
      const hoursText = activeDoctorSchedule
        ? `${activeDoctorSchedule.startTime} - ${activeDoctorSchedule.endTime}`
        : "09:00 AM - 05:00 PM";

      setBooking({
        id: `APT-${Math.floor(10000 + Math.random() * 89999)}`,
        serialNo: formattedSerial,
        doctor: doctor.name,
        department: category,
        consultationHours: hoursText,
        date: format(date, "EEEE, d MMMM yyyy"),
        time,
        patientName: name,
        patientPhone: phone,
      });
      setSubmitting(false);
      toast.success(`Appointment Confirmed! Assigned ${formattedSerial}`);
    }, 1000);
  };

  return (
    <Dialog
      open={appointmentOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAppointment();
          window.setTimeout(reset, 250);
        }
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-3xl sm:max-w-lg">
        <AnimatePresence mode="wait" initial={false}>
          {!booking ? (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28 }}
            >
              <DialogHeader>
                <div className="mb-2 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-primary text-primary-foreground">
                    <CalendarCheck className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl">Book Doctor Appointment</DialogTitle>
                    <DialogDescription>
                      No account login required. Select a specialist to receive your serial number token.
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <form onSubmit={submit} className="mt-2 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="apt-name">Patient Full Name *</Label>
                    <Input
                      id="apt-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
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

                <div className="space-y-2">
                  <Label htmlFor="apt-category">Medical Category / Department *</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setDoctorId("");
                    }}
                  >
                    <SelectTrigger id="apt-category">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorCategories.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apt-doctor">Select Specialist Doctor *</Label>
                  <Select value={doctorId} onValueChange={setDoctorId} disabled={!category}>
                    <SelectTrigger id="apt-doctor">
                      <SelectValue
                        placeholder={category ? "Select doctor" : "Select a category first"}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDoctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          {d.name} — {d.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Doctor Schedule Live Availability Badge */}
                {activeDoctorSchedule && (
                  <div className="p-3.5 rounded-2xl bg-teal/10 border border-teal/30 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1.5 text-teal-foreground dark:text-teal">
                        <Clock className="h-4 w-4" /> Hours: {activeDoctorSchedule.startTime} - {activeDoctorSchedule.endTime}
                      </span>
                      <Badge className="bg-teal text-teal-foreground font-extrabold text-[10px]">
                        Capacity: {activeDoctorSchedule.currentBookedCount} / {activeDoctorSchedule.dailyPatientLimit} Booked
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Next Serial Token Number: <strong className="text-foreground font-mono">Serial #{String(activeDoctorSchedule.currentBookedCount + 1).padStart(2, "0")}</strong>
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Select Date *</Label>
                  <div className="rounded-2xl border border-border bg-surface p-2">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={{ before: new Date() }}
                      className="mx-auto"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Select Preferred Time Slot *</Label>
                  <div className="flex flex-wrap gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={cn(
                          "rounded-full border px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                          time === slot
                            ? "border-transparent gradient-primary text-primary-foreground shadow-soft"
                            : "border-border bg-card text-muted-foreground hover:border-teal/50 hover:text-foreground",
                        )}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl gradient-primary py-6 text-base font-bold tracking-wide text-primary-foreground hover:opacity-95 shadow-md"
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
            </motion.div>
          ) : (
            /* Confirmation Success Screen with Serial Token Number */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-4"
            >
              <DialogHeader className="items-center text-center">
                <motion.span
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </motion.span>
                <DialogTitle className="mt-3 text-center text-xl font-bold">Appointment & Serial Token Confirmed!</DialogTitle>
                <DialogDescription className="text-center text-xs">
                  Your appointment and serial number token have been generated successfully. Details sent to {booking.patientPhone}.
                </DialogDescription>
              </DialogHeader>

              {/* Highlighted Serial Token Number Banner */}
              <div className="gradient-primary p-4 rounded-2xl text-primary-foreground text-center space-y-1 shadow-soft">
                <span className="text-[10px] font-bold uppercase tracking-wider opacity-90">Assigned Serial Token Number</span>
                <h2 className="text-3xl font-black font-mono tracking-tight">{booking.serialNo}</h2>
                <p className="text-xs opacity-90">Please present this serial number at the clinic reception.</p>
              </div>

              <dl className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card text-xs">
                {[
                  ["Patient Name", booking.patientName],
                  ["Doctor", booking.doctor],
                  ["Department", booking.department],
                  ["Consultation Hours", booking.consultationHours],
                  ["Appointment Date", booking.date],
                  ["Requested Slot", booking.time],
                  ["Appointment ID", booking.id],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-3 px-4 py-2.5">
                    <dt className="text-muted-foreground font-semibold">{label}</dt>
                    <dd className="min-w-0 truncate font-bold text-foreground">{value}</dd>
                  </div>
                ))}
              </dl>

              <Button
                className="w-full rounded-xl font-bold gradient-primary text-primary-foreground py-5"
                onClick={() => {
                  closeAppointment();
                  window.setTimeout(reset, 250);
                }}
              >
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
