import type { TakeoutDigest } from "@/lib/takeout/schema";
import { categoryName, type Playlist, type Video } from "./youtube-data";

export type Stats = {
  likedCount: number;
  /** Likes with a known length that are 3 minutes or shorter, 0..1. */
  shortShare: number;
  categories: { name: string; share: number }[];
  /** Entertainment, Gaming and Comedy together, 0..1. */
  funShare: number;
  topChannels: { name: string; count: number }[];
  /** Share of likes held by the top 5 channels, 0..1. */
  top5Share: number;
  distinctChannels: number;
  longest: { title: string; durationSec: number } | null;
  subscriptionCount: number;
  playlists: Playlist[];
  takeout: TakeoutDigest | null;
};

const SHORT_SECONDS = 180;
const FUN_CATEGORIES = new Set(["20", "23", "24"]);

function countBy<T>(items: T[], key: (t: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) counts.set(key(item), (counts.get(key(item)) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

export function computeStats(input: {
  liked: Video[];
  subscriptionCount: number;
  playlists: Playlist[];
  takeout: TakeoutDigest | null;
}): Stats {
  const { liked } = input;
  const n = liked.length;
  const timed = liked.filter((v) => v.durationSec !== null);
  const shortCount = timed.filter((v) => (v.durationSec ?? 0) <= SHORT_SECONDS).length;
  const categoryCounts = countBy(liked, (v) => categoryName(v.categoryId));
  const channelCounts = countBy(liked, (v) => v.channel);
  const top5 = channelCounts.slice(0, 5).reduce((sum, [, c]) => sum + c, 0);
  const longest = timed.reduce<Video | null>((best, v) => (!best || (v.durationSec ?? 0) > (best.durationSec ?? 0) ? v : best), null);

  return {
    likedCount: n,
    shortShare: timed.length ? shortCount / timed.length : 0,
    categories: categoryCounts.slice(0, 6).map(([name, c]) => ({ name, share: c / n })),
    funShare: n ? liked.filter((v) => FUN_CATEGORIES.has(v.categoryId)).length / n : 0,
    topChannels: channelCounts.slice(0, 5).map(([name, count]) => ({ name, count })),
    top5Share: n ? top5 / n : 0,
    distinctChannels: channelCounts.length,
    longest: longest && longest.durationSec ? { title: longest.title, durationSec: longest.durationSec } : null,
    subscriptionCount: input.subscriptionCount,
    playlists: input.playlists,
    takeout: input.takeout,
  };
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

/**
 * The base brainrot score, computed in code so the same data always lands in the same
 * place. Each signal is normalized to 0..1 against a "this is as bad as it gets" level.
 * The model may move the result by at most 10 points.
 */
export function baseBrainrotScore(stats: Stats) {
  if (stats.likedCount === 0 && !stats.takeout) return 50;
  const short = clamp01(stats.shortShare / 0.75);
  const fun = clamp01(stats.funShare / 0.8);
  const concentration = clamp01(stats.top5Share / 0.6);
  const late = stats.takeout?.lateNightShare;

  const weighted =
    late === null || late === undefined
      ? 0.45 * short + 0.35 * fun + 0.2 * concentration
      : 0.35 * short + 0.25 * clamp01(late / 0.35) + 0.25 * fun + 0.15 * concentration;
  return Math.round(clamp01(weighted) * 100);
}

/** Keeps the model's score within 10 points of the base, and inside 0..100. */
export function settleScore(base: number, model: number) {
  const nudged = Math.max(base - 10, Math.min(base + 10, Math.round(model)));
  return Math.max(0, Math.min(100, nudged));
}

const pct = (x: number) => `${Math.round(x * 100)}%`;

/** Plain-language receipts for the roast board, strongest first. */
export function exhibits(stats: Stats): string[] {
  const out: { text: string; weight: number }[] = [];
  if (stats.likedCount) {
    out.push({ text: `${pct(stats.shortShare)} of your likes are under 3 minutes`, weight: stats.shortShare + 0.1 });
    out.push({ text: `Your top 5 channels hold ${pct(stats.top5Share)} of your likes`, weight: stats.top5Share });
    const top = stats.categories[0];
    if (top) out.push({ text: `${top.name} is ${pct(top.share)} of everything you like`, weight: top.share * 0.8 });
  }
  if (stats.subscriptionCount >= 100) {
    out.push({ text: `${stats.subscriptionCount} subscriptions`, weight: Math.min(1, stats.subscriptionCount / 400) * 0.6 });
  }
  const t = stats.takeout;
  if (t?.lateNightShare) {
    out.push({ text: `${pct(t.lateNightShare)} of your watching happens between midnight and 4am`, weight: t.lateNightShare * 2 });
  }
  if (t?.mostRewatched && t.mostRewatched.count >= 3) {
    out.push({ text: `One video rewatched ${t.mostRewatched.count} times`, weight: Math.min(1, t.mostRewatched.count / 10) });
  }
  return out
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((e) => e.text);
}
