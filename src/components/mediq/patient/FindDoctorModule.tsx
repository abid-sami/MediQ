import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Star,
  Building2,
  Clock,
  Calendar,
  Stethoscope,
  Filter,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { DoctorCard, PatientAppointment } from "@/data/patient-data";

interface FindDoctorModuleProps {
  doctors: DoctorCard[];
  onBookAppointment: (newApt: PatientAppointment) => void;
}

export function FindDoctorModule({
  doctors,
  onBookAppointment,
}: FindDoctorModuleProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [hospitalFilter, setHospitalFilter] = useState("All");

  // Booking Modal State
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorCard | null>(null);
  const [bookingDate, setBookingDate] = useState("2026-08-20");
  const [bookingTime, setBookingTime] = useState("10:00 AM");
  const [reason, setReason] = useState("Routine Health Check & Consultation");
  const [bookingOpen, setBookingOpen] = useState(false);

  const categories = ["All", "Cardiology", "Neurology", "Orthopedics", "Dermatology"];
  const hospitals = ["All", "MediQ Heart & Vascular Institute", "MediQ Central Neuroscience Unit", "MediQ Orthopedic Hospital", "MediQ Skin & Wellness Clinic"];

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || doc.category === categoryFilter;
    const matchesHosp = hospitalFilter === "All" || doc.hospital === hospitalFilter;
    return matchesSearch && matchesCat && matchesHosp;
  });

  const handleConfirmBooking = () => {
    if (!selectedDoctor) return;
    const newApt: PatientAppointment = {
      id: `apt-p-${Date.now()}`,
      appointmentId: `MQ-APT-${Math.floor(1000 + Math.random() * 9000)}`,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorAvatar: selectedDoctor.avatar,
      category: selectedDoctor.category,
      hospital: selectedDoctor.hospital,
      date: bookingDate,
      time: bookingTime,
      status: "Confirmed",
      reason,
      fee: selectedDoctor.consultationFee,
    };
    onBookAppointment(newApt);
    setBookingOpen(false);
    toast.success(`Appointment Booked with ${selectedDoctor.name}`, {
      description: `Appointment ID: ${newApt.appointmentId} for ${bookingDate} at ${bookingTime}`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card border border-border p-5 rounded-2xl shadow-xs">
        <div>
          <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <Stethoscope className="h-6 w-6 text-primary" /> Find Doctors & Specialists
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Search verified healthcare experts across MediQ network and book instant consultations.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-card border border-border p-4 rounded-2xl">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Doctor Name or Specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl"
          />
        </div>

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder="Category..." />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c === "All" ? "All Specialties" : c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={hospitalFilter} onValueChange={setHospitalFilter}>
          <SelectTrigger className="h-9 text-xs rounded-xl">
            <SelectValue placeholder="Hospital..." />
          </SelectTrigger>
          <SelectContent>
            {hospitals.map((h) => (
              <SelectItem key={h} value={h}>
                {h === "All" ? "All Hospitals" : h}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Doctor Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.map((doc) => (
          <div
            key={doc.id}
            className="bg-card border border-border rounded-2xl p-5 hover:border-primary/40 transition-all card-lift shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="flex items-start gap-4">
              <img
                src={doc.avatar}
                alt={doc.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-primary/20 shadow-xs"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] font-semibold text-primary">
                    {doc.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-muted-foreground font-normal">
                      ({doc.reviewsCount})
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-base text-foreground mt-1 truncate">{doc.name}</h3>
                <p className="text-xs text-muted-foreground font-medium">{doc.specialization}</p>

                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5 truncate">
                    <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    <span className="truncate">{doc.hospital}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-teal shrink-0" />
                    <span>{doc.availableTime} ({doc.availableDays.join(", ")})</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div>
                <span className="text-[10px] text-muted-foreground block">CONSULTATION FEE</span>
                <span className="text-base font-bold text-foreground">
                  ${doc.consultationFee}
                </span>
              </div>

              <Button
                onClick={() => {
                  setSelectedDoctor(doc);
                  setBookingOpen(true);
                }}
                className="gradient-primary text-primary-foreground font-bold text-xs rounded-xl shadow-xs"
              >
                <Calendar className="mr-1.5 h-3.5 w-3.5" /> Book Appointment
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
          <DialogContent className="max-w-md p-6 rounded-2xl bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" /> Book Appointment
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="h-12 w-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm">{selectedDoctor.name}</h4>
                  <p className="text-xs text-muted-foreground">{selectedDoctor.specialization}</p>
                  <p className="text-[11px] text-primary font-bold mt-0.5">
                    Fee: ${selectedDoctor.consultationFee}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Hospital / Facility</Label>
                <Input value={selectedDoctor.hospital} disabled className="mt-1 rounded-xl text-xs font-semibold" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Select Date</Label>
                  <Input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="mt-1 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <Label className="text-xs font-bold text-muted-foreground">Select Time Slot</Label>
                  <Select value={bookingTime} onValueChange={setBookingTime}>
                    <SelectTrigger className="mt-1 rounded-xl text-xs">
                      <SelectValue placeholder="Time slot" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                      <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                      <SelectItem value="11:30 AM">11:30 AM</SelectItem>
                      <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                      <SelectItem value="05:30 PM">05:30 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-bold text-muted-foreground">Reason for Visit</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Routine checkup, Follow-up consultation"
                  className="mt-1 rounded-xl text-xs"
                />
              </div>

              <Button
                onClick={handleConfirmBooking}
                className="w-full gradient-primary text-primary-foreground font-bold rounded-xl py-5 mt-2 shadow-md"
              >
                Confirm Appointment Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
