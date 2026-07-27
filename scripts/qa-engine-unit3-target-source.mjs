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
for (const asset of [
  "tutorial-page-1-target-console-v2-generated.webp",
  "score-view-button-v1-generated.webp",
  "reward-event-closed-generated.webp",
  "reward-events-v3-contact-sheet.png",
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
assert.equal(config.reward.mode, "stage-reveal");
assert.equal(config.reward.version, "target-score-stage-reveal-v1");
assert.deepEqual({ ...config.reward.fairness }, {
  emptyKeepsProgress: true,
  lossCapAtCommonGainMin: true,
});
assert.deepEqual([...config.reward.stateImageSet.states], [
  "closed", "normal", "loss", "mega", "bullseye", "empty", "rainbow",
]);
assert.equal(config.reward.stateImageSet.count, 7);
assert.equal(config.reward.stateImageSet.canvas, "512x512");
assert.equal(config.reward.stateImageSet.runtimeSlot, "stage-reveal-event");
assert.equal(config.imageAssets.rewardClosed, "reward-event-closed-generated.webp");
assert.equal(config.imageAssets.rewardScene, config.imageAssets.rewardClosed);
assert.doesNotMatch(config.imageAssets.rewardScene, /^result-/, "reward must not reuse a final-result scene");
assert.ok(config.assets.includes(config.imageAssets.rewardClosed), "closed reward art must be a runtime asset");
assert.ok(config.rewardEvents.every((event) => !event.emptiesPower), "zero event must keep accumulated score");
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
  image: "result-practice-generated.webp",
  titleImage: "result-practice-generated.webp",
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
assert.match(viewSource, /dataset\.rewardStageStory = "true"/, "reward must expose the Stage-Reveal QA hook");
assert.match(viewSource, /function onRewardPrepare/, "closed reward state must have a prepare hook");
assert.match(viewSource, /function onRewardReveal/, "revealed reward state must have a reveal hook");
assert.match(viewSource, /LESSON_CONFIG\.imageAssets\.rewardClosed/, "closed reward must use its own generated art");
assert.match(viewSource, /target-reward-score-label/, "reward must identify what the visible value means");
assert.match(viewSource, /target-reward-value/, "reward must expose one large visible value");
assert.match(viewSource, /target-reward-context/, "reward must keep one compact current-and-next context line");
assert.match(viewSource, /이번 점수/, "reward value must use short student-facing copy");
assert.match(viewSource, /다음까지/, "reward must keep a concise next-target cue");
assert.doesNotMatch(viewSource, /target-reward-(eyebrow|tier|status)/, "reward must not stack extra text blocks");
assert.doesNotMatch(viewSource, /현재 표적|무엇이 나올까요\?/, "reward must not repeat visible helper copy");
assert.match(cssSource, /\.target-reward-story/, "reward must use a full Stage-Reveal composition");
assert.match(cssSource, /#screen-reward > \.raster-bg[\s\S]*?blur/, "reward background must stay secondary");
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
assert.doesNotMatch(viewSource, /표적 점수|표적 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_TARGET_SOURCE: PASS");
