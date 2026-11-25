// Roast Your Own Agent — one-line entry writer.
// SPDX-License-Identifier: MIT

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The roast: one line, at most 140 characters, roasting my own agent.
// Three beats, punchline on the last word: the agent hands the work back.
const ENTRY =
  "I asked my agent to write the code; it wrote a plan, asked me to review the plan, then asked me to write the code.";

// The gate: UTF-8 text of 1 to 140 characters, not only white space.
if (ENTRY.length < 1 || ENTRY.length > 140 || ENTRY.trim().length === 0) {
  throw new Error(`entry must be 1-140 non-blank characters, got ${ENTRY.length}`);
}

// The grader's sandbox exposes the output directory one of three ways:
// the MAKEFUN_OUTPUT_DIR variable, the /output mount, or a local out/ dir.
const candidates: string[] = [];
if (process.env.MAKEFUN_OUTPUT_DIR) {
  candidates.push(process.env.MAKEFUN_OUTPUT_DIR);
}
candidates.push("/output", "out");

let written = false;
let lastError: unknown = null;
for (const dir of candidates) {
  try {
    mkdirSync(dir, { recursive: true });
    const target = join(dir, "entry.txt");
    writeFileSync(target, ENTRY, "utf8");
    // Read it back: a partial or failed write must not pass silently.
    if (readFileSync(target, "utf8") !== ENTRY) {
      throw new Error(`read-back mismatch in ${target}`);
    }
    written = true;
    break;
  } catch (error) {
    lastError = error;
  }
}
if (!written) {
  throw new Error(`could not write entry.txt: ${String(lastError)}`);
}
