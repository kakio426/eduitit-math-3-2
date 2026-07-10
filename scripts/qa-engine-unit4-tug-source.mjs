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
    assert.notEqual(leftValue, rightValue, `${problem.id}: unequal fractions`);
    if (problem.compareType === "same-denominator") assert.equal(problem.left.den, problem.right.den, `${problem.id}: same denominator`);
    if (problem.compareType === "unit-fraction") assert.equal(problem.left.num + problem.right.num, 2, `${problem.id}: two unit fractions`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 2, `${problem.id}: two fraction bars`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one larger answer`);
    const expected = leftValue > rightValue ? "left" : "right";
    assert.equal(step.answer, expected, `${problem.id}: answer matches real value`);
  }
  assert.equal(counts.get("same-denominator"), 5, `seed ${seed}: five same-denominator comparisons`);
  assert.equal(counts.get("unit-fraction"), 5, `seed ${seed}: five unit-fraction comparisons`);
}

assert.match(viewSource, /compare-choice-svg/, "each answer must show a fraction bar");
assert.match(viewSource, /fraction-compare-confirm-svg/, "larger bar must expand for confirmation");
assert.doesNotMatch(viewSource, /줄다리기 점수|줄다리기 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT4_TUG_SOURCE: PASS");
