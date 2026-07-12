const Lesson2DivideFarmModel = (() => {
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

  function choice(id, value, label, misconceptionId = null, feedback = "") {
    return { id, value, label, misconceptionId, feedback };
  }

  function makeNumericChoices(answer, candidates, unit, misconceptionIds, feedbacks, rng) {
    const values = [answer];
    for (const candidate of candidates) {
      if (candidate >= 0 && !values.includes(candidate)) values.push(candidate);
      if (values.length === 4) break;
    }
    let bump = 1;
    while (values.length < 4) {
      if (!values.includes(answer + bump)) values.push(answer + bump);
      bump += 1;
    }
    return shuffle(values.map((value, index) => choice(
      `value:${value}`,
      value,
      `${value}${unit}`,
      index === 0 ? null : (misconceptionIds[index - 1] || "DIV1_CALCULATION_SLIP"),
      index === 0 ? "" : (feedbacks[index - 1] || "한 번 더 나눠 봐요.")
    )), rng);
  }

  function buildPool() {
    const pool = [];
    for (let dividend = 20; dividend <= 99; dividend += 1) {
      const tens = Math.floor(dividend / 10);
      const ones = dividend % 10;
      for (let divisor = 2; divisor <= 9; divisor += 1) {
        if (tens % divisor !== 0 || ones % divisor !== 0) continue;
        pool.push({ dividend, divisor, tens, ones });
      }
    }
    return pool;
  }

  function makeProblem(base, serial, rng) {
    const { dividend, divisor, tens, ones } = base;
    const tensQuotient = tens / divisor;
    const onesQuotient = ones / divisor;
    const quotient = dividend / divisor;
    const addDigits = tensQuotient + onesQuotient;
    const reverseDigits = onesQuotient * 10 + tensQuotient;
    return {
      id: `farm-${serial}-${dividend}-by-${divisor}`,
      type: "exact",
      dividend,
      divisor,
      tens,
      ones,
      tensQuotient,
      onesQuotient,
      quotient,
      prompt: `${dividend} ÷ ${divisor}`,
      finalExpression: `${dividend} ÷ ${divisor} = ${quotient}`,
      steps: [
        {
          id: "tens",
          label: "10개 묶음",
          instruction: `${tens}묶음을 바구니 ${divisor}개에 똑같이 나눠요.`,
          answer: tensQuotient,
          answerChoiceId: `value:${tensQuotient}`,
          choices: makeNumericChoices(
            tensQuotient,
            [(tens * 10) / divisor, tensQuotient + 1, Math.max(0, tensQuotient - 1)],
            "묶음",
            ["DIV1_DIVIDE_FULL_TENS_VALUE", "DIV1_TENS_QUOTIENT_TOO_HIGH", "DIV1_TENS_QUOTIENT_TOO_LOW"],
            ["10개 묶음만 세어 봐요.", "한 묶음이 많아요.", "한 묶음이 남았어요."],
            rng
          ),
          correctText: `한 바구니에 ${tensQuotient}묶음`,
          reveal: `${tensQuotient}묶음`,
          advance: { mode: "timed", delayMs: 850 }
        },
        {
          id: "ones",
          label: "낱개",
          instruction: `${ones}개를 바구니 ${divisor}개에 똑같이 나눠요.`,
          answer: onesQuotient,
          answerChoiceId: `value:${onesQuotient}`,
          choices: makeNumericChoices(
            onesQuotient,
            [ones, onesQuotient + 1, Math.max(0, onesQuotient - 1)],
            "개",
            ["DIV1_COPY_ONES_WITHOUT_DIVIDING", "DIV1_ONES_QUOTIENT_TOO_HIGH", "DIV1_ONES_QUOTIENT_TOO_LOW"],
            ["낱개도 똑같이 나눠요.", "한 개가 많아요.", "한 개가 남았어요."],
            rng
          ),
          correctText: `한 바구니에 ${onesQuotient}개`,
          reveal: `${onesQuotient}개`,
          advance: { mode: "timed", delayMs: 850 }
        },
        {
          id: "combine",
          label: "몫 완성",
          instruction: "두 숫자로 몫을 만들어요.",
          answer: quotient,
          answerChoiceId: `value:${quotient}`,
          choices: makeNumericChoices(
            quotient,
            [addDigits, reverseDigits, quotient + 10],
            "",
            ["DIV1_COMBINE_BY_ADDING_DIGITS", "DIV1_REVERSE_QUOTIENT_DIGITS", "DIV1_TENS_PLACE_TOO_HIGH"],
            ["두 숫자를 나란히 놓아요.", "십의 자리와 일의 자리를 바꿨어요.", "십의 자리가 너무 커요."],
            rng
          ),
          correctText: `${dividend} ÷ ${divisor} = ${quotient}`,
          reveal: String(quotient),
          advance: { mode: "complete" }
        }
      ]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    const pool = shuffle(buildPool(), rng);
    const selected = [];
    const divisorCounts = new Map();
    for (const candidate of pool) {
      const count = divisorCounts.get(candidate.divisor) || 0;
      if (count >= 3) continue;
      selected.push(candidate);
      divisorCounts.set(candidate.divisor, count + 1);
      if (selected.length === TOTAL_PROBLEMS) break;
    }
    if (selected.length < TOTAL_PROBLEMS) {
      for (const candidate of pool) {
        if (selected.includes(candidate)) continue;
        selected.push(candidate);
        if (selected.length === TOTAL_PROBLEMS) break;
      }
    }
    return selected.map((base, index) => makeProblem(base, index + 1, rng));
  }

  function validateChoice(step, selected) {
    return Boolean(selected && selected.id === step.answerChoiceId);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) return { ...WRONG_REWARD_EVENT, amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max) };
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) return { ...event, amount: randomInt(rng, event.min, event.max) };
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    return { ...fallback, amount: randomInt(rng, fallback.min, fallback.max) };
  }

  function applyReward(state, event) {
    if (event.emptiesPower) return { power: 0, specialSeen: state.specialSeen };
    if (event.special) return { power: MAX_POWER, specialSeen: true };
    return { power: clamp(state.power + event.amount, 0, MAX_POWER), specialSeen: state.specialSeen };
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
    const index = visible.findIndex((item) => item.id === result.id);
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }

  return {
    TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT,
    createRng, randomInt, shuffle, clamp, generateRun, validateChoice,
    pickRewardEvent, applyReward, getResult, getNextResult
  };
})();
