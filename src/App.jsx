import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow.jsx";
import ThemeToggle from "@/components/chat/ThemeToggle.jsx";
import { Bot, Search, RotateCcw, Settings } from "lucide-react";

export default function App() {
  const [theme, setTheme] = useState("light");
  const [clearFlag, setClearFlag] = useState(0);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  return (
    <div className="h-dvh flex flex-col bg-[#F2F3F7] dark:bg-[#080B14] text-slate-900 dark:text-slate-50 overflow-hidden">
      {/* Subtle background grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Header */}
      <header className="relative shrink-0 border-b border-slate-200/60 dark:border-slate-700/30 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl z-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-700 via-purple-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-300/40 dark:shadow-purple-900/50 animate-pulse-glow">
                <Bot size={22} />
              </div>
              <div className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#0A0D1A]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold bg-gradient-to-r from-violet-700 via-purple-600 to-purple-500 dark:from-violet-300 dark:via-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                  KJSIM AI
                </h1>
                <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 leading-none tracking-wide">
                  ● Online
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 leading-tight font-medium">
                Institution Knowledge Assistant
              </p>
            </div>
          </div>

          <div className="flex items-center gap-0.5">
            {[
              { icon: Search, title: "Search chat" },
              { icon: RotateCcw, title: "Clear chat", action: () => setClearFlag((n) => n + 1) },
              { icon: Settings, title: "Settings" },
            ].map(({ icon: Icon, title, action }) => (
              <button
                key={title}
                type="button"
                onClick={action}
                className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-200 active:scale-90"
                title={title}
              >
                <Icon size={18} />
              </button>
            ))}
            <div className="w-px h-5 bg-slate-200 dark:bg-slate-700/50 mx-1.5" />
            <ThemeToggle theme={theme} setTheme={setTheme} />
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <ChatWindow key={clearFlag} />
      </main>
    </div>
  );
}
