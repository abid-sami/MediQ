import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Clock,
  Pill,
  Bed,
  Stethoscope,
  AlertTriangle,
  Users,
  ArrowUpRight,
  Activity,
  CheckCircle2,
  ShieldAlert,
  Play,
} from "lucide-react";
import {
  NursePatient,
  MedicationTask,
  WardBed,
  NurseAlert,
} from "@/data/nurse-data";

interface NurseOverviewProps {
  currentWard: string;
  patients: NursePatient[];
  medicationTasks: MedicationTask[];
  beds: WardBed[];
  alerts: NurseAlert[];
  onNavigateTab: (tab: string) => void;
  onOpenPatientProfile: (patient: NursePatient) => void;
  onResolveAlert: (id: string) => void;
}

export function NurseOverview({
  currentWard,
  patients,
  medicationTasks,
  beds,
  alerts,
  onNavigateTab,
  onOpenPatientProfile,
  onResolveAlert,
}: NurseOverviewProps) {
  const pendingTasksCount = medicationTasks.filter((m) => m.status === "Pending").length;
  const medTasksCount = medicationTasks.length;
  const availableBedsCount = beds.filter((b) => b.status === "Available").length;
  const doctorRequestsCount = alerts.filter((a) => a.alertType === "Doctor requested").length;
  const activeCriticalAlerts = alerts.filter((a) => !a.resolved);

  const kpis = [
    {
      title: "Current Ward",
      value: "Ward 4A",
      sub: currentWard,
      icon: Building2,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      tab: "ward",
    },
    {
      title: "Pending Tasks",
      value: pendingTasksCount,
      sub: "Shift bedside actions",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "medication-tasks",
    },
    {
      title: "Medication Tasks",
      value: medTasksCount,
      sub: "Scheduled drug doses",
      icon: Pill,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "medication-tasks",
    },
    {
      title: "Available Beds",
      value: availableBedsCount,
      sub: `Out of ${beds.length} ward beds`,
      icon: Bed,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "beds",
    },
    {
      title: "Doctor Requests",
      value: doctorRequestsCount,
      sub: "STAT physician orders",
      icon: Stethoscope,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "alerts",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {kpis.map((kpi, i) => {
          const IconComp = kpi.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(kpi.tab)}
              className={`p-4 rounded-2xl border ${kpi.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.title}
                </span>
                <IconComp className={`h-4 w-4 ${kpi.color}`} />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-foreground">{kpi.value}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Critical Bedside Alerts & Patients */}
        <div className="lg:col-span-2 space-y-6">
          {/* Critical Alerts Banner */}
          <div className="bg-card border-2 border-red-500/40 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5 animate-pulse" /> Active Bedside Alerts ({activeCriticalAlerts.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Urgent patient conditions requiring immediate nursing action.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("alerts")}
                className="text-xs font-semibold text-destructive"
              >
                All Alerts <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3">
              {activeCriticalAlerts.map((al) => (
                <div
                  key={al.id}
                  className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white font-bold text-[10px]">
                        {al.severity}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary font-bold text-[10px]">
                        {al.bedNo}
                      </Badge>
                      <h4 className="font-bold text-foreground">{al.patientName}</h4>
                    </div>
                    <p className="text-muted-foreground mt-1">{al.message}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onResolveAlert(al.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Resolve
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Patients Quick Table */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Shift Assigned Patients ({patients.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Bedside roster for Ward 4A.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("my-patients")}
                className="text-xs font-semibold text-primary"
              >
                View Roster <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-2.5">
              {patients.map((pat) => (
                <div
                  key={pat.id}
                  onClick={() => onOpenPatientProfile(pat)}
                  className="p-3.5 rounded-xl border border-border/80 bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                      {pat.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-foreground">{pat.name}</h4>
                        <Badge variant="outline" className="text-[10px]">
                          {pat.bedNo}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-[11px] truncate max-w-xs">{pat.diagnosis}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-muted-foreground block">BP / SPO2</span>
                      <span className="font-bold">{pat.latestVitals.bp} | <span className="text-emerald-500">{pat.latestVitals.spo2}</span></span>
                    </div>

                    <Badge
                      className={
                        pat.conditionStatus === "Critical"
                          ? "bg-red-500 text-white font-bold"
                          : pat.conditionStatus === "Monitoring"
                          ? "bg-amber-500 text-white font-bold"
                          : "bg-emerald-500 text-white font-bold"
                      }
                    >
                      {pat.conditionStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Medication Tasks Queue */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Pill className="h-4 w-4 text-teal" /> Medication Tasks Queue
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("medication-tasks")}
                className="text-[11px] font-semibold text-teal p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {medicationTasks.map((t) => (
                <div key={t.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{t.patientName}</span>
                    <Badge variant="outline" className="text-[10px]">{t.bedNo}</Badge>
                  </div>
                  <p className="font-semibold text-foreground">{t.medicine} ({t.dose})</p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3 w-3 text-amber-500" /> {t.time}
                    </span>
                    <Badge
                      className={
                        t.status === "Given"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]"
                          : "bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px]"
                      }
                    >
                      {t.status}
                    </Badge>
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
