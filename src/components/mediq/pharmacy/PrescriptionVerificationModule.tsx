import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  FileText,
  User,
  Stethoscope,
  Calendar,
  AlertTriangle,
  QrCode,
} from "lucide-react";
import { toast } from "sonner";
import { PrescriptionToVerify } from "@/data/pharmacy-data";

interface PrescriptionVerificationModuleProps {
  prescriptions: PrescriptionToVerify[];
  onVerify: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onRequestClarification: (id: string, notes: string) => void;
}

export function PrescriptionVerificationModule({
  prescriptions,
  onVerify,
  onReject,
  onRequestClarification,
}: PrescriptionVerificationModuleProps) {
  const [selectedRx, setSelectedRx] = useState<PrescriptionToVerify | null>(null);
  const [rejectReason, setRejectReason] = useState("Invalid dosage frequency specified.");
  const [clarificationNotes, setClarificationNotes] = useState("Please confirm Digoxin daily dose frequency with prescribing cardiologist.");

  const [rejectOpen, setRejectOpen] = useState(false);
  const [clarifyOpen, setClarifyOpen] = useState(false);

  const pendingCount = prescriptions.filter((p) => p.verificationStatus === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-teal" /> E-Prescription Verification Station
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review digital prescriptions issued by doctors, verify drug dosages, and validate before dispensing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 border border-amber-500/30">
            Pending Verification: {pendingCount}
          </Badge>
        </div>
      </div>

      {/* Grid of Prescriptions to Verify */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className={`bg-card border rounded-2xl p-5 hover:border-teal/40 transition-all shadow-xs space-y-4 flex flex-col justify-between ${
              rx.verificationStatus === "Pending"
                ? "border-amber-500/40 ring-1 ring-amber-500/20"
                : "border-border"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                  {rx.prescriptionId}
                </Badge>
                <Badge
                  className={
                    rx.verificationStatus === "Verified"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : rx.verificationStatus === "Rejected"
                      ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                      : rx.verificationStatus === "Clarification Requested"
                      ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  }
                >
                  {rx.verificationStatus}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{rx.diagnosis}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Patient: <strong className="text-foreground">{rx.patientName}</strong> ({rx.patientAge}y)
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Prescriber: <strong className="text-foreground">{rx.doctorName}</strong> (
                {rx.doctorSpecialization})
              </p>

              {/* Medicines Table */}
              <div className="mt-3 border border-border/80 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                      <th className="p-2.5">Medicine</th>
                      <th className="p-2.5">Strength</th>
                      <th className="p-2.5">Dosage</th>
                      <th className="p-2.5">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rx.medicines.map((m, idx) => (
                      <tr key={idx} className="hover:bg-muted/20">
                        <td className="p-2.5 font-bold text-foreground">{m.name}</td>
                        <td className="p-2.5">{m.strength}</td>
                        <td className="p-2.5 font-mono font-bold text-teal">{m.dosage}</td>
                        <td className="p-2.5 text-muted-foreground">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {rx.notes && (
                <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-2">
                  Notes: {rx.notes}
                </p>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
                onClick={() => {
                  setSelectedRx(rx);
                  setRejectOpen(true);
                }}
              >
                <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-semibold text-purple-600 dark:text-purple-400 border-purple-500/30 hover:bg-purple-500/10"
                onClick={() => {
                  setSelectedRx(rx);
                  setClarifyOpen(true);
                }}
              >
                <HelpCircle className="mr-1 h-3.5 w-3.5" /> Clarify
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  onVerify(rx.id);
                  toast.success(`Verified Prescription ${rx.prescriptionId}`, {
                    description: `Dispensing clearance granted for ${rx.patientName}`,
                  });
                }}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
              >
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Verify Prescription
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Reject Modal */}
      {selectedRx && (
        <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-destructive flex items-center gap-2">
                <XCircle className="h-5 w-5" /> Reject Prescription
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <p className="text-xs text-muted-foreground">
                Specify rejection rationale for Prescription <strong>{selectedRx.prescriptionId}</strong>:
              </p>

              <Textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="rounded-xl text-xs"
              />

              <Button
                onClick={() => {
                  onReject(selectedRx.id, rejectReason);
                  setRejectOpen(false);
                  toast.error(`Rejected Prescription ${selectedRx.prescriptionId}`);
                }}
                className="w-full bg-destructive text-destructive-foreground font-bold rounded-xl py-5 shadow-md"
              >
                Confirm Rejection
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Clarification Modal */}
      {selectedRx && (
        <Dialog open={clarifyOpen} onOpenChange={setClarifyOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-purple-600 flex items-center gap-2">
                <HelpCircle className="h-5 w-5" /> Request Doctor Clarification
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <p className="text-xs text-muted-foreground">
                Send clinical inquiry to <strong>{selectedRx.doctorName}</strong> regarding Prescription <strong>{selectedRx.prescriptionId}</strong>:
              </p>

              <Textarea
                rows={3}
                value={clarificationNotes}
                onChange={(e) => setClarificationNotes(e.target.value)}
                className="rounded-xl text-xs"
              />

              <Button
                onClick={() => {
                  onRequestClarification(selectedRx.id, clarificationNotes);
                  setClarifyOpen(false);
                  toast.info(`Clarification Request Sent to ${selectedRx.doctorName}`);
                }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl py-5 shadow-md"
              >
                Send Clarification Request
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
