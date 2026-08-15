import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Droplet, Plus, Minus, Send, AlertTriangle, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBloodRequest } from "@/services/supabase-service";

interface RequestBloodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestSubmitted?: (req: any) => void;
  defaultBloodGroup?: string;
}

// 6 Primary Blood Group Choices as requested
const BLOOD_SELECTIONS = ["O+", "A+", "B+", "AB+", "O-", "A-"];

export function RequestBloodModal({
  open,
  onOpenChange,
  onRequestSubmitted,
  defaultBloodGroup = "O+",
}: RequestBloodModalProps) {
  const { profile, user } = useAuth();

  const [selectedGroup, setSelectedGroup] = useState<string>(defaultBloodGroup || "O+");
  const [units, setUnits] = useState<number>(2);
  const [hospital, setHospital] = useState<string>("MediQ Central Hospital");
  const [urgency, setUrgency] = useState<"Normal" | "Urgent" | "Emergency">("Urgent");
  const [patientName, setPatientName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      if (profile.name) setPatientName(profile.name);
      if (profile.phone) setPhone(profile.phone);
      if (profile.bloodGroup) setSelectedGroup(profile.bloodGroup);
    }
  }, [profile, open]);

  const handleIncrementUnits = () => setUnits((prev) => Math.min(prev + 1, 10));
  const handleDecrementUnits = () => setUnits((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameToUse = patientName.trim() || profile?.name || user?.email?.split("@")[0] || "Patient";
    const reqId = `REQ-B-${Math.floor(1000 + Math.random() * 8999)}`;

    setIsSubmitting(true);

    try {
      const payload = {
        requestId: reqId,
        patientName: nameToUse,
        patientAge: 38,
        bloodGroup: selectedGroup,
        unitsNeeded: units,
        hospitalName: hospital.trim() || "MediQ Central Hospital",
        doctorName: "Prescribing Physician",
        urgency: urgency,
      };

      const result = await createSupabaseBloodRequest(payload);

      const createdObj = result?.data || {
        id: `br-${Date.now()}`,
        requestId: reqId,
        patientName: nameToUse,
        patientAge: 38,
        bloodGroup: selectedGroup,
        unitsNeeded: units,
        hospitalName: hospital.trim() || "MediQ Central Hospital",
        doctorName: "Prescribing Physician",
        requiredDate: new Date().toISOString().split("T")[0],
        urgency: urgency,
        status: "Pending",
      };

      if (onRequestSubmitted) {
        onRequestSubmitted(createdObj);
      }

      toast.success(`Blood Request ${reqId} Submitted`, {
        description: `${units} Bag Unit(s) of ${selectedGroup} sent to Blood Bank Staff (Status: Pending Approval).`,
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit blood request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-3xl bg-card border-border shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-500/15 text-red-500">
              <Droplet className="h-5 w-5 fill-current" />
            </span>
            Request Emergency Blood Units
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Select blood group & units needed. Your requisition will be dispatched to Blood Bank Staff for immediate approval.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* 6 Blood Selection Grid */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              1. Select Blood Group (6 Choices)
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {BLOOD_SELECTIONS.map((bg) => {
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedGroup(bg)}
                    className={`relative p-3 rounded-2xl border-2 font-extrabold text-sm transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm scale-[1.02]"
                        : "border-border bg-muted/20 text-foreground hover:border-red-500/40"
                    }`}
                  >
                    <Droplet className={`h-4 w-4 ${isSelected ? "text-red-500 fill-current" : "text-muted-foreground"}`} />
                    <span>{bg}</span>
                    {isSelected && (
                      <span className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px]">
                        <Check className="h-3 w-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bag Units Needed (Amount) */}
          <div className="bg-muted/30 border border-border p-3.5 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-bold text-foreground">Bag Units Needed (Amount)</Label>
                <p className="text-[10px] text-muted-foreground">Standard 450ml transfusion bags</p>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleDecrementUnits}
                  disabled={units <= 1}
                  className="h-8 w-8 rounded-xl shrink-0"
                >
                  <Minus className="h-3.5 w-3.5" />
                </Button>

                <div className="w-12 text-center">
                  <span className="text-xl font-extrabold text-red-500">{units}</span>
                  <span className="text-[9px] font-bold block text-muted-foreground uppercase">
                    {units === 1 ? "Bag" : "Bags"}
                  </span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleIncrementUnits}
                  disabled={units >= 10}
                  className="h-8 w-8 rounded-xl shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Urgency Selection */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
              Urgency Level
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Normal", "Urgent", "Emergency"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={`py-2 px-2 text-xs font-bold rounded-xl border transition-all ${
                    urgency === u
                      ? u === "Emergency"
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : u === "Urgent"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                        : "bg-blue-600 text-white border-blue-600 shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {u === "Emergency" ? "🚨 Emergency" : u === "Urgent" ? "⚡ Urgent" : "Routine"}
                </button>
              ))}
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] font-bold text-muted-foreground">Patient Full Name</Label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Full Name"
                className="mt-1 h-9 rounded-xl text-xs"
                required
              />
            </div>
            <div>
              <Label className="text-[11px] font-bold text-muted-foreground">Contact Phone</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="mt-1 h-9 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold text-muted-foreground">Hospital / Destination Ward</Label>
            <Input
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="Hospital Name / Ward Number"
              className="mt-1 h-9 rounded-xl text-xs"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-5 shadow-lg shadow-red-600/20 text-xs mt-2"
          >
            <Send className="mr-2 h-4 w-4" />
            {isSubmitting ? "Submitting Request..." : `Submit Requisition (${units} Bag Units of ${selectedGroup})`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
