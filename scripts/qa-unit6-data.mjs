#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import { runInNewContext } from "node:vm";

const ROOT = process.cwd();
const LESSONS = [
  "3-2-6-1-mathmon-data-rangers",
  "3-2-6-2-mathmon-picture-decoder",
  "3-2-6-3-mathmon-picture-stamp",
  "3-2-6-4-mathmon-data-detective",
];
const EXPECTED_THRESHOLDS = [[0, 0], [19, 2], [39, 4], [61, 6], [83, 8]];
const EXPECTED_REWARD_FAMILIES = ["normal", "loss", "mega", "complete", "empty", "rainbow"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function loadLesson(folder) {
  const sourceDir = path.join(ROOT, "_lessons", folder);
  const config = JSON.parse(readFileSync(path.join(sourceDir, "lesson.json"), "utf8"));
  const modelPath = path.resolve(sourceDir, config.sourceFiles?.model || "model.js");
  const source = readFileSync(modelPath, "utf8");
  const sandbox = { LESSON_CONFIG: structuredClone(config), Math, Date };
  runInNewContext(`${source}\n;globalThis.__model = ${config.modelName};`, sandbox, {
    timeout: 1000,
    filename: modelPath,
  });
  return { config, model: sandbox.__model };
}

function checkCommon(folder, config, model) {
  const first = model.generateRun(20260723);
  const second = model.generateRun(20260723);
  assert(JSON.stringify(first) === JSON.stringify(second), `${folder}: 고정 seed가 재현되지 않습니다.`);
  assert(first.length === 10, `${folder}: 문제는 10개여야 합니다.`);
  assert(config.scoreboard?.enabled === false, `${folder}: 랭킹은 비활성화되어야 합니다.`);

  for (const [problemIndex, problem] of first.entries()) {
    assert(problem.steps.length >= 1, `${folder}: ${problemIndex + 1}번에 단계가 없습니다.`);
    for (const step of problem.steps) {
      const ids = step.choices.map((choice) => String(choice.id));
      const labels = step.choices.map((choice) => String(choice.label));
      assert(new Set(ids).size === ids.length, `${folder}: ${problemIndex + 1}번 선택지 id가 겹칩니다.`);
      assert(new Set(labels).size === labels.length, `${folder}: ${problemIndex + 1}번 선택지 문구가 겹칩니다.`);
      assert(ids.filter((id) => id === String(step.answerChoiceId)).length === 1, `${folder}: ${problemIndex + 1}번 정답이 하나가 아닙니다.`);
      assert(step.choices.some((choice) => choice.misconceptionId !== "correct"), `${folder}: ${problemIndex + 1}번에 대표 오개념이 없습니다.`);
    }
  }

  const families = config.rewardEvents.map((event) => event.family);
  assert(JSON.stringify(families) === JSON.stringify(EXPECTED_REWARD_FAMILIES), `${folder}: 보상 가족 순서가 다릅니다.`);
  assert(config.rewardEvents.reduce((sum, event) => sum + event.weight, 0) === 10000, `${folder}: 보상 확률 합이 10000이 아닙니다.`);
  assert(config.wrongEvent.min === -18 && config.wrongEvent.max === -8, `${folder}: 오답 손해 범위가 다릅니다.`);

  for (const event of config.rewardEvents) {
    const patch = model.applyReward({ power: 40, specialSeen: false }, { ...event, amount: event.min });
    assert(JSON.stringify(Object.keys(patch).sort()) === JSON.stringify(["power", "specialSeen"]), `${folder}: applyReward()는 power와 specialSeen만 반환해야 합니다.`);
    if (event.family === "complete") assert(patch.power >= 61, `${folder}: 한 번에 도약 보상이 61에 닿지 않습니다.`);
    if (event.family === "rainbow") assert(patch.power === 100 && patch.specialSeen, `${folder}: 무지개 보상이 특별 결과를 열지 못합니다.`);
  }

  EXPECTED_THRESHOLDS.forEach(([power, correct], index) => {
    const result = model.getResult(power, correct, false);
    assert(result.id === config.results[index].id, `${folder}: ${power}/${correct} 결과 문턱이 다릅니다.`);
  });
  assert(model.getResult(0, 0, false).id === config.results[0].id, `${folder}: 힘 0에서 첫 결과가 나오지 않습니다.`);
  assert(model.getResult(100, 10, true).needsSpecial === true, `${folder}: 특별 결과가 열리지 않습니다.`);

  return first;
}

function checkCensus(folder, problems) {
  const targets = problems.map((problem) => {
    const target = problem.visual.rows.find((row) => row.id === problem.visual.targetId);
    const total = problem.visual.rows.reduce((sum, row) => sum + row.count, 0);
    assert(target.count >= 4 && target.count <= 12, `${folder}: 강조 자료 수가 4~12가 아닙니다.`);
    assert(total >= 12 && total <= 24, `${folder}: 전체 자료 수가 12~24가 아닙니다.`);
    const ids = new Set(problem.steps[0].choices.map((choice) => choice.misconceptionId));
    assert(ids.has("one-less") && ids.has("one-more"), `${folder}: 하나 적게/많게 오개념이 없습니다.`);
    return target.count;
  });
  assert(Math.min(...targets) === 4 && Math.max(...targets) === 12, `${folder}: 목표 수 범위 끝값이 빠졌습니다.`);
}

function checkDecoder(folder, problems) {
  for (const problem of problems) {
    const { unit, iconCount, answer } = problem.visual;
    assert([2, 5, 10].includes(unit), `${folder}: 그림 단위가 2·5·10이 아닙니다.`);
    assert(iconCount >= 2 && iconCount <= 8, `${folder}: 그림 수가 2~8이 아닙니다.`);
    assert(answer === unit * iconCount && answer <= 80, `${folder}: 전체 값 계산이 잘못되었습니다.`);
    assert(problem.steps[0].choices.some((choice) => choice.misconceptionId === "ignored-unit"), `${folder}: 단위를 빼먹는 오개념이 없습니다.`);
  }
}

function checkStamp(folder, problems) {
  const expected = [10, 14, 21, 26, 30, 37, 42, 48, 53, 59].sort((a, b) => a - b);
  const actual = problems.map((problem) => problem.visual.value).sort((a, b) => a - b);
  assert(JSON.stringify(actual) === JSON.stringify(expected), `${folder}: 약속한 열 값이 아닙니다.`);
  for (const problem of problems) {
    assert(problem.steps.length === 2, `${folder}: 도장 문제는 두 단계여야 합니다.`);
    const { value, big, small } = problem.visual;
    assert(big * 10 + small === value, `${folder}: 큰 도장×10+작은 도장 항등식이 깨졌습니다.`);
    assert(problem.finalExpression === `${big}×10 + ${small}×1 = ${value}`, `${folder}: 마지막 완성식이 다릅니다.`);
  }
}

function checkDetective(folder, problems) {
  const counts = problems.reduce((map, problem) => {
    map[problem.type] = (map[problem.type] || 0) + 1;
    return map;
  }, {});
  assert(counts.maximum === 3 && counts.minimum === 3 && counts.difference === 4, `${folder}: 큰 값 3·작은 값 3·차이 4 분포가 아닙니다.`);
  assert(problems.every((problem) => [2, 5].includes(problem.visual.unit)), `${folder}: 그림 단위가 2 또는 5가 아닙니다.`);
  const differenceMisconceptions = new Set();
  for (const problem of problems.filter((item) => item.type === "difference")) {
    const ids = new Set(problem.steps[0].choices.map((choice) => choice.misconceptionId));
    assert(ids.has("ignored-unit") && ids.has("high-value"), `${folder}: 차이 대표 오개념이 빠졌습니다.`);
    ids.forEach((id) => differenceMisconceptions.add(id));
  }
  assert(
    differenceMisconceptions.has("one-unit-less") && differenceMisconceptions.has("one-unit-more"),
    `${folder}: 차이를 한 단위 적게/많게 보는 오개념이 모두 필요합니다.`,
  );
}

for (const folder of LESSONS) {
  const { config, model } = loadLesson(folder);
  const problems = checkCommon(folder, config, model);
  if (config.workbench.type === "census") checkCensus(folder, problems);
  if (config.workbench.type === "picture-decoder") checkDecoder(folder, problems);
  if (config.workbench.type === "picture-stamp") checkStamp(folder, problems);
  if (config.workbench.type === "data-detective") checkDetective(folder, problems);
  console.log(`UNIT6_DATA_MODEL: PASS (${folder})`);
}

console.log(`UNIT6_DATA_MODEL: PASS (${LESSONS.length} lessons)`);
