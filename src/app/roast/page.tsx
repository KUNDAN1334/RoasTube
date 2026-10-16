import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LoadingScreen } from "@/components/roast/LoadingScreen";
import { RoastExperience } from "@/components/roast/RoastExperience";
import { isDemoMode } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Your roast",
  robots: { index: false },
};

/** Reads the session at request time, so it sits behind the Suspense boundary. */
async function RoastGate() {
  if (isDemoMode()) {
    return <RoastExperience viewerKey="demo" demo />;
  }
  const session = await auth();
  if (!session?.viewerKey) redirect("/?signin=required&next=/roast");
  return <RoastExperience viewerKey={session.viewerKey} demo={false} />;
}

export default function RoastPage() {
  return (
    <>
      <SiteHeader>
        <SignOutButton />
      </SiteHeader>
      <main className="mx-auto w-full max-w-6xl px-4 pt-4 md:px-10 md:pt-5">
        <Suspense fallback={<LoadingScreen step={null} />}>
          <RoastGate />
        </Suspense>
      </main>
      <SiteFooter compact />
    </>
  );
}
