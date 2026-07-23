#!/usr/bin/env node
// Build one Mathmon lesson package from _engine/v1 plus a lesson source manifest.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { runInNewContext } from "node:vm";

const ROOT = process.cwd();
const ENGINE_VERSION = "mathmon-engine-v1";
const ENGINE_DIR = path.join(ROOT, "_engine", "v1");
const LESSON_SOURCE_ROOT = path.join(ROOT, "_lessons");
const SCOREBOARD_DIR = path.join(ROOT, "_shared", "scoreboard");
const SHARED_COVER_START_BUTTON = "../_shared/mathmon/cover-start-button/start-button-generated.webp";

function usage() {
  console.error("Usage: node scripts/build-lesson.mjs <lesson-folder>");
  console.error("Example: node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function indent(text, spaces = 4) {
  const padding = " ".repeat(spaces);
  return String(text)
    .trimEnd()
    .split("\n")
    .map((line) => (line ? padding + line : ""))
    .join("\n");
}

function renderCards(cards) {
  return cards.map((card) => {
    const [mark, title, body] = Array.isArray(card)
      ? card
      : [card.visual || "", card.title || "", card.body || ""];
    const image = !Array.isArray(card) && card.image
      ? `<img class="tutorial-poster-art" src="${escapeHtml(card.image)}" alt="">`
      : "";
    return `<div class="tutorial-card">${image}<div class="card-mark">${escapeHtml(mark)}</div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(body)}</p></div>`;
  }).join("");
}

function renderTemplate(template, replacements) {
  return template.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
    if (!(key in replacements)) throw new Error(`missing template value: ${key}`);
    return replacements[key];
  });
}

function requiredString(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function requireLessonConfig(config, lessonFolder) {
  const required = [
    "engineVersion",
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
  for (const key of required) {
    if (!config[key]) throw new Error(`${lessonFolder}/lesson.json is missing ${key}`);
  }
  if (config.folder !== lessonFolder) {
    throw new Error(`${lessonFolder}/lesson.json folder must equal ${lessonFolder}`);
  }
  if (config.engineVersion !== ENGINE_VERSION) {
    throw new Error(`${lessonFolder}/lesson.json uses unsupported engineVersion ${config.engineVersion}`);
  }
  if (!Array.isArray(config.tutorialCards) || config.tutorialCards.length < 2) {
    throw new Error(`${lessonFolder}/lesson.json needs tutorialCards`);
  }
  if (!Array.isArray(config.results) || config.results.length < 1) {
    throw new Error(`${lessonFolder}/lesson.json needs results`);
  }
}

function validateModelContract(config, modelSource, lessonFolder) {
  if (config.qa?.modelContractVersion !== 1) return;
  const sandbox = {
    LESSON_CONFIG: structuredClone(config),
    Math,
    Date,
  };
  runInNewContext(
    `${modelSource}\n;globalThis.__lessonModel = ${config.modelName};`,
    sandbox,
    { timeout: 1000, filename: `${lessonFolder}/model.js` },
  );
  const model = sandbox.__lessonModel;
  if (!model || typeof model.generateRun !== "function") {
    throw new Error(`${lessonFolder}/model.js must expose ${config.modelName}.generateRun()`);
  }
  const problems = model.generateRun(20260723);
  if (!Array.isArray(problems) || problems.length !== 10) {
    throw new Error(`${lessonFolder}/model.js must generate exactly 10 problems`);
  }
  const requiredStepFields = [
    "id", "label", "instruction", "answer", "answerChoiceId",
    "choices", "correctText", "reveal", "advance",
  ];
  const requiredChoiceFields = ["id", "value", "label", "misconceptionId", "feedback"];
  for (const [problemIndex, problem] of problems.entries()) {
    if (!Array.isArray(problem.steps) || problem.steps.length < 1) {
      throw new Error(`${lessonFolder}/model.js problem ${problemIndex + 1} has no steps`);
    }
    for (const [stepIndex, step] of problem.steps.entries()) {
      for (const field of requiredStepFields) {
        if (!(field in step)) {
          throw new Error(`${lessonFolder}/model.js problem ${problemIndex + 1} step ${stepIndex + 1} is missing ${field}`);
        }
      }
      if (!Array.isArray(step.choices) || step.choices.length < 2) {
        throw new Error(`${lessonFolder}/model.js problem ${problemIndex + 1} step ${stepIndex + 1} needs choices`);
      }
      for (const [choiceIndex, choice] of step.choices.entries()) {
        for (const field of requiredChoiceFields) {
          if (!(field in choice)) {
            throw new Error(`${lessonFolder}/model.js problem ${problemIndex + 1} step ${stepIndex + 1} choice ${choiceIndex + 1} is missing ${field}`);
          }
        }
      }
      const correctMatches = step.choices.filter((choice) => String(choice.id) === String(step.answerChoiceId));
      if (correctMatches.length !== 1) {
        throw new Error(`${lessonFolder}/model.js problem ${problemIndex + 1} step ${stepIndex + 1} must have one correct choice`);
      }
    }
  }
  if (typeof model.applyReward !== "function") {
    throw new Error(`${lessonFolder}/model.js must expose applyReward()`);
  }
  const patch = model.applyReward({ power: 0, specialSeen: false }, { amount: 4 });
  if (!patch || !Number.isFinite(patch.power) || typeof patch.specialSeen !== "boolean") {
    throw new Error(`${lessonFolder}/model.js applyReward() must return { power, specialSeen }`);
  }
}

function getUnitNumber(config) {
  const match = /^(\d)-(\d)-(\d)-(\d)$/.exec(config.id);
  if (!match) throw new Error(`lesson id has unexpected shape: ${config.id}`);
  return Number(match[3]);
}

async function main() {
  const lessonFolder = process.argv[2];
  if (!lessonFolder) {
    usage();
    process.exitCode = 1;
    return;
  }

  const sourceDir = path.join(LESSON_SOURCE_ROOT, lessonFolder);
  const configPath = path.join(sourceDir, "lesson.json");
  const config = JSON.parse(await readFile(configPath, "utf8"));
  requireLessonConfig(config, lessonFolder);

  const sourceFiles = config.sourceFiles || {};
  const modelPath = path.resolve(sourceDir, sourceFiles.model || "model.js");
  const viewPath = path.resolve(sourceDir, sourceFiles.view || "view.js");
  const [template, engineCss, engineRuntime, scoreboardCss, scoreboardRuntime, modelSource, viewSource] = await Promise.all([
    readFile(path.join(ENGINE_DIR, "template.html"), "utf8"),
    readFile(path.join(ENGINE_DIR, "styles", "core.css"), "utf8"),
    readFile(path.join(ENGINE_DIR, "runtime", "core.js"), "utf8"),
    readFile(path.join(SCOREBOARD_DIR, "scoreboard-ui.css"), "utf8"),
    readFile(path.join(SCOREBOARD_DIR, "scoreboard-ui.js"), "utf8"),
    readFile(modelPath, "utf8"),
    readFile(viewPath, "utf8"),
  ]);
  validateModelContract(config, modelSource, lessonFolder);

  let lessonCss = "";
  try {
    const sharedStylePath = sourceFiles.style
      ? path.resolve(sourceDir, sourceFiles.style)
      : null;
    const localStylePath = path.resolve(sourceDir, sourceFiles.css || "lesson.css");
    const [sharedStyle, localStyle] = await Promise.all([
      sharedStylePath ? readFile(sharedStylePath, "utf8") : Promise.resolve(""),
      readFile(localStylePath, "utf8"),
    ]);
    lessonCss = [sharedStyle, localStyle].filter(Boolean).join("\n");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }

  const initialResult = config.results[0];
  const imageAssets = config.imageAssets || {};
  const standards = config.standards || {};
  const tutorial = config.tutorial || {};
  const reward = config.reward || {};
  const result = config.result || {};
  const workbench = config.workbench || {};
  const scoreboard = config.scoreboard || {};
  const engineRuntimeScript = engineRuntime.replaceAll("{{MODEL_NAME}}", config.modelName);
  const lessonConfigScript = `const LESSON_CONFIG = ${JSON.stringify(config)};`;
  const unitNumber = getUnitNumber(config);
  const scoreboardEnabled = Boolean(scoreboard.enabled);
  const hybridResult = result.renderMode === "hybrid-generated-dynamic";
  const generatedCoverStart = (standards.coverStart || "generated-button-art") === "generated-button-art";
  const useSharedCoverStart = generatedCoverStart && standards.coverStartAsset !== "lesson-local";
  const html = renderTemplate(template, {
    documentTitle: `${escapeHtml(config.title)} | 에듀잇티 수학 게임`,
    engineVersion: escapeHtml(config.engineVersion),
    coverStandard: escapeHtml(standards.cover || "generated-title-overlay"),
    coverStartStandard: escapeHtml(standards.coverStart || "generated-button-art"),
    coverStartAsset: escapeHtml(useSharedCoverStart ? "shared-canonical-v1" : "lesson-local"),
    settingsStandard: escapeHtml(standards.settings || "modal-controls"),
    resultVisualStandard: escapeHtml(standards.resultVisual || "generated-assets"),
    resultRenderMode: escapeHtml(requiredString(result.renderMode, "simple-generated")),
    rewardMode: escapeHtml(requiredString(reward.mode, "stage-full")),
    tutorialMode: escapeHtml(requiredString(tutorial.mode, "card-grid")),
    workbenchType: escapeHtml(requiredString(workbench.type, "step-choice")),
    scoreboardEnabled: scoreboardEnabled ? "true" : "false",
    engineCss: indent(engineCss, 4),
    scoreboardCss: indent(scoreboardCss, 4),
    lessonCss: lessonCss.trim() ? "\n" + indent(lessonCss, 4) : "",
    coverImage: escapeHtml(imageAssets.cover || "cover-generated.webp"),
    coverUnitBadge: escapeHtml(`3학년 2학기 ${unitNumber}단원`),
    title: escapeHtml(config.title),
    titleArt: escapeHtml(imageAssets.titleArt || "title-logo-generated.webp"),
    goal: escapeHtml(config.goal),
    startButtonArt: escapeHtml(useSharedCoverStart ? SHARED_COVER_START_BUTTON : (imageAssets.startButton || "start-button-generated.webp")),
    topic: escapeHtml(config.topic),
    unitBadge: escapeHtml(config.unitBadge),
    tutorialTitle: escapeHtml(config.tutorialTitle),
    tutorialCards: renderCards(config.tutorialCards),
    tutorialButton: escapeHtml(config.tutorialButton),
    shortTitle: escapeHtml(config.shortTitle),
    progressLabel: escapeHtml(config.progressLabel),
    initialResultName: escapeHtml(initialResult.name),
    buttonLabel: escapeHtml(config.buttonLabel),
    rewardScene: escapeHtml(imageAssets.rewardScene || "reward-scene-generated.webp"),
    rewardScreenTitle: escapeHtml(config.rewardScreenTitle),
    rewardComplete: escapeHtml(config.rewardComplete),
    initialResultId: escapeHtml(initialResult.id),
    initialResultImage: escapeHtml(initialResult.image),
    initialResultTitleImage: escapeHtml(initialResult.titleImage),
    resultRetryButton: escapeHtml(imageAssets.resultRetryButton || "result-retry-button-generated.webp"),
    resultRestartButtonId: hybridResult ? "restartButton" : "retryButton",
    resultRestartButtonClass: "result-retry-hitbox",
    resultRestartAria: hybridResult ? "다시하기" : "다시",
    resultLeaderboardButton: escapeHtml(imageAssets.resultLeaderboardButton || imageAssets.startButton || "start-button-generated.webp"),
    scoreboardTitle: escapeHtml(requiredString(scoreboard.title, "전국 순위")),
    scoreboardTitleArt: escapeHtml(requiredString(scoreboard.titleArt, "")),
    scoreboardResultKind: escapeHtml(requiredString(scoreboard.resultKind, "score")),
    scoreboardScoreLabel: escapeHtml(requiredString(scoreboard.scoreLabel, "내 점수")),
    scoreboardListTitle: escapeHtml(requiredString(scoreboard.listTitle, "점수 순위")),
    scoreboardUnit: escapeHtml(requiredString(scoreboard.unit, config.unitBadge)),
    scoreboardRuntimeScript: indent(scoreboardRuntime, 4),
    lessonConfigScript: indent(lessonConfigScript, 4),
    lessonModelScript: indent(modelSource, 4),
    lessonViewScript: indent(viewSource, 4),
    engineRuntimeScript: indent(engineRuntimeScript, 4),
    modelName: config.modelName,
  });

  const outputDir = path.join(ROOT, lessonFolder);
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, "index.html"), html);
  console.log(`built ${path.relative(ROOT, path.join(outputDir, "index.html"))} from ${path.relative(ROOT, sourceDir)}`);
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
