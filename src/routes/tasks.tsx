import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, ListChecks, Loader2 } from "lucide-react";
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
import { PRIORITY_FRAMEWORKS } from "@/lib/prompts";
import { planTasks } from "@/lib/ai.functions";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Prioritise your task list and get a realistic schedule for the day using proven frameworks.",
      },
      { property: "og:title", content: "AI Task Planner | AI Workplace Assistant" },
      {
        property: "og:description",
        content: "Prioritisation and scheduling for your working day.",
      },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const fn = useServerFn(planTasks);
  const [framework, setFramework] = useState<string>(PRIORITY_FRAMEWORKS[0]);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [lunch, setLunch] = useState("1 hour");
  const [tasks, setTasks] = useState("");

  const LUNCH_OPTIONS = ["None", "30 minutes", "1 hour", "1.5 hours", "2 hours"] as const;

  const hours = `${start}–${end}, ${
    lunch === "None" ? "no lunch break" : `${lunch} lunch`
  }`;

  const mutation = useMutation({
    mutationFn: (data: { tasks: string; framework: string; hours: string }) => fn({ data }),
  });

  return (
    <>
      <PageHeader
        icon={ListChecks}
        title="AI Task Planner"
        description="Dump your task list, pick a framework, and get it prioritised and scheduled around your day."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <form
          className="surface-card space-y-5 p-5 sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (!tasks.trim()) return;
            mutation.mutate({ tasks, framework, hours });
          }}
        >
          <div className="space-y-2">
            <Label>Prioritisation framework</Label>
            <Select value={framework} onValueChange={setFramework}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_FRAMEWORKS.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hours">Available working hours</Label>
            <Input id="hours" value={hours} onChange={(e) => setHours(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tasks">Tasks (one per line)</Label>
            <Textarea
              id="tasks"
              rows={12}
              placeholder={"Finish Q3 report — due tomorrow\nReview 4 PRs\nPrep client demo for Thursday\nExpense claims\nInterview debrief"}
              value={tasks}
              onChange={(e) => setTasks(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={mutation.isPending || !tasks.trim()}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <CalendarClock className="size-4" />
            )}
            Plan my day
          </Button>
        </form>

        <AiResult
          text={mutation.data?.text ?? null}
          isLoading={mutation.isPending}
          error={mutation.error ? mutation.error.message : null}
          emptyHint="You'll get a prioritised table, a suggested schedule, and items to defer or delegate."
          loadingLabel="Prioritising and scheduling…"
        />
      </div>
    </>
  );
}
