// Design: Guided Floorplan — footer links provide a clear account exit without duplicating entry-point actions.
import { Facebook, Instagram, Linkedin, LogOut, Twitter } from "lucide-react";
import { FeedbackForm } from "./FeedbackForm";
import { useAuth } from "@/hooks/use-auth";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Hospitals", href: "/#hospitals" }, { label: "Doctors", href: "/#doctors" }, { label: "Appointments", href: "/#appointments" }, { label: "Diagnostics", href: "/#diagnostics" }, { label: "Pharmacy", href: "/#pharmacy" }, { label: "Blood Bank", href: "/#blood-bank" },
    ],
  },
  { title: "Emergency", links: [{ label: "Emergency", href: "/emergency" }, { label: "Ambulance", href: "/ambulance" }, { label: "Emergency Hospitals", href: "/emergency-hospitals" }, { label: "Blood Requests", href: "/blood-requests" }] },
  {
    title: "Account",
    links: [{ label: "Patient Dashboard", href: "/patient" }, { label: "Appointments", href: "/#appointments" }, { label: "Medical Records", href: "/patient" }],
  },
  { title: "Support", links: [{ label: "Help Center", href: "/help-center" }, { label: "Contact", href: "/contact" }, { label: "Privacy Policy", href: "/privacy-policy" }, { label: "Terms & Conditions", href: "/terms-and-conditions" }] },
];

const socials = [
  { label: "Facebook", icon: Facebook },
  { label: "Twitter", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
];

export function Footer() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <>
      <FeedbackForm />
      <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-primary">
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path
                    d="M12 4v16M4 12h16"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    className="text-primary-foreground"
                  />
                </svg>
              </span>
              <span className="text-xl font-bold">
                Medi<span className="text-teal-foreground dark:text-teal">Q</span>
              </span>
            </div>
            <p className="mt-4 font-semibold">Connected Healthcare. Simplified Care.</p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              MediQ brings hospitals, doctors, diagnostics, pharmacy, blood banks and emergency
              response into a single coordinated platform — so patients get the right care faster.
            </p>
            <div className="mt-5 flex gap-2">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href="#home"
                  aria-label={social.label}
                  className="grid h-9 w-9 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors duration-200 hover:border-teal/50 hover:text-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="text-sm font-bold uppercase tracking-wide">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                {column.title === "Account" && user && (
                  <li>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive transition-colors duration-200 hover:text-destructive/80"
                    >
                      <LogOut className="h-3.5 w-3.5" /> Logout
                    </button>
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 MediQ. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Made for better connected healthcare.</p>
        </div>
      </div>
      </footer>
    </>
  );
}
