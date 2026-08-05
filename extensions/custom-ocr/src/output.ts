/**
 * Deterministic result formatting: page-ordered merging plus truncation at
 * Pi's tool output limits (50 KB / 2,000 lines). When output is truncated the
 * full result is saved to an owner-only file under ~/.cache/custom-ocr.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

export const OUTPUT_MAX_BYTES = 50_000;
export const OUTPUT_MAX_LINES = 2_000;

export const RESULTS_DIR = join(homedir(), ".cache", "custom-ocr", "results");

export interface PageResult {
  readonly page: number;
  readonly text: string;
}

/** Merge per-page results deterministically in page order. */
export function mergePageResults(results: readonly PageResult[]) {
  const ordered = [...results].sort((a, b) => a.page - b.page);
  if (ordered.length === 1) return ordered[0]!.text.trim();
  return ordered
    .map((result) => `## Page ${result.page}\n\n${result.text.trim()}`)
    .join("\n\n");
}

export interface TruncatedOutput {
  readonly text: string;
  readonly truncated: boolean;
}

/** Truncate to the byte/line limits, keeping whole lines. */
export function truncateOutput(text: string): TruncatedOutput {
  const lines = text.split("\n");
  const kept: string[] = [];
  let bytes = 0;
  for (const line of lines) {
    if (kept.length >= OUTPUT_MAX_LINES) {
      return { text: kept.join("\n"), truncated: true };
    }
    const lineBytes =
      Buffer.byteLength(line, "utf8") + (kept.length > 0 ? 1 : 0);
    if (bytes + lineBytes > OUTPUT_MAX_BYTES) {
      return { text: kept.join("\n"), truncated: true };
    }
    kept.push(line);
    bytes += lineBytes;
  }
  return { text, truncated: false };
}

/** Save the full result to an owner-only (0600) file and return its path. */
export async function saveFullResult(text: string) {
  await mkdir(RESULTS_DIR, { recursive: true, mode: 0o700 });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const path = join(
    RESULTS_DIR,
    `parse-${stamp}-${Math.random().toString(36).slice(2, 8)}.md`,
  );
  await writeFile(path, text, { encoding: "utf8", mode: 0o600 });
  return path;
}
