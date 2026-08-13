import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Stethoscope,
  Microscope,
  Pill,
  Activity,
  Building2,
  Calendar,
  ExternalLink,
  Download,
  Filter,
} from "lucide-react";
import { MedicalRecordItem } from "@/data/patient-data";

interface PatientMedicalRecordsModuleProps {
  records: MedicalRecordItem[];
}

export function PatientMedicalRecordsModule({ records }: PatientMedicalRecordsModuleProps) {
  const [filterType, setFilterType] = useState<string>("All");

  const filtered = records.filter((r) =>
    filterType === "All" ? true : r.type === filterType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Personal Health & Clinical Timeline
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Your unified health history including consultations, prescriptions, lab tests, and hospital visits.
          </p>
        </div>
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
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
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
    </div>
  );
}
