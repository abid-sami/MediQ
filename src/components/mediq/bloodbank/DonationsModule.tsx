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
  Plus,
  Clock,
  CheckCircle2,
  TestTube,
  Droplet,
  User,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { BloodDonation, BloodDonor, BloodGroupType } from "@/data/blood-bank-data";

interface DonationsModuleProps {
  donations: BloodDonation[];
  donors: BloodDonor[];
  onRecordDonation: (donation: BloodDonation) => void;
}

export function DonationsModule({
  donations,
  donors,
  onRecordDonation,
}: DonationsModuleProps) {
  const [selectedDonorId, setSelectedDonorId] = useState(donors[0]?.id || "");
  const [unitsDonated, setUnitsDonated] = useState(1);
  const targetDonor = donors.find((d) => d.id === selectedDonorId) || donors[0];

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDonor) return;

    const newDonation: BloodDonation = {
      id: `dnt-${Date.now()}`,
      donorId: targetDonor.id,
      donorName: targetDonor.name,
      bloodGroup: targetDonor.bloodGroup,
      unitsDonated,
      donationDate: new Date().toISOString().split("T")[0],
      labStatus: "Testing",
    };

    onRecordDonation(newDonation);
    toast.success(`Logged Donation from ${targetDonor.name}`, {
      description: `Group ${targetDonor.bloodGroup} | Units: ${unitsDonated} | Lab Testing Initiated`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <TestTube className="h-6 w-6 text-teal" /> Blood Donation Logging & Lab Testing
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log voluntary blood donation drives, collect units, and track lab screening clearance.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleRecordSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
              <Plus className="h-4 w-4 text-primary" /> Record New Donation Drive
            </h3>

            <div>
              <Label className="text-xs font-bold text-muted-foreground uppercase">Select Registered Donor</Label>
              <Select value={selectedDonorId} onValueChange={setSelectedDonorId}>
                <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                  <SelectValue placeholder="Select donor..." />
                </SelectTrigger>
                <SelectContent>
                  {donors.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.name} (Group {d.bloodGroup})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {targetDonor && (
              <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs space-y-1">
                <p>Blood Group: <strong className="text-red-500 font-bold">{targetDonor.bloodGroup}</strong></p>
                <p>Phone: {targetDonor.phone}</p>
                <p>Total Prior Donations: {targetDonor.totalDonations}</p>
              </div>
            )}

            <div>
              <Label className="text-xs font-bold text-muted-foreground">Units Donated</Label>
              <Input
                type="number"
                min="1"
                max="3"
                value={unitsDonated}
                onChange={(e) => setUnitsDonated(Number(e.target.value))}
                className="mt-1 rounded-xl text-xs font-bold"
              />
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <Plus className="mr-1.5 h-4 w-4" /> Save & Send Unit to Lab Testing
            </Button>
          </form>
        </div>

        {/* Donations Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-border font-bold text-sm flex items-center justify-between">
              <span>Shift Blood Donations Log</span>
              <Badge variant="outline" className="text-xs font-bold">{donations.length} Drives Logged</Badge>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-muted/50 border-b border-border text-muted-foreground font-bold uppercase">
                  <th className="p-3.5">Donor Name</th>
                  <th className="p-3.5">Group</th>
                  <th className="p-3.5">Units</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Lab Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {donations.map((dnt) => (
                  <tr key={dnt.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3.5 font-bold text-foreground">{dnt.donorName}</td>
                    <td className="p-3.5">
                      <Badge className="bg-red-500 text-white font-bold text-xs">{dnt.bloodGroup}</Badge>
                    </td>
                    <td className="p-3.5 font-bold text-foreground">{dnt.unitsDonated} Unit(s)</td>
                    <td className="p-3.5 font-mono text-muted-foreground">{dnt.donationDate}</td>
                    <td className="p-3.5">
                      <Badge
                        className={
                          dnt.labStatus === "Stored"
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold"
                            : dnt.labStatus === "Approved"
                            ? "bg-teal/20 text-teal font-bold"
                            : "bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold"
                        }
                      >
                        {dnt.labStatus}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
