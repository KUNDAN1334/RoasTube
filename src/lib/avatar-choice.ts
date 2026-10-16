import { TOON_AVATARS } from "@/components/avatars/ToonAvatar";
import { YOUTUBE_AVATAR } from "@/components/avatars/UserAvatar";
import type { Profile } from "./types";

const KEY = "roastube:avatar:v1";

/** Stable pick from the toon set, so the same person gets the same toon every time. */
function hashPick(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return TOON_AVATARS[Math.abs(h) % TOON_AVATARS.length].id;
}

export function defaultAvatar(profile: Profile) {
  if (profile.avatar) return YOUTUBE_AVATAR;
  return hashPick(profile.name ?? "roastube");
}

/** The person's own pick wins; it's kept in this browser only. */
export function readAvatarChoice(profile: Profile): string {
  try {
    const saved = window.localStorage.getItem(KEY);
    if (saved === YOUTUBE_AVATAR && profile.avatar) return saved;
    if (saved && TOON_AVATARS.some((a) => a.id === saved)) return saved;
  } catch {
    // Storage blocked; fall through to the default.
  }
  return defaultAvatar(profile);
}

export function saveAvatarChoice(choice: string) {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    // Not saved; the pick still applies for this visit.
  }
}
