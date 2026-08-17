import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import catalog from "@/data/bangla-translations.json";

export type Language = "en" | "bn";

type LanguageContextValue = {
  language: Language;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
  t: (english: string) => string;
};

const manualTranslations: Record<string, string> = {
  English: "ইংরেজি",
  Bangla: "বাংলা",
  Home: "হোম",
  Login: "লগইন",
  Register: "রেজিস্টার",
  Logout: "লগআউট",
  "Emergency SOS": "জরুরি SOS",
  Feedback: "মতামত",
  "Submit Feedback": "মতামত জমা দিন",
  "Loading...": "লোড হচ্ছে...",
  Refresh: "রিফ্রেশ",
  Save: "সেভ করুন",
  Cancel: "বাতিল",
  Close: "বন্ধ করুন",
};
const translations: Record<string, string> = { ...(catalog as Record<string, string>), ...manualTranslations };
const originalText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
let translating = false;

function translateText(value: string, language: Language) {
  const leading = value.match(/^\s*/)?.[0] || "";
  const trailing = value.match(/\s*$/)?.[0] || "";
  const core = value.trim();
  if (!core) return value;
  const translated = language === "bn" ? translations[core] || core : core;
  return `${leading}${translated}${trailing}`;
}

function translateDocument(language: Language) {
  if (typeof document === "undefined") return;
  translating = true;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const parent = node.parentElement;
    if (parent && !["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA", "INPUT"].includes(parent.tagName)) nodes.push(node as Text);
  }
  nodes.forEach((textNode) => {
    if (!originalText.has(textNode)) originalText.set(textNode, textNode.nodeValue || "");
    const source = originalText.get(textNode) || "";
    textNode.nodeValue = language === "bn" ? translateText(source, "bn") : source;
  });

  document.querySelectorAll<HTMLElement>("[placeholder], [title], [aria-label]").forEach((element) => {
    const attributes = originalAttributes.get(element) || new Map<string, string>();
    ["placeholder", "title", "aria-label"].forEach((attribute) => {
      const value = element.getAttribute(attribute);
      if (value === null) return;
      if (!attributes.has(attribute)) attributes.set(attribute, value);
      const source = attributes.get(attribute) || value;
      element.setAttribute(attribute, language === "bn" ? translateText(source, "bn") : source);
    });
    originalAttributes.set(element, attributes);
  });
  translating = false;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return window.localStorage.getItem("mediq-language") === "bn" ? "bn" : "en";
  });

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    if (typeof window !== "undefined") window.localStorage.setItem("mediq-language", next);
  }, []);
  const toggleLanguage = useCallback(() => setLanguage(language === "en" ? "bn" : "en"), [language, setLanguage]);
  const t = useCallback((english: string) => language === "bn" ? translations[english] || english : english, [language]);

  useEffect(() => {
    document.documentElement.lang = language === "bn" ? "bn" : "en";
    translateDocument(language);
    const observer = new MutationObserver(() => {
      if (!translating) translateDocument(language);
    });
    // Observe only newly inserted nodes. Observing characterData/attributes would
    // observe the translator's own changes and create an endless mutation loop.
    observer.observe(document.body, { subtree: true, childList: true });
    return () => observer.disconnect();
  }, [language]);

  const value = useMemo(() => ({ language, toggleLanguage, setLanguage, t }), [language, toggleLanguage, setLanguage, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
