import { createFileRoute } from "@tanstack/react-router";
import { HelpCenterPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/help-center")({ component: HelpCenterPage });
