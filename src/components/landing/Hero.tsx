import { Suspense } from "react";
import { StaticSignInForm } from "@/components/auth/SignInForm";
import { SignInNotice } from "@/components/auth/SignInNotice";
import { RoastLinkOrSignIn } from "@/components/auth/SessionLinks";
import { CrispyTile } from "@/components/brand/CrispyMark";
import { Crispy } from "@/components/crispy/Crispy";
import {
  EyesSticker,
  FlameSticker,
  PopcornSticker,
  RemoteSticker,
  ToastSticker,
  WordSticker,
} from "@/components/stickers/Stickers";
import { MiniRoastCard } from "./MiniRoastCard";

const NOTIFICATIONS = [
  { time: "now", text: "You've liked 214 productivity videos and finished none of them." },
  { time: "2m ago", text: "Nine cooking channels. Dinner is still cereal." },
  { time: "3:12am", text: "Watching a man review gas station sandwiches isn't a personality." },
];

function Notification({ time, text }: { time: string; text: string }) {
  return (
    <li className="flex gap-3 rounded-[1.375rem] bg-[#1c1c1e]/90 p-3.5 shadow-[0_24px_48px_rgba(0,0,0,.55)] ring-1 ring-white/10 backdrop-blur-xl">
      <CrispyTile size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[0.9375rem] font-semibold">Crispy</p>
          <p className="text-xs text-muted">{time}</p>
        </div>
        <p className="mt-0.5 text-[0.9375rem] leading-snug text-white/80">{text}</p>
      </div>
    </li>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-x-clip">
      <div className="relative mx-auto max-w-4xl px-5 pt-14 text-center md:pt-24">
        <ToastSticker className="animate-float pointer-events-none absolute top-6 -left-24 hidden w-14 -rotate-12 [animation-delay:-3s] xl:block" />
        <h1 id="hero-title" className="text-h1 font-semibold text-balance">
          Your YouTube taste, roasted by a TV that&apos;s seen too much
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted text-balance">
          Crispy reads your likes and subscriptions, then says what your friends are too polite to.
        </p>
        <Suspense fallback={null}>
          <SignInNotice />
        </Suspense>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Suspense fallback={<StaticSignInForm />}>
            <RoastLinkOrSignIn />
          </Suspense>
          <p className="font-rounded text-sm font-semibold text-muted">Read-only. Your data is never saved.</p>
        </div>
      </div>

      {/* The stage: Crispy in the middle, example roasts arriving as notifications. */}
      <div className="relative mx-auto mt-14 max-w-6xl px-5 md:mt-16 md:px-10 lg:h-[34rem]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <EyesSticker className="animate-float absolute top-28 -left-7 w-20 -rotate-12 md:top-6 md:-left-4 md:w-24 lg:top-auto lg:bottom-28 lg:-left-10" />
          <RemoteSticker className="animate-float absolute top-48 -right-3 w-10 rotate-[18deg] [animation-delay:-1s] md:w-12 lg:top-0 lg:-right-8" />
          <PopcornSticker className="animate-float absolute -bottom-8 left-6 hidden w-20 -rotate-12 [animation-delay:-4s] lg:block" />
          <span className="absolute right-[33%] bottom-0 hidden lg:block">
            <WordSticker tone="toaster" rotate={-7}>
              Touch grass
            </WordSticker>
          </span>
        </div>

        <div className="relative mx-auto w-[15.5rem] sm:w-[19rem] lg:absolute lg:top-0 lg:left-1/2 lg:w-[21rem] lg:-translate-x-1/2">
          <Crispy
            expression="smug"
            size={340}
            mic
            sticker
            title="Crispy, a cartoon TV with a flaming antenna, holding a microphone"
            className="h-auto w-full"
          />
          <p className="absolute -top-10 -right-3 w-max max-w-[9.5rem] rotate-[5deg] rounded-[1.25rem] border-[3px] border-ink bg-paper px-3 py-2 font-rounded text-sm leading-tight font-extrabold text-ink shadow-[0_0_0_4px_var(--paper)] sm:-right-10 sm:max-w-[10.5rem] lg:-top-6 lg:-right-24 lg:max-w-[12rem] lg:text-base">
            Show me your likes. I already hate them.
          </p>
          <span aria-hidden="true" className="absolute bottom-6 -left-8 sm:hidden">
            <WordSticker tone="bubblegum" rotate={-9} className="text-sm">
              Still watching?
            </WordSticker>
          </span>
        </div>

        <div className="relative mt-12 lg:absolute lg:top-10 lg:left-10 lg:mt-0 lg:w-[22rem]">
          <p className="mb-3 flex items-center gap-1.5 px-1 text-sm font-medium text-muted">
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path d="M8 1.5c2.6 2 4 4.2 4 6.6A4 4 0 0 1 4 8.1c0-1 .4-1.9 1-2.6.2 1 .8 1.6 1.5 1.8C6.3 5 6.9 3.2 8 1.5Z" fill="var(--flame)" />
            </svg>
            Example roasts
          </p>
          <ul className="grid gap-2.5">
            {NOTIFICATIONS.map((n) => (
              <Notification key={n.text} {...n} />
            ))}
          </ul>
        </div>

        <div className="relative mt-12 hidden justify-center sm:flex lg:absolute lg:top-24 lg:right-10 lg:mt-0 lg:block">
          <div className="relative">
            <FlameSticker className="absolute -right-12 -bottom-16 w-32 rotate-12 lg:-right-14 lg:w-40" />
            <MiniRoastCard className="relative" />
            <span aria-hidden="true" className="absolute -top-5 -right-7">
              <WordSticker tone="bubblegum" rotate={9}>
                Still watching?
              </WordSticker>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
