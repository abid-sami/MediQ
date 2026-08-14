import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Siren, Clock } from "lucide-react";
import { fetchSupabaseSOS } from "@/services/supabase-service";

export function EmergencyArrivalsModule() {
  const [emergencies, setEmergencies] = useState<any[]>([]);

  useEffect(() => {
    fetchSupabaseSOS().then((data) => {
      setEmergencies(
        data.map((s: any) => ({
          id: s.id,
          requestId: s.requestId || s.request_id || s.id,
          patientName: s.patientName || s.patient_name || "Unknown",
          type: s.emergencyType || s.emergency_type || "Emergency",
          eta: s.eta || "N/A",
          ambulanceUnit: s.assignedDriver || s.assigned_driver || "Unassigned",
          status: s.ambulanceStatus || s.ambulance_status || "Pending",
        }))
      );
    });
  }, []);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-destructive">
            <Siren className="h-6 w-6 animate-pulse" /> Emergency Arrivals & ER Triage Feed
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time ambulance dispatch arrivals and front-desk trauma notifications.
          </p>
        </div>
      </div>

      {emergencies.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
          No active emergency arrivals.
        </div>
      ) : (
        <div className="space-y-4">
          {emergencies.map((emg) => (
            <div
              key={emg.id}
              className="bg-card border-2 border-red-500/40 rounded-2xl p-5 shadow-lift space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  <Badge className="bg-red-500 text-white font-bold text-xs uppercase">
                    {emg.requestId}
                  </Badge>
                </div>
                <Badge variant="outline" className="font-mono text-xs font-bold text-destructive">
                  {emg.ambulanceUnit}
                </Badge>
              </div>

              <h3 className="text-lg font-black text-foreground">{emg.type}</h3>
              <p className="text-sm font-bold text-muted-foreground">
                Patient: <strong className="text-foreground">{emg.patientName}</strong>
              </p>

              <div className="pt-2 border-t border-border flex items-center justify-between text-xs font-bold text-destructive">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" /> {emg.eta}
                </span>
                <span>{emg.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
