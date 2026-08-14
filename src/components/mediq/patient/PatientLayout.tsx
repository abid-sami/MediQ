import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
import {
  LayoutDashboard,
  Search,
  Calendar,
  Building2,
  FileText,
  Pill,
  Microscope,
  ShoppingBag,
  Droplet,
  Siren,
  CreditCard,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  Heart,
} from "lucide-react";
import {
  initialPatientUser,
  sampleDoctors,
  initialPatientAppointments,
  initialMedicalRecords,
  initialPatientPrescriptions,
  initialPatientLabTests,
  initialPatientPharmacyOrders,
  initialPatientBloodRequests,
  initialActiveAmbulance,
  initialPatientBills,
  initialPatientNotifications,
  PatientUserProfile,
  DoctorCard,
  PatientAppointment,
  MedicalRecordItem,
  PatientPrescription,
  PatientLabTest,
  PatientPharmacyOrder,
  PatientBloodRequest,
  ActiveAmbulance,
  PatientBill,
  PatientNotification,
} from "@/data/patient-data";

import { PatientOverview } from "./PatientOverview";
import { FindDoctorModule } from "./FindDoctorModule";
import { PatientAppointmentsModule } from "./PatientAppointmentsModule";
import { PatientMedicalRecordsModule } from "./PatientMedicalRecordsModule";
import { PatientPrescriptionsModule } from "./PatientPrescriptionsModule";
import { PatientLaboratoryModule } from "./PatientLaboratoryModule";
import { PatientPharmacyModule } from "./PatientPharmacyModule";
import { PatientBloodBankModule } from "./PatientBloodBankModule";
import { PatientAmbulanceModule } from "./PatientAmbulanceModule";
import { PatientBillingModule } from "./PatientBillingModule";
import { PatientProfileModule } from "./PatientProfileModule";
import { NotificationsModule } from "../doctor/NotificationsModule";

export type PatientTab =
  | "dashboard"
  | "find-doctor"
  | "appointments"
  | "hospitals"
  | "medical-records"
  | "prescriptions"
  | "diagnostics"
  | "pharmacy"
  | "blood-bank"
  | "ambulance"
  | "billing"
  | "notifications"
  | "profile";

export function PatientLayout() {
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<PatientTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global State
  const [patientUser, setPatientUser] = useState<PatientUserProfile>(initialPatientUser);
  const [doctors, setDoctors] = useState<DoctorCard[]>(sampleDoctors);
  const [appointments, setAppointments] = useState<PatientAppointment[]>(initialPatientAppointments);
  const [records, setRecords] = useState<MedicalRecordItem[]>(initialMedicalRecords);
  const [prescriptions, setPrescriptions] = useState<PatientPrescription[]>(initialPatientPrescriptions);
  const [labTests, setLabTests] = useState<PatientLabTest[]>(initialPatientLabTests);
  const [pharmacyOrders, setPharmacyOrders] = useState<PatientPharmacyOrder[]>(initialPatientPharmacyOrders);
  const [bloodRequests, setBloodRequests] = useState<PatientBloodRequest[]>(initialPatientBloodRequests);
  const [ambulance, setAmbulance] = useState<ActiveAmbulance | null>(initialActiveAmbulance);
  const [bills, setBills] = useState<PatientBill[]>(initialPatientBills);

  const unreadNotifs = 2;

  // Handlers
  const handleBookAppointment = (newApt: PatientAppointment) => {
    setAppointments((prev) => [newApt, ...prev]);
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Cancelled" } : a))
    );
  };

  const handleRescheduleAppointment = (id: string, newDate: string, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, date: newDate, time: newTime, status: "Rescheduled" } : a
      )
    );
  };

  const handleNewPharmacyOrder = (order: PatientPharmacyOrder) => {
    setPharmacyOrders((prev) => [order, ...prev]);
  };

  const handleNewBloodRequest = (req: PatientBloodRequest) => {
    setBloodRequests((prev) => [req, ...prev]);
  };

  const handlePayBill = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "Paid" } : b))
    );
  };

  const handleAddRecord = (rec: MedicalRecordItem) => {
    setRecords((prev) => [rec, ...prev]);
  };

  const handleAddLabTest = (test: PatientLabTest) => {
    setLabTests((prev) => [test, ...prev]);
  };

  const handleAddBill = (bill: PatientBill) => {
    setBills((prev) => [bill, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "find-doctor", label: "Find Doctor", icon: Search },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: appointments.length },
    { id: "hospitals", label: "Hospitals", icon: Building2 },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill, badge: prescriptions.length },
    { id: "diagnostics", label: "Diagnostics", icon: Microscope },
    { id: "pharmacy", label: "Pharmacy", icon: ShoppingBag },
    { id: "blood-bank", label: "Blood Bank", icon: Droplet },
    { id: "ambulance", label: "Ambulance", icon: Siren, badge: ambulance ? 1 : 0 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifs },
    { id: "profile", label: "Profile", icon: User },
  ];

  const outstandingBill = bills
    .filter((b) => b.status === "Unpaid")
    .reduce((acc, c) => acc + c.amount, 0);

  const nextApt = appointments.find((a) => a.status === "Confirmed") || null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row pb-16 lg:pb-0">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-5 border-b border-border flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold shadow-soft">
                Q
              </span>
              <span className="text-lg font-bold tracking-tight">
                Medi<span className="text-teal">Q</span> Patient
              </span>
            </a>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden rounded-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
            className="p-4 border-b border-border/60 bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3"
          >
            <img
              src={patientUser.avatar}
              alt={patientUser.name}
              className="h-10 w-10 rounded-xl object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{patientUser.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">
                Blood Group: <strong className="text-red-500">{patientUser.bloodGroup}</strong>
              </p>
            </div>
          </div>

          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)]">
            {navItems.map((item) => {
              const IconComp = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as PatientTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      className={`text-[10px] px-1.5 py-0 rounded-full font-bold ${
                        active ? "bg-white/20 text-white" : "bg-primary/15 text-primary"
                      }`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>MediQ Connected Care</span>
          <a href="/" className="hover:text-foreground font-semibold flex items-center gap-1">
            Home <ChevronRight className="h-3 w-3" />
          </a>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div>
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                  Hello, {patientUser.name} 👋
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Here's your healthcare overview.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab("notifications")}
                className="relative rounded-full"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <PatientOverview
              patientName={patientUser.name}
              nextAppointment={nextApt}
              activeAmbulance={ambulance}
              recentPrescription={prescriptions[0] || null}
              latestLabReport={labTests[0] || null}
              bloodRequest={bloodRequests[0] || null}
              pharmacyOrder={pharmacyOrders[0] || null}
              outstandingBillAmount={outstandingBill}
              onNavigateTab={(tab) => setActiveTab(tab as PatientTab)}
            />
          )}

          {activeTab === "find-doctor" && (
            <FindDoctorModule
              doctors={doctors}
              onBookAppointment={handleBookAppointment}
            />
          )}

          {activeTab === "appointments" && (
            <PatientAppointmentsModule
              appointments={appointments}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              onNavigateToFindDoctor={() => setActiveTab("find-doctor")}
            />
          )}

          {(activeTab === "hospitals" || activeTab === "medical-records") && (
            <PatientMedicalRecordsModule
              records={records}
              onAddRecord={handleAddRecord}
            />
          )}

          {activeTab === "prescriptions" && (
            <PatientPrescriptionsModule
              prescriptions={prescriptions}
              patientName={patientUser.name}
            />
          )}

          {(activeTab === "diagnostics" || activeTab === "laboratory") && (
            <PatientLaboratoryModule
              labTests={labTests}
              onAddLabTest={handleAddLabTest}
            />
          )}

          {activeTab === "pharmacy" && (
            <PatientPharmacyModule
              orders={pharmacyOrders}
              onNewOrder={handleNewPharmacyOrder}
            />
          )}

          {activeTab === "blood-bank" && (
            <PatientBloodBankModule
              requests={bloodRequests}
              onRequestBlood={handleNewBloodRequest}
            />
          )}

          {activeTab === "ambulance" && (
            <PatientAmbulanceModule
              ambulance={ambulance}
              onRequestAmbulance={() => {
                if (!ambulance) {
                  setAmbulance(initialActiveAmbulance);
                }
              }}
            />
          )}

          {activeTab === "billing" && (
            <PatientBillingModule
              bills={bills}
              onPayBill={handlePayBill}
              onAddBill={handleAddBill}
            />
          )}

          {activeTab === "profile" && (
            <PatientProfileModule
              profile={patientUser}
              onUpdateProfile={setPatientUser}
            />
          )}
        </main>
      </div>

      {/* Touch-Friendly Bottom Quick Shortcut Bar for Mobile */}
      <div className="fixed bottom-0 inset-x-0 z-50 bg-card/90 backdrop-blur-lg border-t border-border flex items-center justify-around py-2 px-2 lg:hidden shadow-lg">
        <button
          onClick={() => setActiveTab("appointments")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-primary"
        >
          <Calendar className="h-4 w-4 text-primary" />
          <span>Appointment</span>
        </button>

        <button
          onClick={() => setActiveTab("prescriptions")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-teal"
        >
          <Pill className="h-4 w-4 text-teal" />
          <span>Prescription</span>
        </button>

        <button
          onClick={() => setActiveTab("laboratory")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-emerald-500"
        >
          <Microscope className="h-4 w-4 text-emerald-500" />
          <span>Lab Report</span>
        </button>

        <button
          onClick={() => setActiveTab("pharmacy")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-amber-500"
        >
          <ShoppingBag className="h-4 w-4 text-amber-500" />
          <span>Pharmacy</span>
        </button>

        <button
          onClick={() => setActiveTab("blood-bank")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-muted-foreground hover:text-red-500"
        >
          <Droplet className="h-4 w-4 text-red-500" />
          <span>Blood</span>
        </button>

        <button
          onClick={() => setActiveTab("ambulance")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-destructive"
        >
          <Siren className="h-5 w-5 text-destructive animate-pulse" />
          <span>SOS</span>
        </button>
      </div>
    </div>
  );
}
