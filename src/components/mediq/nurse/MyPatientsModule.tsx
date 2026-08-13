import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  Activity,
  AlertCircle,
  Stethoscope,
  HeartPulse,
  ChevronRight,
  Plus,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { NursePatient, NursingNoteItem } from "@/data/nurse-data";

interface MyPatientsModuleProps {
  patients: NursePatient[];
  onOpenProfile: (patient: NursePatient) => void;
  onRecordVitalsClick: (patient: NursePatient) => void;
  onAddNoteClick: (patient: NursePatient) => void;
}

export function MyPatientsModule({
  patients,
  onOpenProfile,
  onRecordVitalsClick,
  onAddNoteClick,
}: MyPatientsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [conditionFilter, setConditionFilter] = useState("All");

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.bedNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCond = conditionFilter === "All" || p.conditionStatus === conditionFilter;
    return matchesSearch && matchesCond;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Assigned Ward Patients
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time bedside condition, latest vital signs, active alerts, and doctor treatment plans.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient name, bed #, or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={conditionFilter} onValueChange={setConditionFilter}>
          <SelectTrigger className="h-9 w-full sm:w-44 text-xs rounded-xl">
            <SelectValue placeholder="Condition status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Conditions</SelectItem>
            <SelectItem value="Stable">Stable</SelectItem>
            <SelectItem value="Monitoring">Monitoring</SelectItem>
            <SelectItem value="Guarded">Guarded</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((patient) => (
          <div
            key={patient.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/20 text-primary font-bold text-xs">
                    {patient.bedNo}
                  </Badge>
                  <Badge variant="outline" className="text-[10px]">
                    {patient.ward}
                  </Badge>
                </div>

                <Badge
                  className={
                    patient.conditionStatus === "Critical"
                      ? "bg-red-500 text-white font-bold animate-pulse"
                      : patient.conditionStatus === "Monitoring"
                      ? "bg-amber-500 text-white font-bold"
                      : "bg-emerald-500 text-white font-bold"
                  }
                >
                  {patient.conditionStatus}
                </Badge>
              </div>

              <h3
                onClick={() => onOpenProfile(patient)}
                className="font-bold text-lg text-foreground hover:text-primary cursor-pointer transition-colors"
              >
                {patient.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {patient.gender}, {patient.age} yrs | Blood:{" "}
                <strong className="text-red-500">{patient.bloodGroup}</strong>
              </p>
              <p className="text-xs font-semibold text-foreground mt-1">
                Diagnosis: <span className="font-normal text-muted-foreground">{patient.diagnosis}</span>
              </p>

              {/* Latest Vitals Bar */}
              <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border/80 text-xs grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[10px] text-muted-foreground block">BP</span>
                  <span className="font-bold text-foreground">{patient.latestVitals.bp}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">PULSE</span>
                  <span className="font-bold text-teal">{patient.latestVitals.pulse}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block">SpO2</span>
                  <span className="font-bold text-emerald-500">{patient.latestVitals.spo2}</span>
                </div>
              </div>

              {/* Active Alerts */}
              {patient.alerts.length > 0 && (
                <div className="mt-3 space-y-1">
                  {patient.alerts.map((al, idx) => (
                    <div
                      key={idx}
                      className="text-[11px] p-2 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-semibold flex items-center gap-1.5"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{al}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-border gap-2 flex-wrap">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-semibold"
                onClick={() => onRecordVitalsClick(patient)}
              >
                <Activity className="mr-1.5 h-3.5 w-3.5 text-primary" /> Vitals
              </Button>

              <Button
                size="sm"
                variant="outline"
                className="rounded-xl text-xs font-semibold"
                onClick={() => onAddNoteClick(patient)}
              >
                <FileText className="mr-1.5 h-3.5 w-3.5 text-teal" /> Care Note
              </Button>

              <Button
                size="sm"
                onClick={() => onOpenProfile(patient)}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
              >
                Patient Chart <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
