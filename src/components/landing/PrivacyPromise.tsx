import Link from "next/link";

const PROMISES = [
  {
    title: "Read-only",
    body: "Crispy can see your likes, subscriptions and playlists. He can't post, like or delete anything.",
  },
  {
    title: "Anonymous to the AI",
    body: "The AI gets stats and video titles. Never your name, email or channel ID.",
  },
  {
    title: "Nothing stored",
    body: "No database. Your roast lives in your browser and nowhere else.",
  },
  {
    title: "Leave anytime",
    body: "Revoke access from your Google Account in two clicks.",
  },
];

export function PrivacyPromise() {
  return (
    <section aria-labelledby="promise-title" className="mx-auto max-w-6xl px-5 pt-28 md:px-10 md:pt-40">
      <div className="card p-7 md:p-12">
        <h2 id="promise-title" className="text-h2 font-semibold text-balance">
          Brutal roasts. Gentle with your data.
        </h2>
        <Link href="/privacy" className="link mt-4 inline-block font-rounded font-semibold">
          Read the privacy policy
        </Link>
        <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
          {PROMISES.map((p) => (
            <li key={p.title} className="border-t border-line pt-5">
              <p className="font-semibold">{p.title}</p>
              <p className="mt-1.5 text-muted">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
