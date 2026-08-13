import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { AlertTriangle, Check, Copy, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DISCLAIMER } from "@/lib/prompts";

export function AiResult({
  text,
  isLoading,
  error,
  emptyHint,
  loadingLabel = "Drafting with AI…",
}: {
  text: string | null;
  isLoading: boolean;
  error: string | null;
  emptyHint: string;
  loadingLabel?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="surface-card flex min-h-[22rem] flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3 border-b border-border pb-3">
        <h2 className="font-display flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="size-4 text-brand" />
          AI Output
        </h2>
        {text ? (
          <Button variant="outline" size="sm" onClick={copy}>
            {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        ) : null}
      </div>

      <div className="flex-1 pt-4">
        {isLoading ? (
          <div className="space-y-3">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-brand" />
              {loadingLabel}
            </p>
            {[92, 78, 85, 60, 88, 70].map((w, i) => (
              <div
                key={i}
                className="h-3 animate-pulse rounded-full bg-muted"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        ) : error ? (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <AlertTriangle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : text ? (
          <div className="ai-prose">
            <ReactMarkdown>{text}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">{emptyHint}</p>
        )}
      </div>

      <p className="mt-5 border-t border-border pt-3 text-xs text-muted-foreground">
        {DISCLAIMER}.
      </p>
    </section>
  );
}
