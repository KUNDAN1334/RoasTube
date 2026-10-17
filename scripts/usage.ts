// Prints Roastube's anonymous usage counts: `npm run usage` (last 14 days) or `npm run usage -- 30`.
// Needs UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN, from the environment, .env.local or .env.

import { Redis } from "@upstash/redis";
import { usageDay, usageKeys } from "@/lib/usage";

// Same order as Next.js: values already set win, then .env.local, then .env.
for (const file of [".env.local", ".env"]) {
  try {
    process.loadEnvFile(file);
  } catch {
    // File doesn't exist.
  }
}

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local or .env first.");
  process.exit(1);
}

const days = Math.min(Math.max(Number(process.argv[2]) || 14, 1), 400);
const labels = ["all time", ...Array.from({ length: days }, (_, i) => usageDay(new Date(Date.now() - i * 86_400_000)))];

async function main() {
  const redis = new Redis({ url: url!, token: token! });
  const tx = redis.pipeline();
  for (const label of labels) {
    const keys = usageKeys(label === "all time" ? "all" : label);
    tx.hgetall<Record<string, number>>(keys.counts);
    tx.pfcount(keys.accounts);
  }
  const replies = await tx.exec();

  const rows = labels.map((label, i) => {
    const counts = (replies[i * 2] ?? {}) as Record<string, number>;
    const row = {
      roasts: Number(counts.roasts ?? 0),
      accounts: Number(replies[i * 2 + 1] ?? 0),
      toasty: Number(counts.toasty ?? 0),
      "extra crispy": Number(counts.extra_crispy ?? 0),
      nuclear: Number(counts.nuclear ?? 0),
    };
    return [label, row] as const;
  });

  console.log("Days are UTC. Account numbers are HyperLogLog estimates (within about 1%).");
  console.table(Object.fromEntries(rows));
}

main().catch((err) => {
  console.error("Couldn't read usage:", err instanceof Error ? err.message : err);
  process.exit(1);
});
