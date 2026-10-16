import type { ReactNode } from "react";
import { Crispy } from "@/components/crispy/Crispy";
import { PlatformIcon, type Platform } from "@/components/share/PlatformIcon";
import { ToastSticker } from "@/components/stickers/Stickers";
import { DONENESS_GRADIENT } from "@/lib/doneness";
import { FlagGlyph } from "./MiniRoastCard";

function Tile({
  caption,
  className = "",
  children,
}: {
  caption: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={`card relative flex min-h-[15rem] flex-col overflow-hidden p-6 ${className}`}>
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      <p className="mt-5 text-center font-rounded text-[1.0625rem] font-semibold">{caption}</p>
    </li>
  );
}

const PLATFORMS: Platform[] = ["x", "whatsapp", "instagram", "discord", "slack", "telegram"];

export function Showcase() {
  return (
    <section aria-labelledby="showcase-title" className="mx-auto max-w-6xl px-5 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-2xl text-center">
        <h2 id="showcase-title" className="text-h2 font-semibold text-balance">
          One page. Every bad habit.
        </h2>
        <p className="mt-4 text-lg text-muted text-balance">
          Your roast fits on a single screen, so it fits in a single screenshot. These are examples.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 md:grid-cols-3">
        <Tile caption="The roast, up top" className="md:col-span-2">
          <div className="flex items-center gap-6">
            <blockquote className="flex-1 text-[1.6rem] leading-[1.15] font-semibold tracking-[-0.025em] md:text-[2.1rem]">
              “Your algorithm isn&apos;t broken. It&apos;s just tired of you.”
            </blockquote>
            <Crispy expression="cackling" size={150} sticker className="hidden h-auto w-[8.5rem] shrink-0 sm:block" />
          </div>
        </Tile>

        <Tile caption="Brainrot score, in toast">
          <div className="flex items-end gap-3">
            <p className="text-[3.5rem] leading-none font-bold tracking-[-0.045em]">57</p>
            <p className="pb-1.5 text-muted">/100 · Golden</p>
            <ToastSticker className="ml-auto w-14 rotate-6" />
          </div>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-card-3">
            <div className="h-full rounded-full" style={{ width: "57%", background: DONENESS_GRADIENT }} />
          </div>
        </Tile>

        <Tile caption="Red flags, with receipts">
          <ul className="grid gap-3 text-[0.9375rem]">
            <li className="flex gap-2.5">
              <FlagGlyph />
              <span>
                <span className="font-semibold">Recipes you&apos;ll never cook</span>
                <span className="block text-sm text-muted">31 liked. The pan is spotless.</span>
              </span>
            </li>
            <li className="flex gap-2.5">
              <FlagGlyph />
              <span>
                <span className="font-semibold">Three channels, on repeat</span>
                <span className="block text-sm text-muted">38% of your likes.</span>
              </span>
            </li>
          </ul>
        </Tile>

        <Tile caption="Your TV name">
          <p className="text-center text-[1.6rem] leading-tight font-semibold tracking-[-0.02em] text-balance">
            The 2am Documentary Tourist
          </p>
          <p className="mt-2 text-center text-sm text-muted text-balance">
            Curious about everything, committed to nothing.
          </p>
        </Tile>

        <Tile caption="Crispy's advice">
          <p className="text-center text-[1.2rem] leading-snug font-medium text-balance">
            “Cook one of the 31 recipes. Any of them. The pan misses you.”
          </p>
        </Tile>

        <Tile caption="Share anywhere. The image re-lays itself for each app." className="md:col-span-2">
          <ul className="flex flex-wrap items-center justify-center gap-3">
            {PLATFORMS.map((p) => (
              <li key={p} className="grid h-14 w-14 place-items-center rounded-2xl bg-card-2 ring-1 ring-white/10">
                <PlatformIcon platform={p} size={26} />
              </li>
            ))}
          </ul>
        </Tile>

        <Tile caption="Two heat levels">
          <div className="mx-auto inline-flex rounded-full bg-card-2 p-1 font-rounded font-bold">
            <span className="rounded-full px-4 py-2 text-muted">Toasty</span>
            <span className="rounded-full bg-flame px-4 py-2 text-ink">Extra crispy</span>
          </div>
          <p className="mt-3 text-center text-sm text-muted">Extra crispy is not for the sensitive.</p>
        </Tile>
      </ul>
    </section>
  );
}
