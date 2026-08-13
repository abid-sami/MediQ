import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pill,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
} from "lucide-react";
import { toast } from "sonner";
import { MedicationTask } from "@/data/nurse-data";

interface MedicationTasksModuleProps {
  tasks: MedicationTask[];
  onUpdateStatus: (id: string, newStatus: MedicationTask["status"]) => void;
}

export function MedicationTasksModule({
  tasks,
  onUpdateStatus,
}: MedicationTasksModuleProps) {
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = tasks.filter((t) =>
    statusFilter === "All" ? true : t.status === statusFilter
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal" /> Medication Administration Tasks
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administer scheduled patient drug regimens and mark execution status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 w-40 text-xs rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tasks</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Given">Given</SelectItem>
              <SelectItem value="Missed">Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* List Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Bed & Patient</th>
                <th className="p-4">Medication & Dose</th>
                <th className="p-4">Scheduled Time</th>
                <th className="p-4">Status</th>
                <th className="p-4">Instructions</th>
                <th className="p-4 text-right">Administer Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-foreground">{t.patientName}</p>
                    <Badge variant="outline" className="text-[10px] font-bold text-primary mt-0.5">
                      {t.bedNo}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-teal">{t.medicine}</p>
                    <p className="text-[11px] text-muted-foreground font-mono">Dose: {t.dose}</p>
                  </td>
                  <td className="p-4 font-bold text-foreground flex items-center gap-1 mt-1">
                    <Clock className="h-3.5 w-3.5 text-primary" /> {t.time}
                  </td>
                  <td className="p-4">
                    <Badge
                      className={
                        t.status === "Given"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                          : t.status === "Missed"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                      }
                    >
                      {t.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-xs truncate">{t.instructions}</td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant={t.status === "Given" ? "default" : "outline"}
                        onClick={() => {
                          onUpdateStatus(t.id, "Given");
                          toast.success(`Marked ${t.medicine} as GIVEN to ${t.patientName}`);
                        }}
                        className={`rounded-xl text-xs font-bold ${
                          t.status === "Given" ? "bg-emerald-600 text-white" : ""
                        }`}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Given
                      </Button>

                      <Button
                        size="sm"
                        variant={t.status === "Pending" ? "default" : "outline"}
                        onClick={() => {
                          onUpdateStatus(t.id, "Pending");
                          toast.info(`Marked ${t.medicine} as PENDING`);
                        }}
                        className="rounded-xl text-xs font-semibold"
                      >
                        Pending
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          onUpdateStatus(t.id, "Missed");
                          toast.warning(`Marked ${t.medicine} as MISSED`);
                        }}
                        className="rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="mr-1 h-3.5 w-3.5" /> Missed
                      </Button>
                    </div>
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
