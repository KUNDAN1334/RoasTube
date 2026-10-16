import { unzip, type Unzipped } from "fflate";
import {
  emptyDigest,
  summarizeComments,
  summarizeSearchHistory,
  summarizeWatchHistory,
  type HistoryEntry,
} from "./parse";
import type { TakeoutDigest } from "./schema";

export type TakeoutReadResult =
  | { ok: true; digest: TakeoutDigest; found: { watch: boolean; search: boolean; comments: boolean } }
  | { ok: false; reason: "html" | "nothing" | "unreadable" };

type Kind = "watch" | "search" | "comments" | "html" | null;

function kindOf(name: string): Kind {
  const lower = name.toLowerCase();
  if (lower.endsWith("watch-history.html") || lower.endsWith("search-history.html")) return "html";
  if (lower.endsWith("watch-history.json")) return "watch";
  if (lower.endsWith("search-history.json")) return "search";
  if (lower.endsWith(".csv") && lower.includes("comment")) return "comments";
  return null;
}

/** Only pulls the history and comment files out of the zip, skipping videos and the rest. */
function unzipHistory(data: Uint8Array) {
  return new Promise<Unzipped>((resolve, reject) =>
    unzip(data, { filter: (f) => kindOf(f.name) !== null }, (err, files) => (err ? reject(err) : resolve(files))),
  );
}

/** A JSON file that wasn't named as expected can still be history; peek at its titles. */
function sniffJson(entries: unknown): Kind {
  if (!Array.isArray(entries)) return null;
  const titles = entries.slice(0, 50).map((e) => (e as HistoryEntry)?.title ?? "");
  if (titles.some((t) => /^Searched for /i.test(t))) return "search";
  if (titles.some((t) => /^Watched /i.test(t))) return "watch";
  return null;
}

/**
 * Reads whatever the person dropped: loose JSON/CSV files or the whole Takeout zip.
 * Everything happens in this tab; nothing is uploaded.
 */
export async function readTakeout(files: File[]): Promise<TakeoutReadResult> {
  const texts: { kind: Kind; text: string }[] = [];
  const decoder = new TextDecoder();

  try {
    for (const file of files) {
      if (file.name.toLowerCase().endsWith(".zip")) {
        const unzipped = await unzipHistory(new Uint8Array(await file.arrayBuffer()));
        for (const [name, bytes] of Object.entries(unzipped)) texts.push({ kind: kindOf(name), text: decoder.decode(bytes) });
      } else {
        texts.push({ kind: kindOf(file.name), text: await file.text() });
      }
    }
  } catch {
    return { ok: false, reason: "unreadable" };
  }

  if (texts.length && texts.every((t) => t.kind === "html")) return { ok: false, reason: "html" };

  const digest = emptyDigest();
  const found = { watch: false, search: false, comments: false };

  for (const { kind, text } of texts) {
    if (kind === "comments") {
      Object.assign(digest, summarizeComments(text));
      found.comments = true;
      continue;
    }
    if (kind === "html") continue;
    let entries: unknown;
    try {
      entries = JSON.parse(text);
    } catch {
      continue;
    }
    const resolved = kind ?? sniffJson(entries);
    if (resolved === "watch" && Array.isArray(entries)) {
      Object.assign(digest, summarizeWatchHistory(entries as HistoryEntry[]));
      found.watch = true;
    } else if (resolved === "search" && Array.isArray(entries)) {
      Object.assign(digest, summarizeSearchHistory(entries as HistoryEntry[]));
      found.search = true;
    }
  }

  if (!found.watch && !found.search && !found.comments) {
    return { ok: false, reason: texts.some((t) => t.kind === "html") ? "html" : "nothing" };
  }
  return { ok: true, digest, found };
}
