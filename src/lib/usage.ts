// Anonymous usage counts kept in Upstash: roasts per day, and how many different accounts
// made them. Accounts are counted with HyperLogLog, which estimates how many distinct values
// were added without keeping the values, so there's no list of who used Roastube.

import type { Intensity } from "./types";

const PREFIX = "roastube:usage";

/** Daily counts are deleted after about 13 months. All-time counts are kept. */
export const USAGE_DAY_TTL_SECONDS = 400 * 24 * 60 * 60;

/** UTC calendar day, e.g. "2026-10-17". */
export const usageDay = (date: Date) => date.toISOString().slice(0, 10);

/** Redis keys for one day, or for all time. */
export const usageKeys = (day: string | "all") => ({
  counts: `${PREFIX}:counts:${day}`,
  accounts: `${PREFIX}:accounts:${day}`,
});

/** Hash fields bumped for one finished roast. */
export const usageFields = (intensity: Intensity, usedTakeout: boolean) => [
  "roasts",
  intensity,
  ...(usedTakeout ? ["nuclear"] : []),
];
