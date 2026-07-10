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

assert.equal(config.workbench.type, "fraction-scoop");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  for (const problem of problems) {
    assert.equal(problem.groupSize * problem.den, problem.total, `${problem.id}: equal groups rebuild total`);
    assert.equal(problem.groupSize * problem.num, problem.answer, `${problem.id}: selected groups make answer`);
    assert.equal(problem.steps.length, 2, `${problem.id}: two visible actions in sequence`);
    const [groupStep, scoopStep] = problem.steps;
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
assert.doesNotMatch(viewSource, /담기 점수|담기 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT4_SCOOP_SOURCE: PASS");
