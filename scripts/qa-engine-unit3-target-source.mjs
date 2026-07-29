import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-1-mathmon-target-hit";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const cssSource = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
const engineSource = await readFile(path.join(ROOT, "_engine/v1/runtime/core.js"), "utf8");
for (const asset of [
  "tutorial-page-1-target-console-v2-generated.webp",
  "score-view-button-v1-generated.webp",
  "reward-event-closed-generated.webp",
  "result-next-legend-title-generated-v1.png",
  "result-final-title-generated-v1.png",
  "play-target-practice-v2-generated.webp",
  "play-target-legend-v2-generated.webp",
  "play-target-progress-v2-contact-sheet.png",
  "play-vs-final-v2-contact-sheet.png",
]) {
  const bytes = await readFile(path.join(ROOT, LESSON, asset));
  assert.ok(bytes.byteLength > 0, `${asset}: runtime asset must exist and be non-empty`);
}

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "circle-relations");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");
assert.equal(config.imageAssets.scoreViewButton, "score-view-button-v1-generated.webp");
assert.equal(config.imageAssets.tutorialNextButton, "../_shared/action-buttons/next-button-generated.webp");
assert.equal(config.tutorialCards[0].image, "tutorial-page-1-target-console-v2-generated.webp");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-generated.webp");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.equal(config.reward.mode, "modal-art");
assert.equal(config.reward.standard, "mathmon-unified-reward-v1");
assert.equal(config.reward.unitLabel, "표적 점수");
assert.equal(config.reward.closedLabel, "표적 점수가 얼마나 오를까요?");
assert.deepEqual({ ...config.reward.fairness }, {
  emptyKeepsProgress: true,
  lossCapAtCommonGainMin: true,
});
assert.equal(config.reward.stateImageSet, undefined);
assert.equal(config.imageAssets.rewardClosed, "reward-event-closed-generated.webp");
assert.equal(config.imageAssets.rewardScene, config.imageAssets.rewardClosed);
assert.doesNotMatch(config.imageAssets.rewardScene, /^result-/, "reward must not reuse a final-result scene");
assert.ok(config.assets.includes(config.imageAssets.rewardClosed), "closed reward art must be a runtime asset");
assert.ok(config.rewardEvents.every((event) => !event.emptiesPower), "zero event must keep accumulated score");
assert.deepEqual(
  config.rewardEvents.map(({ weight, min, max }) => [weight, min, max]),
  [
    [6400, 6, 10],
    [1500, -5, -2],
    [1200, 14, 22],
    [500, 30, 30],
    [380, 0, 0],
    [20, 100, 100],
  ],
);
assert.deepEqual(
  config.rewardEvents.map(({ rarity }) => rarity),
  ["common", "common", "rare", "rare", "common", "legend"],
);
const commonGainMin = config.rewardEvents.find((event) => event.family === "normal").min;
const randomLoss = config.rewardEvents.find((event) => event.family === "loss");
assert.ok(Math.abs(randomLoss.min) <= commonGainMin, "random loss must not exceed the common gain minimum");
assert.ok(Math.abs(config.wrongEvent.min) <= commonGainMin, "wrong-answer loss must not exceed the common gain minimum");
assert.equal(
  model.applyReward({ power: 37, specialSeen: false }, { emptiesPower: true }).power,
  37,
  "legacy empty events must preserve accumulated score",
);
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.64);
assert.match(
  cssSource,
  /\.problem-grid\s*\{[\s\S]*?right:\s*2\.5%;[\s\S]*?left:\s*32%;/,
  "problem grid must preserve the left cannon reward scene",
);
assert.ok(config.qa.viewports.some((viewport) =>
  viewport.name === "user-redesign-1082x897-dpr2"
  && viewport.width === 1082
  && viewport.height === 897
  && viewport.dpr === 2
), "reported redesign viewport must remain a named regression case");
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "CIRCLE_CENTER_ON_EDGE",
  "CIRCLE_RADIUS_AS_DIAMETER",
  "CIRCLE_DIAMETER_MISSES_CENTER",
]);
assert.deepEqual({ ...model.getResult(0, 0, false) }, {
  id: "practice",
  name: "연습 표적",
  minPower: 0,
  minCorrect: 0,
  playImage: "play-target-practice-v2-generated.webp",
  image: "result-practice-generated.webp",
  titleImage: "result-practice-generated.webp",
});
const playImages = config.results.map((result) => result.playImage);
assert.equal(new Set(playImages).size, 6, "all six play states must use unique dedicated images");
assert.ok(
  config.results.every((result) =>
    /^play-target-.+-v2-generated\.webp$/.test(result.playImage)
    && result.playImage !== result.image
  ),
  "play progression art must be dedicated and must never crop a final-result scene",
);
assert.deepEqual({ ...config.result.playStateImageSet }, {
  count: 6,
  canvas: "768x1536",
  runtimeSlot: "left-reward-world-1x2",
  contactSheet: "play-target-progress-v2-contact-sheet.png",
  pairedContactSheet: "play-vs-final-v2-contact-sheet.png",
  protagonist: "mathmon-drv-06-thunderwolf",
  fit: "contain",
  requiredProgression: ["outer-hits", "edge-hit", "inner-hits", "bullseye", "champion-cluster", "legend-lightning"],
  pairedWithFinalResults: true,
});

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.term, (counts.get(problem.term) || 0) + 1);
    assert.ok(["중심", "반지름", "지름"].includes(problem.term), `${problem.id}: valid term`);
    assert.equal(problem.prompt, problem.term, `${problem.id}: title must not repeat the instruction`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four mini-circle choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.visualKind)).size, 4, `${problem.id}: four distinct geometric relations`);
    assert.ok(step.choices.every((choice) => choice.label && !/^선택지 \d+$/.test(choice.label)), `${problem.id}: semantic accessibility labels`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
    if (problem.term === "중심") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_CENTER_ON_EDGE"), `${problem.id}: edge-point misconception`);
    }
    if (problem.term === "반지름") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_RADIUS_AS_DIAMETER"), `${problem.id}: diameter misconception`);
    }
    if (problem.term === "지름") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_DIAMETER_MISSES_CENTER"), `${problem.id}: off-center chord misconception`);
    }
  }
  for (const term of ["중심", "반지름", "지름"]) {
    assert.ok((counts.get(term) || 0) >= 3, `seed ${seed}: ${term} appears at least three times`);
  }
}

assert.match(viewSource, /circle-choice-svg/, "each answer surface must be a geometric SVG");
assert.match(viewSource, /circle-confirm-svg/, "correct relation must remain visible for confirmation");
assert.match(viewSource, /target-console/, "the four geometric choices must share one target console");
assert.match(viewSource, /circleDiagnosticMarkup/, "wrong choices must explain the visible geometric mismatch");
assert.match(viewSource, /score-view-button-art/, "completion must use generated score-view button art");
assert.match(viewSource, /installCircleTutorialNextArt/, "tutorial 1 must expose a visible generated next button");
assert.match(viewSource, /circle-world-panel/, "play must keep the common left reward world panel");
assert.match(viewSource, /function syncCircleWorld/, "left reward world must follow the accumulated result tier");
assert.match(viewSource, /window\.__targetHitQa/, "all play and result tiers must be browser-inspectable");
assert.match(viewSource, /forcePlayTier\(resultId\)/, "QA must be able to inspect every play tier");
assert.doesNotMatch(
  viewSource,
  /result\.playImage\s*\|\|\s*result\.image/,
  "play world must never fall back to a cropped final-result scene",
);
assert.match(
  engineSource,
  /async function advanceAfterReward\(\)[\s\S]*?closeRewardModal\(\);[\s\S]*?await runViewHook\("onRewardDismiss"/,
  "the shared modal must close before the lesson reward-world effect runs",
);
assert.match(viewSource, /let pendingCircleWorldImpact = null/, "modal reveal must queue the left-world impact");
assert.match(
  viewSource,
  /function onRewardReveal\([^)]*\)\s*\{[\s\S]*?pendingCircleWorldImpact\s*=\s*\{[\s\S]*?\};\s*\}/,
  "revealing the score must only queue the left-world impact while the modal is visible",
);
assert.match(
  viewSource,
  /function onRewardDismiss\(\{ state \}\)[\s\S]*?return syncCircleWorld\(state/,
  "pressing score confirmation must run the queued left-world effect after the modal closes",
);
const rewardRevealSource = viewSource.slice(
  viewSource.indexOf("function onRewardReveal"),
  viewSource.indexOf("function onRewardDismiss"),
);
assert.doesNotMatch(
  rewardRevealSource,
  /syncCircleWorld/,
  "the blurred modal reveal phase must not run the background world effect",
);
assert.doesNotMatch(viewSource, /targetReward|target-reward|function onRewardPrepare/, "reward must use the shared engine modal without a lesson-local replacement");
assert.doesNotMatch(cssSource, /\.target-reward|#screen-reward \.reward-panel/, "reward must not carry a lesson-local Stage layout");
assert.match(cssSource, /\.reward-card\s*\{[\s\S]*?width:\s*min\(560px,\s*88%\)/, "reward must use the same bounded shared modal card as 3-2-2-4");
assert.match(cssSource, /\.reward-card\[data-reward-phase="closed"\] \.reward-label\s*\{[\s\S]*?display:\s*none/, "closed shared reward modal must hide helper copy");
assert.match(cssSource, /\.reward-visual\s*\{[\s\S]*?background-image:\s*var\(--reward-modal-image\)/, "shared reward visual must use configured generated event art");
assert.deepEqual(config.result.stateImageSet.dynamicOverlays, ["next-goal", "correct-count"]);
assert.equal(config.result.showNextGoal, true, "result contract must expose an accessible next-goal slot");
assert.ok(config.qa.viewports.some((viewport) =>
  viewport.name === "user-reported-final-reward-ui-broken-1082x897-dpr2"
  && viewport.width === 1082
  && viewport.height === 897
  && viewport.dpr === 2
), "reported final reward viewport must remain a named regression case");
assert.ok(config.qa.viewports.some((viewport) =>
  viewport.name === "user-reported-result-panel-axis-1082x897-dpr2"
  && viewport.width === 1082
  && viewport.height === 897
  && viewport.dpr === 2
), "reported result panel axis viewport must remain a named regression case");
assert.ok(config.qa.viewports.some((viewport) =>
  viewport.name === "user-reported-missing-left-reward-panel-1082x897-dpr2"
  && viewport.width === 1082
  && viewport.height === 897
  && viewport.dpr === 2
), "missing left reward panel must remain a named regression case");
assert.ok(config.qa.viewports.some((viewport) =>
  viewport.name === "user-reported-left-reward-character-cropped-1082x897-dpr2"
  && viewport.width === 1082
  && viewport.height === 897
  && viewport.dpr === 2
), "cropped left reward character must remain a named regression case");
assert.match(viewSource, /function onResult\(\{ result \}\)/, "final reward must render its next goal in the result panel");
assert.match(viewSource, /result-next-goal-art/, "final reward must use one generated next-goal art slot");
assert.deepEqual(Object.keys(config.imageAssets.resultNextGoalTitles), [
  "edge", "hit", "bullseye", "targetking", "legend", "final",
]);
assert.match(cssSource, /#resultMeasureFillSvg\s*\{[\s\S]*?display:\s*none/, "final reward must not repeat the running score bar");
assert.match(cssSource, /#resultMeasureSvg\s*\{[\s\S]*?display:\s*none/, "final reward must not repeat the running score label");
assert.match(cssSource, /\.result-next-goal-art\s*\{[\s\S]*?top:\s*29%;[\s\S]*?left:\s*44\.3%;[\s\S]*?width:\s*41%;[\s\S]*?height:\s*25%/, "generated next-goal art must be centered on the result panel axis");
assert.match(cssSource, /\.result-correct-art\s*\{[\s\S]*?left:\s*55\.8%;[\s\S]*?top:\s*52%;[\s\S]*?width:\s*18%/, "correct count must share the result panel center axis");
assert.match(cssSource, /\.result-retry-hitbox\s*\{[\s\S]*?left:\s*56\.25%;[\s\S]*?top:\s*78%;[\s\S]*?width:\s*27%;[\s\S]*?height:\s*17%/, "retry hitbox must use the 3-2-2-4 result action slot");
assert.match(cssSource, /\.result-retry-art\s*\{[\s\S]*?display:\s*none/, "baked shared retry surface must keep only the common hitbox active");
for (const visualKind of [
  "center", "edge-point", "inner-point", "outer-point",
  "radius", "diameter", "off-center-chord", "inner-segment",
]) {
  assert.match(viewSource, new RegExp(`"${visualKind}"`), `view must render ${visualKind}`);
}
const chordMatch = viewSource.match(
  /kind === "off-center-chord"[\s\S]*?line\(([-\d.]+), ([-\d.]+), ([-\d.]+), ([-\d.]+)\)/
);
assert.ok(chordMatch, "off-center chord coordinates must be inspectable");
const [, x1, y1, x2, y2] = chordMatch.map(Number);
const dx = x2 - x1;
const dy = y2 - y1;
const lengthSquared = dx * dx + dy * dy;
const t = Math.max(0, Math.min(1, ((120 - x1) * dx + (90 - y1) * dy) / lengthSquared));
const chordCenterDistance = Math.hypot(120 - (x1 + t * dx), 90 - (y1 + t * dy));
assert.ok(chordCenterDistance > 12, `off-center chord must visibly miss the center marker: ${chordCenterDistance}`);
assert.match(viewSource, /setAttribute\("aria-label", selected\.label\)/, "choice aria-label must use the geometric relation");
assert.match(cssSource, /\.circle-world-panel\s*\{[\s\S]*?left:\s*2\.5%;[\s\S]*?width:\s*25\.78125%;[\s\S]*?aspect-ratio:\s*1\s*\/\s*2/, "left reward world must use the exact portrait slot");
assert.match(cssSource, /\.circle-world-image\s*\{[^}]*object-fit:\s*contain/, "dedicated play art must remain fully visible");
assert.doesNotMatch(cssSource, /\.circle-world-image\s*\{[^}]*object-fit:\s*cover/, "play art must never hide clipping with CSS cover");

console.log("QA_ENGINE_UNIT3_TARGET_SOURCE: PASS");
