import { motion } from "motion/react";
import {
  Ambulance,
  Building2,
  Droplet,
  FlaskConical,
  Pill,
  Stethoscope,
  User,
} from "lucide-react";

import { Reveal, Section, SectionHeading } from "./primitives";

const endpoints = [
  { label: "Doctor", icon: Stethoscope },
  { label: "Hospital", icon: Building2 },
  { label: "Laboratory", icon: FlaskConical },
  { label: "Pharmacy", icon: Pill },
  { label: "Blood Bank", icon: Droplet },
  { label: "Ambulance", icon: Ambulance },
];

function Connector() {
  return (
    <svg viewBox="0 0 100 30" className="h-8 w-full" aria-hidden="true" preserveAspectRatio="none">
      <line
        x1="50"
        y1="0"
        x2="50"
        y2="30"
        stroke="var(--teal)"
        strokeOpacity="0.5"
        strokeWidth="0.6"
        className="flow-line"
      />
    </svg>
  );
}

export function HealthcareNetwork() {
  return (
    <Section id="network" className="border-y border-border bg-surface">
      <SectionHeading
        eyebrow="Ecosystem"
        title="One Platform, One Connected Network"
        subtitle="MediQ is not a hospital website — it is the layer that connects patients with every part of care delivery."
      />

      <div className="mt-12 flex flex-col items-center">
        <Reveal>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" />
            </span>
            <span className="font-semibold">Patient</span>
          </div>
        </Reveal>

        <Connector />

        <Reveal delay={0.08}>
          <div className="flex items-center gap-3 rounded-2xl gradient-primary px-6 py-4 text-primary-foreground shadow-lift">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary-foreground/15">
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path
                  d="M12 4v16M4 12h16"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className="text-lg font-bold">MediQ</span>
          </div>
        </Reveal>

        <Connector />

        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {endpoints.map((item, i) => (
            <Reveal key={item.label} delay={0.05 * i}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className="flex h-full flex-col items-center gap-2.5 rounded-2xl border border-border bg-card p-4 text-center shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/12 text-teal-foreground dark:text-teal">
                  <item.icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
