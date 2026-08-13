/**
 * Mock data for MediQ Ambulance Driver Dashboard.
 * Driver: Tariqul Islam (Paramedic Driver, ALS Unit 911).
 */

export interface AmbulanceDriverProfile {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  assignedAmbulance: string;
  vehicleNumber: string;
  dutyStatus: "On Duty" | "Off Duty";
  driverStatus: "Available" | "On Trip";
  hospital: string;
}

export type EmergencyStepStatus =
  | "Request Received"
  | "Accepted"
  | "Going to Pickup"
  | "Patient Picked Up"
  | "Going to Hospital"
  | "Arrived"
  | "Completed";

export interface ActiveEmergencyTrip {
  id: string;
  requestId: string;
  emergencyType: string;
  patientName: string;
  patientPhone: string;
  pickupLocation: string;
  destinationHospital: string;
  distanceKm: number;
  etaMinutes: number;
  currentStep: EmergencyStepStatus;
  pickupCoords: { lat: number; lng: number };
  hospitalCoords: { lat: number; lng: number };
}

export interface CompletedTripHistory {
  id: string;
  requestId: string;
  date: string;
  pickupLocation: string;
  destinationHospital: string;
  durationMinutes: number;
  status: "Completed" | "Cancelled";
}

// Initial Data
export const initialAmbulanceDriverProfile: AmbulanceDriverProfile = {
  id: "drv-911",
  name: "Tariqul Islam",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
  phone: "+1 (555) 911-2094",
  assignedAmbulance: "Unit #ALS-911 (Advanced Cardiac Life Support)",
  vehicleNumber: "DHAKA-METRO-CHA-11-2094",
  dutyStatus: "On Duty",
  driverStatus: "On Trip",
  hospital: "MediQ Central Emergency & Trauma Center",
};

export const initialActiveTrip: ActiveEmergencyTrip = {
  id: "trip-911",
  requestId: "SOS-2026-9110",
  emergencyType: "🚨 Severe Chest Pain & Suspected Cardiac Arrest",
  patientName: "Kamrul Hasan",
  patientPhone: "+1 (555) 492-1102",
  pickupLocation: "House 42, Road 11, Block D, Mirpur 12, Dhaka",
  destinationHospital: "MediQ Central Heart Institute & Trauma Center",
  distanceKm: 3.4,
  etaMinutes: 6,
  currentStep: "Request Received",
  pickupCoords: { lat: 23.8103, lng: 90.4125 },
  hospitalCoords: { lat: 23.7806, lng: 90.4193 },
};

export const initialTripHistory: CompletedTripHistory[] = [
  {
    id: "hist-1",
    requestId: "SOS-2026-9088",
    date: "2026-08-13 (Yesterday)",
    pickupLocation: "Plot 15, Sector 7, Uttara, Dhaka",
    destinationHospital: "MediQ Central Emergency Department",
    durationMinutes: 14,
    status: "Completed",
  },
  {
    id: "hist-2",
    requestId: "SOS-2026-9054",
    date: "2026-08-12",
    pickupLocation: "Road 27, Banani, Dhaka",
    destinationHospital: "MediQ Heart & Vascular Center",
    durationMinutes: 11,
    status: "Completed",
  },
  {
    id: "hist-3",
    requestId: "SOS-2026-9011",
    date: "2026-08-10",
    pickupLocation: "Green Road, Dhanmondi, Dhaka",
    destinationHospital: "MediQ Central Emergency Center",
    durationMinutes: 18,
    status: "Completed",
  },
];
