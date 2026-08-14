import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  FileText,
  Stethoscope,
  Microscope,
  Pill,
  Activity,
  Building2,
  Calendar,
  ExternalLink,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { MedicalRecordItem } from "@/data/patient-data";

interface PatientMedicalRecordsModuleProps {
  records: MedicalRecordItem[];
  onAddRecord?: (newRecord: MedicalRecordItem) => void;
}

export function PatientMedicalRecordsModule({ records, onAddRecord }: PatientMedicalRecordsModuleProps) {
  const [filterType, setFilterType] = useState<string>("All");

  // Add Record Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<MedicalRecordItem["type"]>("Consultation");
  const [doctorName, setDoctorName] = useState("");
  const [facility, setFacility] = useState("MediQ Hospital Network");
  const [summary, setSummary] = useState("");

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a Title for your medical record");
      return;
    }

    const newRec: MedicalRecordItem = {
      id: `rec-${Date.now()}`,
      title,
      type,
      date: new Date().toISOString().split("T")[0],
      doctorName: doctorName || "Self Uploaded / Attending Physician",
      facility: facility || "MediQ Central Healthcare",
      summary: summary || "Personal medical document uploaded to MediQ Health Portal",
      status: "Final",
    };

    if (onAddRecord) {
      onAddRecord(newRec);
    }

    setTitle("");
    setDoctorName("");
    setSummary("");
    setModalOpen(false);
    toast.success(`Medical Record "${newRec.title}" Uploaded Successfully!`);
  };

  const filtered = records.filter((r) =>
    filterType === "All" ? true : r.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Personal Health & Clinical Timeline ({records.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your unified health history including consultations, prescriptions, lab tests, and hospital visits.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Personal Health Record
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {[
          "All",
          "Consultation",
          "Diagnosis",
          "Prescription",
          "Lab Report",
          "Diagnostic",
          "Hospital Visit",
        ].map((t) => (
          <Button
            key={t}
            variant={filterType === t ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterType(t)}
            className={`rounded-xl text-xs font-semibold ${
              filterType === t ? "gradient-primary text-primary-foreground" : ""
            }`}
          >
            {t}
          </Button>
        ))}
      </div>

      {/* Timeline List */}
      <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
        {filtered.map((item) => (
          <div key={item.id} className="relative group">
            <span className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full bg-primary border-4 border-background" />

            <div className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-bold text-primary">
                    {item.type}
                  </Badge>
                  <h3 className="font-bold text-base text-foreground">{item.title}</h3>
                </div>

                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> {item.date}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                <strong className="text-foreground">Practitioner / Unit:</strong> {item.doctorName} (
                {item.facility})
              </p>

              <div className="p-3.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <p className="text-foreground leading-relaxed">{item.summary}</p>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                  Status: {item.status}
                </Badge>
                <Button size="sm" variant="ghost" className="text-xs font-semibold text-primary">
                  View Record <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Record Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Add Medical Health Record
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateRecord} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Record Title *</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. Cardiology Echo Report"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Record Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as any)}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Diagnosis">Diagnosis</SelectItem>
                    <SelectItem value="Prescription">Prescription</SelectItem>
                    <SelectItem value="Lab Report">Lab Report</SelectItem>
                    <SelectItem value="Diagnostic">Diagnostic</SelectItem>
                    <SelectItem value="Hospital Visit">Hospital Visit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Doctor / Practitioner</Label>
                <Input
                  value={doctorName}
                  onChange={(e) => setDoctorName(e.target.value)}
                  placeholder="e.g. Dr. Sarah Rahman"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Hospital / Facility</Label>
              <Input
                value={facility}
                onChange={(e) => setFacility(e.target.value)}
                placeholder="e.g. MediQ Heart Institute"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Clinical Summary & Findings</Label>
              <Textarea
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Clinical observations, results, or advice..."
                className="mt-1 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Save Medical Record
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
