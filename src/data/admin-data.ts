/**
 * Types & Schema Definitions for MediQ Super Admin Dashboard.
 */

export interface AdminProfile {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  role: string;
  department: string;
  hospitalNetwork: string;
  email: string;
  phone: string;
}

export type UserRole =
  | "Super Admin"
  | "Doctor"
  | "Patient"
  | "Nurse"
  | "Pharmacist"
  | "Blood Bank Staff"
  | "Ambulance Driver"
  | "Receptionist"
  | "Lab Staff"
  | "Lab Tech";

export type UserStatus =
  | "Active"
  | "Inactive"
  | "Suspended"
  | "Pending Verification";

export interface SystemUser {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registeredDate: string;
  lastActive: string;
  avatar: string;
}

export interface NetworkHospital {
  id: string;
  name: string;
  location: string;
  totalBeds: number;
  availableBeds: number;
  doctorCount: number;
  emergencyStatus: "Active" | "Busy" | "Divert";
  occupancyPercent: number;
  hasDiagnostics: boolean;
  hasPharmacy: boolean;
  hasBloodBank: boolean;
}

export interface AdminSOSItem {
  id: string;
  requestId: string;
  patientName: string;
  patientPhone: string;
  emergencyType: string;
  location: string;
  requestTime: string;
  ambulanceStatus: "En Route" | "Dispatched" | "Arrived" | "Completed" | "Going to Pickup";
  assignedDriver: string;
  eta: string;
  destinationHospital: string;
}

export interface AdminAuditLog {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  date: string;
  time: string;
  status: "Success" | "Warning" | "Denied";
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialAdminProfile: AdminProfile = {
  id: "adm-001",
  name: "System Administrator",
  avatar: "",
  badgeId: "ADMIN-01",
  role: "Super Admin",
  department: "Global Platform Command & Governance",
  hospitalNetwork: "MediQ Healthcare Network",
  email: "admin@mediq.health",
  phone: "+1 (555) 000-0000",
};

export const initialSystemUsers: SystemUser[] = [];
export const initialNetworkHospitals: NetworkHospital[] = [];
export const initialAdminSOS: AdminSOSItem[] = [];
export const initialAdminAuditLogs: AdminAuditLog[] = [];
