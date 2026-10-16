"use client";

import { useEffect, useId, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export type CrispyExpression =
  | "smug"
  | "judging"
  | "shocked"
  | "cackling"
  | "crying-laughing"
  | "asleep";

type CrispyProps = {
  expression?: CrispyExpression;
  /** Rendered width in px. Height follows the drawing's aspect ratio. */
  size?: number;
  /** Tiny microphone in a stubby hand. Landing hero only. */
  mic?: boolean;
  /** White die-cut border and hard offset shadow, like a real sticker. */
  sticker?: boolean;
  /** Blink and flame flicker. Turned off automatically for reduced motion. */
  idle?: boolean;
  /** Accessible name. Without it Crispy is decorative and hidden from screen readers. */
  title?: string;
  className?: string;
};

// The drawing lives in a 200 x 228 box. The mic adds room on the left.
const BODY = { x: 0, y: 0, w: 200, h: 228 };
const MIC_EXTRA = 24;

const EYE_L = { x: 68, y: 114 };
const EYE_R = { x: 108, y: 114 };

const OPEN_EYES: CrispyExpression[] = ["smug", "judging", "shocked"];

const SCREEN_PATH =
  "M54 74 Q88 70 122 74 Q144 76 145 98 Q148 125 145 152 Q144 174 122 176 Q88 180 54 176 Q32 174 31 152 Q28 125 31 98 Q32 76 54 74Z";
const CASING = { x: 18, y: 60, w: 164, h: 128, r: 30 };

const FLAME_OUTER =
  "M0 0C-8 0-11-7-8-13C-6-17-2-19-1-26C4-22 6-18 5-13C7-15 8-17 8-19C12-14 11-6 7-3C5-1 3 0 0 0Z";
const FLAME_INNER =
  "M0-3C-4-3-5-6-3-9C-2-11 0-12 0-15C3-12 4-9 3-6C3-4 2-3 0-3Z";
const SCORCH =
  "M0-11L3-6L9-8L6-2L12 1L6 4L8 10L2 7L-1 12L-3 6L-9 9L-6 3L-12 0L-6-3L-9-9L-3-6Z";
const TEAR =
  "M0-9C4-3 7 1 7 4C7 8 4 11 0 11C-4 11-7 8-7 4C-7 1-4-3 0-9Z";

/** Outline thickness in rendered px, stepped by size so Crispy reads at 48px and at 360px. */
function outlinePx(size: number) {
  if (size <= 64) return 2.25;
  if (size <= 140) return 3.25;
  if (size <= 260) return 4;
  return 5;
}

function useBlink(enabled: boolean) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(
        () => {
          setBlinking(true);
          timer = setTimeout(() => {
            setBlinking(false);
            schedule();
          }, 130);
        },
        2600 + Math.random() * 2800,
      );
    };
    schedule();
    return () => clearTimeout(timer);
  }, [enabled]);

  return enabled && blinking;
}

export function Crispy({
  expression = "smug",
  size = 200,
  mic = false,
  sticker = false,
  idle = true,
  title,
  className,
}: CrispyProps) {
  const uid = useId().replace(/:/g, "");
  const reduceMotion = usePrefersReducedMotion();
  const animate = idle && !reduceMotion;
  const blinking = useBlink(animate && OPEN_EYES.includes(expression));

  const minX = mic ? -MIC_EXTRA : BODY.x;
  const baseW = BODY.w - minX;
  const unitsPerPx = baseW / size;
  const sw = outlinePx(size) * unitsPerPx;
  const face = Math.max(5.5, sw * 1.15);

  const dieCut = sticker ? 5 * unitsPerPx : 0;
  const shadow = sticker ? 6 * unitsPerPx : 0;
  const pad = sticker ? dieCut + 1 : 2;

  const vb = {
    x: minX - pad,
    y: BODY.y - pad,
    w: baseW + pad * 2 + shadow,
    h: BODY.h + pad * 2 + shadow,
  };
  const height = Math.round((size * vb.h) / vb.w);

  const ids = {
    screen: `crispy-screen-${uid}`,
    casing: `crispy-casing-${uid}`,
    sticker: `crispy-sticker-${uid}`,
    noise: `crispy-noise-${uid}`,
  };

  const ink = { fill: "var(--ink)" };
  const outline = {
    stroke: "var(--ink)",
    strokeWidth: sw,
    strokeLinejoin: "round" as const,
    strokeLinecap: "round" as const,
  };
  const faceLine = {
    fill: "none",
    stroke: "var(--paper)",
    strokeWidth: face,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg
      viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
      width={size}
      height={height}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <clipPath id={ids.screen}>
          <path d={SCREEN_PATH} />
        </clipPath>
        <clipPath id={ids.casing}>
          <rect
            x={CASING.x}
            y={CASING.y}
            width={CASING.w}
            height={CASING.h}
            rx={CASING.r}
          />
        </clipPath>
        {sticker && (
          <filter
            id={ids.sticker}
            x={vb.x}
            y={vb.y}
            width={vb.w}
            height={vb.h}
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feMorphology
              in="SourceAlpha"
              operator="dilate"
              radius={dieCut}
              result="cut"
            />
            <feFlood style={{ floodColor: "var(--paper)" }} result="paper" />
            <feComposite in="paper" in2="cut" operator="in" result="cutPaper" />
            <feOffset in="cut" dx={shadow} dy={shadow} result="shadowAlpha" />
            <feFlood style={{ floodColor: "var(--ink)" }} result="inkFlood" />
            <feComposite
              in="inkFlood"
              in2="shadowAlpha"
              operator="in"
              result="shadow"
            />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="cutPaper" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        )}
        {expression === "asleep" && (
          <filter id={ids.noise} x="0" y="0" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.9"
              numOctaves={1}
              seed={3}
            >
              {animate && (
                <animate
                  attributeName="seed"
                  values="1;4;7;2;9;5"
                  dur="0.5s"
                  calcMode="discrete"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1  0 0 0 0 0.99  0 0 0 0 0.97  1.7 0 0 0 -0.62"
            />
          </filter>
        )}
      </defs>

      <g filter={sticker ? `url(#${ids.sticker})` : undefined}>
        {/* Rabbit-ear antennas: the left one is straight and on fire, the right one is bent. */}
        <path d="M92 58 L60 26" fill="none" {...outline} />
        <path d="M108 58 L128 32 L152 37" fill="none" {...outline} />
        <circle
          cx={155}
          cy={37.5}
          r={6}
          style={{ fill: "var(--flame)" }}
          {...outline}
        />
        <g transform={`translate(59 27) scale(${expression === "asleep" ? 0.55 : 1})`}>
          <g className={animate ? "crispy-flame" : undefined}>
            <path
              d={FLAME_OUTER}
              style={{ fill: "var(--flame)" }}
              {...outline}
              strokeWidth={sw * 0.8}
            />
            <path d={FLAME_INNER} style={{ fill: "var(--toaster)" }} />
          </g>
        </g>

        {/* Stubby legs */}
        <rect x={48} y={176} width={22} height={30} rx={7} style={ink} {...outline} />
        <rect x={130} y={176} width={22} height={30} rx={7} style={ink} {...outline} />
        <ellipse cx={55} cy={210} rx={18} ry={9} style={ink} {...outline} />
        <ellipse cx={146} cy={210} rx={18} ry={9} style={ink} {...outline} />

        {mic && (
          <g>
            {/* Noodle arm: an ink stroke with a flame stroke inside reads as an outlined limb. */}
            <path
              d="M28 146 Q8 150 2 128"
              fill="none"
              stroke="var(--ink)"
              strokeWidth={12 + sw * 2}
              strokeLinecap="round"
            />
            <path
              d="M28 146 Q8 150 2 128"
              fill="none"
              stroke="var(--flame)"
              strokeWidth={12}
              strokeLinecap="round"
            />
            <rect x={-3} y={100} width={10} height={34} rx={4} style={ink} {...outline} />
            <circle cx={2} cy={92} r={12.5} style={ink} {...outline} />
            <path
              d="M-7 87 H11 M-8 93 H12 M-5 99 H9 M-3 82 V102 M3 80 V104 M8 82 V102"
              stroke="var(--paper)"
              strokeOpacity={0.35}
              strokeWidth={1.4}
            />
            <rect
              x={-6}
              y={103}
              width={16}
              height={7}
              rx={2}
              style={{ fill: "var(--testcard)" }}
              {...outline}
              strokeWidth={sw * 0.8}
            />
            <circle
              cx={2}
              cy={124}
              r={9.5}
              style={{ fill: "var(--flame)" }}
              {...outline}
            />
          </g>
        )}

        {/* Antenna base */}
        <ellipse cx={100} cy={62} rx={20} ry={12} style={ink} {...outline} />

        {/* Casing */}
        <rect
          x={CASING.x}
          y={CASING.y}
          width={CASING.w}
          height={CASING.h}
          rx={CASING.r}
          style={{ fill: "var(--flame)" }}
        />
        <g clipPath={`url(#${ids.casing})`} style={{ fill: "var(--ink)" }}>
          <g transform="translate(166 176)" opacity={0.28}>
            <path d={SCORCH} />
            <path d={SCORCH} transform="scale(0.55) rotate(30)" />
          </g>
          <g transform="translate(26 70) rotate(20) scale(0.7)" opacity={0.28}>
            <path d={SCORCH} />
            <path d={SCORCH} transform="scale(0.5) rotate(25)" />
          </g>
        </g>
        <rect
          x={CASING.x}
          y={CASING.y}
          width={CASING.w}
          height={CASING.h}
          rx={CASING.r}
          fill="none"
          {...outline}
        />

        {/* Control panel */}
        <circle cx={163} cy={96} r={8} style={{ fill: "var(--toaster)" }} {...outline} strokeWidth={sw * 0.8} />
        <path d="M163 96 L167 90" stroke="var(--ink)" strokeWidth={sw * 0.7} strokeLinecap="round" />
        <circle cx={163} cy={122} r={8} style={{ fill: "var(--toaster)" }} {...outline} strokeWidth={sw * 0.8} />
        <path d="M163 122 L158 117" stroke="var(--ink)" strokeWidth={sw * 0.7} strokeLinecap="round" />
        <path
          d="M156 144 H170 M156 152 H170 M156 160 H170"
          stroke="var(--ink)"
          strokeWidth={Math.max(3, sw * 0.8)}
          strokeLinecap="round"
        />

        {/* Screen */}
        <path d={SCREEN_PATH} style={ink} {...outline} />
        <g clipPath={`url(#${ids.screen})`}>
          {expression === "asleep" && (
            <rect
              x={28}
              y={68}
              width={122}
              height={114}
              filter={`url(#${ids.noise})`}
              opacity={0.6}
            />
          )}
          <path
            d={Array.from({ length: 22 }, (_, i) => `M28 ${72 + i * 5} H150`).join(" ")}
            stroke="var(--paper)"
            strokeOpacity={0.07}
            strokeWidth={1.4}
          />
          <path
            d="M42 102 Q42 86 58 82"
            fill="none"
            stroke="var(--paper)"
            strokeOpacity={0.28}
            strokeWidth={4.5}
            strokeLinecap="round"
          />
          <Face
            expression={expression}
            blinking={blinking}
            faceLine={faceLine}
            face={face}
          />
        </g>
      </g>
    </svg>
  );
}

type FaceProps = {
  expression: CrispyExpression;
  blinking: boolean;
  faceLine: React.SVGProps<SVGPathElement>;
  face: number;
};

function Eye({
  cx,
  cy,
  r = 14,
  pupil = 6.5,
  look = { x: 0, y: 0 },
}: {
  cx: number;
  cy: number;
  r?: number;
  pupil?: number;
  look?: { x: number; y: number };
}) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} style={{ fill: "var(--paper)" }} />
      <circle cx={cx + look.x} cy={cy + look.y} r={pupil} style={{ fill: "var(--ink)" }} />
    </>
  );
}

/** Ink shape that crops an eye from the top (lid) or bottom, since the screen behind is ink too. */
function Lid({ cx, cy, from, to }: { cx: number; cy: number; from: number; to: number }) {
  return (
    <rect
      x={cx - 18}
      y={cy + from}
      width={36}
      height={to - from}
      style={{ fill: "var(--ink)" }}
    />
  );
}

function Face({ expression, blinking, faceLine, face }: FaceProps) {
  const L = EYE_L;
  const R = EYE_R;

  switch (expression) {
    case "smug":
      return (
        <>
          <g className="crispy-eyes" data-blink={blinking}>
            <Eye cx={L.x} cy={L.y} look={{ x: 3, y: 5 }} />
            <Eye cx={R.x} cy={R.y} look={{ x: 3, y: 5 }} />
          </g>
          <Lid cx={L.x} cy={L.y} from={-19} to={-1} />
          <Lid cx={R.x} cy={R.y} from={-19} to={-2} />
          <path d="M54 96 Q66 93 80 96" {...faceLine} />
          <path d="M94 91 Q107 80 122 88" {...faceLine} />
          <path d="M70 150 Q94 160 114 142" {...faceLine} />
          <path d="M111 137 Q117 140 117 147" {...faceLine} strokeWidth={face * 0.8} />
        </>
      );
    case "judging":
      return (
        <>
          <g className="crispy-eyes" data-blink={blinking}>
            <Eye cx={L.x} cy={L.y} look={{ x: -7, y: 2 }} />
            <Eye cx={R.x} cy={R.y} look={{ x: -7, y: 2 }} />
          </g>
          <Lid cx={L.x} cy={L.y} from={-19} to={-4} />
          <Lid cx={R.x} cy={R.y} from={-19} to={-3} />
          <Lid cx={L.x} cy={L.y} from={9} to={19} />
          <Lid cx={R.x} cy={R.y} from={9} to={19} />
          <path d="M54 92 Q67 81 81 90" {...faceLine} />
          <path d="M95 101 L121 95" {...faceLine} />
          <path d="M74 152 L104 147" {...faceLine} />
        </>
      );
    case "shocked":
      return (
        <>
          <g className="crispy-eyes" data-blink={blinking}>
            <Eye cx={L.x} cy={L.y} r={16} pupil={4.5} />
            <Eye cx={R.x} cy={R.y} r={16} pupil={4.5} />
          </g>
          <path d="M53 88 Q67 77 81 86" {...faceLine} />
          <path d="M95 86 Q109 77 123 88" {...faceLine} />
          <ellipse
            cx={88}
            cy={154}
            rx={9}
            ry={12}
            style={{ fill: "var(--ink)" }}
            stroke="var(--paper)"
            strokeWidth={face}
          />
        </>
      );
    case "cackling":
      return (
        <>
          <path d="M56 118 Q68 101 80 118" {...faceLine} strokeWidth={face * 1.1} />
          <path d="M96 118 Q108 101 120 118" {...faceLine} strokeWidth={face * 1.1} />
          <path d="M55 95 Q67 88 79 92" {...faceLine} />
          <path d="M97 92 Q109 88 121 95" {...faceLine} />
          <LaughMouth top={135} bottom={168} left={62} right={114} face={face} />
        </>
      );
    case "crying-laughing":
      return (
        <>
          <path d="M57 104 L78 113 L57 122" {...faceLine} strokeWidth={face * 1.1} />
          <path d="M119 104 L98 113 L119 122" {...faceLine} strokeWidth={face * 1.1} />
          <LaughMouth top={133} bottom={171} left={57} right={119} face={face} />
          <g style={{ fill: "var(--testcard)" }} stroke="var(--paper)" strokeWidth={face * 0.45}>
            <path d={TEAR} transform="translate(45 130) rotate(28)" />
            <path d={TEAR} transform="translate(40 150) rotate(36) scale(0.7)" />
            <path d={TEAR} transform="translate(131 130) rotate(-28)" />
            <path d={TEAR} transform="translate(136 150) rotate(-36) scale(0.7)" />
          </g>
        </>
      );
    case "asleep":
      return (
        <>
          <path d="M56 113 Q68 124 80 113" {...faceLine} />
          <path d="M96 113 Q108 124 120 113" {...faceLine} />
          <path d="M78 151 Q83 146 88 151 Q93 156 98 151" {...faceLine} strokeWidth={face * 0.8} />
          <path d="M117 84 H127 L117 94 H127" {...faceLine} strokeWidth={face * 0.6} />
          <path d="M131 76 H137 L131 82 H137" {...faceLine} strokeWidth={face * 0.5} />
        </>
      );
  }
}

function LaughMouth({
  top,
  bottom,
  left,
  right,
  face,
}: {
  top: number;
  bottom: number;
  left: number;
  right: number;
  face: number;
}) {
  const mid = (left + right) / 2;
  const mouth = `M${left} ${top} H${right} Q${right} ${bottom} ${mid} ${bottom} Q${left} ${bottom} ${left} ${top}Z`;
  return (
    <>
      <path d={mouth} style={{ fill: "var(--ink)" }} />
      <path
        d={`M${left + 2} ${top} H${right - 2} V${top + 6} Q${mid} ${top + 9} ${left + 2} ${top + 6}Z`}
        style={{ fill: "var(--paper)" }}
      />
      <path
        d={`M${mid - 15} ${bottom - 5} Q${mid} ${bottom - 19} ${mid + 15} ${bottom - 5} Q${mid + 8} ${bottom - 1} ${mid} ${bottom - 1} Q${mid - 8} ${bottom - 1} ${mid - 15} ${bottom - 5}Z`}
        style={{ fill: "var(--flame)" }}
      />
      <path
        d={mouth}
        fill="none"
        stroke="var(--paper)"
        strokeWidth={face}
        strokeLinejoin="round"
      />
    </>
  );
}

/** Score to expression: smug when low, cackling in the middle, crying-laughing when it's bad. */
export function expressionForScore(score: number): CrispyExpression {
  if (score <= 40) return "smug";
  if (score <= 70) return "cackling";
  return "crying-laughing";
}
