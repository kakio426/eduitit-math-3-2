import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-4-4-mathmon-fraction-tug";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");
const hasBatchim = (value) => [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);

assert.equal(config.workbench.type, "fraction-compare");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.compareType, (counts.get(problem.compareType) || 0) + 1);
    const leftValue = problem.left.num / problem.left.den;
    const rightValue = problem.right.num / problem.right.den;
    assert.doesNotMatch(problem.prompt, /\d+\/\d+/, `${problem.id}: prompt must rely on the rendered stacked fractions`);
    assert.doesNotMatch(problem.finalExpression, /\d+\/\d+/, `${problem.id}: completion copy must not mix slash notation with stacked fractions`);
    assert.equal(
      problem.finalExpression,
      `${problem.left.den}분의 ${problem.left.num} ${leftValue > rightValue ? ">" : "<"} ${problem.right.den}분의 ${problem.right.num}`,
      `${problem.id}: completion copy must preserve the original left/right operand order`,
    );
    assert.notEqual(leftValue, rightValue, `${problem.id}: unequal fractions`);
    if (problem.compareType === "same-denominator") assert.equal(problem.left.den, problem.right.den, `${problem.id}: same denominator`);
    if (problem.compareType === "unit-fraction") assert.equal(problem.left.num + problem.right.num, 2, `${problem.id}: two unit fractions`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.doesNotMatch(step.correctText, /\d+\/\d+/, `${problem.id}: confirmation copy must not use slash notation`);
    assert.equal(step.correctText, `맞아요. ${problem.larger.den}분의 ${problem.larger.num}${hasBatchim(problem.larger.num) ? "이" : "가"} 더 커요.`, `${problem.id}: confirmation particle`);
    assert.equal(step.choices.length, 2, `${problem.id}: two fraction bars`);
    assert.ok(step.choices.every((choice) => !/\d+\/\d+/.test(choice.label) && /분의/.test(choice.label)), `${problem.id}: accessible choice labels must use spoken fractions`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one larger answer`);
    const expected = leftValue > rightValue ? "left" : "right";
    assert.equal(step.answer, expected, `${problem.id}: answer matches real value`);
  }
  assert.equal(counts.get("same-denominator"), 5, `seed ${seed}: five same-denominator comparisons`);
  assert.equal(counts.get("unit-fraction"), 5, `seed ${seed}: five unit-fraction comparisons`);
}

assert.match(viewSource, /compare-choice-svg/, "each answer must show a fraction bar");
assert.match(viewSource, /fraction-compare-confirm-svg/, "larger bar must expand for confirmation");
assert.match(viewSource, /fractionNotation\(problem\.left/, "waiting and confirmation must preserve the original left operand");
assert.match(viewSource, /fractionNotation\(problem\.right/, "waiting and confirmation must preserve the original right operand");
assert.doesNotMatch(viewSource, /correct\s*\?\s*problem\.larger/, "confirmation must not swap operands into larger-first order");
assert.doesNotMatch(viewSource, /줄다리기 점수|줄다리기 등급|진행도/, "problem view must not contain reward panels");
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
assert.match(lessonCss, /\.compare-choice\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "answer choices must use an opaque background");
assert.match(lessonCss, /fraction-compare[^\n]*\.problem-card\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "problem prompt must use an opaque panel");
assert.match(lessonCss, /fraction-compare[^\n]*\.complete-panel\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "completion panel must use an opaque surface");
assert.deepEqual(
  config.results.map((result) => result.name),
  ["무승부", "아슬아슬 승리", "승리", "큰 승리", "챔피언", "전설의 승리"],
);
assert.match(config.tutorialCards[1].body, /마지막 승부 결과/);

console.log("QA_ENGINE_UNIT4_TUG_SOURCE: PASS");
