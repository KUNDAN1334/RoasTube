"use client";

import { motion, useReducedMotion } from "motion/react";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { Crispy, expressionForScore } from "@/components/crispy/Crispy";
import { clampScore } from "@/lib/doneness";
import type { RoastResult } from "@/lib/types";
import { bandLabel, DonenessBar, FlagGlyph, IntensityChip, SeverityFlames } from "./bits";
import { ScoreExplainer } from "./ScoreExplainer";

/**
 * The whole roast on one screen: main roast first, then the score, red flags,
 * nickname and advice. Built to be screenshotted.
 */
export function RoastBoard({
  result,
  avatarChoice,
  revealed,
}: {
  result: RoastResult;
  avatarChoice: string;
  /** False until the CRT turn-on finishes, so Crispy can pop in after it. */
  revealed: boolean;
}) {
  const reduce = useReducedMotion();
  const { roast, profile } = result;
  const score = clampScore(roast.brainrotScore);
  const owner = profile.name ? `${profile.name}'s roast` : "Your roast";

  return (
    <article aria-labelledby="verdict" className="grid gap-3 md:grid-cols-2 lg:grid-cols-12">
      <section className="card p-5 md:col-span-2 md:p-7 lg:col-span-8">
        <div className="flex items-center gap-3">
          <UserAvatar choice={avatarChoice} photo={profile.avatar} size={38} />
          <p className="font-semibold">{owner}</p>
          <span className="ml-auto">
            <IntensityChip intensity={result.intensity} />
          </span>
        </div>
        <h1
          id="verdict"
          className="mt-4 text-[1.625rem] leading-[1.1] font-semibold tracking-[-0.03em] text-balance md:mt-5 md:text-[2.25rem] md:leading-[1.07]"
        >
          {roast.verdict}
        </h1>
        <p className="mt-3 max-w-[64ch] text-[0.9375rem] text-white/75 md:mt-4 md:text-[1.0625rem]">{roast.roast}</p>
      </section>

      <section
        aria-labelledby="score-title"
        className="card relative flex flex-col p-5 md:p-6 lg:col-span-4"
        style={{ backgroundImage: "radial-gradient(circle at 85% 15%, rgba(255,90,31,.2), transparent 55%)" }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 id="score-title" className="text-sm font-semibold text-muted">
                Brainrot score
              </h2>
              <ScoreExplainer score={score} />
            </div>
            <p className="mt-2 flex items-end gap-1.5">
              <span className="text-[3.5rem] leading-[0.88] font-bold tracking-[-0.05em] md:text-[4rem]">{score}</span>
              <span className="pb-0.5 text-muted">/100</span>
            </p>
            <p className="mt-2 text-lg leading-none font-semibold">{bandLabel(score)}</p>
          </div>
          <motion.div
            className="-mt-1 -mr-1 w-[5.75rem] shrink-0 md:w-[6.75rem]"
            initial={reduce ? false : { scale: 0.6, rotate: -10, opacity: 0 }}
            animate={revealed ? { scale: 1, rotate: 0, opacity: 1 } : undefined}
            transition={{ type: "spring", stiffness: 380, damping: 15 }}
          >
            <Crispy expression={expressionForScore(score)} size={110} sticker className="h-auto w-full" />
          </motion.div>
        </div>
        <div className="mt-4">
          <DonenessBar score={score} />
        </div>
        <p className="mt-2.5 text-sm text-muted">{roast.brainrotReason}</p>
        {result.exhibits.length > 0 && (
          <ul aria-label="Receipts" className="mt-4 grid gap-1.5 border-t border-line pt-4 text-[0.8125rem] text-white/80 lg:mt-auto">
            {result.exhibits.slice(0, 3).map((e) => (
              <li key={e} className="flex gap-2">
                <span aria-hidden="true" className="mt-[0.45em] h-1.5 w-1.5 shrink-0 rounded-full bg-flame" />
                {e}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="flags-title" className="card p-5 md:p-6 lg:col-span-5">
        <h2 id="flags-title" className="text-sm font-semibold text-muted">
          Red flags
        </h2>
        <ul className="mt-3.5 grid gap-3.5">
          {roast.redFlags.slice(0, 3).map((flag) => (
            <li key={flag.title} className="flex gap-3">
              <span className="pt-0.5">
                <FlagGlyph />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="leading-snug font-semibold">{flag.title}</p>
                  <SeverityFlames severity={flag.severity} />
                </div>
                <p className="mt-0.5 text-sm text-muted">{flag.evidence}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="name-title" className="card p-5 md:p-6 lg:col-span-4">
        <h2 id="name-title" className="text-sm font-semibold text-muted">
          Your TV name
        </h2>
        <p className="mt-2.5 text-[1.5rem] leading-[1.1] font-semibold tracking-[-0.025em] text-balance text-toaster">
          {roast.nickname}
        </p>
        <p className="mt-2.5 text-[0.9375rem] text-white/75">{roast.personality}</p>
      </section>

      <section aria-labelledby="advice-title" className="rounded-[1.75rem] bg-flame p-5 text-ink md:p-6 lg:col-span-3">
        <h2 id="advice-title" className="text-sm font-bold">
          Crispy&apos;s advice
        </h2>
        <p className="mt-2.5 text-[1.0625rem] leading-snug font-semibold">{roast.advice}</p>
      </section>
    </article>
  );
}
