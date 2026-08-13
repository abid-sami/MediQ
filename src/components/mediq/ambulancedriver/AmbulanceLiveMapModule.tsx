import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Navigation,
  MapPin,
  Hospital,
  Clock,
  Radio,
  Siren,
} from "lucide-react";
import { ActiveEmergencyTrip } from "@/data/ambulance-driver-data";

interface AmbulanceLiveMapModuleProps {
  activeTrip: ActiveEmergencyTrip | null;
}

export function AmbulanceLiveMapModule({
  activeTrip,
}: AmbulanceLiveMapModuleProps) {
  if (!activeTrip) {
    return (
      <div className="p-8 text-center bg-card border border-border rounded-2xl space-y-3">
        <Radio className="h-10 w-10 text-muted-foreground mx-auto" />
        <h3 className="font-bold text-base">No Active GPS Navigation</h3>
        <p className="text-xs text-muted-foreground">Standing by for active emergency dispatch assignment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header Info */}
      <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div>
          <span className="text-xs text-muted-foreground block font-mono">ID: {activeTrip.requestId}</span>
          <h3 className="font-bold text-sm text-foreground">{activeTrip.emergencyType}</h3>
        </div>

        <div className="text-right">
          <Badge className="bg-destructive text-destructive-foreground font-black text-xs">
            {activeTrip.distanceKm} km | {activeTrip.etaMinutes} Mins
          </Badge>
        </div>
      </div>

      {/* Live Map Box */}
      <div className="relative h-80 rounded-2xl border border-border bg-slate-900 dark:bg-slate-950 overflow-hidden shadow-lift flex flex-col justify-between p-4">
        {/* Map Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Live Status Overlay */}
        <div className="relative z-10 flex items-center justify-between">
          <Badge className="bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" /> LIVE GPS RADAR
          </Badge>

          <Badge variant="outline" className="bg-black/60 backdrop-blur-md text-white border-white/20 text-[11px] font-mono">
            {activeTrip.currentStep}
          </Badge>
        </div>

        {/* Simulated Route Visualization */}
        <div className="relative z-10 my-auto space-y-6">
          <div className="flex items-center justify-between px-6">
            {/* Pickup Node */}
            <div className="flex flex-col items-center space-y-1">
              <div className="h-10 w-10 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-red-500 animate-bounce">
                <MapPin className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-red-400 bg-black/60 px-2 py-0.5 rounded-full">
                Pickup
              </span>
            </div>

            {/* Pulsing Ambulance Icon moving on Route Line */}
            <div className="flex-1 mx-4 relative flex items-center">
              <div className="h-1 w-full bg-gradient-to-r from-red-500 via-amber-400 to-blue-500 rounded-full" />
              <div className="absolute left-1/2 -translate-x-1/2 h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg animate-pulse border-2 border-white">
                <Siren className="h-5 w-5" />
              </div>
            </div>

            {/* Hospital Node */}
            <div className="flex flex-col items-center space-y-1">
              <div className="h-10 w-10 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-blue-400">
                <Hospital className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-bold text-blue-400 bg-black/60 px-2 py-0.5 rounded-full">
                Hospital
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Location Address Bar */}
        <div className="relative z-10 bg-black/70 backdrop-blur-md border border-white/10 p-3 rounded-xl text-xs space-y-1 text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Current Target</span>
            <span className="text-[10px] text-emerald-400 font-bold">Fastest Route (Traffic Clean)</span>
          </div>
          <p className="font-semibold truncate">{activeTrip.pickupLocation}</p>
        </div>
      </div>
    </div>
  );
}
