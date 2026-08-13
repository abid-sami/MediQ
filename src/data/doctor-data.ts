/**
 * Comprehensive data model and static data for MediQ Doctor Dashboard.
 * Designed for Dr. Sarah Rahman (Senior Consultant Cardiologist).
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

// Initial Mock Data
export const initialDoctorProfile: DoctorProfile = {
  id: "doc-101",
  name: "Dr. Sarah Rahman",
  avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
  specialization: "Senior Consultant Cardiologist",
  department: "Cardiology & Cardiovascular Surgery",
  qualification: "MBBS, FCPS (Cardiology), MD (Card), FACC (USA)",
  experience: "14 Years",
  consultationFee: 80,
  currency: "USD",
  hospital: "MediQ Central Hospital & Heart Institute",
  email: "sarah.rahman@mediq.health",
  phone: "+1 (555) 382-9102",
  roomNo: "Suite 408, Block B",
  availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
  availableHours: "09:00 AM - 05:00 PM",
  bio: "Dr. Sarah Rahman is an acclaimed cardiologist with over 14 years of clinical experience specializing in non-invasive cardiology, coronary artery disease management, hypertension, and heart failure care.",
};

export const initialPatients: Patient[] = [
  {
    id: "pat-201",
    name: "Tariqul Islam",
    age: 54,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 (555) 492-1102",
    email: "tariqul.islam@email.com",
    address: "74 West End Ave, Suite 3B",
    emergencyContact: {
      name: "Sabrina Islam",
      relationship: "Spouse",
      phone: "+1 (555) 492-1109",
    },
    allergies: ["Penicillin", "Sulfa drugs"],
    chronicConditions: ["Hypertension (Type II)", "Type 2 Diabetes"],
    medicalHistory: "Diagnosed with Essential Hypertension in 2019. Under regular ACE inhibitor treatment. No prior cardiac surgeries.",
    previousVisitsCount: 6,
    lastVisitDate: "2026-06-12",
  },
  {
    id: "pat-202",
    name: "Amina Begum",
    age: 42,
    gender: "Female",
    bloodGroup: "A+",
    contact: "+1 (555) 831-2940",
    email: "amina.b@email.com",
    address: "128 Lakeshore Drive",
    emergencyContact: {
      name: "Khabir Uddin",
      relationship: "Brother",
      phone: "+1 (555) 831-2944",
    },
    allergies: ["Aspirin"],
    chronicConditions: ["Mitral Valve Prolapse"],
    medicalHistory: "Mild shortness of breath on exertion. Echo performed 3 months ago showing mild regurgitation.",
    previousVisitsCount: 4,
    lastVisitDate: "2026-07-04",
  },
  {
    id: "pat-203",
    name: "Rafiq Ahmed",
    age: 61,
    gender: "Male",
    bloodGroup: "B+",
    contact: "+1 (555) 902-3811",
    email: "rafiq.ahmed@email.com",
    address: "45 Hospital Road, Apt 12",
    emergencyContact: {
      name: "Naila Ahmed",
      relationship: "Daughter",
      phone: "+1 (555) 902-3819",
    },
    allergies: ["None reported"],
    chronicConditions: ["Ischemic Heart Disease", "Hyperlipidemia"],
    medicalHistory: "Post-stenting (LAD stent placed in 2023). Under dual antiplatelet therapy. Regular lipid panel monitoring required.",
    previousVisitsCount: 9,
    lastVisitDate: "2026-05-18",
  },
  {
    id: "pat-204",
    name: "Farhana Yasmin",
    age: 36,
    gender: "Female",
    bloodGroup: "AB+",
    contact: "+1 (555) 219-4820",
    email: "farhana.y@email.com",
    address: "89 Green Valley Row",
    emergencyContact: {
      name: "Zubair Rahman",
      relationship: "Husband",
      phone: "+1 (555) 219-4825",
    },
    allergies: ["NSAIDs", "Ibuprofen"],
    chronicConditions: ["Sinus Tachycardia"],
    medicalHistory: "Palpitations during high stress. Normal Holter monitoring last year. No structural heart anomaly.",
    previousVisitsCount: 3,
    lastVisitDate: "2026-07-20",
  },
  {
    id: "pat-205",
    name: "Kamrul Hasan",
    age: 68,
    gender: "Male",
    bloodGroup: "O-",
    contact: "+1 (555) 741-9923",
    email: "kamrul.h@email.com",
    address: "31 Pine Ridge Street",
    emergencyContact: {
      name: "Mahmud Hasan",
      relationship: "Son",
      phone: "+1 (555) 741-9929",
    },
    allergies: ["Codeine"],
    chronicConditions: ["Congestive Heart Failure (Stage II)", "Atrial Fibrillation"],
    medicalHistory: "EF 42%. On Digoxin and Loop Diuretics. Pace rate monitored quarterly.",
    previousVisitsCount: 12,
    lastVisitDate: "2026-07-15",
  },
  {
    id: "pat-206",
    name: "Nusrat Jahan",
    age: 29,
    gender: "Female",
    bloodGroup: "B-",
    contact: "+1 (555) 603-1284",
    email: "nusrat.j@email.com",
    address: "15 Park Boulevard",
    emergencyContact: {
      name: "Tanvir Ahmed",
      relationship: "Fiancé",
      phone: "+1 (555) 603-1288",
    },
    allergies: ["None"],
    chronicConditions: ["Mild Asthma"],
    medicalHistory: "Routine pre-op cardiac clearance for elective laparoscopic cholecystectomy.",
    previousVisitsCount: 1,
    lastVisitDate: "2026-08-01",
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: "apt-101",
    patientId: "pat-201",
    patientName: "Tariqul Islam",
    patientAge: 54,
    patientGender: "Male",
    patientBloodGroup: "O+",
    appointmentTime: "09:00 AM",
    department: "Cardiology",
    appointmentType: "In-Person",
    status: "Waiting",
    reason: "Chest discomfort and exertional dyspnea (2 days duration)",
    vitalSigns: {
      bp: "138/88 mmHg",
      pulse: "78 bpm",
      temp: "98.4 °F",
      spo2: "98%",
      weight: "76 kg",
    },
  },
  {
    id: "apt-102",
    patientId: "pat-202",
    patientName: "Amina Begum",
    patientAge: 42,
    patientGender: "Female",
    patientBloodGroup: "A+",
    appointmentTime: "09:30 AM",
    department: "Cardiology",
    appointmentType: "Follow-up",
    status: "Checked In",
    reason: "Mitral valve prolapse quarterly evaluation & Echo report review",
    vitalSigns: {
      bp: "122/78 mmHg",
      pulse: "72 bpm",
      temp: "98.6 °F",
      spo2: "99%",
      weight: "62 kg",
    },
  },
  {
    id: "apt-103",
    patientId: "pat-203",
    patientName: "Rafiq Ahmed",
    patientAge: 61,
    patientGender: "Male",
    patientBloodGroup: "B+",
    appointmentTime: "10:00 AM",
    department: "Cardiology",
    appointmentType: "In-Person",
    status: "Waiting",
    reason: "Post-stenting lipid panel check & medication adjustment",
    vitalSigns: {
      bp: "130/82 mmHg",
      pulse: "68 bpm",
      temp: "98.2 °F",
      spo2: "97%",
      weight: "81 kg",
    },
  },
  {
    id: "apt-104",
    patientId: "pat-204",
    patientName: "Farhana Yasmin",
    patientAge: 36,
    patientGender: "Female",
    patientBloodGroup: "AB+",
    appointmentTime: "10:30 AM",
    department: "Cardiology",
    appointmentType: "Teleconsult",
    status: "Waiting",
    reason: "Recurrent sinus tachycardia episodes review",
    vitalSigns: {
      bp: "118/74 mmHg",
      pulse: "92 bpm",
      temp: "98.6 °F",
      spo2: "99%",
      weight: "58 kg",
    },
  },
  {
    id: "apt-105",
    patientId: "pat-205",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    patientGender: "Male",
    patientBloodGroup: "O-",
    appointmentTime: "11:00 AM",
    department: "Cardiology",
    appointmentType: "Emergency",
    status: "Checked In",
    reason: "Acute shortness of breath & bilateral pedal edema",
    vitalSigns: {
      bp: "154/96 mmHg",
      pulse: "94 bpm",
      temp: "98.8 °F",
      spo2: "94%",
      weight: "85 kg",
    },
  },
  {
    id: "apt-106",
    patientId: "pat-206",
    patientName: "Nusrat Jahan",
    patientAge: 29,
    patientGender: "Female",
    patientBloodGroup: "B-",
    appointmentTime: "11:30 AM",
    department: "Cardiology",
    appointmentType: "In-Person",
    status: "Completed",
    reason: "Pre-operative cardiac clearance for elective surgery",
    vitalSigns: {
      bp: "115/75 mmHg",
      pulse: "70 bpm",
      temp: "98.4 °F",
      spo2: "100%",
      weight: "54 kg",
    },
  },
];

export const initialPrescriptions: DigitalPrescription[] = [
  {
    id: "rx-901",
    prescriptionNo: "RX-2026-8801",
    patientId: "pat-206",
    patientName: "Nusrat Jahan",
    patientAge: 29,
    patientGender: "Female",
    patientBloodGroup: "B-",
    date: "2026-08-14",
    diagnosis: "Normal Sinus Rhythm — Low Risk Cardiac Clearance",
    medicines: [
      {
        id: "m-1",
        name: "Tab. Concor (Bisoprolol Fumarate)",
        strength: "2.5mg",
        dosage: "0-0-1",
        frequency: "Once daily before sleep",
        duration: "14 Days",
        instructions: "Monitor heart rate. Take with water.",
      },
      {
        id: "m-2",
        name: "Cap. Omeprazole",
        strength: "20mg",
        dosage: "1-0-0",
        frequency: "Once daily 30 min before breakfast",
        duration: "14 Days",
        instructions: "Swallow whole, do not crush.",
      },
    ],
    advice: "Maintain low sodium diet. Avoid excessive coffee and energy drinks. Stay hydrated.",
    followUpDate: "2026-08-28",
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Senior Consultant Cardiologist",
    status: "Sent to Patient",
  },
  {
    id: "rx-902",
    prescriptionNo: "RX-2026-8802",
    patientId: "pat-201",
    patientName: "Tariqul Islam",
    patientAge: 54,
    patientGender: "Male",
    patientBloodGroup: "O+",
    date: "2026-08-10",
    diagnosis: "Essential Hypertension & Unstable Angina Evaluation",
    medicines: [
      {
        id: "m-3",
        name: "Tab. Telmisartan",
        strength: "40mg",
        dosage: "1-0-0",
        frequency: "Once daily in the morning",
        duration: "30 Days",
        instructions: "Do not stop abruptly.",
      },
      {
        id: "m-4",
        name: "Tab. Aspirin (Ecosprin)",
        strength: "75mg",
        dosage: "0-1-0",
        frequency: "Once daily after lunch",
        duration: "30 Days",
        instructions: "Take with meal to avoid stomach upset.",
      },
      {
        id: "m-5",
        name: "Tab. Atorvastatin (Lipiget)",
        strength: "20mg",
        dosage: "0-0-1",
        frequency: "Once daily at bedtime",
        duration: "30 Days",
        instructions: "Strict low lipid diet.",
      },
    ],
    advice: "Perform 12-lead ECG and Lipid Profile tests. Rest adequately. Seek emergency care if severe chest pain recurs.",
    followUpDate: "2026-08-24",
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Senior Consultant Cardiologist",
    status: "Sent to Patient",
  },
];

export const initialLabRequests: LabRequest[] = [
  {
    id: "lab-301",
    requestNo: "LAB-2026-4401",
    patientId: "pat-201",
    patientName: "Tariqul Islam",
    patientAge: 54,
    testCategory: "Blood Tests",
    testName: "Full Lipid Profile (Total Cholesterol, HDL, LDL, Triglycerides)",
    requestedDate: "2026-08-14 09:15 AM",
    status: "Processing",
    urgency: "Urgent",
    notes: "Fasting sample collected at 08:00 AM.",
  },
  {
    id: "lab-302",
    requestNo: "LAB-2026-4402",
    patientId: "pat-203",
    patientName: "Rafiq Ahmed",
    patientAge: 61,
    testCategory: "Blood Tests",
    testName: "High-Sensitivity C-Reactive Protein (hs-CRP) & HbA1c",
    requestedDate: "2026-08-14 08:30 AM",
    status: "Report Ready",
    urgency: "Routine",
    resultSummary: "HbA1c: 6.8% (Fair Control), hs-CRP: 1.4 mg/L (Normal risk).",
  },
  {
    id: "lab-303",
    requestNo: "LAB-2026-4403",
    patientId: "pat-205",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    testCategory: "ECG",
    testName: "12-Lead Electrocardiogram & Cardiac Troponin-I",
    requestedDate: "2026-08-14 09:45 AM",
    status: "Sample Collected",
    urgency: "Emergency",
    notes: "STAT request for acute dyspnea evaluation.",
  },
  {
    id: "lab-304",
    requestNo: "LAB-2026-4404",
    patientId: "pat-202",
    patientName: "Amina Begum",
    patientAge: 42,
    testCategory: "Blood Tests",
    testName: "Serum Electrolytes (Na+, K+, Cl-) & Serum Creatinine",
    requestedDate: "2026-08-13 04:20 PM",
    status: "Report Ready",
    urgency: "Routine",
    resultSummary: "Na+: 139 mEq/L, K+: 4.2 mEq/L, Creatinine: 0.9 mg/dL (Normal).",
  },
];

export const initialDiagnosticRequests: DiagnosticRequest[] = [
  {
    id: "diag-501",
    requestNo: "DX-2026-101",
    patientId: "pat-201",
    patientName: "Tariqul Islam",
    patientAge: 54,
    diagnosticType: "X-Ray",
    testName: "Chest X-Ray PA View (Digital Radiography)",
    requestedDate: "2026-08-14 09:20 AM",
    status: "Processing",
    urgency: "Urgent",
    clinicalIndication: "Evaluate cardiomegaly or pulmonary congestion.",
  },
  {
    id: "diag-502",
    requestNo: "DX-2026-102",
    patientId: "pat-202",
    patientName: "Amina Begum",
    patientAge: 42,
    diagnosticType: "Ultrasound",
    testName: "2D Color Doppler Echocardiogram",
    requestedDate: "2026-08-13 11:00 AM",
    status: "Report Ready",
    urgency: "Routine",
    clinicalIndication: "Evaluate mitral regurgitation severity and ejection fraction.",
    resultSummary: "LVEF 62%. Posterior mitral valve leaflet prolapse with mild regurgitant jet.",
  },
  {
    id: "diag-503",
    requestNo: "DX-2026-103",
    patientId: "pat-205",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    diagnosticType: "CT",
    testName: "Coronary CT Angiogram",
    requestedDate: "2026-08-14 09:50 AM",
    status: "Scheduled",
    urgency: "Emergency",
    clinicalIndication: "Assess coronary lumen patency & graft viability.",
  },
];

export const initialMedicalReports: MedicalReport[] = [
  {
    id: "rep-701",
    reportNo: "REP-LAB-2026-09",
    patientId: "pat-203",
    patientName: "Rafiq Ahmed",
    type: "Laboratory",
    testName: "HbA1c & High-Sensitivity CRP",
    category: "Clinical Biochemistry",
    date: "2026-08-14",
    summary: "HbA1c: 6.8% (Reference: <5.7%), hs-CRP: 1.4 mg/L (Reference: <3.0 mg/L).",
    technicianName: "Dr. K. Alam, MD (Pathology)",
    findings: "Serum glucose control shows mild elevation. Inflammatory marker hs-CRP remains within acceptable limits post-PCI.",
    status: "Final",
    abnormalFlag: true,
  },
  {
    id: "rep-702",
    reportNo: "REP-DX-2026-14",
    patientId: "pat-202",
    patientName: "Amina Begum",
    type: "Diagnostic",
    testName: "2D Color Doppler Echocardiogram",
    category: "Cardiovascular Imaging",
    date: "2026-08-13",
    summary: "Normal LV systolic function (EF 62%). Mild posterior mitral valve prolapse.",
    technicianName: "Dr. R. Mitra, Consultant Radiologist",
    findings: "Left ventricle is non-dilated with preserved wall motion. Posterior leaflet prolapse seen with a mild eccentric regurgitation jet into LA. Right heart chambers within normal limits.",
    status: "Final",
    abnormalFlag: false,
  },
  {
    id: "rep-703",
    reportNo: "REP-LAB-2026-04",
    patientId: "pat-202",
    patientName: "Amina Begum",
    type: "Laboratory",
    testName: "Serum Electrolytes & Renal Panel",
    category: "Biochemistry",
    date: "2026-08-13",
    summary: "Sodium: 139 mEq/L, Potassium: 4.2 mEq/L, Creatinine: 0.9 mg/dL.",
    technicianName: "Dr. K. Alam, MD (Pathology)",
    findings: "All renal parameters and electrolyte balances are completely within normal physiological limits.",
    status: "Final",
    abnormalFlag: false,
  },
];

export const initialFollowUps: FollowUpItem[] = [
  {
    id: "fup-801",
    patientId: "pat-201",
    patientName: "Tariqul Islam",
    patientAge: 54,
    patientContact: "+1 (555) 492-1102",
    previousDiagnosis: "Essential Hypertension & Angina Evaluation",
    previousVisit: "2026-08-10",
    followUpDate: "2026-08-24",
    status: "Scheduled",
    notes: "Review Lipid profile & Chest X-Ray reports. Re-evaluate BP control.",
  },
  {
    id: "fup-802",
    patientId: "pat-203",
    patientName: "Rafiq Ahmed",
    patientAge: 61,
    patientContact: "+1 (555) 902-3811",
    previousDiagnosis: "Ischemic Heart Disease (Post-Stent)",
    previousVisit: "2026-07-18",
    followUpDate: "2026-08-18",
    status: "Reminded",
    notes: "Regular 6-month post-PCI follow-up. Check medication tolerance.",
  },
  {
    id: "fup-803",
    patientId: "pat-204",
    patientName: "Farhana Yasmin",
    patientAge: 36,
    patientContact: "+1 (555) 219-4820",
    previousDiagnosis: "Sinus Tachycardia",
    previousVisit: "2026-07-20",
    followUpDate: "2026-08-20",
    status: "Scheduled",
    notes: "Review symptom journal & stress management progress.",
  },
];

export const initialNotifications: DoctorNotification[] = [
  {
    id: "notif-1",
    title: "Lab Report Ready",
    message: "HbA1c & hs-CRP report for Rafiq Ahmed is ready for review.",
    timestamp: "10 min ago",
    type: "lab",
    read: false,
  },
  {
    id: "notif-2",
    title: "Patient Checked In",
    message: "Amina Begum has checked in for 09:30 AM appointment.",
    timestamp: "25 min ago",
    type: "appointment",
    read: false,
  },
  {
    id: "notif-3",
    title: "Emergency Consultation Request",
    message: "Kamrul Hasan (Acute shortness of breath) assigned to emergency slot.",
    timestamp: "45 min ago",
    type: "patient",
    read: false,
  },
  {
    id: "notif-4",
    title: "Diagnostic Imaging Complete",
    message: "2D Echo Doppler report for Amina Begum uploaded by Radiology.",
    timestamp: "2 hours ago",
    type: "diagnostic",
    read: true,
  },
];
