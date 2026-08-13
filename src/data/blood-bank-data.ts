/**
 * Mock data for the MediQ Blood Bank Staff Dashboard.
 * Officer: Rafiqul Islam, Blood Bank Manager.
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

// Initial Data
export const initialBloodBankStaffProfile: BloodBankStaffProfile = {
  id: "bb-9021",
  name: "Rafiqul Islam",
  avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
  badgeId: "BB-90218",
  role: "Blood Bank Operations Director",
  facility: "Central Transfusion & Blood Repository",
  hospital: "MediQ Healthcare Network",
  email: "rafiqul.islam@mediq.health",
  phone: "+1 (555) 902-1840",
};

export const initialBloodGroups: BloodGroupItem[] = [
  { group: "A+", availableUnits: 42, reservedUnits: 8, criticalThreshold: 15, status: "Normal" },
  { group: "A-", availableUnits: 12, reservedUnits: 4, criticalThreshold: 10, status: "Low" },
  { group: "B+", availableUnits: 55, reservedUnits: 12, criticalThreshold: 15, status: "Normal" },
  { group: "B-", availableUnits: 9, reservedUnits: 3, criticalThreshold: 10, status: "Low" },
  { group: "AB+", availableUnits: 28, reservedUnits: 5, criticalThreshold: 10, status: "Normal" },
  { group: "AB-", availableUnits: 4, reservedUnits: 2, criticalThreshold: 8, status: "Critical" },
  { group: "O+", availableUnits: 64, reservedUnits: 15, criticalThreshold: 20, status: "Normal" },
  { group: "O-", availableUnits: 3, reservedUnits: 2, criticalThreshold: 12, status: "Critical" },
];

export const initialBloodRequests: BloodRequestItem[] = [
  {
    id: "req-1",
    requestId: "REQ-2026-901",
    patientName: "Kamrul Hasan",
    patientAge: 68,
    bloodGroup: "O-",
    unitsNeeded: 2,
    hospitalName: "MediQ Central Heart Institute — ICU Bed 402-B",
    doctorName: "Dr. Sarah Rahman",
    requiredDate: "2026-08-14 (STAT)",
    urgency: "Emergency",
    status: "Pending",
    notes: "Emergency cardiac surgery clearance. Universal O- donor units required immediately.",
  },
  {
    id: "req-2",
    requestId: "REQ-2026-902",
    patientName: "Tariqul Islam",
    patientAge: 54,
    bloodGroup: "O+",
    unitsNeeded: 1,
    hospitalName: "MediQ Central Hospital — Ward 4A",
    doctorName: "Dr. Sarah Rahman",
    requiredDate: "2026-08-14",
    urgency: "Urgent",
    status: "Approved",
    notes: "Post-op hemoglobin stabilization.",
  },
  {
    id: "req-3",
    requestId: "REQ-2026-903",
    patientName: "Sami",
    patientAge: 32,
    bloodGroup: "O+",
    unitsNeeded: 1,
    hospitalName: "MediQ Outpatient Surgery Center",
    doctorName: "Dr. Sarah Rahman",
    requiredDate: "2026-08-15",
    urgency: "Normal",
    status: "Reserved",
    notes: "Standby reservation for elective procedure.",
  },
  {
    id: "req-4",
    requestId: "REQ-2026-904",
    patientName: "Amina Begum",
    patientAge: 42,
    bloodGroup: "A+",
    unitsNeeded: 2,
    hospitalName: "City Care General Hospital",
    doctorName: "Dr. Tanvir Ahmed",
    requiredDate: "2026-08-13",
    urgency: "Normal",
    status: "Fulfilled",
  },
];

export const initialDonors: BloodDonor[] = [
  {
    id: "dn-101",
    name: "Arif Chowdhury",
    bloodGroup: "O-",
    phone: "+1 (555) 301-4411",
    email: "arif.c@gmail.com",
    lastDonationDate: "2026-04-10",
    totalDonations: 8,
    eligibilityStatus: "Eligible",
  },
  {
    id: "dn-102",
    name: "Tanvir Hossain",
    bloodGroup: "AB-",
    phone: "+1 (555) 402-5522",
    email: "tanvir.hossain@yahoo.com",
    lastDonationDate: "2026-03-15",
    totalDonations: 5,
    eligibilityStatus: "Eligible",
  },
  {
    id: "dn-103",
    name: "Mahmuda Akter",
    bloodGroup: "O+",
    phone: "+1 (555) 503-6633",
    email: "mahmuda.a@outlook.com",
    lastDonationDate: "2026-07-20",
    totalDonations: 12,
    eligibilityStatus: "Temporarily Deferred",
  },
  {
    id: "dn-104",
    name: "Samiur Rahman",
    bloodGroup: "A+",
    phone: "+1 (555) 604-7744",
    email: "samiur.r@gmail.com",
    lastDonationDate: "2026-02-01",
    totalDonations: 14,
    eligibilityStatus: "Eligible",
  },
];

export const initialDonations: BloodDonation[] = [
  {
    id: "dnt-1",
    donorId: "dn-101",
    donorName: "Arif Chowdhury",
    bloodGroup: "O-",
    unitsDonated: 1,
    donationDate: "2026-08-14",
    labStatus: "Testing",
  },
  {
    id: "dnt-2",
    donorId: "dn-104",
    donorName: "Samiur Rahman",
    bloodGroup: "A+",
    unitsDonated: 1,
    donationDate: "2026-08-14",
    labStatus: "Approved",
  },
  {
    id: "dnt-3",
    donorId: "dn-102",
    donorName: "Tanvir Hossain",
    bloodGroup: "AB-",
    unitsDonated: 1,
    donationDate: "2026-08-12",
    labStatus: "Stored",
  },
];

export const initialReservations: BloodReservation[] = [
  {
    id: "res-1",
    reservationId: "RES-2026-401",
    patientName: "Sami",
    bloodGroup: "O+",
    unitsReserved: 1,
    hospitalName: "MediQ Outpatient Surgery",
    reservedFor: "Elective Surgery",
    reservedUntil: "2026-08-16",
  },
  {
    id: "res-2",
    reservationId: "RES-2026-402",
    patientName: "Tariqul Islam",
    bloodGroup: "O+",
    unitsReserved: 2,
    hospitalName: "MediQ Central Hospital Ward 4A",
    reservedFor: "Post-PCI Procedure",
    reservedUntil: "2026-08-15",
  },
];
