import { createFileRoute } from "@tanstack/react-router";
import { ReceptionistLayout } from "@/components/mediq/receptionist/ReceptionistLayout";
import { ReceptionistOnlyRoute } from "@/components/mediq/ProtectedRoute";

const title = "MediQ Receptionist Dashboard — Patient Access & Front Desk Operations";
const description =
  "Complete MediQ Receptionist Dashboard for fast patient registration, 3-click patient check-in, doctor queues, admissions, bed availability, front-desk billing, and emergency arrivals.";

export const Route = createFileRoute("/receptionist")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ReceptionistDashboardPage,
});

function ReceptionistDashboardPage() {
  return (
    <ReceptionistOnlyRoute>
      <ReceptionistLayout />
    </ReceptionistOnlyRoute>
  );
}
