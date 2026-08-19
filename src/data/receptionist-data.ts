/**
 * Types & Schema Definitions for MediQ Receptionist Dashboard.
 */

export interface ReceptionistProfile {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  role: string;
  deskLocation: string;
  hospital: string;
  email: string;
  phone: string;
}

export interface RegisteredPatient {
  id: string;
  patientId: string;
  name: string;
  phone: string;
  age?: number;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalNotes: string;
  registeredDate: string;
}

export type AppointmentStatus =
  | "Requested"
  | "Confirmed"
  | "Checked In"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export interface ReceptionAppointment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface DoctorQueueItem {
  id: string;
  doctorName: string;
  department: string;
  roomNo: string;
  currentPatient?: string;
  waitingCount: number;
  nextPatient?: string;
  status: "In Consultation" | "Available" | "Busy" | "On Break";
}

export interface HospitalAdmission {
  id: string;
  admissionId: string;
  patientName: string;
  department: string;
  wardName: string;
  bedNo: string;
  bedType: "General" | "ICU" | "CCU" | "Cabin" | "Emergency";
  admissionTime: string;
  attendingDoctor: string;
}

export interface BedCategoryAvailability {
  category: "General" | "ICU" | "CCU" | "Cabin" | "Emergency";
  totalBeds: number;
  occupied: number;
  available: number;
}

export interface ReceptionBill {
  id: string;
  billId: string;
  patientName: string;
  services: string[];
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  date: string;
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialReceptionistProfile: ReceptionistProfile = {
  id: "",
  name: "",
  avatar: "",
  badgeId: "",
  role: "",
  deskLocation: "",
  hospital: "",
  email: "",
  phone: "",
};

export const initialRegisteredPatients: RegisteredPatient[] = [];
export const initialReceptionAppointments: ReceptionAppointment[] = [];
export const initialDoctorQueues: DoctorQueueItem[] = [];
export const initialAdmissions: HospitalAdmission[] = [];
export const initialBedCategories: BedCategoryAvailability[] = [];
export const initialReceptionBills: ReceptionBill[] = [];
