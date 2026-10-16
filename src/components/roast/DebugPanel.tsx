"use client";

import type { DebugInfo } from "@/lib/roast-client";

/** Development only (`?debug=1`): the computed stats and the exact digest sent to the model. */
export function DebugPanel({ info }: { info: DebugInfo }) {
  return (
    <details className="card mt-4 mb-28 p-5 text-sm md:mb-6">
      <summary className="cursor-pointer font-semibold">
        Debug: base score {info.baseScore}, digest {info.digest.length.toLocaleString()} characters
      </summary>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <pre className="max-h-[28rem] overflow-auto rounded-xl bg-card-2 p-4 text-xs whitespace-pre-wrap text-white/80">
          {JSON.stringify(info.stats, null, 2)}
        </pre>
        <pre className="max-h-[28rem] overflow-auto rounded-xl bg-card-2 p-4 text-xs whitespace-pre-wrap text-white/80">
          {info.digest}
        </pre>
      </div>
    </details>
  );
}
