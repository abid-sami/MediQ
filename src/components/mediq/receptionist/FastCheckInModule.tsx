import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle2,
  Clock,
  UserCheck,
  Calendar,
  Stethoscope,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { ReceptionAppointment } from "@/data/receptionist-data";

interface FastCheckInModuleProps {
  appointments: ReceptionAppointment[];
  onConfirmCheckIn: (appointmentId: string) => void;
}

export function FastCheckInModule({
  appointments,
  onConfirmCheckIn,
}: FastCheckInModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const todayPendingAppointments = appointments.filter(
    (a) => a.status === "Confirmed" || a.status === "Requested"
  );

  const checkedInAppointments = appointments.filter((a) => a.status === "Checked In");

  const filteredPending = todayPendingAppointments.filter((a) => {
    const matchesSearch =
      a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.patientPhone.includes(searchTerm) ||
      a.appointmentId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <UserCheck className="h-6 w-6 text-teal" /> Fast Front-Desk Patient Check-In
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search patient appointment → Confirm check-in → Status updates to <strong>Checked In</strong>.
          </p>
        </div>

        <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5 border border-emerald-500/30">
          Checked In Today: {checkedInAppointments.length}
        </Badge>
      </div>

      {/* Fast Search */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Fast search patient name, appointment ID (e.g. APT-2026-702), or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-11 text-sm font-semibold rounded-xl"
          />
        </div>
      </div>

      {/* Pending Check-In List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Pending Front-Desk Check-Ins ({filteredPending.length})
        </h3>

        <div className="space-y-3">
          {filteredPending.map((apt) => (
            <div
              key={apt.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-teal/40 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                    {apt.appointmentId}
                  </Badge>
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                    {apt.status}
                  </Badge>
                </div>

                <h4 className="text-base font-bold text-foreground">{apt.patientName}</h4>
                <p className="text-muted-foreground">
                  Doctor: <strong className="text-foreground">{apt.doctorName}</strong> ({apt.department})
                </p>
                <p className="text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-amber-500" /> Scheduled Time: <strong className="text-foreground">{apt.time}</strong>
                </p>
              </div>

              <Button
                onClick={() => {
                  onConfirmCheckIn(apt.id);
                  toast.success(`Checked In ${apt.patientName}`, {
                    description: `Assigned to ${apt.doctorName} consultation queue.`,
                  });
                }}
                className="gradient-primary text-primary-foreground font-bold text-sm rounded-xl py-6 px-6 shadow-md shrink-0"
              >
                <CheckCircle2 className="mr-2 h-5 w-5" /> CONFIRM CHECK-IN
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Already Checked-In Section */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          ✓ Currently Checked In & Waiting for Doctor ({checkedInAppointments.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {checkedInAppointments.map((apt) => (
            <div key={apt.id} className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-foreground block">{apt.patientName}</span>
                <span className="text-[11px] text-muted-foreground">{apt.doctorName} ({apt.department})</span>
              </div>
              <Badge className="bg-emerald-500 text-white font-bold text-[10px]">
                Checked In
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
