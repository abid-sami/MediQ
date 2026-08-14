import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { NetworkHospital } from "@/data/admin-data";

interface HospitalManagementModuleProps {
  hospitals: NetworkHospital[];
  onAddHospital?: (newHospital: NetworkHospital) => void;
}

export function HospitalManagementModule({
  hospitals,
  onAddHospital,
}: HospitalManagementModuleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Dhanmondi, Dhaka");
  const [totalBeds, setTotalBeds] = useState("250");
  const [availableBeds, setAvailableBeds] = useState("45");
  const [doctorCount, setDoctorCount] = useState("32");

  const handleCreateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter Hospital Name");
      return;
    }

    const newHosp: NetworkHospital = {
      id: `hosp-${Date.now()}`,
      name,
      location,
      totalBeds: Number(totalBeds) || 200,
      availableBeds: Number(availableBeds) || 40,
      doctorCount: Number(doctorCount) || 25,
      emergencyStatus: "Active",
      occupancyPercent: Math.round(
        ((Number(totalBeds) - Number(availableBeds)) / Number(totalBeds)) * 100
      ) || 80,
    };

    if (onAddHospital) {
      onAddHospital(newHosp);
    }

    setName("");
    setModalOpen(false);
    toast.success(`Registered Network Hospital: ${newHosp.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Connected Enterprise Hospital Command Directory ({hospitals.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time bed capacity, emergency triage status, doctor staffing, and ancillary services across all hospitals.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0 h-10"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Register Network Hospital
        </Button>
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

      {/* Register Hospital Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Register New Network Hospital
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateHospital} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Hospital Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. MediQ Specialized Heart & Kidney Center"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Location Address</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Gulshan 2, Dhaka"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Total Beds</Label>
                <Input
                  type="number"
                  min={10}
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Available</Label>
                <Input
                  type="number"
                  min={0}
                  value={availableBeds}
                  onChange={(e) => setAvailableBeds(e.target.value)}
                  className="mt-1 rounded-xl text-xs text-emerald-600 font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Doctors</Label>
                <Input
                  type="number"
                  min={1}
                  value={doctorCount}
                  onChange={(e) => setDoctorCount(e.target.value)}
                  className="mt-1 rounded-xl text-xs text-primary font-bold"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Save Hospital to Network
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
