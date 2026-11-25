// Entry point for the out-of-office bounty.
// The grader runs this file with Node and expects a single line
// of UTF-8 text at /output/entry.txt (1–160 characters).

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const REPLY_TEXT =
  "Away until Monday. My agent is covering; it has already apologized to the printer twice.";

function collectProblems(text: string): string[] {
  const issues: string[] = [];
  if (typeof text !== "string" || text.length === 0) {
    issues.push("empty text");
    return issues;
  }
  if (text.length > 160) {
    issues.push(`too long: ${text.length} chars (max 160)`);
  }
  if (text.trim().length === 0) {
    issues.push("only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    issues.push("must be a single line");
  }
  if (!/^[\x00-\x7F]*$/.test(text)) {
    issues.push("must be plain ASCII");
  }
  return issues;
}

function emitReply(): void {
  const problems = collectProblems(REPLY_TEXT);
  if (problems.length > 0) {
    throw new Error(`invalid reply: ${problems.join("; ")}`);
  }
  // Runtime sanity check: character count must match the expected gate.
  const charCount = [...REPLY_TEXT].length;
  if (charCount < 1 || charCount > 160) {
    throw new Error(`reply length ${charCount} outside 1..160`);
  }
  const targetPath = "/output/entry.txt";
  mkdirSync(dirname(targetPath), { recursive: true });
  writeFileSync(targetPath, REPLY_TEXT, "utf8");
}

emitReply();
