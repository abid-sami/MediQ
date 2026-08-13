import React from "react";
import { Badge } from "@/components/ui/badge";
import { Droplet, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function BloodBankMonitoringModule() {
  const bloodGroups = [
    { group: "A+", available: 28, reserved: 4, status: "Healthy" },
    { group: "A-", available: 6, reserved: 2, status: "Low Stock" },
    { group: "B+", available: 34, reserved: 6, status: "Healthy" },
    { group: "B-", available: 8, reserved: 3, status: "Healthy" },
    { group: "AB+", available: 16, reserved: 2, status: "Healthy" },
    { group: "AB-", available: 4, reserved: 1, status: "Critical" },
    { group: "O+", available: 42, reserved: 10, status: "Healthy" },
    { group: "O-", available: 5, reserved: 4, status: "Critical" },
  ];

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
    </div>
  );
}
