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
  Users,
  Calendar,
  UserCheck,
  Stethoscope,
  Bed,
  CreditCard,
  MessageSquare,
  Siren,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  UserPlus,
  Loader2,
  LogOut,
  Home,
  Radio,
} from "lucide-react";
import {
  initialReceptionistProfile,
  initialRegisteredPatients,
  initialReceptionAppointments,
  initialDoctorQueues,
  initialAdmissions,
  initialBedCategories,
  initialReceptionBills,
  ReceptionistProfile,
  RegisteredPatient,
  ReceptionAppointment,
  DoctorQueueItem,
  HospitalAdmission,
  BedCategoryAvailability,
  ReceptionBill,
  AppointmentStatus,
} from "@/data/receptionist-data";
import {
  fetchSupabaseProfiles,
  fetchSupabaseAppointments,
  fetchSupabaseBeds,
  updateSupabaseBedStatus,
} from "@/services/supabase-service";

import { ReceptionistOverview } from "./ReceptionistOverview";
import { PatientRegistrationModule } from "./PatientRegistrationModule";
import { FastCheckInModule } from "./FastCheckInModule";
import { DoctorQueueModule } from "./DoctorQueueModule";
import { AdmissionsAndBedsModule } from "./AdmissionsAndBedsModule";
import { ReceptionistAppointmentsModule } from "./ReceptionistAppointmentsModule";
import { FrontDeskBillingModule } from "./FrontDeskBillingModule";
import { EmergencyArrivalsModule } from "./EmergencyArrivalsModule";
import { ResQAccidentAlertsModule } from "../ResQAccidentAlertsModule";
import { DynamicNotificationsModule } from "../DynamicNotificationsModule";
import { ReceptionistProfileModule } from "./ReceptionistProfileModule";
import { FeedbackInboxModule } from "../FeedbackInboxModule";

export type ReceptionistTab =
  | "dashboard"
  | "patients"
  | "appointments"
  | "check-in"
  | "doctor-queue"
  | "admissions"
  | "beds"
  | "billing"
  | "feedback"
  | "emergency"
  | "resq"
  | "notifications"
  | "profile";

export function ReceptionistLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<ReceptionistTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global State
  const [profile, setProfile] = useState<ReceptionistProfile>(initialReceptionistProfile);
  const [patients, setPatients] = useState<RegisteredPatient[]>(initialRegisteredPatients);
  const [appointments, setAppointments] = useState<ReceptionAppointment[]>(initialReceptionAppointments);
  const [doctorQueues, setDoctorQueues] = useState<DoctorQueueItem[]>(initialDoctorQueues);
  const [admissions, setAdmissions] = useState<HospitalAdmission[]>(initialAdmissions);
  const [bedCategories, setBedCategories] = useState<BedCategoryAvailability[]>(initialBedCategories);
  const [liveBeds, setLiveBeds] = useState<any[]>([]);
  const [bills, setBills] = useState<ReceptionBill[]>(initialReceptionBills);

  useEffect(() => {
    if (authProfile) {
      setProfile((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        email: authProfile.email || prev.email,
        phone: authProfile.phone || prev.phone,
        role: authProfile.role || prev.role,
        badgeId: authProfile.badgeId || prev.badgeId,
      }));
    }
  }, [authProfile]);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch patients
        const patientsData = await fetchSupabaseProfiles("Patient");
        if (patientsData && patientsData.length > 0) {
          const transformedPatients = patientsData.map((p: any) => ({
            id: p.id,
            registrationNo: p.id.substring(0, 8),
            name: p.name,
            phone: p.phone,
            email: p.email,
            age: p.age ?? undefined,
            gender: p.gender || "Not specified",
            bloodGroup: p.bloodGroup || "",
            registrationDate: new Date().toLocaleDateString(),
            status: "Active",
            insuranceNo: "",
            lastVisit: new Date().toLocaleDateString(),
          }));
          setPatients(transformedPatients);
        }

        // Fetch appointments
        const appointmentsData = await fetchSupabaseAppointments();
        if (appointmentsData && appointmentsData.length > 0) {
          const transformedAppointments = appointmentsData.map((a: any) => ({
            id: a.id,
            appointmentNo: a.serialNumber,
            patientName: a.patientName,
            doctorName: a.department,
            date: a.appointmentTime?.split(" ")[0] || new Date().toLocaleDateString(),
            time: a.appointmentTime || "10:00 AM",
            status: a.status,
            checkedIn: false,
          }));
          setAppointments(transformedAppointments);
        }

        // Fetch beds
        const bedsData = await fetchSupabaseBeds();
        setLiveBeds(bedsData || []);
        if (bedsData && bedsData.length > 0) {
          // Group beds by ward type with accurate live counts
          const wardMap: Record<string, { total: number; occupied: number }> = {};
          bedsData.forEach((b: any) => {
            const ward = b.wardType || "General";
            if (!wardMap[ward]) wardMap[ward] = { total: 0, occupied: 0 };
            wardMap[ward].total++;
            if (b.status === "Occupied") wardMap[ward].occupied++;
          });
          const groupedBeds = Object.entries(wardMap).map(([category, stats]) => ({
            category: category as BedCategoryAvailability["category"],
            totalBeds: stats.total,
            occupied: stats.occupied,
            available: stats.total - stats.occupied,
          }));
          setBedCategories(groupedBeds);
        } else {
          setBedCategories([]);
        }
      } catch (error) {
        console.error("Error loading receptionist data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pendingCheckInCount = appointments.filter(
    (a) => a.status === "Confirmed" || a.status === "Requested"
  ).length;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  // Handlers
  const handleRegisterPatient = (pat: RegisteredPatient) => {
    setPatients((prev) => [pat, ...prev]);
  };

  const handleConfirmCheckIn = (id: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "Checked In" } : a))
    );
  };

  const handleUpdateAppointmentStatus = (id: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleNewAppointment = (apt: ReceptionAppointment) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const handleRegisterAdmission = async (adm: HospitalAdmission, bedId?: string) => {
    setAdmissions((prev) => [adm, ...prev]);

    if (bedId) {
      const { error } = await updateSupabaseBedStatus(bedId, "Occupied", adm.patientName);
      if (!error) {
        const bedsData = await fetchSupabaseBeds();
        setLiveBeds(bedsData || []);
        const wardMap: Record<string, { total: number; occupied: number }> = {};
        (bedsData || []).forEach((b: any) => {
          const ward = b.wardType || "General";
          if (!wardMap[ward]) wardMap[ward] = { total: 0, occupied: 0 };
          wardMap[ward].total++;
          if (b.status === "Occupied") wardMap[ward].occupied++;
        });
        setBedCategories(
          Object.entries(wardMap).map(([category, stats]) => ({
            category: category as BedCategoryAvailability["category"],
            totalBeds: stats.total,
            occupied: stats.occupied,
            available: stats.total - stats.occupied,
          }))
        );
      }
    }
  };

  const handleMarkBillPaid = (id: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === id ? { ...b, paymentStatus: "Paid" } : b))
    );
  };

  const handleCreateBill = (bill: ReceptionBill) => {
    setBills((prev) => [bill, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "patients", label: "Patients", icon: Users, badge: patients.length },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: appointments.length },
    { id: "check-in", label: "Check-In", icon: UserCheck, badge: pendingCheckInCount },
    { id: "doctor-queue", label: "Doctor Queue", icon: Stethoscope },
    { id: "admissions", label: "Admissions", icon: Bed, badge: admissions.length },
    { id: "beds", label: "Beds Matrix", icon: Bed },
    { id: "billing", label: "Billing", icon: CreditCard, badge: bills.filter((b) => b.paymentStatus === "Pending").length },
    { id: "feedback", label: "Feedback", icon: MessageSquare },
    { id: "emergency", label: "Emergency", icon: Siren, badge: 2 },
    { id: "resq", label: "ResQ Alerts", icon: Radio },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "profile", label: "Profile", icon: User },
  ];

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
                Medi<span className="text-teal">Q</span> Desk
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
              src={profile.avatar}
              alt={profile.name}
              className="h-10 w-10 rounded-xl object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{profile.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">{profile.role}</p>
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
                    setActiveTab(item.id as ReceptionistTab);
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
            <span>Main Lobby Desk #1</span>
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
                  MediQ Hospital Patient Access & Front-Desk
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Logged in as {profile.name} ({profile.badgeId})
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
                onClick={() => setActiveTab("check-in")}
                className="relative rounded-full text-teal"
                aria-label="Check-In"
              >
                <UserCheck className="h-5 w-5" />
                {pendingCheckInCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-teal ring-2 ring-background animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <ReceptionistOverview
              appointments={appointments}
              doctorQueues={doctorQueues}
              bedCategories={bedCategories}
              bills={bills}
              onNavigateTab={(tab) => setActiveTab(tab as ReceptionistTab)}
              onConfirmCheckIn={handleConfirmCheckIn}
            />
          )}

          {activeTab === "patients" && (
            <PatientRegistrationModule
              patients={patients}
              onRegisterPatient={handleRegisterPatient}
            />
          )}

          {activeTab === "appointments" && (
            <ReceptionistAppointmentsModule
              appointments={appointments}
              onUpdateStatus={handleUpdateAppointmentStatus}
              onNewAppointment={handleNewAppointment}
            />
          )}

          {activeTab === "check-in" && (
            <FastCheckInModule
              appointments={appointments}
              onConfirmCheckIn={handleConfirmCheckIn}
            />
          )}

          {activeTab === "doctor-queue" && (
            <DoctorQueueModule queues={doctorQueues} />
          )}

          {(activeTab === "admissions" || activeTab === "beds") && (
            <AdmissionsAndBedsModule
              admissions={admissions}
              bedCategories={bedCategories}
              liveBeds={liveBeds}
              onRegisterAdmission={handleRegisterAdmission}
            />
          )}

          {activeTab === "billing" && (
            <FrontDeskBillingModule
              bills={bills}
              onMarkPaid={handleMarkBillPaid}
              onCreateBill={handleCreateBill}
            />
          )}

          {activeTab === "emergency" && (
            <div className="space-y-6">
              <ResQAccidentAlertsModule />
              <EmergencyArrivalsModule />
            </div>
          )}
          {activeTab === "resq" && <ResQAccidentAlertsModule showDemoButton />}
          {activeTab === "feedback" && <FeedbackInboxModule />}

          {activeTab === "notifications" && <DynamicNotificationsModule userId={authProfile?.id} canCompose />}

          {activeTab === "profile" && (
            <ReceptionistProfileModule
              profile={profile}
              onUpdateProfile={(updated) => { setProfile(updated); if (updated.id && updated.avatar) void updateSupabaseProfile(updated.id, { avatar_url: updated.avatar }); }}
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
    </div>
  );
}
