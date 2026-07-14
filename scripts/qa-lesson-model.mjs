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
    assert.ok(problem.ones > 0, `${problem.id}: meaningful ones step`);
    assert.ok(problem.divisor >= 2 && problem.divisor <= 5, `${problem.id}: share builder keeps two to five baskets`);
    assert.equal(problem.steps.map((step) => step.id).join(","), "tens,ones,quotient", `${problem.id}: distribute tens, distribute ones, then write quotient`);
    assert.equal(problem.tensShare, (problem.tens * 10) / problem.divisor, `${problem.id}: tens share`);
    assert.equal(problem.tensShare + problem.onesQuotient, problem.quotient, `${problem.id}: quotient is completed from both shares`);
    assert.equal(problem.steps[0].answer * problem.divisor, problem.tens, `${problem.id}: built tens share accounts for every bundle`);
    assert.equal(problem.steps[1].answer * problem.divisor, problem.ones, `${problem.id}: built ones share accounts for every vegetable`);
    assert.ok(problem.steps.slice(0, 2).every((step) => step.interaction === "distribute-equal"), `${problem.id}: student chooses every basket destination`);
    assert.ok(problem.steps.slice(0, 2).every((step) => step.choices.some((choice) => choice.misconceptionId === "DIV1_UNEQUAL_GROUPS")), `${problem.id}: unequal distribution is a real wrong state`);
    assert.equal(problem.steps[2].interaction, "enter-quotient", `${problem.id}: student writes the completed quotient`);
    assert.equal(problem.steps[2].answer, problem.quotient, `${problem.id}: quotient entry answer`);
    assert.ok(problem.steps[2].choices.some((choice) => choice.misconceptionId === "DIV1_QUOTIENT_COUNT_ERROR"), `${problem.id}: quotient count error state`);
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
      assert.equal(choice.parts?.[0]?.label, "몫", `${problem.id}: quotient label`);
      assert.equal(choice.parts?.[1]?.label, "남은 수", `${problem.id}: remainder label`);
      assert.equal(choice.parts?.[0]?.value, choice.value.quotient * 10, `${problem.id}: show the tens quotient as its full place value`);
      assert.equal(choice.parts?.[1]?.value, choice.value.remainingTens * 10, `${problem.id}: show the remaining tens as its full place value`);
    }
    assert.equal(problem.steps[0].correctText, `몫 ${problem.tensQuotient * 10}, 남은 수 ${problem.carriedTens}`, `${problem.id}: first confirmation keeps full place values`);
    assert.equal(problem.steps[1].instruction, `남은 ${problem.carriedTens}과 일의 자리 ${problem.onesDigit}을 합친 수를 내려요.`, `${problem.id}: bring-down instruction names both place values`);
    assert.equal(problem.steps[1].correctText, `남은 수 ${problem.carriedTens} + 일의 자리 ${problem.onesDigit} = ${problem.downNumber}`, `${problem.id}: bring-down confirmation shows how the number was made`);
    assert.ok(problem.steps[0].advance?.delayMs >= 1800, `${problem.id}: first place-value confirmation must stay long enough to read`);
    assert.ok(problem.steps[1].advance?.delayMs >= 1600, `${problem.id}: bring-down confirmation must stay long enough to read`);
    const studentCopy = problem.steps.flatMap((step) => [
      step.instruction,
      step.correctText,
      ...step.choices.map((choice) => choice.feedback),
    ]).filter(Boolean).join("\n");
    assert.doesNotMatch(studentCopy, /\d십/, `${problem.id}: write place-value amounts as 70, 80, 90 instead of 7십, 8십, 9십`);
    return;
  }
  if (rule === "division-with-remainder") {
    assert.ok(problem.remainder > 0 && problem.remainder < problem.divisor, `${problem.id}: remainder range`);
    assert.equal(problem.divisor * problem.quotient + problem.remainder, problem.dividend, `${problem.id}: identity`);
    assert.equal(problem.steps.map((step) => step.id).join(","), "quotient,remainder", `${problem.id}: action order`);
    const quotientStep = problem.steps[0];
    const quotientValues = quotientStep.choices.map((choice) => choice.value).sort((a, b) => a - b);
    assert.equal(quotientValues.join(","), [problem.quotient - 1, problem.quotient, problem.quotient + 1].join(","), `${problem.id}: quotient boundary choices`);
    for (const choice of quotientStep.choices) {
      assert.equal(choice.product, problem.divisor * choice.value, `${problem.id}/${choice.id}: quotient choice product`);
      assert.equal(choice.gap, problem.dividend - choice.product, `${problem.id}/${choice.id}: quotient choice gap`);
    }
    const lowChoice = quotientStep.choices.find((choice) => choice.value === problem.quotient - 1);
    const fitChoice = quotientStep.choices.find((choice) => choice.value === problem.quotient);
    const highChoice = quotientStep.choices.find((choice) => choice.value === problem.quotient + 1);
    assert.equal(lowChoice?.relation, "too-small", `${problem.id}: low quotient state`);
    assert.ok(lowChoice?.gap >= problem.divisor, `${problem.id}: low quotient leaves another full group`);
    assert.equal(fitChoice?.relation, "fit", `${problem.id}: fitted quotient state`);
    assert.equal(fitChoice?.gap, problem.remainder, `${problem.id}: fitted quotient leaves the remainder`);
    assert.equal(highChoice?.relation, "too-high", `${problem.id}: high quotient state`);
    assert.ok(highChoice?.gap < 0, `${problem.id}: high quotient needs more stars than exist`);

    const remainderStep = problem.steps[1];
    const remainderValues = new Set(remainderStep.choices.map((choice) => choice.value));
    assert.ok(remainderValues.has(problem.remainder), `${problem.id}: correct remainder choice`);
    assert.ok(remainderValues.has(problem.divisor), `${problem.id}: divisor-as-remainder misconception`);
    assert.ok(remainderValues.has(problem.remainder + problem.divisor), `${problem.id}: ungrouped-extra-bundle misconception`);
    assert.ok(remainderStep.choices.some((choice) => choice.misconceptionId === "DIV3_REMAINDER_NOT_LESS_THAN_DIVISOR"), `${problem.id}: remainder misconception`);
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
    if (typeof model.getNextResult === "function") {
      assert.equal(model.getNextResult(special)?.id, special.id, `${config.id}: special result must not point back to a lower next result`);
    }
  }
  const lowest = model.getResult(0, 0, false);
  assert.ok(lowest?.image && lowest?.titleImage, `${config.id}: zero-correct result must still have art`);
  assert.ok(config.imageAssets?.resultRetryButton, `${config.id}: zero-correct path must retain retry control`);
}

function checkViewContract(rule, config, modelSource, viewSource, runtimeSource) {
  const expected = {
    "division-place-value-exact": ["place-value-farm", "farm-board-generated.webp", /place-value-farm-svg/, /farm-instruction/, /farm-distribution-value/, /수확 점수|농장 등급|진행도/],
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
    assert.match(viewSource, /dataset\.interaction = "distribute-to-baskets"/, `${config.id}: student chooses every basket destination`);
    assert.match(viewSource, /dataset\.interaction = "enter-quotient"/, `${config.id}: student enters the quotient`);
    assert.match(viewSource, /animateFarmTokenTransfer/, `${config.id}: chosen vegetables visibly move into the basket`);
    assert.match(viewSource, /farm-check-button/, `${config.id}: student validates the constructed share`);
    assert.match(viewSource, /checkButton\.disabled = remaining > 0 \|\| selectedStock \|\| locked/, `${config.id}: checking is blocked until every unit has a student-chosen destination`);
    assert.match(viewSource, /farm-basket-drop/, `${config.id}: basket destination remains a student decision`);
    assert.match(viewSource, /basketCounts\.every\(\(count\) => count === step\.answer\)/, `${config.id}: wrong state checks every basket`);
    assert.match(viewSource, /for \(let index = 0; index < problem\.divisor/, `${config.id}: correct share expands to every basket only after validation`);
    assert.doesNotMatch(viewSource, /build-one-basket-share|distribute-vegetables|farm-move-button|animateFarmRound/, `${config.id}: guess-and-check or answer-performing distribution returned`);
    assert.doesNotMatch(viewSource, /farm-drop-zone|farm-progress-panel|drag-basket/, `${config.id}: preview or drag UI returned`);
    assert.doesNotMatch(modelSource, /makeNumericChoices/, `${config.id}: four-choice generator returned`);
    assert.doesNotMatch(modelSource, /makeShareChoices/, `${config.id}: incremental one-basket guess checker returned`);
    assert.doesNotMatch(modelSource, /id: "combine"|두 숫자로 몫/, `${config.id}: redundant combine quiz returned`);
    assert.match(viewSource, /setFarmFlowPhase\("confirm"\)/, `${config.id}: confirmation phase`);
  }
  if (rule === "division-with-remainder") {
    assert.match(viewSource, /choose-group-limit/, `${config.id}: quotient is chosen as a boundary, not built by repeated taps`);
    assert.match(viewSource, /choose-leftover-stars/, `${config.id}: remainder is chosen in one action`);
    assert.match(viewSource, /star-quotient-choice/, `${config.id}: quotient boundary choices are visible`);
    assert.match(viewSource, /star-remainder-choice/, `${config.id}: remainder choices are visible`);
    assert.match(viewSource, /renderRemainderEvidence/, `${config.id}: remainder misconception changes the current objects`);
    assert.doesNotMatch(viewSource, /star-builder|별 한 묶음|count = Math\.min|max = step\.id/, `${config.id}: repeated-tap answer builder returned`);
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
