import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Calendar, Search } from "lucide-react";
import { fetchSupabaseAppointments } from "@/services/supabase-service";

export function AppointmentsMonitoringModule() {
  const [searchTerm, setSearchTerm] = useState("");
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() => {
    fetchSupabaseAppointments().then((data) => setAppointments(data));
  }, []);

  const filtered = appointments.filter(
    (a) =>
      (a.patientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.appointmentId || a.id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.doctorName || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" /> Global Ecosystem Appointment Roster
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time patient consultation bookings across all connected MediQ hospitals.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-card border border-border p-4 rounded-xl shadow-xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, doctor, or appointment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
              <th className="p-3.5">ID & Time</th>
              <th className="p-3.5">Patient Name</th>
              <th className="p-3.5">Doctor & Dept</th>
              <th className="p-3.5">Hospital Center</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                  No appointments found.
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-3.5">
                  <p className="font-mono font-bold text-primary">{a.appointmentId || a.id}</p>
                  <p className="text-[11px] text-muted-foreground">{a.appointmentTime || a.time}</p>
                </td>
                <td className="p-3.5 font-bold text-foreground">{a.patientName}</td>
                <td className="p-3.5">
                  <p className="font-semibold text-foreground">{a.doctorName}</p>
                  <p className="text-[11px] text-muted-foreground">{a.department}</p>
                </td>
                <td className="p-3.5 text-muted-foreground">{a.hospital || "MediQ Central"}</td>
                <td className="p-3.5 text-right">
                  <Badge className="bg-primary/20 text-primary font-bold text-[10px]">
                    {a.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
