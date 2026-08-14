import { createFileRoute } from "@tanstack/react-router";
import { NurseLayout } from "@/components/mediq/nurse/NurseLayout";
import { NurseOnlyRoute } from "@/components/mediq/ProtectedRoute";

const title = "MediQ Nurse Dashboard — Ward Management & Bedside Patient Care";
const description =
  "Complete MediQ Nurse Dashboard for ward management, assigned patients, vital signs recording, nursing care notes, medication administration, bed management, and critical alerts.";

export const Route = createFileRoute("/nurse")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: NurseDashboardPage,
});

function NurseDashboardPage() {
  return (
    <NurseOnlyRoute>
      <NurseLayout />
    </NurseOnlyRoute>
  );
}
