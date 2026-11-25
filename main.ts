import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 160;

function outOfOfficeLine(): string {
  return "Out of office until Monday. If this is urgent, my agent will reply instantly with something confident and wrong.";
}

function problemsFor(text: string): string[] {
  const found: string[] = [];
  if (text.length < MIN_CHARS) found.push("too short");
  if (text.length > MAX_CHARS) found.push("too long");
  if (text.trim().length === 0) found.push("blank");
  if (text.includes("\n") || text.includes("\r")) found.push("must be one line");
  // Runtime guard: reject control characters that would break a one-line reply.
  if (/[\u0000-\u001F\u007F]/.test(text)) found.push("control characters not allowed");
  // Runtime guard: ensure the text round-trips as UTF-8 without loss.
  if (Buffer.from(text, "utf8").toString("utf8") !== text) found.push("not valid UTF-8");
  return found;
}

function writeEntry(text: string): void {
  const dir = dirname(OUT_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(OUT_PATH, text, { encoding: "utf8" });
}

function main(): void {
  const line = outOfOfficeLine();
  const issues = problemsFor(line);
  if (issues.length > 0) {
    throw new Error("invalid entry: " + issues.join(", "));
  }
  writeEntry(line);
}

main();
