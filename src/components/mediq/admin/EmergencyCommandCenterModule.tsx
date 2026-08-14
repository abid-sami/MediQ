import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Siren,
  MapPin,
  Hospital,
  Clock,
  PhoneCall,
  Radio,
  Navigation,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AdminSOSItem } from "@/data/admin-data";

interface EmergencyCommandCenterModuleProps {
  sosItems: AdminSOSItem[];
  onAddSOS?: (newSOS: AdminSOSItem) => void;
}

export function EmergencyCommandCenterModule({
  sosItems,
  onAddSOS,
}: EmergencyCommandCenterModuleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("+1 (555) 911-0000");
  const [emergencyType, setEmergencyType] = useState("Acute Cardiac Arrest");
  const [location, setLocation] = useState("Mirpur 10, Dhaka");
  const [destinationHospital, setDestinationHospital] = useState("MediQ Central Heart Institute");
  const [assignedDriver, setAssignedDriver] = useState("Driver Rashed Mia (ALS-911)");
  const [eta, setEta] = useState("7 Mins");

  const handleCreateSOS = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error("Please enter Patient Name");
      return;
    }

    const newSOS: AdminSOSItem = {
      id: `sos-${Date.now()}`,
      requestId: `SOS-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      patientName,
      patientPhone,
      emergencyType,
      location,
      destinationHospital,
      assignedDriver,
      eta,
      ambulanceStatus: "Going to Pickup",
    };

    if (onAddSOS) {
      onAddSOS(newSOS);
    }

    setPatientName("");
    setModalOpen(false);
    toast.error(`EMERGENCY SOS DISPATCHED: ${newSOS.requestId} (${newSOS.emergencyType})`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-destructive">
            <Siren className="h-6 w-6 animate-pulse" /> Network SOS Emergency Command Center ({sosItems.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time ambulance dispatch routing, live GPS tracking, and emergency trauma center monitoring.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="bg-destructive text-destructive-foreground font-black text-xs px-3 py-1.5 shadow-md">
            Active SOS: {sosItems.length}
          </Badge>

          <Button
            onClick={() => setModalOpen(true)}
            className="bg-destructive hover:bg-destructive/90 text-white font-black text-xs rounded-xl shadow-md shrink-0 h-10"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Dispatch Emergency SOS
          </Button>
        </div>
      </div>

      {/* Live Command Map & SOS Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live GPS Map Command Display */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative h-96 rounded-3xl border-2 border-destructive/40 bg-slate-900 dark:bg-slate-950 overflow-hidden shadow-lift flex flex-col justify-between p-5">
            {/* Grid Overlay */}
            <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#ef4444_1px,transparent_1px)] [background-size:16px_16px]" />

            <div className="relative z-10 flex items-center justify-between">
              <Badge className="bg-destructive text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
                <span className="h-2 w-2 rounded-full bg-white animate-ping" /> LIVE SATELLITE AMBULANCE RADAR
              </Badge>

              <Badge variant="outline" className="bg-black/70 text-emerald-400 border-white/20 text-xs font-mono font-bold">
                PATIENT ➔ AMBULANCE ➔ HOSPITAL
              </Badge>
            </div>

            {/* Simulated Animated Route */}
            <div className="relative z-10 my-auto space-y-6">
              <div className="flex items-center justify-between px-8">
                {/* Patient Pin */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-12 w-12 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 animate-bounce">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-red-400 bg-black/70 px-2.5 py-1 rounded-full">
                    Patient (Pickup Pin)
                  </span>
                </div>

                {/* Pulsing Route Line */}
                <div className="flex-1 mx-6 relative flex items-center">
                  <div className="h-1.5 w-full bg-gradient-to-r from-red-500 via-amber-400 to-blue-500 rounded-full" />
                  <div className="absolute left-1/2 -translate-x-1/2 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                    <Siren className="h-6 w-6" />
                  </div>
                </div>

                {/* Hospital Pin */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="h-12 w-12 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400">
                    <Hospital className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-blue-400 bg-black/70 px-2.5 py-1 rounded-full">
                    MediQ Trauma Center
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 bg-black/80 backdrop-blur-md border border-white/10 p-3.5 rounded-2xl text-xs flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] text-muted-foreground block font-mono">ACTIVE DISPATCH</span>
                <p className="font-bold">Unit #{sosItems[0]?.requestId || "ALS-911"} ({sosItems[0]?.assignedDriver || "Tariqul Islam"}) — ETA {sosItems[0]?.eta || "6 Mins"}</p>
              </div>
              <Badge className="bg-emerald-500 text-white font-bold">Fastest Route Clear</Badge>
            </div>
          </div>
        </div>

        {/* Active Emergency Feed */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-destructive">
            Active Emergency Dispatches ({sosItems.length})
          </h3>

          <div className="space-y-3">
            {sosItems.map((sos) => (
              <div
                key={sos.id}
                className="bg-card border border-destructive/30 rounded-2xl p-4 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-destructive text-xs">{sos.requestId}</span>
                  <Badge className="bg-destructive text-white font-bold text-[10px]">
                    {sos.ambulanceStatus}
                  </Badge>
                </div>

                <h4 className="font-bold text-foreground text-sm leading-tight">{sos.emergencyType}</h4>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Patient: <strong className="text-foreground">{sos.patientName}</strong> ({sos.patientPhone})</p>
                  <p>Location: <strong className="text-foreground">{sos.location}</strong></p>
                  <p>Destination: <strong className="text-primary">{sos.destinationHospital}</strong></p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-destructive font-bold">
                  <span>Unit: {sos.assignedDriver}</span>
                  <span>ETA: {sos.eta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create SOS Dispatch Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2 text-destructive">
              <Siren className="h-5 w-5 animate-pulse" /> Dispatch Emergency SOS Ambulance
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSOS} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Patient Name *</Label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="e.g. Kamrul Hasan"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Patient Phone</Label>
                <Input
                  value={patientPhone}
                  onChange={(e) => setPatientPhone(e.target.value)}
                  placeholder="+1 (555)..."
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Type</Label>
                <Input
                  value={emergencyType}
                  onChange={(e) => setEmergencyType(e.target.value)}
                  placeholder="e.g. Severe Respiratory Distress"
                  className="mt-1 rounded-xl text-xs font-semibold text-destructive"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Pickup Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. House 42, Road 11, Dhanmondi"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Destination Hospital</Label>
              <Input
                value={destinationHospital}
                onChange={(e) => setDestinationHospital(e.target.value)}
                placeholder="e.g. MediQ Central Heart Institute"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Assigned Ambulance Unit</Label>
                <Input
                  value={assignedDriver}
                  onChange={(e) => setAssignedDriver(e.target.value)}
                  placeholder="e.g. Driver Rashed Mia (ALS-911)"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Estimated ETA</Label>
                <Input
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  placeholder="e.g. 5 Mins"
                  className="mt-1 rounded-xl text-xs font-mono font-bold"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90 text-white font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Trigger Emergency SOS Dispatch
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
