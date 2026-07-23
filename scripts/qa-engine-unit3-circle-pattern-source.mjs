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
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-generated.webp");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.60);
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "PATTERN_GAP_CHANGED",
  "PATTERN_OFF_LINE",
  "PATTERN_SIZE_CHANGED",
]);

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
    assert.deepEqual(new Set(step.choices.map((choice) => choice.label)), new Set([
      "같은 크기와 간격",
      "간격이 넓음",
      "줄에서 벗어남",
      "원 크기가 다름",
    ]), `${problem.id}: semantic accessibility labels`);
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
assert.match(viewSource, /setAttribute\("aria-label", selected\.label\)/, "choice aria-label must explain the visible relation");
assert.doesNotMatch(viewSource, /무늬 점수|무늬 등급|진행도/, "problem view must not contain reward panels");

console.log("QA_ENGINE_UNIT3_CIRCLE_PATTERN_SOURCE: PASS");
