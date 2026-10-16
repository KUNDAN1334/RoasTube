import "server-only";
import { ApiError, GoogleGenAI, ThinkingLevel } from "@google/genai";
import { SYSTEM_PROMPT, userMessage } from "@/lib/roast/prompt";
import { generateWithFallback, RoastGenerationError } from "@/lib/roast/model-fallback";
import { ROAST_JSON_SCHEMA, RoastSchema } from "@/lib/roast/schema";
import type { Roast } from "@/lib/types";

// Verified against ai.google.dev/gemini-api/docs/models on 2026-10-16: both are stable.
export const PRIMARY_MODEL = "gemini-3.8-flash";
export const FALLBACK_MODEL = "gemini-3.5-flash-lite";

let client: GoogleGenAI | null = null;
function gemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new RoastGenerationError("unknown", "GEMINI_API_KEY is not set");
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

async function generateWith(model: string, digest: string, signal?: AbortSignal): Promise<Roast> {
  const res = await gemini().models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: userMessage(digest) }] }],
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: ROAST_JSON_SCHEMA,
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      abortSignal: signal,
    },
  });
  const text = res.text;
  if (!text) throw new Error(`${model} returned no text`);
  return RoastSchema.parse(JSON.parse(text)) as Roast;
}

/**
 * Asks the primary model and falls back once to Flash-Lite. Two failures with a 429 in either
 * become "rate_limited", which the UI turns into the "roast oven is full" state.
 */
export function generateRoast(digest: string, signal?: AbortSignal): Promise<Roast> {
  return generateWithFallback({
    primary: PRIMARY_MODEL,
    fallback: FALLBACK_MODEL,
    call: (model) => generateWith(model, digest, signal),
    statusOf: (err) => (err instanceof ApiError ? err.status : undefined),
    aborted: () => Boolean(signal?.aborted),
    onFallback: (err) =>
      console.warn(`[roast] ${PRIMARY_MODEL} failed, trying ${FALLBACK_MODEL}:`, err instanceof Error ? err.message : err),
  });
}
