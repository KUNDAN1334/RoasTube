"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { readCachedRoast, writeCachedRoast } from "@/lib/roast-cache";
import { streamRoast, type DebugInfo } from "@/lib/roast-client";
import { loadTakeoutDigest } from "@/lib/takeout/storage";
import {
  INTENSITIES,
  type Intensity,
  type RoastErrorCode,
  type RoastResult,
  type RoastStep,
} from "@/lib/types";
import { DebugPanel } from "./DebugPanel";
import { LoadingScreen } from "./LoadingScreen";
import { RoastError } from "./RoastError";
import { RoastResults } from "./RoastResults";

type State =
  | { status: "loading"; step: RoastStep | null }
  | { status: "done"; result: RoastResult }
  | { status: "error"; code: RoastErrorCode };

const ERROR_CODES: RoastErrorCode[] = [
  "empty",
  "scope",
  "no_channel",
  "rate_limited",
  "daily_limit",
  "auth",
  "unknown",
];

function parseIntensity(value: string | null): Intensity {
  return INTENSITIES.includes(value as Intensity) ? (value as Intensity) : "toasty";
}

export function RoastExperience({ viewerKey, demo }: { viewerKey: string; demo: boolean }) {
  const params = useSearchParams();
  const mockParam = params.get("mock");
  const mock = demo && ERROR_CODES.includes(mockParam as RoastErrorCode) ? (mockParam as RoastErrorCode) : undefined;
  const debug = process.env.NODE_ENV !== "production" && params.get("debug") === "1";
  const withTakeout = params.get("takeout") === "1";

  const [state, setState] = useState<State>({ status: "loading", step: null });
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [run, setRun] = useState<{ id: number; intensity: Intensity; useCache: boolean }>(() => ({
    id: 0,
    intensity: parseIntensity(params.get("intensity")),
    // A Takeout roast, a forced error or a debug run always starts fresh.
    useCache: !params.has("fresh") && !mock && !withTakeout && !debug,
  }));
  const lastIntensity = useRef(run.intensity);

  useEffect(() => {
    const controller = new AbortController();

    async function go() {
      if (run.useCache) {
        const cached = readCachedRoast(viewerKey);
        if (cached) {
          setState({ status: "done", result: cached });
          return;
        }
      }
      setState({ status: "loading", step: null });
      setDebugInfo(null);
      const takeoutDigest = withTakeout ? (loadTakeoutDigest() ?? undefined) : undefined;
      try {
        for await (const event of streamRoast(
          { intensity: run.intensity, takeoutDigest, debug: debug || undefined, mock },
          controller.signal,
        )) {
          if (event.type === "step") setState({ status: "loading", step: event.step });
          else if (event.type === "debug") setDebugInfo(event);
          else if (event.type === "error") setState({ status: "error", code: event.code });
          else {
            writeCachedRoast(viewerKey, event.result);
            setState({ status: "done", result: event.result });
          }
        }
      } catch (err) {
        if (controller.signal.aborted) return;
        console.error(err);
        setState({ status: "error", code: "unknown" });
      }
    }

    void go();
    return () => controller.abort();
  }, [run, mock, debug, withTakeout, viewerKey]);

  const roastAgain = useCallback((intensity: Intensity) => {
    lastIntensity.current = intensity;
    window.scrollTo({ top: 0 });
    setRun((r) => ({ id: r.id + 1, intensity, useCache: false }));
  }, []);

  const view =
    state.status === "done" ? (
      <RoastResults key={state.result.createdAt} result={state.result} onRoastAgain={roastAgain} />
    ) : state.status === "error" ? (
      <RoastError code={state.code} onRetry={() => roastAgain(lastIntensity.current)} />
    ) : (
      <LoadingScreen step={state.step} />
    );

  return (
    <>
      {demo && (
        <p className="mb-3 rounded-full bg-card px-4 py-2 text-center text-xs text-muted">
          Demo mode: showing a sample roast. Add Google and Gemini keys to roast real accounts.
        </p>
      )}
      {view}
      {debugInfo && <DebugPanel info={debugInfo} />}
    </>
  );
}
