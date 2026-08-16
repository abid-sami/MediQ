/**
 * Types & Schema Definitions for MediQ Pharmacy Dashboard.
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
  fileName?: string;
  fileUrl?: string;
  orderReference?: string;
  uploadedAt?: string;
}

export interface PharmacyCategory {
  id: string;
  name: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
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

// Initial Data Structures (Dynamic & Populated via Database)
export const initialPharmacistProfile: PharmacistProfile = {
  id: "",
  name: "",
  avatar: "",
  licenseNo: "",
  role: "",
  pharmacyBranch: "",
  hospital: "",
  email: "",
  phone: "",
};

export const initialPrescriptionsToVerify: PrescriptionToVerify[] = [];
export const initialPharmacyOrders: PharmacyOrder[] = [];
export const initialMedicines: PharmacyMedicine[] = [];
export const initialSuppliers: PharmacySupplier[] = [];
