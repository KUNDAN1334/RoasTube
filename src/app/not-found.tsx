import Link from "next/link";
import { Crispy } from "@/components/crispy/Crispy";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-2xl flex-col items-center px-4 pt-10 pb-24 text-center">
        <Crispy expression="asleep" size={220} sticker className="h-auto w-[180px] md:w-[220px]" />
        <h1 className="mt-8 text-[2rem] font-semibold tracking-[-0.03em]">No signal on this channel.</h1>
        <p className="mt-3 text-lg text-muted">This page doesn&apos;t exist. Crispy checked twice.</p>
        <Link href="/" className="btn btn-flame mt-8">
          Back to the start
        </Link>
      </main>
      <SiteFooter compact />
    </>
  );
}
