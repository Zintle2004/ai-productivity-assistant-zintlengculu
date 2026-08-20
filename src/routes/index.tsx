import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, ListChecks, Sparkles } from "lucide-react";
import { useState } from "react";
import { AiOutput, Disclaimer } from "@/components/AiOutput";
import { AppShell } from "@/components/AppShell";
import { GenerateButton } from "@/components/ToolLayout";
import { navItems } from "@/components/nav-items";
import { useAssistant } from "@/hooks/useAssistant";

const title = "AetherFlow — AI Workplace Productivity Assistant";
const description =
  "Automate daily work with AI: draft emails, summarise meetings, plan tasks, run research and chat with your assistant.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Dashboard,
});

const priorities = [
  { task: "Finalise Q3 report", level: "High", hint: "Complete before the 2PM call." },
  { task: "Follow up with Sarah", level: "Med", hint: "Automated draft waiting." },
  { task: "Review design system", level: "Low", hint: "Batch with Friday admin block." },
];

const levelStyles: Record<string, string> = {
  High: "bg-destructive/10 text-destructive",
  Med: "bg-accent text-accent-foreground",
  Low: "bg-muted text-muted-foreground",
};

function Dashboard() {
  const { content, error, loading, generate } = useAssistant("email");
  const [brief, setBrief] = useState(
    "Politely decline the project extension request from the design team, citing Q4 budget constraints.",
  );

  return (
    <AppShell title="Productivity Dashboard">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (brief.trim()) void generate(brief, { tone: "Professional", audience: "Team" });
          }}
          className="rounded-2xl border border-border bg-surface p-6 shadow-sm xl:col-span-2"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                <Mail className="size-5" />
              </span>
              <div>
                <h2 className="font-display font-bold">Smart Email Generator</h2>
                <p className="text-xs text-muted-foreground">Draft context-aware replies in seconds</p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="rounded-full bg-muted px-3 py-1 text-[10px] font-semibold text-muted-foreground">
                PROFESSIONAL
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-[10px] font-semibold text-accent-foreground">
                TEAM
              </span>
            </div>
          </div>

          <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Prompt
          </label>
          <textarea
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring/25"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="w-full sm:w-48">
              <GenerateButton loading={loading} label="Generate Draft" disabled={!brief.trim()} />
            </div>
            <Link
              to="/email"
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
            >
              Full editor <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </form>

        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <ListChecks className="size-4 text-muted-foreground" />
            <h2 className="font-display font-bold">Priority Focus</h2>
          </div>
          <div className="space-y-3">
            {priorities.map((p) => (
              <div key={p.task} className="rounded-xl border border-border bg-background p-3">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <span className="text-xs font-semibold">{p.task}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase ${levelStyles[p.level]}`}
                  >
                    {p.level}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">AI suggests: {p.hint}</p>
              </div>
            ))}
          </div>
          <Link
            to="/tasks"
            className="mt-6 block w-full rounded-xl border-2 border-dashed border-border py-2 text-center text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-primary"
          >
            + Optimise my schedule
          </Link>
        </div>

        <div className="xl:col-span-2">
          <AiOutput
            label="Generated draft"
            content={content}
            loading={loading}
            error={error}
            emptyHint="Run the email generator above, or open any assistant from the sidebar."
          />
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-sidebar p-6 text-sidebar-foreground shadow-lg">
          <Sparkles className="absolute right-5 top-5 size-16 opacity-10" />
          <h2 className="font-display text-lg font-bold">Your AI toolkit</h2>
          <p className="mb-5 text-sm text-sidebar-foreground/60">
            Five assistants, one structured workflow.
          </p>
          <div className="space-y-2">
            {navItems.slice(1).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-foreground/5 p-3 transition-colors hover:bg-sidebar-foreground/10"
              >
                <item.icon className="size-4 shrink-0 text-sidebar-primary" />
                <span className="min-w-0">
                  <span className="block text-xs font-semibold">{item.label}</span>
                  <span className="block truncate text-[11px] text-sidebar-foreground/55">
                    {item.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>
          <Disclaimer className="mt-5 text-sidebar-foreground/45" />
        </div>
      </div>
    </AppShell>
  );
}
