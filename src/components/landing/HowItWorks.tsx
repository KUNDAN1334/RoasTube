import { Crispy } from "@/components/crispy/Crispy";
import { WordSticker } from "@/components/stickers/Stickers";
import type { ReactNode } from "react";

function Step({ n, caption, children }: { n: number; caption: string; children: ReactNode }) {
  return (
    <li className="card relative flex min-h-[21rem] flex-col overflow-hidden">
      <span className="absolute top-5 left-5 grid h-8 w-8 place-items-center rounded-full bg-card-3 font-rounded text-sm font-extrabold">
        {n}
      </span>
      <div className="relative flex flex-1 items-center justify-center px-6 pt-12 pb-2">{children}</div>
      <p className="px-6 pb-7 text-center font-rounded text-[1.0625rem] font-semibold text-balance">
        <span className="sr-only">Step {n}: </span>
        {caption}
      </p>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="mx-auto max-w-6xl scroll-mt-8 px-5 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="how-title" className="text-h2 font-semibold text-balance">
          Three steps. Zero dignity.
        </h2>
        <p className="mt-4 text-lg text-muted text-balance">
          Takes about twenty seconds. Recovering takes longer.
        </p>
      </div>

      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        <Step n={1} caption="Sign in with Google. Read-only, so Crispy can look but never touch.">
          <div className="w-full max-w-[15rem] rounded-[1.25rem] bg-card-2 p-4 ring-1 ring-white/10">
            <p className="text-xs text-muted">Roastube wants to</p>
            <p className="mt-1 text-[0.9375rem] font-semibold">View your YouTube account</p>
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-card-3 px-3 py-2 text-sm">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <rect x="3" y="7" width="10" height="7.5" rx="2" fill="var(--toaster)" />
                <path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" fill="none" stroke="var(--toaster)" strokeWidth="1.6" />
              </svg>
              Read-only access
            </div>
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-card-3 px-3 py-2 text-sm text-muted">
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Can&apos;t post or delete
            </div>
          </div>
        </Step>

        <Step n={2} caption="Crispy goes through your likes, subscriptions and playlists. Slowly.">
          <Crispy expression="judging" size={170} sticker className="h-auto w-[9.5rem]" />
          <WordSticker tone="toaster" rotate={-8} className="absolute top-14 left-6 text-sm">
            41 cat videos
          </WordSticker>
          <WordSticker tone="bubblegum" rotate={7} className="absolute right-5 bottom-6 text-sm">
            3am again
          </WordSticker>
        </Step>

        <Step n={3} caption="You get roasted. Then you share it and pretend it doesn't hurt.">
          <Crispy expression="crying-laughing" size={170} sticker className="h-auto w-[9.5rem]" />
          <WordSticker tone="flame" rotate={-6} className="absolute right-6 top-14 text-sm">
            89/100
          </WordSticker>
        </Step>
      </ol>
    </section>
  );
}
