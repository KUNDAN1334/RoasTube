import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { accountHash, getRedis } from "./redis";

const ROASTS_PER_DAY = 3;

let limiter: Ratelimit | null | undefined;

/** Only exists when Upstash is configured; otherwise roasts aren't limited. */
function getLimiter() {
  if (limiter !== undefined) return limiter;
  const redis = getRedis();
  limiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.fixedWindow(ROASTS_PER_DAY, "1 d"),
        prefix: "roastube:roasts",
      })
    : null;
  return limiter;
}

/** Counts one roast for this account. Keyed by a one-way hash, never the raw Google ID. */
export async function takeRoastAllowance(googleId: string): Promise<boolean> {
  const rl = getLimiter();
  if (!rl) return true;
  try {
    const { success } = await rl.limit(accountHash(googleId));
    return success;
  } catch (err) {
    // If Redis is down, don't block roasts over it.
    console.warn("[roast] rate limiter unavailable:", err instanceof Error ? err.message : err);
    return true;
  }
}
