const Lesson5PackageWeightModel = (() => {
  const TOTAL_PROBLEMS = 10;
  const MIN_POWER = 0;
  const MAX_POWER = 100;
  const BASE_CORRECT_POWER = 5;
  const TYPES_PER_RUN = LESSON_CONFIG.typesPerRun;
  const RESULT_TIERS = LESSON_CONFIG.results;
  const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
  const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;

  function createRng(seed = 12345) {
    let value = seed >>> 0;
    return function rng() {
      value = (value + 0x6d2b79f5) >>> 0;
      let t = value;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
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

  function toTotalGrams(weight) {
    return weight.kg * 1000 + weight.g;
  }

  function fromTotalGrams(total) {
    return { kg: Math.floor(total / 1000), g: total % 1000 };
  }

  function formatGrams(value) {
    return `${value}g`;
  }

  function formatWeight(weight) {
    return `${weight.kg}kg ${weight.g}g`;
  }

  function makeChoice(id, label, value, numericValue, misconceptionId, feedback, relation) {
    return { id, label, value, numericValue, misconceptionId, feedback, relation };
  }

  function correctChoice(stepId, label, value, numericValue) {
    return makeChoice(`${stepId}-correct`, label, value, numericValue, null, "", "unit");
  }

  function makeStep(id, label, instruction, slot, correct, choices, confirm) {
    return {
      id,
      label,
      prompt: instruction,
      instruction,
      slot,
      preview: "?",
      correct,
      answer: correct,
      reveal: correct,
      choices,
      confirm,
      correctText: confirm,
      wrongText: "다시 골라요.",
      advance: { delayMs: 1100 },
    };
  }

  function makeAddCarry(rng, serial) {
    const left = { kg: randomInt(rng, 1, 6), g: randomInt(rng, 52, 94) * 10 };
    const right = { kg: randomInt(rng, 1, 5), g: randomInt(rng, 52, 94) * 10 };
    const gramSum = left.g + right.g;
    const kgSum = left.kg + right.kg;
    const carriedGram = fromTotalGrams(gramSum);
    const final = fromTotalGrams(toTotalGrams(left) + toTotalGrams(right));
    const finalTotal = toTotalGrams(final);
    const noCarry = `${kgSum}kg ${gramSum}g`;
    const addGramsChoices = shuffle([
      correctChoice("addGrams", formatGrams(gramSum), formatGrams(gramSum), gramSum),
      makeChoice("addGrams-low", formatGrams(gramSum - 100), formatGrams(gramSum - 100), gramSum - 100, "added-100-too-little", "100g 적어요.", "low"),
      makeChoice("addGrams-high", formatGrams(gramSum + 100), formatGrams(gramSum + 100), gramSum + 100, "added-100-too-much", "100g 많아요.", "high"),
      makeChoice("addGrams-no-thousand", formatGrams(gramSum - 1000), formatGrams(gramSum - 1000), gramSum - 1000, "dropped-1000", "1000g 적어요.", "low"),
    ], rng);
    const carryChoices = shuffle([
      correctChoice("addCarry", formatWeight(carriedGram), formatWeight(carriedGram), gramSum),
      makeChoice("addCarry-no-kg", formatGrams(carriedGram.g), formatGrams(carriedGram.g), carriedGram.g, "forgot-new-kilogram", "1kg이 빠졌어요.", "low"),
      makeChoice("addCarry-unchanged", `0kg ${gramSum}g`, `0kg ${gramSum}g`, gramSum, "did-not-regroup", "1000g을 아직 바꾸지 않았어요.", "unit"),
      makeChoice("addCarry-high", `1kg ${carriedGram.g + 100}g`, `1kg ${carriedGram.g + 100}g`, gramSum + 100, "regrouped-100-high", "100g 많아요.", "high"),
    ], rng);
    const finalChoices = shuffle([
      correctChoice("addFinal", formatWeight(final), formatWeight(final), finalTotal),
      makeChoice("addFinal-no-carry", noCarry, noCarry, finalTotal, "kept-1000-in-grams", "1000g을 1kg으로 바꿔요.", "unit"),
      makeChoice("addFinal-low", formatWeight(fromTotalGrams(finalTotal - 100)), formatWeight(fromTotalGrams(finalTotal - 100)), finalTotal - 100, "final-100-low", "100g 적어요.", "low"),
      makeChoice("addFinal-high", formatWeight(fromTotalGrams(finalTotal + 100)), formatWeight(fromTotalGrams(finalTotal + 100)), finalTotal + 100, "final-100-high", "100g 많아요.", "high"),
    ], rng);
    return {
      id: `add-${serial}`,
      type: "addCarry",
      kind: "무게 더하기",
      prompt: `${formatWeight(left)} + ${formatWeight(right)}`,
      expression: `${formatWeight(left)} + ${formatWeight(right)} = ${formatWeight(final)}`,
      finalExpression: `${formatWeight(left)} + ${formatWeight(right)} = ${formatWeight(final)}`,
      visual: { kind: "weightBoard", operation: "+", left, right },
      left,
      right,
      gramSum,
      kgSum,
      carriedGram,
      final,
      finalText: formatWeight(final),
      representativeMistake: noCarry,
      steps: [
        makeStep("addGrams", "1단계", "g끼리 더한 값을 골라요.", "g 합", formatGrams(gramSum), addGramsChoices, `${formatGrams(gramSum)}이에요.`),
        makeStep("addCarry", "2단계", "1000g을 1kg으로 바꿔요.", "바꾼 무게", formatWeight(carriedGram), carryChoices, `${formatWeight(carriedGram)}이 되었어요.`),
        makeStep("addFinal", "3단계", "kg까지 더한 무게를 골라요.", "완성 무게", formatWeight(final), finalChoices, `${formatWeight(final)}이에요.`),
      ],
    };
  }

  function makeSubtractBorrow(rng, serial) {
    const top = { kg: randomInt(rng, 5, 9), g: randomInt(rng, 10, 42) * 10 };
    const bottom = { kg: randomInt(rng, 1, top.kg - 2), g: randomInt(rng, Math.floor(top.g / 10) + 16, 96) * 10 };
    const borrowedTop = { kg: top.kg - 1, g: top.g + 1000 };
    const gramDifference = borrowedTop.g - bottom.g;
    const rawNoBorrowGrams = Math.abs(top.g - bottom.g);
    const noBorrowGrams = [gramDifference, Math.max(0, gramDifference - 100), gramDifference + 100].includes(rawNoBorrowGrams)
      ? gramDifference + 200
      : rawNoBorrowGrams;
    const final = fromTotalGrams(toTotalGrams(top) - toTotalGrams(bottom));
    const finalTotal = toTotalGrams(final);
    const noBorrow = `${top.kg - bottom.kg}kg ${Math.abs(top.g - bottom.g)}g`;
    const borrowChoices = shuffle([
      correctChoice("borrowKg", formatWeight(borrowedTop), formatWeight(borrowedTop), toTotalGrams(top)),
      makeChoice("borrowKg-no-kg", `${top.kg}kg ${top.g + 1000}g`, `${top.kg}kg ${top.g + 1000}g`, toTotalGrams(top) + 1000, "did-not-lower-kilogram", "kg을 1만큼 줄여요.", "high"),
      makeChoice("borrowKg-no-grams", `${top.kg - 1}kg ${top.g}g`, `${top.kg - 1}kg ${top.g}g`, toTotalGrams(top) - 1000, "did-not-add-1000g", "1000g을 더해요.", "low"),
      makeChoice("borrowKg-two", `${top.kg - 2}kg ${top.g + 1000}g`, `${top.kg - 2}kg ${top.g + 1000}g`, toTotalGrams(top) - 1000, "borrowed-two-kilograms", "1kg을 너무 많이 줄였어요.", "low"),
    ], rng);
    const gramsChoices = shuffle([
      correctChoice("subtractGrams", formatGrams(gramDifference), formatGrams(gramDifference), gramDifference),
      makeChoice("subtractGrams-low", formatGrams(Math.max(0, gramDifference - 100)), formatGrams(Math.max(0, gramDifference - 100)), Math.max(0, gramDifference - 100), "subtracted-100-too-much", "100g 적어요.", "low"),
      makeChoice("subtractGrams-high", formatGrams(gramDifference + 100), formatGrams(gramDifference + 100), gramDifference + 100, "subtracted-100-too-little", "100g 많아요.", "high"),
      makeChoice("subtractGrams-no-borrow", formatGrams(noBorrowGrams), formatGrams(noBorrowGrams), noBorrowGrams, "subtracted-without-borrowing", "1000g을 먼저 더해요.", noBorrowGrams < gramDifference ? "low" : "high"),
    ], rng);
    const finalChoices = shuffle([
      correctChoice("subtractFinal", formatWeight(final), formatWeight(final), finalTotal),
      makeChoice("subtractFinal-no-borrow", noBorrow, noBorrow, finalTotal, "final-without-borrowing", "1kg을 1000g으로 바꿔요.", "unit"),
      makeChoice("subtractFinal-low", formatWeight(fromTotalGrams(Math.max(0, finalTotal - 100))), formatWeight(fromTotalGrams(Math.max(0, finalTotal - 100))), Math.max(0, finalTotal - 100), "final-100-low", "100g 적어요.", "low"),
      makeChoice("subtractFinal-high", formatWeight(fromTotalGrams(finalTotal + 100)), formatWeight(fromTotalGrams(finalTotal + 100)), finalTotal + 100, "final-100-high", "100g 많아요.", "high"),
    ], rng);
    return {
      id: `subtract-${serial}`,
      type: "subtractBorrow",
      kind: "무게 빼기",
      prompt: `${formatWeight(top)} − ${formatWeight(bottom)}`,
      expression: `${formatWeight(top)} − ${formatWeight(bottom)} = ${formatWeight(final)}`,
      finalExpression: `${formatWeight(top)} − ${formatWeight(bottom)} = ${formatWeight(final)}`,
      visual: { kind: "weightBoard", operation: "−", left: top, right: bottom },
      top,
      bottom,
      borrowedTop,
      gramDifference,
      final,
      finalText: formatWeight(final),
      representativeMistake: noBorrow,
      steps: [
        makeStep("borrowKg", "1단계", "1kg을 1000g으로 바꿔요.", "바뀐 위 무게", formatWeight(borrowedTop), borrowChoices, `${formatWeight(borrowedTop)}이 되었어요.`),
        makeStep("subtractGrams", "2단계", "g끼리 뺀 값을 골라요.", "g 차", formatGrams(gramDifference), gramsChoices, `${formatGrams(gramDifference)}이 남아요.`),
        makeStep("subtractFinal", "3단계", "kg까지 뺀 무게를 골라요.", "완성 무게", formatWeight(final), finalChoices, `${formatWeight(final)}이 남아요.`),
      ],
    };
  }

  function makeLimit(rng, serial) {
    const box = { kg: randomInt(rng, 1, 5), g: randomInt(rng, 12, 88) * 10 };
    const wrap = { kg: randomInt(rng, 0, 2), g: randomInt(rng, 14, 92) * 10 };
    const total = fromTotalGrams(toTotalGrams(box) + toTotalGrams(wrap));
    const totalGrams = toTotalGrams(total);
    const fitsLimit = rng() > 0.46;
    const difference = randomInt(rng, 8, 54) * 10;
    const limitTotal = clamp(totalGrams + (fitsLimit ? difference : -difference), 1000, 9900);
    const actualDifference = Math.abs(totalGrams - limitTotal);
    const limit = fromTotalGrams(limitTotal);
    const correctFitText = totalGrams <= limitTotal ? "실을 수 있어요" : "한도보다 무거워요";
    const opposite = totalGrams <= limitTotal ? "한도보다 무거워요" : "실을 수 있어요";
    const needsCarry = box.g + wrap.g >= 1000;
    const unitMistakeValue = needsCarry
      ? `${box.kg + wrap.kg}kg ${box.g + wrap.g}g`
      : formatWeight(fromTotalGrams(totalGrams - 1000));
    const totalChoices = shuffle([
      correctChoice("limitTotal", formatWeight(total), formatWeight(total), totalGrams),
      makeChoice("limitTotal-low", formatWeight(fromTotalGrams(Math.max(0, totalGrams - 100))), formatWeight(fromTotalGrams(Math.max(0, totalGrams - 100))), Math.max(0, totalGrams - 100), "total-100-low", "100g 적어요.", "low"),
      makeChoice("limitTotal-high", formatWeight(fromTotalGrams(totalGrams + 100)), formatWeight(fromTotalGrams(totalGrams + 100)), totalGrams + 100, "total-100-high", "100g 많아요.", "high"),
      makeChoice(
        "limitTotal-unit",
        unitMistakeValue,
        unitMistakeValue,
        needsCarry ? totalGrams : totalGrams - 1000,
        needsCarry ? "kept-1000-in-grams" : "dropped-one-kilogram",
        needsCarry ? "1000g을 1kg으로 바꿔요." : "1kg이 빠졌어요.",
        needsCarry ? "unit" : "low",
      ),
    ], rng);
    const fitChoices = shuffle([
      correctChoice("limitFit", correctFitText, correctFitText, totalGrams - limitTotal),
      makeChoice("limitFit-opposite", opposite, opposite, limitTotal - totalGrams, "reversed-limit-comparison", `한도와 ${actualDifference}g 차이 나요.`, "opposite"),
      makeChoice("limitFit-same", "한도와 같아요", "한도와 같아요", 0, "ignored-limit-difference", `${actualDifference}g 차이 나요.`, "unit"),
    ], rng);
    return {
      id: `limit-${serial}`,
      type: "limit",
      kind: "택배 한도",
      prompt: "택배 무게와 한도 비교",
      expression: `${formatWeight(total)} / 한도 ${formatWeight(limit)}: ${correctFitText}`,
      finalExpression: `${formatWeight(total)} / 한도 ${formatWeight(limit)}: ${correctFitText}`,
      visual: { kind: "limit", operation: "+", left: box, right: wrap, total: totalGrams, limit: limitTotal, max: Math.ceil(Math.max(totalGrams, limitTotal) / 1000) * 1000 },
      box,
      wrap,
      limit,
      final: total,
      finalText: formatWeight(total),
      fitsLimit: totalGrams <= limitTotal,
      representativeMistake: opposite,
      steps: [
        makeStep("limitTotal", "1단계", "택배 무게를 골라요.", "택배 무게", formatWeight(total), totalChoices, `${formatWeight(total)}이에요.`),
        makeStep("limitFit", "2단계", "한도와 비교해 골라요.", "한도 확인", correctFitText, fitChoices, `한도와 ${actualDifference}g 차이예요.`),
      ],
    };
  }

  function makeProblem(type, rng, serial) {
    if (type === "addCarry") return makeAddCarry(rng, serial);
    if (type === "subtractBorrow") return makeSubtractBorrow(rng, serial);
    return makeLimit(rng, serial);
  }

  function generateRun(seed = 12345) {
    const rng = createRng(seed);
    return shuffle(TYPES_PER_RUN, rng).map((type, index) => makeProblem(type, rng, index + 1));
  }

  function validateChoice(step, choice) {
    return step.correct === (choice && typeof choice === "object" ? choice.value : choice);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      return Object.assign({}, WRONG_REWARD_EVENT, {
        amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max),
      });
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        return Object.assign({}, event, { amount: randomInt(rng, event.min, event.max) });
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    return Object.assign({}, fallback, { amount: randomInt(rng, fallback.min, fallback.max) });
  }

  function applyReward(state, event, firstTry) {
    const before = state.power;
    const skillPower = firstTry ? BASE_CORRECT_POWER : 0;
    const power = clamp(before + skillPower + event.amount, MIN_POWER, MAX_POWER);
    return {
      power,
      correctFirstTry: state.correctFirstTry + (firstTry ? 1 : 0),
      specialSeen: state.specialSeen || Boolean(event.special),
      before,
      skillPower,
      event,
    };
  }

  function getResult(power, correctFirstTry, specialSeen) {
    for (let index = RESULT_TIERS.length - 1; index >= 0; index -= 1) {
      const result = RESULT_TIERS[index];
      if (result.needsSpecial && !specialSeen) continue;
      if (power >= result.minPower && correctFirstTry >= result.minCorrect) return result;
    }
    return RESULT_TIERS[0];
  }

  function getNextResult(result) {
    const index = RESULT_TIERS.findIndex((item) => item.id === result.id);
    return RESULT_TIERS[Math.min(index + 1, RESULT_TIERS.length - 1)];
  }

  return {
    TOTAL_PROBLEMS,
    MIN_POWER,
    MAX_POWER,
    BASE_CORRECT_POWER,
    TYPES_PER_RUN,
    RESULT_TIERS,
    REWARD_EVENTS,
    WRONG_REWARD_EVENT,
    createRng,
    randomInt,
    shuffle,
    clamp,
    toTotalGrams,
    fromTotalGrams,
    formatGrams,
    formatWeight,
    generateRun,
    validateChoice,
    pickRewardEvent,
    applyReward,
    getResult,
    getNextResult,
  };
})();
