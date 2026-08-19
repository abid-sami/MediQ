import { createFileRoute } from "@tanstack/react-router";
import { TermsPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/terms-and-conditions")({ component: TermsPage });
