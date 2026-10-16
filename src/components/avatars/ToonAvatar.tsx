"use client";

import { useId } from "react";

type HairStyle = "short" | "curly" | "cap" | "buzz" | "long" | "bun" | "bob" | "curls";

type AvatarSpec = {
  id: string;
  label: string;
  bg: string;
  skin: string;
  hair: string;
  shirt: string;
  style: HairStyle;
  beard?: boolean;
  glasses?: boolean;
  earrings?: boolean;
};

// A spread of looks so people can pick one that feels like them. Skin and hair tones sit
// outside the sticker palette on purpose: people come in more than six colors.
export const TOON_AVATARS: AvatarSpec[] = [
  { id: "a1", label: "Short hair", bg: "var(--testcard)", skin: "#F4CDA9", hair: "#2B1B12", shirt: "var(--flame)", style: "short" },
  { id: "a2", label: "Curly hair", bg: "var(--flame)", skin: "#7A4A2E", hair: "#161616", shirt: "var(--toaster)", style: "curly" },
  { id: "a3", label: "Cap", bg: "var(--toaster)", skin: "#C98E64", hair: "#2B1B12", shirt: "var(--bubblegum)", style: "cap" },
  { id: "a4", label: "Beard and glasses", bg: "var(--bubblegum)", skin: "#A86A45", hair: "#161616", shirt: "var(--paper)", style: "buzz", beard: true, glasses: true },
  { id: "a5", label: "Long hair", bg: "var(--toaster)", skin: "#F3CBA5", hair: "#7A4A22", shirt: "var(--testcard)", style: "long" },
  { id: "a6", label: "Bun and earrings", bg: "var(--testcard)", skin: "#6B3F26", hair: "#161616", shirt: "var(--flame)", style: "bun", earrings: true },
  { id: "a7", label: "Bob and glasses", bg: "var(--bubblegum)", skin: "#D9A07A", hair: "#1E1E1E", shirt: "var(--toaster)", style: "bob", glasses: true },
  { id: "a8", label: "Long curls", bg: "var(--flame)", skin: "#B57B52", hair: "#3A2416", shirt: "var(--bubblegum)", style: "curls", earrings: true },
];

const line = {
  stroke: "var(--ink)",
  strokeWidth: 3,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

function HairBack({ spec }: { spec: AvatarSpec }) {
  const fill = { fill: spec.hair };
  switch (spec.style) {
    case "long":
      return <path d="M27 47C25 24 38 15 50 15C62 15 75 24 73 47L76 84C66 89 34 89 24 84Z" style={fill} {...line} />;
    case "bob":
      return <path d="M27 49C26 25 38 17 50 17C62 17 74 25 73 49L74 64C67 69 33 69 26 64Z" style={fill} {...line} />;
    case "bun":
      return <circle cx={50} cy={15} r={9.5} style={fill} {...line} />;
    case "curls":
      return (
        <g style={fill} {...line}>
          {[
            [28, 40, 10],
            [25, 55, 10],
            [28, 70, 10],
            [72, 40, 10],
            [75, 55, 10],
            [72, 70, 10],
            [36, 26, 10],
            [50, 20, 11],
            [64, 26, 10],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
    default:
      return null;
  }
}

function HairFront({ spec }: { spec: AvatarSpec }) {
  const fill = { fill: spec.hair };
  switch (spec.style) {
    case "short":
      return (
        <path
          d="M29 45C28 26 39 19 51 19C63 19 72 27 71 45C68 37 64 33 58 31C52 35 40 36 33 33C31 37 30 41 29 45Z"
          style={fill}
          {...line}
        />
      );
    case "curly":
      return (
        <g style={fill} {...line}>
          {[
            [33, 37, 6.5],
            [37, 28, 7],
            [45, 22, 7],
            [55, 22, 7],
            [63, 28, 7],
            [67, 37, 6.5],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
          <ellipse cx={50} cy={30} rx={15} ry={7} stroke="none" />
        </g>
      );
    case "cap":
      return (
        <g {...line}>
          <path d="M29 40C29 24 39 17 50 17C61 17 71 24 71 40Z" style={{ fill: "var(--testcard)" }} />
          <path d="M26 40Q50 47 74 40L76 45Q50 54 24 45Z" style={{ fill: "var(--testcard)" }} />
          <circle cx={50} cy={17.5} r={2.6} style={{ fill: "var(--paper)" }} />
        </g>
      );
    case "buzz":
      return <path d="M30 42C30 26 40 21 50 21C60 21 70 26 70 42C66 33 58 30 50 30C42 30 34 33 30 42Z" style={fill} {...line} />;
    case "long":
      return <path d="M30 44C30 26 40 19 50 19C62 19 71 27 70 44C64 34 56 28 47 27C42 33 36 38 30 44Z" style={fill} {...line} />;
    case "bun":
      return <path d="M30 43C30 26 40 20 50 20C60 20 70 26 70 43C64 33 57 29 50 29C43 29 36 33 30 43Z" style={fill} {...line} />;
    case "bob":
      return <path d="M30 40C29 26 39 19 50 19C61 19 71 26 70 40Z" style={fill} {...line} />;
    case "curls":
      return (
        <g style={fill} {...line}>
          {[
            [38, 29, 6.5],
            [46, 25, 6.5],
            [54, 25, 6.5],
            [62, 29, 6.5],
          ].map(([cx, cy, r]) => (
            <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
          ))}
        </g>
      );
  }
}

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
        <HairBack spec={spec} />
        <path d="M43 60L43 77Q50 81 57 77L57 60Z" style={skin} {...line} />
        <path d="M12 106C14 83 32 75 50 75C68 75 86 83 88 106Z" style={{ fill: spec.shirt }} {...line} />
        <circle cx={30} cy={48} r={5} style={skin} {...line} />
        <circle cx={70} cy={48} r={5} style={skin} {...line} />
        <ellipse cx={50} cy={46} rx={20} ry={23} style={skin} {...line} />
        <circle cx={39} cy={55} r={3.2} style={{ fill: "var(--bubblegum)" }} opacity={0.45} />
        <circle cx={61} cy={55} r={3.2} style={{ fill: "var(--bubblegum)" }} opacity={0.45} />
        <ellipse cx={42.5} cy={47.5} rx={2.4} ry={3} style={{ fill: "var(--ink)" }} />
        <ellipse cx={57.5} cy={47.5} rx={2.4} ry={3} style={{ fill: "var(--ink)" }} />
        <path d="M38 41Q42.5 39 46.5 40.5M53.5 40.5Q57.5 39 62 41" fill="none" {...line} strokeWidth={2.3} />
        <path d="M50 49.5Q48.5 53.5 50.5 54.5" fill="none" {...line} strokeWidth={2} />
        {spec.beard ? (
          <>
            <path d="M31 52C32 67 40 73 50 73C60 73 68 67 69 52C66 59 60 62 50 62C40 62 34 59 31 52Z" style={{ fill: spec.hair }} {...line} />
            <path d="M43 58Q50 55 57 58Q50 60.5 43 58Z" style={{ fill: spec.hair }} {...line} strokeWidth={2} />
          </>
        ) : (
          <path d="M44 59Q50 63 56.5 58" fill="none" {...line} strokeWidth={2.4} />
        )}
        <HairFront spec={spec} />
        {spec.glasses && (
          <g fill="none" {...line} strokeWidth={2.4}>
            <circle cx={42.5} cy={47.5} r={6.5} />
            <circle cx={57.5} cy={47.5} r={6.5} />
            <path d="M49 47.5H51" />
          </g>
        )}
        {spec.earrings && (
          <g style={{ fill: "var(--toaster)" }} {...line} strokeWidth={1.6}>
            <circle cx={30} cy={56} r={2.6} />
            <circle cx={70} cy={56} r={2.6} />
          </g>
        )}
      </g>
    </svg>
  );
}
