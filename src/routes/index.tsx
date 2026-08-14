import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-theme";
import { MediQActionsProvider } from "@/components/mediq/actions-context";
import { Header } from "@/components/mediq/Header";
import { Hero } from "@/components/mediq/Hero";
import { QuickServices } from "@/components/mediq/QuickServices";
import { HospitalStats } from "@/components/mediq/HospitalStats";
import { BedAvailability } from "@/components/mediq/BedAvailability";
import { WardMap } from "@/components/mediq/WardMap";
import { BloodBank } from "@/components/mediq/BloodBank";
import { Pharmacy } from "@/components/mediq/Pharmacy";
import { HealthcareNetwork } from "@/components/mediq/HealthcareNetwork";
import { EmergencyCTA } from "@/components/mediq/EmergencyCTA";
import { Footer } from "@/components/mediq/Footer";
import { SOSModal } from "@/components/mediq/SOSModal";
import { AppointmentModal } from "@/components/mediq/AppointmentModal";
import { AuthModal } from "@/components/mediq/AuthModal";
import { useAuth, getRouteForRole } from "@/hooks/use-auth";

const title = "MediQ — Healthcare, Connected in One Place";
const description =
  "Book doctors, request an emergency ambulance, check live hospital bed and blood availability, and order from the pharmacy on one connected healthcare platform.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Index,
});

function Index() {
  const { user, role, loading } = useAuth();

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

  if (user && role) {
    return <Navigate to={getRouteForRole(role)} replace />;
  }

  return (
    <ThemeProvider>
      <MediQActionsProvider>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Hero />
            <QuickServices />
            <HospitalStats />
            <BedAvailability />
            <WardMap />
            <BloodBank />
            <Pharmacy />
            <HealthcareNetwork />
            <EmergencyCTA />
          </main>
          <Footer />
          <SOSModal />
          <AppointmentModal />
          <AuthModal />
          <Toaster position="top-center" />
        </div>
      </MediQActionsProvider>
    </ThemeProvider>
  );
}
