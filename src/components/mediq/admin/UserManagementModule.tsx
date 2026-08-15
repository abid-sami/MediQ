import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Users,
  Search,
  UserPlus,
  Plus,
  ShieldCheck,
  Edit,
  Mail,
  Phone,
  CheckCircle2,
  Loader2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { SystemUser, UserRole, UserStatus } from "@/data/admin-data";
import { registerWithSupabase } from "@/services/supabase-service";

interface UserManagementModuleProps {
  users: SystemUser[];
  onUpdateUser: (updated: SystemUser) => void;
  onAddUser?: (user: SystemUser) => void;
  onDeleteUser?: (userId: string) => void;
}

export function UserManagementModule({
  users,
  onUpdateUser,
  onAddUser,
  onDeleteUser,
}: UserManagementModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Doctor");
  const [editStatus, setEditStatus] = useState<UserStatus>("Active");
  const [editPhone, setEditPhone] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Create User Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createNumber, setCreateNumber] = useState("");
  const [createRole, setCreateRole] = useState<UserRole>("Doctor");
  const [createPassword, setCreatePassword] = useState("");
  const [createRePassword, setCreateRePassword] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  // Delete User Modal State
  const [deletingUser, setDeletingUser] = useState<SystemUser | null>(null);

  const handleOpenEdit = (u: SystemUser) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditRole(u.role);
    setEditStatus(u.status);
    setEditPhone(u.phone);
    setEditEmail(u.email);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    const updated: SystemUser = {
      ...editingUser,
      name: editName,
      role: editRole,
      status: editStatus,
      phone: editPhone,
      email: editEmail,
    };

    onUpdateUser(updated);
    setEditingUser(null);
    toast.success(`Updated User Credentials for ${updated.name}`);
  };

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createName.trim()) {
      toast.error("Please enter Name");
      return;
    }

    if (!createNumber.trim()) {
      toast.error("Please enter Phone Number");
      return;
    }

    if (createPassword.length < 6) {
      toast.error("Password must be at least 6 digits");
      return;
    }

    if (createPassword !== createRePassword) {
      toast.error("Passwords do not match. Please check RePassword");
      return;
    }

    setIsCreating(true);

    try {
      const emailToUse =
        createEmail.trim() ||
        `${createName.toLowerCase().replace(/[\s_-]+/g, ".")}@mediq.health`;

      const { data: authData, error } = await registerWithSupabase({
        name: createName,
        email: emailToUse,
        phone: createNumber,
        role: createRole,
        passwordText: createPassword,
      });

      if (error) {
        toast.error(error.message || "Failed to register account in Supabase");
        setIsCreating(false);
        return;
      }

      const generatedId = authData?.user?.id || `usr-${Date.now()}`;

      const newUser: SystemUser = {
        id: generatedId,
        userId: generatedId.substring(0, 8).toUpperCase(),
        name: createName,
        email: emailToUse,
        phone: createNumber,
        role: createRole,
        status: "Active",
        registeredDate: new Date().toISOString().split("T")[0],
        lastActive: "Just now",
        avatar:
          "https://ibb.co.com/39NqwQCP",
      };

      if (onAddUser) {
        onAddUser(newUser);
      }

      setCreateName("");
      setCreateEmail("");
      setCreateNumber("");
      setCreatePassword("");
      setCreateRePassword("");
      setCreateModalOpen(false);

      toast.success(
        `Account Created & Registered in Supabase for ${newUser.name} (${newUser.role})!`
      );
    } catch (err: any) {
      toast.error(err?.message || "An error occurred while creating account.");
    } finally {
      setIsCreating(false);
    }
  };

  const filtered = (users || []).filter((u) => {
    if (!u) return false;
    const nameStr = String(u.name || "");
    const emailStr = String(u.email || "");
    const userIdStr = String(u.userId || u.id || "");
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      nameStr.toLowerCase().includes(search) ||
      emailStr.toLowerCase().includes(search) ||
      userIdStr.toLowerCase().includes(search);
    const matchesRole = roleFilter === "All" || u.role === roleFilter;
    const matchesStatus = statusFilter === "All" || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Enterprise User Role & Governance Directory
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Admin management panel: Create and edit staff & patient accounts across all 8 healthcare roles.
          </p>
        </div>

        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <UserPlus className="mr-1.5 h-4 w-4" /> Create Staff / User Account
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email, or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="h-9 text-xs rounded-xl w-full sm:w-40">
              <SelectValue placeholder="Role Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Roles</SelectItem>
              <SelectItem value="Super Admin">Super Admin</SelectItem>
              <SelectItem value="Doctor">Doctor</SelectItem>
              <SelectItem value="Patient">Patient</SelectItem>
              <SelectItem value="Nurse">Nurse</SelectItem>
              <SelectItem value="Pharmacist">Pharmacist</SelectItem>
              <SelectItem value="Blood Bank Staff">Blood Bank Staff</SelectItem>
              <SelectItem value="Ambulance Driver">Ambulance Driver</SelectItem>
              <SelectItem value="Receptionist">Receptionist</SelectItem>
              <SelectItem value="Lab Tech">Lab Tech</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs rounded-xl w-full sm:w-40">
              <SelectValue placeholder="Status Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
              <SelectItem value="Pending Verification">Pending Verification</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                <th className="p-4">User & ID</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Status</th>
                <th className="p-4">Reg Date & Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <p className="font-semibold text-sm">No Accounts Found in Database</p>
                    <p className="text-xs mt-1">No user accounts match the current filter or search criteria.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || "https://ibb.co.com/39NqwQCP"}
                          alt={u.name || "User"}
                          className="h-9 w-9 rounded-xl object-cover border border-primary/30"
                        />
                        <div>
                          <p className="font-bold text-foreground">{u.name || "User"}</p>
                          <p className="font-mono text-[10px] text-muted-foreground">{u.userId || u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-bold text-primary text-[10px]">
                        {u.role || "Patient"}
                      </Badge>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3 text-teal" /> {u.email || "No Email"}</p>
                      <p className="text-muted-foreground flex items-center gap-1 font-mono"><Phone className="h-3 w-3 text-primary" /> {u.phone || "No Phone"}</p>
                    </td>
                    <td className="p-4">
                      <Badge
                        className={
                          u.status === "Active"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                            : u.status === "Suspended"
                            ? "bg-red-500 text-white font-bold"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                        }
                      >
                        {u.status || "Active"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-muted-foreground">{u.registeredDate || "N/A"}</p>
                      <p className="text-[10px] text-emerald-600 font-bold">{u.lastActive || "Just now"}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(u)}
                          className="h-8 text-xs font-semibold rounded-lg text-primary"
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" /> Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletingUser(u)}
                          className="h-8 text-xs font-semibold rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Create Account Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" /> Create Staff / User Account
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateUserSubmit} className="space-y-3 text-xs mt-2">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Full Name *</Label>
              <Input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                required
                placeholder="e.g. Dr. Mahmudul Hasan"
                className="mt-1 rounded-xl text-xs font-semibold"
              />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Account Role *</Label>
              <Select value={createRole} onValueChange={(v) => setCreateRole(v as UserRole)}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Select Staff Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Super Admin">Super Admin</SelectItem>
                  <SelectItem value="Doctor">Doctor</SelectItem>
                  <SelectItem value="Patient">Patient</SelectItem>
                  <SelectItem value="Nurse">Nurse</SelectItem>
                  <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="Blood Bank Staff">Blood Bank Staff</SelectItem>
                  <SelectItem value="Ambulance Driver">Ambulance Driver</SelectItem>
                  <SelectItem value="Receptionist">Receptionist</SelectItem>
                  <SelectItem value="Lab Tech">Lab Tech</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Phone Number *</Label>
                <Input
                  value={createNumber}
                  onChange={(e) => setCreateNumber(e.target.value)}
                  required
                  placeholder="+1 (555)..."
                  className="mt-1 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Email Address</Label>
                <Input
                  type="email"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  placeholder="name@mediq.health"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Password * (6 digits)</Label>
                <Input
                  type="password"
                  value={createPassword}
                  onChange={(e) => setCreatePassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">RePassword * (Confirm)</Label>
                <Input
                  type="password"
                  value={createRePassword}
                  onChange={(e) => setCreateRePassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md mt-2 disabled:opacity-50"
            >
              {isCreating ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1.5 h-4 w-4" />
              )}
              {isCreating ? "REGISTERING IN SUPABASE..." : "Create Staff Account"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      {editingUser && (
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Edit className="h-5 w-5 text-primary" /> Edit User Credentials
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs mt-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Full Name</Label>
                <Input value={editName} onChange={(e) => setEditName(e.target.value)} required className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Role</Label>
                <Select value={editRole} onValueChange={(v) => setEditRole(v as UserRole)}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Doctor">Doctor</SelectItem>
                    <SelectItem value="Patient">Patient</SelectItem>
                    <SelectItem value="Nurse">Nurse</SelectItem>
                    <SelectItem value="Pharmacist">Pharmacist</SelectItem>
                    <SelectItem value="Blood Bank Staff">Blood Bank Staff</SelectItem>
                    <SelectItem value="Ambulance Driver">Ambulance Driver</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Lab Tech">Lab Tech</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Account Status</Label>
                <Select value={editStatus} onValueChange={(v) => setEditStatus(v as UserStatus)}>
                  <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                    <SelectItem value="Pending Verification">Pending Verification</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Email</Label>
                <Input value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required className="mt-1 rounded-xl text-xs" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Phone</Label>
                <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} required className="mt-1 rounded-xl text-xs" />
              </div>

              <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
                Save User Governance Changes
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Modal */}
      {deletingUser && (
        <Dialog open={!!deletingUser} onOpenChange={() => setDeletingUser(null)}>
          <DialogContent className="max-w-xs p-6 rounded-2xl bg-card border-border">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Delete Account
              </DialogTitle>
            </DialogHeader>

            <p className="text-xs text-center text-muted-foreground mt-1">
              Are you sure you want to delete <strong className="text-foreground">{deletingUser.name}</strong> ({deletingUser.role})? This will permanently remove the account profile from Supabase.
            </p>

            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="flex-1 rounded-xl text-xs"
                onClick={() => setDeletingUser(null)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 rounded-xl text-xs font-bold"
                onClick={() => {
                  if (onDeleteUser) {
                    onDeleteUser(deletingUser.id);
                  }
                  setDeletingUser(null);
                }}
              >
                Delete Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
