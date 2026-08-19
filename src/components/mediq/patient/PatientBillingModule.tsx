import { formatBDT } from "@/lib/currency";
// Design: Guided Floorplan — patient financial history reflects posted service data only, never client-generated placeholders.
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Download,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { PatientBill } from "@/data/patient-data";

interface PatientBillingModuleProps {
  bills: PatientBill[];
  onPayBill: (id: string) => void;
}

export function PatientBillingModule({
  bills,
  onPayBill,
}: PatientBillingModuleProps) {
  const totalDue = bills
    .filter((b) => b.status === "Unpaid" || b.status === "Overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" /> Billing, Payments & Invoices ({bills.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Invoices posted by MediQ services appear here automatically.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-muted/40 p-3 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-muted-foreground block uppercase">TOTAL OUTSTANDING DUE</span>
            <span className="text-xl font-black text-destructive">{formatBDT(totalDue)}</span>
          </div>

        </div>
      </div>

      {/* Bills Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        {bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
            <FileText className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-sm font-bold text-foreground">No posted invoices</p>
            <p className="max-w-sm text-xs text-muted-foreground">Your consultation, laboratory, pharmacy, and admission invoices will appear here once they are issued by MediQ.</p>
          </div>
        ) : (
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
                  <td className="p-4 font-bold text-foreground">{formatBDT(b.amount)}</td>
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
                            toast.success(`Paid invoice ${b.invoiceNo} (${formatBDT(b.amount)})`);
                          }}
                          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl"
                        >
                          Pay Now ({formatBDT(b.amount)})
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
        )}
      </div>
    </div>
  );
}
