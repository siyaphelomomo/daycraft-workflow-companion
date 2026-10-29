import { createFileRoute } from "@tanstack/react-router";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { createLovableAiGatewayRunIdFetch } from "@/server/run-id";

const PROMPTS: Record<string, string> = {
  email: `You are SmartWork AI, an expert business writer. Write a ready-to-edit professional email in Markdown with this exact structure:
**Subject:** <subject line>

<Greeting>,

<Body paragraphs>

<Closing>,
<Sender name or [Your Name]>

Match the requested tone precisely. Output only the email.`,
  summary: `You are SmartWork AI, an expert meeting analyst. Summarize the meeting notes in Markdown with these sections:
## Summary (2-4 sentences)
## Key Points (bullets)
## Decisions (bullets)
## Action Items — a Markdown table with columns: Task | Owner | Deadline (use "Not specified" when missing)
Be concise and accurate; never invent facts not in the notes.`,
  planner: `You are SmartWork AI, an expert time-management coach. Build a schedule in Markdown:
## Priorities — table: Task | Urgency | Importance | Priority (Eisenhower: Do now / Schedule / Delegate / Later)
## Schedule — for a daily plan a table: Time | Task | Duration | Notes; for a weekly plan one subsection per day with the same table. Include short breaks and a lunch break.
## Deadlines & Reminders (bullets)
## Unfinished / Carry-over Tasks (bullets, tasks that don't fit, with a suggested slot)
Allocate realistic durations and respect stated working hours and deadlines.`,
};

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { tool, input } = (await request.json()) as { tool: string; input: string };
        const system = PROMPTS[tool];
        if (!system || !input?.trim() || input.length > 20000) {
          return new Response("Invalid request", { status: 400 });
        }
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("AI is not configured", { status: 500 });
        const runIdFetch = createLovableAiGatewayRunIdFetch();
        const provider = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey,
          headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });
        const result = streamText({
          model: provider.responses("openai/gpt-6-astra"),
          system,
          prompt: input,
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              store: false,
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              include: ["reasoning.encrypted_content"],
            },
          },
          onError: ({ error }) => console.error("AI error", error),
        });
        return result.toTextStreamResponse();
      },
    },
  },
});
