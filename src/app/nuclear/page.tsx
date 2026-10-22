import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { DropZone } from "@/components/nuclear/DropZone";

export const metadata: Metadata = {
  title: "Nuclear mode",
  description:
    "Roast your full YouTube watch and search history using a Google Takeout export. Files are read in your browser and never uploaded.",
  alternates: { canonical: "/nuclear" },
};

const STEPS = [
  <>
    Go to{" "}
    <a href="https://takeout.google.com" className="link text-text" target="_blank" rel="noreferrer">
      takeout.google.com
    </a>{" "}
    and sign in.
  </>,
  <>
    Click <strong>Deselect all</strong>, then scroll down and tick <strong>YouTube and YouTube Music</strong>.
  </>,
  <>
    Click <strong>All YouTube data included</strong>, deselect everything, then tick <strong>history</strong> (and{" "}
    <strong>comments</strong> if you want it extra crispy).
  </>,
  <>
    Click <strong>Multiple formats</strong> and set history to <strong>JSON</strong>. HTML won&apos;t work.
  </>,
  <>
    Click <strong>Next step</strong>, choose <strong>Export once</strong> and <strong>.zip</strong>, then{" "}
    <strong>Create export</strong>.
  </>,
  <>
    Google emails you when it&apos;s ready. Download it, unzip it, and open{" "}
    <strong>YouTube and YouTube Music → history</strong>.
  </>,
];

export default function NuclearPage() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 md:px-10">
        <section aria-labelledby="nuclear-title" className="mx-auto max-w-3xl pt-14 text-center md:pt-24">
          <h1 id="nuclear-title" className="text-h1 font-semibold">
            Go nuclear
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted text-balance">
            YouTube doesn&apos;t give apps your watch or search history. It only gives it to you, through Google
            Takeout. Export it, drop it here, and Crispy roasts everything you&apos;ve ever watched at 3am.
          </p>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-sm font-medium">
            <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
              <rect x="3" y="7" width="10" height="7.5" rx="2" fill="var(--toaster)" />
              <path d="M5.2 7V5a2.8 2.8 0 0 1 5.6 0v2" fill="none" stroke="var(--toaster)" strokeWidth="1.6" />
            </svg>
            Your files never leave your device.
          </p>
        </section>

        <div className="mt-14 grid gap-4 md:mt-20 md:grid-cols-[1fr_1.1fr]">
          <section aria-labelledby="steps-title" className="card p-6 md:p-8">
            <h2 id="steps-title" className="text-[1.375rem] font-semibold tracking-[-0.02em]">
              Export your history
            </h2>
            <ol className="mt-6 grid gap-4">
              {STEPS.map((step, i) => (
                <li
                  key={i}
                  className="grid grid-cols-[2rem_1fr] items-start gap-3 text-white/80 [&_strong]:font-semibold [&_strong]:text-text"
                >
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-full bg-card-3 font-rounded text-sm font-extrabold text-text"
                  >
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="drop-title">
            <h2 id="drop-title" className="sr-only">
              Add your files
            </h2>
            <DropZone />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
