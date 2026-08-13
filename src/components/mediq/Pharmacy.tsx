import {
  Activity,
  ArrowRight,
  Bandage,
  Leaf,
  Pill,
  Receipt,
  Search,
  ShieldAlert,
  Sparkles,
  Upload,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { medicines, pharmacyCategories } from "@/data/mediq";
import { cn } from "@/lib/utils";

import { Reveal, Section, SectionHeading } from "./primitives";

const icons = {
  receipt: Receipt,
  pill: Pill,
  bandage: Bandage,
  leaf: Leaf,
  activity: Activity,
  sparkles: Sparkles,
} as const;

export function Pharmacy() {
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<string[]>([]);

  const results = useMemo(
    () => medicines.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <Section id="pharmacy">
      <SectionHeading
        eyebrow="Pharmacy"
        title="MediQ Pharmacy"
        subtitle="Find medicines and healthcare essentials from one place."
      />

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search medicines, healthcare products..."
            aria-label="Search medicines"
            className="h-14 rounded-2xl border-border bg-card pl-11 pr-4 text-base shadow-soft"
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {pharmacyCategories.map((category, i) => {
          const Icon = icons[category.icon];
          return (
            <Reveal key={category.id} delay={i * 0.04}>
              <button
                type="button"
                onClick={() => toast.info(`${category.name} catalogue opens with the full pharmacy.`)}
                className="card-lift flex h-full w-full flex-col items-start gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/12 text-teal-foreground dark:text-teal">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-sm font-semibold leading-snug">{category.name}</span>
              </button>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="font-semibold">No medicines matched “{query}”</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a generic name, or upload your prescription and we&apos;ll find it for you.
            </p>
          </div>
        ) : (
          results.map((medicine, i) => {
            const inCart = cart.includes(medicine.id);
            return (
              <Reveal key={medicine.id} delay={i * 0.05}>
                <div className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold">{medicine.name}</h3>
                      <p className="text-sm text-muted-foreground">{medicine.strength}</p>
                    </div>
                    <span
                      className={cn(
                        "shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold",
                        medicine.inStock
                          ? "border-success/30 bg-success/10 text-success"
                          : "border-warning/30 bg-warning/10 text-warning",
                      )}
                    >
                      {medicine.inStock ? "In stock" : "Out of stock"}
                    </span>
                  </div>

                  {medicine.prescriptionRequired ? (
                    <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-warning">
                      <ShieldAlert className="h-3.5 w-3.5" /> Prescription verification required
                    </p>
                  ) : null}

                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <p className="text-lg font-bold">${medicine.price.toFixed(2)}</p>
                    <Button
                      size="sm"
                      variant={inCart ? "outline" : "default"}
                      disabled={!medicine.inStock}
                      className="rounded-full font-semibold"
                      onClick={() => {
                        setCart((prev) => [...prev, medicine.id]);
                        toast.success(`${medicine.name} added to cart`);
                      }}
                    >
                      {inCart ? "Added" : "Add"}
                    </Button>
                  </div>
                </div>
              </Reveal>
            );
          })
        )}
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button className="rounded-xl gradient-primary font-semibold text-primary-foreground">
          Browse Pharmacy <ArrowRight className="ml-1.5 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="rounded-xl font-semibold"
          onClick={() => toast.info("Prescription upload requires a verified account.")}
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Prescription
        </Button>
      </div>
    </Section>
  );
}
