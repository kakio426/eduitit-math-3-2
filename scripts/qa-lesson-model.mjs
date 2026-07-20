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
    assert.equal(problem.steps.map((step) => step.id).join(","), "tens,ones", `${problem.id}: distribute tens, then distribute ones`);
    assert.equal(problem.tensShare, (problem.tens * 10) / problem.divisor, `${problem.id}: tens share`);
    assert.equal(problem.tensShare + problem.onesQuotient, problem.quotient, `${problem.id}: quotient is completed from both shares`);
    assert.equal(problem.steps[0].answer * problem.divisor, problem.tensValue, `${problem.id}: tens share accounts for the full tens value`);
    assert.equal(problem.steps[1].answer * problem.divisor, problem.ones, `${problem.id}: built ones share accounts for every vegetable`);
    assert.equal(problem.steps[0].answer, problem.tensShare, `${problem.id}: student answer maps to the actual tens share`);
    assert.equal(problem.steps[1].answer, problem.onesQuotient, `${problem.id}: student answers with the actual ones share`);
    assert.equal(problem.steps[0].advance?.mode, "button", `${problem.id}: student advances after reading the tens confirmation`);
    assert.equal(problem.steps[0].advance?.label, "하나씩 나누기", `${problem.id}: next action names the ones step in student-friendly language`);
    assert.equal(problem.steps[1].advance?.mode, "button", `${problem.id}: student advances after reading the ones confirmation`);
    assert.equal(problem.steps[1].advance?.label, "나눈 값 더하기", `${problem.id}: final action names the completed relationship`);
    assert.ok(problem.steps.slice(0, 2).every((step) => step.interaction === "enter-share"), `${problem.id}: student decides one basket's share before the system distributes`);
    assert.ok(problem.steps.slice(0, 2).every((step) => step.reason), `${problem.id}: each place-value step states why it exists`);
    assert.ok(problem.steps[0].choices.some((choice) => choice.misconceptionId === "DIV1_TENS_SHARE_ERROR"), `${problem.id}: tens-share error state`);
    assert.ok(problem.steps[1].choices.some((choice) => choice.misconceptionId === "DIV1_ONES_SHARE_ERROR"), `${problem.id}: ones-share error state`);
    assert.match(problem.finalExpression, new RegExp(`${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}`), `${problem.id}: completed shares form the final identity`);
    assert.equal(problem.steps.length, 2, `${problem.id}: place-value distribution stays in two steps before the final sum`);
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
    assert.equal(problem.finalExpression, `${problem.divisor}×${problem.quotient}+${problem.remainder}=${problem.dividend}`, `${problem.id}: final identity text`);
    assert.match(problem.steps[0].instruction, new RegExp(`^${problem.divisor}×몇이 ${problem.dividend}[을를] 넘지 않을까요\\?$`), `${problem.id}: product-comparison instruction`);
    assert.equal(problem.steps[1].instruction, "묶고 남은 별을 세어 봐요.", `${problem.id}: one-line remainder action`);
    assert.ok(problem.steps[0].advance?.delayMs >= 1200, `${problem.id}: quotient confirmation must stay long enough to read`);
    assert.ok(problem.quotient + 1 <= 32, `${problem.id}: quotient capsules must fit the fixed 8x4 board`);
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
    assert.equal(
      problem.steps.map((step) => step.id).join(","),
      (problem.matchesOriginal ? ["multiply", "add"] : ["multiply", "add", "locate"]).join(","),
      `${problem.id}: deterministic comparison must auto-complete`
    );
    assert.ok(!problem.steps.some((step) => step.id === "compare"), `${problem.id}: redundant compare action`);
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
    "division-place-value-exact": ["place-value-farm", "farm-board-generated.webp", /place-value-farm-svg/, /farm-instruction/, /farm-drag-piece|farm-share-basket/, /수확 점수|농장 등급|진행도/],
    "division-regrouping-exact": ["division-elevator", "board-shaft-generated.webp", /elevator-math-svg/, /십의 자리 몫/, /남은 십/, /보상 점수|엘리베이터 등급/],
    "division-with-remainder": ["remainder-stars", "result-stage.webp", /star-math-svg/, /renderLooseStarGrid/, /renderGroupedStars/, /닉네임|별 이름|진행도|등급/],
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
    assert.match(viewSource, /dataset\.interaction = "share-drag-distribution"/, `${config.id}: every visible carrot is distributed by direct dragging`);
    assert.match(viewSource, /beginFarmPieceDrag|applyFarmPieceDrop/, `${config.id}: pointer drag moves produce between source and baskets`);
    assert.match(viewSource, /index < sourceRemaining/, `${config.id}: every remaining produce unit stays individually visible`);
    assert.match(viewSource, /basketUnits\.every/, `${config.id}: equal basket quantities are validated`);
    assert.match(viewSource, /바구니를 똑같이 만들어요/, `${config.id}: unequal distribution has visible corrective feedback`);
    assert.match(viewSource, /createFarmBasketImage/, `${config.id}: generated basket art is used instead of a CSS-drawn basket`);
    assert.match(viewSource, /createFarmBasketStateImage/, `${config.id}: generated filled-basket states follow the dragged quantity`);
    assert.match(viewSource, /farm-share-mini-basket/, `${config.id}: all destination baskets remain visible`);
    assert.match(viewSource, /renderFarmShareConfirmation/, `${config.id}: the confirmed answer changes the current objects`);
    assert.match(viewSource, /prepareStepAdvance/, `${config.id}: the confirmed tens step waits for the student button`);
    assert.match(viewSource, /prepareProblemComplete/, `${config.id}: the confirmed ones step waits for the student button`);
    assert.match(viewSource, /renderFarmFinalAnswerEntry/, `${config.id}: the student completes the final sum before the quotient is revealed`);
    assert.match(viewSource, /farm-final-answer-source/, `${config.id}: the two earlier divisions stay next to the final sum`);
    assert.match(viewSource, /한 바구니에 들어갈 수를 구해요/, `${config.id}: the final addition states why the two shares are combined`);
    assert.match(viewSource, /renderFarmPendingAnswerHeader/, `${config.id}: the full division stays in a question-mark state before the final sum`);
    assert.match(viewSource, /dataset\.interaction = "enter-final-sum"/, `${config.id}: the final sum is an explicit student action`);
    assert.match(viewSource, /다시 더해 봐요/, `${config.id}: a wrong final sum keeps a short corrective prompt`);
    assert.match(viewSource, /낱개 나누기/, `${config.id}: the manual transition names the next math action`);
    assert.match(runtimeSource, /advanceToNextStep/, `${config.id}: manual and timed transitions share one guarded advance path`);
    assert.match(viewSource, /for \(let index = 0; index < problem\.divisor/, `${config.id}: every divisor basket is rendered`);
    assert.doesNotMatch(viewSource, /createFarmShareOption|farm-share-option-count/, `${config.id}: answer-card buttons returned`);
    assert.doesNotMatch(viewSource, /addEventListener\("dragstart"/, `${config.id}: touch-fragile native drag returned`);
    assert.doesNotMatch(modelSource, /makeNumericChoices/, `${config.id}: four-choice generator returned`);
    assert.doesNotMatch(modelSource, /makeShareChoices/, `${config.id}: incremental one-basket guess checker returned`);
    assert.doesNotMatch(modelSource, /id: "combine"|두 숫자로 몫/, `${config.id}: redundant combine quiz returned`);
    assert.match(viewSource, /setFarmFlowPhase\("confirm"\)/, `${config.id}: confirmation phase`);
  }
  if (rule === "division-with-remainder") {
    assert.match(viewSource, /compare-products/, `${config.id}: quotient is chosen by comparing products, not built by repeated taps`);
    assert.match(viewSource, /count-leftover-stars/, `${config.id}: remainder is chosen in one action`);
    assert.match(viewSource, /star-quotient-choice/, `${config.id}: quotient boundary choices are visible`);
    assert.match(viewSource, /star-remainder-choice/, `${config.id}: remainder choices are visible`);
    assert.match(viewSource, /renderRemainderBoard/, `${config.id}: remainder misconception changes the current objects`);
    assert.match(viewSource, /star-next-group/, `${config.id}: a low quotient or full leftover group is outlined`);
    assert.match(viewSource, /missing-slot/, `${config.id}: a high quotient shows the exact missing star slots`);
    assert.match(viewSource, /animateRemainderToJar/, `${config.id}: first-try remainder moves into the star jar`);
    assert.match(viewSource, /syncStarWorld/, `${config.id}: calculation rewards update the visible constellation`);
    assert.match(viewSource, /playImage/, `${config.id}: all play states use the generated constellation set`);
    assert.doesNotMatch(viewSource, /star-journey-title/, `${config.id}: disconnected current-to-next title fragments returned`);
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
  assert.ok(config.imageAssets?.resultScene || config.results.every((result) => result.image), `${lesson}: UI-free result scene`);
  for (const result of config.results) {
    assert.ok(result.titleImage && result.titleImage !== result.image, `${lesson}/${result.id}: independent generated result title`);
    if (config.qa.modelRule === "division-with-remainder") {
      assert.ok(result.playImage, `${lesson}/${result.id}: generated play-state constellation`);
    }
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
