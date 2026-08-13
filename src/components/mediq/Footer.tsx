import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const columns = [
  {
    title: "Platform",
    links: ["Hospitals", "Doctors", "Appointments", "Diagnostics", "Pharmacy", "Blood Bank"],
  },
  { title: "Emergency", links: ["SOS", "Ambulance", "Emergency Hospitals", "Blood Requests"] },
  {
    title: "Account",
    links: ["Login", "Register", "Patient Dashboard", "Appointments", "Medical Records"],
  },
  {
    title: "Support",
    links: ["Help Center", "Contact", "Privacy Policy", "Terms & Conditions"],
  },
];

const socials = [
  { label: "Facebook", icon: Facebook },
  { label: "Twitter", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
];

export function Footer() {
  return (
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
                  <li key={link}>
                    <a
                      href="#home"
                      className="text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
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
  );
}
