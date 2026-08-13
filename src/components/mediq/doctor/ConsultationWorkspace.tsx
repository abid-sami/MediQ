import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Stethoscope,
  Activity,
  HeartPulse,
  Pill,
  Microscope,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
  User,
  Clock,
  ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { Patient, Appointment, ConsultationSession } from "@/data/doctor-data";

interface ConsultationWorkspaceProps {
  appointment: Appointment | null;
  patient: Patient | null;
  onSaveConsultation: (consultation: ConsultationSession) => void;
  onOpenPrescription: () => void;
  onOpenLabRequest: () => void;
  onOpenDiagnosticRequest: () => void;
}

const COMMON_CHIEF_COMPLAINTS = [
  "Chest pain (retrosternal pressure)",
  "Exertional shortness of breath",
  "Palpitations & dizziness",
  "High blood pressure monitoring",
  "Bilateral ankle swelling / edema",
  "Fatigue & reduced effort tolerance",
];

const COMMON_SYMPTOMS = [
  "Exertional Dyspnea",
  "Chest Tightness",
  "Orthopnea",
  "Dizziness",
  "Tachycardia",
  "Fatigue",
  "Sweating",
  "Pedal Edema",
];

export function ConsultationWorkspace({
  appointment,
  patient,
  onSaveConsultation,
  onOpenPrescription,
  onOpenLabRequest,
  onOpenDiagnosticRequest,
}: ConsultationWorkspaceProps) {
  if (!patient || !appointment) {
    return (
      <div className="p-12 text-center bg-card border border-border rounded-2xl">
        <Stethoscope className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-bold">No Active Consultation Selected</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
          Please select a waiting patient from Today's Appointments and click "Start Consultation" to initiate clinical documentation.
        </p>
      </div>
    );
  }

  const [chiefComplaint, setChiefComplaint] = useState(
    appointment.reason || "Retro-sternal chest discomfort radiating to left arm on exertion."
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    "Exertional Dyspnea",
    "Chest Tightness",
    "Fatigue",
  ]);
  const [clinicalNotes, setClinicalNotes] = useState(
    "Patient presents with intermittent chest pain over the past 2 days. S1 and S2 heard clearly. No gallop or murmurs. Lungs clear to auscultation. Bilateral pedal pulse present and equal."
  );
  const [diagnosis, setDiagnosis] = useState(
    "Unstable Angina — Rule out Acute Coronary Syndrome"
  );
  const [treatmentPlan, setTreatmentPlan] = useState(
    "1. Initiate Aspirin & Statin therapy\n2. Perform 12-lead STAT ECG\n3. Order Troponin-I and Full Lipid Profile\n4. Re-evaluate in 48 hours"
  );
  const [followUpDate, setFollowUpDate] = useState("2026-08-28");

  const toggleSymptom = (sym: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleSave = () => {
    const session: ConsultationSession = {
      id: `cs-${Date.now()}`,
      appointmentId: appointment.id,
      patientId: patient.id,
      patientName: patient.name,
      chiefComplaint,
      symptoms: selectedSymptoms,
      clinicalNotes,
      diagnosis,
      treatmentPlan,
      followUpDate,
      createdDate: new Date().toISOString(),
    };
    onSaveConsultation(session);
    toast.success("Consultation Completed & Saved to Clinical History", {
      description: `Updated status for ${patient.name}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Patient Active Banner */}
      <div className="bg-gradient-to-r from-primary/10 via-teal/10 to-transparent border border-primary/20 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl gradient-primary text-white flex items-center justify-center font-bold text-xl shadow-soft">
            {patient.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight">{patient.name}</h2>
              <Badge variant="outline" className="bg-background/80 font-medium">
                {patient.gender}, {patient.age}y
              </Badge>
              <Badge className="bg-red-500 text-white font-bold">
                {patient.bloodGroup}
              </Badge>
              <Badge variant="secondary" className="bg-teal/20 text-teal font-semibold">
                Status: In Consultation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
              <span>Appointment: {appointment.appointmentTime} ({appointment.appointmentType})</span>
              <span>Contact: {patient.contact}</span>
            </p>
          </div>
        </div>

        {/* Vital Signs Pills */}
        {appointment.vitalSigns && (
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block">BP</span>
              <span className="font-bold text-foreground">{appointment.vitalSigns.bp}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block">PULSE</span>
              <span className="font-bold text-teal">{appointment.vitalSigns.pulse}</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-border bg-card">
              <span className="text-[10px] text-muted-foreground block">SpO2</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {appointment.vitalSigns.spo2}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Main Consultation Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Chief Complaint */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" /> 1. Chief Complaint
              </Label>
              <span className="text-[11px] text-muted-foreground">Primary presenting problem</span>
            </div>

            <Textarea
              rows={2}
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              placeholder="Describe primary symptom or reason for visit..."
              className="rounded-xl text-xs leading-relaxed"
            />

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-muted-foreground mr-1">Quick Tags:</span>
              {COMMON_CHIEF_COMPLAINTS.map((cc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setChiefComplaint(cc)}
                  className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-muted/30 hover:bg-primary/10 hover:border-primary/40 transition-colors"
                >
                  + {cc}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Symptoms */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-teal flex items-center gap-1.5">
              <HeartPulse className="h-4 w-4" /> 2. Clinical Symptoms
            </Label>
            <p className="text-xs text-muted-foreground">Select all observed or reported symptoms:</p>

            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((sym, i) => {
                const active = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
                      active
                        ? "bg-teal/20 border-teal text-teal-foreground font-bold shadow-xs"
                        : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {active ? "✓ " : "+ "}
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Clinical Notes & Examination */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> 3. Clinical Examination & Physical Notes
            </Label>
            <Textarea
              rows={4}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Record physical examination, heart sounds, chest auscultation, peripheral edema, etc."
              className="rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Section 4: Diagnosis */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-destructive flex items-center gap-1.5">
              <Stethoscope className="h-4 w-4" /> 4. Clinical Diagnosis
            </Label>
            <Input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Essential Hypertension, Mitral Valve Regurgitation"
              className="rounded-xl text-sm font-bold text-foreground"
            />
          </div>

          {/* Section 5: Treatment Plan & Advice */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Activity className="h-4 w-4" /> 5. Treatment Plan & Patient Instructions
            </Label>
            <Textarea
              rows={3}
              value={treatmentPlan}
              onChange={(e) => setTreatmentPlan(e.target.value)}
              placeholder="Outline therapeutic steps, lifestyle changes, dietary restrictions..."
              className="rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Section 6: Follow-up Scheduling */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary" /> 6. Follow-up Visit Date
                </Label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Quick Clinical Action Triggers */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Quick Clinical Actions
            </h3>
            <p className="text-xs text-muted-foreground">
              Directly issue prescriptions, order lab tests, or request diagnostic imaging for {patient.name}:
            </p>

            <div className="space-y-2.5">
              <Button
                onClick={onOpenPrescription}
                className="w-full justify-start rounded-xl gradient-primary text-primary-foreground font-semibold text-xs py-5 shadow-xs"
              >
                <Pill className="mr-2.5 h-4 w-4" /> Create Digital Prescription
              </Button>

              <Button
                onClick={onOpenLabRequest}
                variant="outline"
                className="w-full justify-start rounded-xl text-xs font-semibold py-5 border-teal/40 hover:bg-teal/10"
              >
                <Microscope className="mr-2.5 h-4 w-4 text-teal" /> Order Laboratory Test
              </Button>

              <Button
                onClick={onOpenDiagnosticRequest}
                variant="outline"
                className="w-full justify-start rounded-xl text-xs font-semibold py-5 border-primary/40 hover:bg-primary/10"
              >
                <Activity className="mr-2.5 h-4 w-4 text-primary" /> Request Diagnostic Imaging
              </Button>
            </div>
          </div>

          {/* Complete Consultation CTA */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Save & Finalize Session
            </h3>
            <p className="text-xs text-muted-foreground">
              Finalizing will save this consultation into the patient's permanent medical timeline and update appointment status to Completed.
            </p>

            <Button
              onClick={handleSave}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 text-sm shadow-md"
            >
              <Save className="mr-2 h-4 w-4" /> Complete & Save Consultation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
