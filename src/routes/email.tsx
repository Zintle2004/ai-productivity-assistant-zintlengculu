import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/AiOutput";
import { AppShell } from "@/components/AppShell";
import { ChoiceGroup, Field, GenerateButton, ToolGrid, ToolIntro } from "@/components/ToolLayout";
import { useAssistant } from "@/hooks/useAssistant";

const title = "Smart Email Generator — AetherFlow AI Assistant";
const description =
  "Generate professional emails tailored to tone, audience and length with AI, ready to review and send.";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const { content, error, loading, generate } = useAssistant("email");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("Client");
  const [length, setLength] = useState("Medium");
  const [brief, setBrief] = useState("");

  return (
    <AppShell title="Smart Email Generator">
      <ToolGrid
        input={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (brief.trim()) void generate(brief, { tone, audience, length });
            }}
            className="space-y-5"
          >
            <ToolIntro
              icon={Mail}
              title="Smart Email Generator"
              subtitle="Draft context-aware emails in seconds"
            />
            <Field label="Tone">
              <ChoiceGroup
                options={["Professional", "Friendly", "Direct", "Persuasive", "Apologetic"]}
                value={tone}
                onChange={setTone}
              />
            </Field>
            <Field label="Audience">
              <ChoiceGroup
                options={["Client", "Manager", "Team", "Vendor", "Candidate"]}
                value={audience}
                onChange={setAudience}
              />
            </Field>
            <Field label="Length">
              <ChoiceGroup options={["Short", "Medium", "Detailed"]} value={length} onChange={setLength} />
            </Field>
            <Field label="What should the email say?">
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                rows={6}
                placeholder="Politely decline the project extension request from the design team, citing Q4 budget constraints."
                className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-ring/25"
              />
            </Field>
            <GenerateButton loading={loading} label="Generate Draft" disabled={!brief.trim()} />
          </form>
        }
        output={
          <AiOutput
            label="Generated draft"
            content={content}
            loading={loading}
            error={error}
            emptyHint="Describe the message and pick a tone — your polished email draft appears here."
          />
        }
      />
    </AppShell>
  );
}
