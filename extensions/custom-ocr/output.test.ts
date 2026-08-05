import assert from "node:assert/strict";
import test from "node:test";
import {
  OUTPUT_MAX_BYTES,
  OUTPUT_MAX_LINES,
  mergePageResults,
  truncateOutput,
} from "./src/output.ts";

test("mergePageResults returns single-page text unwrapped", () => {
  assert.equal(mergePageResults([{ page: 1, text: " hello \n" }]), "hello");
});

test("mergePageResults orders pages and adds headings", () => {
  const merged = mergePageResults([
    { page: 3, text: "three" },
    { page: 1, text: "one" },
    { page: 2, text: "two" },
  ]);
  assert.equal(
    merged,
    "## Page 1\n\none\n\n## Page 2\n\ntwo\n\n## Page 3\n\nthree",
  );
});

test("truncateOutput passes small output through", () => {
  const result = truncateOutput("short\ntext");
  assert.equal(result.truncated, false);
  assert.equal(result.text, "short\ntext");
});

test("truncateOutput enforces the byte limit on whole lines", () => {
  const line = "x".repeat(1000);
  const input = Array.from({ length: 100 }, () => line).join("\n");
  const result = truncateOutput(input);
  assert.equal(result.truncated, true);
  assert.ok(Buffer.byteLength(result.text, "utf8") <= OUTPUT_MAX_BYTES);
  assert.ok(result.text.endsWith(line));
});

test("truncateOutput enforces the line limit", () => {
  const input = Array.from(
    { length: OUTPUT_MAX_LINES + 500 },
    (_, i) => `${i}`,
  ).join("\n");
  const result = truncateOutput(input);
  assert.equal(result.truncated, true);
  assert.equal(result.text.split("\n").length, OUTPUT_MAX_LINES);
});
