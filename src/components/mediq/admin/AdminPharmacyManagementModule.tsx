import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PharmacyCategory, PharmacyMedicine } from "@/data/pharmacy-data";
import {
  addDynamicPharmacyCategory,
  deleteDynamicMedicine,
  deleteDynamicPharmacyCategory,
  getDynamicMedicines,
  getDynamicPharmacyCategories,
  updateDynamicMedicine,
  updateDynamicPharmacyCategory,
} from "@/data/pharmacy-store";
import { MedicinesModule } from "../pharmacy/MedicinesModule";

export function AdminPharmacyManagementModule() {
  const [medicines, setMedicines] = useState<PharmacyMedicine[]>([]);
  const [categories, setCategories] = useState<PharmacyCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [medicineData, categoryData] = await Promise.all([
        getDynamicMedicines(),
        getDynamicPharmacyCategories(),
      ]);
      setMedicines(medicineData);
      setCategories(categoryData);
    } catch (error: any) {
      toast.error(error?.message || "Could not load pharmacy data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleAddCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newCategory.trim()) return;
    try {
      const category = await addDynamicPharmacyCategory(newCategory);
      setCategories((current) => [...current, category].sort((a, b) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name)));
      setNewCategory("");
      toast.success(`Category “${category.name}” added.`);
    } catch (error: any) {
      toast.error(error?.message || "Could not add category.");
    }
  };

  const handleRenameCategory = async (category: PharmacyCategory) => {
    if (!editingCategoryName.trim()) return;
    try {
      await updateDynamicPharmacyCategory(category.id, editingCategoryName);
      setCategories((current) => current.map((item) => item.id === category.id ? { ...item, name: editingCategoryName.trim() } : item));
      setEditingCategoryId(null);
      toast.success("Category updated.");
    } catch (error: any) {
      toast.error(error?.message || "Could not update category.");
    }
  };

  const handleDeleteCategory = async (category: PharmacyCategory) => {
    if (!window.confirm(`Deactivate category “${category.name}”?`)) return;
    try {
      await deleteDynamicPharmacyCategory(category.id);
      setCategories((current) => current.filter((item) => item.id !== category.id));
      toast.success("Category deactivated.");
    } catch (error: any) {
      toast.error(error?.message || "Could not deactivate category.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border p-5 rounded-2xl shadow-xs">
        <h2 className="text-lg font-bold flex items-center gap-2"><Pill className="h-5 w-5 text-amber-500" /> Pharmacy Medicine Administration</h2>
        <p className="text-xs text-muted-foreground mt-1">Administrators can add, edit, remove, and categorize the live medicine catalog shown on Home and in patient ordering.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3"><div><h3 className="font-bold text-sm">Medicine Categories</h3><p className="text-xs text-muted-foreground">These categories drive all medicine filters and forms.</p></div><Badge variant="outline" className="text-xs">{categories.length} active</Badge></div>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2">
          <div className="flex-1"><Label className="text-xs font-bold text-muted-foreground">New category</Label><Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="e.g. Dermatology" className="mt-1 rounded-xl text-xs" /></div>
          <Button type="submit" className="sm:self-end rounded-xl text-xs font-bold"><Plus className="h-3.5 w-3.5 mr-1" /> Add category</Button>
        </form>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-2 rounded-xl border border-border p-2.5">
              {editingCategoryId === category.id ? <Input value={editingCategoryName} onChange={(event) => setEditingCategoryName(event.target.value)} className="h-8 rounded-lg text-xs" /> : <span className="text-xs font-semibold flex-1 truncate">{category.name}</span>}
              {editingCategoryId === category.id ? <Button size="icon" onClick={() => void handleRenameCategory(category)} className="h-8 w-8 rounded-lg"><Save className="h-3.5 w-3.5" /></Button> : <Button size="sm" variant="outline" onClick={() => { setEditingCategoryId(category.id); setEditingCategoryName(category.name); }} className="h-8 rounded-lg text-[11px]">Edit</Button>}
              <Button size="icon" variant="ghost" onClick={() => void handleDeleteCategory(category)} className="h-8 w-8 rounded-lg text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          ))}
        </div>
      </div>

      {loading ? <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">Loading medicines...</div> : <MedicinesModule
        medicines={medicines}
        categories={categories}
        onAddMedicine={(medicine) => setMedicines((current) => [medicine, ...current.filter((item) => item.id !== medicine.id)])}
        onUpdateMedicine={async (id, updates) => {
          await updateDynamicMedicine(id, updates);
          setMedicines((current) => current.map((item) => item.id === id ? { ...item, ...updates } : item));
        }}
        onDeleteMedicine={async (id) => {
          await deleteDynamicMedicine(id);
          setMedicines((current) => current.filter((item) => item.id !== id));
        }}
      />}
    </div>
  );
}
