import { useState } from "react";
import { User, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, RefreshCw, ChevronDown, ChevronRight, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import "highlight.js/styles/github.css";
import { cn } from "@/lib/utils";

function CopyButton({ content }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <button
      onClick={handleCopy}
      className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-all duration-150 active:scale-90"
      title="Copy response"
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

function SourceCitation({ sources }) {
  const [open, setOpen] = useState(false);
  if (!sources || sources.length === 0) return null;
  return (
    <div className="mt-2 sm:mt-3 border-t border-slate-100 dark:border-slate-700/20 pt-2 sm:pt-2.5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-colors uppercase tracking-wider"
      >
        {open ? <ChevronDown size={12} className="sm:size-[13px]" /> : <ChevronRight size={12} className="sm:size-[13px]" />}
        References ({sources.length})
      </button>
      {open && (
        <div className="mt-2 sm:mt-2.5 space-y-1 sm:space-y-1.5">
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-800/30 hover:bg-purple-50 dark:hover:bg-purple-900/15 border border-slate-100 dark:border-slate-700/20 hover:border-[#7C3AED]/20 dark:hover:border-[#A855F7]/20 text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 transition-all duration-200 group"
            >
              <span className="shrink-0 h-5 w-5 sm:h-6 sm:w-6 rounded-lg bg-gradient-to-br from-[#7C3AED]/10 to-[#A855F7]/10 dark:from-[#7C3AED]/20 dark:to-[#A855F7]/10 text-[#7C3AED] dark:text-[#A855F7] flex items-center justify-center text-[9px] sm:text-[10px] font-bold">
                {i + 1}
              </span>
              <span className="flex-1 truncate font-medium">{s.title || `Source ${i + 1}`}</span>
              <ExternalLink size={10} className="sm:size-[12px] text-slate-300 dark:text-slate-600 group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition-colors shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FollowUpQuestions({ onFollowUp }) {
  const questions = [
    "What are the admission deadlines?",
    "How can I apply for scholarships?",
    "What courses are available?",
    "How do I contact faculty?",
  ];
  return (
    <div className="mt-3 sm:mt-4 flex flex-wrap gap-1.5 sm:gap-2">
      <span className="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 w-full mb-0.5 font-semibold uppercase tracking-wider">
        Suggested follow-ups
      </span>
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onFollowUp?.(q)}
          className="text-[11px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:border-[#7C3AED]/30 dark:hover:border-[#A855F7]/30 hover:text-[#7C3AED] dark:hover:text-[#A855F7] hover:bg-purple-50 dark:hover:bg-purple-900/15 hover:shadow-sm hover:shadow-[#7C3AED]/10 dark:hover:shadow-[#A855F7]/10 transition-all duration-200 active:scale-95 truncate max-w-[160px] sm:max-w-none"
        >
          {q}
        </button>
      ))}
    </div>
  );
}

export default function MessageBubble({ role, content, sources, metadata, onFollowUp }) {
  const isUser = role === "user";

  return (
    <div className={cn("flex w-full py-1 sm:py-1.5", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex items-start gap-2 sm:gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        isUser ? "max-w-[88%] sm:max-w-[78%] lg:max-w-[72%]" : "max-w-[92%] sm:max-w-[84%] lg:max-w-[76%]"
      )}>
        {/* Avatar */}
        <div className={cn(
          "mt-1 shrink-0 flex items-center justify-center shadow-lg relative",
          isUser
            ? "h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#A855F7] text-white shadow-[#7C3AED]/30 dark:shadow-[#7C3AED]/40"
            : "h-7 w-7 sm:h-8 sm:w-8 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-[#7C3AED]/30 dark:shadow-[#7C3AED]/40"
        )}>
          <div className={cn(
            "absolute inset-0 rounded-[inherit]",
            isUser ? "bg-gradient-to-br from-white/20 via-transparent to-transparent" : "bg-gradient-to-tr from-white/20 via-transparent to-transparent"
          )} />
          {isUser ? <User size={13} className="sm:size-[16px] relative z-10" /> : <Sparkles size={13} className="sm:size-[16px] relative z-10" />}
        </div>

        {/* Content */}
        <div className={cn("min-w-0 max-w-full", isUser && "flex flex-col items-end")}>
          <div
            className={cn(
              "rounded-[16px] sm:rounded-[20px] px-3 sm:px-4 py-2.5 sm:py-3 leading-relaxed shadow-sm",
              isUser
                ? "bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A855F7] text-white shadow-lg shadow-[#7C3AED]/25 dark:shadow-[#7C3AED]/30 rounded-br-md text-sm sm:text-[15px]"
                : "bg-white dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/25 text-slate-800 dark:text-slate-200 shadow-sm shadow-slate-200/50 dark:shadow-black/20 rounded-bl-md text-sm sm:text-[15px]"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
            ) : (
              <div className="leading-relaxed [&_*:first-child]:mt-0 [&_*:last-child]:mb-0">
                <ReactMarkdown
                  children={content}
                  rehypePlugins={[
                    rehypeHighlight,
                    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
                  ]}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className="my-2 first:mt-0 last:mb-0 leading-relaxed" {...props}>{children}</p>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className="my-4 bg-slate-800 dark:bg-slate-900 text-slate-100 p-4 sm:p-5 rounded-xl overflow-auto text-sm shadow-inner" {...props}>
                        {children}
                      </pre>
                    ),
                    code: ({ inline, className, children, ...props }) =>
                      inline ? (
                        <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-sm font-mono text-[#7C3AED] dark:text-[#A855F7] font-medium" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      ),
                    a: ({ children, ...props }) => (
                      <a className="text-[#7C3AED] dark:text-[#A855F7] underline underline-offset-2 decoration-[#7C3AED]/30 dark:decoration-[#A855F7]/30 hover:text-[#6D28D9] dark:hover:text-[#C084FC] transition-colors font-medium" {...props}>
                        {children}
                      </a>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="my-2.5 space-y-1.5 list-disc pl-5 marker:text-slate-300 dark:marker:text-slate-600" {...props}>{children}</ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="my-2.5 space-y-1.5 list-decimal pl-5 marker:text-slate-500 dark:marker:text-slate-400" {...props}>{children}</ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-slate-700 dark:text-slate-300" {...props}>{children}</li>
                    ),
                    h1: ({ children, ...props }) => (
                      <h1 className="text-lg font-bold mt-5 mb-2.5 text-slate-900 dark:text-slate-100" {...props}>{children}</h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-base font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100" {...props}>{children}</h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-[15px] font-bold mt-3.5 mb-1.5 text-slate-900 dark:text-slate-100" {...props}>{children}</h3>
                    ),
                    hr: (props) => <hr className="my-5 border-slate-200 dark:border-slate-700/40" {...props} />,
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="my-3.5 pl-4 border-l-2 border-[#7C3AED]/40 dark:border-[#A855F7]/40 text-slate-500 dark:text-slate-400 italic" {...props}>
                        {children}
                      </blockquote>
                    ),
                    table: ({ children, ...props }) => (
                      <div className="my-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700/30">
                        <table className="min-w-full text-sm border-collapse" {...props}>{children}</table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 font-semibold text-left border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" {...props}>{children}</th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/20" {...props}>{children}</td>
                    ),
                    strong: ({ children, ...props }) => (
                      <strong className="font-semibold text-slate-900 dark:text-slate-100" {...props}>{children}</strong>
                    ),
                    em: ({ children, ...props }) => (
                      <em className="italic" {...props}>{children}</em>
                    ),
                  }}
                />
              </div>
            )}
          </div>

          {/* Actions Footer */}
          {!isUser && (
            <div className="flex items-center gap-0.5 mt-1 sm:mt-1.5 px-0.5">
              <CopyButton content={content} />
              <button className="hidden sm:flex h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 active:scale-90" title="Helpful">
                <ThumbsUp size={14} />
              </button>
              <button className="hidden sm:flex h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 active:scale-90" title="Not helpful">
                <ThumbsDown size={14} />
              </button>
              <button className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-[#7C3AED] dark:hover:text-[#A855F7] transition-all duration-150 active:scale-90" title="Regenerate">
                <RefreshCw size={14} />
              </button>
              {metadata && (
                <span className="ml-auto text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                  {metadata.type && <span className="hidden sm:inline">{metadata.type}</span>}
                  {metadata.sourceCount !== undefined && (
                    <><span className="hidden sm:inline"> \u2022 </span>{metadata.sourceCount}s</>
                  )}
                  <span className="text-[#7C3AED] dark:text-[#A855F7] font-semibold ml-1">{metadata.timing || "1.4s"}</span>
                </span>
              )}
            </div>
          )}

          {!isUser && <SourceCitation sources={sources} />}

          {!isUser && onFollowUp && (
            <FollowUpQuestions onFollowUp={onFollowUp} />
          )}
        </div>
      </div>
    </div>
  );
}
