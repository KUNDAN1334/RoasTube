import "server-only";
import { FIXTURE_ROASTS } from "@/lib/fixtures";
import type { Intensity, RoastErrorCode, RoastEvent } from "@/lib/types";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Demo mode: the same event stream as a real roast, replayed from fixtures. `mock` forces
 * an error state so every screen can be previewed without Google credentials.
 */
export async function* demoRoast(intensity: Intensity, mock?: RoastErrorCode, usedTakeout = false): AsyncGenerator<RoastEvent> {
  yield { type: "step", step: "likes" };
  await wait(1100);
  if (mock === "auth" || mock === "scope" || mock === "no_channel") return yield { type: "error", code: mock };

  yield { type: "step", step: "subscriptions" };
  await wait(1000);
  if (mock === "empty") return yield { type: "error", code: "empty" };

  yield { type: "step", step: "digest" };
  await wait(900);
  if (mock === "daily_limit") return yield { type: "error", code: "daily_limit" };

  yield { type: "step", step: "gemini" };
  await wait(1600);
  if (mock === "rate_limited" || mock === "unknown") return yield { type: "error", code: mock };

  const fixture = FIXTURE_ROASTS[intensity];
  yield {
    type: "done",
    result: { ...fixture, usedTakeout: usedTakeout || fixture.usedTakeout, createdAt: new Date().toISOString() },
  };
}
