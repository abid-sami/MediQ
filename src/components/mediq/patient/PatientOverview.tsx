import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Siren,
  Pill,
  Microscope,
  Droplet,
  ShoppingBag,
  CreditCard,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Building2,
  Stethoscope,
  Sparkles,
} from "lucide-react";
import {
  PatientAppointment,
  ActiveAmbulance,
  PatientPrescription,
  PatientLabTest,
  PatientBloodRequest,
  PatientPharmacyOrder,
  PatientBill,
} from "@/data/patient-data";

interface PatientOverviewProps {
  patientName: string;
  nextAppointment?: PatientAppointment | null;
  activeAmbulance?: ActiveAmbulance | null;
  recentPrescription?: PatientPrescription | null;
  latestLabReport?: PatientLabTest | null;
  bloodRequest?: PatientBloodRequest | null;
  pharmacyOrder?: PatientPharmacyOrder | null;
  outstandingBillAmount: number;
  onNavigateTab: (tab: string) => void;
}

export function PatientOverview({
  patientName,
  nextAppointment,
  activeAmbulance,
  recentPrescription,
  latestLabReport,
  bloodRequest,
  pharmacyOrder,
  outstandingBillAmount,
  onNavigateTab,
}: PatientOverviewProps) {
  const cards = [
    {
      id: "next-apt",
      title: "Next Appointment",
      value: nextAppointment ? nextAppointment.doctorName : "No Upcoming",
      sub: nextAppointment ? `${nextAppointment.date} at ${nextAppointment.time}` : "Schedule a doctor visit",
      icon: Calendar,
      color: "text-primary",
      bg: "bg-primary/10 border-primary/20",
      tab: "appointments",
    },
    {
      id: "ambulance",
      title: "Active Ambulance Request",
      value: activeAmbulance ? `ETA ${activeAmbulance.etaMinutes} Mins` : "No Active Request",
      sub: activeAmbulance ? `Unit: ${activeAmbulance.ambulanceUnit}` : "Emergency priority response",
      icon: Siren,
      color: "text-destructive",
      bg: "bg-destructive/10 border-destructive/20",
      tab: "ambulance",
    },
    {
      id: "prescription",
      title: "Recent Prescription",
      value: recentPrescription ? recentPrescription.rxNo : "None",
      sub: recentPrescription ? `By ${recentPrescription.doctorName}` : "View active medicines",
      icon: Pill,
      color: "text-teal",
      bg: "bg-teal/10 border-teal/20",
      tab: "prescriptions",
    },
    {
      id: "lab",
      title: "Latest Lab Report",
      value: latestLabReport ? latestLabReport.testName : "No Reports",
      sub: latestLabReport ? `Status: ${latestLabReport.status}` : "Track diagnostic reports",
      icon: Microscope,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      tab: "laboratory",
    },
    {
      id: "blood",
      title: "Blood Request",
      value: bloodRequest ? `Group ${bloodRequest.bloodGroup}` : "None",
      sub: bloodRequest ? `${bloodRequest.unitsNeeded} Unit(s) — ${bloodRequest.status}` : "Check live inventory",
      icon: Droplet,
      color: "text-red-500",
      bg: "bg-red-500/10 border-red-500/20",
      tab: "blood",
    },
    {
      id: "pharmacy",
      title: "Pharmacy Order",
      value: pharmacyOrder ? pharmacyOrder.orderNo : "No Active Orders",
      sub: pharmacyOrder ? `Status: ${pharmacyOrder.status}` : "Order medicines online",
      icon: ShoppingBag,
      color: "text-amber-500",
      bg: "bg-amber-500/10 border-amber-500/20",
      tab: "pharmacy",
    },
    {
      id: "bill",
      title: "Outstanding Bill",
      value: `$${outstandingBillAmount.toFixed(2)}`,
      sub: outstandingBillAmount > 0 ? "1 Pending Invoice" : "All invoices settled",
      icon: CreditCard,
      color: "text-purple-500",
      bg: "bg-purple-500/10 border-purple-500/20",
      tab: "billing",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="gradient-primary p-6 rounded-3xl text-primary-foreground shadow-lift">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2">
              Hello, {patientName} 👋
            </h1>
            <p className="text-sm font-medium opacity-90 mt-1">
              Here's your healthcare overview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => onNavigateTab("ambulance")}
              className="gradient-emergency text-white font-bold rounded-xl shadow-lg hover:opacity-90"
            >
              <Siren className="mr-1.5 h-4 w-4" /> 🚨 Request Ambulance
            </Button>
          </div>
        </div>
      </div>

      {/* 7 Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const IconComp = card.icon;
          return (
            <div
              key={card.id}
              onClick={() => onNavigateTab(card.tab)}
              className={`p-4 rounded-2xl border ${card.bg} cursor-pointer card-lift transition-all flex flex-col justify-between space-y-3 bg-card`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </span>
                <IconComp className={`h-4 w-4 ${card.color}`} />
              </div>

              <div>
                <span className="text-base font-bold text-foreground block truncate">
                  {card.value}
                </span>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{card.sub}</p>
              </div>

              <div className="flex items-center justify-end text-[11px] font-bold text-primary">
                View <ChevronRight className="h-3 w-3 ml-0.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Service Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Next Scheduled Appointment Box */}
        {nextAppointment && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Upcoming Doctor Appointment
              </h3>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px]">
                {nextAppointment.status}
              </Badge>
            </div>

            <div className="flex items-start gap-4 p-3 rounded-xl bg-muted/20 border border-border">
              <img
                src={nextAppointment.doctorAvatar}
                alt={nextAppointment.doctorName}
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div>
                <h4 className="font-bold text-sm">{nextAppointment.doctorName}</h4>
                <p className="text-xs text-muted-foreground">{nextAppointment.category}</p>
                <p className="text-xs text-primary font-bold mt-1">
                  {nextAppointment.date} at {nextAppointment.time}
                </p>
              </div>
            </div>

            <Button
              onClick={() => onNavigateTab("appointments")}
              variant="outline"
              className="w-full text-xs font-semibold rounded-xl"
            >
              Manage Appointment Schedules <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* Active Emergency SOS Box */}
        {activeAmbulance && (
          <div className="bg-card border-2 border-destructive/40 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2 text-destructive">
                <Siren className="h-4 w-4 animate-pulse" /> Active Ambulance Response
              </h3>
              <Badge className="bg-red-500 text-white font-bold text-[10px]">
                ETA: {activeAmbulance.etaMinutes} Mins
              </Badge>
            </div>

            <div className="text-xs space-y-1 text-muted-foreground p-3 rounded-xl bg-destructive/10 border border-destructive/20">
              <p>
                <strong className="text-foreground">Driver:</strong> {activeAmbulance.driverName} ({activeAmbulance.driverPhone})
              </p>
              <p>
                <strong className="text-foreground">Unit:</strong> {activeAmbulance.ambulanceUnit}
              </p>
            </div>

            <Button
              onClick={() => onNavigateTab("ambulance")}
              className="w-full bg-destructive text-destructive-foreground font-bold text-xs rounded-xl"
            >
              View Live Tracking Map <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
