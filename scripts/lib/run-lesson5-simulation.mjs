import { loadLessonSourceModel } from "./load-lesson-source-model.mjs";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function parseArgs(argv) {
  const options = { runs: 10000, seed: 404 };
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

function addCount(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}

function toObject(map) {
  return Object.fromEntries([...map.entries()].sort(([left], [right]) => String(left).localeCompare(String(right))));
}

function simulateOne(model, seed, correctCount) {
  const rng = model.createRng(seed);
  let state = { power: 0, correctFirstTry: 0, specialSeen: false };
  const families = [];
  for (let index = 0; index < model.TOTAL_PROBLEMS; index += 1) {
    const firstTry = index < correctCount;
    const event = model.pickRewardEvent(rng, !firstTry);
    state = model.applyReward(state, event, firstTry);
    families.push(event.family);
  }
  return { state, result: model.getResult(state.power, state.correctFirstTry, state.specialSeen), families };
}

export function runLesson5Simulation({ root, lessonFolder, passLabel, argv = process.argv.slice(2) }) {
  const options = parseArgs(argv);
  const { config, model } = loadLessonSourceModel(root, lessonFolder);
  const profiles = [0, 6, 8, 10];
  const familySeen = new Set();
  const summaries = [];

  for (const correctCount of profiles) {
    const resultCounts = new Map();
    let powerTotal = 0;
    let minPower = Infinity;
    let maxPower = -Infinity;
    for (let runIndex = 0; runIndex < options.runs; runIndex += 1) {
      const seed = (options.seed + correctCount * 1000003 + Math.imul(runIndex + 1, 2246822519)) >>> 0;
      const simulated = simulateOne(model, seed, correctCount);
      addCount(resultCounts, simulated.result.id);
      simulated.families.forEach((family) => familySeen.add(family));
      powerTotal += simulated.state.power;
      minPower = Math.min(minPower, simulated.state.power);
      maxPower = Math.max(maxPower, simulated.state.power);
    }
    summaries.push({
      correctCount,
      resultCounts: toObject(resultCounts),
      averagePower: Number((powerTotal / options.runs).toFixed(2)),
      powerRange: [minPower, maxPower],
    });
  }

  const expectedFamilies = new Set([...config.rewardEvents.map((event) => event.family), config.wrongEvent.family]);
  for (const family of expectedFamilies) assert(familySeen.has(family), `reward family not sampled: ${family}`);
  assert(Object.keys(summaries.find((item) => item.correctCount === 10).resultCounts).length >= 2, "perfect result must still vary with rewards");

  console.log(`${passLabel}: PASS`);
  console.log(JSON.stringify({
    lessonId: config.id,
    runsPerProfile: options.runs,
    profiles: summaries,
    rewardFamilies: [...familySeen].sort(),
  }, null, 2));
}
