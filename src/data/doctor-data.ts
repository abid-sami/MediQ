/**
 * Types & Schema Definitions for MediQ Doctor Dashboard.
 */

export type AppointmentStatus =
  | "Waiting"
  | "Checked In"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export type AppointmentType = "In-Person" | "Teleconsult" | "Follow-up" | "Emergency";

export type LabTestStatus = "Requested" | "Sample Collected" | "Processing" | "Report Ready";
export type DiagnosticStatus = "Requested" | "Scheduled" | "Processing" | "Report Ready";
export type FollowUpStatus = "Scheduled" | "Reminded" | "Completed" | "Rescheduled" | "Missed";

export interface DoctorProfile {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: string;
  consultationFee: number;
  currency: string;
  hospital: string;
  email: string;
  phone: string;
  roomNo: string;
  availableDays: string[];
  availableHours: string;
  bio: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
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
  medicalHistory: string;
  previousVisitsCount: number;
  lastVisitDate: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  patientBloodGroup: string;
  appointmentTime: string;
  department: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  vitalSigns?: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    weight: string;
  };
}

export interface MedicineItem {
  id: string;
  name: string;
  strength: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface DigitalPrescription {
  id: string;
  prescriptionNo: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientBloodGroup: string;
  date: string;
  diagnosis: string;
  medicines: MedicineItem[];
  advice: string;
  followUpDate: string;
  doctorName: string;
  doctorSpecialization: string;
  status: "Draft" | "Saved" | "Sent to Patient";
}

export interface LabRequest {
  id: string;
  requestNo: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  testCategory: "Blood Tests" | "Urine Tests" | "Pathology" | "ECG" | "Other";
  testName: string;
  requestedDate: string;
  status: LabTestStatus;
  urgency: "Routine" | "Urgent" | "Emergency";
  notes?: string;
  resultSummary?: string;
}

export interface DiagnosticRequest {
  id: string;
  requestNo: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  diagnosticType: "X-Ray" | "CT" | "MRI" | "Ultrasound" | "ECG" | "Other";
  testName: string;
  requestedDate: string;
  status: DiagnosticStatus;
  urgency: "Routine" | "Urgent" | "Emergency";
  clinicalIndication: string;
  resultSummary?: string;
  imageUrl?: string;
}

export interface MedicalReport {
  id: string;
  reportNo: string;
  patientId: string;
  patientName: string;
  type: "Laboratory" | "Diagnostic";
  testName: string;
  category: string;
  date: string;
  summary: string;
  technicianName: string;
  findings: string;
  status: "Final" | "Preliminary";
  abnormalFlag: boolean;
}

export interface ConsultationSession {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  chiefComplaint: string;
  symptoms: string[];
  clinicalNotes: string;
  diagnosis: string;
  treatmentPlan: string;
  followUpDate: string;
  createdDate: string;
}

export interface FollowUpItem {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientContact: string;
  previousDiagnosis: string;
  previousVisit: string;
  followUpDate: string;
  status: FollowUpStatus;
  notes: string;
}

export interface DoctorNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "appointment" | "lab" | "diagnostic" | "patient" | "system";
  read: boolean;
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialDoctorProfile: DoctorProfile = {
  id: "",
  name: "",
  avatar: "",
  specialization: "",
  department: "",
  qualification: "",
  experience: "",
  consultationFee: 0,
  currency: "USD",
  hospital: "",
  email: "",
  phone: "",
  roomNo: "",
  availableDays: [],
  availableHours: "",
  bio: "",
};

export const initialPatients: Patient[] = [];
export const initialAppointments: Appointment[] = [];
export const initialPrescriptions: DigitalPrescription[] = [];
export const initialLabRequests: LabRequest[] = [];
export const initialDiagnosticRequests: DiagnosticRequest[] = [];
export const initialMedicalReports: MedicalReport[] = [];
export const initialFollowUps: FollowUpItem[] = [];
export const initialNotifications: DoctorNotification[] = [];
