/**
 * Mock data for MediQ Receptionist Dashboard.
 * Receptionist: Sadia Islam (Head of Patient Access & Front Desk).
 */

export interface ReceptionistProfile {
  id: string;
  name: string;
  avatar: string;
  badgeId: string;
  role: string;
  deskLocation: string;
  hospital: string;
  email: string;
  phone: string;
}

export interface RegisteredPatient {
  id: string;
  patientId: string;
  name: string;
  phone: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  medicalNotes: string;
  registeredDate: string;
}

export type AppointmentStatus =
  | "Requested"
  | "Confirmed"
  | "Checked In"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export interface ReceptionAppointment {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  status: AppointmentStatus;
}

export interface DoctorQueueItem {
  id: string;
  doctorName: string;
  department: string;
  roomNo: string;
  currentPatient?: string;
  waitingCount: number;
  nextPatient?: string;
  status: "In Consultation" | "Available" | "Busy" | "On Break";
}

export interface HospitalAdmission {
  id: string;
  admissionId: string;
  patientName: string;
  department: string;
  wardName: string;
  bedNo: string;
  bedType: "General" | "ICU" | "CCU" | "Cabin" | "Emergency";
  admissionTime: string;
  attendingDoctor: string;
}

export interface BedCategoryAvailability {
  category: "General" | "ICU" | "CCU" | "Cabin" | "Emergency";
  totalBeds: number;
  occupied: number;
  available: number;
}

export interface ReceptionBill {
  id: string;
  billId: string;
  patientName: string;
  services: string[];
  amount: number;
  paymentStatus: "Paid" | "Pending" | "Overdue";
  date: string;
}

// Initial Data
export const initialReceptionistProfile: ReceptionistProfile = {
  id: "rec-6012",
  name: "Sadia Islam",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  badgeId: "REC-60129",
  role: "Head of Patient Access & Main Lobby Desk",
  deskLocation: "Desk #1 — Main Lobby Entrance",
  hospital: "MediQ Central Hospital Network",
  email: "sadia.islam@mediq.health",
  phone: "+1 (555) 601-2940",
};

export const initialRegisteredPatients: RegisteredPatient[] = [
  {
    id: "pat-1",
    patientId: "PAT-2026-9021",
    name: "Kamrul Hasan",
    phone: "+1 (555) 492-1102",
    dob: "1958-04-12",
    age: 68,
    gender: "Male",
    bloodGroup: "O-",
    address: "House 42, Road 11, Block D, Mirpur 12, Dhaka",
    emergencyContact: "+1 (555) 492-9988 (Son: Rahat)",
    medicalNotes: "History of Congestive Heart Failure, Hypertension. Codeine Allergy.",
    registeredDate: "2026-01-15",
  },
  {
    id: "pat-2",
    patientId: "PAT-2026-9022",
    name: "Tariqul Islam",
    phone: "+1 (555) 492-1102",
    dob: "1972-09-05",
    age: 54,
    gender: "Male",
    bloodGroup: "O+",
    address: "Apartment 4B, Green Road, Dhanmondi, Dhaka",
    emergencyContact: "+1 (555) 301-4411 (Wife: Salma)",
    medicalNotes: "Post-PCI Stenting. Penicillin Allergy.",
    registeredDate: "2026-03-20",
  },
  {
    id: "pat-3",
    patientId: "PAT-2026-9023",
    name: "Nusrat Jahan",
    phone: "+1 (555) 603-1284",
    dob: "1997-02-18",
    age: 29,
    gender: "Female",
    bloodGroup: "B+",
    address: "Sector 7, Uttara, Dhaka",
    emergencyContact: "+1 (555) 603-9900 (Husband: Farhan)",
    medicalNotes: "Routine Executive Health Screening.",
    registeredDate: "2026-05-10",
  },
  {
    id: "pat-4",
    patientId: "PAT-2026-9024",
    name: "Sami",
    phone: "+1 (555) 234-5678",
    dob: "1994-06-30",
    age: 32,
    gender: "Male",
    bloodGroup: "O+",
    address: "Banani Lakefront, Dhaka",
    emergencyContact: "+1 (555) 234-9999",
    medicalNotes: "No known drug allergies.",
    registeredDate: "2026-07-01",
  },
];

export const initialReceptionAppointments: ReceptionAppointment[] = [
  {
    id: "apt-1",
    appointmentId: "APT-2026-701",
    patientId: "PAT-2026-9021",
    patientName: "Kamrul Hasan",
    patientPhone: "+1 (555) 492-1102",
    doctorName: "Dr. Sarah Rahman",
    department: "Cardiology",
    date: "2026-08-14",
    time: "09:00 AM",
    status: "Checked In",
  },
  {
    id: "apt-2",
    appointmentId: "APT-2026-702",
    patientId: "PAT-2026-9022",
    patientName: "Tariqul Islam",
    patientPhone: "+1 (555) 492-1102",
    doctorName: "Dr. Sarah Rahman",
    department: "Cardiology",
    date: "2026-08-14",
    time: "09:30 AM",
    status: "Confirmed",
  },
  {
    id: "apt-3",
    appointmentId: "APT-2026-703",
    patientId: "PAT-2026-9023",
    patientName: "Nusrat Jahan",
    patientPhone: "+1 (555) 603-1284",
    doctorName: "Dr. Sarah Rahman",
    department: "Cardiology",
    date: "2026-08-14",
    time: "10:00 AM",
    status: "Requested",
  },
  {
    id: "apt-4",
    appointmentId: "APT-2026-704",
    patientId: "PAT-2026-9024",
    patientName: "Sami",
    patientPhone: "+1 (555) 234-5678",
    doctorName: "Dr. Sarah Rahman",
    department: "Cardiology",
    date: "2026-08-14",
    time: "10:30 AM",
    status: "Confirmed",
  },
];

export const initialDoctorQueues: DoctorQueueItem[] = [
  {
    id: "dq-1",
    doctorName: "Dr. Sarah Rahman",
    department: "Cardiology",
    roomNo: "Room 302",
    currentPatient: "Kamrul Hasan",
    waitingCount: 3,
    nextPatient: "Tariqul Islam",
    status: "In Consultation",
  },
  {
    id: "dq-2",
    doctorName: "Dr. Tanvir Ahmed",
    department: "Neurology",
    roomNo: "Room 305",
    currentPatient: "None",
    waitingCount: 1,
    nextPatient: "Amina Begum",
    status: "Available",
  },
  {
    id: "dq-3",
    doctorName: "Dr. Nusrat Parveen",
    department: "Orthopedics",
    roomNo: "Room 208",
    currentPatient: "Rafiq Ahmed",
    waitingCount: 2,
    nextPatient: "Arif Chowdhury",
    status: "In Consultation",
  },
];

export const initialAdmissions: HospitalAdmission[] = [
  {
    id: "adm-1",
    admissionId: "ADM-2026-301",
    patientName: "Kamrul Hasan",
    department: "Cardiology Care Unit",
    wardName: "Ward 4A",
    bedNo: "Bed 402-B",
    bedType: "CCU",
    admissionTime: "08:15 AM Today",
    attendingDoctor: "Dr. Sarah Rahman",
  },
  {
    id: "adm-2",
    admissionId: "ADM-2026-302",
    patientName: "Tariqul Islam",
    department: "Cardiology Care Unit",
    wardName: "Ward 4A",
    bedNo: "Bed 401-A",
    bedType: "General",
    admissionTime: "Yesterday",
    attendingDoctor: "Dr. Sarah Rahman",
  },
];

export const initialBedCategories: BedCategoryAvailability[] = [
  { category: "General", totalBeds: 120, occupied: 86, available: 34 },
  { category: "ICU", totalBeds: 24, occupied: 19, available: 5 },
  { category: "CCU", totalBeds: 16, occupied: 12, available: 4 },
  { category: "Cabin", totalBeds: 40, occupied: 28, available: 12 },
  { category: "Emergency", totalBeds: 18, occupied: 8, available: 10 },
];

export const initialReceptionBills: ReceptionBill[] = [
  {
    id: "bill-101",
    billId: "INV-2026-801",
    patientName: "Kamrul Hasan",
    services: ["CCU Admission Charge", "Cardiac Troponin I Test", "IV Medication Admin"],
    amount: 180.0,
    paymentStatus: "Pending",
    date: "2026-08-14",
  },
  {
    id: "bill-102",
    billId: "INV-2026-802",
    patientName: "Sami",
    services: ["Specialist Consultation Fee (Dr. Sarah Rahman)", "ECG Test"],
    amount: 45.0,
    paymentStatus: "Pending",
    date: "2026-08-14",
  },
  {
    id: "bill-103",
    billId: "INV-2026-803",
    patientName: "Nusrat Jahan",
    services: ["General OPD Consultation"],
    amount: 30.0,
    paymentStatus: "Paid",
    date: "2026-08-14",
  },
];
