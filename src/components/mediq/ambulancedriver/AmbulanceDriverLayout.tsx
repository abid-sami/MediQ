import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/hooks/use-theme";
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

import { AmbulanceDriverDashboard } from "./AmbulanceDriverDashboard";
import { AmbulanceLiveMapModule } from "./AmbulanceLiveMapModule";
import { AmbulanceTripHistoryModule } from "./AmbulanceTripHistoryModule";
import { AmbulanceDriverProfileModule } from "./AmbulanceDriverProfileModule";

export type AmbulanceTab = "dispatch" | "map" | "history" | "profile";

export function AmbulanceDriverLayout() {
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<AmbulanceTab>("dispatch");
  const [profile, setProfile] = useState<AmbulanceDriverProfile>(initialAmbulanceDriverProfile);
  const [activeTrip, setActiveTrip] = useState<ActiveEmergencyTrip | null>(initialActiveTrip);
  const [history, setHistory] = useState<CompletedTripHistory[]>(initialTripHistory);

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
    </div>
  );
}
