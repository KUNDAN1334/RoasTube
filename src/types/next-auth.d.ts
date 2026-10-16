import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    /** Whether the person left the YouTube permission ticked on Google's consent screen. */
    youtubeGranted?: boolean;
    /** Hashed account id, safe to hand to the browser. */
    viewerKey?: string;
  }
}

declare module "next-auth/jwt" {
  /** Lives only inside the encrypted session cookie and is read on the server. */
  interface JWT {
    googleAccessToken?: string;
    /** Seconds since epoch. */
    googleExpiresAt?: number;
    googleScope?: string;
    googleId?: string;
  }
}
