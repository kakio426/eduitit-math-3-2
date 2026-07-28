import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-4-3-mathmon-fraction-sorter";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "fraction-sorter");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.kind, (counts.get(problem.kind) || 0) + 1);
    if (problem.kind === "진분수") assert.ok(problem.whole === 0 && problem.num < problem.den, `${problem.id}: proper fraction`);
    if (problem.kind === "가분수") assert.ok(problem.whole === 0 && problem.num >= problem.den, `${problem.id}: improper fraction`);
    if (problem.kind === "대분수") assert.ok(problem.whole >= 1 && problem.num < problem.den, `${problem.id}: mixed number`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 3, `${problem.id}: three fraction names`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.feedback, `${problem.id}: problem-specific feedback`);
      if (problem.whole) assert.match(choice.feedback, new RegExp(`자연수 ${problem.whole}`), `${problem.id}: mixed-number feedback`);
      else {
        assert.ok(choice.feedback.includes(String(problem.num)) && choice.feedback.includes(String(problem.den)), `${problem.id}: numerator and denominator feedback`);
      }
    }
  }
  assert.equal(counts.get("진분수"), 4, `seed ${seed}: four proper fractions`);
  assert.equal(counts.get("가분수"), 3, `seed ${seed}: three improper fractions`);
  assert.equal(counts.get("대분수"), 3, `seed ${seed}: three mixed numbers`);
}

assert.deepEqual(
  config.results.map((result) => result.name),
  ["첫 분류", "한 줄 완성", "두 줄 완성", "분류 달인", "공장장", "전설의 분류"],
);

assert.match(viewSource, /sort-choice-svg/, "each answer surface must show the category relation");
assert.match(viewSource, /fraction-model-svg/, "fraction notation and quantity model must stay together");
assert.doesNotMatch(viewSource, /분류 점수|분류 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT4_SORTER_SOURCE: PASS");
