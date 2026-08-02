let waterPlayProgress = null;
let pendingWaterRewardImpact = null;
let waterRewardArtPrimed = false;
const waterRewardPreloads = [];

function topicParticle(value) {
  const last = String(value || '').trim().at(-1) || '';
  const code = last.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? '은' : '는';
}

function ensureWaterPlayProgress() {
  const playScreen = document.getElementById('screen-play');
  if (!playScreen) return null;
  if (waterPlayProgress?.panel?.isConnected) return waterPlayProgress;

  const imageSet = LESSON_CONFIG.workbench?.playStateImageSet || {};
  if (imageSet.standard !== 'generated-play-progress-v3-left-character' || !LESSON_CONFIG.results.some((result) => result.playImage)) return null;
  document.querySelector('.game')?.classList.add('has-play-progress');
  const panel = document.createElement('aside');
  panel.className = 'water-play-progress';
  panel.dataset.playProgressStandard = imageSet.standard || '';
  panel.dataset.protagonist = imageSet.protagonist || '';
  panel.dataset.cacheVersion = imageSet.cacheVersion || '';

  const art = document.createElement('img');
  art.className = 'water-play-progress-art';
  art.alt = '';
  art.setAttribute('aria-hidden', 'true');

  const flare = document.createElement('span');
  flare.className = 'water-play-progress-flare';
  flare.setAttribute('aria-hidden', 'true');

  const impactStage = document.createElement('span');
  impactStage.className = 'water-play-progress-impact-stage';
  impactStage.setAttribute('aria-hidden', 'true');

  const readout = document.createElement('div');
  readout.className = 'water-play-progress-readout';
  const eyebrow = document.createElement('span');
  eyebrow.className = 'water-play-progress-eyebrow';
  eyebrow.textContent = LESSON_CONFIG.playProgressEyebrow || `지금의 ${LESSON_CONFIG.rewardThing || '보상'}`;
  const name = document.createElement('strong');
  name.className = 'water-play-progress-name';
  const meter = document.createElement('span');
  meter.className = 'water-play-progress-meter';
  meter.setAttribute('role', 'progressbar');
  meter.setAttribute('aria-valuemin', '0');
  meter.setAttribute('aria-valuemax', String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement('i');
  meterFill.className = 'water-play-progress-meter-fill';
  meter.appendChild(meterFill);
  readout.append(eyebrow, name, meter);
  panel.append(art, flare, readout);
  playScreen.append(panel, impactStage);
  waterPlayProgress = { panel, art, flare, impactStage, name, meter, meterFill };
  return waterPlayProgress;
}

function syncWaterPlayProgress(state, options = {}) {
  const progress = ensureWaterPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson5WaterFillModel.getResult(
    Number(state.power || 0),
    Number(state.correctFirstTry || 0),
    Boolean(state.specialSeen)
  );
  const maxPower = Number(LESSON_CONFIG.reward?.maxPower || 100);
  const power = Math.max(0, Math.min(Number(state.power || 0), maxPower));
  const nextSrc = result.playImage || '';
  const previousPower = Number(progress.panel.dataset.power || 0);
  const previousTier = progress.panel.dataset.resultTier || '';
  const changed = progress.art.getAttribute('src') !== nextSrc;
  const tierChanged = Boolean(previousTier && previousTier !== result.id);

  progress.panel.dataset.resultTier = result.id;
  progress.panel.dataset.power = String(power);
  progress.name.textContent = result.name;
  progress.meter.setAttribute('aria-valuenow', String(power));
  progress.meterFill.style.width = `${power / maxPower * 100}%`;
  const progressLabel = LESSON_CONFIG.progressLabel || '진행';
  progress.panel.setAttribute('aria-label', `지금은 ${result.name}이에요. ${progressLabel}${topicParticle(progressLabel)} ${power}이에요.`);
  if (changed) progress.art.src = nextSrc;

  const delta = Number(options.delta ?? (power - previousPower));
  const shouldAnimate = options.animate === true && (changed || delta !== 0);
  progress.panel.classList.remove('is-changing', 'is-dimming', 'is-celebrating', 'is-tier-up');
  progress.panel.dataset.effectPhase = 'idle';
  progress.panel.dataset.effectKind = 'none';
  if (shouldAnimate) {
    void progress.panel.offsetWidth;
    progress.panel.classList.add(delta < 0 ? 'is-dimming' : 'is-changing');
    if (options.celebrate === true && delta > 0) progress.panel.classList.add('is-celebrating');
    if (tierChanged && delta > 0) progress.panel.classList.add('is-tier-up');
    progress.panel.dataset.effectPhase = 'active';
    progress.panel.dataset.effectKind = tierChanged && delta > 0 ? 'tier-up' : delta > 0 ? 'gain' : delta < 0 ? 'loss' : 'none';
    progress.panel.dataset.effectStartedAt = String(performance.now());
    if (options.afterModalDismiss === true) {
      progress.panel.dataset.effectStartedWithModalHidden = String(document.getElementById('rewardPop')?.hidden === true);
    }
  }

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const duration = shouldAnimate && !reducedMotion
    ? Number(LESSON_CONFIG.qa?.rewardEffectAudit?.durationMs || 1560)
    : 0;
  if (!duration) return Promise.resolve();
  return new Promise((resolve) => {
    window.setTimeout(() => {
      progress.panel?.classList.remove('is-changing', 'is-dimming', 'is-celebrating', 'is-tier-up');
      if (progress.panel) progress.panel.dataset.effectPhase = 'idle';
      resolve();
    }, duration);
  });
}

function primeWaterRewardArt() {
  if (waterRewardArtPrimed || typeof Image === 'undefined') return;
  waterRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    waterRewardPreloads.push(image);
  });
}

function waitForWaterProgress(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingWaterRewardImpact = { event, delta: afterPower - beforePower };
}

async function onRewardDismiss({ state }) {
  const impact = pendingWaterRewardImpact;
  pendingWaterRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncWaterPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensureWaterPlayProgress();
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preEffectDelay = reducedMotion
    ? Math.min(140, Number(effectConfig.preEffectDelayMs || 0))
    : Number(effectConfig.preEffectDelayMs || 0);
  if (progress?.panel && preEffectDelay > 0) {
    progress.panel.dataset.effectPhase = 'arming';
    progress.panel.dataset.effectKind = impact.delta > 0 ? 'gain-arming' : 'loss-arming';
    progress.panel.dataset.effectArmedAt = String(performance.now());
    progress.panel.dataset.effectStartedWithModalHidden = String(document.getElementById('rewardPop')?.hidden === true);
    await waitForWaterProgress(preEffectDelay);
  }
  return syncWaterPlayProgress(state, {
    animate: true,
    celebrate: impact.delta > 0,
    delta: impact.delta,
    afterModalDismiss: true,
  });
}

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
    result = capacityRow('=', problem.converted.l, problem.converted.ml, 'capacity-result-row', problem.converted.l + 'L ' + problem.converted.ml + 'mL');
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

function renderCapacityVisual(problem, solved, state = null) {
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
    const currentStepId = problem.steps?.[state?.stepIndex || 0]?.id || '';
    const conversionStepId = problem.type === 'addCarryMl' ? 'addChange' : problem.type === 'subtractBorrowMl' ? 'borrowLiter' : '';
    const isConversionCalculation = Boolean(conversionStepId);
    const showNote = !isConversionCalculation || currentStepId === conversionStepId;
    if (isConversionCalculation) {
      scene = showNote
        ? '<div class="capacity-scene mix-visual mix-hint-only"><div class="mix-note">' + visual.note + '</div></div>'
        : '';
    } else {
      scene = '<div class="capacity-scene mix-visual"><div class="mix-row"><div class="mix-cup">' + visual.rows[0] + '</div><div class="mix-symbol">' + visual.rows[1] + '</div><div class="mix-cup">' + visual.rows[2] + '</div></div><div class="mix-note">' + visual.note + '</div></div>';
    }
  } else if (visual.kind === 'scale') {
    scene = '<div class="capacity-scene scale-visual"><div class="scale-beam" data-target-tilt="' + visual.tilt + '" style="--tilt:0deg"></div><div class="scale-pans"><div class="scale-pan"><div><strong>왼쪽</strong><span>' + visual.left + '</span></div></div><div class="scale-pan"><div><strong>오른쪽</strong><span>' + visual.right + '</span></div></div></div></div>';
  }
  wrapper.innerHTML = scene + renderCalculationBoard(problem, solved);
  ui.visualArea.replaceChildren(wrapper);
}

function renderProblemVisual(problem, state) {
  syncWaterPlayProgress(state);
  renderCapacityVisual(problem, new Set(), state);
}

function updateProblemVisualForStep(problem, step, state) {
  syncWaterPlayProgress(state);
  renderCapacityVisual(problem, solvedStepSet(), state);
}

function revealCorrectStep(problem, step, state) {
  syncWaterPlayProgress(state);
  const solved = solvedStepSet();
  solved.add(step.id);
  renderCapacityVisual(problem, solved, state);
}

function onProblemComplete({ problem }) {
  const mathTypes = new Set(['addCarryMl', 'subtractBorrowMl', 'balanceMissing']);
  ui.completeText.dataset.textAlignRole = mathTypes.has(problem.type) ? 'math' : 'sentence';
}

function renderAttempt(problem, step, choice, state, { correct }) {
  syncWaterPlayProgress(state);
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

globalThis.onRewardReveal = onRewardReveal;
globalThis.onRewardDismiss = onRewardDismiss;
globalThis.__playProgressQa = {
  syncProgress() {
    return syncWaterPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = waterPlayProgress?.impactStage?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingWaterRewardImpact?.delta ?? null,
      panelClasses: waterPlayProgress?.panel?.className || '',
      effectPhase: waterPlayProgress?.panel?.dataset.effectPhase || 'idle',
      effectKind: waterPlayProgress?.panel?.dataset.effectKind || 'none',
      effectArmedAt: waterPlayProgress?.panel?.dataset.effectArmedAt || '',
      effectStartedAt: waterPlayProgress?.panel?.dataset.effectStartedAt || '',
      effectStartedWithModalHidden: waterPlayProgress?.panel?.dataset.effectStartedWithModalHidden || '',
      resultTier: waterPlayProgress?.panel?.dataset.resultTier || '',
      imageSrc: waterPlayProgress?.art?.getAttribute('src') || '',
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;
primeWaterRewardArt();
