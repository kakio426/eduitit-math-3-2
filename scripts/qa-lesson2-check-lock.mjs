#!/usr/bin/env node
// Focused entrypoint for the current source-driven Mathmon check-lock lesson.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const LESSON = "3-2-2-4-mathmon-check-lock";
const CONFIG_PATH = path.join(ROOT, "_lessons", LESSON, "lesson.json");
const CSS_PATH = path.join(ROOT, "_lessons", LESSON, "lesson.css");
const SCREENSHOT_DIR = path.join(ROOT, LESSON, "screenshots");
const SEED = process.argv[2] || "20260714";

function assert(condition, message, details) {
  if (condition) return;
  const suffix = details ? `\n${JSON.stringify(details, null, 2)}` : "";
  throw new Error(`${message}${suffix}`);
}

function run(script, args = []) {
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], {
    cwd: ROOT,
    stdio: "inherit",
  });
  if (result.error) throw result.error;
  assert(result.status === 0, `${script} failed`, { status: result.status, signal: result.signal });
}

function verifyEvidence(config, css) {
  const viewports = config.qa?.viewports || [];
  const states = [
    "01-cover",
    "02-settings",
    "03-tutorial-1",
    "04-tutorial-2",
    "05-play-step1",
    "05b-play-product-too-high",
    "05b2-play-product-too-low",
    "06-confirm",
    "07-reward-closed",
    "07b-reward-open",
    "08-result",
  ];
  const missing = [];
  for (const viewport of viewports) {
    for (const state of states) {
      const file = path.join(SCREENSHOT_DIR, `engine-flow-${viewport.name}-${state}.png`);
      if (!fs.existsSync(file) || fs.statSync(file).size === 0) missing.push(path.relative(ROOT, file));
    }
  }

  const special = config.results?.find((result) => result.needsSpecial);
  assert(missing.length === 0, "Current check-lock evidence is incomplete", missing);
  assert(special?.id === "rainbow", "The rare special result contract is missing", special);
  assert(config.result?.stateImageSet?.count === config.results?.length, "Result state-image contract count is stale");
  assert(
    css.includes('.reward-card[data-reward-phase="closed"] .reward-label'),
    "Closed reward prompt must stay hidden so the action is not repeated"
  );
  return { viewports: viewports.map((item) => item.name), states, specialResult: special.name };
}

try {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const css = fs.readFileSync(CSS_PATH, "utf8");
  run("build-lesson.mjs", [LESSON]);
  run("qa-lesson-model.mjs", [LESSON]);
  run("qa-lesson-flow.mjs", [LESSON, SEED]);
  const evidence = verifyEvidence(config, css);
  console.log("QA_LESSON2_CHECK_LOCK: PASS");
  console.log(JSON.stringify({ lesson: LESSON, seed: SEED, screenshots: path.relative(ROOT, SCREENSHOT_DIR), ...evidence }, null, 2));
} catch (error) {
  console.error(error?.stack || error);
  process.exitCode = 1;
}
