#!/usr/bin/env node
// Focused entrypoint for the current source-driven Mathmon elevator lesson.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const LESSON = "3-2-2-2-mathmon-elevator";
const CONFIG_PATH = path.join(ROOT, "_lessons", LESSON, "lesson.json");
const SCREENSHOT_DIR = path.join(ROOT, LESSON, "screenshots");

function assert(condition, message, details) {
  if (condition) return;
  const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : "";
  throw new Error(`${message}${suffix}`);
}

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], {
    cwd: ROOT,
    encoding: "utf8",
    stdio: "inherit",
  });
  assert(result.status === 0, `${script} failed`, { status: result.status, signal: result.signal });
}

function verifyEvidence(config) {
  const viewports = config.qa?.viewports || [];
  const states = [
    "05b-play-wrong",
    "05b2-play-quotient-too-low",
    "05c-play-step1-confirm",
    "05d2-play-down-wrong",
    "05e2-play-ones-too-high",
    "05e3-play-ones-too-low",
    "06-confirm",
    "07-reward-closed",
    "07b-reward-open",
    "08-result-low-0-of-10",
  ];
  const missing = [];
  for (const viewport of viewports) {
    for (const state of states) {
      const file = path.join(SCREENSHOT_DIR, `engine-flow-${viewport.name}-${state}.png`);
      if (!fs.existsSync(file) || fs.statSync(file).size === 0) missing.push(path.relative(ROOT, file));
    }
  }
  assert(missing.length === 0, "Deterministic elevator evidence is incomplete", missing);
  assert(config.reward?.closedLabel === "어떤 힘이 나올까요?", "Closed reward copy regressed");
  assert(config.results?.[0]?.id === "basement", "The lowest result must still be a visible destination");
  assert(config.results?.[0]?.minPower === 0 && config.results?.[0]?.minCorrect === 0, "0/10 must reach the basement destination");
  assert(config.result?.stateImageSet?.count === config.results.length, "Result state-image contract count is stale");
  return { viewports: viewports.map((item) => item.name), states, lowestResult: config.results[0].name };
}

try {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  run("qa-lesson-model.mjs", [LESSON]);
  run("qa-lesson-flow.mjs", [LESSON, "61"]);
  const evidence = verifyEvidence(config);
  console.log("LESSON2_ELEVATOR_QA: PASS");
  console.log(JSON.stringify({ lesson: LESSON, screenshots: path.relative(ROOT, SCREENSHOT_DIR), ...evidence }, null, 2));
} catch (error) {
  console.error(error?.stack || error);
  process.exitCode = 1;
}
