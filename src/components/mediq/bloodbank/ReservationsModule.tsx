import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookmarkCheck,
  Calendar,
  Building2,
  User,
  Clock,
  Droplet,
} from "lucide-react";
import { BloodReservation } from "@/data/blood-bank-data";

interface ReservationsModuleProps {
  reservations: BloodReservation[];
}

export function ReservationsModule({
  reservations,
}: ReservationsModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <BookmarkCheck className="h-6 w-6 text-purple-600 dark:text-purple-400" /> Active Blood Unit Reservations
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Hold reserved blood units for scheduled cardiac surgeries, ICU patients, and emergency standby.
          </p>
        </div>
      </div>

      {/* Grid of Reservations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reservations.map((res) => (
          <div
            key={res.id}
            className="bg-card border border-purple-500/30 rounded-2xl p-5 hover:border-purple-500 transition-all shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                  {res.reservationId}
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold text-xs">
                  {res.reservedFor}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{res.patientName}</h3>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" /> {res.hospitalName}
              </p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Badge className="bg-red-500 text-white font-bold text-xs">
                  Group {res.bloodGroup}
                </Badge>
                <span className="font-bold text-foreground">{res.unitsReserved} Unit(s) Reserved</span>
              </div>

              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> Until {res.reservedUntil}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
