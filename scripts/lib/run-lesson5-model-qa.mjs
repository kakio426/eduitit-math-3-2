import { loadLessonSourceModel } from "./load-lesson-source-model.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const options = { runs: 10000, seed: 20260704 };
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--runs") {
      options.runs = Number(argv[++index]);
      continue;
    }
    if (argv[index] === "--seed") {
      options.seed = Number(argv[++index]);
      continue;
    }
    throw new Error(`Unknown option: ${argv[index]}`);
  }
  assert(Number.isInteger(options.runs) && options.runs > 0, "--runs must be a positive whole number");
  assert(Number.isInteger(options.seed) && options.seed >= 0, "--seed must be a non-negative whole number");
  return options;
}

function countBy(items, getKey) {
  const counts = new Map();
  for (const item of items) {
    const key = getKey(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function toObject(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => String(left).localeCompare(String(right))));
}

function median(values) {
  const ordered = values.slice().sort((left, right) => left - right);
  const middle = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[middle] : (ordered[middle - 1] + ordered[middle]) / 2;
}

function validateChoiceSet(problem, step, label, model, coverage) {
  assert(step.choices.length >= 3, `${label} needs at least three choices`);
  assert(step.choices.every((choice) => choice && typeof choice === "object"), `${label} must use object choices`);
  assert(new Set(step.choices.map((choice) => choice.id)).size === step.choices.length, `${label} has duplicate choice ids`);
  const correctChoices = step.choices.filter((choice) => model.validateChoice(step, choice));
  assert(correctChoices.length === 1, `${label} must have exactly one correct choice`);
  const wrongChoices = step.choices.filter((choice) => !model.validateChoice(step, choice));
  assert(wrongChoices.length >= 2, `${label} needs representative wrong choices`);
  for (const choice of wrongChoices) {
    assert(choice.misconceptionId, `${label} wrong choice ${choice.id} lacks misconceptionId`);
    assert(choice.feedback, `${label} wrong choice ${choice.id} lacks feedback`);
    assert(["low", "high", "opposite", "unit"].includes(choice.relation), `${label} wrong choice ${choice.id} has invalid relation`);
    assert(!/(한 번 더|다시 봐|다시 보기)/.test(choice.label), `${label} has a non-mathematical choice`);
    coverage.add(`misconception:${choice.misconceptionId}`);
  }
  const relations = new Set(wrongChoices.map((choice) => choice.relation));
  if (relations.has("low") || relations.has("high")) {
    assert(relations.has("low"), `${label} lacks a too-small answer`);
    assert(relations.has("high"), `${label} lacks a too-large answer`);
    coverage.add("too-small");
    coverage.add("too-large");
  }
}

function validateSharedProblem(problem, label, model) {
  if (problem.type === "readMl") {
    assert(problem.visual.amount >= 100 && problem.visual.amount <= 900, `${label} readMl range`);
    assert(!problem.prompt.includes(problem.finalText), `${label} title exposes the answer`);
    assert(problem.visual.interval === 100 && problem.visual.max === 1000, `${label} readMl scale contract`);
  } else if (problem.type === "readLiterMl") {
    assert(problem.visual.amount >= 1100 && problem.visual.amount <= 2900, `${label} readLiterMl range`);
    assert(!problem.prompt.includes(problem.finalText), `${label} title exposes the answer`);
    assert(problem.visual.interval === 100 && problem.visual.max === 3000, `${label} readLiterMl scale contract`);
  } else if (problem.type === "compareBottle") {
    const expected = problem.visual.left > problem.visual.right ? "왼쪽 물통" : "오른쪽 물통";
    assert(problem.finalText === expected, `${label} bottle comparison`);
  } else if (problem.type === "addCarryMl") {
    assert(problem.mlSum >= 1000, `${label} must carry 1000mL`);
    const expected = model.fromTotalMl(model.toTotalMl(problem.left) + model.toTotalMl(problem.right));
    assert(problem.final.l === expected.l && problem.final.ml === expected.ml, `${label} add result`);
  } else if (problem.type === "subtractBorrowMl") {
    assert(problem.top.ml < problem.bottom.ml, `${label} must borrow 1L`);
    assert(problem.borrowedTop.l === problem.top.l - 1 && problem.borrowedTop.ml === problem.top.ml + 1000, `${label} borrowed capacity`);
  } else if (problem.type === "orderCheck") {
    assert(problem.fitsOrder === (model.toTotalMl(problem.made) >= model.toTotalMl(problem.order)), `${label} order comparison`);
  } else if (problem.type === "compareKgG" || problem.type === "compareTonKg") {
    const expected = model.toTotalGrams(problem.left) > model.toTotalGrams(problem.right) ? "왼쪽 저울" : "오른쪽 저울";
    assert(problem.finalText === expected, `${label} scale comparison`);
    assert(problem.visual.tilt === "0deg", `${label} scale must be neutral before selection`);
  } else if (problem.type === "balanceMissing") {
    assert(model.toTotalGrams(problem.left) + problem.missing === model.toTotalGrams(problem.target), `${label} balance total`);
    assert(problem.visual.tilt === "0deg", `${label} balance scale must be neutral before selection`);
  }
}

function validatePackageProblem(problem, label, model) {
  const expectedSteps = problem.type === "limit" ? 2 : 3;
  assert(problem.steps.length === expectedSteps, `${label} step count`);
  if (problem.type === "addCarry") {
    assert(problem.gramSum >= 1000, `${label} must carry 1000g`);
    const expected = model.fromTotalGrams(model.toTotalGrams(problem.left) + model.toTotalGrams(problem.right));
    assert(problem.final.kg === expected.kg && problem.final.g === expected.g, `${label} add result`);
  } else if (problem.type === "subtractBorrow") {
    assert(problem.top.g < problem.bottom.g, `${label} must borrow 1kg`);
    assert(problem.borrowedTop.kg === problem.top.kg - 1 && problem.borrowedTop.g === problem.top.g + 1000, `${label} borrowed weight`);
  } else if (problem.type === "limit") {
    const total = model.toTotalGrams(problem.final);
    const limit = model.toTotalGrams(problem.limit);
    assert(problem.fitsLimit === (total <= limit), `${label} limit comparison`);
  }
}

function validateInputCounts(config) {
  const counts = config.typesPerRun.map((type) => {
    if (type === "addCarryMl" || type === "subtractBorrowMl" || type === "addCarry" || type === "subtractBorrow") return 3;
    if (type === "limit") return 2;
    return 1;
  });
  const actual = {
    min: Math.min(...counts),
    median: median(counts),
    average: Number((counts.reduce((sum, value) => sum + value, 0) / counts.length).toFixed(1)),
    max: Math.max(...counts),
  };
  const expectedByLesson = {
    "3-2-5-1": { min: 1, median: 1, average: 1, max: 1 },
    "3-2-5-2": { min: 1, median: 3, average: 2.4, max: 3 },
    "3-2-5-3": { min: 1, median: 1, average: 1, max: 1 },
    "3-2-5-4": { min: 2, median: 3, average: 2.7, max: 3 },
  };
  assert(JSON.stringify(actual) === JSON.stringify(expectedByLesson[config.id]), `${config.id} input counts mismatch: ${JSON.stringify(actual)}`);
  return actual;
}

function validateReward(model) {
  const event = model.pickRewardEvent(model.createRng(17), true);
  const result = model.applyReward({ power: 20, correctFirstTry: 4, specialSeen: false }, event, false);
  assert(result.power > 20, "repair reward must still add power");
  assert(result.correctFirstTry === 4, "repair reward must not add first-try credit");
  assert(model.REWARD_EVENTS.reduce((sum, item) => sum + item.weight, 0) === 10000, "reward weights must total 10000");
}

export function runLesson5ModelQa({ root, lessonFolder, passLabel, argv = process.argv.slice(2) }) {
  const options = parseArgs(argv);
  const { config, model } = loadLessonSourceModel(root, lessonFolder);
  validateReward(model);
  const inputCounts = validateInputCounts(config);
  const typeCounts = new Map();
  const coverage = new Set();
  const samples = [];

  for (let runIndex = 0; runIndex < options.runs; runIndex += 1) {
    const seed = (options.seed + Math.imul(runIndex + 1, 2654435761)) >>> 0;
    const problems = model.generateRun(seed);
    assert(problems.length === model.TOTAL_PROBLEMS, `run ${runIndex + 1} problem count`);
    const perRun = countBy(problems, (problem) => problem.type);
    const expectedPerRun = countBy(config.typesPerRun, (type) => type);
    assert(JSON.stringify(toObject(perRun)) === JSON.stringify(toObject(expectedPerRun)), `run ${runIndex + 1} type distribution`);

    problems.forEach((problem, problemIndex) => {
      const label = `${runIndex + 1}.${problemIndex + 1}`;
      assert(problem.expression.includes(problem.finalText) || problem.expression.includes(problem.steps.at(-1).correct), `${label} expression misses final value`);
      problem.steps.forEach((step) => validateChoiceSet(problem, step, `${label}.${step.id}`, model, coverage));
      if (config.id === "3-2-5-4") validatePackageProblem(problem, label, model);
      else validateSharedProblem(problem, label, model);
      typeCounts.set(problem.type, (typeCounts.get(problem.type) || 0) + 1);
    });

    if (samples.length < 3) {
      samples.push({ seed, firstPrompt: problems[0].prompt, firstType: problems[0].type, types: problems.map((problem) => problem.type) });
    }
  }

  assert(coverage.has("too-small") && coverage.has("too-large"), "too-small and too-large answer coverage required");
  console.log(`${passLabel}: PASS`);
  console.log(JSON.stringify({
    lessonId: config.id,
    runs: options.runs,
    problemsChecked: options.runs * model.TOTAL_PROBLEMS,
    inputCounts,
    typeCounts: toObject(typeCounts),
    misconceptionCount: [...coverage].filter((item) => item.startsWith("misconception:")).length,
    samples,
  }, null, 2));
}
