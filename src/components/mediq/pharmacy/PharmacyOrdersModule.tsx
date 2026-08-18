import { formatBDT } from "@/lib/currency";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ShoppingBag,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Filter,
  ShieldCheck,
  ChevronRight,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyOrder, OrderStatus } from "@/data/pharmacy-data";

interface PharmacyOrdersModuleProps {
  orders: PharmacyOrder[];
  onUpdateStatus: (id: string, newStatus: OrderStatus) => void;
  onAddOrder?: (newOrder: PharmacyOrder) => void;
}

const statusBadgeStyles: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  Pending: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  "Prescription Verification": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  Processing: { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  Ready: { bg: "bg-teal/20", text: "text-teal font-bold", border: "border-teal/40" },
  Completed: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
  Cancelled: { bg: "bg-red-500/10", text: "text-red-600 dark:text-red-400", border: "border-red-500/30" },
};

export function PharmacyOrdersModule({
  orders,
  onUpdateStatus,
  onAddOrder,
}: PharmacyOrdersModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Create Order Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientContact, setPatientContact] = useState("+1 (555) 392-1029");
  const [medicineName, setMedicineName] = useState("Tab. Concor 5mg");
  const [quantity, setQuantity] = useState("2");
  const [totalAmount, setTotalAmount] = useState("24.50");

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      toast.error("Please enter Patient Name");
      return;
    }

    const newOrder: PharmacyOrder = {
      id: `po-${Date.now()}`,
      orderId: `ORD-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      patientName,
      patientContact,
      medicines: [
        {
          medicineName,
          quantity: Number(quantity) || 1,
          price: Number(totalAmount) || 20,
        },
      ],
      totalAmount: Number(totalAmount) || 24.5,
      prescriptionStatus: "Verified",
      orderStatus: "Processing",
      orderTime: "Just now",
    };

    if (onAddOrder) {
      onAddOrder(newOrder);
    }

    setPatientName("");
    setModalOpen(false);
    toast.success(`Pharmacy Order ${newOrder.orderId} Issued Successfully!`);
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> Pharmacy Fulfillment Orders ({orders.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process patient orders step-by-step from prescription verification to packaging and completion.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0 h-10"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create Pharmacy Order
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-full sm:w-48 text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Order Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Prescription Verification">Prescription Verification</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Ready">Ready</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Order ID & Time</th>
                <th className="p-4">Patient Name</th>
                <th className="p-4">Ordered Medicines</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Rx Verification</th>
                <th className="p-4">Fulfillment Status</th>
                <th className="p-4 text-right">Step Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => {
                const st = statusBadgeStyles[o.orderStatus];
                return (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-primary">{o.orderId}</p>
                      <p className="text-[11px] text-muted-foreground">{o.orderTime}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">{o.patientName}</p>
                      <p className="text-[11px] text-muted-foreground">{o.patientContact}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="space-y-1">
                        {o.medicines.map((m, i) => (
                          <div key={i} className="text-xs font-semibold">
                            {m.medicineName} <span className="text-muted-foreground font-normal">x{m.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-foreground">{formatBDT(o.totalAmount)}</td>
                    <td className="p-4">
                      <Badge
                        className={
                          o.prescriptionStatus === "Verified"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                        }
                      >
                        {o.prescriptionStatus}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${st.bg} ${st.text} ${st.border}`}
                      >
                        <span>{o.orderStatus}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <Select
                        value={o.orderStatus}
                        onValueChange={(val) => {
                          onUpdateStatus(o.id, val as OrderStatus);
                          toast.success(`Order ${o.orderId} updated to ${val}`);
                        }}
                      >
                        <SelectTrigger className="h-8 text-[11px] rounded-lg w-40 font-bold">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Prescription Verification">Prescription Verification</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Ready">Ready</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Order Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" /> Create New Pharmacy Order
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateOrder} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Patient Full Name *</Label>
              <Input
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
                placeholder="e.g. Rafiqul Islam"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Contact Phone</Label>
              <Input
                value={patientContact}
                onChange={(e) => setPatientContact(e.target.value)}
                placeholder="+1 (555)..."
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Medicine Name</Label>
                <Input
                  value={medicineName}
                  onChange={(e) => setMedicineName(e.target.value)}
                  placeholder="e.g. Tab. Telmisartan 40mg"
                  className="mt-1 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Total Price (BDT) *</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                value={totalAmount}
                onChange={(e) => setTotalAmount(e.target.value)}
                className="mt-1 rounded-xl text-xs font-bold text-primary"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Issue Pharmacy Order
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
