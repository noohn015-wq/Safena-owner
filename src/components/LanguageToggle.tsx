
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LanguageToggle({ lang, setLang }: any) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 px-3 text-slate-950 shadow-md hover:from-amber-500 hover:to-orange-600 active:shadow-inner active:scale-95 transition-all"
      onClick={() => setLang(lang === "ar" ? "en" : "ar")}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-bold">{lang === "ar" ? "EN" : "ع"}</span>
    </Button>
  );
}
