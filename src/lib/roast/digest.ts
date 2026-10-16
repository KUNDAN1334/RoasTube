import type { Intensity } from "@/lib/types";
import { dropSensitive, isSensitive } from "./sensitive";
import type { Stats } from "./stats";
import type { Video } from "./youtube-data";

const pct = (x: number) => `${Math.round(x * 100)}%`;

/** One line, no control characters, capped. Titles are data and may contain anything. */
export function clean(text: string, max = 100) {
  const flat = text.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

function formatLength(sec: number | null) {
  if (!sec) return "live";
  if (sec < 60) return `${sec}s`;
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

/** The most recent likes, then an even spread through the rest, so old habits show too. */
export function sampleLikes(liked: Video[], size = 150) {
  if (liked.length <= size) return liked;
  const recent = liked.slice(0, Math.floor(size * 0.4));
  const rest = liked.slice(recent.length);
  const want = size - recent.length;
  const step = rest.length / want;
  const spread = Array.from({ length: want }, (_, i) => rest[Math.floor(i * step)]);
  return [...recent, ...spread];
}

/**
 * The compact text the model sees: computed stats plus a sample of titles. It never
 * includes the person's name, email or channel ID, and sensitive items are dropped first.
 */
export function buildDigest(input: {
  stats: Stats;
  liked: Video[];
  subscriptions: string[];
  intensity: Intensity;
  baseScore: number;
}) {
  const { stats, intensity, baseScore } = input;
  const liked = dropSensitive(input.liked, (v) => [v.title, v.channel]);
  const subs = input.subscriptions.filter((s) => !isSensitive(s));
  const lines: string[] = [];

  lines.push(`HEAT_LEVEL: ${intensity}`);
  lines.push(
    `BASE_BRAINROT_SCORE: ${baseScore} (short-form ${pct(stats.shortShare)}, entertainment/gaming/comedy ${pct(stats.funShare)}, top-5 channel share ${pct(stats.top5Share)}${
      stats.takeout?.lateNightShare != null ? `, midnight-4am share ${pct(stats.takeout.lateNightShare)}` : ""
    })`,
  );

  if (stats.likedCount) {
    lines.push("", `LIKED VIDEOS (${stats.likedCount} most recent)`);
    lines.push(`- Under 3 minutes: ${pct(stats.shortShare)}`);
    lines.push(`- Categories: ${stats.categories.map((c) => `${c.name} ${pct(c.share)}`).join(", ")}`);
    const channels = stats.topChannels.filter((c) => !isSensitive(c.name));
    if (channels.length) lines.push(`- Top channels by likes: ${channels.map((c) => `${clean(c.name, 50)} (${c.count})`).join(", ")}`);
    lines.push(`- Top 5 channels hold ${pct(stats.top5Share)} of likes, across ${stats.distinctChannels} channels in total`);
    if (stats.longest && !isSensitive(stats.longest.title)) {
      lines.push(`- Longest liked video: "${clean(stats.longest.title, 80)}" (${formatLength(stats.longest.durationSec)})`);
    }
  } else {
    lines.push("", "LIKED VIDEOS: none");
  }

  lines.push("", `SUBSCRIPTIONS (${stats.subscriptionCount})`);
  if (subs.length) lines.push(`Sample: ${subs.slice(0, 40).map((s) => clean(s, 40)).join(", ")}`);

  const playlists = stats.playlists.filter((p) => !isSensitive(p.name));
  if (playlists.length) {
    lines.push("", `PLAYLISTS (${stats.playlists.length})`);
    for (const p of playlists.slice(0, 12)) lines.push(`- "${clean(p.name, 60)}" (${p.count} videos)`);
  }

  const t = stats.takeout;
  if (t) {
    lines.push("", "WATCH HISTORY FROM GOOGLE TAKEOUT");
    lines.push(`- Videos watched: ${t.watchCount}${t.firstWatched && t.lastWatched ? ` between ${t.firstWatched} and ${t.lastWatched}` : ""}`);
    if (t.lateNightShare != null) lines.push(`- Watched between midnight and 4am: ${pct(t.lateNightShare)}`);
    const top = t.topChannels.filter((c) => !isSensitive(c.name));
    if (top.length) lines.push(`- Most watched channels: ${top.map((c) => `${clean(c.name, 50)} (${c.count})`).join(", ")}`);
    if (t.mostRewatched && !isSensitive(t.mostRewatched.title)) {
      lines.push(`- Most rewatched: "${clean(t.mostRewatched.title, 80)}"${t.mostRewatched.channel ? ` by ${clean(t.mostRewatched.channel, 40)}` : ""}, ${t.mostRewatched.count} times`);
    }
    const searches = t.sampleSearches.filter((s) => !isSensitive(s));
    if (t.searchCount) lines.push(`- Searches: ${t.searchCount}${searches.length ? `. Sample: ${searches.map((s) => `"${clean(s, 60)}"`).join(", ")}` : ""}`);
    const comments = t.sampleComments.filter((c) => !isSensitive(c));
    if (t.commentCount) lines.push(`- Comments written: ${t.commentCount}${comments.length ? `. Sample: ${comments.map((c) => `"${clean(c, 80)}"`).join(", ")}` : ""}`);
    const watched = t.sampleTitles.filter((s) => !isSensitive(s));
    if (watched.length) {
      lines.push("", "SAMPLE OF WATCHED VIDEOS");
      for (const title of watched.slice(0, 60)) lines.push(`- ${clean(title, 90)}`);
    }
  }

  const sample = sampleLikes(liked);
  if (sample.length) {
    lines.push("", "SAMPLE OF LIKED VIDEOS (title | channel | length)");
    for (const v of sample) lines.push(`- ${clean(v.title, 90)} | ${clean(v.channel, 40)} | ${formatLength(v.durationSec)}`);
  }

  return lines.join("\n");
}
