import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

// Google access tokens live for an hour, and we never ask for a refresh token. Sessions are
// capped to match, and end outright once the token is about to expire (see the jwt callback).
const SESSION_SECONDS = 55 * 60;
const TOKEN_GRACE_SECONDS = 60;

/** A one-way, short key per account, used to keep cached roasts apart in a shared browser. */
async function viewerKey(sub: string) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`roastube-viewer:${sub}`));
  return Array.from(new Uint8Array(bytes).slice(0, 8), (b) => b.toString(16).padStart(2, "0")).join("");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      authorization: {
        params: {
          scope: `openid email profile ${YOUTUBE_SCOPE}`,
        },
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: SESSION_SECONDS },
  pages: { signIn: "/", error: "/" },
  callbacks: {
    jwt({ token, account }) {
      // Runs on sign-in with `account`, then on every session read without it.
      if (account) {
        token.googleAccessToken = account.access_token;
        token.googleExpiresAt = account.expires_at;
        token.googleScope = account.scope;
        token.googleId = account.providerAccountId;
        return token;
      }
      // Auth.js rolls the cookie forward on every visit, but the Google token doesn't move.
      // Once it's about to expire, returning null ends the session so people sign in again
      // instead of hitting a dead token mid-roast.
      if (!token.googleExpiresAt || Date.now() / 1000 > token.googleExpiresAt - TOKEN_GRACE_SECONDS) return null;
      return token;
    },
    async session({ session, token }) {
      // This object is readable from the browser, so the access token stays out of it.
      session.youtubeGranted = Boolean(token.googleScope?.includes(YOUTUBE_SCOPE));
      session.viewerKey = token.sub ? await viewerKey(token.sub) : undefined;
      return session;
    },
  },
});
