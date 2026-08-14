import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  ShieldCheck,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { PatientPharmacyOrder } from "@/data/patient-data";
import { fetchSupabasePharmacyMedicines } from "@/services/supabase-service";

interface PatientPharmacyModuleProps {
  orders: PatientPharmacyOrder[];
  onNewOrder: (order: PatientPharmacyOrder) => void;
}

export function PatientPharmacyModule({
  orders,
  onNewOrder,
}: PatientPharmacyModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState<{ name: string; price: number; rx: boolean }[]>([]);

  useEffect(() => {
    fetchSupabasePharmacyMedicines().then((data) => {
      setMedicines(
        data.map((m: any) => ({
          name: m.medicineName || m.name || m.medicine_name || "Medicine",
          price: m.pricePerUnit || m.price || m.price_per_unit || 0,
          rx: m.prescriptionRequired ?? m.prescription_required ?? false,
        }))
      );
    });
  }, []);

  const handleOrderMedicine = (med: { name: string; price: number; rx: boolean }) => {
    const newOrd: PatientPharmacyOrder = {
      id: `ph-${Date.now()}`,
      orderNo: `ORD-PH-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().split("T")[0],
      items: [{ name: med.name, qty: 1, price: med.price }],
      totalPrice: med.price,
      prescriptionRequired: med.rx,
      prescriptionVerified: med.rx,
      status: "Processing",
      deliveryAddress: "Home Address",
    };
    onNewOrder(newOrd);
    toast.success(`Ordered ${med.name}`, {
      description: `Order ${newOrd.orderNo} is being processed for home delivery`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> MediQ Pharmacy & Order Tracking
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Order prescription medicines and healthcare products with doorstep delivery.
          </p>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Truck className="h-4 w-4 text-teal" /> My Pharmacy Orders
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono text-xs text-primary font-bold">
                  {ord.orderNo}
                </Badge>
                <Badge
                  className={
                    ord.status === "Delivered"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                  }
                >
                  {ord.status}
                </Badge>
              </div>

              <div className="space-y-1.5 border-y border-border py-2 text-xs">
                {ord.items.map((it, i) => (
                  <div key={i} className="flex justify-between font-semibold">
                    <span>{it.name} x{it.qty}</span>
                    <span>${(it.price * it.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="h-4 w-4" /> Prescription Verified
                </span>
                <span className="font-bold text-foreground text-sm">
                  Total: ${ord.totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Catalogue */}
      <div className="space-y-4 pt-4 border-t border-border">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Package className="h-4 w-4 text-primary" /> Popular Medicines & Healthcare Products
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {medicines.map((med, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-border bg-card hover:border-primary/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-xs text-foreground">{med.name}</h4>
                  {med.rx && (
                    <Badge variant="outline" className="text-[9px] text-amber-500 border-amber-500/40">
                      Rx Required
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-bold text-primary">${med.price.toFixed(2)}</p>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => handleOrderMedicine(med)}
                className="w-full text-xs font-semibold rounded-xl"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Order Medicine
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
