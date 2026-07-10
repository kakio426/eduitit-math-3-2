import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-2-3-mathmon-star-pickup";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "remainder-stars");
assert.equal(config.imageAssets.problemStage, "result-stage.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  assert.equal(new Set(problems.map((problem) => problem.id)).size, 10, `seed ${seed}: duplicate problem`);
  for (const problem of problems) {
    assert.ok(problem.dividend >= 20 && problem.dividend <= 99, `${problem.id}: dividend range`);
    assert.ok(problem.divisor >= 3 && problem.divisor <= 9, `${problem.id}: divisor range`);
    assert.ok(problem.remainder > 0 && problem.remainder < problem.divisor, `${problem.id}: remainder range`);
    assert.equal(problem.divisor * problem.quotient + problem.remainder, problem.dividend, `${problem.id}: identity`);
    assert.equal(problem.steps.length, 2, `${problem.id}: quotient and remainder only`);

    const [quotientStep, remainderStep] = problem.steps;
    assert.equal(quotientStep.instruction, `${problem.divisor}개씩 몇 묶음일까요?`);
    assert.ok(quotientStep.choices.some((choice) => choice.misconceptionId === "DIV3_QUOTIENT_TOO_HIGH"), `${problem.id}: too-high choice`);
    assert.ok(quotientStep.choices.some((choice) => choice.misconceptionId === "DIV3_QUOTIENT_TOO_LOW"), `${problem.id}: too-low choice`);
    assert.ok(remainderStep.choices.some((choice) => choice.misconceptionId === "DIV3_REMAINDER_NOT_LESS_THAN_DIVISOR"), `${problem.id}: invalid remainder choice`);
    for (const step of problem.steps) {
      assert.equal(step.choices.length, 4, `${problem.id}/${step.id}: four choices`);
      for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
        assert.ok(choice.misconceptionId, `${problem.id}/${step.id}: misconception id`);
        assert.ok(choice.feedback, `${problem.id}/${step.id}: feedback`);
      }
    }
  }
}

assert.match(viewSource, /star-proof-bar/, "wrong quotient must be proved visually");
assert.match(viewSource, /남은 별/, "remainder label must be visible");
assert.doesNotMatch(viewSource, /닉네임|별 이름|진행도|등급/, "problem view must not contain reward or result panels");

console.log("QA_ENGINE_UNIT2_STAR_SOURCE: PASS");
