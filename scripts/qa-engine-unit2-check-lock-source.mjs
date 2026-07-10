import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-2-4-mathmon-check-lock";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "check-lock-bars");
assert.equal(config.imageAssets.problemStage, "board-vault-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  assert.ok(problems.some((problem) => problem.matchesOriginal), `seed ${seed}: needs matching cases`);
  assert.ok(problems.some((problem) => !problem.matchesOriginal), `seed ${seed}: needs mismatch cases`);
  for (const problem of problems) {
    assert.ok(problem.dividend >= 20 && problem.dividend <= 99, `${problem.id}: dividend range`);
    assert.equal(problem.product, problem.divisor * problem.shownQuotient, `${problem.id}: product`);
    assert.equal(problem.checkTotal, problem.product + problem.shownRemainder, `${problem.id}: check total`);
    assert.equal(problem.matchesOriginal, problem.checkTotal === problem.dividend, `${problem.id}: comparison`);
    assert.ok(problem.steps.length >= 3 && problem.steps.length <= 4, `${problem.id}: step count`);
    const multiply = problem.steps[0];
    const add = problem.steps[1];
    assert.ok(multiply.choices.some((choice) => choice.misconceptionId === "DIV4_ADD_INSTEAD_OF_MULTIPLY"), `${problem.id}: multiply misconception`);
    assert.ok(add.choices.some((choice) => choice.misconceptionId === "DIV4_OMIT_REMAINDER"), `${problem.id}: omitted remainder`);
    for (const step of problem.steps) {
      for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
        assert.ok(choice.misconceptionId, `${problem.id}/${step.id}: misconception id`);
        assert.ok(choice.feedback, `${problem.id}/${step.id}: feedback`);
      }
    }
  }
}

assert.match(viewSource, /check-lock-svg/, "dynamic check board must be SVG");
assert.match(viewSource, /처음 수/, "comparison target label must be visible");
assert.doesNotMatch(viewSource, /보안 점수|금고 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT2_CHECK_LOCK_SOURCE: PASS");
