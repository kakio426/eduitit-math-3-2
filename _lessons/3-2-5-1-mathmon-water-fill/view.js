function renderBottleScale(max) {
  const divisions = Math.round(max / 100);
  return Array.from({ length: divisions + 1 }, (_, index) => {
    const value = index * 100;
    const major = value % 1000 === 0;
    const label = value === 0 ? '0' : value / 1000 + 'L';
    return '<span class="bottle-tick' + (major ? ' is-major' : '') + '" style="--tick:' + (value / max) * 100 + '%">' + (major ? '<span class="bottle-scale-label">' + label + '</span>' : '') + '</span>';
  }).join('');
}

function solvedStepSet() {
  const source = ui.visualArea.querySelector('.capacity-visual')?.dataset.solvedSteps || '';
  return new Set(source.split(',').filter(Boolean));
}

function capacityRow(operator, liter, ml, className = '', ariaLabel = '') {
  const safeLiter = liter === '' || liter == null ? '&nbsp;' : liter;
  const safeMl = ml === '' || ml == null ? '&nbsp;' : ml;
  return '<div class="capacity-calc-row ' + className + '"' + (ariaLabel ? ' aria-label="' + ariaLabel + '"' : '') + '><span class="capacity-calc-operator">' + (operator || '') + '</span><span class="capacity-liter-slot">' + safeLiter + '</span><span class="capacity-ml-slot">' + safeMl + '</span></div>';
}

function relationForProblem(problem) {
  if (problem.type === 'orderCheck') {
    const made = problem.made.l * 1000 + problem.made.ml;
    const order = problem.order.l * 1000 + problem.order.ml;
    return made === order ? '=' : made > order ? '>' : '<';
  }
  if (problem.type === 'compareBottle') return problem.visual.left === problem.visual.right ? '=' : problem.visual.left > problem.visual.right ? '>' : '<';
  if (problem.type === 'compareKgG' || problem.type === 'compareTonKg') {
    const total = (weight) => weight.t !== undefined ? weight.t * 1000000 + weight.kg * 1000 : weight.kg * 1000 + weight.g;
    return total(problem.left) === total(problem.right) ? '=' : total(problem.left) > total(problem.right) ? '>' : '<';
  }
  return '=';
}

function renderPlaceValueBoard(problem, solved) {
  const subtract = problem.type === 'subtractBorrowMl';
  const borrowed = subtract && solved.has('borrowLiter');
  let result = '';
  let note = '';
  if (!subtract && solved.has('addFinal')) {
    result = capacityRow('=', problem.final.l, problem.final.ml, 'capacity-result-row', problem.final.l + 'L ' + problem.final.ml + 'mL');
    note = '완성 들이';
  } else if (!subtract && solved.has('addChange')) {
    result = capacityRow('=', problem.final.l, problem.final.ml, 'capacity-result-row', problem.final.l + 'L ' + problem.final.ml + 'mL');
    note = '1000mL를 1L로 바꾼 값';
  } else if (!subtract && solved.has('addMl')) {
    result = capacityRow('=', problem.literSum, problem.mlSum, 'capacity-result-row', problem.literSum + 'L ' + problem.mlSum + 'mL');
    note = 'L끼리, mL끼리 더한 값';
  } else if (subtract && solved.has('subtractFinal')) {
    result = capacityRow('=', problem.final.l, problem.final.ml, 'capacity-result-row', problem.final.l + 'L ' + problem.final.ml + 'mL');
    note = '완성 들이';
  } else if (subtract && solved.has('subtractMl')) {
    result = capacityRow('=', '', problem.mlDiff, 'capacity-result-row', 'mL 차 ' + problem.mlDiff + 'mL');
    note = 'mL끼리 뺀 값';
  }
  const top = subtract ? problem.top : problem.left;
  const bottom = subtract ? problem.bottom : problem.right;
  const annotation = borrowed
    ? capacityRow('', problem.borrowedTop.l, problem.borrowedTop.ml, 'capacity-borrow-row', '1L를 빌리면 ' + problem.borrowedTop.l + 'L ' + problem.borrowedTop.ml + 'mL')
    : '';
  return '<div class="calculation-board place-value-board" data-answer-count="' + solved.size + '"><div class="capacity-board-title">계산판</div>'
    + capacityRow('', 'L', 'mL', 'capacity-columns-header')
    + annotation
    + capacityRow('', top.l, top.ml, borrowed ? 'capacity-source-row' : '', '처음 들이 ' + top.l + 'L ' + top.ml + 'mL')
    + capacityRow(subtract ? '−' : '+', bottom.l, bottom.ml, '', bottom.l + 'L ' + bottom.ml + 'mL')
    + '<div class="capacity-calc-rule"></div>' + result
    + (note ? '<div class="capacity-result-note">' + note + '</div>' : '') + '</div>';
}

function renderRelationBoard(problem, solved) {
  const done = problem.steps.every((step) => solved.has(step.id));
  const sign = done ? relationForProblem(problem) : '?';
  let left = '왼쪽';
  let right = '오른쪽';
  if (problem.type === 'orderCheck') {
    left = problem.visual.rows[0];
    right = problem.visual.rows[2];
  } else if (problem.type === 'balanceMissing') {
    const answer = done ? problem.finalText : '?';
    return '<div class="calculation-board relation-board" data-answer-count="' + (done ? 1 : 0) + '"><div class="capacity-board-title">균형식</div><div class="relation-equation"><span>' + problem.visual.left.replace('?', answer) + '</span><strong>=</strong><span>' + problem.visual.right + '</span></div></div>';
  }
  return '<div class="calculation-board relation-board" data-answer-count="' + (done ? 1 : 0) + '"><div class="capacity-board-title">비교판</div><div class="relation-equation"><span>' + left + '</span><strong class="relation-answer">' + sign + '</strong><span>' + right + '</span></div></div>';
}

function renderReadBoard(problem, solved) {
  const done = problem.steps.every((step) => solved.has(step.id));
  return '<div class="calculation-board read-board" data-answer-count="' + (done ? 1 : 0) + '"><div class="capacity-board-title">눈금 읽기</div><div class="read-equation"><span>한 눈금</span><strong>100mL</strong><span>읽은 들이</span><strong class="read-answer">' + (done ? problem.finalText : '?') + '</strong></div></div>';
}

function renderCalculationBoard(problem, solved) {
  if (problem.type === 'addCarryMl' || problem.type === 'subtractBorrowMl') return renderPlaceValueBoard(problem, solved);
  if (problem.type === 'readMl' || problem.type === 'readLiterMl') return renderReadBoard(problem, solved);
  return renderRelationBoard(problem, solved);
}

function renderCapacityVisual(problem, solved) {
  const visual = problem.visual || {};
  const wrapper = document.createElement('div');
  wrapper.className = 'capacity-visual';
  wrapper.dataset.solvedSteps = [...solved].join(',');
  let scene = '';
  if (visual.kind === 'bottle') {
    scene = '<div class="capacity-scene bottle-wrap"><div class="compare-label"><div class="bottle bottle-with-scale" style="--fill:' + Math.round((visual.amount / visual.max) * 100) + '%"><div class="water-fill"></div>' + renderBottleScale(visual.max) + '</div><div class="bottle-label">한 눈금은 100mL</div></div></div>';
  } else if (visual.kind === 'compareBottle') {
    scene = '<div class="capacity-scene bottle-wrap"><div class="compare-label"><div class="bottle" style="--fill:' + Math.round((visual.left / visual.max) * 100) + '%"><div class="water-fill"></div><span class="tick" style="--tick:50%"></span></div><div class="bottle-label">왼쪽</div></div><div class="compare-label"><div class="bottle" style="--fill:' + Math.round((visual.right / visual.max) * 100) + '%"><div class="water-fill"></div><span class="tick" style="--tick:50%"></span></div><div class="bottle-label">오른쪽</div></div></div>';
  } else if (visual.kind === 'mix') {
    scene = '<div class="capacity-scene mix-visual"><div class="mix-row"><div class="mix-cup">' + visual.rows[0] + '</div><div class="mix-symbol">' + visual.rows[1] + '</div><div class="mix-cup">' + visual.rows[2] + '</div></div><div class="mix-note">' + visual.note + '</div></div>';
  } else if (visual.kind === 'scale') {
    scene = '<div class="capacity-scene scale-visual"><div class="scale-beam" data-target-tilt="' + visual.tilt + '" style="--tilt:' + visual.tilt + '"></div><div class="scale-pans"><div class="scale-pan"><div><strong>왼쪽</strong><span>' + visual.left + '</span></div></div><div class="scale-pan"><div><strong>오른쪽</strong><span>' + visual.right + '</span></div></div></div></div>';
  }
  wrapper.innerHTML = scene + renderCalculationBoard(problem, solved);
  ui.visualArea.replaceChildren(wrapper);
}

function renderProblemVisual(problem) {
  renderCapacityVisual(problem, new Set());
}

function updateProblemVisualForStep(problem) {
  renderCapacityVisual(problem, solvedStepSet());
}

function revealCorrectStep(problem, step) {
  const solved = solvedStepSet();
  solved.add(step.id);
  renderCapacityVisual(problem, solved);
}

function renderAttempt(problem, step, choice, state, { correct }) {
  const visual = ui.visualArea.querySelector('.capacity-visual');
  if (!visual) return;
  visual.querySelector('.visual-attempt-note')?.remove();
  visual.dataset.state = correct ? 'correct' : 'wrong';
  if (correct) {
    const beam = visual.querySelector('.scale-beam');
    if (beam?.dataset.targetTilt) beam.style.setProperty('--tilt', beam.dataset.targetTilt);
    return;
  }
  const value = choice && typeof choice === 'object' ? choice.label ?? choice.value ?? '' : choice;
  const beam = visual.querySelector('.scale-beam');
  if (beam) {
    const picked = String(value);
    const wrongTilt = picked.includes('왼쪽') ? '-3deg' : picked.includes('오른쪽') ? '3deg' : '0deg';
    beam.style.setProperty('--tilt', wrongTilt);
    beam.classList.remove('is-wrong-attempt');
    void beam.offsetWidth;
    beam.classList.add('is-wrong-attempt');
  }
  const note = document.createElement('div');
  note.className = 'visual-attempt-note is-wrong';
  note.textContent = '고른 답: ' + value;
  visual.append(note);
}
