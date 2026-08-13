import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Clock,
  Search,
  User,
  Stethoscope,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Calendar,
  Filter,
} from "lucide-react";
import { Appointment, AppointmentStatus, Patient } from "@/data/doctor-data";

interface TodayAppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  onStartConsultation: (appointment: Appointment) => void;
  onOpenPatientProfile: (patient: Patient) => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
}

const statusBadgeStyles: Record<
  AppointmentStatus,
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  Waiting: {
    bg: "bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-500/30",
    icon: Clock,
  },
  "Checked In": {
    bg: "bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-500/30",
    icon: User,
  },
  "In Consultation": {
    bg: "bg-teal/20",
    text: "text-teal font-bold",
    border: "border-teal/40",
    icon: Stethoscope,
  },
  Completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
  },
  Cancelled: {
    bg: "bg-red-500/10",
    text: "text-red-600 dark:text-red-400",
    border: "border-red-500/30",
    icon: XCircle,
  },
};

export function TodayAppointments({
  appointments,
  patients,
  onStartConsultation,
  onOpenPatientProfile,
  onUpdateStatus,
}: TodayAppointmentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Today's Appointment Timeline
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage patient consultations, check-in queue, and start active sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patient or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 min-w-[140px] text-xs rounded-xl">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Waiting">Waiting</SelectItem>
                <SelectItem value="Checked In">Checked In</SelectItem>
                <SelectItem value="In Consultation">In Consultation</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Appointment Timeline List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((apt) => {
            const statusConfig = statusStylesMap(apt.status);
            const StatusIcon = statusConfig.icon;
            const patientObj = patients.find((p) => p.id === apt.patientId);

            return (
              <div
                key={apt.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Time & Patient info */}
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-primary/10 text-primary min-w-[80px]">
                      <Clock className="h-4 w-4 mb-1" />
                      <span className="text-xs font-bold font-mono">{apt.appointmentTime}</span>
                      <span className="text-[10px] opacity-80 uppercase">{apt.appointmentType}</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          onClick={() => patientObj && onOpenPatientProfile(patientObj)}
                          className="font-bold text-base hover:text-primary cursor-pointer transition-colors"
                        >
                          {apt.patientName}
                        </h3>
                        <Badge variant="outline" className="text-[10px] font-semibold">
                          {apt.patientGender}, {apt.patientAge}y
                        </Badge>
                        <Badge className="bg-red-500/90 text-white text-[10px]">
                          Blood: {apt.patientBloodGroup}
                        </Badge>

                        {/* Status Badge */}
                        <div
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}
                        >
                          <StatusIcon className="h-3 w-3" />
                          <span>{apt.status}</span>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-1">
                        <span className="font-semibold text-foreground">Department:</span> {apt.department} |{" "}
                        <span className="font-semibold text-foreground">Reason:</span> {apt.reason}
                      </p>

                      {apt.vitalSigns && (
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground flex-wrap">
                          <span>
                            BP: <strong className="text-foreground">{apt.vitalSigns.bp}</strong>
                          </span>
                          <span>
                            Pulse: <strong className="text-teal">{apt.vitalSigns.pulse}</strong>
                          </span>
                          <span>
                            SpO2: <strong className="text-emerald-500">{apt.vitalSigns.spo2}</strong>
                          </span>
                          <span>
                            Temp: <strong className="text-foreground">{apt.vitalSigns.temp}</strong>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions: Start Consultation & Quick Status Update */}
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-xs font-semibold"
                      onClick={() => patientObj && onOpenPatientProfile(patientObj)}
                    >
                      Patient Profile
                    </Button>

                    <Select
                      value={apt.status}
                      onValueChange={(val) =>
                        onUpdateStatus(apt.id, val as AppointmentStatus)
                      }
                    >
                      <SelectTrigger className="h-9 text-xs rounded-xl w-[130px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Waiting">Waiting</SelectItem>
                        <SelectItem value="Checked In">Checked In</SelectItem>
                        <SelectItem value="In Consultation">In Consultation</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => onStartConsultation(apt)}
                      className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:opacity-90"
                    >
                      <Play className="mr-1.5 h-3.5 w-3.5 fill-current" /> Start Consultation
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-card border border-border rounded-2xl">
            <Calendar className="mx-auto h-10 w-10 text-muted-foreground/40 mb-2" />
            <p className="text-sm font-semibold">No appointments found</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Try adjusting your search query or status filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function statusStylesMap(status: AppointmentStatus) {
  return statusBadgeStyles[status] || statusBadgeStyles.Waiting;
}
