import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  Building2,
  Stethoscope,
  User,
  UserCheck,
  Activity,
  Microscope,
  Pill,
  Droplet,
  Siren,
  Calendar,
  Bed,
  MapPin,
  FileText,
  CreditCard,
  Bell,
  BarChart,
  History,
  Settings,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  initialAdminProfile,
  AdminProfile,
  SystemUser,
  NetworkHospital,
  AdminSOSItem,
  AdminAuditLog,
} from "@/data/admin-data";
import { toast } from "sonner";
import {
  fetchSupabaseProfiles,
  fetchSupabaseHospitals,
  createSupabaseHospital,
  fetchSupabaseSOS,
  fetchSupabaseAuditLogs,
  updateSupabaseProfile,
  deleteSupabaseProfile,
} from "@/services/supabase-service";

import { AdminOverview } from "./AdminOverview";
import { UserManagementModule } from "./UserManagementModule";
import { HospitalManagementModule } from "./HospitalManagementModule";
import { DepartmentManagementModule } from "./DepartmentManagementModule";
import { IndoorNavigationManagementModule } from "./IndoorNavigationManagementModule";
import { EmergencyCommandCenterModule } from "./EmergencyCommandCenterModule";
import { AppointmentsMonitoringModule } from "./AppointmentsMonitoringModule";
import { BedsAndWardsMonitoringModule } from "./BedsAndWardsMonitoringModule";
import { BloodBankMonitoringModule } from "./BloodBankMonitoringModule";
import { PharmacyLabMonitoringModule } from "./PharmacyLabMonitoringModule";
import { AuditLogsAndSettingsModule } from "./AuditLogsAndSettingsModule";

export type AdminTab =
  | "dashboard"
  | "users"
  | "hospitals"
  | "departments"
  | "doctors"
  | "patients"
  | "receptionists"
  | "nurses"
  | "lab-staff"
  | "pharmacists"
  | "blood-bank-staff"
  | "drivers"
  | "appointments"
  | "emergency"
  | "ambulances"
  | "beds"
  | "ward-maps"
  | "diagnostics"
  | "pharmacy"
  | "blood-bank"
  | "prescriptions"
  | "medical-records"
  | "billing"
  | "notifications"
  | "reports"
  | "audit-logs"
  | "settings";

export function AdminLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global State
  const [profile, setProfile] = useState<AdminProfile>(initialAdminProfile);
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [hospitals, setHospitals] = useState<NetworkHospital[]>([]);
  const [sosItems, setSosItems] = useState<AdminSOSItem[]>([]);
  const [logs, setLogs] = useState<AdminAuditLog[]>([]);

  useEffect(() => {
    if (authProfile) {
      setProfile((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        email: authProfile.email || prev.email,
        phone: authProfile.phone || prev.phone,
      }));
    }
  }, [authProfile]);

  // Fetch data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch profiles (users)
        const profilesData = await fetchSupabaseProfiles();
        const fetchedUsers: SystemUser[] = (profilesData || []).map((p: any, idx: number) => {
          const safeId = String(p.id || `usr-${idx}-${Date.now()}`);
          const safeRole = String(p.role || "Patient");
          const roleCode = safeRole.replace(/[^a-zA-Z]/g, "").substring(0, 3).toUpperCase() || "USR";
          const idCode = safeId.substring(0, 4).toUpperCase();

          return {
            id: safeId,
            userId: p.badgeId || `USR-${roleCode}-${idCode}`,
            name: p.name || (p.email ? p.email.split("@")[0] : "User Account"),
            email: p.email || "",
            phone: p.phone || "",
            role: (p.role as any) || "Patient",
            status: "Active",
            registeredDate: new Date().toISOString().split("T")[0],
            lastActive: "Just now",
            avatar: p.avatarUrl || "",
            specialty: p.specialty || "",
            isFeatured: p.isFeatured || false,
          };
        });
        setUsers(fetchedUsers);

        // Fetch hospitals
        const hospitalsData = await fetchSupabaseHospitals();
        setHospitals(hospitalsData || []);

        // Fetch SOS requests
        const sosData = await fetchSupabaseSOS();
        setSosItems(sosData || []);

        // Fetch audit logs
        const logsData = await fetchSupabaseAuditLogs();
        setLogs(logsData || []);
      } catch (error) {
        console.error("Error loading admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  const handleUpdateUser = (updated: SystemUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    updateSupabaseProfile(updated.id, {
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      is_featured: updated.isFeatured ?? false,
    });
  };

  const handleAddUser = (user: SystemUser) => {
    setUsers((prev) => [user, ...prev]);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    deleteSupabaseProfile(userId);
    toast.success("User account deleted successfully.");
  };

  const handleAddHospital = async (hosp: NetworkHospital) => {
    setHospitals((prev) => [hosp, ...prev]);
    const { error } = await createSupabaseHospital({
      name: hosp.name,
      location: hosp.location,
      totalBeds: hosp.totalBeds,
      availableBeds: hosp.availableBeds,
      doctorCount: hosp.doctorCount,
    });
    if (error) {
      toast.error("Hospital saved locally but couldn't be synced to the database.");
      return;
    }
    const refreshed = await fetchSupabaseHospitals();
    setHospitals(refreshed || []);
  };

  const handleAddSOS = (sos: AdminSOSItem) => {
    setSosItems((prev) => [sos, ...prev]);
  };

  const navSections = [
    {
      group: "OVERVIEW & CONTROL",
      items: [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
        { id: "users", label: "Users Management", icon: Users, badge: (users || []).length },
        { id: "hospitals", label: "Hospitals", icon: Building2, badge: (hospitals || []).length },
        { id: "departments", label: "Departments", icon: Building2 },
      ],
    },
    {
      group: "STAFF & ROLES",
      items: [
        {
          id: "doctors",
          label: "Doctors",
          icon: Stethoscope,
          badge: (users || []).filter((u) => u?.role === "Doctor" || u?.role === "Dr").length,
        },
        {
          id: "patients",
          label: "Patients",
          icon: User,
          badge: (users || []).filter((u) => u?.role === "Patient").length,
        },
        {
          id: "receptionists",
          label: "Receptionists",
          icon: UserCheck,
          badge: (users || []).filter((u) => u?.role === "Receptionist").length,
        },
        {
          id: "nurses",
          label: "Nurses",
          icon: Activity,
          badge: (users || []).filter(
            (u) => u?.role === "Nurse" || u?.role === "Staff Nurse" || u?.role === "Registered Nurse"
          ).length,
        },
        {
          id: "lab-staff",
          label: "Lab Staff",
          icon: Microscope,
          badge: (users || []).filter(
            (u) => u?.role === "Lab Staff" || u?.role === "Lab Tech" || u?.role === "Laboratory Staff"
          ).length,
        },
        {
          id: "pharmacists",
          label: "Pharmacists",
          icon: Pill,
          badge: (users || []).filter((u) => u?.role === "Pharmacist" || u?.role === "Pharmacy Staff").length,
        },
        {
          id: "blood-bank-staff",
          label: "Blood Bank Staff",
          icon: Droplet,
          badge: (users || []).filter((u) => u?.role === "Blood Bank Staff").length,
        },
        {
          id: "drivers",
          label: "Ambulance Drivers",
          icon: Siren,
          badge: (users || []).filter((u) => u?.role === "Ambulance Driver" || u?.role === "Driver").length,
        },
      ],
    },
    {
      group: "CLINICAL OPERATIONS",
      items: [
        { id: "appointments", label: "Appointments", icon: Calendar },
        { id: "emergency", label: "Emergency / SOS", icon: Siren, badge: (sosItems || []).length },
        { id: "ambulances", label: "Ambulances", icon: Siren },
        { id: "beds", label: "Beds & Wards", icon: Bed },
        { id: "ward-maps", label: "Indoor Navigation", icon: MapPin },
        { id: "diagnostics", label: "Diagnostics", icon: Microscope },
        { id: "pharmacy", label: "Pharmacy", icon: Pill },
        { id: "blood-bank", label: "Blood Bank", icon: Droplet },
        { id: "prescriptions", label: "Prescriptions", icon: FileText },
        { id: "medical-records", label: "Medical Records", icon: FileText },
        { id: "billing", label: "Billing", icon: CreditCard },
      ],
    },
    {
      group: "PLATFORM GOVERNANCE",
      items: [
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "reports", label: "Reports", icon: BarChart },
        { id: "audit-logs", label: "Audit Logs", icon: History, badge: (logs || []).length },
        { id: "settings", label: "Settings", icon: Settings },
      ],
    },
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
              <span className="text-lg font-extrabold tracking-tight">
                Medi<span className="text-teal">Q</span> Command
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

          <div className="p-4 border-b border-border/60 bg-muted/20 flex items-center gap-3">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="h-10 w-10 rounded-xl object-cover border border-primary/30"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{profile.name}</h4>
              <p className="text-[10px] text-primary font-mono truncate">{profile.badgeId}</p>
            </div>
          </div>

          <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-210px)] text-xs">
            {navSections.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted-foreground px-2 block">
                  {sec.group}
                </span>

                {sec.items.map((item) => {
                  const IconComp = item.icon;
                  const active = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl font-semibold transition-all ${
                        active
                          ? "gradient-primary text-primary-foreground shadow-soft"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <IconComp className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge
                          className={`text-[9px] px-1.5 py-0 rounded-full font-bold ${
                            active ? "bg-white/20 text-white" : "bg-primary/15 text-primary"
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>Global Control Center</span>
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
                  MediQ Global Healthcare Command Center
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Authorized Administrator: {profile.name} ({profile.badgeId})
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
                onClick={() => setLogoutConfirmOpen(true)}
                className="rounded-full text-destructive hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveTab("emergency")}
                className="relative rounded-full text-destructive"
                aria-label="Emergency Calls"
              >
                <Siren className="h-5 w-5 animate-pulse" />
                <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background" />
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <AdminOverview
              users={users}
              hospitals={hospitals}
              sosItems={sosItems}
              logs={logs}
              onNavigateTab={(tab) => setActiveTab(tab as AdminTab)}
            />
          )}

          {(activeTab === "users" ||
            activeTab === "doctors" ||
            activeTab === "patients" ||
            activeTab === "receptionists" ||
            activeTab === "nurses" ||
            activeTab === "lab-staff" ||
            activeTab === "pharmacists" ||
            activeTab === "blood-bank-staff" ||
            activeTab === "drivers") && (
            <UserManagementModule
              users={users}
              activeTab={activeTab}
              onUpdateUser={handleUpdateUser}
              onAddUser={handleAddUser}
              onDeleteUser={handleDeleteUser}
            />
          )}

          {activeTab === "hospitals" && (
            <HospitalManagementModule
              hospitals={hospitals}
              onAddHospital={handleAddHospital}
            />
          )}

          {activeTab === "departments" && (
            <DepartmentManagementModule />
          )}

          {(activeTab === "emergency" || activeTab === "ambulances") && (
            <EmergencyCommandCenterModule
              sosItems={sosItems}
              onAddSOS={handleAddSOS}
            />
          )}

          {activeTab === "appointments" && (
            <AppointmentsMonitoringModule />
          )}

          {activeTab === "beds" && (
            <BedsAndWardsMonitoringModule />
          )}

          {activeTab === "ward-maps" && (
            <IndoorNavigationManagementModule />
          )}

          {activeTab === "blood-bank" && (
            <BloodBankMonitoringModule />
          )}

          {(activeTab === "diagnostics" ||
            activeTab === "pharmacy" ||
            activeTab === "prescriptions" ||
            activeTab === "medical-records" ||
            activeTab === "billing") && (
            <PharmacyLabMonitoringModule />
          )}

          {(activeTab === "audit-logs" ||
            activeTab === "settings" ||
            activeTab === "reports" ||
            activeTab === "notifications") && (
            <AuditLogsAndSettingsModule logs={logs} />
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
