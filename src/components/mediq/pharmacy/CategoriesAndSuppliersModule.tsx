import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tag,
  Truck,
  Building2,
  Mail,
  Phone,
  Clock,
  Plus,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { PharmacyCategory, PharmacySupplier } from "@/data/pharmacy-data";

interface CategoriesAndSuppliersModuleProps {
  suppliers: PharmacySupplier[];
  categories: PharmacyCategory[];
  onAddSupplier?: (newSupplier: PharmacySupplier) => void;
}

export function CategoriesAndSuppliersModule({
  suppliers,
  categories,
  onAddSupplier,
}: CategoriesAndSuppliersModuleProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("+1 (555) 309-8811");
  const [email, setEmail] = useState("supply@pharma.com");
  const [leadTimeDays, setLeadTimeDays] = useState("2");

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Please enter Supplier Name");
      return;
    }

    const newSup: PharmacySupplier = {
      id: `sup-${Date.now()}`,
      name,
      contactPerson: contactPerson || "Account Manager",
      phone,
      email,
      leadTimeDays: Number(leadTimeDays) || 2,
      suppliedCategories: categories.slice(0, 2).map((category) => category.name),
    };

    if (onAddSupplier) {
      onAddSupplier(newSup);
    }

    setName("");
    setModalOpen(false);
    toast.success(`Registered New Supplier: ${newSup.name}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-6 w-6 text-primary" /> Product Categories & Supplier Directory ({suppliers.length})
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage pharmaceutical categories and track wholesale supplier lead times and contacts.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md shrink-0 h-10"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Register Supplier
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold flex items-center gap-2">
          <Tag className="h-4 w-4 text-teal" /> Pharmaceutical Categories
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 rounded-2xl border border-border bg-card hover:border-teal/40 transition-all space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-foreground">{category.name}</h4>
                <Badge variant="outline" className="text-xs font-bold font-mono text-teal">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Managed dynamically by administrators.</p>
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

      {/* Register Supplier Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Register Drug Distributor / Supplier
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Supplier / Company Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Novartis Pharma Supply"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Contact Representative</Label>
                <Input
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Tariqul Islam"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Lead Time (Days)</Label>
                <Input
                  type="number"
                  min={1}
                  value={leadTimeDays}
                  onChange={(e) => setLeadTimeDays(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Phone Number</Label>
              <Input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555)..."
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Corporate Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="supply@company.com"
                className="mt-1 rounded-xl text-xs"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Save Supplier Details
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
