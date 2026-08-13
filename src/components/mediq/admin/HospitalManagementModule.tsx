import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  MapPin,
  Bed,
  Stethoscope,
  Activity,
  CheckCircle2,
  Pill,
  Droplet,
  Microscope,
} from "lucide-react";
import { NetworkHospital } from "@/data/admin-data";

interface HospitalManagementModuleProps {
  hospitals: NetworkHospital[];
}

export function HospitalManagementModule({
  hospitals,
}: HospitalManagementModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Connected Enterprise Hospital Command Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time bed capacity, emergency triage status, doctor staffing, and ancillary services across all hospitals.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge
                  className={
                    hosp.emergencyStatus === "Active"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  }
                >
                  ER: {hosp.emergencyStatus}
                </Badge>
                <span className="font-mono text-xs font-bold text-primary">
                  {hosp.occupancyPercent}% Occupancy
                </span>
              </div>

              <h3 className="font-bold text-lg text-foreground leading-snug">{hosp.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> {hosp.location}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <span className="text-muted-foreground block text-[10px]">TOTAL BEDS</span>
                  <span className="font-extrabold text-foreground text-base block">{hosp.totalBeds}</span>
                  <span className="text-emerald-600 text-[10px] font-bold">{hosp.availableBeds} Available</span>
                </div>

                <div className="p-3 rounded-xl bg-muted/20 border border-border">
                  <span className="text-muted-foreground block text-[10px]">DOCTORS ON DUTY</span>
                  <span className="font-extrabold text-foreground text-base block">{hosp.doctorCount}</span>
                  <span className="text-primary text-[10px] font-bold">Active Staff</span>
                </div>
              </div>

              {/* Service Badges */}
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/60">
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Microscope className="h-3 w-3 text-teal" /> Diagnostics
                </Badge>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Pill className="h-3 w-3 text-amber-500" /> Pharmacy
                </Badge>
                <Badge variant="outline" className="text-[10px] gap-1">
                  <Droplet className="h-3 w-3 text-red-500" /> Blood Repository
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
