import assert from "node:assert/strict";
import { homedir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  FileValidationError,
  MAX_PAGES,
  looksLikeUrl,
  normalizePageRange,
  normalizeRequestPath,
  parseRenderManifest,
  sniffKind,
} from "./src/files.ts";

test("normalizeRequestPath strips a leading @", () => {
  assert.equal(
    normalizeRequestPath("@/tmp/scan.pdf", "/work"),
    "/tmp/scan.pdf",
  );
});

test("normalizeRequestPath expands ~", () => {
  assert.equal(
    normalizeRequestPath("~/scan.pdf", "/work"),
    join(homedir(), "scan.pdf"),
  );
  assert.equal(normalizeRequestPath("~", "/work"), homedir());
});

test("normalizeRequestPath resolves relative paths against cwd", () => {
  assert.equal(
    normalizeRequestPath("docs/scan.pdf", "/work"),
    "/work/docs/scan.pdf",
  );
  assert.equal(normalizeRequestPath("@./a.png", "/work"), "/work/a.png");
});

test("looksLikeUrl detects URL schemes", () => {
  assert.equal(looksLikeUrl("https://example.com/a.png"), true);
  assert.equal(looksLikeUrl("file:///tmp/a.png"), true);
  assert.equal(looksLikeUrl("/tmp/https-notes.png"), false);
  assert.equal(looksLikeUrl("C:relative-ish"), false);
});

test("sniffKind identifies supported types by magic bytes", () => {
  assert.equal(sniffKind(Buffer.from("%PDF-1.7")), "pdf");
  assert.equal(
    sniffKind(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
    "png",
  );
  assert.equal(sniffKind(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), "jpeg");
  assert.equal(sniffKind(Buffer.from("GIF89a")), "gif");
  assert.equal(sniffKind(Buffer.from("RIFF\x00\x00\x00\x00WEBPVP8 ")), "webp");
  assert.equal(sniffKind(Buffer.from([0x49, 0x49, 0x2a, 0x00])), "tiff");
  assert.equal(sniffKind(Buffer.from([0x4d, 0x4d, 0x00, 0x2a])), "tiff");
  assert.equal(sniffKind(Buffer.from("hello world")), undefined);
  assert.equal(sniffKind(Buffer.from("RIFF\x00\x00\x00\x00WAVE")), undefined);
});

test("normalizePageRange defaults to the first 20 pages", () => {
  assert.deepEqual(normalizePageRange(undefined), { start: 1, end: MAX_PAGES });
});

test("normalizePageRange accepts valid ranges", () => {
  assert.deepEqual(normalizePageRange({ start: 3, end: 5 }), {
    start: 3,
    end: 5,
  });
  assert.deepEqual(normalizePageRange({ start: 1, end: 20 }), {
    start: 1,
    end: 20,
  });
});

test("normalizePageRange rejects invalid ranges", () => {
  assert.throws(
    () => normalizePageRange({ start: 5, end: 3 }),
    FileValidationError,
  );
  assert.throws(
    () => normalizePageRange({ start: 0, end: 3 }),
    FileValidationError,
  );
  assert.throws(
    () => normalizePageRange({ start: 1, end: 21 }),
    FileValidationError,
  );
  assert.throws(
    () => normalizePageRange({ start: 1.5, end: 3 }),
    FileValidationError,
  );
});

test("parseRenderManifest parses the renderer manifest", () => {
  const manifest = parseRenderManifest(
    `some noise\n${JSON.stringify({
      pages: [
        { page: 1, path: "/tmp/x/page-0001.png" },
        { page: 2, path: "/tmp/x/page-0002.png" },
      ],
      total_pages: 9,
      warnings: ["Animated GIF"],
    })}\n`,
  );
  assert.equal(manifest.pages.length, 2);
  assert.equal(manifest.totalPages, 9);
  assert.deepEqual(manifest.warnings, ["Animated GIF"]);
});

test("parseRenderManifest surfaces renderer errors", () => {
  assert.throws(
    () => parseRenderManifest(JSON.stringify({ error: "boom" })),
    /boom/,
  );
  assert.throws(() => parseRenderManifest("not json"), /invalid output/);
  assert.throws(
    () => parseRenderManifest(JSON.stringify({ pages: [] })),
    /no pages/,
  );
});
