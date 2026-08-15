/**
 * MediQ Dynamic Doctor Schedule, Department Governance & Patient Capacity Store
 * Allows doctors to set consultation hours, patient limits, vacation mode, and enables visitor booking with serial numbers.
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
  consultationFee?: number;
  onVacation?: boolean;
}

export interface DepartmentItem {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  description: string;
  doctorCount: number;
}

export const defaultDepartments: DepartmentItem[] = [
  { id: "dep-1", name: "Cardiology", code: "CARD", headOfDepartment: "Dr. Sarah Rahman", description: "Comprehensive cardiovascular care and heart surgery", doctorCount: 4 },
  { id: "dep-2", name: "Neurology", code: "NEURO", headOfDepartment: "Dr. Alex Chen", description: "Advanced brain, spine and neurological disorders care", doctorCount: 3 },
  { id: "dep-3", name: "Pediatrics", code: "PEDI", headOfDepartment: "Dr. Elena Rostova", description: "Child healthcare, neonatology and pediatric surgery", doctorCount: 5 },
  { id: "dep-4", name: "Orthopedics", code: "ORTHO", headOfDepartment: "Dr. Sabbir Chowdhury", description: "Bone, joint replacement and sports medicine", doctorCount: 3 },
  { id: "dep-5", name: "Dermatology", code: "DERM", headOfDepartment: "Dr. Farhana Islam", description: "Skin, hair and cosmetic clinical treatments", doctorCount: 2 },
  { id: "dep-6", name: "General Surgery", code: "SURG", headOfDepartment: "Dr. Rezaul Karim", description: "General, laparoscopic and emergency surgical procedures", doctorCount: 6 },
  { id: "dep-7", name: "Gynecology", code: "GYNE", headOfDepartment: "Dr. Momena Begum", description: "Obstetrics, women health and maternal care", doctorCount: 4 },
  { id: "dep-8", name: "ENT", code: "ENT", headOfDepartment: "Dr. Asif Mahmood", description: "Ear, nose, throat and head-neck surgery", doctorCount: 2 },
  { id: "dep-9", name: "Oncology", code: "ONCO", headOfDepartment: "Dr. Imran Hossain", description: "Cancer care, chemotherapy and radiation oncology", doctorCount: 3 },
  { id: "dep-10", name: "Emergency Medicine", code: "EMER", headOfDepartment: "Dr. Mahmudul Hasan", description: "Trauma center and 24/7 critical emergency response", doctorCount: 8 },
];

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
    consultationFee: 50,
    onVacation: false,
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
    consultationFee: 50,
    onVacation: false,
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
    consultationFee: 65,
    onVacation: false,
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
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    consultationFee: 40,
    onVacation: false,
  },
  "d1": {
    doctorId: "d1",
    doctorName: "Dr. Ayesha Rahman",
    specialization: "Interventional Cardiologist",
    department: "Cardiology",
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 5,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Saturday"],
    consultationFee: 60,
    onVacation: false,
  },
  "d2": {
    doctorId: "d2",
    doctorName: "Dr. Imran Hossain",
    specialization: "Cardiac Electrophysiologist",
    department: "Cardiology",
    startTime: "10:00 AM",
    endTime: "05:00 PM",
    dailyPatientLimit: 18,
    currentBookedCount: 3,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    consultationFee: 55,
    onVacation: false,
  },
  "d3": {
    doctorId: "d3",
    doctorName: "Dr. Nabila Karim",
    specialization: "Consultant Neurologist",
    department: "Neurology",
    startTime: "09:30 AM",
    endTime: "03:30 PM",
    dailyPatientLimit: 15,
    currentBookedCount: 4,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Wednesday", "Thursday", "Saturday"],
    consultationFee: 70,
    onVacation: false,
  },
  "d4": {
    doctorId: "d4",
    doctorName: "Dr. Tanvir Ahmed",
    specialization: "Stroke Specialist",
    department: "Neurology",
    startTime: "11:00 AM",
    endTime: "06:00 PM",
    dailyPatientLimit: 16,
    currentBookedCount: 7,
    isAcceptingBookings: true,
    workingDays: ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    consultationFee: 65,
    onVacation: false,
  },
  "d5": {
    doctorId: "d5",
    doctorName: "Dr. Sabbir Chowdhury",
    specialization: "Joint Replacement Surgeon",
    department: "Orthopedics",
    startTime: "08:00 AM",
    endTime: "02:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 8,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Tuesday", "Thursday", "Saturday"],
    consultationFee: 50,
    onVacation: false,
  },
  "d6": {
    doctorId: "d6",
    doctorName: "Dr. Farhana Islam",
    specialization: "Clinical Dermatologist",
    department: "Dermatology",
    startTime: "10:00 AM",
    endTime: "04:30 PM",
    dailyPatientLimit: 22,
    currentBookedCount: 9,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    consultationFee: 45,
    onVacation: false,
  },
  "d7": {
    doctorId: "d7",
    doctorName: "Dr. Mahmudul Hasan",
    specialization: "Consultant Pediatrician",
    department: "Pediatrics",
    startTime: "09:00 AM",
    endTime: "03:00 PM",
    dailyPatientLimit: 25,
    currentBookedCount: 10,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Wednesday", "Thursday", "Friday", "Saturday"],
    consultationFee: 40,
    onVacation: false,
  },
  "d8": {
    doctorId: "d8",
    doctorName: "Dr. Rezaul Karim",
    specialization: "Internal Medicine",
    department: "General Medicine",
    startTime: "08:30 AM",
    endTime: "04:30 PM",
    dailyPatientLimit: 30,
    currentBookedCount: 14,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
    consultationFee: 35,
    onVacation: false,
  },
  "d9": {
    doctorId: "d9",
    doctorName: "Dr. Shirin Akter",
    specialization: "Oral & Dental Surgeon",
    department: "Dentistry",
    startTime: "10:30 AM",
    endTime: "05:30 PM",
    dailyPatientLimit: 18,
    currentBookedCount: 6,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Saturday", "Sunday"],
    consultationFee: 45,
    onVacation: false,
  },
  "d10": {
    doctorId: "d10",
    doctorName: "Dr. Momena Begum",
    specialization: "Obstetrics & Gynecology",
    department: "Gynecology",
    startTime: "09:00 AM",
    endTime: "04:00 PM",
    dailyPatientLimit: 20,
    currentBookedCount: 7,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Thursday", "Friday", "Saturday"],
    consultationFee: 55,
    onVacation: false,
  },
  "d11": {
    doctorId: "d11",
    doctorName: "Dr. Asif Mahmood",
    specialization: "ENT & Head-Neck Surgeon",
    department: "ENT",
    startTime: "09:30 AM",
    endTime: "03:30 PM",
    dailyPatientLimit: 16,
    currentBookedCount: 5,
    isAcceptingBookings: true,
    workingDays: ["Sunday", "Monday", "Wednesday", "Thursday", "Saturday"],
    consultationFee: 50,
    onVacation: false,
  },
  "d12": {
    doctorId: "d12",
    doctorName: "Dr. Care Team",
    specialization: "General Consultation",
    department: "Other",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    dailyPatientLimit: 40,
    currentBookedCount: 15,
    isAcceptingBookings: true,
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    consultationFee: 25,
    onVacation: false,
  },
};

const STORAGE_KEY = "mediq_doctor_schedules_v1";
const DEPARTMENTS_STORAGE_KEY = "mediq_departments_v2";

export function getDoctorSchedules(): Record<string, DoctorScheduleConfig> {
  if (typeof window === "undefined") return defaultDoctorSchedules;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultDoctorSchedules));
      return defaultDoctorSchedules;
    }
    const parsed = JSON.parse(raw);
    return { ...defaultDoctorSchedules, ...parsed };
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

export function toggleDoctorVacation(doctorId: string, onVacation: boolean): Record<string, DoctorScheduleConfig> {
  const schedules = getDoctorSchedules();
  const targetId = schedules[doctorId] ? doctorId : "doc-101";
  const doc = schedules[targetId];
  if (doc) {
    doc.onVacation = onVacation;
    doc.isAcceptingBookings = !onVacation;
    return updateDoctorSchedule(doc);
  }
  return schedules;
}

export function incrementDoctorBookings(doctorId: string): number {
  const schedules = getDoctorSchedules();
  const doc = schedules[doctorId] || schedules["doc-101"];
  const newCount = (doc.currentBookedCount || 0) + 1;
  doc.currentBookedCount = newCount;
  updateDoctorSchedule(doc);
  return newCount;
}

export function getDepartments(): DepartmentItem[] {
  if (typeof window === "undefined") return defaultDepartments;
  try {
    const raw = localStorage.getItem(DEPARTMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(defaultDepartments));
      return defaultDepartments;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultDepartments;
  }
}

export function saveDepartments(deps: DepartmentItem[]): DepartmentItem[] {
  try {
    localStorage.setItem(DEPARTMENTS_STORAGE_KEY, JSON.stringify(deps));
    window.dispatchEvent(new Event("mediq_departments_updated"));
  } catch (e) {
    console.error("Failed to save departments:", e);
  }
  return deps;
}

/**
 * Checks if a date falls on a doctor's scheduled working day
 */
export function isDoctorAvailableOnDay(workingDays: string[] | undefined, date: Date): boolean {
  if (!workingDays || workingDays.length === 0 || workingDays.includes("Everyday") || workingDays.length >= 7) {
    return true;
  }
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  return workingDays.includes(dayName);
}

/**
 * Generates 30-minute time slots dynamically from startTime to endTime
 */
export function generateDoctorTimeSlots(startTimeStr?: string, endTimeStr?: string): string[] {
  if (!startTimeStr || !endTimeStr) {
    return ["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "04:00 PM", "04:30 PM", "05:00 PM"];
  }

  const parseTimeToMinutes = (t: string) => {
    const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!match) return 540;
    let hours = parseInt(match[1], 10);
    const mins = parseInt(match[2], 10);
    const period = match[3].toUpperCase();
    if (period === "PM" && hours < 12) hours += 12;
    if (period === "AM" && hours === 12) hours = 0;
    return hours * 60 + mins;
  };

  const formatMinutesToTime = (mins: number) => {
    let h = Math.floor(mins / 60);
    const m = mins % 60;
    const period = h >= 12 ? "PM" : "AM";
    if (h > 12) h -= 12;
    if (h === 0) h = 12;
    const hStr = String(h).padStart(2, "0");
    const mStr = String(m).padStart(2, "0");
    return `${hStr}:${mStr} ${period}`;
  };

  const startMins = parseTimeToMinutes(startTimeStr);
  const endMins = parseTimeToMinutes(endTimeStr);
  const slots: string[] = [];

  for (let m = startMins; m <= endMins - 30; m += 30) {
    slots.push(formatMinutesToTime(m));
  }

  return slots.length > 0 ? slots : ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"];
}

/**
 * Booked slot tracking by doctor and date
 */
export function getBookedSlotsForDoctorAndDate(doctorId: string, dateStr: string): string[] {
  if (typeof window === "undefined" || !doctorId || !dateStr) return [];
  try {
    const raw = localStorage.getItem(`mediq_booked_slots_${doctorId}_${dateStr}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function markSlotBooked(doctorId: string, dateStr: string, slot: string): void {
  if (typeof window === "undefined" || !doctorId || !dateStr || !slot) return;
  try {
    const current = getBookedSlotsForDoctorAndDate(doctorId, dateStr);
    if (!current.includes(slot)) {
      current.push(slot);
      localStorage.setItem(`mediq_booked_slots_${doctorId}_${dateStr}`, JSON.stringify(current));
      window.dispatchEvent(new Event("mediq_slots_updated"));
    }
  } catch (e) {}
}
