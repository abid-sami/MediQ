import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  TestTube,
  Cpu,
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ShieldAlert,
  Microscope,
} from "lucide-react";
import {
  LabTestOrder,
  LabProcessingItem,
} from "@/data/lab-staff-data";

interface LabStaffOverviewProps {
  orders: LabTestOrder[];
  processingItems: LabProcessingItem[];
  onNavigateTab: (tab: string) => void;
  onUpdateOrderStatus: (id: string, status: any) => void;
}

export function LabStaffOverview({
  orders,
  processingItems,
  onNavigateTab,
  onUpdateOrderStatus,
}: LabStaffOverviewProps) {
  const pendingCount = orders.filter((o) => o.status === "Requested" || o.status === "Sample Pending").length;
  const samplesToCollectCount = orders.filter((o) => o.status === "Sample Pending").length;
  const processingCount = orders.filter((o) => o.status === "Processing").length;
  const reportsReadyCount = orders.filter((o) => o.status === "Report Ready").length;
  const completedCount = orders.filter((o) => o.status === "Completed").length;
  const urgentCount = orders.filter((o) => o.priority === "STAT Emergency" || o.priority === "Urgent").length;

  const statUrgentOrders = orders.filter((o) => o.priority === "STAT Emergency" && o.status !== "Completed");

  const cards = [
    {
      title: "Pending Tests",
      value: pendingCount,
      sub: "Awaiting sample / processing",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "test-orders",
    },
    {
      title: "Samples to Collect",
      value: samplesToCollectCount,
      sub: "Venous blood & urine",
      icon: TestTube,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "sample-collection",
    },
    {
      title: "Samples Processing",
      value: processingCount,
      sub: "In automated analyzer",
      icon: Cpu,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "processing",
    },
    {
      title: "Reports Ready",
      value: reportsReadyCount,
      sub: "Needs pathologist review",
      icon: FileCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "reports",
    },
    {
      title: "Completed Tests",
      value: completedCount,
      sub: "Finalized & released",
      icon: CheckCircle2,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      tab: "test-orders",
    },
    {
      title: "Urgent Tests",
      value: urgentCount,
      sub: "STAT Emergency priority",
      icon: AlertTriangle,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      tab: "test-orders",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 6 KPI Display Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-3.5 rounded-2xl border ${card.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {card.title}
                </span>
                <IconComp className={`h-3.5 w-3.5 ${card.color}`} />
              </div>

              <div>
                <span className="text-2xl font-extrabold text-foreground">{card.value}</span>
                <p className="text-[9px] text-muted-foreground mt-0.5 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: STAT Emergency Requisitions Feed */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-2 border-red-500/40 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5 animate-pulse" /> STAT Emergency Test Requisitions ({statUrgentOrders.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  High-priority cardiac & ICU diagnostic investigations.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("test-orders")}
                className="text-xs font-semibold text-destructive"
              >
                All Orders <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3">
              {statUrgentOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white font-bold text-[10px] animate-pulse">
                        🚨 STAT EMERGENCY
                      </Badge>
                      <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                        {ord.testId}
                      </Badge>
                    </div>

                    <h4 className="font-bold text-foreground mt-1 text-sm">{ord.testName}</h4>
                    <p className="text-muted-foreground mt-0.5">
                      Patient: <strong className="text-foreground">{ord.patientName}</strong> ({ord.patientAge}y) | Prescriber: {ord.doctorName}
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onNavigateTab("results")}
                    className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shrink-0"
                  >
                    <Microscope className="mr-1.5 h-3.5 w-3.5" /> Enter Results
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Active Analyzer Runs */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-teal" /> Active Analyzer Runs
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("processing")}
                className="text-[11px] font-semibold text-teal p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {processingItems.map((item) => (
                <div key={item.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-primary">{item.sampleId}</span>
                    <Badge variant="outline" className="text-[10px] text-teal">{item.status}</Badge>
                  </div>
                  <p className="font-bold text-foreground truncate">{item.testName}</p>
                  <p className="text-muted-foreground text-[11px]">Patient: {item.patientName}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
