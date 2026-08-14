"use client";

import { ReactNode } from "react";
import { useAuth, getRouteForRole, UserRole, mapRole } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Lock, ArrowRight, Home, LogOut, ShieldX } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: (UserRole | string)[];
  fallbackPath?: string;
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading, signOut } = useAuth();

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

  // Normalize allowed roles
  const normalizedAllowed = allowedRoles
    ?.map((r) => mapRole(r))
    .filter(Boolean) as UserRole[];

  // 1. Not Authenticated
  if (!user && !role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center shadow-xl">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5">
            <Lock className="h-8 w-8" />
          </div>

          <Badge variant="outline" className="mb-3 border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold uppercase text-[10px]">
            Authentication Required
          </Badge>

          <h1 className="text-2xl font-black tracking-tight text-foreground">Sign In to Continue</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            This healthcare portal requires an authenticated session. Please return to the homepage and log in to your account.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Button asChild className="w-full rounded-xl font-bold gradient-primary shadow-md">
              <a href="/">
                <Home className="mr-2 h-4 w-4" /> Go to Homepage
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Role Check: If user has a role that is NOT allowed for this panel
  if (normalizedAllowed && normalizedAllowed.length > 0) {
    const isAllowed = role && normalizedAllowed.includes(role);

    if (!isAllowed) {
      const allowedNames = normalizedAllowed.join(" or ");
      const userPortalRoute = getRouteForRole(role);

      return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
          <div className="w-full max-w-lg rounded-3xl border border-destructive/20 bg-card p-8 text-center shadow-xl">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 text-destructive ring-8 ring-destructive/5">
              <ShieldAlert className="h-8 w-8 animate-pulse" />
            </div>

            <Badge variant="outline" className="mb-3 border-destructive/30 text-destructive font-bold uppercase text-[10px]">
              Access Restricted
            </Badge>

            <h1 className="text-2xl font-black tracking-tight text-foreground">
              Unauthorized Portal Access
            </h1>

            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              This panel is strictly reserved for authorized <strong className="text-foreground">{allowedNames}</strong> personnel.
            </p>

            <div className="my-5 rounded-2xl bg-muted/40 border border-border p-4 text-left space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Your Role:</span>
                <Badge className="bg-primary/15 text-primary font-bold text-xs">
                  {role || "Unassigned"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground font-medium">Required Role:</span>
                <Badge variant="outline" className="text-destructive border-destructive/30 font-bold text-xs">
                  {allowedNames}
                </Badge>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              {role && (
                <Button asChild className="rounded-xl font-bold gradient-primary shadow-md">
                  <a href={userPortalRoute}>
                    Go to My {role} Portal <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              )}

              <Button asChild variant="outline" className="rounded-xl font-semibold">
                <a href="/">
                  <Home className="mr-2 h-4 w-4" /> Home
                </a>
              </Button>

              <Button
                onClick={async () => {
                  await signOut();
                  window.location.href = "/";
                }}
                variant="ghost"
                className="rounded-xl font-semibold text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" /> Switch Account
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  // 3. Authorized -> Render Portal Content
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