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
  Droplet,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Siren,
  Building2,
  BookmarkCheck,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { BloodRequestItem, RequestStatus, RequestUrgency } from "@/data/blood-bank-data";

interface BloodRequestsModuleProps {
  requests: BloodRequestItem[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReserve: (id: string) => void;
  onFulfill: (id: string) => void;
}

export function BloodRequestsModule({
  requests,
  onApprove,
  onReject,
  onReserve,
  onFulfill,
}: BloodRequestsModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("All");

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.requestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.hospitalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = urgencyFilter === "All" || r.urgency === urgencyFilter;
    return matchesSearch && matchesUrgency;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Droplet className="h-6 w-6 text-red-500" /> Patient Blood Requisition & Fulfillment
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Process hospital blood requests with urgency levels: Normal, Urgent, and 🚨 Emergency.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search patient, request ID, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
          <SelectTrigger className="h-9 w-full sm:w-44 text-xs rounded-xl">
            <SelectValue placeholder="Urgency level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Urgencies</SelectItem>
            <SelectItem value="Emergency">🚨 Emergency</SelectItem>
            <SelectItem value="Urgent">⚡ Urgent</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Requests Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase tracking-wider">
                <th className="p-4">Request ID & Date</th>
                <th className="p-4">Patient & Doctor</th>
                <th className="p-4">Group & Units</th>
                <th className="p-4">Hospital / Ward</th>
                <th className="p-4">Urgency</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Process Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <p className="font-mono font-bold text-primary">{r.requestId}</p>
                    <p className="text-[11px] text-muted-foreground">{r.requiredDate}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-foreground">{r.patientName} ({r.patientAge}y)</p>
                    <p className="text-[11px] text-muted-foreground">Prescriber: {r.doctorName}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <Badge className="bg-red-500 text-white font-bold text-xs">
                        {r.bloodGroup}
                      </Badge>
                      <span className="font-bold text-foreground">{r.unitsNeeded} Unit(s)</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground max-w-xs truncate">{r.hospitalName}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        r.urgency === "Emergency"
                          ? "bg-red-500 text-white font-bold animate-pulse"
                          : r.urgency === "Urgent"
                          ? "bg-amber-500 text-white font-bold"
                          : "bg-blue-500 text-white"
                      }
                    >
                      {r.urgency}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <Badge
                      className={
                        r.status === "Fulfilled"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                          : r.status === "Approved"
                          ? "bg-teal/20 text-teal font-bold"
                          : r.status === "Reserved"
                          ? "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold"
                          : r.status === "Rejected"
                          ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                      }
                    >
                      {r.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {r.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => {
                              onApprove(r.id);
                              toast.success(`Approved Request ${r.requestId}`);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg h-8"
                          >
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              onReserve(r.id);
                              toast.info(`Reserved units for ${r.patientName}`);
                            }}
                            className="rounded-lg text-[11px] font-semibold text-purple-600 border-purple-500/30 h-8"
                          >
                            <BookmarkCheck className="mr-1 h-3.5 w-3.5" /> Reserve
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              onReject(r.id);
                              toast.error(`Rejected Request ${r.requestId}`);
                            }}
                            className="rounded-lg text-[11px] font-semibold text-destructive hover:bg-destructive/10 h-8"
                          >
                            <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                          </Button>
                        </>
                      )}

                      {(r.status === "Approved" || r.status === "Reserved") && (
                        <Button
                          size="sm"
                          onClick={() => {
                            onFulfill(r.id);
                            toast.success(`Marked Request ${r.requestId} as FULFILLED`);
                          }}
                          className="gradient-primary text-primary-foreground font-bold text-[11px] rounded-lg h-8 shadow-xs"
                        >
                          <CheckCheck className="mr-1 h-3.5 w-3.5" /> Mark Fulfilled
                        </Button>
                      )}

                      {r.status === "Fulfilled" && (
                        <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          ✓ Dispensed
                        </span>
                      )}
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
