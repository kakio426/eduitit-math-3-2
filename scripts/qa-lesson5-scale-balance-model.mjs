#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON_PATH = path.join(ROOT, "3-2-5-3-mathmon-scale-balance/index.html");
const MODEL_NAME = "Lesson5ScaleBalanceModel";

function parseArgs(argv) { const options = { runs: 10000, seed: 20260704 }; for (let index = 0; index < argv.length; index += 1) { const arg = argv[index]; if (arg === "--runs") { options.runs = Number(argv[++index]); continue; } if (arg === "--seed") { options.seed = Number(argv[++index]); continue; } throw new Error("Unknown option: " + arg); } if (!Number.isInteger(options.runs) || options.runs < 1) throw new Error("--runs must be a positive whole number"); return options; }
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
function addCount(map, key) { map.set(key, (map.get(key) || 0) + 1); }
function toObject(map) { return Object.fromEntries([...map.entries()].sort(([a],[b]) => a.localeCompare(b))); }
function validateStep(step, problem, label, model) { assert(step.choices.includes(step.correct), label + " step lacks correct choice"); assert(new Set(step.choices).size === step.choices.length, label + " duplicate choices"); assert(step.choices.length >= 3, label + " needs at least 3 choices"); assert(model.validateChoice(step, step.correct), label + " rejects correct choice"); const wrong = step.choices.find(choice => choice !== step.correct); assert(wrong && !model.validateChoice(step, wrong), label + " accepts wrong choice"); }
function validateProblem(problem, index, model) { assert(problem.steps.length >= 1 && problem.steps.length <= 3, index + " invalid step count"); assert(problem.expression.includes(problem.finalText) || problem.expression.includes(problem.steps[problem.steps.length - 1].correct), index + " expression misses final value"); for (const step of problem.steps) validateStep(step, problem, index + "." + step.id, model);
  if (problem.type === "readMl") { assert(problem.visual.amount >= 100 && problem.visual.amount <= 900 && problem.visual.amount % 100 === 0, index + " readMl range"); }
  if (problem.type === "readLiterMl") { assert(problem.visual.amount >= 1100 && problem.visual.amount <= 2900 && problem.visual.amount % 100 === 0, index + " readLiterMl range"); }
  if (problem.type === "compareBottle") { assert(Math.abs(problem.visual.left - problem.visual.right) >= 100, index + " compareBottle diff"); const expected = problem.visual.left > problem.visual.right ? "왼쪽 물통" : "오른쪽 물통"; assert(problem.finalText === expected, index + " compareBottle answer"); }
  if (problem.type === "addCarryMl") { assert(problem.mlSum >= 1000, index + " add needs carry"); const expected = model.fromTotalMl(model.toTotalMl(problem.left) + model.toTotalMl(problem.right)); assert(problem.final.l === expected.l && problem.final.ml === expected.ml, index + " add final"); }
  if (problem.type === "subtractBorrowMl") { assert(problem.top.ml < problem.bottom.ml, index + " subtract needs borrow"); assert(problem.borrowedTop.l === problem.top.l - 1 && problem.borrowedTop.ml === problem.top.ml + 1000, index + " borrowed top"); const expected = model.fromTotalMl(model.toTotalMl(problem.top) - model.toTotalMl(problem.bottom)); assert(problem.final.l === expected.l && problem.final.ml === expected.ml, index + " subtract final"); }
  if (problem.type === "orderCheck") { const made = model.toTotalMl(problem.made); const order = model.toTotalMl(problem.order); assert(problem.fitsOrder === (made >= order), index + " order comparison"); }
  if (problem.type === "compareKgG") { const expected = model.toTotalGrams(problem.left) > model.toTotalGrams(problem.right) ? "왼쪽 저울" : "오른쪽 저울"; assert(problem.finalText === expected, index + " compare kg answer"); }
  if (problem.type === "balanceMissing") { assert(problem.missing >= 100 && problem.missing <= 800, index + " missing range"); assert(model.toTotalGrams(problem.left) + problem.missing === model.toTotalGrams(problem.target), index + " balance total"); }
  if (problem.type === "compareTonKg") { const expected = model.toTotalGrams(problem.left) > model.toTotalGrams(problem.right) ? "왼쪽 저울" : "오른쪽 저울"; assert(problem.finalText === expected, index + " ton kg answer"); }
}
function validateRun(run, model, runIndex, typeCounts) { assert(run.length === model.TOTAL_PROBLEMS, "run " + runIndex + " must have 10 problems"); const perRun = new Map(); run.forEach((problem, index) => { validateProblem(problem, runIndex + "." + (index + 1), model); addCount(typeCounts, problem.type); addCount(perRun, problem.type); }); for (const type of model.TYPES_PER_RUN) assert((perRun.get(type) || 0) === model.TYPES_PER_RUN.filter(item => item === type).length, "run " + runIndex + " type count mismatch for " + type); }
function validateReward(model) { const families = new Set(model.REWARD_EVENTS.map(event => event.family)); families.add(model.WRONG_REWARD_EVENT.family); assert(families.has("repair"), "missing repair reward"); const event = model.pickRewardEvent(model.createRng(17), true); const result = model.applyReward({ power: 20, correctFirstTry: 4, specialSeen: false }, event, false); assert(result.power > 20, "repair must still add small power"); assert(result.correctFirstTry === 4, "repair must not add first try"); }
function main() { const options = parseArgs(process.argv.slice(2)); const model = loadLessonModel(); validateReward(model); const typeCounts = new Map(); const sample = []; for (let run = 0; run < options.runs; run += 1) { const seed = (options.seed + Math.imul(run + 1, 2654435761)) >>> 0; const generated = model.generateRun(seed); validateRun(generated, model, run + 1, typeCounts); if (sample.length < 3) sample.push({ seed, firstPrompt: generated[0].prompt, firstType: generated[0].type, types: generated.map(problem => problem.type) }); } console.log("LESSON5_SCALE_BALANCE_MODEL_QA: PASS"); console.log(JSON.stringify({ runs: options.runs, problemsChecked: options.runs * model.TOTAL_PROBLEMS, typeCounts: toObject(typeCounts), samples: sample }, null, 2)); }
main();
