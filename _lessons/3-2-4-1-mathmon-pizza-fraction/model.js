const Lesson4PizzaFractionModel = (() => {
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

  function randomInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
  function shuffle(items, rng) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const target = Math.floor(rng() * (index + 1));
      [copy[index], copy[target]] = [copy[target], copy[index]];
    }
    return copy;
  }
  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
  function numberHasBatchim(value) { return [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10); }
  function fractionCopula(num) { return numberHasBatchim(num) ? "이에요" : "예요"; }
  function fractionSpeech(num, den) { return `${den}분의 ${num}`; }

  function fractionChoice(num, den, misconceptionId = null, feedback = "") {
    return { id: `choice:${num}/${den}`, value: `${num}/${den}`, num, den, label: fractionSpeech(num, den), misconceptionId, feedback };
  }

  function choicesForFraction(num, den, rng) {
    return shuffle([
      fractionChoice(num, den),
      fractionChoice(den, num, "FRACTION_SWAPPED", "위아래가 바뀌었어요. 색칠된 조각 수를 위에 놓아요."),
      fractionChoice(den - num, den, "FRACTION_COUNTS_UNSHADED", "색칠 안 된 조각이 아니라 색칠된 조각을 세어요."),
      fractionChoice(den, den, "FRACTION_WHOLE_AS_PART", "위에는 전체가 아니라 색칠된 조각 수를 놓아요.")
    ], rng);
  }

  function makeProblem(pair, serial, rng) {
    const [num, den] = pair;
    return {
      id: `pizza-${serial}-${num}-${den}`,
      type: "pizza-fraction",
      num,
      den,
      answerKind: `${num}/${den}`,
      prompt: "색칠된 조각은 전체의 얼마일까요?",
      finalExpression: `전체 ${den}조각 중 ${num}조각, ${fractionSpeech(num, den)}${fractionCopula(num)}.`,
      steps: [{
        id: "name-fraction",
        label: "분수 고르기",
        instruction: "피자에 맞는 분수를 골라요.",
        answer: `${num}/${den}`,
        answerChoiceId: `choice:${num}/${den}`,
        choices: choicesForFraction(num, den, rng),
        correctText: `맞아요. 전체 ${den}조각 중 ${num}조각, ${fractionSpeech(num, den)}${fractionCopula(num)}.`,
        reveal: fractionSpeech(num, den),
        advance: { mode: "complete" }
      }]
    };
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.fractionCases, rng).map((pair, index) => makeProblem(pair, index + 1, rng));
  }
  function validateChoice(step, selected) { return Boolean(selected && selected.id === step.answerChoiceId); }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      const amount = randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max);
      return { ...WRONG_REWARD_EVENT, amount, text: String(amount) };
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        const amount = randomInt(rng, event.min, event.max);
        const text = event.special ? "무지개!" : event.launches ? "완벽한 피자!" : (event.keepsPower || event.emptiesPower) ? "0" : amount > 0 ? `+${amount}` : String(amount);
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
    if (index < 0 || index >= visible.length - 1) return result;
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }

  return { TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
})();
