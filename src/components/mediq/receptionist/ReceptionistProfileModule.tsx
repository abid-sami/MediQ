import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import {
  User,
  Building2,
  Save,
  KeyRound,
  Lock,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { ReceptionistProfile } from "@/data/receptionist-data";

interface ReceptionistProfileModuleProps {
  profile: ReceptionistProfile;
  onUpdateProfile: (updated: ReceptionistProfile) => void;
}

export function ReceptionistProfileModule({
  profile,
  onUpdateProfile,
}: ReceptionistProfileModuleProps) {
  const [formData, setFormData] = useState<ReceptionistProfile>(profile);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    toast.success("Receptionist Profile Saved", {
      description: "Updated front-desk credentials across MediQ Patient Access Network",
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

  const handleForgotPassword = () => {
    toast.info("Password Reset Link Dispatched", {
      description: `A password reset link has been sent to ${formData.phone}`,
    });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Banner */}
      <div className="gradient-primary p-6 rounded-2xl text-primary-foreground shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <AvatarUpload
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              alt={formData.name}
              size="md"
              label="Receptionist Photo"
              maxSizeMB={5}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{formData.name}</h1>
                <Badge className="bg-white/20 text-white font-mono font-bold">
                  Badge: {formData.badgeId}
                </Badge>
              </div>
              <p className="text-xs font-semibold opacity-95 mt-1">{formData.role}</p>
              <p className="text-xs opacity-80 mt-0.5">{formData.deskLocation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6 w-full grid grid-cols-2">
          <TabsTrigger value="details" className="rounded-lg text-xs font-semibold py-2">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" /> Personal Info
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold py-2">
            <Lock className="mr-1.5 h-3.5 w-3.5 text-teal" /> Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="h-4 w-4 text-primary" /> Receptionist Profile Details
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 rounded-xl font-semibold text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Badge ID</Label>
                <Input
                  value={formData.badgeId}
                  onChange={(e) => setFormData({ ...formData, badgeId: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs font-mono"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Role / Designation</Label>
                <Input
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Desk Station Location</Label>
                <Input
                  value={formData.deskLocation}
                  onChange={(e) => setFormData({ ...formData, deskLocation: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Contact Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
          <form onSubmit={handlePasswordSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal" /> Security Password Update
              </span>

              
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

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Forgot Password? Reset via SMS
              </button>

              <Button type="submit" className="w-full sm:w-auto bg-teal hover:bg-teal/90 text-teal-foreground font-bold rounded-xl px-6">
                <KeyRound className="mr-1.5 h-4 w-4" /> Change Password
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
