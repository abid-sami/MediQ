/**
 * Mock data for the MediQ Nurse Dashboard (Nurse: Elena Vance).
 * Focused on ward management, bedside care, medication administration, and vital signs monitoring.
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
  conditionStatus: "Stable" | "Monitoring" | "Critical" | "Guarded";
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

// Initial Data
export const initialNurseProfile: NurseProfile = {
  id: "nurse-409",
  name: "Elena Vance, RN",
  avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&auto=format&fit=crop&q=80",
  badgeId: "NR-4092",
  role: "Senior Charge Nurse",
  ward: "Cardiovascular Care Unit — Ward 4A",
  shift: "Day Shift (07:00 AM - 03:00 PM)",
  hospital: "MediQ Central Hospital & Heart Institute",
  contact: "+1 (555) 409-2211",
  email: "elena.vance@mediq.health",
};

export const initialNursePatients: NursePatient[] = [
  {
    id: "np-1",
    name: "Tariqul Islam",
    age: 54,
    gender: "Male",
    bloodGroup: "O+",
    allergies: ["Penicillin", "Sulfa drugs"],
    bedNo: "Bed 401-A",
    ward: "Ward 4A",
    diagnosis: "Unstable Angina — Post PCI Stenting",
    doctorName: "Dr. Sarah Rahman",
    conditionStatus: "Monitoring",
    currentMedications: ["Tab. Telmisartan 40mg", "Tab. Atorvastatin 20mg", "Tab. Aspirin 75mg"],
    latestVitals: {
      bp: "138/88 mmHg",
      pulse: "78 bpm",
      temp: "98.4 °F",
      spo2: "98%",
      rr: "18 bpm",
      weight: "76 kg",
      recordedAt: "10 mins ago",
    },
    alerts: ["High BP Alert", "Lipid Panel Pending"],
  },
  {
    id: "np-2",
    name: "Kamrul Hasan",
    age: 68,
    gender: "Male",
    bloodGroup: "O-",
    allergies: ["Codeine"],
    bedNo: "Bed 402-B",
    ward: "Ward 4A",
    diagnosis: "Congestive Heart Failure Stage II",
    doctorName: "Dr. Sarah Rahman",
    conditionStatus: "Critical",
    currentMedications: ["Tab. Digoxin 0.25mg", "Inj. Furosemide 40mg", "Tab. Spironolactone"],
    latestVitals: {
      bp: "154/96 mmHg",
      pulse: "94 bpm",
      temp: "98.8 °F",
      spo2: "94%",
      rr: "24 bpm",
      weight: "85 kg",
      recordedAt: "5 mins ago",
    },
    alerts: ["Low SpO2 Alert", "Emergency Oxygen Assistance Required"],
  },
  {
    id: "np-3",
    name: "Amina Begum",
    age: 42,
    gender: "Female",
    bloodGroup: "A+",
    allergies: ["Aspirin"],
    bedNo: "Bed 403-A",
    ward: "Ward 4A",
    diagnosis: "Mitral Valve Prolapse Evaluation",
    doctorName: "Dr. Sarah Rahman",
    conditionStatus: "Stable",
    currentMedications: ["Tab. Bisoprolol 2.5mg", "Cap. Omeprazole 20mg"],
    latestVitals: {
      bp: "122/78 mmHg",
      pulse: "72 bpm",
      temp: "98.6 °F",
      spo2: "99%",
      rr: "16 bpm",
      weight: "62 kg",
      recordedAt: "30 mins ago",
    },
    alerts: [],
  },
  {
    id: "np-4",
    name: "Rafiq Ahmed",
    age: 61,
    gender: "Male",
    bloodGroup: "B+",
    allergies: ["None reported"],
    bedNo: "Bed 404-C",
    ward: "Ward 4A",
    diagnosis: "Ischemic Heart Disease",
    doctorName: "Dr. Sarah Rahman",
    conditionStatus: "Guarded",
    currentMedications: ["Tab. Clopidogrel 75mg", "Tab. Metoprolol 50mg"],
    latestVitals: {
      bp: "130/82 mmHg",
      pulse: "68 bpm",
      temp: "98.2 °F",
      spo2: "97%",
      rr: "17 bpm",
      weight: "81 kg",
      recordedAt: "45 mins ago",
    },
    alerts: ["Medication Due: Clopidogrel"],
  },
];

export const initialVitalSignRecords: VitalSignRecord[] = [
  {
    id: "v-1",
    patientId: "np-1",
    patientName: "Tariqul Islam",
    bp: "138/88",
    pulse: 78,
    temp: 98.4,
    spo2: 98,
    rr: 18,
    weight: 76,
    recordedAt: "08:30 AM",
    recordedBy: "Elena Vance, RN",
  },
  {
    id: "v-2",
    patientId: "np-1",
    patientName: "Tariqul Islam",
    bp: "142/90",
    pulse: 82,
    temp: 98.6,
    spo2: 97,
    rr: 20,
    weight: 76,
    recordedAt: "04:00 AM",
    recordedBy: "Staff Nurse Joy",
  },
  {
    id: "v-3",
    patientId: "np-2",
    patientName: "Kamrul Hasan",
    bp: "154/96",
    pulse: 94,
    temp: 98.8,
    spo2: 94,
    rr: 24,
    weight: 85,
    recordedAt: "08:45 AM",
    recordedBy: "Elena Vance, RN",
  },
];

export const initialNursingNotes: NursingNoteItem[] = [
  {
    id: "nn-1",
    patientId: "np-1",
    patientName: "Tariqul Islam",
    observation: "Patient complaining of mild retrosternal pressure after breakfast.",
    patientCondition: "Guarded / Monitoring",
    careProvided: "Administered sublingual nitroglycerin as per PRN orders. Elevated head of bed to 45 degrees.",
    notes: "Attending doctor informed. BP stabilized after 15 minutes. Patient resting comfortably.",
    time: "08:45 AM",
    nurseName: "Elena Vance, RN",
  },
  {
    id: "nn-2",
    patientId: "np-2",
    patientName: "Kamrul Hasan",
    observation: "Shortness of breath on mild exertion. Bilateral pedal edema ++.",
    patientCondition: "Critical",
    careProvided: "Applied 4L O2 via nasal cannula. Administered Inj. Furosemide IV STAT.",
    notes: "SpO2 improved from 91% to 94%. Fluid intake monitored strictly.",
    time: "08:15 AM",
    nurseName: "Elena Vance, RN",
  },
];

export const initialMedicationTasks: MedicationTask[] = [
  {
    id: "mt-1",
    patientId: "np-1",
    patientName: "Tariqul Islam",
    bedNo: "Bed 401-A",
    medicine: "Tab. Telmisartan",
    dose: "40mg",
    time: "09:00 AM",
    status: "Pending",
    instructions: "Give with water after breakfast.",
  },
  {
    id: "mt-2",
    patientId: "np-2",
    patientName: "Kamrul Hasan",
    bedNo: "Bed 402-B",
    medicine: "Inj. Furosemide IV",
    dose: "40mg",
    time: "08:00 AM",
    status: "Given",
    instructions: "IV bolus slow push.",
  },
  {
    id: "mt-3",
    patientId: "np-3",
    patientName: "Amina Begum",
    bedNo: "Bed 403-A",
    medicine: "Tab. Bisoprolol",
    dose: "2.5mg",
    time: "09:30 AM",
    status: "Pending",
    instructions: "Check HR prior to administration.",
  },
  {
    id: "mt-4",
    patientId: "np-4",
    patientName: "Rafiq Ahmed",
    bedNo: "Bed 404-C",
    medicine: "Tab. Clopidogrel",
    dose: "75mg",
    time: "08:30 AM",
    status: "Missed",
    instructions: "Patient was in radiology for ECHO scan.",
  },
];

export const initialWardBeds: WardBed[] = [
  { id: "b-1", bedNo: "Bed 401-A", roomNo: "Room 401", wardName: "Ward 4A", patientName: "Tariqul Islam", status: "Occupied" },
  { id: "b-2", bedNo: "Bed 401-B", roomNo: "Room 401", wardName: "Ward 4A", status: "Available" },
  { id: "b-3", bedNo: "Bed 402-A", roomNo: "Room 402", wardName: "Ward 4A", status: "Cleaning" },
  { id: "b-4", bedNo: "Bed 402-B", roomNo: "Room 402", wardName: "Ward 4A", patientName: "Kamrul Hasan", status: "Occupied" },
  { id: "b-5", bedNo: "Bed 403-A", roomNo: "Room 403", wardName: "Ward 4A", patientName: "Amina Begum", status: "Occupied" },
  { id: "b-6", bedNo: "Bed 403-B", roomNo: "Room 403", wardName: "Ward 4A", status: "Maintenance" },
  { id: "b-7", bedNo: "Bed 404-A", roomNo: "Room 404", wardName: "Ward 4A", status: "Available" },
  { id: "b-8", bedNo: "Bed 404-C", roomNo: "Room 404", wardName: "Ward 4A", patientName: "Rafiq Ahmed", status: "Occupied" },
];

export const initialNurseAlerts: NurseAlert[] = [
  {
    id: "na-1",
    patientId: "np-2",
    patientName: "Kamrul Hasan",
    bedNo: "Bed 402-B",
    alertType: "Critical vitals",
    message: "Low SpO2 (94%) & High BP (154/96 mmHg). Acute dyspnea reported.",
    severity: "Critical",
    timestamp: "5 mins ago",
    resolved: false,
  },
  {
    id: "na-2",
    patientId: "np-4",
    patientName: "Rafiq Ahmed",
    bedNo: "Bed 404-C",
    alertType: "Medication due",
    message: "Tab. Clopidogrel 75mg administration window missed due to ECHO scan.",
    severity: "High",
    timestamp: "15 mins ago",
    resolved: false,
  },
  {
    id: "na-3",
    patientId: "np-1",
    patientName: "Tariqul Islam",
    bedNo: "Bed 401-A",
    alertType: "Doctor requested",
    message: "Dr. Sarah Rahman requested STAT Lipid Profile report review.",
    severity: "Medium",
    timestamp: "25 mins ago",
    resolved: false,
  },
  {
    id: "na-4",
    patientId: "np-3",
    patientName: "Amina Begum",
    bedNo: "Bed 403-A",
    alertType: "Patient assistance required",
    message: "Bedside call pendant pressed for water assistance.",
    severity: "Medium",
    timestamp: "35 mins ago",
    resolved: true,
  },
];
