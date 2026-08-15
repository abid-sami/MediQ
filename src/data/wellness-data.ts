/**
 * Types & Schema Definitions for Patient Wellness & Relaxation Activities
 */

export type WellnessActivityType = "guided-breathing" | "memory-match" | "calm-coloring";

export interface WellnessSessionRecord {
  id: string;
  activityType: WellnessActivityType;
  activityTitle: string;
  timestamp: string;
  durationSeconds: number;
  completed: boolean;
  details?: {
    difficulty?: "Easy" | "Medium" | "Hard";
    moves?: number;
    pairsFound?: number;
    breathingPattern?: string;
    cyclesCompleted?: number;
    artworkTitle?: string;
  };
}

export const WELLNESS_STORAGE_KEY = "mediq_patient_wellness_sessions";

export function getStoredWellnessSessions(): WellnessSessionRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WELLNESS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn("Error reading wellness sessions from localStorage:", e);
    return [];
  }
}

export function saveWellnessSession(session: Omit<WellnessSessionRecord, "id" | "timestamp">): WellnessSessionRecord {
  const newRecord: WellnessSessionRecord = {
    ...session,
    id: `well-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getStoredWellnessSessions();
      const updated = [newRecord, ...existing].slice(0, 50); // Keep last 50
      localStorage.setItem(WELLNESS_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Error saving wellness session:", e);
    }
  }

  return newRecord;
}
