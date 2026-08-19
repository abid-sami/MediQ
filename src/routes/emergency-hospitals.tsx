import { createFileRoute } from "@tanstack/react-router";
import { EmergencyHospitalsPage } from "@/components/mediq/FooterDestinationPages";
export const Route = createFileRoute("/emergency-hospitals")({ component: EmergencyHospitalsPage });
