import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Stethoscope,
  Microscope,
} from "lucide-react";
import { toast } from "sonner";
import { LabTestOrder, LabTestOrderStatus } from "@/data/lab-staff-data";

interface LabTestOrdersModuleProps {
  orders: LabTestOrder[];
  onUpdateStatus: (id: string, newStatus: LabTestOrderStatus) => void;
}

const statusBadgeStyles: Record<
  LabTestOrderStatus,
  { bg: string; text: string; border: string }
> = {
  Requested: { bg: "bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/30" },
  "Sample Pending": { bg: "bg-purple-500/10", text: "text-purple-600 dark:text-purple-400", border: "border-purple-500/30" },
  "Sample Collected": { bg: "bg-blue-500/10", text: "text-blue-600 dark:text-blue-400", border: "border-blue-500/30" },
  Processing: { bg: "bg-teal/20", text: "text-teal font-bold", border: "border-teal/40" },
  "Report Ready": { bg: "bg-emerald-500/20", text: "text-emerald-600 dark:text-emerald-400 font-bold", border: "border-emerald-500/40" },
  Completed: { bg: "bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/30" },
};

export function LabTestOrdersModule({
  orders,
  onUpdateStatus,
}: LabTestOrdersModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.testName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Microscope className="h-6 w-6 text-primary" /> Diagnostic Test Requisitions Roster
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track test requisitions from doctor order to sample collection, processing, and completion.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, test ID, or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-full sm:w-48 text-xs rounded-xl">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Requested">Requested</SelectItem>
            <SelectItem value="Sample Pending">Sample Pending</SelectItem>
            <SelectItem value="Sample Collected">Sample Collected</SelectItem>
            <SelectItem value="Processing">Processing</SelectItem>
            <SelectItem value="Report Ready">Report Ready</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Test ID & Date</th>
                <th className="p-4">Patient & Doctor</th>
                <th className="p-4">Test Name & Category</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => {
                const st = statusBadgeStyles[o.status];
                return (
                  <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-mono font-bold text-primary">{o.testId}</p>
                      <p className="text-[11px] text-muted-foreground">{o.date}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-foreground">{o.patientName} ({o.patientAge}y)</p>
                      <p className="text-[11px] text-muted-foreground">Dr. {o.doctorName}</p>
                    </td>
                    <td className="p-4 max-w-xs">
                      <p className="font-bold text-foreground truncate">{o.testName}</p>
                      <Badge variant="outline" className="text-[10px] mt-0.5">{o.category}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          o.priority === "STAT Emergency"
                            ? "bg-red-500 text-white font-bold animate-pulse text-[10px]"
                            : o.priority === "Urgent"
                            ? "bg-amber-500 text-white font-bold text-[10px]"
                            : "bg-blue-500 text-white text-[10px]"
                        }
                      >
                        {o.priority}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`text-xs font-bold ${st.bg} ${st.text} ${st.border}`}>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Select
                        value={o.status}
                        onValueChange={(val) => {
                          onUpdateStatus(o.id, val as LabTestOrderStatus);
                          toast.success(`Updated ${o.testId} to ${val}`);
                        }}
                      >
                        <SelectTrigger className="h-8 text-[11px] rounded-lg w-40 font-bold">
                          <SelectValue placeholder="Update status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Requested">Requested</SelectItem>
                          <SelectItem value="Sample Pending">Sample Pending</SelectItem>
                          <SelectItem value="Sample Collected">Sample Collected</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Report Ready">Report Ready</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
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
    </div>
  );
}
