import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { isDemoMode } from "@/lib/demo";

// Optimistic gate: people without a session go back to the landing page to sign in.
// The roast API checks the session again for real; this only saves a wasted page load.
const requireSession = auth((req) => {
  if (!req.auth) {
    const url = new URL("/", req.nextUrl);
    url.searchParams.set("signin", "required");
    url.searchParams.set("next", req.nextUrl.pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }
});

export function proxy(req: NextRequest, event: NextFetchEvent) {
  if (isDemoMode()) return NextResponse.next();
  return requireSession(req, event as never);
}

export const config = {
  matcher: ["/roast"],
};
