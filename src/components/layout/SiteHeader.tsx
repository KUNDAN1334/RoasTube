import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { SignOutIfSignedIn } from "@/components/auth/SessionLinks";
import { CrispyTile } from "@/components/brand/CrispyMark";

export function SiteHeader({ children }: { children?: ReactNode }) {
  return (
    <header className="relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 pt-5 md:px-10 md:pt-6">
      <Link href="/" className="inline-flex items-center gap-2.5 rounded-xl" aria-label="Roastube home">
        <CrispyTile size={36} />
        <span className="text-[1.0625rem] font-semibold tracking-[-0.02em]">Roastube</span>
      </Link>
      <nav aria-label="Site" className="flex items-center gap-5 font-rounded text-[1.0625rem] font-semibold">
        {children ?? (
          <>
            <Link href="/#how" className="link hidden sm:inline">
              How it works
            </Link>
            <Link href="/privacy" className="link">
              Privacy
            </Link>
            <Suspense fallback={null}>
              <SignOutIfSignedIn />
            </Suspense>
          </>
        )}
      </nav>
    </header>
  );
}
