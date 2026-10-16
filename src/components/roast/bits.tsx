import { bandForScore, clampScore, DONENESS_GRADIENT } from "@/lib/doneness";
import { INTENSITY_LABEL, type Intensity } from "@/lib/types";

const FLAME_PATH =
  "M10 22C3 22 1 16 3 11C5 7 8 6 8 1C12 4 14 8 13 11C15 10 16 8 16 6C19 10 19 16 16 19C14 21 12 22 10 22Z";

export function IntensityChip({ intensity, size = "sm" }: { intensity: Intensity; size?: "sm" | "lg" }) {
  const hot = intensity === "extra_crispy";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-rounded font-extrabold text-ink ${
        hot ? "bg-flame" : "bg-toaster"
      } ${size === "lg" ? "px-5 py-2 text-[1.6rem]" : "px-2.5 py-1 text-xs"}`}
    >
      <svg viewBox="0 0 20 24" className={size === "lg" ? "h-7 w-6" : "h-3.5 w-3"} aria-hidden="true">
        <path d={FLAME_PATH} fill="var(--ink)" />
      </svg>
      {INTENSITY_LABEL[intensity]}
    </span>
  );
}

/** One to three small flames; unlit ones are faint outlines. */
export function SeverityFlames({ severity, size = 14 }: { severity: 1 | 2 | 3; size?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="sr-only">Severity {severity} of 3</span>
      {[1, 2, 3].map((n) => (
        <svg key={n} viewBox="0 0 20 24" width={size} height={size * 1.2} aria-hidden="true">
          <path
            d={FLAME_PATH}
            fill={n <= severity ? "var(--flame)" : "none"}
            stroke={n <= severity ? "none" : "rgba(255,255,255,.35)"}
            strokeWidth={1.8}
          />
        </svg>
      ))}
    </span>
  );
}

export function FlagGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} className="shrink-0" aria-hidden="true">
      <path d="M3 15V1.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M3.5 2.2Q8 0.6 13 2.4L11 6.2L13 10Q8 8.4 3.5 10Z" fill="var(--flame)" />
    </svg>
  );
}

/** Pale bread to charcoal, filled to the score. */
export function DonenessBar({ score, height = 10 }: { score: number; height?: number }) {
  const s = clampScore(score);
  return (
    <div className="overflow-hidden rounded-full bg-card-3" style={{ height }}>
      <div
        className="h-full rounded-full"
        style={{
          width: `${s}%`,
          // Keep the gradient anchored to the full track so 30 and 90 show different colors.
          backgroundImage: DONENESS_GRADIENT,
          backgroundSize: `${(100 / Math.max(s, 1)) * 100}% 100%`,
        }}
      />
    </div>
  );
}

export function bandLabel(score: number) {
  return bandForScore(score).name;
}
