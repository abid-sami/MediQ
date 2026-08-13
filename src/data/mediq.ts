/**
 * Static mock data for the MediQ prototype.
 * Shapes mirror the future backend contract so components stay data-driven.
 */

export type StatusLevel = "available" | "limited" | "full";

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Hospitals", href: "#hospitals" },
  { label: "Doctors", href: "#doctors" },
  { label: "Diagnostics", href: "#diagnostics" },
  { label: "Pharmacy", href: "#pharmacy" },
  { label: "Blood Bank", href: "#blood-bank" },
] as const;

export const quickServices = [
  {
    id: "hospitals",
    title: "Hospitals",
    description: "Find hospitals and healthcare facilities.",
    icon: "hospital",
    href: "#hospitals",
  },
  {
    id: "doctors",
    title: "Doctors",
    description: "Search doctors and specialists.",
    icon: "stethoscope",
    href: "#doctors",
  },
  {
    id: "diagnostics",
    title: "Diagnostics",
    description: "Explore diagnostic and laboratory services.",
    icon: "microscope",
    href: "#diagnostics",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    description: "Find medicines and healthcare products.",
    icon: "pill",
    href: "#pharmacy",
  },
  {
    id: "blood-bank",
    title: "Blood Bank",
    description: "Check live blood availability.",
    icon: "droplet",
    href: "#blood-bank",
  },
] as const;

export const infrastructureStats = [
  { id: "beds", value: 120, suffix: "+", label: "Beds", icon: "bed" },
  { id: "wards", value: 24, label: "Wards", icon: "layout" },
  { id: "diagnostics", value: 18, label: "Diagnostic Services", icon: "microscope" },
  { id: "emergency-beds", value: 32, label: "Emergency Beds", icon: "siren" },
  { id: "staff", value: 150, suffix: "+", label: "Healthcare Professionals", icon: "users" },
  { id: "support", value: 24, suffix: "/7", label: "Emergency Support", icon: "clock" },
] as const;

export type BedUnit = {
  id: string;
  name: string;
  available: number;
  total: number;
  status: StatusLevel;
};

export const bedAvailability: BedUnit[] = [
  { id: "general", name: "General Ward", available: 18, total: 60, status: "available" },
  { id: "icu", name: "ICU", available: 4, total: 16, status: "available" },
  { id: "ccu", name: "CCU", available: 2, total: 12, status: "limited" },
  { id: "cabin", name: "Private Cabin", available: 6, total: 20, status: "available" },
  { id: "emergency", name: "Emergency", available: 2, total: 12, status: "available" },
];

export const occupancyRate = 74;

export type Building = { id: string; name: string; floors: string[] };

export const buildings: Building[] = [
  { id: "a", name: "Building A — Main Tower", floors: ["Ground Floor", "1st Floor", "2nd Floor"] },
  { id: "b", name: "Building B — Care Wing", floors: ["Ground Floor", "1st Floor"] },
];

export type MapRoom = {
  id: string;
  name: string;
  department: string;
  beds: number;
  available: number;
  status: StatusLevel;
  nearby: string[];
  x: number;
  y: number;
  w: number;
  h: number;
};

export const wardMap: MapRoom[] = [
  {
    id: "icu",
    name: "ICU",
    department: "Critical Care",
    beds: 16,
    available: 4,
    status: "limited",
    nearby: ["Nurse Station", "Elevator"],
    x: 2,
    y: 2,
    w: 30,
    h: 34,
  },
  {
    id: "general",
    name: "General Ward",
    department: "Internal Medicine",
    beds: 60,
    available: 18,
    status: "available",
    nearby: ["Pharmacy", "Reception"],
    x: 34,
    y: 2,
    w: 38,
    h: 34,
  },
  {
    id: "cabin",
    name: "Cabin Block",
    department: "Private Care",
    beds: 20,
    available: 6,
    status: "available",
    nearby: ["Elevator", "Laboratory"],
    x: 74,
    y: 2,
    w: 24,
    h: 34,
  },
  {
    id: "nurse",
    name: "Nurse Station",
    department: "Nursing",
    beds: 0,
    available: 0,
    status: "available",
    nearby: ["ICU", "General Ward"],
    x: 2,
    y: 38,
    w: 22,
    h: 22,
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    department: "Pharmaceutical Services",
    beds: 0,
    available: 0,
    status: "available",
    nearby: ["Reception", "Laboratory"],
    x: 26,
    y: 38,
    w: 22,
    h: 22,
  },
  {
    id: "lab",
    name: "Laboratory",
    department: "Diagnostics",
    beds: 0,
    available: 0,
    status: "available",
    nearby: ["Pharmacy", "Emergency"],
    x: 50,
    y: 38,
    w: 22,
    h: 22,
  },
  {
    id: "emergency",
    name: "Emergency",
    department: "Emergency Medicine",
    beds: 12,
    available: 2,
    status: "limited",
    nearby: ["Reception", "Elevator"],
    x: 74,
    y: 38,
    w: 24,
    h: 22,
  },
  {
    id: "elevator",
    name: "Elevator",
    department: "Facilities",
    beds: 0,
    available: 0,
    status: "available",
    nearby: ["Reception"],
    x: 2,
    y: 62,
    w: 16,
    h: 20,
  },
  {
    id: "reception",
    name: "Reception",
    department: "Front Desk",
    beds: 0,
    available: 0,
    status: "available",
    nearby: ["Emergency", "Pharmacy"],
    x: 20,
    y: 62,
    w: 78,
    h: 20,
  },
];

export type BloodGroup = { group: string; units: number; capacity: number; status: StatusLevel };

export const bloodGroups: BloodGroup[] = [
  { group: "A+", units: 18, capacity: 30, status: "available" },
  { group: "A-", units: 5, capacity: 30, status: "limited" },
  { group: "B+", units: 22, capacity: 30, status: "available" },
  { group: "B-", units: 3, capacity: 30, status: "limited" },
  { group: "AB+", units: 11, capacity: 30, status: "available" },
  { group: "AB-", units: 1, capacity: 30, status: "full" },
  { group: "O+", units: 26, capacity: 30, status: "available" },
  { group: "O-", units: 0, capacity: 30, status: "full" },
];

export const pharmacyCategories = [
  { id: "rx", name: "Prescription Medicines", icon: "receipt" },
  { id: "otc", name: "OTC Medicines", icon: "pill" },
  { id: "first-aid", name: "First Aid", icon: "bandage" },
  { id: "vitamins", name: "Vitamins", icon: "leaf" },
  { id: "diabetes", name: "Diabetes Care", icon: "activity" },
  { id: "personal", name: "Personal Care", icon: "sparkles" },
] as const;

export type Medicine = {
  id: string;
  name: string;
  strength: string;
  price: number;
  inStock: boolean;
  prescriptionRequired: boolean;
};

export const medicines: Medicine[] = [
  {
    id: "m1",
    name: "Napa Extra",
    strength: "500mg + 65mg",
    price: 1.2,
    inStock: true,
    prescriptionRequired: false,
  },
  {
    id: "m2",
    name: "Amlopin",
    strength: "5mg",
    price: 3.5,
    inStock: true,
    prescriptionRequired: true,
  },
  {
    id: "m3",
    name: "Metformin HCl",
    strength: "850mg",
    price: 4.1,
    inStock: true,
    prescriptionRequired: true,
  },
  {
    id: "m4",
    name: "Vitamin D3",
    strength: "2000 IU",
    price: 6.8,
    inStock: false,
    prescriptionRequired: false,
  },
];

export const doctorCategories = [
  "Cardiology",
  "Neurology",
  "Orthopedics",
  "Dermatology",
  "Pediatrics",
  "General Medicine",
  "Dentistry",
  "Gynecology",
  "ENT",
  "Other",
] as const;

export type Doctor = { id: string; name: string; category: string; title: string };

export const doctors: Doctor[] = [
  { id: "d1", name: "Dr. Ayesha Rahman", category: "Cardiology", title: "Interventional Cardiologist" },
  { id: "d2", name: "Dr. Imran Hossain", category: "Cardiology", title: "Cardiac Electrophysiologist" },
  { id: "d3", name: "Dr. Nabila Karim", category: "Neurology", title: "Consultant Neurologist" },
  { id: "d4", name: "Dr. Tanvir Ahmed", category: "Neurology", title: "Stroke Specialist" },
  { id: "d5", name: "Dr. Sabbir Chowdhury", category: "Orthopedics", title: "Joint Replacement Surgeon" },
  { id: "d6", name: "Dr. Farhana Islam", category: "Dermatology", title: "Clinical Dermatologist" },
  { id: "d7", name: "Dr. Mahmudul Hasan", category: "Pediatrics", title: "Consultant Pediatrician" },
  { id: "d8", name: "Dr. Rezaul Karim", category: "General Medicine", title: "Internal Medicine" },
  { id: "d9", name: "Dr. Shirin Akter", category: "Dentistry", title: "Oral & Dental Surgeon" },
  { id: "d10", name: "Dr. Momena Begum", category: "Gynecology", title: "Obstetrics & Gynecology" },
  { id: "d11", name: "Dr. Asif Mahmood", category: "ENT", title: "ENT & Head-Neck Surgeon" },
  { id: "d12", name: "Dr. Care Team", category: "Other", title: "General Consultation" },
];

export const emergencyTypes = [
  "Accident",
  "Cardiac Emergency",
  "Breathing Problem",
  "Injury",
  "Medical Emergency",
  "Other",
] as const;

export const timeSlots = [
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
] as const;

export const ambulanceFleet = [
  { id: "AMB-104", type: "Advanced Life Support", eta: 7, driver: "Rashed Mia" },
  { id: "AMB-217", type: "Basic Life Support", eta: 9, driver: "Kamal Uddin" },
  { id: "AMB-331", type: "Cardiac Ambulance", eta: 11, driver: "Sohel Rana" },
];

export const statusStyles: Record<StatusLevel, { label: string; dot: string; text: string; bg: string }> = {
  available: {
    label: "Available",
    dot: "bg-success",
    text: "text-success",
    bg: "bg-success/10 border-success/30",
  },
  limited: {
    label: "Limited",
    dot: "bg-warning",
    text: "text-warning",
    bg: "bg-warning/10 border-warning/30",
  },
  full: {
    label: "Critical",
    dot: "bg-emergency",
    text: "text-emergency",
    bg: "bg-emergency/10 border-emergency/30",
  },
};
