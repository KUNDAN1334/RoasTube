import type { CSSProperties, Ref } from "react";
import { UserAvatar } from "@/components/avatars/UserAvatar";
import { CrispyMark } from "@/components/brand/CrispyMark";
import { Crispy, expressionForScore } from "@/components/crispy/Crispy";
import { bandForScore, clampScore, DONENESS_GRADIENT } from "@/lib/doneness";
import { INTENSITY_LABEL, type RoastResult } from "@/lib/types";

export type ShareFormat = "story" | "square" | "wide";

export const SHARE_SIZES: Record<ShareFormat, { width: number; height: number; label: string }> = {
  story: { width: 1080, height: 1920, label: "Story" },
  square: { width: 1080, height: 1080, label: "Square" },
  wide: { width: 1200, height: 675, label: "Wide" },
};

const FLAME =
  "M10 22C3 22 1 16 3 11C5 7 8 6 8 1C12 4 14 8 13 11C15 10 16 8 16 6C19 10 19 16 16 19C14 21 12 22 10 22Z";

/** Long verdicts get smaller type so they never spill. */
function fit(text: string, base: number) {
  if (text.length <= 55) return base;
  if (text.length <= 85) return Math.round(base * 0.86);
  return Math.round(base * 0.74);
}

type Props = {
  result: RoastResult;
  format: ShareFormat;
  avatarChoice: string;
  /** Public host to print on the card; null on local and dev hosts. */
  siteHost: string | null;
  ref?: Ref<HTMLDivElement>;
};

/**
 * The image people post. Rendered at full size and captured to PNG in the browser.
 * Sizes are literal pixels because each canvas is fixed.
 */
export function ShareCard({ result, format, avatarChoice, siteHost, ref }: Props) {
  const { width, height } = SHARE_SIZES[format];
  const { roast, profile } = result;
  const score = clampScore(roast.brainrotScore);
  const band = bandForScore(score).name;
  const owner = profile.name ? `${profile.name}'s roast` : "My roast";
  const hot = result.intensity === "extra_crispy";

  const chip = (px: number) => (
    <span
      className="inline-flex items-center rounded-full font-rounded font-extrabold text-ink"
      style={{
        background: hot ? "var(--flame)" : "var(--toaster)",
        fontSize: px,
        padding: `${px * 0.35}px ${px * 0.75}px`,
        gap: px * 0.3,
      }}
    >
      <svg viewBox="0 0 20 24" style={{ width: px * 0.8, height: px }} aria-hidden="true">
        <path d={FLAME} fill="var(--ink)" />
      </svg>
      {INTENSITY_LABEL[result.intensity]}
    </span>
  );

  const header = (avatar: number, px: number) => (
    <div className="flex items-center" style={{ gap: px * 0.6 }}>
      <UserAvatar choice={avatarChoice} photo={profile.avatar} size={avatar} />
      <span className="font-semibold" style={{ fontSize: px, letterSpacing: "-0.02em" }}>
        {owner}
      </span>
      <span style={{ marginLeft: "auto" }}>{chip(px * 0.72)}</span>
    </div>
  );

  // Narrow cards stack the band under the number; the story card has room to put it inline.
  const scoreBlock = (num: number, sub: number, bar: number, inlineBand = false) => (
    <div>
      <div className="flex items-end" style={{ gap: sub * 0.4 }}>
        <span className="font-bold" style={{ fontSize: num, lineHeight: 0.85, letterSpacing: "-0.05em" }}>
          {score}
        </span>
        <span style={{ fontSize: sub, color: "var(--muted)", paddingBottom: sub * 0.15 }}>/100</span>
        {inlineBand && (
          <span className="font-semibold" style={{ fontSize: sub * 1.2, marginLeft: sub * 0.5, paddingBottom: sub * 0.1 }}>
            {band}
          </span>
        )}
      </div>
      {!inlineBand && (
        <p className="font-semibold" style={{ fontSize: sub * 1.15, marginTop: sub * 0.5 }}>
          {band}
        </p>
      )}
      <div className="overflow-hidden rounded-full bg-card-3" style={{ height: bar, marginTop: bar * 1.4 }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${score}%`,
            backgroundImage: DONENESS_GRADIENT,
            backgroundSize: `${(100 / Math.max(score, 1)) * 100}% 100%`,
          }}
        />
      </div>
    </div>
  );

  const flags = (px: number, count: number) => (
    <ul className="flex flex-col" style={{ gap: px * 0.55 }}>
      {roast.redFlags.slice(0, count).map((f) => (
        <li key={f.title} className="flex items-center font-semibold" style={{ gap: px * 0.5, fontSize: px, lineHeight: 1.2 }}>
          <svg viewBox="0 0 16 16" style={{ width: px, height: px, flexShrink: 0 }} aria-hidden="true">
            <path d="M3 15V1.5" stroke="#fff" strokeWidth={1.8} strokeLinecap="round" />
            <path d="M3.5 2.2Q8 0.6 13 2.4L11 6.2L13 10Q8 8.4 3.5 10Z" fill="var(--flame)" />
          </svg>
          {f.title}
        </li>
      ))}
    </ul>
  );

  const footer = (px: number) => (
    <div className="flex items-center justify-between" style={{ fontSize: px }}>
      <span className="flex items-center font-semibold" style={{ gap: px * 0.45 }}>
        <span
          className="grid place-items-center"
          style={{ width: px * 1.9, height: px * 1.9, borderRadius: px * 0.55, background: "#1a1a1a" }}
        >
          <CrispyMark size={px * 1.5} />
        </span>
        Roastube
      </span>
      <span style={{ color: "var(--muted)" }}>{siteHost ? `Get roasted at ${siteHost}` : "Get roasted on Roastube"}</span>
    </div>
  );

  const card: CSSProperties = { background: "var(--card)", borderRadius: 40 };
  const glow = "radial-gradient(circle at 50% 0%, rgba(255,90,31,.22), transparent 55%)";

  return (
    <div
      ref={ref}
      className="relative overflow-hidden bg-stage font-sans text-text"
      style={{ width, height, backgroundImage: glow, letterSpacing: "-0.011em" }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: "var(--grain)", opacity: 0.05 }}
      />

      {format === "wide" && (
        <div className="relative flex h-full flex-col" style={{ padding: 56, gap: 28 }}>
          {header(60, 28)}
          <div className="grid flex-1" style={{ gridTemplateColumns: "1fr 330px", gap: 40 }}>
            <div className="flex flex-col justify-center" style={{ gap: 26 }}>
              <p className="font-semibold" style={{ fontSize: fit(roast.verdict, 50), lineHeight: 1.07, letterSpacing: "-0.03em" }}>
                {roast.verdict}
              </p>
              <p className="font-semibold" style={{ fontSize: 26, color: "var(--toaster)" }}>
                {roast.nickname}
              </p>
              {flags(21, 3)}
            </div>
            <div className="relative flex flex-col justify-end" style={{ ...card, padding: 30 }}>
              <div className="absolute" style={{ top: -18, right: 18, width: 170 }}>
                <Crispy expression={expressionForScore(score)} size={170} sticker idle={false} />
              </div>
              {scoreBlock(96, 26, 14)}
            </div>
          </div>
          {footer(22)}
        </div>
      )}

      {format === "square" && (
        <div className="relative flex h-full flex-col" style={{ padding: 72, gap: 40 }}>
          {header(76, 34)}
          <p className="font-semibold" style={{ fontSize: fit(roast.verdict, 70), lineHeight: 1.06, letterSpacing: "-0.035em" }}>
            {roast.verdict}
          </p>
          <div className="grid flex-1 items-end" style={{ gridTemplateColumns: "400px 1fr", gap: 40 }}>
            <div className="relative flex flex-col justify-end" style={{ ...card, padding: 32, height: "100%" }}>
              <div className="absolute" style={{ top: -30, right: 16, width: 180 }}>
                <Crispy expression={expressionForScore(score)} size={180} sticker idle={false} />
              </div>
              {scoreBlock(110, 28, 14)}
            </div>
            <div className="flex flex-col" style={{ gap: 24 }}>
              <p className="font-semibold" style={{ fontSize: 36, lineHeight: 1.1, color: "var(--toaster)", letterSpacing: "-0.02em" }}>
                {roast.nickname}
              </p>
              {flags(26, 3)}
            </div>
          </div>
          {footer(26)}
        </div>
      )}

      {format === "story" && (
        <div className="relative flex h-full flex-col" style={{ padding: "110px 80px 88px", gap: 48 }}>
          {header(92, 40)}
          <div className="flex justify-center">
            <Crispy expression={expressionForScore(score)} size={330} sticker idle={false} />
          </div>
          <p className="font-semibold" style={{ fontSize: fit(roast.verdict, 82), lineHeight: 1.05, letterSpacing: "-0.035em" }}>
            {roast.verdict}
          </p>
          <div style={{ ...card, padding: 40 }}>{scoreBlock(132, 34, 18, true)}</div>
          <div className="flex flex-col" style={{ gap: 20 }}>
            <p className="font-semibold" style={{ fontSize: 46, lineHeight: 1.08, color: "var(--toaster)", letterSpacing: "-0.025em" }}>
              {roast.nickname}
            </p>
            {flags(32, 3)}
          </div>
          <div style={{ background: "var(--flame)", color: "var(--ink)", borderRadius: 40, padding: "32px 40px" }}>
            <p className="font-bold" style={{ fontSize: 26 }}>
              Crispy&apos;s advice
            </p>
            <p className="font-semibold" style={{ fontSize: 34, lineHeight: 1.2, marginTop: 8 }}>
              {roast.advice}
            </p>
          </div>
          <div style={{ marginTop: "auto" }}>{footer(32)}</div>
        </div>
      )}
    </div>
  );
}
