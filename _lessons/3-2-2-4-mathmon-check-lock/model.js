const Lesson2CheckLockModel = (() => {
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

  function multiplicationChoices(dividend, divisor, quotient, remainder, rng) {
    return shuffle([
      choice(
        "multiply:divisor-quotient",
        "divisor-quotient",
        `${divisor} × ${quotient}`,
        null,
        "",
        { roleLabel: "나누는 수 × 몫", expression: `${divisor} × ${quotient}` }
      ),
      choice(
        "multiply:dividend-divisor",
        "dividend-divisor",
        `${dividend} × ${divisor}`,
        "DIV4_MULTIPLY_DIVIDEND_DIVISOR",
        "처음 수는 마지막에 비교해요.",
        { roleLabel: "처음 수 × 나누는 수", expression: `${dividend} × ${divisor}` }
      ),
      choice(
        "multiply:quotient-remainder",
        "quotient-remainder",
        `${quotient} × ${remainder}`,
        "DIV4_MULTIPLY_QUOTIENT_REMAINDER",
        "몫은 나누는 수와 곱해요.",
        { roleLabel: "몫 × 나머지", expression: `${quotient} × ${remainder}` }
      ),
      choice(
        "multiply:divisor-remainder",
        "divisor-remainder",
        `${divisor} × ${remainder}`,
        "DIV4_MULTIPLY_DIVISOR_REMAINDER",
        "나머지는 곱하지 않아요.",
        { roleLabel: "나누는 수 × 나머지", expression: `${divisor} × ${remainder}` }
      )
    ], rng);
  }

  function additionChoices(dividend, divisor, quotient, remainder, rng) {
    return shuffle([
      choice("add:remainder", "remainder", String(remainder), null, "", { roleLabel: "나머지", number: remainder }),
      choice(
        "add:quotient",
        "quotient",
        String(quotient),
        "DIV4_ADD_QUOTIENT",
        "몫 말고 나머지를 더해요.",
        { roleLabel: "몫", number: quotient }
      ),
      choice(
        "add:divisor",
        "divisor",
        String(divisor),
        "DIV4_ADD_DIVISOR",
        "나누는 수가 아니라 나머지를 더해요.",
        { roleLabel: "나누는 수", number: divisor }
      ),
      choice(
        "add:dividend",
        "dividend",
        String(dividend),
        "DIV4_ADD_DIVIDEND",
        "처음 수는 마지막에 비교해요.",
        { roleLabel: "처음 수", number: dividend }
      )
    ], rng);
  }

  function makeProblem(rng, serial, shouldMatch, mismatchKind, used) {
    while (true) {
      const divisor = randomInt(rng, 2, 9);
      const trueQuotient = randomInt(rng, 4, Math.min(18, Math.floor(98 / divisor)));
      const trueRemainder = randomInt(rng, 1, divisor - 1);
      const dividend = divisor * trueQuotient + trueRemainder;
      if (dividend < 20 || dividend > 99) continue;

      let shownQuotient = trueQuotient;
      let shownRemainder = trueRemainder;
      let mismatchPart = null;
      if (!shouldMatch && mismatchKind === "quotient") {
        shownQuotient = Math.max(1, trueQuotient + (serial % 2 ? 1 : -1));
        mismatchPart = "quotient";
      } else if (!shouldMatch) {
        const direction = trueRemainder + 1 < divisor ? 1 : -1;
        shownRemainder = trueRemainder + direction;
        mismatchPart = "remainder";
      }

      const key = `${dividend}:${divisor}:${shownQuotient}:${shownRemainder}`;
      if (used.has(key)) continue;
      used.add(key);

      const product = divisor * shownQuotient;
      const checkTotal = product + shownRemainder;
      const matchesOriginal = checkTotal === dividend;
      const multiplyAnswerId = "multiply:divisor-quotient";
      const addAnswerId = "add:remainder";
      const steps = [
        {
          id: "multiply",
          label: "곱하기",
          instruction: "먼저 무엇과 무엇을 곱할까요?",
          answer: "divisor-quotient",
          answerChoiceId: multiplyAnswerId,
          choices: multiplicationChoices(dividend, divisor, shownQuotient, shownRemainder, rng),
          correctText: `${divisor} × ${shownQuotient} = ${product}`,
          reveal: `${divisor} × ${shownQuotient}`,
          advance: { mode: "timed", delayMs: 850 }
        },
        {
          id: "add",
          label: "더하기",
          instruction: "그다음 무엇을 더할까요?",
          answer: "remainder",
          answerChoiceId: addAnswerId,
          choices: additionChoices(dividend, divisor, shownQuotient, shownRemainder, rng),
          correctText: `${product} + ${shownRemainder} = ${checkTotal}`,
          reveal: String(shownRemainder),
          advance: { mode: matchesOriginal ? "complete" : "timed", delayMs: 1000 }
        }
      ];

      if (!matchesOriginal) {
        const locateAnswerId = `locate:${mismatchPart}`;
        steps.push({
          id: "locate",
          label: "다른 곳 찾기",
          instruction: "어느 수가 다를까요?",
          answer: mismatchPart,
          answerChoiceId: locateAnswerId,
          choices: shuffle([
            choice("locate:quotient", "quotient", `몫 ${shownQuotient}`, mismatchPart === "quotient" ? null : "DIV4_WRONG_ERROR_LOCATION", "나머지를 다시 봐요."),
            choice("locate:remainder", "remainder", `나머지 ${shownRemainder}`, mismatchPart === "remainder" ? null : "DIV4_WRONG_ERROR_LOCATION", "몫을 다시 봐요.")
          ], rng),
          correctText: mismatchPart === "quotient" ? "몫이 달라요." : "나머지가 달라요.",
          reveal: mismatchPart === "quotient" ? "몫" : "나머지",
          advance: { mode: "complete" }
        });
      }

      return {
        id: `check-${serial}-${dividend}-${divisor}`,
        type: matchesOriginal ? "match" : "mismatch",
        dividend,
        divisor,
        trueQuotient,
        trueRemainder,
        shownQuotient,
        shownRemainder,
        product,
        checkTotal,
        matchesOriginal,
        mismatchPart,
        prompt: `${dividend} ÷ ${divisor} = ${shownQuotient} … ${shownRemainder}`,
        finalExpression: matchesOriginal
          ? `${divisor} × ${shownQuotient} + ${shownRemainder} = ${dividend}`
          : `${divisor} × ${shownQuotient} + ${shownRemainder} = ${checkTotal} ≠ ${dividend}`,
        steps
      };
    }
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    const used = new Set();
    const types = shuffle(LESSON_CONFIG.typesPerRun, rng);
    let mismatchIndex = 0;
    return types.map((type, index) => {
      const mismatchKind = mismatchIndex % 2 === 0 ? "quotient" : "remainder";
      if (type === "mismatch") mismatchIndex += 1;
      return makeProblem(rng, index + 1, type === "match", mismatchKind, used);
    });
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
    if (index < 0) return result || visible[0];
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }

  return {
    TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT,
    createRng, randomInt, shuffle, clamp, generateRun, validateChoice,
    pickRewardEvent, applyReward, getResult, getNextResult
  };
})();
