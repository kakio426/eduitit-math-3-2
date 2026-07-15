#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON_DIR = path.join(ROOT, "_lessons/3-2-2-1-mathmon-divide-farm");
const RUNS = Number(process.env.FARM_SIM_RUNS || 50000);
const SEED = Number(process.env.FARM_SIM_SEED || 3221);
const TIER_ORDER = ["seed", "sprout", "garden", "farm", "bigfarm", "rainbow"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadModel() {
  const LESSON_CONFIG = JSON.parse(fs.readFileSync(path.join(LESSON_DIR, "lesson.json"), "utf8"));
  const source = `${fs.readFileSync(path.join(LESSON_DIR, "model.js"), "utf8")}\nLesson2DivideFarmModel;`;
  return vm.runInContext(source, vm.createContext({ LESSON_CONFIG }), { filename: "model.js" });
}

function runRound(model, seed, correctCount) {
  const rng = model.createRng(seed);
  let state = { power: 0, correctFirstTry: 0, specialSeen: false };
  for (let index = 0; index < model.TOTAL_PROBLEMS; index += 1) {
    const firstTry = index < correctCount;
    if (firstTry) state.correctFirstTry += 1;
    const event = model.pickRewardEvent(rng, !firstTry);
    state = { ...state, ...model.applyReward(state, event, firstTry) };
  }
  const result = model.getResult(state.power, state.correctFirstTry, state.specialSeen);
  return { result, power: state.power };
}

function simulate(model, correctCount) {
  const counts = Object.fromEntries(TIER_ORDER.map((id) => [id, 0]));
  let totalTier = 0;
  let totalPower = 0;
  for (let run = 0; run < RUNS; run += 1) {
    const seed = (SEED + Math.imul(correctCount + 1, 1000003) + Math.imul(run + 1, 2246822519)) >>> 0;
    const { result, power } = runRound(model, seed, correctCount);
    counts[result.id] += 1;
    totalTier += TIER_ORDER.indexOf(result.id);
    totalPower += power;
  }
  return {
    correctCount,
    counts,
    averageTier: totalTier / RUNS,
    averagePower: totalPower / RUNS,
  };
}

function percent(profile, ...tiers) {
  return tiers.reduce((total, tier) => total + profile.counts[tier], 0) / RUNS * 100;
}

const model = loadModel();
assert(RUNS >= 50000, "FARM_SIM_RUNS must be at least 50000");
const profiles = Array.from({ length: 11 }, (_, correctCount) => simulate(model, correctCount));

assert(percent(profiles[8], "seed") < 5, `8/10 seed is ${percent(profiles[8], "seed").toFixed(3)}%`);
assert(
  percent(profiles[10], "seed", "sprout") < 3,
  `10/10 seed+sprout is ${percent(profiles[10], "seed", "sprout").toFixed(3)}%`,
);
const perfectTop = percent(profiles[10], "bigfarm", "rainbow");
assert(perfectTop < 100, "10/10 must not guarantee bigfarm or rainbow");
const perfectRainbow = percent(profiles[10], "rainbow");
assert(perfectRainbow >= 1 && perfectRainbow <= 3, `10/10 rainbow is ${perfectRainbow.toFixed(3)}%`);
for (let index = 1; index < profiles.length; index += 1) {
  assert(
    profiles[index].averageTier > profiles[index - 1].averageTier,
    `average tier did not rise from ${index - 1}/10 to ${index}/10`,
  );
}

console.log("LESSON2_FARM_GROWTH_SIMULATION: PASS");
console.log(JSON.stringify({ runsPerProfile: RUNS, profiles }, null, 2));
