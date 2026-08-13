import { Bed, Clock, LayoutGrid, Microscope, Siren, Users } from "lucide-react";

import { infrastructureStats } from "@/data/mediq";

import { Counter, Reveal, Section, SectionHeading } from "./primitives";

const icons = {
  bed: Bed,
  layout: LayoutGrid,
  microscope: Microscope,
  siren: Siren,
  users: Users,
  clock: Clock,
} as const;

export function HospitalStats() {
  return (
    <Section id="hospitals">
      <SectionHeading
        eyebrow="Infrastructure"
        title="Healthcare Infrastructure at a Glance"
        subtitle="Explore hospital capacity, facilities, wards, and diagnostic services."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {infrastructureStats.map((stat, i) => {
          const Icon = icons[stat.icon];
          return (
            <Reveal key={stat.id} delay={i * 0.05}>
              <div className="card-lift relative h-full overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal/10 blur-2xl" />
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal/12 text-teal-foreground dark:text-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  <Counter value={stat.value} suffix={"suffix" in stat ? stat.suffix : ""} />
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Figures shown are prototype values, structured to be served from the hospital management
        backend.
      </p>
    </Section>
  );
}
