import { Check, Copy, Sparkles, TriangleAlert } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Skeleton } from "@/components/ui/skeleton";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <p className={`text-[11px] italic text-muted-foreground ${className}`}>
      AI-generated content may require human review
    </p>
  );
}

export function AiOutput({
  label,
  content,
  loading,
  error,
  emptyHint,
}: {
  label: string;
  content: string | null;
  loading: boolean;
  error: string | null;
  emptyHint: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="flex min-h-[420px] flex-col rounded-2xl border border-border bg-surface shadow-sm">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {content ? (
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        ) : null}
      </header>

      <div className="flex-1 p-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="mt-6 h-4 w-1/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-xl border border-destructive/25 bg-destructive/5 p-4">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        ) : content ? (
          <div className="ai-prose animate-in fade-in duration-500">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        ) : (
          <div className="flex h-full min-h-[280px] flex-col items-center justify-center text-center">
            <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <Sparkles className="size-5" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground">{emptyHint}</p>
          </div>
        )}
      </div>

      <footer className="border-t border-border px-6 py-3">
        <Disclaimer />
      </footer>
    </section>
  );
}
