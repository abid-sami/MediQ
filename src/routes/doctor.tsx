import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { DoctorLayout } from "@/components/mediq/doctor/DoctorLayout";
import { Toaster } from "@/components/ui/sonner";

const title = "MediQ Doctor Dashboard — Clinical Overview & Patient Care";
const description =
  "Complete MediQ Doctor Dashboard for patient consultations, digital prescriptions, lab and diagnostic requisitions, follow-ups, and medical records.";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: DoctorDashboardPage,
});

function DoctorDashboardPage() {
  return (
    <ThemeProvider>
      <DoctorLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
