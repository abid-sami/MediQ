import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { ReceptionAppointment, AppointmentStatus } from "@/data/receptionist-data";
import { fetchSupabaseProfiles } from "@/services/supabase-service";

interface ReceptionistAppointmentsModuleProps {
  appointments: ReceptionAppointment[];
  onUpdateStatus: (id: string, newStatus: AppointmentStatus) => void;
  onNewAppointment: (apt: ReceptionAppointment) => void;
}

export function ReceptionistAppointmentsModule({
  appointments,
  onUpdateStatus,
  onNewAppointment,
}: ReceptionistAppointmentsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Create form state
  const [patientName, setPatientName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [doctors, setDoctors] = useState<Array<{ id: string; name: string; specialty?: string }>>([]);

  useEffect(() => {
    void fetchSupabaseProfiles("Doctor").then((profiles) => {
      setDoctors(profiles.map((doctor: any) => ({ id: doctor.id, name: doctor.name || "", specialty: doctor.specialty || "" })).filter((doctor) => doctor.name));
    });
  }, []);

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !doctorName || !date || !time) {
      toast.error("Please complete the patient, doctor, date, and time fields.");
      return;
    }

    const newApt: ReceptionAppointment = {
      id: `apt-${Date.now()}`,
      appointmentId: `APT-2026-${Math.floor(700 + Math.random() * 200)}`,
      patientId: `PAT-2026-${Math.floor(9000 + Math.random() * 999)}`,
      patientName,
      patientPhone: "",
      doctorName,
      department,
      date,
      time,
      status: "Confirmed",
    };

    onNewAppointment(newApt);
    setPatientName("");
    toast.success(`Created Appointment ${newApt.appointmentId} for ${newApt.patientName}`);
  };

  const filtered = appointments.filter(
    (a) =>
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.appointmentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Master Front-Desk Appointment Management
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Book appointments, confirm requests, reschedule, cancel, and check doctor availability.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateAppointment} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
              <Plus className="h-4 w-4 text-primary" /> Create Front-Desk Appointment
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Patient Full Name</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} required placeholder="e.g. Nusrat Jahan" className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Doctor Name</Label>
                <Select value={doctorName} onValueChange={(value) => {
                  setDoctorName(value);
                  setDepartment(doctors.find((doctor) => doctor.name === value)?.specialty || "");
                }}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {doctors.length > 0 ? doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={doctor.name}>{doctor.name}{doctor.specialty ? ` (${doctor.specialty})` : ""}</SelectItem>
                    )) : <p className="px-2 py-1.5 text-xs text-muted-foreground">No doctors available</p>}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Time Slot</Label>
                  <Input value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              Confirm & Schedule Appointment
            </Button>
          </form>
        </div>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient or appointment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">ID & Time</th>
                  <th className="p-3.5">Patient Name</th>
                  <th className="p-3.5">Doctor</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-primary">{apt.appointmentId}</p>
                      <p className="text-[11px] text-muted-foreground">{apt.time}</p>
                    </td>
                    <td className="p-3.5 font-bold text-foreground">{apt.patientName}</td>
                    <td className="p-3.5">{apt.doctorName}</td>
                    <td className="p-3.5">
                      <Badge className="bg-primary/20 text-primary font-bold text-[10px]">{apt.status}</Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      <Select
                        value={apt.status}
                        onValueChange={(val) => {
                          onUpdateStatus(apt.id, val as AppointmentStatus);
                          toast.success(`Updated ${apt.appointmentId} to ${val}`);
                        }}
                      >
                        <SelectTrigger className="h-8 text-[11px] rounded-lg w-36 font-bold">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Checked In">Checked In</SelectItem>
                          <SelectItem value="In Consultation">In Consultation</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
