import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeExternalLinks from "rehype-external-links";
import "highlight.js/styles/github.css"; // theme etc

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} w-full`}>
      <div className={`flex items-start gap-3 max-w-[90%] sm:max-w-[75%]`}>
        {!isUser && (
          <div className="mt-1 shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <Bot size={16} />
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
            isUser
              ? "bg-blue-600 text-white"
              : "bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800"
          }`}
        >
          <ReactMarkdown
            children={content}
            rehypePlugins={[
              rehypeHighlight,
              [
                rehypeExternalLinks,
                { target: "_blank", rel: ["noopener", "noreferrer"] },
              ],
            ]}
            components={{
              p: ({ node, ...props }) => <p className="my-1" {...props} />,
              pre: ({ node, ...props }) => (
                <pre
                  className="my-2 bg-slate-800 text-white p-4 rounded-md overflow-auto"
                  {...props}
                />
              ),
              code: ({ node, inline, className, children, ...props }) => {
                return inline ? (
                  <code
                    className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-sm"
                    {...props}
                  >
                    {children}
                  </code>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
              a: ({ node, ...props }) => (
                // Note: `href` etc will come in `props`
                <a
                  className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  {...props}
                />
              ),
            }}
          />
        </div>
        {isUser && (
          <div className="mt-1 shrink-0 h-8 w-8 rounded-full bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-100 flex items-center justify-center">
            <User size={16} />
          </div>
        )}
      </div>
    </div>
  );
}
