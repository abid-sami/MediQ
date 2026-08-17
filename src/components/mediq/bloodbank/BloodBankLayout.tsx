import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { LanguageToggle } from "../LanguageToggle";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Droplet,
  Siren,
  Users,
  TestTube,
  BookmarkCheck,
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
} from "lucide-react";
import {
  initialBloodBankStaffProfile,
  initialBloodGroups,
  initialBloodRequests,
  initialDonors,
  initialDonations,
  initialReservations,
  BloodBankStaffProfile,
  BloodGroupItem,
  BloodGroupType,
  BloodRequestItem,
  BloodDonor,
  BloodDonation,
  BloodReservation,
} from "@/data/blood-bank-data";
import {
  fetchSupabaseBloodInventory,
  fetchSupabaseBloodRequests,
  fetchSupabaseBloodDonors,
  updateSupabaseBloodRequestStatus,
  updateSupabaseBloodInventory,
} from "@/services/supabase-service";

import { BloodBankOverview } from "./BloodBankOverview";
import { BloodInventoryModule } from "./BloodInventoryModule";
import { BloodRequestsModule } from "./BloodRequestsModule";
import { DonorManagementModule } from "./DonorManagementModule";
import { DonationsModule } from "./DonationsModule";
import { ReservationsModule } from "./ReservationsModule";
import { BloodBankProfileModule } from "./BloodBankProfileModule";
import { NotificationsModule } from "../doctor/NotificationsModule";

export type BloodBankTab =
  | "dashboard"
  | "inventory"
  | "requests"
  | "donors"
  | "donations"
  | "reservations"
  | "notifications"
  | "profile";

export function BloodBankLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<BloodBankTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global State
  const [staffProfile, setStaffProfile] = useState<BloodBankStaffProfile>(initialBloodBankStaffProfile);
  const [groups, setGroups] = useState<BloodGroupItem[]>(initialBloodGroups);
  const [requests, setRequests] = useState<BloodRequestItem[]>(initialBloodRequests);
  const [donors, setDonors] = useState<BloodDonor[]>(initialDonors);
  const [donations, setDonations] = useState<BloodDonation[]>(initialDonations);
  const [reservations, setReservations] = useState<BloodReservation[]>(initialReservations);

  useEffect(() => {
    if (authProfile) {
      setStaffProfile((prev) => ({
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

        // Fetch blood inventory
        const inventoryData = await fetchSupabaseBloodInventory();
        if (inventoryData && inventoryData.length > 0) {
          setGroups(inventoryData);
        }

        // Fetch blood requests
        const requestsData = await fetchSupabaseBloodRequests();
        if (requestsData && requestsData.length > 0) {
          setRequests(requestsData);
        }

        // Fetch blood donors
        const donorsData = await fetchSupabaseBloodDonors();
        if (donorsData && donorsData.length > 0) {
          setDonors(donorsData);
        }
      } catch (error) {
        console.error("Error loading blood bank data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pendingRequestsCount = requests.filter((r) => r.status === "Pending").length;
  const emergencyCount = requests.filter((r) => r.urgency === "Emergency" && r.status === "Pending").length;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  // Handlers
  const handleApproveRequest = (id: string) => {
    const target = requests.find((r) => r.id === id || r.requestId === id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id || r.requestId === id ? { ...r, status: "Approved" } : r))
    );
    if (target?.requestId || id) {
      updateSupabaseBloodRequestStatus(target?.requestId || id, "Approved");
    }
  };

  const handleRejectRequest = (id: string) => {
    const target = requests.find((r) => r.id === id || r.requestId === id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id || r.requestId === id ? { ...r, status: "Rejected" } : r))
    );
    if (target?.requestId || id) {
      updateSupabaseBloodRequestStatus(target?.requestId || id, "Rejected");
    }
  };

  const handleReserveRequest = (id: string) => {
    const target = requests.find((r) => r.id === id || r.requestId === id);
    setRequests((prev) =>
      prev.map((r) => (r.id === id || r.requestId === id ? { ...r, status: "Reserved" } : r))
    );
    if (target?.requestId || id) {
      updateSupabaseBloodRequestStatus(target?.requestId || id, "Reserved");
    }
  };

  const handleFulfillRequest = (id: string) => {
    const req = requests.find((r) => r.id === id || r.requestId === id);
    if (req) {
      // Deduct inventory
      setGroups((prev) => {
        const next = prev.map((g) =>
          g.group === req.bloodGroup
            ? {
                ...g,
                availableUnits: Math.max(0, g.availableUnits - req.unitsNeeded),
                status: (g.availableUnits - req.unitsNeeded < g.criticalThreshold
                  ? "Critical"
                  : g.availableUnits - req.unitsNeeded < g.criticalThreshold + 5
                  ? "Low"
                  : "Normal") as BloodGroupItem["status"],
              }
            : g
        );
        const updated = next.find((g) => g.group === req.bloodGroup);
        if (updated) updateSupabaseBloodInventory(req.bloodGroup, updated.availableUnits, updated.reservedUnits);
        return next;
      });
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id || r.requestId === id ? { ...r, status: "Fulfilled" } : r))
    );
    if (req?.requestId || id) {
      updateSupabaseBloodRequestStatus(req?.requestId || id, "Fulfilled");
    }
  };

  const handleAddUnits = (group: BloodGroupType, units: number) => {
    setGroups((prev) => {
      const next = prev.map((g) =>
        g.group === group
          ? {
              ...g,
              availableUnits: g.availableUnits + units,
              status: (g.availableUnits + units > g.criticalThreshold ? "Normal" : "Low") as BloodGroupItem["status"],
            }
          : g
      );
      const updated = next.find((g) => g.group === group);
      if (updated) updateSupabaseBloodInventory(group, updated.availableUnits, updated.reservedUnits);
      return next;
    });
  };

  const handleRemoveUnits = (group: BloodGroupType, units: number) => {
    setGroups((prev) => {
      const next = prev.map((g) =>
        g.group === group
          ? {
              ...g,
              availableUnits: Math.max(0, g.availableUnits - units),
              status: (g.availableUnits - units < g.criticalThreshold ? "Critical" : "Low") as BloodGroupItem["status"],
            }
          : g
      );
      const updated = next.find((g) => g.group === group);
      if (updated) updateSupabaseBloodInventory(group, updated.availableUnits, updated.reservedUnits);
      return next;
    });
  };

  const handleReserveUnits = (group: BloodGroupType, units: number) => {
    setGroups((prev) => {
      const next = prev.map((g) =>
        g.group === group
          ? {
              ...g,
              availableUnits: Math.max(0, g.availableUnits - units),
              reservedUnits: g.reservedUnits + units,
            }
          : g
      );
      const updated = next.find((g) => g.group === group);
      if (updated) updateSupabaseBloodInventory(group, updated.availableUnits, updated.reservedUnits);
      return next;
    });
  };

  const handleMarkExpired = (group: BloodGroupType, units: number) => {
    setGroups((prev) => {
      const next = prev.map((g) =>
        g.group === group
          ? {
              ...g,
              availableUnits: Math.max(0, g.availableUnits - units),
            }
          : g
      );
      const updated = next.find((g) => g.group === group);
      if (updated) updateSupabaseBloodInventory(group, updated.availableUnits, updated.reservedUnits);
      return next;
    });
  };

  const handleAddDonor = (donor: BloodDonor) => {
    setDonors((prev) => [donor, ...prev]);
  };

  const handleRecordDonation = (donation: BloodDonation) => {
    setDonations((prev) => [donation, ...prev]);
  };

  const handleAddRequest = (req: BloodRequestItem) => {
    setRequests((prev) => [req, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory", label: "Blood Inventory", icon: Droplet },
    { id: "requests", label: "Blood Requests", icon: Siren, badge: pendingRequestsCount },
    { id: "donors", label: "Donors", icon: Users, badge: donors.length },
    { id: "donations", label: "Donations", icon: TestTube, badge: donations.length },
    { id: "reservations", label: "Reservations", icon: BookmarkCheck, badge: reservations.length },
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
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-red-500 text-white font-bold shadow-soft">
                Q
              </span>
              <span className="text-lg font-bold tracking-tight">
                Medi<span className="text-red-500">Q</span> Blood Bank
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
              src={staffProfile.avatar}
              alt={staffProfile.name}
              className="h-10 w-10 rounded-xl object-cover border border-red-500/40"
            />
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs truncate">{staffProfile.name}</h4>
              <p className="text-[11px] text-muted-foreground truncate">{staffProfile.role}</p>
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
                    setActiveTab(item.id as BloodBankTab);
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
                        active ? "bg-white/20 text-white" : "bg-red-500/20 text-red-500"
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
          <span>Central Repository</span>
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
                  Central Transfusion & Blood Repository
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Logged in as {staffProfile.name} ({staffProfile.badgeId})
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
                onClick={() => setActiveTab("requests")}
                className="relative rounded-full text-destructive"
                aria-label="Requests"
              >
                <Siren className="h-5 w-5" />
                {emergencyCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <BloodBankOverview
              groups={groups}
              requests={requests}
              donations={donations}
              reservations={reservations}
              onNavigateTab={(tab) => setActiveTab(tab as BloodBankTab)}
              onApproveRequest={handleApproveRequest}
            />
          )}

          {activeTab === "inventory" && (
            <BloodInventoryModule
              groups={groups}
              onAddUnits={handleAddUnits}
              onRemoveUnits={handleRemoveUnits}
              onReserveUnits={handleReserveUnits}
              onMarkExpired={handleMarkExpired}
            />
          )}

          {activeTab === "requests" && (
            <BloodRequestsModule
              requests={requests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onReserve={handleReserveRequest}
              onFulfill={handleFulfillRequest}
              onAddRequest={handleAddRequest}
            />
          )}

          {activeTab === "donors" && (
            <DonorManagementModule
              donors={donors}
              onAddDonor={handleAddDonor}
            />
          )}

          {activeTab === "donations" && (
            <DonationsModule
              donations={donations}
              donors={donors}
              onRecordDonation={handleRecordDonation}
            />
          )}

          {activeTab === "reservations" && (
            <ReservationsModule reservations={reservations} />
          )}

          {activeTab === "notifications" && (
            <BloodRequestsModule
              requests={requests}
              onApprove={handleApproveRequest}
              onReject={handleRejectRequest}
              onReserve={handleReserveRequest}
              onFulfill={handleFulfillRequest}
              onAddRequest={handleAddRequest}
            />
          )}

          {activeTab === "profile" && (
            <BloodBankProfileModule
              profile={staffProfile}
              onUpdateProfile={setStaffProfile}
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
