import Link from "next/link";
import { Crispy } from "@/components/crispy/Crispy";

function LegalRow() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between md:px-10">
      <p>Roastube isn&apos;t affiliated with YouTube or Google.</p>
      <nav aria-label="Legal" className="flex gap-5 font-medium">
        <Link href="/privacy" className="hover:text-text">
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-text">
          Terms
        </Link>
      </nav>
    </div>
  );
}

/** Big sign-off: the name in giant letters with Crispy heckling from the front row. */
export function SiteFooter({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <footer className="mt-auto">
        <LegalRow />
      </footer>
    );
  }
  return (
    <footer className="relative mt-auto overflow-hidden pt-36 md:pt-32">
      <div className="relative w-full px-[1.5vw]">
        {/* textLength stretches the word to exactly the viewport width, whatever the font metrics. */}
        <svg viewBox="0 0 1000 186" className="block h-auto w-full select-none" aria-hidden="true">
          <text
            x="0"
            y="182"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            style={{ font: "900 248px var(--font-inter)", letterSpacing: "-0.06em", fill: "#161616" }}
          >
            roastube
          </text>
        </svg>
        <div className="absolute inset-x-0 bottom-[-3%] flex justify-center">
          <div className="relative">
            <Crispy
              expression="smug"
              size={300}
              sticker
              className="h-auto w-[clamp(140px,22vw,320px)]"
            />
            <p className="absolute -top-12 left-[45%] w-max max-w-[9.5rem] -rotate-6 rounded-[1.25rem] border-[3px] border-ink bg-paper px-3 py-2 font-rounded text-[0.8125rem] leading-tight font-extrabold text-ink shadow-[0_0_0_4px_var(--paper)] md:left-[58%] md:max-w-[11rem] lg:-top-6 lg:left-[62%] lg:max-w-[14rem] lg:px-3.5 lg:text-base">
              Your watch history called. It wants an apology.
            </p>
          </div>
        </div>
      </div>
      <div className="relative z-10 bg-stage">
        <LegalRow />
      </div>
    </footer>
  );
}
