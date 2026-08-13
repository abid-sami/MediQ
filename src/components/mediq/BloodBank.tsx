import { motion } from "motion/react";
import { Droplet, HeartHandshake, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { bloodGroups, statusStyles } from "@/data/mediq";
import { cn } from "@/lib/utils";

import { LivePill, Reveal, Section, SectionHeading } from "./primitives";

export function BloodBank() {
  return (
    <Section id="blood-bank" className="relative overflow-hidden border-y border-border bg-surface">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {[
          { left: "8%", top: "12%", size: 90, delay: 0 },
          { left: "78%", top: "18%", size: 120, delay: 1.2 },
          { left: "42%", top: "70%", size: 70, delay: 0.6 },
        ].map((drop) => (
          <motion.span
            key={drop.left}
            className="absolute rounded-full bg-emergency/10 blur-2xl"
            style={{ left: drop.left, top: drop.top, width: drop.size, height: drop.size }}
            animate={{ y: [0, -18, 0], opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 8, delay: drop.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-3">
        <LivePill label="UPDATED JUST NOW" />
        <SectionHeading
          title="Live Blood Availability"
          subtitle="Find available blood units when they matter most."
        />
      </div>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {bloodGroups.map((group, i) => {
          const status = statusStyles[group.status];
          const pct = Math.round((group.units / group.capacity) * 100);
          return (
            <Reveal key={group.group} delay={i * 0.04}>
              <div className="card-lift h-full rounded-3xl border border-border bg-card p-4 shadow-soft sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-xl border",
                      status.bg,
                      status.text,
                    )}
                  >
                    <Droplet className="h-5 w-5" />
                  </span>
                  <span className="text-2xl font-bold tracking-tight">{group.group}</span>
                </div>
                <p className="mt-4 text-lg font-bold">
                  {group.units} <span className="text-sm font-medium text-muted-foreground">Units</span>
                </p>
                <p className={cn("text-xs font-semibold", status.text)}>
                  {group.status === "full" ? "Critical" : status.label}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    className={cn("h-full rounded-full", status.dot)}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(pct, group.units === 0 ? 0 : 6)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.08 + i * 0.04 }}
                  />
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button
          className="rounded-xl gradient-emergency font-semibold text-emergency-foreground hover:opacity-95"
          onClick={() => toast.success("Blood request form will open with the blood bank module.")}
        >
          <Send className="mr-2 h-4 w-4" /> Request Blood
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border-teal/40 font-semibold"
          onClick={() => toast.success("Thank you — donor registration is coming next.")}
        >
          <HeartHandshake className="mr-2 h-4 w-4" /> Become a Donor
        </Button>
        <Button variant="ghost" className="rounded-xl font-semibold">
          View Blood Bank
        </Button>
      </div>
    </Section>
  );
}
