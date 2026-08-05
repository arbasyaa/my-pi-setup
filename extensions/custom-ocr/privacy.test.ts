/**
 * Privacy sentinel: in private mode the Luna backend must never be invoked —
 * not on success, and not as a fallback when the private pipeline fails.
 */
import assert from "node:assert/strict";
import test from "node:test";
import type { ResolvedFile } from "./src/files.ts";
import {
  executeParse,
  type ParseDeps,
  type RenderedDocument,
} from "./src/parse.ts";

const file: ResolvedFile = { path: "/tmp/scan.png", kind: "png", size: 1234 };

function makeDoc(cleanupCalls: string[]): RenderedDocument {
  return {
    pages: [{ page: 1, path: "/tmp/render/page-0001.png" }],
    totalPages: 1,
    warnings: [],
    cleanup: async () => {
      cleanupCalls.push("cleanup");
    },
  };
}

function makeDeps(overrides: Partial<ParseDeps>, calls: string[]): ParseDeps {
  return {
    mode: "private",
    resolveFile: async () => file,
    render: async () => makeDoc(calls),
    runLuna: async () => {
      calls.push("luna");
      return "LEAKED";
    },
    runPrivate: async () => {
      calls.push("private");
      return [{ page: 1, text: "local result" }];
    },
    saveFullResult: async () => "/tmp/full.md",
    ...overrides,
  };
}

test("private mode never calls Luna on success", async () => {
  const calls: string[] = [];
  const outcome = await executeParse({ path: "scan.png" }, makeDeps({}, calls));
  assert.equal(outcome.mode, "private");
  assert.equal(outcome.text, "local result");
  assert.ok(
    !calls.includes("luna"),
    "Luna backend was invoked in private mode",
  );
  assert.ok(calls.includes("private"));
  assert.ok(calls.includes("cleanup"), "temp files were not cleaned up");
});

test("private mode fails closed: no Luna fallback when the pipeline breaks", async () => {
  const calls: string[] = [];
  const deps = makeDeps(
    {
      runPrivate: async () => {
        calls.push("private");
        throw new Error("workers unavailable");
      },
    },
    calls,
  );
  await assert.rejects(
    () => executeParse({ path: "scan.png" }, deps),
    /workers unavailable/,
  );
  assert.ok(!calls.includes("luna"), "Luna backend was invoked as a fallback");
  assert.ok(
    calls.includes("cleanup"),
    "temp files were not cleaned up on failure",
  );
});

test("luna mode never calls the private pipeline", async () => {
  const calls: string[] = [];
  const deps = makeDeps({ mode: "luna" }, calls);
  const outcome = await executeParse({ path: "scan.png" }, deps);
  assert.equal(outcome.text, "LEAKED");
  assert.ok(!calls.includes("private"));
});

test("multi-page private results merge deterministically in page order", async () => {
  const calls: string[] = [];
  const deps = makeDeps(
    {
      render: async () => ({
        pages: [
          { page: 1, path: "/tmp/p1.png" },
          { page: 2, path: "/tmp/p2.png" },
        ],
        totalPages: 2,
        warnings: ["Animated GIF: using the first frame only."],
        cleanup: async () => {
          calls.push("cleanup");
        },
      }),
      runPrivate: async () => [
        { page: 2, text: "second" },
        { page: 1, text: "first" },
      ],
    },
    calls,
  );
  const outcome = await executeParse({ path: "doc.pdf" }, deps);
  assert.match(outcome.text, /## Page 1\n\nfirst[\s\S]*## Page 2\n\nsecond/);
  assert.match(outcome.text, /⚠ Animated GIF/);
});
