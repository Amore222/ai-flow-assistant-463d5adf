import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Bot,
  LayoutDashboard,
  Mail,
  Menu,
  NotebookPen,
  Search,
  Sparkles,
  X,
  ListChecks,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DISCLAIMER } from "@/lib/prompts";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Generator", icon: Mail },
  { to: "/notes", label: "Meeting Notes", icon: NotebookPen },
  { to: "/tasks", label: "Task Planner", icon: ListChecks },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "AI Chat", icon: Bot },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={onNavigate}
          activeOptions={{ exact: to === "/" }}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "bg-sidebar-accent text-sidebar-accent-foreground shadow-[inset_2px_0_0_0_var(--sidebar-primary)]",
          }}
        >
          <Icon className="size-4 shrink-0" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col bg-sidebar px-4 py-5">
      <div className="flex items-center gap-2.5 px-2">
        <span className="grid size-9 place-items-center rounded-xl gradient-brand">
          <Sparkles className="size-4 text-brand-foreground" />
        </span>
        <span className="font-display text-sm leading-tight font-semibold text-sidebar-foreground">
          AI Workplace
          <span className="block text-xs font-normal text-sidebar-foreground/60">
            Productivity Assistant
          </span>
        </span>
        <ThemeToggle className="ml-auto border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
      </div>


      <div className="mt-7 flex-1">
        <p className="mb-2 px-3 text-[0.7rem] font-semibold tracking-wider text-sidebar-foreground/40 uppercase">
          Workspace
        </p>
        <NavLinks onNavigate={onNavigate} />
      </div>

      <p className="rounded-lg bg-sidebar-accent/60 px-3 py-2.5 text-[0.7rem] leading-relaxed text-sidebar-foreground/60">
        {DISCLAIMER}.
      </p>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[16rem_1fr]">
      <aside className="sticky top-0 hidden h-screen lg:block">
        <SidebarInner />
      </aside>

      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open navigation"
          className="grid size-9 place-items-center rounded-lg border border-border text-foreground"
        >
          <Menu className="size-4" />
        </button>
        <span className="font-display text-sm font-semibold">AI Workplace Assistant</span>
        <ThemeToggle className="ml-auto" />
      </header>

      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={cn(
            "absolute inset-0 bg-foreground/40 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 w-72 transition-transform duration-200",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <button
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
            className="absolute top-4 right-3 z-10 grid size-8 place-items-center rounded-lg text-sidebar-foreground/70"
          >
            <X className="size-4" />
          </button>
          <SidebarInner onNavigate={() => setOpen(false)} />
        </div>
      </div>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-9">{children}</main>
    </div>
  );
}
