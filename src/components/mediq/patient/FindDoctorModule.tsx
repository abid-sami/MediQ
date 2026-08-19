import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Star,
  Building2,
  Clock,
  Calendar,
  Stethoscope,
  Filter,
  CheckCircle2,
  Sparkles,
  Calendar as CalendarIcon,
  DollarSign,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { DoctorCard, PatientAppointment } from "@/data/patient-data";
import {
  getDoctorSchedules,
  DoctorScheduleConfig,
  isDoctorAvailableOnDay,
  generateDoctorTimeSlots,
  getBookedSlotsForDoctorAndDate,
  markSlotBooked,
} from "@/data/doctor-schedule-store";
import { createSupabaseAppointment } from "@/services/supabase-service";
import { cn } from "@/lib/utils";

interface FindDoctorModuleProps {
  doctors: DoctorCard[];
  onBookAppointment: (newApt: PatientAppointment) => void;
  patientName: string;
  patientPhone: string;
}

export function FindDoctorModule({
  doctors,
  onBookAppointment,
  patientName,
  patientPhone,
}: FindDoctorModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [hospitalFilter, setHospitalFilter] = useState("All");

  const [schedules, setSchedules] = useState<Record<string, DoctorScheduleConfig>>(() =>
    getDoctorSchedules()
  );

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

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorCard | null>(null);
  const [bookingDate, setBookingDate] = useState<Date | undefined>(undefined);
  const [bookingTime, setBookingTime] = useState("");
  const [reason, setReason] = useState("");
  const [bookingOpen, setBookingOpen] = useState(false);

  const activeDocSchedule = useMemo(() => {
    if (!selectedDoctor) return null;
    return schedules[selectedDoctor.id] || null;
  }, [selectedDoctor, schedules]);

  const dynamicSlots = useMemo(() => {
    return generateDoctorTimeSlots(activeDocSchedule?.startTime, activeDocSchedule?.endTime);
  }, [activeDocSchedule]);

  const bookedSlots = useMemo(() => {
    if (!selectedDoctor || !bookingDate) return [];
    const dateStr = format(bookingDate, "yyyy-MM-dd");
    return getBookedSlotsForDoctorAndDate(selectedDoctor.id, dateStr);
  }, [selectedDoctor, bookingDate]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(doctors.map((d) => d.category).filter(Boolean))).sort()],
    [doctors]
  );
  const hospitals = useMemo(
    () => ["All", ...Array.from(new Set(doctors.map((d) => d.hospital).filter(Boolean))).sort()],
    [doctors]
  );

  const filteredDoctors = useMemo(() => {
    return doctors.filter((doc) => {
      const docSched = schedules[doc.id];
      const isOnVacation = docSched?.onVacation;
      if (isOnVacation) return false;

      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = categoryFilter === "All" || doc.category === categoryFilter;
      const matchesHosp = hospitalFilter === "All" || doc.hospital === hospitalFilter;
      return matchesSearch && matchesCat && matchesHosp;
    });
  }, [doctors, schedules, searchTerm, categoryFilter, hospitalFilter]);

  const handleConfirmBooking = async () => {
    if (!selectedDoctor || !bookingDate || !bookingTime) {
      toast.error("Please select a date and time slot.");
      return;
    }

    if (!activeDocSchedule) {
      toast.error("This doctor has not published live appointment availability yet.");
      return;
    }

    if (!patientName.trim()) {
      toast.error("Your patient profile is still loading. Please try again in a moment.");
      return;
    }

    const dateStr = format(bookingDate, "yyyy-MM-dd");
    const currentBooked = getBookedSlotsForDoctorAndDate(selectedDoctor.id, dateStr);
    if (currentBooked.includes(bookingTime)) {
      toast.error(`The time slot ${bookingTime} on ${dateStr} has already been booked. Please choose another.`);
      return;
    }

    const aptId = `MQ-APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const feeAmount = activeDocSchedule.consultationFee ?? selectedDoctor.consultationFee;

    // Mark slot booked
    markSlotBooked(selectedDoctor.id, dateStr, bookingTime);

    const newApt: PatientAppointment = {
      id: `apt-p-${Date.now()}`,
      appointmentId: aptId,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorAvatar: selectedDoctor.avatar,
      category: `${selectedDoctor.category} - ${selectedDoctor.specialization}`,
      hospital: selectedDoctor.hospital,
      date: dateStr,
      time: bookingTime,
      status: "Confirmed",
      reason,
      fee: feeAmount,
    };

    const { error } = await createSupabaseAppointment({
      appointmentId: aptId,
      patientName,
      patientPhone,
      doctorName: selectedDoctor.name,
      doctorId: selectedDoctor.id,
      specialty: `${selectedDoctor.category} - ${selectedDoctor.specialization}`,
      appointmentDate: dateStr,
      appointmentTime: bookingTime,
      serialNumber: Math.floor(1 + Math.random() * 15),
      serialToken: `Serial #${Math.floor(1 + Math.random() * 15)}`,
      fee: feeAmount,
    });

    if (error) {
      toast.error("Could not save the appointment. Please try again.");
      return;
    }

    onBookAppointment(newApt);
    setBookingOpen(false);
    setBookingDate(undefined);
    setBookingTime("");

    toast.success(`Appointment Confirmed with ${selectedDoctor.name}`, {
      description: `Appointment ID: ${newApt.appointmentId} | Specialization: ${selectedDoctor.category} - ${selectedDoctor.specialization} | Fee: $${feeAmount}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" /> Find Doctors & Specialists
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search verified healthcare experts across MediQ network and book instant consultations based on their working schedule.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card border border-border p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Doctor Name or Specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder="Category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All Specialties" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder="Hospital..." />
          </SelectTrigger>
          <SelectContent>
            {hospitals.map((h) => (
              <SelectItem key={h} value={h}>
                {h === "All" ? "All Hospitals" : h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => {
          const docSched = schedules[doc.id];
          const fee = docSched?.consultationFee ?? doc.consultationFee;
          const workingDays = docSched?.workingDays || doc.availableDays;
          const workingHours = docSched ? `${docSched.startTime} - ${docSched.endTime}` : doc.availableTime;

          return (
            <div
              key={doc.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all card-lift shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                {doc.avatar ? (
                  <img src={doc.avatar} alt={doc.name} className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/20 shadow-xs shrink-0" />
                ) : (
                  <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border-2 border-primary/20 bg-primary/10 text-xl font-black text-primary">
                    {doc.name.slice(0, 1).toUpperCase()}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/20 text-primary border-primary/30 font-bold text-[11px]">
                      {doc.category} - {doc.specialization}
                    </Badge>
                    {doc.rating > 0 && (
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-current" />
                        <span>{doc.rating}</span>
                        <span className="text-[10px] text-muted-foreground font-normal">({doc.reviewsCount})</span>
                      </div>
                    )}
                  </div>

                  <h3 className="font-extrabold text-base text-foreground mt-1.5 truncate flex items-center gap-1.5">
                    <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </h3>

                  <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5 truncate">
                      <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="truncate">{doc.hospital || "Location not published"}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-teal shrink-0" />
                      <span>{workingHours || "Schedule not published"}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CalendarIcon className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-[11px] font-medium text-foreground">
                        Days: {workingDays.length ? workingDays.join(", ") : "Not published"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground block font-bold">CONSULTATION FEE</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{fee > 0 ? `$${fee}` : "Set by clinic"}</span>
                </div>

                <Button
                  onClick={() => {
                    setSelectedDoctor(doc);
                    setBookingDate(undefined);
                    setBookingTime("");
                    setBookingOpen(true);
                  }}
                  className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
                >
                  <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Appointment
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule-Driven Booking Modal */}
      {selectedDoctor && (
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="max-w-lg p-6 rounded-2xl bg-card border-border max-h-[92vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Doctor Appointment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {/* Prominently Highlighted Doctor Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-teal/5 to-primary/5 border border-primary/30 flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  {selectedDoctor.avatar ? (
                    <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/30" />
                  ) : (
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border-2 border-primary/30 bg-primary/10 text-lg font-black text-primary">{selectedDoctor.name.slice(0, 1).toUpperCase()}</span>
                  )}
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider">
                      SELECTED SPECIALIST
                    </span>
                    <h4 className="font-extrabold text-base text-foreground">{selectedDoctor.name}</h4>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-bold mt-0.5">
                      {selectedDoctor.category} - {selectedDoctor.specialization}
                    </Badge>
                  </div>
                </div>

                <div className="text-right shrink-0 bg-card/80 p-2.5 rounded-xl border border-border">
                  <span className="text-[10px] text-muted-foreground block font-bold">FEE</span>
                  <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">{(activeDocSchedule?.consultationFee ?? selectedDoctor.consultationFee) > 0 ? `$${activeDocSchedule?.consultationFee ?? selectedDoctor.consultationFee}` : "Set by clinic"}</span>
                </div>
              </div>

              {/* Working Schedule Banner */}
              {activeDocSchedule && (
                <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-muted/40 border border-border text-xs">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 text-teal" />
                    <span>Hours: <strong className="text-foreground">{activeDocSchedule.startTime} - {activeDocSchedule.endTime}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarIcon className="h-3.5 w-3.5 text-primary" />
                    <span>Days: <strong className="text-foreground">{activeDocSchedule.workingDays.join(", ")}</strong></span>
                  </div>
                </div>
              )}

              {/* Schedule-Restricted Calendar Picker */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-muted-foreground">Select Available Date *</Label>
                  {activeDocSchedule && (
                    <span className="text-[10px] text-muted-foreground">
                      Working: <strong className="text-primary">{activeDocSchedule.workingDays.join(", ")}</strong>
                    </span>
                  )}
                </div>
                <div className="rounded-2xl border border-border bg-surface p-2">
                  <CalendarUI
                    mode="single"
                    selected={bookingDate}
                    onSelect={(d) => {
                      setBookingDate(d);
                      setBookingTime("");
                    }}
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (d < today) return true;
                      if (activeDocSchedule) {
                        return !isDoctorAvailableOnDay(activeDocSchedule.workingDays, d);
                      }
                      return false;
                    }}
                    className="mx-auto"
                  />
                </div>
                {bookingDate && (
                  <p className="text-[11px] text-teal font-semibold text-center">
                    Selected Date: {format(bookingDate, "EEEE, MMMM d, yyyy")}
                  </p>
                )}
              </div>

              {/* Dynamic Time Slots with Booked Prevention */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-muted-foreground">Select Preferred Time Slot *</Label>
                  {bookingDate && bookedSlots.length > 0 && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      {bookedSlots.length} slot(s) already booked
                    </span>
                  )}
                </div>

                {!bookingDate ? (
                  <p className="text-xs text-muted-foreground p-3 rounded-xl bg-muted/40 border border-border text-center">
                    Please select an available date above to view time slots.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {dynamicSlots.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => setBookingTime(slot)}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-xs font-semibold transition-all duration-200 text-center flex flex-col items-center justify-center",
                            isBooked
                              ? "border-dashed border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60 line-through"
                              : bookingTime === slot
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

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Reason for Visit</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine checkup, Follow-up consultation"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={!bookingDate || !bookingTime}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md"
              >
                Confirm Appointment Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
