import type { CSSProperties } from "react";
import { DieCut } from "./DieCut";

type StickerProps = { className?: string; style?: CSSProperties };

const ink = { stroke: "var(--ink)", strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

export function FlameSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 124, 152]} cut={6} className={className}>
      <path
        d="M62 150C27 150 8 126 10 97C12 72 29 58 35 39C39 54 45 60 51 62C47 41 53 17 72 3C72 25 84 40 94 54C98 44 98 36 96 27C113 44 118 71 114 97C110 128 92 150 62 150Z"
        style={{ fill: "var(--flame)" }}
        strokeWidth={4.5}
        {...ink}
      />
      <path
        d="M62 141C39 141 27 125 29 107C31 91 41 82 45 70C49 80 55 84 59 86C57 72 63 58 73 50C73 64 81 74 87 84C91 92 93 101 91 111C89 129 79 141 62 141Z"
        style={{ fill: "var(--toaster)" }}
      />
      <path
        d="M62 135C50 135 44 125 46 115C48 107 54 101 56 93C60 101 64 103 68 105C70 99 70 95 70 91C78 99 82 109 80 119C78 129 72 135 62 135Z"
        style={{ fill: "var(--paper)" }}
      />
    </DieCut>
  );
}

export function EyesSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 124, 72]} cut={5} className={className}>
      <ellipse cx={34} cy={36} rx={29} ry={31} style={{ fill: "var(--paper)" }} strokeWidth={4.5} {...ink} />
      <ellipse cx={90} cy={37} rx={27} ry={29} style={{ fill: "var(--paper)" }} strokeWidth={4.5} {...ink} />
      <circle cx={45} cy={43} r={12} style={{ fill: "var(--ink)" }} />
      <circle cx={100} cy={44} r={11} style={{ fill: "var(--ink)" }} />
      <circle cx={49} cy={38} r={3.5} style={{ fill: "var(--paper)" }} />
      <circle cx={104} cy={39} r={3.2} style={{ fill: "var(--paper)" }} />
      <path d="M8 14 Q30 2 54 10" fill="none" strokeWidth={5} {...ink} />
    </DieCut>
  );
}

export function MicSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 64, 126]} cut={5} className={className}>
      <rect x={12} y={3} width={40} height={56} rx={20} style={{ fill: "var(--paper)" }} strokeWidth={4} {...ink} />
      <path d="M14 21 H50 M13 33 H51 M14 45 H50 M25 5 V57 M39 5 V57" stroke="var(--ink)" strokeOpacity={0.55} strokeWidth={2.4} />
      <rect x={8} y={54} width={48} height={12} rx={4} style={{ fill: "var(--flame)" }} strokeWidth={4} {...ink} />
      <path d="M26 66 L28 108 H36 L38 66 Z" style={{ fill: "var(--ink)" }} strokeWidth={4} {...ink} />
      <rect x={14} y={106} width={36} height={14} rx={6} style={{ fill: "var(--ink)" }} />
    </DieCut>
  );
}

export function RemoteSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 60, 136]} cut={5} className={className}>
      <rect x={4} y={4} width={52} height={128} rx={18} style={{ fill: "var(--card-3)" }} strokeWidth={4} {...ink} />
      <circle cx={30} cy={24} r={8} style={{ fill: "var(--flame)" }} strokeWidth={3} {...ink} />
      <circle cx={30} cy={60} r={15} style={{ fill: "var(--testcard)" }} strokeWidth={3} {...ink} />
      <circle cx={30} cy={60} r={5} style={{ fill: "var(--paper)" }} />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <circle
            key={`${row}-${col}`}
            cx={16 + col * 14}
            cy={90 + row * 13}
            r={4.2}
            style={{ fill: "var(--paper)" }}
          />
        )),
      )}
    </DieCut>
  );
}

export function ToastSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 104, 118]} cut={5} className={className}>
      <g fill="none" strokeWidth={4.5} {...ink}>
        <path d="M38 24 C30 16 44 12 36 3" />
        <path d="M62 24 C54 16 68 12 60 3" />
      </g>
      <path
        d="M22 114 V66 C8 62 6 38 22 32 C34 22 70 22 82 32 C98 38 96 62 82 66 V114 Z"
        style={{ fill: "var(--char)" }}
        strokeWidth={5}
        {...ink}
      />
      <path
        d="M32 104 V61 C21 58 20 44 31 40 C41 33 63 33 73 40 C84 44 83 58 72 61 V104 Z"
        style={{ fill: "var(--flame)" }}
        opacity={0.55}
      />
      <circle cx={42} cy={76} r={3} style={{ fill: "var(--ink)" }} />
      <circle cx={62} cy={76} r={3} style={{ fill: "var(--ink)" }} />
      <path d="M44 90 Q52 84 60 90" fill="none" strokeWidth={3.5} {...ink} />
    </DieCut>
  );
}

export function PopcornSticker({ className }: StickerProps) {
  return (
    <DieCut viewBox={[0, 0, 110, 128]} cut={5} className={className}>
      {[
        [26, 34, 15],
        [46, 24, 16],
        [66, 26, 15],
        [84, 36, 14],
        [36, 46, 13],
        [58, 42, 14],
        [76, 48, 12],
      ].map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} style={{ fill: "var(--paper)" }} strokeWidth={3.5} {...ink} />
      ))}
      <circle cx={52} cy={26} r={4} style={{ fill: "var(--toaster)" }} />
      <circle cx={80} cy={40} r={3.5} style={{ fill: "var(--toaster)" }} />
      <path d="M12 54 H98 L88 124 H22 Z" style={{ fill: "var(--paper)" }} strokeWidth={4.5} {...ink} />
      <path d="M30 54 L34 124 H46 L44 54 Z M58 54 L60 124 H72 L74 54 Z" style={{ fill: "var(--flame)" }} />
      <path d="M86 54 L80 124 H88 L98 54 Z" style={{ fill: "var(--flame)" }} />
      <path d="M12 54 H98 L88 124 H22 Z" fill="none" strokeWidth={4.5} {...ink} />
    </DieCut>
  );
}

/** A word sticker: chunky rounded type, ink keyline inside a white die-cut. */
export function WordSticker({
  children,
  tone = "toaster",
  rotate = -6,
  className = "",
  style,
}: {
  children: string;
  tone?: "toaster" | "bubblegum" | "flame" | "paper" | "testcard";
  rotate?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const bg = {
    toaster: "bg-toaster text-ink",
    bubblegum: "bg-bubblegum text-ink",
    flame: "bg-flame text-ink",
    paper: "bg-paper text-ink",
    testcard: "bg-testcard text-paper",
  }[tone];
  return (
    <span
      aria-hidden="true"
      className={`inline-block rounded-2xl border-[5px] border-paper px-3.5 py-1.5 font-rounded text-[1.05rem] font-black leading-none whitespace-nowrap shadow-[inset_0_0_0_2.5px_var(--ink),0_10px_24px_rgba(0,0,0,.45)] ${bg} ${className}`}
      style={{ rotate: `${rotate}deg`, ...style }}
    >
      {children}
    </span>
  );
}
