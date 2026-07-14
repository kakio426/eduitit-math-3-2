#!/usr/bin/env node
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const LESSON = "3-2-2-1-mathmon-divide-farm";
const checks = [
  ["scripts/build-lesson.mjs", LESSON],
  ["scripts/qa-lesson-model.mjs", LESSON],
  ["scripts/qa-lesson-flow.mjs", LESSON],
];

for (const [script, ...args] of checks) {
  const result = spawnSync(process.execPath, [path.join(ROOT, script), ...args], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`QA_LESSON2_DIVIDE_FARM: PASS ${LESSON}`);
