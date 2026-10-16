import type { RoastResult } from "./types";

// Results live only in this browser, one per account. Every access is guarded: private
// windows, blocked storage and quota errors all fall back to "nothing cached".

// Bump the version whenever RoastResult changes shape, so old caches are ignored.
const PREFIX = "roastube:last-roast:v3:";

export function readCachedRoast(viewerKey: string): RoastResult | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + viewerKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as RoastResult;
    return parsed?.roast?.verdict && parsed.roast.nickname && parsed.profile ? parsed : null;
  } catch {
    return null;
  }
}

export function writeCachedRoast(viewerKey: string, result: RoastResult) {
  try {
    window.localStorage.setItem(PREFIX + viewerKey, JSON.stringify(result));
  } catch {
    // Storage unavailable; the roast still shows, it just won't survive a reload.
  }
}

/** Removes every cached roast, including ones from older versions of the app. */
export function clearCachedRoasts() {
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key?.startsWith("roastube:last-roast:")) keys.push(key);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // Nothing to clear.
  }
}
