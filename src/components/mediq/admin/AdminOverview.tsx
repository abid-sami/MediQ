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
  const totalBeds = hospitals.reduce((acc, h) => acc + h.totalBeds, 0);
  const availableBeds = hospitals.reduce((acc, h) => acc + h.availableBeds, 0);

  const cards = [
    { title: "Total Patients", value: "14,892", sub: "Registered across network", icon: Users, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "users" },
    { title: "Total Doctors", value: "348", sub: "On duty consultants", icon: Stethoscope, color: "text-teal", bg: "bg-teal/10 border-teal/20", tab: "users" },
    { title: "Total Staff", value: "1,240", sub: "Nurses, Pharmacists & Techs", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20", tab: "users" },
    { title: "Total Hospitals", value: hospitals.length, sub: "Enterprise hospital centers", icon: Building2, color: "text-blue-500", bg: "bg-blue-500/10 border-blue-500/20", tab: "hospitals" },
    { title: "Total Beds", value: totalBeds, sub: "Across all wards", icon: Bed, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "beds" },
    { title: "Available Beds", value: availableBeds, sub: "Ready for admissions", icon: Bed, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tab: "beds" },
    { title: "Active Ambulances", value: "18", sub: "ALS & BLS units on duty", icon: Siren, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", tab: "emergency" },
    { title: "Active SOS Requests", value: sosItems.length, sub: "Trauma emergency calls", icon: Siren, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20", tab: "emergency" },
    { title: "Today's Appointments", value: "312", sub: "Scheduled consultations", icon: Calendar, color: "text-primary", bg: "bg-primary/10 border-primary/20", tab: "appointments" },
    { title: "Pending Lab Tests", value: "12", sub: "Processing in pathology", icon: Microscope, color: "text-teal", bg: "bg-teal/10 border-teal/20", tab: "diagnostics" },
    { title: "Pharmacy Orders", value: "48", sub: "Active e-Prescriptions", icon: Pill, color: "text-amber-500", bg: "bg-amber-500/10 border-amber-500/20", tab: "pharmacy" },
    { title: "Blood Requests", value: "7", sub: "Pending transfusion holds", icon: Droplet, color: "text-red-500", bg: "bg-red-500/10 border-red-500/20", tab: "blood-bank" },
    { title: "Total Revenue", value: "$482.5K", sub: "YTD billing collection", icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20", tab: "billing" },
  ];

  const activityFeed = [
    { time: "10:42 PM", text: "New SOS emergency request received (Severe Chest Pain - Unit #ALS-911 dispatched)", type: "emergency" },
    { time: "10:39 PM", text: "Appointment booked with Dr. Sarah Rahman for patient Sami", type: "appointment" },
    { time: "10:35 PM", text: "Blood request approved for 2 units O+ Blood", type: "blood" },
    { time: "10:31 PM", text: "Lab report verified for Cardiac Troponin I (hs-cTnI)", type: "lab" },
    { time: "10:25 PM", text: "e-Prescription verified by Pharmacist Tariq Anwar", type: "pharmacy" },
  ];

  return (
    <div className="space-y-6">
      {/* Personalized Greeting Header */}
      <div className="gradient-primary p-6 rounded-3xl text-primary-foreground shadow-lift flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
            <Badge className="bg-white/20 text-white font-mono text-xs uppercase font-bold">
              SYSTEM LEVEL 1 COMMAND AUTHORIZED
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-2">
            Good Morning, Admin
          </h1>
          <p className="text-sm font-semibold opacity-90 mt-0.5">
            Welcome to <strong>MediQ Control Center</strong> • Global Enterprise Operations
          </p>
        </div>
      </div>

      {/* 13 Live Overview KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
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

      {/* Analytics & Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Analytics Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" /> Network Growth & Revenue Trajectory
                </h3>
                <p className="text-xs text-muted-foreground">
                  Monthly patient admissions and monthly platform billing collection ($).
                </p>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                +14.8% YoY
              </Badge>
            </div>

            {/* Simulated Visual Chart */}
            <div className="h-48 rounded-2xl bg-muted/20 border border-border p-4 flex items-end justify-between gap-3">
              {[40, 55, 65, 50, 75, 90, 85, 110, 125, 140, 155, 180].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                  <div
                    className="w-full gradient-primary rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(h / 180) * 100}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-mono">M{i + 1}</span>
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
                <Activity className="h-4 w-4 text-teal" /> Real-Time Activity Feed
              </h3>
              <Badge variant="outline" className="text-[10px] font-mono">LIVE</Badge>
            </div>

            <div className="space-y-3 text-xs">
              {activityFeed.map((act, i) => (
                <div key={i} className="p-3 rounded-xl border border-border/80 bg-muted/20 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-primary">{act.time}</span>
                    <Badge variant="outline" className="text-[9px] capitalize">{act.type}</Badge>
                  </div>
                  <p className="font-semibold text-foreground">{act.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
