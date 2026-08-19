import { createFileRoute } from "@tanstack/react-router";
import { BloodRequestsPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/blood-requests")({ component: BloodRequestsPage });
