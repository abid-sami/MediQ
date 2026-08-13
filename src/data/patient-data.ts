/**
 * Mock data for the MediQ Patient Dashboard (Patient: Sami).
 */

export interface PatientUserProfile {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: string;
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
}

export interface DoctorCard {
  id: string;
  name: string;
  avatar: string;
  specialization: string;
  category: string;
  experience: string;
  hospital: string;
  consultationFee: number;
  rating: number;
  reviewsCount: number;
  availableDays: string[];
  availableTime: string;
}

export interface PatientAppointment {
  id: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar: string;
  category: string;
  hospital: string;
  date: string;
  time: string;
  status: "Confirmed" | "Completed" | "Cancelled" | "Rescheduled";
  reason: string;
  fee: number;
}

export interface MedicalRecordItem {
  id: string;
  date: string;
  title: string;
  type: "Consultation" | "Diagnosis" | "Prescription" | "Lab Report" | "Diagnostic" | "Hospital Visit" | "Admission" | "Follow-up";
  doctorName: string;
  facility: string;
  summary: string;
  status: string;
  reportUrl?: string;
}

export interface PatientPrescription {
  id: string;
  rxNo: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  diagnosis: string;
  medicines: {
    name: string;
    strength: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  advice: string;
  followUpDate: string;
}

export interface PatientLabTest {
  id: string;
  requisitionNo: string;
  testName: string;
  category: string;
  facility: string;
  bookedDate: string;
  status: "Booked" | "Processing" | "Completed";
  resultSummary?: string;
  reportUrl?: string;
}

export interface PatientPharmacyOrder {
  id: string;
  orderNo: string;
  date: string;
  items: { name: string; qty: number; price: number }[];
  totalPrice: number;
  prescriptionRequired: boolean;
  prescriptionVerified: boolean;
  status: "Processing" | "Out for Delivery" | "Delivered" | "Ready for Pickup";
  deliveryAddress: string;
}

export interface PatientBloodRequest {
  id: string;
  requestId: string;
  bloodGroup: string;
  unitsNeeded: number;
  hospital: string;
  urgency: "Routine" | "Urgent" | "Emergency";
  requestedDate: string;
  status: "Pending" | "Approved" | "Dispatched" | "Fulfilled";
}

export interface ActiveAmbulance {
  id: string;
  requestId: string;
  status: "Assigned" | "En Route" | "Arrived" | "Completed";
  driverName: string;
  driverPhone: string;
  ambulanceUnit: string;
  ambulanceType: string;
  pickupLocation: string;
  destination: string;
  etaMinutes: number;
}

export interface PatientBill {
  id: string;
  invoiceNo: string;
  serviceName: string;
  date: string;
  amount: number;
  status: "Paid" | "Unpaid" | "Overdue";
  dueDate: string;
  category: "Consultation" | "Pharmacy" | "Diagnostics" | "Hospital Admission";
}

export interface PatientNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "appointment" | "prescription" | "lab" | "pharmacy" | "blood" | "sos";
  read: boolean;
}

// Initial Patient Profile (Sami)
export const initialPatientUser: PatientUserProfile = {
  id: "pat-1001",
  name: "Sami",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  age: 28,
  gender: "Male",
  bloodGroup: "O+",
  contact: "+1 (555) 234-5678",
  email: "sami.health@mediq.com",
  address: "House 42, Road 11, Dhanmondi, Dhaka",
  emergencyContact: {
    name: "Dr. Ayesha Rahman",
    relationship: "Family Guardian",
    phone: "+1 (555) 987-6543",
  },
  allergies: ["Penicillin"],
  chronicConditions: ["Mild Seasonal Asthma"],
};

export const sampleDoctors: DoctorCard[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Rahman",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    specialization: "Senior Consultant Cardiologist",
    category: "Cardiology",
    experience: "14 Years",
    hospital: "MediQ Heart & Vascular Institute",
    consultationFee: 80,
    rating: 4.9,
    reviewsCount: 128,
    availableDays: ["Mon", "Tue", "Thu", "Sat"],
    availableTime: "09:00 AM - 05:00 PM",
  },
  {
    id: "doc-2",
    name: "Dr. Nabila Karim",
    avatar: "https://images.unsplash.com/photo-1594824813566-88855ce78947?w=400&auto=format&fit=crop&q=80",
    specialization: "Consultant Neurologist",
    category: "Neurology",
    experience: "11 Years",
    hospital: "MediQ Central Neuroscience Unit",
    consultationFee: 75,
    rating: 4.8,
    reviewsCount: 94,
    availableDays: ["Mon", "Wed", "Fri"],
    availableTime: "10:00 AM - 04:00 PM",
  },
  {
    id: "doc-3",
    name: "Dr. Sabbir Chowdhury",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    specialization: "Orthopedic & Joint Surgeon",
    category: "Orthopedics",
    experience: "16 Years",
    hospital: "MediQ Orthopedic Hospital",
    consultationFee: 90,
    rating: 4.9,
    reviewsCount: 156,
    availableDays: ["Tue", "Thu", "Sat"],
    availableTime: "02:00 PM - 08:00 PM",
  },
  {
    id: "doc-4",
    name: "Dr. Farhana Islam",
    avatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80",
    specialization: "Clinical Dermatologist",
    category: "Dermatology",
    experience: "9 Years",
    hospital: "MediQ Skin & Wellness Clinic",
    consultationFee: 65,
    rating: 4.7,
    reviewsCount: 82,
    availableDays: ["Daily"],
    availableTime: "11:00 AM - 06:00 PM",
  },
];

export const initialPatientAppointments: PatientAppointment[] = [
  {
    id: "apt-p1",
    appointmentId: "MQ-APT-8821",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Rahman",
    doctorAvatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    category: "Cardiology",
    hospital: "MediQ Heart & Vascular Institute",
    date: "2026-08-18",
    time: "10:30 AM",
    status: "Confirmed",
    reason: "Routine Cardiac Routine & Echo Evaluation",
    fee: 80,
  },
  {
    id: "apt-p2",
    appointmentId: "MQ-APT-7410",
    doctorId: "doc-4",
    doctorName: "Dr. Farhana Islam",
    doctorAvatar: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80",
    category: "Dermatology",
    hospital: "MediQ Skin & Wellness Clinic",
    date: "2026-07-22",
    time: "03:00 PM",
    status: "Completed",
    reason: "Skin Allergy Consultation",
    fee: 65,
  },
];

export const initialMedicalRecords: MedicalRecordItem[] = [
  {
    id: "mr-1",
    date: "2026-08-01",
    title: "Cardiology Consultation & ECG Review",
    type: "Consultation",
    doctorName: "Dr. Sarah Rahman",
    facility: "MediQ Heart Center",
    summary: "Normal sinus rhythm. Mild resting tachycardia under high workload. Advised light exercise & hydration.",
    status: "Completed",
  },
  {
    id: "mr-2",
    date: "2026-08-01",
    title: "Full Lipid Profile & Cardiac Markers",
    type: "Lab Report",
    doctorName: "Dr. K. Alam (Pathology)",
    facility: "MediQ Central Laboratory",
    summary: "Total Cholesterol: 182 mg/dL (Normal). HDL: 48 mg/dL. Triglycerides: 135 mg/dL.",
    status: "Final",
  },
  {
    id: "mr-3",
    date: "2026-07-22",
    title: "Allergy Dermatitis Treatment Plan",
    type: "Prescription",
    doctorName: "Dr. Farhana Islam",
    facility: "MediQ Skin Clinic",
    summary: "Prescribed Cetirizine 10mg & Topical Hydrocortisone for seasonal skin rash.",
    status: "Active",
  },
  {
    id: "mr-4",
    date: "2026-05-14",
    title: "Chest X-Ray Digital PA View",
    type: "Diagnostic",
    doctorName: "Dr. R. Mitra (Radiology)",
    facility: "MediQ Imaging Hub",
    summary: "Clear lung fields, normal cardiothoracic ratio. No infiltrates.",
    status: "Final",
  },
];

export const initialPatientPrescriptions: PatientPrescription[] = [
  {
    id: "rx-p1",
    rxNo: "RX-2026-8801",
    doctorName: "Dr. Sarah Rahman",
    doctorSpecialization: "Senior Consultant Cardiologist",
    date: "2026-08-01",
    diagnosis: "Sinus Tachycardia — Routine Preventive Care",
    medicines: [
      {
        name: "Tab. Concor (Bisoprolol)",
        strength: "2.5mg",
        dosage: "0-0-1",
        frequency: "Once daily before sleep",
        duration: "30 Days",
        instructions: "Take with half glass of water. Monitor heart rate.",
      },
      {
        name: "Cap. Omeprazole",
        strength: "20mg",
        dosage: "1-0-0",
        frequency: "Once daily before breakfast",
        duration: "14 Days",
        instructions: "Swallow whole 30 minutes before meal.",
      },
    ],
    advice: "Drink at least 2.5L water daily. Avoid excessive caffeinated drinks and stay active.",
    followUpDate: "2026-08-18",
  },
];

export const initialPatientLabTests: PatientLabTest[] = [
  {
    id: "lab-p1",
    requisitionNo: "LAB-2026-9901",
    testName: "Full Lipid Profile & HbA1c",
    category: "Biochemistry",
    facility: "MediQ Central Laboratory",
    bookedDate: "2026-08-01",
    status: "Completed",
    resultSummary: "Fasting Glucose: 92 mg/dL. HbA1c: 5.4% (Normal). Lipid profile within optimal limit.",
  },
  {
    id: "lab-p2",
    requisitionNo: "LAB-2026-9908",
    testName: "2D Color Doppler Echocardiogram",
    category: "Cardiovascular Imaging",
    facility: "MediQ Imaging Hub",
    bookedDate: "2026-08-14",
    status: "Processing",
    resultSummary: "Sample & Doppler Scan under analysis by Senior Radiologist.",
  },
];

export const initialPatientPharmacyOrders: PatientPharmacyOrder[] = [
  {
    id: "ph-1",
    orderNo: "ORD-PH-2026-441",
    date: "2026-08-02",
    items: [
      { name: "Tab. Concor 2.5mg (Strip of 10)", qty: 3, price: 12.0 },
      { name: "Cap. Omeprazole 20mg (Strip of 10)", qty: 2, price: 8.0 },
    ],
    totalPrice: 20.0,
    prescriptionRequired: true,
    prescriptionVerified: true,
    status: "Delivered",
    deliveryAddress: "House 42, Road 11, Dhanmondi, Dhaka",
  },
];

export const initialPatientBloodRequests: PatientBloodRequest[] = [
  {
    id: "br-1",
    requestId: "BLD-REQ-2026-09",
    bloodGroup: "O+",
    unitsNeeded: 1,
    hospital: "MediQ Central Hospital",
    urgency: "Routine",
    requestedDate: "2026-08-10",
    status: "Approved",
  },
];

export const initialActiveAmbulance: ActiveAmbulance = {
  id: "amb-active-1",
  requestId: "SOS-AMB-2026-77",
  status: "En Route",
  driverName: "Rashed Mia",
  driverPhone: "+1 (555) 771-0022",
  ambulanceUnit: "AMB-ALS-104 (Advanced Life Support)",
  ambulanceType: "Cardiac ALS Unit",
  pickupLocation: "House 42, Road 11, Dhanmondi, Dhaka",
  destination: "MediQ Central Emergency Trauma Center",
  etaMinutes: 6,
};

export const initialPatientBills: PatientBill[] = [
  {
    id: "bill-1",
    invoiceNo: "INV-2026-901",
    serviceName: "Cardiology Consultation Fee (Dr. Sarah Rahman)",
    date: "2026-08-01",
    amount: 80.0,
    status: "Paid",
    dueDate: "2026-08-01",
    category: "Consultation",
  },
  {
    id: "bill-2",
    invoiceNo: "INV-2026-942",
    serviceName: "Full Lipid Profile & HbA1c Lab Requisition",
    date: "2026-08-01",
    amount: 45.0,
    status: "Unpaid",
    dueDate: "2026-08-20",
    category: "Diagnostics",
  },
];

export const initialPatientNotifications: PatientNotification[] = [
  {
    id: "pnotif-1",
    title: "Appointment Confirmed",
    message: "Your appointment with Dr. Sarah Rahman is confirmed for Aug 18 at 10:30 AM.",
    timestamp: "2 hours ago",
    type: "appointment",
    read: false,
  },
  {
    id: "pnotif-2",
    title: "Lab Report Ready",
    message: "Your Full Lipid Profile lab report is ready to download.",
    timestamp: "1 day ago",
    type: "lab",
    read: false,
  },
  {
    id: "pnotif-3",
    title: "Pharmacy Order Out for Delivery",
    message: "Order #ORD-PH-2026-441 has been delivered to your address.",
    timestamp: "2 days ago",
    type: "pharmacy",
    read: true,
  },
];
