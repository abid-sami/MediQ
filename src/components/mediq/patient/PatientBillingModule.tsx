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
  CreditCard,
  DollarSign,
  Download,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import { PatientBill } from "@/data/patient-data";

interface PatientBillingModuleProps {
  bills: PatientBill[];
  onPayBill: (id: string) => void;
  onAddBill?: (newBill: PatientBill) => void;
}

export function PatientBillingModule({
  bills,
  onPayBill,
  onAddBill,
}: PatientBillingModuleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("Consultation");
  const [amount, setAmount] = useState("80");

  const totalDue = bills
    .filter((b) => b.status === "Unpaid" || b.status === "Overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateBill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim()) {
      toast.error("Please enter Service Name");
      return;
    }

    const newBill: PatientBill = {
      id: `bill-${Date.now()}`,
      invoiceNo: `INV-2026-${Math.floor(1000 + Math.random() * 8999)}`,
      serviceName,
      category,
      date: new Date().toISOString().split("T")[0],
      amount: Number(amount) || 50,
      status: "Unpaid",
    };

    if (onAddBill) {
      onAddBill(newBill);
    }

    setServiceName("");
    setModalOpen(false);
    toast.success(`New Invoice Created: ${newBill.invoiceNo} ($${newBill.amount})`);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Billing, Payments & Invoices ({bills.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View medical consultation fees, lab diagnostic invoices, and online payment receipts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted/40 p-3 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">TOTAL OUTSTANDING DUE</span>
            <span className="text-xl font-black text-destructive">${totalDue.toFixed(2)}</span>
          </div>

          <Button
            onClick={() => setModalOpen(true)}
            className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0 h-11"
          >
            <Plus className="mr-1.5 h-4 w-4" /> Add Bill / Fee
          </Button>
        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Invoice No</th>
                <th className="p-4">Service Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Invoice Date</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-primary">{b.invoiceNo}</td>
                  <td className="p-4 font-semibold text-foreground">{b.serviceName}</td>
                  <td className="p-4">
                    <Badge variant="outline" className="text-[10px] font-semibold">
                      {b.category}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground">{b.date}</td>
                  <td className="p-4 font-bold text-foreground">${b.amount.toFixed(2)}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        b.status === "Paid"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                          : "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                      }
                    >
                      {b.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {b.status !== "Paid" ? (
                        <Button
                          size="sm"
                          onClick={() => {
                            onPayBill(b.id);
                            toast.success(`Paid invoice ${b.invoiceNo} ($${b.amount.toFixed(2)})`);
                          }}
                          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl"
                        >
                          Pay Now (${b.amount.toFixed(2)})
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast.info(`Downloading Invoice PDF ${b.invoiceNo}`)}
                          className="rounded-xl text-xs font-semibold"
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" /> Receipt
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Bill Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" /> Create Medical Fee Invoice
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateBill} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Service Name / Description *</Label>
              <Input
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                required
                placeholder="e.g. Cardiology Specialist Follow-up Fee"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consultation">Consultation</SelectItem>
                    <SelectItem value="Laboratory">Laboratory</SelectItem>
                    <SelectItem value="Pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="Hospital Ward">Hospital Ward</SelectItem>
                    <SelectItem value="Ambulance">Ambulance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Amount ($USD) *</Label>
                <Input
                  type="number"
                  min={1}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold text-primary"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Generate Invoice
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
