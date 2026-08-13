import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { NurseLayout } from "@/components/mediq/nurse/NurseLayout";
import { Toaster } from "@/components/ui/sonner";

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
    <ThemeProvider>
      <NurseLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
