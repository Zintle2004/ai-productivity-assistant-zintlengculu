import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";
import { buildSystemPrompt, type Feature } from "./prompts.server";

const RunInput = z.object({
  feature: z.enum(["email", "meeting", "tasks", "research", "chat"]),
  input: z.string().min(1),
  options: z.record(z.string()).optional(),
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .optional(),
});

export const runAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => RunInput.parse(data))
  .handler(async ({ data }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("AI is not configured for this workspace.");

    const gateway = createLovableAiGatewayProvider(key);

    try {
      const result = streamText({
        model: gateway(AI_MODEL),
        system: buildSystemPrompt(data.feature as Feature, data.options ?? {}),
        messages: [
          ...(data.history ?? []).map((m) => ({ role: m.role, content: m.content })),
          { role: "user" as const, content: data.input },
        ],
      });
      return { text: await result.text };
    } catch (error) {
      const status = (error as { statusCode?: number; status?: number })?.statusCode ??
        (error as { status?: number })?.status;
      if (status === 429) {
        throw new Error("Too many requests right now — please retry in a moment.");
      }
      if (status === 402) {
        throw new Error("AI credits are exhausted. Add credits in Lovable to continue.");
      }
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });
