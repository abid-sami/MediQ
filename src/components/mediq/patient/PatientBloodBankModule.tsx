import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplet,
  Plus,
  Heart,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { PatientBloodRequest } from "@/data/patient-data";
import { fetchSupabaseBloodInventory, createSupabaseBloodDonor } from "@/services/supabase-service";
import { useAuth } from "@/hooks/use-auth";
import { RequestBloodModal } from "@/components/mediq/RequestBloodModal";
import { BecomeDonorModal } from "@/components/mediq/BecomeDonorModal";

interface PatientBloodBankModuleProps {
  requests: PatientBloodRequest[];
  onRequestBlood: (req: PatientBloodRequest) => void;
}

export function PatientBloodBankModule({
  requests,
  onRequestBlood,
}: PatientBloodBankModuleProps) {
  const { profile, user } = useAuth();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [donorModalOpen, setDonorModalOpen] = useState(false);

  const [bloodUnits, setBloodUnits] = useState<{ group: string; units: number; status: string }[]>([]);

  useEffect(() => {
    fetchSupabaseBloodInventory().then((data) => {
      setBloodUnits(
        data.map((b: any) => ({
          group: b.group || b.blood_group,
          units: b.availableUnits ?? b.available_units ?? 0,
          status:
            (b.availableUnits ?? 0) === 0
              ? "Unavailable"
              : (b.availableUnits ?? 0) <= 5
              ? "Critical"
              : (b.availableUnits ?? 0) <= 10
              ? "Limited"
              : "Available",
        }))
      );
    });
  }, []);

  const handleBecomeDonorClick = async () => {
    if (!profile?.bloodGroup) {
      setDonorModalOpen(true);
    } else {
      const donorName = profile.name || user?.email?.split("@")[0] || "Voluntary Donor";
      const donorPhone = profile.phone || "+1 (555) 000-0000";
      const donorEmail = profile.email || user?.email || "";
      const donorId = `DNR-${Math.floor(1000 + Math.random() * 8999)}`;

      await createSupabaseBloodDonor({
        donorId,
        name: donorName,
        bloodGroup: profile.bloodGroup,
        phone: donorPhone,
        email: donorEmail,
      });

      toast.success(`Registered as Voluntary Blood Donor (${profile.bloodGroup})!`, {
        description: `Thank you ${donorName}! Your blood group ${profile.bloodGroup} is registered with MediQ Blood Bank.`,
      });
    }
  };

  const handleRequestSubmitted = (newReq: any) => {
    const patientReq: PatientBloodRequest = {
      id: newReq.id || `br-${Date.now()}`,
      requestId: newReq.requestId || `BLD-REQ-${Math.floor(100 + Math.random() * 900)}`,
      bloodGroup: newReq.bloodGroup || "O+",
      unitsNeeded: newReq.unitsNeeded || 1,
      hospital: newReq.hospitalName || "MediQ Central Hospital",
      urgency: newReq.urgency || "Routine",
      requestedDate: newReq.requiredDate || new Date().toISOString().split("T")[0],
      status: newReq.status || "Pending",
    };
    onRequestBlood(patientReq);
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
            onClick={handleBecomeDonorClick}
            variant="outline"
            className="rounded-xl text-xs font-bold border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            <Heart className="mr-1.5 h-4 w-4 fill-current" /> Become a Donor
          </Button>

          <Button
            onClick={() => setRequestModalOpen(true)}
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
          {bloodUnits.map((b) => (
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

        {requests.length === 0 ? (
          <div className="p-6 text-center text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border">
            <p className="text-xs font-semibold">No Active Blood Requisitions</p>
            <p className="text-[11px] mt-0.5">Click "Request Blood" above to submit a new requisition to the Blood Bank.</p>
          </div>
        ) : (
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

                <Badge
                  className={
                    r.status === "Approved" || r.status === "Fulfilled"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : r.status === "Rejected"
                      ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                  }
                >
                  {r.status === "Pending" ? "Pending Approval" : r.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <RequestBloodModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
        onRequestSubmitted={handleRequestSubmitted}
      />

      <BecomeDonorModal
        open={donorModalOpen}
        onOpenChange={setDonorModalOpen}
      />
    </div>
  );
}
