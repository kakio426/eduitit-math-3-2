#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON_PATH = path.join(ROOT, "3-2-5-4-mathmon-package-weight", "index.html");
const PROFILES = [0, 6, 8, 10];

function parseArgs(argv) {
  const options = { runs: 20000, seed: 73571 };
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
    throw new Error(`Unknown option: ${arg}`);
  }
  if (!Number.isInteger(options.runs) || options.runs < 1) {
    throw new Error("--runs must be a positive whole number");
  }
  return options;
}

function loadLessonModel() {
  const html = fs.readFileSync(LESSON_PATH, "utf8");
  const start = html.indexOf("const Lesson5PackageWeightModel = (() => {");
  const end = html.indexOf("\n\n    const screens", start);
  if (start === -1 || end === -1) throw new Error("Lesson5PackageWeightModel block not found");
  const source = `${html.slice(start, end)}\nLesson5PackageWeightModel;`;
  return vm.runInContext(source, vm.createContext({ console }), { filename: LESSON_PATH });
}

function simulateOne(model, rng, correctCount) {
  let state = { distance: 0, correctFirstTry: 0, secretSeen: false };
  const families = [];
  for (let index = 0; index < model.TOTAL_PROBLEMS; index += 1) {
    const firstTry = index < correctCount;
    const change = model.pickRouteChange(rng, !firstTry);
    const applied = model.applyRoute(state, change, firstTry);
    state = {
      distance: applied.distance,
      correctFirstTry: applied.correctFirstTry,
      secretSeen: applied.secretSeen
    };
    families.push(change.family);
  }
  const destination = model.getDestination(state.distance, state.correctFirstTry, state.secretSeen);
  return { ...state, destination, families };
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const model = loadLessonModel();
  const summaries = [];
  const familySeen = new Set();

  for (const correctCount of PROFILES) {
    const rng = model.createRng((options.seed + correctCount * 1009) >>> 0);
    const destinationCounts = new Map(model.DESTINATIONS.map((item) => [item.name, 0]));
    let totalDistance = 0;
    let minDistance = Infinity;
    let maxDistance = -Infinity;
    for (let run = 0; run < options.runs; run += 1) {
      const result = simulateOne(model, rng, correctCount);
      destinationCounts.set(result.destination.name, destinationCounts.get(result.destination.name) + 1);
      totalDistance += result.distance;
      minDistance = Math.min(minDistance, result.distance);
      maxDistance = Math.max(maxDistance, result.distance);
      result.families.forEach((family) => familySeen.add(family));
    }
    summaries.push({
      correctCount,
      runs: options.runs,
      averageDistance: Number((totalDistance / options.runs).toFixed(2)),
      distanceRange: `${minDistance}-${maxDistance}`,
      destinationCounts: Object.fromEntries(destinationCounts)
    });
  }

  const requiredFamilies = ["increase", "biggerIncrease", "decrease", "zeroPause", "instantSpecial", "wrongPenalty"];
  const missing = requiredFamilies.filter((family) => !familySeen.has(family));
  if (missing.length) {
    throw new Error(`Missing reward families: ${missing.join(", ")}`);
  }

  console.log("LESSON5_PACKAGE_WEIGHT_REWARD_SIM: PASS");
  console.log(JSON.stringify({
    runsPerProfile: options.runs,
    profiles: summaries,
    familySeen: [...familySeen].sort()
  }, null, 2));
}

main();
