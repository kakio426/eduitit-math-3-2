import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-2-2-mathmon-elevator";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);

const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const runtimeSource = await readFile(path.join(ROOT, "_engine", "v1", "runtime", "core.js"), "utf8");

const context = vm.createContext({
  LESSON_CONFIG: config,
  console,
  Math,
});
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "division-elevator", "2-2 must use its own math workbench");
assert.equal(config.imageAssets.problemStage, "board-shaft-generated.webp", "generated problem scene must be first-class");
assert.equal(typeof model.generateRun, "function", "model.generateRun is required");
assert.equal(typeof model.validateChoice, "function", "model.validateChoice is required");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: one run must contain 10 problems`);
  assert.equal(new Set(problems.map((problem) => problem.id)).size, 10, `seed ${seed}: duplicate problem`);

  for (const problem of problems) {
    assert.ok(problem.dividend >= 20 && problem.dividend <= 99, `${problem.id}: dividend range`);
    assert.ok(problem.divisor >= 2 && problem.divisor <= 8, `${problem.id}: divisor range`);
    assert.equal(problem.dividend, problem.divisor * problem.quotient, `${problem.id}: division identity`);
    assert.ok(problem.remainingTens > 0, `${problem.id}: regrouping must be required`);
    assert.equal(problem.downNumber % problem.divisor, 0, `${problem.id}: final remainder must be zero`);
    assert.equal(problem.steps.length, 3, `${problem.id}: three learning steps required`);

    const [tensStep, downStep, onesStep] = problem.steps;
    assert.equal(tensStep.id, "tens", `${problem.id}: first step id`);
    assert.equal(tensStep.instruction, "몫과 나머지를 골라요.", `${problem.id}: first action must name both values`);
    assert.equal(downStep.id, "down", `${problem.id}: second step id`);
    assert.equal(onesStep.id, "ones", `${problem.id}: third step id`);

    for (const choice of tensStep.choices) {
      assert.equal(choice.kind, "quotient-remaining-pair", `${problem.id}: tens choice must be a labelled pair`);
      assert.equal(choice.parts?.[0]?.label, "십의 자리 몫", `${problem.id}: quotient label cannot rely on color`);
      assert.equal(choice.parts?.[1]?.label, "나머지", `${problem.id}: remainder label cannot rely on color`);
      if (choice.id !== tensStep.answerChoiceId) {
        assert.ok(choice.misconceptionId, `${problem.id}: wrong tens choice needs misconceptionId`);
      }
    }

    for (const step of problem.steps) {
      assert.equal(step.choices.length, 4, `${problem.id}/${step.id}: four choices required`);
      assert.equal(new Set(step.choices.map((choice) => choice.id)).size, 4, `${problem.id}/${step.id}: choice ids must be unique`);
      const answer = step.choices.find((choice) => choice.id === step.answerChoiceId);
      assert.ok(answer, `${problem.id}/${step.id}: answer choice missing`);
      assert.equal(model.validateChoice(step, answer), true, `${problem.id}/${step.id}: answer validation`);
      for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
        assert.equal(model.validateChoice(step, choice), false, `${problem.id}/${step.id}: wrong validation`);
        assert.ok(choice.misconceptionId, `${problem.id}/${step.id}: wrong choice needs misconceptionId`);
        assert.ok(choice.feedback, `${problem.id}/${step.id}: wrong choice needs short feedback`);
      }
    }
  }
}

assert.match(viewSource, /십의 자리 몫/, "visible quotient label is required in the view");
assert.match(viewSource, /남은 십/, "visible remaining-tens label is required in the view");
assert.match(modelSource, /나머지/, "remainder must be named, not encoded by color");
assert.match(viewSource, /elevator-math-svg/, "the dynamic math board must be an SVG layer");
assert.doesNotMatch(viewSource, /linear-gradient|radial-gradient|::before|::after/, "lesson view must not draw decorative art with CSS tricks");
assert.match(runtimeSource, /attempts/, "engine must keep all attempts, not only the first selection");
assert.match(runtimeSource, /misconceptionId/, "engine attempt records must retain misconception ids");

console.log("QA_ENGINE_UNIT2_ELEVATOR_SOURCE: PASS");
