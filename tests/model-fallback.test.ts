import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { generateWithFallback, RoastGenerationError } from "@/lib/roast/model-fallback";

const httpError = (status: number) => Object.assign(new Error(`HTTP ${status}`), { status });
const statusOf = (err: unknown) => (err as { status?: number }).status;

function run(behaviour: Record<string, () => Promise<string>>) {
  const calls: string[] = [];
  const promise = generateWithFallback({
    primary: "flash",
    fallback: "lite",
    call: (model) => {
      calls.push(model);
      return behaviour[model]();
    },
    statusOf,
  });
  return { promise, calls };
}

async function kindOf(promise: Promise<unknown>) {
  try {
    await promise;
    return "ok";
  } catch (err) {
    return err instanceof RoastGenerationError ? err.kind : "raw";
  }
}

describe("generateWithFallback", () => {
  it("uses the primary model when it works", async () => {
    const { promise, calls } = run({ flash: async () => "roast", lite: async () => "lite roast" });
    assert.equal(await promise, "roast");
    assert.deepEqual(calls, ["flash"]);
  });

  it("falls back once on a 429", async () => {
    const { promise, calls } = run({ flash: () => Promise.reject(httpError(429)), lite: async () => "lite roast" });
    assert.equal(await promise, "lite roast");
    assert.deepEqual(calls, ["flash", "lite"]);
  });

  it("reports the oven as full when the fallback also fails after a 429", async () => {
    assert.equal(await kindOf(run({ flash: () => Promise.reject(httpError(429)), lite: () => Promise.reject(httpError(429)) }).promise), "rate_limited");
    assert.equal(await kindOf(run({ flash: () => Promise.reject(httpError(429)), lite: () => Promise.reject(httpError(503)) }).promise), "rate_limited");
  });

  it("falls back on bad output too, and calls a double non-429 failure unknown", async () => {
    const bad = run({ flash: () => Promise.reject(new SyntaxError("Unexpected token")), lite: async () => "lite roast" });
    assert.equal(await bad.promise, "lite roast");
    assert.equal(await kindOf(run({ flash: () => Promise.reject(httpError(500)), lite: () => Promise.reject(new Error("zod")) }).promise), "unknown");
  });

  it("doesn't retry once the request is aborted", async () => {
    const calls: string[] = [];
    const abort = new Error("aborted");
    const promise = generateWithFallback({
      primary: "flash",
      fallback: "lite",
      call: (model) => (calls.push(model), Promise.reject(abort)),
      statusOf,
      aborted: () => true,
    });
    await assert.rejects(promise, (err) => err === abort);
    assert.deepEqual(calls, ["flash"]);
  });
});
