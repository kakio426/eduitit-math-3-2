#!/usr/bin/env node
// Check source-driven Mathmon lesson packages against the engine manifest contract.
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const SHARED_RESULT_COUNT = path.join(ROOT, "_shared", "result-count");
const ENGINE_VERSION = "mathmon-engine-v1";

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

async function checkLesson(lesson, failures) {
  const sourceDir = path.join(SOURCE_ROOT, lesson);
  const configPath = path.join(sourceDir, "lesson.json");
  const config = await readJson(configPath);
  const outputPath = path.join(ROOT, config.folder || lesson, "index.html");
  const html = await readFile(outputPath, "utf8");

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

  const standards = config.standards || {};
  const expectedMarkers = [
    `data-engine-version="${ENGINE_VERSION}"`,
    `data-cover-standard="${standards.cover || "generated-title-overlay"}"`,
    `data-cover-start-standard="${standards.coverStart || "generated-button-art"}"`,
    `data-settings-standard="${standards.settings || "modal-controls"}"`,
    `data-result-visual-standard="${standards.resultVisual || "generated-assets"}"`,
  ];
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

  if (!Array.isArray(config.results) || config.results.length === 0) {
    addFailure(failures, lesson, "results must contain at least one tier");
  } else {
    for (const result of config.results) {
      await checkLocalAsset(failures, lesson, config, result.image, `result image ${result.id}`);
      await checkLocalAsset(failures, lesson, config, result.titleImage, `result title image ${result.id}`);
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
