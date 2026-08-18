import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { AlertTriangle, Car, Flame, MapPin, PhoneCall, Radio, ShieldAlert, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  createDemoResQAccidentAlert,
  fetchResQAccidentAlerts,
  ResQAccidentAlert,
  updateResQAccidentStatus,
} from "@/services/supabase-service";

interface Props {
  showPanel?: boolean;
  showDemoButton?: boolean;
  compact?: boolean;
}

export function ResQAccidentAlertsModule({ showPanel = true, showDemoButton = false, compact = false }: Props) {
  const [alerts, setAlerts] = useState<ResQAccidentAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const seenIds = useRef<Set<string>>(new Set());
  const firstLoad = useRef(true);

  const refresh = async () => {
    const next = await fetchResQAccidentAlerts();
    const unseen = next.filter((alert) => !seenIds.current.has(alert.alertId));
    next.forEach((alert) => seenIds.current.add(alert.alertId));
    if (!firstLoad.current && unseen.length > 0) {
      const newest = unseen[0]!;
      toast.error(`ResQ accident alert: ${newest.vehicleId}`, {
        description: `${newest.severity} • ${newest.location}`,
      });
    }
    firstLoad.current = false;
    setAlerts(next);
    setLoading(false);
  };

  useEffect(() => {
    void refresh();
    const interval = window.setInterval(() => void refresh(), 8000);
    return () => window.clearInterval(interval);
  }, []);

  const createDemo = async () => {
    const { data, error } = await createDemoResQAccidentAlert();
    if (error || !data) {
      toast.error(error?.message || "Could not create the demo ResQ alert.");
      return;
    }
    setAlerts((current) => [data, ...current.filter((item) => item.alertId !== data.alertId)]);
    seenIds.current.add(data.alertId);
    toast.success("Demo ResQ accident alert sent to all emergency teams.");
  };

  const updateStatus = async (alert: ResQAccidentAlert, status: string) => {
    const { error } = await updateResQAccidentStatus(alert.alertId, status);
    if (error) {
      toast.error(error.message || "Could not update ResQ alert status.");
      return;
    }
    setAlerts((current) => current.map((item) => item.alertId === alert.alertId ? { ...item, status } : item));
    toast.success(`${alert.alertId} marked ${status}.`);
  };

  if (!showPanel) return null;

  return (
    <section className={compact ? "space-y-3" : "space-y-5"}>
      <div className="flex flex-col gap-3 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-500/15 text-orange-600"><Radio className="h-5 w-5 animate-pulse" /></span>
          <div>
            <h2 className="font-bold text-foreground">ResQ Vehicle Accident Alerts</h2>
            <p className="text-xs text-muted-foreground">Live hardware alerts for hospital, ambulance, and reception response.</p>
          </div>
        </div>
        {showDemoButton && <Button onClick={createDemo} className="rounded-xl bg-orange-600 text-white hover:bg-orange-700"><AlertTriangle className="mr-2 h-4 w-4" /> Simulate ResQ Accident</Button>}
      </div>

      {loading ? <p className="py-6 text-center text-sm text-muted-foreground">Loading ResQ alerts…</p> : alerts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No ResQ accident alerts received.</div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {alerts.map((alert) => (
            <article key={alert.alertId} className="space-y-4 rounded-2xl border border-orange-500/30 bg-card p-4 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2"><Badge className="bg-orange-600 text-white">{alert.severity}</Badge><span className="font-mono text-xs font-bold text-muted-foreground">{alert.alertId}</span></div>
                  <h3 className="mt-2 font-bold text-foreground">{alert.impactType}</h3>
                </div>
                <Badge variant="outline" className="border-orange-500/40">{alert.status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-muted/30 p-3"><span className="block text-muted-foreground">Vehicle</span><strong>{alert.vehicleId}</strong><span className="block">{alert.vehiclePlate}</span></div>
                <div className="rounded-xl bg-muted/30 p-3"><span className="block text-muted-foreground">Driver</span><strong>{alert.driverName || "Unknown"}</strong>{alert.driverPhone && <a href={`tel:${alert.driverPhone}`} className="flex items-center gap-1 text-primary"><PhoneCall className="h-3 w-3" /> {alert.driverPhone}</a>}</div>
                <div className="col-span-2 rounded-xl bg-muted/30 p-3"><span className="flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" /> Location</span><strong>{alert.location}</strong>{alert.latitude != null && <span className="block text-muted-foreground">GPS: {alert.latitude.toFixed(5)}, {Number(alert.longitude).toFixed(5)}</span>}</div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3"><Users className="h-4 w-4 text-primary" /> {alert.occupants} occupants / {alert.injuries} injuries</div>
                <div className="flex items-center gap-2 rounded-xl bg-muted/30 p-3">{alert.fireRisk ? <><Flame className="h-4 w-4 text-destructive" /> Fire risk</> : <><ShieldAlert className="h-4 w-4 text-emerald-600" /> No fire risk</>}</div>
              </div>
              {alert.status !== "Resolved" && <div className="flex flex-wrap gap-2"><Button size="sm" variant="outline" onClick={() => void updateStatus(alert, "Acknowledged")}>Acknowledge</Button><Button size="sm" onClick={() => void updateStatus(alert, "Dispatched")}>Dispatch Response</Button><Button size="sm" variant="secondary" onClick={() => void updateStatus(alert, "Resolved")}>Mark Resolved</Button></div>}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
