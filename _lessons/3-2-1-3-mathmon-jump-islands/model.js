const Lesson3JumpIslandsModel = (() => {
  const SCALE_LABELS = {
    tenfold: "0 한 개 붙이기",
    hundredfold: "0 두 개 붙이기",
  };

  function createRng(seed = 12345) {
    let value = Number(seed) || 12345;
    value %= 2147483647;
    if (value <= 0) value += 2147483646;
    return () => {
      value = (value * 16807) % 2147483647;
      return (value - 1) / 2147483646;
    };
  }

  function shuffle(items, rng = Math.random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(rng() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function uniquePositive(values) {
    return [...new Set(values)].filter((value) => Number.isFinite(value) && value > 0);
  }

  function makeProblem(data) {
    const smallExpression = `${data.leftSmall} × ${data.rightSmall}`;
    return {
      id: `${data.type}-${data.leftFactor}-${data.rightFactor}`,
      type: data.type,
      prompt: `${data.leftFactor} × ${data.rightFactor}`,
      leftFactor: data.leftFactor,
      rightFactor: data.rightFactor,
      leftSmall: data.leftSmall,
      rightSmall: data.rightSmall,
      smallExpression,
      smallProduct: data.smallProduct,
      scaleMultiplier: data.scaleMultiplier,
      scaleLabel: data.scaleLabel,
      finalAnswer: data.finalAnswer,
      finalExpression: `${data.leftFactor} × ${data.rightFactor} = ${data.finalAnswer.toLocaleString("ko-KR")}`,
    };
  }

  function generateCandidateBank() {
    const hundredfold = [];
    const tenfold = [];
    for (let a = 2; a <= 9; a += 1) {
      for (let b = 2; b <= 9; b += 1) {
        if (a === 2 && b === 2) continue;
        const smallProduct = a * b;
        hundredfold.push(makeProblem({
          type: "hundredfold",
          leftFactor: a * 10,
          rightFactor: b * 10,
          leftSmall: a,
          rightSmall: b,
          smallProduct,
          scaleMultiplier: 100,
          scaleLabel: SCALE_LABELS.hundredfold,
          finalAnswer: smallProduct * 100,
        }));
      }
    }
    for (let ab = 12; ab <= 98; ab += 1) {
      if (ab % 10 === 0) continue;
      for (let c = 2; c <= 9; c += 1) {
        const smallProduct = ab * c;
        tenfold.push(makeProblem({
          type: "tenfold",
          leftFactor: ab,
          rightFactor: c * 10,
          leftSmall: ab,
          rightSmall: c,
          smallProduct,
          scaleMultiplier: 10,
          scaleLabel: SCALE_LABELS.tenfold,
          finalAnswer: smallProduct * 10,
        }));
      }
    }
    return { hundredfold, tenfold };
  }

  function chooseProblems(candidates, count, usedAnswers, rng, factorUses) {
    const picked = [];
    for (const candidate of shuffle(candidates, rng)) {
      if (picked.length >= count) break;
      if (usedAnswers.has(candidate.finalAnswer)) continue;
      const key = candidate.type === "hundredfold"
        ? `h-${Math.min(candidate.leftSmall, candidate.rightSmall)}`
        : `t-${candidate.rightSmall}`;
      if ((factorUses.get(key) || 0) >= 2) continue;
      const easyCount = picked.filter((item) => item.finalAnswer === 400 || item.smallProduct <= 9).length;
      if ((candidate.finalAnswer === 400 || candidate.smallProduct <= 9) && easyCount >= 1) continue;
      picked.push(candidate);
      usedAnswers.add(candidate.finalAnswer);
      factorUses.set(key, (factorUses.get(key) || 0) + 1);
    }
    if (picked.length !== count) {
      throw new Error(`Could not pick ${count} ${candidates[0]?.type || "problem"} problems`);
    }
    return picked;
  }

  function buildSmallProductChoices(problem, rng) {
    const offsets = [
      problem.smallProduct,
      problem.leftSmall * (problem.rightSmall + 1),
      problem.smallProduct + (problem.smallProduct >= 100 ? 10 : 1),
      problem.smallProduct - (problem.smallProduct >= 100 ? 10 : 1),
    ];
    const choices = uniquePositive(offsets);
    let nudge = 2;
    while (choices.length < 3) {
      choices.push(problem.smallProduct + nudge);
      nudge += 1;
    }
    return shuffle(choices.slice(0, 3), rng);
  }

  function buildFootingChoices(rng) {
    return shuffle([SCALE_LABELS.tenfold, SCALE_LABELS.hundredfold, "0 세 개 붙이기"], rng);
  }

  function buildSteps(problem, rng) {
    return [
      {
        id: "smallProduct",
        label: "먼저 곱하기",
        answer: problem.smallProduct,
        instruction: `${problem.smallExpression}의 답을 골라요.`,
        correctText: `${problem.smallExpression} = ${problem.smallProduct}`,
        wrongText: "곱한 값을 다시 봐요.",
        preview: `${problem.smallExpression} = ?`,
        reveal: `${problem.smallExpression} = ${problem.smallProduct}`,
        choices: buildSmallProductChoices(problem, rng),
      },
      {
        id: "scaleFooting",
        label: problem.scaleLabel,
        answer: problem.scaleLabel,
        instruction: `${problem.smallProduct} 뒤에 0을 몇 개 붙일까요?`,
        correctText: `${problem.smallProduct} → ${problem.finalAnswer.toLocaleString("ko-KR")}`,
        wrongText: "가린 0을 다시 세어 봐요.",
        preview: `${problem.smallProduct} → ?`,
        reveal: problem.finalExpression,
        choices: buildFootingChoices(rng),
      },
    ];
  }

  function generateRun(seed = Date.now()) {
    const rng = typeof seed === "function" ? seed : createRng(seed);
    const bank = generateCandidateBank();
    const usedAnswers = new Set();
    const factorUses = new Map();
    const hundredfold = chooseProblems(bank.hundredfold, 5, usedAnswers, rng, factorUses);
    const tenfold = chooseProblems(bank.tenfold, 5, usedAnswers, rng, factorUses);
    return shuffle([...hundredfold, ...tenfold], rng).map((problem, index) => ({
      ...problem,
      runIndex: index,
      steps: buildSteps(problem, rng),
    }));
  }

  function validateChoice(step, choice) {
    if (typeof step.answer === "number") return Number(choice) === step.answer;
    return String(choice) === String(step.answer);
  }

  function pickAmount(event, rng) {
    const min = Number(event.min);
    const max = Number(event.max);
    const amount = min === max ? min : min + Math.floor(rng() * (max - min + 1));
    return { ...event, amount };
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) return pickAmount(LESSON_CONFIG.wrongEvent, rng);
    const total = LESSON_CONFIG.rewardEvents.reduce((sum, event) => sum + event.weight, 0);
    let roll = rng() * total;
    for (const event of LESSON_CONFIG.rewardEvents) {
      roll -= event.weight;
      if (roll <= 0) return pickAmount(event, rng);
    }
    return pickAmount(LESSON_CONFIG.rewardEvents[LESSON_CONFIG.rewardEvents.length - 1], rng);
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function applyReward(state, event) {
    const maxPower = LESSON_CONFIG.reward?.maxPower ?? 100;
    state.power = clamp(state.power + event.amount, 0, maxPower);
    if (event.special) state.specialSeen = true;
  }

  function getResult(power, correctFirstTry, specialSeen) {
    const sorted = [...LESSON_CONFIG.results].sort((a, b) => a.minPower - b.minPower || a.minCorrect - b.minCorrect);
    let current = sorted[0];
    for (const result of sorted) {
      if (power >= result.minPower && correctFirstTry >= result.minCorrect && (!result.needsSpecial || specialSeen)) {
        current = result;
      }
    }
    return current;
  }

  function getNextResult(result) {
    const index = LESSON_CONFIG.results.findIndex((item) => item.id === result.id);
    return LESSON_CONFIG.results[Math.min(index + 1, LESSON_CONFIG.results.length - 1)];
  }

  return {
    SCALE_LABELS,
    createRng,
    generateRun,
    validateChoice,
    pickRewardEvent,
    applyReward,
    getResult,
    getNextResult,
    clamp,
  };
})();
