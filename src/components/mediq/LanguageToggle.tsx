import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();
  const nextLanguage = language === "en" ? "Bangla" : "English";
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      title={`Switch to ${nextLanguage}`}
      aria-label={`Switch to ${nextLanguage}`}
      className="rounded-full"
    >
      <Languages className="h-5 w-5" />
      <span className="sr-only">{nextLanguage}</span>
    </Button>
  );
}
