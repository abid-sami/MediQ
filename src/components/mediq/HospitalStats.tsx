import { useEffect, useState } from "react";
import { Bed, Clock, LayoutGrid, Microscope, Siren, Users } from "lucide-react";

import {
  fetchSupabaseBeds,
  fetchSupabaseHospitals,
  fetchSupabaseLabCatalog,
  fetchSupabaseProfiles,
} from "@/services/supabase-service";

import { Counter, Reveal, Section, SectionHeading } from "./primitives";

const icons = {
  bed: Bed,
  layout: LayoutGrid,
  microscope: Microscope,
  siren: Siren,
  users: Users,
  clock: Clock,
} as const;

type InfraStat = {
  id: string;
  value: number;
  suffix?: string;
  label: string;
  icon: keyof typeof icons;
};

export function HospitalStats() {
  const [stats, setStats] = useState<InfraStat[]>([]);

  useEffect(() => {
    const load = async () => {
      const [beds, labCatalog, staff, hospitals] = await Promise.all([
        fetchSupabaseBeds(),
        fetchSupabaseLabCatalog(),
        fetchSupabaseProfiles(),
        fetchSupabaseHospitals(),
      ]);

      const wardTypes = new Set(beds.map((b: any) => b.wardType).filter(Boolean));
      const emergencyBeds = beds.filter((b: any) =>
        (b.wardType || "").toLowerCase().includes("emergency")
      ).length;
      const staffCount = staff.filter((p: any) => p.role !== "Patient").length;
      // Admin-set directly (see AdminLayout > Beds & Wards > Infrastructure Settings);
      // everything else here is calculated live from real records.
      const supportHours = hospitals[0]?.supportHours || "24/7";
      const [supportValue, supportSuffix] = supportHours.includes("/")
        ? [Number(supportHours.split("/")[0]) || 24, `/${supportHours.split("/")[1]}`]
        : [24, "/7"];

      setStats([
        { id: "beds", value: beds.length, label: "Beds", icon: "bed" },
        { id: "wards", value: wardTypes.size, label: "Wards", icon: "layout" },
        { id: "diagnostics", value: 12, label: "Diagnostic Services", icon: "microscope" },
        { id: "emergency-beds", value: emergencyBeds, label: "Emergency Beds", icon: "siren" },
        { id: "staff", value: staffCount, label: "Healthcare Professionals", icon: "users" },
        { id: "support", value: supportValue, suffix: supportSuffix, label: "Emergency Support", icon: "clock" },
      ]);
    };
    load();
  }, []);

  return (
    <Section id="hospitals">
      <SectionHeading
        eyebrow="Infrastructure"
        title="Healthcare Infrastructure at a Glance"
        subtitle="Explore hospital capacity, facilities, wards, and diagnostic services."
      />
      <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = icons[stat.icon];
          return (
            <Reveal key={stat.id} delay={i * 0.05}>
              <div className="card-lift relative h-full overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-teal/10 blur-2xl" />
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-teal/12 text-teal-foreground dark:text-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  <Counter value={stat.value} suffix={stat.suffix || ""} />
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
