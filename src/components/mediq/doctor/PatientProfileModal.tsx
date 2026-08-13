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
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Clock,
  FileText,
  Activity,
  Pill,
  Microscope,
  Stethoscope,
  Building2,
  Calendar,
  HeartPulse,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { Patient, MedicalReport } from "@/data/doctor-data";

interface PatientProfileModalProps {
  patient: Patient | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartConsultation?: (patient: Patient) => void;
  onOpenReport?: (report: MedicalReport) => void;
  reports?: MedicalReport[];
}

export function PatientProfileModal({
  patient,
  open,
  onOpenChange,
  onStartConsultation,
  onOpenReport,
  reports = [],
}: PatientProfileModalProps) {
  if (!patient) return null;

  const patientReports = reports.filter((r) => r.patientId === patient.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-background sm:rounded-2xl">
        {/* Top Header Card */}
        <div className="gradient-primary p-6 text-primary-foreground">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl font-bold border border-white/20">
                {patient.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-2xl font-bold">{patient.name}</h2>
                  <Badge variant="outline" className="bg-white/20 text-white border-white/30 font-semibold">
                    {patient.gender}, {patient.age} yrs
                  </Badge>
                  <Badge className="bg-red-500 text-white font-bold">
                    Blood Group: {patient.bloodGroup}
                  </Badge>
                </div>
                <p className="text-sm opacity-90 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" /> ID: {patient.id}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Last Visit: {patient.lastVisitDate}
                  </span>
                </p>
              </div>
            </div>

            {onStartConsultation && (
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onStartConsultation(patient);
                }}
                className="bg-white text-primary hover:bg-white/90 font-bold rounded-xl shadow-lg"
              >
                <Stethoscope className="mr-2 h-4 w-4" />
                Start Consultation
              </Button>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Demographic & Emergency Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary" /> Contact Details
              </h4>
              <p className="text-sm font-semibold">{patient.contact}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3" /> {patient.email}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {patient.address}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-destructive" /> Emergency Contact
              </h4>
              <p className="text-sm font-semibold">{patient.emergencyContact.name}</p>
              <p className="text-xs text-muted-foreground">
                Relationship: <span className="font-medium text-foreground">{patient.emergencyContact.relationship}</span>
              </p>
              <p className="text-xs font-mono font-medium text-primary">
                {patient.emergencyContact.phone}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <HeartPulse className="h-3.5 w-3.5 text-teal" /> Medical Risk Profile
              </h4>
              <div className="flex flex-wrap gap-1 mt-1">
                {patient.allergies.map((allergy, i) => (
                  <Badge key={i} variant="destructive" className="text-[10px] px-2 py-0.5">
                    Allergy: {allergy}
                  </Badge>
                ))}
                {patient.chronicConditions.map((cond, i) => (
                  <Badge key={i} variant="secondary" className="text-[10px] px-2 py-0.5">
                    {cond}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Medical History Card */}
          <div className="p-4 rounded-xl border border-border bg-accent/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
              Comprehensive Medical History
            </h4>
            <p className="text-sm text-foreground leading-relaxed">{patient.medicalHistory}</p>
          </div>

          <Separator />

          {/* Patient Timeline Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Patient Clinical Timeline
              </h3>
              <Badge variant="outline" className="text-xs font-medium">
                Total Visits: {patient.previousVisitsCount}
              </Badge>
            </div>

            <div className="relative pl-6 border-l-2 border-primary/20 space-y-6">
              {/* Previous Consultation Item */}
              <div className="relative group">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-primary border-4 border-background" />
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-primary flex items-center gap-1">
                      <Stethoscope className="h-3.5 w-3.5" /> Previous Consultation
                    </span>
                    <span className="text-xs text-muted-foreground">June 12, 2026</span>
                  </div>
                  <h4 className="font-semibold text-sm">Essential Hypertension Management</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    BP controlled at 134/86. Advised to continue Telmisartan 40mg. Mild ECG changes noted.
                  </p>
                </div>
              </div>

              {/* Lab Reports Item */}
              <div className="relative group">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-teal border-4 border-background" />
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-teal flex items-center gap-1">
                      <Microscope className="h-3.5 w-3.5" /> Laboratory & Diagnostic Reports
                    </span>
                    <span className="text-xs text-muted-foreground">Recent</span>
                  </div>

                  {patientReports.length > 0 ? (
                    <div className="space-y-2">
                      {patientReports.map((rep) => (
                        <div
                          key={rep.id}
                          className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors"
                        >
                          <div>
                            <p className="text-xs font-bold">{rep.testName}</p>
                            <p className="text-[11px] text-muted-foreground">{rep.summary}</p>
                          </div>
                          {onOpenReport && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs font-semibold"
                              onClick={() => {
                                onOpenChange(false);
                                onOpenReport(rep);
                              }}
                            >
                              Open Report <ExternalLink className="ml-1 h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Full Lipid Profile & ECG performed. Reports available in central repository.
                    </p>
                  )}
                </div>
              </div>

              {/* Prescriptions History Item */}
              <div className="relative group">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500 border-4 border-background" />
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-blue-500 flex items-center gap-1">
                      <Pill className="h-3.5 w-3.5" /> Prescription Issued
                    </span>
                    <span className="text-xs text-muted-foreground">May 18, 2026</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Rx #RX-2026-781: Telmisartan 40mg (1-0-0), Atorvastatin 20mg (0-0-1), Ecosprin 75mg (0-1-0).
                  </p>
                </div>
              </div>

              {/* Hospital Admission Item */}
              <div className="relative group">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-purple-500 border-4 border-background" />
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                      <Building2 className="h-3.5 w-3.5" /> Hospital Admission History
                    </span>
                    <span className="text-xs text-muted-foreground">Nov 2023</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Admitted in General Ward (Bed #GW-14) for 3 days post LAD Coronary Stenting. Discharged in stable condition.
                  </p>
                </div>
              </div>

              {/* Follow-up History Item */}
              <div className="relative group">
                <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-background" />
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> Scheduled Follow-up
                    </span>
                    <span className="text-xs text-muted-foreground font-semibold text-emerald-600 dark:text-emerald-400">
                      August 24, 2026
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Scheduled for medication titration and lipid panel evaluation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
