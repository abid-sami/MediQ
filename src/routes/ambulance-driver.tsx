import { createFileRoute } from "@tanstack/react-router";
import { AmbulanceDriverLayout } from "@/components/mediq/ambulancedriver/AmbulanceDriverLayout";
import { AmbulanceDriverOnlyRoute } from "@/components/mediq/ProtectedRoute";

const title = "MediQ Ambulance Driver Dashboard — Emergency Response & GPS Dispatch";
const description =
  "Mobile-first MediQ Ambulance Driver Dashboard for emergency dispatch, 7-step progress tracking, live GPS map navigation, patient calling, and trip history.";

export const Route = createFileRoute("/ambulance-driver")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: AmbulanceDriverDashboardPage,
});

function AmbulanceDriverDashboardPage() {
  return (
    <AmbulanceDriverOnlyRoute>
      <AmbulanceDriverLayout />
    </AmbulanceDriverOnlyRoute>
  );
}
