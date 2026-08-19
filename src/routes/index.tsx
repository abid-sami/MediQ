// Design: Guided Floorplan — public care discovery stays immediately available while account state initializes in the background.
import { createFileRoute } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/hooks/use-theme";
import { MediQActionsProvider } from "@/components/mediq/actions-context";
import { Header } from "@/components/mediq/Header";
import { Hero } from "@/components/mediq/Hero";
import { QuickServices } from "@/components/mediq/QuickServices";
import { HospitalStats } from "@/components/mediq/HospitalStats";
import { BedAvailability } from "@/components/mediq/BedAvailability";
import { HospitalNavigation } from "@/components/mediq/HospitalNavigation";
import { OurDoctors } from "@/components/mediq/OurDoctors";
import { BloodBank } from "@/components/mediq/BloodBank";
import { Pharmacy } from "@/components/mediq/Pharmacy";
import { HealthcareNetwork } from "@/components/mediq/HealthcareNetwork";
import { EmergencyCTA } from "@/components/mediq/EmergencyCTA";
import { Footer } from "@/components/mediq/Footer";
import { SOSModal } from "@/components/mediq/SOSModal";
import { AppointmentModal } from "@/components/mediq/AppointmentModal";
import { AllDoctorsModal } from "@/components/mediq/AllDoctorsModal";
import { AuthModal } from "@/components/mediq/AuthModal";
import { useAuth } from "@/hooks/use-auth";

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
  useAuth();

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
            <HospitalNavigation />
            <OurDoctors />
            <BloodBank />
            <Pharmacy />
            <HealthcareNetwork />
            <EmergencyCTA />
          </main>
          <Footer />
          <SOSModal />
          <AppointmentModal />
          <AllDoctorsModal />
          <AuthModal />
          <Toaster position="top-center" />
        </div>
      </MediQActionsProvider>
    </ThemeProvider>
  );
}
