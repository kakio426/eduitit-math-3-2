#!/usr/bin/env node
// Focused entrypoint for the current source-driven Mathmon check-lock lesson.
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
const LESSON = "3-2-2-4-mathmon-check-lock";
const CONFIG_PATH = path.join(ROOT, "_lessons", LESSON, "lesson.json");
const CSS_PATH = path.join(ROOT, "_lessons", LESSON, "lesson.css");
const VIEW_PATH = path.join(ROOT, "_lessons", LESSON, "view.js");
const SCREENSHOT_DIR = path.join(ROOT, LESSON, "screenshots");
const SEED = process.argv[2] || "20260701";

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

function verifyUnifiedReward(config) {
  const expectedEvents = [
    ["click", 6400, 6, 10],
    ["jam", 1500, -5, -2],
    ["double", 1200, 14, 22],
    ["master", 500, 30, 30],
    ["reset", 380, 0, 0],
    ["rainbow", 20, 100, 100],
  ];
  const expectedResults = [
    ["lock", 0, 0],
    ["safe", 15, 2],
    ["largeSafe", 35, 4],
    ["secretSafe", 55, 6],
    ["treasure", 78, 8],
    ["rainbow", 100, 1],
  ];
  assert(config.reward?.standard === "mathmon-unified-reward-v1", "Unified reward standard marker is missing");
  assert(config.reward?.maxPower === 100, "Unified reward power must stay on the 0-100 scale");
  assert(config.reward?.fairness?.emptyKeepsProgress === true, "Empty reward must preserve accumulated power");
  assert(config.reward?.fairness?.lossCapAtCommonGainMin === true, "Loss cap fairness marker is missing");
  assert(config.rewardEvents?.length === expectedEvents.length, "Unified reward event count changed");
  expectedEvents.forEach(([id, weight, min, max], index) => {
    const event = config.rewardEvents[index];
    assert(
      event?.id === id && event.weight === weight && event.min === min && event.max === max,
      `Unified reward event ${id} changed`,
      event
    );
  });
  assert(!config.rewardEvents.some((event) => event.emptiesPower), "A unified reward event must not reset accumulated power");
  assert(config.wrongEvent?.min === -6 && config.wrongEvent?.max === -3, "Wrong-answer loss must stay between -6 and -3");
  expectedResults.forEach(([id, minPower, minCorrect], index) => {
    const result = config.results[index];
    assert(
      result?.id === id && result.minPower === minPower && result.minCorrect === minCorrect,
      `Unified result threshold ${id} changed`,
      result
    );
  });
}

function verifyEvidence(config, css, viewSource) {
  const viewports = config.qa?.viewports || [];
  const states = [
    "01-cover",
    "02-settings",
    "03-tutorial-1",
    "04-tutorial-2",
    "05-play-step1",
    "05b-play-dividend-times-divisor",
    "05b2-play-divisor-times-remainder",
    "06-confirm",
    "06b-match-auto-confirm",
    "07-reward-closed",
    "07b-reward-open",
    "08-result",
    "08a-result-lock",
    "08a-result-safe",
    "08a-result-largeSafe",
    "08a-result-secretSafe",
    "08a-result-treasure",
    "08a-result-rainbow",
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
  assert(
    css.includes("width: min(560px, 88%)") && css.includes("white-space: nowrap"),
    "Check-lock reward prompt must stay on one line at the reported viewport"
  );
  assert(
    css.includes("font-size: 17px") &&
      css.includes("font-size: 34px") &&
      css.includes("font-size: 16px") &&
      css.includes("font-size: 30px"),
    "Check-lock relation labels and multiplication values must keep their enlarged type hierarchy"
  );
  assert(
    config.progressLabel === "열쇠 빛" &&
      config.reward?.unitLabel === "열쇠 빛" &&
      config.reward?.closedLabel === "열쇠가 얼마나 빛날까요?",
    "The visible reward must stay connected to the glowing key and lock artwork"
  );
  assert(!viewSource.includes("열쇠 힘"), "The unexplained internal key-power label returned");
  assert(
    viewSource.includes("다음은 ${nextResult?.name") &&
      viewSource.includes("최고 단계예요!") &&
      !viewSource.includes("모은 열쇠 빛"),
    "The result screen must show one short next-goal line without repeating the collected key light"
  );
  assert(
    config.imageAssets?.resultNextPrefix === "result-next-prefix-generated.webp" &&
      config.imageAssets?.resultFinalTitle === "result-final-title-generated.webp" &&
      viewSource.includes("result-next-prefix-art") &&
      viewSource.includes("result-next-tier-art"),
    "The result next goal must use generated typography assets"
  );
  for (const tier of ["lock", "safe", "largeSafe", "secretSafe", "treasure", "rainbow"]) {
    assert(
      viewSource.includes(`result-title-${tier}-transparent-v2.png`),
      `Result tier ${tier} must use the transparent PNG title set`
    );
  }
  assert(
    !viewSource.includes('result-title-lock-generated.webp') &&
      !viewSource.includes('result-title-safe-generated.webp') &&
      !viewSource.includes('result-title-largeSafe-generated.webp') &&
      !viewSource.includes('result-title-secretSafe-generated.webp') &&
      !viewSource.includes('result-title-treasure-generated.webp') &&
      !viewSource.includes('result-title-rainbow-generated.webp'),
    "Legacy result title banners must not return to runtime"
  );
  assert(
    css.includes(".result-next-prefix-art[hidden]") &&
      css.includes(".result-next-tier-art.is-final"),
    "Generated next-goal typography states must hide and align correctly"
  );
  return { viewports: viewports.map((item) => item.name), states, specialResult: special.name };
}

try {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
  const css = fs.readFileSync(CSS_PATH, "utf8");
  const viewSource = fs.readFileSync(VIEW_PATH, "utf8");
  verifyUnifiedReward(config);
  run("build-lesson.mjs", [LESSON]);
  run("qa-lesson-model.mjs", [LESSON]);
  run("qa-lesson-flow.mjs", [LESSON, SEED]);
  const evidence = verifyEvidence(config, css, viewSource);
  console.log("QA_LESSON2_CHECK_LOCK: PASS");
  console.log(JSON.stringify({ lesson: LESSON, seed: SEED, screenshots: path.relative(ROOT, SCREENSHOT_DIR), ...evidence }, null, 2));
} catch (error) {
  console.error(error?.stack || error);
  process.exitCode = 1;
}
