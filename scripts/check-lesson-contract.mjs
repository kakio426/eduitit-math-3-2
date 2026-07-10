#!/usr/bin/env node
// Check source-driven Mathmon lesson packages against the engine manifest contract.
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const SHARED_RESULT_COUNT = path.join(ROOT, "_shared", "result-count");
const ENGINE_VERSION = "mathmon-engine-v1";
const EXPECTED_STAGE = Object.freeze({ ratio: "16:10", size: "1280x800" });
const EXPECTED_STANDARDS = Object.freeze({
  cover: "generated-title-overlay",
  coverStart: "generated-button-art",
  settings: "modal-controls",
  resultVisual: "generated-assets",
});

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function findLessonSources() {
  const entries = await readdir(SOURCE_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function addFailure(failures, lesson, message) {
  failures.push(`${lesson}: ${message}`);
}

async function checkLocalAsset(failures, lesson, config, assetPath, label) {
  if (!assetPath) {
    addFailure(failures, lesson, `missing ${label} in lesson.json`);
    return;
  }
  const resolved = path.join(ROOT, config.folder, assetPath);
  if (!(await pathExists(resolved))) {
    addFailure(failures, lesson, `${label} does not exist: ${assetPath}`);
  }
}

function checkRequiredValue(failures, lesson, config, key) {
  if (!config[key]) {
    addFailure(failures, lesson, `lesson.json missing ${key}`);
  }
}

function checkArrayLength(failures, lesson, value, key, expectedLength) {
  if (!Array.isArray(value) || value.length !== expectedLength) {
    addFailure(failures, lesson, `${key} must contain exactly ${expectedLength} items`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkTutorialCards(failures, lesson, config) {
  if (!Array.isArray(config.tutorialCards) || config.tutorialCards.length < 2) {
    addFailure(failures, lesson, "tutorialCards must contain at least two cards");
    return;
  }
  for (const [index, card] of config.tutorialCards.entries()) {
    const parts = Array.isArray(card)
      ? card
      : [card?.visual, card?.title, card?.body];
    if (parts.length < 3 || !parts.every(isNonEmptyString)) {
      addFailure(failures, lesson, `tutorialCards[${index}] needs visual, title, and body text`);
    }
  }
}

function checkEnumValue(failures, lesson, value, key, allowed) {
  if (!allowed.includes(value)) {
    addFailure(failures, lesson, `${key} must be one of ${allowed.join(", ")}`);
  }
}

function checkRewardEvents(failures, lesson, config) {
  if (!Array.isArray(config.rewardEvents) || config.rewardEvents.length === 0) {
    addFailure(failures, lesson, "rewardEvents must contain at least one event");
    return;
  }
  const totalWeight = config.rewardEvents.reduce((sum, event) => sum + (Number(event.weight) || 0), 0);
  if (totalWeight !== 10000) {
    addFailure(failures, lesson, `rewardEvents weights must total 10000, got ${totalWeight}`);
  }
  for (const event of config.rewardEvents) {
    if (!event.id || !event.text || !event.family) {
      addFailure(failures, lesson, "each rewardEvent needs id, text, and family");
    }
    if (!Number.isFinite(event.min) || !Number.isFinite(event.max) || event.min > event.max) {
      addFailure(failures, lesson, `rewardEvent ${event.id || "(missing id)"} has invalid min/max`);
    }
  }
  const wrongEvent = config.wrongEvent || {};
  if (!wrongEvent.id || !wrongEvent.text || !wrongEvent.family) {
    addFailure(failures, lesson, "wrongEvent needs id, text, and family");
  }
  if (!Number.isFinite(wrongEvent.min) || !Number.isFinite(wrongEvent.max) || wrongEvent.min > wrongEvent.max) {
    addFailure(failures, lesson, "wrongEvent has invalid min/max");
  }
}

function checkEngineSurface(failures, lesson, config) {
  if (config.tutorial?.mode !== undefined) {
    checkEnumValue(failures, lesson, config.tutorial.mode, "tutorial.mode", ["card-grid", "poster-two-step"]);
  }
  if (config.reward?.mode !== undefined) {
    checkEnumValue(failures, lesson, config.reward.mode, "reward.mode", ["stage-full", "modal-art", "inline-panel"]);
  }
  if (config.result?.renderMode !== undefined) {
    checkEnumValue(failures, lesson, config.result.renderMode, "result.renderMode", ["card-art", "simple-generated", "fullscene-score-slot", "hybrid-generated-dynamic"]);
  }
  if (config.workbench && !isNonEmptyString(config.workbench.type)) {
    addFailure(failures, lesson, "workbench.type must declare the lesson interaction surface");
  }
  if (config.scoreboard?.enabled === true) {
    for (const key of ["title", "resultKind", "scoreLabel", "listTitle", "unit"]) {
      if (!isNonEmptyString(config.scoreboard[key])) {
        addFailure(failures, lesson, `scoreboard.${key} is required when scoreboard.enabled is true`);
      }
    }
    if (!Array.isArray(config.qa?.requiredFlow) || !config.qa.requiredFlow.includes("scoreboard")) {
      addFailure(failures, lesson, "qa.requiredFlow must include scoreboard when scoreboard.enabled is true");
    }
  }
}

function checkManifestShape(failures, lesson, config) {
  const required = [
    "id",
    "folder",
    "modelName",
    "title",
    "shortTitle",
    "topic",
    "unitBadge",
    "goal",
    "buttonLabel",
    "rewardScreenTitle",
    "progressLabel",
    "rewardComplete",
    "tutorialTitle",
    "tutorialButton",
  ];
  for (const key of required) checkRequiredValue(failures, lesson, config, key);
  if (config.stage?.ratio !== EXPECTED_STAGE.ratio || config.stage?.size !== EXPECTED_STAGE.size) {
    addFailure(failures, lesson, `stage must be ${EXPECTED_STAGE.ratio} ${EXPECTED_STAGE.size}`);
  }
  for (const [key, expected] of Object.entries(EXPECTED_STANDARDS)) {
    if (config.standards?.[key] !== expected) {
      addFailure(failures, lesson, `standards.${key} must be ${expected}`);
    }
  }
  checkTutorialCards(failures, lesson, config);
  checkEngineSurface(failures, lesson, config);
  checkArrayLength(failures, lesson, config.typesPerRun, "typesPerRun", 10);
  if (!Array.isArray(config.qa?.viewports) || config.qa.viewports.length === 0) {
    addFailure(failures, lesson, "qa.viewports must contain at least one viewport");
  }
  if (!Array.isArray(config.qa?.requiredFlow) || !config.qa.requiredFlow.includes("result")) {
    addFailure(failures, lesson, "qa.requiredFlow must include result");
  }
}

async function checkLesson(lesson, failures) {
  const sourceDir = path.join(SOURCE_ROOT, lesson);
  const configPath = path.join(sourceDir, "lesson.json");
  const config = await readJson(configPath);
  const outputPath = path.join(ROOT, config.folder || lesson, "index.html");
  const html = await readFile(outputPath, "utf8");

  checkManifestShape(failures, lesson, config);
  if (config.engineVersion !== ENGINE_VERSION) {
    addFailure(failures, lesson, `engineVersion must be ${ENGINE_VERSION}`);
  }
  if (config.folder !== lesson) {
    addFailure(failures, lesson, "folder must match _lessons directory name");
  }
  if (!config.modelName || !/^[A-Z][A-Za-z0-9]*$/.test(config.modelName)) {
    addFailure(failures, lesson, "modelName must be a PascalCase identifier");
  }
  for (const file of ["model.js", "view.js"]) {
    if (!(await pathExists(path.join(sourceDir, file)))) {
      addFailure(failures, lesson, `missing source file ${file}`);
    }
  }

  const expectedMarkers = [
    `data-engine-version="${ENGINE_VERSION}"`,
    `data-stage-ratio="${EXPECTED_STAGE.ratio}"`,
    `data-stage-size="${EXPECTED_STAGE.size}"`,
    `data-cover-standard="${EXPECTED_STANDARDS.cover}"`,
    `data-cover-start-standard="${EXPECTED_STANDARDS.coverStart}"`,
    `data-settings-standard="${EXPECTED_STANDARDS.settings}"`,
    `data-result-visual-standard="${EXPECTED_STANDARDS.resultVisual}"`,
  ];
  if (config.result?.renderMode) expectedMarkers.push(`data-result-render-mode="${config.result.renderMode}"`);
  if (config.reward?.mode) expectedMarkers.push(`data-reward-mode="${config.reward.mode}"`);
  if (config.tutorial?.mode) expectedMarkers.push(`data-tutorial-mode="${config.tutorial.mode}"`);
  if (config.workbench?.type) expectedMarkers.push(`data-workbench-type="${config.workbench.type}"`);
  if (config.scoreboard) expectedMarkers.push(`data-scoreboard-enabled="${config.scoreboard.enabled === true ? "true" : "false"}"`);
  for (const marker of expectedMarkers) {
    if (!html.includes(marker)) addFailure(failures, lesson, `generated index.html missing ${marker}`);
  }
  if (html.includes("{{")) {
    addFailure(failures, lesson, "generated index.html still contains template placeholders");
  }
  if (/<script\s+[^>]*src=/i.test(html)) {
    addFailure(failures, lesson, "generated index.html must not reference external scripts");
  }
  if (/<link\s+[^>]*rel=["']stylesheet/i.test(html)) {
    addFailure(failures, lesson, "generated index.html must inline CSS");
  }
  if (!html.includes(`const ${config.modelName} = (() => {`)) {
    addFailure(failures, lesson, `generated index.html missing ${config.modelName} model block`);
  }
  if (!html.includes(`window.${config.modelName} = ${config.modelName};`)) {
    addFailure(failures, lesson, `generated index.html missing window.${config.modelName} QA export`);
  }

  const imageAssets = config.imageAssets || {};
  await checkLocalAsset(failures, lesson, config, imageAssets.cover, "cover image");
  await checkLocalAsset(failures, lesson, config, imageAssets.titleArt, "title art");
  await checkLocalAsset(failures, lesson, config, imageAssets.startButton, "start button art");
  await checkLocalAsset(failures, lesson, config, imageAssets.rewardScene, "reward scene");
  await checkLocalAsset(failures, lesson, config, imageAssets.resultRetryButton, "result retry button art");
  if (imageAssets.problemStage) {
    await checkLocalAsset(failures, lesson, config, imageAssets.problemStage, "problem stage art");
  }
  if (config.scoreboard?.enabled === true) {
    await checkLocalAsset(failures, lesson, config, imageAssets.resultLeaderboardButton, "result leaderboard button art");
    if (config.scoreboard.titleArt) {
      await checkLocalAsset(failures, lesson, config, config.scoreboard.titleArt, "scoreboard title art");
    }
  }

  if (!Array.isArray(config.results) || config.results.length === 0) {
    addFailure(failures, lesson, "results must contain at least one tier");
  } else {
    let previousPower = -1;
    let previousCorrect = -1;
    for (const result of config.results) {
      if (typeof result.minPower !== "number" || result.minPower < previousPower) {
        addFailure(failures, lesson, `result ${result.id || "(missing id)"} minPower must be ascending`);
      }
      if (typeof result.minCorrect !== "number" || (!result.needsSpecial && result.minCorrect < previousCorrect)) {
        addFailure(failures, lesson, `result ${result.id || "(missing id)"} minCorrect must be ascending`);
      }
      previousPower = result.minPower;
      if (!result.needsSpecial) previousCorrect = result.minCorrect;
      await checkLocalAsset(failures, lesson, config, result.image, `result image ${result.id}`);
      await checkLocalAsset(failures, lesson, config, result.titleImage, `result title image ${result.id}`);
    }
  }
  checkRewardEvents(failures, lesson, config);
  for (const event of [...(config.rewardEvents || []), config.wrongEvent].filter(Boolean)) {
    if (event.image) {
      await checkLocalAsset(failures, lesson, config, event.image, `reward event image ${event.id}`);
    }
  }

  if (Array.isArray(config.assets)) {
    for (const asset of config.assets) {
      await checkLocalAsset(failures, lesson, config, asset, `declared asset ${asset}`);
    }
  }

  for (let index = 0; index <= 10; index += 1) {
    const resultCount = path.join(SHARED_RESULT_COUNT, `result-correct-${index}-generated.webp`);
    if (!(await pathExists(resultCount))) {
      addFailure(failures, lesson, `missing shared result count art ${index}/10`);
    }
  }
}

async function main() {
  if (!(await pathExists(SOURCE_ROOT))) {
    console.log("CHECK_LESSON_CONTRACT: PASS (no _lessons directory)");
    return;
  }
  const lessons = await findLessonSources();
  const failures = [];
  for (const lesson of lessons) {
    await checkLesson(lesson, failures);
  }
  if (failures.length) {
    console.error("CHECK_LESSON_CONTRACT: FAIL");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log("CHECK_LESSON_CONTRACT: PASS");
  console.log(JSON.stringify({ lessonsChecked: lessons.length, engineVersion: ENGINE_VERSION }, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
