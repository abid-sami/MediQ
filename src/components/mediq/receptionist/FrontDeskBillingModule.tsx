import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  Printer,
} from "lucide-react";
import { toast } from "sonner";
import { ReceptionBill } from "@/data/receptionist-data";

interface FrontDeskBillingModuleProps {
  bills: ReceptionBill[];
  onMarkPaid: (id: string) => void;
  onCreateBill: (bill: ReceptionBill) => void;
}

export function FrontDeskBillingModule({
  bills,
  onMarkPaid,
  onCreateBill,
}: FrontDeskBillingModuleProps) {
  const [patientName, setPatientName] = useState("");
  const [serviceName, setServiceName] = useState("Doctor Specialist Consultation Fee");
  const [amount, setAmount] = useState(45.0);

  const handleCreateBillSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    const newBill: ReceptionBill = {
      id: `bill-${Date.now()}`,
      billId: `INV-2026-${Math.floor(800 + Math.random() * 100)}`,
      patientName,
      services: [serviceName],
      amount,
      paymentStatus: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    onCreateBill(newBill);
    setPatientName("");
    toast.success(`Generated Invoice ${newBill.billId} for $${amount}`);
  };

  const pendingAmountTotal = bills
    .filter((b) => b.paymentStatus === "Pending")
    .reduce((acc, c) => acc + c.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-purple-600 dark:text-purple-400" /> Front-Desk Hospital Billing & Payments
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create OPD consultation invoices, admission bills, and process immediate patient payments.
          </p>
        </div>

        <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs px-3 py-1.5 border border-purple-500/30">
          Pending Dues: ${pendingAmountTotal.toFixed(2)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Bill Form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleCreateBillSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
              <Plus className="h-4 w-4 text-primary" /> Generate Front-Desk Invoice
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Patient Full Name</Label>
                <Input value={patientName} onChange={(e) => setPatientName(e.target.value)} required placeholder="e.g. Sami" className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Hospital Service / Consultation</Label>
                <Input value={serviceName} onChange={(e) => setServiceName(e.target.value)} required className="mt-1 rounded-xl text-xs" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Amount ($)</Label>
                <Input type="number" step="1" value={amount} onChange={(e) => setAmount(Number(e.target.value))} required className="mt-1 rounded-xl text-xs font-bold" />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <CreditCard className="mr-1.5 h-4 w-4" /> Issue Hospital Invoice
            </Button>
          </form>
        </div>

        {/* Bills Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">Invoice ID & Date</th>
                  <th className="p-3.5">Patient Name</th>
                  <th className="p-3.5">Services Billed</th>
                  <th className="p-3.5">Amount</th>
                  <th className="p-3.5">Payment Status</th>
                  <th className="p-3.5 text-right">Collect Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bills.map((b) => (
                  <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5">
                      <p className="font-mono font-bold text-primary">{b.billId}</p>
                      <p className="text-[11px] text-muted-foreground">{b.date}</p>
                    </td>
                    <td className="p-3.5 font-bold text-foreground">{b.patientName}</td>
                    <td className="p-3.5 max-w-xs text-muted-foreground">{b.services.join(", ")}</td>
                    <td className="p-3.5 font-extrabold text-foreground text-sm">${b.amount.toFixed(2)}</td>
                    <td className="p-3.5">
                      <Badge
                        className={
                          b.paymentStatus === "Paid"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                        }
                      >
                        {b.paymentStatus}
                      </Badge>
                    </td>
                    <td className="p-3.5 text-right">
                      {b.paymentStatus !== "Paid" ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            onMarkPaid(b.id);
                            toast.success(`Collected $${b.amount} for ${b.billId}`);
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg"
                        >
                          <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark Paid
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-bold text-[11px]">✓ Settled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
