import "server-only";
import { USAGE_DAY_TTL_SECONDS, usageDay, usageFields, usageKeys } from "@/lib/usage";
import type { RoastResult } from "@/lib/types";
import { accountHash, getRedis } from "./redis";

/** Counts one finished roast. Never throws: a counting problem must not cost anyone their roast. */
export async function recordRoast(googleId: string, result: RoastResult): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  const day = usageKeys(usageDay(new Date()));
  const all = usageKeys("all");
  const account = accountHash(googleId);
  const tx = redis.pipeline();
  for (const field of usageFields(result.intensity, result.usedTakeout)) {
    tx.hincrby(day.counts, field, 1);
    tx.hincrby(all.counts, field, 1);
  }
  tx.pfadd(day.accounts, account);
  tx.pfadd(all.accounts, account);
  tx.expire(day.counts, USAGE_DAY_TTL_SECONDS);
  tx.expire(day.accounts, USAGE_DAY_TTL_SECONDS);
  try {
    await tx.exec();
  } catch (err) {
    console.warn("[roast] usage counter unavailable:", err instanceof Error ? err.message : err);
  }
}
