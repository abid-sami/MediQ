/** MediQ Guided Floorplan: clear Route Blue clinical governance controls with durable live data. */
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import {
  DepartmentItem,
  getDepartments,
  saveDepartments,
  syncDepartmentsFromSchedules,
} from "@/data/doctor-schedule-store";
import {
  createSupabaseDepartment,
  deleteSupabaseDepartment,
  updateSupabaseDepartment,
} from "@/services/supabase-service";
import { useAuth } from "@/hooks/use-auth";

export function DepartmentManagementModule() {
  const [departments, setDepartments] = useState<DepartmentItem[]>(() => getDepartments());
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { user } = useAuth();

  // Create Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [headOfDepartment, setHeadOfDepartment] = useState("");
  const [description, setDescription] = useState("");

  // Edit Modal State
  const [editingDept, setEditingDept] = useState<DepartmentItem | null>(null);

  // Delete Confirmation State
  const [deletingDept, setDeletingDept] = useState<DepartmentItem | null>(null);

  useEffect(() => {
    let isActive = true;
    const handleUpdate = () => {
      if (isActive) setDepartments(getDepartments());
    };

    // SSR renders without browser storage. Hydrate the local cache after the
    // client mounts, then replace it with the shared Supabase catalogue when
    // the departments migration is available.
    syncDepartmentsFromSchedules().then((nextDepartments) => {
      if (isActive) setDepartments(nextDepartments);
    });

    window.addEventListener("mediq_departments_updated", handleUpdate);
    return () => {
      isActive = false;
      window.removeEventListener("mediq_departments_updated", handleUpdate);
    };
  }, []);

  const filtered = departments.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.headOfDepartment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error("Please fill in Department Name and Code");
      return;
    }

    const normalizedName = name.trim();
    const normalizedCode = code.trim().toUpperCase();
    const alreadyExists = departments.some(
      (department) =>
        department.name.toLowerCase() === normalizedName.toLowerCase() ||
        department.code.toUpperCase() === normalizedCode,
    );
    if (alreadyExists) {
      toast.error("A department with this name or code already exists");
      return;
    }

    const draft: DepartmentItem = {
      id: `dep-${Date.now()}`,
      name: normalizedName,
      code: normalizedCode,
      headOfDepartment: headOfDepartment.trim() || "Unassigned",
      description: description.trim() || "Hospital clinical specialized department unit.",
      doctorCount: 0,
    };

    setIsSaving(true);
    const { data, error } = await createSupabaseDepartment({
      name: draft.name,
      code: draft.code,
      headOfDepartment: draft.headOfDepartment,
      description: draft.description,
      ...(user?.id ? { createdBy: user.id } : {}),
    });
    setIsSaving(false);

    const savedDepartment = data ? { ...data, doctorCount: 0 } : draft;
    const updated = [savedDepartment, ...departments];
    setDepartments(updated);
    saveDepartments(updated);
    setName("");
    setCode("");
    setHeadOfDepartment("");
    setDescription("");
    setCreateModalOpen(false);

    if (error || !data) {
      toast.warning(`Department "${draft.name}" saved on this device`, {
        description: "Shared Supabase storage will be used as soon as the departments migration is applied.",
      });
      return;
    }

    toast.success(`Department "${savedDepartment.name}" Created Successfully`, {
      description: "Available immediately across MediQ for doctor assignment.",
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDept) return;

    const normalized = {
      ...editingDept,
      name: editingDept.name.trim(),
      code: editingDept.code.trim().toUpperCase(),
      headOfDepartment: editingDept.headOfDepartment.trim() || "Unassigned",
      description: editingDept.description.trim() || "Hospital clinical specialized department unit.",
    };
    if (!normalized.name || !normalized.code) {
      toast.error("Please fill in Department Name and Code");
      return;
    }

    setIsSaving(true);
    const { data, error } = await updateSupabaseDepartment(normalized.id, normalized);
    setIsSaving(false);
    const savedDepartment = data
      ? { ...data, doctorCount: normalized.doctorCount }
      : normalized;
    const updated = departments.map((department) =>
      department.id === normalized.id ? savedDepartment : department,
    );
    setDepartments(updated);
    saveDepartments(updated);
    setEditingDept(null);

    if (error || !data) {
      toast.warning(`Department "${normalized.name}" updated on this device`, {
        description: "Shared Supabase storage will be used as soon as the departments migration is applied.",
      });
      return;
    }

    toast.success(`Department "${savedDepartment.name}" Updated Successfully`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingDept) return;

    setIsSaving(true);
    const { error } = await deleteSupabaseDepartment(deletingDept.id);
    setIsSaving(false);
    const updated = departments.filter((d) => d.id !== deletingDept.id);
    setDepartments(updated);
    saveDepartments(updated);
    setDeletingDept(null);

    if (error) {
      toast.warning(`Department "${deletingDept.name}" removed from this device`, {
        description: "The shared record will be removed after the departments migration is applied.",
      });
      return;
    }

    toast.success(`Department "${deletingDept.name}" Deleted`);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" /> Hospital Departments Governance
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, modify, and manage clinical hospital departments across MediQ network.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Create New Department
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search department name, code, or HOD..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>
        <Badge variant="outline" className="ml-auto text-xs font-semibold text-primary">
          Total: {departments.length} Departments
        </Badge>
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((dep) => (
          <Card key={dep.id} className="border-border hover:border-primary/40 transition-all shadow-xs rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{dep.name}</h3>
                    <Badge variant="secondary" className="font-mono text-[10px] font-bold">
                      {dep.code}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span>HOD: <strong className="text-foreground">{dep.headOfDepartment}</strong></span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 min-h-[36px]">
                {dep.description}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                  <Users className="h-3.5 w-3.5 text-teal" />
                  <span>{dep.doctorCount} Doctors</span>
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingDept(dep)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-primary/10 text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeletingDept(dep)}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-destructive/10 text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Department Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" /> Create New Department
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Department Name *</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Cardiothoracic Surgery"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Department Code *</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g. CTS"
                  className="mt-1 rounded-xl text-xs font-mono font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Head of Department</Label>
                <Input
                  value={headOfDepartment}
                  onChange={(e) => setHeadOfDepartment(e.target.value)}
                  placeholder="e.g. Dr. Mahmudul Hasan"
                  className="mt-1 rounded-xl text-xs font-semibold"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Department Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of department services and clinical specialization..."
                className="mt-1 rounded-xl text-xs h-20"
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2"
            >
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> {isSaving ? "Saving Department..." : "Save New Department"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modify / Edit Department Modal */}
      {editingDept && (
        <Dialog open={!!editingDept} onOpenChange={() => setEditingDept(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" /> Modify Department
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs mt-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Department Name</Label>
                <Input
                  value={editingDept.name}
                  onChange={(e) => setEditingDept({ ...editingDept, name: e.target.value })}
                  required
                  className="mt-1 rounded-xl text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Code</Label>
                  <Input
                    value={editingDept.code}
                    onChange={(e) => setEditingDept({ ...editingDept, code: e.target.value.toUpperCase() })}
                    required
                    className="mt-1 rounded-xl text-xs font-mono font-bold"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-muted-foreground">HOD Name</Label>
                  <Input
                    value={editingDept.headOfDepartment}
                    onChange={(e) => setEditingDept({ ...editingDept, headOfDepartment: e.target.value })}
                    className="mt-1 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Description</Label>
                <Textarea
                  value={editingDept.description}
                  onChange={(e) => setEditingDept({ ...editingDept, description: e.target.value })}
                  className="mt-1 rounded-xl text-xs h-20"
                />
              </div>

              <Button
              type="submit"
              disabled={isSaving}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2"
            >
                {isSaving ? "Saving Changes..." : "Save Department Changes"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Department Modal */}
      {deletingDept && (
        <Dialog open={!!deletingDept} onOpenChange={() => setDeletingDept(null)}>
          <DialogContent className="max-w-sm p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-destructive">
                Delete Department?
              </DialogTitle>
            </DialogHeader>

            <p className="text-xs text-muted-foreground mt-2">
              Are you sure you want to delete <strong className="text-foreground">{deletingDept.name} ({deletingDept.code})</strong>? This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 mt-4">
              <Button variant="outline" size="sm" onClick={() => setDeletingDept(null)} className="rounded-xl text-xs">
                Cancel
              </Button>
              <Button variant="destructive" size="sm" disabled={isSaving} onClick={handleDeleteConfirm} className="rounded-xl text-xs font-bold">
                {isSaving ? "Deleting..." : "Delete Department"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
