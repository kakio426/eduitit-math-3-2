const Lesson6DataRangersModel = (() => {
      const TOTAL_PROBLEMS = 10;
      const MIN_POWER = 0;
      const MAX_POWER = 100;
      const BASE_CORRECT_POWER = 5;
      const TYPES_PER_RUN = LESSON_CONFIG.typesPerRun;
      const RESULT_TIERS = LESSON_CONFIG.results;
      const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
      const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;
      const LABELS = ["사과", "바나나", "포도", "딸기", "복숭아", "자두"];
      const COLORS = ["#ff6f91", "#ffd166", "#8b5cf6", "#35d9b2", "#ff9f1c", "#60d7ff"];
      function createRng(seed = 12345) { let value = seed >>> 0; return function rng() { value = (value + 0x6d2b79f5) >>> 0; let t = value; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
      function randomInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
      function shuffle(items, rng) { const copy = items.slice(); for (let index = copy.length - 1; index > 0; index -= 1) { const target = Math.floor(rng() * (index + 1)); const temp = copy[index]; copy[index] = copy[target]; copy[target] = temp; } return copy; }
      function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
      function uniqueChoices(values, rng, limit = 4) { const seen = new Set(); const unique = []; for (const value of values) { if (!seen.has(value) && value !== undefined && value !== null && value !== "") { seen.add(value); unique.push(value); } } return shuffle(unique.slice(0, limit), rng); }
      function formatCount(value) { return value + "개"; }
      function makeStep(id, prompt, slot, correct, choices, confirm) { return { id, prompt, slot, correct, choices, confirm }; }
      function makeRows(rng, serial) {
        const labels = shuffle(LABELS, rng).slice(0, 4);
        const counts = shuffle([3, 4, 5, 6, 7, 8, 9], rng).slice(0, 4);
        return labels.map((label, index) => ({ label, count: counts[index], color: COLORS[(serial + index) % COLORS.length] }));
      }
      function withVisual(rows, mode) { return { kind: "dataBoard", mode, title: mode === "graph" ? "그림그래프" : "자료표", rows }; }
      function mostRow(rows) { return rows.slice().sort((a, b) => b.count - a.count)[0]; }
      function smallestRow(rows) { return rows.slice().sort((a, b) => a.count - b.count)[0]; }
      function makeMost(type, rng, serial) {
        const mode = type === "mostGraph" ? "graph" : "table";
        const rows = makeRows(rng, serial);
        const answer = mostRow(rows);
        return {
          id: "most-" + serial,
          type,
          kind: mode === "graph" ? "그림그래프 읽기" : "표 읽기",
          prompt: "가장 많은 것은?",
          expression: answer.label + "가 가장 많아요.",
          visual: withVisual(rows, mode),
          finalText: answer.label,
          representativeMistake: smallestRow(rows).label,
          steps: [
            makeStep("most", "점이 가장 많은 줄을 골라요.", "가장 많은 것", answer.label, shuffle(rows.map((row) => row.label), rng), answer.label + "가 가장 많아요.")
          ]
        };
      }
      function makeRead(type, rng, serial) {
        const mode = type === "readGraph" ? "graph" : "table";
        const rows = makeRows(rng, serial);
        const target = rows[randomInt(rng, 0, rows.length - 1)];
        const wrongs = [target.count + 1, target.count - 1, target.count + 2, target.count - 2].map((value) => clamp(value, 1, 10));
        return {
          id: "read-" + serial,
          type,
          kind: mode === "graph" ? "그림그래프 읽기" : "표 읽기",
          prompt: target.label + "는 몇 개?",
          expression: target.label + "는 " + formatCount(target.count) + "예요.",
          visual: withVisual(rows, mode),
          finalText: formatCount(target.count),
          representativeMistake: formatCount(wrongs[0]),
          steps: [
            makeStep("read", target.label + " 줄의 점을 세요.", "개수", formatCount(target.count), uniqueChoices([formatCount(target.count), ...wrongs.map(formatCount)], rng), target.label + "는 " + formatCount(target.count) + "예요.")
          ]
        };
      }
      function makeDifference(type, rng, serial) {
        const mode = type === "differenceGraph" ? "graph" : "table";
        const rows = makeRows(rng, serial);
        const high = mostRow(rows);
        const low = smallestRow(rows);
        const diff = high.count - low.count;
        return {
          id: "difference-" + serial,
          type,
          kind: "차이 읽기",
          prompt: high.label + "와 " + low.label + " 차이는?",
          expression: high.label + "가 " + low.label + "보다 " + formatCount(diff) + " 많아요.",
          visual: withVisual(rows, mode),
          finalText: formatCount(diff),
          representativeMistake: formatCount(diff + 1),
          steps: [
            makeStep("difference", "많은 수에서 적은 수를 빼요.", "차이", formatCount(diff), uniqueChoices([formatCount(diff), formatCount(diff + 1), formatCount(Math.max(1, diff - 1)), formatCount(high.count), formatCount(low.count)], rng), "차이는 " + formatCount(diff) + "예요.")
          ]
        };
      }
      function makeProblem(type, rng, serial) { if (type === "readTable" || type === "readGraph") return makeRead(type, rng, serial); if (type === "differenceTable" || type === "differenceGraph") return makeDifference(type, rng, serial); return makeMost(type, rng, serial); }
      function generateRun(seed = 12345) { const rng = createRng(seed); return shuffle(TYPES_PER_RUN, rng).map((type, index) => makeProblem(type, rng, index + 1)); }
      function validateChoice(step, choice) { return step.correct === choice; }
      function pickRewardEvent(rng, mistakeTouched) { if (mistakeTouched) return Object.assign({}, WRONG_REWARD_EVENT, { amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max) }); let roll = Math.floor(rng() * 10000); for (const event of REWARD_EVENTS) { if (roll < event.weight) return Object.assign({}, event, { amount: randomInt(rng, event.min, event.max) }); roll -= event.weight; } const fallback = REWARD_EVENTS[0]; return Object.assign({}, fallback, { amount: randomInt(rng, fallback.min, fallback.max) }); }
      function applyReward(state, event, firstTry) { const before = state.power; const skillPower = firstTry ? BASE_CORRECT_POWER : 0; const power = clamp(before + skillPower + event.amount, MIN_POWER, MAX_POWER); return { power, correctFirstTry: state.correctFirstTry + (firstTry ? 1 : 0), specialSeen: state.specialSeen || Boolean(event.special), before, skillPower, event }; }
      function getResult(power, correctFirstTry, specialSeen) { for (let index = RESULT_TIERS.length - 1; index >= 0; index -= 1) { const result = RESULT_TIERS[index]; if (result.needsSpecial && !specialSeen) continue; if (power >= result.minPower && correctFirstTry >= result.minCorrect) return result; } return RESULT_TIERS[0]; }
      function getNextResult(result) { const index = RESULT_TIERS.findIndex(item => item.id === result.id); return RESULT_TIERS[Math.min(index + 1, RESULT_TIERS.length - 1)]; }
      return { TOTAL_PROBLEMS, MIN_POWER, MAX_POWER, BASE_CORRECT_POWER, TYPES_PER_RUN, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
    })();
