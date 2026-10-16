// Turns Google Takeout's YouTube history files into a small TakeoutDigest. Pure functions,
// run in the browser: the files themselves never leave the device.

import { isSensitive } from "@/lib/roast/sensitive";
import type { TakeoutDigest } from "./schema";

export type HistoryEntry = {
  header?: string;
  title?: string;
  titleUrl?: string;
  subtitles?: { name?: string; url?: string }[];
  time?: string;
  details?: { name?: string }[];
};

// Takeout writes the action into the title in the account's language.
const WATCHED = /^(Watched|Visto|Viste|Vu|Regardé|Angesehen|Visualizzato|Assistiu a|Bekeken|Obejrzano|Просмотрено:?)\s+/i;
const SEARCHED = /^(Searched for|Buscaste|Pesquisou|Recherché|Gesucht nach|Hai cercato|Gezocht naar|Искали:?)\s+/i;
const REMOVED = /video that has been removed|removed video|vídeo que se ha eliminado|vidéo qui a été supprimée/i;

const cap = (s: string, max: number) => {
  const flat = s.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
};

const monthYear = (d: Date) => d.toLocaleDateString("en-US", { month: "short", year: "numeric" });

function videoKey(e: HistoryEntry, title: string) {
  if (e.titleUrl) {
    try {
      const v = new URL(e.titleUrl).searchParams.get("v");
      if (v) return v;
    } catch {
      // Not a URL; fall back to the title.
    }
  }
  return title;
}

/** Most recent first, then an even spread, deduped, sensitive items dropped. */
function sample(items: string[], size: number, max: number) {
  const seen = new Set<string>();
  const clean = items.map((t) => cap(t, max)).filter((t) => {
    if (!t || seen.has(t) || isSensitive(t)) return false;
    seen.add(t);
    return true;
  });
  if (clean.length <= size) return clean;
  const recent = clean.slice(0, Math.ceil(size / 2));
  const rest = clean.slice(recent.length);
  const want = size - recent.length;
  return [...recent, ...Array.from({ length: want }, (_, i) => rest[Math.floor((i * rest.length) / want)])];
}

export type WatchSummary = Pick<
  TakeoutDigest,
  "watchCount" | "firstWatched" | "lastWatched" | "lateNightShare" | "topChannels" | "mostRewatched" | "sampleTitles"
>;

export function summarizeWatchHistory(entries: HistoryEntry[]): WatchSummary {
  const watches = entries.filter(
    (e) => typeof e.title === "string" && !e.details?.some((d) => /ads/i.test(d.name ?? "")) && e.time,
  );
  // Takeout lists newest first, but don't count on it.
  watches.sort((a, b) => Date.parse(b.time ?? "") - Date.parse(a.time ?? ""));

  let lateNight = 0;
  const channels = new Map<string, number>();
  const plays = new Map<string, { title: string; channel: string | null; count: number }>();
  const titles: string[] = [];

  for (const e of watches) {
    const when = new Date(e.time as string);
    if (!Number.isNaN(when.getTime()) && when.getHours() < 4) lateNight++;
    const title = (e.title as string).replace(WATCHED, "").trim();
    if (!title || REMOVED.test(title) || /^https?:\/\//.test(title)) continue;
    const channel = e.subtitles?.[0]?.name?.trim() || null;
    if (channel) channels.set(channel, (channels.get(channel) ?? 0) + 1);
    const key = videoKey(e, title);
    const prev = plays.get(key);
    plays.set(key, { title, channel, count: (prev?.count ?? 0) + 1 });
    titles.push(title);
  }

  const rewatched = [...plays.values()]
    .filter((p) => !isSensitive(p.title) && !isSensitive(p.channel))
    .sort((a, b) => b.count - a.count)[0];
  const times = watches.map((e) => new Date(e.time as string)).filter((d) => !Number.isNaN(d.getTime()));

  return {
    watchCount: watches.length,
    firstWatched: times.length ? monthYear(times[times.length - 1]) : null,
    lastWatched: times.length ? monthYear(times[0]) : null,
    lateNightShare: watches.length ? lateNight / watches.length : null,
    topChannels: [...channels.entries()]
      .filter(([name]) => !isSensitive(name))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name: cap(name, 100), count })),
    mostRewatched:
      rewatched && rewatched.count >= 2
        ? { title: cap(rewatched.title, 150), channel: rewatched.channel ? cap(rewatched.channel, 100) : null, count: rewatched.count }
        : null,
    sampleTitles: sample(titles, 80, 150),
  };
}

export function summarizeSearchHistory(entries: HistoryEntry[]) {
  const searches = entries
    .filter((e) => typeof e.title === "string" && SEARCHED.test(e.title))
    .sort((a, b) => Date.parse(b.time ?? "") - Date.parse(a.time ?? ""))
    .map((e) => (e.title as string).replace(SEARCHED, "").trim());
  return { searchCount: searches.length, sampleSearches: sample(searches, 30, 100).slice(0, 30) };
}

/** Minimal RFC 4180 CSV parser: quoted fields, doubled quotes, newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim()));
}

/** Strips anything that could identify someone: links, emails and @handles. */
function scrub(text: string) {
  return text
    .replace(/https?:\/\/\S+/g, "")
    .replace(/\S+@\S+\.\S+/g, "")
    .replace(/@[\w.-]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Comment text in newer exports is JSON fragments like {"text":"nice"}; older ones are plain. */
function commentText(raw: string) {
  const parts = [...raw.matchAll(/"text"\s*:\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => {
    try {
      return JSON.parse(`"${m[1]}"`) as string;
    } catch {
      return m[1];
    }
  });
  return parts.length ? parts.join("") : raw;
}

export function summarizeComments(csv: string) {
  const rows = parseCsv(csv);
  if (!rows.length) return { commentCount: 0, sampleComments: [] as string[] };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  let col = header.findIndex((h) => h.includes("comment text") || h === "text");
  const body = col >= 0 ? rows.slice(1) : rows;
  if (col < 0) col = rows[0].length - 1;
  const texts = body.map((r) => scrub(commentText(r[col] ?? ""))).filter((t) => t.length >= 3);
  const step = Math.max(1, Math.floor(texts.length / 8));
  const picked = texts.filter((_, i) => i % step === 0);
  return {
    commentCount: body.length,
    sampleComments: picked.map((t) => cap(t, 80)).filter((t) => !isSensitive(t)).slice(0, 8),
  };
}

export function emptyDigest(): TakeoutDigest {
  return {
    watchCount: 0,
    firstWatched: null,
    lastWatched: null,
    lateNightShare: null,
    topChannels: [],
    mostRewatched: null,
    sampleTitles: [],
    searchCount: 0,
    sampleSearches: [],
    commentCount: 0,
    sampleComments: [],
  };
}
