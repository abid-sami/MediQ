import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Truck,
  Building2,
  Mail,
  Phone,
  Clock,
  Plus,
  Sparkles,
} from "lucide-react";
import { PharmacySupplier } from "@/data/pharmacy-data";

interface CategoriesAndSuppliersModuleProps {
  suppliers: PharmacySupplier[];
}

const CATEGORIES = [
  { name: "Prescription Medicines", count: 142, desc: "Ethical cardiac, neuro, & antibiotic drug regimens." },
  { name: "OTC Medicines", count: 86, desc: "Over-the-counter pain relief, antacids, & cough syrups." },
  { name: "First Aid & Wound Care", count: 34, desc: "Sterile bandages, antiseptics, surgical dressings." },
  { name: "Vitamins & Supplements", count: 52, desc: "Dietary minerals, multivitamins, & calcium." },
  { name: "Diabetes & Chronic Care", count: 48, desc: "Insulin pens, glucose test strips, & monitors." },
  { name: "Personal Hygiene & Skin", count: 65, desc: "Clinical skincare, antiseptic cleansers." },
];

export function CategoriesAndSuppliersModule({
  suppliers,
}: CategoriesAndSuppliersModuleProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Product Categories & Supplier Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage pharmaceutical categories and track wholesale supplier lead times and contacts.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Tag className="h-4 w-4 text-teal" /> Pharmaceutical Categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c, i) => (
            <div key={i} className="p-4 rounded-2xl border border-border bg-card hover:border-teal/40 transition-all space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">{c.name}</h4>
                <Badge variant="outline" className="text-xs font-bold font-mono text-teal">
                  {c.count} Items
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Suppliers Grid */}
      <div className="space-y-3 pt-4 border-t border-border">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" /> Authorized Drug Suppliers & Distributors
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {suppliers.map((sup) => (
            <div key={sup.id} className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all space-y-3 shadow-xs">
              <div>
                <h4 className="font-bold text-base text-foreground">{sup.name}</h4>
                <p className="text-xs text-muted-foreground">Contact: <strong className="text-foreground">{sup.contactPerson}</strong></p>
              </div>

              <div className="space-y-1 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {sup.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-teal" /> {sup.email}</p>
                <p className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-amber-500" /> Lead Time: {sup.leadTimeDays} Day(s)</p>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {sup.suppliedCategories.map((cat, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[9px]">
                    {cat}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
