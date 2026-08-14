/**
 * Types & Schema Definitions for MediQ Ambulance Driver Dashboard.
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

// Initial Data Structures (Dynamic & Populated via Database)
export const initialAmbulanceDriverProfile: AmbulanceDriverProfile = {
  id: "",
  name: "",
  avatar: "",
  phone: "",
  assignedAmbulance: "",
  vehicleNumber: "",
  dutyStatus: "Off Duty",
  driverStatus: "Available",
  hospital: "",
};

export const initialActiveTrip: ActiveEmergencyTrip | null = null;

export const initialTripHistory: CompletedTripHistory[] = [];
