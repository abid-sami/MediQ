import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bed,
  CheckCircle2,
  Sparkles,
  Wrench,
  User,
  Building2,
} from "lucide-react";
import { toast } from "sonner";
import { WardBed } from "@/data/nurse-data";

interface BedManagementModuleProps {
  beds: WardBed[];
  onUpdateBedStatus: (id: string, newStatus: WardBed["status"]) => void;
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
}: BedManagementModuleProps) {
  const occupiedCount = beds.filter((b) => b.status === "Occupied").length;
  const availableCount = beds.filter((b) => b.status === "Available").length;
  const cleaningCount = beds.filter((b) => b.status === "Cleaning").length;
  const maintenanceCount = beds.filter((b) => b.status === "Maintenance").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Ward Bed Management & Status Control
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time bed capacity and update status to Occupied, Available, Cleaning, or Maintenance.
          </p>
        </div>

        {/* Counts Bar */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
            🟢 Available: {availableCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold">
            🔵 Occupied: {occupiedCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            🟡 Cleaning: {cleaningCount}
          </div>
          <div className="px-3 py-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">
            🟣 Maintenance: {maintenanceCount}
          </div>
        </div>
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  <Building2 className="h-3.5 w-3.5" /> {b.roomNo} ({b.wardName})
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
                  onValueChange={(val) => {
                    onUpdateBedStatus(b.id, val as WardBed["status"]);
                    toast.success(`Updated status for ${b.bedNo} to ${val}`);
                  }}
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
      </div>
    </div>
  );
}
