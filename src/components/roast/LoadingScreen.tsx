"use client";

import { Crispy } from "@/components/crispy/Crispy";
import { ROAST_STEPS, type RoastStep } from "@/lib/types";

const STEP_COPY: Record<RoastStep, { label: string; line: string }> = {
  likes: {
    label: "Fetching likes",
    line: "Counting your liked videos. Slowly. Judgmentally.",
  },
  subscriptions: {
    label: "Fetching subscriptions",
    line: "Reading your subscriptions out loud to the crew.",
  },
  digest: {
    label: "Building digest",
    line: "Looking for patterns. Found several. None good.",
  },
  gemini: {
    label: "Writing your roast",
    line: "Writing your roast. It's getting long.",
  },
};

export function LoadingScreen({ step }: { step: RoastStep | null }) {
  const activeIndex = step ? ROAST_STEPS.indexOf(step) : -1;
  // Finished steps plus half of the current one, so the bar never claims to be done early.
  const progress = Math.round(((Math.max(activeIndex, 0) + 0.5) / ROAST_STEPS.length) * 100);
  const current = step ? STEP_COPY[step] : null;

  return (
    <section
      aria-labelledby="loading-title"
      className="mx-auto flex w-full max-w-lg flex-col items-center pt-10 pb-20 text-center md:pt-16"
    >
      <Crispy expression="asleep" size={220} sticker className="h-auto w-[180px] md:w-[210px]" />
      <h1 id="loading-title" className="mt-8 text-[2rem] font-semibold tracking-[-0.03em]">
        Flipping channels…
      </h1>
      <p aria-live="polite" className="mt-2 min-h-[3em] text-lg text-muted text-balance">
        {current?.line ?? "Warming up the tubes."}
      </p>

      <div
        role="progressbar"
        aria-label="Roast progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        aria-valuetext={current?.label ?? "Starting"}
        className="mt-6 h-2 w-full overflow-hidden rounded-full bg-card-3"
      >
        <div
          className="h-full rounded-full bg-flame transition-[width] duration-700 ease-out motion-reduce:transition-none"
          style={{ width: `${progress}%` }}
        />
      </div>

      <ol className="mt-8 grid w-full gap-1 rounded-[1.5rem] bg-card p-3 text-left">
        {ROAST_STEPS.map((s, i) => {
          const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
          return (
            <li
              key={s}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-medium ${
                state === "active" ? "bg-card-2" : ""
              } ${state === "pending" ? "text-muted" : ""}`}
            >
              <StepMark state={state} />
              <span>{STEP_COPY[s].label}</span>
              <span className="sr-only">
                {state === "done" ? "(done)" : state === "active" ? "(in progress)" : "(waiting)"}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function StepMark({ state }: { state: "done" | "active" | "pending" }) {
  if (state === "done") {
    return (
      <span aria-hidden="true" className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-flame">
        <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
          <path d="M3 8.5 L6.5 12 L13 4.5" fill="none" stroke="var(--ink)" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span aria-hidden="true" className="relative grid h-6 w-6 shrink-0 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-flame/40 motion-reduce:animate-none" />
        <span className="h-3 w-3 rounded-full bg-flame" />
      </span>
    );
  }
  return <span aria-hidden="true" className="h-6 w-6 shrink-0 rounded-full border-2 border-white/25" />;
}
