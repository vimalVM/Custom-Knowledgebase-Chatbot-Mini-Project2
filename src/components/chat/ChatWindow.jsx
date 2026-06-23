import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { Loader2, Sparkles, Paperclip, Mic, Smile, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  { icon: "\uD83C\uDF93", title: "Scholarships & Financial Aid", description: "Explore available funding opportunities" },
  { icon: "\uD83D\uDCC5", title: "Academic Calendar", description: "View important dates and deadlines" },
  { icon: "\uD83D\uDD2C", title: "Faculty Research Support", description: "Access grants and research resources" },
  { icon: "\uD83D\uDDFA\uFE0F", title: "Campus Tours & Visitor Info", description: "Plan your campus visit" },
  { icon: "\uD83D\uDCBC", title: "Career Services", description: "Explore placements and internships" },
  { icon: "\uD83D\uDCDA", title: "Library Resources", description: "Find books, journals and databases" },
];

const THINKING_MESSAGES = [
  "Thinking", "Searching knowledge base", "Analyzing documents", "Preparing response",
];

export default function ChatWindow({ role = "all" }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [thinkingIdx, setThinkingIdx] = useState(0);

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "";
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading) return;
    setThinkingIdx(0);
    const id = setInterval(() => {
      setThinkingIdx((i) => (i + 1) % THINKING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const onSend = useCallback(async (e, preset) => {
    if (e) e.preventDefault();
    if (!canSend && !preset) return;

    const content = preset || input.trim();
    const userMsg = { id: crypto.randomUUID(), role: "user", content };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], role }),
      });
      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const answerText = data.answer || "I could not generate a response.";
      const sources = Array.isArray(data.sources) ? data.sources : [];

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: answerText,
          sources,
          metadata: {
            type: "Knowledge Base",
            sourceCount: sources.length,
            timing: data.timing || "1.4s",
          },
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
          sources: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, canSend, messages, API_BASE]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  const isWelcome = messages.length === 0 && !loading;

  return (
    <div className="flex-1 flex flex-col min-h-0 mx-auto w-full max-w-4xl lg:max-w-5xl relative">
      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-6 space-y-1 scroll-smooth"
      >
        {isWelcome ? (
          <div className="min-h-full flex flex-col items-center justify-start sm:justify-center text-center px-2 sm:px-4 pt-6 sm:pt-0">
            {/* AI Orb Hero */}
            <div className="mb-5 sm:mb-12">
              <div className="relative inline-flex mb-4 sm:mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7C3AED]/20 via-[#8B5CF6]/15 to-transparent blur-[40px] sm:blur-[60px] scale-150" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#A855F7]/10 via-transparent to-[#7C3AED]/10 blur-[30px] sm:blur-[40px] scale-125" />
                <div className="relative h-[56px] w-[56px] sm:h-[100px] sm:w-[100px] lg:h-[120px] lg:w-[120px] rounded-full bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] flex items-center justify-center shadow-2xl shadow-[#7C3AED]/30 dark:shadow-[#7C3AED]/40 animate-pulse-glow-lg">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 via-transparent to-white/10" />
                  <Sparkles size={24} className="sm:size-[32px] lg:size-[40px] text-white drop-shadow-lg relative z-10" />
                </div>
              </div>
              <h1 className="text-[20px] sm:text-[36px] lg:text-[48px] font-bold mb-2 sm:mb-4 tracking-tight leading-[1.1] px-2">
                <span className="bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] dark:from-[#A855F7] dark:via-[#C084FC] dark:to-[#D8B4FE] bg-clip-text text-transparent">
                  How can I help you today?
                </span>
              </h1>
              <p className="text-[12px] sm:text-[15px] lg:text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed font-medium px-2">
                Ask questions about admissions, scholarships, academic calendars, student services, campus resources, and more.
              </p>
            </div>

            {/* Quick Action Cards - 3x2 Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 w-full max-w-3xl px-1 sm:px-0 pb-4 sm:pb-0">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={q.title}
                  onClick={() => onSend(null, q.title)}
                  className={cn(
                    "group relative overflow-hidden rounded-xl sm:rounded-2xl border border-slate-200/70 dark:border-slate-700/40 bg-white/60 dark:bg-slate-800/30 backdrop-blur-sm px-3 sm:px-5 py-3 sm:py-4.5 text-left transition-all duration-300 hover:-translate-y-0.5 sm:hover:-translate-y-1",
                    "hover:border-[#7C3AED]/30 dark:hover:border-[#A855F7]/30 hover:shadow-lg sm:hover:shadow-xl hover:shadow-purple-200/20 dark:hover:shadow-[#7C3AED]/10",
                    "animate-fade-in-up",
                    `stagger-${i + 1}`
                  )}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent dark:from-purple-900/10 dark:via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-px rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#7C3AED]/0 via-[#8B5CF6]/0 to-[#A855F7]/0 group-hover:from-[#7C3AED]/20 group-hover:via-[#8B5CF6]/10 group-hover:to-[#A855F7]/5 dark:group-hover:from-[#7C3AED]/25 dark:group-hover:via-[#8B5CF6]/15 dark:group-hover:to-[#A855F7]/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2 sm:mb-3">
                      <span className="text-lg sm:text-[22px] lg:text-2xl">{q.icon}</span>
                      <span className="h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-[#7C3AED]/10 dark:group-hover:bg-[#A855F7]/10 group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition-all duration-200 group-hover:translate-x-0.5">
                        <svg width="10" height="10" className="sm:w-[12px] sm:h-[12px]" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6h8" /><path d="M6 2l4 4-4 4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-[12px] sm:text-[13px] lg:text-sm mb-0.5 sm:mb-1 leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-[11px] sm:text-[12px] text-slate-500 dark:text-slate-400 leading-snug hidden sm:block">
                      {q.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="animate-fade-in-up">
                <MessageBubble
                  role={m.role}
                  content={m.content}
                  sources={m.sources}
                  metadata={m.metadata}
                  onFollowUp={(q) => onSend(null, q)}
                />
              </div>
            ))}
            {loading && (
              <div className="animate-fade-in-up">
                <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[75%]">
                  <div className="mt-1 shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white flex items-center justify-center shadow-lg shadow-purple-300/30 dark:shadow-purple-900/40 relative">
                    <div className="absolute inset-0 rounded-xl animate-shimmer" />
                    <Sparkles size={16} className="relative z-10" />
                  </div>
                  <div className="rounded-2xl px-5 py-3.5 bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/30 shadow-md shadow-slate-200/30 dark:shadow-black/20">
                    <div className="flex items-center gap-2.5 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{THINKING_MESSAGES[thinkingIdx]}</span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#A855F7] animate-typing-dot" style={{ animationDelay: "0s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#A855F7] animate-typing-dot" style={{ animationDelay: "0.2s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-[#7C3AED] to-[#A855F7] animate-typing-dot" style={{ animationDelay: "0.4s" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Premium AI Input Composer */}
      <div className="shrink-0 px-2 sm:px-4 lg:px-6 pb-2 sm:pb-4 pt-1.5 sm:pt-2 bg-gradient-to-t from-[#F8FAFC] via-[#F8FAFC]/95 to-transparent dark:from-[#0F172A] dark:via-[#0F172A]/95 dark:to-transparent">
        <form onSubmit={onSend} className="mx-auto max-w-4xl lg:max-w-5xl">
          <div
            className={cn(
              "relative flex items-end gap-1 sm:gap-2 bg-white dark:bg-slate-800/60 border-2 rounded-xl sm:rounded-2xl shadow-sm transition-all duration-200",
              "border-slate-200/80 dark:border-slate-700/30",
              "focus-within:border-[#7C3AED]/40 dark:focus-within:border-[#A855F7]/30 focus-within:shadow-lg focus-within:shadow-[#7C3AED]/10 dark:focus-within:shadow-[#A855F7]/10"
            )}
          >
            <div className="flex items-end gap-0.5 pl-2.5 sm:pl-3.5 pb-2.5 sm:pb-3.5">
              <button type="button" className="hidden sm:flex h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 items-center justify-center text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-all duration-200 active:scale-90" title="Attach file">
                <Paperclip size={17} />
              </button>
              <button type="button" className="hidden sm:flex h-8 w-8 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 items-center justify-center text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-all duration-200 active:scale-90" title="Voice input">
                <Mic size={17} />
              </button>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about KJSIM..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-1 py-2.5 sm:py-3.5 text-[14px] sm:text-[15px] text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none leading-relaxed min-h-[40px] sm:min-h-[48px] max-h-[120px] sm:max-h-[180px]"
            />
            <div className="flex items-end gap-1 pr-2 sm:pr-2.5 pb-2.5 sm:pb-3">
              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "h-9 w-9 sm:h-10 sm:w-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0",
                  canSend
                    ? "bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-md shadow-[#7C3AED]/20 dark:shadow-[#7C3AED]/30 hover:shadow-lg hover:shadow-[#7C3AED]/30 dark:hover:shadow-[#7C3AED]/40 hover:scale-105 active:scale-95"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <Loader2 size={16} className="sm:size-[18px] animate-spin" />
                ) : (
                  <ArrowUp size={17} className="sm:size-[19px]" />
                )}
              </button>
            </div>
          </div>
          <p className="mt-1.5 sm:mt-2.5 text-center text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-600 font-medium tracking-wide">
            AI-powered responses from the institutional knowledge base
          </p>
        </form>
      </div>
    </div>
  );
}
