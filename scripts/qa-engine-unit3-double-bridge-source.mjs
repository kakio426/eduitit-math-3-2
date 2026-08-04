import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-3-mathmon-double-bridge";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const lessonJsonSource = await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8");
const config = JSON.parse(lessonJsonSource);
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
const engineSource = await readFile(path.join(ROOT, "_engine", "v1", "runtime", "core.js"), "utf8");
const runtimeSource = await readFile(path.join(ROOT, LESSON, "index.html"), "utf8");
const lessonJsonSha = createHash("sha256").update(lessonJsonSource).digest("hex");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.reward.standard, "mathmon-unified-reward-v1", "lesson must opt into the unified reward contract");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(config.qa.emptyRewardAuditViewport, "user-reported-missing-left-progress-1082x987-dpr2", "empty and tier-up browser fixtures must run independently");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");

assert.equal(config.workbench.type, "circle-double-bridge");
assert.equal(config.buttonLabel, "점수 보기");
assert.equal(config.reward.changeLabel, "뚝딱뚝딱 점수");
assert.equal(config.imageAssets.problemStage, "problem-workshop-v3-generated.webp");
assert.ok(config.assets.includes("problem-workshop-v3-generated.webp"), "v3 workshop stage must be listed");
assert.equal(config.tutorialCards[1]?.image, "tutorial-page-2-v4-generated.webp");
assert.equal(config.tutorialCards[1]?.body, "마지막에 내가 만든 다리를 봐요.");
assert.equal(config.tutorial.rewardPreview?.standard, "tutorial-final-reward-cohesion-v1");
assert.equal(config.tutorial.rewardPreview?.image, "tutorial-page-2-v4-generated.webp");
assert.equal(config.tutorial.rewardPreview?.canvas, "1280x800");
assert.equal(config.tutorial.rewardPreview?.protagonist, "zfa-03-sudalmon");
assert.equal(config.tutorial.rewardPreview?.characterAnatomy, "two-arms-two-paws");
assert.deepEqual([...config.tutorial.rewardPreview?.bridgeStates], ["log", "small", "bridge", "big", "grand", "rainbow"]);
assert.equal(config.qa.tutorialRewardAudit?.standard, "tutorial-final-reward-cohesion-v1");
assert.equal(config.qa.tutorialRewardAudit?.source, "tutorial-page-2-v4-generated.webp");
assert.deepEqual([...config.qa.tutorialRewardAudit?.expectedBridgeStates], ["log", "small", "bridge", "big", "grand", "rainbow"]);
assert.deepEqual([...config.qa.tutorialRewardAudit?.expectedVisibleText], [
  "무엇을 얻어요?",
  "10문제를 풀어요.",
  "맞히면 다리가 더 멋져질 수 있어요.",
  "가끔은 다리가 작아질 수도 있어요.",
  "마지막에 내가 만든 다리를 봐요.",
  "이전",
  "문제 시작",
]);
assert.equal(config.qa.tutorialRewardAudit?.humanizerGrade, "A");
assert.deepEqual(config.qa.tutorialRewardAudit?.reviewViewport, {
  name: "user-feedback-1079x929",
  width: 1079,
  height: 929,
});
assert.ok(config.assets.includes("tutorial-page-2-v4-generated.webp"), "approved-copy reward tutorial poster must be listed");
assert.ok(!config.assets.includes("tutorial-page-2-v3-generated.webp"), "retired v3 tutorial poster must not be listed");
assert.ok(!config.assets.includes("tutorial-page-2-generated.webp"), "retired tutorial reward poster must not be listed");
assert.ok(!config.assets.includes("problem-stage-v2-generated.webp"), "retired v2 problem stage must not be listed");
assert.ok(!config.assets.includes("problem-stage-generated.webp"), "retired problem stage must not be listed");
assert.equal(config.goal, "반지름 두 개를 이으면 지름이 돼요.");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-v2-generated.webp");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.ok(config.assets.includes("../_shared/mathmon/cover-start-button/start-button-generated.webp"), "shared start button must be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.65);
assert.equal(config.qa.topControlsAudit.standard, "stage-top-controls-v1");
assert.equal(config.qa.topControlsAudit.unitBadge, "#screen-play .hud-right .unit-badge");
assert.equal(config.qa.topControlsAudit.settingsButton, "#settingsButton");
assert.equal(config.qa.topControlsAudit.topTolerancePx, 1);
assert.equal(config.qa.topControlsAudit.bottomTolerancePx, 1);
assert.equal(config.qa.topControlsAudit.centerYTolerancePx, 1);
assert.equal(config.qa.topControlsAudit.heightTolerancePx, 1);
assert.equal(config.qa.topControlsAudit.minGapPx, 8);
assert.equal(config.qa.completionAudit.standard, "completion-density-v1");
assert.equal(config.qa.completionAudit.panel, ".complete-panel");
assert.equal(config.qa.completionAudit.text, ".complete-text");
assert.equal(config.qa.completionAudit.action, "#rewardButton");
assert.equal(config.qa.completionAudit.minTextFontPx, 32);
assert.equal(config.qa.completionAudit.minActionWidthPx, 220);
assert.equal(config.qa.completionAudit.minActionHeightPx, 80);
assert.equal(config.qa.completionAudit.minActionFontPx, 24);
assert.equal(config.qa.completionAudit.minActionWidthRatio, 0.24);
assert.equal(config.qa.completionAudit.maxPanelHeightRatio, 0.31);
assert.equal(config.qa.completionAudit.minDominantHeightRatio, 0.45);
assert.equal(config.qa.completionAudit.minContentGapPx, 24);
assert.equal(config.qa.completionAudit.centerYTolerancePx, 1);
assert.deepEqual(config.qa.correctFeedbackEffectAudit, {
  standard: "bridge-answer-lock-effect-v1",
  trigger: ".length-choice[data-state=\"correct\"]",
  workbench: ".bridge-workshop",
  problemCard: ".problem-card",
  completionPanel: "#completePanel",
  activeClass: "is-answer-locking",
  durationMs: 680,
  completionRevealMs: 420,
  preservesCorrectEquation: true,
  supportsReducedMotion: true,
  reviewViewport: { name: "user-feedback-reward-1079x929", width: 1079, height: 929 },
});
assert.ok(config.qa.viewports.some((viewport) => viewport.name === "user-feedback-reward-1079x929" && viewport.width === 1079 && viewport.height === 929), "the reported reward viewport must remain a named browser regression");
assert.equal(config.qa.visualContractVersion, 1);
assert.equal(config.standards.playProgress, "generated-play-progress-v3-left-character");
assert.equal(config.workbench.playStateImageSet.standard, "generated-play-progress-v3-left-character");
assert.equal(config.workbench.playStateImageSet.count, 6);
assert.equal(config.workbench.playStateImageSet.canvas, "768x1536");
assert.equal(config.workbench.playStateImageSet.objectFit, "contain");
assert.equal(config.workbench.playStateImageSet.protagonist, "zfa-03-sudalmon");
assert.equal(config.qa.playProgressAudit.standard, "stage-left-play-progress-v1");
assert.deepEqual(config.qa.leftProgressWidthAudit, {
  standard: "stage-left-progress-width-v1",
  panel: ".compass-play-progress",
  workArea: ".bridge-workshop",
  expectedWidthRatio: 0.245,
  minWidthRatio: 0.234375,
  maxWidthRatio: 0.252,
  minWorkGapRatio: 0.015625,
  tolerancePx: 1,
});
assert.equal(config.qa.rewardEffectAudit.standard, "modal-dismiss-world-impact-v2");
assert.equal(config.qa.rewardEffectAudit.preEffectDelayMs, 320);
assert.ok(config.qa.rewardEffectAudit.minVisibleMs >= 1200);
assert.ok(config.qa.rewardEffectAudit.minImpactStageWidthRatio >= 0.32);
assert.deepEqual(config.qa.rewardReentryAudit, {
  standard: "reward-single-consumption-v1",
  trigger: "#rewardButton",
  modalNext: "#modalRewardNextButton",
  transitionAttribute: "data-reward-transitioning",
  hideTriggerDuringTransition: true,
  disableTriggerDuringTransition: true,
});
assert.deepEqual(config.qa.playProgressAudit.panelPlacement, {
  leftRatio: 0.025,
  topRatio: 0.11,
  widthRatio: 0.245,
  heightRatio: 0.84,
  tolerancePx: 1,
});
assert.equal(new Set(config.results.map((result) => result.playImage)).size, 6, "six tiers must use six dedicated play images");
assert.ok(config.results.every((result) => config.assets.includes(result.playImage)), "every play image must be listed as a runtime asset");
assert.equal(config.qa.circleRelationAudit.standard, "circle-only-one-known-v4");
assert.equal(config.qa.circleRelationAudit.promptMode, "ask-only");
assert.equal(config.qa.circleRelationAudit.maxKnownLabels, 1);
assert.equal(config.qa.circleRelationAudit.choiceTrackPx, 166);
assert.equal(config.qa.circleRelationAudit.compactChoiceTrackPx, 146);
assert.equal(config.qa.circleRelationAudit.minChoiceHeightPx, 58);
assert.equal(config.qa.circleRelationAudit.visual, ".circle-relation-svg");
assert.equal(config.qa.circleRelationAudit.answer, ".source-question");
assert.equal(config.qa.circleRelationAudit.choice, ".length-choice");
assert.deepEqual([...config.qa.circleRelationAudit.forbidSelectors], [
  ".bridge-target",
  ".length-transfer",
  ".bridge-part-svg",
  ".installed-bridge",
]);
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "DIAMETER_NOT_DOUBLED",
  "DIAMETER_ONE_SHORT",
  "DIAMETER_TOO_LONG",
  "RADIUS_NOT_HALVED",
  "RADIUS_TOO_LONG",
  "RADIUS_TOO_SHORT",
]);

vm.runInContext(
  `${viewSource}
   globalThis.__getCircleGeometry = getCircleGeometry;
   globalThis.__circleRelationMarkup = circleRelationMarkup;`,
  context
);
const getCircleGeometry = context.__getCircleGeometry;
const circleRelationMarkup = context.__circleRelationMarkup;

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.ask, (counts.get(problem.ask) || 0) + 1);
    assert.equal(problem.diameter, problem.radius * 2, `${problem.id}: diameter is twice radius`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four length choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}: four distinct lengths`);
    assert.ok(step.choices.every((choice) => choice.visualKind === "length"), `${problem.id}: choices stay numeric`);
    assert.equal(step.instruction, "알맞은 길이를 골라요.", `${problem.id}: one short action`);
    assert.equal(problem.prompt, problem.ask === "지름" ? "지름은?" : "반지름은?", `${problem.id}: headline asks only the unknown`);
    assert.ok(step.correctText.length <= 34, `${problem.id}: confirmation copy stays short`);
    const geometry = getCircleGeometry(problem);
    assert.equal(geometry.centerX, 380, `${problem.id}: circle stays centered`);
    assert.equal(geometry.circleY, 158, `${problem.id}: circle baseline stays fixed`);
    assert.equal(geometry.circleRadiusPx, 124, `${problem.id}: circle size stays fixed`);
    assert.equal(geometry.answer, step.answer, `${problem.id}: unknown segment uses the answer`);
    const idleMarkup = circleRelationMarkup(problem, geometry, null);
    assert.equal((idleMarkup.match(/class="known-length"/g) || []).length, 1, `${problem.id}: known length appears once`);
    const requiredMisconception = problem.ask === "지름" ? "DIAMETER_NOT_DOUBLED" : "RADIUS_NOT_HALVED";
    assert.ok(step.choices.some((choice) => choice.misconceptionId === requiredMisconception), `${problem.id}: core misconception`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  assert.equal(counts.get("지름"), 5, `seed ${seed}: five diameter questions`);
  assert.equal(counts.get("반지름"), 5, `seed ${seed}: five radius questions`);
}

assert.match(viewSource, /circle-relation-svg/, "the problem must show one centered circle relation");
assert.match(viewSource, /length-choice-value/, "each answer must be a simple numeric length");
assert.match(viewSource, /source-question/, "the unknown length must stay on the circle segment");
assert.match(modelSource, /알맞은 길이를 골라요\./, "the instruction must contain one short action");
assert.doesNotMatch(viewSource, /bridge-target|length-transfer|bridge-part-svg|installed-bridge/, "the problem must not render a second bridge diagram");
assert.doesNotMatch(viewSource, /bridgeStructureMarkup|bridgeDifferenceMarkup|getBridgeFit/, "retired bridge-fit geometry must be removed");
assert.doesNotMatch(viewSource, /다리 자리|같은 길이/, "retired explanatory labels must be removed");
assert.match(viewSource, /classList\.remove\("result-restart-hitbox"\)/, "legacy result hitbox class must stay removed");
assert.doesNotMatch(viewSource, /classList\.add\("result-restart-hitbox"\)/, "the retired result hitbox class must not be restored");
assert.match(viewSource, /selected === geometry\.answer \? "=" : "≠"/, "wrong comparison must never show a false equality");
assert.match(viewSource, /className = "compass-play-progress"/, "problem view must expose the measured left progress panel");
assert.match(viewSource, /function syncBridgePlayProgress/, "play progress must synchronize all six result tiers");
assert.match(viewSource, /function onRewardReveal/, "reward reveal must remember the pending world change");
assert.match(viewSource, /async function onRewardDismiss/, "reward dismissal must apply the world change after the modal closes");
assert.match(viewSource, /async function onStepCorrect/, "correct choice must run a brief answer-lock effect before completion");
assert.match(viewSource, /globalThis\.onStepCorrect = onStepCorrect/, "correct choice effect hook must be registered with the engine");
assert.match(viewSource, /correctEffectPhase = "active"/, "correct effect must expose an active browser QA phase");
assert.match(viewSource, /globalThis\.onRewardDismiss = onRewardDismiss/, "reward dismissal hook must be registered with the engine");
assert.match(viewSource, /effectStartedWithModalHidden/, "world impact must expose modal-first timing evidence");
assert.match(engineSource, /state\.rewardTransitioning/, "the shared engine must keep an explicit reward transition lock");
assert.match(engineSource, /if \(!state\.completed \|\| state\.rewardPhase !== "idle" \|\| state\.rewardTransitioning\) return;/, "the reward trigger must reject re-entry while transitioning");
assert.match(engineSource, /function setRewardTransitioning\(active\)/, "the shared engine must expose one transition-lock setter");
assert.match(engineSource, /ui\.continueButton\.disabled = state\.rewardTransitioning;/, "the stale reward trigger must be disabled during transition");
assert.match(engineSource, /if \(state\.rewardTransitioning\) ui\.continueButton\.hidden = true;/, "the stale reward trigger must be hidden during transition");
assert.ok(runtimeSource.includes(`data-lesson-json-sha256="${lessonJsonSha}"`), "the built lesson must match the current lesson.json hash");
assert.ok(runtimeSource.includes('"rewardReentryAudit":{"standard":"reward-single-consumption-v1"'), "the built lesson must embed the reward re-entry contract");
assert.match(runtimeSource, /if \(!state\.completed \|\| state\.rewardPhase !== "idle" \|\| state\.rewardTransitioning\) return;/, "the built lesson must include the reward transition guard");
assert.match(runtimeSource, /ui\.continueButton\.disabled = state\.rewardTransitioning;/, "the built lesson must disable the stale reward trigger");
assert.doesNotMatch(viewSource, /다리 점수|다리 등급|진행도/, "problem view must not add a second reward vocabulary");
assert.doesNotMatch(viewSource, /bridgeChoiceMarkup|bridge-choice-svg/, "retired floating measurement-handle choices must be removed");
assert.match(lessonCss, /\.compass-play-progress\s*\{[\s\S]*?top:\s*11%;[\s\S]*?left:\s*2\.5%;[\s\S]*?width:\s*24\.5%;[\s\S]*?height:\s*84%;/, "left progress panel must keep the fixed Stage placement");
assert.match(lessonCss, /\.bridge-workshop\s*\{[\s\S]*?right:\s*2\.5%;[\s\S]*?left:\s*29\.5%;/, "learning area must preserve the shared left-progress gap");
assert.match(lessonCss, /\.compass-play-progress-art\s*\{[\s\S]*?object-fit:\s*contain;/, "play scene must never be cropped");
assert.match(lessonCss, /\.compass-play-progress-impact-stage\s*\{[\s\S]*?width:\s*35%;/, "world impact must cover at least 32% of the Stage width");
assert.match(lessonCss, /\.hud\s*\{[\s\S]*?top:\s*var\(--top-control-y\);/, "play HUD and settings must share one vertical token");
assert.match(lessonCss, /\.circle-relation-svg\s*\{[\s\S]*?max-width:\s*650px;/, "the single circle visual must stay compact");
assert.match(lessonCss, /\.length-choice\s*\{[\s\S]*?min-height:\s*58px;[\s\S]*?place-items:\s*center;/, "numeric choices must use large centered touch targets");
assert.match(lessonCss, /\.choices-panel\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2/, "four lengths must stay in a two-by-two grid");
assert.match(lessonCss, /grid-template-rows:\s*minmax\(0,\s*1fr\)\s+50px\s+166px;/, "desktop must give more height to answer choices");
assert.match(lessonCss, /grid-template-rows:\s*minmax\(0,\s*1fr\)\s+46px\s+146px;/, "compact landscape must keep larger answer choices");
assert.match(lessonCss, /--bridge-complete-height:\s*176px;/, "desktop completion panel must use the compact fixed track");
assert.match(lessonCss, /\.complete-text\s*\{[\s\S]*?font-size:\s*clamp\(2rem,\s*3\.1vw,\s*2\.65rem\);/, "completion equation must be visually dominant");
assert.match(lessonCss, /\.complete-panel \.primary-button\s*\{[\s\S]*?min-width:\s*260px;[\s\S]*?min-height:\s*92px;/, "bridge-view action must be substantially larger");
assert.match(lessonCss, /bridge-answer-lock-card/, "correct answer must pulse the learning card without covering it");
assert.match(lessonCss, /bridge-answer-lock-choice/, "the chosen correct length must receive a visible lock-in effect");
assert.match(lessonCss, /bridge-complete-reveal/, "the completed equation and score action must enter visibly");
assert.match(lessonCss, /prefers-reduced-motion:\s*reduce[\s\S]*?is-answer-locking/, "correct feedback effects must respect reduced motion");
assert.match(lessonCss, /\.bridge-workshop\.is-complete\s*\{[\s\S]*?var\(--bridge-complete-height\);/, "completion must reduce the empty panel track");

console.log("QA_ENGINE_UNIT3_DOUBLE_BRIDGE_SOURCE: PASS");
