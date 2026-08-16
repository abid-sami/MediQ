import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Bed, Plus, Settings2 } from "lucide-react";
import { toast } from "sonner";
import {
  fetchSupabaseBeds,
  fetchSupabaseHospitals,
  createSupabaseBedsBulk,
  updateSupabaseHospital,
} from "@/services/supabase-service";

const WARD_TYPES = ["General", "ICU", "CCU", "HDU", "Emergency", "Cabin", "Pediatric"];

export function BedsAndWardsMonitoringModule() {
  const [wardBreakdown, setWardBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Ward / Beds form
  const [wardType, setWardType] = useState("General");
  const [bedCount, setBedCount] = useState("10");
  const [floorNumber, setFloorNumber] = useState("1");
  const [dailyRate, setDailyRate] = useState("50");
  const [submitting, setSubmitting] = useState(false);

  // Infrastructure settings (hospital-level, admin controlled)
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [supportHours, setSupportHours] = useState("24/7");
  const [savingSettings, setSavingSettings] = useState(false);

  const loadBeds = async () => {
    setLoading(true);
    const beds = await fetchSupabaseBeds();
    const wardMap: Record<string, { total: number; occupied: number; available: number; cleaning: number; maintenance: number }> = {};
    beds.forEach((b: any) => {
      const ward = b.wardType || "General";
      if (!wardMap[ward]) {
        wardMap[ward] = { total: 0, occupied: 0, available: 0, cleaning: 0, maintenance: 0 };
      }
      wardMap[ward].total++;
      const status = (b.status || "").toLowerCase();
      if (status === "occupied") wardMap[ward].occupied++;
      else if (status === "cleaning") wardMap[ward].cleaning++;
      else if (status === "maintenance") wardMap[ward].maintenance++;
      else wardMap[ward].available++;
    });

    setWardBreakdown(Object.entries(wardMap).map(([category, stats]) => ({ category, ...stats })));
    setLoading(false);
  };

  const loadHospitalSettings = async () => {
    const hospitals = await fetchSupabaseHospitals();
    if (hospitals.length > 0) {
      setHospitalId(hospitals[0].id);
      setSupportHours(hospitals[0].supportHours || "24/7");
    }
  };

  useEffect(() => {
    loadBeds();
    loadHospitalSettings();
  }, []);

  const handleAddWard = async (e: React.FormEvent) => {
    e.preventDefault();
    const count = Number(bedCount);
    if (!wardType || !count || count < 1) {
      toast.error("Enter a ward type and a bed count of at least 1.");
      return;
    }
    setSubmitting(true);
    const { error } = await createSupabaseBedsBulk({
      wardType,
      count,
      floorNumber: Number(floorNumber) || 1,
      dailyRate: Number(dailyRate) || 0,
    });
    setSubmitting(false);

    if (error) {
      console.error("createSupabaseBedsBulk failed:", error);
      toast.error(error.message || "Couldn't add beds. Please try again.");
      return;
    }
    toast.success(`Added ${count} bed(s) to ${wardType}`);
    setBedCount("10");
    loadBeds();
  };

  const handleSaveSettings = async () => {
    if (!hospitalId) {
      toast.error("No hospital record found yet — add a network hospital first.");
      return;
    }
    setSavingSettings(true);
    const { error } = await updateSupabaseHospital(hospitalId, { support_hours: supportHours });
    setSavingSettings(false);
    if (error) {
      console.error("updateSupabaseHospital failed:", error);
      toast.error(error.message || "Couldn't save settings.");
      return;
    }
    toast.success("Infrastructure settings updated");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Live Hospital Bed & Ward Capacity Command
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time occupancy metrics, ward management, and infrastructure settings shown on the
            public home page.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Ward / Beds form */}
        <form
          onSubmit={handleAddWard}
          className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs h-fit"
        >
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
            <Plus className="h-4 w-4 text-primary" /> Add Ward / Beds
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Ward Type</Label>
              <Select value={wardType} onValueChange={setWardType}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Ward Type" />
                </SelectTrigger>
                <SelectContent>
                  {WARD_TYPES.map((w) => (
                    <SelectItem key={w} value={w}>
                      {w}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Number of Beds</Label>
                <Input
                  type="number"
                  min="1"
                  value={bedCount}
                  onChange={(e) => setBedCount(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold"
                />
              </div>
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Floor</Label>
                <Input
                  type="number"
                  min="1"
                  value={floorNumber}
                  onChange={(e) => setFloorNumber(e.target.value)}
                  className="mt-1 rounded-xl text-xs font-bold"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Daily Rate ($)</Label>
              <Input
                type="number"
                min="0"
                value={dailyRate}
                onChange={(e) => setDailyRate(e.target.value)}
                className="mt-1 rounded-xl text-xs font-bold"
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md"
          >
            {submitting ? "Adding..." : "Add to Ward Capacity"}
          </Button>
        </form>

        {/* Ward Cards */}
        <div className="lg:col-span-2 space-y-4">
          {!loading && wardBreakdown.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">
              No wards yet. Use the form to add your first ward and beds.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {wardBreakdown.map((ward, idx) => {
                const occPercent = ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-foreground">{ward.category}</h3>
                      <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                        {occPercent}% Occupied
                      </Badge>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          occPercent > 80 ? "bg-red-500" : "gradient-primary"
                        }`}
                        style={{ width: `${occPercent}%` }}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg block">
                          {ward.available}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Available</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/30 border border-border">
                        <span className="font-extrabold text-foreground text-lg block">{ward.occupied}</span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Occupied</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 text-lg block">
                          {ward.cleaning}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold">Cleaning</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Infrastructure Settings */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
        <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
          <Settings2 className="h-4 w-4 text-primary" /> Infrastructure Settings
        </h3>
        <p className="text-xs text-muted-foreground -mt-2">
          Ward, bed, staffing, and diagnostics figures on the public home page are calculated live
          from real records. Emergency support hours is the one figure you set directly.
        </p>
        <div className="flex flex-col sm:flex-row items-end gap-3 max-w-sm">
          <div className="flex-1 w-full">
            <Label className="text-xs font-bold text-muted-foreground">Emergency Support Hours</Label>
            <Input
              value={supportHours}
              onChange={(e) => setSupportHours(e.target.value)}
              placeholder="e.g. 24/7"
              className="mt-1 rounded-xl text-xs font-bold"
            />
          </div>
          <Button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="rounded-xl font-bold text-xs shrink-0"
          >
            {savingSettings ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </div>
  );
}
