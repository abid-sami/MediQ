import { createFileRoute } from "@tanstack/react-router";
import { PharmacyLayout } from "@/components/mediq/pharmacy/PharmacyLayout";
import { PharmacistOnlyRoute } from "@/components/mediq/ProtectedRoute";

const title = "MediQ Pharmacy Dashboard — Clinical E-Prescription & Inventory";
const description =
  "Complete MediQ Pharmacy Dashboard for prescription verification, medicine master catalog, inventory stock levels, order fulfillment, suppliers, and sales reports.";

export const Route = createFileRoute("/pharmacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: PharmacyDashboardPage,
});

function PharmacyDashboardPage() {
  return (
    <PharmacistOnlyRoute>
      <PharmacyLayout />
    </PharmacistOnlyRoute>
  );
}
