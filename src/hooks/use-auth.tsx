"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

export type UserRole =
  | "Super Admin"
  | "Doctor"
  | "Patient"
  | "Nurse"
  | "Pharmacist"
  | "Blood Bank Staff"
  | "Ambulance Driver"
  | "Lab Staff"
  | "Receptionist"
  | null;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signIn: (email: string, password: string, selectedRole?: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  setLocalRole: (role: UserRole) => void;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  bloodGroup?: string;
  address?: string;
  avatarUrl?: string;
  badgeId?: string;
  specialty?: string;
  licenseNo?: string;
  workingHours?: string;
  patientCapacity?: number;
  onlineBookingEnabled?: boolean;
}

export interface SignUpData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  bloodGroup?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function mapRole(role: string | null | undefined): UserRole {
  if (!role) return null;
  const normalized = role.trim().toLowerCase();
  if (normalized === "admin" || normalized === "super admin") return "Super Admin";
  if (normalized === "doctor" || normalized === "dr") return "Doctor";
  if (normalized === "patient") return "Patient";
  if (normalized === "nurse") return "Nurse";
  if (normalized === "pharmacist" || normalized === "pharmacy staff" || normalized === "pharmacy") return "Pharmacist";
  if (normalized === "blood bank staff" || normalized === "blood bank") return "Blood Bank Staff";
  if (normalized === "ambulance driver" || normalized === "driver") return "Ambulance Driver";
  if (normalized === "lab staff" || normalized === "laboratory staff" || normalized === "pathologist") return "Lab Staff";
  if (normalized === "receptionist") return "Receptionist";
  return (role as UserRole) || null;
}

export function getRouteForRole(role: UserRole): string {
  const routes: Record<string, string> = {
    "Super Admin": "/admin",
    "Doctor": "/doctor",
    "Patient": "/patient",
    "Nurse": "/nurse",
    "Pharmacist": "/pharmacy",
    "Blood Bank Staff": "/blood-bank-staff",
    "Ambulance Driver": "/ambulance-driver",
    "Lab Staff": "/laboratory-staff",
    "Receptionist": "/receptionist",
  };
  return role ? (routes[role] || "/") : "/";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("mediq_user_role");
      return mapRole(saved);
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userMeta?: any) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (data) {
        const userProfile: UserProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone,
          role: data.role,
          bloodGroup: data.blood_group,
          address: data.address,
          avatarUrl: data.avatar_url,
          badgeId: data.badge_id,
          specialty: data.specialty,
          licenseNo: data.license_no,
          workingHours: data.working_hours,
          patientCapacity: data.patient_capacity,
          onlineBookingEnabled: data.online_booking_enabled,
        };

        setProfile(userProfile);
        const resolvedRole = mapRole(data.role);
        setRole(resolvedRole);
        if (resolvedRole && typeof window !== "undefined") {
          localStorage.setItem("mediq_user_role", resolvedRole);
        }
        return;
      }

      // Fallback to metadata
      const metaRole = mapRole(userMeta?.role) || mapRole(localStorage.getItem("mediq_user_role")) || "Patient";
      setRole(metaRole);
    } catch (e) {
      console.warn("Using fallback auth profile:", e);
      const fallbackRole = mapRole(userMeta?.role) || mapRole(localStorage.getItem("mediq_user_role")) || "Patient";
      setRole(fallbackRole);
    }
  };

  useEffect(() => {
    // 1. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id, session.user.user_metadata);
        } else {
          // If no supabase session, check if there's a stored role
          const savedRole = mapRole(localStorage.getItem("mediq_user_role"));
          setRole(savedRole);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setLocalRole = (newRole: UserRole) => {
    setRole(newRole);
    if (typeof window !== "undefined" && newRole) {
      localStorage.setItem("mediq_user_role", newRole);
    }
  };

  const signIn = async (email: string, password: string, selectedRole?: string) => {
    try {
      if (selectedRole) {
        setLocalRole(mapRole(selectedRole));
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      const email = data.email && data.email.includes("@")
        ? data.email
        : `${data.phone.replace(/\D/g, "") || Date.now()}@mediq.health`;

      const mapped = mapRole(data.role) || "Patient";
      setLocalRole(mapped);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            phone: data.phone,
            role: mapped,
            bloodGroup: data.bloodGroup || "O+",
            address: data.address || "",
          },
        },
      });

      if (authData?.user?.id) {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          name: data.name,
          email,
          phone: data.phone,
          role: mapped,
          blood_group: data.bloodGroup || "O+",
          address: data.address || "",
        });
      }

      return { error: authError };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout error:", e);
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("mediq_user_role");
      localStorage.removeItem("mediq_logged_in");
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.user_metadata);
    }
  };

  const value = {
    user,
    session,
    profile,
    role,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
    setLocalRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}