import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Search,
  Phone,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle2,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { RegisteredPatient } from "@/data/receptionist-data";

interface PatientRegistrationModuleProps {
  patients: RegisteredPatient[];
  onRegisterPatient: (patient: RegisteredPatient) => void;
}

export function PatientRegistrationModule({
  patients,
  onRegisterPatient,
}: PatientRegistrationModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Registration Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("1990-01-01");
  const [gender, setGender] = useState("Male");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [address, setAddress] = useState("");
  const [emergencyContact, setEmergencyContact] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    // Generate unique Patient ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newPatientId = `PAT-2026-${randomNum}`;

    const newPatient: RegisteredPatient = {
      id: `pat-${Date.now()}`,
      patientId: newPatientId,
      name,
      phone,
      dob,
      age: new Date().getFullYear() - new Date(dob).getFullYear(),
      gender,
      bloodGroup,
      address,
      emergencyContact,
      medicalNotes,
      registeredDate: new Date().toISOString().split("T")[0],
    };

    onRegisterPatient(newPatient);
    setName("");
    setPhone("");
    setAddress("");
    setEmergencyContact("");
    setMedicalNotes("");

    toast.success(`Registered Patient ${newPatient.name}`, {
      description: `Generated Unique Patient ID: ${newPatient.patientId}`,
    });
  };

  const filtered = patients.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" /> Fast Patient Registration & Lookup
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Register new hospital patients, generate unique Patient IDs, and perform multi-criteria searches.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-1 space-y-6">
          <form onSubmit={handleRegisterSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold flex items-center gap-2 border-b border-border pb-3">
              <UserPlus className="h-4 w-4 text-primary" /> Quick Patient Registration Form
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs font-bold text-muted-foreground">Full Patient Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g. Nusrat Jahan" className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="+1 (555)..." className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Date of Birth</Label>
                  <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="mt-1 rounded-xl text-xs font-semibold" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Gender</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="mt-1 rounded-xl text-xs font-bold">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Blood Group</Label>
                  <Select value={bloodGroup} onValueChange={setBloodGroup}>
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
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Home Address</Label>
                <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Full street address..." className="mt-1 rounded-xl text-xs" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Emergency Contact</Label>
                <Input value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="Name & Phone..." className="mt-1 rounded-xl text-xs" />
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Basic Medical Information / Allergies</Label>
                <Textarea rows={2} value={medicalNotes} onChange={(e) => setMedicalNotes(e.target.value)} placeholder="Known drug allergies, past surgeries..." className="mt-1 rounded-xl text-xs" />
              </div>
            </div>

            <Button type="submit" className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 shadow-md">
              <CheckCircle2 className="mr-1.5 h-4 w-4" /> Register & Generate Patient ID
            </Button>
          </form>
        </div>

        {/* Patient Search & Summary Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border p-4 rounded-xl flex items-center gap-3 shadow-xs">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patient by Patient ID (e.g. PAT-2026-9021), Name, or Phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((pat) => (
              <div
                key={pat.id}
                className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="font-mono text-xs font-bold text-primary">
                      {pat.patientId}
                    </Badge>
                    <Badge className="bg-red-500 text-white font-bold text-xs">
                      Blood {pat.bloodGroup}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-base text-foreground">{pat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pat.gender}, {pat.age} yrs | Phone: <strong className="text-foreground">{pat.phone}</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-primary shrink-0" /> <span className="truncate">{pat.address}</span>
                  </p>

                  {pat.medicalNotes && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium mt-2 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                      Notes: {pat.medicalNotes}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-border text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>Emergency: {pat.emergencyContact}</span>
                  <span className="font-mono">Reg: {pat.registeredDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
