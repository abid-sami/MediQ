import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";
import {
  Siren,
  MapPin,
  History,
  User,
  Sun,
  Moon,
  ChevronRight,
  Radio,
  Navigation,
  Loader2,
  LogOut,
} from "lucide-react";
import {
  initialAmbulanceDriverProfile,
  initialActiveTrip,
  initialTripHistory,
  AmbulanceDriverProfile,
  ActiveEmergencyTrip,
  CompletedTripHistory,
  EmergencyStepStatus,
} from "@/data/ambulance-driver-data";
import {
  fetchSupabaseSOS,
} from "@/services/supabase-service";

import { AmbulanceDriverDashboard } from "./AmbulanceDriverDashboard";
import { AmbulanceLiveMapModule } from "./AmbulanceLiveMapModule";
import { AmbulanceTripHistoryModule } from "./AmbulanceTripHistoryModule";
import { AmbulanceDriverProfileModule } from "./AmbulanceDriverProfileModule";

export type AmbulanceTab = "dispatch" | "map" | "history" | "profile";

export function AmbulanceDriverLayout() {
  const { theme, toggleTheme } = useTheme();
  const { profile: authProfile, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<AmbulanceTab>("dispatch");
  const [loading, setLoading] = useState(true);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [profile, setProfile] = useState<AmbulanceDriverProfile>(initialAmbulanceDriverProfile);
  const [activeTrip, setActiveTrip] = useState<ActiveEmergencyTrip | null>(initialActiveTrip);
  const [history, setHistory] = useState<CompletedTripHistory[]>(initialTripHistory);

  useEffect(() => {
    if (authProfile) {
      setProfile((prev) => ({
        ...prev,
        id: authProfile.id || prev.id,
        name: authProfile.name || prev.name,
        avatar: authProfile.avatarUrl || prev.avatar,
        phone: authProfile.phone || prev.phone,
      }));
    }
  }, [authProfile]);

  // Fetch SOS requests on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Fetch SOS requests
        const sosData = await fetchSupabaseSOS();
        if (sosData && sosData.length > 0) {
          // Set the first SOS request as the active trip
          const firstSOS = sosData[0];
          setActiveTrip({
            requestId: firstSOS.requestId,
            pickupLocation: firstSOS.location,
            destinationHospital: firstSOS.destinationHospital,
            patientName: firstSOS.patientName,
            patientPhone: firstSOS.patientPhone,
            emergencyType: firstSOS.emergencyType,
            currentStep: "Going to Pickup",
          });
        }
      } catch (error) {
        console.error("Error loading ambulance data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleUpdateStep = (newStep: EmergencyStepStatus) => {
    if (!activeTrip) return;

    if (newStep === "Completed") {
      // Move to history
      const newHistoryItem: CompletedTripHistory = {
        id: `hist-${Date.now()}`,
        requestId: activeTrip.requestId,
        date: "Just now",
        pickupLocation: activeTrip.pickupLocation,
        destinationHospital: activeTrip.destinationHospital,
        durationMinutes: 12,
        status: "Completed",
      };
      setHistory((prev) => [newHistoryItem, ...prev]);
    }

    setActiveTrip((prev) => (prev ? { ...prev, currentStep: newStep } : null));
  };

  const handleResetTrip = () => {
    setActiveTrip(null);
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  const toggleDutyStatus = () => {
    setProfile((prev) => ({
      ...prev,
      dutyStatus: prev.dutyStatus === "On Duty" ? "Off Duty" : "On Duty",
    }));
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col pb-20">
      {/* Top Emergency Header */}
      <header className="sticky top-0 z-30 bg-card/90 backdrop-blur-md border-b border-border px-4 py-3 shadow-xs">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-destructive text-destructive-foreground font-black shadow-soft">
              🚨
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-base font-extrabold tracking-tight">MediQ ALS 911</h1>
                <Badge
                  onClick={toggleDutyStatus}
                  className={`cursor-pointer text-[10px] font-bold ${
                    profile.dutyStatus === "On Duty"
                      ? "bg-emerald-500 text-white"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {profile.dutyStatus}
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">{profile.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLogoutConfirmOpen(true)}
              className="rounded-full h-9 w-9 text-destructive hover:text-destructive"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>

            <a
              href="/"
              className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 pl-1"
            >
              Exit <ChevronRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 p-4 sm:p-6 max-w-2xl w-full mx-auto">
        {activeTab === "dispatch" && (
          <AmbulanceDriverDashboard
            activeTrip={activeTrip}
            onUpdateStep={handleUpdateStep}
            onResetTrip={handleResetTrip}
            onNavigateToMap={() => setActiveTab("map")}
          />
        )}

        {activeTab === "map" && (
          <AmbulanceLiveMapModule activeTrip={activeTrip} />
        )}

        {activeTab === "history" && (
          <AmbulanceTripHistoryModule history={history} />
        )}

        {activeTab === "profile" && (
          <AmbulanceDriverProfileModule
            profile={profile}
            onUpdateProfile={setProfile}
          />
        )}
      </main>

      {/* Mobile-First Bottom Action Navigation Bar */}
      <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-lg border-t border-border flex items-center justify-around py-2.5 px-2 shadow-2xl">
        <button
          onClick={() => setActiveTab("dispatch")}
          className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${
            activeTab === "dispatch" ? "text-destructive" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Siren className="h-5 w-5" />
          <span>Dispatch</span>
        </button>

        <button
          onClick={() => setActiveTab("map")}
          className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${
            activeTab === "map" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Navigation className="h-5 w-5" />
          <span>Live Map</span>
        </button>

        <button
          onClick={() => setActiveTab("history")}
          className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${
            activeTab === "history" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <History className="h-5 w-5" />
          <span>History</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${
            activeTab === "profile" ? "text-primary" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span>Profile</span>
        </button>
      </nav>

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
