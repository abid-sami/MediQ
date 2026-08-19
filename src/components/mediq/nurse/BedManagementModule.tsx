// Design: Guided Floorplan — live ward capacity is grouped clearly, while individual beds stay actionable and traceable.
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Bed,
  CheckCircle2,
  Sparkles,
  Wrench,
  User,
  Building2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { WardBed } from "@/data/nurse-data";

interface BedManagementModuleProps {
  beds: WardBed[];
  onUpdateBedStatus: (id: string, newStatus: WardBed["status"]) => Promise<{ error?: unknown | null }>;
  onAddBed?: (newBed: WardBed) => Promise<{ error?: unknown | null }>;
}

const statusBadgeStyles: Record<
  WardBed["status"],
  { bg: string; text: string; border: string; icon: React.ElementType }
> = {
  Occupied: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30", icon: User },
  Available: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30", icon: CheckCircle2 },
  Cleaning: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30", icon: Sparkles },
  Maintenance: { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30", icon: Wrench },
};

export function BedManagementModule({
  beds,
  onUpdateBedStatus,
  onAddBed,
}: BedManagementModuleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [bedNo, setBedNo] = useState("");
  const [wardName, setWardName] = useState("");
  const [floorNumber, setFloorNumber] = useState("1");
  const [dailyRate, setDailyRate] = useState("0");

  const occupiedCount = beds.filter((b) => b.status === "Occupied").length;
  const availableCount = beds.filter((b) => b.status === "Available").length;
  const cleaningCount = beds.filter((b) => b.status === "Cleaning").length;
  const maintenanceCount = beds.filter((b) => b.status === "Maintenance").length;
  const wards = Object.values(beds.reduce<Record<string, { name: string; total: number; available: number; occupied: number }>>((groups, bed) => {
    const name = bed.wardName || "Unassigned ward";
    if (!groups[name]) groups[name] = { name, total: 0, available: 0, occupied: 0 };
    groups[name].total += 1;
    if (bed.status === "Available") groups[name].available += 1;
    if (bed.status === "Occupied") groups[name].occupied += 1;
    return groups;
  }, {}));

  const handleCreateBed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bedNo.trim() || !wardName.trim()) {
      toast.error("Please enter both a bed number and ward name");
      return;
    }

    const newB: WardBed = {
      id: `bed-${Date.now()}`,
      bedNo,
      wardName,
      roomNo: `Floor ${floorNumber || "1"}`,
      floorNumber: Number(floorNumber) || 1,
      dailyRate: Number(dailyRate) || 0,
      status: "Available",
    };

    if (onAddBed) {
      const result = await onAddBed(newB);
      if (result.error) {
        toast.error("Could not add the bed. Please try again.");
        return;
      }
    }

    setBedNo("");
    setWardName("");
    setModalOpen(false);
    toast.success(`Added ${newB.bedNo} to ${newB.wardName}`);
  };

  const handleStatusChange = async (bed: WardBed, status: WardBed["status"]) => {
    const result = await onUpdateBedStatus(bed.id, status);
    if (result.error) {
      toast.error(`Could not update ${bed.bedNo}. Please try again.`);
      return;
    }
    toast.success(`Updated ${bed.bedNo} to ${status}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Ward Bed Management & Status Control ({beds.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time bed capacity and update status to Occupied, Available, Cleaning, or Maintenance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Counts Bar */}
          <div className="flex items-center gap-2 flex-wrap text-xs hidden md:flex">
            <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              🟢 Available: {availableCount}
            </div>
            <div className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
              🔵 Occupied: {occupiedCount}
            </div>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0 h-10"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Ward Bed
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {wards.map((ward) => (
          <div key={ward.name} className="rounded-2xl border border-border bg-card p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2"><p className="truncate text-sm font-bold text-foreground">{ward.name}</p><Building2 className="h-4 w-4 text-primary" /></div>
            <p className="mt-1 text-xs text-muted-foreground">{ward.total} live bed{ward.total === 1 ? "" : "s"}</p>
            <div className="mt-3 flex gap-2 text-[11px] font-bold"><span className="text-emerald-600 dark:text-emerald-400">{ward.available} available</span><span className="text-blue-600 dark:text-blue-400">{ward.occupied} occupied</span></div>
          </div>
        ))}
      </div>

      {/* Bed Cards Grid */}
      {beds.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center text-sm text-muted-foreground">No live beds are available for this ward view.</div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {beds.map((b) => {
          const config = statusBadgeStyles[b.status];
          const IconComp = config.icon;
          return (
            <div
              key={b.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-base text-foreground">{b.bedNo}</span>
                  <Badge className={`text-xs font-bold border ${config.bg} ${config.text} ${config.border}`}>
                    <IconComp className="mr-1 h-3.5 w-3.5" />
                    {b.status}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Building2 className="h-3.5 w-3.5" /> {b.roomNo} · {b.wardName}
                </p>

                {b.patientName ? (
                  <div className="mt-3 p-3 rounded-xl bg-muted/30 border border-border text-xs">
                    <span className="text-[10px] text-muted-foreground block font-bold">PATIENT OCCUPYING</span>
                    <span className="font-bold text-foreground">{b.patientName}</span>
                  </div>
                ) : (
                  <div className="mt-3 p-3 rounded-xl bg-muted/10 border border-dashed border-border text-xs text-muted-foreground italic">
                    Unoccupied / Ready for Admission
                  </div>
                )}
              </div>

              {/* Status Selector */}
              <div className="pt-2 border-t border-border">
                <Select
                  value={b.status}
                  onValueChange={(val) => { void handleStatusChange(b, val as WardBed["status"]); }}
                >
                  <SelectTrigger className="h-9 text-xs rounded-xl font-bold">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Occupied">Occupied</SelectItem>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          );
        })}
      </div>}

      {/* Add Bed Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Bed className="h-5 w-5 text-primary" /> Add New Bed to Ward
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBed} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Bed Number / Code *</Label>
              <Input
                value={bedNo}
                onChange={(e) => setBedNo(e.target.value)}
                required
                placeholder="e.g. Bed-409"
                className="mt-1 rounded-xl text-xs font-mono font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Ward *</Label>
                <Input value={wardName} onChange={(e) => setWardName(e.target.value)} required placeholder="e.g. Cardiology Ward" className="mt-1 rounded-xl text-xs" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Floor Number</Label>
                <Input type="number" min="1" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Daily Rate</Label>
              <Input type="number" min="0" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} className="mt-1 rounded-xl text-xs" />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Add Bed to Inventory
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
