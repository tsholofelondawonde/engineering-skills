#!/usr/bin/env node
// Regenerates plugins/engineering-quality/skills/ as a fresh copy of the
// canonical skills/ folder. skills/ is what contributors edit; this mirror
// exists only so the Claude Code plugin keeps working. Re-run after any
// change under skills/ — CI fails the build if the mirror drifts.

import { rmSync, cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(repoRoot, "skills");
const dest = path.join(repoRoot, "plugins", "engineering-quality", "skills");

if (existsSync(dest)) {
  rmSync(dest, { recursive: true, force: true });
}
cpSync(src, dest, { recursive: true });

console.log(`Synced ${path.relative(repoRoot, src)} -> ${path.relative(repoRoot, dest)}`);
