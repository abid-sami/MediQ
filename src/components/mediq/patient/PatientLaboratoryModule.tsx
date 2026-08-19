import React, { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PatientLabTest } from "@/data/patient-data";
import { createSupabaseLabOrder } from "@/services/supabase-service";

interface PatientLaboratoryModuleProps {
  labTests: PatientLabTest[];
  onAddLabTest?: (newTest: PatientLabTest) => void;
  patientName: string;
  patientAge: number;
}

export function PatientLaboratoryModule({ labTests, onAddLabTest, patientName, patientAge }: PatientLaboratoryModuleProps) {
  const [selectedReport, setSelectedReport] = useState<PatientLabTest | null>(null);

  // Request Lab Test Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [testName, setTestName] = useState("");
  const [category, setCategory] = useState("Blood Tests");

  const handleCreateLabRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName.trim() || !patientName.trim()) {
      toast.error("Your patient profile is still loading. Please try again shortly.");
      return;
    }

    const requisitionNo = `LAB-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const { error } = await createSupabaseLabOrder({
      testId: requisitionNo,
      patientName,
      patientAge,
      doctorName: "",
      testName,
      category,
      priority: "Routine",
    });
    if (error) {
      toast.error("Could not submit the laboratory request. Please try again.");
      return;
    }

    const newLab: PatientLabTest = {
      id: requisitionNo,
      testName,
      category,
      bookedDate: new Date().toISOString().split("T")[0],
      facility: "",
      status: "Booked",
      requisitionNo,
    };

    if (onAddLabTest) {
      onAddLabTest(newLab);
    }

    setTestName("");
    setModalOpen(false);
    toast.success(`Laboratory request ${newLab.requisitionNo} submitted successfully.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="h-6 w-6 text-teal" /> Laboratory Reports & Diagnostics ({labTests.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track test requisitions, view processing status, and open verified lab reports.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Request Lab Test
        </Button>
      </div>

      {/* Grid */}
      {labTests.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <Microscope className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-bold text-foreground">No laboratory records available</p>
          <p className="max-w-sm text-xs text-muted-foreground">New requests and published laboratory results linked to your MediQ profile will appear here.</p>
        </div>
      ) : (
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
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
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
      )}

      {/* Request Lab Test Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Microscope className="h-5 w-5 text-teal" /> Request New Laboratory Test
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateLabRequest} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Test Name *</Label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                required
                placeholder="e.g. Complete Blood Count (CBC)"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Test Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Blood Tests">Blood Tests</SelectItem>
                  <SelectItem value="Biochemistry">Biochemistry</SelectItem>
                  <SelectItem value="Pathology">Pathology</SelectItem>
                  <SelectItem value="ECG & Cardiac">ECG & Cardiac</SelectItem>
                  <SelectItem value="Urinalysis">Urinalysis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Submit Test Request
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Report View Modal */}
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
                  Interpretation and sign-off details are published by the laboratory team with the completed report.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
