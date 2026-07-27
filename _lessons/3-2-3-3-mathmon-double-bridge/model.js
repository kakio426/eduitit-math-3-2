const Lesson3DoubleBridgeModel = (() => {
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

  function lengthChoice(value, misconceptionId = null, feedback = "") {
    return { id: `choice:${value}`, value, visualKind: "bridge-length", label: `${value} cm`, misconceptionId, feedback };
  }

  function choicesForCase(ask, radius, rng) {
    const diameter = radius * 2;
    if (ask === "지름") {
      return shuffle([
        lengthChoice(diameter),
        lengthChoice(radius, "DIAMETER_NOT_DOUBLED", "반지름 하나만 놓였어요."),
        lengthChoice(diameter - 1, "DIAMETER_ONE_SHORT", "끝까지 닿지 않아요."),
        lengthChoice(diameter + 2, "DIAMETER_TOO_LONG", "기둥 밖으로 나갔어요.")
      ], rng);
    }
    return shuffle([
      lengthChoice(radius),
      lengthChoice(diameter, "RADIUS_NOT_HALVED", "지름 전체를 골랐어요."),
      lengthChoice(radius - 1, "RADIUS_TOO_SHORT", "끝까지 닿지 않아요."),
      lengthChoice(radius + 1, "RADIUS_TOO_LONG", "반지름 자리를 넘었어요.")
    ], rng);
  }

  function makeProblem(problemCase, serial, rng) {
    const radius = problemCase.radius;
    const diameter = radius * 2;
    const ask = problemCase.ask;
    const answer = ask === "지름" ? diameter : radius;
    const prompt = ask === "지름"
      ? `반지름이 ${radius} cm예요. 지름은?`
      : `지름이 ${diameter} cm예요. 반지름은?`;
    const finalExpression = ask === "지름"
      ? `${radius} cm + ${radius} cm = ${diameter} cm`
      : `${diameter} cm ÷ 2 = ${radius} cm`;
    return {
      id: `double-bridge-${serial}-${ask}-${radius}`,
      type: ask === "지름" ? "double" : "half",
      ask,
      radius,
      diameter,
      answerKind: ask,
      prompt,
      finalExpression,
      steps: [{
        id: "length",
        label: ask,
        instruction: ask === "지름" ? "두 반지름을 이은 길이를 골라요." : "지름의 반인 길이를 골라요.",
        answer,
        answerChoiceId: `choice:${answer}`,
        choices: choicesForCase(ask, radius, rng),
        correctText: ask === "지름"
          ? `딱 맞아요! ${radius} cm + ${radius} cm = ${diameter} cm`
          : `딱 맞아요! ${diameter} cm ÷ 2 = ${radius} cm`,
        reveal: `${answer} cm`,
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.casesPerRun, rng).map((problemCase, index) => makeProblem(problemCase, index + 1, rng));
  }

  function validateChoice(step, selected) {
    return Boolean(selected && selected.id === step.answerChoiceId);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      const amount = randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max);
      return { ...WRONG_REWARD_EVENT, amount, text: String(amount) };
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        const amount = randomInt(rng, event.min, event.max);
        const text = event.special ? "무지개!" : event.launches ? "한 번에 완공!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
        return { ...event, amount, text };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    const amount = randomInt(rng, fallback.min, fallback.max);
    return { ...fallback, amount, text: `+${amount}` };
  }

  function applyReward(state, event) {
    if (event.emptiesPower) return { power: 0, specialSeen: state.specialSeen };
    if (event.special) return { power: MAX_POWER, specialSeen: true };
    if (event.launches) return { power: Math.max(61, clamp(state.power + event.amount, 0, MAX_POWER)), specialSeen: state.specialSeen };
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
