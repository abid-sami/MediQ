import { motion } from "motion/react";
import { CalendarCheck, Siren, ShieldCheck, Clock, Activity } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useMediQActions } from "./actions-context";
import { HeroVisual } from "./HeroVisual";

const trust = [
  { icon: ShieldCheck, label: "Verified hospitals & doctors" },
  { icon: Clock, label: "24/7 emergency coordination" },
  { icon: Activity, label: "Live capacity insights" },
];

export function Hero() {
  const { openSos, openAppointment } = useMediQActions();

  return (
    <section id="home" className="relative overflow-hidden hero-bg pt-28 pb-16 sm:pt-32 sm:pb-24">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3.5 py-1.5 text-xs font-semibold text-muted-foreground backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-teal" />
            Connected healthcare platform
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="mt-5 text-balance text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl"
          >
            Healthcare, <span className="text-gradient">Connected</span> in One Place.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
            className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            Find doctors, book appointments, locate available hospital beds, explore diagnostics,
            access pharmacy services, and find blood availability through one connected healthcare
            platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-8 grid gap-3 sm:grid-cols-2"
          >
            <Button
              onClick={openSos}
              size="lg"
              className="h-auto justify-start gap-3 rounded-2xl gradient-emergency px-5 py-4 text-left text-emergency-foreground shadow-soft transition-transform duration-200 hover:scale-[1.02] hover:opacity-95"
            >
              <span className="pulse-ring relative grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emergency-foreground/15">
                <Siren className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold">SOS Emergency</span>
                <span className="block text-xs font-medium opacity-85">Request an Ambulance</span>
              </span>
            </Button>

            <Button
              onClick={openAppointment}
              size="lg"
              variant="outline"
              className="h-auto justify-start gap-3 rounded-2xl border-teal/40 bg-card px-5 py-4 text-left shadow-soft transition-transform duration-200 hover:scale-[1.02] hover:bg-card"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-teal/15 text-teal-foreground dark:text-teal">
                <CalendarCheck className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-bold">Book Appointment</span>
                <span className="block text-xs font-medium text-muted-foreground">
                  Find &amp; Book a Doctor
                </span>
              </span>
            </Button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-x-6 gap-y-2"
          >
            {trust.map((item) => (
              <li
                key={item.label}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
              >
                <item.icon className="h-4 w-4 text-teal-foreground dark:text-teal" />
                {item.label}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="order-last">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
