import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
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
  OrderStatus,
} from "@/data/pharmacy-data";

import { PharmacyOverview } from "./PharmacyOverview";
import { PrescriptionVerificationModule } from "./PrescriptionVerificationModule";
import { PharmacyOrdersModule } from "./PharmacyOrdersModule";
import { MedicinesModule } from "./MedicinesModule";
import { InventoryModule } from "./InventoryModule";
import { CategoriesAndSuppliersModule } from "./CategoriesAndSuppliersModule";
import { PharmacyReportsModule } from "./PharmacyReportsModule";
import { PharmacistProfileModule } from "./PharmacistProfileModule";
import { NotificationsModule } from "../doctor/NotificationsModule";

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

  const [activeTab, setActiveTab] = useState<PharmacyTab>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Global Pharmacy State
  const [profile, setProfile] = useState<PharmacistProfile>(initialPharmacistProfile);
  const [prescriptions, setPrescriptions] = useState<PrescriptionToVerify[]>(initialPrescriptionsToVerify);
  const [orders, setOrders] = useState<PharmacyOrder[]>(initialPharmacyOrders);
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>(initialMedicines);
  const [suppliers, setSuppliers] = useState<PharmacySupplier[]>(initialSuppliers);

  const pendingRxCount = prescriptions.filter((p) => p.verificationStatus === "Pending").length;

  // Handlers
  const handleVerifyPrescription = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verificationStatus: "Verified" } : p))
    );
  };

  const handleRejectPrescription = (id: string, reason: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, verificationStatus: "Rejected", notes: reason } : p))
    );
  };

  const handleClarifyPrescription = (id: string, notes: string) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, verificationStatus: "Clarification Requested", notes } : p
      )
    );
  };

  const handleUpdateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, orderStatus: newStatus } : o))
    );
  };

  const handleAddMedicine = (med: PharmacyMedicine) => {
    setMedicines((prev) => [med, ...prev]);
  };

  const handleRestockMedicine = (id: string, qty: number) => {
    setMedicines((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              stock: m.stock + qty,
              stockStatus: m.stock + qty > m.reorderLevel ? "In Stock" : "Low Stock",
            }
          : m
      )
    );
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

        <div className="p-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
          <span>MediQ Dispensing System</span>
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
                  MediQ Central Pharmacy Station
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  Logged in as {profile.name} ({profile.licenseNo})
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
                onClick={() => setActiveTab("prescriptions")}
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
              onAddMedicine={handleAddMedicine}
            />
          )}

          {activeTab === "inventory" && (
            <InventoryModule
              medicines={medicines}
              onRestock={handleRestockMedicine}
            />
          )}

          {(activeTab === "categories" || activeTab === "suppliers") && (
            <CategoriesAndSuppliersModule suppliers={suppliers} />
          )}

          {activeTab === "reports" && (
            <PharmacyReportsModule
              medicines={medicines}
              orders={orders}
            />
          )}

          {activeTab === "notifications" && (
            <PrescriptionVerificationModule
              prescriptions={prescriptions}
              onVerify={handleVerifyPrescription}
              onReject={handleRejectPrescription}
              onRequestClarification={handleClarifyPrescription}
            />
          )}

          {activeTab === "profile" && (
            <PharmacistProfileModule
              profile={profile}
              onUpdateProfile={setProfile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
