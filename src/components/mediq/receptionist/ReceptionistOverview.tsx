import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Bed,
  CreditCard,
  Siren,
  UserPlus,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import {
  ReceptionAppointment,
  DoctorQueueItem,
  BedCategoryAvailability,
  ReceptionBill,
} from "@/data/receptionist-data";

interface ReceptionistOverviewProps {
  appointments: ReceptionAppointment[];
  doctorQueues: DoctorQueueItem[];
  bedCategories: BedCategoryAvailability[];
  bills: ReceptionBill[];
  onNavigateTab: (tab: string) => void;
  onConfirmCheckIn: (id: string) => void;
}

export function ReceptionistOverview({
  appointments,
  doctorQueues,
  bedCategories,
  bills,
  onNavigateTab,
  onConfirmCheckIn,
}: ReceptionistOverviewProps) {
  const todayAptsCount = appointments.length;
  const checkedInCount = appointments.filter((a) => a.status === "Checked In").length;
  const waitingCount = appointments.filter((a) => a.status === "Confirmed" || a.status === "Requested").length;
  const availableDoctorsCount = doctorQueues.filter((d) => d.status === "Available" || d.status === "In Consultation").length;
  const totalAvailableBeds = bedCategories.reduce((acc, c) => acc + c.available, 0);
  const pendingPaymentsCount = bills.filter((b) => b.paymentStatus === "Pending").length;
  const emergencyArrivalsCount = 2; // Active emergency dispatches

  const cards = [
    {
      title: "Today's Appointments",
      value: todayAptsCount,
      sub: "Total scheduled",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      tab: "appointments",
    },
    {
      title: "Waiting Patients",
      value: waitingCount,
      sub: "Pending check-in",
      icon: Clock,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "check-in",
    },
    {
      title: "Checked-In Patients",
      value: checkedInCount,
      sub: "Waiting for doctor",
      icon: UserCheck,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "check-in",
    },
    {
      title: "Available Doctors",
      value: availableDoctorsCount,
      sub: "On duty OPD",
      icon: Stethoscope,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "doctor-queue",
    },
    {
      title: "Available Beds",
      value: totalAvailableBeds,
      sub: "Across all wards",
      icon: Bed,
      color: "text-blue-500",
      bg: "bg-blue-500/10 border-blue-500/20",
      tab: "beds",
    },
    {
      title: "Pending Payments",
      value: pendingPaymentsCount,
      sub: "Uncollected bills",
      icon: CreditCard,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "billing",
    },
    {
      title: "Emergency Arrivals",
      value: emergencyArrivalsCount,
      sub: "Active ER dispatches",
      icon: Siren,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      tab: "emergency",
    },
  ];

  const pendingCheckIns = appointments.filter(
    (a) => a.status === "Confirmed" || a.status === "Requested"
  );

  return (
    <div className="space-y-6">
      {/* 7 KPI Display Cards */}
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

      {/* Main Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Check-Ins Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <UserCheck className="h-5 w-5 text-teal" /> Rapid Front-Desk Check-In Queue ({pendingCheckIns.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Confirm patient arrival and assign to doctor consultation queue.
                </p>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigateTab("patients")}
                className="text-xs font-bold rounded-xl"
              >
                <UserPlus className="mr-1.5 h-3.5 w-3.5 text-primary" /> Register Patient
              </Button>
            </div>

            <div className="space-y-3">
              {pendingCheckIns.map((apt) => (
                <div
                  key={apt.id}
                  className="p-4 rounded-xl border border-border/80 bg-muted/20 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                        {apt.appointmentId}
                      </Badge>
                      <span className="text-muted-foreground font-mono text-[11px]">{apt.time}</span>
                    </div>

                    <h4 className="font-bold text-foreground text-sm mt-1">{apt.patientName}</h4>
                    <p className="text-muted-foreground mt-0.5">
                      Doctor: <strong className="text-foreground">{apt.doctorName}</strong> ({apt.department})
                    </p>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onConfirmCheckIn(apt.id)}
                    className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs shrink-0"
                  >
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Confirm Check-In
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Doctor Queue Summary */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-primary" /> Live Doctor Status
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("doctor-queue")}
                className="text-[11px] font-semibold text-primary p-0 h-auto"
              >
                View all
              </Button>
            </div>

            <div className="space-y-3">
              {doctorQueues.map((dq) => (
                <div key={dq.id} className="p-3 rounded-xl border border-border/80 bg-muted/20 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">{dq.doctorName}</span>
                    <Badge variant="outline" className="text-[10px] text-primary">{dq.roomNo}</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">Current: {dq.currentPatient || "None"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
