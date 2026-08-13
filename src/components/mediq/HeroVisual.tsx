import { motion, useReducedMotion } from "motion/react";
import {
  Ambulance,
  Building2,
  Droplet,
  FileHeart,
  HeartPulse,
  MapPin,
  Pill,
  Stethoscope,
  User,
} from "lucide-react";

type Node = {
  id: string;
  label: string;
  icon: typeof Ambulance;
  x: number;
  y: number;
  accent?: "primary" | "teal" | "emergency";
};

const nodes: Node[] = [
  { id: "hospital", label: "Hospital", icon: Building2, x: 50, y: 12, accent: "primary" },
  { id: "ambulance", label: "Ambulance", icon: Ambulance, x: 15, y: 26, accent: "emergency" },
  { id: "doctor", label: "Doctor", icon: Stethoscope, x: 85, y: 27, accent: "teal" },
  { id: "heart", label: "Vitals", icon: HeartPulse, x: 50, y: 50, accent: "teal" },
  { id: "location", label: "Nearby", icon: MapPin, x: 15, y: 62, accent: "primary" },
  { id: "blood", label: "Blood Bank", icon: Droplet, x: 85, y: 62, accent: "emergency" },
  { id: "pharmacy", label: "Pharmacy", icon: Pill, x: 30, y: 88, accent: "teal" },
  { id: "report", label: "Diagnostics", icon: FileHeart, x: 70, y: 88, accent: "primary" },
];

const links: [string, string][] = [
  ["heart", "hospital"],
  ["heart", "ambulance"],
  ["heart", "doctor"],
  ["heart", "location"],
  ["heart", "blood"],
  ["heart", "pharmacy"],
  ["heart", "report"],
  ["hospital", "doctor"],
  ["ambulance", "location"],
  ["pharmacy", "report"],
];

const accentClass = {
  primary: "border-primary/30 bg-primary/10 text-primary",
  teal: "border-teal/40 bg-teal/10 text-teal-foreground dark:text-teal",
  emergency: "border-emergency/30 bg-emergency/10 text-emergency",
} as const;

export function HeroVisual() {
  const reduce = useReducedMotion();
  const byId = (id: string) => nodes.find((n) => n.id === id)!;

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
      <div className="absolute inset-0 rounded-[2rem] glass shadow-soft" />
      <div className="absolute inset-6 rounded-full border border-teal/15" />
      <div className="absolute inset-16 rounded-full border border-primary/15" />

      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {links.map(([a, b]) => {
          const from = byId(a);
          const to = byId(b);
          return (
            <line
              key={`${a}-${b}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--teal)"
              strokeOpacity="0.35"
              strokeWidth="0.4"
              className={reduce ? undefined : "flow-line"}
            />
          );
        })}
      </svg>

      {nodes.map((node, i) => {
        const Icon = node.icon;
        const isCenter = node.id === "heart";
        return (
          <motion.div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 + i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, -5, 0] }}
              transition={{ duration: 4 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className={`grid place-items-center rounded-2xl border backdrop-blur-sm ${
                  accentClass[node.accent ?? "primary"]
                } ${isCenter ? "h-16 w-16 shadow-lift" : "h-11 w-11 shadow-soft"}`}
              >
                <Icon className={isCenter ? "h-7 w-7" : "h-5 w-5"} />
              </div>
              <span className="whitespace-nowrap text-[10px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-[11px]">
                {node.label}
              </span>
            </motion.div>
          </motion.div>
        );
      })}

      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold shadow-soft"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4 }}
      >
        <span className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-primary" /> One patient · One connected record
        </span>
      </motion.div>
    </div>
  );
}
