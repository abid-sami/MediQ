import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { BloodBankLayout } from "@/components/mediq/bloodbank/BloodBankLayout";
import { Toaster } from "@/components/ui/sonner";

const title = "MediQ Blood Bank Staff Dashboard — Central Transfusion Repository";
const description =
  "Complete MediQ Blood Bank Staff Dashboard for live blood group statistics, donor management, blood requests, reservations, and emergency requisitions.";

export const Route = createFileRoute("/blood-bank-staff")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: BloodBankStaffDashboardPage,
});

function BloodBankStaffDashboardPage() {
  return (
    <ThemeProvider>
      <BloodBankLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
