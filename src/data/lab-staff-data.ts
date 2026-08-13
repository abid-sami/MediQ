/**
 * Mock data for MediQ Laboratory Staff Dashboard.
 * Staff: Mahmudul Hasan, MS (Senior Clinical Pathologist & Technologist).
 */

export interface LabStaffProfile {
  id: string;
  name: string;
  avatar: string;
  licenseNo: string;
  role: string;
  department: string;
  hospital: string;
  email: string;
  phone: string;
}

export type LabTestOrderStatus =
  | "Requested"
  | "Sample Pending"
  | "Sample Collected"
  | "Processing"
  | "Report Ready"
  | "Completed";

export type TestPriority = "Normal" | "Urgent" | "STAT Emergency";

export interface LabTestOrder {
  id: string;
  testId: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  testName: string;
  category: string;
  priority: TestPriority;
  date: string;
  status: LabTestOrderStatus;
  sampleType: string;
  containerId?: string;
  collectionTime?: string;
}

export interface LabProcessingItem {
  id: string;
  testName: string;
  patientName: string;
  sampleId: string;
  technicianName: string;
  startedTime: string;
  expectedCompletion: string;
  status: "In Analyzer" | "Centrifuging" | "Review Pending" | "Completed";
}

export interface LabResultParameter {
  id: string;
  parameterName: string;
  measuredResult: string;
  referenceRange: string;
  units: string;
  status: "Normal" | "High" | "Low" | "Critical";
  notes?: string;
}

export interface LabCatalogItem {
  id: string;
  testName: string;
  category: string;
  price: number;
  sampleType: string;
  processingTimeHours: number;
  availability: "Available" | "Maintenance" | "Out of Reagents";
}

export const initialLabStaffProfile: LabStaffProfile = {
  id: "lab-7049",
  name: "Mahmudul Hasan, MS",
  avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
  licenseNo: "LAB-BD-70492",
  role: "Senior Clinical Pathologist & Lab Director",
  department: "Central Pathology & Diagnostic Biochemistry",
  hospital: "MediQ Central Healthcare Network",
  email: "mahmudul.hasan@mediq.health",
  phone: "+1 (555) 704-9210",
};

export const initialLabOrders: LabTestOrder[] = [
  {
    id: "lo-101",
    testId: "LAB-2026-801",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    doctorName: "Dr. Sarah Rahman",
    testName: "High-Sensitivity Cardiac Troponin I (hs-cTnI)",
    category: "Cardiology",
    priority: "STAT Emergency",
    date: "2026-08-14",
    status: "Processing",
    sampleType: "Venous Whole Blood",
    containerId: "BC-90881",
    collectionTime: "08:15 AM",
  },
  {
    id: "lo-102",
    testId: "LAB-2026-802",
    patientName: "Tariqul Islam",
    patientAge: 54,
    doctorName: "Dr. Sarah Rahman",
    testName: "Comprehensive Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)",
    category: "Biochemistry",
    priority: "Urgent",
    date: "2026-08-14",
    status: "Sample Pending",
    sampleType: "SST Serum Yellow Top",
  },
  {
    id: "lo-103",
    testId: "LAB-2026-803",
    patientName: "Nusrat Jahan",
    patientAge: 29,
    doctorName: "Dr. Sarah Rahman",
    testName: "Complete Blood Count (CBC) with ESR",
    category: "Hematology",
    priority: "Normal",
    date: "2026-08-14",
    status: "Report Ready",
    sampleType: "EDTA Purple Top",
    containerId: "BC-90885",
    collectionTime: "07:30 AM",
  },
  {
    id: "lo-104",
    testId: "LAB-2026-804",
    patientName: "Amina Begum",
    patientAge: 42,
    doctorName: "Dr. Sarah Rahman",
    testName: "Fasting Blood Glucose & HbA1c",
    category: "Biochemistry",
    priority: "Normal",
    date: "2026-08-13",
    status: "Completed",
    sampleType: "Fluoride Grey Top",
    containerId: "BC-90870",
    collectionTime: "08:00 AM",
  },
];

export const initialProcessingItems: LabProcessingItem[] = [
  {
    id: "pr-1",
    testName: "High-Sensitivity Cardiac Troponin I (hs-cTnI)",
    patientName: "Kamrul Hasan",
    sampleId: "BC-90881",
    technicianName: "Mahmudul Hasan, MS",
    startedTime: "08:20 AM",
    expectedCompletion: "09:00 AM",
    status: "In Analyzer",
  },
  {
    id: "pr-2",
    testName: "Comprehensive Lipid Profile",
    patientName: "Tariqul Islam",
    sampleId: "BC-90884",
    technicianName: "Lab Tech Joy",
    startedTime: "08:10 AM",
    expectedCompletion: "09:30 AM",
    status: "Centrifuging",
  },
];

export const initialResultParameters: LabResultParameter[] = [
  {
    id: "res-1",
    parameterName: "Cardiac Troponin I (hs-cTnI)",
    measuredResult: "42.5",
    referenceRange: "0.00 - 14.00",
    units: "pg/mL",
    status: "Critical",
    notes: "Elevated troponin indicates myocardial injury. Prescribing physician notified STAT.",
  },
  {
    id: "res-2",
    parameterName: "Total Cholesterol",
    measuredResult: "245.0",
    referenceRange: "125.0 - 200.0",
    units: "mg/dL",
    status: "High",
  },
  {
    id: "res-3",
    parameterName: "HDL Cholesterol",
    measuredResult: "38.0",
    referenceRange: "40.0 - 60.0",
    units: "mg/dL",
    status: "Low",
  },
  {
    id: "res-4",
    parameterName: "Fasting Blood Glucose",
    measuredResult: "95.0",
    referenceRange: "70.0 - 99.0",
    units: "mg/dL",
    status: "Normal",
  },
];

export const initialLabCatalog: LabCatalogItem[] = [
  {
    id: "cat-1",
    testName: "High-Sensitivity Cardiac Troponin I (hs-cTnI)",
    category: "Cardiology",
    price: 35.0,
    sampleType: "Venous Whole Blood",
    processingTimeHours: 1,
    availability: "Available",
  },
  {
    id: "cat-2",
    testName: "Comprehensive Lipid Profile",
    category: "Biochemistry",
    price: 25.0,
    sampleType: "SST Serum",
    processingTimeHours: 2,
    availability: "Available",
  },
  {
    id: "cat-3",
    testName: "Complete Blood Count (CBC) with ESR",
    category: "Hematology",
    price: 18.0,
    sampleType: "EDTA Whole Blood",
    processingTimeHours: 1,
    availability: "Available",
  },
  {
    id: "cat-4",
    testName: "HbA1c Glycated Hemoglobin",
    category: "Biochemistry",
    price: 22.0,
    sampleType: "EDTA Whole Blood",
    processingTimeHours: 2,
    availability: "Available",
  },
  {
    id: "cat-5",
    testName: "Renal Function Panel (BUN & Creatinine)",
    category: "Biochemistry",
    price: 28.0,
    sampleType: "SST Serum",
    processingTimeHours: 2,
    availability: "Available",
  },
];
