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
  ShoppingBag,
  ShieldCheck,
  Pill,
  Package,
  Tag,
  Truck,
  FileText,
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
  initialPharmacistProfile,
  initialPrescriptionsToVerify,
  initialPharmacyOrders,
  initialMedicines,
  initialSuppliers,
  PharmacistProfile,
  PrescriptionToVerify,
  PharmacyOrder,
  PharmacyMedicine,
  PharmacySupplier,
} from "@/data/pharmacy-data";
import {
  getDynamicMedicines,
  getDynamicPharmacyOrders,
  updateDynamicPharmacyOrderStatus,
  addDynamicMedicine,
  updateDynamicMedicine,
  deleteDynamicMedicine,
  getDynamicPharmacyCategories,
  getDynamicPrescriptionSubmissions,
  updateDynamicPrescriptionStatus,
} from "@/data/pharmacy-store";

import { PharmacyOverview } from "./PharmacyOverview";
import { PrescriptionVerificationModule } from "./PrescriptionVerificationModule";
import { PharmacyOrdersModule } from "./PharmacyOrdersModule";
import { MedicinesModule } from "./MedicinesModule";
import { InventoryModule } from "./InventoryModule";
import { CategoriesAndSuppliersModule } from "./CategoriesAndSuppliersModule";
import { PharmacyReportsModule } from "./PharmacyReportsModule";
import { PharmacistProfileModule } from "./PharmacistProfileModule";
import { DynamicNotificationsModule } from "../DynamicNotificationsModule";

export type PharmacyTab =
  | "dashboard"
  | "orders"
  | "prescriptions"
  | "medicines"
  | "inventory"
  | "categories"
  | "suppliers"
  | "reports"
  | "notifications"
  | "profile";

export function PharmacyLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<PharmacyTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Global Pharmacy State
  const [profile, setProfile] = useState<PharmacistProfile>(initialPharmacistProfile);
  const [prescriptions, setPrescriptions] = useState<PrescriptionToVerify[]>(initialPrescriptionsToVerify);
  const [orders, setOrders] = useState<PharmacyOrder[]>(initialPharmacyOrders);
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>(initialMedicines);
  const [categories, setCategories] = useState<import("@/data/pharmacy-data").PharmacyCategory[]>([]);
  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>(initialSuppliers);

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

  // Fetch data from dynamic store on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch dynamic pharmacy orders
        const ordersData = await getDynamicPharmacyOrders();
        if (ordersData && ordersData.length > 0) {
          setOrders(ordersData);
        }

        // Fetch dynamic medicines
        const medicinesData = await getDynamicMedicines();
        setMedicines(medicinesData);
        const categoriesData = await getDynamicPharmacyCategories();
        setCategories(categoriesData);

        // Fetch patient-uploaded prescriptions awaiting pharmacist review
        const prescriptionData = await getDynamicPrescriptionSubmissions();
        setPrescriptions(prescriptionData);
      } catch (error) {
        console.error("Error loading pharmacy data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const pendingRxCount = prescriptions.filter((p) => p.verificationStatus === "Pending").length;

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  // Handlers
  const handleVerifyPrescription = async (id: string) => {
    try {
      await updateDynamicPrescriptionStatus(id, "Verified", "Verified by pharmacist.");
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: "Verified", notes: "Verified by pharmacist." } : p)));
    } catch (error: any) {
      console.error("Prescription verification failed:", error);
      throw error;
    }
  };

  const handleRejectPrescription = async (id: string, reason: string) => {
    try {
      await updateDynamicPrescriptionStatus(id, "Rejected", reason);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: "Rejected", notes: reason } : p)));
    } catch (error: any) {
      console.error("Prescription rejection failed:", error);
      throw error;
    }
  };

  const handleClarifyPrescription = async (id: string, notes: string) => {
    try {
      await updateDynamicPrescriptionStatus(id, "Clarification Requested", notes);
      setPrescriptions((prev) => prev.map((p) => (p.id === id ? { ...p, verificationStatus: "Clarification Requested", notes } : p)));
    } catch (error: any) {
      console.error("Prescription clarification failed:", error);
      throw error;
    }
  };

  const handleUpdateOrderStatus = async (id: string, newStatus: any) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
    await updateDynamicPharmacyOrderStatus(id, newStatus);
  };

  const handleAddMedicine = (med: PharmacyMedicine) => {
    setMedicines((prev) => [med, ...prev.filter((m) => m.id !== med.id)]);
  };

  const handleUpdateMedicine = (medId: string, updates: Partial<PharmacyMedicine>) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, ...updates } : m))
    );
  };

  const handleDeleteMedicine = (medId: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== medId));
  };

  const handleRestockMedicine = async (id: string, qty: number) => {
    const med = medicines.find((m) => m.id === id);
    if (med) {
      const newStock = med.stock + qty;
      await updateDynamicMedicine(id, { stock: newStock });
      setMedicines((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                stock: newStock,
                stockStatus: newStock > m.reorderLevel ? "In Stock" : "Low Stock",
              }
            : m
        )
      );
    }
  };

  const handleAddOrder = (order: PharmacyOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  const handleAddSupplier = (supplier: PharmacySupplier) => {
    setSuppliers((prev) => [supplier, ...prev]);
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, badge: orders.filter((o) => o.orderStatus === "Pending").length },
    { id: "prescriptions", label: "Prescriptions", icon: ShieldCheck, badge: pendingRxCount },
    { id: "medicines", label: "Medicines", icon: Pill },
    { id: "inventory", label: "Inventory", icon: Package, badge: medicines.filter((m) => m.stockStatus === "Low Stock" || m.stockStatus === "Out of Stock").length },
    { id: "categories", label: "Categories", icon: Tag },
    { id: "suppliers", label: "Suppliers", icon: Truck },
    { id: "reports", label: "Reports", icon: FileText },
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
                Medi<span className="text-teal">Q</span> Pharmacy
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
                    setActiveTab(item.id as PharmacyTab);
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
            <span>MediQ Dispensing System</span>
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
                  MediQ Central Pharmacy Station
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Logged in as {profile.name} ({profile.licenseNo})
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
                size="icon"                onClick={() => setLogoutConfirmOpen(true)}
                className="rounded-full text-destructive hover:text-destructive"
                aria-label="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </Button>

              <Button
                variant="ghost"
                size="icon"                onClick={() => setActiveTab("prescriptions")}
                className="relative rounded-full text-teal"
                aria-label="Prescriptions"
              >
                <ShieldCheck className="h-5 w-5" />
                {pendingRxCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-background animate-pulse" />
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "dashboard" && (
            <PharmacyOverview
              orders={orders}
              prescriptions={prescriptions}
              medicines={medicines}
              onNavigateTab={(tab) => setActiveTab(tab as PharmacyTab)}
              onVerifyPrescription={handleVerifyPrescription}
            />
          )}

          {activeTab === "orders" && (
            <PharmacyOrdersModule
              orders={orders}
              onUpdateStatus={handleUpdateOrderStatus}
              onAddOrder={handleAddOrder}
            />
          )}

          {activeTab === "prescriptions" && (
            <PrescriptionVerificationModule
              prescriptions={prescriptions}
              onVerify={handleVerifyPrescription}
              onReject={handleRejectPrescription}
              onRequestClarification={handleClarifyPrescription}
            />
          )}

          {activeTab === "medicines" && (
            <MedicinesModule
              medicines={medicines}
              categories={categories}
              onAddMedicine={handleAddMedicine}
              onUpdateMedicine={handleUpdateMedicine}
              onDeleteMedicine={handleDeleteMedicine}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryModule
              medicines={medicines}
              onRestock={handleRestockMedicine}
            />
          )}

          {(activeTab === "categories" || activeTab === "suppliers") && (
            <CategoriesAndSuppliersModule
              suppliers={suppliers}
              categories={categories}
              onAddSupplier={handleAddSupplier}
            />
          )}

          {activeTab === "reports" && (
            <PharmacyReportsModule
              medicines={medicines}
              orders={orders}
            />
          )}

          {activeTab === "notifications" && <DynamicNotificationsModule userId={authProfile?.id} />}

          {activeTab === "profile" && (
            <PharmacistProfileModule
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
