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
const EXPECTED_THRESHOLDS = [[0, 0], [15, 2], [35, 4], [55, 6], [78, 8], [100, 1]];
const EXPECTED_REWARD_EVENTS = [
  ["normal", 6400, 6, 10],
  ["loss", 1500, -5, -2],
  ["mega", 1200, 14, 22],
  ["jackpot", 500, 30, 30],
  ["empty", 380, 0, 0],
  ["special", 20, 100, 100],
];
const QA_RUN_COUNT = 64;
const SHARED_VIEW_SOURCE = readFileSync(path.join(ROOT, "_lessons", "_shared", "unit6-data", "view.js"), "utf8");

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
  assert(config.reward?.mode === "stage-reveal", `${folder}: 보상 흐름이 Stage-Reveal이 아닙니다.`);
  assert(config.reward?.standard === "mathmon-unified-reward-v1", `${folder}: 공용 보상 기준이 선언되지 않았습니다.`);
  assert(config.reward?.fairness?.emptyKeepsProgress === true, `${folder}: 빈 보상 누적 유지 계약이 없습니다.`);
  assert(config.reward?.fairness?.lossCapAtCommonGainMin === true, `${folder}: 감소 보상 상한 계약이 없습니다.`);
  assert(config.imageAssets?.rewardClosed === "reward-event-closed-generated.webp", `${folder}: 닫힌 상자 전용 이미지가 연결되지 않았습니다.`);
  assert(config.reward?.stateImageSet?.count === 7, `${folder}: 닫힘 포함 보상 상태는 7개여야 합니다.`);

  for (let runIndex = 0; runIndex < QA_RUN_COUNT; runIndex += 1) {
    const problems = model.generateRun(20260723 + runIndex);
    assert(problems.length === 10, `${folder}: seed ${runIndex + 1} 문제는 10개여야 합니다.`);
    for (const [problemIndex, problem] of problems.entries()) {
      assert(problem.steps.length >= 1, `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번에 단계가 없습니다.`);
      for (const step of problem.steps) {
        const ids = step.choices.map((choice) => String(choice.id));
        const labels = step.choices.map((choice) => String(choice.label));
        const correctChoices = step.choices.filter((choice) => String(choice.id) === String(step.answerChoiceId));
        const misconceptionCorrect = step.choices.filter((choice) => choice.misconceptionId === "correct");
        const wrongChoices = step.choices.filter((choice) => String(choice.id) !== String(step.answerChoiceId));
        assert(new Set(ids).size === ids.length, `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 선택지 id가 겹칩니다.`);
        assert(new Set(labels).size === labels.length, `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 선택지 문구가 겹칩니다.`);
        assert(correctChoices.length === 1, `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 정답이 하나가 아닙니다.`);
        assert(misconceptionCorrect.length === 1, `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 정답 오개념 표지가 하나가 아닙니다.`);
        assert(
          misconceptionCorrect[0].id === step.answerChoiceId,
          `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 오답이 correct로 분류됐습니다.`,
        );
        assert(
          wrongChoices.every((choice) => choice.misconceptionId !== "correct" && String(choice.feedback || "").trim()),
          `${folder}: seed ${runIndex + 1} ${problemIndex + 1}번 오답 분류 또는 피드백이 비었습니다.`,
        );
      }
    }
  }

  const eventIds = config.rewardEvents.map((event) => event.id);
  assert(
    JSON.stringify(eventIds) === JSON.stringify(EXPECTED_REWARD_EVENTS.map(([id]) => id)),
    `${folder}: 보상 사건 순서가 공용 기준과 다릅니다.`,
  );
  assert(config.rewardEvents.reduce((sum, event) => sum + event.weight, 0) === 10000, `${folder}: 보상 확률 합이 10000이 아닙니다.`);
  assert(config.wrongEvent.min === -6 && config.wrongEvent.max === -3, `${folder}: 오답 손해 범위가 다릅니다.`);

  let cumulativeWeight = 0;
  for (const [index, event] of config.rewardEvents.entries()) {
    const [id, weight, min, max] = EXPECTED_REWARD_EVENTS[index];
    assert(
      event.id === id && event.weight === weight && event.min === min && event.max === max,
      `${folder}: ${id} 보상 weight/min/max가 다릅니다.`,
    );
    const values = [(cumulativeWeight + .5) / 10000, 0];
    const picked = model.pickRewardEvent(() => values.shift() ?? 0, false);
    assert(picked.id === id && picked.amount === min, `${folder}: ${id} 보상 경계 선택이 잘못되었습니다.`);
    cumulativeWeight += weight;
    const patch = model.applyReward({ power: 40, specialSeen: false }, { ...event, amount: event.min });
    assert(JSON.stringify(Object.keys(patch).sort()) === JSON.stringify(["power", "specialSeen"]), `${folder}: applyReward()는 power와 specialSeen만 반환해야 합니다.`);
  }
  const wrongMin = model.pickRewardEvent(() => 0, true);
  const wrongMax = model.pickRewardEvent(() => .999999, true);
  assert(wrongMin.amount === -6 && wrongMax.amount === -3, `${folder}: 오답 손해 경계값이 다릅니다.`);
  assert(model.applyReward({ power: 40, specialSeen: false }, { amount: 0 }).power === 40, `${folder}: 빈 보상이 누적값을 바꿉니다.`);
  assert(model.applyReward({ power: 0, specialSeen: false }, { amount: -5 }).power === 0, `${folder}: 누적값이 0 아래로 내려갑니다.`);
  assert(model.applyReward({ power: 97, specialSeen: false }, { amount: 10 }).power === 100, `${folder}: 누적값이 100을 넘습니다.`);
  assert(model.applyReward({ power: 0, specialSeen: false }, { amount: 30 }).power === 30, `${folder}: +30 보상이 임의 문턱으로 점프합니다.`);
  const specialPatch = model.applyReward({ power: 40, specialSeen: false }, { amount: 100, special: true });
  assert(specialPatch.power === 100 && specialPatch.specialSeen, `${folder}: 특별 보상이 100/특별 상태를 만들지 못합니다.`);

  EXPECTED_THRESHOLDS.slice(0, -1).forEach(([power, correct], index) => {
    const result = model.getResult(power, correct, false);
    assert(result.id === config.results[index].id, `${folder}: ${power}/${correct} 결과 문턱이 다릅니다.`);
    if (index > 0) {
      assert(model.getResult(power - 1, correct, false).id !== result.id, `${folder}: ${result.id} 힘 문턱 아래에서 결과가 열립니다.`);
      assert(model.getResult(power, correct - 1, false).id !== result.id, `${folder}: ${result.id} 정답 수 문턱 아래에서 결과가 열립니다.`);
    }
  });
  assert(model.getResult(0, 0, false).id === config.results[0].id, `${folder}: 힘 0에서 첫 결과가 나오지 않습니다.`);
  assert(model.getResult(100, 1, false).needsSpecial !== true, `${folder}: 특별 사건 없이 특별 결과가 열립니다.`);
  assert(model.getResult(100, 0, true).needsSpecial !== true, `${folder}: 정답 0개에서 특별 결과가 열립니다.`);
  assert(model.getResult(100, 1, true).needsSpecial === true, `${folder}: 특별 결과가 열리지 않습니다.`);

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
    assert(problem.prompt === "도장 수를 차례로 골라요.", `${folder}: 문제 제목이 목표 수를 되풀이합니다.`);
  }
  assert(SHARED_VIEW_SOURCE.includes('`?×10 + 작은 도장 = ${problem.visual.value}`'), `${folder}: 첫 화면 식에는 고를 물음표가 하나만 있어야 합니다.`);
  assert(SHARED_VIEW_SOURCE.includes('`${problem.visual.big}×10 + ?×1 = ${problem.visual.value}`'), `${folder}: 둘째 단계 식에는 고를 물음표가 하나만 있어야 합니다.`);
  assert(!SHARED_VIEW_SOURCE.includes('"?×10 + ?×1 = ?"'), `${folder}: 물음표 세 개짜리 식이 남아 있습니다.`);
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

console.log(`UNIT6_DATA_MODEL: PASS (${LESSONS.length} lessons, ${QA_RUN_COUNT} bounded runs each)`);
