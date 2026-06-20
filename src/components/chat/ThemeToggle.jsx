import { Moon, Sun } from "lucide-react";

export default function ThemeToggle({ theme, setTheme }) {
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-purple-500 dark:text-slate-500 dark:hover:text-purple-400 transition-all duration-200 active:scale-90"
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
