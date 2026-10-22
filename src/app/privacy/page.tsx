import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "What Roastube reads, what it sends to the AI, and what it keeps (none of your data).",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy policy" updated={SITE.policyUpdated}>
      <p>
        Roastube is a comedy app. You sign in with Google, it reads your YouTube activity, and an
        AI writes a roast of your viewing habits. This page explains exactly what that involves.
        The short version: read-only access, a summary goes to the AI, and none of your data is
        stored on our servers.
      </p>

      <h2>What we ask Google for</h2>
      <p>When you sign in, Roastube requests these permissions:</p>
      <ul>
        <li>
          <strong>Basic sign-in</strong> (<code>openid</code>, <code>email</code>,{" "}
          <code>profile</code>): to confirm who is signed in and keep you signed in. Your name and
          email are never sent to the AI.
        </li>
        <li>
          <strong>View your YouTube account</strong> (<code>youtube.readonly</code>): read-only
          access, used for one thing, which is reading your liked videos, your subscriptions and
          the names of your playlists to build your roast. Roastube can&apos;t post, comment, like,
          subscribe, upload or delete anything.
        </li>
      </ul>
      <p>
        Roastube uses YouTube API Services. By using Roastube you also agree to the{" "}
        <a href="https://www.youtube.com/t/terms" className="link text-text">
          YouTube Terms of Service
        </a>
        , and Google&apos;s handling of your data is covered by the{" "}
        <a href="https://policies.google.com/privacy" className="link text-text">
          Google Privacy Policy
        </a>
        .
      </p>

      <h2>What we read from YouTube</h2>
      <ul>
        <li>Up to about 200 of your most recently liked videos: title, channel name, category and length.</li>
        <li>Up to about 200 of your subscriptions: channel names.</li>
        <li>Your playlists: names and how many videos each one holds.</li>
        <li>
          Your channel name and channel picture, if you have them. These are only shown on your roast
          and on the share image, which is drawn in your browser. They are never sent to the AI.
        </li>
      </ul>
      <p>We read this when you ask for a roast, use it to make that roast, and then discard it.</p>

      <h2>Share images</h2>
      <p>
        Share images are made in your browser. Nothing is uploaded when you download or copy one.
        When you pick an app like X, WhatsApp or Telegram, we open that app&apos;s own share page with
        the text of your roast; what you post there is covered by that app&apos;s policies. If you
        pick a cartoon avatar instead of your picture, that choice is remembered in your browser only.
      </p>

      <h2>What we send to the AI</h2>
      <p>
        Roastube computes statistics in code (for example, the share of your likes under three
        minutes, or how concentrated your likes are in a few channels) and builds a short summary.
        That summary, plus a sample of up to about 150 liked video titles with their channel names,
        some subscription and playlist names, is sent to Google&apos;s Gemini API to write the roast.
      </p>
      <p>
        The summary never includes your name, your email address or your channel ID. Before it&apos;s
        sent, we drop titles that clearly relate to health, mental health, grief, religion,
        sexuality or politics, and the AI is instructed never to joke about those topics.
      </p>
      <p>
        <strong>Gemini free tier.</strong> Roastube uses the free tier of the Gemini API. Under
        Google&apos;s terms for unpaid services, Google may use the content we submit (the summary and
        titles described above) and the generated roast to provide, improve and develop its
        products, and human reviewers may read it. That&apos;s one reason we never include anything
        that identifies you.
      </p>

      <h2>Nuclear mode and Google Takeout</h2>
      <p>
        If you use nuclear mode, you export your own watch and search history from Google Takeout
        and add the files to Roastube. Those files are read entirely in your browser. They are never
        uploaded. Only the computed summary (statistics plus a sample of titles, channel names and
        searches, with the same filtering as above) is sent to make the roast.
      </p>
      <p>
        If you include your comments file, we keep only how many comments you&apos;ve written and up
        to eight short snippets, with links, email addresses and @handles removed first. The summary
        is held in your browser tab until the roast is made and disappears when you close the tab.
      </p>

      <h2>What we store</h2>
      <ul>
        <li>
          <strong>On our servers: none of your data.</strong> No copies of your YouTube data, no
          saved roasts, and no list of who has used Roastube.
        </li>
        <li>
          <strong>In your browser:</strong> your latest roast is saved in your browser&apos;s local
          storage so it survives a reload, kept separately for each account. Signing out clears it,
          and so does clearing your site data.
        </li>
        <li>
          <strong>Sign-in cookie:</strong> an encrypted session cookie keeps you signed in. It holds
          the Google access token Roastube uses to read YouTube on your behalf. The token is only
          ever read on our server and is never exposed to the page. Sessions end after 55 minutes,
          before the token itself expires, and we never ask for or keep a long-lived refresh token.
          Signing out deletes the cookie.
        </li>
        <li>
          <strong>Rate limiting:</strong> to keep the free AI quota fair, we may count roasts per
          account per day. That counter is keyed by a one-way hash of your Google account ID and
          expires within 24 hours.
        </li>
        <li>
          <strong>Usage counts:</strong> we count how many roasts are made each day, which level
          was picked and whether nuclear mode was used. To estimate how many different accounts
          made roasts, the same one-way hash goes into a counting method (HyperLogLog) that keeps
          only an approximate total, not the hashes, so it can&apos;t list or look up anyone. Daily
          counts are deleted after about 13 months.
        </li>
        <li>
          <strong>Visitor analytics:</strong> we use{" "}
          <a href="https://vercel.com/docs/analytics/privacy-policy" className="link text-text">
            Vercel Web Analytics
          </a>{" "}
          to count page views. Each view records the page, the site you came from, your approximate
          location (country, region, city), browser, operating system and device type. It uses no
          cookies and isn&apos;t linked to your Google account; visits are told apart by a hash of
          the request that is discarded after 24 hours.
        </li>
        <li>
          <strong>Hosting logs:</strong> our host keeps standard request logs (like IP address and
          time of request) for a short period for security and reliability.
        </li>
      </ul>
      <p>We don&apos;t sell, rent or share your data, and we don&apos;t use it for advertising.</p>
      <p>
        Roastube&apos;s use and transfer of information received from Google APIs adheres to the{" "}
        <a
          href="https://developers.google.com/terms/api-services-user-data-policy"
          className="link text-text"
        >
          Google API Services User Data Policy
        </a>
        , including the Limited Use requirements.
      </p>

      <h2>How we protect your data</h2>
      <p>We treat your Google user data as confidential and protect it with these safeguards:</p>
      <ul>
        <li>
          <strong>Encryption in transit:</strong> Roastube is served only over HTTPS, and plain
          HTTP is redirected to HTTPS. Our server also uses encrypted HTTPS connections to reach
          the YouTube Data API, the Gemini API and our rate-limit database.
        </li>
        <li>
          <strong>Encrypted session:</strong> your sign-in cookie is encrypted with AES-256 using a
          secret only our server knows, so it can&apos;t be read or changed by anyone else. It is
          marked HttpOnly and Secure: scripts on the page can&apos;t read it, and it&apos;s only
          sent over HTTPS.
        </li>
        <li>
          <strong>The access token stays on our server:</strong> your Google access token is used
          only by our server to call YouTube. It is never sent to the page, written to logs or
          shared. Sessions end after 55 minutes, and we never ask for a long-lived refresh token.
        </li>
        <li>
          <strong>Least privilege:</strong> we ask only for read-only YouTube access
          (<code>youtube.readonly</code>), so Roastube can&apos;t change anything in your account.
        </li>
        <li>
          <strong>Data minimization:</strong> your YouTube data is processed in memory for the one
          request that makes your roast, then discarded. It is never written to a database or our
          logs. Only a summary goes to the AI, without your name, email or channel ID, and titles
          on sensitive topics are removed first.
        </li>
        <li>
          <strong>One-way hashing:</strong> where we need to tell accounts apart (the daily roast
          limit and usage counts), we store only a SHA-256 hash of your Google account ID, never
          the ID itself.
        </li>
        <li>
          <strong>Restricted access:</strong> API keys and secrets are kept in our host&apos;s
          encrypted environment settings and never reach the browser. Only the Roastube developer
          can access our hosting, database and API accounts.
        </li>
      </ul>

      <h2>How to revoke access</h2>
      <p>
        Sign out of Roastube at any time. To remove Roastube&apos;s access completely, go to your
        Google Account, open <strong>Security</strong>, then <strong>Your connections to
        third-party apps and services</strong> (also shown as Third-party connections), choose
        Roastube and remove access. You can go there directly at{" "}
        <a
          href="https://myaccount.google.com/connections"
          className="link text-text"
        >
          myaccount.google.com/connections
        </a>
        .
      </p>

      <h2>Children</h2>
      <p>Roastube is not intended for anyone under 13, or the minimum age to use YouTube where you live.</p>

      <h2>Changes and contact</h2>
      <p>
        If this policy changes, we&apos;ll update the date at the top. Questions or requests:{" "}
        <a href={`mailto:${SITE.contactEmail}`} className="link text-text">
          {SITE.contactEmail}
        </a>
        .
      </p>
    </LegalPage>
  );
}
