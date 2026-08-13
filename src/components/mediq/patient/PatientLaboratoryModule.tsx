import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Microscope,
  Search,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Printer,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { PatientLabTest } from "@/data/patient-data";

interface PatientLaboratoryModuleProps {
  labTests: PatientLabTest[];
}

export function PatientLaboratoryModule({ labTests }: PatientLaboratoryModuleProps) {
  const [selectedReport, setSelectedReport] = useState<PatientLabTest | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="h-6 w-6 text-teal" /> Laboratory Reports & Diagnostics
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track test requisitions, view processing status, and open verified lab reports.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {labTests.map((lab) => (
          <div
            key={lab.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-teal/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] font-mono font-bold text-teal">
                  {lab.requisitionNo}
                </Badge>
                <Badge
                  className={
                    lab.status === "Completed"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  }
                >
                  {lab.status}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{lab.testName}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Facility: <span className="text-foreground">{lab.facility}</span> | Category: {lab.category}
              </p>

              {lab.resultSummary && (
                <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                  <p className="text-foreground font-medium">{lab.resultSummary}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
              <span className="text-muted-foreground">Booked: {lab.bookedDate}</span>

              {lab.status === "Completed" && (
                <Button
                  size="sm"
                  onClick={() => setSelectedReport(lab)}
                  className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
                >
                  Open Report <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
          <DialogContent className="max-w-2xl p-6 bg-card border-border rounded-2xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <Badge variant="outline" className="font-mono text-xs text-teal">
                    {selectedReport.requisitionNo}
                  </Badge>
                  <h3 className="text-lg font-bold mt-1">{selectedReport.testName}</h3>
                  <p className="text-xs text-muted-foreground">{selectedReport.facility}</p>
                </div>

                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="rounded-xl text-xs font-semibold"
                >
                  <Printer className="mr-1.5 h-4 w-4 text-primary" /> Print Report
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2 text-xs">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Diagnostic Result Summary
                </h4>
                <p className="text-sm font-semibold text-foreground">{selectedReport.resultSummary}</p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border text-xs space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Technician Sign-off & Interpretation
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  All biochemical and cardiovascular markers show optimal physiological range. Result verified by MediQ Central Laboratory Pathology Board.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
