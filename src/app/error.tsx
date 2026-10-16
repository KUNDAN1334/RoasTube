"use client";

import Link from "next/link";
import { Crispy } from "@/components/crispy/Crispy";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-16 pb-24 text-center">
      <Crispy expression="asleep" size={220} sticker className="h-auto w-[180px] md:w-[220px]" />
      <h1 className="mt-8 text-[2rem] font-semibold tracking-[-0.03em]">We&apos;re experiencing technical difficulties.</h1>
      <p className="mt-3 text-lg text-muted">Something broke on our end. Try again, or head back to the start.</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <button type="button" className="btn btn-flame" onClick={reset}>
          Try again
        </button>
        <Link href="/" className="btn btn-ghost">
          Back to the start
        </Link>
      </div>
    </main>
  );
}
