const Lesson3TargetHitModel = (() => {
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

  function choice(visualKind, label, misconceptionId = null, feedback = "") {
    return { id: `choice:${visualKind}`, value: visualKind, visualKind, label, misconceptionId, feedback };
  }

  function choicesForTerm(term, rng) {
    if (term === "중심") {
      return shuffle([
        choice("center", "원의 한가운데 점"),
        choice("edge-point", "원 위의 점", "CIRCLE_CENTER_ON_EDGE", "중심은 원 위가 아니라 한가운데예요."),
        choice("inner-point", "치우친 안쪽 점", "CIRCLE_CENTER_OFF_MIDDLE", "원의 한가운데를 찾아요."),
        choice("outer-point", "원 밖의 점", "CIRCLE_CENTER_OUTSIDE", "중심은 원 안의 한가운데예요.")
      ], rng);
    }
    if (term === "반지름") {
      return shuffle([
        choice("radius", "중심에서 원까지 이은 선분"),
        choice("diameter", "원을 가로지른 선분", "CIRCLE_RADIUS_AS_DIAMETER", "반지름은 중심에서 원까지 한쪽만 이어요."),
        choice("off-center-chord", "중심을 지나지 않는 선분", "CIRCLE_RADIUS_MISSES_CENTER", "반지름은 중심에서 시작해요."),
        choice("inner-segment", "원까지 닿지 않는 선분", "CIRCLE_RADIUS_NOT_TO_EDGE", "반지름은 원까지 닿아요.")
      ], rng);
    }
    return shuffle([
      choice("diameter", "중심을 지나 원의 양쪽을 이은 선분"),
      choice("radius", "중심에서 원까지 이은 선분", "CIRCLE_DIAMETER_AS_RADIUS", "지름은 원의 양쪽까지 이어요."),
      choice("off-center-chord", "중심을 지나지 않는 선분", "CIRCLE_DIAMETER_MISSES_CENTER", "지름은 중심을 지나야 해요."),
      choice("inner-segment", "원 안에서 끝나는 선분", "CIRCLE_DIAMETER_NOT_EDGE_TO_EDGE", "지름은 원의 양쪽에 닿아요.")
    ], rng);
  }

  function definitionForTerm(term) {
    if (term === "중심") return "중심은 원의 한가운데 점이에요.";
    if (term === "반지름") return "반지름은 중심에서 원까지 이은 선분이에요.";
    return "지름은 중심을 지나 원의 양쪽을 이은 선분이에요.";
  }

  function instructionForTerm(term) {
    if (term === "중심") return "원의 한가운데 점을 골라요.";
    if (term === "반지름") return "중심에서 원까지 이은 선분을 골라요.";
    return "중심을 지나 원의 양쪽을 이은 선분을 골라요.";
  }

  function makeProblem(term, serial, rng) {
    const answerKind = term === "중심" ? "center" : term === "반지름" ? "radius" : "diameter";
    return {
      id: `circle-${serial}-${answerKind}`,
      type: answerKind,
      term,
      answerKind,
      prompt: `${term}은 어느 것일까요?`,
      finalExpression: definitionForTerm(term),
      steps: [{
        id: "identify",
        label: term,
        instruction: instructionForTerm(term),
        answer: answerKind,
        answerChoiceId: `choice:${answerKind}`,
        choices: choicesForTerm(term, rng),
        correctText: definitionForTerm(term),
        reveal: term,
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.typesPerRun, rng).map((term, index) => makeProblem(term, index + 1, rng));
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
        const text = event.special ? "무지개!" : event.launches ? "정중앙!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
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
