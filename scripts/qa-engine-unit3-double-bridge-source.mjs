import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-3-mathmon-double-bridge";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "circle-double-bridge");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.ask, (counts.get(problem.ask) || 0) + 1);
    assert.equal(problem.diameter, problem.radius * 2, `${problem.id}: diameter is twice radius`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four length choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}: four distinct lengths`);
    const requiredMisconception = problem.ask === "지름" ? "DIAMETER_NOT_DOUBLED" : "RADIUS_NOT_HALVED";
    assert.ok(step.choices.some((choice) => choice.misconceptionId === requiredMisconception), `${problem.id}: core misconception`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  assert.equal(counts.get("지름"), 5, `seed ${seed}: five diameter questions`);
  assert.equal(counts.get("반지름"), 5, `seed ${seed}: five radius questions`);
}

assert.match(viewSource, /bridge-choice-svg/, "each answer surface must show a length bar");
assert.match(viewSource, /circle-bridge-confirm-svg/, "circle relation must remain visible for confirmation");
assert.match(viewSource, /matches \? "=" : "≠"/, "wrong comparison must never show a false equality");
assert.doesNotMatch(viewSource, /다리 점수|다리 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_DOUBLE_BRIDGE_SOURCE: PASS");
