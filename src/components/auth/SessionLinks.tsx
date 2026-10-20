import Link from "next/link";
import { connection } from "next/server";
import { cache } from "react";
import { auth } from "@/auth";
import { isDemoMode } from "@/lib/demo";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";

// Public pages read the session in more than one place; this keeps it to one read per request.
const currentSession = cache(async () => {
  if (isDemoMode()) return null;
  // Auth.js draws random values before it touches the cookie, which Next won't allow while
  // prerendering. Waiting for the request keeps the static shell clean.
  await connection();
  return auth();
});

/**
 * The hero's call to action. People still signed in get a way back to their roast, so the
 * landing page doesn't look signed out and send them through Google again.
 */
export async function RoastLinkOrSignIn() {
  const session = await currentSession();
  // Without the YouTube permission there's nothing to roast, so Google's screen is still needed.
  if (!session?.youtubeGranted) return <SignInForm />;
  return (
    <Link href="/roast" className="btn btn-flame">
      Go to your roast
    </Link>
  );
}

/** A Sign out link for the shared header, shown only while a session is live. */
export async function SignOutIfSignedIn() {
  const session = await currentSession();
  return session ? <SignOutButton /> : null;
}
