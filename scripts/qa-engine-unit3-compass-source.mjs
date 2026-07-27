import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-2-mathmon-compass-ring";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const closedRewardPng = await readFile(path.join(ROOT, LESSON, "reward-event-closed-generated.png"));
await readFile(path.join(ROOT, LESSON, "reward-event-closed-generated.webp"));
await readFile(path.join(ROOT, LESSON, "reward-events-v3-contact-sheet.png"));

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "compass-opening");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");
assert.equal(config.goal, "반지름만큼 컴퍼스를 벌려요.");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-generated.webp");
assert.equal(config.imageAssets.rewardClosed, "reward-event-closed-generated.webp");
assert.ok(config.assets.includes(config.imageAssets.rewardClosed), "closed reward runtime asset must be listed");
assert.equal(config.action, "바늘과 연필 사이의 길이를 골라요.");
assert.equal(config.reward.mode, "stage-reveal");
assert.equal(config.reward.version, "magic-circle-stage-reveal-v1");
assert.equal(config.reward.closedLabel, "마법 보기");
assert.equal(config.reward.fairness.emptyKeepsProgress, true);
assert.equal(config.reward.fairness.lossCapAtCommonGainMin, true);
assert.deepEqual(config.reward.stateImageSet, {
  count: 7,
  canvas: "512x512",
  runtimeSlot: "stage-reveal-event",
  states: ["closed", "normal", "loss", "mega", "perfect", "empty", "rainbow"],
  contactSheet: "reward-events-v3-contact-sheet.png",
});
assert.equal(closedRewardPng.readUInt32BE(16), 512, "closed reward PNG width");
assert.equal(closedRewardPng.readUInt32BE(20), 512, "closed reward PNG height");
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-reward-closed-1082x897-dpr2"
    && viewport.width === 1082 && viewport.height === 897 && viewport.dpr === 2),
  "reported reward viewport must stay in regression QA",
);
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-complete-1082x897-dpr2"
    && viewport.width === 1082 && viewport.height === 897 && viewport.dpr === 2),
  "reported complete viewport must stay in regression QA",
);
assert.ok(config.qa.requiredFlow.includes("reward-closed"), "closed reward state must be audited");
assert.ok(config.qa.requiredFlow.includes("reward-open"), "open reward state must be audited");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.65);
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "COMPASS_TOO_NARROW",
  "COMPASS_TOO_WIDE",
  "COMPASS_USES_DIAMETER",
]);

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.radius, (counts.get(problem.radius) || 0) + 1);
    assert.ok(problem.radius >= 2 && problem.radius <= 6, `${problem.id}: radius is grade-appropriate`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(problem.prompt, `반지름 ${problem.radius} cm, 얼마나 벌릴까요?`);
    assert.equal(problem.finalExpression, `그대로 돌리면 반지름 ${problem.radius} cm인 원이 돼요.`);
    assert.equal(step.instruction, "바늘과 연필 사이의 길이를 골라요.");
    assert.equal(step.choices.length, 4, `${problem.id}: four compass choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}: four distinct openings`);
    assert.ok(step.choices.some((choice) => choice.value === problem.radius * 2 && choice.misconceptionId === "COMPASS_USES_DIAMETER"), `${problem.id}: diameter misconception`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  for (const radius of [2, 3, 4, 5, 6]) {
    assert.equal(counts.get(radius), 2, `seed ${seed}: radius ${radius} appears twice`);
  }
}

const commonGain = config.rewardEvents.find((event) => event.id === "normal");
const smallLoss = config.rewardEvents.find((event) => event.id === "loss");
const empty = config.rewardEvents.find((event) => event.id === "empty");
assert.ok(Math.abs(smallLoss.min) <= commonGain.min, "small loss must not erase more than the minimum common gain");
assert.ok(Math.abs(config.wrongEvent.min) <= commonGain.min, "wrong reward loss must stay within one minimum common gain");
assert.equal(empty.emptiesPower, undefined, "empty reward must not reset progress");
assert.deepEqual(
  JSON.parse(JSON.stringify(model.applyReward({ power: 37, specialSeen: false }, { ...empty, amount: 0 }))),
  { power: 37, specialSeen: false },
  "empty reward keeps current progress",
);

assert.match(viewSource, /compass-choice-svg/, "each answer surface must show a compass opening");
const waitingMarkupSource = viewSource.match(/function targetRadiusMarkup[\s\S]*?function compassProofMarkup/)?.[0] || "";
assert.match(waitingMarkupSource, /waiting-trace-rotor/, "waiting screen must show the drawing path without an opened compass");
assert.match(viewSource, /waiting-draw-preview/, "waiting screen must trace the circle path before a choice");
assert.doesNotMatch(waitingMarkupSource, /proof-compass-leg|proof-opening-band|proof-joint/, "waiting screen must not reveal the correct compass opening");
assert.match(viewSource, /correct-anchor/, "correct proof must anchor the needle");
assert.match(viewSource, /correct-open/, "correct proof must show the matched opening");
assert.match(viewSource, /correct-draw/, "correct proof must draw the circle");
assert.match(viewSource, /complete-ready/, "completed circle must remain before reward");
assert.match(viewSource, /pathLength="1"/, "circle drawing path must expose normalized progress");
assert.match(viewSource, /COMPASS_TARGET_RADIUS \* opening \/ radius/, "compass opening and target radius must share one geometry scale");
assert.match(viewSource, /compass-reward-story/, "reward must use a full stage-reveal story");
assert.match(viewSource, /function onRewardPrepare/, "closed reward state must have a lesson hook");
assert.match(viewSource, /function onRewardReveal/, "revealed reward state must have a lesson hook");
assert.match(viewSource, /primeCompassRewardArt\(\)/, "reward art must preload before the reveal");
assert.match(viewSource, /naturalWidth|setCompassRewardArt/, "reward art must have a runtime-safe loading path");
assert.doesNotMatch(viewSource, /마법진 점수|마법진 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_COMPASS_SOURCE: PASS");
