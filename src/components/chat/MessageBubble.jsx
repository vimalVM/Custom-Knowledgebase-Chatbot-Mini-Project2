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
      className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-150 active:scale-90"
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
    <div className="mt-3 border-t border-slate-100 dark:border-slate-700/30 pt-2.5">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors uppercase tracking-wide"
      >
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
        Sources ({sources.length})
      </button>
      {open && (
        <div className="mt-2.5 space-y-1.5">
          {sources.map((s, i) => (
            <a
              key={i}
              href={s.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-purple-50 dark:hover:bg-purple-900/20 border border-slate-100 dark:border-slate-700/20 hover:border-purple-200/50 dark:hover:border-purple-700/30 text-xs text-slate-600 dark:text-slate-400 transition-all duration-200 group"
            >
              <span className="shrink-0 h-6 w-6 rounded-lg bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/40 dark:to-purple-800/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-[10px] font-bold">
                {i + 1}
              </span>
              <span className="flex-1 truncate font-medium">{s.title || `Source ${i + 1}`}</span>
              <ExternalLink size={12} className="text-slate-300 dark:text-slate-600 group-hover:text-purple-400 transition-colors shrink-0" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function FollowUpQuestions({ onFollowUp }) {
  const questions = [
    "What are admission deadlines?",
    "How can I apply for scholarships?",
    "Where can I find faculty contacts?",
  ];
  return (
    <div className="mt-3.5 flex flex-wrap gap-2">
      <span className="text-[11px] text-slate-400 dark:text-slate-500 w-full mb-0.5 font-semibold uppercase tracking-wide">
        Suggested follow-ups
      </span>
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onFollowUp?.(q)}
          className="text-xs px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700/60 bg-white dark:bg-[#12152A]/50 text-slate-600 dark:text-slate-400 hover:border-purple-300/60 dark:hover:border-purple-600/50 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:shadow-sm hover:shadow-purple-200/30 dark:hover:shadow-purple-900/20 transition-all duration-200 active:scale-95"
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
    <div className={cn("flex w-full py-1.5", isUser ? "justify-end" : "justify-start")}>
      <div className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
        isUser ? "max-w-[80%] sm:max-w-[70%]" : "max-w-[90%] sm:max-w-[80%] lg:max-w-[75%]"
      )}>
        <div className={cn(
          "mt-1 shrink-0 flex items-center justify-center shadow-lg",
          isUser
            ? "h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-purple-300/40 dark:shadow-purple-900/40"
            : "h-8 w-8 rounded-xl bg-gradient-to-br from-violet-700 via-purple-600 to-purple-500 text-white shadow-purple-300/40 dark:shadow-purple-900/40"
        )}>
          {isUser ? <User size={16} /> : <Sparkles size={16} />}
        </div>

        <div className={cn("min-w-0 max-w-full", isUser && "flex flex-col items-end")}>
          <div
            className={cn(
              "rounded-2xl px-4 py-3 leading-relaxed shadow-sm text-sm",
              isUser
                ? "bg-gradient-to-br from-violet-700 via-purple-600 to-purple-600 text-white shadow-lg shadow-purple-300/30 dark:shadow-purple-900/30 rounded-br-md"
                : "bg-white dark:bg-[#12152A]/60 border border-slate-200/80 dark:border-slate-700/40 text-slate-800 dark:text-slate-200 shadow-sm shadow-slate-200/50 dark:shadow-slate-900/30 rounded-bl-md"
            )}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap">{content}</p>
            ) : (
              <div className="[&_*:first-child]:mt-0 [&_*:last-child]:mb-0">
                <ReactMarkdown
                  children={content}
                  rehypePlugins={[
                    rehypeHighlight,
                    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
                  ]}
                  components={{
                    p: ({ children, ...props }) => (
                      <p className="my-1.5 first:mt-0 last:mb-0 leading-relaxed" {...props}>{children}</p>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className="my-3 bg-slate-800 dark:bg-slate-900 text-slate-100 p-4 rounded-xl overflow-auto text-sm shadow-inner" {...props}>
                        {children}
                      </pre>
                    ),
                    code: ({ inline, className, children, ...props }) =>
                      inline ? (
                        <code className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-md text-sm font-mono text-violet-600 dark:text-violet-400 font-medium" {...props}>
                          {children}
                        </code>
                      ) : (
                        <code className={className} {...props}>{children}</code>
                      ),
                    a: ({ children, ...props }) => (
                      <a className="text-violet-600 dark:text-violet-400 underline underline-offset-2 decoration-violet-300 dark:decoration-violet-700 hover:text-violet-800 dark:hover:text-violet-300 transition-colors font-medium" {...props}>
                        {children}
                      </a>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="my-2 space-y-1.5 list-disc pl-5 marker:text-slate-300 dark:marker:text-slate-600" {...props}>{children}</ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="my-2 space-y-1.5 list-decimal pl-5 marker:text-slate-500 dark:marker:text-slate-400" {...props}>{children}</ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-slate-700 dark:text-slate-300" {...props}>{children}</li>
                    ),
                    h1: ({ children, ...props }) => (
                      <h1 className="text-lg font-bold mt-4 mb-2 text-slate-900 dark:text-slate-100" {...props}>{children}</h1>
                    ),
                    h2: ({ children, ...props }) => (
                      <h2 className="text-base font-bold mt-3 mb-2 text-slate-900 dark:text-slate-100" {...props}>{children}</h2>
                    ),
                    h3: ({ children, ...props }) => (
                      <h3 className="text-sm font-bold mt-3 mb-1 text-slate-900 dark:text-slate-100" {...props}>{children}</h3>
                    ),
                    hr: (props) => <hr className="my-4 border-slate-200 dark:border-slate-700/50" {...props} />,
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="my-3 pl-4 border-l-2 border-violet-300 dark:border-violet-700 text-slate-500 dark:text-slate-400 italic" {...props}>
                        {children}
                      </blockquote>
                    ),
                    table: ({ children, ...props }) => (
                      <div className="my-3 overflow-x-auto">
                        <table className="min-w-full text-sm border-collapse" {...props}>{children}</table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="px-3 py-2 bg-slate-50 dark:bg-slate-800/50 font-semibold text-left border border-slate-200 dark:border-slate-700" {...props}>{children}</th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="px-3 py-2 border border-slate-200 dark:border-slate-700" {...props}>{children}</td>
                    ),
                  }}
                />
              </div>
            )}
          </div>

          {!isUser && (
            <div className="flex items-center gap-0.5 mt-1.5 px-0.5">
              <CopyButton content={content} />
              <button className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-150 active:scale-90" title="Helpful">
                <ThumbsUp size={14} />
              </button>
              <button className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-all duration-150 active:scale-90" title="Not helpful">
                <ThumbsDown size={14} />
              </button>
              <button className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/60 flex items-center justify-center text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-150 active:scale-90" title="Regenerate">
                <RefreshCw size={14} />
              </button>
              {metadata && (
                <span className="ml-auto text-[11px] text-slate-400 dark:text-slate-600 font-medium">
                  {metadata.type && `${metadata.type} \u2022 `}
                  {metadata.sourceCount !== undefined && `${metadata.sourceCount} source${metadata.sourceCount !== 1 ? "s" : ""} \u2022 `}
                  <span className="text-purple-500 dark:text-purple-400">{metadata.timing || "1.4s"}</span>
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
