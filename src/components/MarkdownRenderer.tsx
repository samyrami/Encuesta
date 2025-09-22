import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer = ({ content, className }: MarkdownRendererProps) => {
  return (
    <div className={cn("markdown-content", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Custom styling for markdown elements - Mobile First & Aesthetic
          h1: ({ children }) => (
            <h1 className="text-lg sm:text-xl font-bold text-foreground mb-2 sm:mb-3 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base sm:text-lg font-semibold text-foreground mb-2 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm sm:text-base font-semibold text-foreground mb-1.5 sm:mb-2 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm font-medium text-foreground mb-1.5 leading-tight">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="text-sm sm:text-base leading-relaxed mb-2 sm:mb-3 last:mb-0 text-foreground">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-primary bg-primary/10 px-1 py-0.5 rounded">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-muted-foreground font-medium">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3 ml-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm sm:text-base leading-relaxed relative flex items-start">
              <span className="inline-flex items-center justify-center w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0"></span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/60 pl-3 sm:pl-4 py-2 bg-primary/5 rounded-r-lg mb-2 sm:mb-3 italic">
              <div className="text-sm sm:text-base text-primary/80">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-muted/80 px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono border border-border/50 text-foreground">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-muted/80 p-3 sm:p-4 rounded-lg overflow-x-auto mb-2 sm:mb-3 border border-border/50">
                <code className="text-xs sm:text-sm font-mono text-foreground whitespace-pre">
                  {children}
                </code>
              </pre>
            );
          },
          hr: () => (
            <hr className="border-border/60 my-3 sm:my-4 border-dashed" />
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline decoration-primary/60 hover:decoration-primary transition-all duration-200 font-medium"
            >
              {children}
            </a>
          ),
          // Añadir soporte para tablas
          table: ({ children }) => (
            <div className="overflow-x-auto mb-2 sm:mb-3">
              <table className="min-w-full border border-border rounded-lg">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody>{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="border-b border-border/50">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-sm font-semibold text-foreground">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-sm text-foreground">{children}</td>
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
