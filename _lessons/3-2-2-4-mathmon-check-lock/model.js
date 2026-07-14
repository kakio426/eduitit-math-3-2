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

  function choice(id, value, label, misconceptionId = null, feedback = "") {
    return { id, value, label, misconceptionId, feedback };
  }

  function numericChoices(answer, candidates, misconceptionIds, feedbacks, rng) {
    const values = [answer];
    for (const candidate of candidates) {
      if (candidate >= 0 && !values.includes(candidate)) values.push(candidate);
      if (values.length === 4) break;
    }
    let bump = 1;
    while (values.length < 4) {
      const candidate = answer + bump;
      if (!values.includes(candidate)) values.push(candidate);
      bump += 1;
    }
    return shuffle(values.map((value, index) => choice(
      `value:${value}`,
      value,
      String(value),
      index === 0 ? null : (misconceptionIds[index - 1] || "DIV4_CALCULATION_SLIP"),
      index === 0 ? "" : (feedbacks[index - 1] || "계산을 한 번 더 해 봐요.")
    )), rng);
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
      const multiplyAnswerId = `value:${product}`;
      const addAnswerId = `value:${checkTotal}`;
      const steps = [
        {
          id: "multiply",
          label: "곱하기",
          instruction: "곱한 값을 숫자판에 넣어요.",
          answer: product,
          answerChoiceId: multiplyAnswerId,
          choices: numericChoices(
            product,
            [divisor + shownQuotient, product + divisor, product - divisor],
            ["DIV4_ADD_INSTEAD_OF_MULTIPLY", "DIV4_PRODUCT_TOO_HIGH", "DIV4_PRODUCT_TOO_LOW"],
            ["더하지 말고 곱해요.", "곱한 값이 너무 커요.", "곱한 값이 너무 작아요."],
            rng
          ),
          correctText: `${divisor} × ${shownQuotient} = ${product}`,
          reveal: String(product),
          advance: { mode: "timed", delayMs: 850 }
        },
        {
          id: "add",
          label: "더하기",
          instruction: "더한 값을 숫자판에 넣어요.",
          answer: checkTotal,
          answerChoiceId: addAnswerId,
          choices: numericChoices(
            checkTotal,
            [product, product + divisor, checkTotal + 1],
            ["DIV4_OMIT_REMAINDER", "DIV4_ADD_DIVISOR_NOT_REMAINDER", "DIV4_ADDITION_SLIP"],
            ["나머지도 더해요.", "나누는 수가 아니라 나머지를 더해요.", "더한 값을 한 번 더 봐요."],
            rng
          ),
          correctText: `${product} + ${shownRemainder} = ${checkTotal}`,
          reveal: String(checkTotal),
          advance: { mode: matchesOriginal ? "complete" : "timed", delayMs: 1000 }
        }
      ];

      if (!matchesOriginal) {
        const locateAnswerId = `locate:${mismatchPart}`;
        steps.push({
          id: "locate",
          label: "다른 곳 찾기",
          instruction: "몫 또는 나머지를 눌러요.",
          answer: mismatchPart,
          answerChoiceId: locateAnswerId,
          choices: shuffle([
            choice("locate:quotient", "quotient", "몫", mismatchPart === "quotient" ? null : "DIV4_WRONG_ERROR_LOCATION", "나머지를 다시 봐요."),
            choice("locate:remainder", "remainder", "나머지", mismatchPart === "remainder" ? null : "DIV4_WRONG_ERROR_LOCATION", "몫을 다시 봐요.")
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
