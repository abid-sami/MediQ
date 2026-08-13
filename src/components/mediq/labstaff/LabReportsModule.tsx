import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  CheckCircle2,
  Stethoscope,
  Microscope,
  Calendar,
  Building2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { LabResultParameter, LabTestOrder } from "@/data/lab-staff-data";

interface LabReportsModuleProps {
  orders: LabTestOrder[];
  parameters: LabResultParameter[];
}

export function LabReportsModule({
  orders,
  parameters,
}: LabReportsModuleProps) {
  const readyOrder = orders.find((o) => o.status === "Report Ready" || o.status === "Completed") || orders[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Printer className="h-6 w-6 text-primary" /> Official Clinical Diagnostic Laboratory Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified electronic pathology reports signed by senior clinical pathologists.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => window.print()}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
          >
            <Printer className="mr-1.5 h-4 w-4" /> Print Diagnostic Report
          </Button>
        </div>
      </div>

      {/* Official Printable Report Letterhead Box */}
      {readyOrder && (
        <div className="bg-card border-2 border-border p-8 rounded-3xl space-y-6 shadow-lift max-w-4xl mx-auto print:border-none print:shadow-none">
          {/* Letterhead Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl gradient-primary text-primary-foreground font-extrabold flex items-center justify-center text-xl shadow-md">
                Q
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">MediQ Central Diagnostics & Pathology</h1>
                <p className="text-xs text-muted-foreground">
                  ISO 15189 Accredited Clinical Reference Laboratory • Central Hospital Campus
                </p>
              </div>
            </div>

            <div className="text-right">
              <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                REPORT ID: {readyOrder.testId}
              </Badge>
              <p className="text-[11px] text-muted-foreground mt-1">Date: {readyOrder.date}</p>
            </div>
          </div>

          {/* Patient & Doctor Demographics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-muted/20 border border-border text-xs">
            <div className="space-y-1">
              <p>Patient Name: <strong className="text-foreground font-bold text-sm">{readyOrder.patientName}</strong></p>
              <p>Age / Gender: <strong>{readyOrder.patientAge} Years / Male</strong></p>
              <p>Patient ID: <span className="font-mono font-bold text-primary">PAT-2026-4091</span></p>
            </div>

            <div className="space-y-1">
              <p>Prescribing Physician: <strong className="text-foreground font-bold text-sm">{readyOrder.doctorName}</strong></p>
              <p>Specialization: <strong>Senior Consultant Cardiology</strong></p>
              <p>Specimen Type: <strong>{readyOrder.sampleType} (Barcode: BC-90881)</strong></p>
            </div>
          </div>

          {/* Test Title */}
          <div>
            <h2 className="text-lg font-extrabold text-foreground border-b border-border pb-2">
              {readyOrder.testName}
            </h2>
          </div>

          {/* Measured Results Table */}
          <div className="border border-border rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/50 text-muted-foreground font-bold uppercase border-b border-border">
                  <th className="p-3.5">Investigation Parameter</th>
                  <th className="p-3.5">Measured Result</th>
                  <th className="p-3.5">Biological Reference Range</th>
                  <th className="p-3.5">Units</th>
                  <th className="p-3.5 text-right">Flag Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {parameters.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20">
                    <td className="p-3.5 font-bold text-foreground">{p.parameterName}</td>
                    <td className="p-3.5 font-mono font-extrabold text-primary text-sm">{p.measuredResult}</td>
                    <td className="p-3.5 text-muted-foreground font-mono">{p.referenceRange}</td>
                    <td className="p-3.5 text-muted-foreground font-mono">{p.units}</td>
                    <td className="p-3.5 text-right">
                      <Badge
                        className={
                          p.status === "Critical"
                            ? "bg-red-500 text-white font-bold animate-pulse"
                            : p.status === "High"
                            ? "bg-amber-500 text-white font-bold"
                            : p.status === "Low"
                            ? "bg-purple-500 text-white font-bold"
                            : "bg-emerald-500 text-white font-bold"
                        }
                      >
                        {p.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pathologist Verification & E-Signature */}
          <div className="pt-6 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
              <div className="text-xs">
                <span className="font-bold block text-foreground">Digital Verification Code</span>
                <span className="font-mono text-[10px] text-muted-foreground">MEDIQ-LAB-VERIFIED-2026-901</span>
              </div>
            </div>

            <div className="text-right text-xs space-y-1">
              <div className="h-8 font-serif italic text-primary font-bold text-lg">
                Mahmudul Hasan, MS
              </div>
              <p className="font-bold text-foreground">Mahmudul Hasan, MS, Senior Clinical Pathologist</p>
              <p className="text-muted-foreground text-[11px]">License #LAB-BD-70492 • MediQ Central Pathology</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
