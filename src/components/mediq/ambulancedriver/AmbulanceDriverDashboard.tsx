import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Siren,
  PhoneCall,
  MapPin,
  Building2,
  Navigation,
  Clock,
  CheckCircle2,
  Play,
  UserCheck,
  Hospital,
  AlertTriangle,
  Radio,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import {
  ActiveEmergencyTrip,
  EmergencyStepStatus,
} from "@/data/ambulance-driver-data";

interface AmbulanceDriverDashboardProps {
  activeTrip: ActiveEmergencyTrip | null;
  onUpdateStep: (newStep: EmergencyStepStatus) => void;
  onResetTrip: () => void;
  onNavigateToMap: () => void;
  newRequestCount?: number;
  onAcknowledgeRequests?: () => void;
}

const EMERGENCY_STEPS: EmergencyStepStatus[] = [
  "Request Received",
  "Accepted",
  "Going to Pickup",
  "Patient Picked Up",
  "Going to Hospital",
  "Arrived",
  "Completed",
];

export function AmbulanceDriverDashboard({
  activeTrip,
  onUpdateStep,
  onResetTrip,
  onNavigateToMap,
  newRequestCount = 0,
  onAcknowledgeRequests,
}: AmbulanceDriverDashboardProps) {
  if (!activeTrip) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-4">
        <div className="h-24 w-24 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-500 animate-pulse">
          <Radio className="h-10 w-10" />
        </div>
        {newRequestCount > 0 && (
          <button type="button" onClick={onAcknowledgeRequests} className="flex items-center gap-2 rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-left text-destructive shadow-soft">
            <Siren className="h-5 w-5 animate-pulse" />
            <span><strong>{newRequestCount} new SOS request{newRequestCount === 1 ? "" : "s"}</strong><span className="block text-xs font-medium">Tap to review the latest emergency details.</span></span>
          </button>
        )}
        <h2 className="text-2xl font-black tracking-tight text-foreground">
          No Active Emergency
        </h2>
        <p className="text-sm font-semibold text-muted-foreground max-w-sm">
          Unit #ALS-911 is currently <strong>On Duty & Waiting for Assignment</strong> from MediQ Dispatch.
        </p>

        <Button
          onClick={() => {
            toast.info("Simulated emergency dispatch alert received!");
            window.location.reload();
          }}
          className="mt-4 gradient-emergency text-white font-bold rounded-2xl px-6 py-4 text-sm shadow-lift"
        >
          <Siren className="mr-2 h-4 w-4" /> Simulate Emergency Call
        </Button>
      </div>
    );
  }

  const currentStepIdx = EMERGENCY_STEPS.indexOf(activeTrip.currentStep);

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Active Emergency Banner */}
      <div className="bg-destructive text-destructive-foreground p-5 rounded-3xl shadow-lift space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-white animate-ping" />
            <Badge className="bg-white text-destructive font-black text-xs uppercase tracking-wider">
              🚨 ACTIVE EMERGENCY
            </Badge>
          </div>
          <span className="font-mono text-xs font-bold opacity-90">ID: {activeTrip.requestId}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
          {activeTrip.emergencyType}
        </h2>

        <div className="flex items-center justify-between pt-2 border-t border-white/20 text-xs font-bold">
          <span className="flex items-center gap-1">
            <Navigation className="h-4 w-4" /> Distance: {activeTrip.distanceKm} km
          </span>
          <span className="flex items-center gap-1 text-amber-200">
            <Clock className="h-4 w-4" /> ETA: {activeTrip.etaMinutes} Mins
          </span>
        </div>
      </div>

      {/* 7-Step Emergency Progress Tracker */}
      <div className="bg-card border border-border p-5 rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Emergency Dispatch Progress
        </h3>

        <div className="space-y-2">
          {EMERGENCY_STEPS.map((step, idx) => {
            const isCompleted = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={step}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs font-bold transition-all ${
                  isCurrent
                    ? "bg-primary text-primary-foreground border-primary shadow-soft"
                    : isCompleted
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "bg-muted/20 text-muted-foreground border-border/60"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-black ${
                      isCurrent
                        ? "bg-white text-primary"
                        : isCompleted
                        ? "bg-emerald-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? "✓" : idx + 1}
                  </span>
                  <span>{step}</span>
                </div>

                {isCurrent && (
                  <Badge className="bg-white/20 text-white font-bold text-[10px] animate-pulse">
                    CURRENT STATUS
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Essential Patient Information (No clutter!) */}
      <div className="bg-card border border-border p-5 rounded-2xl space-y-4 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Essential Patient & Location Details
        </h3>

        <div className="space-y-3 text-sm font-semibold">
          <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
            <span className="text-xs text-muted-foreground block font-normal">PATIENT NAME</span>
            <p className="text-base font-bold text-foreground">{activeTrip.patientName}</p>
            <p className="text-xs text-muted-foreground">Request ID: {activeTrip.requestId}</p>
            {activeTrip.requestTime && <p className="text-xs text-muted-foreground">Requested: {new Date(activeTrip.requestTime).toLocaleString()}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
              <span className="text-xs text-muted-foreground block font-normal">PHONE</span>
              <p className="text-sm font-bold text-foreground">{activeTrip.patientPhone || "Not provided"}</p>
            </div>
            <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
              <span className="text-xs text-muted-foreground block font-normal">EMERGENCY TYPE</span>
              <p className="text-sm font-bold text-destructive">{activeTrip.emergencyType}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
            <span className="text-xs text-muted-foreground block font-normal flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5 text-destructive" /> PICKUP LOCATION
            </span>
            <p className="text-sm font-bold text-foreground">{activeTrip.pickupLocation}</p>
          </div>

          <div className="p-3.5 rounded-xl bg-muted/20 border border-border space-y-1">
            <span className="text-xs text-muted-foreground block font-normal flex items-center gap-1">
              <Hospital className="h-3.5 w-3.5 text-primary" /> DESTINATION HOSPITAL
            </span>
            <p className="text-sm font-bold text-foreground">{activeTrip.destinationHospital}</p>
          </div>
        </div>
      </div>

      {/* One-Touch Quick Communication Triggers */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={`tel:${activeTrip.patientPhone}`}
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
        >
          <PhoneCall className="h-5 w-5" /> Call Patient
        </a>

        <a
          href="tel:+15559110000"
          className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-transform active:scale-95"
        >
          <Hospital className="h-5 w-5" /> Contact Hospital
        </a>
      </div>

      {/* Large Touch-Friendly Driver Action Buttons */}
      <div className="space-y-3 pt-2">
        {activeTrip.currentStep === "Request Received" && (
          <Button
            onClick={() => {
              onUpdateStep("Accepted");
              toast.success("ACCEPT REQUEST confirmed! Proceeding to pickup.");
            }}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <CheckCircle2 className="mr-2 h-6 w-6" /> ACCEPT REQUEST
          </Button>
        )}

        {activeTrip.currentStep === "Accepted" && (
          <Button
            onClick={() => {
              onUpdateStep("Going to Pickup");
              toast.info("START TRIP: En route to pickup location.");
            }}
            className="w-full gradient-primary text-primary-foreground font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <Play className="mr-2 h-6 w-6" /> START TRIP TO PICKUP
          </Button>
        )}

        {activeTrip.currentStep === "Going to Pickup" && (
          <Button
            onClick={() => {
              onUpdateStep("Arrived at Pickup" as any);
              onUpdateStep("Patient Picked Up");
              toast.info("ARRIVED AT PICKUP & PATIENT BOARDED.");
            }}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <UserCheck className="mr-2 h-6 w-6" /> PATIENT PICKED UP
          </Button>
        )}

        {activeTrip.currentStep === "Patient Picked Up" && (
          <Button
            onClick={() => {
              onUpdateStep("Going to Hospital");
              toast.info("En route to Destination Hospital!");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <Navigation className="mr-2 h-6 w-6" /> GOING TO HOSPITAL
          </Button>
        )}

        {activeTrip.currentStep === "Going to Hospital" && (
          <Button
            onClick={() => {
              onUpdateStep("Arrived");
              toast.info("ARRIVED AT HOSPITAL TRAUMA CENTER.");
            }}
            className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <Hospital className="mr-2 h-6 w-6" /> ARRIVED AT HOSPITAL
          </Button>
        )}

        {activeTrip.currentStep === "Arrived" && (
          <Button
            onClick={() => {
              onUpdateStep("Completed");
              toast.success("Emergency Trip Completed Successfully!");
            }}
            className="w-full gradient-primary text-primary-foreground font-black text-lg rounded-2xl py-7 shadow-lg"
          >
            <CheckCheck className="mr-2 h-6 w-6" /> COMPLETE TRIP
          </Button>
        )}

        {activeTrip.currentStep === "Completed" && (
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-center font-bold">
              ✓ Trip Completed & Patient Safely Handed Over
            </div>
            <Button
              onClick={onResetTrip}
              variant="outline"
              className="w-full font-bold rounded-2xl py-4"
            >
              Return to Standby Mode
            </Button>
          </div>
        )}

        <Button
          onClick={onNavigateToMap}
          variant="outline"
          className="w-full text-xs font-bold rounded-xl py-3 text-muted-foreground"
        >
          <Navigation className="mr-1.5 h-4 w-4 text-primary" /> View Live Route Navigation Map
        </Button>
      </div>
    </div>
  );
}
