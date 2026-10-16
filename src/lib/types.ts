export const INTENSITIES = ["toasty", "extra_crispy"] as const;
export type Intensity = (typeof INTENSITIES)[number];

export const INTENSITY_LABEL: Record<Intensity, string> = {
  toasty: "Toasty",
  extra_crispy: "Extra crispy",
};

export type RedFlag = {
  title: string;
  evidence: string;
  severity: 1 | 2 | 3;
};

/** What the model returns. Mirrors the Gemini response schema. */
export type Roast = {
  /** The main roast: one or two punchy sentences. */
  verdict: string;
  /** Two or three sentences that twist the knife. */
  roast: string;
  brainrotScore: number;
  brainrotReason: string;
  /** A TV-show style nickname, e.g. "The 2am Documentary Tourist". */
  nickname: string;
  /** One or two sentences reading their personality off their feed. */
  personality: string;
  redFlags: RedFlag[];
  /** One sarcastic piece of advice. */
  advice: string;
  /** Short, quotable, safe to post publicly. */
  shareLine: string;
};

/** Shown on the roast and share image only. Never sent to the AI. */
export type Profile = {
  name: string | null;
  /** Data URL of the YouTube channel picture, so it can be drawn into the share image. */
  avatar: string | null;
};

/** What /api/roast hands the client: the roast plus stats computed in code. */
export type RoastResult = {
  roast: Roast;
  /** Short, plain-language stats computed in code. */
  exhibits: string[];
  intensity: Intensity;
  usedTakeout: boolean;
  profile: Profile;
  createdAt: string;
};

export const ROAST_STEPS = ["likes", "subscriptions", "digest", "gemini"] as const;
export type RoastStep = (typeof ROAST_STEPS)[number];

export type RoastErrorCode =
  | "empty"
  | "scope"
  | "no_channel"
  | "rate_limited"
  | "daily_limit"
  | "auth"
  | "unknown";

export type RoastEvent =
  | { type: "step"; step: RoastStep }
  | { type: "done"; result: RoastResult }
  | { type: "error"; code: RoastErrorCode };
