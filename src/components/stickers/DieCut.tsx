"use client";

import { useId, type ReactNode } from "react";

/**
 * Wraps SVG artwork in a white die-cut border, like a real sticker. `cut` is in the
 * artwork's own units; the viewBox grows to fit it.
 */
export function DieCut({
  viewBox,
  cut = 5,
  className,
  title,
  children,
}: {
  viewBox: [number, number, number, number];
  cut?: number;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  const id = `diecut-${useId().replace(/:/g, "")}`;
  const [x, y, w, h] = viewBox;
  const pad = cut + 1;
  const vb = [x - pad, y - pad, w + pad * 2, h + pad * 2];
  return (
    <svg
      viewBox={vb.join(" ")}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <defs>
        <filter
          id={id}
          x={vb[0]}
          y={vb[1]}
          width={vb[2]}
          height={vb[3]}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology in="SourceAlpha" operator="dilate" radius={cut} result="cut" />
          <feFlood style={{ floodColor: "var(--paper)" }} />
          <feComposite in2="cut" operator="in" result="paper" />
          <feMerge>
            <feMergeNode in="paper" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={`url(#${id})`}>{children}</g>
    </svg>
  );
}
