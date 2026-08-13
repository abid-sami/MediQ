import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  User,
  ShieldCheck,
  Building2,
  Calendar,
  Clock,
  DollarSign,
  Award,
  Mail,
  Phone,
  MapPin,
  Save,
  KeyRound,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { DoctorProfile } from "@/data/doctor-data";

interface DoctorProfileModuleProps {
  profile: DoctorProfile;
  onUpdateProfile: (updated: DoctorProfile) => void;
}

export function DoctorProfileModule({
  profile,
  onUpdateProfile,
}: DoctorProfileModuleProps) {
  const [formData, setFormData] = useState<DoctorProfile>(profile);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    toast.success("Doctor Profile Details Updated", {
      description: "Changes applied successfully across MediQ Doctor Portal",
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
    toast.success("Security Password Updated Successfully", {
      description: "Your login credentials have been secured.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="gradient-primary p-6 rounded-2xl text-primary-foreground shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={formData.avatar}
              alt={formData.name}
              className="h-24 w-24 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{formData.name}</h1>
                <Badge className="bg-white/20 text-white font-semibold">
                  {formData.experience} Experience
                </Badge>
              </div>
              <p className="text-sm font-semibold opacity-95 mt-1">{formData.specialization}</p>
              <p className="text-xs opacity-80 flex items-center gap-2 mt-1">
                <Building2 className="h-3.5 w-3.5" /> {formData.hospital} ({formData.roomNo})
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 text-xs bg-white/10 p-4 rounded-xl border border-white/20">
            <span className="opacity-80">Consultation Fee</span>
            <span className="text-xl font-bold">
              ${formData.consultationFee} <span className="text-xs font-normal opacity-90">/ Session</span>
            </span>
            <span className="opacity-80 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" /> {formData.availableHours}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs for Overview / Edit Details / Edit Password */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6">
          <TabsTrigger value="details" className="rounded-lg text-xs font-semibold">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" /> Edit Profile Details
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold">
            <Lock className="mr-1.5 h-3.5 w-3.5 text-teal" /> Password & Security
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Edit Profile Details */}
        <TabsContent value="details">
          <form onSubmit={handleProfileSave} className="bg-card border border-border rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Sparkles className="h-4 w-4 text-primary" /> Professional Credentials & Practice Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Doctor Full Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1.5 rounded-xl font-semibold text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Specialization</Label>
                <Input
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Department</Label>
                <Input
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Qualifications & Degrees</Label>
                <Input
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Years of Experience</Label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Consultation Fee ($ USD)</Label>
                <Input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) =>
                    setFormData({ ...formData, consultationFee: Number(e.target.value) })
                  }
                  className="mt-1.5 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Hospital Name</Label>
                <Input
                  value={formData.hospital}
                  onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Chamber / Room No</Label>
                <Input
                  value={formData.roomNo}
                  onChange={(e) => setFormData({ ...formData, roomNo: e.target.value })}
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

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Contact Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Available Hours</Label>
                <Input
                  value={formData.availableHours}
                  onChange={(e) => setFormData({ ...formData, availableHours: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Avatar Image URL</Label>
                <Input
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="mt-1.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Doctor Professional Bio</Label>
              <Textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="mt-1.5 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" className="gradient-primary text-primary-foreground font-bold rounded-xl px-6">
                <Save className="mr-1.5 h-4 w-4" /> Save Profile Changes
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Tab 2: Security & Password */}
        <TabsContent value="security">
          <form onSubmit={handlePasswordSave} className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-xl">
            <h3 className="text-base font-bold flex items-center gap-2 border-b border-border pb-3">
              <Lock className="h-4 w-4 text-teal" /> Security Credentials & Password Update
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
              <KeyRound className="mr-1.5 h-4 w-4" /> Update Account Password
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
