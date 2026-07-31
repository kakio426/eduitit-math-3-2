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
const lessonCss = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;
const emptyEvent = config.rewardEvents.find((event) => event.id === "empty");
assert.equal(config.qa.emptyRewardAudit, true, "browser QA must force empty at nonzero power");
assert.equal(emptyEvent?.keepsPower, true, "empty event must declare accumulated-power preservation");
assert.equal(emptyEvent?.emptiesPower, undefined, "legacy reset flag must be removed");
assert.equal(model.applyReward({ power:47, specialSeen:false }, { ...emptyEvent, amount:0 }).power, 47, "empty must preserve accumulated power");

assert.equal(config.workbench.type, "circle-double-bridge");
assert.equal(config.imageAssets.problemStage, "problem-workshop-v3-generated.webp");
assert.ok(config.assets.includes("problem-workshop-v3-generated.webp"), "v3 workshop stage must be listed");
assert.ok(!config.assets.includes("problem-stage-v2-generated.webp"), "retired v2 problem stage must not be listed");
assert.ok(!config.assets.includes("problem-stage-generated.webp"), "retired problem stage must not be listed");
assert.equal(config.goal, "반지름 두 개를 이으면 지름이 돼요.");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-v2-generated.webp");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.ok(config.assets.includes("../_shared/mathmon/cover-start-button/start-button-generated.webp"), "shared start button must be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.65);
assert.equal(config.qa.visualContractVersion, 1);
assert.equal(config.qa.bridgeFitAudit.sharedScaleAttribute, "data-px-per-cm");
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "DIAMETER_NOT_DOUBLED",
  "DIAMETER_ONE_SHORT",
  "DIAMETER_TOO_LONG",
  "RADIUS_NOT_HALVED",
  "RADIUS_TOO_LONG",
  "RADIUS_TOO_SHORT",
]);
assert.deepEqual([...config.qa.bridgeFitAudit.choiceRange], [1, 14]);

vm.runInContext(
  `${viewSource}
   globalThis.__getBridgeGeometry = getBridgeGeometry;
   globalThis.__getBridgeFit = getBridgeFit;`,
  context
);
const getBridgeGeometry = context.__getBridgeGeometry;
const getBridgeFit = context.__getBridgeFit;

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
    assert.ok(step.correctText.length <= 34, `${problem.id}: confirmation copy stays short`);
    const geometry = getBridgeGeometry(problem, step.choices);
    assert.ok(
      Math.abs(geometry.pxPerCm * geometry.maxVisibleCm - 320) < 0.0001,
      `${problem.id}: one maximum span defines the shared scale`
    );
    assert.equal(
      geometry.circleDiameterPx,
      problem.diameter * geometry.pxPerCm,
      `${problem.id}: circle uses the shared scale`
    );
    assert.equal(
      geometry.targetWidth,
      step.answer * geometry.pxPerCm,
      `${problem.id}: target uses the shared scale`
    );
    for (const choice of step.choices) {
      const fitGeometry = getBridgeFit(choice.value, geometry);
      assert.equal(
        fitGeometry.width,
        choice.value * geometry.pxPerCm,
        `${problem.id}/${choice.value}: candidate and installed bridge use the shared scale`
      );
      assert.equal(
        fitGeometry.fit,
        choice.value === step.answer ? "fit" : choice.value < step.answer ? "short" : "long",
        `${problem.id}/${choice.value}: physical fit state`
      );
    }
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

assert.match(viewSource, /bridge-part-svg/, "each answer surface must show a bridge part");
assert.match(viewSource, /bridgeStructureMarkup/, "candidates and installed answers must share one bridge structure renderer");
assert.match(viewSource, /BRIDGE_SCALE_MAX_PX/, "all geometry must derive from one scale constant");
assert.match(viewSource, /circle-bridge-confirm-svg/, "circle relation must remain visible for confirmation");
assert.match(viewSource, /data-fit=/, "installed bridge must expose a physical fit state");
assert.match(viewSource, /dataset\.pxPerCm/, "rendered workbench must expose the shared physical scale");
assert.match(viewSource, /bridge-difference/, "wrong answers must show a visible length difference");
assert.match(viewSource, /bridge-fit-check/, "correct answers must visibly lock into place");
assert.match(viewSource, /classList\.add\("result-restart-hitbox"\)/, "baked result retry button must keep a measured hitbox");
assert.match(viewSource, /selected === geometry\.answer \? "=" : "≠"/, "wrong comparison must never show a false equality");
assert.doesNotMatch(viewSource, /다리 점수|다리 등급|진행도/, "problem view must not contain reward panels");
assert.doesNotMatch(viewSource, /bridgeChoiceMarkup|bridge-choice-svg/, "retired floating measurement-handle choices must be removed");
assert.match(lessonCss, /\.bridge-part\s*\{[\s\S]*?background:\s*transparent;/, "individual answer cards must have no card surface");
assert.match(lessonCss, /\.choices-panel\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2/, "four parts must share one two-by-two workshop rack");
assert.doesNotMatch(lessonCss, /\.bridge-choice\b/, "retired teal choice card selectors must be removed");

console.log("QA_ENGINE_UNIT3_DOUBLE_BRIDGE_SOURCE: PASS");
