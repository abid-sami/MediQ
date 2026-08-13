import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Stethoscope,
  Users,
  Clock,
  UserCheck,
  Building2,
  ArrowRight,
} from "lucide-react";
import { DoctorQueueItem } from "@/data/receptionist-data";

interface DoctorQueueModuleProps {
  queues: DoctorQueueItem[];
}

export function DoctorQueueModule({ queues }: DoctorQueueModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" /> Live Doctor Consultation Queue
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time doctor availability, current patient in consultation, and next patient in waiting queue.
          </p>
        </div>
      </div>

      {/* Doctor Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {queues.map((dq) => (
          <div
            key={dq.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                  {dq.roomNo}
                </Badge>
                <Badge
                  className={
                    dq.status === "In Consultation"
                      ? "bg-teal/20 text-teal font-bold"
                      : dq.status === "Available"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  }
                >
                  {dq.status}
                </Badge>
              </div>

              <h3 className="font-bold text-lg text-foreground">{dq.doctorName}</h3>
              <p className="text-xs text-muted-foreground">{dq.department}</p>

              {/* Current Patient Box */}
              <div className="mt-4 p-3 rounded-xl bg-muted/30 border border-border space-y-1 text-xs">
                <span className="text-[10px] text-muted-foreground block uppercase font-bold">
                  Current Patient in Consultation
                </span>
                <span className="font-bold text-foreground text-sm block">
                  {dq.currentPatient || "No Active Patient"}
                </span>
              </div>
            </div>

            {/* Next Patient & Waiting Count */}
            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">NEXT PATIENT</span>
                <span className="font-bold text-primary">{dq.nextPatient || "None"}</span>
              </div>
              <Badge className="bg-primary/20 text-primary font-bold text-xs">
                {dq.waitingCount} Waiting
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
