import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ShieldCheck,
  ArrowUpRight,
  Package,
  Pill,
} from "lucide-react";
import {
  PharmacyOrder,
  PrescriptionToVerify,
  PharmacyMedicine,
} from "@/data/pharmacy-data";

interface PharmacyOverviewProps {
  orders: PharmacyOrder[];
  prescriptions: PrescriptionToVerify[];
  medicines: PharmacyMedicine[];
  onNavigateTab: (tab: string) => void;
  onVerifyPrescription: (id: string) => void;
}

export function PharmacyOverview({
  orders,
  prescriptions,
  medicines,
  onNavigateTab,
  onVerifyPrescription,
}: PharmacyOverviewProps) {
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === "Pending").length;
  const processingOrdersCount = orders.filter((o) => o.orderStatus === "Processing").length;
  const readyOrdersCount = orders.filter((o) => o.orderStatus === "Ready").length;
  const completedOrdersCount = orders.filter((o) => o.orderStatus === "Completed").length;

  const lowStockCount = medicines.filter((m) => m.stockStatus === "Low Stock").length;
  const expiringCount = medicines.filter((m) => m.stockStatus === "Expiring Soon").length;
  const outOfStockCount = medicines.filter((m) => m.stockStatus === "Out of Stock").length;

  const unverifiedPrescriptions = prescriptions.filter((p) => p.verificationStatus === "Pending");

  const cards = [
    {
      title: "Pending Orders",
      value: pendingOrdersCount,
      sub: "Awaiting fulfillment",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "orders",
    },
    {
      title: "Processing Orders",
      value: processingOrdersCount,
      sub: "Packaging in progress",
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      tab: "orders",
    },
    {
      title: "Ready Orders",
      value: readyOrdersCount,
      sub: "Ready for pickup / dispatch",
      icon: CheckCircle2,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "orders",
    },
    {
      title: "Completed Orders",
      value: completedOrdersCount,
      sub: "Handed over to patient",
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "orders",
    },
    {
      title: "Low Stock",
      value: lowStockCount,
      sub: "Below reorder point",
      icon: AlertTriangle,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "inventory",
    },
    {
      title: "Expiring Medicines",
      value: expiringCount,
      sub: "Expires within 90 days",
      icon: Clock,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "inventory",
    },
    {
      title: "Out of Stock",
      value: outOfStockCount,
      sub: "Zero inventory available",
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10 border-red-500/20",
      tab: "inventory",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 7 KPI Display Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-3.5 rounded-2xl border ${card.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {card.title}
                </span>
                <IconComp className={`h-3.5 w-3.5 ${card.color}`} />
              </div>

              <div>
                <span className="text-xl font-extrabold text-foreground">{card.value}</span>
                <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Highly Visible Prescription Verification Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-2 border-teal/40 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-teal">
                  <ShieldCheck className="h-5 w-5" /> Pending E-Prescription Verifications ({unverifiedPrescriptions.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Verify digital doctor prescriptions before dispensing Rx drug regimens.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("prescriptions")}
                className="text-xs font-semibold text-teal"
              >
                Verification Station <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3">
              {unverifiedPrescriptions.map((rx) => (
                <div key={rx.id} className="p-4 rounded-xl border border-teal/30 bg-teal/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                        {rx.prescriptionId}
                      </Badge>
                      <h4 className="font-bold text-foreground">{rx.patientName} ({rx.patientAge}y)</h4>
                    </div>
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                      {rx.verificationStatus}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground">
                    Doctor: <strong className="text-foreground">{rx.doctorName}</strong> ({rx.doctorSpecialization})
                  </p>
                  <p className="font-semibold text-foreground">Diagnosis: {rx.diagnosis}</p>

                  <div className="pt-2 flex items-center justify-between border-t border-teal/20">
                    <span className="text-[11px] text-muted-foreground">
                      {rx.medicines.length} prescribed drug items
                    </span>
                    <Button
                      size="sm"
                      onClick={() => onVerifyPrescription(rx.id)}
                      className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl"
                    >
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" /> Verify & Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Orders Fulfillment Queue */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" /> Active Orders Queue
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("orders")}
                className="text-[11px] font-semibold text-primary p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {orders.map((o) => (
                <div key={o.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{o.orderId}</span>
                    <Badge variant="outline" className="text-[10px]">{o.orderStatus}</Badge>
                  </div>
                  <p className="font-bold text-foreground">{o.patientName}</p>
                  <p className="text-muted-foreground font-mono">${o.totalAmount.toFixed(2)} • {o.deliveryType}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
