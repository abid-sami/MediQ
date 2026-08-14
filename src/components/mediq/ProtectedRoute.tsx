"use client";

import { ReactNode } from "react";
import { Navigate, Outlet } from "@tanstack/react-router";
import { useAuth, getRouteForRole, UserRole } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function ProtectedRoute({ children, allowedRoles, fallbackPath = "/" }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Not authenticated - redirect to home/login
    return <Navigate to={fallbackPath} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Authenticated but wrong role - redirect to their dashboard
    const correctPath = getRouteForRole(role);
    return <Navigate to={correctPath} replace />;
  }

  return <>{children}</>;
}

// Role-specific protected route components for convenience
export function AdminOnlyRoute({ children }: { children: ReactNode }) {
  return <ProtectedRoute allowedRoles={["Super Admin"]}>{children}</ProtectedRoute>;
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
  return <ProtectedRoute allowedRoles={["Pharmacist"]}>{children}</ProtectedRoute>;
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

// Authenticated users only (any role)
export function AuthenticatedOnlyRoute({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute
      allowedRoles={[
        "Super Admin",
        "Doctor",
        "Patient",
        "Nurse",
        "Pharmacist",
        "Blood Bank Staff",
        "Ambulance Driver",
        "Lab Staff",
        "Receptionist",
      ]}
    >
      {children}
    </ProtectedRoute>
  );
}

// Public route (redirects authenticated users away)
export function PublicOnlyRoute({ children, redirectTo = "/dashboard" }: { children: ReactNode; redirectTo?: string }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}