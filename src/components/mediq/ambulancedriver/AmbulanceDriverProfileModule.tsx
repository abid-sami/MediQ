import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Siren,
  Phone,
  Truck,
  Building2,
  Save,
  KeyRound,
  Lock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { AmbulanceDriverProfile } from "@/data/ambulance-driver-data";

interface AmbulanceDriverProfileModuleProps {
  profile: AmbulanceDriverProfile;
  onUpdateProfile: (updated: AmbulanceDriverProfile) => void;
}

export function AmbulanceDriverProfileModule({
  profile,
  onUpdateProfile,
}: AmbulanceDriverProfileModuleProps) {
  const [formData, setFormData] = useState<AmbulanceDriverProfile>(profile);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    toast.success("Ambulance Driver Profile Saved", {
      description: "Updated vehicle unit credentials across MediQ Emergency Dispatch Network",
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password Updated Successfully");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Banner */}
      <div className="gradient-emergency p-6 rounded-3xl text-white shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="h-20 w-20 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{formData.name}</h1>
                <Badge className="bg-white text-destructive font-black text-xs">
                  {formData.dutyStatus}
                </Badge>
              </div>
              <p className="text-xs font-semibold opacity-95 mt-1">{formData.assignedAmbulance}</p>
              <p className="text-xs font-mono opacity-80 mt-0.5">Vehicle: {formData.vehicleNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6 w-full grid grid-cols-2">
          <TabsTrigger value="details" className="rounded-lg text-xs font-semibold">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" /> Driver Credentials
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold">
            <Lock className="mr-1.5 h-3.5 w-3.5 text-teal" /> Security Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Siren className="h-4 w-4 text-destructive" /> Emergency Vehicle & Driver Details
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Driver Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 rounded-xl font-semibold text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Assigned Ambulance Unit</Label>
                <Input
                  value={formData.assignedAmbulance}
                  onChange={(e) => setFormData({ ...formData, assignedAmbulance: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Vehicle Registration Number</Label>
                <Input
                  value={formData.vehicleNumber}
                  onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Hotline Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Base Hospital Center</Label>
                <Input
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Avatar Photo URL</Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gradient-primary text-primary-foreground font-bold rounded-xl px-6">
                <Save className="mr-1.5 h-4 w-4" /> Save Driver Info
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={handlePasswordSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Lock className="h-4 w-4 text-teal" /> Security Password Update
            </h3>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Current Password</Label>
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Confirm New Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-bold rounded-xl py-4">
              <KeyRound className="mr-1.5 h-4 w-4" /> Change Password
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
