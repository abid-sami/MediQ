import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowRight, BedDouble } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { statusStyles, type StatusLevel } from "@/data/mediq";
import { fetchSupabaseBeds } from "@/services/supabase-service";

import { Counter, LivePill, Reveal, Section, SectionHeading } from "./primitives";

type BedUnit = {
  id: string;
  name: string;
  available: number;
  total: number;
  status: StatusLevel;
};

function statusForOccupancy(available: number, total: number): StatusLevel {
  if (total === 0 || available === 0) return "full";
  const freePct = (available / total) * 100;
  if (freePct <= 15) return "full";
  if (freePct <= 40) return "limited";
  return "available";
}

function OccupancyRing({ occupancyRate }: { occupancyRate: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const radius = 78;
  const circumference = 2 * Math.PI * radius;

  return (
    <div ref={ref} className="relative mx-auto grid h-52 w-52 place-items-center">
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="14"
        />
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--teal)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: inView
              ? circumference * (1 - occupancyRate / 100)
              : circumference,
          }}
          transition={{ duration: reduce ? 0 : 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="text-center">
        <p className="text-4xl font-bold">
          <Counter value={occupancyRate} suffix="%" />
        </p>
        <p className="text-sm font-medium text-muted-foreground">Occupied</p>
      </div>
    </div>
  );
}

export function BedAvailability() {
  const [units, setUnits] = useState<BedUnit[]>([]);
  const [occupancyRate, setOccupancyRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const beds = await fetchSupabaseBeds();

      const byWard = new Map<string, { total: number; available: number }>();
      for (const bed of beds) {
        const key = bed.wardType || "General";
        const entry = byWard.get(key) || { total: 0, available: 0 };
        entry.total += 1;
        if (bed.status === "Available") entry.available += 1;
        byWard.set(key, entry);
      }

      const grouped: BedUnit[] = Array.from(byWard.entries()).map(([name, v]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        available: v.available,
        total: v.total,
        status: statusForOccupancy(v.available, v.total),
      }));

      setUnits(grouped);
      setOccupancyRate(
        beds.length > 0
          ? Math.round(((beds.length - beds.filter((b) => b.status === "Available").length) / beds.length) * 100)
          : 0
      );
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Section id="beds" className="border-y border-border bg-surface">
      <div className="flex flex-col items-center gap-3">
        <LivePill />
        <SectionHeading
          title="Live Bed Availability"
          subtitle="Know hospital capacity before you arrive."
        />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <div className="grid gap-3 sm:grid-cols-2">
          {!loading && units.length === 0 && (
            <p className="col-span-full text-sm text-muted-foreground">
              Bed data will appear here once wards are set up in the system.
            </p>
          )}
          {units.map((unit, i) => {
            const status = statusStyles[unit.status];
            const pct = unit.total > 0 ? Math.round((unit.available / unit.total) * 100) : 0;
            return (
              <Reveal key={unit.id} delay={i * 0.05}>
                <div className="card-lift h-full rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                        <BedDouble className="h-5 w-5" />
                      </span>
                      <h3 className="truncate text-base font-semibold">{unit.name}</h3>
                    </div>
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </div>
                  <div className="mt-4 flex items-end justify-between gap-3">
                    <p className="text-2xl font-bold">
                      {String(unit.available).padStart(2, "0")}
                      <span className="ml-1 text-sm font-medium text-muted-foreground">
                        of {unit.total} free
                      </span>
                    </p>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className={`h-full rounded-full ${status.dot}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.1 + i * 0.05 }}
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.15}>
          <div className="flex h-full flex-col justify-center rounded-3xl border border-border bg-card p-6 shadow-soft">
            <OccupancyRing occupancyRate={occupancyRate} />
            <ul className="mt-6 space-y-2 text-sm">
              {(["available", "limited", "full"] as const).map((key) => (
                <li key={key} className="flex items-center gap-2 text-muted-foreground">
                  <span className={`h-2.5 w-2.5 rounded-full ${statusStyles[key].dot}`} />
                  {key === "available"
                    ? "Available capacity"
                    : key === "limited"
                      ? "Limited capacity"
                      : "Full / critical"}
                </li>
              ))}
            </ul>
            <Button className="mt-6 w-full rounded-xl gradient-primary font-semibold text-primary-foreground">
              View All Beds <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
