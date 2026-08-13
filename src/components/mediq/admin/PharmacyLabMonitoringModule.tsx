import React from "react";
import { Badge } from "@/components/ui/badge";
import { Pill, Microscope, TestTube, ShoppingBag, Clock } from "lucide-react";

export function PharmacyLabMonitoringModule() {
  return (
    <div className="space-y-6">
      {/* Pharmacy Overview */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Pill className="h-5 w-5 text-amber-500" /> Enterprise Pharmacy Network
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border">
            <span className="text-muted-foreground block text-[10px]">TOTAL MEDICINES</span>
            <span className="font-extrabold text-foreground text-xl block">1,480</span>
          </div>

          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-600 dark:text-amber-400 block text-[10px] font-bold">ACTIVE ORDERS</span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400 text-xl block">24</span>
          </div>

          <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20">
            <span className="text-red-500 block text-[10px] font-bold">LOW STOCK ITEMS</span>
            <span className="font-extrabold text-red-500 text-xl block">8 Items</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] font-bold">COMPLETED ORDERS</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xl block">142 Today</span>
          </div>
        </div>
      </div>

      {/* Laboratory Overview */}
      <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Microscope className="h-5 w-5 text-teal" /> Central Pathology & Laboratory Diagnostics
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border">
            <span className="text-muted-foreground block text-[10px]">PENDING REQUISITIONS</span>
            <span className="font-extrabold text-foreground text-xl block">12</span>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <span className="text-purple-600 dark:text-purple-400 block text-[10px] font-bold">SAMPLES COLLECTED</span>
            <span className="font-extrabold text-purple-600 dark:text-purple-400 text-xl block">18</span>
          </div>

          <div className="p-3.5 rounded-xl bg-teal/10 border border-teal/20">
            <span className="text-teal block text-[10px] font-bold">IN ANALYZER PROCESSING</span>
            <span className="font-extrabold text-teal text-xl block">6</span>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <span className="text-emerald-600 dark:text-emerald-400 block text-[10px] font-bold">REPORTS VERIFIED</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-xl block">84 Today</span>
          </div>
        </div>
      </div>
    </div>
  );
}
