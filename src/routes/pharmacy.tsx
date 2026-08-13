import { createFileRoute } from "@tanstack/react-router";
import { ThemeProvider } from "@/hooks/use-theme";
import { PharmacyLayout } from "@/components/mediq/pharmacy/PharmacyLayout";
import { Toaster } from "@/components/ui/sonner";

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
    <ThemeProvider>
      <PharmacyLayout />
      <Toaster position="top-right" />
    </ThemeProvider>
  );
}
