const Lesson6DataLabModel = (() => {
  const TOTAL_PROBLEMS = 10;
  const MIN_POWER = 0;
  const MAX_POWER = 100;
  const RESULT_TIERS = LESSON_CONFIG.results;
  const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
  const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;
  const CATEGORIES = [
    { id: "star", label: "별 딱지", mark: "★", color: "#ffd35c" },
    { id: "heart", label: "하트 딱지", mark: "♥", color: "#ff7f9f" },
    { id: "moon", label: "달 딱지", mark: "●", color: "#79c9ff" },
  ];
  const DETECTIVE_LABELS = ["별", "하트", "달", "꽃"];

  function createRng(seed = 12345) {
    let value = seed >>> 0;
    return function rng() {
      value = (value + 0x6d2b79f5) >>> 0;
      let mixed = value;
      mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomInt(rng, min, max) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  function shuffle(items, rng) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(rng() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function uniqueValues(values, fallbackStart = 1) {
    const output = [];
    const seen = new Set();
    for (const value of values) {
      if (value == null || value === "" || seen.has(String(value))) continue;
      seen.add(String(value));
      output.push(value);
    }
    let fallback = fallbackStart;
    while (output.length < 4) {
      if (!seen.has(String(fallback))) {
        seen.add(String(fallback));
        output.push(fallback);
      }
      fallback += 1;
    }
    return output.slice(0, 4);
  }

  function makeChoices(values, answer, misconceptionIds, feedbackFor, rng, labelFor = String) {
    const normalized = uniqueValues(values, typeof answer === "number" ? Math.max(0, answer - 3) : 1);
    const choices = normalized.map((value, index) => {
      const misconceptionId = String(value) === String(answer)
        ? "correct"
        : (misconceptionIds[index] || "other");
      return {
        id: `choice-${String(value).replace(/\s+/g, "-")}`,
        value,
        label: labelFor(value),
        misconceptionId,
        feedback: String(value) === String(answer) ? "" : feedbackFor(value, misconceptionId),
      };
    });
    return shuffle(choices, rng);
  }

  function makeStep({
    id,
    label,
    instruction,
    answer,
    choices,
    correctText,
    reveal,
    advance = { mode: "complete" },
  }) {
    const correctChoice = choices.find((choice) => String(choice.value) === String(answer));
    return {
      id,
      label,
      instruction,
      answer,
      answerChoiceId: correctChoice.id,
      choices,
      correctText,
      reveal,
      advance,
    };
  }

  function makeCensusProblem(rng, serial, targetCount) {
    const categories = shuffle(CATEGORIES, rng).map((category) => ({ ...category }));
    const targetIndex = serial % categories.length;
    const otherA = clamp(targetCount + (serial % 2 === 0 ? -2 : 2), 3, 10);
    let otherB = clamp(12 + (serial % 3) - targetCount, 3, 10);
    if (otherB === targetCount || otherB === otherA) otherB = clamp(otherB + 2, 3, 11);
    const counts = [otherA, otherB, clamp(18 - otherA - otherB, 3, 10)];
    counts[targetIndex] = targetCount;
    const remainingIndices = [0, 1, 2].filter((index) => index !== targetIndex);
    const totalWithoutTarget = counts[remainingIndices[0]] + counts[remainingIndices[1]];
    if (targetCount + totalWithoutTarget < 12) counts[remainingIndices[0]] += 12 - (targetCount + totalWithoutTarget);
    if (targetCount + counts[remainingIndices[0]] + counts[remainingIndices[1]] > 24) {
      counts[remainingIndices[1]] = Math.max(3, 24 - targetCount - counts[remainingIndices[0]]);
    }
    const rows = categories.map((category, index) => ({ ...category, count: counts[index] }));
    const target = rows[targetIndex];
    const adjacent = rows[(targetIndex + 1) % rows.length];
    const values = uniqueValues([
      target.count,
      Math.max(1, target.count - 1),
      target.count + 1,
      adjacent.count,
    ], 2);
    const choices = makeChoices(
      values,
      target.count,
      ["correct", "one-less", "one-more", "neighbor-count"],
      (value) => {
        if (value < target.count) return `${target.label}가 ${target.count - value}개 남았어요.`;
        if (value > target.count) return `${target.label}를 ${value - target.count}개 더 셌어요.`;
        return `${adjacent.label} 줄을 센 것 같아요.`;
      },
      rng,
      (value) => `${value}`,
    );
    return {
      id: `census-${serial}`,
      type: "census",
      kind: "자료 세기",
      prompt: `${target.label}는 몇 개일까요?`,
      finalExpression: `${target.label} ${target.count}개`,
      visual: { kind: "census", rows, targetId: target.id },
      steps: [
        makeStep({
          id: "count",
          label: "표 칸",
          instruction: `반짝이는 ${target.label}를 세어요.`,
          answer: target.count,
          choices,
          correctText: `${target.count}개가 표 칸에 들어갔어요.`,
          reveal: `${target.count}`,
        }),
      ],
    };
  }

  function makeDecoderProblem(rng, serial, unit, iconCount) {
    const answer = unit * iconCount;
    const values = uniqueValues([answer, iconCount, answer - unit, answer + unit], 2);
    const choices = makeChoices(
      values,
      answer,
      ["correct", "ignored-unit", "one-unit-less", "one-unit-more"],
      (value, misconceptionId) => {
        if (misconceptionId === "ignored-unit") return `그림마다 ${unit}씩 있어요.`;
        if (value < answer) return "그림 하나를 빼먹었어요.";
        return "그림 하나를 더 셌어요.";
      },
      rng,
      (value) => `${value}`,
    );
    return {
      id: `decoder-${serial}`,
      type: "decoder",
      kind: "그림 단위 읽기",
      prompt: `그림 ${iconCount}개는 모두 얼마일까요?`,
      finalExpression: `${unit} × ${iconCount} = ${answer}`,
      visual: { kind: "decoder", unit, iconCount, answer },
      steps: [
        makeStep({
          id: "total",
          label: "모두",
          instruction: `그림 하나는 ${unit}만큼이에요.`,
          answer,
          choices,
          correctText: `모두 합친 값 = ${answer}`,
          reveal: `${answer}`,
        }),
      ],
    };
  }

  function digitChoices(answer, alternate, rng, kind) {
    const values = uniqueValues([answer, alternate, Math.max(0, answer - 1), answer + 1], 0);
    return makeChoices(
      values,
      answer,
      ["correct", "swapped-place", "one-less", "one-more"],
      (value, misconceptionId) => {
        if (misconceptionId === "swapped-place") return "십의 자리와 일의 자리를 다시 봐요.";
        if (value < answer) return `${kind}이 ${answer - value}개 모자라요.`;
        return `${kind}이 ${value - answer}개 많아요.`;
      },
      rng,
      (value) => `${value}`,
    );
  }

  function makeStampProblem(rng, serial, value) {
    const big = Math.floor(value / 10);
    const small = value % 10;
    const firstChoices = digitChoices(big, small, rng, "큰 도장");
    const secondChoices = digitChoices(small, big, rng, "작은 도장");
    return {
      id: `stamp-${serial}`,
      type: "stamp",
      kind: "그림그래프 만들기",
      prompt: `도장으로 나타낼 수 · ${value}`,
      finalExpression: `${big}×10 + ${small}×1 = ${value}`,
      visual: { kind: "stamp", value, big, small },
      steps: [
        makeStep({
          id: "big-stamps",
          label: "큰 도장",
          instruction: "10짜리 큰 도장은 몇 개일까요?",
          answer: big,
          choices: firstChoices,
          correctText: `큰 도장 ${big}개를 찍었어요.`,
          reveal: `${big}`,
          advance: { mode: "button", label: "작은 도장 보기" },
        }),
        makeStep({
          id: "small-stamps",
          label: "작은 도장",
          instruction: "남은 1짜리 작은 도장은 몇 개일까요?",
          answer: small,
          choices: secondChoices,
          correctText: `작은 도장 ${small}개를 찍었어요.`,
          reveal: `${small}`,
        }),
      ],
    };
  }

  function makeDetectiveProblem(rng, serial, type, unit) {
    const iconCounts = shuffle([2, 3, 4, 5, 6, 7, 8], rng).slice(0, 4);
    const rows = DETECTIVE_LABELS.map((label, index) => ({
      id: `row-${index}`,
      label,
      iconCount: iconCounts[index],
      value: iconCounts[index] * unit,
    }));
    const sorted = rows.slice().sort((a, b) => a.value - b.value);
    const low = sorted[0];
    const high = sorted[sorted.length - 1];
    if (type === "difference") {
      const difference = high.value - low.value;
      const iconDifference = high.iconCount - low.iconCount;
      const useLowerOffset = serial % 2 === 1;
      const oneUnitOffset = useLowerOffset
        ? Math.max(0, difference - unit)
        : difference + unit;
      const values = uniqueValues([
        difference,
        iconDifference,
        high.value,
        oneUnitOffset,
      ], unit);
      const choices = makeChoices(
        values,
        difference,
        ["correct", "ignored-unit", "high-value", useLowerOffset ? "one-unit-less" : "one-unit-more"],
        (value, misconceptionId) => {
          if (misconceptionId === "ignored-unit") return `그림 차이에 ${unit}을 곱해요.`;
          if (misconceptionId === "high-value") return "큰 값 말고 두 값의 차이를 찾아요.";
          if (value < difference) return `${unit}만큼 모자라요.`;
          return `${unit}만큼 많아요.`;
        },
        rng,
        (value) => `${value}`,
      );
      return {
        id: `detective-${serial}`,
        type,
        kind: "차이 찾기",
        prompt: `${high.label} − ${low.label}, 차이는 얼마일까요?`,
        finalExpression: `${high.value} − ${low.value} = ${difference}`,
        visual: { kind: "detective", rows, unit, targetType: type, highId: high.id, lowId: low.id },
        steps: [
          makeStep({
            id: "difference",
            label: "차이",
            instruction: "큰 값에서 작은 값을 빼요.",
            answer: difference,
            choices,
            correctText: `두 값의 차이 = ${difference}`,
            reveal: `${difference}`,
          }),
        ],
      };
    }

    const answerRow = type === "maximum" ? high : low;
    const choices = makeChoices(
      rows.map((row) => row.label),
      answerRow.label,
      ["correct", "other-row", "other-row", "other-row"],
      (value) => {
        const picked = rows.find((row) => row.label === value);
        const direction = type === "maximum" ? "더 큰 값" : "더 작은 값";
        return `${picked.value}보다 ${direction}이 있어요.`;
      },
      rng,
      String,
    );
    const typeText = type === "maximum" ? "가장 큰 값" : "가장 작은 값";
    return {
      id: `detective-${serial}`,
      type,
      kind: `${typeText} 찾기`,
      prompt: `${typeText}은 어느 줄일까요?`,
      finalExpression: `${answerRow.label} ${answerRow.value}`,
      visual: { kind: "detective", rows, unit, targetType: type, answerId: answerRow.id },
      steps: [
        makeStep({
          id: type,
          label: type === "maximum" ? "큰 값" : "작은 값",
          instruction: `그림 수에 ${unit}를 곱해 비교해요.`,
          answer: answerRow.label,
          choices,
          correctText: `맞는 줄: ${answerRow.label} · 값: ${answerRow.value}`,
          reveal: answerRow.label,
        }),
      ],
    };
  }

  function generateRun(seed = 12345) {
    const rng = createRng(seed);
    const type = LESSON_CONFIG.workbench?.type;
    if (type === "census") {
      return [4, 5, 6, 7, 8, 9, 10, 11, 12, 8]
        .map((count, index) => makeCensusProblem(rng, index + 1, count));
    }
    if (type === "picture-decoder") {
      const cases = [[2, 3], [2, 5], [2, 8], [5, 2], [5, 4], [5, 7], [10, 2], [10, 4], [10, 6], [10, 8]];
      return shuffle(cases, rng).map(([unit, count], index) => makeDecoderProblem(rng, index + 1, unit, count));
    }
    if (type === "picture-stamp") {
      return shuffle([10, 14, 21, 26, 30, 37, 42, 48, 53, 59], rng)
        .map((value, index) => makeStampProblem(rng, index + 1, value));
    }
    const types = shuffle(["maximum", "maximum", "maximum", "minimum", "minimum", "minimum", "difference", "difference", "difference", "difference"], rng);
    return types.map((problemType, index) => makeDetectiveProblem(rng, index + 1, problemType, index % 2 === 0 ? 2 : 5));
  }

  function validateChoice(step, choice) {
    return String(choice?.id) === String(step.answerChoiceId);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      return {
        ...WRONG_REWARD_EVENT,
        amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max),
      };
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        return { ...event, amount: randomInt(rng, event.min, event.max) };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    return { ...fallback, amount: randomInt(rng, fallback.min, fallback.max) };
  }

  function applyReward(state, event) {
    let power = clamp(Number(state.power || 0) + Number(event.amount || 0), MIN_POWER, MAX_POWER);
    if (event.family === "complete") power = Math.max(power, 61);
    if (event.family === "rainbow") power = MAX_POWER;
    return {
      power,
      specialSeen: Boolean(state.specialSeen || event.special || event.family === "rainbow"),
    };
  }

  function getResult(power, correctFirstTry, specialSeen) {
    for (let index = RESULT_TIERS.length - 1; index >= 0; index -= 1) {
      const result = RESULT_TIERS[index];
      if (result.needsSpecial && !specialSeen) continue;
      if (power >= result.minPower && correctFirstTry >= result.minCorrect) return result;
    }
    return RESULT_TIERS[0];
  }

  function getNextResult(result) {
    const index = RESULT_TIERS.findIndex((item) => item.id === result?.id);
    return RESULT_TIERS[Math.min(Math.max(index + 1, 0), RESULT_TIERS.length - 1)];
  }

  return {
    TOTAL_PROBLEMS,
    MIN_POWER,
    MAX_POWER,
    RESULT_TIERS,
    REWARD_EVENTS,
    WRONG_REWARD_EVENT,
    createRng,
    randomInt,
    shuffle,
    clamp,
    generateRun,
    validateChoice,
    pickRewardEvent,
    applyReward,
    getResult,
    getNextResult,
  };
})();
