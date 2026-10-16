import "server-only";
import {
  normalizeVideo,
  type ApiChannel,
  type ApiPlaylist,
  type ApiSubscription,
  type ApiVideo,
  type Playlist,
  type Video,
} from "@/lib/roast/youtube-data";

const API = "https://www.googleapis.com/youtube/v3";
const MAX_PAGES = 4;

export type YouTubeFailure = "auth" | "scope" | "quota" | "no_channel" | "unknown";

export class YouTubeError extends Error {
  constructor(
    readonly kind: YouTubeFailure,
    readonly status: number,
    readonly reason?: string,
  ) {
    super(`YouTube API ${status}${reason ? ` (${reason})` : ""}`);
  }
}

function classify(status: number, reason?: string): YouTubeFailure {
  if (reason === "youtubeSignupRequired" || reason === "channelNotFound") return "no_channel";
  if (reason === "insufficientPermissions" || reason === "ACCESS_TOKEN_SCOPE_INSUFFICIENT") return "scope";
  if (reason === "quotaExceeded" || reason === "dailyLimitExceeded" || reason === "rateLimitExceeded") return "quota";
  if (status === 401) return "auth";
  if (status === 403) return "scope";
  if (status === 429) return "quota";
  return "unknown";
}

type Page<T> = { items?: T[]; nextPageToken?: string };

async function get<T>(path: string, params: Record<string, string>, token: string, signal?: AbortSignal) {
  const url = new URL(`${API}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
    signal,
  });
  if (!res.ok) {
    let reason: string | undefined;
    try {
      const body = (await res.json()) as { error?: { errors?: { reason?: string }[]; status?: string } };
      reason = body.error?.errors?.[0]?.reason ?? body.error?.status;
    } catch {
      // No JSON body; the status code is enough.
    }
    throw new YouTubeError(classify(res.status, reason), res.status, reason);
  }
  return (await res.json()) as Page<T>;
}

async function paged<T>(path: string, params: Record<string, string>, token: string, signal?: AbortSignal) {
  const all: T[] = [];
  let pageToken: string | undefined;
  for (let i = 0; i < MAX_PAGES; i++) {
    const page = await get<T>(path, { ...params, ...(pageToken ? { pageToken } : {}) }, token, signal);
    all.push(...(page.items ?? []));
    pageToken = page.nextPageToken;
    if (!pageToken) break;
  }
  return all;
}

/** Roughly 200 liked videos, newest first. About 4 quota units. */
export async function fetchLikedVideos(token: string, signal?: AbortSignal): Promise<Video[]> {
  const items = await paged<ApiVideo>(
    "videos",
    { part: "snippet,contentDetails", myRating: "like", maxResults: "50" },
    token,
    signal,
  );
  return items.map(normalizeVideo).filter((v): v is Video => v !== null);
}

/** Up to about 200 subscribed channel names. About 4 quota units. */
export async function fetchSubscriptions(token: string, signal?: AbortSignal): Promise<string[]> {
  const items = await paged<ApiSubscription>(
    "subscriptions",
    { part: "snippet", mine: "true", maxResults: "50", order: "relevance" },
    token,
    signal,
  );
  return items.map((s) => s.snippet?.title?.trim()).filter((t): t is string => Boolean(t));
}

/** Playlist names and sizes. One quota unit. */
export async function fetchPlaylists(token: string, signal?: AbortSignal): Promise<Playlist[]> {
  const page = await get<ApiPlaylist>("playlists", { part: "snippet,contentDetails", mine: "true", maxResults: "50" }, token, signal);
  return (page.items ?? [])
    .map((p) => ({ name: p.snippet?.title?.trim() ?? "", count: p.contentDetails?.itemCount ?? 0 }))
    .filter((p) => p.name);
}

export type ChannelInfo = { title: string | null; thumbnailUrl: string | null } | null;

/** The signed-in person's own channel, or null when the account has none. One quota unit. */
export async function fetchOwnChannel(token: string, signal?: AbortSignal): Promise<ChannelInfo> {
  const page = await get<ApiChannel>("channels", { part: "snippet", mine: "true" }, token, signal);
  const channel = page.items?.[0];
  if (!channel) return null;
  const thumbs = channel.snippet?.thumbnails ?? {};
  return {
    title: channel.snippet?.title?.trim() || null,
    thumbnailUrl: thumbs.medium?.url ?? thumbs.default?.url ?? thumbs.high?.url ?? null,
  };
}

const AVATAR_HOSTS = /(^|\.)(ggpht\.com|googleusercontent\.com|ytimg\.com)$/;
const AVATAR_MAX_BYTES = 300_000;

/**
 * Fetches the channel picture and returns it as a data URL, so the browser can draw it
 * into the share image without cross-origin trouble. Only Google image hosts are allowed.
 */
export async function avatarDataUrl(url: string | null, signal?: AbortSignal): Promise<string | null> {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" || !AVATAR_HOSTS.test(parsed.hostname)) return null;
    const res = await fetch(parsed, { cache: "no-store", signal });
    // Redirects are followed, so check where we actually ended up.
    if (res.url && !AVATAR_HOSTS.test(new URL(res.url).hostname)) return null;
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(jpeg|png|webp)/.test(type)) return null;
    if (Number(res.headers.get("content-length") ?? 0) > AVATAR_MAX_BYTES) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.byteLength > AVATAR_MAX_BYTES) return null;
    return `data:${type.split(";")[0]};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}
