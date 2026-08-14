"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

type UserRole =
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
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

interface UserProfile {
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

interface SignUpData {
  name: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  bloodGroup?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

function mapRole(role: string | null): UserRole {
  if (!role) return null;
  const roleMap: Record<string, UserRole> = {
    "Super Admin": "Super Admin",
    "Doctor": "Doctor",
    "Patient": "Patient",
    "Nurse": "Nurse",
    "Pharmacist": "Pharmacist",
    "Blood Bank Staff": "Blood Bank Staff",
    "Ambulance Driver": "Ambulance Driver",
    "Lab Staff": "Lab Staff",
    "Receptionist": "Receptionist",
  };
  return roleMap[role] || null;
}

function getRouteForRole(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    "Super Admin": "/admin",
    "Doctor": "/doctor",
    "Patient": "/patient",
    "Nurse": "/nurse",
    "Pharmacist": "/pharmacy",
    "Blood Bank Staff": "/blood-bank-staff",
    "Ambulance Driver": "/ambulance-driver",
    "Lab Staff": "/laboratory-staff",
    "Receptionist": "/receptionist",
    null: "/",
  };
  return routes[role] || "/";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error || !data) {
        console.warn("Profile not found:", error);
        setProfile(null);
        setRole(null);
        return;
      }

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
      setRole(mapRole(data.role));
    } catch (e) {
      console.error("Error fetching profile:", e);
      setProfile(null);
      setRole(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setRole(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (data: SignUpData) => {
    const email = data.email && data.email.includes("@")
      ? data.email
      : `${data.phone.replace(/\D/g, "") || Date.now()}@mediq.health`;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          phone: data.phone,
          role: data.role,
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
        role: data.role,
        blood_group: data.bloodGroup || "O+",
        address: data.address || "",
      });
    }

    return { error: authError };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
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

// Helper hook for role-based route access
export function useRequireAuth(allowedRoles?: UserRole[], redirectTo = "/") {
  const { user, role, loading } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated
        setShouldRender(false);
      } else if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        // Authenticated but wrong role
        setShouldRender(false);
      } else {
        setShouldRender(true);
      }
    }
  }, [user, role, loading, allowedRoles]);

  return { loading: loading || !shouldRender, user, role, authorized: shouldRender };
}

export { getRouteForRole };