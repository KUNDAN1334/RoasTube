import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/layout/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of service",
  description: "The rules for using Roastube.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of service" updated={SITE.policyUpdated}>
      <p>
        These terms cover your use of Roastube. By signing in or using the site, you agree to them.
      </p>

      <h2>It&apos;s a joke</h2>
      <p>
        Roastube is for entertainment. Roasts are written by an AI from a summary of your YouTube
        activity. They are exaggerated on purpose, may be inaccurate, and are not an assessment of
        you as a person. Don&apos;t take them as advice of any kind.
      </p>
      <p>
        The Extra crispy heat level is deliberately harsh. You choose it, and it stays about what
        you watch: it never targets who you are, how you look, your health or your beliefs. If a
        roast crosses that line anyway, it&apos;s a bug, and we&apos;d like to hear about it.
      </p>

      <h2>YouTube and Google</h2>
      <p>
        Roastube uses YouTube API Services. By using Roastube you agree to be bound by the{" "}
        <a href="https://www.youtube.com/t/terms" className="link text-text">
          YouTube Terms of Service
        </a>
        . Roastube isn&apos;t affiliated with, endorsed by or sponsored by YouTube or Google.
      </p>

      <h2>Your account and data</h2>
      <p>
        You must be allowed to use YouTube where you live and be at least 13. Only connect a Google
        account that you own. How we handle your data is described in the{" "}
        <Link href="/privacy" className="link text-text">
          privacy policy
        </Link>
        . You can revoke access at any time from your Google Account.
      </p>

      <h2>Fair use</h2>
      <ul>
        <li>Don&apos;t try to break, overload or reverse-engineer the service.</li>
        <li>Don&apos;t use Roastube to harass anyone, or post someone else&apos;s roast to embarrass them.</li>
        <li>We may limit how many roasts each account can make per day.</li>
      </ul>

      <h2>Sharing</h2>
      <p>
        Share images you create are yours to post. They include the roast text and the Roastube name.
        You&apos;re responsible for what you choose to share.
      </p>

      <h2>No warranty</h2>
      <p>
        Roastube is provided as is, without warranties of any kind. It may be unavailable, slow or
        wrong. To the extent the law allows, we aren&apos;t liable for any indirect or consequential
        damages from using it, including hurt feelings.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. If we do, we&apos;ll change the date at the top. Continuing to use
        Roastube means you accept the new version. Questions:{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="link text-text">
          {SITE.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
