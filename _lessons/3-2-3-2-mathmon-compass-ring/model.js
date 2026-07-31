const Lesson3CompassRingModel = (() => {
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

  function openingChoice(value, radius, misconceptionId = null, feedback = "") {
    return {
      id: `choice:${value}`,
      value,
      visualKind: "compass-opening",
      label: `${value} cm`,
      misconceptionId,
      feedback
    };
  }

  function choicesForRadius(radius, rng) {
    return shuffle([
      openingChoice(radius, radius),
      openingChoice(radius * 2, radius, "COMPASS_USES_DIAMETER", "지름만큼 벌리면 목표 원보다 커져요."),
      openingChoice(radius - 1, radius, "COMPASS_TOO_NARROW", "이대로 돌리면 원이 작아져요."),
      openingChoice(radius + 1, radius, "COMPASS_TOO_WIDE", "이대로 돌리면 원이 커져요.")
    ], rng);
  }

  function makeProblem(radius, serial, rng) {
    return {
      id: `compass-${serial}-r${radius}`,
      type: "compass-opening",
      radius,
      answerKind: "compass-opening",
      prompt: `반지름이 ${radius} cm인 원을 그리려면?`,
      finalExpression: `그대로 돌리면 반지름 ${radius} cm인 원이 돼요.`,
      steps: [{
        id: "spread",
        label: "컴퍼스 벌리기",
        instruction: "바늘과 연필 사이의 길이를 골라요.",
        answer: radius,
        answerChoiceId: `choice:${radius}`,
        choices: choicesForRadius(radius, rng),
        correctText: `바늘과 연필 사이를 ${radius} cm로 맞춰요.`,
        reveal: `${radius} cm`,
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.radiiPerRun, rng).map((radius, index) => makeProblem(radius, index + 1, rng));
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
        const text = event.special ? "무지개!" : event.launches ? "완벽한 원!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
        return { ...event, amount, text };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    const amount = randomInt(rng, fallback.min, fallback.max);
    return { ...fallback, amount, text: `+${amount}` };
  }

  function applyReward(state, event) {
    if (event.emptiesPower) return { power: state.power, specialSeen: state.specialSeen };
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
