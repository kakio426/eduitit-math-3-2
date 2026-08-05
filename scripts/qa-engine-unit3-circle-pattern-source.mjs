import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-4-mathmon-circle-pattern";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const cssSource = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
const tutorialPoster = await readFile(path.join(ROOT, LESSON, config.tutorialCards[0].image));

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.reward.standard, "mathmon-unified-reward-v1", "lesson must opt into the unified reward contract");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");

assert.equal(config.workbench.type, "circle-pattern-choice");
assert.equal(config.workbench.interactionStandard, "compass-radius-drag-v1");
assert.deepEqual([...config.workbench.curriculumStandards], ["4수03-06", "4수03-07"]);
assert.equal(config.standards.circleDrawing, "compass-radius-drag-v1");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-v2-generated.webp");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.65);
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "RADIUS_TOO_SHORT",
  "RADIUS_TOO_LONG",
  "DIAMETER_AS_RADIUS",
]);
assert.equal(config.qa.circleDrawingAudit.interaction, "compass-radius-drag");
assert.equal(config.qa.circleDrawingAudit.requiresAdjustmentBeforeSubmit, true);
assert.equal(config.qa.circleDrawingAudit.instructionBoardRemoved, true);
assert.equal(config.qa.circleDrawingAudit.layoutStandard, "circle-workbench-split-v2");
assert.equal(config.qa.circleDrawingAudit.selectedConcept, "design-concepts/circle-workbench-layout-b-selected.png");
assert.equal(config.qa.circleDrawingAudit.unitPx, 42);
assert.equal(config.qa.circleDrawingAudit.drawUnitPx, 50);
assert.equal(config.qa.circleDrawingAudit.rulerZeroX, 82);
assert.deepEqual(config.qa.circleDrawingAudit.paperRect, { x:10, y:8, width:740, height:424 });
assert.equal(config.qa.circleDrawingAudit.dividerX, 330);
assert.deepEqual([...config.qa.circleDrawingAudit.forbidSelectors], [
  ".circle-radius-readout",
  ".circle-ruler-unit",
  ".circle-helper-text",
]);
assert.equal(config.qa.playProgressAudit.panelPlacement.widthRatio, 0.245);
assert.equal(config.qa.leftProgressWidthAudit.standard, "stage-left-progress-width-v1");
assert.equal(config.qa.leftProgressWidthAudit.expectedWidthRatio, 0.245);
assert.equal(config.qa.layoutAudit.tertiary, undefined);
assert.deepEqual([...config.qa.layoutAudit.verticalOrder], ["primary", "secondary"]);
assert.equal(config.tutorialCards[0].image, "tutorial-page-1-generated.png");
assert.equal(tutorialPoster.readUInt32BE(16), 1280, "tutorial poster must be one 1280px-wide raster");
assert.equal(tutorialPoster.readUInt32BE(20), 800, "tutorial poster must be one 800px-tall raster");
assert.equal(config.reward.changeLabel, "원의 점수");
assert.equal(config.qa.rewardModalAudit.standard, "unit3-modal-art-compact-v2");
assert.equal(config.qa.rewardModalAudit.cardWidthPx, 430);
assert.equal(config.qa.rewardModalAudit.cardHeightPx, 480);
assert.equal(config.qa.rewardModalAudit.cardMaxWidthRatio, 0.82);
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "user-feedback-completion-1079x929" && viewport.width === 1079 && viewport.height === 929),
  "the reported 1079x929 viewport must remain a named regression",
);

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  assert.ok(problems.slice(0, 5).every((problem) => problem.conditionType === "radius"), `seed ${seed}: radius scaffold first`);
  assert.ok(problems.slice(5).every((problem) => problem.conditionType === "diameter"), `seed ${seed}: diameter scaffold second`);
  const misconceptions = new Set();
  for (const problem of problems) {
    assert.equal(problem.type, "circle-draw", `${problem.id}: direct circle drawing problem`);
    assert.ok(problem.answerRadius >= 2 && problem.answerRadius <= 4, `${problem.id}: radius within ruler`);
    if (problem.conditionType === "radius") assert.equal(problem.answerRadius, problem.givenValue, `${problem.id}: radius condition`);
    if (problem.conditionType === "diameter") assert.equal(problem.answerRadius * 2, problem.givenValue, `${problem.id}: diameter is twice radius`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four ruler snap values`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(step.choices.map((choice) => choice.value).join(","), "1,2,3,4", `${problem.id}: ruler values 1 through 4`);
    assert.equal(step.choices.filter((choice) => model.validateChoice(step, choice)).length, 1, `${problem.id}: exactly one accepted radius`);
    for (const choice of step.choices) {
      misconceptions.add(choice.misconceptionId);
      if (!model.validateChoice(step, choice)) {
        assert.ok(choice.feedback && choice.feedback.length <= 24, `${problem.id}: short diagnostic feedback`);
      }
    }
  }
  assert.ok(misconceptions.has("RADIUS_TOO_SHORT"), `seed ${seed}: short-radius misconception`);
  assert.ok(misconceptions.has("RADIUS_TOO_LONG"), `seed ${seed}: long-radius misconception`);
  assert.ok(misconceptions.has("DIAMETER_AS_RADIUS"), `seed ${seed}: diameter-as-radius misconception`);
}

assert.match(viewSource, /dataset\.interaction = "compass-radius-drag"/, "browser QA must recognize the direct manipulation");
assert.match(viewSource, /role="slider"/, "compass pencil handle must expose a slider role");
assert.match(viewSource, /setPointerCapture/, "compass drag must use Pointer Events");
assert.match(viewSource, /ArrowLeft.*ArrowDown.*ArrowRight.*ArrowUp/s, "compass slider must support arrow keys");
assert.match(viewSource, /Math\.round/, "free movement must snap to ruler ticks");
assert.match(viewSource, /class="drawn-circle/, "confirmation must draw the selected circle");
assert.match(viewSource, /stepBoard\?\.remove\(\)/, "the redundant instruction board must be removed from the play DOM");
assert.match(viewSource, /class="circle-paper" x="10" y="8" width="740" height="424"/, "the circle workbench paper must fill the SVG surface");
assert.match(viewSource, /class="circle-workbench-divider" x1="330"/, "the ruler and circle lanes must be structurally separated");
assert.match(viewSource, /x="\$\{centerX \+ drawRadius \* \.62\}" y="\$\{centerY \+ 28\}">반지름/, "the radius label must sit between the compass center and pencil");
assert.doesNotMatch(viewSource, /circle-radius-readout|circle-ruler-unit|circle-helper-text/, "redundant radius, unit, and helper labels must be removed");
assert.doesNotMatch(viewSource, /ensureCircleTutorialOverlay|tutorial-compass-overlay|tutorialRulerMarkup/, "tutorial must be a single generated raster without runtime SVG composition");
assert.doesNotMatch(viewSource, /무늬 점수|무늬 등급|진행도/, "problem view must not contain reward panels");
assert.match(cssSource, /\.compass-pencil-handle\s*\{[^}]*cursor:\s*ew-resize/s, "drag handle must be visibly draggable");
assert.match(cssSource, /@keyframes circle-trace/, "circle confirmation must animate the trace");
assert.match(cssSource, /\.complete-text\s*\{\s*display:\s*none;/, "completion must leave only the reward action button below the finished circle");
assert.doesNotMatch(cssSource, /tutorial-compass-overlay|tutorial-ruler|tutorial-span-label/, "tutorial overlay CSS must be removed");
assert.match(
  cssSource,
  /\.game\[data-result-panel-containment="result-panel-containment-v2"\] \.result-title-art,\s*\.game\[data-result-panel-containment="result-panel-containment-v2"\] \.result-retry-hitbox \.result-retry-art\s*\{\s*display:\s*block\s*!important;/,
  "the generated title and retry raster must remain visible in the contained result panel",
);
assert.doesNotMatch(
  cssSource,
  /\.result-restart-hitbox/,
  "result geometry must target the runtime .result-retry-hitbox class",
);

console.log("QA_ENGINE_UNIT3_CIRCLE_PATTERN_SOURCE: PASS");
