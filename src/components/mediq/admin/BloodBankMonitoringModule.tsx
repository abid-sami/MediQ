import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Droplet, Plus, Minus } from "lucide-react";
import { toast } from "sonner";
import { fetchSupabaseBloodInventory, updateSupabaseBloodInventory } from "@/services/supabase-service";

export function BloodBankMonitoringModule() {
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    fetchSupabaseBloodInventory().then((data) => {
      setBloodGroups(
        data.map((b: any) => ({
          group: b.group,
          available: b.availableUnits ?? 0,
          reserved: b.reservedUnits ?? 0,
          status:
            b.status === "Critical" || (b.availableUnits ?? 0) <= 5
              ? "Critical"
              : b.status === "Low" || (b.availableUnits ?? 0) <= 10
              ? "Low Stock"
              : "Healthy",
        }))
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    load();
  }, []);

  const adjust = async (group: string, delta: number) => {
    const current = bloodGroups.find((b) => b.group === group);
    if (!current) return;
    const newAvailable = Math.max(0, current.available + delta);
    setAdjusting(group);
    const { error } = await updateSupabaseBloodInventory(group, newAvailable, current.reserved);
    setAdjusting(null);
    if (error) {
      console.error("updateSupabaseBloodInventory failed:", error);
      toast.error(error.message || "Couldn't update inventory.");
      return;
    }
    toast.success(`${group}: ${delta > 0 ? "+1" : "-1"} unit`);
    load();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-red-500">
            <Droplet className="h-6 w-6" /> Live Ecosystem Blood Repository Command
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time blood group inventory across all 8 blood groups and adjust stock
            directly. Blood Bank staff can also manage inventory from their own dashboard.
          </p>
        </div>
      </div>

      {/* 8 Blood Group Cards Grid */}
      {!loading && bloodGroups.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
          No blood inventory data available yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {bloodGroups.map((bg) => (
            <div
              key={bg.group}
              className="bg-card border border-border rounded-2xl p-4 hover:border-red-500/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-red-500">{bg.group}</span>
                <Badge
                  className={
                    bg.status === "Critical"
                      ? "bg-red-500 text-white font-bold animate-pulse text-[10px]"
                      : bg.status === "Low Stock"
                      ? "bg-amber-500 text-white font-bold text-[10px]"
                      : "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]"
                  }
                >
                  {bg.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-muted/20 border border-border text-center">
                  <span className="font-extrabold text-foreground text-lg block">{bg.available}</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-bold">Available</span>
                </div>
                <div className="p-2 rounded-xl bg-muted/20 border border-border text-center">
                  <span className="font-extrabold text-amber-500 text-lg block">{bg.reserved}</span>
                  <span className="text-[9px] text-muted-foreground uppercase font-bold">Reserved</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={adjusting === bg.group}
                  onClick={() => adjust(bg.group, 1)}
                  className="h-7 flex-1 text-xs font-bold text-emerald-600 rounded-lg gap-1"
                >
                  <Plus className="h-3 w-3" /> 1
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={adjusting === bg.group || bg.available === 0}
                  onClick={() => adjust(bg.group, -1)}
                  className="h-7 flex-1 text-xs font-bold text-destructive rounded-lg gap-1"
                >
                  <Minus className="h-3 w-3" /> 1
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
