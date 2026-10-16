"use client";

import Link from "next/link";
import { StaticSignInForm } from "@/components/auth/SignInForm";
import { Crispy, type CrispyExpression } from "@/components/crispy/Crispy";
import type { RoastErrorCode } from "@/lib/types";

type Copy = {
  expression: CrispyExpression;
  title: string;
  body: string;
  actions: ("nuclear" | "retry" | "signin" | "home")[];
};

const COPY: Record<RoastErrorCode, Copy> = {
  empty: {
    expression: "shocked",
    title: "You've liked nothing. Somehow that's the biggest red flag of all.",
    body: "This account has no liked videos or subscriptions for me to read. Like a few videos and come back, or bring your full watch history with nuclear mode.",
    actions: ["nuclear", "retry"],
  },
  scope: {
    expression: "shocked",
    title: "You signed in but didn't let me see your YouTube.",
    body: "On Google's sign-in screen, the box for viewing your YouTube account was unticked. Sign in again and leave it ticked. It's read-only: I can look, I can't touch.",
    actions: ["signin"],
  },
  no_channel: {
    expression: "judging",
    title: "This account doesn't have a YouTube channel.",
    body: "Brand accounts and accounts without a channel don't have likes or subscriptions I can read. Sign in with the account you actually watch on, or use nuclear mode with a Google Takeout export.",
    actions: ["signin", "nuclear"],
  },
  rate_limited: {
    expression: "asleep",
    title: "The roast oven is full. Try again in a few minutes.",
    body: "Too many people are getting roasted right now. Nothing was saved, so just come back shortly and run it again.",
    actions: ["retry"],
  },
  daily_limit: {
    expression: "asleep",
    title: "That's three roasts today. The oven needs to cool down.",
    body: "Each account gets three roasts a day. Your last roast is still saved in this browser until then.",
    actions: ["home"],
  },
  auth: {
    expression: "judging",
    title: "I lost the signal to your account.",
    body: "Your Google sign-in expired or access was revoked. Sign in again to give me read-only access to your likes and subscriptions.",
    actions: ["signin"],
  },
  unknown: {
    expression: "asleep",
    title: "Something broke, and for once it wasn't your taste.",
    body: "The roast didn't finish. Try again. If it keeps happening, give it a few minutes.",
    actions: ["retry"],
  },
};

export function RoastError({ code, onRetry }: { code: RoastErrorCode; onRetry: () => void }) {
  const copy = COPY[code];
  return (
    <section
      aria-labelledby="error-title"
      className="mx-auto flex w-full max-w-2xl flex-col items-center pt-10 pb-20 text-center md:pt-16"
    >
      <Crispy expression={copy.expression} size={220} sticker className="h-auto w-[170px] md:w-[210px]" />
      <h1 id="error-title" className="mt-8 text-[1.75rem] leading-[1.12] font-semibold tracking-[-0.03em] text-balance md:text-[2.25rem]">
        {copy.title}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-muted">{copy.body}</p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        {copy.actions.map((action, i) => {
          const variant = i === 0 ? "btn-flame" : "btn-ghost";
          switch (action) {
            case "nuclear":
              return (
                <Link key={action} href="/nuclear" className={`btn ${variant}`}>
                  Go nuclear with your full history
                </Link>
              );
            case "retry":
              return (
                <button key={action} type="button" className={`btn ${variant}`} onClick={onRetry}>
                  Try again
                </button>
              );
            case "home":
              return (
                <Link key={action} href="/" className={`btn ${variant}`}>
                  Back to the start
                </Link>
              );
            case "signin":
              return <StaticSignInForm key={action} next="/roast?fresh=1" />;
          }
        })}
      </div>
    </section>
  );
}
