// The roast, start to finish, as a stream of progress events. Dependencies are passed in
// so the same code runs against the real APIs in the route and against fakes in tests.

import type { TakeoutDigest } from "@/lib/takeout/schema";
import type { Intensity, Roast, RoastErrorCode, RoastEvent, RoastResult } from "@/lib/types";
import { buildDigest } from "./digest";
import { baseBrainrotScore, computeStats, exhibits, settleScore, type Stats } from "./stats";
import type { Playlist, Video } from "./youtube-data";

export type PipelineDeps = {
  fetchChannel: () => Promise<{ title: string | null; thumbnailUrl: string | null } | null>;
  fetchLiked: () => Promise<Video[]>;
  fetchSubscriptions: () => Promise<string[]>;
  fetchPlaylists: () => Promise<Playlist[]>;
  fetchAvatar: (url: string | null) => Promise<string | null>;
  /** Consumes one roast from the daily allowance; false when it's used up. */
  allowRoast: () => Promise<boolean>;
  generate: (digest: string) => Promise<Roast>;
  /** Adds a finished roast to the anonymous usage counts. Must not throw. */
  recordRoast: (result: RoastResult) => Promise<void>;
  /** Maps a thrown error to the state the UI should show. */
  classifyError: (err: unknown) => RoastErrorCode;
};

export type PipelineInput = {
  intensity: Intensity;
  takeout: TakeoutDigest | null;
  /** Shown on the roast when the account has no channel title. */
  fallbackName: string | null;
  debug?: boolean;
};

export type DebugEvent = { type: "debug"; stats: Stats; baseScore: number; digest: string };

const shortName = (name: string | null | undefined) => {
  const trimmed = name?.trim();
  if (!trimmed) return null;
  return trimmed.length > 40 ? `${trimmed.slice(0, 39)}…` : trimmed;
};

export async function* runRoastPipeline(
  input: PipelineInput,
  deps: PipelineDeps,
): AsyncGenerator<RoastEvent | DebugEvent> {
  try {
    // With a Takeout export, an account that has no channel can still be roasted: YouTube's
    // "no channel" answers just mean there's nothing extra to add.
    const orNothing = async <T,>(fetch: () => Promise<T>, nothing: T) => {
      try {
        return await fetch();
      } catch (err) {
        if (input.takeout && deps.classifyError(err) === "no_channel") return nothing;
        throw err;
      }
    };

    yield { type: "step", step: "likes" };
    const channel = await orNothing(deps.fetchChannel, null);
    const liked = await orNothing(deps.fetchLiked, [] as Video[]);

    yield { type: "step", step: "subscriptions" };
    const [subscriptions, playlists, avatar] = await Promise.all([
      orNothing(deps.fetchSubscriptions, [] as string[]),
      orNothing(deps.fetchPlaylists, [] as Playlist[]),
      deps.fetchAvatar(channel?.thumbnailUrl ?? null),
    ]);

    const nothing = liked.length === 0 && subscriptions.length === 0 && !input.takeout;
    if (nothing) {
      yield { type: "error", code: channel ? "empty" : "no_channel" };
      return;
    }

    yield { type: "step", step: "digest" };
    const stats = computeStats({ liked, subscriptionCount: subscriptions.length, playlists, takeout: input.takeout });
    const baseScore = baseBrainrotScore(stats);
    const digest = buildDigest({ stats, liked, subscriptions, intensity: input.intensity, baseScore });
    if (input.debug) yield { type: "debug", stats, baseScore, digest };

    if (!(await deps.allowRoast())) {
      yield { type: "error", code: "daily_limit" };
      return;
    }

    yield { type: "step", step: "gemini" };
    const roast = await deps.generate(digest);

    const result: RoastResult = {
      roast: { ...roast, brainrotScore: settleScore(baseScore, roast.brainrotScore) },
      exhibits: exhibits(stats),
      intensity: input.intensity,
      usedTakeout: Boolean(input.takeout),
      profile: { name: shortName(channel?.title) ?? shortName(input.fallbackName), avatar },
      createdAt: new Date().toISOString(),
    };
    yield { type: "done", result };
    // Counted after the result is on its way, so it never slows a roast down.
    await deps.recordRoast(result);
  } catch (err) {
    yield { type: "error", code: deps.classifyError(err) };
  }
}
