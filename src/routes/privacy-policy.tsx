import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPolicyPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/privacy-policy")({ component: PrivacyPolicyPage });
