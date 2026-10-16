/**
 * Demo mode replays fixture roasts instead of calling Google and Gemini. It turns on by
 * itself in development when Google credentials aren't set, so the UI stays usable, and
 * can be forced with ROASTUBE_DEMO=1. It never turns on by itself in production.
 */
export function isDemoMode() {
  if (process.env.ROASTUBE_DEMO === "1") return true;
  return process.env.NODE_ENV !== "production" && !process.env.AUTH_GOOGLE_ID;
}
