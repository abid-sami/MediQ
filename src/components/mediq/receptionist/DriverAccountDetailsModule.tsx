// Design: Guided Floorplan — staff-facing driver accounts use only live directory data with calm, scannable clinical cards.
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, ShieldCheck, Siren, UserRound } from "lucide-react";

export interface DriverAccountDetails {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  badgeId?: string;
}

interface DriverAccountDetailsModuleProps {
  drivers: DriverAccountDetails[];
}

export function DriverAccountDetailsModule({ drivers }: DriverAccountDetailsModuleProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight"><Siren className="h-6 w-6 text-destructive" /> Driver Account Details</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">Live ambulance-driver accounts available to the MediQ front desk.</p>
        </div>
        <Badge variant="outline" className="w-fit border-destructive/30 bg-destructive/5 text-xs font-bold text-destructive">{drivers.length} active account{drivers.length === 1 ? "" : "s"}</Badge>
      </div>

      {drivers.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center">
          <UserRound className="h-8 w-8 text-muted-foreground/60" />
          <p className="text-sm font-bold text-foreground">No driver accounts available</p>
          <p className="max-w-sm text-xs text-muted-foreground">Ambulance-driver accounts will appear here once they are created and assigned in MediQ.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {drivers.map((driver) => (
            <article key={driver.id} className="rounded-2xl border border-border bg-card p-5 shadow-xs">
              <div className="flex items-start gap-3">
                {driver.avatarUrl ? <img src={driver.avatarUrl} alt="" className="h-11 w-11 rounded-xl border border-destructive/20 object-cover" /> : <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-sm font-bold text-destructive">{driver.name.slice(0, 1).toUpperCase()}</span>}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-bold text-foreground">{driver.name}</h3>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Ambulance Driver</p>
                  {driver.badgeId && <p className="mt-1 font-mono text-[10px] font-semibold text-primary">{driver.badgeId}</p>}
                </div>
              </div>
              <div className="mt-4 space-y-2 border-t border-border pt-3 text-xs text-muted-foreground">
                <p className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-primary" /><span className="truncate">{driver.email || "Not provided"}</span></p>
                <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-primary" /><span>{driver.phone || "Not provided"}</span></p>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"><ShieldCheck className="h-3.5 w-3.5" /> Verified MediQ account</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
