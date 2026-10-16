export class RoastGenerationError extends Error {
  constructor(
    readonly kind: "rate_limited" | "unknown",
    message: string,
  ) {
    super(message);
  }
}

/**
 * Tries the primary model, and on any failure tries the fallback once. If either attempt was
 * rate limited (429), the result is "rate_limited", which the UI shows as "the roast oven is
 * full". Anything else that fails both times is "unknown". Aborts are rethrown untouched.
 */
export async function generateWithFallback<T>(opts: {
  primary: string;
  fallback: string;
  call: (model: string) => Promise<T>;
  /** HTTP status of an error, when it has one. */
  statusOf: (err: unknown) => number | undefined;
  aborted?: () => boolean;
  onFallback?: (err: unknown) => void;
}): Promise<T> {
  let first: unknown;
  try {
    return await opts.call(opts.primary);
  } catch (err) {
    if (opts.aborted?.()) throw err;
    first = err;
    opts.onFallback?.(err);
  }
  try {
    return await opts.call(opts.fallback);
  } catch (err) {
    if (opts.aborted?.()) throw err;
    if (opts.statusOf(first) === 429 || opts.statusOf(err) === 429) {
      throw new RoastGenerationError("rate_limited", "Both models failed and at least one was rate limited");
    }
    throw new RoastGenerationError("unknown", err instanceof Error ? err.message : "Roast generation failed");
  }
}
