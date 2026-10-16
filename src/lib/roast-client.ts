import type { TakeoutDigest } from "./takeout/schema";
import type { Intensity, RoastErrorCode, RoastEvent } from "./types";

export type RoastRequest = {
  intensity: Intensity;
  takeoutDigest?: TakeoutDigest;
  /** Development only: ask the server for the stats and digest too. */
  debug?: boolean;
  /** Demo mode only: force an error state to preview it. */
  mock?: RoastErrorCode;
};

export type DebugInfo = { stats: unknown; baseScore: number; digest: string };
export type StreamEvent = RoastEvent | ({ type: "debug" } & DebugInfo);

/** Reads /api/roast's newline-delimited JSON stream as events, as they arrive. */
export async function* streamRoast(req: RoastRequest, signal?: AbortSignal): AsyncGenerator<StreamEvent> {
  const res = await fetch("/api/roast", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (res.status === 401) return yield { type: "error", code: "auth" };
  if (!res.ok || !res.body) return yield { type: "error", code: "unknown" };

  const reader = res.body.pipeThrough(new TextDecoderStream()).getReader();
  let buffer = "";
  while (true) {
    const { value, done } = await reader.read();
    if (value) buffer += value;
    let newline: number;
    while ((newline = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (line) yield JSON.parse(line) as StreamEvent;
    }
    if (done) break;
  }
  if (buffer.trim()) yield JSON.parse(buffer) as StreamEvent;
}
