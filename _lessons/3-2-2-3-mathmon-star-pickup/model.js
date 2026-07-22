const Lesson2StarPickupModel = (() => {
  const TOTAL_PROBLEMS = 10;
  const MAX_POWER = LESSON_CONFIG.reward?.maxPower ?? 100;
  const RESULT_TIERS = LESSON_CONFIG.results;
  const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
  const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;

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

  function choice(id, value, label, misconceptionId = null, feedback = "", meta = {}) {
    return { id, value, label, misconceptionId, feedback, ...meta };
  }

  function makeProblem(rng, serial, used) {
    while (true) {
      const divisor = randomInt(rng, 3, 9);
      const maxQuotient = Math.min(31, Math.floor((99 - (divisor - 1)) / divisor));
      const quotient = randomInt(rng, 2, maxQuotient);
      const remainder = randomInt(rng, 1, divisor - 1);
      const dividend = quotient * divisor + remainder;
      const key = `${dividend}:${divisor}`;
      if (dividend < 20 || dividend > 99 || used.has(key)) continue;
      used.add(key);

      const quotientAnswerId = `quotient:${quotient}`;
      const remainderAnswerId = `remainder:${remainder}`;
      const problem = {
        id: `remainder-${serial}-${dividend}-by-${divisor}`,
        dividend,
        divisor,
        quotient,
        remainder,
        grouped: divisor * quotient,
        prompt: `${dividend} ÷ ${divisor}`,
        finalExpression: `${divisor}×${quotient}+${remainder}=${dividend}`
      };

      problem.steps = [
        {
          id: "quotient",
          label: "몫",
          instruction: `별 ${dividend}개를 ${divisor}개씩 묶으면 몇 묶음까지 만들 수 있을까요?`,
          answer: quotient,
          answerChoiceId: quotientAnswerId,
          choices: shuffle([
            choice(quotientAnswerId, quotient, `${quotient}묶음`, null, "", {
              product: divisor * quotient,
              gap: remainder,
              relation: "fit"
            }),
            choice(`quotient:${quotient + 1}`, quotient + 1, `${quotient + 1}묶음`, "DIV3_QUOTIENT_TOO_HIGH", `별 ${divisor - remainder}개가 모자라요.`, {
              product: divisor * (quotient + 1),
              gap: remainder - divisor,
              relation: "too-high"
            }),
            choice(`quotient:${quotient - 1}`, quotient - 1, `${quotient - 1}묶음`, "DIV3_QUOTIENT_TOO_LOW", "한 묶음을 더 만들 수 있어요.", {
              product: divisor * (quotient - 1),
              gap: divisor + remainder,
              relation: "too-small"
            })
          ], rng),
          correctText: `${divisor}개씩 ${quotient}묶음, ${divisor * quotient}개예요.`,
          reveal: `${quotient}묶음`,
          advance: { mode: "timed", delayMs: 1200 }
        },
        {
          id: "remainder",
          label: "남은 별",
          instruction: "묶고 남은 별을 세어 봐요.",
          answer: remainder,
          answerChoiceId: remainderAnswerId,
          choices: shuffle([
            choice(remainderAnswerId, remainder, `${remainder}개`, null, "", { relation: "fit" }),
            choice(`remainder:${remainder + divisor}`, remainder + divisor, `${remainder + divisor}개`, "DIV3_REMAINDER_NOT_LESS_THAN_DIVISOR", `${divisor}개를 묶고 다시 봐요.`, { relation: "has-full-group" }),
            choice(`remainder:${divisor}`, divisor, `${divisor}개`, "DIV3_REMAINDER_EQUALS_DIVISOR", `${divisor}개면 한 묶음이에요.`, { relation: "equals-divisor" }),
            choice(`remainder:${Math.max(0, remainder - 1)}`, Math.max(0, remainder - 1), `${Math.max(0, remainder - 1)}개`, "DIV3_LEFTOVER_COUNT_OFF_BY_ONE", "밝은 별을 다시 세어 봐요.", { relation: "count-off" })
          ], rng),
          correctText: `${remainder}개가 남았어요.`,
          reveal: `${remainder}개`,
          advance: { mode: "complete" }
        }
      ];
      return problem;
    }
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    const used = new Set();
    return Array.from({ length: TOTAL_PROBLEMS }, (_, index) => makeProblem(rng, index + 1, used));
  }

  function validateChoice(step, selected) {
    return Boolean(selected && selected.id === step.answerChoiceId);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      return { ...WRONG_REWARD_EVENT, amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max) };
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) return { ...event, amount: randomInt(rng, event.min, event.max) };
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    return { ...fallback, amount: randomInt(rng, fallback.min, fallback.max) };
  }

  function applyReward(state, event, firstTry, problem) {
    if (event.emptiesPower) return { power: 0, specialSeen: state.specialSeen };
    if (event.special) return { power: MAX_POWER, specialSeen: true };
    const remainderBonus = firstTry ? (problem?.remainder || 0) : 0;
    return {
      power: clamp(state.power + event.amount + remainderBonus, 0, MAX_POWER),
      specialSeen: state.specialSeen
    };
  }

  function getResult(power, correctFirstTry, specialSeen) {
    const special = RESULT_TIERS.find((result) => result.needsSpecial);
    if (specialSeen && special) return special;
    let current = RESULT_TIERS.find((result) => !result.needsSpecial) || RESULT_TIERS[0];
    for (const result of RESULT_TIERS) {
      if (!result.needsSpecial && power >= result.minPower && correctFirstTry >= result.minCorrect) current = result;
    }
    return current;
  }

  function getNextResult(result) {
    const visible = RESULT_TIERS.filter((item) => !item.needsSpecial);
    if (!result || result.needsSpecial) return result || visible[0];
    const index = visible.findIndex((item) => item.id === result.id);
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }

  return {
    TOTAL_PROBLEMS,
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
    getNextResult
  };
})();
