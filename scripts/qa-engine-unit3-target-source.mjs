import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-1-mathmon-target-hit";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "circle-relations");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.term, (counts.get(problem.term) || 0) + 1);
    assert.ok(["중심", "반지름", "지름"].includes(problem.term), `${problem.id}: valid term`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four mini-circle choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.visualKind)).size, 4, `${problem.id}: four distinct geometric relations`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
    if (problem.term === "중심") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_CENTER_ON_EDGE"), `${problem.id}: edge-point misconception`);
    }
    if (problem.term === "반지름") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_RADIUS_AS_DIAMETER"), `${problem.id}: diameter misconception`);
    }
    if (problem.term === "지름") {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === "CIRCLE_DIAMETER_MISSES_CENTER"), `${problem.id}: off-center chord misconception`);
    }
  }
  for (const term of ["중심", "반지름", "지름"]) {
    assert.ok((counts.get(term) || 0) >= 3, `seed ${seed}: ${term} appears at least three times`);
  }
}

assert.match(viewSource, /circle-choice-svg/, "each answer surface must be a geometric SVG");
assert.match(viewSource, /circle-confirm-svg/, "correct relation must expand for confirmation");
assert.doesNotMatch(viewSource, /표적 점수|표적 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_TARGET_SOURCE: PASS");
