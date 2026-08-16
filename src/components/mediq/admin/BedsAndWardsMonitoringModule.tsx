import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bed, Check, Pencil, Plus, Save, Settings2, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import {
  createSupabaseBedsBulk,
  deleteSupabaseBed,
  fetchSupabaseBeds,
  fetchSupabaseHospitals,
  updateSupabaseBed,
  updateSupabaseBedStatus,
  updateSupabaseHospital,
  updateSupabaseWard,
} from "@/services/supabase-service";

const WARD_TYPES = ["General", "ICU", "CCU", "HDU", "Emergency", "Cabin", "Pediatric"];
const BED_STATUSES = ["Available", "Occupied", "Cleaning", "Maintenance"];

type BedRecord = {
  id: string;
  bedNumber: string;
  wardType: string;
  floorNumber: number;
  dailyRate: number;
  status: string;
  admittedPatientName?: string | null;
};

type WardStats = {
  category: string;
  total: number;
  occupied: number;
  available: number;
  cleaning: number;
  maintenance: number;
  beds: BedRecord[];
};

export function BedsAndWardsMonitoringModule() {
  const [beds, setBeds] = useState<BedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyBedId, setBusyBedId] = useState<string | null>(null);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [supportHours, setSupportHours] = useState("24/7");
  const [savingSettings, setSavingSettings] = useState(false);

  const [wardType, setWardType] = useState("General");
  const [bedCount, setBedCount] = useState("10");
  const [floorNumber, setFloorNumber] = useState("1");
  const [dailyRate, setDailyRate] = useState("50");

  const [editingWard, setEditingWard] = useState<string | null>(null);
  const [wardEditType, setWardEditType] = useState("General");
  const [wardEditFloor, setWardEditFloor] = useState("1");
  const [wardEditRate, setWardEditRate] = useState("0");
  const [editingBed, setEditingBed] = useState<BedRecord | null>(null);

  const wardBreakdown = useMemo<WardStats[]>(() => {
    const wardMap = new Map<string, WardStats>();
    beds.forEach((bed) => {
      const category = bed.wardType || "General";
      if (!wardMap.has(category)) {
        wardMap.set(category, { category, total: 0, occupied: 0, available: 0, cleaning: 0, maintenance: 0, beds: [] });
      }
      const ward = wardMap.get(category)!;
      ward.total += 1;
      ward.beds.push(bed);
      const status = (bed.status || "Available").toLowerCase();
      if (status === "occupied") ward.occupied += 1;
      else if (status === "cleaning") ward.cleaning += 1;
      else if (status === "maintenance") ward.maintenance += 1;
      else ward.available += 1;
    });
    return Array.from(wardMap.values()).sort((a, b) => a.category.localeCompare(b.category));
  }, [beds]);

  const loadBeds = async () => {
    setLoading(true);
    const result = await fetchSupabaseBeds();
    setBeds(result as BedRecord[]);
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
    void Promise.all([loadBeds(), loadHospitalSettings()]);
  }, []);

  const handleAddWard = async (event: React.FormEvent) => {
    event.preventDefault();
    const count = Number(bedCount);
    if (!wardType || !Number.isInteger(count) || count < 1) {
      toast.error("Enter a ward type and a bed count of at least 1.");
      return;
    }
    setSubmitting(true);
    const { error } = await createSupabaseBedsBulk({
      wardType,
      count,
      floorNumber: Number(floorNumber) || 1,
      dailyRate: Number(dailyRate) || 0,
      hospitalId: hospitalId || undefined,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not add beds.");
      return;
    }
    toast.success(`Added ${count} bed(s) to ${wardType}.`);
    await loadBeds();
  };

  const startWardEdit = (ward: WardStats) => {
    const firstBed = ward.beds[0];
    setEditingWard(ward.category);
    setWardEditType(ward.category);
    setWardEditFloor(String(firstBed?.floorNumber || 1));
    setWardEditRate(String(firstBed?.dailyRate || 0));
    setEditingBed(null);
  };

  const saveWardEdit = async (currentWard: string) => {
    if (!wardEditType.trim()) {
      toast.error("Ward name is required.");
      return;
    }
    setSubmitting(true);
    const { error } = await updateSupabaseWard(currentWard, {
      wardType: wardEditType.trim(),
      floorNumber: Number(wardEditFloor) || 1,
      dailyRate: Number(wardEditRate) || 0,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message || "Could not update ward.");
      return;
    }
    setEditingWard(null);
    toast.success("Ward updated.");
    await loadBeds();
  };

  const saveBedEdit = async () => {
    if (!editingBed?.bedNumber.trim() || !editingBed.wardType.trim()) {
      toast.error("Bed number and ward are required.");
      return;
    }
    setBusyBedId(editingBed.id);
    const { error } = await updateSupabaseBed(editingBed.id, {
      bedNumber: editingBed.bedNumber.trim(),
      wardType: editingBed.wardType.trim(),
      floorNumber: Number(editingBed.floorNumber) || 1,
      dailyRate: Number(editingBed.dailyRate) || 0,
    });
    setBusyBedId(null);
    if (error) {
      toast.error(error.message || "Could not update bed.");
      return;
    }
    setEditingBed(null);
    toast.success("Bed updated.");
    await loadBeds();
  };

  const changeBedStatus = async (bed: BedRecord, status: string, patientName = bed.admittedPatientName || "") => {
    if (status === "Occupied" && !patientName.trim()) {
      toast.error("Enter the admitted patient name before marking the bed occupied.");
      return;
    }
    setBusyBedId(bed.id);
    const { error } = await updateSupabaseBedStatus(bed.id, status, patientName);
    setBusyBedId(null);
    if (error) {
      toast.error(error.message || "Could not update bed status.");
      return;
    }
    toast.success(`${bed.bedNumber} is now ${status}.`);
    await loadBeds();
  };

  const removeBed = async (bed: BedRecord) => {
    if (!window.confirm(`Delete bed ${bed.bedNumber}? This cannot be undone.`)) return;
    setBusyBedId(bed.id);
    const { error } = await deleteSupabaseBed(bed.id);
    setBusyBedId(null);
    if (error) {
      toast.error(error.message || "Could not delete bed.");
      return;
    }
    toast.success(`Deleted ${bed.bedNumber}.`);
    await loadBeds();
  };

  const handleSaveSettings = async () => {
    if (!hospitalId) {
      toast.error("No hospital record found yet.");
      return;
    }
    setSavingSettings(true);
    const { error } = await updateSupabaseHospital(hospitalId, { support_hours: supportHours });
    setSavingSettings(false);
    if (error) {
      toast.error(error.message || "Could not save settings.");
      return;
    }
    toast.success("Infrastructure settings updated.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Bed className="h-6 w-6 text-primary" /> Live Hospital Bed & Ward Capacity Command
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">Add, edit, occupy, release, maintain, and delete live bed records from Supabase.</p>
        </div>
        <Button variant="outline" onClick={() => void loadBeds()} disabled={loading} className="rounded-xl font-bold text-xs">
          {loading ? "Refreshing..." : "Refresh data"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={handleAddWard} className="lg:col-span-1 bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs h-fit">
          <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3"><Plus className="h-4 w-4 text-primary" /> Add Ward / Beds</h3>
          <div className="space-y-3 text-xs">
            <div>
              <Label className="text-xs font-bold text-muted-foreground">Ward Type</Label>
              <Select value={wardType} onValueChange={setWardType}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold"><SelectValue placeholder="Ward Type" /></SelectTrigger>
                <SelectContent>{WARD_TYPES.map((ward) => <SelectItem key={ward} value={ward}>{ward}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label className="text-xs font-bold text-muted-foreground">Number of Beds</Label><Input type="number" min="1" value={bedCount} onChange={(e) => setBedCount(e.target.value)} className="mt-1 rounded-xl text-xs font-bold" /></div>
              <div><Label className="text-xs font-bold text-muted-foreground">Floor</Label><Input type="number" min="1" value={floorNumber} onChange={(e) => setFloorNumber(e.target.value)} className="mt-1 rounded-xl text-xs font-bold" /></div>
            </div>
            <div><Label className="text-xs font-bold text-muted-foreground">Daily Rate</Label><Input type="number" min="0" value={dailyRate} onChange={(e) => setDailyRate(e.target.value)} className="mt-1 rounded-xl text-xs font-bold" /></div>
          </div>
          <Button type="submit" disabled={submitting} className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">{submitting ? "Adding..." : "Add to Ward Capacity"}</Button>
        </form>

        <div className="lg:col-span-2 space-y-4">
          {!loading && wardBreakdown.length === 0 ? (
            <div className="bg-card border border-border rounded-2xl p-8 text-center text-muted-foreground text-sm">No wards yet. Use the form to add your first ward and beds.</div>
          ) : (
            wardBreakdown.map((ward) => {
              const occPercent = ward.total > 0 ? Math.round((ward.occupied / ward.total) * 100) : 0;
              const isEditing = editingWard === ward.category;
              return (
                <div key={ward.category} className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div><h3 className="font-bold text-base text-foreground">{ward.category}</h3><p className="text-[11px] text-muted-foreground">{ward.total} beds · {ward.maintenance} maintenance</p></div>
                    <div className="flex items-center gap-2"><Badge variant="outline" className="font-mono text-xs font-bold text-primary">{occPercent}% Occupied</Badge><Button size="sm" variant="outline" onClick={() => startWardEdit(ward)} className="rounded-lg text-xs"><Pencil className="h-3 w-3 mr-1" /> Edit ward</Button></div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden"><div className={`h-full rounded-full transition-all ${occPercent > 80 ? "bg-red-500" : "gradient-primary"}`} style={{ width: `${occPercent}%` }} /></div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs"><div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"><span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-lg block">{ward.available}</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Available</span></div><div className="p-2.5 rounded-xl bg-muted/30 border border-border"><span className="font-extrabold text-foreground text-lg block">{ward.occupied}</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Occupied</span></div><div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20"><span className="font-extrabold text-amber-600 dark:text-amber-400 text-lg block">{ward.cleaning}</span><span className="text-[10px] text-muted-foreground uppercase font-bold">Cleaning</span></div></div>

                  {isEditing && <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-muted/30 border border-border"><div><Label className="text-[10px] font-bold">Ward name</Label><Input value={wardEditType} onChange={(e) => setWardEditType(e.target.value)} className="mt-1 rounded-lg text-xs" /></div><div><Label className="text-[10px] font-bold">Floor</Label><Input type="number" min="1" value={wardEditFloor} onChange={(e) => setWardEditFloor(e.target.value)} className="mt-1 rounded-lg text-xs" /></div><div><Label className="text-[10px] font-bold">Daily rate</Label><Input type="number" min="0" value={wardEditRate} onChange={(e) => setWardEditRate(e.target.value)} className="mt-1 rounded-lg text-xs" /></div><div className="sm:col-span-3 flex gap-2"><Button size="sm" onClick={() => void saveWardEdit(ward.category)} disabled={submitting} className="rounded-lg text-xs"><Check className="h-3 w-3 mr-1" /> Save ward</Button><Button size="sm" variant="ghost" onClick={() => setEditingWard(null)} className="rounded-lg text-xs"><X className="h-3 w-3 mr-1" /> Cancel</Button></div></div>}

                  <div className="space-y-2">
                    {ward.beds.map((bed) => {
                      const editing = editingBed?.id === bed.id;
                      return <div key={bed.id} className="rounded-xl border border-border p-3 space-y-2">
                        {editing ? <div className="grid grid-cols-1 sm:grid-cols-4 gap-2"><Input value={editingBed.bedNumber} onChange={(e) => setEditingBed({ ...editingBed, bedNumber: e.target.value })} placeholder="Bed number" className="rounded-lg text-xs" /><Input value={editingBed.wardType} onChange={(e) => setEditingBed({ ...editingBed, wardType: e.target.value })} placeholder="Ward" className="rounded-lg text-xs" /><Input type="number" min="1" value={editingBed.floorNumber} onChange={(e) => setEditingBed({ ...editingBed, floorNumber: Number(e.target.value) })} placeholder="Floor" className="rounded-lg text-xs" /><Input type="number" min="0" value={editingBed.dailyRate} onChange={(e) => setEditingBed({ ...editingBed, dailyRate: Number(e.target.value) })} placeholder="Rate" className="rounded-lg text-xs" /><div className="sm:col-span-4 flex gap-2"><Button size="sm" onClick={() => void saveBedEdit()} disabled={busyBedId === bed.id} className="rounded-lg text-xs"><Save className="h-3 w-3 mr-1" /> Save bed</Button><Button size="sm" variant="ghost" onClick={() => setEditingBed(null)} className="rounded-lg text-xs">Cancel</Button></div></div> : <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="text-xs font-bold">{bed.bedNumber}</p><p className="text-[10px] text-muted-foreground">Floor {bed.floorNumber} · Rate {bed.dailyRate}</p>{bed.status === "Occupied" && <p className="text-[10px] text-red-600 font-semibold">Patient: {bed.admittedPatientName || "Unnamed patient"}</p>}</div><div className="flex flex-wrap items-center gap-2"><select value={bed.status} disabled={busyBedId === bed.id} onChange={(e) => { const next = e.target.value; const patient = next === "Occupied" ? window.prompt("Admitted patient name", bed.admittedPatientName || "") || "" : ""; void changeBedStatus(bed, next, patient); }} className="h-8 rounded-lg border border-border bg-background px-2 text-xs font-semibold">{BED_STATUSES.map((status) => <option key={status}>{status}</option>)}</select><Button size="sm" variant="outline" onClick={() => { setEditingBed(bed); setEditingWard(null); }} className="rounded-lg text-xs"><Pencil className="h-3 w-3 mr-1" /> Edit</Button><Button size="sm" variant="ghost" onClick={() => void removeBed(bed)} disabled={busyBedId === bed.id} className="rounded-lg text-xs text-red-600 hover:text-red-700"><Trash2 className="h-3 w-3" /></Button></div></div>}
                      </div>;
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-5 shadow-xs space-y-4"><h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3"><Settings2 className="h-4 w-4 text-primary" /> Infrastructure Settings</h3><p className="text-xs text-muted-foreground -mt-2">Emergency support hours are stored on the live hospital record.</p><div className="flex flex-col sm:flex-row items-end gap-3 max-w-sm"><div className="flex-1 w-full"><Label className="text-xs font-bold text-muted-foreground">Emergency Support Hours</Label><Input value={supportHours} onChange={(e) => setSupportHours(e.target.value)} placeholder="e.g. 24/7" className="mt-1 rounded-xl text-xs font-bold" /></div><Button onClick={() => void handleSaveSettings()} disabled={savingSettings} className="rounded-xl font-bold text-xs shrink-0">{savingSettings ? "Saving..." : "Save"}</Button></div></div>
    </div>
  );
}
