const Lesson4FractionScoopModel = (() => {
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

  function numberChoice(stepId, value, misconceptionId = null, feedback = "") {
    return { id: `${stepId}:${value}`, value, label: String(value), misconceptionId, feedback };
  }
  function uniqueDistractor(values, preferred) {
    let value = Math.max(1, preferred);
    while (values.includes(value)) value += 1;
    return value;
  }
  function makeProblem(data, serial, rng) {
    const [total, num, den] = data;
    const groupSize = total / den;
    const answer = groupSize * num;
    const groupValues = [groupSize, den, total];
    groupValues.push(uniqueDistractor(groupValues, groupSize + 1));
    const scoopValues = [answer, groupSize, total];
    scoopValues.push(uniqueDistractor(scoopValues, answer + groupSize));
    const groupChoices = shuffle([
      numberChoice("group", groupSize),
      numberChoice("group", den, "GROUP_USES_DENOMINATOR", "분모는 묶음 수예요. 전체를 분모로 나눠요."),
      numberChoice("group", total, "GROUP_USES_TOTAL", "전체가 아니라 한 묶음에 몇 개인지 골라요."),
      numberChoice("group", groupValues[3], "GROUP_NEARBY", "전체를 똑같이 나눈 수를 다시 세어요.")
    ], rng);
    const scoopChoices = shuffle([
      numberChoice("scoop", answer),
      numberChoice("scoop", groupSize, "SCOOP_ONE_GROUP_ONLY", `한 묶음은 ${groupSize}개예요. ${num}묶음을 담아요.`),
      numberChoice("scoop", total, "SCOOP_USES_TOTAL", "전체를 모두 담지 않고 분자만큼만 담아요."),
      numberChoice("scoop", scoopValues[3], "SCOOP_NEARBY", "한 묶음 수에 분자를 곱해요.")
    ], rng);
    return {
      id: `scoop-${serial}-${total}-${num}-${den}`,
      type: "fraction-scoop",
      total, num, den, groupSize, answer,
      prompt: `${total}개의 ${num}/${den}만큼은 몇 개일까요?`,
      finalExpression: `${total} ÷ ${den} = ${groupSize}  →  ${groupSize} × ${num} = ${answer}`,
      steps: [
        {
          id: "find-group", label: "한 묶음", instruction: `먼저 ${total}개를 ${den}묶음으로 나눈 수를 골라요.`,
          answer: groupSize, answerChoiceId: `group:${groupSize}`, choices: groupChoices,
          correctText: `맞아요. 한 묶음은 ${groupSize}개예요.`, reveal: String(groupSize), advance: { mode: "next", delayMs: 1050 }
        },
        {
          id: "fill-basket", label: "담을 수", instruction: `이제 ${groupSize}개씩 ${num}묶음인 수를 골라요.`,
          answer, answerChoiceId: `scoop:${answer}`, choices: scoopChoices,
          correctText: `맞아요. ${groupSize}개씩 ${num}묶음은 ${answer}개예요.`, reveal: String(answer), advance: { mode: "complete" }
        }
      ]
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
        const text = event.special ? "무지개!" : event.launches ? "수레 가득!" : event.emptiesPower ? "0" : amount > 0 ? `+${amount}` : String(amount);
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
  return { TOTAL_PROBLEMS, MAX_POWER, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
})();
