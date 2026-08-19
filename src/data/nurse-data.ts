/**
 * Types & Schema Definitions for MediQ Nurse Dashboard.
 */

export interface NurseProfile {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  role: string;
  ward: string;
  shift: string;
  hospital: string;
  contact: string;
  email: string;
}

export interface NursePatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  allergies: string[];
  bedNo: string;
  ward: string;
  diagnosis: string;
  doctorName: string;
  conditionStatus: "Stable" | "Monitoring" | "Critical" | "Guarded" | "Not recorded";
  currentMedications: string[];
  latestVitals: {
    bp: string;
    pulse: string;
    temp: string;
    spo2: string;
    rr: string;
    weight: string;
    recordedAt: string;
  };
  alerts: string[];
}

export interface VitalSignRecord {
  id: string;
  patientId: string;
  patientName: string;
  bp: string;
  pulse: number;
  temp: number;
  spo2: number;
  rr: number;
  weight: number;
  recordedAt: string;
  recordedBy: string;
}

export interface NursingNoteItem {
  id: string;
  patientId: string;
  patientName: string;
  observation: string;
  patientCondition: string;
  careProvided: string;
  notes: string;
  time: string;
  nurseName: string;
}

export interface MedicationTask {
  id: string;
  patientId: string;
  patientName: string;
  bedNo: string;
  medicine: string;
  dose: string;
  time: string;
  status: "Pending" | "Given" | "Missed";
  instructions: string;
}

export interface WardBed {
  id: string;
  bedNo: string;
  roomNo: string;
  wardName: string;
  floorNumber?: number;
  dailyRate?: number;
  patientName?: string;
  status: "Occupied" | "Available" | "Cleaning" | "Maintenance";
}

export interface NurseAlert {
  id: string;
  patientId: string;
  patientName: string;
  bedNo: string;
  alertType: "Critical vitals" | "Medication due" | "Doctor requested" | "Patient assistance required";
  message: string;
  severity: "Critical" | "High" | "Medium";
  timestamp: string;
  resolved: boolean;
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialNurseProfile: NurseProfile = {
  id: "",
  name: "",
  avatar: "",
  badgeId: "",
  role: "",
  ward: "",
  shift: "",
  hospital: "",
  contact: "",
  email: "",
};

export const initialNursePatients: NursePatient[] = [];
export const initialVitalSignRecords: VitalSignRecord[] = [];
export const initialNursingNotes: NursingNoteItem[] = [];
export const initialMedicationTasks: MedicationTask[] = [];
export const initialWardBeds: WardBed[] = [];
export const initialNurseAlerts: NurseAlert[] = [];
