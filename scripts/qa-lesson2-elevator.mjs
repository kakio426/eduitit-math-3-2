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
  assert(config.rewardScreenTitle === "점수" && config.progressLabel === "점수", "The student-facing score label regressed");
  assert(config.reward?.unitLabel === "점수", "The reward value unit regressed");
  assert(config.reward?.closedLabel === "점수가 어떻게 바뀔까요?", "Closed reward copy regressed");
  assert(config.reward?.mistakePolicy === "penalty-biased-random-pool", "A mistake must use the penalty-biased random reward pool");
  assert(config.qa?.rewardPolicy === "mistakes-use-penalty-biased-random-pool", "The mistake reward regression policy is missing");
  assert(Object.values(config.reward?.mistakeRewardWeights || {}).reduce((sum, weight) => sum + Number(weight || 0), 0) === 10000, "Mistake reward weights must total 10000");
  assert(config.wrongEvent?.min === 0 && config.wrongEvent?.max === 0, "The compatibility mistake fallback must not lower the score");
  assert(config.results?.[0]?.id === "basement", "The lowest result must still be a visible destination");
  assert(config.results?.[0]?.minPower === 0 && config.results?.[0]?.minCorrect === 0, "0/10 must reach the basement destination");
  assert(config.result?.stateImageSet?.count === config.results.length, "Result state-image contract count is stale");
  const reportedViewport = viewports.find((item) => item.name === "reported-svg-overlap-934x987");
  assert(reportedViewport?.width === 934 && reportedViewport?.height === 987, "The user-reported 934x987 regression viewport is missing");
  assert(reportedViewport?.regressions?.includes("eagle-reward-left-wing-clip"), "The eagle wing clipping regression is not registered");
  assert(reportedViewport?.regressions?.includes("eagle-reaction-left-stage-clearance"), "The eagle Stage-edge clearance regression is not registered");
  assert(reportedViewport?.regressions?.includes("tutorial-operation-before-quotient"), "The tutorial operation-first regression is not registered");
  assert(reportedViewport?.regressions?.includes("play-step-choices-surface-overlap"), "The play stack overlap regression is not registered");
  assert(reportedViewport?.regressions?.includes("active-board-control-column-balance"), "The active board/control-column balance regression is not registered");
  assert(reportedViewport?.regressions?.includes("answer-choice-card-shadow-overlap"), "The answer-card shadow overlap regression is not registered");
  assert(reportedViewport?.regressions?.includes("problem-heading-inside-board"), "The in-board problem heading regression is not registered");
  assert(reportedViewport?.regressions?.includes("problem-heading-work-surface-separation"), "The problem/work surface separation regression is not registered");
  assert(reportedViewport?.regressions?.includes("division-number-scale-consistency"), "The division-number scale regression is not registered");
  assert(reportedViewport?.regressions?.includes("decision-cell-subtle-emphasis"), "The decision-cell emphasis regression is not registered");
  const solveTutorial = config.tutorialCards?.[0] || {};
  assert(solveTutorial.image === "tutorial-page-1-v7-generated.webp", "The generated place-value tutorial poster is not configured");
  assert(solveTutorial.title === "십의 자리 값부터 나눠요", "The place-value tutorial title regressed");
  assert(solveTutorial.body.includes("70을 2로 먼저 나눠요") && solveTutorial.body.includes("70 = 2 × 30 + 10") && solveTutorial.body.includes("답은 38"), "The operation-first place-value tutorial flow regressed");
  const goalTutorial = config.tutorialCards?.[1] || {};
  assert(goalTutorial.image === "tutorial-page-2-v4-generated.webp", "The generated gameplay tutorial poster is not configured");
  assert(goalTutorial.title === "나눗셈을 풀고 문을 열어요", "The gameplay tutorial title regressed");
  assert(goalTutorial.body === "나눗셈을 풀어요. 문을 열어 점수를 봐요. +는 점수가 늘고, −는 점수가 줄어요. 10문제 뒤 도착한 층을 확인해요.", "The gameplay tutorial flow copy regressed");
  const actionButtons = config.imageAssets?.actionButtons || {};
  assert(actionButtons.next === "../_shared/action-buttons/next-button-generated.webp", "The shared next button is not configured");
  assert(actionButtons.previous === "../_shared/action-buttons/previous-button-generated.webp", "The shared previous button is not configured");
  assert(actionButtons.problemStart === "../_shared/action-buttons/problem-start-button-generated.webp", "The shared problem-start button is not configured");
  assert(actionButtons.resultView === "../_shared/action-buttons/result-view-button-generated.webp", "The shared result-view button is not configured");
  assert(actionButtons.doorOpen === "door-open-button-generated.webp", "The lesson-specific door-open button is not configured");
  assert(config.result?.retryVisualMode === "baked-in-scene", "The result retry button must come from the generated tier scene");
  assert(config.result?.stateImageSet?.fixedGeneratedElements?.includes("result-title"), "The generated result title contract is missing");
  assert(config.result?.stateImageSet?.fixedGeneratedElements?.includes("retry-button"), "The generated result retry contract is missing");
  assert(Object.keys(config.result?.stateImageSet?.layoutByTier || {}).length === config.results.length, "Each result tier needs its own overlay and retry-hitbox layout");
  const resultViewport = viewports.find((item) => item.name === "reported-result-overlap-1039x651");
  assert(resultViewport?.width === 1039 && resultViewport?.height === 651 && resultViewport?.dpr === 2, "The reported result-overlap viewport is missing");
  assert(resultViewport?.regressions?.includes("result-fixed-action-duplication"), "The duplicate retry-button regression is not registered");
  assert(resultViewport?.regressions?.includes("result-score-power-panel-alignment"), "The result-panel alignment regression is not registered");
  assert(resultViewport?.regressions?.includes("result-retry-hitbox-art-alignment"), "The baked retry hitbox regression is not registered");
  assert(resultViewport?.regressions?.includes("result-inner-panel-center-axis"), "The inner result-panel center-axis regression is not registered");
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
