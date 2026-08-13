import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  User,
  HeartPulse,
  Activity,
  Pill,
  FileText,
  AlertCircle,
  Stethoscope,
  Clock,
  Building2,
  ShieldAlert,
} from "lucide-react";
import { NursePatient, NursingNoteItem } from "@/data/nurse-data";

interface NursePatientProfileModalProps {
  patient: NursePatient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nursingNotes: NursingNoteItem[];
  onRecordVitalsClick?: (patient: NursePatient) => void;
  onAddNoteClick?: (patient: NursePatient) => void;
}

export function NursePatientProfileModal({
  patient,
  open,
  onOpenChange,
  nursingNotes,
  onRecordVitalsClick,
  onAddNoteClick,
}: NursePatientProfileModalProps) {
  if (!patient) return null;

  const patientNotes = nursingNotes.filter((n) => n.patientId === patient.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-background sm:rounded-2xl">
        {/* Header */}
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-bold border border-white/20">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold">{patient.name}</h2>
                  <Badge variant="outline" className="bg-white/20 text-white font-semibold">
                    {patient.gender}, {patient.age}y
                  </Badge>
                  <Badge className="bg-red-500 text-white font-bold">
                    {patient.bloodGroup}
                  </Badge>
                  <Badge className="bg-white/90 text-primary font-bold">
                    {patient.bedNo}
                  </Badge>
                </div>
                <p className="text-xs opacity-90 mt-1 flex items-center gap-3">
                  <span>Attending Doctor: <strong>{patient.doctorName}</strong></span>
                  <span>•</span>
                  <span>{patient.ward}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {onRecordVitalsClick && (
                <Button
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onRecordVitalsClick(patient);
                  }}
                  className="bg-white text-primary hover:bg-white/90 font-bold text-xs rounded-xl"
                >
                  <Activity className="mr-1.5 h-3.5 w-3.5" /> Record Vitals
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Clinical Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Stethoscope className="h-3.5 w-3.5 text-primary" /> Primary Diagnosis
              </h4>
              <p className="text-sm font-semibold text-foreground">{patient.diagnosis}</p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Patient Allergies
              </h4>
              <div className="flex flex-wrap gap-1">
                {patient.allergies.map((al, idx) => (
                  <Badge key={idx} variant="destructive" className="text-[10px]">
                    {al}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <ShieldAlert className="h-3.5 w-3.5 text-amber-500" /> Condition Status
              </h4>
              <Badge
                className={
                  patient.conditionStatus === "Critical"
                    ? "bg-red-500 text-white font-bold"
                    : patient.conditionStatus === "Monitoring"
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-emerald-500 text-white font-bold"
                }
              >
                {patient.conditionStatus}
              </Badge>
            </div>
          </div>

          {/* Latest Vitals Bar */}
          <div className="p-4 rounded-xl bg-muted/30 border border-border space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal flex items-center gap-1.5">
                <Activity className="h-4 w-4" /> Latest Vital Signs ({patient.latestVitals.recordedAt})
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 text-xs text-center pt-1">
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">BP</span>
                <span className="font-bold text-foreground">{patient.latestVitals.bp}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">PULSE</span>
                <span className="font-bold text-teal">{patient.latestVitals.pulse}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">TEMP</span>
                <span className="font-bold text-foreground">{patient.latestVitals.temp}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">SpO2</span>
                <span className="font-bold text-emerald-500">{patient.latestVitals.spo2}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">RESP RATE</span>
                <span className="font-bold text-foreground">{patient.latestVitals.rr}</span>
              </div>
              <div className="p-2 rounded-lg bg-card border border-border">
                <span className="text-[10px] text-muted-foreground block">WEIGHT</span>
                <span className="font-bold text-foreground">{patient.latestVitals.weight}</span>
              </div>
            </div>
          </div>

          {/* Current Medications */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Pill className="h-4 w-4 text-primary" /> Active Prescription Regimen
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.currentMedications.map((med, idx) => (
                <div key={idx} className="p-2 rounded-xl bg-card border border-border text-xs font-semibold">
                  {med}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Nursing Care Logs History */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-teal" /> Bedside Nursing Observations & Care Logs
              </h4>
              {onAddNoteClick && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl text-xs font-semibold"
                  onClick={() => {
                    onOpenChange(false);
                    onAddNoteClick(patient);
                  }}
                >
                  + Add Nursing Note
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {patientNotes.length > 0 ? (
                patientNotes.map((note) => (
                  <div key={note.id} className="p-3.5 rounded-xl border border-border bg-card space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-primary">{note.nurseName}</span>
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {note.time}
                      </span>
                    </div>
                    <p className="font-semibold text-foreground">Observation: {note.observation}</p>
                    <p className="text-muted-foreground">Care Provided: {note.careProvided}</p>
                    <p className="text-muted-foreground italic">Notes: {note.notes}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No recent nursing notes logged for this shift.</p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
