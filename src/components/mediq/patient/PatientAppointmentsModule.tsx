import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  Building2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Plus,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { PatientAppointment } from "@/data/patient-data";
import { getDoctorSchedules, isDoctorAvailableOnDay, generateDoctorTimeSlots } from "@/data/doctor-schedule-store";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { format } from "date-fns";

interface PatientAppointmentsModuleProps {
  appointments: PatientAppointment[];
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  onNavigateToFindDoctor: () => void;
}

export function PatientAppointmentsModule({
  appointments,
  onCancelAppointment,
  onRescheduleAppointment,
  onNavigateToFindDoctor,
}: PatientAppointmentsModuleProps) {
  const [rescheduleApt, setRescheduleApt] = useState<PatientAppointment | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [newTime, setNewTime] = useState("11:00 AM");

  const schedules = getDoctorSchedules();
  const activeSched = rescheduleApt ? schedules[rescheduleApt.doctorId] : null;
  const dynamicSlots = activeSched ? generateDoctorTimeSlots(activeSched.startTime, activeSched.endTime) : ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];

  const bookedSlots = rescheduleApt && rescheduleDate
    ? JSON.parse(localStorage.getItem(`mediq_booked_slots_${rescheduleApt.doctorId}_${format(rescheduleDate, "yyyy-MM-dd")}`) || "[]")
    : [];

  const handleConfirmReschedule = () => {
    if (!rescheduleApt || !rescheduleDate || !newTime) {
      toast.error("Please select a valid date and time slot");
      return;
    }

    const formattedDate = format(rescheduleDate, "yyyy-MM-dd");
    const takenSlots = JSON.parse(localStorage.getItem(`mediq_booked_slots_${rescheduleApt.doctorId}_${formattedDate}`) || "[]");

    if (takenSlots.includes(newTime)) {
      toast.error(`The selected time slot is no longer available for ${rescheduleApt.doctorName} on ${formattedDate}.`);
      return;
    }

    if (activeSched && !isDoctorAvailableOnDay(activeSched.workingDays, rescheduleDate)) {
      toast.error(`${rescheduleApt.doctorName} is unavailable on the selected date.`);
      return;
    }

    onRescheduleAppointment(rescheduleApt.id, formattedDate, newTime);
    setRescheduleApt(null);
    setRescheduleDate(undefined);
    setNewTime("11:00 AM");
    toast.success("Appointment Rescheduled Successfully", {
      description: `New schedule: ${formattedDate} at ${newTime}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> My Appointments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View upcoming consultations, reschedule dates according to doctor schedules, or book new doctor appointments.
          </p>
        </div>

        <Button
          onClick={onNavigateToFindDoctor}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Book New Appointment
        </Button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={apt.doctorAvatar}
                  alt={apt.doctorName}
                  className="h-14 w-14 rounded-2xl object-cover border-2 border-primary/20 shrink-0"
                />

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-extrabold text-base text-foreground flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4 text-primary shrink-0" />
                      {apt.doctorName}
                    </h3>
                    <Badge className="bg-primary/20 text-primary border-primary/30 text-[11px] font-bold">
                      {apt.category}
                    </Badge>
                    <Badge variant="secondary" className="text-[10px] font-mono font-bold">
                      ID: {apt.appointmentId}
                    </Badge>
                    <Badge
                      className={
                        apt.status === "Confirmed"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : apt.status === "Rescheduled"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {apt.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-primary" /> {apt.hospital}
                  </p>

                  <div className="flex items-center gap-4 mt-2 text-xs font-semibold">
                    <span className="flex items-center gap-1 text-foreground">
                      <Calendar className="h-3.5 w-3.5 text-primary" /> {apt.date}
                    </span>
                    <span className="flex items-center gap-1 text-teal">
                      <Clock className="h-3.5 w-3.5" /> {apt.time}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">Fee: ${apt.fee}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              {apt.status !== "Cancelled" && (
                <div className="flex items-center gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl text-xs font-semibold"
                    onClick={() => {
                      setRescheduleApt(apt);
                      setRescheduleDate(undefined);
                    }}
                  >
                    <RotateCcw className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Reschedule
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      onCancelAppointment(apt.id);
                      toast.info(`Appointment ${apt.appointmentId} cancelled`);
                    }}
                  >
                    <XCircle className="mr-1.5 h-3.5 w-3.5" /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Reschedule Dialog */}
      {rescheduleApt && (
        <Dialog open={!!rescheduleApt} onOpenChange={() => setRescheduleApt(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-500" /> Reschedule Appointment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs">
                <p className="font-bold text-foreground">Doctor: {rescheduleApt.doctorName}</p>
                <p className="text-muted-foreground">{rescheduleApt.category}</p>
                {activeSched && (
                  <p className="text-teal font-medium mt-1">
                    Available Days: {activeSched.workingDays.join(", ")} ({activeSched.startTime} - {activeSched.endTime})
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Select New Available Date *</Label>
                <div className="rounded-2xl border border-border bg-surface p-2">
                  <CalendarUI
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={(date) => {
                      setRescheduleDate(date);
                      setNewTime("");
                    }}
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      if (d < today) return true;
                      if (activeSched) {
                        return !isDoctorAvailableOnDay(activeSched.workingDays, d);
                      }
                      return false;
                    }}
                    className="mx-auto"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-muted-foreground">Select New Time Slot *</Label>
                <div className="grid grid-cols-3 gap-2">
                  {dynamicSlots.map((slot) => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setNewTime(slot)}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all text-center ${
                          isBooked
                            ? "border-dashed border-border bg-muted/30 text-muted-foreground cursor-not-allowed opacity-60 line-through"
                            : newTime === slot
                              ? "border-transparent bg-amber-500 text-white font-bold"
                              : "border-border bg-card text-foreground hover:border-amber-500/50"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={handleConfirmReschedule}
                disabled={!rescheduleDate}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl py-5 shadow-md"
              >
                Confirm Reschedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
