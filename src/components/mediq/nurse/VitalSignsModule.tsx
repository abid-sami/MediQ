import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Activity,
  Plus,
  Clock,
  CheckCircle2,
  HeartPulse,
  Thermometer,
  Wind,
  Weight,
  User,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { VitalSignRecord, NursePatient } from "@/data/nurse-data";

interface VitalSignsModuleProps {
  patients: NursePatient[];
  vitalRecords: VitalSignRecord[];
  activePatient?: NursePatient | null;
  onRecordVitals: (record: VitalSignRecord) => void;
}

export function VitalSignsModule({
  patients,
  vitalRecords,
  activePatient,
  onRecordVitals,
}: VitalSignsModuleProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    activePatient ? activePatient.id : patients[0]?.id || ""
  );

  const targetPatient =
    patients.find((p) => p.id === selectedPatientId) || activePatient || patients[0];

  // Vitals form
  const [bpSystolic, setBpSystolic] = useState("130");
  const [bpDiastolic, setBpDiastolic] = useState("85");
  const [pulse, setPulse] = useState("78");
  const [temp, setTemp] = useState("98.6");
  const [spo2, setSpo2] = useState("98");
  const [rr, setRr] = useState("18");
  const [weight, setWeight] = useState("76");

  const handleSubmitVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPatient) return;

    const newRecord: VitalSignRecord = {
      id: `v-${Date.now()}`,
      patientId: targetPatient.id,
      patientName: targetPatient.name,
      bp: `${bpSystolic}/${bpDiastolic}`,
      pulse: Number(pulse),
      temp: Number(temp),
      spo2: Number(spo2),
      rr: Number(rr),
      weight: Number(weight),
      recordedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      recordedBy: "Elena Vance, RN",
    };

    onRecordVitals(newRecord);
    toast.success(`Recorded Vitals for ${targetPatient.name}`, {
      description: `BP: ${newRecord.bp} | HR: ${newRecord.pulse} bpm | SpO2: ${newRecord.spo2}%`,
    });
  };

  const patientHistory = vitalRecords.filter((v) => v.patientId === targetPatient?.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Bedside Vital Signs Recorder
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log Blood Pressure, Heart Rate, Temperature, SpO2, Respiratory Rate, and Weight in real-time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmitVitals} className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="w-full max-w-xs">
                <Label className="text-xs font-bold text-muted-foreground uppercase">Target Patient</Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Select patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.bedNo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {targetPatient && (
                <div className="text-right">
                  <Badge variant="outline" className="text-xs font-bold text-primary">
                    {targetPatient.bedNo}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-0.5">{targetPatient.diagnosis}</p>
                </div>
              )}
            </div>

            {/* Vital Signs Input Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* BP */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <HeartPulse className="h-4 w-4 text-destructive" /> Blood Pressure (mmHg)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={bpSystolic}
                    onChange={(e) => setBpSystolic(e.target.value)}
                    placeholder="Sys"
                    className="rounded-xl text-xs font-bold"
                  />
                  <span>/</span>
                  <Input
                    type="number"
                    value={bpDiastolic}
                    onChange={(e) => setBpDiastolic(e.target.value)}
                    placeholder="Dia"
                    className="rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Heart Rate */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-teal" /> Heart Rate (bpm)
                </Label>
                <Input
                  type="number"
                  value={pulse}
                  onChange={(e) => setPulse(e.target.value)}
                  className="rounded-xl text-xs font-bold"
                />
              </div>

              {/* Temperature */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Thermometer className="h-4 w-4 text-amber-500" /> Temperature (°F)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(e.target.value)}
                  className="rounded-xl text-xs font-bold"
                />
              </div>

              {/* SpO2 */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Wind className="h-4 w-4 text-emerald-500" /> Oxygen Saturation (SpO2 %)
                </Label>
                <Input
                  type="number"
                  value={spo2}
                  onChange={(e) => setSpo2(e.target.value)}
                  className="rounded-xl text-xs font-bold"
                />
              </div>

              {/* Respiratory Rate */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-primary" /> Respiratory Rate (bpm)
                </Label>
                <Input
                  type="number"
                  value={rr}
                  onChange={(e) => setRr(e.target.value)}
                  className="rounded-xl text-xs font-bold"
                />
              </div>

              {/* Weight */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
                <Label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Weight className="h-4 w-4 text-purple-500" /> Body Weight (kg)
                </Label>
                <Input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Save & Log Vital Measurements
            </Button>
          </form>
        </div>

        {/* History Column */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <History className="h-4 w-4 text-teal" /> Measurement Timeline History
            </h3>

            <div className="space-y-3">
              {patientHistory.map((rec) => (
                <div key={rec.id} className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{rec.recordedAt}</span>
                    <span className="text-[10px] text-muted-foreground">{rec.recordedBy}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 font-mono text-[11px] pt-1">
                    <div>BP: <strong>{rec.bp}</strong></div>
                    <div>HR: <strong className="text-teal">{rec.pulse}</strong></div>
                    <div>SpO2: <strong className="text-emerald-500">{rec.spo2}%</strong></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
