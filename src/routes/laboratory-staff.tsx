import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { LabStaffLayout } from "@/components/mediq/labstaff/LabStaffLayout";
import { Toaster } from "@/components/ui/sonner";

const title = "MediQ Laboratory Staff Dashboard — Pathology & Diagnostic Station";
const description =
  "Complete MediQ Laboratory Staff Dashboard for diagnostic test requisitions, sample collection, specimen processing, parameter result entry, printable lab reports, and test catalog management.";

export const Route = createFileRoute("/laboratory-staff")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: LaboratoryStaffDashboardPage,
});

function LaboratoryStaffDashboardPage() {
  return (
    <ThemeProvider>
      <LabStaffLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
