import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Mail, Send } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { AiResult } from "@/components/AiResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AUDIENCES, TONES } from "@/lib/prompts";
import { generateEmail } from "@/lib/ai.functions";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate professional work emails tailored to any tone and audience in seconds with AI.",
      },
      { property: "og:title", content: "Smart Email Generator | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Tone- and audience-aware email drafting for busy professionals.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const fn = useServerFn(generateEmail);
  const [tone, setTone] = useState<string>(TONES[0]);
  const [audience, setAudience] = useState<string>(AUDIENCES[0]);
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");

  const mutation = useMutation({
    mutationFn: (data: { tone: string; audience: string; purpose: string; details: string }) =>
      fn({ data }),
  });

  return (
    <>
      <PageHeader
        icon={Mail}
        title="Smart Email Generator"
        description="Describe the situation and let AI write a polished email calibrated to your tone and audience."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="surface-card space-y-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!purpose.trim()) return;
            mutation.mutate({ tone, audience, purpose, details });
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Audience</Label>
              <Select value={audience} onValueChange={setAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AUDIENCES.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of the email</Label>
            <Input
              id="purpose"
              placeholder="Follow up on the Q3 proposal and request a decision"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Key details (optional)</Label>
            <Textarea
              id="details"
              rows={7}
              placeholder="Proposal sent Aug 3, budget €40k, decision needed before Friday, they asked about onboarding timeline…"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending || !purpose.trim()}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
            Generate email
          </Button>
        </form>

        <AiResult
          text={mutation.data?.text ?? null}
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          emptyHint="Your generated email will appear here, with a subject line and a short rationale."
          loadingLabel="Writing your email…"
        />
      </div>
    </>
  );
}
