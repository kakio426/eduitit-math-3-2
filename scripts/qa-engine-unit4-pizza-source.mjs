import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-4-1-mathmon-pizza-fraction";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.reward.standard, "mathmon-unified-reward-v1", "lesson must opt into the unified reward contract");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");

assert.equal(config.workbench.type, "pizza-fraction");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  for (const problem of problems) {
    assert.ok(problem.num > 0 && problem.num < problem.den, `${problem.id}: proper part of a whole`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four fraction cards`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.id)).size, 4, `${problem.id}: distinct cards`);
    for (const misconceptionId of ["FRACTION_SWAPPED", "FRACTION_COUNTS_UNSHADED", "FRACTION_WHOLE_AS_PART"]) {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === misconceptionId), `${problem.id}: ${misconceptionId}`);
    }
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
    assert.equal(step.instruction, "피자에 맞는 분수를 골라요.", `${problem.id}: answer is not named in advance`);
    assert.match(step.correctText, new RegExp(`^맞아요\\. 전체 ${problem.den}조각 중 ${problem.num}조각, ${problem.den}분의 ${problem.num}`), `${problem.id}: student-facing confirmation`);
    assert.doesNotMatch(`${problem.prompt} ${problem.finalExpression} ${step.instruction} ${step.correctText} ${step.reveal}`, /\d+\/\d+/, `${problem.id}: no slash fraction in student copy`);
  }
}

assert.equal(config.results.find((result) => result.id === "jumbo")?.name, "특대 피자");

assert.match(viewSource, /fraction-choice-svg/, "each answer surface must show a fraction card");
assert.match(viewSource, /pizza-confirm-svg/, "chosen fraction must expand for confirmation");
assert.match(viewSource, /if \(state === "idle"\) \{\s*svg\.innerHTML = pizza;/, "waiting state must show only the pizza, not a completed fraction");
assert.doesNotMatch(viewSource, /state === "idle" \? "\?"/, "waiting state must not show a redundant relation question mark");
assert.doesNotMatch(viewSource, /피자 점수|피자 등급|진행도/, "problem view must not contain reward panels");
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
assert.match(lessonCss, /\.fraction-choice\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "answer choices must use an opaque background");
assert.match(lessonCss, /pizza-fraction[^\n]*\.problem-card\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "problem panel must use an opaque surface");
assert.match(lessonCss, /pizza-fraction[^\n]*\.complete-panel\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "completion panel must use an opaque surface");

console.log("QA_ENGINE_UNIT4_PIZZA_SOURCE: PASS");
