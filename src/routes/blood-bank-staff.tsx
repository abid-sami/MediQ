import { createFileRoute } from "@tanstack/react-router";
import { BloodBankLayout } from "@/components/mediq/bloodbank/BloodBankLayout";
import { BloodBankStaffOnlyRoute } from "@/components/mediq/ProtectedRoute";

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
    <BloodBankStaffOnlyRoute>
      <BloodBankLayout />
    </BloodBankStaffOnlyRoute>
  );
}
