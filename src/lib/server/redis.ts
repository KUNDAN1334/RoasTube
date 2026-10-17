import "server-only";
import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

/** Upstash is optional: without it there's no rate limit and no usage counts. */
export function getRedis() {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

/** One-way hash of a Google account ID, so the raw ID never reaches Redis. */
export const accountHash = (googleId: string) =>
  createHash("sha256").update(`roastube:${googleId}`).digest("hex");
