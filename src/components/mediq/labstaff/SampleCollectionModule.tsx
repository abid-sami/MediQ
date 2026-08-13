import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  TestTube,
  CheckCircle2,
  Clock,
  QrCode,
  User,
  Stethoscope,
  Building2,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { LabTestOrder } from "@/data/lab-staff-data";

interface SampleCollectionModuleProps {
  orders: LabTestOrder[];
  onCollectSample: (id: string, containerId: string, time: string) => void;
}

export function SampleCollectionModule({
  orders,
  onCollectSample,
}: SampleCollectionModuleProps) {
  const pendingCollection = orders.filter(
    (o) => o.status === "Sample Pending" || o.status === "Requested"
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    pendingCollection[0]?.id || null
  );
  const [containerBarcode, setContainerBarcode] = useState("BC-90899");

  const activeOrder =
    orders.find((o) => o.id === selectedOrderId) || pendingCollection[0];

  const handleConfirmCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrder) return;

    const collectionTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    onCollectSample(activeOrder.id, containerBarcode, collectionTime);
    toast.success(`Sample Collected for ${activeOrder.patientName}`, {
      description: `Container ID: ${containerBarcode} | Test: ${activeOrder.testName}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-6 w-6 text-emerald-500" /> Specimen & Sample Collection Station
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log venous blood, serum SST, and urine specimen collections with barcode container IDs.
          </p>
        </div>

        <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs px-3 py-1.5 border border-amber-500/30">
          Samples Pending: {pendingCollection.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Queue Column */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Awaiting Collection ({pendingCollection.length})
          </h3>

          <div className="space-y-2.5">
            {pendingCollection.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrderId(ord.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs space-y-1.5 ${
                  activeOrder?.id === ord.id
                    ? "bg-primary/10 border-primary ring-1 ring-primary/30"
                    : "bg-card border-border hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-primary">{ord.testId}</span>
                  <Badge
                    className={
                      ord.priority === "STAT Emergency"
                        ? "bg-red-500 text-white font-bold animate-pulse text-[10px]"
                        : ord.priority === "Urgent"
                        ? "bg-amber-500 text-white font-bold text-[10px]"
                        : "bg-blue-500 text-white text-[10px]"
                    }
                  >
                    {ord.priority}
                  </Badge>
                </div>

                <h4 className="font-bold text-foreground">{ord.patientName} ({ord.patientAge}y)</h4>
                <p className="text-muted-foreground truncate">{ord.testName}</p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block pt-1">
                  Container: {ord.sampleType}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Logger Form */}
        <div className="lg:col-span-2 space-y-6">
          {activeOrder ? (
            <form onSubmit={handleConfirmCollection} className="bg-card border border-border rounded-2xl p-6 space-y-6 shadow-xs">
              <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                    {activeOrder.testId}
                  </Badge>
                  <h3 className="text-lg font-bold text-foreground mt-1">{activeOrder.testName}</h3>
                  <p className="text-xs text-muted-foreground">
                    Patient: <strong className="text-foreground">{activeOrder.patientName}</strong> ({activeOrder.patientAge}y) | Doctor: {activeOrder.doctorName}
                  </p>
                </div>

                <Badge
                  className={
                    activeOrder.priority === "STAT Emergency"
                      ? "bg-red-500 text-white font-bold text-xs animate-pulse"
                      : "bg-primary text-primary-foreground font-bold text-xs"
                  }
                >
                  {activeOrder.priority}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
                  <span className="text-muted-foreground block text-[10px]">REQUIRED CONTAINER TYPE</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block">
                    {activeOrder.sampleType}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
                  <span className="text-muted-foreground block text-[10px]">PRESCRIBING DEPARTMENT</span>
                  <span className="font-bold text-foreground text-sm block">{activeOrder.category}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground flex items-center gap-1">
                    <QrCode className="h-4 w-4 text-primary" /> Barcode Specimen Container ID
                  </Label>
                  <Input
                    value={containerBarcode}
                    onChange={(e) => setContainerBarcode(e.target.value)}
                    required
                    placeholder="Scan or type container barcode ID..."
                    className="mt-1.5 rounded-xl text-xs font-mono font-bold"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-6 text-sm shadow-md">
                <CheckCircle2 className="mr-2 h-5 w-5" /> Mark Sample Collected & Log Container Barcode
              </Button>
            </form>
          ) : (
            <div className="p-8 text-center bg-card border border-border rounded-2xl">
              <p className="text-xs text-muted-foreground">All pending samples have been collected!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
