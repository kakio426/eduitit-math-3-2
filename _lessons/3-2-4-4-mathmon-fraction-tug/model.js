const Lesson4FractionTugModel = (() => {
  const TOTAL_PROBLEMS = 10;
  const MAX_POWER = LESSON_CONFIG.reward?.maxPower ?? 100;
  const RESULT_TIERS = LESSON_CONFIG.results;
  const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
  const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;
  function createRng(seed = 12345) {
    let value = seed >>> 0;
    return function rng() {
      value = (value + 0x6d2b79f5) >>> 0;
      let mixed = value; mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1); mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }
  function randomInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
  function shuffle(items, rng) {
    const copy = items.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) { const target = Math.floor(rng() * (index + 1)); [copy[index], copy[target]] = [copy[target], copy[index]]; }
    return copy;
  }
  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
  function sideChoice(side, fraction, misconceptionId, feedback) {
    return { id: `side:${side}`, value: side, label: `${fraction.num}/${fraction.den}`, side, fraction, misconceptionId, feedback };
  }
  function makeProblem(data, serial, rng) {
    const left = { num: data.left[0], den: data.left[1] };
    const right = { num: data.right[0], den: data.right[1] };
    const answer = left.num / left.den > right.num / right.den ? "left" : "right";
    const larger = answer === "left" ? left : right;
    const smaller = answer === "left" ? right : left;
    const rule = data.compareType === "same-denominator" ? "분모가 같으니 색칠된 칸 수를 봐요." : "단위분수는 한 칸이 긴 쪽을 봐요.";
    const wrongChoiceId = data.compareType === "same-denominator"
      ? "COMPARE_SAME_DENOMINATOR_SMALLER"
      : "COMPARE_UNIT_FRACTION_SMALLER";
    return {
      id: `tug-${serial}-${data.compareType}-${left.num}-${left.den}-${right.num}-${right.den}`,
      type: "fraction-compare", compareType: data.compareType, left, right, larger, smaller,
      prompt: `${left.num}/${left.den}과 ${right.num}/${right.den} 중 더 큰 분수는 무엇일까요?`,
      finalExpression: `${larger.num}/${larger.den} > ${smaller.num}/${smaller.den}`,
      steps: [{
        id: "compare", label: "더 큰 분수", instruction: rule, answer, answerChoiceId: `side:${answer}`,
        choices: [
          sideChoice("left", left, answer === "left" ? null : wrongChoiceId, answer === "left" ? "" : rule),
          sideChoice("right", right, answer === "right" ? null : wrongChoiceId, answer === "right" ? "" : rule)
        ],
        correctText: `맞아요. ${larger.num}/${larger.den}이 더 커요.`, reveal: `${larger.num}/${larger.den}`, advance: { mode: "complete" }
      }]
    };
  }
  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.fractionCases, rng).map((data, index) => makeProblem(data, index + 1, rng));
  }
  function validateChoice(step, selected) { return Boolean(selected && selected.id === step.answerChoiceId); }
  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) { const amount = randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max); return { ...WRONG_REWARD_EVENT, amount, text: String(amount) }; }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        const amount = randomInt(rng, event.min, event.max);
        const text = event.special ? "무지개!" : event.launches ? "한판승!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
        return { ...event, amount, text };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0]; const amount = randomInt(rng, fallback.min, fallback.max); return { ...fallback, amount, text: `+${amount}` };
  }
  function applyReward(state, event) {
    if (event.emptiesPower) return { power: 0, specialSeen: state.specialSeen };
    if (event.special) return { power: MAX_POWER, specialSeen: true };
    if (event.launches) return { power: Math.max(61, clamp(state.power + event.amount, 0, MAX_POWER)), specialSeen: state.specialSeen };
    return { power: clamp(state.power + event.amount, 0, MAX_POWER), specialSeen: state.specialSeen };
  }
  function getResult(power, correctFirstTry, specialSeen) {
    const special = RESULT_TIERS.find((result) => result.needsSpecial); if (specialSeen && special) return special;
    let current = RESULT_TIERS.find((result) => !result.needsSpecial) || RESULT_TIERS[0];
    for (const result of RESULT_TIERS) if (!result.needsSpecial && power >= result.minPower && correctFirstTry >= result.minCorrect) current = result;
    return current;
  }
  function getNextResult(result) {
    const visible = RESULT_TIERS.filter((item) => !item.needsSpecial); const index = visible.findIndex((item) => item.id === result.id);
    if (index < 0 || index >= visible.length - 1) return result;
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }
  return { TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
})();
