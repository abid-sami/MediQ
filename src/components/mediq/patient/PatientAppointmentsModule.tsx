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
  const [newDate, setNewDate] = useState("2026-08-22");
  const [newTime, setNewTime] = useState("11:00 AM");

  const handleConfirmReschedule = () => {
    if (!rescheduleApt) return;
    onRescheduleAppointment(rescheduleApt.id, newDate, newTime);
    setRescheduleApt(null);
    toast.success("Appointment Rescheduled Successfully", {
      description: `New schedule: ${newDate} at ${newTime}`,
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
            View upcoming consultations, reschedule dates, or book new doctor appointments.
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
                    <h3 className="font-bold text-base text-foreground">{apt.doctorName}</h3>
                    <Badge variant="outline" className="text-[10px] font-semibold text-primary">
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
                    <span className="text-muted-foreground font-normal">Fee: ${apt.fee}</span>
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
                    onClick={() => setRescheduleApt(apt)}
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
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-amber-500" /> Reschedule Appointment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <p className="text-xs text-muted-foreground">
                Select a new date and time for consultation with <strong>{rescheduleApt.doctorName}</strong>.
              </p>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">New Date</Label>
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">New Time Slot</Label>
                <Input
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <Button
                onClick={handleConfirmBookingReschedule}
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

  function handleConfirmBookingReschedule() {
    if (!rescheduleApt) return;
    onRescheduleAppointment(rescheduleApt.id, newDate, newTime);
    setRescheduleApt(null);
    toast.success("Appointment Rescheduled");
  }
}
