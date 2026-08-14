import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Stethoscope,
  Building2,
  Bed,
  Siren,
  Calendar,
  Microscope,
  Pill,
  Droplet,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import {
  SystemUser,
  NetworkHospital,
  AdminSOSItem,
  AdminAuditLog,
} from "@/data/admin-data";

interface AdminOverviewProps {
  users: SystemUser[];
  hospitals: NetworkHospital[];
  sosItems: AdminSOSItem[];
  logs: AdminAuditLog[];
  onNavigateTab: (tab: string) => void;
}

export function AdminOverview({
  users,
  hospitals,
  sosItems,
  logs,
  onNavigateTab,
}: AdminOverviewProps) {
  const patientCount = users.filter((u) => u.role === "Patient").length;
  const doctorCount = users.filter((u) => u.role === "Doctor").length;
  const staffCount = users.filter((u) => u.role !== "Patient" && u.role !== "Doctor").length;
  const totalBeds = hospitals.reduce((acc, h) => acc + (h.totalBeds || 0), 0);
  const availableBeds = hospitals.reduce((acc, h) => acc + (h.availableBeds || 0), 0);

  const cards = [
    { title: "Total Patients", value: patientCount, sub: "Registered patient profiles", icon: Users, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "patients" },
    { title: "Total Doctors", value: doctorCount, sub: "Clinical medical specialists", icon: Stethoscope, color: "text-teal", bg: "bg-teal/10 border-teal/20", tab: "doctors" },
    { title: "Total Staff", value: staffCount, sub: "Nurses, Pharmacists & Techs", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", tab: "users" },
    { title: "Total Hospitals", value: hospitals.length, sub: "Network healthcare centers", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", tab: "hospitals" },
    { title: "Total Beds", value: totalBeds, sub: "Inpatient facilities capacity", icon: Bed, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "beds" },
    { title: "Available Beds", value: availableBeds, sub: "Available for admissions", icon: Bed, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tab: "beds" },
    { title: "Active Ambulances", value: sosItems.length > 0 ? sosItems.length : 0, sub: "Tracked emergency units", icon: Siren, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", tab: "ambulances" },
    { title: "Active SOS", value: sosItems.length, sub: "Live emergency dispatches", icon: Siren, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", tab: "emergency" },
    { title: "System Logs", value: logs.length, sub: "Audit logs captured", icon: Activity, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "audit-logs" },
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Header */}
      <div className="gradient-primary p-6 rounded-3xl text-primary-foreground shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <Badge className="bg-white/20 text-white font-mono text-xs uppercase font-bold">
              SUPER ADMIN GOVERNANCE COMMAND
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            System Control Center
          </h1>
          <p className="text-sm font-semibold opacity-90 mt-0.5">
            Welcome to <strong>MediQ Platform Operations</strong> • Real-Time Database Sync
          </p>
        </div>
      </div>

      {/* Live Overview KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const IconComp = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-4 rounded-2xl border ${card.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground truncate">
                  {card.title}
                </span>
                <IconComp className={`h-4 w-4 ${card.color}`} />
              </div>

              <div>
                <span className="text-2xl font-extrabold text-foreground">{card.value}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{card.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Analytics Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Platform Capacity & Activity Growth
                </h3>
                <p className="text-xs text-muted-foreground">
                  Real-time workload distribution and system usage telemetry across connected nodes.
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                Live Data Synchronized
              </Badge>
            </div>

            {/* Dynamic Visual Chart */}
            <div className="h-48 rounded-2xl bg-muted/20 border border-border p-4 flex items-end justify-between gap-3">
              {[users.length * 3 + 10, hospitals.length * 15 + 20, sosItems.length * 25 + 15, logs.length * 2 + 30, 45, 60, 75, 90, 110, 130, 150, 180].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full gradient-primary rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${Math.min(100, Math.max(15, (h / 180) * 100))}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono">Q{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Activity Feed */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal" /> Real-Time Audit Feed
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">LIVE</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {logs.length > 0 ? (
                logs.slice(0, 5).map((log, i) => (
                  <div key={log.id || i} className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold text-primary">{log.time || log.date || "Just now"}</span>
                      <Badge variant="outline" className="text-[9px] capitalize">{log.role || "User"}</Badge>
                    </div>
                    <p className="font-semibold text-foreground">{log.action || log.user}</p>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-semibold">No recent activity logs</p>
                  <p className="text-[10px]">Operations will stream live as users interact</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
