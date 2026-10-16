import { ToonAvatar } from "@/components/avatars/ToonAvatar";
import { DONENESS_GRADIENT } from "@/lib/doneness";

/** A small, static preview of a roast board, labelled as an example. */
export function MiniRoastCard({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-[20rem] rounded-[1.75rem] bg-card p-5 shadow-[0_30px_60px_rgba(0,0,0,.6)] ring-1 ring-white/10 ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="rounded-full ring-[3px] ring-paper">
          <ToonAvatar avatarId="a7" size={34} className="block" />
        </span>
        <p className="text-sm font-semibold">Example roast</p>
        <span className="ml-auto rounded-full bg-flame px-2.5 py-1 font-rounded text-xs font-extrabold text-ink">
          Extra crispy
        </span>
      </div>
      <p className="mt-4 text-[1.25rem] leading-[1.2] font-semibold tracking-[-0.02em]">
        You don&apos;t have a watch history. You have a crime scene.
      </p>
      <div className="mt-4 flex items-end gap-2">
        <p className="text-[2.75rem] leading-none font-bold tracking-[-0.04em]">89</p>
        <p className="pb-1 text-sm text-muted">/100 · Charcoal</p>
      </div>
      <div className="mt-2.5 h-2.5 overflow-hidden rounded-full bg-card-3">
        <div className="h-full rounded-full" style={{ width: "89%", background: DONENESS_GRADIENT }} />
      </div>
      <ul className="mt-4 grid gap-2 text-sm">
        <li className="flex gap-2">
          <FlagGlyph />
          3am is prime time
        </li>
        <li className="flex gap-2">
          <FlagGlyph />
          Allergic to anything over a minute
        </li>
      </ul>
    </div>
  );
}

export function FlagGlyph({ className = "h-4 w-4 shrink-0 translate-y-0.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M3 15V1.5" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" />
      <path d="M3.5 2.2Q8 0.6 13 2.4L11 6.2L13 10Q8 8.4 3.5 10Z" fill="var(--flame)" />
    </svg>
  );
}
