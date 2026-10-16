export type DonenessBand = {
  name: "Raw" | "Lightly toasted" | "Golden" | "Burnt" | "Charcoal";
  min: number;
  max: number;
  /** Toast color for this band. */
  fill: string;
};

export const DONENESS_BANDS: DonenessBand[] = [
  { name: "Raw", min: 0, max: 20, fill: "var(--paper)" },
  {
    name: "Lightly toasted",
    min: 21,
    max: 40,
    fill: "color-mix(in srgb, var(--toaster) 45%, var(--paper))",
  },
  { name: "Golden", min: 41, max: 60, fill: "var(--toaster)" },
  { name: "Burnt", min: 61, max: 80, fill: "var(--flame)" },
  { name: "Charcoal", min: 81, max: 100, fill: "var(--char)" },
];

/** Pale bread to charcoal, for meters drawn on the dark stage. */
export const DONENESS_GRADIENT =
  "linear-gradient(90deg, var(--paper) 4%, var(--toaster) 40%, var(--flame) 68%, var(--char) 96%)";

export function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

export function bandForScore(score: number): DonenessBand {
  const s = clampScore(score);
  return DONENESS_BANDS.find((b) => s >= b.min && s <= b.max) ?? DONENESS_BANDS[0];
}
