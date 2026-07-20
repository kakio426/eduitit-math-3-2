const Lesson2ElevatorModel = (() => {
  const TOTAL_PROBLEMS = 10;
  const MIN_POWER = 0;
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

  function withObjectParticle(value) {
    const lastDigit = String(value).match(/\d(?=\D*$)/)?.[0] || "";
    const hasFinalConsonant = new Set(["0", "1", "3", "6", "7", "8"]).has(lastDigit);
    return `${value}${hasFinalConsonant ? "을" : "를"}`;
  }

  function makePairChoice(id, quotient, remainingTens, misconceptionId = null, feedback = "") {
    const quotientValue = quotient * 10;
    const remainingValue = remainingTens * 10;
    return {
      id,
      kind: "quotient-remaining-pair",
      label: `몫 ${quotientValue}, 남은 수 ${remainingValue}`,
      value: { quotient, remainingTens },
      parts: [
        { label: "몫", value: quotientValue },
        { label: "남은 수", value: remainingValue }
      ],
      misconceptionId,
      feedback
    };
  }

  function makeNumberChoice(id, value, misconceptionId = null, feedback = "") {
    return {
      id,
      kind: "number",
      label: String(value),
      value,
      misconceptionId,
      feedback
    };
  }

  function uniqueNumberChoices(answer, candidates) {
    const choices = [makeNumberChoice(`answer:${answer}`, answer)];
    const seen = new Set([answer]);
    for (const candidate of candidates) {
      if (!Number.isFinite(candidate.value) || candidate.value < 0 || seen.has(candidate.value)) continue;
      seen.add(candidate.value);
      choices.push(makeNumberChoice(candidate.id, candidate.value, candidate.misconceptionId, candidate.feedback));
      if (choices.length === 4) break;
    }
    for (let offset = 1; choices.length < 4; offset += 1) {
      const value = answer + offset * 2;
      if (seen.has(value)) continue;
      seen.add(value);
      choices.push(makeNumberChoice(
        `nearby:${value}`,
        value,
        "DIV2_NEARBY_GUESS",
        "계산판의 수를 다시 봐요."
      ));
    }
    return choices;
  }

  function getProblemCandidates() {
    const candidates = [];
    for (let divisor = 2; divisor <= 8; divisor += 1) {
      for (let quotient = 10; quotient <= 49; quotient += 1) {
        const dividend = divisor * quotient;
        if (dividend < 20 || dividend > 99) continue;
        const tensDigit = Math.floor(dividend / 10);
        const onesDigit = dividend % 10;
        const tensQuotient = Math.floor(tensDigit / divisor);
        const remainingTens = tensDigit % divisor;
        const carriedTens = remainingTens * 10;
        const downNumber = carriedTens + onesDigit;
        if (tensQuotient < 1 || remainingTens === 0 || downNumber % divisor !== 0) continue;
        candidates.push({
          id: `divide-${dividend}-by-${divisor}`,
          dividend,
          divisor,
          quotient,
          tensDigit,
          onesDigit,
          tensQuotient,
          remainingTens,
          carriedTens,
          downNumber,
          onesQuotient: downNumber / divisor
        });
      }
    }
    return candidates;
  }

  function buildSteps(problem, rng) {
    const tooHighQuotient = problem.tensQuotient + 1;
    const tooHighRemaining = Math.max(0, problem.tensDigit - tooHighQuotient * problem.divisor);
    const tooLowQuotient = Math.max(0, problem.tensQuotient - 1);
    const tooLowRemaining = problem.remainingTens + problem.divisor;
    const tensAnswerId = `tens:${problem.tensQuotient}:${problem.remainingTens}`;
    const tensChoices = [
      makePairChoice(tensAnswerId, problem.tensQuotient, problem.remainingTens),
      makePairChoice(
        `tens:${problem.tensQuotient}:0`,
        problem.tensQuotient,
        0,
        "DIV2_OMIT_REMAINING_TEN",
        `${problem.carriedTens}이 남아요.`
      ),
      makePairChoice(
        `tens:${tooHighQuotient}:${tooHighRemaining}`,
        tooHighQuotient,
        tooHighRemaining,
        "DIV2_TENS_QUOTIENT_TOO_HIGH",
        `곱하면 ${problem.divisor * tooHighQuotient * 10}이라 ${problem.tensDigit * 10}보다 커요.`
      ),
      makePairChoice(
        `tens:${tooLowQuotient}:${tooLowRemaining}`,
        tooLowQuotient,
        tooLowRemaining,
        "DIV2_TENS_QUOTIENT_TOO_LOW",
        `남은 수가 ${tooLowRemaining * 10}이면 한 번 더 나눌 수 있어요.`
      )
    ];

    const downAnswerId = `answer:${problem.downNumber}`;
    const downChoices = uniqueNumberChoices(problem.downNumber, [
      {
        id: `ones-only:${problem.onesDigit}`,
        value: problem.onesDigit,
        misconceptionId: "DIV2_IGNORE_REMAINING_TEN",
        feedback: `남은 ${problem.carriedTens}도 내려요.`
      },
      {
        id: `tens-only:${problem.carriedTens}`,
        value: problem.carriedTens,
        misconceptionId: "DIV2_IGNORE_ONES_DIGIT",
        feedback: `일의 자리 ${problem.onesDigit}도 내려요.`
      },
      {
        id: `add-divisor:${problem.downNumber + problem.divisor}`,
        value: problem.downNumber + problem.divisor,
        misconceptionId: "DIV2_ADD_DIVISOR_WHILE_CARRYING",
        feedback: "남은 수 옆에 일의 자리도 내려요."
      },
      {
        id: `subtract-divisor:${problem.downNumber - problem.divisor}`,
        value: problem.downNumber - problem.divisor,
        misconceptionId: "DIV2_SUBTRACT_TOO_EARLY",
        feedback: "두 수를 내려놓은 뒤 나눠요."
      }
    ]);

    const onesOnlyQuotient = Math.floor(problem.onesDigit / problem.divisor);
    const onesAnswerId = `answer:${problem.onesQuotient}`;
    const onesChoices = uniqueNumberChoices(problem.onesQuotient, [
      {
        id: `ones-only-quotient:${onesOnlyQuotient}`,
        value: onesOnlyQuotient,
        misconceptionId: "DIV2_DIVIDE_ONES_DIGIT_ONLY",
        feedback: `${withObjectParticle(problem.downNumber)} ${problem.divisor}로 나눠요.`
      },
      {
        id: `ones-high:${problem.onesQuotient + 1}`,
        value: problem.onesQuotient + 1,
        misconceptionId: "DIV2_ONES_QUOTIENT_TOO_HIGH",
        feedback: `곱하면 ${problem.divisor * (problem.onesQuotient + 1)}라 ${problem.downNumber}보다 커요.`
      },
      {
        id: `ones-low:${problem.onesQuotient - 1}`,
        value: problem.onesQuotient - 1,
        misconceptionId: "DIV2_ONES_QUOTIENT_TOO_LOW",
        feedback: `남은 ${problem.divisor}도 한 번 더 나눌 수 있어요.`
      },
      {
        id: `use-remaining:${problem.remainingTens}`,
        value: problem.remainingTens,
        misconceptionId: "DIV2_REUSE_REMAINING_TENS",
        feedback: "남은 수는 이미 내려왔어요."
      }
    ]);

    return [
      {
        id: "tens",
        label: "십의 자리",
        action: "십의 자리 몫과 남은 수를 고른다",
        instruction: `${problem.tensDigit * 10}에서 십의 자리 몫과 남은 수를 골라요.`,
        answer: { quotient: problem.tensQuotient, remainingTens: problem.remainingTens },
        answerChoiceId: tensAnswerId,
        choices: shuffle(tensChoices, rng),
        correctText: `몫 ${problem.tensQuotient * 10}, 남은 수 ${problem.carriedTens}`,
        reveal: `몫 ${problem.tensQuotient * 10} · 남은 수 ${problem.carriedTens}`,
        advance: { mode: "timed", delayMs: 1800 }
      },
      {
        id: "down",
        label: "내리기",
        action: "남은 수와 일의 자리 수를 합친다",
        instruction: `남은 ${problem.carriedTens}과 일의 자리 ${withObjectParticle(problem.onesDigit)} 합친 수를 골라요.`,
        answer: problem.downNumber,
        answerChoiceId: downAnswerId,
        choices: shuffle(downChoices, rng),
        correctText: `남은 수 ${problem.carriedTens} + 일의 자리 ${problem.onesDigit} = ${problem.downNumber}`,
        reveal: String(problem.downNumber),
        advance: { mode: "timed", delayMs: 1600 }
      },
      {
        id: "ones",
        label: "일의 자리",
        action: "내린 수를 나눈 몫을 고른다",
        instruction: `${problem.downNumber} ÷ ${problem.divisor}의 몫을 골라요.`,
        answer: problem.onesQuotient,
        answerChoiceId: onesAnswerId,
        choices: shuffle(onesChoices, rng),
        correctText: `${problem.downNumber} ÷ ${problem.divisor} = ${problem.onesQuotient}`,
        reveal: String(problem.onesQuotient),
        advance: { mode: "complete" }
      }
    ];
  }

  function makeProblem(candidate, rng) {
    const problem = {
      ...candidate,
      prompt: `${candidate.dividend} ÷ ${candidate.divisor}`,
      finalExpression: `${candidate.dividend} ÷ ${candidate.divisor} = ${candidate.quotient}`
    };
    problem.steps = buildSteps(problem, rng);
    return problem;
  }

  function generateRun(seed = Date.now()) {
    const rng = createRng(seed);
    return shuffle(getProblemCandidates(), rng)
      .slice(0, TOTAL_PROBLEMS)
      .map((candidate) => makeProblem(candidate, rng));
  }

  function validateChoice(step, choice) {
    return Boolean(choice && choice.id === step.answerChoiceId);
  }

  function pickRewardEvent(rng, mistakeTouched) {
    if (mistakeTouched) {
      return {
        ...WRONG_REWARD_EVENT,
        amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max)
      };
    }
    let roll = Math.floor(rng() * 10000);
    for (const event of REWARD_EVENTS) {
      if (roll < event.weight) {
        return { ...event, amount: randomInt(rng, event.min, event.max) };
      }
      roll -= event.weight;
    }
    const fallback = REWARD_EVENTS[0];
    return { ...fallback, amount: randomInt(rng, fallback.min, fallback.max) };
  }

  function applyReward(state, event) {
    if (event.emptiesPower) {
      return { power: 0, specialSeen: state.specialSeen };
    }
    if (event.special) {
      return { power: MAX_POWER, specialSeen: true };
    }
    return {
      power: clamp(state.power + event.amount, MIN_POWER, MAX_POWER),
      specialSeen: state.specialSeen
    };
  }

  function getResult(power, correctFirstTry, specialSeen) {
    const special = RESULT_TIERS.find((result) => result.needsSpecial);
    if (specialSeen && special) return special;
    let current = RESULT_TIERS.find((result) => !result.needsSpecial) || RESULT_TIERS[0];
    for (const result of RESULT_TIERS) {
      if (result.needsSpecial) continue;
      if (power >= result.minPower && correctFirstTry >= result.minCorrect) current = result;
    }
    return current;
  }

  function getNextResult(result) {
    if (result?.needsSpecial) return result;
    const visible = RESULT_TIERS.filter((item) => !item.needsSpecial);
    const index = visible.findIndex((item) => item.id === result.id);
    if (index < 0) return result;
    return visible[Math.min(Math.max(index, 0) + 1, visible.length - 1)];
  }

  return {
    TOTAL_PROBLEMS,
    MIN_POWER,
    MAX_POWER,
    RESULT_TIERS,
    REWARD_EVENTS,
    WRONG_REWARD_EVENT,
    createRng,
    randomInt,
    shuffle,
    clamp,
    getProblemCandidates,
    generateRun,
    validateChoice,
    pickRewardEvent,
    applyReward,
    getResult,
    getNextResult
  };
})();
