const Lesson4FractionSorterModel = (() => {
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
  function topicParticle(num) { return numberHasBatchim(num) ? "은" : "는"; }
  const categoryChoices = [
    { id: "kind:proper", value: "진분수", label: "진분수", relation: "분자 < 분모", misconceptionId: "SORT_PROPER", feedback: "분자가 분모보다 작은지 살펴봐요." },
    { id: "kind:improper", value: "가분수", label: "가분수", relation: "분자 ≥ 분모", misconceptionId: "SORT_IMPROPER", feedback: "분자가 분모와 같거나 큰지 살펴봐요." },
    { id: "kind:mixed", value: "대분수", label: "대분수", relation: "자연수 + 진분수", misconceptionId: "SORT_MIXED", feedback: "자연수와 진분수가 함께 있는지 살펴봐요." }
  ];
  const kindId = { "진분수": "kind:proper", "가분수": "kind:improper", "대분수": "kind:mixed" };
  function makeProblem(data, serial, rng) {
    const notation = data.whole ? `${data.whole} ${data.num}/${data.den}` : `${data.num}/${data.den}`;
    return {
      id: `sort-${serial}-${data.kind}-${data.whole}-${data.num}-${data.den}`,
      type: "fraction-sorter", ...data, notation,
      prompt: `${notation}${topicParticle(data.num)} 어떤 분수일까요?`,
      finalExpression: `${notation}${topicParticle(data.num)} ${data.kind}예요.`,
      steps: [{
        id: "sort", label: "분수 이름", instruction: "분수 모양과 분자·분모를 보고 이름을 골라요.",
        answer: data.kind, answerChoiceId: kindId[data.kind], choices: shuffle(categoryChoices.map((item) => ({
          ...item,
          misconceptionId: item.id === kindId[data.kind] ? null : item.misconceptionId
        })), rng),
        correctText: `맞아요. ${notation}${topicParticle(data.num)} ${data.kind}예요.`, reveal: data.kind, advance: { mode: "complete" }
      }]
    };
  }
  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(LESSON_CONFIG.fractionCases, rng).map((data, index) => makeProblem(data, index + 1, rng));
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
        const text = event.special ? "무지개!" : event.launches ? "완벽 분류!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
        return { ...event, amount, text };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0]; const amount = randomInt(rng, fallback.min, fallback.max);
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
    for (const result of RESULT_TIERS) if (!result.needsSpecial && power >= result.minPower && correctFirstTry >= result.minCorrect) current = result;
    return current;
  }
  function getNextResult(result) {
    const visible = RESULT_TIERS.filter((item) => !item.needsSpecial);
    const index = visible.findIndex((item) => item.id === result.id);
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }
  return { TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
})();
