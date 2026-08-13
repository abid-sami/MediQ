/**
 * Mock data for MediQ Super Admin Dashboard.
 * Administrator: Alex Vance (Director of Health Systems Engineering & Super Admin).
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
  | "Doctor"
  | "Patient"
  | "Nurse"
  | "Pharmacist"
  | "Blood Bank Staff"
  | "Ambulance Driver"
  | "Receptionist"
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
  ambulanceStatus: "En Route" | "Dispatched" | "Arrived" | "Completed";
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

// Initial Data
export const initialAdminProfile: AdminProfile = {
  id: "adm-001",
  name: "Alex Vance",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  badgeId: "SUPER-ADMIN-01",
  role: "Director of Health Systems Engineering",
  department: "Global Platform Command & Governance",
  hospitalNetwork: "MediQ International Healthcare Ecosystem",
  email: "alex.vance@mediq.health",
  phone: "+1 (555) 900-0001",
};

export const initialSystemUsers: SystemUser[] = [
  {
    id: "usr-101",
    userId: "USR-DOC-901",
    name: "Dr. Sarah Rahman",
    email: "sarah.rahman@mediq.health",
    phone: "+1 (555) 019-2831",
    role: "Doctor",
    status: "Active",
    registeredDate: "2025-06-10",
    lastActive: "2 mins ago",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-102",
    userId: "USR-PAT-902",
    name: "Sami",
    email: "sami@mediq.health",
    phone: "+1 (555) 234-5678",
    role: "Patient",
    status: "Active",
    registeredDate: "2026-07-01",
    lastActive: "5 mins ago",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-103",
    userId: "USR-NRS-903",
    name: "Elena Vance, RN",
    email: "elena.vance@mediq.health",
    phone: "+1 (555) 881-2093",
    role: "Nurse",
    status: "Active",
    registeredDate: "2025-08-15",
    lastActive: "Just now",
    avatar: "https://images.unsplash.com/photo-1594824813571-2153349aed06?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-104",
    userId: "USR-PHR-904",
    name: "Tariq Anwar, RPh",
    email: "tariq.anwar@mediq.health",
    phone: "+1 (555) 884-0921",
    role: "Pharmacist",
    status: "Active",
    registeredDate: "2025-11-20",
    lastActive: "12 mins ago",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-105",
    userId: "USR-BLD-905",
    name: "Rafiqul Islam",
    email: "rafiqul.islam@mediq.health",
    phone: "+1 (555) 902-1844",
    role: "Blood Bank Staff",
    status: "Active",
    registeredDate: "2026-01-05",
    lastActive: "18 mins ago",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-106",
    userId: "USR-DRV-906",
    name: "Tariqul Islam",
    email: "tariqul.driver@mediq.health",
    phone: "+1 (555) 911-2094",
    role: "Ambulance Driver",
    status: "Active",
    registeredDate: "2026-02-12",
    lastActive: "On Trip",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-107",
    userId: "USR-REC-907",
    name: "Sadia Islam",
    email: "sadia.islam@mediq.health",
    phone: "+1 (555) 601-2940",
    role: "Receptionist",
    status: "Active",
    registeredDate: "2026-03-01",
    lastActive: "Just now",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-108",
    userId: "USR-LAB-908",
    name: "Mahmudul Hasan, MS",
    email: "mahmudul.hasan@mediq.health",
    phone: "+1 (555) 704-9210",
    role: "Lab Tech",
    status: "Active",
    registeredDate: "2026-04-18",
    lastActive: "1 hour ago",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
  },
];

export const initialNetworkHospitals: NetworkHospital[] = [
  {
    id: "hosp-1",
    name: "MediQ Central Hospital & Heart Institute",
    location: "Dhanmondi, Dhaka",
    totalBeds: 250,
    availableBeds: 62,
    doctorCount: 84,
    emergencyStatus: "Active",
    occupancyPercent: 75.2,
    hasDiagnostics: true,
    hasPharmacy: true,
    hasBloodBank: true,
  },
  {
    id: "hosp-2",
    name: "MediQ Specialized Women & Children Hospital",
    location: "Uttara, Dhaka",
    totalBeds: 180,
    availableBeds: 41,
    doctorCount: 52,
    emergencyStatus: "Active",
    occupancyPercent: 77.2,
    hasDiagnostics: true,
    hasPharmacy: true,
    hasBloodBank: true,
  },
  {
    id: "hosp-3",
    name: "MediQ Emergency Trauma & Cardiac Center",
    location: "Mirpur, Dhaka",
    totalBeds: 120,
    availableBeds: 18,
    doctorCount: 38,
    emergencyStatus: "Busy",
    occupancyPercent: 85.0,
    hasDiagnostics: true,
    hasPharmacy: true,
    hasBloodBank: true,
  },
];

export const initialAdminSOS: AdminSOSItem[] = [
  {
    id: "sos-1",
    requestId: "SOS-2026-9110",
    patientName: "Kamrul Hasan",
    patientPhone: "+1 (555) 492-1102",
    emergencyType: "🚨 Severe Chest Pain / Cardiac Arrest",
    location: "Mirpur 12, Dhaka",
    requestTime: "10:42 PM",
    ambulanceStatus: "En Route",
    assignedDriver: "Tariqul Islam (Unit ALS-911)",
    eta: "6 Mins",
    destinationHospital: "MediQ Central Heart Institute",
  },
  {
    id: "sos-2",
    requestId: "SOS-2026-9122",
    patientName: "Polash Roy",
    patientPhone: "+1 (555) 880-1122",
    emergencyType: "🚨 Motor Vehicle Accident / Trauma",
    location: "Banani, Dhaka",
    requestTime: "10:38 PM",
    ambulanceStatus: "Dispatched",
    assignedDriver: "Unit #BLS-402",
    eta: "4 Mins",
    destinationHospital: "MediQ Emergency Trauma Center",
  },
];

export const initialAdminAuditLogs: AdminAuditLog[] = [
  {
    id: "log-1",
    user: "Dr. Sarah Rahman",
    role: "Doctor",
    action: "Viewed patient medical history for Kamrul Hasan",
    module: "Medical Records",
    date: "2026-08-14",
    time: "10:45 PM",
    status: "Success",
  },
  {
    id: "log-2",
    user: "Elena Vance, RN",
    role: "Nurse",
    action: "Updated vital signs (BP 142/90, HR 88) for Bed 402-B",
    module: "Ward & Bed Vitals",
    date: "2026-08-14",
    time: "10:40 PM",
    status: "Success",
  },
  {
    id: "log-3",
    user: "Tariq Anwar, RPh",
    role: "Pharmacist",
    action: "Verified e-Prescription #RX-2026-8091",
    module: "Pharmacy",
    date: "2026-08-14",
    time: "10:35 PM",
    status: "Success",
  },
  {
    id: "log-4",
    user: "Rafiqul Islam",
    role: "Blood Bank Staff",
    action: "Approved emergency unit reservation for O+ Blood",
    module: "Blood Bank",
    date: "2026-08-14",
    time: "10:31 PM",
    status: "Success",
  },
  {
    id: "log-5",
    user: "Tariqul Islam",
    role: "Ambulance Driver",
    action: "Accepted emergency dispatch request #SOS-2026-9110",
    module: "Ambulance SOS",
    date: "2026-08-14",
    time: "10:25 PM",
    status: "Success",
  },
];
