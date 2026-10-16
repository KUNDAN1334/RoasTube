"use client";

import { useId, type ReactNode } from "react";

// A tiny character kit: every avatar is a head, hair, eyes, mouth and a few props, mixed
// from the parts below. Drawn in a 100×100 box and clipped to a circle.

type Hair = "spiky" | "long" | "afro" | "bun" | "buzz" | "mohawk" | "bob" | "pigtails" | "curly" | "none";
type Eyes = "big" | "googly" | "spiral" | "hearts" | "wink" | "happy" | "side" | "stars" | "squeeze";
type Mouth = "grin" | "laugh" | "smirk" | "tongue" | "scream" | "flat" | "goldtooth" | "o";
type Brows = "raised" | "angry" | "worried" | "none";
type Prop =
  | "sunglasses"
  | "glasses"
  | "headphones"
  | "cap"
  | "beanie"
  | "bubble"
  | "sweat"
  | "tears"
  | "blush"
  | "freckles"
  | "hoops"
  | "mustache"
  | "bandaid"
  | "notes"
  | "sparkles";
type Pattern = "rays" | "dots" | "zigzag" | "spiral" | "stripes";
type Shirt = "crew" | "hoodie" | "stripes" | "collar";

type AvatarSpec = {
  id: string;
  label: string;
  bg: string;
  pattern: Pattern;
  skin: string;
  hair: Hair;
  hairColor: string;
  shirt: string;
  shirtStyle: Shirt;
  eyes: Eyes;
  mouth: Mouth;
  brows: Brows;
  props: Prop[];
  /** Head tilt in degrees, for attitude. */
  tilt?: number;
};

const INK = "var(--ink)";
const PAPER = "var(--paper)";

// Skin and hair tones sit outside the sticker palette on purpose: people come in more
// than six colors. Dyed hair uses the palette.
export const TOON_AVATARS: AvatarSpec[] = [
  { id: "a1", label: "Shades and spikes", bg: "var(--flame)", pattern: "rays", skin: "#F4CDA9", hair: "spiky", hairColor: "#2B1B12", shirt: "var(--testcard)", shirtStyle: "hoodie", eyes: "big", mouth: "smirk", brows: "raised", props: ["sunglasses", "sparkles"], tilt: -6 },
  { id: "a2", label: "Bubble gum", bg: "var(--testcard)", pattern: "dots", skin: "#F3CBA5", hair: "long", hairColor: "var(--bubblegum)", shirt: "var(--toaster)", shirtStyle: "crew", eyes: "side", mouth: "o", brows: "none", props: ["bubble", "hoops"], tilt: 5 },
  { id: "a3", label: "Hypnotized", bg: "var(--toaster)", pattern: "spiral", skin: "#7A4A2E", hair: "afro", hairColor: "#161616", shirt: "var(--flame)", shirtStyle: "stripes", eyes: "spiral", mouth: "laugh", brows: "worried", props: ["sweat"], tilt: -4 },
  { id: "a4", label: "Wink and tongue", bg: "var(--bubblegum)", pattern: "dots", skin: "#C98E64", hair: "bun", hairColor: "#3A2416", shirt: "var(--testcard)", shirtStyle: "collar", eyes: "wink", mouth: "tongue", brows: "raised", props: ["blush", "hoops"], tilt: 7 },
  { id: "a5", label: "Headphones on", bg: "var(--testcard)", pattern: "zigzag", skin: "#A86A45", hair: "buzz", hairColor: "#161616", shirt: "var(--toaster)", shirtStyle: "hoodie", eyes: "happy", mouth: "smirk", brows: "none", props: ["headphones", "notes"], tilt: -7 },
  { id: "a6", label: "Screaming mohawk", bg: "var(--flame)", pattern: "stripes", skin: "#F9D7B5", hair: "mohawk", hairColor: "var(--testcard)", shirt: "#1A1A1A", shirtStyle: "crew", eyes: "googly", mouth: "scream", brows: "worried", props: ["sweat", "bandaid"], tilt: 4 },
  { id: "a7", label: "Side-eye", bg: "var(--toaster)", pattern: "dots", skin: "#D9A07A", hair: "bob", hairColor: "#1E1E1E", shirt: "var(--bubblegum)", shirtStyle: "collar", eyes: "side", mouth: "flat", brows: "raised", props: ["glasses"], tilt: -3 },
  { id: "a8", label: "Gold tooth", bg: "var(--bubblegum)", pattern: "rays", skin: "#6B3F26", hair: "curly", hairColor: "#161616", shirt: "var(--testcard)", shirtStyle: "crew", eyes: "big", mouth: "goldtooth", brows: "raised", props: ["cap", "sparkles"], tilt: 6 },
  { id: "a9", label: "Heart eyes", bg: "var(--testcard)", pattern: "rays", skin: "#F4CDA9", hair: "pigtails", hairColor: "#E6B54A", shirt: "var(--flame)", shirtStyle: "stripes", eyes: "hearts", mouth: "grin", brows: "none", props: ["blush", "freckles"], tilt: -5 },
  { id: "a10", label: "Crying laughing", bg: "var(--toaster)", pattern: "rays", skin: "#B57B52", hair: "none", hairColor: "#161616", shirt: "var(--bubblegum)", shirtStyle: "hoodie", eyes: "squeeze", mouth: "laugh", brows: "none", props: ["beanie", "tears"], tilt: 8 },
  { id: "a11", label: "Handlebar mustache", bg: "var(--testcard)", pattern: "stripes", skin: "#E8B48E", hair: "curly", hairColor: "#C8501E", shirt: "var(--toaster)", shirtStyle: "collar", eyes: "googly", mouth: "smirk", brows: "angry", props: ["mustache", "bandaid"], tilt: -4 },
  { id: "a12", label: "Star struck", bg: "var(--flame)", pattern: "spiral", skin: "#8D5A3B", hair: "bob", hairColor: "var(--testcard)", shirt: "var(--toaster)", shirtStyle: "crew", eyes: "stars", mouth: "laugh", brows: "raised", props: ["sparkles", "hoops"], tilt: 5 },
];

const line = (w = 3) => ({
  stroke: INK,
  strokeWidth: w,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
});

const EYE_L = { x: 41, y: 46 };
const EYE_R = { x: 59, y: 46 };

/* ---------------------------------------------------------------- background */

function BackgroundPattern({ pattern }: { pattern: Pattern }) {
  switch (pattern) {
    case "rays":
      return (
        <g style={{ fill: PAPER }} opacity={0.2}>
          {Array.from({ length: 10 }, (_, i) => {
            const a = (i * 36 * Math.PI) / 180;
            const b = ((i * 36 + 16) * Math.PI) / 180;
            // Rounded so server and browser trig agree, or hydration complains.
            const pt = (t: number) => `${(50 + 90 * Math.cos(t)).toFixed(1)} ${(52 + 90 * Math.sin(t)).toFixed(1)}`;
            return <path key={i} d={`M50 52L${pt(a)}L${pt(b)}Z`} />;
          })}
        </g>
      );
    case "dots":
      return (
        <g style={{ fill: INK }} opacity={0.16}>
          {Array.from({ length: 15 }, (_, row) =>
            Array.from({ length: 15 }, (_, col) => (
              <circle key={`${row}-${col}`} cx={col * 7 + (row % 2) * 3.5} cy={row * 7} r={1.7} />
            )),
          )}
        </g>
      );
    case "zigzag":
      return (
        <g fill="none" stroke={PAPER} strokeWidth={3} opacity={0.25} strokeLinejoin="round">
          {[8, 22, 36, 50, 64, 78, 92].map((y) => (
            <path key={y} d={`M-4 ${y}${Array.from({ length: 10 }, (_, i) => ` L${i * 12 + 2} ${y + (i % 2 ? -6 : 6)}`).join("")}`} />
          ))}
        </g>
      );
    case "spiral": {
      const pts = Array.from({ length: 140 }, (_, i) => {
        const t = i * 0.22;
        const r = 2.2 * t;
        return `${(50 + r * Math.cos(t)).toFixed(1)} ${(50 + r * Math.sin(t)).toFixed(1)}`;
      });
      return <path d={`M${pts.join(" L")}`} fill="none" stroke={PAPER} strokeWidth={3.5} opacity={0.22} />;
    }
    case "stripes":
      return (
        <g stroke={INK} strokeWidth={5} opacity={0.12}>
          {Array.from({ length: 12 }, (_, i) => (
            <path key={i} d={`M${i * 14 - 40} 110L${i * 14 + 20} -10`} />
          ))}
        </g>
      );
  }
}

function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <path
      d="M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6Z"
      transform={`translate(${x} ${y}) scale(${s})`}
      style={{ fill: "var(--toaster)" }}
      {...line(1.4)}
    />
  );
}

function Note({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) rotate(-12)`}>
      <path d="M2 -9 V3" fill="none" stroke={PAPER} strokeWidth={2.4} strokeLinecap="round" />
      <path d="M2 -9 Q7 -8 8 -4" fill="none" stroke={PAPER} strokeWidth={2.4} strokeLinecap="round" />
      <ellipse cx={-1} cy={3.5} rx={3.6} ry={2.8} style={{ fill: PAPER }} />
    </g>
  );
}

/* ---------------------------------------------------------------- body */

function Body({ spec }: { spec: AvatarSpec }) {
  const fill = { fill: spec.shirt };
  return (
    <g>
      <path d="M43 62L43 79Q50 83 57 79L57 62Z" style={{ fill: spec.skin }} {...line()} />
      <path d="M6 108C8 84 28 76 50 76C72 76 92 84 94 108Z" style={fill} {...line()} />
      {spec.shirtStyle === "hoodie" && (
        <g {...line(2.4)} fill="none">
          <path d="M34 78Q50 90 66 78" />
          <path d="M44 86V96M56 86V96" />
        </g>
      )}
      {spec.shirtStyle === "crew" && <path d="M42 78Q50 84 58 78" fill="none" {...line(2.4)} />}
      {spec.shirtStyle === "collar" && (
        <g style={{ fill: PAPER }} {...line(2.2)}>
          <path d="M40 77L50 86L44 90Z" />
          <path d="M60 77L50 86L56 90Z" />
        </g>
      )}
      {spec.shirtStyle === "stripes" && (
        <g stroke={PAPER} strokeWidth={3.5} opacity={0.75}>
          <path d="M10 92H90M8 101H92" />
        </g>
      )}
    </g>
  );
}

/* ---------------------------------------------------------------- hair */

function HairBack({ spec }: { spec: AvatarSpec }) {
  const fill = { fill: spec.hairColor };
  switch (spec.hair) {
    case "long":
      return <path d="M23 50C21 21 37 12 50 12C63 12 79 21 77 50L81 88C66 94 34 94 19 88Z" style={fill} {...line()} />;
    case "bob":
      return <path d="M24 53C23 23 37 14 50 14C63 14 77 23 76 53L77 67C68 73 32 73 23 67Z" style={fill} {...line()} />;
    case "afro":
      return (
        <g style={fill} {...line()}>
          {[
            [28, 40, 13],
            [33, 24, 13],
            [50, 15, 14],
            [67, 24, 13],
            [72, 40, 13],
            [24, 55, 10],
            [76, 55, 10],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
          <ellipse cx={50} cy={34} rx={26} ry={18} stroke="none" />
        </g>
      );
    case "bun":
      return (
        <g {...line()}>
          <circle cx={50} cy={13} r={10} style={fill} />
          <path d="M42 20Q50 24 58 20" fill="none" stroke="var(--toaster)" strokeWidth={4} />
        </g>
      );
    case "pigtails":
      return (
        <g style={fill} {...line()}>
          <ellipse cx={18} cy={44} rx={9} ry={13} transform="rotate(-18 18 44)" />
          <ellipse cx={82} cy={44} rx={9} ry={13} transform="rotate(18 82 44)" />
          <circle cx={25} cy={36} r={3.5} style={{ fill: "var(--flame)" }} />
          <circle cx={75} cy={36} r={3.5} style={{ fill: "var(--flame)" }} />
        </g>
      );
    default:
      return null;
  }
}

function HairFront({ spec }: { spec: AvatarSpec }) {
  const fill = { fill: spec.hairColor };
  switch (spec.hair) {
    case "spiky":
      return <path d="M26 45L22 30L32 34L31 18L41 27L45 10L52 24L59 11L62 27L71 18L69 34L78 30L74 45C68 36 60 32 50 32C40 32 32 36 26 45Z" style={fill} {...line()} />;
    case "long":
      return <path d="M28 44C27 24 39 18 50 18C63 18 73 26 72 44C66 33 57 27 45 27C41 34 35 39 28 44Z" style={fill} {...line()} />;
    case "afro":
      return (
        <g style={fill} {...line(2.6)}>
          {[
            [34, 31, 7],
            [42, 27, 7],
            [50, 26, 7],
            [58, 27, 7],
            [66, 31, 7],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    case "bun":
      return <path d="M28 44C28 25 40 20 50 20C60 20 72 25 72 44C66 33 58 29 50 29C42 29 34 33 28 44Z" style={fill} {...line()} />;
    case "buzz":
      return <path d="M29 42C29 26 40 21 50 21C60 21 71 26 71 42C66 32 58 29 50 29C42 29 34 32 29 42Z" style={fill} {...line(2.6)} />;
    case "mohawk":
      return (
        <g {...line()}>
          <path d="M43 30L37 4L46 13L50 0L54 13L63 4L57 30Z" style={fill} />
          <path d="M31 40C32 32 38 27 43 26M69 40C68 32 62 27 57 26" fill="none" strokeWidth={1.6} strokeDasharray="1.5 3" />
        </g>
      );
    case "bob":
      return <path d="M28 41C27 24 38 18 50 18C62 18 73 24 72 41Z" style={fill} {...line()} />;
    case "pigtails":
      return <path d="M28 44C28 25 39 19 50 19C61 19 72 25 72 44C68 32 56 26 50 31C44 26 32 32 28 44Z" style={fill} {...line()} />;
    case "curly":
      return (
        <g style={fill} {...line(2.6)}>
          <ellipse cx={50} cy={29} rx={20} ry={10} stroke="none" />
          {[
            [31, 37, 7],
            [35, 27, 8],
            [44, 21, 8],
            [56, 21, 8],
            [65, 27, 8],
            [69, 37, 7],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

/* ---------------------------------------------------------------- face */

function EyeWhite({ x, y, rx = 6.5, ry = 7.5, children }: { x: number; y: number; rx?: number; ry?: number; children?: ReactNode }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={rx} ry={ry} style={{ fill: PAPER }} {...line(2.4)} />
      {children}
    </g>
  );
}

function Pupil({ x, y, r = 3.4 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} style={{ fill: INK }} />
      <circle cx={x + r * 0.45} cy={y - r * 0.45} r={r * 0.35} style={{ fill: PAPER }} />
    </g>
  );
}

function heartPath(x: number, y: number, s: number) {
  return `M${x} ${y + 4 * s}C${x - 8 * s} ${y - 1 * s} ${x - 6 * s} ${y - 8 * s} ${x} ${y - 4 * s}C${x + 6 * s} ${y - 8 * s} ${x + 8 * s} ${y - 1 * s} ${x} ${y + 4 * s}Z`;
}

function starPath(x: number, y: number, r: number) {
  return Array.from({ length: 10 }, (_, i) => {
    const a = (Math.PI / 5) * i - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    return `${i ? "L" : "M"}${(x + rr * Math.cos(a)).toFixed(1)} ${(y + rr * Math.sin(a)).toFixed(1)}`;
  }).join("") + "Z";
}

function EyesPart({ spec }: { spec: AvatarSpec }) {
  const L = EYE_L;
  const R = EYE_R;
  switch (spec.eyes) {
    case "big":
      return (
        <>
          <EyeWhite {...L}><Pupil x={L.x + 1} y={L.y + 1.5} /></EyeWhite>
          <EyeWhite {...R}><Pupil x={R.x + 1} y={R.y + 1.5} /></EyeWhite>
        </>
      );
    case "googly":
      return (
        <>
          <EyeWhite x={L.x - 1} y={L.y} rx={8.5} ry={9.5}><Pupil x={L.x - 4} y={L.y + 3.5} r={3.8} /></EyeWhite>
          <EyeWhite x={R.x + 1} y={R.y - 1} rx={5.5} ry={6}><Pupil x={R.x + 2.5} y={R.y - 3} r={2.6} /></EyeWhite>
        </>
      );
    case "spiral":
      return (
        <>
          {[L, R].map((e) => (
            <EyeWhite key={e.x} x={e.x} y={e.y} rx={7.5} ry={7.5}>
              <path
                d={`M${e.x} ${e.y}m0.8 0a0.8 0.8 0 1 1 -1.6 0a2.4 2.4 0 1 1 4.8 0a4 4 0 1 1 -8 0a5.6 5.6 0 1 1 11.2 0`}
                fill="none"
                {...line(1.5)}
              />
            </EyeWhite>
          ))}
        </>
      );
    case "hearts":
      return (
        <>
          <path d={heartPath(L.x, L.y, 1.15)} style={{ fill: "var(--flame)" }} {...line(2.2)} />
          <path d={heartPath(R.x, R.y, 1.15)} style={{ fill: "var(--flame)" }} {...line(2.2)} />
          <circle cx={L.x - 2.5} cy={L.y - 3} r={1.2} style={{ fill: PAPER }} />
          <circle cx={R.x - 2.5} cy={R.y - 3} r={1.2} style={{ fill: PAPER }} />
        </>
      );
    case "stars":
      return (
        <>
          <path d={starPath(L.x, L.y, 7.5)} style={{ fill: "var(--toaster)" }} {...line(2)} />
          <path d={starPath(R.x, R.y, 7.5)} style={{ fill: "var(--toaster)" }} {...line(2)} />
        </>
      );
    case "wink":
      return (
        <>
          <EyeWhite x={L.x} y={L.y} rx={7} ry={8}><Pupil x={L.x + 1} y={L.y + 1} r={3.6} /></EyeWhite>
          <path d={`M${R.x - 6} ${R.y + 1}Q${R.x} ${R.y - 6} ${R.x + 6} ${R.y + 1}`} fill="none" {...line(3.2)} />
          <path d={`M${R.x + 5} ${R.y - 2}L${R.x + 9} ${R.y - 5}M${R.x + 6} ${R.y + 2}L${R.x + 10} ${R.y + 1}`} fill="none" {...line(1.8)} />
        </>
      );
    case "happy":
      return (
        <>
          <path d={`M${L.x - 6} ${L.y + 2}Q${L.x} ${L.y - 6} ${L.x + 6} ${L.y + 2}`} fill="none" {...line(3.4)} />
          <path d={`M${R.x - 6} ${R.y + 2}Q${R.x} ${R.y - 6} ${R.x + 6} ${R.y + 2}`} fill="none" {...line(3.4)} />
        </>
      );
    case "side":
      // Half-closed lids: skin-coloured cap over the top of each eye, then the outline on top.
      return (
        <>
          {[L, R].map((e) => (
            <g key={e.x}>
              <ellipse cx={e.x} cy={e.y} rx={6.8} ry={6.5} style={{ fill: PAPER }} />
              <Pupil x={e.x + 3.2} y={e.y + 1.8} r={3.2} />
              <path d={`M${e.x - 6.8} ${e.y}Q${e.x} ${e.y - 2.4} ${e.x + 6.8} ${e.y}A6.8 6.5 0 0 0 ${e.x - 6.8} ${e.y}Z`} style={{ fill: spec.skin }} />
              <ellipse cx={e.x} cy={e.y} rx={6.8} ry={6.5} fill="none" {...line(2.4)} />
              <path d={`M${e.x - 7.5} ${e.y}Q${e.x} ${e.y - 2.4} ${e.x + 7.5} ${e.y}`} fill="none" {...line(2.8)} />
            </g>
          ))}
        </>
      );
    case "squeeze":
      return (
        <>
          <path d={`M${L.x - 6} ${L.y - 5}L${L.x + 5} ${L.y}L${L.x - 6} ${L.y + 5}`} fill="none" {...line(3.2)} />
          <path d={`M${R.x + 6} ${R.y - 5}L${R.x - 5} ${R.y}L${R.x + 6} ${R.y + 5}`} fill="none" {...line(3.2)} />
        </>
      );
  }
}

function BrowsPart({ spec }: { spec: AvatarSpec }) {
  switch (spec.brows) {
    case "raised":
      return <path d="M34 37Q40 34 46 36M54 33Q60 26 67 31" fill="none" {...line(3)} />;
    case "angry":
      return <path d="M33 34L47 39M53 39L67 34" fill="none" {...line(3.4)} />;
    case "worried":
      return <path d="M34 38L46 33M54 33L66 38" fill="none" {...line(3)} />;
    default:
      return null;
  }
}

function Teeth({ top, left, right, gold }: { top: number; left: number; right: number; gold?: boolean }) {
  const mid = (left + right) / 2;
  return (
    <>
      <path d={`M${left + 1} ${top}H${right - 1}V${top + 3.6}Q${mid} ${top + 5} ${left + 1} ${top + 3.6}Z`} style={{ fill: PAPER }} />
      {gold && <rect x={mid + 1.5} y={top} width={4.5} height={4} style={{ fill: "var(--toaster)" }} {...line(1)} />}
      <path d={`M${mid - 4} ${top}V${top + 3.8}M${mid} ${top}V${top + 4.2}M${mid + 4} ${top}V${top + 3.8}`} {...line(0.9)} />
    </>
  );
}

function MouthPart({ spec }: { spec: AvatarSpec }) {
  switch (spec.mouth) {
    case "grin":
    case "laugh":
    case "goldtooth": {
      const big = spec.mouth === "laugh";
      const [l, r, t, b] = big ? [35, 65, 56, 74] : [38, 62, 58, 70];
      const mouth = `M${l} ${t}H${r}Q${r} ${b} 50 ${b}Q${l} ${b} ${l} ${t}Z`;
      return (
        <g>
          <path d={mouth} style={{ fill: INK }} />
          <Teeth top={t} left={l} right={r} gold={spec.mouth === "goldtooth"} />
          <path d={`M43 ${b - 2}Q50 ${b - 9} 57 ${b - 2}Q50 ${b + 0.5} 43 ${b - 2}Z`} style={{ fill: "var(--flame)" }} />
          <path d={mouth} fill="none" {...line(2.6)} />
        </g>
      );
    }
    case "smirk":
      return (
        <g fill="none">
          <path d="M40 62Q51 67 61 57" {...line(3.2)} />
          <path d="M59 55L63 59" {...line(2.4)} />
        </g>
      );
    case "tongue":
      return (
        <g>
          <path d="M40 59Q50 66 60 59Q50 63 40 59Z" style={{ fill: INK }} {...line(2.6)} />
          <path d="M45 61Q44 73 50 73Q56 73 55 61Z" style={{ fill: "var(--bubblegum)" }} {...line(2.2)} />
          <path d="M50 63V69" {...line(1.2)} />
        </g>
      );
    case "scream":
      return (
        <g>
          <ellipse cx={50} cy={64} rx={8} ry={10} style={{ fill: INK }} {...line(2.6)} />
          <path d="M43.5 58.5Q50 56.5 56.5 58.5V61Q50 60 43.5 61Z" style={{ fill: PAPER }} />
          <ellipse cx={50} cy={70} rx={5} ry={3} style={{ fill: "var(--flame)" }} />
        </g>
      );
    case "flat":
      return <path d="M42 62H59" fill="none" {...line(3.2)} />;
    case "o":
      return <ellipse cx={51} cy={62} rx={3.6} ry={4.4} style={{ fill: INK }} {...line(2)} />;
  }
}

/* ---------------------------------------------------------------- props */

function PropsBehind({ spec }: { spec: AvatarSpec }) {
  return (
    <>
      {spec.props.includes("sparkles") && (
        <>
          <Sparkle x={16} y={22} s={1.1} />
          <Sparkle x={84} y={28} s={0.8} />
          <Sparkle x={86} y={64} s={0.6} />
        </>
      )}
      {spec.props.includes("notes") && (
        <>
          <Note x={16} y={28} s={1.1} />
          <Note x={85} y={22} s={0.9} />
        </>
      )}
    </>
  );
}

function PropsOnFace({ spec }: { spec: AvatarSpec }) {
  const p = spec.props;
  return (
    <>
      {p.includes("blush") && (
        <g style={{ fill: "var(--bubblegum)" }} opacity={0.75}>
          <ellipse cx={33} cy={56} rx={5} ry={3} />
          <ellipse cx={67} cy={56} rx={5} ry={3} />
        </g>
      )}
      {p.includes("freckles") && (
        <g style={{ fill: INK }} opacity={0.45}>
          {[
            [38, 54],
            [41, 56],
            [36, 57],
            [62, 54],
            [59, 56],
            [64, 57],
          ].map(([cx, cy]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={0.9} />
          ))}
        </g>
      )}
      {p.includes("bandaid") && (
        <g transform="rotate(-25 64 56)">
          <rect x={58} y={53} width={13} height={5.5} rx={2.5} style={{ fill: "#F2D2A9" }} {...line(1.6)} />
          <path d="M63 55.7h1M66 55.7h1" {...line(1.4)} />
        </g>
      )}
      {p.includes("mustache") && (
        <path
          d="M35 57Q38 52 44 53Q48 53 50 56Q52 53 56 53Q62 52 65 57Q67 60 70 57Q69 62 64 61Q58 60 54 59Q52 58.5 50 59.5Q48 58.5 46 59Q42 60 36 61Q31 62 30 57Q33 60 35 57Z"
          style={{ fill: spec.hairColor }}
          {...line(1.8)}
        />
      )}
      {p.includes("tears") && (
        <g style={{ fill: "var(--testcard)" }} {...line(1.6)}>
          <path d="M33 50Q26 58 29 66Q33 70 35 64Q36 58 33 50Z" />
          <path d="M67 50Q74 58 71 66Q67 70 65 64Q64 58 67 50Z" />
        </g>
      )}
      {p.includes("sweat") && <path d="M71 26Q76 33 74 36Q71 39 68.5 36Q67 33 71 26Z" style={{ fill: "var(--testcard)" }} {...line(1.8)} />}
      {p.includes("glasses") && (
        <g {...line(2.6)}>
          <circle cx={EYE_L.x} cy={EYE_L.y} r={9} style={{ fill: PAPER }} fillOpacity={0.12} />
          <circle cx={EYE_R.x} cy={EYE_R.y} r={9} style={{ fill: PAPER }} fillOpacity={0.12} />
          <path d="M50 45.5H50M32 45L28 43M68 45L72 43" fill="none" />
        </g>
      )}
      {p.includes("sunglasses") && (
        <g>
          <path d="M30 41H48Q49 52 40 53Q31 53 30 41Z" style={{ fill: INK }} {...line(2.4)} />
          <path d="M52 41H70Q69 53 60 53Q51 52 52 41Z" style={{ fill: INK }} {...line(2.4)} />
          <path d="M48 42H52M30 42L26 40M70 42L74 40" fill="none" {...line(2.4)} />
          <path d="M34 47L38 43M56 47L60 43" fill="none" stroke={PAPER} strokeWidth={2} strokeLinecap="round" opacity={0.85} />
        </g>
      )}
      {p.includes("bubble") && (
        <g>
          <circle cx={56} cy={66} r={11} style={{ fill: "var(--bubblegum)" }} {...line(2.4)} />
          <path d="M50 60Q52 57 56 57" fill="none" stroke={PAPER} strokeWidth={2.2} strokeLinecap="round" />
        </g>
      )}
    </>
  );
}

function PropsOnHead({ spec }: { spec: AvatarSpec }) {
  const p = spec.props;
  return (
    <>
      {p.includes("hoops") && (
        <g fill="none">
          <circle cx={27} cy={59} r={4} stroke={INK} strokeWidth={4} />
          <circle cx={27} cy={59} r={4} stroke="var(--toaster)" strokeWidth={2} />
          <circle cx={73} cy={59} r={4} stroke={INK} strokeWidth={4} />
          <circle cx={73} cy={59} r={4} stroke="var(--toaster)" strokeWidth={2} />
        </g>
      )}
      {p.includes("headphones") && (
        <g>
          <path d="M24 48C21 16 79 16 76 48" fill="none" stroke={INK} strokeWidth={7} strokeLinecap="round" />
          <path d="M24 48C21 16 79 16 76 48" fill="none" stroke="var(--flame)" strokeWidth={3.5} strokeLinecap="round" />
          <rect x={17} y={40} width={12} height={19} rx={5} style={{ fill: "var(--flame)" }} {...line(2.6)} />
          <rect x={71} y={40} width={12} height={19} rx={5} style={{ fill: "var(--flame)" }} {...line(2.6)} />
        </g>
      )}
      {p.includes("cap") && (
        <g {...line(2.6)}>
          <path d="M27 38C27 18 73 18 73 38Z" style={{ fill: "var(--flame)" }} />
          <path d="M68 33Q88 29 93 37Q83 42 68 39Z" style={{ fill: "var(--flame)" }} />
          <path d="M27 38H73" fill="none" />
          <circle cx={50} cy={19.5} r={2.4} style={{ fill: PAPER }} />
          <path d="M50 22V37" fill="none" strokeWidth={1.4} />
        </g>
      )}
      {p.includes("beanie") && (
        <g {...line(2.6)}>
          <path d="M27 36C26 10 74 10 73 36Z" style={{ fill: "var(--testcard)" }} />
          <rect x={25} y={28} width={50} height={10} rx={4} style={{ fill: "var(--testcard)" }} />
          <path d="M31 29V37M37 29V37M43 29V37M49 29V37M55 29V37M61 29V37M67 29V37" fill="none" stroke={PAPER} strokeWidth={1.4} opacity={0.6} />
          <circle cx={50} cy={8} r={6.5} style={{ fill: PAPER }} />
        </g>
      )}
    </>
  );
}

/* ---------------------------------------------------------------- avatar */

/** A cartoon portrait, drawn as an SVG so it renders crisply into share images. */
export function ToonAvatar({
  avatarId,
  size = 48,
  className,
}: {
  avatarId: string;
  size?: number;
  className?: string;
}) {
  const clip = `toon-${useId().replace(/:/g, "")}`;
  const spec = TOON_AVATARS.find((a) => a.id === avatarId) ?? TOON_AVATARS[0];
  const skin = { fill: spec.skin };

  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <clipPath id={clip}>
          <circle cx={50} cy={50} r={50} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect width={100} height={100} style={{ fill: spec.bg }} />
        <BackgroundPattern pattern={spec.pattern} />
        <PropsBehind spec={spec} />
        <Body spec={spec} />
        <g transform={spec.tilt ? `rotate(${spec.tilt} 50 72)` : undefined}>
          <HairBack spec={spec} />
          <circle cx={28} cy={50} r={5.5} style={skin} {...line()} />
          <circle cx={72} cy={50} r={5.5} style={skin} {...line()} />
          <path d="M28 46C28 30 37 22 50 22C63 22 72 30 72 46C72 62 63 71 50 71C37 71 28 62 28 46Z" style={skin} {...line()} />
          <path d="M49 50Q46.5 55 50.5 56" fill="none" {...line(2)} />
          <HairFront spec={spec} />
          <EyesPart spec={spec} />
          <BrowsPart spec={spec} />
          <MouthPart spec={spec} />
          <PropsOnFace spec={spec} />
          <PropsOnHead spec={spec} />
        </g>
      </g>
    </svg>
  );
}
