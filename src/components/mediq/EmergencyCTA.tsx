import { Siren } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useMediQActions } from "./actions-context";
import { Reveal, Section } from "./primitives";

export function EmergencyCTA() {
  const { openSos } = useMediQActions();

  return (
    <Section id="emergency">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2rem] border border-emergency/20 bg-card p-8 text-center shadow-soft sm:p-14">
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-emergency/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
          <h2 className="text-balance text-3xl font-bold sm:text-4xl">Need Emergency Assistance?</h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-muted-foreground">
            Get connected with emergency ambulance services quickly.
          </p>
          <Button
            onClick={openSos}
            size="lg"
            className="relative mt-8 rounded-2xl gradient-emergency px-8 py-6 text-base font-bold tracking-wide text-emergency-foreground hover:opacity-95"
          >
            <span className="pulse-ring relative mr-2.5 grid h-8 w-8 place-items-center rounded-lg bg-emergency-foreground/15">
              <Siren className="h-4 w-4" />
            </span>
            REQUEST AMBULANCE
          </Button>
          <p className="mt-4 text-xs text-muted-foreground">
            Prototype demo — connect a dispatch provider to enable real emergency response.
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
