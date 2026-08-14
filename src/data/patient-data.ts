/**
 * Types & Schema Definitions for MediQ Patient Dashboard.
 */

export interface PatientUserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
  bloodGroup: string;
  contact: string;
  email: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  allergies: string[];
  chronicConditions: string[];
}

export interface DoctorCard {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  category: string;
  experience: string;
  hospital: string;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  availableTime: string;
}

export interface PatientAppointment {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  category: string;
  hospital: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";
  reason: string;
  fee: number;
}

export interface MedicalRecordItem {
  id: string;
  date: string;
  title: string;
  type: "Consultation" | "Diagnosis" | "Prescription" | "Lab Report" | "Diagnostic" | "Hospital Visit" | "Admission" | "Follow-up";
  doctorName: string;
  facility: string;
  summary: string;
  status: string;
  reportUrl?: string;
}

export interface PatientPrescription {
  id: string;
  rxNo: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  diagnosis: string;
  medicines: {
    name: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  advice: string;
  followUpDate: string;
}

export interface PatientLabTest {
  id: string;
  requisitionNo: string;
  testName: string;
  category: string;
  facility: string;
  bookedDate: string;
  status: "Booked" | "Processing" | "Completed";
  resultSummary?: string;
  reportUrl?: string;
}

export interface PatientPharmacyOrder {
  id: string;
  orderNo: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  totalPrice: number;
  prescriptionRequired: boolean;
  prescriptionVerified: boolean;
  status: "Processing" | "Out for Delivery" | "Delivered" | "Ready for Pickup";
  deliveryAddress: string;
}

export interface PatientBloodRequest {
  id: string;
  requestId: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  urgency: "Routine" | "Urgent" | "Emergency";
  requestedDate: string;
  status: "Pending" | "Approved" | "Dispatched" | "Fulfilled";
}

export interface ActiveAmbulance {
  id: string;
  requestId: string;
  status: "Assigned" | "En Route" | "Arrived" | "Completed";
  driverName: string;
  driverPhone: string;
  ambulanceUnit: string;
  ambulanceType: string;
  pickupLocation: string;
  destination: string;
  etaMinutes: number;
}

export interface PatientBill {
  id: string;
  invoiceNo: string;
  serviceName: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
  dueDate: string;
  category: "Consultation" | "Pharmacy" | "Diagnostics" | "Hospital Admission";
}

export interface PatientNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "appointment" | "prescription" | "lab" | "pharmacy" | "blood" | "sos";
  read: boolean;
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialPatientUser: PatientUserProfile = {
  id: "",
  name: "",
  avatar: "",
  age: 0,
  gender: "",
  bloodGroup: "",
  contact: "",
  email: "",
  address: "",
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
  allergies: [],
  chronicConditions: [],
};

export const sampleDoctors: DoctorCard[] = [];
export const initialPatientAppointments: PatientAppointment[] = [];
export const initialMedicalRecords: MedicalRecordItem[] = [];
export const initialPatientPrescriptions: PatientPrescription[] = [];
export const initialPatientLabTests: PatientLabTest[] = [];
export const initialPatientPharmacyOrders: PatientPharmacyOrder[] = [];
export const initialPatientBloodRequests: PatientBloodRequest[] = [];
export const initialActiveAmbulance: ActiveAmbulance | null = null;
export const initialPatientBills: PatientBill[] = [];
export const initialPatientNotifications: PatientNotification[] = [];
