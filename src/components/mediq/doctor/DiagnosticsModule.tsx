import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Activity,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Filter,
  ExternalLink,
  Radio,
  FileImage,
} from "lucide-react";
import { toast } from "sonner";
import { DiagnosticRequest, DiagnosticStatus, Patient } from "@/data/doctor-data";

interface DiagnosticsModuleProps {
  requests: DiagnosticRequest[];
  patients: Patient[];
  onRequestDiagnostic: (request: DiagnosticRequest) => void;
  onUpdateStatus: (id: string, newStatus: DiagnosticStatus) => void;
  onOpenReport?: (testName: string, patientName: string) => void;
}

const statusStyles: Record<
  DiagnosticStatus,
  { bg: string; text: string; border: string }
> = {
  Requested: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  Scheduled: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  Processing: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  "Report Ready": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
};

export function DiagnosticsModule({
  requests,
  patients,
  onRequestDiagnostic,
  onUpdateStatus,
  onOpenReport,
}: DiagnosticsModuleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [diagType, setDiagType] = useState<DiagnosticRequest["diagnosticType"]>("X-Ray");
  const [testName, setTestName] = useState("Chest X-Ray PA View (Digital Radiography)");
  const [urgency, setUrgency] = useState<DiagnosticRequest["urgency"]>("Urgent");
  const [clinicalIndication, setClinicalIndication] = useState("Assess for cardiomegaly or pulmonary congestion.");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleCreateRequest = () => {
    const p = patients.find((pat) => pat.id === selectedPatientId) || patients[0];
    const newReq: DiagnosticRequest = {
      id: `diag-${Date.now()}`,
      requestNo: `DX-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      diagnosticType: diagType,
      testName,
      requestedDate: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
      status: "Requested",
      urgency,
      clinicalIndication,
    };
    onRequestDiagnostic(newReq);
    setDialogOpen(false);
    toast.success("Diagnostic Order Dispatched", {
      description: `Order ${newReq.requestNo} created for ${p.name}`,
    });
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Diagnostic Radiology & Imaging Services
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Order X-Ray, CT Scan, MRI, 2D Echo Ultrasound, and ECG imaging for cardiology evaluation.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:opacity-90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Request Diagnostic Imaging
        </Button>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient or diagnostic test..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-44 text-xs rounded-xl">
              <SelectValue placeholder="Status filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Requested">Requested</SelectItem>
              <SelectItem value="Scheduled">Scheduled</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Report Ready">Report Ready</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Order No</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Modality & Imaging Test</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4">Clinical Indication</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredRequests.map((r) => {
                const st = statusStyles[r.status];
                return (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-mono font-bold text-primary">{r.requestNo}</td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">{r.patientName}</p>
                      <p className="text-[11px] text-muted-foreground">Age: {r.patientAge} yrs</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-foreground">{r.testName}</p>
                      <Badge variant="secondary" className="text-[10px] mt-0.5 font-bold">
                        {r.diagnosticType}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          r.urgency === "Emergency"
                            ? "bg-red-500 text-white"
                            : r.urgency === "Urgent"
                            ? "bg-amber-500 text-white"
                            : "bg-muted text-foreground"
                        }
                      >
                        {r.urgency}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {r.status}
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground max-w-xs truncate">
                      {r.clinicalIndication}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={r.status}
                          onValueChange={(val) => onUpdateStatus(r.id, val as DiagnosticStatus)}
                        >
                          <SelectTrigger className="h-8 text-[11px] rounded-lg w-32">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Requested">Requested</SelectItem>
                            <SelectItem value="Scheduled">Scheduled</SelectItem>
                            <SelectItem value="Processing">Processing</SelectItem>
                            <SelectItem value="Report Ready">Report Ready</SelectItem>
                          </SelectContent>
                        </Select>

                        {r.status === "Report Ready" && onOpenReport && (
                          <Button
                            size="sm"
                            className="h-8 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg"
                            onClick={() => onOpenReport(r.testName, r.patientName)}
                          >
                            Open Report
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Diagnostic Request Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" /> Request Diagnostic Imaging
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Patient
              </Label>
              <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.gender}, {p.age}y - Blood: {p.bloodGroup})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Imaging Modality
                </Label>
                <Select
                  value={diagType}
                  onValueChange={(val) => setDiagType(val as DiagnosticRequest["diagnosticType"])}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                    <SelectValue placeholder="Modality..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="X-Ray">X-Ray Radiography</SelectItem>
                    <SelectItem value="CT">CT Scan</SelectItem>
                    <SelectItem value="MRI">MRI Imaging</SelectItem>
                    <SelectItem value="Ultrasound">Ultrasound / 2D Echo</SelectItem>
                    <SelectItem value="ECG">ECG / Stress Test</SelectItem>
                    <SelectItem value="Other">Other Diagnostic</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Urgency
                </Label>
                <Select
                  value={urgency}
                  onValueChange={(val) => setUrgency(val as DiagnosticRequest["urgency"])}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                    <SelectValue placeholder="Select urgency..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Routine">Routine</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Emergency">Emergency STAT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Diagnostic Test Title
              </Label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. 2D Color Doppler Echocardiogram, Coronary CT Angiogram"
                className="mt-1.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Clinical Indication & Notes
              </Label>
              <Textarea
                rows={3}
                value={clinicalIndication}
                onChange={(e) => setClinicalIndication(e.target.value)}
                placeholder="Clinical background for the radiologist..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>

            <Button
              onClick={handleCreateRequest}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
            >
              Submit Diagnostic Order
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
