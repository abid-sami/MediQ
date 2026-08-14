import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Siren, Sun, X, Stethoscope, User, Activity, Pill, Droplet, Microscope, UserCheck, ShieldCheck, LogOut } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { navLinks } from "@/data/mediq";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { useMediQActions } from "./actions-context";
import { useAuth } from "@/hooks/use-auth";

function Logo() {
  return (
    <a href="#home" className="flex items-center gap-2.5" aria-label="MediQ home">
      <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-xl gradient-primary shadow-soft">
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
      <span className="text-xl font-bold tracking-tight">
        Medi<span className="text-teal-foreground dark:text-teal">Q</span>
      </span>
    </a>
  );
}

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { openSos, openLogin, openRegister } = useMediQActions();
  const { user, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const handleConfirmLogout = async () => {
    setLogoutConfirmOpen(false);
    await signOut();
    window.location.href = "/";
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "glass shadow-soft" : "border-b border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <Logo />
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setActive(link.href)}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-foreground",
                  active === link.href && "text-foreground",
                )}
              >
                {link.label}
                {active === link.href ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                ) : null}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user && role && (
            <>
              {role === "Lab Staff" && (
                <a
                  href="/laboratory-staff"
                  className="hidden items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3.5 py-1.5 text-xs font-bold text-teal transition-all hover:bg-teal hover:text-teal-foreground md:inline-flex"
                >
                  <Microscope className="h-3.5 w-3.5" /> Lab Portal
                </a>
              )}
              {role === "Ambulance Driver" && (
                <a
                  href="/ambulance-driver"
                  className="hidden items-center gap-1.5 rounded-full border border-destructive/40 bg-destructive/10 px-3.5 py-1.5 text-xs font-bold text-destructive transition-all hover:bg-destructive hover:text-white md:inline-flex"
                >
                  <Siren className="h-3.5 w-3.5" /> Ambulance Portal
                </a>
              )}
              {role === "Blood Bank Staff" && (
                <a
                  href="/blood-bank-staff"
                  className="hidden items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-1.5 text-xs font-bold text-red-600 dark:text-red-400 transition-all hover:bg-red-500 hover:text-white md:inline-flex"
                >
                  <Droplet className="h-3.5 w-3.5" /> Blood Bank Portal
                </a>
              )}
              {role === "Pharmacist" && (
                <a
                  href="/pharmacy"
                  className="hidden items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 transition-all hover:bg-amber-500 hover:text-white md:inline-flex"
                >
                  <Pill className="h-3.5 w-3.5" /> Pharmacy Portal
                </a>
              )}
              {role === "Nurse" && (
                <a
                  href="/nurse"
                  className="hidden items-center gap-1.5 rounded-full border border-purple-500/40 bg-purple-500/10 px-3.5 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 transition-all hover:bg-purple-500 hover:text-white md:inline-flex"
                >
                  <Activity className="h-3.5 w-3.5" /> Nurse Portal
                </a>
              )}
              {role === "Patient" && (
                <a
                  href="/patient"
                  className="hidden items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-3.5 py-1.5 text-xs font-bold text-teal transition-all hover:bg-teal hover:text-teal-foreground md:inline-flex"
                >
                  <User className="h-3.5 w-3.5" /> Patient Portal
                </a>
              )}
              {role === "Doctor" && (
                <a
                  href="/doctor"
                  className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground md:inline-flex"
                >
                  <Stethoscope className="h-3.5 w-3.5" /> Doctor Portal
                </a>
              )}
              {role === "Super Admin" && (
                <a
                  href="/admin"
                  className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground md:inline-flex"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Admin Portal
                </a>
              )}
              {role === "Receptionist" && (
                <a
                  href="/receptionist"
                  className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground md:inline-flex"
                >
                  <UserCheck className="h-3.5 w-3.5" /> Receptionist Portal
                </a>
              )}
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {!user ? (
            <>
              <Button onClick={openLogin} variant="ghost" className="hidden rounded-full font-semibold md:inline-flex">
                Login
              </Button>
              <Button onClick={openRegister} variant="outline" className="hidden rounded-full font-semibold md:inline-flex">
                Register
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setLogoutConfirmOpen(true)}
              variant="ghost"
              className="hidden items-center gap-1.5 rounded-full font-semibold text-destructive hover:text-destructive md:inline-flex"
            >
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          )}

          <Button
            onClick={openSos}
            className="relative rounded-full gradient-emergency font-semibold text-emergency-foreground hover:opacity-90"
          >
            <Siren className="h-4 w-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Emergency SOS</span>
            <span className="sr-only sm:hidden">Emergency SOS</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <AnimatePresence initial={false} mode="wait">
              {open ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.span>
              ) : (
                <motion.span
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border glass lg:hidden"
          >
            <nav className="mx-auto flex w-full max-w-7xl flex-col gap-1 px-4 py-4 sm:px-6">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                  onClick={() => {
                    setActive(link.href);
                    setOpen(false);
                  }}
                  className="rounded-xl px-3 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary/10"
                >
                  {link.label}
                </motion.a>
              ))}
              
              {!user ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openLogin();
                    }}
                    variant="outline"
                    className="rounded-full font-semibold"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      openRegister();
                    }}
                    className="rounded-full font-semibold"
                  >
                    Register
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => {
                    setOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                  variant="outline"
                  className="mt-3 rounded-full font-semibold text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <LogOut className="mr-1.5 h-4 w-4" /> Logout
                </Button>
              )}

              <Button
                onClick={() => {
                  setOpen(false);
                  openSos();
                }}
                className="mt-2 rounded-full gradient-emergency font-semibold text-emergency-foreground"
              >
                <Siren className="mr-1.5 h-4 w-4" />
                Emergency SOS
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutConfirmOpen} onOpenChange={setLogoutConfirmOpen}>
        <DialogContent className="max-w-xs p-6 rounded-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <LogOut className="h-5 w-5 text-destructive" /> Confirm Sign Out
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Are you sure you want to log out of the MediQ platform? You will need to sign in again to access patient or clinical portals.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-2 justify-end mt-4">
            <Button
              onClick={() => setLogoutConfirmOpen(false)}
              variant="ghost"
              className="text-xs font-semibold rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmLogout}
              className="bg-destructive hover:bg-destructive/90 text-white text-xs font-bold rounded-xl"
            >
              Sign Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
