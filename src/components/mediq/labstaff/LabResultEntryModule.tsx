import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileCheck,
  Plus,
  Trash2,
  Paperclip,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { LabResultParameter, LabTestOrder } from "@/data/lab-staff-data";

interface LabResultEntryModuleProps {
  orders: LabTestOrder[];
  parameters: LabResultParameter[];
  onSaveResults: (parameters: LabResultParameter[]) => void;
}

export function LabResultEntryModule({
  orders,
  parameters: initialParams,
  onSaveResults,
}: LabResultEntryModuleProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");
  const [params, setParams] = useState<LabResultParameter[]>(initialParams);

  // New parameter state
  const [paramName, setParamName] = useState("");
  const [measuredResult, setMeasuredResult] = useState("");
  const [referenceRange, setReferenceRange] = useState("");
  const [units, setUnits] = useState("");
  const [status, setStatus] = useState<LabResultParameter["status"]>("Normal");
  const [notes, setNotes] = useState("");

  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleAddParameter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paramName || !measuredResult) return;

    const newParam: LabResultParameter = {
      id: `res-${Date.now()}`,
      parameterName: paramName,
      measuredResult,
      referenceRange,
      units,
      status,
      notes,
    };

    setParams((prev) => [...prev, newParam]);
    setParamName("");
    setMeasuredResult("");
    setReferenceRange("");
    setUnits("");
    setNotes("");
    toast.success(`Added parameter ${paramName}`);
  };

  const handleRemoveParameter = (id: string) => {
    setParams((prev) => prev.filter((p) => p.id !== id));
  };

  const handleFinalizeReport = () => {
    onSaveResults(params);
    toast.success(`Finalized Diagnostic Results for ${activeOrder?.patientName}`, {
      description: `Report Generated & Marked Ready for Physician Review`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <FileCheck className="h-6 w-6 text-teal" /> Structured Result Parameter Entry Station
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Enter measured analyte values, reference ranges, units, and clinical pathologist notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="w-full max-w-xs">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Target Requisition</Label>
                <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Select order..." />
                  </SelectTrigger>
                  <SelectContent>
                    {orders.map((o) => (
                      <SelectItem key={o.id} value={o.id}>
                        {o.testId} — {o.patientName} ({o.testName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {activeOrder && (
                <div className="text-right">
                  <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                    {activeOrder.testId}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-0.5">{activeOrder.testName}</p>
                </div>
              )}
            </div>

            {/* Existing Parameters Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Recorded Parameter Values ({params.length})
              </h3>

              <div className="border border-border rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-muted/40 text-muted-foreground font-bold border-b border-border">
                      <th className="p-3">Parameter Name</th>
                      <th className="p-3">Result</th>
                      <th className="p-3">Reference Range</th>
                      <th className="p-3">Units</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {params.map((p) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="p-3 font-bold text-foreground">{p.parameterName}</td>
                        <td className="p-3 font-mono font-bold text-primary">{p.measuredResult}</td>
                        <td className="p-3 text-muted-foreground">{p.referenceRange}</td>
                        <td className="p-3 text-muted-foreground font-mono">{p.units}</td>
                        <td className="p-3">
                          <Badge
                            className={
                              p.status === "Critical"
                                ? "bg-red-500 text-white font-bold animate-pulse text-[10px]"
                                : p.status === "High"
                                ? "bg-amber-500 text-white font-bold text-[10px]"
                                : p.status === "Low"
                                ? "bg-purple-500 text-white text-[10px]"
                                : "bg-emerald-500 text-white text-[10px]"
                            }
                          >
                            {p.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveParameter(p.id)}
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Parameter Form */}
            <form onSubmit={handleAddParameter} className="p-4 rounded-xl bg-muted/20 border border-border space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
                + Add Result Parameter
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Parameter Name</Label>
                  <Input value={paramName} onChange={(e) => setParamName(e.target.value)} placeholder="e.g. Hemoglobin / hs-cTnI" className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Measured Result</Label>
                  <Input value={measuredResult} onChange={(e) => setMeasuredResult(e.target.value)} placeholder="e.g. 14.2 / 42.5" className="mt-1 rounded-xl text-xs font-mono font-bold" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Reference Range</Label>
                  <Input value={referenceRange} onChange={(e) => setReferenceRange(e.target.value)} placeholder="e.g. 12.0 - 16.0" className="mt-1 rounded-xl text-xs font-mono" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Units</Label>
                  <Input value={units} onChange={(e) => setUnits(e.target.value)} placeholder="e.g. g/dL, pg/mL, mg/dL" className="mt-1 rounded-xl text-xs font-mono" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Status Indicator</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as LabResultParameter["status"])}>
                    <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Pathologist Clinical Notes</Label>
                <Textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Clinical interpretation or diagnostic remarks..." className="mt-1 rounded-xl text-xs" />
              </div>

              <Button type="submit" variant="outline" className="w-full font-bold text-xs rounded-xl">
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Parameter Row
              </Button>
            </form>

            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => toast.info("Supporting document attachment uploaded successfully")}
                className="text-xs font-semibold rounded-xl"
              >
                <Paperclip className="mr-1.5 h-4 w-4 text-teal" /> Attach Supporting Document / Chart
              </Button>

              <Button
                onClick={handleFinalizeReport}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl px-6 py-5 shadow-md"
              >
                <Save className="mr-1.5 h-4 w-4" /> Finalize Results & Generate Report
              </Button>
            </div>
          </div>
        </div>

        {/* Info Column */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3 shadow-xs text-xs">
            <h3 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <FileText className="h-4 w-4 text-primary" /> Pathologist Verification Guidelines
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Verify all critical values against biological reference intervals prior to releasing electronic diagnostic reports to attending physicians.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
