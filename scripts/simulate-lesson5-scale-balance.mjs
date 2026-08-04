#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "_lessons", "3-2-5-3-mathmon-scale-balance");
const MODEL_PATH = path.join(ROOT, "_lessons", "3-2-5-1-mathmon-water-fill", "model.js");
const MODEL_NAME = "Lesson5WaterFillModel";
function parseArgs(argv) { const options = { runs: 10000, seed: 404 }; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--runs") { options.runs = Number(argv[++i]); continue; } if (argv[i] === "--seed") { options.seed = Number(argv[++i]); continue; } throw new Error("Unknown option: " + argv[i]); } return options; }
function loadLessonModel() {
  const config = JSON.parse(fs.readFileSync(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
  const source = fs.readFileSync(MODEL_PATH, "utf8");
  const context = vm.createContext({ console, LESSON_CONFIG: config, Math });
  return vm.runInContext(source + "\n" + MODEL_NAME + ";", context, { filename: MODEL_PATH });
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function add(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function object(map) { return Object.fromEntries([...map.entries()].sort(([a],[b]) => a.localeCompare(b))); }
function runScenario(model, seed, correctCount) { const rng = model.createRng(seed); let state = { power: 0, correctFirstTry: 0, specialSeen: false }; for (let index = 0; index < model.TOTAL_PROBLEMS; index += 1) { const firstTry = index < correctCount; const event = model.pickRewardEvent(rng, !firstTry); const rewardState = model.applyReward(state, event); state = { ...rewardState, correctFirstTry: state.correctFirstTry + (firstTry ? 1 : 0) }; } return model.getResult(state.power, state.correctFirstTry, state.specialSeen); }
function main() { const options = parseArgs(process.argv.slice(2)); const model = loadLessonModel(); const buckets = [0, 6, 8, 10]; const results = new Map(); for (const correct of buckets) { const map = new Map(); for (let run = 0; run < options.runs; run += 1) { const seed = (options.seed + correct * 1000003 + Math.imul(run + 1, 2246822519)) >>> 0; add(map, runScenario(model, seed, correct).id); } results.set(String(correct), object(map)); }
const perfect = results.get('10'); assert(Object.keys(perfect).length >= 2, "perfect bucket should vary by luck"); assert(Object.keys(results.get('0')).length >= 1, "zero bucket should still produce a result"); const families = new Set(model.REWARD_EVENTS.map(event => event.family)); families.add(model.WRONG_REWARD_EVENT.family); assert(families.has('repair'), 'repair family missing'); console.log("LESSON5_SCALE_BALANCE_SIMULATION: PASS"); console.log(JSON.stringify({ runs: options.runs, buckets: Object.fromEntries(results), rewardFamilies: [...families].sort() }, null, 2)); }
main();
