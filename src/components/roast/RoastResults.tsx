"use client";

import Link from "next/link";
import { useState } from "react";
import { ShareSheet } from "@/components/share/ShareSheet";
import { readAvatarChoice, saveAvatarChoice } from "@/lib/avatar-choice";
import { INTENSITIES, INTENSITY_LABEL, type Intensity, type RoastResult } from "@/lib/types";
import { CrtTurnOn } from "./CrtTurnOn";
import { RoastBoard } from "./RoastBoard";

export function RoastResults({
  result,
  onRoastAgain,
}: {
  result: RoastResult;
  onRoastAgain: (intensity: Intensity) => void;
}) {
  const [crtDone, setCrtDone] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [intensity, setIntensity] = useState<Intensity>(result.intensity);
  // Results only render in the browser (after the roast streams in), so localStorage is there.
  const [avatar, setAvatar] = useState(() => readAvatarChoice(result.profile));

  function changeAvatar(choice: string) {
    setAvatar(choice);
    saveAvatarChoice(choice);
  }

  return (
    <>
      {!crtDone && <CrtTurnOn onDone={() => setCrtDone(true)} />}

      <RoastBoard result={result} avatarChoice={avatar} revealed={crtDone} />

      <div className="mt-3 flex flex-col gap-3 pb-28 md:flex-row md:flex-wrap md:items-center md:pb-0">
        <button
          type="button"
          className="btn btn-flame hidden whitespace-nowrap md:inline-flex md:px-7"
          onClick={() => setShareOpen(true)}
        >
          <ShareGlyph />
          Share my roast
        </button>

        <div className="flex items-center gap-1 rounded-full bg-card p-1.5 md:ml-1">
          <fieldset className="contents">
            <legend className="sr-only">Heat level for the next roast</legend>
            {INTENSITIES.map((level) => (
              <label
                key={level}
                className="cursor-pointer rounded-full px-3 py-2 font-rounded text-sm font-bold whitespace-nowrap text-muted has-checked:bg-card-3 has-checked:text-text has-focus-visible:outline-3 has-focus-visible:outline-toaster sm:px-4"
              >
                <input
                  type="radio"
                  name="next-intensity"
                  value={level}
                  checked={intensity === level}
                  onChange={() => setIntensity(level)}
                  className="sr-only"
                />
                {INTENSITY_LABEL[level]}
              </label>
            ))}
          </fieldset>
          <button
            type="button"
            className="btn btn-light ml-auto min-h-10 px-4 py-2 text-sm whitespace-nowrap sm:px-5"
            onClick={() => onRoastAgain(intensity)}
          >
            Roast me again
          </button>
        </div>

        <Link href="/nuclear" className="px-1 font-rounded text-sm font-semibold text-muted hover:text-text md:ml-auto">
          Go nuclear with your full history →
        </Link>
      </div>

      {/* On phones the share button rides along at the bottom. */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-stage via-stage/90 to-transparent px-4 pt-8 pb-[max(1rem,env(safe-area-inset-bottom))] md:hidden">
        <button type="button" className="btn btn-flame w-full" onClick={() => setShareOpen(true)}>
          <ShareGlyph />
          Share my roast
        </button>
      </div>

      <ShareSheet
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        result={result}
        avatarChoice={avatar}
        onAvatarChange={changeAvatar}
      />
    </>
  );
}

function ShareGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
      <path d="M10 13V3M6 6.5L10 2.5L14 6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 9H4.5A1.5 1.5 0 0 0 3 10.5v5A1.5 1.5 0 0 0 4.5 17h11a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 15.5 9H15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
