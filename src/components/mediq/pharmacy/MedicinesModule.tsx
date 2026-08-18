import { formatBDT } from "@/lib/currency";
import React, { useEffect, useState } from "react";
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
  CheckCircle2,
  AlertTriangle,
  Edit2,
  Trash2,
  Tag,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyCategory, PharmacyMedicine } from "@/data/pharmacy-data";
import {
  addDynamicMedicine,
  updateDynamicMedicine,
  deleteDynamicMedicine,
} from "@/data/pharmacy-store";

interface MedicinesModuleProps {
  medicines: PharmacyMedicine[];
  categories: PharmacyCategory[];
  onAddMedicine: (med: PharmacyMedicine) => void;
  onUpdateMedicine?: (medId: string, updates: Partial<PharmacyMedicine>) => void;
  onDeleteMedicine?: (medId: string) => void;
}

export function MedicinesModule({
  medicines,
  categories,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
}: MedicinesModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Add modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [genericName, setGenericName] = useState("");
  const [brand, setBrand] = useState("");
  const [strength, setStrength] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    if (!category && categories.length > 0) setCategory(categories[0].name);
  }, [categories, category]);
  const [price, setPrice] = useState(5.0);
  const [stock, setStock] = useState(100);
  const [expiryDate, setExpiryDate] = useState("2028-12-31");
  const [prescriptionRequired, setPrescriptionRequired] = useState(true);

  // Edit modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMed, setEditingMed] = useState<PharmacyMedicine | null>(null);

  // Create Medicine
  const handleCreateMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) {
      toast.error("Medicine name and category are required.");
      return;
    }

    try {
      const newMed = await addDynamicMedicine({
        name,
        genericName,
        brand: brand || "MediQ Pharma",
        strength: strength || "Standard",
        category,
        price: Number(price),
        stock: Number(stock),
        reorderLevel: 20,
        expiryDate,
        prescriptionRequired,
        stockStatus: stock === 0 ? "Out of Stock" : stock < 25 ? "Low Stock" : "In Stock",
      });

      onAddMedicine(newMed);
      setModalOpen(false);
      setName("");
      setGenericName("");
      setBrand("");
      setStrength("");
      toast.success(`Added ${name} to Pharmacy Catalog and Database`);
    } catch (err: any) {
      toast.error("Failed to save medicine");
    }
  };

  // Open Edit Modal
  const openEditModal = (med: PharmacyMedicine) => {
    setEditingMed(med);
    setEditModalOpen(true);
  };

  // Save Edit
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMed) return;

    try {
      await updateDynamicMedicine(editingMed.id, {
        name: editingMed.name,
        genericName: editingMed.genericName,
        brand: editingMed.brand,
        strength: editingMed.strength,
        category: editingMed.category,
        price: editingMed.price,
        stock: editingMed.stock,
        prescriptionRequired: editingMed.prescriptionRequired,
      });

      if (onUpdateMedicine) {
        onUpdateMedicine(editingMed.id, editingMed);
      }

      setEditModalOpen(false);
      setEditingMed(null);
      toast.success(`Updated ${editingMed.name}`);
    } catch (err) {
      toast.error("Failed to update medicine");
    }
  };

  // Delete Medicine
  const handleDelete = async (medId: string, medName: string) => {
    if (!confirm(`Are you sure you want to remove "${medName}" from the pharmacy catalog?`)) return;

    try {
      await deleteDynamicMedicine(medId);
      if (onDeleteMedicine) {
        onDeleteMedicine(medId);
      }
      toast.success(`Deleted ${medName}`);
    } catch (err) {
      toast.error("Failed to delete medicine");
    }
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
            Manage dynamic medicines, generic formulations, brands, strength, pricing, and live inventory.
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
          <SelectTrigger className="h-9 w-full sm:w-56 text-xs rounded-xl">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Categories</SelectItem>
            {categories.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}
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

            <div className="space-y-2 pt-3 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px]">PRICE & STOCK</span>
                  <span className="font-bold text-foreground">{formatBDT(m.price)}</span> —{" "}
                  <span className="font-semibold text-muted-foreground">{m.stock} Units</span>
                </div>

                <Badge
                  className={
                    m.stockStatus === "In Stock"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                      : m.stockStatus === "Low Stock"
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                      : "bg-red-500/20 text-red-600 dark:text-red-400 font-bold"
                  }
                >
                  {m.stockStatus}
                </Badge>
              </div>

              {/* Action Buttons for Pharmacist */}
              <div className="flex items-center justify-end gap-1.5 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openEditModal(m)}
                  className="h-8 rounded-lg text-xs font-semibold gap-1"
                >
                  <Edit2 className="h-3 w-3" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(m.id, m.name)}
                  className="h-8 rounded-lg text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
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
              <Label className="text-xs font-bold text-muted-foreground">Medicine Name *</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Napa Extra" className="mt-1 rounded-xl text-xs" />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Generic Name *</Label>
              <Input value={genericName} onChange={(e) => setGenericName(e.target.value)} required placeholder="e.g. Paracetamol + Caffeine" className="mt-1 rounded-xl text-xs" />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Brand / Manufacturer</Label>
                <Input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Beximco Pharma" className="mt-1 rounded-xl text-xs" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Strength / Form</Label>
                <Input value={strength} onChange={(e) => setStrength(e.target.value)} placeholder="e.g. 500mg Tablet" className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1 rounded-xl text-xs">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((item) => <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Price per Unit (BDT) *</Label>
                <Input type="number" step="0.1" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 rounded-xl text-xs" />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Initial Stock Units *</Label>
                <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="prescriptionRequired"
                checked={prescriptionRequired}
                onChange={(e) => setPrescriptionRequired(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="prescriptionRequired" className="text-xs font-semibold text-foreground cursor-pointer">
                Prescription Required (Rx)
              </label>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md">
              Save Medicine to Catalog
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      {editingMed && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Edit2 className="h-5 w-5 text-primary" /> Edit Medicine Details
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-2 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Medicine Name</Label>
                <Input
                  value={editingMed.name}
                  onChange={(e) => setEditingMed({ ...editingMed, name: e.target.value })}
                  required
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Generic Name</Label>
                <Input
                  value={editingMed.genericName}
                  onChange={(e) => setEditingMed({ ...editingMed, genericName: e.target.value })}
                  required
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Brand</Label>
                  <Input
                    value={editingMed.brand}
                    onChange={(e) => setEditingMed({ ...editingMed, brand: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Strength</Label>
                  <Input
                    value={editingMed.strength}
                    onChange={(e) => setEditingMed({ ...editingMed, strength: e.target.value })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Price (BDT)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={editingMed.price}
                    onChange={(e) => setEditingMed({ ...editingMed, price: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Current Stock</Label>
                  <Input
                    type="number"
                    value={editingMed.stock}
                    onChange={(e) => setEditingMed({ ...editingMed, stock: Number(e.target.value) })}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="editPrescriptionRequired"
                  checked={editingMed.prescriptionRequired}
                  onChange={(e) => setEditingMed({ ...editingMed, prescriptionRequired: e.target.checked })}
                  className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="editPrescriptionRequired" className="text-xs font-semibold text-foreground cursor-pointer">
                  Prescription Required (Rx)
                </label>
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md">
                Update Medicine
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
