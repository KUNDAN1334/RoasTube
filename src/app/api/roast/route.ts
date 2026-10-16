import { getToken, type JWT } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { YOUTUBE_SCOPE } from "@/auth";
import { isDemoMode } from "@/lib/demo";
import { runRoastPipeline } from "@/lib/roast/pipeline";
import { demoRoast } from "@/lib/server/demo-roast";
import { RoastGenerationError } from "@/lib/roast/model-fallback";
import { generateRoast } from "@/lib/server/gemini";
import { takeRoastAllowance } from "@/lib/server/ratelimit";
import {
  avatarDataUrl,
  fetchLikedVideos,
  fetchOwnChannel,
  fetchPlaylists,
  fetchSubscriptions,
  YouTubeError,
} from "@/lib/server/youtube";
import { TakeoutDigestSchema } from "@/lib/takeout/schema";
import { INTENSITIES, type RoastErrorCode, type RoastEvent } from "@/lib/types";

export const maxDuration = 60;

const BodySchema = z.object({
  intensity: z.enum(INTENSITIES),
  takeoutDigest: TakeoutDigestSchema.optional(),
  /** Development only: include the stats and digest in the stream. */
  debug: z.boolean().optional(),
  /** Demo mode only: force an error state. */
  mock: z.enum(["empty", "scope", "no_channel", "rate_limited", "daily_limit", "auth", "unknown"]).optional(),
});

/** Auth.js picks the cookie name by protocol; try the secure one first, then the plain one. */
async function readToken(req: NextRequest): Promise<JWT | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return null;
  return (
    (await getToken({ req, secret, secureCookie: true })) ??
    (await getToken({ req, secret, secureCookie: false }))
  );
}

function stream(events: AsyncIterable<object>, onCancel?: () => void) {
  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of events) controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      } finally {
        controller.close();
      }
    },
    cancel() {
      onCancel?.();
    },
  });
  return new Response(body, {
    headers: {
      "content-type": "application/x-ndjson; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}

async function* single(event: RoastEvent) {
  yield event;
}

function classifyError(err: unknown): RoastErrorCode {
  if (err instanceof YouTubeError) {
    if (err.kind === "quota") return "rate_limited";
    return err.kind;
  }
  if (err instanceof RoastGenerationError) return err.kind;
  console.error("[roast] unexpected error:", err);
  return "unknown";
}

export async function POST(req: NextRequest) {
  const parsed = BodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "bad_request" }, { status: 400 });
  const body = parsed.data;

  if (isDemoMode()) {
    return stream(demoRoast(body.intensity, body.mock, Boolean(body.takeoutDigest)));
  }

  const token = await readToken(req);
  const access = token?.googleAccessToken;
  const expiresAt = (token?.googleExpiresAt ?? 0) * 1000;
  if (!token || !access || !token.googleId || expiresAt < Date.now() + 60_000) {
    return stream(single({ type: "error", code: "auth" }));
  }
  if (!token.googleScope?.includes(YOUTUBE_SCOPE)) {
    return stream(single({ type: "error", code: "scope" }));
  }

  const abort = new AbortController();
  req.signal.addEventListener("abort", () => abort.abort());
  const signal = abort.signal;
  const googleId = token.googleId;

  const events = runRoastPipeline(
    {
      intensity: body.intensity,
      takeout: body.takeoutDigest ?? null,
      fallbackName: typeof token.name === "string" ? token.name.split(" ")[0] : null,
      debug: body.debug === true && process.env.NODE_ENV !== "production",
    },
    {
      fetchChannel: () => fetchOwnChannel(access, signal),
      fetchLiked: () => fetchLikedVideos(access, signal),
      fetchSubscriptions: () => fetchSubscriptions(access, signal),
      fetchPlaylists: () => fetchPlaylists(access, signal),
      fetchAvatar: (url) => avatarDataUrl(url, signal),
      allowRoast: () => takeRoastAllowance(googleId),
      generate: (digest) => generateRoast(digest, signal),
      classifyError,
    },
  );
  return stream(events, () => abort.abort());
}
