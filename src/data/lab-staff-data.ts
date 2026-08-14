/**
 * Types & Schema Definitions for MediQ Laboratory Staff Dashboard.
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

// Initial Data Structures (Dynamic & Populated via Database)
export const initialLabStaffProfile: LabStaffProfile = {
  id: "",
  name: "",
  avatar: "",
  licenseNo: "",
  role: "",
  department: "",
  hospital: "",
  email: "",
  phone: "",
};

export const initialLabOrders: LabTestOrder[] = [];
export const initialProcessingItems: LabProcessingItem[] = [];
export const initialResultParameters: LabResultParameter[] = [];
export const initialLabCatalog: LabCatalogItem[] = [];
