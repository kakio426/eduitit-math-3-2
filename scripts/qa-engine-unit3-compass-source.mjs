import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-2-mathmon-compass-ring";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "compass-opening");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.radius, (counts.get(problem.radius) || 0) + 1);
    assert.ok(problem.radius >= 2 && problem.radius <= 6, `${problem.id}: radius is grade-appropriate`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four compass choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}: four distinct openings`);
    assert.ok(step.choices.some((choice) => choice.value === problem.radius * 2 && choice.misconceptionId === "COMPASS_USES_DIAMETER"), `${problem.id}: diameter misconception`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  for (const radius of [2, 3, 4, 5, 6]) {
    assert.equal(counts.get(radius), 2, `seed ${seed}: radius ${radius} appears twice`);
  }
}

assert.match(viewSource, /compass-choice-svg/, "each answer surface must show a compass opening");
assert.match(viewSource, /compass-confirm-svg/, "the chosen opening must expand for confirmation");
assert.match(viewSource, /matches \? "=" : "≠"/, "wrong opening comparison must never show a false equality");
assert.doesNotMatch(viewSource, /마법진 점수|마법진 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_COMPASS_SOURCE: PASS");
