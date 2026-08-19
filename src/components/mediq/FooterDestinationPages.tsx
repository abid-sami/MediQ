// Design: Guided Floorplan — public support routes are calm, direct, and action-led, with emergency help always reachable in one step.
import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Building2, ChevronRight, CircleHelp, HeartPulse, Mail, MapPin, Route as RouteIcon, Scale, ShieldCheck, Siren, Droplet } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { SOSModal } from "./SOSModal";
import { AuthModal } from "./AuthModal";
import { RequestBloodModal } from "./RequestBloodModal";
import { FeedbackForm } from "./FeedbackForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMediQActions } from "./actions-context";
import { fetchSupabaseHospitals } from "@/services/supabase-service";

function PublicPageShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="pt-28 sm:pt-32">
        <section className="relative overflow-hidden border-b border-border bg-surface/80">
          <div aria-hidden="true" className="absolute inset-y-0 right-[8%] hidden w-px bg-primary/15 lg:block" />
          <svg aria-hidden="true" className="absolute bottom-0 right-0 hidden h-full w-[42%] text-primary/10 lg:block" viewBox="0 0 520 260" fill="none">
            <path d="M34 222C126 222 120 66 214 66c65 0 68 118 144 118 56 0 60-72 130-72" stroke="currentColor" strokeWidth="3" strokeDasharray="9 12" />
            <circle cx="214" cy="66" r="10" fill="currentColor" /><circle cx="358" cy="184" r="10" fill="currentColor" />
          </svg>
          <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 sm:py-16">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80"><ArrowLeft className="h-3.5 w-3.5" /> Back to MediQ home</a>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/25 bg-primary/5 text-[10px] font-bold uppercase tracking-[0.16em] text-primary"><RouteIcon className="mr-1 h-3 w-3" /> Route 01</Badge>
              <Badge variant="outline" className="border-teal/30 bg-teal/5 text-[10px] font-bold uppercase tracking-[0.16em] text-teal"><MapPin className="mr-1 h-3 w-3" /> {eyebrow}</Badge>
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
            <p className="mt-5 inline-flex items-center gap-2 border-l-2 border-primary pl-3 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground"><span className="h-2 w-2 rounded-full bg-teal" /> Current destination · Choose the next action below</p>
          </div>
        </section>
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">{children}</section>
      </main>
      <Footer />
      <SOSModal />
      <AuthModal />
    </div>
  );
}

function EmergencyAction({ title, description, secondaryHref, secondaryLabel }: { title: string; description: string; secondaryHref: string; secondaryLabel: string }) {
  const { openSos } = useMediQActions();
  return (
    <PublicPageShell eyebrow="Emergency response" title={title} description={description}>
      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-destructive/25 border-l-4 border-l-destructive bg-destructive/5 p-6 shadow-soft sm:p-8">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-destructive text-white"><Siren className="h-6 w-6" /></div>
          <h2 className="mt-5 text-xl font-bold">Request emergency support</h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">Use MediQ Emergency SOS to submit the information your response team needs. A dispatcher can then review the request and coordinate the appropriate service.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button onClick={openSos} className="gradient-emergency h-11 rounded-xl font-bold text-emergency-foreground"><Siren className="mr-2 h-4 w-4" /> Open Emergency SOS</Button>
            <a href={secondaryHref} className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground transition-colors hover:bg-muted">{secondaryLabel}<ChevronRight className="ml-1.5 h-4 w-4" /></a>
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 shadow-xs sm:p-8">
          <h2 className="text-base font-bold">When to use this page</h2>
          <ul className="mt-5 space-y-4 text-sm text-muted-foreground">
            <li className="flex gap-3"><HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> Request help for an active emergency through the verified SOS flow.</li>
            <li className="flex gap-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" /> Review live response details once an emergency dispatch has been accepted.</li>
            <li className="flex gap-3"><CircleHelp className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> For platform guidance, use the Help Center or submit feedback to MediQ.</li>
          </ul>
        </div>
      </div>
    </PublicPageShell>
  );
}

export function EmergencyPage() {
  return <EmergencyAction title="Emergency help, connected" description="Open the MediQ SOS flow for urgent care coordination, then follow the status updates published by the dispatch team." secondaryHref="/ambulance" secondaryLabel="Ambulance response" />;
}

export function AmbulancePage() {
  return <EmergencyAction title="Ambulance response" description="Request an ambulance through MediQ Emergency SOS and use your patient portal to view any live dispatch details assigned to your account." secondaryHref="/emergency-hospitals" secondaryLabel="Emergency hospitals" />;
}

export function EmergencyHospitalsPage() {
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void fetchSupabaseHospitals().then((data) => { setHospitals(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);
  return (
    <PublicPageShell eyebrow="Emergency response" title="Emergency hospitals" description="Browse hospitals currently published in the MediQ network. Use the Hospital Indoor Navigation experience after you arrive for connected wayfinding.">
      {loading ? <div className="rounded-2xl border border-border border-l-4 border-l-primary bg-card p-8 text-sm text-muted-foreground">Loading live hospital directory…</div> : hospitals.length === 0 ? <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center"><Building2 className="mx-auto h-8 w-8 text-muted-foreground/60" /><p className="mt-3 text-sm font-bold">No emergency hospitals are currently published</p><p className="mt-1 text-xs text-muted-foreground">Please use Emergency SOS if you need help locating an available facility.</p></div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{hospitals.map((hospital) => <article key={hospital.id} className="rounded-2xl border border-border border-l-4 border-l-primary bg-card p-5 shadow-xs"><div className="flex items-start justify-between gap-3"><div><h2 className="text-base font-bold">{hospital.name || hospital.hospitalName || "Hospital"}</h2><p className="mt-1 text-xs text-muted-foreground">{hospital.address || hospital.location || "Address not published"}</p></div><Building2 className="h-5 w-5 shrink-0 text-primary" /></div><a href="/#hospital-navigation" className="mt-5 inline-flex items-center text-xs font-bold text-primary hover:text-primary/80">Open indoor navigation <ChevronRight className="ml-1 h-3.5 w-3.5" /></a></article>)}</div>}
    </PublicPageShell>
  );
}

export function BloodRequestsPage() {
  const [open, setOpen] = useState(false);
  return (
    <PublicPageShell eyebrow="Blood bank" title="Blood requests" description="Submit a verified blood request to the MediQ Blood Bank. Your request is sent to blood-bank staff for review and status updates.">
      <div className="rounded-3xl border border-red-500/20 border-l-4 border-l-red-500 bg-red-500/5 p-6 shadow-soft sm:p-8">
        <Droplet className="h-8 w-8 text-red-500" />
        <h2 className="mt-4 text-xl font-bold">Request blood through MediQ</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">Choose the required blood group, unit count, facility, and urgency in the existing live request form. You can also return to the public Blood Bank section to review inventory availability.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row"><Button onClick={() => setOpen(true)} className="h-11 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700"><Droplet className="mr-2 h-4 w-4" /> Start blood request</Button><a href="/#blood-bank" className="inline-flex h-11 items-center justify-center rounded-xl border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted">View blood bank</a></div>
      </div>
      <RequestBloodModal open={open} onOpenChange={setOpen} />
    </PublicPageShell>
  );
}

const HELP_TOPICS = [
  ["Appointments", "Find a doctor, choose a time, and track appointment updates in your account."],
  ["Emergency SOS", "Open the SOS flow for emergency coordination and follow accepted dispatch updates."],
  ["Patient records", "Published medical records, prescriptions, and lab results appear in the Patient portal."],
  ["Account access", "Use the Login menu to access the portal assigned to your MediQ role."],
];

export function HelpCenterPage() {
  return <PublicPageShell eyebrow="Support" title="Help Center" description="Find concise guidance for using MediQ’s public services, emergency tools, and account portals."><div className="grid gap-4 md:grid-cols-2">{HELP_TOPICS.map(([topic, body]) => <article key={topic} className="rounded-2xl border border-border border-l-4 border-l-primary bg-card p-5 shadow-xs"><CircleHelp className="h-5 w-5 text-primary" /><h2 className="mt-3 text-base font-bold">{topic}</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}</div></PublicPageShell>;
}

export function ContactPage() {
  return <PublicPageShell eyebrow="Support" title="Contact MediQ" description="Send a question, concern, or product-feedback message to the MediQ team using the connected feedback form below."><div className="rounded-3xl border border-border bg-card p-5 shadow-xs sm:p-8"><div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Mail className="h-5 w-5" /></span><div><h2 className="font-bold">Message the MediQ team</h2><p className="text-xs text-muted-foreground">Include enough detail for the team to understand and respond to your request.</p></div></div><FeedbackForm /></div></PublicPageShell>;
}

function PolicyPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  const items = privacy ? [["Information we collect", "MediQ processes information needed to provide its healthcare-platform features, account access, and service updates."], ["How information is used", "Information is used to deliver requested platform functionality, maintain security, and improve care coordination workflows."], ["Your account", "Keep your account credentials secure and review your published profile information in the appropriate portal."]] : [["Using MediQ", "Use MediQ only for lawful healthcare-platform interactions and provide accurate information when submitting requests."], ["Clinical information", "MediQ supports care coordination but does not replace the judgment of a qualified clinician or emergency service."], ["Account responsibilities", "You are responsible for actions taken through your account and for protecting your sign-in credentials."]];
  return <PublicPageShell eyebrow="Support" title={privacy ? "Privacy Policy" : "Terms & Conditions"} description={privacy ? "A clear overview of how MediQ handles platform information and account data." : "The core conditions that govern use of MediQ’s connected healthcare platform."}><div className="max-w-3xl space-y-4">{items.map(([heading, body]) => <article key={heading} className="rounded-2xl border border-border border-l-4 border-l-primary bg-card p-5 shadow-xs"><div className="flex items-center gap-2"><Scale className="h-4 w-4 text-primary" /><h2 className="text-base font-bold">{heading}</h2></div><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}<p className="px-1 text-xs leading-relaxed text-muted-foreground">These pages provide the platform’s current public overview. Your organization may require additional locally approved policy language before production use.</p></div></PublicPageShell>;
}

export function PrivacyPolicyPage() { return <PolicyPage type="privacy" />; }
export function TermsPage() { return <PolicyPage type="terms" />; }
