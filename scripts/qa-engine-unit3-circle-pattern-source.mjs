import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-4-mathmon-circle-pattern";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "circle-pattern-choice");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.orientation, (counts.get(problem.orientation) || 0) + 1);
    assert.ok(["horizontal", "up", "down"].includes(problem.orientation), `${problem.id}: valid orientation`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 4, `${problem.id}: four independent pattern choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.visualKind)).size, 4, `${problem.id}: four distinct pattern relations`);
    for (const misconceptionId of ["PATTERN_GAP_CHANGED", "PATTERN_OFF_LINE", "PATTERN_SIZE_CHANGED"]) {
      assert.ok(step.choices.some((choice) => choice.misconceptionId === misconceptionId), `${problem.id}: ${misconceptionId}`);
    }
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  assert.equal(counts.get("horizontal"), 4, `seed ${seed}: four horizontal patterns`);
  assert.equal(counts.get("up"), 3, `seed ${seed}: three rising patterns`);
  assert.equal(counts.get("down"), 3, `seed ${seed}: three falling patterns`);
}

assert.match(viewSource, /pattern-choice-svg/, "each answer must be a separate completed pattern");
assert.match(viewSource, /pattern-confirm-svg/, "selected pattern must expand for confirmation");
assert.doesNotMatch(viewSource, /무늬 점수|무늬 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_CIRCLE_PATTERN_SOURCE: PASS");
