"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";
import { isDemoMode } from "@/lib/demo";

/** Only same-site paths, so a crafted link can't bounce people somewhere else after sign-in. */
function safeNext(value: FormDataEntryValue | null) {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\") ? next : "/roast";
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNext(formData.get("next"));
  if (isDemoMode()) redirect(next);
  await signIn("google", { redirectTo: next });
}

export async function signOutOfRoastube() {
  if (isDemoMode()) redirect("/");
  await signOut({ redirectTo: "/" });
}
