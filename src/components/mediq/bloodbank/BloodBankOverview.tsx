import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Droplet,
  Siren,
  Clock,
  CheckCircle2,
  BookmarkCheck,
  ArrowUpRight,
  ShieldAlert,
  TestTube,
  Activity,
  Heart,
} from "lucide-react";
import {
  BloodGroupItem,
  BloodRequestItem,
  BloodDonation,
  BloodReservation,
} from "@/data/blood-bank-data";

interface BloodBankOverviewProps {
  groups: BloodGroupItem[];
  requests: BloodRequestItem[];
  donations: BloodDonation[];
  reservations: BloodReservation[];
  onNavigateTab: (tab: string) => void;
  onApproveRequest: (id: string) => void;
}

export function BloodBankOverview({
  groups,
  requests,
  donations,
  reservations,
  onNavigateTab,
  onApproveRequest,
}: BloodBankOverviewProps) {
  const totalUnitsAvailable = groups.reduce((acc, c) => acc + c.availableUnits, 0);
  const totalUnitsReserved = groups.reduce((acc, c) => acc + c.reservedUnits, 0);
  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length;
  const emergencyRequests = requests.filter((r) => r.urgency === "Emergency" && r.status === "Pending");
  const todaysDonationsCount = donations.length;

  const keyMetrics = [
    {
      title: "Total Blood Units",
      value: totalUnitsAvailable,
      sub: "Central bank inventory",
      icon: Droplet,
      color: "text-red-500",
      bg: "bg-red-500/10 border-red-500/20",
      tab: "inventory",
    },
    {
      title: "Pending Requests",
      value: pendingRequestsCount,
      sub: "Hospital requisitions",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "requests",
    },
    {
      title: "Emergency Requests",
      value: emergencyRequests.length,
      sub: "Immediate priority",
      icon: Siren,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      tab: "requests",
    },
    {
      title: "Today's Donations",
      value: todaysDonationsCount,
      sub: "Voluntary drives logged",
      icon: TestTube,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "donations",
    },
    {
      title: "Reserved Units",
      value: totalUnitsReserved,
      sub: "Surgery & ICU standby",
      icon: BookmarkCheck,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "reservations",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {keyMetrics.map((m, i) => {
          const IconComp = m.icon;
          return (
            <div
              key={i}
              onClick={() => onNavigateTab(m.tab)}
              className={`p-4 rounded-2xl border ${m.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-2 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {m.title}
                </span>
                <IconComp className={`h-4 w-4 ${m.color}`} />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-foreground">{m.value}</span>
                <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{m.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Blood Group Statistics Grid (All 8 Groups) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold flex items-center gap-2">
            <Droplet className="h-4 w-4 text-red-500 animate-pulse" /> Live Blood Inventory Statistics (8 Blood Groups)
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigateTab("inventory")}
            className="text-xs font-semibold text-red-500"
          >
            Manage Inventory <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          {groups.map((g) => (
            <div
              key={g.group}
              onClick={() => onNavigateTab("inventory")}
              className={`p-4 rounded-2xl border cursor-pointer transition-all card-lift space-y-2 bg-card ${
                g.status === "Critical"
                  ? "border-red-500/50 bg-red-500/10 ring-1 ring-red-500/30"
                  : g.status === "Low"
                  ? "border-amber-500/40 bg-amber-500/10"
                  : "border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-red-500 flex items-center gap-1">
                  <Droplet className="h-6 w-6" /> {g.group}
                </span>
                <Badge
                  className={
                    g.status === "Critical"
                      ? "bg-red-500 text-white font-bold animate-pulse text-[10px]"
                      : g.status === "Low"
                      ? "bg-amber-500 text-white font-bold text-[10px]"
                      : "bg-emerald-500 text-white font-bold text-[10px]"
                  }
                >
                  {g.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Available Units:</span>
                  <span className="font-extrabold text-foreground text-sm">{g.availableUnits}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Reserved Units:</span>
                  <span className="font-semibold text-purple-600 dark:text-purple-400">{g.reservedUnits}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Requisition Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border-2 border-red-500/40 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2 text-destructive">
                  <Siren className="h-5 w-5 animate-pulse" /> Emergency Blood Requisitions ({emergencyRequests.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Immediate hospital STAT requests requiring dispatch clearance.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("requests")}
                className="text-xs font-semibold text-destructive"
              >
                All Requests <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="space-y-3">
              {emergencyRequests.map((req) => (
                <div
                  key={req.id}
                  className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500 text-white font-bold text-[10px]">
                        🚨 EMERGENCY
                      </Badge>
                      <Badge className="bg-primary/20 text-primary font-bold text-[10px]">
                        Group {req.bloodGroup} ({req.unitsNeeded} Units)
                      </Badge>
                      <h4 className="font-bold text-foreground">{req.patientName}</h4>
                    </div>
                    <p className="text-muted-foreground mt-1">{req.hospitalName}</p>
                    <p className="text-muted-foreground italic">{req.notes}</p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onApproveRequest(req.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shrink-0"
                  >
                    <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Approve & Dispatch
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Reservations Queue */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <BookmarkCheck className="h-4 w-4 text-purple-600" /> Active Reservations
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("reservations")}
                className="text-[11px] font-semibold text-purple-600 p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {reservations.map((res) => (
                <div key={res.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">{res.patientName}</span>
                    <Badge className="bg-red-500 text-white font-bold text-[10px]">{res.bloodGroup}</Badge>
                  </div>
                  <p className="text-muted-foreground">{res.reservedFor} • {res.unitsReserved} Unit(s)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
