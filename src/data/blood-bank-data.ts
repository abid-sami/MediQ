/**
 * Types & Schema Definitions for MediQ Blood Bank Staff Dashboard.
 */

export interface BloodBankStaffProfile {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  role: string;
  facility: string;
  hospital: string;
  email: string;
  phone: string;
}

export type BloodGroupType = "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

export interface BloodGroupItem {
  group: BloodGroupType;
  availableUnits: number;
  reservedUnits: number;
  criticalThreshold: number;
  status: "Normal" | "Low" | "Critical";
}

export type RequestUrgency = "Normal" | "Urgent" | "Emergency";
export type RequestStatus = "Pending" | "Approved" | "Reserved" | "Fulfilled" | "Rejected";

export interface BloodRequestItem {
  id: string;
  requestId: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroupType;
  unitsNeeded: number;
  hospitalName: string;
  doctorName: string;
  requiredDate: string;
  urgency: RequestUrgency;
  status: RequestStatus;
  notes?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: BloodGroupType;
  phone: string;
  email: string;
  lastDonationDate: string;
  totalDonations: number;
  eligibilityStatus: "Eligible" | "Temporarily Deferred";
}

export interface BloodDonation {
  id: string;
  donorId: string;
  donorName: string;
  bloodGroup: BloodGroupType;
  unitsDonated: number;
  donationDate: string;
  labStatus: "Testing" | "Approved" | "Stored";
}

export interface BloodReservation {
  id: string;
  reservationId: string;
  patientName: string;
  bloodGroup: BloodGroupType;
  unitsReserved: number;
  hospitalName: string;
  reservedFor: string; // e.g., Surgery / ICU
  reservedUntil: string;
}

// Initial Data Structures (Dynamic & Populated via Database)
export const initialBloodBankStaffProfile: BloodBankStaffProfile = {
  id: "",
  name: "",
  avatar: "",
  badgeId: "",
  role: "",
  facility: "",
  hospital: "",
  email: "",
  phone: "",
};

export const initialBloodGroups: BloodGroupItem[] = [];
export const initialBloodRequests: BloodRequestItem[] = [];
export const initialDonors: BloodDonor[] = [];
export const initialDonations: BloodDonation[] = [];
export const initialReservations: BloodReservation[] = [];
