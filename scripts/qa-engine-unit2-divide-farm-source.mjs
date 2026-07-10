import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-2-1-mathmon-divide-farm";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "place-value-farm");
assert.equal(config.imageAssets.problemStage, "farm-board-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  assert.equal(new Set(problems.map((problem) => `${problem.dividend}:${problem.divisor}`)).size, 10, `seed ${seed}: unique problems`);
  for (const problem of problems) {
    const tens = Math.floor(problem.dividend / 10);
    const ones = problem.dividend % 10;
    assert.equal(tens % problem.divisor, 0, `${problem.id}: tens divide exactly`);
    assert.equal(ones % problem.divisor, 0, `${problem.id}: ones divide exactly`);
    assert.equal(problem.quotient, problem.dividend / problem.divisor, `${problem.id}: quotient`);
    assert.equal(problem.steps.length, 3, `${problem.id}: three one-action screens`);
    assert.ok(problem.steps[0].choices.some((choice) => choice.misconceptionId === "DIV1_DIVIDE_FULL_TENS_VALUE"), `${problem.id}: place-value misconception`);
    assert.ok(problem.steps[2].choices.some((choice) => choice.misconceptionId === "DIV1_COMBINE_BY_ADDING_DIGITS"), `${problem.id}: combine misconception`);
    for (const step of problem.steps) {
      for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
        assert.ok(choice.misconceptionId, `${problem.id}/${step.id}: misconception id`);
        assert.ok(choice.feedback, `${problem.id}/${step.id}: feedback`);
      }
    }
  }
}

assert.match(viewSource, /place-value-farm-svg/, "dynamic place-value board must be SVG");
assert.match(viewSource, /10개 묶음 몫/, "tens quotient label must be visible");
assert.match(viewSource, /낱개 몫/, "ones quotient label must be visible");
assert.doesNotMatch(viewSource, /수확 점수|농장 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT2_DIVIDE_FARM_SOURCE: PASS");
