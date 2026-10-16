"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Crispy } from "@/components/crispy/Crispy";
import { readTakeout, type TakeoutReadResult } from "@/lib/takeout/read";
import type { TakeoutDigest } from "@/lib/takeout/schema";
import { saveTakeoutDigest } from "@/lib/takeout/storage";

type State =
  | { status: "idle" }
  | { status: "reading" }
  | { status: "ready"; digest: TakeoutDigest; found: Extract<TakeoutReadResult, { ok: true }>["found"] }
  | { status: "error"; message: string };

const ERRORS = {
  html: "Those are the HTML versions. Export history as JSON (step 4) and drop those instead.",
  nothing: "I couldn't find watch or search history in there. Look for watch-history.json inside YouTube and YouTube Music → history.",
  unreadable: "That file wouldn't open. If it's a zip, try unzipping it first and dropping the history files.",
};

const pct = (x: number) => `${Math.round(x * 100)}%`;

/**
 * Drop zone for Google Takeout files or the whole zip. Files are read here in the browser
 * and only a short summary is kept, then handed to /roast in this tab's session storage.
 */
export function DropZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [state, setState] = useState<State>({ status: "idle" });

  async function take(list: FileList | null) {
    if (!list?.length) return;
    setState({ status: "reading" });
    const result = await readTakeout(Array.from(list));
    if (!result.ok) {
      setState({ status: "error", message: ERRORS[result.reason] });
      return;
    }
    setState({ status: "ready", digest: result.digest, found: result.found });
  }

  function roast(digest: TakeoutDigest) {
    if (!saveTakeoutDigest(digest)) {
      setState({ status: "error", message: "Your browser blocked session storage, so I can't carry this to the roast. Try a normal window." });
      return;
    }
    router.push("/roast?takeout=1&intensity=extra_crispy&fresh=1");
  }

  const reading = state.status === "reading";

  return (
    <div className="flex h-full flex-col gap-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void take(e.dataTransfer.files);
        }}
        className={`card flex flex-1 flex-col items-center justify-center gap-4 border-2 border-dashed px-6 py-12 text-center transition-colors ${
          dragging ? "border-flame bg-card-2" : "border-white/15"
        }`}
      >
        <Crispy
          expression={reading ? "asleep" : dragging ? "shocked" : "judging"}
          size={150}
          sticker
          className="h-auto w-[120px] md:w-[140px]"
        />
        <p className="text-[1.375rem] font-semibold tracking-[-0.02em]">
          {reading ? "Reading your history…" : dragging ? "Let go. I'm ready." : "Drop your Takeout files here"}
        </p>
        <p className="max-w-sm text-sm text-muted">
          The whole Takeout <code className="rounded bg-card-3 px-1.5 py-0.5 text-text">.zip</code>, or{" "}
          <code className="rounded bg-card-3 px-1.5 py-0.5 text-text">watch-history.json</code>,{" "}
          <code className="rounded bg-card-3 px-1.5 py-0.5 text-text">search-history.json</code> and your comments file.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".zip,.json,.csv,application/zip,application/json,text/csv"
          className="sr-only"
          onChange={(e) => void take(e.target.files)}
        />
        <button type="button" className="btn btn-light" disabled={reading} onClick={() => inputRef.current?.click()}>
          Choose files
        </button>
      </div>

      <div aria-live="polite">
        {state.status === "error" && (
          <p role="alert" className="card p-5 text-sm text-white/85 ring-1 ring-flame/60">
            {state.message}
          </p>
        )}

        {state.status === "ready" && (
          <div className="card p-6">
            <h3 className="font-semibold">Here&apos;s what I found</h3>
            <ul className="mt-3 grid gap-2 text-sm text-white/85">
              {state.found.watch && (
                <li>
                  {state.digest.watchCount.toLocaleString()} videos watched
                  {state.digest.firstWatched ? ` since ${state.digest.firstWatched}` : ""}
                </li>
              )}
              {state.digest.lateNightShare != null && state.found.watch && (
                <li>{pct(state.digest.lateNightShare)} of it between midnight and 4am</li>
              )}
              {state.digest.topChannels[0] && (
                <li>
                  Most watched: {state.digest.topChannels[0].name} ({state.digest.topChannels[0].count.toLocaleString()} times)
                </li>
              )}
              {state.found.search && <li>{state.digest.searchCount.toLocaleString()} searches</li>}
              {state.found.comments && <li>{state.digest.commentCount.toLocaleString()} comments</li>}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Your files stayed on this device. Only this summary and a sample of titles will be sent.
            </p>
            <button type="button" className="btn btn-flame mt-5" onClick={() => roast(state.digest)}>
              Roast me with my full history
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
