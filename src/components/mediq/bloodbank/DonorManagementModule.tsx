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
  Plus,
  Search,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { BloodDonor, BloodGroupType } from "@/data/blood-bank-data";

interface DonorManagementModuleProps {
  donors: BloodDonor[];
  onAddDonor: (donor: BloodDonor) => void;
}

export function DonorManagementModule({
  donors,
  onAddDonor,
}: DonorManagementModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [groupFilter, setGroupFilter] = useState("All");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [bloodGroup, setBloodGroup] = useState<BloodGroupType>("O+");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleRegisterDonor = (e: React.FormEvent) => {
    e.preventDefault();
    const newDonor: BloodDonor = {
      id: `dn-${Date.now()}`,
      name,
      bloodGroup,
      phone,
      email,
      lastDonationDate: new Date().toISOString().split("T")[0],
      totalDonations: 1,
      eligibilityStatus: "Eligible",
    };

    onAddDonor(newDonor);
    setModalOpen(false);
    toast.success(`Registered New Donor ${name}`, {
      description: `Blood Group: ${bloodGroup} | Status: Eligible`,
    });
  };

  const filtered = donors.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone.includes(searchTerm) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = groupFilter === "All" || d.bloodGroup === groupFilter;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" /> Voluntary Donor Registry & Eligibility
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintain registered voluntary blood donor profiles, last donation dates, and medical eligibility.
          </p>
        </div>

        <Button
          onClick={() => setModalOpen(true)}
          className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-md"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Register New Donor
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-card border border-border p-4 rounded-xl">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search donor name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={groupFilter} onValueChange={setGroupFilter}>
          <SelectTrigger className="h-9 w-full sm:w-44 text-xs rounded-xl">
            <SelectValue placeholder="Blood Group" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Blood Groups</SelectItem>
            <SelectItem value="A+">A+</SelectItem>
            <SelectItem value="A-">A-</SelectItem>
            <SelectItem value="B+">B+</SelectItem>
            <SelectItem value="B-">B-</SelectItem>
            <SelectItem value="AB+">AB+</SelectItem>
            <SelectItem value="AB-">AB-</SelectItem>
            <SelectItem value="O+">O+</SelectItem>
            <SelectItem value="O-">O-</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Donors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-3 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-red-500 text-white font-bold text-xs">
                  Group {d.bloodGroup}
                </Badge>
                <Badge
                  className={
                    d.eligibilityStatus === "Eligible"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs"
                      : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs"
                  }
                >
                  {d.eligibilityStatus}
                </Badge>
              </div>

              <h3 className="font-bold text-base text-foreground">{d.name}</h3>
              <div className="space-y-1 text-xs text-muted-foreground mt-2">
                <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-primary" /> {d.phone}</p>
                <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-teal" /> {d.email}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Last Donated: <strong className="text-foreground">{d.lastDonationDate}</strong>
              </span>
              <span className="font-bold text-primary">{d.totalDonations} Donations</span>
            </div>
          </div>
        ))}
      </div>

      {/* Register Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" /> Register Voluntary Donor
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleRegisterDonor} className="space-y-3 mt-2 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 rounded-xl text-xs font-semibold" />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
              <Select value={bloodGroup} onValueChange={(v) => setBloodGroup(v as BloodGroupType)}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Phone Number</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 rounded-xl text-xs" />
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Email Address</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 rounded-xl text-xs" />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md">
              Save Donor Record
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
