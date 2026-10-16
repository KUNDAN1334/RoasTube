"use client";

import { useEffect, useId, useRef, useState } from "react";
import { bandForScore, DONENESS_BANDS } from "@/lib/doneness";

/**
 * A "?" next to the score that flips the score card to a short explanation of what
 * the number means and how it's worked out.
 */
export function ScoreExplainer({ score }: { score: number }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const current = bandForScore(score).name;

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label="What does the brainrot score mean?"
        onClick={() => setOpen(true)}
        className="grid h-5 w-5 place-items-center rounded-full bg-card-3 font-rounded text-[0.75rem] leading-none font-extrabold text-text hover:bg-white/20 focus-visible:rounded-full"
      >
        ?
      </button>

      <div
        id={panelId}
        role="region"
        aria-label="About the brainrot score"
        hidden={!open}
        className="absolute inset-0 z-10 overflow-y-auto rounded-[inherit] bg-card p-5 md:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold">What the score means</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close explanation"
            className="-mt-1 -mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-card-3 hover:bg-white/15"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[0.8125rem] leading-snug text-white/80">
          How much of your feed is junk food, from 0 to 100. Higher is worse. It&apos;s worked out from your
          data: short videos, late-night watching, the share of entertainment, gaming and comedy, and how stuck
          you are on a few channels. Crispy can nudge it 10 points either way, with a reason.
        </p>
        <ul className="mt-2.5 grid gap-0.5 text-[0.8125rem]">
          {DONENESS_BANDS.map((b) => (
            <li
              key={b.name}
              aria-current={b.name === current ? "true" : undefined}
              className={`flex items-center gap-2.5 rounded-lg px-2 py-[3px] ${b.name === current ? "bg-card-3 font-semibold" : "text-white/75"}`}
            >
              <span aria-hidden="true" className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/30" style={{ background: b.fill }} />
              <span className="flex-1">{b.name}</span>
              <span className="tabular-nums">
                {b.min}–{b.max}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
