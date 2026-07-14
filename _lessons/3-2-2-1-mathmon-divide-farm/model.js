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

  function makeNumberEntryChoices(answer, misconceptionId = "DIV1_QUOTIENT_COUNT_ERROR") {
    return Array.from({ length: 99 }, (_, offset) => {
      const value = offset + 1;
      return choice(
        `value:${value}`,
        value,
        String(value),
        value === answer ? null : misconceptionId,
        value === answer ? "" : "한 바구니를 다시 세어 봐요."
      );
    });
  }

  function buildPool() {
    const pool = [];
    for (let dividend = 20; dividend <= 99; dividend += 1) {
      const tens = Math.floor(dividend / 10);
      const ones = dividend % 10;
      if (ones === 0) continue;
      for (let divisor = 2; divisor <= 5; divisor += 1) {
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
    const tensValue = tens * 10;
    const tensShare = tensQuotient * 10;
    return {
      id: `farm-${serial}-${dividend}-by-${divisor}`,
      type: "exact",
      dividend,
      divisor,
      tens,
      ones,
      tensValue,
      tensShare,
      tensQuotient,
      onesQuotient,
      quotient,
      prompt: `${dividend} ÷ ${divisor}`,
      finalExpression: `${tensShare} + ${onesQuotient} = ${quotient}\n${dividend} ÷ ${divisor} = ${quotient}`,
      steps: [
        {
          id: "tens",
          label: `${tensValue}개 먼저`,
          interaction: "enter-share",
          instruction: `먼저 ${tensValue}을 바구니 ${divisor}개에 똑같이 나눠요.`,
          reason: "십의 자리 몫을 만들어요.",
          answer: tensShare,
          answerChoiceId: `value:${tensShare}`,
          totalValue: tensValue,
          unitCount: tens,
          unitValue: 10,
          choices: makeNumberEntryChoices(tensShare, "DIV1_TENS_SHARE_ERROR"),
          correctText: `바구니마다 ${tensShare}개씩`,
          reveal: `${tensShare}개`,
          advance: { mode: "timed", delayMs: 1450 }
        },
        {
          id: "ones",
          label: `남은 ${ones}개`,
          interaction: "enter-share",
          instruction: `이제 ${ones}개를 바구니 ${divisor}개에 똑같이 나눠요.`,
          reason: "일의 자리 몫을 만들어요.",
          answer: onesQuotient,
          answerChoiceId: `value:${onesQuotient}`,
          totalValue: ones,
          unitCount: ones,
          unitValue: 1,
          choices: makeNumberEntryChoices(onesQuotient, "DIV1_ONES_SHARE_ERROR"),
          correctText: `바구니마다 낱개 ${onesQuotient}개씩`,
          reveal: `${onesQuotient}개`,
          advance: { mode: "timed", delayMs: 1450 }
        },
        {
          id: "quotient",
          label: "몫 쓰기",
          interaction: "enter-quotient",
          instruction: "두 수를 합쳐 몫을 써요.",
          reason: "한 바구니에 담긴 전체 수예요.",
          answer: quotient,
          answerChoiceId: `value:${quotient}`,
          choices: makeNumberEntryChoices(quotient),
          correctText: `${dividend} ÷ ${divisor} = ${quotient}`,
          reveal: `${quotient}`,
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
    if (result?.needsSpecial) return result;
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
