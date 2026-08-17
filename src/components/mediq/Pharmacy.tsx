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
  ShoppingCart,
  Plus,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { PharmacyMedicine } from "@/data/pharmacy-data";
import { getDynamicMedicines, getDynamicPharmacyCategories } from "@/data/pharmacy-store";

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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const loadMedicines = async () => {
      const [data, categoryData] = await Promise.all([getDynamicMedicines(), getDynamicPharmacyCategories()]);
      if (active) {
        setMedicines(data);
        setCategories(categoryData.map((category) => category.name));
        setLoading(false);
      }
    };

    void loadMedicines();
    window.addEventListener("focus", loadMedicines);
    const refreshTimer = window.setInterval(loadMedicines, 30000);
    return () => {
      active = false;
      window.removeEventListener("focus", loadMedicines);
      window.clearInterval(refreshTimer);
    };
  }, []);

  const categoryFilters = ["All", ...categories];

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const searchTerms = normalizedQuery ? normalizedQuery.split(/\s+/) : [];

    return medicines.filter((medicine) => {
      const searchableText = [
        medicine.name,
        medicine.genericName,
        medicine.brand,
        medicine.strength,
        medicine.category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLocaleLowerCase();
      const matchesQuery = searchTerms.every((term) => searchableText.includes(term));
      const matchesCat = selectedCategory === "All" || medicine.category === selectedCategory;
      return matchesQuery && matchesCat;
    });
  }, [query, selectedCategory, medicines]);

  return (
    <Section id="pharmacy">
      <SectionHeading
        eyebrow="Pharmacy"
        title="MediQ Pharmacy & Medicine Store"
        subtitle="Find authentic prescription medicines, health essentials, and home healthcare delivery."
      />

      <div className="mx-auto mt-8 max-w-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, generic, brand, strength, or category..."
            aria-label="Search medicines"
            className="h-14 rounded-2xl border-border bg-card pl-11 pr-4 text-base shadow-soft"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-8 flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar flex-wrap">
        {categoryFilters.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                active
                  ? "gradient-primary text-primary-foreground border-primary shadow-soft"
                  : "bg-card border-border hover:bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-16 text-center text-muted-foreground">
            <Pill className="h-8 w-8 mx-auto mb-2 animate-bounce text-primary" />
            <p className="font-semibold text-sm">Loading dynamic pharmacy catalog...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="font-semibold">No medicines matched “{query}”</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try a generic name, or sign in to your patient portal for full prescription ordering.
            </p>
          </div>
        ) : (
          results.map((medicine, i) => {
            const inCart = cart.includes(medicine.id);
            const inStock = medicine.stock > 0;

            return (
              <Reveal key={medicine.id} delay={i * 0.05}>
                <div className="card-lift flex h-full flex-col rounded-3xl border border-border bg-card p-5 shadow-soft justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-foreground">{medicine.name}</h3>
                        <p className="text-xs text-primary font-semibold">{medicine.strength}</p>
                      </div>
                      <span
                        className={cn(
                          "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                          inStock
                            ? "border-success/30 bg-success/10 text-success"
                            : "border-destructive/30 bg-destructive/10 text-destructive",
                        )}
                      >
                        {inStock ? `${medicine.stock} in stock` : "Out of stock"}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1">
                      Generic: <strong className="text-foreground">{medicine.genericName}</strong>
                    </p>

                    {medicine.prescriptionRequired && (
                      <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <ShieldAlert className="h-3.5 w-3.5" /> Rx Prescription required
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border flex items-center justify-between gap-3">
                    <p className="text-lg font-black text-foreground">${medicine.price.toFixed(2)}</p>
                    <Link
                      to="/patient"
                      className="inline-flex items-center gap-1 text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 px-3 py-1.5 rounded-xl transition-all"
                    >
                      <ShoppingCart className="h-3.5 w-3.5" />
                      <span>Order in Portal</span>
                    </Link>
                  </div>
                </div>
              </Reveal>
            );
          })
        )}
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Link to="/patient">
          <Button className="rounded-xl gradient-primary font-semibold text-primary-foreground w-full sm:w-auto">
            Open Patient Pharmacy & Cart <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/patient">
          <Button
            variant="outline"
            className="rounded-xl font-semibold w-full sm:w-auto"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload & Verify Prescription
          </Button>
        </Link>
      </div>
    </Section>
  );
}
