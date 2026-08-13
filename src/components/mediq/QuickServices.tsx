import { ArrowRight, Building2, Droplet, Microscope, Pill, Stethoscope } from "lucide-react";

import { quickServices } from "@/data/mediq";

import { Reveal, Section, SectionHeading } from "./primitives";

const icons = {
  hospital: Building2,
  stethoscope: Stethoscope,
  microscope: Microscope,
  pill: Pill,
  droplet: Droplet,
} as const;

export function QuickServices() {
  return (
    <Section id="services" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="Quick access"
        title="Quick Healthcare Services"
        subtitle="Everything a patient needs, one tap away — no phone calls, no queues."
      />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {quickServices.map((service, i) => {
          const Icon = icons[service.icon];
          return (
            <Reveal key={service.id} delay={i * 0.06}>
              <a
                href={service.href}
                className="card-lift group flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft"
              >
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-teal/15 group-hover:text-teal-foreground dark:group-hover:text-teal">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Explore
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
