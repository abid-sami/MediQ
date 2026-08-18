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
  age?: number;
  gender?: string;
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
  age?: number;
  gender?: string;
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
    normalized === "registered nurse" ||
    normalized === "nursing" ||
    normalized === "staff nurse" ||
    normalized === "charge nurse"
  ) {
    return "Nurse";
  }

  // Pharmacist
  if (
    normalized === "pharmacist" ||
    normalized === "pharmacy" ||
    normalized === "pharmacy staff" ||
    normalized === "druggist" ||
    normalized === "chemist"
  ) {
    return "Pharmacist";
  }

  // Blood Bank Staff
  if (
    normalized === "blood bank staff" ||
    normalized === "blood bank" ||
    normalized === "blood bank officer" ||
    normalized === "transfusion officer" ||
    normalized === "blood bank technician"
  ) {
    return "Blood Bank Staff";
  }

  // Ambulance Driver
  if (
    normalized === "ambulance driver" ||
    normalized === "driver" ||
    normalized === "ambulance" ||
    normalized === "emt" ||
    normalized === "paramedic" ||
    normalized === "ambulance crew"
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

// Define fetchProfile BEFORE AuthProvider so it can be used inside
const fetchProfile = async (
  userId: string,
  userMeta?: any,
  userEmail?: string,
  setProfile?: (profile: UserProfile | null) => void,
  setRole?: (role: UserRole) => void
): Promise<UserRole> => {
  try {
    // 1. Try querying profiles table by user ID
    let profileRow: any = null;
    let queryError: string | null = null;

    const { data: byIdData, error: byIdError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (byIdError) {
      queryError = byIdError.message;
      console.warn("Profile query by ID error:", byIdError.message);
    }

    if (byIdData) {
      profileRow = byIdData;
      console.log("[fetchProfile] Found profile by ID:", { id: profileRow.id, role: profileRow.role });
    } else {
      // 2. Try querying profiles table by email
      const emailToQuery = userEmail || userMeta?.email;
      if (emailToQuery) {
        const { data: byEmailData, error: byEmailError } = await supabase
          .from("profiles")
          .select("*")
          .ilike("email", emailToQuery.trim())
          .maybeSingle();

        if (byEmailError) {
          queryError = byEmailError.message;
          console.warn("Profile query by email error:", byEmailError.message);
        }

        if (byEmailData) {
          profileRow = byEmailData;
          console.log("[fetchProfile] Found profile by email:", { id: profileRow.id, role: profileRow.role });
        }
      }
    }

    // Determine raw role (priority: profiles table > user metadata)
    const rawRole: string | undefined = profileRow?.role || userMeta?.role;

    // Map to standardized UserRole
    const resolvedRole = mapRole(rawRole) || "Patient";

    console.log("[fetchProfile] Raw role from DB:", rawRole, "-> Mapped role:", resolvedRole, "User metadata role:", userMeta?.role);

    if (profileRow) {
      const userProfile: UserProfile = {
        id: profileRow.id,
        name: profileRow.name || userMeta?.name || "User",
        email: profileRow.email || userEmail || "",
        phone: profileRow.phone || "",
        role: resolvedRole,
        age: profileRow.age ?? userMeta?.age,
        gender: profileRow.gender ?? userMeta?.gender,
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
      setProfile?.(userProfile);
    } else if (userId) {
      const newProfile: UserProfile = {
        id: userId,
        name: userMeta?.name || userEmail?.split("@")[0] || "User",
        email: userEmail || userMeta?.email || "",
        phone: userMeta?.phone || "",
        role: resolvedRole,
        age: userMeta?.age,
        gender: userMeta?.gender,
      };
      setProfile?.(newProfile);
      try {
        await supabase.from("profiles").upsert({
          id: userId,
          name: newProfile.name,
          email: newProfile.email,
          phone: newProfile.phone,
          role: newProfile.role,
          age: newProfile.age,
          gender: newProfile.gender,
        });
      } catch (e) {
        console.warn("Failed to create profile row:", e);
      }
    }

    setRole?.(resolvedRole);
    return resolvedRole;
  } catch (err: any) {
    console.error("fetchProfile error:", err);
    return "Patient";
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentProfile = async (uId: string, meta?: any, email?: string) => {
    return await fetchProfile(uId, meta, email, setProfile, setRole);
  };

  useEffect(() => {
    // Pull real doctors/departments from Supabase into the local booking
    // cache once per app load (fire-and-forget, doesn't block auth setup).
    import("@/data/doctor-schedule-store").then(({ syncDepartmentsFromSchedules }) => {
      syncDepartmentsFromSchedules().catch(() => {});
    });

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchCurrentProfile(
          session.user.id,
          session.user.user_metadata,
          session.user.email
        );
      } else {
        const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("mediq_logged_in") === "true";
        const savedRole = isLoggedIn ? mapRole(localStorage.getItem("mediq_user_role")) : null;
        setRole(savedRole);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === "SIGNED_OUT") {
          setUser(null);
          setSession(null);
          setProfile(null);
          setRole(null);
          if (typeof window !== "undefined") {
            localStorage.removeItem("mediq_user_role");
            localStorage.removeItem("mediq_logged_in");
          }
        } else if (session?.user) {
          await fetchCurrentProfile(
            session.user.id,
            session.user.user_metadata,
            session.user.email
          );
        } else {
          const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("mediq_logged_in") === "true";
          const savedRole = isLoggedIn ? mapRole(localStorage.getItem("mediq_user_role")) : null;
          setRole(savedRole);
          if (!savedRole) {
            setProfile(null);
          }
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
      const email = emailOrPhone.includes("@")
        ? emailOrPhone.trim()
        : `${emailOrPhone.replace(/\D/g, "")}@mediq.health`;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: passwordText,
      });

      if (error) {
        return { error };
      }

      let activeRole: UserRole = null;
      if (data?.user) {
        activeRole = await fetchCurrentProfile(
          data.user.id,
          data.user.user_metadata,
          data.user.email
        );
      }

      if (!activeRole && selectedRole) {
        activeRole = mapRole(selectedRole);
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("mediq_logged_in", "true");
        if (activeRole) {
          localStorage.setItem("mediq_user_role", activeRole);
        }
      }

      return { error: null, role: activeRole };
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
            age: data.age || null,
            gender: data.gender || "Not specified",
            bloodGroup: data.bloodGroup || "",
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
          age: data.age || null,
          gender: data.gender || "Not specified",
          blood_group: data.bloodGroup || null,
          address: data.address || "",
        });
      }

      return { error: null, role: mapped };
    } catch (err: any) {
      return { error: err };
    }
  };

  const signOut = async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("mediq_user_role");
      localStorage.removeItem("mediq_logged_in");
    }
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Signout error:", e);
    }
  };

  const refreshProfile = async (): Promise<UserRole> => {
    if (user) {
      return await fetchProfile(
        user.id,
        user.user_metadata,
        user.email,
        setProfile,
        setRole
      );
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
    fetchProfile: (userId: string, userMeta?: any, userEmail?: string) =>
      fetchProfile(userId, userMeta, userEmail, setProfile, setRole),
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