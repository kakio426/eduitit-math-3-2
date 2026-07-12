#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const requested = process.argv.slice(2);
const lessons = requested.length ? requested : [
  "3-2-2-1-mathmon-divide-farm",
  "3-2-2-2-mathmon-elevator",
  "3-2-2-3-mathmon-star-pickup",
  "3-2-2-4-mathmon-check-lock",
];

function loadModel(source, config) {
  const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
  vm.runInContext(`${source}\nglobalThis.__lessonModel = ${config.modelName};`, context);
  return context.__lessonModel;
}

function checkChoices(model, problem) {
  for (const step of problem.steps) {
    assert.ok(step.answerChoiceId, `${problem.id}/${step.id}: answerChoiceId`);
    assert.equal(new Set(step.choices.map((choice) => choice.id)).size, step.choices.length, `${problem.id}/${step.id}: duplicate choice`);
    const answers = step.choices.filter((choice) => model.validateChoice(step, choice));
    assert.equal(answers.length, 1, `${problem.id}/${step.id}: exactly one answer`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}/${step.id}: misconceptionId`);
      assert.ok(choice.feedback, `${problem.id}/${step.id}: feedback`);
    }
  }
}

function checkInvariant(rule, problem) {
  if (rule === "division-place-value-exact") {
    assert.equal(Math.floor(problem.dividend / 10) % problem.divisor, 0, `${problem.id}: tens exact`);
    assert.equal((problem.dividend % 10) % problem.divisor, 0, `${problem.id}: ones exact`);
    assert.equal(problem.quotient, problem.dividend / problem.divisor, `${problem.id}: quotient`);
    assert.equal(problem.steps.length, 3, `${problem.id}: three learning actions`);
    assert.ok(problem.steps[0].choices.some((choice) => choice.misconceptionId === "DIV1_DIVIDE_FULL_TENS_VALUE"), `${problem.id}: place-value misconception`);
    assert.ok(problem.steps[2].choices.some((choice) => choice.misconceptionId === "DIV1_COMBINE_BY_ADDING_DIGITS"), `${problem.id}: combine misconception`);
    return;
  }
  if (rule === "division-regrouping-exact") {
    assert.ok(problem.remainingTens > 0, `${problem.id}: regrouping required`);
    assert.equal(problem.downNumber, problem.remainingTens * 10 + problem.onesDigit, `${problem.id}: down number`);
    assert.equal(problem.dividend, problem.divisor * problem.quotient, `${problem.id}: identity`);
    assert.equal(problem.downNumber % problem.divisor, 0, `${problem.id}: final division exact`);
    assert.equal(problem.steps.map((step) => step.id).join(","), "tens,down,ones", `${problem.id}: action order`);
    for (const choice of problem.steps[0].choices) {
      assert.equal(choice.kind, "quotient-remaining-pair", `${problem.id}: labelled pair`);
      assert.equal(choice.parts?.[0]?.label, "십의 자리 몫", `${problem.id}: quotient label`);
      assert.equal(choice.parts?.[1]?.label, "나머지", `${problem.id}: remainder label`);
    }
    return;
  }
  if (rule === "division-with-remainder") {
    assert.ok(problem.remainder > 0 && problem.remainder < problem.divisor, `${problem.id}: remainder range`);
    assert.equal(problem.divisor * problem.quotient + problem.remainder, problem.dividend, `${problem.id}: identity`);
    assert.equal(problem.steps.map((step) => step.id).join(","), "quotient,remainder", `${problem.id}: action order`);
    assert.ok(problem.steps[0].choices.some((choice) => choice.misconceptionId === "DIV3_QUOTIENT_TOO_HIGH"), `${problem.id}: high quotient misconception`);
    assert.ok(problem.steps[1].choices.some((choice) => choice.misconceptionId === "DIV3_REMAINDER_NOT_LESS_THAN_DIVISOR"), `${problem.id}: remainder misconception`);
    return;
  }
  if (rule === "division-check-lock") {
    assert.equal(problem.product, problem.divisor * problem.shownQuotient, `${problem.id}: product`);
    assert.equal(problem.checkTotal, problem.product + problem.shownRemainder, `${problem.id}: check total`);
    assert.equal(problem.matchesOriginal, problem.checkTotal === problem.dividend, `${problem.id}: comparison`);
    assert.ok(problem.steps.length >= 3 && problem.steps.length <= 4, `${problem.id}: action count`);
    assert.ok(problem.steps[0].choices.some((choice) => choice.misconceptionId === "DIV4_ADD_INSTEAD_OF_MULTIPLY"), `${problem.id}: multiply misconception`);
    assert.ok(problem.steps[1].choices.some((choice) => choice.misconceptionId === "DIV4_OMIT_REMAINDER"), `${problem.id}: remainder omission misconception`);
    if (!problem.matchesOriginal) {
      const quotientDiffers = problem.shownQuotient !== problem.trueQuotient;
      const remainderDiffers = problem.shownRemainder !== problem.trueRemainder;
      assert.equal(Number(quotientDiffers) + Number(remainderDiffers), 1, `${problem.id}: exactly one wrong part`);
      assert.equal(problem.mismatchPart, quotientDiffers ? "quotient" : "remainder", `${problem.id}: mismatch target`);
    }
    return;
  }
  assert.fail(`Unknown qa.modelRule: ${rule}`);
}

function simulateRewards(model, config, runs = 10000) {
  const counts = new Map();
  let legendCount = 0;
  for (let seed = 1; seed <= runs; seed += 1) {
    const rng = model.createRng(seed);
    let power = 0;
    let specialSeen = false;
    for (let index = 0; index < 10; index += 1) {
      const event = model.pickRewardEvent(rng, false);
      const patch = model.applyReward({ power, specialSeen }, event, true, { remainder: 1 });
      power = patch.power;
      specialSeen = patch.specialSeen;
      if (event.rarity === "legend") legendCount += 1;
    }
    const result = model.getResult(power, 10, specialSeen);
    counts.set(result.id, (counts.get(result.id) || 0) + 1);
  }
  assert.ok(counts.size >= 2, `${config.id}: perfect runs must vary`);
  assert.ok(legendCount < runs * 2, `${config.id}: legend must remain rare`);
  const special = config.results.find((result) => result.needsSpecial);
  if (special) {
    assert.ok((counts.get(special.id) || 0) < Math.max(...counts.values()), `${config.id}: highest result must be rarer than a general result`);
  }
  const lowest = model.getResult(0, 0, false);
  assert.ok(lowest?.image && lowest?.titleImage, `${config.id}: zero-correct result must still have art`);
  assert.ok(config.imageAssets?.resultRetryButton, `${config.id}: zero-correct path must retain retry control`);
}

function checkViewContract(rule, config, modelSource, viewSource, runtimeSource) {
  const expected = {
    "division-place-value-exact": ["place-value-farm", "farm-board-generated.webp", /place-value-farm-svg/, /farm-decision-value/, /farm-decision-question/, /수확 점수|농장 등급|진행도/],
    "division-regrouping-exact": ["division-elevator", "board-shaft-generated.webp", /elevator-math-svg/, /십의 자리 몫/, /남은 십/, /보상 점수|엘리베이터 등급/],
    "division-with-remainder": ["remainder-stars", "result-stage.webp", /star-proof-bar/, /남은 별/, /만든 묶음/, /닉네임|별 이름|진행도|등급/],
    "division-check-lock": ["check-lock-bars", "board-vault-generated.webp", /check-lock-svg/, /처음 수/, /나누는 수 × 몫/, /보안 점수|금고 등급|진행도/],
  }[rule];
  assert.ok(expected, `${config.id}: view rule`);
  assert.equal(config.workbench.type, expected[0], `${config.id}: workbench`);
  assert.equal(config.imageAssets.problemStage, expected[1], `${config.id}: problem scene`);
  assert.match(viewSource, expected[2], `${config.id}: dynamic board`);
  assert.match(viewSource, expected[3], `${config.id}: first visible math label`);
  assert.match(viewSource, expected[4], `${config.id}: second visible math label`);
  assert.doesNotMatch(viewSource, expected[5], `${config.id}: reward/result text must stay out of play view`);
  if (rule === "division-place-value-exact") {
    assert.match(viewSource, /dataset\.interaction = "tap-choice"/, `${config.id}: one-decision tap choices`);
    assert.doesNotMatch(viewSource, /farm-drop-zone|farm-progress-panel|drag-basket/, `${config.id}: preview or drag UI returned`);
    assert.match(viewSource, /setFarmFlowPhase\("confirm"\)/, `${config.id}: confirmation phase`);
  }
  assert.match(viewSource, /dataset\.interaction/, `${config.id}: direct interaction marker`);
  assert.match(runtimeSource, /misconceptionId/, `${config.id}: engine stores misconception ids`);
  assert.match(modelSource, /misconceptionId/, `${config.id}: model misconceptions`);
}

for (const lesson of lessons) {
  const sourceDir = path.join(ROOT, "_lessons", lesson);
  const config = JSON.parse(await readFile(path.join(sourceDir, "lesson.json"), "utf8"));
  const modelSource = await readFile(path.join(sourceDir, "model.js"), "utf8");
  const viewSource = await readFile(path.join(sourceDir, "view.js"), "utf8");
  const runtimeSource = await readFile(path.join(ROOT, "_engine", "v1", "runtime", "core.js"), "utf8");
  const model = loadModel(modelSource, config);

  assert.ok(config.qa?.modelRule, `${lesson}: qa.modelRule`);
  assert.equal(config.qa?.directInteractionRequired, true, `${lesson}: direct interaction contract`);
  assert.deepEqual(Object.keys(config.imageAssets?.problemStates || {}).sort(), ["complete", "waiting", "working"], `${lesson}: three generated problem states`);
  assert.ok(config.imageAssets?.resultScene, `${lesson}: UI-free result scene`);
  for (const result of config.results) {
    assert.ok(result.titleImage && result.titleImage !== result.image, `${lesson}/${result.id}: independent generated result title`);
  }
  checkViewContract(config.qa.modelRule, config, modelSource, viewSource, runtimeSource);
  for (const event of config.rewardEvents) {
    assert.ok(["common", "rare", "legend"].includes(event.rarity), `${lesson}/${event.id}: rarity`);
  }

  for (let seed = 1; seed <= 200; seed += 1) {
    const problems = model.generateRun(seed);
    assert.equal(problems.length, 10, `${lesson}/seed ${seed}: ten problems`);
    assert.equal(new Set(problems.map((problem) => problem.id)).size, 10, `${lesson}/seed ${seed}: unique problems`);
    for (const problem of problems) {
      checkInvariant(config.qa.modelRule, problem);
      checkChoices(model, problem);
    }
  }
  simulateRewards(model, config);
  console.log(`QA_LESSON_MODEL: PASS ${lesson}`);
}
