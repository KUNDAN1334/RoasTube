import { z } from "zod";

const RedFlagSchema = z.object({
  title: z.string().min(1).max(80),
  evidence: z.string().min(1).max(220),
  severity: z.union([z.literal(1), z.literal(2), z.literal(3)]),
});

/** Validates what the model returns. Mirrors the `Roast` type in lib/types. */
export const RoastSchema = z.object({
  verdict: z.string().min(1).max(220),
  roast: z.string().min(1).max(700),
  brainrotScore: z.number().min(0).max(100),
  brainrotReason: z.string().min(1).max(220),
  nickname: z.string().min(1).max(60),
  personality: z.string().min(1).max(320),
  redFlags: z.array(RedFlagSchema).length(3),
  advice: z.string().min(1).max(260),
  shareLine: z.string().min(1).max(200),
});

/**
 * The same shape as JSON Schema, for Gemini's structured output. Kept to the keywords the
 * API supports: type, description, properties, required, enum, minimum, maximum,
 * minItems, maxItems.
 */
export const ROAST_JSON_SCHEMA = {
  type: "object",
  properties: {
    verdict: { type: "string", description: "The main roast. One or two sentences, at most 25 words." },
    roast: { type: "string", description: "Two or three more sentences, each tied to a specific detail from the digest." },
    brainrotScore: { type: "integer", minimum: 0, maximum: 100, description: "BASE_BRAINROT_SCORE moved by at most 10." },
    brainrotReason: { type: "string", description: "One line naming the stats behind the score, and why it was nudged if it was." },
    nickname: { type: "string", description: "A TV-show style title for this person, 2 to 6 words." },
    personality: { type: "string", description: "One or two sentences reading their personality off their feed, like a TV guide blurb." },
    redFlags: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "2 to 7 words." },
          evidence: { type: "string", description: "One sentence citing the specific titles, channels or stats behind it." },
          severity: { type: "integer", enum: [1, 2, 3] },
        },
        required: ["title", "evidence", "severity"],
      },
    },
    advice: { type: "string", description: "One sarcastic piece of advice, one or two sentences." },
    shareLine: { type: "string", description: "First person, short, quotable and safe to post publicly." },
  },
  required: [
    "verdict",
    "roast",
    "brainrotScore",
    "brainrotReason",
    "nickname",
    "personality",
    "redFlags",
    "advice",
    "shareLine",
  ],
} as const;
