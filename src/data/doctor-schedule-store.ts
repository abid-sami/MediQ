/**
 * MediQ Dynamic Doctor Schedule & Patient Capacity Store
 * Allows doctors to set consultation hours, patient limits, and enables visitor booking with serial numbers.
 */

export interface DoctorScheduleConfig {
  doctorId: string;
  doctorName: string;
  specialization: string;
  department: string;
  startTime: string; // e.g. "09:00 AM"
  endTime: string; // e.g. "05:00 PM"
  dailyPatientLimit: number; // e.g. 20
  currentBookedCount: number; // e.g. 6
  isAcceptingBookings: boolean;
  workingDays: string[];
}

export const defaultDoctorSchedules: Record<string, DoctorScheduleConfig> = {
  "doc-101": {
    doctorId: "doc-101",
    doctorName: "Dr. Sarah Rahman",
    specialization: "Senior Consultant Cardiologist",
    department: "Cardiology",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 6,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
  },
  "doc-1": {
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Rahman",
    specialization: "Senior Consultant Cardiologist",
    department: "Cardiology",
    startTime: "09:00 AM",
    endTime: "05:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 6,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
  },
  "doc-2": {
    doctorId: "doc-2",
    doctorName: "Dr. Alex Chen",
    specialization: "Neurologist",
    department: "Neurology",
    startTime: "10:00 AM",
    endTime: "04:00 PM",
    dailyPatientLimit: 15,
    currentBookedCount: 4,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Wednesday", "Friday"],
  },
  "doc-3": {
    doctorId: "doc-3",
    doctorName: "Dr. Elena Rostova",
    specialization: "Pediatrician",
    department: "Pediatrics",
    startTime: "08:30 AM",
    endTime: "02:30 PM",
    dailyPatientLimit: 25,
    currentBookedCount: 12,
    isAcceptingBookings: true,
    workingDays: ["Everyday"],
  },
};

const STORAGE_KEY = "mediq_doctor_schedules_v1";

export function getDoctorSchedules(): Record<string, DoctorScheduleConfig> {
  if (typeof window === "undefined") return defaultDoctorSchedules;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDoctorSchedules));
      return defaultDoctorSchedules;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultDoctorSchedules;
  }
}

export function updateDoctorSchedule(config: DoctorScheduleConfig): Record<string, DoctorScheduleConfig> {
  const current = getDoctorSchedules();
  current[config.doctorId] = config;
  if (config.doctorName === "Dr. Sarah Rahman") {
    current["doc-101"] = config;
    current["doc-1"] = config;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("mediq_schedule_updated"));
  } catch (e) {
    console.error("Failed to save doctor schedule to localStorage", e);
  }
  return current;
}

export function incrementDoctorBookings(doctorId: string): number {
  const schedules = getDoctorSchedules();
  const doc = schedules[doctorId] || schedules["doc-101"];
  const newCount = (doc.currentBookedCount || 0) + 1;
  doc.currentBookedCount = newCount;
  updateDoctorSchedule(doc);
  return newCount;
}
