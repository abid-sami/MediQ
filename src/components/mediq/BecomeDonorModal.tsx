import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Heart, Droplet, AlertCircle, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { createSupabaseBloodDonor, updateSupabaseProfile } from "@/services/supabase-service";

interface BecomeDonorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDonorRegistered?: (donor: any) => void;
}

const ALL_BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export function BecomeDonorModal({
  open,
  onOpenChange,
  onDonorRegistered,
}: BecomeDonorModalProps) {
  const { profile, user } = useAuth();

  const [selectedGroup, setSelectedGroup] = useState<string>("O+");
  const [phone, setPhone] = useState<string>("");
  const [agreed, setAgreed] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      if (profile.phone) setPhone(profile.phone);
      if (profile.bloodGroup) setSelectedGroup(profile.bloodGroup);
    }
  }, [profile, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      toast.error("Please confirm donation eligibility agreement.");
      return;
    }

    const donorName = profile?.name || user?.email?.split("@")[0] || "Voluntary Donor";
    const donorEmail = profile?.email || user?.email || "";
    const donorPhone = phone.trim() || profile?.phone || "+1 (555) 000-0000";
    const donorId = `DNR-${Math.floor(1000 + Math.random() * 8999)}`;

    setIsSubmitting(true);

    try {
      // 1. Update user profile to add blood group if missing
      if (profile?.id) {
        await updateSupabaseProfile(profile.id, {
          bloodGroup: selectedGroup,
          phone: donorPhone,
        });
      }

      // 2. Register blood donor record
      const donorPayload = {
        donorId,
        name: donorName,
        bloodGroup: selectedGroup,
        phone: donorPhone,
        email: donorEmail,
      };

      await createSupabaseBloodDonor(donorPayload);

      const donorObj = {
        id: `dnr-${Date.now()}`,
        donorId,
        name: donorName,
        bloodGroup: selectedGroup,
        phone: donorPhone,
        email: donorEmail,
        lastDonationDate: new Date().toISOString().split("T")[0],
        totalDonations: 1,
        eligibilityStatus: "Eligible",
      };

      if (onDonorRegistered) {
        onDonorRegistered(donorObj);
      }

      toast.success(`Registered as MediQ Voluntary Donor!`, {
        description: `Blood Group ${selectedGroup} saved to profile. Blood Bank Staff will contact you for donation schedules.`,
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "Failed to complete donor registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 rounded-3xl bg-card border-border shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-red-500/15 text-red-500">
              <Heart className="h-5 w-5 fill-current" />
            </span>
            Become a Voluntary Blood Donor
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {profile?.bloodGroup
              ? `Confirm donor registration with your registered Blood Group ${profile.bloodGroup}.`
              : "Your profile does not have a blood group specified. Please select your blood group to add it to your profile and complete donor registration."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Missing Blood Group Notice if applicable */}
          {!profile?.bloodGroup && (
            <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex items-start gap-2.5 text-xs text-amber-700 dark:text-amber-400">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Missing Profile Blood Group</p>
                <p className="text-[11px] text-amber-600 dark:text-amber-500">
                  Selecting your blood group below will save it to your MediQ Profile & register you in the Voluntary Donor Registry.
                </p>
              </div>
            </div>
          )}

          {/* Blood Group Selection */}
          <div>
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Select Your Blood Group
            </Label>
            <div className="grid grid-cols-4 gap-2">
              {ALL_BLOOD_GROUPS.map((bg) => {
                const isSelected = selectedGroup === bg;
                return (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedGroup(bg)}
                    className={`relative p-2.5 rounded-2xl border-2 font-extrabold text-xs transition-all flex flex-col items-center justify-center gap-1 ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-sm scale-[1.02]"
                        : "border-border bg-muted/20 text-foreground hover:border-red-500/40"
                    }`}
                  >
                    <Droplet className={`h-3.5 w-3.5 ${isSelected ? "text-red-500 fill-current" : "text-muted-foreground"}`} />
                    <span>{bg}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label className="text-[11px] font-bold text-muted-foreground">Contact Phone Number</Label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="mt-1 h-9 rounded-xl text-xs"
              required
            />
          </div>

          {/* Eligibility Checkbox */}
          <div className="flex items-center gap-2.5 bg-muted/30 p-3 rounded-2xl border border-border">
            <input
              type="checkbox"
              id="eligibility-check"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 rounded accent-red-600 cursor-pointer"
            />
            <label htmlFor="eligibility-check" className="text-xs text-muted-foreground cursor-pointer leading-tight">
              I certify that I am in good health, meet blood donation criteria, and agree to be contacted for voluntary donations.
            </label>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl py-5 shadow-lg shadow-red-600/20 text-xs mt-2"
          >
            <Heart className="mr-2 h-4 w-4 fill-current" />
            {isSubmitting ? "Saving & Registering..." : `Save Blood Group (${selectedGroup}) & Register as Donor`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
