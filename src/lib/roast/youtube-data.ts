// Shapes and helpers for YouTube Data API v3 responses. Pure, so it runs in tests.

export const CATEGORY_NAMES: Record<string, string> = {
  "1": "Film & Animation",
  "2": "Autos",
  "10": "Music",
  "15": "Pets & Animals",
  "17": "Sports",
  "19": "Travel",
  "20": "Gaming",
  "22": "People & Blogs",
  "23": "Comedy",
  "24": "Entertainment",
  "25": "News & Politics",
  "26": "Howto & Style",
  "27": "Education",
  "28": "Science & Technology",
};

export type ApiVideo = {
  id?: string;
  snippet?: { title?: string; channelTitle?: string; categoryId?: string };
  contentDetails?: { duration?: string };
};

export type ApiSubscription = { snippet?: { title?: string } };
export type ApiPlaylist = { snippet?: { title?: string }; contentDetails?: { itemCount?: number } };
export type ApiChannel = {
  snippet?: { title?: string; thumbnails?: Record<string, { url?: string }> };
};

export type Video = {
  title: string;
  channel: string;
  categoryId: string;
  /** null for live streams and anything without a parseable length. */
  durationSec: number | null;
};

export type Playlist = { name: string; count: number };

/** ISO 8601 durations like PT1H2M3S or P1DT2H. Returns null for P0D (live) or garbage. */
export function parseDuration(iso: string | undefined): number | null {
  if (!iso) return null;
  const m = /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(iso);
  if (!m) return null;
  const [, d, h, min, s] = m;
  const total = Number(d ?? 0) * 86400 + Number(h ?? 0) * 3600 + Number(min ?? 0) * 60 + Number(s ?? 0);
  return total > 0 ? Math.round(total) : null;
}

export function normalizeVideo(v: ApiVideo): Video | null {
  const title = v.snippet?.title?.trim();
  if (!title) return null;
  return {
    title,
    channel: v.snippet?.channelTitle?.trim() || "Unknown channel",
    categoryId: v.snippet?.categoryId ?? "",
    durationSec: parseDuration(v.contentDetails?.duration),
  };
}

export function categoryName(id: string) {
  return CATEGORY_NAMES[id] ?? "Other";
}
