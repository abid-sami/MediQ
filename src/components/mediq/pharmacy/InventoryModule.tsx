import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Package,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyMedicine, StockStatus } from "@/data/pharmacy-data";

interface InventoryModuleProps {
  medicines: PharmacyMedicine[];
  onRestock: (id: string, qty: number) => void;
}

export function InventoryModule({
  medicines,
  onRestock,
}: InventoryModuleProps) {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const inStockCount = medicines.filter((m) => m.stockStatus === "In Stock").length;
  const lowStockCount = medicines.filter((m) => m.stockStatus === "Low Stock").length;
  const outOfStockCount = medicines.filter((m) => m.stockStatus === "Out of Stock").length;
  const expiringCount = medicines.filter((m) => m.stockStatus === "Expiring Soon").length;

  const filtered = medicines.filter((m) =>
    filterStatus === "All" ? true : m.stockStatus === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" /> Visual Inventory & Stock Level Control
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor real-time pharmacy stock indicators: In Stock, Low Stock, Out of Stock, and Expiring Soon.
          </p>
        </div>
      </div>

      {/* 4 Inventory Status Indicators Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setFilterStatus("In Stock")}
          className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 cursor-pointer card-lift transition-all space-y-1 bg-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">🟢 IN STOCK</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{inStockCount}</span>
          <p className="text-[10px] text-muted-foreground">Optimal inventory count</p>
        </div>

        <div
          onClick={() => setFilterStatus("Low Stock")}
          className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 cursor-pointer card-lift transition-all space-y-1 bg-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">🟡 LOW STOCK</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{lowStockCount}</span>
          <p className="text-[10px] text-muted-foreground">Below reorder threshold</p>
        </div>

        <div
          onClick={() => setFilterStatus("Out of Stock")}
          className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 cursor-pointer card-lift transition-all space-y-1 bg-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400">🔴 OUT OF STOCK</span>
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{outOfStockCount}</span>
          <p className="text-[10px] text-muted-foreground">Immediate supplier requisition</p>
        </div>

        <div
          onClick={() => setFilterStatus("Expiring Soon")}
          className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/10 cursor-pointer card-lift transition-all space-y-1 bg-card"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400">⚠️ EXPIRING SOON</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <span className="text-2xl font-extrabold text-foreground">{expiringCount}</span>
          <p className="text-[10px] text-muted-foreground">Expires within 90 days</p>
        </div>
      </div>

      {/* Inventory List Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Medicine & Brand</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Reorder Threshold</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Indicator Status</th>
                <th className="p-4 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-foreground">{m.name} ({m.strength})</p>
                    <p className="text-[11px] text-muted-foreground">Brand: {m.brand}</p>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px]">
                      {m.category}
                    </Badge>
                  </td>
                  <td className="p-4 font-extrabold text-sm text-foreground">{m.stock} Units</td>
                  <td className="p-4 text-muted-foreground">{m.reorderLevel} Units</td>
                  <td className="p-4 text-muted-foreground font-mono">{m.expiryDate}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        m.stockStatus === "In Stock"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                          : m.stockStatus === "Low Stock"
                          ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                          : m.stockStatus === "Out of Stock"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                          : "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold"
                      }
                    >
                      {m.stockStatus}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        onRestock(m.id, 50);
                        toast.success(`Restocked +50 units of ${m.name}`);
                      }}
                      className="rounded-xl text-xs font-semibold"
                    >
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5 text-primary" /> +50 Restock
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
