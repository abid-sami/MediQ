import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Plus,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import { Appointment, AppointmentStatus, AppointmentType, Patient } from "@/data/doctor-data";

interface TodayAppointmentsProps {
  appointments: Appointment[];
  patients: Patient[];
  onStartConsultation: (appointment: Appointment) => void;
  onOpenPatientProfile: (patient: Patient) => void;
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onAddAppointment?: (newApt: Appointment) => void;
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
  onAddAppointment,
}: TodayAppointmentsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Create Appointment Modal state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientAge, setPatientAge] = useState("45");
  const [patientGender, setPatientGender] = useState<"Male" | "Female" | "Other">("Male");
  const [patientBloodGroup, setPatientBloodGroup] = useState("O+");
  const [appointmentTime, setAppointmentTime] = useState("11:30 AM");
  const [appointmentType, setAppointmentType] = useState<AppointmentType>("In-Person");
  const [reason, setReason] = useState("");

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error("Please enter Patient Name");
      return;
    }

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      patientId: `pat-${Date.now()}`,
      patientName,
      patientAge: Number(patientAge) || 40,
      patientGender,
      patientBloodGroup,
      appointmentTime,
      department: "Cardiology",
      appointmentType,
      status: "Waiting",
      reason: reason || "Routine Cardiology Consultation",
      vitalSigns: {
        bp: "120/80 mmHg",
        pulse: "75 bpm",
        temp: "98.6 °F",
        spo2: "99%",
        weight: "70 kg",
      },
    };

    if (onAddAppointment) {
      onAddAppointment(newApt);
    }

    setPatientName("");
    setReason("");
    setCreateModalOpen(false);
    toast.success(`Scheduled Appointment for ${newApt.patientName} (${formattedTime()})`);
  };

  const formattedTime = () => appointmentTime;

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
            <Calendar className="h-6 w-6 text-primary" /> Today's Appointment Timeline ({appointments.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage patient consultations, check-in queue, and start active sessions.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative min-w-[200px]">
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
              <SelectTrigger className="h-9 min-w-[130px] text-xs rounded-xl">
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

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md h-9"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Walk-in Appointment
          </Button>
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

      {/* Add Walk-in Appointment Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Add Walk-in Patient Appointment
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateAppointment} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Patient Full Name *</Label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="e.g. Khabir Ahmed"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Age</Label>
                <Input
                  type="number"
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Gender</Label>
                <Select value={patientGender} onValueChange={(v) => setPatientGender(v as any)}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
                <Select value={patientBloodGroup} onValueChange={setPatientBloodGroup}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Blood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Appointment Time</Label>
                <Input
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  placeholder="e.g. 11:30 AM"
                  className="mt-1 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Appointment Type</Label>
                <Select value={appointmentType} onValueChange={(v) => setAppointmentType(v as AppointmentType)}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="In-Person">In-Person</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                    <SelectItem value="Teleconsult">Teleconsult</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Reason / Symptoms</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Chest pain evaluation"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Add Walk-in Patient
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function statusStylesMap(status: AppointmentStatus) {
  return statusBadgeStyles[status] || statusBadgeStyles.Waiting;
}
