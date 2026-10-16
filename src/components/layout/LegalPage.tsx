import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/** Shared shell for Privacy and Terms: a long read on a dark card. */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl px-5 pt-14 pb-10 md:px-10 md:pt-20">
        <h1 className="text-h1 font-semibold">{title}</h1>
        <p className="mt-3 text-sm text-muted">Last updated {updated}</p>
        <article className="legal mt-10 text-base md:text-[1.0625rem]">{children}</article>
      </main>
      <SiteFooter compact />
    </>
  );
}
