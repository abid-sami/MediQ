// Design: Guided Floorplan — clear clinical hierarchy, with a fixed end-of-sidebar exit action.
/** MediQ Guided Floorplan: role-specific care operations with Route Blue navigation and live profile state. */
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { LanguageToggle } from "../LanguageToggle";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  Pill,
  Microscope,
  Activity,
  RotateCcw,
  Bell,
  User,
  Sun,
  Moon,
  Search,
  Menu,
  X,
  Stethoscope,
  ChevronRight,
  LogOut,
  Loader2,
  Home,
} from "lucide-react";
import {
  initialDoctorProfile,
  initialPatients,
  initialAppointments,
  initialPrescriptions,
  initialLabRequests,
  initialDiagnosticRequests,
  initialMedicalReports,
  initialFollowUps,
  initialNotifications,
  Appointment,
  Patient,
  DigitalPrescription,
  LabRequest,
  DiagnosticRequest,
  MedicalReport,
  ConsultationSession,
  FollowUpItem,
  DoctorNotification,
  DoctorProfile,
  AppointmentStatus,
  LabTestStatus,
  DiagnosticStatus,
  FollowUpStatus,
} from "@/data/doctor-data";
import {
  fetchSupabaseAppointments,
  fetchSupabaseProfiles,
  fetchSupabaseLabOrders,
  updateSupabaseProfile,
} from "@/services/supabase-service";
import { getDoctorSchedules, updateDoctorSchedule } from "@/data/doctor-schedule-store";

import { DoctorOverview } from "./DoctorOverview";
import { TodayAppointments } from "./TodayAppointments";
import { PatientProfileModal } from "./PatientProfileModal";
import { ConsultationWorkspace } from "./ConsultationWorkspace";
import { DigitalPrescriptionBuilder } from "./DigitalPrescriptionBuilder";
import { LaboratoryModule } from "./LaboratoryModule";
import { DiagnosticsModule } from "./DiagnosticsModule";
import { ReportsModule } from "./ReportsModule";
import { FollowUpsModule } from "./FollowUpsModule";
import { DynamicNotificationsModule } from "../DynamicNotificationsModule";
import { DoctorProfileModule } from "./DoctorProfileModule";

export type SidebarTab =
  | "dashboard"
  | "appointments"
  | "patients"
  | "medical-records"
  | "prescriptions"
  | "laboratory"
  | "diagnostics"
  | "followups"
  | "notifications"
  | "profile"
  | "consultation";

export function DoctorLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  // Active Tab state
  const [activeTab, setActiveTab] = useState<SidebarTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global State
  const [doctorProfile, setDoctorProfile] = useState<DoctorProfile>(initialDoctorProfile);
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<DigitalPrescription[]>(initialPrescriptions);
  const [labRequests, setLabRequests] = useState<LabRequest[]>(initialLabRequests);
  const [diagnosticRequests, setDiagnosticRequests] = useState<DiagnosticRequest[]>(initialDiagnosticRequests);
  const [reports, setReports] = useState<MedicalReport[]>(initialMedicalReports);
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(initialFollowUps);
  const [notifications, setNotifications] = useState<DoctorNotification[]>(initialNotifications);

  // Modal / Session states
  const [selectedPatientModal, setSelectedPatientModal] = useState<Patient | null>(null);
  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [activeConsultationApt, setActiveConsultationApt] = useState<Appointment | null>(null);
  const [activeConsultationPatient, setActiveConsultationPatient] = useState<Patient | null>(null);
  const [selectedReportForView, setSelectedReportForView] = useState<MedicalReport | null>(null);

  // Fetch data from Supabase on mount
  useEffect(() => {
    if (authProfile) {
      setDoctorProfile((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        email: authProfile.email || prev.email,
        phone: authProfile.phone || prev.phone,
        specialization: authProfile.specialty || prev.specialization,
        department: authProfile.department || prev.department,
        availableHours: authProfile.workingHours || prev.availableHours,
        consultationFee: authProfile.consultationFee ?? prev.consultationFee,
      }));
    }
  }, [authProfile]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch appointments
        const appointmentsData = await fetchSupabaseAppointments();
        if (appointmentsData && appointmentsData.length > 0) {
          setAppointments(appointmentsData);
        }

        // Fetch patients (all profiles with role 'Patient')
        const patientsData = await fetchSupabaseProfiles("Patient");
        if (patientsData && patientsData.length > 0) {
          // Transform to Patient format
          const transformedPatients = patientsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            age: 35,
            gender: "Other",
            bloodGroup: p.bloodGroup || "O+",
            contact: p.phone,
            email: p.email,
            address: p.address || "",
            emergencyContact: { name: "N/A", relationship: "N/A", phone: p.phone },
            allergies: [],
            chronicConditions: [],
            medicalHistory: "",
            previousVisitsCount: 0,
            lastVisitDate: new Date().toLocaleDateString(),
          }));
          setPatients(transformedPatients);
        }

        // Fetch lab requests
        const labData = await fetchSupabaseLabOrders();
        if (labData && labData.length > 0) {
          setLabRequests(labData);
        }
      } catch (error) {
        console.error("Error loading doctor data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleAptUpdate = async () => {
      const freshApts = await fetchSupabaseAppointments();
      if (freshApts && freshApts.length > 0) {
        setAppointments(freshApts);
      }
    };

    window.addEventListener("mediq_appointments_updated", handleAptUpdate);
    return () => window.removeEventListener("mediq_appointments_updated", handleAptUpdate);
  }, []);

  // Unread notifications
  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  // Navigation handlers
  const handleOpenPatientProfile = (patient: Patient) => {
    setSelectedPatientModal(patient);
    setPatientModalOpen(true);
  };

  const handleStartConsultation = (apt: Appointment) => {
    const p = patients.find((pat) => pat.id === apt.patientId) || patients[0];
    setActiveConsultationApt(apt);
    setActiveConsultationPatient(p);
    // Update status to In Consultation
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: "In Consultation" } : a))
    );
    setActiveTab("consultation");
  };

  const handleSaveConsultation = (session: ConsultationSession) => {
    // Update appointment status to Completed
    setAppointments((prev) =>
      prev.map((a) => (a.id === session.appointmentId ? { ...a, status: "Completed" } : a))
    );
  };

  const handleSavePrescription = (rx: DigitalPrescription) => {
    setPrescriptions((prev) => [rx, ...prev]);
  };

  const handleCreateLabRequest = (req: LabRequest) => {
    setLabRequests((prev) => [req, ...prev]);
  };

  const handleCreateDiagnosticRequest = (req: DiagnosticRequest) => {
    setDiagnosticRequests((prev) => [req, ...prev]);
  };

  const handleAddAppointment = (apt: Appointment) => {
    setAppointments((prev) => [apt, ...prev]);
    // Also create patient record if new
    const exists = patients.some((p) => p.name.toLowerCase() === apt.patientName.toLowerCase());
    if (!exists) {
      const newP: Patient = {
        id: apt.patientId,
        name: apt.patientName,
        age: apt.patientAge,
        gender: apt.patientGender,
        bloodGroup: apt.patientBloodGroup,
        contact: "+1 (555) 309 border",
        email: `${apt.patientName.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        address: "MediQ Walk-in Clinic Registered Patient",
        emergencyContact: {
          name: "Family Member",
          relationship: "Relative",
          phone: "+1 (555) 900-0000",
        },
        allergies: ["None reported"],
        chronicConditions: ["None reported"],
        medicalHistory: "Walk-in consultation patient.",
        previousVisitsCount: 1,
        lastVisitDate: new Date().toISOString().split("T")[0],
      };
      setPatients((prev) => [newP, ...prev]);
    }
  };

  const handleOpenReportByName = (testName: string, patientName: string) => {
    const r = reports.find(
      (rep) => rep.testName.toLowerCase() === testName.toLowerCase() || rep.patientName === patientName
    ) || reports[0];
    setSelectedReportForView(r);
    setActiveTab("medical-records");
  };

  // Sidebar Menu Items
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "appointments", label: "Appointments", icon: Calendar, badge: appointments.length },
    { id: "patients", label: "Patients", icon: Users, badge: patients.length },
    { id: "medical-records", label: "Medical Records", icon: FileText },
    { id: "prescriptions", label: "Prescriptions", icon: Pill, badge: prescriptions.length },
    { id: "laboratory", label: "Laboratory", icon: Microscope, badge: labRequests.length },
    { id: "diagnostics", label: "Diagnostics", icon: Activity },
    { id: "followups", label: "Follow-ups", icon: RotateCcw, badge: followUps.length },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadNotifCount },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Logo & Doctor Info */}
          <div className="p-5 border-b border-border flex items-center justify-between">
            <a href="/" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground font-bold shadow-soft">
                Q
              </span>
              <span className="text-lg font-bold tracking-tight">
                Medi<span className="text-teal">Q</span> Doctor
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

          {/* Quick Doctor Profile Card */}
          <div
            onClick={() => {
              setActiveTab("profile");
              setSidebarOpen(false);
            }}
            className="p-4 border-b border-border/60 bg-muted/20 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3"
          >
            <img
              src={doctorProfile.avatar}
              alt={doctorProfile.name}
              className="h-10 w-10 rounded-xl object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{doctorProfile.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">{doctorProfile.specialization}</p>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
            <a href="/" onClick={() => setSidebarOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-bold text-primary bg-primary/10 hover:bg-primary/15 transition-colors mb-1">
              <Home className="h-4 w-4 shrink-0" />
              <span>Home</span>
            </a>
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as SidebarTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? "gradient-primary text-primary-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComponent className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <Badge
                      className={`text-[10px] px-1.5 py-0 rounded-full font-bold ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-primary/15 text-primary dark:bg-primary/25"
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

        {/* Sidebar Footer */}
        <div className="space-y-3 border-t border-border p-3">
          <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> On Duty
            </span>
            <a href="/" className="flex items-center gap-1 font-semibold transition-colors hover:text-foreground">
              Main Site <ChevronRight className="h-3 w-3" />
            </a>
          </div>
          <Button variant="ghost" onClick={() => { setSidebarOpen(false); setLogoutConfirmOpen(true); }} className="h-10 w-full justify-start gap-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 hover:text-destructive" aria-label="Sign out of MediQ">
            <LogOut className="h-4 w-4" /> Sign out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
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
                  Good Morning, {doctorProfile.name}
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Here's your healthcare overview for today.
                </p>
              </div>
            </div>

            {/* Controls */}
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
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
                )}
              </Button>

              {activeTab !== "consultation" && (
                <Button
                  onClick={() => {
                    const nextApt = appointments.find(
                      (a) => a.status === "Waiting" || a.status === "Checked In"
                    ) || appointments[0];
                    handleStartConsultation(nextApt);
                  }}
                  className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs hidden sm:inline-flex"
                >
                  <Stethoscope className="mr-1.5 h-4 w-4" /> Start Next Consultation
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <DoctorOverview
              appointments={appointments}
              patients={patients}
              prescriptions={prescriptions}
              followUps={followUps}
              labRequests={labRequests}
              onNavigateTab={(tab) => setActiveTab(tab as SidebarTab)}
              onStartConsultation={handleStartConsultation}
              onOpenPatientProfile={handleOpenPatientProfile}
            />
          )}

          {activeTab === "appointments" && (
            <TodayAppointments
              appointments={appointments}
              patients={patients}
              onStartConsultation={handleStartConsultation}
              onOpenPatientProfile={handleOpenPatientProfile}
              onUpdateStatus={(id, status) =>
                setAppointments((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, status } : a))
                )
              }
              onAddAppointment={handleAddAppointment}
            />
          )}

          {activeTab === "patients" && (
            <TodayAppointments
              appointments={appointments}
              patients={patients}
              onStartConsultation={handleStartConsultation}
              onOpenPatientProfile={handleOpenPatientProfile}
              onUpdateStatus={(id, status) =>
                setAppointments((prev) =>
                  prev.map((a) => (a.id === id ? { ...a, status } : a))
                )
              }
              onAddAppointment={handleAddAppointment}
            />
          )}

          {activeTab === "consultation" && (
            <ConsultationWorkspace
              appointment={activeConsultationApt}
              patient={activeConsultationPatient}
              onSaveConsultation={handleSaveConsultation}
              onOpenPrescription={() => setActiveTab("prescriptions")}
              onOpenLabRequest={() => setActiveTab("laboratory")}
              onOpenDiagnosticRequest={() => setActiveTab("diagnostics")}
            />
          )}

          {activeTab === "prescriptions" && (
            <DigitalPrescriptionBuilder
              doctor={doctorProfile}
              patients={patients}
              activePatient={activeConsultationPatient}
              onSavePrescription={handleSavePrescription}
            />
          )}

          {activeTab === "laboratory" && (
            <LaboratoryModule
              requests={labRequests}
              patients={patients}
              onRequestTest={handleCreateLabRequest}
              onUpdateStatus={(id, status) =>
                setLabRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status } : r))
                )
              }
              onOpenReport={handleOpenReportByName}
            />
          )}

          {activeTab === "diagnostics" && (
            <DiagnosticsModule
              requests={diagnosticRequests}
              patients={patients}
              onRequestDiagnostic={handleCreateDiagnosticRequest}
              onUpdateStatus={(id, status) =>
                setDiagnosticRequests((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, status } : r))
                )
              }
              onOpenReport={handleOpenReportByName}
            />
          )}

          {(activeTab === "medical-records" || activeTab === "reports") && (
            <ReportsModule
              reports={reports}
              selectedReport={selectedReportForView}
            />
          )}

          {activeTab === "followups" && (
            <FollowUpsModule
              followUps={followUps}
              patients={patients}
              onOpenPatientProfile={handleOpenPatientProfile}
              onUpdateStatus={(id, status) =>
                setFollowUps((prev) =>
                  prev.map((f) => (f.id === id ? { ...f, status } : f))
                )
              }
            />
          )}

          {activeTab === "notifications" && <DynamicNotificationsModule userId={authProfile?.id} />}

          {activeTab === "profile" && (
            <DoctorProfileModule
              profile={doctorProfile}
              onUpdateProfile={async (updated) => {
                if (!updated.id) {
                  return { success: false, message: "Your account profile is not ready. Please refresh and try again." };
                }

                const profilePayload = {
                  name: updated.name.trim(),
                  email: updated.email.trim(),
                  phone: updated.phone.trim(),
                  avatar_url: updated.avatar || "",
                  specialty: updated.specialization.trim() || null,
                  department: updated.department.trim() || null,
                  working_hours: updated.availableHours.trim() || null,
                  consultation_fee_bdt: Math.max(0, Number(updated.consultationFee) || 0),
                };
                let { error } = await updateSupabaseProfile(updated.id, profilePayload);

                // Keeps the panel usable while an older deployment is waiting
                // for the departments migration, without masking unrelated
                // Supabase failures.
                if (error && /department/i.test(error.message || "")) {
                  const fallback = await updateSupabaseProfile(updated.id, {
                    name: profilePayload.name,
                    email: profilePayload.email,
                    phone: profilePayload.phone,
                    avatar_url: profilePayload.avatar_url,
                    specialty: profilePayload.specialty,
                    working_hours: profilePayload.working_hours,
                    consultation_fee_bdt: profilePayload.consultation_fee_bdt,
                  });
                  error = fallback.error;
                }

                if (error) {
                  return { success: false, message: error.message || "Supabase rejected the profile update." };
                }

                setDoctorProfile(updated);
                const currentSchedule = getDoctorSchedules()[updated.id];
                if (currentSchedule) {
                  updateDoctorSchedule({
                    ...currentSchedule,
                    doctorName: updated.name || currentSchedule.doctorName,
                    specialization: updated.specialization || currentSchedule.specialization,
                    department: updated.department || currentSchedule.department,
                    consultationFee: Math.max(0, Number(updated.consultationFee) || 0),
                  });
                }

                return { success: true };
              }}
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
            <Button variant="outline" className="flex-1" onClick={() => setLogoutConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" className="flex-1" onClick={handleConfirmLogout}>Sign Out</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Patient Profile Slide-over Modal */}
      <PatientProfileModal
        patient={selectedPatientModal}
        open={patientModalOpen}
        onOpenChange={setPatientModalOpen}
        onStartConsultation={(p) => {
          const apt = appointments.find((a) => a.patientId === p.id) || appointments[0];
          handleStartConsultation(apt);
        }}
        onOpenReport={(rep) => {
          setSelectedReportForView(rep);
          setActiveTab("medical-records");
        }}
        reports={reports}
      />
    </div>
  );
}
