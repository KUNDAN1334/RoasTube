import { TakeoutDigestSchema, type TakeoutDigest } from "./schema";

// The Takeout summary rides from /nuclear to /roast in sessionStorage: it survives the
// Google sign-in round trip in the same tab and disappears when the tab closes.
const KEY = "roastube:takeout:v1";

export function saveTakeoutDigest(digest: TakeoutDigest) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(digest));
    return true;
  } catch {
    return false;
  }
}

export function loadTakeoutDigest(): TakeoutDigest | null {
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = TakeoutDigestSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
