import { toBlob } from "html-to-image";
import { SHARE_SIZES, type ShareFormat } from "./ShareCard";
import type { Platform } from "./PlatformIcon";

export type PlatformSpec = {
  id: Platform;
  /** The layout that looks best in that app's feed or chat. */
  format: ShareFormat;
  /** Web composer to open after the image is on the clipboard, when the app has one. */
  intent?: (text: string, url: string) => string;
  /** Desktop handoff: paste from the clipboard, or save the file and post from a phone. */
  handoff: "paste" | "download";
};

const enc = encodeURIComponent;

export const PLATFORMS: PlatformSpec[] = [
  { id: "x", format: "wide", handoff: "paste", intent: (t, u) => `https://x.com/intent/post?text=${enc(t)}&url=${enc(u)}` },
  { id: "whatsapp", format: "square", handoff: "paste", intent: (t, u) => `https://wa.me/?text=${enc(`${t} ${u}`)}` },
  { id: "instagram", format: "story", handoff: "download" },
  { id: "discord", format: "wide", handoff: "paste" },
  { id: "slack", format: "wide", handoff: "paste" },
  { id: "telegram", format: "wide", handoff: "paste", intent: (t, u) => `https://t.me/share/url?url=${enc(u)}&text=${enc(t)}` },
];

export async function capture(node: HTMLElement, format: ShareFormat): Promise<Blob> {
  const { width, height } = SHARE_SIZES[format];
  await document.fonts?.ready;
  const blob = await toBlob(node, { width, height, pixelRatio: 1 });
  if (!blob) throw new Error("Capture returned nothing");
  return blob;
}

/**
 * Puts the PNG on the clipboard. Must be called synchronously inside the click handler:
 * the ClipboardItem takes a promise so the user gesture still counts while it renders.
 */
export function copyImage(blob: Promise<Blob>): Promise<boolean> {
  try {
    if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") return Promise.resolve(false);
    return navigator.clipboard
      .write([new ClipboardItem({ "image/png": blob })])
      .then(() => true)
      .catch(() => false);
  } catch {
    return Promise.resolve(false);
  }
}

export function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** True on phones and tablets that can hand an image file straight to another app. */
export function canShareFilesNatively() {
  try {
    const probe = new File([new Blob()], "probe.png", { type: "image/png" });
    return Boolean(navigator.canShare?.({ files: [probe] })) && window.matchMedia("(pointer: coarse)").matches;
  } catch {
    return false;
  }
}

export function pasteShortcut() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘V" : "Ctrl+V";
}

export function fileName(format: ShareFormat) {
  return `roastube-${format}.png`;
}
