const Lesson5WaterFillModel = (() => {
      const TOTAL_PROBLEMS = 10;
      const MIN_POWER = 0;
      const MAX_POWER = 100;
      const TYPES_PER_RUN = LESSON_CONFIG.typesPerRun;
      const RESULT_TIERS = LESSON_CONFIG.results;
      const REWARD_EVENTS = LESSON_CONFIG.rewardEvents;
      const WRONG_REWARD_EVENT = LESSON_CONFIG.wrongEvent;
      function createRng(seed = 12345) { let value = seed >>> 0; return function rng() { value = (value + 0x6d2b79f5) >>> 0; let t = value; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
      function randomInt(rng, min, max) { return Math.floor(rng() * (max - min + 1)) + min; }
      function shuffle(items, rng) { const copy = items.slice(); for (let index = copy.length - 1; index > 0; index -= 1) { const target = Math.floor(rng() * (index + 1)); const temp = copy[index]; copy[index] = copy[target]; copy[target] = temp; } return copy; }
      function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }
      function uniqueChoices(values, rng, limit = 4) { const seen = new Set(); const unique = []; for (const value of values) { if (!seen.has(value) && value !== undefined && value !== null && value !== '') { seen.add(value); unique.push(value); } } return shuffle(unique.slice(0, limit), rng); }
      function formatMl(value) { return value + 'mL'; }
      function formatCapacity(totalMl) { if (totalMl < 1000) return totalMl + 'mL'; const liter = Math.floor(totalMl / 1000); const ml = totalMl % 1000; return ml === 0 ? liter + 'L' : liter + 'L ' + ml + 'mL'; }
      function toTotalMl(capacity) { return capacity.l * 1000 + capacity.ml; }
      function fromTotalMl(total) { return { l: Math.floor(total / 1000), ml: total % 1000 }; }
      function formatWeight(weight) { if (weight.t !== undefined) { if (weight.t === 0) return weight.kg + 'kg'; return weight.kg === 0 ? weight.t + 't' : weight.t + 't ' + weight.kg + 'kg'; } if (weight.kg !== undefined) return weight.g === 0 ? weight.kg + 'kg' : weight.kg + 'kg ' + weight.g + 'g'; return weight.g + 'g'; }
      function toTotalGrams(weight) { if (weight.t !== undefined) return weight.t * 1000000 + weight.kg * 1000; return weight.kg * 1000 + weight.g; }
      function fromTotalGrams(total) { return { kg: Math.floor(total / 1000), g: total % 1000 }; }
      const MISCONCEPTION_IDS = {
        readMl: 'READ_ML_SCALE',
        readLiterMl: 'READ_LITER_SCALE',
        compareBottle: 'COMPARE_BOTTLE_LEVEL',
        addMl: 'ADD_ML_TOTAL',
        addChange: 'ADD_LITER_EXCHANGE',
        addFinal: 'ADD_FINAL_TOTAL',
        borrowLiter: 'BORROW_LITER',
        subtractMl: 'SUBTRACT_ML',
        subtractFinal: 'SUBTRACT_FINAL',
        orderCheck: 'ORDER_COMPARE',
        compareKgG: 'COMPARE_KG_G',
        balanceMissing: 'BALANCE_MISSING',
        compareTonKg: 'COMPARE_TON_KG'
      };
      function choiceText(choice) { return String(choice && typeof choice === 'object' ? choice.value ?? choice.label ?? choice.id ?? '' : choice); }
      function parseCapacityText(text) { const source = String(text); const liters = Number(source.match(/(\d+)L/)?.[1] || 0); const milliliters = Number(source.match(/(\d+)mL/)?.[1] || 0); return liters * 1000 + milliliters; }
      function parseWeightText(text) { const source = String(text); const tons = Number(source.match(/(\d+)t/)?.[1] || 0); const kilograms = Number(source.match(/(\d+)kg/)?.[1] || 0); const grams = Number(source.match(/(\d+)g(?!\w)/)?.[1] || 0); return tons * 1000000 + kilograms * 1000 + grams; }
      function scaleFeedback(selected, correct) { const picked = parseCapacityText(selected); const answer = parseCapacityText(correct); return picked > answer ? '고른 눈금이 물높이보다 높아요.' : '고른 눈금이 물높이보다 낮아요.'; }
      function capacityGapFeedback(selected, correct) { const picked = parseCapacityText(selected); const answer = parseCapacityText(correct); return picked > answer ? '고른 수가 너무 커요. 계산판을 다시 봐요.' : '고른 수가 너무 작아요. 계산판을 다시 봐요.'; }
      function weightGapFeedback(selected, correct) { const picked = parseWeightText(selected); const answer = parseWeightText(correct); return picked > answer ? '고른 무게추가 너무 무거워요. 저울을 다시 봐요.' : '고른 무게추가 너무 가벼워요. 저울을 다시 봐요.'; }
      function misconceptionFeedback(id, selected, correct) {
        if (id === 'readMl' || id === 'readLiterMl') return scaleFeedback(selected, correct);
        if (id === 'compareBottle') {
          if (selected === '같아요') return '두 물높이가 서로 달라요.';
          return `${selected}의 물높이가 더 낮아요.`;
        }
        if (id === 'addMl') return capacityGapFeedback(selected, correct, '고른 mL 합');
        if (id === 'addChange') return capacityGapFeedback(selected, correct, '바꾼 들이');
        if (id === 'addFinal') return capacityGapFeedback(selected, correct, '고른 들이');
        if (id === 'borrowLiter') return capacityGapFeedback(selected, correct, '바꾼 위 들이');
        if (id === 'subtractMl') return capacityGapFeedback(selected, correct, '고른 mL 차');
        if (id === 'subtractFinal') return capacityGapFeedback(selected, correct, '고른 들이');
        if (id === 'orderCheck') {
          if (selected === '같아요') return '만든 양과 주문한 양이 서로 달라요.';
          return '만든 양과 주문한 양의 크기를 다시 비교해요.';
        }
        if (id === 'compareKgG') {
          if (selected === '같아요') return '두 저울의 무게가 서로 달라요.';
          return 'kg부터 비교하고, 같으면 g을 비교해요.';
        }
        if (id === 'balanceMissing') return weightGapFeedback(selected, correct);
        if (id === 'compareTonKg') {
          if (selected === '같아요') return '1t를 1000kg으로 바꾼 뒤 다시 비교해요.';
          return '1t를 1000kg으로 바꾸어 비교해요.';
        }
        return '고른 답과 계산판의 수를 다시 비교해요.';
      }
      function makeStep(id, prompt, slot, correct, choices, confirm) {
        const misconceptionId = MISCONCEPTION_IDS[id] || `${id.toUpperCase()}_WRONG`;
        const preparedChoices = choices.map((choice, index) => {
          const value = choiceText(choice);
          const base = { id: `${id}:${index}:${value}`, value, label: value };
          return value === String(correct) ? base : { ...base, misconceptionId, feedback: misconceptionFeedback(id, value, String(correct)) };
        });
        return {
          id,
          prompt,
          instruction: prompt,
          slot,
          preview: "?",
          correct,
          answer: correct,
          reveal: correct,
          choices: preparedChoices,
          confirm,
          correctText: confirm,
          wrongText: "고른 답과 계산판의 수를 다시 비교해요."
        };
      }
      function makeReadMl(rng, serial) { const amount = randomInt(rng, 1, 9) * 100; const wrong = formatMl(clamp(amount + (amount >= 600 ? -200 : 200), 100, 900)); return { id: 'read-ml-' + serial, type: 'readMl', kind: 'mL 눈금', prompt: '물통 눈금을 읽어 봐요.', expression: '눈금은 ' + formatMl(amount) + '예요.', visual: { kind: 'bottle', max: 1000, amount, label: '물통' }, finalText: formatMl(amount), representativeMistake: wrong, steps: [makeStep('readMl', '눈금이 가리키는 들이를 골라요.', '들이', formatMl(amount), uniqueChoices([formatMl(amount), wrong, formatMl(clamp(amount + 100, 100, 900)), formatMl(clamp(amount - 100, 100, 900)), formatMl(clamp(amount + 300, 100, 900))], rng), formatMl(amount) + '가 들어갔어요.')] }; }
      function makeReadLiterMl(rng, serial) { const amount = randomInt(rng, 11, 29) * 100; const wrongTotal = amount >= 2000 ? amount - 1000 : amount + 1000; const correct = formatCapacity(amount); const wrong = formatCapacity(wrongTotal); return { id: 'read-liter-' + serial, type: 'readLiterMl', kind: 'L와 mL 눈금', prompt: '큰 물통 눈금을 읽어 봐요.', expression: '눈금은 ' + correct + '예요.', visual: { kind: 'bottle', max: 3000, amount, label: '큰 물통' }, finalText: correct, representativeMistake: wrong, steps: [makeStep('readLiterMl', 'L와 mL를 함께 골라요.', '들이', correct, uniqueChoices([correct, wrong, formatCapacity(amount + 100), formatCapacity(amount - 100), formatCapacity(clamp(amount + 300, 1100, 2900))], rng), correct + '가 들어갔어요.')] }; }
      function makeCompareBottle(rng, serial) { let left = randomInt(rng, 4, 18) * 100; let right = randomInt(rng, 4, 18) * 100; const tied = rng() < 0.2; if (tied) right = left; else if (Math.abs(left - right) < 100) right = clamp(left + 300, 400, 1800); const correct = left === right ? '같아요' : left > right ? '왼쪽 물통' : '오른쪽 물통'; const wrong = correct === '왼쪽 물통' ? '오른쪽 물통' : '왼쪽 물통'; const confirm = correct === '같아요' ? '두 물통에 같은 만큼 들었어요.' : correct + '이 더 많아요.'; return { id: 'compare-bottle-' + serial, type: 'compareBottle', kind: '들이 비교', prompt: '두 물통 비교', expression: confirm, visual: { kind: 'compareBottle', left, right, max: 2000 }, finalText: correct, representativeMistake: wrong, steps: [makeStep('compareBottle', '더 많이 든 쪽이나 같은지를 골라요.', '비교 결과', correct, shuffle(['왼쪽 물통', '오른쪽 물통', '같아요'], rng), confirm)] }; }
      function makeAddCarryMl(rng, serial) { const left = { l: randomInt(rng, 1, 4), ml: randomInt(rng, 520, 940) }; const right = { l: randomInt(rng, 1, 3), ml: randomInt(rng, 520, 940) }; const mlSum = left.ml + right.ml; const literSum = left.l + right.l; const converted = fromTotalMl(mlSum); const final = fromTotalMl(toTotalMl(left) + toTotalMl(right)); const noCarry = literSum + 'L ' + mlSum + 'mL'; const correct = formatCapacity(toTotalMl(final)); return { id: 'add-ml-' + serial, type: 'addCarryMl', kind: '더하기 주문', prompt: formatCapacity(toTotalMl(left)) + ' + ' + formatCapacity(toTotalMl(right)), expression: formatCapacity(toTotalMl(left)) + ' + ' + formatCapacity(toTotalMl(right)) + ' = ' + correct, visual: { kind: 'mix', rows: [formatCapacity(toTotalMl(left)), '+', formatCapacity(toTotalMl(right))], note: '1000mL는 1L' }, left, right, mlSum, literSum, converted, final, finalText: correct, representativeMistake: noCarry, steps: [makeStep('addMl', 'mL끼리 더한 값을 골라요.', 'mL 합', formatMl(mlSum), uniqueChoices([formatMl(mlSum), formatMl(mlSum - 1000), formatMl(mlSum - 100), formatMl(mlSum + 100)], rng), formatMl(mlSum) + '가 들어갔어요.'), makeStep('addChange', '1000mL를 1L로 바꿔요.', '바꾼 들이', formatCapacity(mlSum), uniqueChoices([formatCapacity(mlSum), formatMl(converted.ml), '1L ' + (converted.ml + 100) + 'mL', '0L ' + mlSum + 'mL'], rng), formatCapacity(mlSum) + '가 되었어요.'), makeStep('addFinal', '다 더한 들이를 골라요.', '완성 들이', correct, uniqueChoices([correct, noCarry, literSum + 'L ' + final.ml + 'mL', (final.l + 1) + 'L ' + final.ml + 'mL'], rng), correct + '가 맞아요.')] }; }
      function makeSubtractBorrowMl(rng, serial) { const top = { l: randomInt(rng, 3, 8), ml: randomInt(rng, 100, 420) }; const bottom = { l: randomInt(rng, 1, top.l - 1), ml: randomInt(rng, top.ml + 160, 960) }; const borrowedTop = { l: top.l - 1, ml: top.ml + 1000 }; const mlDiff = borrowedTop.ml - bottom.ml; const final = fromTotalMl(toTotalMl(top) - toTotalMl(bottom)); const noBorrow = (top.l - bottom.l) + 'L ' + Math.abs(top.ml - bottom.ml) + 'mL'; const correct = formatCapacity(toTotalMl(final)); return { id: 'subtract-ml-' + serial, type: 'subtractBorrowMl', kind: '빼기 주문', prompt: formatCapacity(toTotalMl(top)) + ' - ' + formatCapacity(toTotalMl(bottom)), expression: formatCapacity(toTotalMl(top)) + ' - ' + formatCapacity(toTotalMl(bottom)) + ' = ' + correct, visual: { kind: 'mix', rows: [formatCapacity(toTotalMl(top)), '-', formatCapacity(toTotalMl(bottom))], note: '1L를 1000mL로' }, top, bottom, borrowedTop, mlDiff, final, finalText: correct, representativeMistake: noBorrow, steps: [makeStep('borrowLiter', '1L를 1000mL로 바꿔요.', '바뀐 위 들이', borrowedTop.l + 'L ' + borrowedTop.ml + 'mL', uniqueChoices([borrowedTop.l + 'L ' + borrowedTop.ml + 'mL', top.l + 'L ' + (top.ml + 1000) + 'mL', (top.l - 1) + 'L ' + top.ml + 'mL', (top.l - 2) + 'L ' + (top.ml + 1000) + 'mL'], rng), borrowedTop.l + 'L ' + borrowedTop.ml + 'mL로 바뀌었어요.'), makeStep('subtractMl', 'mL끼리 뺀 값을 골라요.', 'mL 차', formatMl(mlDiff), uniqueChoices([formatMl(mlDiff), formatMl(Math.abs(top.ml - bottom.ml)), formatMl(mlDiff + 100), formatMl(Math.max(0, mlDiff - 100))], rng), formatMl(mlDiff) + '가 남았어요.'), makeStep('subtractFinal', '다 뺀 뒤의 들이를 골라요.', '완성 들이', correct, uniqueChoices([correct, noBorrow, (final.l + 1) + 'L ' + final.ml + 'mL', final.l + 'L ' + Math.min(final.ml + 100, 990) + 'mL'], rng), correct + '가 남았어요.')] }; }
      function makeOrderCheck(rng, serial) { const made = { l: randomInt(rng, 1, 5), ml: randomInt(rng, 100, 900) }; const madeTotal = toTotalMl(made); const tied = rng() < 0.2; const enough = rng() > 0.45; const offset = tied ? 0 : enough ? -randomInt(rng, 100, 500) : randomInt(rng, 100, 500); const orderTotal = clamp(madeTotal + offset, 700, 6900); const order = fromTotalMl(orderTotal); const fitsOrder = madeTotal >= orderTotal; const correct = madeTotal === orderTotal ? '같아요' : madeTotal > orderTotal ? '주문보다 많아요' : '주문보다 적어요'; const wrong = correct === '주문보다 많아요' ? '주문보다 적어요' : '주문보다 많아요'; return { id: 'order-check-' + serial, type: 'orderCheck', kind: '주문 확인', prompt: '만든 양 ' + formatCapacity(madeTotal) + ' · 주문 ' + formatCapacity(orderTotal), expression: correct + '.', visual: { kind: 'mix', rows: [formatCapacity(madeTotal), '↔', formatCapacity(orderTotal)], note: '주문과 비교' }, made, order, fitsOrder, final: made, finalText: correct, representativeMistake: wrong, steps: [makeStep('orderCheck', '주문에 맞는 말을 골라요.', '주문 확인', correct, shuffle(['주문보다 많아요', '주문보다 적어요', '같아요'], rng), correct + '.')] }; }
      function makeCompareKgG(rng, serial) { let left = { kg: randomInt(rng, 1, 6), g: randomInt(rng, 100, 900) }; let right = { kg: randomInt(rng, 1, 6), g: randomInt(rng, 100, 900) }; const tied = rng() < 0.2; if (tied) right = { ...left }; else if (Math.abs(toTotalGrams(left) - toTotalGrams(right)) < 100) right = fromTotalGrams(clamp(toTotalGrams(left) + 400, 1000, 7900)); const leftWeight = toTotalGrams(left); const rightWeight = toTotalGrams(right); const correct = leftWeight === rightWeight ? '같아요' : leftWeight > rightWeight ? '왼쪽' : '오른쪽'; const wrong = correct === '왼쪽' ? '오른쪽' : '왼쪽'; const confirm = correct === '같아요' ? '양쪽 무게가 같아요.' : correct + '이 더 무거워요.'; return { id: 'compare-weight-' + serial, type: 'compareKgG', kind: '무게 비교', prompt: formatWeight(left) + ' · ' + formatWeight(right), expression: confirm, visual: { kind: 'scale', left: formatWeight(left), right: formatWeight(right), tilt: correct === '같아요' ? '0deg' : correct === '왼쪽' ? '-4deg' : '4deg' }, left, right, finalText: correct, representativeMistake: wrong, steps: [makeStep('compareKgG', '더 무거운 쪽이나 같은지를 골라요.', '비교 결과', correct, shuffle(['왼쪽', '오른쪽', '같아요'], rng), confirm)] }; }
      function makeBalanceMissing(rng, serial) { const left = { kg: randomInt(rng, 1, 5), g: randomInt(rng, 100, 800) }; const missing = randomInt(rng, 1, 8) * 100; const targetTotal = toTotalGrams(left) + missing; const target = fromTotalGrams(targetTotal); const correct = formatMl(missing).replace('mL','g'); return { id: 'balance-missing-' + serial, type: 'balanceMissing', kind: '저울 균형', prompt: formatWeight(left) + ' + ? = ' + formatWeight(target), expression: formatWeight(left) + ' + ' + correct + ' = ' + formatWeight(target), visual: { kind: 'scale', left: formatWeight(left) + ' + ?', right: formatWeight(target), tilt: '-2deg' }, left, target, missing, finalText: correct, representativeMistake: formatMl(Math.max(100, missing + 200)).replace('mL','g'), steps: [makeStep('balanceMissing', '저울을 맞출 무게추를 골라요.', '무게추', correct, uniqueChoices([correct, formatMl(Math.max(100, missing + 200)).replace('mL','g'), formatMl(Math.max(100, missing - 100)).replace('mL','g'), formatWeight(fromTotalGrams(missing + 1000))], rng), correct + '을 올리면 맞아요.')] }; }
      function makeCompareTonKg(rng, serial) { const ton = { t: 1, kg: randomInt(rng, 0, 2) * 100 }; const tied = rng() < 0.2; const kgOnly = { t: 0, kg: tied ? 1000 + ton.kg : randomInt(rng, 850, 1250) }; if (!tied && kgOnly.kg === 1000 + ton.kg) kgOnly.kg += kgOnly.kg <= 1150 ? 100 : -100; const leftIsTon = rng() > 0.5; const left = leftIsTon ? ton : kgOnly; const right = leftIsTon ? kgOnly : ton; const leftWeight = toTotalGrams(left); const rightWeight = toTotalGrams(right); const correct = leftWeight === rightWeight ? '같아요' : leftWeight > rightWeight ? '왼쪽' : '오른쪽'; const wrong = correct === '왼쪽' ? '오른쪽' : '왼쪽'; const confirm = correct === '같아요' ? '양쪽 무게가 같아요.' : correct + '이 더 무거워요.'; return { id: 'compare-ton-' + serial, type: 'compareTonKg', kind: 't와 kg 비교', prompt: formatWeight(left) + ' · ' + formatWeight(right), expression: confirm, visual: { kind: 'scale', left: formatWeight(left), right: formatWeight(right), tilt: correct === '같아요' ? '0deg' : correct === '왼쪽' ? '-5deg' : '5deg' }, left, right, finalText: correct, representativeMistake: wrong, steps: [makeStep('compareTonKg', '더 무거운 쪽이나 같은지를 골라요.', '비교 결과', correct, shuffle(['왼쪽', '오른쪽', '같아요'], rng), confirm)] }; }
      function makeProblem(type, rng, serial) { if (type === 'readMl') return makeReadMl(rng, serial); if (type === 'readLiterMl') return makeReadLiterMl(rng, serial); if (type === 'compareBottle') return makeCompareBottle(rng, serial); if (type === 'addCarryMl') return makeAddCarryMl(rng, serial); if (type === 'subtractBorrowMl') return makeSubtractBorrowMl(rng, serial); if (type === 'orderCheck') return makeOrderCheck(rng, serial); if (type === 'compareKgG') return makeCompareKgG(rng, serial); if (type === 'balanceMissing') return makeBalanceMissing(rng, serial); return makeCompareTonKg(rng, serial); }
      function generateRun(seed = 12345) {
        const rng = createRng(seed);
        return shuffle(TYPES_PER_RUN, rng).map((type, index) => {
          const problem = makeProblem(type, rng, index + 1);
          return Object.assign(problem, { finalExpression: problem.expression });
        });
      }
      function validateChoice(step, choice) { return String(step.correct) === choiceText(choice); }
      function pickRewardEvent(rng, mistakeTouched) { if (mistakeTouched) return Object.assign({}, WRONG_REWARD_EVENT, { amount: randomInt(rng, WRONG_REWARD_EVENT.min, WRONG_REWARD_EVENT.max) }); let roll = Math.floor(rng() * 10000); for (const event of REWARD_EVENTS) { if (roll < event.weight) return Object.assign({}, event, { amount: randomInt(rng, event.min, event.max) }); roll -= event.weight; } const fallback = REWARD_EVENTS[0]; return Object.assign({}, fallback, { amount: randomInt(rng, fallback.min, fallback.max) }); }
      function applyReward(state, event) { const before = state.power; const power = clamp(before + event.amount, MIN_POWER, MAX_POWER); return { power, specialSeen: state.specialSeen || Boolean(event.special), before, event }; }
      function getResult(power, correctFirstTry, specialSeen) { for (let index = RESULT_TIERS.length - 1; index >= 0; index -= 1) { const result = RESULT_TIERS[index]; if (result.needsSpecial && !specialSeen) continue; if (power >= result.minPower && correctFirstTry >= result.minCorrect) return result; } return RESULT_TIERS[0]; }
      function getNextResult(result) { const index = RESULT_TIERS.findIndex(item => item.id === result.id); return RESULT_TIERS[Math.min(index + 1, RESULT_TIERS.length - 1)]; }
      return { TOTAL_PROBLEMS, MIN_POWER, MAX_POWER, TYPES_PER_RUN, RESULT_TIERS, REWARD_EVENTS, WRONG_REWARD_EVENT, createRng, randomInt, shuffle, clamp, formatMl, formatCapacity, toTotalMl, fromTotalMl, formatWeight, toTotalGrams, fromTotalGrams, generateRun, validateChoice, pickRewardEvent, applyReward, getResult, getNextResult };
    })();
