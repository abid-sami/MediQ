import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { AmbulanceDriverLayout } from "@/components/mediq/ambulancedriver/AmbulanceDriverLayout";
import { Toaster } from "@/components/ui/sonner";

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
    <ThemeProvider>
      <AmbulanceDriverLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
