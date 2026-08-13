/**
 * Mock data for MediQ Pharmacy Dashboard.
 * Pharmacist: Tariq Anwar, RPh (Senior Clinical Pharmacist).
 */

export interface PharmacistProfile {
  id: string;
  name: string;
  avatar: string;
  licenseNo: string;
  role: string;
  pharmacyBranch: string;
  hospital: string;
  email: string;
  phone: string;
}

export type OrderStatus =
  | "Pending"
  | "Prescription Verification"
  | "Processing"
  | "Ready"
  | "Completed"
  | "Cancelled";

export interface PharmacyOrderItem {
  medicineName: string;
  strength: string;
  quantity: number;
  unitPrice: number;
}

export interface PharmacyOrder {
  id: string;
  orderId: string;
  patientName: string;
  patientContact: string;
  medicines: PharmacyOrderItem[];
  orderTime: string;
  totalAmount: number;
  prescriptionRequired: boolean;
  prescriptionStatus: "Verified" | "Pending Verification" | "Rejected";
  orderStatus: OrderStatus;
  deliveryType: "Home Delivery" | "Store Pickup";
}

export interface PrescriptionToVerify {
  id: string;
  prescriptionId: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  diagnosis: string;
  medicines: {
    name: string;
    strength: string;
    dosage: string;
    instructions: string;
  }[];
  verificationStatus: "Pending" | "Verified" | "Rejected" | "Clarification Requested";
  notes?: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock" | "Expiring Soon";

export interface PharmacyMedicine {
  id: string;
  name: string;
  genericName: string;
  brand: string;
  strength: string;
  category: string;
  price: number;
  stock: number;
  reorderLevel: number;
  expiryDate: string;
  prescriptionRequired: boolean;
  stockStatus: StockStatus;
}

export interface PharmacySupplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  suppliedCategories: string[];
  leadTimeDays: number;
}

export const initialPharmacistProfile: PharmacistProfile = {
  id: "ph-8840",
  name: "Tariq Anwar, RPh",
  avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80",
  licenseNo: "RPH-BD-88409",
  role: "Chief Clinical Pharmacist",
  pharmacyBranch: "MediQ Central Hospital Pharmacy — Ground Floor",
  hospital: "MediQ Central Healthcare Network",
  email: "tariq.anwar@mediq.health",
  phone: "+1 (555) 884-0921",
};

export const initialPrescriptionsToVerify: PrescriptionToVerify[] = [
  {
    id: "rx-v1",
    prescriptionId: "RX-2026-8801",
    patientName: "Nusrat Jahan",
    patientAge: 29,
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Senior Consultant Cardiologist",
    date: "2026-08-14",
    diagnosis: "Normal Sinus Rhythm — Low Risk Clearance",
    medicines: [
      { name: "Tab. Concor (Bisoprolol)", strength: "2.5mg", dosage: "0-0-1", instructions: "Take before bed with water" },
      { name: "Cap. Omeprazole", strength: "20mg", dosage: "1-0-0", instructions: "30 min before breakfast" },
    ],
    verificationStatus: "Pending",
  },
  {
    id: "rx-v2",
    prescriptionId: "RX-2026-8802",
    patientName: "Tariqul Islam",
    patientAge: 54,
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Senior Consultant Cardiologist",
    date: "2026-08-14",
    diagnosis: "Essential Hypertension & Angina",
    medicines: [
      { name: "Tab. Telmisartan", strength: "40mg", dosage: "1-0-0", instructions: "Once daily morning" },
      { name: "Tab. Atorvastatin", strength: "20mg", dosage: "0-0-1", instructions: "Once daily bedtime" },
      { name: "Tab. Aspirin (Ecosprin)", strength: "75mg", dosage: "0-1-0", instructions: "Take after lunch" },
    ],
    verificationStatus: "Verified",
  },
  {
    id: "rx-v3",
    prescriptionId: "RX-2026-8805",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Cardiology",
    date: "2026-08-13",
    diagnosis: "Congestive Heart Failure",
    medicines: [
      { name: "Tab. Digoxin", strength: "0.25mg", dosage: "1-0-0", instructions: "Monitor heart rate" },
      { name: "Inj. Furosemide", strength: "40mg", dosage: "STAT", instructions: "IV Push" },
    ],
    verificationStatus: "Clarification Requested",
    notes: "Clarifying Digoxin dosage frequency with Dr. Sarah Rahman",
  },
];

export const initialPharmacyOrders: PharmacyOrder[] = [
  {
    id: "ord-1",
    orderId: "ORD-PH-2026-101",
    patientName: "Nusrat Jahan",
    patientContact: "+1 (555) 603-1284",
    medicines: [
      { medicineName: "Tab. Concor (Bisoprolol 2.5mg)", strength: "2.5mg", quantity: 3, unitPrice: 4.0 },
      { medicineName: "Cap. Omeprazole 20mg", strength: "20mg", quantity: 2, unitPrice: 4.0 },
    ],
    orderTime: "10 mins ago",
    totalAmount: 20.0,
    prescriptionRequired: true,
    prescriptionStatus: "Pending Verification",
    orderStatus: "Prescription Verification",
    deliveryType: "Home Delivery",
  },
  {
    id: "ord-2",
    orderId: "ORD-PH-2026-102",
    patientName: "Tariqul Islam",
    patientContact: "+1 (555) 492-1102",
    medicines: [
      { medicineName: "Tab. Telmisartan 40mg", strength: "40mg", quantity: 3, unitPrice: 5.0 },
      { medicineName: "Tab. Atorvastatin 20mg", strength: "20mg", quantity: 3, unitPrice: 6.0 },
    ],
    orderTime: "25 mins ago",
    totalAmount: 33.0,
    prescriptionRequired: true,
    prescriptionStatus: "Verified",
    orderStatus: "Processing",
    deliveryType: "Home Delivery",
  },
  {
    id: "ord-3",
    orderId: "ORD-PH-2026-103",
    patientName: "Sami",
    patientContact: "+1 (555) 234-5678",
    medicines: [
      { medicineName: "Napa Extra 500mg", strength: "500mg", quantity: 5, unitPrice: 1.5 },
      { medicineName: "First Aid Antiseptic Bandages", strength: "Pack", quantity: 2, unitPrice: 4.0 },
    ],
    orderTime: "40 mins ago",
    totalAmount: 15.5,
    prescriptionRequired: false,
    prescriptionStatus: "Verified",
    orderStatus: "Ready",
    deliveryType: "Store Pickup",
  },
  {
    id: "ord-4",
    orderId: "ORD-PH-2026-104",
    patientName: "Amina Begum",
    patientContact: "+1 (555) 831-2940",
    medicines: [
      { medicineName: "Tab. Bisoprolol 2.5mg", strength: "2.5mg", quantity: 2, unitPrice: 4.0 },
    ],
    orderTime: "1 hour ago",
    totalAmount: 8.0,
    prescriptionRequired: true,
    prescriptionStatus: "Verified",
    orderStatus: "Completed",
    deliveryType: "Home Delivery",
  },
];

export const initialMedicines: PharmacyMedicine[] = [
  {
    id: "med-101",
    name: "Telmisartan",
    genericName: "Telmisartan",
    brand: "Micardis / Telma",
    strength: "40mg",
    category: "Prescription Medicines",
    price: 5.0,
    stock: 140,
    reorderLevel: 30,
    expiryDate: "2027-11-30",
    prescriptionRequired: true,
    stockStatus: "In Stock",
  },
  {
    id: "med-102",
    name: "Concor (Bisoprolol Fumarate)",
    genericName: "Bisoprolol Fumarate",
    brand: "Merck / Concor",
    strength: "2.5mg",
    category: "Prescription Medicines",
    price: 4.0,
    stock: 18,
    reorderLevel: 25,
    expiryDate: "2027-08-15",
    prescriptionRequired: true,
    stockStatus: "Low Stock",
  },
  {
    id: "med-103",
    name: "Atorvastatin (Lipiget)",
    genericName: "Atorvastatin Calcium",
    brand: "Lipitor / Lipiget",
    strength: "20mg",
    category: "Prescription Medicines",
    price: 6.0,
    stock: 0,
    reorderLevel: 20,
    expiryDate: "2027-05-20",
    prescriptionRequired: true,
    stockStatus: "Out of Stock",
  },
  {
    id: "med-104",
    name: "Napa Extra",
    genericName: "Paracetamol + Caffeine",
    brand: "Beximco / Napa",
    strength: "500mg + 65mg",
    category: "OTC Medicines",
    price: 1.5,
    stock: 350,
    reorderLevel: 50,
    expiryDate: "2026-09-01",
    prescriptionRequired: false,
    stockStatus: "Expiring Soon",
  },
  {
    id: "med-105",
    name: "Omeprazole",
    genericName: "Omeprazole Magnesium",
    brand: "Prilosec / Seclo",
    strength: "20mg",
    category: "Prescription Medicines",
    price: 4.0,
    stock: 210,
    reorderLevel: 40,
    expiryDate: "2028-01-10",
    prescriptionRequired: true,
    stockStatus: "In Stock",
  },
  {
    id: "med-106",
    name: "Vitamin D3 2000 IU",
    genericName: "Cholecalciferol",
    brand: "Nature Made",
    strength: "2000 IU",
    category: "Vitamins",
    price: 9.5,
    stock: 12,
    reorderLevel: 20,
    expiryDate: "2026-10-15",
    prescriptionRequired: false,
    stockStatus: "Low Stock",
  },
];

export const initialSuppliers: PharmacySupplier[] = [
  {
    id: "sup-1",
    name: "Beximco Pharmaceuticals Ltd.",
    contactPerson: "Kamal Hossain",
    phone: "+1 (555) 991-0022",
    email: "supply@beximco-pharma.com",
    suppliedCategories: ["Prescription Medicines", "OTC Medicines"],
    leadTimeDays: 2,
  },
  {
    id: "sup-2",
    name: "Square Pharmaceuticals PLC",
    contactPerson: "Mahmudur Rahman",
    phone: "+1 (555) 882-3344",
    email: "orders@squarepharma.com",
    suppliedCategories: ["Prescription Medicines", "Diabetes Care", "Vitamins"],
    leadTimeDays: 1,
  },
  {
    id: "sup-3",
    name: "Incepta Healthcare Global",
    contactPerson: "Nasrin Sultana",
    phone: "+1 (555) 773-4455",
    email: "distribution@incepta.com",
    suppliedCategories: ["Prescription Medicines", "Personal Care"],
    leadTimeDays: 3,
  },
];
