import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  User,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { NursingNoteItem, NursePatient } from "@/data/nurse-data";

interface NursingNotesModuleProps {
  patients: NursePatient[];
  notes: NursingNoteItem[];
  activePatient?: NursePatient | null;
  onAddNote: (note: NursingNoteItem) => void;
}

export function NursingNotesModule({
  patients,
  notes,
  activePatient,
  onAddNote,
}: NursingNotesModuleProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    activePatient ? activePatient.id : patients[0]?.id || ""
  );
  const targetPatient =
    patients.find((p) => p.id === selectedPatientId) || activePatient || patients[0];

  const [observation, setObservation] = useState(
    "Patient resting in bed. Vital signs monitored."
  );
  const [condition, setCondition] = useState("Stable / Monitoring");
  const [careProvided, setCareProvided] = useState(
    "Administered prescribed morning oral medications and provided oral hydration."
  );
  const [extraNotes, setExtraNotes] = useState(
    "No acute respiratory distress. Patient verbalized comfort."
  );

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatient) return;

    const newNote: NursingNoteItem = {
      id: `nn-${Date.now()}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      observation,
      patientCondition: condition,
      careProvided,
      notes: extraNotes,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      nurseName: "Elena Vance, RN",
    };

    onAddNote(newNote);
    toast.success(`Nursing Note Logged for ${targetPatient.name}`, {
      description: `Logged at ${newNote.time}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-teal" /> Bedside Nursing Notes & Observations
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log shift observations, patient condition changes, care interventions, and notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleAddNoteSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="w-full max-w-xs">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Target Patient</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Select patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.bedNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {targetPatient && (
                <Badge variant="outline" className="text-xs font-bold text-primary">
                  {targetPatient.bedNo}
                </Badge>
              )}
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Nurse Observation</Label>
              <Textarea
                rows={2}
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Observed clinical signs, physical complaints..."
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Patient Condition</Label>
              <Input
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                placeholder="e.g. Stable, Monitoring, Critical"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Nursing Care Provided</Label>
              <Textarea
                rows={2}
                value={careProvided}
                onChange={(e) => setCareProvided(e.target.value)}
                placeholder="Medication administration, wound care, position changes..."
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Additional Notes</Label>
              <Textarea
                rows={2}
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
                placeholder="Patient feedback, doctor updates..."
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Save Nursing Note Entry
            </Button>
          </form>
        </div>

        {/* Logs Feed */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" /> Shift Care Logs
            </h3>

            <div className="space-y-3">
              {notes.map((note) => (
                <div key={note.id} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{note.patientName}</span>
                    <span className="text-[10px] text-muted-foreground">{note.time}</span>
                  </div>

                  <p className="font-semibold text-foreground">{note.observation}</p>
                  <p className="text-muted-foreground">Care: {note.careProvided}</p>
                  <span className="text-[10px] text-teal font-bold block pt-1">By: {note.nurseName}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
