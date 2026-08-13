import React from "react";
import { Badge } from "@/components/ui/badge";
import { History, Clock, MapPin, Hospital, CheckCircle2 } from "lucide-react";
import { CompletedTripHistory } from "@/data/ambulance-driver-data";

interface AmbulanceTripHistoryModuleProps {
  history: CompletedTripHistory[];
}

export function AmbulanceTripHistoryModule({
  history,
}: AmbulanceTripHistoryModuleProps) {
  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-xs">
        <div>
          <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-primary" /> Emergency Trip History
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log of completed emergency dispatches and patient transfers.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {history.map((t) => (
          <div
            key={t.id}
            className="bg-card border border-border rounded-2xl p-4 space-y-2 shadow-xs text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-primary">{t.requestId}</span>
              <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ {t.status}
              </Badge>
            </div>

            <p className="text-muted-foreground flex items-center gap-1 font-semibold">
              <Clock className="h-3.5 w-3.5 text-amber-500" /> {t.date} ({t.durationMinutes} Mins Duration)
            </p>

            <div className="pt-2 border-t border-border/60 space-y-1">
              <p className="text-foreground flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-destructive shrink-0" />
                <span className="truncate">From: {t.pickupLocation}</span>
              </p>
              <p className="text-foreground flex items-center gap-1.5">
                <Hospital className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="truncate">To: {t.destinationHospital}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
