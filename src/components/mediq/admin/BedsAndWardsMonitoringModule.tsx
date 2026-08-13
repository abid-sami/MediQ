import React from "react";
import { Badge } from "@/components/ui/badge";
import { Bed, Activity, ShieldAlert, CheckCircle2 } from "lucide-react";

export function BedsAndWardsMonitoringModule() {
  const wardBreakdown = [
    { category: "General Ward", total: 320, occupied: 236, available: 84, cleaning: 6, maintenance: 2 },
    { category: "ICU (Intensive Care)", total: 48, occupied: 39, available: 9, cleaning: 1, maintenance: 0 },
    { category: "CCU (Cardiac Care)", total: 32, occupied: 25, available: 7, cleaning: 1, maintenance: 0 },
    { category: "HDU (High Dependency)", total: 24, occupied: 18, available: 6, cleaning: 0, maintenance: 0 },
    { category: "Emergency Trauma Bay", total: 36, occupied: 22, available: 14, cleaning: 2, maintenance: 0 },
    { category: "Private Cabin Suites", total: 90, occupied: 65, available: 25, cleaning: 4, maintenance: 1 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Live Hospital Bed & Ward Capacity Command
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time occupancy metrics across General Wards, ICU, CCU, HDU, Emergency, and Cabin Suites.
          </p>
        </div>
      </div>

      {/* Ward Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wardBreakdown.map((ward, idx) => {
          const occPercent = Math.round((ward.occupied / ward.total) * 100);
          return (
            <div
              key={idx}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-foreground">{ward.category}</h3>
                <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                  {occPercent}% Occupied
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    occPercent > 80 ? "bg-red-500" : "gradient-primary"
                  }`}
                  style={{ width: `${occPercent}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg block">{ward.available}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Available</span>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                  <span className="font-extrabold text-foreground text-lg block">{ward.occupied}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Occupied</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <span className="font-extrabold text-amber-600 dark:text-amber-400 text-lg block">{ward.cleaning}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold">Cleaning</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
