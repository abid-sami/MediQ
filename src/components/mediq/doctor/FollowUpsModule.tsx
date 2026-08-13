import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Phone,
  CheckCircle2,
  BellRing,
  RotateCcw,
  User,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { FollowUpItem, FollowUpStatus, Patient } from "@/data/doctor-data";

interface FollowUpsModuleProps {
  followUps: FollowUpItem[];
  patients: Patient[];
  onOpenPatientProfile: (patient: Patient) => void;
  onUpdateStatus: (id: string, newStatus: FollowUpStatus) => void;
}

export function FollowUpsModule({
  followUps,
  patients,
  onOpenPatientProfile,
  onUpdateStatus,
}: FollowUpsModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-emerald-500" /> Patient Follow-up Tracker
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor upcoming scheduled return visits, send reminders, and track follow-up compliance.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {followUps.map((fup) => {
          const patientObj = patients.find((p) => p.id === fup.patientId);
          return (
            <div
              key={fup.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-emerald-500/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3
                    onClick={() => patientObj && onOpenPatientProfile(patientObj)}
                    className="font-bold text-base hover:text-primary cursor-pointer transition-colors"
                  >
                    {fup.patientName}
                  </h3>
                  <Badge
                    className={
                      fup.status === "Completed"
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : fup.status === "Reminded"
                        ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                        : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                    }
                  >
                    {fup.status}
                  </Badge>
                </div>

                <div className="text-xs space-y-1 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Previous Diagnosis:</strong>{" "}
                    {fup.previousDiagnosis}
                  </p>
                  <p>
                    <strong className="text-foreground">Previous Visit:</strong> {fup.previousVisit}
                  </p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold text-sm pt-1">
                    Follow-up Date: {fup.followUpDate}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                  <p className="text-muted-foreground font-medium">{fup.notes}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => {
                    onUpdateStatus(fup.id, "Reminded");
                    toast.success(`Follow-up SMS Reminder sent to ${fup.patientName}`);
                  }}
                >
                  <BellRing className="mr-1.5 h-3.5 w-3.5 text-blue-500" /> Remind
                </Button>

                <Button
                  size="sm"
                  className="rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => {
                    onUpdateStatus(fup.id, "Completed");
                    toast.success(`Marked follow-up for ${fup.patientName} as completed`);
                  }}
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark Completed
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
