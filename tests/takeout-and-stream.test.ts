// Late-night share depends on local time, so pin the zone before any Date is created.
process.env.TZ = "UTC";

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { streamRoast } from "@/lib/roast-client";
import { parseCsv, summarizeComments, summarizeSearchHistory, summarizeWatchHistory, type HistoryEntry } from "@/lib/takeout/parse";
import { TakeoutDigestSchema } from "@/lib/takeout/schema";

const watch = (title: string, time: string, channel = "Snack Stack", v = title): HistoryEntry => ({
  header: "YouTube",
  title: `Watched ${title}`,
  titleUrl: `https://www.youtube.com/watch?v=${encodeURIComponent(v)}`,
  subtitles: [{ name: channel, url: "https://www.youtube.com/channel/x" }],
  time,
});

describe("watch history", () => {
  const entries: HistoryEntry[] = [
    watch("Gas station hot dog review", "2026-10-15T02:10:00Z", "Snack Stack", "hotdog"),
    watch("Gas station hot dog review", "2026-10-14T03:30:00Z", "Snack Stack", "hotdog"),
    watch("Gas station hot dog review", "2026-10-13T14:00:00Z", "Snack Stack", "hotdog"),
    watch("Deep sea mysteries", "2026-10-12T12:00:00Z", "Deep Sea Files"),
    watch("Funeral of a legend", "2026-10-11T12:00:00Z", "Some Channel"),
    { header: "YouTube", title: "Watched a video that has been removed", time: "2026-10-10T12:00:00Z" },
    { header: "YouTube", title: "Watched Buy our thing", time: "2026-10-09T12:00:00Z", details: [{ name: "From Google Ads" }] },
    watch("First ever video", "2023-03-01T12:00:00Z", "Old Channel"),
  ];
  const s = summarizeWatchHistory(entries);

  it("counts watches without ads", () => assert.equal(s.watchCount, 7));
  it("measures midnight to 4am", () => assert.equal(s.lateNightShare, 2 / 7));
  it("finds the most rewatched video", () => assert.deepEqual(s.mostRewatched, { title: "Gas station hot dog review", channel: "Snack Stack", count: 3 }));
  it("ranks channels", () => assert.deepEqual(s.topChannels[0], { name: "Snack Stack", count: 3 }));
  it("spans the right dates", () => {
    assert.equal(s.firstWatched, "Mar 2023");
    assert.equal(s.lastWatched, "Oct 2026");
  });
  it("drops removed videos and sensitive titles from the sample", () => {
    assert.ok(!s.sampleTitles.some((t) => /removed|Funeral/i.test(t)));
    assert.ok(s.sampleTitles.includes("Deep sea mysteries"));
  });
});

describe("search history", () => {
  it("strips the prefix and dedupes", () => {
    const out = summarizeSearchHistory([
      { title: "Searched for productive morning routine", time: "2026-10-15T06:00:00Z" },
      { title: "Searched for productive morning routine", time: "2026-10-14T06:00:00Z" },
      { title: "Searched for cat videos", time: "2026-10-13T06:00:00Z" },
      { title: "Watched something", time: "2026-10-12T06:00:00Z" },
    ]);
    assert.equal(out.searchCount, 3);
    assert.deepEqual(out.sampleSearches, ["productive morning routine", "cat videos"]);
  });
});

describe("comments", () => {
  it("parses quoted CSV with commas and newlines", () => {
    assert.deepEqual(parseCsv('a,"b,c","d ""e"""\n1,"two\nlines",3\n'), [
      ["a", "b,c", 'd "e"'],
      ["1", "two\nlines", "3"],
    ]);
  });
  it("reads the comment text column and scrubs links, emails and handles", () => {
    const csv = [
      "Comment ID,Channel ID,Comment create timestamp,Price,Parent comment ID,Post ID,Video ID,Comment text",
      'c1,ch,2026-01-01,,,,v1,"{""text"":""first lol @someone https://x.com/a""}"',
      'c2,ch,2026-01-02,,,,v2,"{""text"":""mail me at me@example.com""}"',
      'c3,ch,2026-01-03,,,,v3,"{""text"":""this changed my life""}"',
    ].join("\n");
    const out = summarizeComments(csv);
    assert.equal(out.commentCount, 3);
    assert.ok(out.sampleComments.includes("first lol"));
    assert.ok(!out.sampleComments.some((c) => /@|https?:/.test(c)));
  });
});

describe("digest schema", () => {
  it("rejects oversized payloads", () => {
    const big = { watchCount: 1, firstWatched: null, lastWatched: null, lateNightShare: null, topChannels: [], mostRewatched: null, sampleTitles: Array(200).fill("x"), searchCount: 0, sampleSearches: [], commentCount: 0, sampleComments: [] };
    assert.equal(TakeoutDigestSchema.safeParse(big).success, false);
  });
});

describe("streamRoast", () => {
  it("reassembles events split across chunks", async () => {
    const lines = '{"type":"step","step":"likes"}\n{"type":"step","step":"gemini"}\n{"type":"error","code":"rate_limited"}\n';
    const chunks = [lines.slice(0, 10), lines.slice(10, 47), lines.slice(47)];
    const original = globalThis.fetch;
    globalThis.fetch = (async () =>
      new Response(
        new ReadableStream({
          start(c) {
            for (const ch of chunks) c.enqueue(new TextEncoder().encode(ch));
            c.close();
          },
        }),
        { status: 200 },
      )) as typeof fetch;
    try {
      const events = [];
      for await (const e of streamRoast({ intensity: "toasty" })) events.push(e);
      assert.deepEqual(events, [
        { type: "step", step: "likes" },
        { type: "step", step: "gemini" },
        { type: "error", code: "rate_limited" },
      ]);
    } finally {
      globalThis.fetch = original;
    }
  });
});
