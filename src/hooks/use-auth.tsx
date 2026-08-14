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

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole;
  loading: boolean;
  signIn: (emailOrPhone: string, passwordText: string, selectedRole?: string) => Promise<{ error: Error | null; role?: UserRole }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null; role?: UserRole }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserRole>;
  setLocalRole: (role: UserRole) => void;
  fetchProfile: (userId: string, userMeta?: any, userEmail?: string) => Promise<UserRole>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function mapRole(role: string | null | undefined): UserRole {
  if (!role) return null;
  const raw = role.trim();
  const normalized = raw.toLowerCase().replace(/[\s_-]+/g, " ");

  // Super Admin / Admin
  if (
    normalized === "admin" ||
    normalized === "super admin" ||
    normalized === "superadmin" ||
    normalized === "administrator" ||
    normalized === "sysadmin" ||
    normalized === "system admin" ||
    normalized === "admin staff"
  ) {
    return "Super Admin";
  }

  // Doctor
  if (
    normalized === "doctor" ||
    normalized === "dr" ||
    normalized === "dr." ||
    normalized === "physician" ||
    normalized === "surgeon" ||
    normalized === "cardiologist" ||
    normalized === "specialist" ||
    normalized === "doc"
  ) {
    return "Doctor";
  }

  // Patient
  if (
    normalized === "patient" ||
    normalized === "user" ||
    normalized === "client" ||
    normalized === "member" ||
    normalized === "customer"
  ) {
    return "Patient";
  }

  // Nurse
  if (
    normalized === "nurse" ||
    normalized === "rn" ||
    normalized === "staff nurse" ||
    normalized === "head nurse" ||
    normalized === "charge nurse" ||
    normalized === "nursing"
  ) {
    return "Nurse";
  }

  // Pharmacist
  if (
    normalized === "pharmacist" ||
    normalized === "pharmacy" ||
    normalized === "pharmacy staff" ||
    normalized === "chemist" ||
    normalized === "rph" ||
    normalized === "apothecary"
  ) {
    return "Pharmacist";
  }

  // Blood Bank Staff
  if (
    normalized === "blood bank" ||
    normalized === "blood bank staff" ||
    normalized === "bloodbank" ||
    normalized === "blood bank officer" ||
    normalized === "transfusion" ||
    normalized === "transfusion officer"
  ) {
    return "Blood Bank Staff";
  }

  // Ambulance Driver
  if (
    normalized === "ambulance driver" ||
    normalized === "driver" ||
    normalized === "paramedic driver" ||
    normalized === "emt" ||
    normalized === "ambulance" ||
    normalized === "driver staff"
  ) {
    return "Ambulance Driver";
  }

  // Lab Staff
  if (
    normalized === "lab staff" ||
    normalized === "laboratory staff" ||
    normalized === "lab" ||
    normalized === "laboratory" ||
    normalized === "pathologist" ||
    normalized === "lab tech" ||
    normalized === "lab technician" ||
    normalized === "clinical pathologist"
  ) {
    return "Lab Staff";
  }

  // Receptionist
  if (
    normalized === "receptionist" ||
    normalized === "reception" ||
    normalized === "front desk" ||
    normalized === "frontdesk" ||
    normalized === "desk officer" ||
    normalized === "patient access"
  ) {
    return "Receptionist";
  }

  return (raw as UserRole) || null;
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

  const fetchProfile = async (userId: string, userMeta?: any, userEmail?: string): Promise<UserRole> => {
    try {
      // 1. Try querying profiles table by user ID
      let profileRow: any = null;

      const { data: byIdData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (byIdData) {
        profileRow = byIdData;
      } else {
        // 2. Try querying profiles table by email
        const emailToQuery = userEmail || userMeta?.email;
        if (emailToQuery) {
          const { data: byEmailData } = await supabase
            .from("profiles")
            .select("*")
            .ilike("email", emailToQuery.trim())
            .maybeSingle();
          if (byEmailData) {
            profileRow = byEmailData;
          }
        }
      }

      // Determine raw role (priority: profiles table > user metadata)
      const rawRole: string | undefined = profileRow?.role || userMeta?.role;

      // Map to standardized UserRole
      const resolvedRole = mapRole(rawRole) || "Patient";

      if (profileRow) {
        const userProfile: UserProfile = {
          id: profileRow.id,
          name: profileRow.name || userMeta?.name || "User",
          email: profileRow.email || userEmail || "",
          phone: profileRow.phone || "",
          role: resolvedRole,
          bloodGroup: profileRow.blood_group,
          address: profileRow.address,
          avatarUrl: profileRow.avatar_url,
          badgeId: profileRow.badge_id,
          specialty: profileRow.specialty,
          licenseNo: profileRow.license_no,
          workingHours: profileRow.working_hours,
          patientCapacity: profileRow.patient_capacity,
          onlineBookingEnabled: profileRow.online_booking_enabled,
        };
        setProfile(userProfile);
      } else if (userId) {
        const newProfile: UserProfile = {
          id: userId,
          name: userMeta?.name || userEmail?.split("@")[0] || "User",
          email: userEmail || userMeta?.email || "",
          phone: userMeta?.phone || "",
          role: resolvedRole,
        };
        setProfile(newProfile);
        try {
          await supabase.from("profiles").upsert({
            id: userId,
            name: newProfile.name,
            email: newProfile.email,
            phone: newProfile.phone,
            role: resolvedRole,
          });
        } catch (err) {
          console.warn("Auto profile sync note:", err);
        }
      }

      setRole(resolvedRole);
      if (typeof window !== "undefined") {
        localStorage.setItem("mediq_user_role", resolvedRole);
        localStorage.setItem("mediq_logged_in", "true");
      }

      return resolvedRole;
    } catch (e) {
      console.warn("Using fallback auth profile:", e);
      const fallbackRole = mapRole(userMeta?.role) || mapRole(localStorage.getItem("mediq_user_role")) || "Patient";
      setRole(fallbackRole);
      if (typeof window !== "undefined") {
        localStorage.setItem("mediq_user_role", fallbackRole);
      }
      return fallbackRole;
    }
  };

  useEffect(() => {
    // 1. Check existing Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id, session.user.user_metadata, session.user.email);
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
          await fetchProfile(session.user.id, session.user.user_metadata, session.user.email);
        } else {
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

  const signIn = async (
    emailOrPhone: string,
    passwordText: string,
    selectedRole?: string
  ): Promise<{ error: Error | null; role?: UserRole }> => {
    try {
      if (selectedRole) {
        setLocalRole(mapRole(selectedRole));
      }

      const cleanInput = emailOrPhone.trim();
      const emailToUse = cleanInput.includes("@")
        ? cleanInput
        : `${cleanInput.replace(/\D/g, "")}@mediq.health`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password: passwordText,
      });

      if (error) {
        return { error };
      }

      if (data?.user) {
        setUser(data.user);
        setSession(data.session);
        const resolvedRole = await fetchProfile(data.user.id, data.user.user_metadata, data.user.email);
        return { error: null, role: resolvedRole };
      }

      return { error: new Error("No user session returned from sign in") };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signUp = async (data: SignUpData): Promise<{ error: Error | null; role?: UserRole }> => {
    try {
      const email = data.email && data.email.includes("@")
        ? data.email.trim()
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

      if (authError) {
        return { error: authError };
      }

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

      return { error: null, role: mapped };
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

  const refreshProfile = async (): Promise<UserRole> => {
    if (user) {
      return await fetchProfile(user.id, user.user_metadata, user.email);
    }
    return role;
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
    fetchProfile,
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