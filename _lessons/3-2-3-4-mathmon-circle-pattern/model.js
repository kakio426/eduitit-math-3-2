const Lesson3CirclePatternModel = (() => {
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

  function patternChoice(visualKind, label, misconceptionId = null, feedback = "") {
    return { id: `choice:${visualKind}`, value: visualKind, visualKind, label, misconceptionId, feedback };
  }

  function choicesForPattern(rng) {
    return shuffle([
      patternChoice("correct", "같은 크기와 간격"),
      patternChoice("gap-wide", "간격이 넓음", "PATTERN_GAP_CHANGED", "간격이 넓어졌어요. 앞의 간격과 맞춰요."),
      patternChoice("off-line", "줄에서 벗어남", "PATTERN_OFF_LINE", "줄에서 벗어났어요. 앞의 원과 같은 줄로 이어요."),
      patternChoice("size-changed", "원 크기가 다름", "PATTERN_SIZE_CHANGED", "원 크기가 달라졌어요. 같은 크기로 이어요.")
    ], rng);
  }

  function makeProblem(orientation, serial, rng) {
    const radius = randomInt(rng, 15, 18);
    return {
      id: `pattern-${serial}-${orientation}`,
      type: "circle-pattern",
      orientation,
      radius,
      answerKind: "correct",
      prompt: "무늬를 그대로 이은 것은?",
      finalExpression: "같은 크기와 간격으로 원 무늬를 이었어요.",
      steps: [{
        id: "continue-pattern",
        label: "다음 원",
        instruction: "같은 크기와 간격으로 이어진 그림을 골라요.",
        answer: "correct",
        answerChoiceId: "choice:correct",
        choices: choicesForPattern(rng),
        correctText: "맞아요. 원 크기와 간격이 그대로 이어졌어요.",
        reveal: "무늬 완성",
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.orientationsPerRun, rng).map((orientation, index) => makeProblem(orientation, index + 1, rng));
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
        const text = event.special ? "무지개!" : event.launches ? "완벽한 무늬!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
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
