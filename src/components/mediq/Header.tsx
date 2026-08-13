import { AnimatePresence, motion } from "motion/react";
import { Menu, Moon, Siren, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { navLinks } from "@/data/mediq";
import { cn } from "@/lib/utils";

import { useMediQActions } from "./actions-context";

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
  const { openSos } = useMediQActions();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("#home");

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
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="rounded-full"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" className="hidden rounded-full font-semibold md:inline-flex">
            Login
          </Button>
          <Button variant="outline" className="hidden rounded-full font-semibold md:inline-flex">
            Register
          </Button>
          <Button
            onClick={openSos}
            className="relative hidden rounded-full gradient-emergency font-semibold text-emergency-foreground hover:opacity-90 sm:inline-flex"
          >
            <Siren className="mr-1.5 h-4 w-4" />
            Emergency SOS
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
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button variant="outline" className="rounded-full font-semibold">
                  Login
                </Button>
                <Button className="rounded-full font-semibold">Register</Button>
              </div>
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
    </header>
  );
}
