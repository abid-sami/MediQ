import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Lock,
  Save,
  KeyRound,
  HeartPulse,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { PatientUserProfile } from "@/data/patient-data";

interface PatientProfileModuleProps {
  profile: PatientUserProfile;
  onUpdateProfile: (updated: PatientUserProfile) => void;
}

export function PatientProfileModule({
  profile,
  onUpdateProfile,
}: PatientProfileModuleProps) {
  const [formData, setFormData] = useState<PatientUserProfile>(profile);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    toast.success("Patient Profile Details Updated", {
      description: "Changes saved successfully across MediQ platform",
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
    <div className="space-y-6">
      {/* Header Profile Banner */}
      <div className="gradient-primary p-6 rounded-2xl text-primary-foreground shadow-soft">
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
                <Badge className="bg-red-500 text-white font-bold">
                  Blood Group: {formData.bloodGroup}
                </Badge>
              </div>
              <p className="text-xs opacity-90 mt-1">
                Age: {formData.age} yrs | Gender: {formData.gender}
              </p>
              <p className="text-xs opacity-80 mt-0.5">{formData.address}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6">
          <TabsTrigger value="details" className="rounded-lg text-xs font-semibold">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" /> Personal Info & Emergency Contacts
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold">
            <Lock className="mr-1.5 h-3.5 w-3.5 text-teal" /> Security Password
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="h-4 w-4 text-primary" /> Personal Demographics & Contact
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 rounded-xl font-semibold text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
                <Input
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs font-bold text-red-500"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Phone Contact</Label>
                <Input
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Email Address</Label>
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div className="md:col-span-2">
                <Label className="text-xs font-bold text-muted-foreground">Home Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Contact Name</Label>
                <Input
                  value={formData.emergencyContact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, name: e.target.value },
                    })
                  }
                  className="mt-1.5 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Contact Phone</Label>
                <Input
                  value={formData.emergencyContact.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergencyContact: { ...formData.emergencyContact, phone: e.target.value },
                    })
                  }
                  className="mt-1.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Allergies (comma separated)</Label>
                <Input
                  value={formData.allergies.join(", ")}
                  onChange={(e) =>
                    setFormData({ ...formData, allergies: e.target.value.split(",").map((s) => s.trim()) })
                  }
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Profile Photo URL</Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gradient-primary text-primary-foreground font-bold rounded-xl px-6">
                <Save className="mr-1.5 h-4 w-4" /> Save Profile Info
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <form onSubmit={handlePasswordSave} className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-xl">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Lock className="h-4 w-4 text-teal" /> Security Password Change
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

            <Button type="submit" className="w-full bg-teal hover:bg-teal/90 text-teal-foreground font-bold rounded-xl">
              <KeyRound className="mr-1.5 h-4 w-4" /> Change Password
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
