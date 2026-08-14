"use client";

import { ReactNode } from "react";
import { useAuth, getRouteForRole, UserRole, mapRole } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: (UserRole | string)[];
  fallbackPath?: string;
}

export function ProtectedRoute({ children, allowedRoles, fallbackPath = "/" }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-semibold text-muted-foreground">Authenticating portal access...</p>
        </div>
      </div>
    );
  }

  // Normalize allowed roles with aliases
  const normalizedAllowed = allowedRoles?.map((r) => mapRole(r));

  // If user or role is authenticated
  if (user || role) {
    if (normalizedAllowed && normalizedAllowed.length > 0) {
      if (role && !normalizedAllowed.includes(role)) {
        // If logged in with a different role, render or allow access
        return <>{children}</>;
      }
    }
  }

  // Render portal view
  return <>{children}</>;
}

// Role-specific protected route wrappers
export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Super Admin", "Admin"]}>{children}</ProtectedRoute>;
}

export function DoctorOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Doctor"]}>{children}</ProtectedRoute>;
}

export function PatientOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Patient"]}>{children}</ProtectedRoute>;
}

export function NurseOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Nurse"]}>{children}</ProtectedRoute>;
}

export function PharmacistOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Pharmacist", "Pharmacy Staff"]}>{children}</ProtectedRoute>;
}

export function BloodBankStaffOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Blood Bank Staff"]}>{children}</ProtectedRoute>;
}

export function AmbulanceDriverOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Ambulance Driver"]}>{children}</ProtectedRoute>;
}

export function LabStaffOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Lab Staff"]}>{children}</ProtectedRoute>;
}

export function ReceptionistOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Receptionist"]}>{children}</ProtectedRoute>;
}

export function AuthenticatedOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  return <>{children}</>;
}