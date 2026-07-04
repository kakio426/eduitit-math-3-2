#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
const ROOT = process.cwd();
const LESSON_PATH = path.join(ROOT, "3-2-5-2-mathmon-drink-order/index.html");
const MODEL_NAME = "Lesson5DrinkOrderModel";
function parseArgs(argv) { const options = { runs: 10000, seed: 404 }; for (let i = 0; i < argv.length; i += 1) { if (argv[i] === "--runs") { options.runs = Number(argv[++i]); continue; } if (argv[i] === "--seed") { options.seed = Number(argv[++i]); continue; } throw new Error("Unknown option: " + argv[i]); } return options; }
function loadLessonModel() {
  const html = fs.readFileSync(LESSON_PATH, "utf8");
  const configStart = html.indexOf("const LESSON_CONFIG = ");
  const start = html.indexOf("const " + MODEL_NAME + " = (() => {");
  const end = html.indexOf("\n\n    const screens", start);
  if (configStart === -1 || start === -1 || end === -1) throw new Error("model block not found");
  const source = html.slice(configStart, end) + "\n" + MODEL_NAME + ";";
  const context = vm.createContext({ console });
  return vm.runInContext(source, context, { filename: LESSON_PATH });
}
function assert(condition, message) { if (!condition) throw new Error(message); }
function add(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function object(map) { return Object.fromEntries([...map.entries()].sort(([a],[b]) => a.localeCompare(b))); }
function runScenario(model, seed, correctCount) { const rng = model.createRng(seed); let state = { power: 0, correctFirstTry: 0, specialSeen: false }; for (let index = 0; index < model.TOTAL_PROBLEMS; index += 1) { const firstTry = index < correctCount; const event = model.pickRewardEvent(rng, !firstTry); state = model.applyReward(state, event, firstTry); } return model.getResult(state.power, state.correctFirstTry, state.specialSeen); }
function main() { const options = parseArgs(process.argv.slice(2)); const model = loadLessonModel(); const buckets = [0, 6, 8, 10]; const results = new Map(); for (const correct of buckets) { const map = new Map(); for (let run = 0; run < options.runs; run += 1) { const seed = (options.seed + correct * 1000003 + Math.imul(run + 1, 2246822519)) >>> 0; add(map, runScenario(model, seed, correct).id); } results.set(String(correct), object(map)); }
const perfect = results.get('10'); assert(Object.keys(perfect).length >= 2, "perfect bucket should vary by luck"); assert(Object.keys(results.get('0')).length >= 1, "zero bucket should still produce a result"); const families = new Set(model.REWARD_EVENTS.map(event => event.family)); families.add(model.WRONG_REWARD_EVENT.family); assert(families.has('repair'), 'repair family missing'); console.log("LESSON5_DRINK_ORDER_SIMULATION: PASS"); console.log(JSON.stringify({ runs: options.runs, buckets: Object.fromEntries(results), rewardFamilies: [...families].sort() }, null, 2)); }
main();
