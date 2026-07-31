import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-4-3-mathmon-fraction-sorter";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");
const hasBatchim = (value) => [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);

assert.equal(config.workbench.type, "fraction-sorter");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.kind, (counts.get(problem.kind) || 0) + 1);
    if (problem.kind === "진분수") assert.ok(problem.whole === 0 && problem.num < problem.den, `${problem.id}: proper fraction`);
    if (problem.kind === "가분수") assert.ok(problem.whole === 0 && problem.num >= problem.den, `${problem.id}: improper fraction`);
    if (problem.kind === "대분수") assert.ok(problem.whole >= 1 && problem.num < problem.den, `${problem.id}: mixed number`);
    if (problem.whole) {
      const expectedSpoken = `${problem.whole}${hasBatchim(problem.whole) ? "과" : "와"} ${problem.den}분의 ${problem.num}`;
      assert.equal(problem.spokenNotation, expectedSpoken, `${problem.id}: mixed-number spoken notation particle`);
      assert.ok(problem.prompt.startsWith(expectedSpoken), `${problem.id}: prompt must use the same mixed-number particle`);
      assert.ok(problem.finalExpression.startsWith(expectedSpoken), `${problem.id}: completion must use the same mixed-number particle`);
    }
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    assert.doesNotMatch(`${problem.prompt} ${problem.finalExpression} ${problem.steps[0].correctText}`, /\d+\/\d+/, `${problem.id}: no slash fraction in student copy`);
    const step = problem.steps[0];
    assert.equal(step.choices.length, 3, `${problem.id}: three fraction names`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.feedback, `${problem.id}: problem-specific feedback`);
      if (problem.whole) {
        const expected = `자연수 ${problem.whole}${hasBatchim(problem.whole) ? "과" : "와"} ${problem.den}분의 ${problem.num}${hasBatchim(problem.num) ? "이" : "가"} 함께 보여요.`;
        assert.equal(choice.feedback, expected, `${problem.id}: mixed-number feedback particle`);
      }
      else {
        assert.ok(choice.feedback.includes(String(problem.num)) && choice.feedback.includes(String(problem.den)), `${problem.id}: numerator and denominator feedback`);
        assert.ok(choice.feedback.startsWith(`${problem.num}${hasBatchim(problem.num) ? "은" : "는"} `), `${problem.id}: comparison feedback particle`);
      }
    }
  }
  assert.equal(counts.get("진분수"), 4, `seed ${seed}: four proper fractions`);
  assert.equal(counts.get("가분수"), 3, `seed ${seed}: three improper fractions`);
  assert.equal(counts.get("대분수"), 3, `seed ${seed}: three mixed numbers`);
}

assert.deepEqual(
  config.results.map((result) => result.name),
  ["첫 분류", "한 줄 완성", "두 줄 완성", "분류 달인", "공장장", "전설의 분류"],
);

assert.match(viewSource, /sort-choice-svg/, "each answer surface must show the category relation");
assert.match(viewSource, /fraction-model-svg/, "fraction notation and quantity model must stay together");
assert.doesNotMatch(modelSource, /relation:\s*"[^"]*[<>≥≤+][^"]*"/, "choice relation labels must use third-grade words, not symbolic inequalities");
assert.doesNotMatch(viewSource, /어떤 분수\?/, "main question must not be repeated inside the quantity model");
assert.doesNotMatch(viewSource, /분류 점수|분류 등급|진행도/, "problem view must not contain reward panels");
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
assert.match(lessonCss, /\.sort-choice\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "answer choices must use an opaque background");
assert.match(lessonCss, /fraction-sorter[^\n]*\.problem-card\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "problem panel must use an opaque surface");
assert.match(lessonCss, /fraction-sorter[^\n]*\.complete-panel\s*\{[^}]*background:\s*#[0-9a-f]{6}/i, "completion panel must use an opaque surface");

console.log("QA_ENGINE_UNIT4_SORTER_SOURCE: PASS");
