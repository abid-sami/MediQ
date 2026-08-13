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
  Microscope,
  Plus,
  Search,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Filter,
  ExternalLink,
  FlaskConical,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { LabRequest, LabTestStatus, Patient } from "@/data/doctor-data";

interface LaboratoryModuleProps {
  requests: LabRequest[];
  patients: Patient[];
  onRequestTest: (request: LabRequest) => void;
  onUpdateStatus: (id: string, newStatus: LabTestStatus) => void;
  onOpenReport?: (testName: string, patientName: string) => void;
}

const TEST_SERVICES = [
  { category: "Blood Tests", tests: ["Complete Blood Count (CBC)", "Full Lipid Profile", "HbA1c & Fasting Glucose", "Liver Function Test (LFT)", "Renal Function Test (KFT)", "Cardiac Troponin-I"] },
  { category: "Urine Tests", tests: ["Urine Routine Examination", "Urine Microalbumin", "24-Hour Urine Protein"] },
  { category: "Pathology", tests: ["Histopathology Biopsy", "Fine Needle Aspiration Cytology (FNAC)", "Peripheral Blood Film"] },
  { category: "ECG", tests: ["12-Lead Electrocardiogram (STAT)", "24-Hour Holter ECG Monitoring"] },
  { category: "Other", tests: ["Arterial Blood Gas (ABG)", "Serum Electrolytes (Na, K, Cl)"] },
];

const statusStyles: Record<
  LabTestStatus,
  { bg: string; text: string; border: string }
> = {
  Requested: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  "Sample Collected": { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  Processing: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  "Report Ready": { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
};

export function LaboratoryModule({
  requests,
  patients,
  onRequestTest,
  onUpdateStatus,
  onOpenReport,
}: LaboratoryModuleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || "");
  const [category, setCategory] = useState<LabRequest["testCategory"]>("Blood Tests");
  const [testName, setTestName] = useState("Full Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)");
  const [urgency, setUrgency] = useState<LabRequest["urgency"]>("Urgent");
  const [notes, setNotes] = useState("Fast 10 hours prior to sample collection.");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const handleCreateRequest = () => {
    const p = patients.find((pat) => pat.id === selectedPatientId) || patients[0];
    const newReq: LabRequest = {
      id: `lab-${Date.now()}`,
      requestNo: `LAB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: p.id,
      patientName: p.name,
      patientAge: p.age,
      testCategory: category,
      testName,
      requestedDate: new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" }),
      status: "Requested",
      urgency,
      notes,
    };
    onRequestTest(newReq);
    setDialogOpen(false);
    toast.success("Laboratory Test Requested", {
      description: `Requisition ${newReq.requestNo} dispatched for ${p.name}`,
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
            <FlaskConical className="h-6 w-6 text-teal" /> Laboratory Requisitions & Test Tracking
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Order Blood, Urine, Pathology, and ECG tests, and track real-time sample processing states.
          </p>
        </div>

        <Button
          onClick={() => setDialogOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md hover:opacity-90"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Request Laboratory Test
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient or test name..."
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
              <SelectItem value="Sample Collected">Sample Collected</SelectItem>
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
                <th className="p-4">Requisition No</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Category & Test Name</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4">Requested Date</th>
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
                      <Badge variant="outline" className="text-[10px] mt-0.5">
                        {r.testCategory}
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
                    <td className="p-4 text-muted-foreground">{r.requestedDate}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select
                          value={r.status}
                          onValueChange={(val) => onUpdateStatus(r.id, val as LabTestStatus)}
                        >
                          <SelectTrigger className="h-8 text-[11px] rounded-lg w-32">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Requested">Requested</SelectItem>
                            <SelectItem value="Sample Collected">Sample Collected</SelectItem>
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

      {/* New Request Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xl p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-teal" /> Order Laboratory Service
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
                  Test Category
                </Label>
                <Select
                  value={category}
                  onValueChange={(val) => setCategory(val as LabRequest["testCategory"])}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl text-xs">
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blood Tests">Blood Tests</SelectItem>
                    <SelectItem value="Urine Tests">Urine Tests</SelectItem>
                    <SelectItem value="Pathology">Pathology</SelectItem>
                    <SelectItem value="ECG">ECG</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Urgency Level
                </Label>
                <Select
                  value={urgency}
                  onValueChange={(val) => setUrgency(val as LabRequest["urgency"])}
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
                Specific Test Requisition Name
              </Label>
              <Input
                value={testName}
                onChange={(e) => setTestName(e.target.value)}
                placeholder="e.g. Cardiac Troponin-I, Full Lipid Profile"
                className="mt-1.5 rounded-xl text-xs font-medium"
              />
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Technician & Preparation Notes
              </Label>
              <Textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Fasting instructions, sample handling, clinical context..."
                className="mt-1.5 rounded-xl text-xs"
              />
            </div>

            <Button
              onClick={handleCreateRequest}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl mt-4"
            >
              Submit Laboratory Requisition
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
