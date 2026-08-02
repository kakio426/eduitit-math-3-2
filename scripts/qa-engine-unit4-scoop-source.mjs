import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-4-2-mathmon-fraction-scoop";
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
const hasBatchim = (value) => [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);

assert.equal(config.workbench.type, "fraction-scoop");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  for (const problem of problems) {
    assert.equal(problem.prompt, `${problem.total}개의 ${problem.den}분의 ${problem.num}${hasBatchim(problem.num) ? "은" : "는"} 몇 개일까요?`, `${problem.id}: natural prompt with the correct particle`);
    assert.doesNotMatch(problem.prompt, /\d+\/\d+/, `${problem.id}: no slash fraction in student prompt`);
    assert.equal(problem.groupSize * problem.den, problem.total, `${problem.id}: equal groups rebuild total`);
    assert.equal(problem.groupSize * problem.num, problem.answer, `${problem.id}: selected groups make answer`);
    assert.equal(problem.steps.length, 2, `${problem.id}: two visible actions in sequence`);
    const [groupStep, scoopStep] = problem.steps;
    assert.match(groupStep.instruction, /똑같이 나눴을 때, 한 묶음 수를 골라요\.$/, `${problem.id}: first instruction`);
    assert.match(scoopStep.instruction, /묶음이면 몇 개인지 골라요\.$/, `${problem.id}: second instruction`);
    for (const step of problem.steps) {
      assert.equal(step.choices.length, 4, `${problem.id}/${step.id}: four choices`);
      assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}/${step.id}: one answer`);
      assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}/${step.id}: distinct choices`);
    }
    assert.ok(groupStep.choices.some((choice) => choice.misconceptionId === "GROUP_USES_DENOMINATOR"), `${problem.id}: denominator misconception`);
    assert.ok(groupStep.choices.some((choice) => choice.misconceptionId === "GROUP_USES_TOTAL"), `${problem.id}: total misconception`);
    assert.ok(scoopStep.choices.some((choice) => choice.misconceptionId === "SCOOP_ONE_GROUP_ONLY"), `${problem.id}: one-group misconception`);
    assert.ok(scoopStep.choices.some((choice) => choice.misconceptionId === "SCOOP_USES_TOTAL"), `${problem.id}: whole-total misconception`);
  }
}

assert.match(viewSource, /quantity-choice-svg/, "number choices must have a stable visual surface");
assert.match(viewSource, /scoop-confirm-svg/, "completed two-step calculation must expand for confirmation");
assert.match(viewSource, /:\s*wholeItemsMarkup\(problem\)/, "waiting state must show the ungrouped whole before grouping");
assert.match(viewSource, /index\s*<\s*problem\.total/, "waiting whole must render every item");
assert.doesNotMatch(viewSource, /showItems:\s*Boolean\(groupValue\)/, "waiting state must not hide the whole behind empty group boxes");
assert.doesNotMatch(viewSource, /담기 점수|담기 등급|진행도/, "problem view must not contain reward panels");
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
assert.match(lessonCss, /\.quantity-choice\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "answer choices must use an opaque background");
assert.match(lessonCss, /\.item-group rect\s*\{[^}]*fill:\s*#[0-9a-f]{6}/i, "waiting group boxes must use an opaque fill");
assert.match(lessonCss, /\.whole-tray rect\s*\{[^}]*fill:\s*#[0-9a-f]{6}/i, "waiting whole tray must use an opaque fill");
assert.match(lessonCss, /\.calc-card\s*\{[^}]*fill:\s*#[0-9a-f]{6}/i, "calculation cards must use an opaque fill");
assert.match(lessonCss, /fraction-scoop[^\n]*\.complete-panel\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "completion panel must use an opaque surface");

console.log("QA_ENGINE_UNIT4_SCOOP_SOURCE: PASS");
