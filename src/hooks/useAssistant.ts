import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { runAssistant } from "@/lib/ai.functions";

type Feature = "email" | "meeting" | "tasks" | "research" | "chat";

export function useAssistant(feature: Feature) {
  const run = useServerFn(runAssistant);
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function generate(input: string, options?: Record<string, string>) {
    setLoading(true);
    setError(null);
    try {
      const result = await run({ data: { feature, input, options } });
      setContent(result.text);
      return result.text;
    } catch (e) {
      setContent(null);
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { content, error, loading, generate };
}
