"use client";

import { signOutOfRoastube } from "@/app/actions/auth";
import { clearCachedRoasts } from "@/lib/roast-cache";

/** Signs out and wipes cached roasts, so the next person on this browser doesn't see yours. */
export function SignOutButton() {
  return (
    <form action={signOutOfRoastube} onSubmit={() => clearCachedRoasts()}>
      <button type="submit" className="link cursor-pointer">
        Sign out
      </button>
    </form>
  );
}
