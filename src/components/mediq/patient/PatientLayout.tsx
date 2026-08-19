// Design: Guided Floorplan — clear clinical hierarchy, with a fixed end-of-sidebar exit action.
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { LanguageToggle } from "../LanguageToggle";
import { useAuth } from "@/hooks/use-auth";
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
  Sparkles,
  Loader2,
  LogOut,
  Home,
} from "lucide-react";
import {
  initialPatientUser,
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
import {
  fetchSupabaseAppointments,
  fetchSupabasePharmacyOrders,
  fetchSupabaseLabOrders,
  fetchSupabaseProfiles,
  fetchSupabaseBloodRequests,
  fetchSupabaseSOS,
} from "@/services/supabase-service";

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
import { PatientWellnessModule } from "./wellness/PatientWellnessModule";
import { DynamicNotificationsModule } from "../DynamicNotificationsModule";

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
  | "wellness"
  | "notifications"
  | "profile";

export function PatientLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<PatientTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global State
  const [patientUser, setPatientUser] = useState<PatientUserProfile>(initialPatientUser);
  const [doctors, setDoctors] = useState<DoctorCard[]>([]);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [records, setRecords] = useState<MedicalRecordItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<PatientPrescription[]>([]);
  const [labTests, setLabTests] = useState<PatientLabTest[]>([]);
  const [pharmacyOrders, setPharmacyOrders] = useState<PatientPharmacyOrder[]>([]);
  const [bloodRequests, setBloodRequests] = useState<PatientBloodRequest[]>([]);
  const [ambulance, setAmbulance] = useState<ActiveAmbulance | null>(null);
  const [bills, setBills] = useState<PatientBill[]>([]);

  useEffect(() => {
    if (authProfile) {
      setPatientUser((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        email: authProfile.email || prev.email,
        contact: authProfile.phone || prev.contact,
        bloodGroup: authProfile.bloodGroup || prev.bloodGroup,
        address: authProfile.address || prev.address,
      }));
    }
  }, [authProfile]);

  useEffect(() => {
    const patientName = authProfile?.name?.trim();
    if (!patientName) {
      setDoctors([]);
      setAppointments([]);
      setLabTests([]);
      setPharmacyOrders([]);
      setBloodRequests([]);
      setAmbulance(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        const [doctorProfiles, appointmentsData, ordersData, labData, bloodData, sosData] = await Promise.all([
          fetchSupabaseProfiles("Doctor"),
          fetchSupabaseAppointments(patientName),
          fetchSupabasePharmacyOrders(patientName),
          fetchSupabaseLabOrders(patientName),
          fetchSupabaseBloodRequests(patientName),
          fetchSupabaseSOS(patientName),
        ]);
        if (cancelled) return;

        setDoctors(doctorProfiles.map((doctor: any) => ({
          id: doctor.id,
          name: doctor.name || "",
          avatar: doctor.avatarUrl || "",
          specialization: doctor.specialty || "",
          category: doctor.specialty || "",
          experience: doctor.licenseNo || "",
          hospital: doctor.address || "",
          consultationFee: 0,
          rating: 0,
          reviewsCount: 0,
          availableDays: [],
          availableTime: doctor.workingHours || "",
        })));
        setAppointments(appointmentsData.map((appointment: any) => ({
          id: appointment.id,
          appointmentId: appointment.appointmentId,
          doctorId: appointment.doctorId || "",
          doctorName: appointment.doctorName || "",
          doctorAvatar: "",
          category: appointment.department || appointment.specialty || "",
          hospital: "",
          date: appointment.appointmentDate || "",
          time: appointment.appointmentTime || "",
          status: appointment.status === "Completed" || appointment.status === "Cancelled" || appointment.status === "Rescheduled" ? appointment.status : "Confirmed",
          reason: appointment.reason || "",
          fee: appointment.fee || 0,
        })));
        setPharmacyOrders(ordersData.map((order: any) => ({
          id: order.id,
          orderNo: order.orderId,
          date: order.orderTime || "",
          items: (order.medicines || []).map((item: any) => ({ name: item.medicineName || item.name || "", qty: Number(item.quantity || item.qty || 0), price: Number(item.unitPrice || item.price || 0) })),
          totalPrice: order.totalAmount || 0,
          prescriptionRequired: order.prescriptionStatus === "Pending Verification",
          prescriptionVerified: order.prescriptionStatus === "Verified",
          status: order.orderStatus === "Delivered" || order.orderStatus === "Ready for Pickup" || order.orderStatus === "Out for Delivery" ? order.orderStatus : "Processing",
          deliveryAddress: "",
        })));
        setLabTests(labData.map((test: any) => ({
          id: test.id,
          requisitionNo: test.testId,
          testName: test.testName || "",
          category: test.category || "",
          facility: "",
          bookedDate: test.date || "",
          status: test.status === "Completed" || test.status === "Processing" ? test.status : "Booked",
        })));
        setBloodRequests(bloodData.map((request: any) => ({
          id: request.id,
          requestId: request.requestId,
          bloodGroup: request.bloodGroup || "",
          unitsNeeded: Number(request.unitsNeeded || 0),
          hospital: request.hospitalName || "",
          urgency: request.urgency === "Emergency" || request.urgency === "Urgent" ? request.urgency : "Routine",
          requestedDate: request.requiredDate || "",
          status: request.status === "Approved" || request.status === "Dispatched" || request.status === "Fulfilled" ? request.status : "Pending",
        })));
        const activeSOS = sosData.find((request: any) => request.ambulanceStatus !== "Completed");
        setAmbulance(activeSOS ? {
          id: activeSOS.id,
          requestId: activeSOS.requestId,
          status: activeSOS.ambulanceStatus === "Arrived" ? "Arrived" : "En Route",
          driverName: activeSOS.assignedDriver || "",
          driverPhone: "",
          ambulanceUnit: "",
          ambulanceType: activeSOS.emergencyType || "",
          pickupLocation: activeSOS.location || "",
          destination: activeSOS.destinationHospital || "",
          etaMinutes: Number.parseInt(activeSOS.eta, 10) || 0,
        } : null);
      } catch (error) {
        console.error("Error loading patient data:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadData();
    return () => { cancelled = true; };
  }, [authProfile?.id, authProfile?.name]);

  const unreadNotifs = 0;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

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

  const handleAddLabTest = (test: PatientLabTest) => {
    setLabTests((prev) => [test, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "find-doctor", label: "Find Doctor", icon: Search },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: appointments.length },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill, badge: prescriptions.length },
    { id: "diagnostics", label: "Diagnostics", icon: Microscope },
    { id: "pharmacy", label: "Pharmacy", icon: ShoppingBag },
    { id: "blood-bank", label: "Blood Bank", icon: Droplet },
    { id: "ambulance", label: "Ambulance", icon: Siren, badge: ambulance ? 1 : 0 },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "wellness", label: "Wellness & Relaxation", icon: Sparkles },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifs },
    { id: "profile", label: "Profile", icon: User },
  ];

  const outstandingBills = bills
    .filter((b) => b.status === "Unpaid")
  const outstandingBill = outstandingBills.reduce((acc, c) => acc + c.amount, 0);

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
            <a href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 transition-colors mb-1">
              <Home className="h-4 w-4 shrink-0" />
              <span>Home</span>
            </a>
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

        <div className="space-y-3 border-t border-border p-3">
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span>MediQ Connected Care</span>
            <a href="/" className="flex items-center gap-1 font-semibold hover:text-foreground">
              Home <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <Button variant="ghost" onClick={() => { setSidebarOpen(false); setLogoutConfirmOpen(true); }} className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Sign out of MediQ">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
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
              <LanguageToggle />
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
                onClick={() => setLogoutConfirmOpen(true)}
                className="rounded-full text-destructive hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
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
              outstandingBillCount={outstandingBills.length}
              onNavigateTab={(tab) => setActiveTab(tab as PatientTab)}
            />
          )}

          {activeTab === "find-doctor" && (
            <FindDoctorModule
              doctors={doctors}
              onBookAppointment={handleBookAppointment}
              patientName={patientUser.name}
              patientPhone={patientUser.contact}
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
              patientName={patientUser.name}
              patientAge={patientUser.age}
            />
          )}

          {activeTab === "pharmacy" && (
            <PatientPharmacyModule
              orders={pharmacyOrders}
              onNewOrder={handleNewPharmacyOrder}
              patientName={patientUser.name}
              patientPhone={patientUser.contact}
              initialDeliveryAddress={patientUser.address}
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
            />
          )}

          {activeTab === "billing" && (
            <PatientBillingModule
              bills={bills}
              onPayBill={handlePayBill}
            />
          )}

          {activeTab === "wellness" && (
            <PatientWellnessModule />
          )}

          {activeTab === "notifications" && <DynamicNotificationsModule userId={authProfile?.id} />}

          {activeTab === "profile" && (
            <PatientProfileModule
              profile={patientUser}
              onUpdateProfile={(updated) => { setPatientUser(updated); if (updated.id && updated.avatar) void updateSupabaseProfile(updated.id, { avatar_url: updated.avatar }); }}
            />
          )}
        </main>
      </div>

      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="max-w-xs rounded-2xl border-border bg-card p-6">
          <DialogHeader>
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <LogOut className="h-5 w-5" />
            </div>
            <DialogTitle className="text-center text-xl">Confirm Sign Out</DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Are you sure you want to sign out of your MediQ account?
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setLogoutConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleConfirmLogout}>
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
