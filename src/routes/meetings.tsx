import { createFileRoute } from "@tanstack/react-router";
import { Mic } from "lucide-react";
import { useState } from "react";
import { AiOutput } from "@/components/AiOutput";
import { AppShell } from "@/components/AppShell";
import { Field, GenerateButton, ToolGrid, ToolIntro } from "@/components/ToolLayout";
import { useAssistant } from "@/hooks/useAssistant";

const title = "Meeting Notes Summarizer — AetherFlow AI Assistant";
const description =
  "Turn raw meeting notes or transcripts into key points, decisions, owners, action items and deadlines.";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  const { content, error, loading, generate } = useAssistant("meeting");
  const [notes, setNotes] = useState("");

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setNotes(await file.text());
  }

  return (
    <AppShell title="Meeting Notes Summarizer">
      <ToolGrid
        input={
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (notes.trim()) void generate(notes);
            }}
            className="space-y-5"
          >
            <ToolIntro
              icon={Mic}
              title="Meeting Intelligence"
              subtitle="Distil transcripts into decisions and actions"
            />
            <Field label="Notes or transcript">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={12}
                placeholder="Paste raw meeting notes, bullet points or a transcript…"
                className="w-full resize-none rounded-xl border border-border bg-background p-4 text-sm outline-none transition-all focus:ring-2 focus:ring-ring/25"
              />
            </Field>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/40 p-5 text-center transition-colors hover:border-primary/40">
              <span className="text-xs font-medium">Upload a .txt transcript</span>
              <span className="text-[10px] text-muted-foreground">
                Plain text files load straight into the editor
              </span>
              <input
                type="file"
                accept=".txt,.md,text/plain"
                className="hidden"
                onChange={(e) => void handleFile(e.target.files?.[0])}
              />
            </label>
            <GenerateButton loading={loading} label="Summarize Meeting" disabled={!notes.trim()} />
          </form>
        }
        output={
          <AiOutput
            label="Meeting summary"
            content={content}
            loading={loading}
            error={error}
            emptyHint="Paste your notes and get a summary, decisions and an owner-by-deadline action table."
          />
        }
      />
    </AppShell>
  );
}
