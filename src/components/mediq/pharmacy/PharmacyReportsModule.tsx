import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Clock,
  Package,
  ShoppingBag,
  DollarSign,
  Printer,
} from "lucide-react";
import { PharmacyMedicine, PharmacyOrder } from "@/data/pharmacy-data";

interface PharmacyReportsModuleProps {
  medicines: PharmacyMedicine[];
  orders: PharmacyOrder[];
}

export function PharmacyReportsModule({
  medicines,
  orders,
}: PharmacyReportsModuleProps) {
  const totalSalesAmount = orders
    .filter((o) => o.orderStatus === "Completed" || o.orderStatus === "Ready")
    .reduce((acc, c) => acc + c.totalAmount, 0);

  const lowStockMeds = medicines.filter((m) => m.stockStatus === "Low Stock" || m.stockStatus === "Out of Stock");
  const expiringMeds = medicines.filter((m) => m.stockStatus === "Expiring Soon");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" /> Pharmacy Analytics & Clinical Reports
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit reports for Sales Revenues, Order Volume, Low Stock Alerts, and Expired Stock logs.
          </p>
        </div>

        <Button
          onClick={() => window.print()}
          variant="outline"
          className="rounded-xl text-xs font-semibold"
        >
          <Printer className="mr-1.5 h-4 w-4 text-primary" /> Print Executive Summary
        </Button>
      </div>

      {/* 4 Sales Metric Display Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-primary/20 bg-primary/10 space-y-1 bg-card">
          <span className="text-xs font-bold text-primary block uppercase">TOTAL SALES REVENUE</span>
          <span className="text-2xl font-extrabold text-foreground">${totalSalesAmount.toFixed(2)}</span>
          <p className="text-[10px] text-muted-foreground">Settled & fulfilled orders</p>
        </div>

        <div className="p-4 rounded-2xl border border-teal/20 bg-teal/10 space-y-1 bg-card">
          <span className="text-xs font-bold text-teal block uppercase">FULFILLED ORDERS</span>
          <span className="text-2xl font-extrabold text-foreground">{orders.length} Orders</span>
          <p className="text-[10px] text-muted-foreground">100% Verified e-Rx compliance</p>
        </div>

        <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/10 space-y-1 bg-card">
          <span className="text-xs font-bold text-amber-500 block uppercase">LOW STOCK ALERTS</span>
          <span className="text-2xl font-extrabold text-foreground">{lowStockMeds.length} Items</span>
          <p className="text-[10px] text-muted-foreground">Pending supplier PO</p>
        </div>

        <div className="p-4 rounded-2xl border border-purple-500/20 bg-purple-500/10 space-y-1 bg-card">
          <span className="text-xs font-bold text-purple-500 block uppercase">EXPIRING MEDICINES</span>
          <span className="text-2xl font-extrabold text-foreground">{expiringMeds.length} Items</span>
          <p className="text-[10px] text-muted-foreground">Expiring within 90 days</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="low-stock" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-4">
          <TabsTrigger value="low-stock" className="rounded-lg text-xs font-semibold">
            <AlertTriangle className="mr-1.5 h-3.5 w-3.5 text-amber-500" /> Low Stock Report
          </TabsTrigger>
          <TabsTrigger value="expiring" className="rounded-lg text-xs font-semibold">
            <Clock className="mr-1.5 h-3.5 w-3.5 text-purple-500" /> Expired Stock Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="low-stock">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">Medicine Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Reorder Point</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {lowStockMeds.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3.5 font-bold text-foreground">{m.name} ({m.strength})</td>
                    <td className="p-3.5">{m.category}</td>
                    <td className="p-3.5 font-extrabold text-amber-500">{m.stock} Units</td>
                    <td className="p-3.5">{m.reorderLevel} Units</td>
                    <td className="p-3.5">
                      <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                        {m.stockStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="expiring">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">Medicine Name</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Expiry Date</th>
                  <th className="p-3.5">Current Stock</th>
                  <th className="p-3.5">Action Needed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {expiringMeds.map((m) => (
                  <tr key={m.id}>
                    <td className="p-3.5 font-bold text-foreground">{m.name} ({m.strength})</td>
                    <td className="p-3.5">{m.category}</td>
                    <td className="p-3.5 font-mono font-bold text-purple-500">{m.expiryDate}</td>
                    <td className="p-3.5">{m.stock} Units</td>
                    <td className="p-3.5 font-semibold text-destructive">Discount or Quarantine</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
