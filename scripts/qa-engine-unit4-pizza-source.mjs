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
  }
}

assert.match(viewSource, /fraction-choice-svg/, "each answer surface must show a fraction card");
assert.match(viewSource, /pizza-confirm-svg/, "chosen fraction must expand for confirmation");
assert.doesNotMatch(viewSource, /피자 점수|피자 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT4_PIZZA_SOURCE: PASS");
