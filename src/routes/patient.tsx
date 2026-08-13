import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { PatientLayout } from "@/components/mediq/patient/PatientLayout";
import { Toaster } from "@/components/ui/sonner";

const title = "MediQ Patient Dashboard — Connected Personal Healthcare";
const description =
  "Complete MediQ Patient Dashboard for doctor appointments, medical records, e-prescriptions, lab reports, pharmacy orders, blood requests, emergency ambulance tracking, and billing.";

export const Route = createFileRoute("/patient")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PatientDashboardPage,
});

function PatientDashboardPage() {
  return (
    <ThemeProvider>
      <PatientLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
