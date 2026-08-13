import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Bot, Loader2, SendHorizontal, User } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DISCLAIMER } from "@/lib/prompts";
import { chatWithAssistant } from "@/lib/ai.functions";

type Turn = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Help me say no to a meeting politely",
  "Draft an agenda for a 30-min project kickoff",
  "How do I structure a weekly status update?",
  "Turn these notes into a client-ready update",
];

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Chat with an AI assistant about any work task: drafting, planning, prioritising and problem-solving.",
      },
      { property: "og:title", content: "AI Chat Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Your always-on assistant for everyday work questions.",
      },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const fn = useServerFn(chatWithAssistant);
  const [messages, setMessages] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = async (raw: string) => {
    const content = raw.trim();
    if (!content || isLoading) return;
    const next: Turn[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setError(null);
    setIsLoading(true);
    try {
      const res = await fn({ data: { messages: next } });
      setMessages([...next, { role: "assistant", content: res.text }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        icon={Bot}
        title="AI Chat Assistant"
        description="Ask anything about your work day — drafting, planning, tricky conversations or quick decisions."
      />

      <div className="surface-card flex h-[calc(100vh-15rem)] min-h-[30rem] flex-col overflow-hidden">
        <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-lg py-10 text-center">
              <span className="mx-auto grid size-12 place-items-center rounded-2xl gradient-brand">
                <Bot className="size-5 text-brand-foreground" />
              </span>
              <h2 className="font-display mt-4 text-lg font-semibold">
                How can I help you work faster?
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Try one of these to get started.
              </p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-lg border border-border bg-secondary/40 px-3 py-2.5 text-left text-sm text-secondary-foreground transition-colors hover:bg-accent"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className="flex gap-3">
                <span
                  className={
                    m.role === "user"
                      ? "grid size-8 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground"
                      : "grid size-8 shrink-0 place-items-center rounded-lg gradient-brand text-brand-foreground"
                  }
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-xs font-semibold text-muted-foreground">
                    {m.role === "user" ? "You" : "Assistant"}
                  </p>
                  {m.role === "user" ? (
                    <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <div className="ai-prose">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}

          {isLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin text-brand" />
              Thinking…
            </p>
          ) : null}
          {error ? (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <div ref={endRef} />
        </div>

        <form
          className="border-t border-border bg-card p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void send(input);
          }}
        >
          <div className="flex items-end gap-2">
            <Textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask the assistant… (Enter to send, Shift+Enter for a new line)"
              className="min-h-11 resize-none"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizontal className="size-4" />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{DISCLAIMER}.</p>
        </form>
      </div>
    </>
  );
}
