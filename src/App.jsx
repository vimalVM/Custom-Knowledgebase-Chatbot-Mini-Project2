import { useEffect, useState } from "react";
import ChatWindow from "@/components/chat/ChatWindow.jsx";
import ThemeToggle from "@/components/chat/ThemeToggle.jsx";
import { Bot, Settings, User, Users, GraduationCap, Briefcase, Building2, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ROLES = [
  { value: "all", label: "Everyone", icon: Globe },
  { value: "user", label: "User", icon: User },
  { value: "faculty", label: "Faculty", icon: GraduationCap },
  { value: "student", label: "Student", icon: Users },
  { value: "staff", label: "Staff", icon: Briefcase },
  { value: "guest", label: "Guest", icon: Building2 },
];

export default function App() {
  const [theme, setTheme] = useState("light");
  const [role, setRole] = useState("all");
  const [clearFlag, setClearFlag] = useState(0);
  const [showRoleHint, setShowRoleHint] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [theme]);

  const currentRole = ROLES.find((r) => r.value === role);

  return (
    <div className="h-dvh flex flex-col bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-50 overflow-hidden relative">
      {/* Ambient background layers */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-purple-500/15 via-violet-500/10 to-transparent blur-3xl animate-float-orb" />
        <div className="absolute -bottom-48 -left-48 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-violet-500/12 via-purple-500/8 to-transparent blur-3xl animate-float-orb-2" />
        <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-gradient-to-r from-purple-400/8 to-violet-400/5 blur-3xl animate-float-orb-3" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-gradient-to-l from-violet-400/8 to-purple-500/5 blur-3xl animate-float-orb-2" style={{ animationDelay: "-10s" }} />
      </div>

      {/* Subtle grain overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.012] dark:opacity-[0.025]">
        <div className="absolute inset-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      </div>

      {/* Premium Floating Header */}
      <header className="shrink-0 relative z-50 pt-2 sm:pt-3 px-2 sm:px-4 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-2xl bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl border border-white/30 dark:border-slate-700/20 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04),0_2px_8px_-2px_rgba(0,0,0,0.02)] dark:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.3)] h-12 sm:h-14 px-3 sm:px-4 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="relative shrink-0">
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-lg shadow-purple-300/30 dark:shadow-purple-900/40">
                  <Bot size={16} className="sm:size-[20px]" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-emerald-500 border-[2px] sm:border-[2.5px] border-white dark:border-[#0F172A]" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <h1 className="text-[13px] sm:text-[15px] font-bold bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] dark:from-[#A855F7] dark:via-[#C084FC] dark:to-[#D8B4FE] bg-clip-text text-transparent tracking-tight truncate">
                    KJSIM AI
                  </h1>
                  <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50 tracking-wide shrink-0">
                    ● Online
                  </span>
                </div>
                <p className="hidden sm:block text-[11px] text-slate-500 dark:text-slate-500 font-medium leading-tight truncate">
                  Knowledge-Powered Assistant
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-0.5 shrink-0">
              <DropdownMenu onOpenChange={(open) => setShowRoleHint(open)}>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-all duration-200 active:scale-90 relative" title="Role settings">
                    <Settings size={16} className="sm:size-[18px]" />
                    {role !== "all" && (
                      <span className="absolute top-0.5 right-0.5 h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#7C3AED]" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 sm:w-48">
                  <DropdownMenuLabel className="text-xs sm:text-sm">Response Role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                    {ROLES.map(({ value, label, icon: Icon }) => (
                      <DropdownMenuRadioItem key={value} value={value} className="text-xs sm:text-sm gap-2 sm:gap-3">
                        <Icon size={14} className="sm:size-[16px] text-slate-400" />
                        {label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="w-px h-4 sm:h-5 bg-slate-200 dark:bg-slate-700/50 mx-1" />
              <ThemeToggle theme={theme} setTheme={setTheme} />
              <button
                onClick={() => setClearFlag((n) => n + 1)}
                className="ml-0.5 sm:ml-1 h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center text-[10px] sm:text-xs font-bold shadow-md shadow-purple-200/30 dark:shadow-purple-900/30 hover:shadow-lg hover:shadow-[#7C3AED]/30 transition-all duration-200 active:scale-90"
                title="Clear chat"
              >
                <Bot size={12} className="sm:size-[14px]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 flex flex-col min-h-0 pt-1 sm:pt-2">
        <ChatWindow key={clearFlag} role={role} />
      </main>
    </div>
  );
}
