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

  function feedbackForRadius(conditionType, givenValue, answerRadius, selectedRadius) {
    if (conditionType === "diameter" && selectedRadius === givenValue) {
      return "지름의 반을 반지름으로 맞춰요.";
    }
    if (selectedRadius < answerRadius) return "반지름이 조건보다 짧아요.";
    return "반지름이 조건보다 길어요.";
  }

  function misconceptionForRadius(conditionType, givenValue, answerRadius, selectedRadius) {
    if (selectedRadius === answerRadius) return "correct";
    if (conditionType === "diameter" && selectedRadius === givenValue) return "DIAMETER_AS_RADIUS";
    return selectedRadius < answerRadius ? "RADIUS_TOO_SHORT" : "RADIUS_TOO_LONG";
  }

  function radiusChoices(conditionType, givenValue, answerRadius) {
    return [1, 2, 3, 4].map((value) => ({
      id: `radius:${value}`,
      value,
      label: `반지름 ${value} cm`,
      misconceptionId: misconceptionForRadius(conditionType, givenValue, answerRadius, value),
      feedback: value === answerRadius
        ? ""
        : feedbackForRadius(conditionType, givenValue, answerRadius, value),
    }));
  }

  function makeProblem(conditionType, givenValue, serial) {
    const answerRadius = conditionType === "diameter" ? givenValue / 2 : givenValue;
    const isDiameter = conditionType === "diameter";
    return {
      id: `circle-${serial}-${conditionType}-${givenValue}`,
      type: "circle-draw",
      conditionType,
      givenValue,
      answerRadius,
      prompt: `${isDiameter ? "지름" : "반지름"}이 ${givenValue} cm인 원을 그려요.`,
      finalExpression: isDiameter
        ? `지름 ${givenValue} cm는 반지름 ${answerRadius} cm예요.`
        : `반지름 ${answerRadius} cm인 원을 그렸어요.`,
      steps: [{
        id: "set-radius",
        label: "반지름",
        instruction: "컴퍼스의 연필 다리를 자의 눈금에 맞춰요.",
        answer: answerRadius,
        answerChoiceId: `radius:${answerRadius}`,
        choices: radiusChoices(conditionType, givenValue, answerRadius),
        correctText: isDiameter
          ? `맞아요. 지름 ${givenValue} cm의 반지름은 ${answerRadius} cm예요.`
          : `맞아요. 반지름을 ${answerRadius} cm로 맞췄어요.`,
        reveal: `반지름 ${answerRadius} cm`,
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    const radiusProblems = shuffle([2, 2, 3, 3, 4], rng)
      .map((value, index) => makeProblem("radius", value, index + 1));
    const diameterProblems = shuffle([4, 4, 6, 6, 8], rng)
      .map((value, index) => makeProblem("diameter", value, index + 6));
    return radiusProblems.flatMap((problem, index) => [problem, diameterProblems[index]]);
  }

  function validateChoice(step, selected) {
    return Boolean(selected && Number(selected.value) === Number(step.answer));
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
        const text = event.special ? "무지개!" : event.launches ? "완벽한 무늬!" : (event.keepsPower || event.emptiesPower) ? "0" : amount > 0 ? `+${amount}` : String(amount);
        return { ...event, amount, text };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    const amount = randomInt(rng, fallback.min, fallback.max);
    return { ...fallback, amount, text: `+${amount}` };
  }

  function applyReward(state, event) {
    if (event.keepsPower || event.emptiesPower) return { power: state.power, specialSeen: state.specialSeen };
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
    feedbackForRadius, misconceptionForRadius,
    pickRewardEvent, applyReward, getResult, getNextResult
  };
})();
