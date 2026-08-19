import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Pill,
  Printer,
  Download,
  Calendar,
  Stethoscope,
  QrCode,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PatientPrescription } from "@/data/patient-data";

interface PatientPrescriptionsModuleProps {
  prescriptions: PatientPrescription[];
  patientName: string;
}

export function PatientPrescriptionsModule({
  prescriptions,
  patientName,
}: PatientPrescriptionsModuleProps) {
  const [selectedRx, setSelectedRx] = useState<PatientPrescription | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal" /> Digital Prescriptions & Medications
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access your active e-prescriptions, dosage schedules, doctor advice, and download copies.
          </p>
        </div>
      </div>

      {/* List */}
      {prescriptions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <Pill className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-bold text-foreground">No verified prescriptions available</p>
          <p className="max-w-sm text-xs text-muted-foreground">Digital prescriptions issued by your MediQ care team will appear here once they are published to your account.</p>
        </div>
      ) : (
      <div className="space-y-4">
        {prescriptions.map((rx) => (
          <div
            key={rx.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-teal/40 transition-all shadow-xs space-y-4"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold text-teal">
                    {rx.rxNo}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground">{rx.diagnosis}</h3>
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    Verified e-Rx
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Prescribed by <strong className="text-foreground">{rx.doctorName}</strong> (
                  {rx.doctorSpecialization})
                </p>

                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
                  <span>Issued Date: {rx.date}</span>
                  <span>•</span>
                  <span className="text-teal font-bold">Follow-up: {rx.followUpDate}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 justify-end">
                <Button
                  size="sm"
                  onClick={() => setSelectedRx(rx)}
                  className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
                >
                  <FileText className="mr-1.5 h-3.5 w-3.5" /> View & Print Prescription
                </Button>
              </div>
            </div>

            {/* Medicines Breakdown Table */}
            <div className="border border-border/80 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                    <th className="p-3">Medicine & Strength</th>
                    <th className="p-3">Dosage</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Instructions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rx.medicines.map((m, idx) => (
                    <tr key={idx} className="hover:bg-muted/20">
                      <td className="p-3 font-bold text-foreground">
                        {m.name} <span className="text-muted-foreground font-normal">({m.strength})</span>
                      </td>
                      <td className="p-3 font-mono font-bold text-primary">{m.dosage}</td>
                      <td className="p-3">{m.frequency}</td>
                      <td className="p-3 font-medium">{m.duration}</td>
                      <td className="p-3 text-muted-foreground">{m.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
              <p className="font-semibold text-amber-900 dark:text-amber-300">
                Doctor Advice: <span className="font-normal">{rx.advice}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Printable Preview Dialog */}
      {selectedRx && (
        <Dialog open={!!selectedRx} onOpenChange={() => setSelectedRx(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-white text-slate-900 rounded-2xl">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                      Q
                    </span>
                    <h1 className="text-xl font-bold text-slate-900">MediQ Healthcare Network</h1>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">Official Digital Prescription Document</p>
                </div>

                <div className="text-right">
                  <h2 className="text-base font-bold text-teal-700">{selectedRx.doctorName}</h2>
                  <p className="text-xs font-semibold text-slate-700">{selectedRx.doctorSpecialization}</p>
                </div>
              </div>

              {/* Patient info */}
              <div className="bg-slate-100 p-3 rounded-lg grid grid-cols-3 gap-2 text-xs border border-slate-200">
                <div>
                  <span className="text-slate-500 block text-[10px]">PATIENT</span>
                  <span className="font-bold text-slate-900">{patientName}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">PRESCRIPTION NO</span>
                  <span className="font-mono font-bold text-teal-700">{selectedRx.rxNo}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">DATE</span>
                  <span className="font-semibold">{selectedRx.date}</span>
                </div>
              </div>

              {/* Rx section */}
              <div className="pt-2">
                <span className="text-3xl font-bold font-serif text-teal-700">Rx</span>
                <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                        <th className="p-2.5">Medicine</th>
                        <th className="p-2.5">Dosage</th>
                        <th className="p-2.5">Frequency</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5">Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {selectedRx.medicines.map((m, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-bold text-slate-900">{m.name} ({m.strength})</td>
                          <td className="p-2.5 font-mono font-bold">{m.dosage}</td>
                          <td className="p-2.5">{m.frequency}</td>
                          <td className="p-2.5">{m.duration}</td>
                          <td className="p-2.5 text-slate-600">{m.instructions}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 text-xs">
                <span className="font-bold text-teal-900 block">Doctor Advice:</span>
                <p className="text-teal-800 mt-0.5">{selectedRx.advice}</p>
              </div>

              <div className="border-t border-slate-200 pt-6 flex items-end justify-between">
                <div className="flex items-center gap-3">
                  <QrCode className="h-10 w-10 text-slate-800" />
                  <div className="text-[10px] text-slate-500">
                    <p className="font-semibold text-slate-700">Verified MediQ Signature</p>
                    <p>AUTH-{selectedRx.rxNo}</p>
                  </div>
                </div>

                <Button
                  onClick={() => window.print()}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                >
                  <Printer className="mr-1.5 h-4 w-4" /> Print / Save PDF
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
