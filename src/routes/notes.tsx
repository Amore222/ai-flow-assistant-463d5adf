import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, NotebookPen, Wand2 } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiResult } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { summarizeNotes } from "@/lib/ai.functions";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into key points, decisions, action items with owners, and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Structured summaries with actions, owners and deadlines.",
      },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const fn = useServerFn(summarizeNotes);
  const [context, setContext] = useState("");
  const [notes, setNotes] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { notes: string; context: string }) => fn({ data }),
  });

  return (
    <>
      <PageHeader
        icon={NotebookPen}
        title="Meeting Notes Summarizer"
        description="Paste messy notes or a transcript and get key points, decisions, action items and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="surface-card space-y-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!notes.trim()) return;
            mutation.mutate({ notes, context });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="context">Meeting context (optional)</Label>
            <Input
              id="context"
              placeholder="Weekly product sync — design, eng, PM"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes or transcript</Label>
            <Textarea
              id="notes"
              rows={16}
              placeholder="Sarah: launch slipping to Sept 12… Ahmed to finish API docs by Friday… we decided to cut the export feature from v1…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending || !notes.trim()}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            Summarize notes
          </Button>
        </form>

        <AiResult
          text={mutation.data?.text ?? null}
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          emptyHint="You'll get an executive summary, key points, decisions, an action table and deadlines."
          loadingLabel="Extracting key points and actions…"
        />
      </div>
    </>
  );
}
