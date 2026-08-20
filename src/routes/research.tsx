import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/AiOutput";
import { AppShell } from "@/components/AppShell";
import { ChoiceGroup, Field, GenerateButton, ToolGrid, ToolIntro } from "@/components/ToolLayout";
import { useAssistant } from "@/hooks/useAssistant";

const title = "AI Research Assistant — AetherFlow AI Assistant";
const description =
  "Get structured briefings with executive summaries, key insights, risks and next steps on any work topic.";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: ResearchPage,
});

const examples = [
  "Market trends for foldable devices in 2026",
  "Best practices for hybrid team onboarding",
  "Risks of migrating our billing to usage-based pricing",
];

function ResearchPage() {
  const { content, error, loading, generate } = useAssistant("research");
  const [topic, setTopic] = useState("");
  const [depth, setDepth] = useState("Standard");

  return (
    <AppShell title="AI Research Assistant">
      <ToolGrid
        input={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (topic.trim()) void generate(topic, { depth });
            }}
            className="space-y-5"
          >
            <ToolIntro
              icon={Search}
              title="Deep Research Assistant"
              subtitle="Insights synthesised into a briefing"
            />
            <Field label="Depth">
              <ChoiceGroup options={["Quick", "Standard", "Deep dive"]} value={depth} onChange={setDepth} />
            </Field>
            <Field label="Research question">
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                rows={6}
                placeholder="What should our team know before entering the EU SMB market?"
                className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-ring/25"
              />
            </Field>
            <div className="space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Try one
              </p>
              <ul className="space-y-1.5">
                {examples.map((example) => (
                  <li key={example}>
                    <button
                      type="button"
                      onClick={() => setTopic(example)}
                      className="text-left text-xs text-muted-foreground transition-colors hover:text-foreground"
                    >
                      · {example}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <GenerateButton loading={loading} label="Run Research" disabled={!topic.trim()} />
          </form>
        }
        output={
          <AiOutput
            label="Research briefing"
            content={content}
            loading={loading}
            error={error}
            emptyHint="Ask a research question and get a structured briefing with insights and next steps."
          />
        }
      />
    </AppShell>
  );
}
