import assert from "node:assert/strict";
import { createHash } from "node:crypto";
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
const resultFullsceneRoot = path.join(
  ROOT,
  "_shared",
  "mathmon",
  "diversity-reward-pack",
  "lesson-scenes",
  "3-2-3-4",
  "result-fullscene-v2",
);
const resultFullsceneContract = JSON.parse(await readFile(path.join(resultFullsceneRoot, "contract.json"), "utf8"));
await readFile(path.join(resultFullsceneRoot, "contact-sheets", "result-garden-v2-contact-sheet.png"));

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
assert.equal(config.qa.circleDrawingAudit.completionKeepsRuler, true);
assert.equal(config.qa.circleDrawingAudit.radiusLabelContained, true);
assert.equal(config.qa.circleDrawingAudit.correctEffectStandard, "circle-draw-correct-effect-v1");
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
assert.equal(config.qa.correctFeedbackEffectAudit.standard, "circle-draw-correct-effect-v1");
assert.equal(config.qa.correctFeedbackEffectAudit.preservesRuler, true);
assert.equal(config.qa.correctFeedbackEffectAudit.containsRadiusLabel, true);
assert.equal(config.qa.rewardEffectAudit.contrastStandard, "bridge-gain-vs-tier-v1");
assert.equal(config.qa.rewardEffectAudit.durationMs, 900);
assert.equal(config.qa.rewardEffectAudit.tierUpDurationMs, 1800);
assert.equal(config.qa.rewardEffectAudit.gainClass, "is-changing");
assert.equal(config.qa.rewardEffectAudit.gainUsesImpactLayer, false);
assert.equal(config.qa.rewardEffectAudit.tierUpUsesImpactLayer, true);
assert.equal(config.qa.layoutAudit.tertiary, undefined);
assert.deepEqual([...config.qa.layoutAudit.verticalOrder], ["primary", "secondary"]);
assert.equal(config.tutorialCards[0].image, "tutorial-page-1-generated.png");
assert.equal(tutorialPoster.readUInt32BE(16), 1280, "tutorial poster must be one 1280px-wide raster");
assert.equal(tutorialPoster.readUInt32BE(20), 800, "tutorial poster must be one 800px-tall raster");
assert.equal(config.reward.changeLabel, "원의 점수");
assert.equal(config.progressLabel, "원의 점수");
assert.equal(config.result.renderMode, "fullscene-generated-dynamic-slots");
assert.equal(config.result.showNextGoal, true);
assert.equal(config.result.layout.titleWidth, 320);
assert.equal(config.result.layout.correctWidth, 180);
assert.deepEqual(config.result.layout.retryRect, { x:901, y:515, width:316, height:120 });
assert.equal(config.standards.resultPanelContainment, "result-panel-containment-v2");
assert.equal(config.standards.resultRewardDominance, "result-primary-reward-dominance-v1");
assert.deepEqual(config.results.map((result) => result.name), [
  "동글 씨앗",
  "반짝 꽃",
  "별빛 꽃",
  "달빛 정원",
  "황금 정원",
  "무지개 정원",
]);
assert.deepEqual(resultFullsceneContract.expectedStates, config.results.map((result) => result.id));
assert.deepEqual(resultFullsceneContract.expectedRanks, [0, 1, 2, 3, 4, 5]);
assert.equal(resultFullsceneContract.topTwoColorFamiliesMustDiffer, true);
const resultHashes = [];
for (const result of config.results) {
  const scenePng = await readFile(path.join(resultFullsceneRoot, "runtime-png", result.image.replace(/\.webp$/, ".png")));
  assert.equal(scenePng.readUInt32BE(16), 1280, `${result.id}: result scene width`);
  assert.equal(scenePng.readUInt32BE(20), 800, `${result.id}: result scene height`);
  resultHashes.push(createHash("sha256").update(scenePng).digest("hex"));
  await readFile(path.join(ROOT, LESSON, result.image));
  await readFile(path.join(ROOT, LESSON, result.titleImage));
}
assert.equal(new Set(resultHashes).size, 6, "all six final reward scenes must be distinct complete images");
assert.ok(config.result.stateImageSet.fixedGeneratedElements.includes("result-title-raster"));
assert.ok(config.result.stateImageSet.fixedGeneratedElements.includes("result-retry-raster"));
assert.deepEqual(config.result.stateImageSet.dynamicOverlays, ["correct-count", "next-goal"]);
assert.equal(config.result.stateImageSet.forbidEffectOverlay, true);
assert.equal(config.result.stateImageSet.forbidBlendMode, true);
assert.equal(config.result.stateImageSet.forbidTierCssFilter, true);
assert.deepEqual(config.qa.resultBoardAudit.expectedAxisXByTier, config.result.layout.axisXByTier);
assert.equal(config.qa.resultRewardDominanceAudit.maximumVisibleInformationNodes, 4);
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
  assert.ok(problems.filter((problem) => problem.conditionType === "radius").length === 5, `seed ${seed}: five radius problems`);
  assert.ok(problems.filter((problem) => problem.conditionType === "diameter").length === 5, `seed ${seed}: five diameter problems`);
  assert.ok(problems.every((problem, index) => problem.conditionType === (index % 2 === 0 ? "radius" : "diameter")), `seed ${seed}: radius and diameter must alternate`);
  assert.deepEqual([...new Set(problems.slice(0, 2).map((problem) => problem.conditionType))].sort(), ["diameter", "radius"], `seed ${seed}: both conditions appear in the first two problems`);
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
assert.match(viewSource, /async function onStepCorrect/, "a correct circle must hold a dedicated confirmation effect before completion");
assert.match(viewSource, /globalThis\.onStepCorrect = onStepCorrect/, "the correct-circle effect hook must be registered");
assert.match(viewSource, /stepBoard\?\.remove\(\)/, "the redundant instruction board must be removed from the play DOM");
assert.match(viewSource, /class="circle-paper" x="10" y="8" width="740" height="424"/, "the circle workbench paper must fill the SVG surface");
assert.match(viewSource, /class="circle-workbench-divider" x1="330"/, "the ruler and circle lanes must be structurally separated");
assert.match(viewSource, /class="draw-radius-chip"[^>]+width="144" height="40"/, "the radius label must use a fixed safe chip instead of bare text");
assert.match(viewSource, /problem\.conditionType === "diameter"[\s\S]*?`지름 \$\{problem\.givenValue\} cm`/, "diameter completion must explain the given diameter, not repeat only the radius");
assert.match(viewSource, />\$\{measureLabel\}<\/text>/, "the completion chip must render the condition-aware measure label");
assert.match(viewSource, /const rulerControls = `<g class="circle-ruler">/, "the ruler must remain on the completed workbench");
assert.match(viewSource, /circle-correct-halo/, "correct completion must show a full-circle confirmation halo");
assert.match(viewSource, /circle-correct-badge/, "correct completion must show an unmistakable check badge");
assert.doesNotMatch(viewSource, /circle-radius-readout|circle-ruler-unit|circle-helper-text/, "redundant radius, unit, and helper labels must be removed");
assert.doesNotMatch(viewSource, /ensureCircleTutorialOverlay|tutorial-compass-overlay|tutorialRulerMarkup/, "tutorial must be a single generated raster without runtime SVG composition");
assert.doesNotMatch(viewSource, /무늬 점수|무늬 등급|진행도/, "problem view must not contain reward panels");
assert.match(cssSource, /\.compass-pencil-handle\s*\{[^}]*cursor:\s*ew-resize/s, "drag handle must be visibly draggable");
assert.match(cssSource, /@keyframes circle-trace/, "circle confirmation must animate the trace");
assert.match(cssSource, /@keyframes circle-correct-lock/, "correct circle must have its own lock effect");
assert.match(cssSource, /@keyframes circle-correct-badge/, "correct circle must pop a check badge");
assert.doesNotMatch(cssSource, /is-celebrating\s*~\s*\.compass-play-progress-impact-stage/, "ordinary gains must not reuse the Stage-wide tier-up impact");
assert.match(cssSource, /is-tier-up\s*~\s*\.compass-play-progress-impact-stage/, "tier-up must keep the Stage-wide impact layer");
assert.match(cssSource, /\.complete-text\s*\{\s*display:\s*none;/, "completion must leave only the reward action button below the finished circle");
assert.match(cssSource, /#resultMeasureSvg,[\s\S]*?#resultMeasureTrackSvg,[\s\S]*?#resultMeasureFillSvg,[\s\S]*?display:\s*none/, "final reward must hide the internal score and bar");
assert.match(cssSource, /#screen-result > \.raster-bg\s*\{[^}]*filter:\s*none;[^}]*mix-blend-mode:\s*normal;/, "tier scenes must render natively without CSS tier effects");
assert.doesNotMatch(viewSource, /무늬왕|무늬 빛/, "retired reward names must not remain in the play view");
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
