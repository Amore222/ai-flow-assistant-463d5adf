import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Clock,
  ListChecks,
  Mail,
  NotebookPen,
  Search,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { DISCLAIMER } from "@/lib/prompts";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Automate daily work tasks with AI: write emails, summarize meetings, plan tasks, research topics and chat with an assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Five AI tools that take the busywork out of your workday.",
      },
    ],
  }),
  component: Dashboard,
});

const TOOLS = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Tone- and audience-aware drafts with subject lines and a clear call to action.",
    tag: "Writing",
  },
  {
    to: "/notes",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description: "Key points, decisions, action items with owners, and every deadline captured.",
    tag: "Meetings",
  },
  {
    to: "/tasks",
    icon: ListChecks,
    title: "AI Task Planner",
    description: "Prioritise with proven frameworks and get a realistic schedule for your day.",
    tag: "Planning",
  },
  {
    to: "/research",
    icon: Search,
    title: "AI Research Assistant",
    description: "Structured briefings: insights, trade-offs, next steps and what to verify.",
    tag: "Research",
  },
  {
    to: "/chat",
    icon: Bot,
    title: "AI Chatbot",
    description: "An always-on assistant for quick questions and tricky work conversations.",
    tag: "Assistant",
  },
] as const;

const STATS = [
  { icon: Zap, label: "AI tools ready", value: "5" },
  { icon: Clock, label: "Avg. draft time", value: "~15s" },
  { icon: ShieldCheck, label: "Prompt-engineered outputs", value: "Structured" },
] as const;

function Dashboard() {
  return (
    <>
      <section className="surface-card relative overflow-hidden p-6 sm:p-9">
        <div className="absolute -top-24 -right-16 size-64 rounded-full gradient-brand opacity-10" />
        <div className="relative max-w-2xl">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
            <Sparkles className="size-3.5" />
            Powered by Lovable AI
          </span>
          <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Automate the busywork in your workday
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Draft emails, summarize meetings, prioritise your task list and research decisions —
            each tool uses structured prompting to return professional, ready-to-use output.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/email"
              className="inline-flex items-center gap-2 rounded-lg gradient-brand px-4 py-2.5 text-sm font-medium text-brand-foreground transition-opacity hover:opacity-90"
            >
              Start with an email
              <ArrowRight className="size-4" />
            </Link>
            <Link
              to="/chat"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
            >
              Open AI chat
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        {STATS.map(({ icon: Icon, label, value }) => (
          <div key={label} className="surface-card flex items-center gap-4 p-5">
            <span className="grid size-10 place-items-center rounded-lg bg-secondary text-brand">
              <Icon className="size-4" />
            </span>
            <div>
              <p className="font-display text-lg font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </section>

      <h2 className="font-display mt-9 mb-4 text-lg font-semibold tracking-tight">Your AI tools</h2>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {TOOLS.map(({ to, icon: Icon, title, description, tag }) => (
          <Link
            key={to}
            to={to}
            className="surface-card group flex flex-col p-5 transition-all hover:-translate-y-0.5 hover:border-brand/40"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-lg bg-brand-soft text-brand">
                <Icon className="size-4" />
              </span>
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.7rem] font-medium text-muted-foreground">
                {tag}
              </span>
            </div>
            <h3 className="font-display mt-4 text-sm font-semibold">{title}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand">
              Open
              <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </section>

      <p className="mt-8 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-xs text-muted-foreground">
        {DISCLAIMER}. Always check names, figures and commitments before sending anything externally.
      </p>
    </>
  );
}
