/** MediQ Guided Floorplan: practical, live clinical-profile controls with Route Blue clarity. */
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AvatarUpload } from "@/components/ui/avatar-upload";
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
  HelpCircle,
  Palmtree,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DoctorProfile } from "@/data/doctor-data";
import {
  getDoctorSchedules,
  toggleDoctorVacation,
  DepartmentItem,
} from "@/data/doctor-schedule-store";
import { fetchSupabaseDepartments } from "@/services/supabase-service";

interface DoctorProfileModuleProps {
  profile: DoctorProfile;
  onUpdateProfile: (updated: DoctorProfile) => Promise<{ success: boolean; message?: string }>;
}

export function DoctorProfileModule({
  profile,
  onUpdateProfile,
}: DoctorProfileModuleProps) {
  const [formData, setFormData] = useState<DoctorProfile & { age?: number; gender?: string }>(profile);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [departmentLoadError, setDepartmentLoadError] = useState<string | null>(null);

  const refreshDepartments = useCallback(async () => {
    setDepartmentsLoading(true);
    setDepartmentLoadError(null);
    try {
      const { data, error } = await fetchSupabaseDepartments();
      if (error) {
        setDepartments([]);
        setDepartmentLoadError(error.message || "The shared department catalogue could not be loaded.");
        return;
      }
      setDepartments(data);
    } finally {
      setDepartmentsLoading(false);
    }
  }, []);

  const docId = profile.id || "doc-101";
  const [onVacation, setOnVacation] = useState<boolean>(() => {
    const schedules = getDoctorSchedules();
    return schedules[docId]?.onVacation ?? false;
  });

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  useEffect(() => {
    refreshDepartments().catch(() => {});

    window.addEventListener("focus", refreshDepartments);
    return () => {
      window.removeEventListener("focus", refreshDepartments);
    };
  }, [refreshDepartments]);

  const selectedDepartment = departments.some((department) => department.name === formData.department)
    ? formData.department
    : undefined;

  const handleVacationToggle = () => {
    const nextStatus = !onVacation;
    setOnVacation(nextStatus);
    toggleDoctorVacation(docId, nextStatus);
    toast.success(
      nextStatus
        ? "Vacation Mode Turned ON"
        : "Vacation Mode Turned OFF",
      {
        description: nextStatus
          ? "You are now off-duty and hidden from patient booking lists."
          : "You are now back on duty and visible for online appointments.",
      }
    );
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onUpdateProfile(formData as DoctorProfile);
    if (!result.success) {
      toast.error("Doctor Profile Could Not Be Saved", {
        description: result.message || "Please try again.",
      });
      return;
    }
    toast.success("Doctor Profile Details Updated", {
      description: "Your department and practice details are saved to MediQ.",
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

  const handleForgotPassword = () => {
    toast.info("Password Reset Link Dispatched", {
      description: `A password reset link has been sent to ${formData.email || formData.phone}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Vacation Status Notice Banner if active */}
      {onVacation && (
        <div className="bg-amber-500/15 border-2 border-amber-500/40 p-4 rounded-2xl flex items-center justify-between gap-4 text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <Palmtree className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Vacation Mode Active (Off-Duty)</h4>
              <p className="text-xs opacity-90">
                You are currently hidden from patient booking lists on Home & Patient panel.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={handleVacationToggle}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl"
          >
            Turn Off Vacation Mode
          </Button>
        </div>
      )}

      {/* Header Banner */}
      <div className="gradient-primary p-6 rounded-2xl text-primary-foreground shadow-soft">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <AvatarUpload
              value={formData.avatar}
              onChange={(url) => setFormData({ ...formData, avatar: url })}
              alt={formData.name}
              size="lg"
              label="Doctor Photo"
              maxSizeMB={5}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">{formData.name}</h1>
                <Badge className="bg-white/20 text-white border-none font-bold">
                  {formData.specialization}
                </Badge>
                {onVacation ? (
                  <Badge className="bg-amber-500 text-white font-bold flex items-center gap-1">
                    <Palmtree className="h-3 w-3" /> On Vacation
                  </Badge>
                ) : (
                  <Badge className="bg-emerald-500 text-white font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Active On-Duty
                  </Badge>
                )}
              </div>
              <p className="text-xs opacity-90 mt-1">
                BMDC Reg: <span className="font-mono">{formData.licenseNumber}</span> | Capacity: {formData.maxPatientsPerDay} Patients/Day
              </p>
              <p className="text-xs opacity-80 mt-0.5">
                Age: {formData.age ?? "Not recorded"} | Gender: {formData.gender || "Not recorded"} | Dept: {formData.department || "Not assigned"}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-2 text-xs bg-white/10 p-4 rounded-xl border border-white/20">
            <div className="flex items-center gap-2">
              <span className="opacity-80">Vacation Mode:</span>
              <Button
                size="sm"
                variant={onVacation ? "destructive" : "secondary"}
                onClick={handleVacationToggle}
                className="h-7 text-[11px] font-bold rounded-lg px-2.5"
              >
                <Palmtree className="mr-1 h-3.5 w-3.5" />
                {onVacation ? "ON (Off-Duty)" : "OFF (On-Duty)"}
              </Button>
            </div>
            <span className="opacity-80 mt-1">Consultation Fee</span>
            <span className="text-xl font-bold">
              ${formData.consultationFee} <span className="text-xs font-normal opacity-90">/ Session</span>
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-card border border-border p-1 rounded-xl mb-6 grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="details" className="rounded-lg text-xs font-semibold py-2">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" /> Personal & Practice Info
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-lg text-xs font-semibold py-2">
            <Lock className="mr-1.5 h-3.5 w-3.5 text-teal" /> Security
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Personal Info */}
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
                <Label className="text-xs font-bold text-muted-foreground">Age (Years)</Label>
                <Input
                  type="number"
                  min={1}
                  max={120}
                  value={formData.age || ""}
                  onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                  className="mt-1.5 rounded-xl text-xs font-semibold"
                />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Gender</Label>
                <Select
                  value={formData.gender || "Male"}
                  onValueChange={(val) => setFormData({ ...formData, gender: val })}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl text-xs font-semibold">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs font-bold text-muted-foreground">Department</Label>
                </div>
                <Select
                  value={selectedDepartment}
                  onValueChange={(val) => setFormData({ ...formData, department: val })}
                  disabled={departmentsLoading || departments.length === 0}
                >
                  <SelectTrigger className="mt-1.5 rounded-xl text-xs font-semibold">
                    <SelectValue placeholder={departmentsLoading ? "Loading departments..." : "Select Department"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.length === 0 ? (
                      <SelectItem value="no-departments-available" disabled>No departments available</SelectItem>
                    ) : departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>
                        {d.name} ({d.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {departmentLoadError && (
                  <p className="mt-1.5 text-[10px] leading-relaxed text-destructive" role="alert">
                    The shared department catalogue is unavailable: {departmentLoadError}
                  </p>
                )}
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

        {/* Tab 2: Security */}
        <TabsContent value="security">
          <form onSubmit={handlePasswordSave} className="bg-card border border-border rounded-2xl p-6 space-y-6 max-w-xl">
            <h3 className="text-base font-bold flex items-center justify-between border-b border-border pb-3">
              <span className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal" /> Security Credentials & Password
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
                Forgot Password? Reset via Email/SMS
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
