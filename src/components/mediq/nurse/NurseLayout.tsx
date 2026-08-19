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
  Building2,
  Bed,
  Activity,
  FileText,
  Pill,
  ShieldAlert,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  Stethoscope,
  Loader2,
  LogOut,
  Home,
} from "lucide-react";
import {
  initialNurseProfile,
  initialNursePatients,
  initialVitalSignRecords,
  initialNursingNotes,
  initialMedicationTasks,
  initialWardBeds,
  initialNurseAlerts,
  NurseProfile,
  NursePatient,
  VitalSignRecord,
  NursingNoteItem,
  MedicationTask,
  WardBed,
  NurseAlert,
} from "@/data/nurse-data";
import {
  fetchSupabaseBeds,
  fetchSupabaseProfiles,
} from "@/services/supabase-service";

import { NurseOverview } from "./NurseOverview";
import { MyPatientsModule } from "./MyPatientsModule";
import { NursePatientProfileModal } from "./NursePatientProfileModal";
import { VitalSignsModule } from "./VitalSignsModule";
import { NursingNotesModule } from "./NursingNotesModule";
import { MedicationTasksModule } from "./MedicationTasksModule";
import { BedManagementModule } from "./BedManagementModule";
import { NurseAlertsModule } from "./NurseAlertsModule";
import { NurseProfileModule } from "./NurseProfileModule";
import { DynamicNotificationsModule } from "../DynamicNotificationsModule";

export type NurseTab =
  | "dashboard"
  | "my-patients"
  | "ward"
  | "beds"
  | "patient-vitals"
  | "nursing-notes"
  | "medication-tasks"
  | "alerts"
  | "notifications"
  | "profile";

export function NurseLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<NurseTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global Nurse State
  const [nurseProfile, setNurseProfile] = useState<NurseProfile>(initialNurseProfile);
  const [patients, setPatients] = useState<NursePatient[]>(initialNursePatients);
  const [vitalsHistory, setVitalsHistory] = useState<VitalSignRecord[]>(initialVitalSignRecords);
  const [nursingNotes, setNursingNotes] = useState<NursingNoteItem[]>(initialNursingNotes);
  const [medicationTasks, setMedicationTasks] = useState<MedicationTask[]>(initialMedicationTasks);
  const [wardBeds, setWardBeds] = useState<WardBed[]>(initialWardBeds);
  const [alerts, setAlerts] = useState<NurseAlert[]>(initialNurseAlerts);

  // Active Patient for Chart Modal / Form
  const [selectedPatient, setSelectedPatient] = useState<NursePatient | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    if (authProfile) {
      setNurseProfile((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        email: authProfile.email || prev.email,
        phone: authProfile.phone || prev.phone,
        role: authProfile.role || prev.role,
      }));
    }
  }, [authProfile]);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch beds
        const bedsData = await fetchSupabaseBeds();
        if (bedsData && bedsData.length > 0) {
          // Transform to WardBed format
          const transformedBeds = bedsData.map((b: any) => ({
            id: b.id,
            bedNumber: b.bedNumber,
            wardType: b.wardType,
            floorNumber: b.floorNumber,
            dailyRate: b.dailyRate,
            status: b.status,
            admittedPatientName: b.admittedPatientName,
            attendingDoctor: b.attendingDoctor,
            admissionDate: b.admissionDate,
          }));
          setWardBeds(transformedBeds);
        }

        // Fetch patients
        const patientsData = await fetchSupabaseProfiles("Patient");
        if (patientsData && patientsData.length > 0) {
          const transformedPatients = patientsData.map((p: any) => ({
            id: p.id,
            name: p.name,
            age: 35,
            gender: "Other",
            bloodGroup: p.bloodGroup || "O+",
            admission: p.email ? `${p.email}@hospital` : "ICU",
            room: "Room A",
            bed: "Bed 101",
            attending: "Dr. Smith",
            diagnosis: "General Care",
            status: "Stable",
            latestVitals: {
              bp: "120/80 mmHg",
              pulse: "75 bpm",
              temp: "37°C",
              spo2: "98%",
            },
          }));
          setPatients(transformedPatients);
        }
      } catch (error) {
        console.error("Error loading nurse data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const unreadAlertsCount = alerts.filter((a) => !a.resolved).length;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  // Handlers
  const handleOpenProfile = (patient: NursePatient) => {
    setSelectedPatient(patient);
    setProfileModalOpen(true);
  };

  const handleRecordVitals = (record: VitalSignRecord) => {
    setVitalsHistory((prev) => [record, ...prev]);
    // Update patient's latest vitals
    setPatients((prev) =>
      prev.map((p) =>
        p.id === record.patientId
          ? {
              ...p,
              latestVitals: {
                bp: `${record.bp} mmHg`,
                pulse: `${record.pulse} bpm`,
                temp: `${record.temp} °F`,
                spo2: `${record.spo2}%`,
                rr: `${record.rr} bpm`,
                weight: `${record.weight} kg`,
                recordedAt: "Just now",
              },
            }
          : p
      )
    );
  };

  const handleAddNursingNote = (note: NursingNoteItem) => {
    setNursingNotes((prev) => [note, ...prev]);
  };

  const handleUpdateMedicationStatus = (
    id: string,
    newStatus: MedicationTask["status"]
  ) => {
    setMedicationTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
    );
  };

  const handleUpdateBedStatus = (id: string, newStatus: WardBed["status"]) => {
    setWardBeds((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
  };

  const handleResolveAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, resolved: true } : a))
    );
  };

  const handleAddPatient = (pat: NursePatient) => {
    setPatients((prev) => [pat, ...prev]);
  };

  const handleAddBed = (bed: WardBed) => {
    setWardBeds((prev) => [bed, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "my-patients", label: "My Patients", icon: Users, badge: patients.length },
    { id: "ward", label: "Ward", icon: Building2 },
    { id: "beds", label: "Beds", icon: Bed, badge: wardBeds.filter((b) => b.status === "Available").length },
    { id: "patient-vitals", label: "Patient Vitals", icon: Activity },
    { id: "nursing-notes", label: "Nursing Notes", icon: FileText, badge: nursingNotes.length },
    { id: "medication-tasks", label: "Medication Tasks", icon: Pill, badge: medicationTasks.filter((m) => m.status === "Pending").length },
    { id: "alerts", label: "Alerts", icon: ShieldAlert, badge: unreadAlertsCount },
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
                Medi<span className="text-teal">Q</span> Nurse
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
              src={nurseProfile.avatar}
              alt={nurseProfile.name}
              className="h-10 w-10 rounded-xl object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{nurseProfile.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">{nurseProfile.role}</p>
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
                    setActiveTab(item.id as NurseTab);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
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
            <span>Ward 4A Active Shift</span>
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
                  Cardiovascular Care Unit — Ward 4A
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Logged in as {nurseProfile.name} ({nurseProfile.shift})
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
                onClick={() => setActiveTab("alerts")}
                className="relative rounded-full"
                aria-label="Alerts"
              >
                <ShieldAlert className="h-5 w-5 text-destructive" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <NurseOverview
              currentWard={nurseProfile.ward}
              patients={patients}
              medicationTasks={medicationTasks}
              beds={wardBeds}
              alerts={alerts}
              onNavigateTab={(tab) => setActiveTab(tab as NurseTab)}
              onOpenPatientProfile={handleOpenProfile}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {activeTab === "my-patients" && (
            <MyPatientsModule
              patients={patients}
              onOpenProfile={handleOpenProfile}
              onRecordVitalsClick={(p) => {
                setSelectedPatient(p);
                setActiveTab("patient-vitals");
              }}
              onAddNoteClick={(p) => {
                setSelectedPatient(p);
                setActiveTab("nursing-notes");
              }}
              onAddPatient={handleAddPatient}
            />
          )}

          {(activeTab === "ward" || activeTab === "beds") && (
            <BedManagementModule
              beds={wardBeds}
              onUpdateBedStatus={handleUpdateBedStatus}
              onAddBed={handleAddBed}
            />
          )}

          {activeTab === "patient-vitals" && (
            <VitalSignsModule
              patients={patients}
              vitalRecords={vitalsHistory}
              activePatient={selectedPatient}
              onRecordVitals={handleRecordVitals}
            />
          )}

          {activeTab === "nursing-notes" && (
            <NursingNotesModule
              patients={patients}
              notes={nursingNotes}
              activePatient={selectedPatient}
              onAddNote={handleAddNursingNote}
            />
          )}

          {activeTab === "medication-tasks" && (
            <MedicationTasksModule
              tasks={medicationTasks}
              onUpdateStatus={handleUpdateMedicationStatus}
            />
          )}

          {activeTab === "alerts" && (
            <NurseAlertsModule
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {activeTab === "notifications" && <DynamicNotificationsModule userId={authProfile?.id} />}

          {activeTab === "profile" && (
            <NurseProfileModule
              profile={nurseProfile}
              onUpdateProfile={(updated) => { setNurseProfile(updated); if (updated.id && updated.avatar) void updateSupabaseProfile(updated.id, { avatar_url: updated.avatar }); }}
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

      {/* Patient Profile Modal */}
      <NursePatientProfileModal
        patient={selectedPatient}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
        nursingNotes={nursingNotes}
        onRecordVitalsClick={(p) => {
          setSelectedPatient(p);
          setActiveTab("patient-vitals");
        }}
        onAddNoteClick={(p) => {
          setSelectedPatient(p);
          setActiveTab("nursing-notes");
        }}
      />
    </div>
  );
}
