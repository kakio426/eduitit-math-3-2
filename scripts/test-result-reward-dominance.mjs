#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateResultRewardDominance } from "./lib/result-reward-dominance.mjs";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.join(ROOT, "fixtures", "result-reward-dominance");
const FIXTURES = [
  "valid.json",
  "oversized-panel-tiny-reward.json",
  "internal-metric-leak.json",
  "reward-hidden-by-panel.json",
];

for (const filename of FIXTURES) {
  const fixture = JSON.parse(await readFile(path.join(FIXTURE_ROOT, filename), "utf8"));
  const result = validateResultRewardDominance(fixture);
  const valid = result.failures.length === 0;
  if (valid !== fixture.expectedValid) {
    throw new Error(`${fixture.name}: expectedValid=${fixture.expectedValid}, failures=${JSON.stringify(result.failures)}`);
  }
  if (fixture.expectedFailure && !result.failures.includes(fixture.expectedFailure)) {
    throw new Error(`${fixture.name}: expected failure ${fixture.expectedFailure}, got ${JSON.stringify(result.failures)}`);
  }
  console.log(JSON.stringify({ fixture:fixture.name, valid, failures:result.failures, measurements:result.measurements }));
}

console.log("RESULT_REWARD_DOMINANCE_FIXTURES: PASS");
