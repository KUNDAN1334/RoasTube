"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TOON_AVATARS } from "@/components/avatars/ToonAvatar";
import { UserAvatar, YOUTUBE_AVATAR } from "@/components/avatars/UserAvatar";
import type { RoastResult } from "@/lib/types";
import { PLATFORM_NAME, PlatformIcon } from "./PlatformIcon";
import { SHARE_SIZES, ShareCard, type ShareFormat } from "./ShareCard";
import {
  canShareFilesNatively,
  capture,
  copyImage,
  download,
  fileName,
  pasteShortcut,
  PLATFORMS,
  type PlatformSpec,
} from "./share-actions";

const FORMATS: ShareFormat[] = ["story", "square", "wide"];

type Status = { text: string; link?: { href: string; label: string } } | null;

/** The host worth printing on a share image. Local and dev hosts would just confuse people. */
function publicHost(location: Location) {
  const { hostname, host } = location;
  const local = hostname === "localhost" || hostname.endsWith(".local") || /^(127\.|10\.|192\.168\.|\[?::1)/.test(hostname);
  return local ? null : host;
}

/** Scales a full-size share card down to fit the preview box. */
function ScaledPreview({ format, children }: { format: ShareFormat; children: ReactNode }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const { width, height } = SHARE_SIZES[format];

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) =>
      setBox({ w: entry.contentRect.width, h: entry.contentRect.height }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = box.w && box.h ? Math.min(box.w / width, box.h / height) : 0;
  return (
    <div ref={boxRef} className="grid h-full w-full place-items-center">
      {scale > 0 && (
        <div
          className="overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,.6)] ring-1 ring-white/10"
          style={{ width: width * scale, height: height * scale }}
        >
          <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

export function ShareSheet({
  open,
  onClose,
  result,
  avatarChoice,
  onAvatarChange,
}: {
  open: boolean;
  onClose: () => void;
  result: RoastResult;
  avatarChoice: string;
  onAvatarChange: (choice: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const nodes = useRef<Partial<Record<ShareFormat, HTMLDivElement | null>>>({});
  const [format, setFormat] = useState<ShareFormat>("story");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [native, setNative] = useState(false);
  const host = typeof window === "undefined" ? null : publicHost(window.location);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setNative(canShareFilesNatively());
      setStatus(null);
      dialog.showModal();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const text = result.roast.shareLine;
  const url = typeof window === "undefined" ? "" : window.location.origin;

  function blobFor(f: ShareFormat) {
    const node = nodes.current[f];
    if (!node) return Promise.reject(new Error("Share card not rendered"));
    return capture(node, f);
  }

  async function nativeShare(f: ShareFormat) {
    const blob = await blobFor(f);
    const file = new File([blob], fileName(f), { type: "image/png" });
    try {
      await navigator.share({ files: [file], text: `${text} ${url}` });
      setStatus({ text: "Shared. No take-backs." });
    } catch (err) {
      if (!(err instanceof DOMException && err.name === "AbortError")) throw err;
    }
  }

  async function run(work: () => Promise<void>) {
    setBusy(true);
    setStatus({ text: "Printing your roast…" });
    try {
      await work();
    } catch (err) {
      console.error(err);
      setStatus({ text: "Couldn't make the image. Try again, or take a screenshot." });
    } finally {
      setBusy(false);
    }
  }

  function onPlatform(p: PlatformSpec) {
    const name = PLATFORM_NAME[p.id];
    setFormat(p.format);

    if (native) {
      void run(() => nativeShare(p.format));
      return;
    }

    if (p.handoff === "download") {
      void run(async () => {
        download(await blobFor(p.format), fileName(p.format));
        setStatus({ text: `Saved the ${SHARE_SIZES[p.format].label.toLowerCase()} image. Post it to ${name} from your phone.` });
      });
      return;
    }

    // Start the clipboard write inside the click so the browser still counts it as user-initiated.
    const blob = blobFor(p.format);
    const copied = copyImage(blob);
    void run(async () => {
      const ok = await copied;
      if (!ok) {
        download(await blob, fileName(p.format));
      }
      const intent = p.intent?.(text, url);
      // No "noopener" feature here: it makes window.open return null even when the tab opens.
      const opened = intent ? window.open(intent, "_blank") : null;
      if (opened) opened.opener = null;
      const how = ok
        ? `Image copied. Paste it into ${name} with ${pasteShortcut()}.`
        : `Image saved. Attach it in ${name}.`;
      setStatus(
        intent && !opened ? { text: how, link: { href: intent, label: `Open ${name}` } } : { text: how },
      );
    });
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => e.target === dialogRef.current && onClose()}
      aria-labelledby="share-title"
      className="m-auto w-[min(60rem,calc(100%-2rem))] max-w-none overflow-visible bg-transparent p-0 text-text backdrop:bg-black/75 backdrop:backdrop-blur-sm max-sm:mb-0 max-sm:w-full"
    >
      <div className="grid max-h-[92dvh] overflow-y-auto rounded-[2rem] bg-card ring-1 ring-white/10 max-sm:rounded-b-none md:grid-cols-[1fr_22rem]">
        <div className="relative h-[17rem] bg-card-2 p-5 sm:h-[22rem] md:h-auto md:min-h-[34rem] md:p-8">
          <ScaledPreview format={format}>
            <ShareCard result={result} format={format} avatarChoice={avatarChoice} siteHost={host} />
          </ScaledPreview>
        </div>

        <div className="flex flex-col gap-6 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <h2 id="share-title" className="text-[1.375rem] font-semibold tracking-[-0.02em]">
              Share your roast
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mt-1 -mr-1 grid h-9 w-9 place-items-center rounded-full bg-card-3 hover:bg-white/15"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <ul className="grid grid-cols-3 gap-2">
            {PLATFORMS.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onPlatform(p)}
                  className="flex w-full flex-col items-center gap-2 rounded-2xl bg-card-2 px-2 py-3.5 font-rounded text-sm font-semibold transition-colors hover:bg-card-3 disabled:cursor-progress disabled:opacity-60"
                >
                  <PlatformIcon platform={p.id} size={24} />
                  {PLATFORM_NAME[p.id]}
                </button>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={busy}
              className="btn btn-flame"
              onClick={() =>
                void run(async () => {
                  download(await blobFor(format), fileName(format));
                  setStatus({ text: "Saved. Post it somewhere you'll regret." });
                })
              }
            >
              Download
            </button>
            {native ? (
              <button type="button" disabled={busy} className="btn btn-ghost" onClick={() => void run(() => nativeShare(format))}>
                More apps
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                className="btn btn-ghost"
                onClick={() => {
                  const copied = copyImage(blobFor(format));
                  void run(async () => {
                    setStatus({ text: (await copied) ? "Copied. Paste it anywhere." : "Your browser blocked copying. Use Download instead." });
                  });
                }}
              >
                Copy image
              </button>
            )}
          </div>

          <p aria-live="polite" className="-mt-2 min-h-[1.25rem] text-sm text-muted">
            {status?.text}{" "}
            {status?.link && (
              <a href={status.link.href} target="_blank" rel="noreferrer" className="link text-text">
                {status.link.label}
              </a>
            )}
          </p>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-muted">Image size</legend>
            <div className="inline-flex rounded-full bg-card-2 p-1">
              {FORMATS.map((f) => (
                <label
                  key={f}
                  className="cursor-pointer rounded-full px-4 py-1.5 font-rounded text-sm font-bold text-muted has-checked:bg-paper has-checked:text-ink has-focus-visible:outline-3 has-focus-visible:outline-toaster"
                >
                  <input type="radio" name="share-format" value={f} checked={format === f} onChange={() => setFormat(f)} className="sr-only" />
                  {SHARE_SIZES[f].label}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-muted">Your face on the image</legend>
            <div className="flex flex-wrap gap-2">
              {result.profile.avatar && (
                <AvatarOption
                  value={YOUTUBE_AVATAR}
                  label="Your YouTube picture"
                  checked={avatarChoice === YOUTUBE_AVATAR}
                  onChange={onAvatarChange}
                >
                  <UserAvatar choice={YOUTUBE_AVATAR} photo={result.profile.avatar} size={40} ring={false} />
                </AvatarOption>
              )}
              {TOON_AVATARS.map((a) => (
                <AvatarOption key={a.id} value={a.id} label={a.label} checked={avatarChoice === a.id} onChange={onAvatarChange}>
                  <UserAvatar choice={a.id} photo={null} size={40} ring={false} />
                </AvatarOption>
              ))}
            </div>
          </fieldset>
        </div>
      </div>

      {/* Full-size cards for capture, kept off-screen. */}
      <div aria-hidden="true" className="pointer-events-none fixed top-0 -left-[20000px]">
        {FORMATS.map((f) => (
          <ShareCard
            key={f}
            ref={(el) => {
              nodes.current[f] = el;
            }}
            result={result}
            format={f}
            avatarChoice={avatarChoice}
            siteHost={host}
          />
        ))}
      </div>
    </dialog>
  );
}

function AvatarOption({
  value,
  label,
  checked,
  onChange,
  children,
}: {
  value: string;
  label: string;
  checked: boolean;
  onChange: (v: string) => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`cursor-pointer rounded-full p-0.5 ring-2 transition-shadow has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-toaster ${
        checked ? "ring-toaster" : "ring-transparent hover:ring-white/30"
      }`}
    >
      <input type="radio" name="share-avatar" value={value} checked={checked} onChange={() => onChange(value)} className="sr-only" aria-label={label} />
      {children}
    </label>
  );
}
