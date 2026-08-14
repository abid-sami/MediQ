import { createFileRoute } from "@tanstack/react-router";
import { PatientLayout } from "@/components/mediq/patient/PatientLayout";
import { PatientOnlyRoute } from "@/components/mediq/ProtectedRoute";

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
    <PatientOnlyRoute>
      <PatientLayout />
    </PatientOnlyRoute>
  );
}
