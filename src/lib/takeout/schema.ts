import { z } from "zod";

/**
 * What the browser sends after reading a Google Takeout export. The raw files never leave
 * the device; this summary is all the server sees, and it's validated with hard caps.
 */
export const TakeoutDigestSchema = z.object({
  watchCount: z.number().int().min(0).max(10_000_000),
  firstWatched: z.string().max(40).nullable(),
  lastWatched: z.string().max(40).nullable(),
  /** Share of watches between 00:00 and 04:00 in the viewer's local time, 0..1. */
  lateNightShare: z.number().min(0).max(1).nullable(),
  topChannels: z
    .array(z.object({ name: z.string().max(100), count: z.number().int().min(0) }))
    .max(15),
  mostRewatched: z
    .object({
      title: z.string().max(150),
      channel: z.string().max(100).nullable(),
      count: z.number().int().min(1),
    })
    .nullable(),
  sampleTitles: z.array(z.string().max(150)).max(80),
  searchCount: z.number().int().min(0),
  sampleSearches: z.array(z.string().max(100)).max(40),
  commentCount: z.number().int().min(0),
  sampleComments: z.array(z.string().max(120)).max(8),
});

export type TakeoutDigest = z.infer<typeof TakeoutDigestSchema>;
