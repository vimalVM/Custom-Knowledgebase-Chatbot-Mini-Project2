import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import MessageBubble from "./MessageBubble.jsx";
import { Loader2, Sparkles, Paperclip, Mic, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const SUGGESTED_QUESTIONS = [
  { icon: "\uD83C\uDF93", title: "Scholarships & Financial Aid", description: "Explore available funding options" },
  { icon: "\uD83D\uDCC5", title: "Academic Calendar", description: "View semester dates and deadlines" },
  { icon: "\uD83D\uDD2C", title: "Faculty Research Support", description: "Find grants and research opportunities" },
  { icon: "\uD83D\uDDFA", title: "Campus Tours", description: "Plan your visit" },
];

const THINKING_MESSAGES = [
  "Thinking", "Searching knowledge base", "Analyzing information", "Generating response",
];

export default function ChatWindow() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [thinkingIdx, setThinkingIdx] = useState(0);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg], role: "all" }),
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
  }, [input, canSend, messages, API_BASE_URL]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 200) + "px";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend(e);
    }
  };

  const isWelcome = messages.length === 0 && !loading;

  return (
    <div className="flex-1 flex flex-col min-h-0 mx-auto w-full max-w-4xl lg:max-w-5xl">
      {/* Messages */}
      <div
        ref={listRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 space-y-1 scroll-smooth"
      >
        {isWelcome ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="mb-10">
              <div className="relative inline-flex mb-8">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/20 to-transparent blur-2xl scale-150" />
                <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-700 via-purple-600 to-purple-500 text-white flex items-center justify-center shadow-2xl shadow-purple-300/50 dark:shadow-purple-900/50 animate-pulse-glow">
                  <Sparkles size={36} />
                </div>
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-violet-700 via-purple-600 to-purple-500 dark:from-violet-300 dark:via-purple-400 dark:to-purple-300 bg-clip-text text-transparent">
                  How can I help you today?
                </span>
              </h1>
              <p className="text-[15px] sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
                Ask questions about admissions, scholarships, academic calendars, faculty resources, campus services and more.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q.title}
                  onClick={() => onSend(null, q.title)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/70 dark:bg-[#12152A]/50 backdrop-blur-sm px-5 py-4.5 text-left hover:border-purple-300/60 dark:hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/60 via-transparent to-transparent dark:from-purple-900/15 dark:via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-purple-300/0 via-purple-400/0 to-purple-500/0 group-hover:from-purple-300/30 group-hover:via-purple-400/20 group-hover:to-purple-500/10 dark:group-hover:from-purple-500/30 dark:group-hover:via-purple-400/20 dark:group-hover:to-purple-300/10 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none" />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-2xl">{q.icon}</span>
                      <span className="h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 dark:text-slate-500 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-all duration-200">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 6h8" /><path d="M6 2l4 4-4 4" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-0.5">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
              <div key={m.id} className="animate-fade-in">
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
              <div className="animate-fade-in">
                <div className="flex items-start gap-3 max-w-[90%] sm:max-w-[75%]">
                  <div className="mt-1 shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-violet-700 via-purple-600 to-purple-500 text-white flex items-center justify-center shadow-lg shadow-purple-300/30 dark:shadow-purple-900/40">
                    <Sparkles size={16} />
                  </div>
                  <div className="rounded-2xl px-5 py-3.5 bg-white dark:bg-[#12152A]/60 border border-slate-200 dark:border-slate-700/40 shadow-md shadow-slate-200/50 dark:shadow-slate-900/30">
                    <div className="flex items-center gap-2.5 text-sm">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{THINKING_MESSAGES[thinkingIdx]}</span>
                      <span className="flex gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 animate-typing-dot" style={{ animationDelay: "0s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 animate-typing-dot" style={{ animationDelay: "0.2s" }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-b from-violet-500 to-purple-500 animate-typing-dot" style={{ animationDelay: "0.4s" }} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="shrink-0 border-t border-slate-200/60 dark:border-slate-700/30 bg-white/80 dark:bg-[#0A0D1A]/80 backdrop-blur-xl px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={onSend} className="mx-auto max-w-4xl lg:max-w-5xl">
          <div
            className={cn(
              "relative flex items-end gap-2 bg-white dark:bg-[#12152A]/70 border-2 rounded-2xl shadow-sm transition-all duration-200",
              "border-slate-200 dark:border-slate-700/40",
              "focus-within:border-purple-400/60 dark:focus-within:border-purple-500/50 focus-within:shadow-lg focus-within:shadow-purple-200/30 dark:focus-within:shadow-purple-900/20"
            )}
          >
            <div className="flex items-end gap-0.5 pl-3 pb-3">
              <button type="button" className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-200 active:scale-90" title="Attach file">
                <Paperclip size={18} />
              </button>
              <button type="button" className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-200 active:scale-90" title="Voice input">
                <Mic size={18} />
              </button>
            </div>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about the institution..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-1 py-3.5 text-base text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none leading-relaxed min-h-[48px] max-h-[200px]"
            />
            <div className="flex items-end gap-1 pr-2 pb-3">
              <button
                type="submit"
                disabled={!canSend}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0",
                  canSend
                    ? "bg-gradient-to-br from-violet-700 via-purple-600 to-purple-500 text-white shadow-md hover:shadow-lg hover:shadow-purple-300/40 dark:hover:shadow-purple-900/40 hover:scale-105 active:scale-95"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed"
                )}
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <ArrowUp size={18} />
                )}
              </button>
            </div>
          </div>
          <p className="mt-2.5 text-center text-[11px] text-slate-400 dark:text-slate-600 font-medium">
            Powered by institutional knowledge base &middot; AI-generated responses
          </p>
        </form>
      </div>
    </div>
  );
}
