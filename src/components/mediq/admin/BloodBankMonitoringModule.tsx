import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";
import { fetchSupabaseBloodInventory } from "@/services/supabase-service";

export function BloodBankMonitoringModule() {
  const [bloodGroups, setBloodGroups] = useState<any[]>([]);

  useEffect(() => {
    fetchSupabaseBloodInventory().then((data) => {
      setBloodGroups(
        data.map((b: any) => ({
          group: b.group || b.blood_group,
          available: b.availableUnits ?? b.available_units ?? 0,
          reserved: b.reservedUnits ?? b.reserved_units ?? 0,
          status:
            (b.status === "Critical" || (b.availableUnits ?? 0) <= 5)
              ? "Critical"
              : (b.status === "Low" || (b.availableUnits ?? 0) <= 10)
              ? "Low Stock"
              : "Healthy",
        }))
      );
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-red-500">
            <Droplet className="h-6 w-6" /> Live Ecosystem Blood Repository Command
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time blood group inventory across all 8 blood groups and critical transfusion shortages.
          </p>
        </div>
      </div>

      {/* 8 Blood Group Cards Grid */}
      {bloodGroups.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
          No blood inventory data available. Add blood stock via the database.
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
