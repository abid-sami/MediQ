import { motion } from "motion/react";
import { Compass, MapPin } from "lucide-react";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { buildings, statusStyles, wardMap, type MapRoom } from "@/data/mediq";
import { cn } from "@/lib/utils";

import { Reveal, Section, SectionHeading } from "./primitives";

export function WardMap() {
  const [buildingId, setBuildingId] = useState(buildings[0]!.id);
  const [floor, setFloor] = useState(buildings[0]!.floors[0]!);
  const [selected, setSelected] = useState<MapRoom>(wardMap[0]!);

  const building = buildings.find((b) => b.id === buildingId)!;

  return (
    <Section id="diagnostics">
      <SectionHeading
        eyebrow="Wayfinding"
        title="Find Your Way Around"
        subtitle="Explore hospital floors, wards, departments, and facilities through an interactive map."
      />

      <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <div className="min-w-0 flex-1">
          <Select
            value={buildingId}
            onValueChange={(v) => {
              setBuildingId(v);
              const next = buildings.find((b) => b.id === v)!;
              setFloor(next.floors[0]!);
            }}
          >
            <SelectTrigger aria-label="Building">
              <SelectValue placeholder="Building" />
            </SelectTrigger>
            <SelectContent>
              {buildings.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="min-w-0 flex-1">
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger aria-label="Floor">
              <SelectValue placeholder="Floor" />
            </SelectTrigger>
            <SelectContent>
              {building.floors.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-soft sm:p-5">
            <div className="relative aspect-[4/3] w-full rounded-2xl bg-surface">
              <div
                className="absolute inset-0 rounded-2xl opacity-[0.35]"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              {wardMap.map((room, i) => {
                const status = statusStyles[room.status];
                const isActive = selected.id === room.id;
                return (
                  <motion.button
                    key={room.id}
                    type="button"
                    onClick={() => setSelected(room)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className={cn(
                      "absolute flex flex-col items-start justify-between rounded-xl border p-2 text-left transition-all duration-300 hover:z-10 hover:-translate-y-0.5 hover:shadow-lift",
                      status.bg,
                      isActive
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-card"
                        : "hover:border-teal/50",
                    )}
                    style={{
                      left: `${room.x}%`,
                      top: `${room.y}%`,
                      width: `${room.w}%`,
                      height: `${room.h}%`,
                    }}
                  >
                    <span className="flex w-full min-w-0 items-center gap-1.5">
                      <span className={cn("h-2 w-2 shrink-0 rounded-full", status.dot)} />
                      <span className="truncate text-[11px] font-bold sm:text-xs">{room.name}</span>
                    </span>
                    {room.beds > 0 ? (
                      <span className="hidden text-[10px] font-medium text-muted-foreground sm:block">
                        {room.available}/{room.beds} beds
                      </span>
                    ) : null}
                  </motion.button>
                );
              })}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Compass className="h-3.5 w-3.5" /> Tap any area to view details · {building.name} ·{" "}
              {floor}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <motion.div
            key={selected.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft"
          >
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                statusStyles[selected.status].bg,
                statusStyles[selected.status].text,
              )}
            >
              <span className={cn("h-2 w-2 rounded-full", statusStyles[selected.status].dot)} />
              {statusStyles[selected.status].label}
            </span>
            <h3 className="mt-3 text-xl font-bold">{selected.name}</h3>
            <p className="text-sm text-muted-foreground">{selected.department}</p>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Number of beds</dt>
                <dd className="font-semibold">{selected.beds || "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Available beds</dt>
                <dd className="font-semibold">{selected.beds ? selected.available : "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Floor</dt>
                <dd className="font-semibold">{floor}</dd>
              </div>
            </dl>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Nearby facilities
              </p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {selected.nearby.map((n) => (
                  <li
                    key={n}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs font-medium"
                  >
                    <MapPin className="h-3 w-3 text-teal-foreground dark:text-teal" />
                    {n}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </Section>
  );
}
