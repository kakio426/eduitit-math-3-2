const Lesson5WaterFillModel = (() => {
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

  function formatMl(value) {
    return `${value}mL`;
  }

  function formatCapacity(totalMl) {
    if (totalMl < 1000) return `${totalMl}mL`;
    const liter = Math.floor(totalMl / 1000);
    const ml = totalMl % 1000;
    return ml === 0 ? `${liter}L` : `${liter}L ${ml}mL`;
  }

  function toTotalMl(capacity) {
    return capacity.l * 1000 + capacity.ml;
  }

  function fromTotalMl(total) {
    return { l: Math.floor(total / 1000), ml: total % 1000 };
  }

  function formatWeight(weight) {
    if (weight.t !== undefined) {
      if (weight.t === 0) return `${weight.kg}kg`;
      return weight.kg === 0 ? `${weight.t}t` : `${weight.t}t ${weight.kg}kg`;
    }
    if (weight.kg !== undefined) {
      return weight.g === 0 ? `${weight.kg}kg` : `${weight.kg}kg ${weight.g}g`;
    }
    return `${weight.g}g`;
  }

  function toTotalGrams(weight) {
    if (weight.t !== undefined) return weight.t * 1000000 + weight.kg * 1000;
    return weight.kg * 1000 + weight.g;
  }

  function fromTotalGrams(total) {
    return { kg: Math.floor(total / 1000), g: total % 1000 };
  }

  function amountFeedback(selected, correct, unit) {
    const difference = Math.abs(selected - correct);
    return `${difference}${unit} ${selected < correct ? "적어요." : "많아요."}`;
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

  function makeReadMl(rng, serial) {
    const amount = randomInt(rng, 1, 9) * 100;
    const low = amount - 100;
    const high = amount + 100;
    const far = amount <= 700 ? amount + 200 : amount - 200;
    const stepId = "readMl";
    const choices = shuffle([
      correctChoice(stepId, formatMl(amount), formatMl(amount), amount),
      makeChoice(`${stepId}-low`, formatMl(low), formatMl(low), low, "one-tick-low", amountFeedback(low, amount, "mL"), "low"),
      makeChoice(`${stepId}-high`, formatMl(high), formatMl(high), high, "one-tick-high", amountFeedback(high, amount, "mL"), "high"),
      makeChoice(
        `${stepId}-far`,
        formatMl(far),
        formatMl(far),
        far,
        "two-ticks-away",
        amountFeedback(far, amount, "mL"),
        far < amount ? "low" : "high",
      ),
    ], rng);
    return {
      id: `read-ml-${serial}`,
      type: "readMl",
      kind: "mL 눈금",
      prompt: "물통 눈금 읽기",
      expression: `눈금은 ${formatMl(amount)}예요.`,
      visual: { kind: "bottle", max: 1000, amount, interval: 100, label: "물통" },
      finalText: formatMl(amount),
      representativeMistake: formatMl(low),
      steps: [makeStep(stepId, "1단계", "물높이에 맞는 들이를 골라요.", "들이", formatMl(amount), choices, `${formatMl(amount)}예요.`)],
    };
  }

  function makeReadLiterMl(rng, serial) {
    const amount = randomInt(rng, 11, 29) * 100;
    const low = amount - 100;
    const high = amount + 100;
    const unitWrong = amount >= 2000 ? amount - 1000 : amount + 1000;
    const correct = formatCapacity(amount);
    const stepId = "readLiterMl";
    const choices = shuffle([
      correctChoice(stepId, correct, correct, amount),
      makeChoice(`${stepId}-low`, formatCapacity(low), formatCapacity(low), low, "one-tick-low", amountFeedback(low, amount, "mL"), "low"),
      makeChoice(`${stepId}-high`, formatCapacity(high), formatCapacity(high), high, "one-tick-high", amountFeedback(high, amount, "mL"), "high"),
      makeChoice(
        `${stepId}-liter`,
        formatCapacity(unitWrong),
        formatCapacity(unitWrong),
        unitWrong,
        "liter-mark-shift",
        amountFeedback(unitWrong, amount, "mL"),
        unitWrong < amount ? "low" : "high",
      ),
    ], rng);
    return {
      id: `read-liter-${serial}`,
      type: "readLiterMl",
      kind: "L와 mL 눈금",
      prompt: "큰 물통 눈금 읽기",
      expression: `눈금은 ${correct}예요.`,
      visual: { kind: "bottle", max: 3000, amount, interval: 100, label: "큰 물통" },
      finalText: correct,
      representativeMistake: formatCapacity(low),
      steps: [makeStep(stepId, "1단계", "L와 mL를 함께 골라요.", "들이", correct, choices, `${correct}예요.`)],
    };
  }

  function makeCompareBottle(rng, serial) {
    let left = randomInt(rng, 4, 18) * 100;
    let right = randomInt(rng, 4, 18) * 100;
    if (left === right) right = clamp(left + 300, 400, 1800);
    const correct = left > right ? "왼쪽 물통" : "오른쪽 물통";
    const opposite = left > right ? "오른쪽 물통" : "왼쪽 물통";
    const difference = Math.abs(left - right);
    const stepId = "compareBottle";
    const choices = shuffle([
      correctChoice(stepId, correct, correct, Math.max(left, right)),
      makeChoice(`${stepId}-opposite`, opposite, opposite, Math.min(left, right), "picked-less-water", `${correct}에 ${formatMl(difference)} 더 많아요.`, "opposite"),
      makeChoice(`${stepId}-same`, "같아요", "같아요", 0, "ignored-water-level", `두 물통은 ${formatMl(difference)} 차이 나요.`, "unit"),
    ], rng);
    return {
      id: `compare-bottle-${serial}`,
      type: "compareBottle",
      kind: "들이 비교",
      prompt: "두 물통 비교",
      expression: `${correct}에 더 많이 들었어요.`,
      visual: { kind: "compareBottle", left, right, max: 2000, interval: 100 },
      finalText: correct,
      representativeMistake: opposite,
      steps: [makeStep(stepId, "1단계", "물이 더 많은 물통을 골라요.", "더 많은 쪽", correct, choices, `${correct}이 더 많아요.`)],
    };
  }

  function makeAddCarryMl(rng, serial) {
    const left = { l: randomInt(rng, 1, 4), ml: randomInt(rng, 52, 94) * 10 };
    const right = { l: randomInt(rng, 1, 3), ml: randomInt(rng, 52, 94) * 10 };
    const mlSum = left.ml + right.ml;
    const literSum = left.l + right.l;
    const converted = fromTotalMl(mlSum);
    const final = fromTotalMl(toTotalMl(left) + toTotalMl(right));
    const correct = formatCapacity(toTotalMl(final));
    const noCarry = `${literSum}L ${mlSum}mL`;
    const addMlChoices = shuffle([
      correctChoice("addMl", formatMl(mlSum), formatMl(mlSum), mlSum),
      makeChoice("addMl-low", formatMl(mlSum - 100), formatMl(mlSum - 100), mlSum - 100, "added-100-too-little", "100mL 적어요.", "low"),
      makeChoice("addMl-high", formatMl(mlSum + 100), formatMl(mlSum + 100), mlSum + 100, "added-100-too-much", "100mL 많아요.", "high"),
      makeChoice("addMl-no-thousand", formatMl(mlSum - 1000), formatMl(mlSum - 1000), mlSum - 1000, "dropped-1000", "1000mL 적어요.", "low"),
    ], rng);
    const convertedTotal = mlSum;
    const addChangeChoices = shuffle([
      correctChoice("addChange", formatCapacity(convertedTotal), formatCapacity(convertedTotal), convertedTotal),
      makeChoice("addChange-no-liter", formatMl(converted.ml), formatMl(converted.ml), converted.ml, "forgot-new-liter", "1L가 빠졌어요.", "low"),
      makeChoice("addChange-unchanged", `0L ${mlSum}mL`, `0L ${mlSum}mL`, convertedTotal, "did-not-regroup", "1000mL를 아직 바꾸지 않았어요.", "unit"),
      makeChoice("addChange-high", `1L ${converted.ml + 100}mL`, `1L ${converted.ml + 100}mL`, convertedTotal + 100, "regrouped-100-high", "100mL 많아요.", "high"),
    ], rng);
    const finalTotal = toTotalMl(final);
    const addFinalChoices = shuffle([
      correctChoice("addFinal", correct, correct, finalTotal),
      makeChoice("addFinal-no-carry", noCarry, noCarry, finalTotal, "kept-1000-in-ml", "1000mL를 1L로 바꿔요.", "unit"),
      makeChoice("addFinal-low", formatCapacity(finalTotal - 100), formatCapacity(finalTotal - 100), finalTotal - 100, "final-100-low", "100mL 적어요.", "low"),
      makeChoice("addFinal-high", formatCapacity(finalTotal + 100), formatCapacity(finalTotal + 100), finalTotal + 100, "final-100-high", "100mL 많아요.", "high"),
    ], rng);
    return {
      id: `add-ml-${serial}`,
      type: "addCarryMl",
      kind: "들이 더하기",
      prompt: `${formatCapacity(toTotalMl(left))} + ${formatCapacity(toTotalMl(right))}`,
      expression: `${formatCapacity(toTotalMl(left))} + ${formatCapacity(toTotalMl(right))} = ${correct}`,
      visual: { kind: "capacityBoard", operation: "+", left, right },
      left,
      right,
      mlSum,
      literSum,
      converted,
      final,
      finalText: correct,
      representativeMistake: noCarry,
      steps: [
        makeStep("addMl", "1단계", "mL끼리 더한 값을 골라요.", "mL 합", formatMl(mlSum), addMlChoices, `${formatMl(mlSum)}이에요.`),
        makeStep("addChange", "2단계", "1000mL를 1L로 바꿔요.", "바꾼 들이", formatCapacity(mlSum), addChangeChoices, `${formatCapacity(mlSum)}가 되었어요.`),
        makeStep("addFinal", "3단계", "L까지 더한 들이를 골라요.", "완성 들이", correct, addFinalChoices, `${correct}예요.`),
      ],
    };
  }

  function makeSubtractBorrowMl(rng, serial) {
    const top = { l: randomInt(rng, 3, 8), ml: randomInt(rng, 10, 42) * 10 };
    const bottom = { l: randomInt(rng, 1, top.l - 1), ml: randomInt(rng, Math.floor(top.ml / 10) + 16, 96) * 10 };
    const borrowedTop = { l: top.l - 1, ml: top.ml + 1000 };
    const mlDiff = borrowedTop.ml - bottom.ml;
    const rawNoBorrowMl = Math.abs(top.ml - bottom.ml);
    const noBorrowMl = [mlDiff, Math.max(0, mlDiff - 100), mlDiff + 100].includes(rawNoBorrowMl)
      ? mlDiff + 200
      : rawNoBorrowMl;
    const final = fromTotalMl(toTotalMl(top) - toTotalMl(bottom));
    const finalTotal = toTotalMl(final);
    const correct = formatCapacity(finalTotal);
    const noBorrow = `${top.l - bottom.l}L ${Math.abs(top.ml - bottom.ml)}mL`;
    const borrowChoices = shuffle([
      correctChoice("borrowLiter", `${borrowedTop.l}L ${borrowedTop.ml}mL`, `${borrowedTop.l}L ${borrowedTop.ml}mL`, toTotalMl(top)),
      makeChoice("borrowLiter-no-liter", `${top.l}L ${top.ml + 1000}mL`, `${top.l}L ${top.ml + 1000}mL`, toTotalMl(top) + 1000, "did-not-lower-liter", "1L 줄여요.", "high"),
      makeChoice("borrowLiter-no-ml", `${top.l - 1}L ${top.ml}mL`, `${top.l - 1}L ${top.ml}mL`, toTotalMl(top) - 1000, "did-not-add-1000ml", "1000mL를 더해요.", "low"),
      makeChoice("borrowLiter-two-liters", `${top.l - 2}L ${top.ml + 1000}mL`, `${top.l - 2}L ${top.ml + 1000}mL`, toTotalMl(top) - 1000, "borrowed-two-liters", "1L를 너무 많이 줄였어요.", "low"),
    ], rng);
    const subtractMlChoices = shuffle([
      correctChoice("subtractMl", formatMl(mlDiff), formatMl(mlDiff), mlDiff),
      makeChoice("subtractMl-low", formatMl(Math.max(0, mlDiff - 100)), formatMl(Math.max(0, mlDiff - 100)), Math.max(0, mlDiff - 100), "subtracted-100-too-much", "100mL 적어요.", "low"),
      makeChoice("subtractMl-high", formatMl(mlDiff + 100), formatMl(mlDiff + 100), mlDiff + 100, "subtracted-100-too-little", "100mL 많아요.", "high"),
      makeChoice("subtractMl-no-borrow", formatMl(noBorrowMl), formatMl(noBorrowMl), noBorrowMl, "subtracted-without-borrowing", "1000mL를 먼저 더해요.", noBorrowMl < mlDiff ? "low" : "high"),
    ], rng);
    const finalChoices = shuffle([
      correctChoice("subtractFinal", correct, correct, finalTotal),
      makeChoice("subtractFinal-no-borrow", noBorrow, noBorrow, finalTotal, "final-without-borrowing", "1L를 1000mL로 바꿔요.", "unit"),
      makeChoice("subtractFinal-low", formatCapacity(Math.max(0, finalTotal - 100)), formatCapacity(Math.max(0, finalTotal - 100)), Math.max(0, finalTotal - 100), "final-100-low", "100mL 적어요.", "low"),
      makeChoice("subtractFinal-high", formatCapacity(finalTotal + 100), formatCapacity(finalTotal + 100), finalTotal + 100, "final-100-high", "100mL 많아요.", "high"),
    ], rng);
    return {
      id: `subtract-ml-${serial}`,
      type: "subtractBorrowMl",
      kind: "들이 빼기",
      prompt: `${formatCapacity(toTotalMl(top))} − ${formatCapacity(toTotalMl(bottom))}`,
      expression: `${formatCapacity(toTotalMl(top))} − ${formatCapacity(toTotalMl(bottom))} = ${correct}`,
      visual: { kind: "capacityBoard", operation: "−", left: top, right: bottom },
      top,
      bottom,
      borrowedTop,
      mlDiff,
      final,
      finalText: correct,
      representativeMistake: noBorrow,
      steps: [
        makeStep("borrowLiter", "1단계", "1L를 1000mL로 바꿔요.", "바뀐 위 들이", `${borrowedTop.l}L ${borrowedTop.ml}mL`, borrowChoices, `${borrowedTop.l}L ${borrowedTop.ml}mL가 되었어요.`),
        makeStep("subtractMl", "2단계", "mL끼리 뺀 값을 골라요.", "mL 차", formatMl(mlDiff), subtractMlChoices, `${formatMl(mlDiff)}가 남아요.`),
        makeStep("subtractFinal", "3단계", "L까지 뺀 들이를 골라요.", "완성 들이", correct, finalChoices, `${correct}가 남아요.`),
      ],
    };
  }

  function makeOrderCheck(rng, serial) {
    const made = { l: randomInt(rng, 1, 5), ml: randomInt(rng, 1, 9) * 100 };
    const madeTotal = toTotalMl(made);
    const enough = rng() > 0.45;
    const offset = enough ? -randomInt(rng, 1, 5) * 100 : randomInt(rng, 1, 5) * 100;
    const orderTotal = clamp(madeTotal + offset, 700, 6900);
    const order = fromTotalMl(orderTotal);
    const fitsOrder = madeTotal >= orderTotal;
    const correct = fitsOrder ? "주문보다 많아요" : "주문보다 적어요";
    const opposite = fitsOrder ? "주문보다 적어요" : "주문보다 많아요";
    const difference = Math.abs(madeTotal - orderTotal);
    const choices = shuffle([
      correctChoice("orderCheck", correct, correct, madeTotal - orderTotal),
      makeChoice("orderCheck-opposite", opposite, opposite, orderTotal - madeTotal, "reversed-order-comparison", `주문과 ${formatMl(difference)} 차이 나요.`, "opposite"),
      makeChoice("orderCheck-same", "주문과 같아요", "주문과 같아요", 0, "ignored-order-difference", `${formatMl(difference)} 차이 나요.`, "unit"),
    ], rng);
    return {
      id: `order-check-${serial}`,
      type: "orderCheck",
      kind: "주문 비교",
      prompt: "만든 양과 주문량 비교",
      expression: `만든 양 ${formatCapacity(madeTotal)}, 주문 ${formatCapacity(orderTotal)}: ${correct}`,
      visual: { kind: "amountAxis", made: madeTotal, target: orderTotal, max: Math.ceil(Math.max(madeTotal, orderTotal) / 1000) * 1000 },
      made,
      order,
      fitsOrder,
      final: made,
      finalText: correct,
      representativeMistake: opposite,
      steps: [makeStep("orderCheck", "1단계", "주문과 비교해 골라요.", "주문 확인", correct, choices, `${formatMl(difference)} 차이예요.`)],
    };
  }

  function makeCompareKgG(rng, serial) {
    let left = { kg: randomInt(rng, 1, 6), g: randomInt(rng, 1, 9) * 100 };
    let right = { kg: randomInt(rng, 1, 6), g: randomInt(rng, 1, 9) * 100 };
    if (toTotalGrams(left) === toTotalGrams(right)) right = fromTotalGrams(clamp(toTotalGrams(left) + 400, 1000, 7900));
    const leftTotal = toTotalGrams(left);
    const rightTotal = toTotalGrams(right);
    const correct = leftTotal > rightTotal ? "왼쪽 저울" : "오른쪽 저울";
    const opposite = correct === "왼쪽 저울" ? "오른쪽 저울" : "왼쪽 저울";
    const difference = Math.abs(leftTotal - rightTotal);
    const choices = shuffle([
      correctChoice("compareKgG", correct, correct, Math.max(leftTotal, rightTotal)),
      makeChoice("compareKgG-opposite", opposite, opposite, Math.min(leftTotal, rightTotal), "picked-lighter-side", `${correct}이 ${difference}g 더 무거워요.`, "opposite"),
      makeChoice("compareKgG-same", "같아요", "같아요", 0, "ignored-weight-difference", `${difference}g 차이 나요.`, "unit"),
    ], rng);
    return {
      id: `compare-weight-${serial}`,
      type: "compareKgG",
      kind: "무게 비교",
      prompt: `${formatWeight(left)}와 ${formatWeight(right)}`,
      expression: `${correct}이 더 무거워요.`,
      visual: { kind: "scale", left: formatWeight(left), right: formatWeight(right), leftValue: leftTotal, rightValue: rightTotal, tilt: "0deg" },
      left,
      right,
      finalText: correct,
      representativeMistake: opposite,
      steps: [makeStep("compareKgG", "1단계", "더 무거운 쪽을 골라요.", "더 무거운 쪽", correct, choices, `${correct}이 ${difference}g 더 무거워요.`)],
    };
  }

  function makeBalanceMissing(rng, serial) {
    const left = { kg: randomInt(rng, 1, 5), g: randomInt(rng, 1, 8) * 100 };
    const missing = randomInt(rng, 2, 8) * 100;
    const targetTotal = toTotalGrams(left) + missing;
    const target = fromTotalGrams(targetTotal);
    const low = missing - 100;
    const high = missing + 100;
    const correct = `${missing}g`;
    const choices = shuffle([
      correctChoice("balanceMissing", correct, correct, missing),
      makeChoice("balanceMissing-low", `${low}g`, `${low}g`, low, "weight-100-low", "100g 부족해요.", "low"),
      makeChoice("balanceMissing-high", `${high}g`, `${high}g`, high, "weight-100-high", "100g 많아요.", "high"),
      makeChoice("balanceMissing-unit", formatWeight(fromTotalGrams(missing + 1000)), formatWeight(fromTotalGrams(missing + 1000)), missing + 1000, "added-one-kilogram", "1kg 많아요.", "unit"),
    ], rng);
    return {
      id: `balance-missing-${serial}`,
      type: "balanceMissing",
      kind: "저울 균형",
      prompt: "저울을 수평으로 맞추기",
      expression: `${formatWeight(left)} + ${correct} = ${formatWeight(target)}`,
      visual: {
        kind: "scale",
        left: `${formatWeight(left)} + ?`,
        right: formatWeight(target),
        leftValue: toTotalGrams(left),
        rightValue: targetTotal,
        baseLeftValue: toTotalGrams(left),
        tilt: "0deg",
      },
      left,
      target,
      missing,
      finalText: correct,
      representativeMistake: `${low}g`,
      steps: [makeStep("balanceMissing", "1단계", "저울을 맞출 무게추를 골라요.", "무게추", correct, choices, `${correct}을 올리면 수평이에요.`)],
    };
  }

  function makeCompareTonKg(rng, serial) {
    const ton = { t: 1, kg: randomInt(rng, 0, 2) * 100 };
    const kgOnly = { t: 0, kg: randomInt(rng, 850, 1250) };
    if (kgOnly.kg === 1000 && ton.kg === 0) kgOnly.kg = 900;
    const leftIsTon = rng() > 0.5;
    const left = leftIsTon ? ton : kgOnly;
    const right = leftIsTon ? kgOnly : ton;
    const leftTotal = toTotalGrams(left);
    const rightTotal = toTotalGrams(right);
    const correct = leftTotal > rightTotal ? "왼쪽 저울" : "오른쪽 저울";
    const opposite = correct === "왼쪽 저울" ? "오른쪽 저울" : "왼쪽 저울";
    const differenceKg = Math.abs(leftTotal - rightTotal) / 1000;
    const choices = shuffle([
      correctChoice("compareTonKg", correct, correct, Math.max(leftTotal, rightTotal)),
      makeChoice("compareTonKg-opposite", opposite, opposite, Math.min(leftTotal, rightTotal), "picked-lighter-side", `${correct}이 ${differenceKg}kg 더 무거워요.`, "opposite"),
      makeChoice("compareTonKg-same", "같아요", "같아요", 0, "treated-ton-as-kilogram", `${differenceKg}kg 차이 나요.`, "unit"),
    ], rng);
    return {
      id: `compare-ton-${serial}`,
      type: "compareTonKg",
      kind: "t와 kg 비교",
      prompt: `${formatWeight(left)}와 ${formatWeight(right)}`,
      expression: `${correct}이 더 무거워요.`,
      visual: { kind: "scale", left: formatWeight(left), right: formatWeight(right), leftValue: leftTotal, rightValue: rightTotal, tilt: "0deg" },
      left,
      right,
      finalText: correct,
      representativeMistake: opposite,
      steps: [makeStep("compareTonKg", "1단계", "더 무거운 쪽을 골라요.", "더 무거운 쪽", correct, choices, `${correct}이 ${differenceKg}kg 더 무거워요.`)],
    };
  }

  function makeProblem(type, rng, serial) {
    if (type === "readMl") return makeReadMl(rng, serial);
    if (type === "readLiterMl") return makeReadLiterMl(rng, serial);
    if (type === "compareBottle") return makeCompareBottle(rng, serial);
    if (type === "addCarryMl") return makeAddCarryMl(rng, serial);
    if (type === "subtractBorrowMl") return makeSubtractBorrowMl(rng, serial);
    if (type === "orderCheck") return makeOrderCheck(rng, serial);
    if (type === "compareKgG") return makeCompareKgG(rng, serial);
    if (type === "balanceMissing") return makeBalanceMissing(rng, serial);
    return makeCompareTonKg(rng, serial);
  }

  function generateRun(seed = 12345) {
    const rng = createRng(seed);
    return shuffle(TYPES_PER_RUN, rng).map((type, index) => {
      const problem = makeProblem(type, rng, index + 1);
      return Object.assign(problem, { finalExpression: problem.expression });
    });
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
    formatMl,
    formatCapacity,
    toTotalMl,
    fromTotalMl,
    formatWeight,
    toTotalGrams,
    fromTotalGrams,
    generateRun,
    validateChoice,
    pickRewardEvent,
    applyReward,
    getResult,
    getNextResult,
  };
})();
