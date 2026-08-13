import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bed,
  Plus,
  Building2,
  CheckCircle2,
  Clock,
  User,
  Activity,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import {
  HospitalAdmission,
  BedCategoryAvailability,
} from "@/data/receptionist-data";

interface AdmissionsAndBedsModuleProps {
  admissions: HospitalAdmission[];
  bedCategories: BedCategoryAvailability[];
  onRegisterAdmission: (admission: HospitalAdmission) => void;
}

export function AdmissionsAndBedsModule({
  admissions,
  bedCategories,
  onRegisterAdmission,
}: AdmissionsAndBedsModuleProps) {
  // Form State
  const [patientName, setPatientName] = useState("");
  const [department, setDepartment] = useState("Cardiology Care Unit");
  const [wardName, setWardName] = useState("Ward 4A");
  const [bedNo, setBedNo] = useState("Bed 404-A");
  const [bedType, setBedType] = useState<HospitalAdmission["bedType"]>("General");
  const [attendingDoctor, setAttendingDoctor] = useState("Dr. Sarah Rahman");

  const handleAdmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const newAdmission: HospitalAdmission = {
      id: `adm-${Date.now()}`,
      admissionId: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      patientName,
      department,
      wardName,
      bedNo,
      bedType,
      admissionTime: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      attendingDoctor,
    };

    onRegisterAdmission(newAdmission);
    setPatientName("");
    toast.success(`Registered Admission for ${newAdmission.patientName}`, {
      description: `Assigned Bed ${newAdmission.bedNo} (${newAdmission.wardName})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Inpatient Ward Admissions & Bed Matrix
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Register new hospital admissions and track live capacity across General, ICU, CCU, Cabin, and Emergency beds.
          </p>
        </div>
      </div>

      {/* 5 Live Bed Availability Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {bedCategories.map((cat, i) => (
          <div key={i} className="p-4 rounded-2xl border border-border bg-card space-y-1 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-muted-foreground uppercase">{cat.category}</span>
              <Bed className="h-4 w-4 text-primary" />
            </div>
            <span className="text-2xl font-extrabold text-foreground">{cat.available}</span>
            <p className="text-[10px] text-muted-foreground">Available / {cat.totalBeds} Total</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Register Admission Form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleAdmissionSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
              <Plus className="h-4 w-4 text-primary" /> Register New Inpatient Admission
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Patient Full Name</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} required placeholder="e.g. Kamrul Hasan" className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Department</Label>
                <Input value={department} onChange={(e) => setDepartment(e.target.value)} required className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Ward Name</Label>
                  <Input value={wardName} onChange={(e) => setWardName(e.target.value)} required className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Bed Number</Label>
                  <Input value={bedNo} onChange={(e) => setBedNo(e.target.value)} required className="mt-1 rounded-xl text-xs font-bold" />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Bed Type</Label>
                <Select value={bedType} onValueChange={(v) => setBedType(v as HospitalAdmission["bedType"])}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Bed Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="ICU">ICU</SelectItem>
                    <SelectItem value="CCU">CCU</SelectItem>
                    <SelectItem value="Cabin">Cabin</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Attending Doctor</Label>
                <Input value={attendingDoctor} onChange={(e) => setAttendingDoctor(e.target.value)} required className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Save & Complete Admission
            </Button>
          </form>
        </div>

        {/* Admission Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border font-bold text-sm flex items-center justify-between">
              <span>Shift Inpatient Admissions Log</span>
              <Badge variant="outline" className="text-xs font-bold">{admissions.length} Active Admissions</Badge>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">Admission ID</th>
                  <th className="p-3.5">Patient Name</th>
                  <th className="p-3.5">Ward & Bed</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Admission Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-primary">{adm.admissionId}</td>
                    <td className="p-3.5 font-bold text-foreground">{adm.patientName}</td>
                    <td className="p-3.5">
                      <span className="font-semibold text-foreground">{adm.wardName}</span> — <Badge variant="outline" className="text-[10px] font-bold text-primary">{adm.bedNo}</Badge>
                    </td>
                    <td className="p-3.5">
                      <Badge className="bg-primary/20 text-primary font-bold text-[10px]">{adm.bedType}</Badge>
                    </td>
                    <td className="p-3.5 font-mono text-muted-foreground">{adm.admissionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
