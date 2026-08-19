import { createFileRoute } from "@tanstack/react-router";
import { AmbulancePage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/ambulance")({ component: AmbulancePage });
