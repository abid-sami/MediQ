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
  Droplet,
  Plus,
  CheckCircle2,
  Heart,
  AlertCircle,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { PatientBloodRequest } from "@/data/patient-data";

interface PatientBloodBankModuleProps {
  requests: PatientBloodRequest[];
  onRequestBlood: (req: PatientBloodRequest) => void;
}

const BLOOD_UNITS = [
  { group: "A+", units: 18, status: "Available" },
  { group: "A-", units: 5, status: "Limited" },
  { group: "B+", units: 22, status: "Available" },
  { group: "B-", units: 3, status: "Limited" },
  { group: "AB+", units: 11, status: "Available" },
  { group: "AB-", units: 1, status: "Critical" },
  { group: "O+", units: 26, status: "Available" },
  { group: "O-", units: 0, status: "Unavailable" },
];

export function PatientBloodBankModule({
  requests,
  onRequestBlood,
}: PatientBloodBankModuleProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState<PatientBloodRequest["urgency"]>("Routine");

  const handleCreateRequest = () => {
    const newReq: PatientBloodRequest = {
      id: `br-${Date.now()}`,
      requestId: `BLD-REQ-2026-${Math.floor(10 + Math.random() * 90)}`,
      bloodGroup,
      unitsNeeded: units,
      hospital: "MediQ Central Hospital",
      urgency,
      requestedDate: new Date().toISOString().split("T")[0],
      status: "Approved",
    };
    onRequestBlood(newReq);
    setDialogOpen(false);
    toast.success("Blood Requisition Submitted", {
      description: `Request ID ${newReq.requestId} for ${units} unit(s) of ${bloodGroup}`,
    });
  };

  const handleBecomeDonor = () => {
    toast.success("Thank you for registering as a MediQ Blood Donor!", {
      description: "Our blood bank coordinator will contact you for eligibility screening.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Droplet className="h-6 w-6 text-red-500" /> Live Blood Bank & Requisition
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Check real-time blood group availability, request emergency units, or register as a donor.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={handleBecomeDonor}
            variant="outline"
            className="rounded-xl text-xs font-bold border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <Heart className="mr-1.5 h-4 w-4 fill-current" /> Become a Donor
          </Button>

          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Request Blood
          </Button>
        </div>
      </div>

      {/* Live Availability Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Activity className="h-4 w-4 text-red-500" /> Live Inventory Status
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {BLOOD_UNITS.map((b) => (
            <div
              key={b.group}
              className="bg-card border border-border rounded-xl p-3 text-center space-y-1 hover:border-red-500/40 transition-all"
            >
              <span className="text-xl font-extrabold text-red-500 block">{b.group}</span>
              <span className="text-xs font-bold text-foreground block">{b.units} Units</span>
              <Badge
                className={
                  b.status === "Available"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px]"
                    : "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px]"
                }
              >
                {b.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Active Requests */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-bold">My Blood Requisitions</h3>

        <div className="space-y-3">
          {requests.map((r) => (
            <div
              key={r.id}
              className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-500 font-extrabold flex items-center justify-center text-sm">
                  {r.bloodGroup}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs font-mono">{r.requestId}</h4>
                    <Badge variant="outline" className="text-[10px]">
                      {r.unitsNeeded} Unit(s)
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Hospital: {r.hospital} | Requested: {r.requestedDate}
                  </p>
                </div>
              </div>

              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                {r.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Request Modal */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Droplet className="h-5 w-5 text-red-500" /> Request Blood Units
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Blood Group Required</Label>
              <Input
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="mt-1 rounded-xl text-xs font-bold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Units Needed</Label>
              <Input
                type="number"
                min={1}
                max={5}
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="mt-1 rounded-xl text-xs font-bold"
              />
            </div>

            <Button
              onClick={handleCreateRequest}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-5 shadow-md"
            >
              Submit Blood Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
