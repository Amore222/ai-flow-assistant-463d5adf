import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Search, Telescope } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiResult } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { researchTopic } from "@/lib/ai.functions";

const DEPTHS = ["Quick brief", "Standard analysis", "Deep dive"] as const;

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Get structured insights, trade-offs and next steps on any work topic, with items flagged for verification.",
      },
      { property: "og:title", content: "AI Research Assistant | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Structured briefings and insights for professionals.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const fn = useServerFn(researchTopic);
  const [depth, setDepth] = useState<string>(DEPTHS[1]);
  const [topic, setTopic] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { topic: string; depth: string }) => fn({ data }),
  });

  return (
    <>
      <PageHeader
        icon={Search}
        title="AI Research Assistant"
        description="Ask a work question and get a structured briefing: insights, trade-offs, next steps and what to verify."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="surface-card space-y-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!topic.trim()) return;
            mutation.mutate({ topic, depth });
          }}
        >
          <div className="space-y-2">
            <Label>Depth</Label>
            <Select value={depth} onValueChange={setDepth}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEPTHS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topic">Topic or question</Label>
            <Textarea
              id="topic"
              rows={10}
              placeholder="What should a mid-size B2B SaaS consider before moving from seat-based to usage-based pricing?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending || !topic.trim()}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Telescope className="size-4" />
            )}
            Run research
          </Button>
        </form>

        <AiResult
          text={mutation.data?.text ?? null}
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          emptyHint="You'll get a snapshot, key insights, trade-offs, next steps and claims to verify."
          loadingLabel="Synthesising insights…"
        />
      </div>
    </>
  );
}
