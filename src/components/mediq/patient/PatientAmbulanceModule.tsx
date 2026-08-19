import React, { useState } from "react";
// Design: Guided Floorplan — emergency status reflects the live dispatch feed and never invents a vehicle, driver, or ETA.
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Siren,
  PhoneCall,
  MapPin,
  Clock,
  Navigation,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { ActiveAmbulance } from "@/data/patient-data";

interface PatientAmbulanceModuleProps {
  ambulance: ActiveAmbulance | null;
}

export function PatientAmbulanceModule({
  ambulance,
}: PatientAmbulanceModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2 text-destructive">
            <Siren className="h-6 w-6 animate-pulse" /> Emergency Response & Ambulance Service
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            View the current status of your live MediQ emergency dispatch.
          </p>
        </div>
      </div>

      {/* Live Tracking Dashboard */}
      {ambulance ? (
        <div className="bg-card border-2 border-destructive/40 rounded-2xl p-6 space-y-6 shadow-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white font-mono text-xs">
                  {ambulance.requestId}
                </Badge>
                <Badge className="bg-emerald-500 text-white font-bold animate-pulse">
                  Status: {ambulance.status}
                </Badge>
              </div>
              <h3 className="text-lg font-bold mt-1 text-foreground">
                Live Dispatch Status
              </h3>
            </div>

            <div className="flex items-center gap-2 bg-destructive/10 p-3 rounded-xl border border-destructive/30">
              <Clock className="h-5 w-5 text-destructive animate-spin" />
              <div>
                <span className="text-[10px] text-muted-foreground block">ESTIMATED ARRIVAL</span>
                <span className="text-lg font-extrabold text-destructive">
                  {ambulance.etaMinutes > 0 ? `${ambulance.etaMinutes} MINS` : "Awaiting update"}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">DRIVER</span>
              <span className="font-bold text-sm text-foreground">{ambulance.driverName || "Awaiting assignment"}</span>
              {ambulance.driverPhone && <p className="text-[11px] text-primary font-bold mt-1 flex items-center gap-1"><PhoneCall className="h-3 w-3" /> {ambulance.driverPhone}</p>}
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">AMBULANCE UNIT</span>
              <span className="font-bold text-sm text-foreground">{ambulance.ambulanceUnit || "Awaiting assignment"}</span>
              <p className="text-[11px] text-muted-foreground mt-1">{ambulance.ambulanceType || "Dispatch details pending"}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">PICKUP LOCATION</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" /> {ambulance.pickupLocation}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-muted/30 border border-border">
              <span className="text-[10px] font-bold uppercase text-muted-foreground block">DESTINATION</span>
              <span className="font-semibold text-foreground flex items-center gap-1">
                <Navigation className="h-3.5 w-3.5 text-teal shrink-0" /> {ambulance.destination || "Not yet confirmed"}
              </span>
            </div>
          </div>

          {/* Live Tracking Map Pulse Animation */}
          <div className="relative h-32 rounded-xl bg-slate-900 overflow-hidden flex items-center justify-center border border-border">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
            <div className="relative z-10 text-center space-y-1">
              <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/20 text-red-400 ring-4 ring-red-500/30 animate-pulse">
                <Navigation className="h-6 w-6" />
              </div>
              <p className="text-xs font-bold text-white tracking-wider">LIVE DISPATCH FEED</p>
              <p className="text-[10px] text-slate-400">Location updates appear when they are published by the dispatch team.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-destructive/30 bg-destructive/5 px-6 py-14 text-center">
          <Siren className="h-9 w-9 text-destructive/70" />
          <p className="text-base font-bold text-foreground">No active ambulance dispatch</p>
          <p className="max-w-md text-xs text-muted-foreground">When MediQ receives and assigns an emergency request for your account, the live dispatch details will appear here.</p>
          <Button asChild className="gradient-emergency text-white font-bold text-xs rounded-xl"><a href="/#emergency">Open Emergency SOS</a></Button>
        </div>
      )}
    </div>
  );
}
