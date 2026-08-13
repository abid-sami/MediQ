import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Clock,
  User,
  TestTube,
  CheckCircle2,
  Cpu,
} from "lucide-react";
import { LabProcessingItem } from "@/data/lab-staff-data";

interface LabProcessingModuleProps {
  processingItems: LabProcessingItem[];
}

export function LabProcessingModule({
  processingItems,
}: LabProcessingModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-primary animate-pulse" /> Active Analyzer & Specimen Processing
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time automated analyzer runs, centrifuging, and specimen incubation.
          </p>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {processingItems.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-primary/30 rounded-2xl p-5 hover:border-primary transition-all shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                  Sample: {item.sampleId}
                </Badge>
                <Badge className="bg-teal/20 text-teal font-bold text-xs">
                  {item.status}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{item.testName}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Patient: <strong className="text-foreground">{item.patientName}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Technician: <strong className="text-foreground">{item.technicianName}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> Started: {item.startedTime}
              </span>
              <span className="flex items-center gap-1 text-primary font-bold">
                ETA: {item.expectedCompletion}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
