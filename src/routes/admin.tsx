import { createFileRoute } from "@tanstack/react-router";
import { AdminLayout } from "@/components/mediq/admin/AdminLayout";
import { AdminOnlyRoute } from "@/components/mediq/ProtectedRoute";

const title = "MediQ Super Admin Dashboard — Global Enterprise Command Center";
const description =
  "Complete MediQ Super Admin Dashboard for global healthcare network governance, user management, hospital command, emergency SOS tracking, bed capacity, blood bank repository, and platform audit logs.";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SuperAdminDashboardPage,
});

function SuperAdminDashboardPage() {
  return (
    <AdminOnlyRoute>
      <AdminLayout />
    </AdminOnlyRoute>
  );
}
