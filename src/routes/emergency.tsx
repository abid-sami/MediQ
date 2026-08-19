import { createFileRoute } from "@tanstack/react-router";
import { EmergencyPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/emergency")({ component: EmergencyPage });
