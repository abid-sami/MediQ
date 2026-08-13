import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Search,
  Microscope,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Printer,
  Calendar,
  User,
} from "lucide-react";
import { MedicalReport } from "@/data/doctor-data";

interface ReportsModuleProps {
  reports: MedicalReport[];
  selectedReport?: MedicalReport | null;
}

export function ReportsModule({ reports, selectedReport }: ReportsModuleProps) {
  const [activeTab, setActiveTab] = useState<"All" | "Laboratory" | "Diagnostic">("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingReport, setViewingReport] = useState<MedicalReport | null>(selectedReport || null);

  const filteredReports = reports.filter((r) => {
    const matchesTab = activeTab === "All" || r.type === activeTab;
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reportNo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Central Clinical Reports Repository
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Access verified Laboratory Reports and Diagnostic Imaging Reports directly.
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, report no, or test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        defaultValue="All"
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as any)}
        className="w-full"
      >
        <TabsList className="bg-muted/50 p-1 rounded-xl mb-6">
          <TabsTrigger value="All" className="rounded-lg text-xs font-semibold">
            All Clinical Reports ({reports.length})
          </TabsTrigger>
          <TabsTrigger value="Laboratory" className="rounded-lg text-xs font-semibold">
            <Microscope className="mr-1.5 h-3.5 w-3.5 text-teal" /> Laboratory Reports
          </TabsTrigger>
          <TabsTrigger value="Diagnostic" className="rounded-lg text-xs font-semibold">
            <Activity className="mr-1.5 h-3.5 w-3.5 text-primary" /> Diagnostic Reports
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReports.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[10px] font-mono font-bold text-primary">
                    {r.reportNo}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {r.date}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground leading-snug">{r.testName}</h3>
                <p className="text-xs text-muted-foreground font-semibold mt-1">
                  Patient: <span className="text-foreground">{r.patientName}</span>
                </p>

                <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                  <p className="font-medium text-foreground line-clamp-2">{r.summary}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                {r.abnormalFlag ? (
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/40 text-[10px]">
                    <AlertTriangle className="mr-1 h-3 w-3" /> Abnormal Result
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 text-[10px]">
                    <CheckCircle className="mr-1 h-3 w-3" /> Normal Parameters
                  </Badge>
                )}

                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => setViewingReport(r)}
                >
                  View Report <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Tabs>

      {/* Report Viewer Dialog */}
      {viewingReport && (
        <Dialog open={!!viewingReport} onOpenChange={() => setViewingReport(null)}>
          <DialogContent className="max-w-2xl p-0 overflow-hidden bg-card border-border rounded-2xl">
            <div className="gradient-primary p-6 text-primary-foreground">
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-white/20 text-white font-mono text-xs">
                    {viewingReport.reportNo}
                  </Badge>
                  <h2 className="text-xl font-bold mt-2">{viewingReport.testName}</h2>
                  <p className="text-xs opacity-90">
                    Patient: {viewingReport.patientName} | Date: {viewingReport.date}
                  </p>
                </div>

                <Button
                  size="sm"
                  onClick={() => window.print()}
                  className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl"
                >
                  <Printer className="mr-1.5 h-4 w-4" /> Print
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Diagnostic Summary
                </h4>
                <p className="text-sm font-semibold text-foreground">{viewingReport.summary}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  Detailed Findings & Interpretations
                </h4>
                <p className="text-xs leading-relaxed text-foreground bg-card p-4 rounded-xl border border-border">
                  {viewingReport.findings}
                </p>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between text-muted-foreground">
                <p>Pathologist / Radiologist: <strong className="text-foreground">{viewingReport.technicianName}</strong></p>
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Status: {viewingReport.status}
                </Badge>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
