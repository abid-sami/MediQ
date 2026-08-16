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
  Droplet,
  Plus,
  Minus,
  BookmarkCheck,
  Trash2,
  AlertTriangle,
  History,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { BloodGroupItem, BloodGroupType } from "@/data/blood-bank-data";

interface BloodInventoryModuleProps {
  groups: BloodGroupItem[];
  onAddUnits: (group: BloodGroupType, units: number) => void;
  onRemoveUnits: (group: BloodGroupType, units: number) => void;
  onReserveUnits: (group: BloodGroupType, units: number) => void;
  onMarkExpired: (group: BloodGroupType, units: number) => void;
}

export function BloodInventoryModule({
  groups,
  onAddUnits,
  onRemoveUnits,
  onReserveUnits,
  onMarkExpired,
}: BloodInventoryModuleProps) {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroupType>("O-");
  const [unitCount, setUnitCount] = useState(1);
  const [historyLogs, setHistoryLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setHistoryLogs((prev) => [`${msg} at ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Droplet className="h-6 w-6 text-red-500" /> Blood Inventory & Unit Adjustments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage tested blood unit quantities, reserve units for surgeries, and dispose of expired stocks.
          </p>
        </div>
      </div>

      {/* Grid of 8 Blood Group Stock Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
        {groups.map((g) => (
          <div
            key={g.group}
            className={`p-5 rounded-2xl border transition-all shadow-xs space-y-3 bg-card ${
              g.status === "Critical"
                ? "border-red-500/50 bg-red-500/10 ring-1 ring-red-500/30"
                : g.status === "Low"
                ? "border-amber-500/40 bg-amber-500/10"
                : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xl font-extrabold text-red-500 flex items-center gap-1">
                <Droplet className="h-5 w-5" /> {g.group}
              </span>
              <Badge
                className={
                  g.status === "Critical"
                    ? "bg-red-500 text-white font-bold animate-pulse"
                    : g.status === "Low"
                    ? "bg-amber-500 text-white font-bold"
                    : "bg-emerald-500 text-white font-bold"
                }
              >
                {g.status}
              </Badge>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Available Units:</span>
                <span className="font-extrabold text-foreground">{g.availableUnits}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Reserved Units:</span>
                <span className="font-semibold text-purple-600 dark:text-purple-400">{g.reservedUnits}</span>
              </div>
            </div>

            {/* Quick Action Controls */}
            <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onAddUnits(g.group, 1);
                  addLog(`Added +1 unit of ${g.group}`);
                  toast.success(`Added +1 unit to ${g.group}`);
                }}
                className="h-7 text-xs font-bold text-emerald-600 rounded-lg px-2"
              >
                +1 Add
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  onReserveUnits(g.group, 1);
                  addLog(`Reserved 1 unit of ${g.group}`);
                  toast.info(`Reserved 1 unit of ${g.group}`);
                }}
                className="h-7 text-xs font-bold text-purple-600 rounded-lg px-2"
              >
                Reserve
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onMarkExpired(g.group, 1);
                  addLog(`Marked 1 expired unit of ${g.group}`);
                  toast.warning(`Marked 1 unit of ${g.group} as Expired`);
                }}
                className="h-7 text-xs text-destructive hover:bg-destructive/10 rounded-lg px-1.5"
              >
                Expired
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Manual Adjustment Form & History Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adjustment Form */}
        <div className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Plus className="h-4 w-4 text-primary" /> Manual Stock Action
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Select Blood Group</Label>
              <Select value={selectedGroup} onValueChange={(v) => setSelectedGroup(v as BloodGroupType)}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <SelectItem key={g.group} value={g.group}>
                      Blood Group {g.group} (Available: {g.availableUnits})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Unit Quantity</Label>
              <Input
                type="number"
                min="1"
                value={unitCount}
                onChange={(e) => setUnitCount(Number(e.target.value))}
                className="mt-1 rounded-xl text-xs font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <Button
                onClick={() => {
                  onAddUnits(selectedGroup, unitCount);
                  addLog(`Added +${unitCount} units of ${selectedGroup}`);
                  toast.success(`Added +${unitCount} units to ${selectedGroup}`);
                }}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl py-4"
              >
                + Add Units
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  onRemoveUnits(selectedGroup, unitCount);
                  addLog(`Removed -${unitCount} units of ${selectedGroup}`);
                  toast.warning(`Removed -${unitCount} units from ${selectedGroup}`);
                }}
                className="text-destructive border-destructive/30 text-xs font-bold rounded-xl py-4"
              >
                - Remove Units
              </Button>
            </div>
          </div>
        </div>

        {/* History Log */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <History className="h-4 w-4 text-teal" /> Inventory Adjustment History Logs
          </h3>

          <div className="space-y-2.5">
            {historyLogs.length === 0 && (
              <p className="text-xs text-muted-foreground">No adjustments logged yet this session.</p>
            )}
            {historyLogs.map((log, idx) => (
              <div key={idx} className="p-3 rounded-xl border border-border bg-muted/20 text-xs font-medium text-foreground flex items-center justify-between">
                <span>{log}</span>
                <span className="text-[10px] text-muted-foreground">Audit Logged</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
