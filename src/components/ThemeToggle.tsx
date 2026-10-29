import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle({ theme, setTheme }: any) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full bg-white px-3 shadow-sm dark:bg-slate-800"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
    </Button>
  );
}