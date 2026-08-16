import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Droplet, HeartHandshake, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { statusStyles, type StatusLevel } from "@/data/mediq";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBloodDonor, fetchSupabaseBloodInventory } from "@/services/supabase-service";

import { LivePill, Reveal, Section, SectionHeading } from "./primitives";
import { RequestBloodModal } from "./RequestBloodModal";
import { BecomeDonorModal } from "./BecomeDonorModal";

type BloodGroupDisplay = {
  group: string;
  units: number;
  capacity: number;
  status: StatusLevel;
};

function statusFromLabel(status: string): StatusLevel {
  if (status === "Critical") return "full";
  if (status === "Low") return "limited";
  return "available";
}

export function BloodBank() {
  const { profile, user } = useAuth();

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [donorModalOpen, setDonorModalOpen] = useState(false);
  const [bloodGroups, setBloodGroups] = useState<BloodGroupDisplay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const inventory = await fetchSupabaseBloodInventory();
      setBloodGroups(
        inventory.map((b: any) => ({
          group: b.group,
          units: b.availableUnits || 0,
          // A soft display ceiling so the progress bar has meaning; the
          // actual low/critical read comes from the stored status.
          capacity: Math.max(b.availableUnits || 0, (b.criticalThreshold || 10) * 5),
          status: statusFromLabel(b.status),
        }))
      );
      setLoading(false);
    };
    load();
  }, []);

  const handleBecomeDonorClick = async () => {
    // Check if user's profile has a blood group specified
    if (!profile?.bloodGroup) {
      setDonorModalOpen(true);
    } else {
      // Register directly with profile blood group
      const donorName = profile.name || user?.email?.split("@")[0] || "Voluntary Donor";
      const donorPhone = profile.phone || "+1 (555) 000-0000";
      const donorEmail = profile.email || user?.email || "";
      const donorId = `DNR-${Math.floor(1000 + Math.random() * 8999)}`;

      await createSupabaseBloodDonor({
        donorId,
        name: donorName,
        bloodGroup: profile.bloodGroup,
        phone: donorPhone,
        email: donorEmail,
      });

      toast.success(`Registered as Voluntary Blood Donor (${profile.bloodGroup})!`, {
        description: `Thank you ${donorName}! Your blood group ${profile.bloodGroup} is registered with MediQ Blood Bank.`,
      });
    }
  };

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
        {!loading && bloodGroups.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            Blood stock will appear here once inventory is recorded in the system.
          </p>
        )}
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
          onClick={() => setRequestModalOpen(true)}
        >
          <Send className="mr-2 h-4 w-4" /> Request Blood
        </Button>
        <Button
          variant="outline"
          className="rounded-xl border-teal/40 font-semibold"
          onClick={handleBecomeDonorClick}
        >
          <HeartHandshake className="mr-2 h-4 w-4" /> Become a Donor
        </Button>
        <a href="/patient">
          <Button variant="ghost" className="rounded-xl font-semibold w-full sm:w-auto">
            View Blood Bank
          </Button>
        </a>
      </div>

      <RequestBloodModal
        open={requestModalOpen}
        onOpenChange={setRequestModalOpen}
      />

      <BecomeDonorModal
        open={donorModalOpen}
        onOpenChange={setDonorModalOpen}
      />
    </Section>
  );
}
