/**
 * MediQ Dynamic Doctor Schedule, Department Governance & Patient Capacity Store
 * Allows doctors to set consultation hours, patient limits, vacation mode, and enables visitor booking with serial numbers.
 */

import { fetchSupabaseDepartments, fetchSupabaseProfiles } from "@/services/supabase-service";

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

export const defaultDepartments: DepartmentItem[] = [];

export const defaultDoctorSchedules: Record<string, DoctorScheduleConfig> = {};

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
  const doc = schedules[doctorId];
  if (doc) {
    doc.onVacation = onVacation;
    doc.isAcceptingBookings = !onVacation;
    return updateDoctorSchedule(doc);
  }
  return schedules;
}

export function incrementDoctorBookings(doctorId: string): number {
  const schedules = getDoctorSchedules();
  const doc = schedules[doctorId];
  if (!doc) {
    console.warn(`incrementDoctorBookings: no schedule found for doctor ${doctorId}`);
    return 0;
  }
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

// ============================================================================
// Live sync: pull real doctors from the `profiles` table (role = "Doctor")
// and merge them into the local schedule cache used by the booking UI.
// This is what replaces the old hardcoded doctor roster — once a doctor
// account exists in the database, they show up here automatically.
// ============================================================================

function parseWorkingHours(workingHours?: string): { startTime: string; endTime: string } {
  if (workingHours && workingHours.includes("-")) {
    const [start, end] = workingHours.split("-").map((s) => s.trim());
    if (start && end) return { startTime: start, endTime: end };
  }
  return { startTime: "09:00 AM", endTime: "05:00 PM" };
}

export async function syncDoctorSchedulesFromProfiles(): Promise<Record<string, DoctorScheduleConfig>> {
  if (typeof window === "undefined") return getDoctorSchedules();

  try {
    const doctorProfiles = await fetchSupabaseProfiles("Doctor");
    const current = getDoctorSchedules();

    for (const doc of doctorProfiles) {
      // Don't clobber hours/limits a doctor has already configured locally.
      if (current[doc.id]) continue;

      const { startTime, endTime } = parseWorkingHours(doc.workingHours);
      current[doc.id] = {
        doctorId: doc.id,
        doctorName: doc.name || "Doctor",
        specialization: doc.specialty || "General Physician",
        department: doc.department || doc.specialty || "General Medicine",
        startTime,
        endTime,
        dailyPatientLimit: doc.patientCapacity || 20,
        currentBookedCount: 0,
        isAcceptingBookings: doc.onlineBookingEnabled !== false,
        workingDays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
        consultationFee: 0,
        onVacation: false,
      };
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new Event("mediq_slots_updated"));
    return current;
  } catch (e) {
    console.warn("syncDoctorSchedulesFromProfiles error:", e);
    return getDoctorSchedules();
  }
}

export async function syncDepartmentsFromSchedules(): Promise<DepartmentItem[]> {
  if (typeof window === "undefined") return getDepartments();

  try {
    const { data: liveDepartments, error: liveDepartmentError } = await fetchSupabaseDepartments();
    const schedules = await syncDoctorSchedulesFromProfiles();
    const countByDept = new Map<string, number>();

    for (const doc of Object.values(schedules)) {
      const deptName = doc.department || "General Medicine";
      countByDept.set(deptName, (countByDept.get(deptName) || 0) + 1);
    }

    // Supabase is the authoritative catalogue whenever the departments
    // migration is present. The cache retains the same records for fast
    // loading and for a clear offline fallback when a deployment is pending.
    if (!liveDepartmentError) {
      const live = liveDepartments.map((department) => ({
        ...department,
        doctorCount: countByDept.get(department.name) || 0,
      }));
      saveDepartments(live);
      return live;
    }

    const existingByName = new Map(getDepartments().map((d) => [d.name, d]));

    const merged: DepartmentItem[] = Array.from(countByDept.entries()).map(([deptName, count]) => {
      const existing = existingByName.get(deptName);
      const headDoctor = Object.values(schedules).find((d) => d.department === deptName)?.doctorName || "";
      return {
        id: existing?.id || `dep-${deptName.toLowerCase().replace(/\s+/g, "-")}`,
        name: deptName,
        code: existing?.code || deptName.substring(0, 4).toUpperCase(),
        headOfDepartment: existing?.headOfDepartment || headDoctor,
        description: existing?.description || `${deptName} department`,
        doctorCount: count,
      };
    });

    // Keep any manually-created departments that currently have no doctors yet.
    for (const [name, dept] of existingByName) {
      if (!countByDept.has(name)) merged.push({ ...dept, doctorCount: 0 });
    }

    saveDepartments(merged);
    return merged;
  } catch (e) {
    console.warn("syncDepartmentsFromSchedules error:", e);
    return getDepartments();
  }
}
