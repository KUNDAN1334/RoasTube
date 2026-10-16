"use client";

import { useSearchParams } from "next/navigation";

// Auth.js sends errors back as ?error=<code>. Only the ones people can act on get their own copy.
const ERROR_COPY: Record<string, string> = {
  AccessDenied: "Google said no, or you hit cancel. Either way, no roast yet.",
  OAuthCallbackError: "Google sent you back without finishing sign-in. Try again.",
  Configuration: "Sign-in isn't set up right on our end. Try again in a bit.",
};

/** A one-line heads-up on the landing page after a redirect or a failed sign-in. */
export function SignInNotice() {
  const params = useSearchParams();
  const error = params.get("error");
  const required = params.get("signin") === "required";
  const text = error ? (ERROR_COPY[error] ?? "Sign-in didn't work. Try again.") : required ? "Sign in first. Crispy needs something to look at." : null;
  if (!text) return null;
  return (
    <p role="status" className="mx-auto mt-6 w-fit rounded-full bg-card px-4 py-2 text-sm font-medium text-text ring-1 ring-flame/60">
      {text}
    </p>
  );
}
