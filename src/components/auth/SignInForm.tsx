"use client";

import { useSearchParams } from "next/navigation";
import { signInWithGoogle } from "@/app/actions/auth";
import { GoogleSignInButton } from "./GoogleSignInButton";

/**
 * The official Google button wired to Auth.js. Picks up `?next=` from the URL so people
 * bounced here from a protected page land back where they were going.
 */
export function SignInForm({ next }: { next?: string }) {
  const params = useSearchParams();
  const target = next ?? params.get("next") ?? "/roast";
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={target} />
      <GoogleSignInButton />
    </form>
  );
}

/** Same button without reading the URL, for the static shell and Suspense fallbacks. */
export function StaticSignInForm({ next = "/roast" }: { next?: string }) {
  return (
    <form action={signInWithGoogle}>
      <input type="hidden" name="next" value={next} />
      <GoogleSignInButton />
    </form>
  );
}
