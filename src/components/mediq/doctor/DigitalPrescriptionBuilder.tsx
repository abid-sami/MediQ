import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pill,
  Plus,
  Trash2,
  Save,
  Eye,
  Send,
  FileText,
  CheckCircle,
  Printer,
  QrCode,
  Sparkles,
  User,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import {
  Patient,
  DoctorProfile,
  MedicineItem,
  DigitalPrescription,
} from "@/data/doctor-data";

interface DigitalPrescriptionBuilderProps {
  doctor: DoctorProfile;
  patients: Patient[];
  activePatient?: Patient | null;
  onSavePrescription: (prescription: DigitalPrescription) => void;
}

const COMMON_MEDICINES = [
  { name: "Tab. Telmisartan", strength: "40mg", dosage: "1-0-0", freq: "Once daily morning" },
  { name: "Tab. Concor (Bisoprolol)", strength: "2.5mg", dosage: "0-0-1", freq: "Once daily night" },
  { name: "Tab. Ecosprin (Aspirin)", strength: "75mg", dosage: "0-1-0", freq: "Once daily after meal" },
  { name: "Tab. Atorvastatin (Lipiget)", strength: "20mg", dosage: "0-0-1", freq: "Once daily bedtime" },
  { name: "Tab. Metformin HCl", strength: "850mg", dosage: "1-0-1", freq: "Twice daily after meals" },
  { name: "Cap. Omeprazole", strength: "20mg", dosage: "1-0-0", freq: "Before breakfast" },
];

export function DigitalPrescriptionBuilder({
  doctor,
  patients,
  activePatient,
  onSavePrescription,
}: DigitalPrescriptionBuilderProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    activePatient ? activePatient.id : patients[0]?.id || ""
  );
  const selectedPatient =
    patients.find((p) => p.id === selectedPatientId) || activePatient || patients[0];

  const [diagnosis, setDiagnosis] = useState(
    "Essential Hypertension with mild angina symptoms"
  );
  const [advice, setAdvice] = useState(
    "Strict low sodium diet (<2g/day). Daily 30 mins light morning walk. Avoid heavy mental stress and coffee."
  );
  const [followUpDate, setFollowUpDate] = useState("2026-08-28");

  const [medicines, setMedicines] = useState<MedicineItem[]>([
    {
      id: "med-1",
      name: "Tab. Telmisartan",
      strength: "40mg",
      dosage: "1-0-0",
      frequency: "Once daily in morning",
      duration: "30 Days",
      instructions: "Take with warm water after breakfast",
    },
    {
      id: "med-2",
      name: "Tab. Atorvastatin (Lipiget)",
      strength: "20mg",
      dosage: "0-0-1",
      frequency: "Once daily at bedtime",
      duration: "30 Days",
      instructions: "Strict low fat meal",
    },
  ]);

  const [previewOpen, setPreviewOpen] = useState(false);

  const addMedicineRow = () => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: "",
        strength: "",
        dosage: "1-0-1",
        frequency: "Twice daily",
        duration: "7 Days",
        instructions: "Take after meals",
      },
    ]);
  };

  const removeMedicineRow = (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
  };

  const updateMedicineField = (
    id: string,
    field: keyof MedicineItem,
    value: string
  ) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const handleQuickAdd = (med: (typeof COMMON_MEDICINES)[0]) => {
    setMedicines((prev) => [
      ...prev,
      {
        id: `med-${Date.now()}`,
        name: med.name,
        strength: med.strength,
        dosage: med.dosage,
        frequency: med.freq,
        duration: "14 Days",
        instructions: "Take after meals",
      },
    ]);
    toast.success(`Added ${med.name} to prescription`);
  };

  const buildPrescriptionObject = (status: "Draft" | "Saved" | "Sent to Patient"): DigitalPrescription => ({
    id: `rx-${Date.now()}`,
    prescriptionNo: `RX-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    patientId: selectedPatient ? selectedPatient.id : "pat-000",
    patientName: selectedPatient ? selectedPatient.name : "Patient",
    patientAge: selectedPatient ? selectedPatient.age : 30,
    patientGender: selectedPatient ? selectedPatient.gender : "Male",
    patientBloodGroup: selectedPatient ? selectedPatient.bloodGroup : "O+",
    date: new Date().toISOString().split("T")[0],
    diagnosis,
    medicines,
    advice,
    followUpDate,
    doctorName: doctor.name,
    doctorSpecialization: doctor.specialization,
    status,
  });

  const handleSave = () => {
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine before saving");
      return;
    }
    const rx = buildPrescriptionObject("Saved");
    onSavePrescription(rx);
    toast.success("Digital Prescription Saved Successfully", {
      description: `Prescription #${rx.prescriptionNo} created for ${rx.patientName}`,
    });
  };

  const handleSendToPatient = () => {
    if (medicines.length === 0) {
      toast.error("Please add at least one medicine before sending");
      return;
    }
    const rx = buildPrescriptionObject("Sent to Patient");
    onSavePrescription(rx);
    toast.success("Prescription Sent to Patient App & SMS", {
      description: `Sent to ${selectedPatient?.name} (${selectedPatient?.contact})`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Pill className="h-6 w-6 text-primary" /> Create Digital Prescription
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formulate official e-prescriptions with verified drug dosages, advice, and printable letterheads.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            className="rounded-xl text-xs font-semibold"
            onClick={() => setPreviewOpen(true)}
          >
            <Eye className="mr-1.5 h-3.5 w-3.5 text-teal" /> Preview
          </Button>
          <Button
            variant="secondary"
            className="rounded-xl text-xs font-semibold"
            onClick={handleSave}
          >
            <Save className="mr-1.5 h-3.5 w-3.5 text-primary" /> Save Prescription
          </Button>
          <Button
            onClick={handleSendToPatient}
            className="gradient-primary text-primary-foreground rounded-xl text-xs font-bold shadow-md hover:opacity-95"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Send to Patient
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Prescription Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient & Clinical Summary Box */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Patient
                </Label>
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="mt-1.5 rounded-xl">
                    <SelectValue placeholder="Select patient..." />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name} ({p.gender}, {p.age}y - Blood: {p.bloodGroup})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Follow-up Date
                </Label>
                <Input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="mt-1.5 rounded-xl"
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Clinical Diagnosis
              </Label>
              <Input
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Essential Hypertension, Ischemic Heart Disease"
                className="mt-1.5 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Medicines Builder */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Stethoscope className="h-4 w-4 text-primary" /> Prescribed Medications ({medicines.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Specify medicine name, strength, dosage, frequency, and duration.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={addMedicineRow}
                className="rounded-xl text-xs font-semibold"
              >
                <Plus className="mr-1 h-3.5 w-3.5 text-primary" /> Add Medicine
              </Button>
            </div>

            <div className="space-y-3">
              {medicines.map((m, idx) => (
                <div
                  key={m.id}
                  className="p-4 rounded-xl border border-border bg-muted/20 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] font-bold">
                      Medicine #{idx + 1}
                    </Badge>
                    {medicines.length > 1 && (
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10 rounded-lg"
                        onClick={() => removeMedicineRow(m.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Medicine Name
                      </Label>
                      <Input
                        value={m.name}
                        onChange={(e) => updateMedicineField(m.id, "name", e.target.value)}
                        placeholder="e.g. Tab. Telmisartan"
                        className="mt-1 h-9 text-xs rounded-lg font-semibold"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Strength
                      </Label>
                      <Input
                        value={m.strength}
                        onChange={(e) => updateMedicineField(m.id, "strength", e.target.value)}
                        placeholder="e.g. 40mg"
                        className="mt-1 h-9 text-xs rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Dosage
                      </Label>
                      <Input
                        value={m.dosage}
                        onChange={(e) => updateMedicineField(m.id, "dosage", e.target.value)}
                        placeholder="e.g. 1-0-1"
                        className="mt-1 h-9 text-xs rounded-lg font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Frequency
                      </Label>
                      <Input
                        value={m.frequency}
                        onChange={(e) => updateMedicineField(m.id, "frequency", e.target.value)}
                        placeholder="e.g. Once daily after breakfast"
                        className="mt-1 h-9 text-xs rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Duration
                      </Label>
                      <Input
                        value={m.duration}
                        onChange={(e) => updateMedicineField(m.id, "duration", e.target.value)}
                        placeholder="e.g. 30 Days"
                        className="mt-1 h-9 text-xs rounded-lg"
                      />
                    </div>

                    <div>
                      <Label className="text-[11px] font-semibold text-muted-foreground">
                        Instructions
                      </Label>
                      <Input
                        value={m.instructions}
                        onChange={(e) => updateMedicineField(m.id, "instructions", e.target.value)}
                        placeholder="e.g. Take with warm water"
                        className="mt-1 h-9 text-xs rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Advice & Lifestyle Guidelines */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Doctor Advice & Lifestyle Instructions
            </Label>
            <Textarea
              rows={3}
              value={advice}
              onChange={(e) => setAdvice(e.target.value)}
              placeholder="e.g. Low salt diet, avoid strenuous exercise, return immediately if chest pain worsens."
              className="rounded-xl text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Right 1 Column: Quick Drug Shortcuts & Summary */}
        <div className="space-y-6">
          {/* Quick Common Medications Panel */}
          <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-teal" /> Frequent Cardiac Prescriptions
            </h3>
            <p className="text-xs text-muted-foreground">
              Click to instantly insert common standard drug regimens into active prescription.
            </p>

            <div className="space-y-2">
              {COMMON_MEDICINES.map((med, i) => (
                <div
                  key={i}
                  onClick={() => handleQuickAdd(med)}
                  className="p-2.5 rounded-xl border border-border/80 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs font-bold text-foreground">{med.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {med.strength} — {med.dosage} ({med.freq})
                    </p>
                  </div>
                  <Plus className="h-4 w-4 text-primary shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Doctor Signature & Hospital Info Box */}
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className="h-12 w-12 rounded-full object-cover border-2 border-primary"
              />
              <div>
                <h4 className="text-sm font-bold">{doctor.name}</h4>
                <p className="text-xs text-muted-foreground">{doctor.qualification}</p>
              </div>
            </div>
            <Separator className="bg-primary/10" />
            <p className="text-[11px] text-muted-foreground leading-normal">
              Digital Prescriptions generated through MediQ are cryptographically signed and linked directly to the MediQ Pharmacy & Patient Portal ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Official Prescription Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 gap-0 border-border bg-white text-slate-900 rounded-2xl">
          {/* Printable Letterhead */}
          <div className="p-8 space-y-6">
            {/* Hospital & Doctor Header */}
            <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-7 w-7 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-sm">
                    Q
                  </span>
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                    MediQ Central Hospital
                  </h1>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Cardiology & Vascular Center of Excellence | {doctor.hospital}
                </p>
                <p className="text-[11px] text-slate-500">Phone: {doctor.phone} | Room: {doctor.roomNo}</p>
              </div>

              <div className="text-right">
                <h2 className="text-base font-bold text-teal-700">{doctor.name}</h2>
                <p className="text-xs font-semibold text-slate-700">{doctor.specialization}</p>
                <p className="text-[11px] text-slate-500">{doctor.qualification}</p>
              </div>
            </div>

            {/* Patient Meta Strip */}
            <div className="bg-slate-100 p-3 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs border border-slate-200">
              <div>
                <span className="text-slate-500 block text-[10px]">PATIENT NAME</span>
                <span className="font-bold text-slate-900">{selectedPatient?.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">AGE / GENDER</span>
                <span className="font-semibold">{selectedPatient?.age} yrs / {selectedPatient?.gender}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">BLOOD GROUP</span>
                <span className="font-semibold text-red-600">{selectedPatient?.bloodGroup}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DATE</span>
                <span className="font-semibold">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="text-xs">
              <span className="font-bold text-slate-700 uppercase tracking-wider">Clinical Diagnosis:</span>
              <p className="font-semibold text-slate-900 text-sm mt-0.5">{diagnosis}</p>
            </div>

            {/* Prescription Symbol Rx */}
            <div className="pt-2">
              <span className="text-3xl font-bold font-serif text-teal-700">Rx</span>

              {/* Medicines Table */}
              <div className="mt-3 border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 font-bold">
                      <th className="p-2.5">Medicine & Strength</th>
                      <th className="p-2.5">Dosage</th>
                      <th className="p-2.5">Frequency</th>
                      <th className="p-2.5">Duration</th>
                      <th className="p-2.5">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {medicines.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900">
                          {m.name} <span className="text-slate-500 font-normal">({m.strength})</span>
                        </td>
                        <td className="p-2.5 font-mono font-semibold">{m.dosage}</td>
                        <td className="p-2.5">{m.frequency}</td>
                        <td className="p-2.5 font-medium">{m.duration}</td>
                        <td className="p-2.5 text-slate-600">{m.instructions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Doctor Advice & Follow-up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">Doctor Advice:</span>
                <p className="text-amber-800 leading-relaxed">{advice}</p>
              </div>

              <div className="p-3 bg-teal-50 rounded-lg border border-teal-200 flex flex-col justify-between">
                <div>
                  <span className="font-bold text-teal-900 block mb-1">Next Follow-up Visit:</span>
                  <p className="text-teal-800 font-bold text-sm">{followUpDate}</p>
                </div>
                <p className="text-[10px] text-teal-600 mt-2">Please bring this prescription copy on your next visit.</p>
              </div>
            </div>

            {/* Signature & Verification Footer */}
            <div className="border-t border-slate-200 pt-6 flex items-end justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-300">
                  <QrCode className="h-12 w-12 text-slate-800" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-semibold text-slate-700">Digital Verification Code</p>
                  <p>MEDIQ-RX-AUTH-{Math.floor(100000 + Math.random() * 900000)}</p>
                  <p>Verified e-Signature on Record</p>
                </div>
              </div>

              <div className="text-center">
                <div className="h-10 w-32 border-b border-slate-400 mb-1 flex items-center justify-center italic text-sm font-serif text-teal-800">
                  {doctor.name || "Signature pending"}
                </div>
                <p className="text-xs font-bold text-slate-900">{doctor.name}</p>
                <p className="text-[10px] text-slate-500">Authorized Medical Practitioner</p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-slate-800 font-semibold"
            >
              <Printer className="mr-1.5 h-4 w-4" /> Print Prescription
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setPreviewOpen(false);
                handleSendToPatient();
              }}
              className="bg-teal-700 hover:bg-teal-800 text-white font-bold"
            >
              <Send className="mr-1.5 h-4 w-4" /> Send to Patient Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
