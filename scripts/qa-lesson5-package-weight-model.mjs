#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON_PATH = path.join(ROOT, "3-2-5-4-mathmon-package-weight", "index.html");

function parseArgs(argv) {
  const options = {
    runs: 100000,
    seed: 20260629,
    injectBadCarry: false
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--runs") {
      options.runs = Number(argv[++index]);
      continue;
    }
    if (arg === "--seed") {
      options.seed = Number(argv[++index]);
      continue;
    }
    if (arg === "--inject-bad-carry") {
      options.injectBadCarry = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  if (!Number.isInteger(options.runs) || options.runs < 1) {
    throw new Error("--runs must be a positive whole number");
  }
  if (!Number.isInteger(options.seed) || options.seed < 0) {
    throw new Error("--seed must be a non-negative whole number");
  }
  return options;
}

function loadLessonModel() {
  const html = fs.readFileSync(LESSON_PATH, "utf8");
  const start = html.indexOf("const Lesson5PackageWeightModel = (() => {");
  const end = html.indexOf("\n\n    const screens", start);
  if (start === -1 || end === -1) {
    throw new Error("Lesson5PackageWeightModel block not found");
  }
  const source = `${html.slice(start, end)}\nLesson5PackageWeightModel;`;
  const context = vm.createContext({ console });
  return vm.runInContext(source, context, { filename: LESSON_PATH });
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function addCount(map, key, amount = 1) {
  map.set(key, (map.get(key) || 0) + amount);
}

function toObject(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function validateChoiceSet(step, problem, index) {
  assert(step.choices.includes(step.correct), `problem ${index} step ${step.id} lacks correct choice`);
  assert(new Set(step.choices).size === step.choices.length, `problem ${index} step ${step.id} has duplicate choices`);
  assert(step.choices.length >= 3, `problem ${index} step ${step.id} needs at least 3 choices`);
  assert(!step.choices.includes("알 수 없어요"), `problem ${index} step ${step.id} has a non-diagnostic unknown choice`);
  if (problem.representativeMistake) {
    const hasMistake = step.choices.includes(problem.representativeMistake);
    const isFitStep = problem.type === "limit" && step.id === "limitFit";
    const isFinalMathStep = (problem.type === "addCarry" && step.id === "addFinal") || (problem.type === "subtractBorrow" && step.id === "subtractFinal");
    if (isFitStep || isFinalMathStep) {
      assert(hasMistake, `problem ${index} step ${step.id} lacks representative mistake ${problem.representativeMistake}`);
    }
  }
}

function validateProblem(problem, index, model) {
  const expectedStepCount = problem.type === "limit" ? 2 : 3;
  assert(problem.steps.length === expectedStepCount, `problem ${index} must have exactly ${expectedStepCount} steps`);
  assert(problem.expression.includes(problem.finalText), `problem ${index} expression does not show final value`);
  for (const step of problem.steps) {
    validateChoiceSet(step, problem, index);
    assert(model.validateChoice(step, step.correct), `problem ${index} rejects correct choice for ${step.id}`);
    const wrong = step.choices.find((choice) => choice !== step.correct);
    assert(wrong && !model.validateChoice(step, wrong), `problem ${index} accepts wrong choice for ${step.id}`);
  }

  if (problem.type === "addCarry") {
    assert(problem.gramSum >= 1000, `problem ${index} addCarry must carry g >= 1000`);
    const expected = model.fromTotalGrams(model.toTotalGrams(problem.left) + model.toTotalGrams(problem.right));
    assert(problem.final.kg === expected.kg && problem.final.g === expected.g, `problem ${index} add final mismatch`);
    assert(problem.kgSum === problem.left.kg + problem.right.kg, `problem ${index} add kg sum mismatch`);
    assert(problem.carriedGram.kg === 1 && problem.carriedGram.g === problem.gramSum - 1000, `problem ${index} add carry conversion mismatch`);
    assert(problem.steps[0].correct === model.formatGrams(problem.gramSum), `problem ${index} add g step mismatch`);
    assert(problem.steps[1].correct === model.formatWeight(problem.carriedGram), `problem ${index} add carry step mismatch`);
    assert(problem.steps[2].correct === model.formatWeight(problem.final), `problem ${index} add final step mismatch`);
    return;
  }

  if (problem.type === "subtractBorrow") {
    assert(problem.top.g < problem.bottom.g, `problem ${index} subtractBorrow must need borrowing`);
    assert(problem.borrowedTop.kg === problem.top.kg - 1, `problem ${index} borrowed kg mismatch`);
    assert(problem.borrowedTop.g === problem.top.g + 1000, `problem ${index} borrowed g mismatch`);
    const expected = model.fromTotalGrams(model.toTotalGrams(problem.top) - model.toTotalGrams(problem.bottom));
    assert(problem.final.kg === expected.kg && problem.final.g === expected.g, `problem ${index} subtract final mismatch`);
    assert(problem.gramDifference === problem.borrowedTop.g - problem.bottom.g, `problem ${index} subtract g difference mismatch`);
    assert(problem.steps[0].correct === model.formatWeight(problem.borrowedTop), `problem ${index} borrow step mismatch`);
    assert(problem.steps[1].correct === model.formatGrams(problem.gramDifference), `problem ${index} subtract g step mismatch`);
    assert(problem.steps[2].correct === model.formatWeight(problem.final), `problem ${index} subtract final step mismatch`);
    return;
  }

  if (problem.type === "limit") {
    const total = model.toTotalGrams(problem.final);
    const limit = model.toTotalGrams(problem.limit);
    const expected = total === limit ? "한도와 같아요" : total < limit ? "실을 수 있어요" : "무거워요";
    assert(problem.fitsLimit === (total <= limit), `problem ${index} limit comparison mismatch`);
    assert(problem.steps[1].correct === expected, `problem ${index} limit label mismatch`);
    assert(!problem.prompt.includes(" / ") && problem.prompt.includes(" · 한도 "), `problem ${index} limit separator must be readable`);
    assert(problem.steps[0].confirm === `${model.formatWeight(problem.final)}예요.`, `problem ${index} limit confirmation must use natural copula`);
    return;
  }

  throw new Error(`problem ${index} unknown type ${problem.type}`);
}

function validateRun(run, model, runIndex, typeCounts, coverageCounts) {
  assert(run.length === model.TOTAL_PROBLEMS, `run ${runIndex} must have ${model.TOTAL_PROBLEMS} problems`);
  const perRunCounts = new Map();
  for (const [index, problem] of run.entries()) {
    validateProblem(problem, `${runIndex}.${index + 1}`, model);
    addCount(typeCounts, problem.type);
    addCount(perRunCounts, problem.type);
    if (problem.type === "addCarry") addCount(coverageCounts, "carry_g_ge_1000");
    if (problem.type === "subtractBorrow") addCount(coverageCounts, "borrow_1kg_1000g");
    if (problem.type === "limit" && problem.fitsLimit) addCount(coverageCounts, "limit_fits");
    if (problem.type === "limit" && !problem.fitsLimit) addCount(coverageCounts, "limit_too_heavy");
    if (problem.type === "limit" && problem.steps[1].correct === "한도와 같아요") addCount(coverageCounts, "limit_equal");
  }
  assert(perRunCounts.get("addCarry") === 4, `run ${runIndex} must have four addCarry problems`);
  assert(perRunCounts.get("subtractBorrow") === 3, `run ${runIndex} must have three subtractBorrow problems`);
  assert(perRunCounts.get("limit") === 3, `run ${runIndex} must have three limit problems`);
}

function runMalformedProbe(model) {
  const fixture = model.generateRun(424242).find((problem) => problem.type === "addCarry");
  assert(fixture, "malformed probe needs addCarry fixture");
  const mutated = structuredClone(fixture);
  mutated.gramSum -= 1000;
  validateProblem(mutated, "malformed", model);
}

function validateUpgradeFamilies(model) {
  const families = new Set(model.UPGRADE_EVENTS.map((event) => event.family));
  families.add(model.WRONG_UPGRADE_EVENT.family);
  for (const family of ["smallUpgrade", "bigUpgrade", "styleUpgrade", "smallOnly", "superUpgrade", "repair"]) {
    assert(families.has(family), `missing upgrade family ${family}`);
  }
  const repaired = model.applyUpgrade(
    { truckPower: 50, correctFirstTry: 5, superPartSeen: false },
    { ...model.WRONG_UPGRADE_EVENT, amount: -4 },
    false
  );
  assert(repaired.truckPower === 46, "wrong answer must reduce truck power");
  assert(repaired.correctFirstTry === 5, "repair event must not add first-try credit");
  const expected = [[6400,6,10],[1500,-5,-2],[1200,14,22],[500,30,30],[380,0,0],[20,100,100]];
  assert(model.UPGRADE_EVENTS.length === expected.length, "unified reward needs six events");
  model.UPGRADE_EVENTS.forEach((event,index) => {
    assert(event.weight === expected[index][0] && event.min === expected[index][1] && event.max === expected[index][2], `unified reward event ${index} mismatch`);
  });
  assert(model.WRONG_UPGRADE_EVENT.min === -6 && model.WRONG_UPGRADE_EVENT.max === -3, "wrong answer must lose 3 to 6 power");
  const emptyEvent = model.UPGRADE_EVENTS.find((event) => event.id === "empty");
  const emptyResult = model.applyUpgrade(
    { truckPower: 40, correctFirstTry: 5, superPartSeen: false },
    { ...emptyEvent, amount: 0 },
    true
  );
  assert(emptyResult.before === 40 && emptyResult.truckPower === 40, "empty reward must preserve accumulated truck power");
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const html = fs.readFileSync(LESSON_PATH, "utf8");
  assert(html.includes("major:problem.carriedGram.kg, minor:problem.carriedGram.g"), "carry conversion screen must show only the converted gram sum");
  assert(!html.includes("major:problem.kgSum + problem.carriedGram.kg"), "carry conversion screen leaks the next-step final weight");
  assert(html.includes("function wrongFeedbackForStep(step)"), "wrong choices need step-specific misconception feedback");
  assert(!html.includes('ui.feedbackLine.textContent = "다시 골라요."'), "generic wrong feedback must not replace misconception guidance");
  assert(html.includes('ui.completeExpression.dataset.textAlignRole = problem.type === "limit" ? "sentence" : "math"'), "completion text must distinguish sentence from math alignment");
  assert(html.includes('borrowKg: "1kg을 빌린 위 무게를 다시 써요."'), "borrow feedback must name one visible action in student language");
  const model = loadLessonModel();
  if (options.injectBadCarry) {
    runMalformedProbe(model);
    throw new Error("Malformed carry probe unexpectedly passed");
  }

  validateUpgradeFamilies(model);

  const typeCounts = new Map();
  const coverageCounts = new Map();
  const sample = [];
  for (let run = 0; run < options.runs; run += 1) {
    const seed = (options.seed + Math.imul(run + 1, 2654435761)) >>> 0;
    const generated = model.generateRun(seed);
    validateRun(generated, model, run + 1, typeCounts, coverageCounts);
    if (sample.length < 3) {
      sample.push({
        seed,
        firstPrompt: generated[0].prompt,
        firstExpression: generated[0].expression,
        types: generated.map((problem) => problem.type)
      });
    }
  }

  for (const key of ["carry_g_ge_1000", "borrow_1kg_1000g", "limit_fits", "limit_too_heavy", "limit_equal"]) {
    assert((coverageCounts.get(key) || 0) > 0, `coverage missing ${key}`);
  }

  console.log("LESSON5_PACKAGE_WEIGHT_MODEL_QA: PASS");
  console.log(JSON.stringify({
    runs: options.runs,
    problemsChecked: options.runs * model.TOTAL_PROBLEMS,
    typeCounts: toObject(typeCounts),
    coverageCounts: toObject(coverageCounts),
    upgradeFamilies: [...new Set([...model.UPGRADE_EVENTS.map((event) => event.family), model.WRONG_UPGRADE_EVENT.family])].sort(),
    samples: sample
  }, null, 2));
}

main();
