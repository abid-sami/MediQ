import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pill,
  Plus,
  Search,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyMedicine } from "@/data/pharmacy-data";

interface MedicinesModuleProps {
  medicines: PharmacyMedicine[];
  onAddMedicine: (med: PharmacyMedicine) => void;
}

export function MedicinesModule({
  medicines,
  onAddMedicine,
}: MedicinesModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brand, setBrand] = useState("");
  const [strength, setStrength] = useState("");
  const [category, setCategory] = useState("Prescription Medicines");
  const [price, setPrice] = useState(5.0);
  const [stock, setStock] = useState(100);
  const [expiryDate, setExpiryDate] = useState("2027-12-31");
  const [prescriptionRequired, setPrescriptionRequired] = useState(true);

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    const newMed: PharmacyMedicine = {
      id: `med-${Date.now()}`,
      name,
      genericName,
      brand,
      strength,
      category,
      price,
      stock,
      reorderLevel: 20,
      expiryDate,
      prescriptionRequired,
      stockStatus: stock === 0 ? "Out of Stock" : stock < 25 ? "Low Stock" : "In Stock",
    };
    onAddMedicine(newMed);
    setModalOpen(false);
    toast.success(`Added ${name} to Pharmacy Catalog`);
  };

  const filtered = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || m.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Pill className="h-6 w-6 text-teal" /> Pharmaceutical Catalog & Drug Master
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage active medicines, generic formulations, brands, strength, pricing, and prescription requirements.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add New Medicine
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, generic, or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-full sm:w-48 text-xs rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            <SelectItem value="Prescription Medicines">Prescription Medicines</SelectItem>
            <SelectItem value="OTC Medicines">OTC Medicines</SelectItem>
            <SelectItem value="Vitamins">Vitamins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-teal/40 transition-all shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="outline" className="text-[10px] font-bold">
                  {m.category}
                </Badge>
                {m.prescriptionRequired && (
                  <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                    Rx Required
                  </Badge>
                )}
              </div>

              <h3 className="font-bold text-base text-foreground">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Generic: <strong className="text-foreground">{m.genericName}</strong> | Brand: {m.brand}
              </p>
              <p className="text-xs text-teal font-bold mt-1">Strength: {m.strength}</p>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px]">PRICE & STOCK</span>
                <span className="font-bold text-foreground">${m.price.toFixed(2)}</span> —{" "}
                <span className="font-semibold text-muted-foreground">{m.stock} Units</span>
              </div>

              <Badge
                className={
                  m.stockStatus === "In Stock"
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                    : m.stockStatus === "Low Stock"
                    ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                    : m.stockStatus === "Out of Stock"
                    ? "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                    : "bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold"
                }
              >
                {m.stockStatus}
              </Badge>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Pill className="h-5 w-5 text-teal" /> Add New Medicine Product
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateMedicine} className="space-y-3 mt-2 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Medicine Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 rounded-xl text-xs" />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Generic Name</Label>
              <Input value={genericName} onChange={(e) => setGenericName(e.target.value)} required className="mt-1 rounded-xl text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Brand</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1 rounded-xl text-xs" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Strength</Label>
                <Input value={strength} onChange={(e) => setStrength(e.target.value)} className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Price ($)</Label>
                <Input type="number" step="0.5" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 rounded-xl text-xs" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Stock Count</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2">
              Save Medicine to Catalog
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
