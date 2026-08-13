import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock,
  Activity,
  Pill,
  Stethoscope,
  PhoneCall,
  ShieldAlert,
} from "lucide-react";
import { toast } from "sonner";
import { NurseAlert } from "@/data/nurse-data";

interface NurseAlertsModuleProps {
  alerts: NurseAlert[];
  onResolveAlert: (id: string) => void;
}

export function NurseAlertsModule({
  alerts,
  onResolveAlert,
}: NurseAlertsModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-6 w-6 animate-pulse" /> Critical Ward Patient Alerts
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            High-priority bedside alerts: Critical vitals, medication due, doctor requests, and patient call pendants.
          </p>
        </div>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {alerts.map((al) => (
          <div
            key={al.id}
            className={`p-5 rounded-2xl border transition-all shadow-xs space-y-3 ${
              al.resolved
                ? "bg-card border-border opacity-70"
                : al.severity === "Critical"
                ? "bg-red-500/10 border-red-500/40 ring-1 ring-red-500/30"
                : al.severity === "High"
                ? "bg-amber-500/10 border-amber-500/40"
                : "bg-card border-border"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  className={
                    al.severity === "Critical"
                      ? "bg-red-500 text-white font-bold animate-pulse"
                      : al.severity === "High"
                      ? "bg-amber-500 text-white font-bold"
                      : "bg-blue-500 text-white"
                  }
                >
                  {al.severity} Severity
                </Badge>

                <Badge variant="outline" className="text-xs font-bold font-mono">
                  {al.alertType}
                </Badge>

                <Badge className="bg-primary/20 text-primary font-bold">
                  {al.bedNo}
                </Badge>
              </div>

              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> {al.timestamp}
              </span>
            </div>

            <div>
              <h3 className="font-bold text-base text-foreground">{al.patientName}</h3>
              <p className="text-xs text-foreground font-medium mt-1 leading-relaxed">
                {al.message}
              </p>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-border/60">
              {!al.resolved ? (
                <Button
                  size="sm"
                  onClick={() => {
                    onResolveAlert(al.id);
                    toast.success(`Resolved alert for ${al.patientName}`);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl"
                >
                  <CheckCircle2 className="mr-1.5 h-4 w-4" /> Mark Alert Resolved
                </Button>
              ) : (
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                  ✓ Resolved
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
