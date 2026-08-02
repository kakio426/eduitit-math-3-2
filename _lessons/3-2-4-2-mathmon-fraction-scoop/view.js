const SCOOP_SVG_NS = "http://www.w3.org/2000/svg";
let basketPlayProgress = null;
let pendingBasketRewardImpact = null;
let basketRewardArtPrimed = false;
const basketRewardPreloads = [];

function ensureBasketPlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (basketPlayProgress?.panel?.isConnected) return basketPlayProgress;
  const imageSet = LESSON_CONFIG.workbench?.playStateImageSet || {};
  if (imageSet.standard !== "generated-play-progress-v3-left-character") return null;

  document.querySelector(".game")?.classList.add("has-play-progress");
  const panel = document.createElement("aside");
  panel.className = "basket-play-progress";
  panel.dataset.playProgressStandard = imageSet.standard || "";
  panel.dataset.protagonist = imageSet.protagonist || "";
  panel.dataset.cacheVersion = imageSet.cacheVersion || "";

  const art = document.createElement("img");
  art.className = "basket-play-progress-art";
  art.alt = "";
  art.decoding = "async";
  art.setAttribute("aria-hidden", "true");

  const flare = document.createElement("span");
  flare.className = "basket-play-progress-flare";
  flare.setAttribute("aria-hidden", "true");

  const stageImpact = document.createElement("span");
  stageImpact.className = "basket-play-progress-impact-stage";
  stageImpact.setAttribute("aria-hidden", "true");

  const readout = document.createElement("div");
  readout.className = "basket-play-progress-readout";
  const eyebrow = document.createElement("span");
  eyebrow.className = "basket-play-progress-eyebrow";
  eyebrow.textContent = "지금 모습";
  const name = document.createElement("strong");
  name.className = "basket-play-progress-name";
  const meter = document.createElement("span");
  meter.className = "basket-play-progress-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("i");
  meterFill.className = "basket-play-progress-meter-fill";
  meter.appendChild(meterFill);
  readout.append(eyebrow, name, meter);
  panel.append(art, flare, readout);
  playScreen.append(panel, stageImpact);
  basketPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return basketPlayProgress;
}

function syncBasketPlayProgress(state, options = {}) {
  const progress = ensureBasketPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson4FractionScoopModel.getResult(
    Number(state.power || 0),
    Number(state.correctFirstTry || 0),
    Boolean(state.specialSeen)
  );
  const maxPower = Number(LESSON_CONFIG.reward?.maxPower || 100);
  const power = Math.max(0, Math.min(Number(state.power || 0), maxPower));
  const nextSrc = result.playImage || "";
  const previousPower = Number(progress.panel.dataset.power || 0);
  const previousTier = progress.panel.dataset.resultTier || "";
  const changed = progress.art.getAttribute("src") !== nextSrc;
  const tierChanged = Boolean(previousTier && previousTier !== result.id);

  progress.panel.dataset.resultTier = result.id;
  progress.panel.dataset.power = String(power);
  progress.name.textContent = result.name;
  progress.meter.setAttribute("aria-valuenow", String(power));
  progress.meterFill.style.width = `${power / maxPower * 100}%`;
  progress.panel.setAttribute("aria-label", `지금 모습은 ${result.name}이에요. 바구니 빛은 ${power}이에요.`);
  if (changed) progress.art.src = nextSrc;

  const delta = Number(options.delta ?? (power - previousPower));
  const shouldAnimate = options.animate === true && (changed || delta !== 0);
  progress.panel.classList.remove("is-changing", "is-dimming", "is-celebrating", "is-tier-up");
  progress.panel.dataset.effectPhase = "idle";
  progress.panel.dataset.effectKind = "none";
  if (shouldAnimate) {
    void progress.panel.offsetWidth;
    progress.panel.classList.add(delta < 0 ? "is-dimming" : "is-changing");
    if (options.celebrate === true && delta > 0) progress.panel.classList.add("is-celebrating");
    if (tierChanged && delta > 0) progress.panel.classList.add("is-tier-up");
    progress.panel.dataset.effectPhase = "active";
    progress.panel.dataset.effectKind = tierChanged && delta > 0
      ? "tier-up"
      : delta > 0 ? "gain" : delta < 0 ? "loss" : "none";
    progress.panel.dataset.effectStartedAt = String(performance.now());
    if (options.afterModalDismiss === true) {
      progress.panel.dataset.effectStartedWithModalHidden = String(document.getElementById("rewardPop")?.hidden === true);
    }
  }

  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = shouldAnimate && !reducedMotion
    ? Number(LESSON_CONFIG.qa?.rewardEffectAudit?.durationMs || 1560)
    : 0;
  if (!duration) return Promise.resolve();
  return new Promise((resolve) => {
    window.setTimeout(() => {
      progress.panel?.classList.remove("is-changing", "is-dimming", "is-celebrating", "is-tier-up");
      if (progress.panel) progress.panel.dataset.effectPhase = "idle";
      resolve();
    }, duration);
  });
}

function primeBasketRewardArt() {
  if (basketRewardArtPrimed || typeof Image === "undefined") return;
  basketRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    basketRewardPreloads.push(image);
  });
}

function waitForBasketProgress(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingBasketRewardImpact = { event, delta: afterPower - beforePower };
}

async function onRewardDismiss({ state }) {
  const impact = pendingBasketRewardImpact;
  pendingBasketRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncBasketPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensureBasketPlayProgress();
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preEffectDelay = reducedMotion
    ? Math.min(140, Number(effectConfig.preEffectDelayMs || 0))
    : Number(effectConfig.preEffectDelayMs || 0);
  if (progress?.panel && preEffectDelay > 0) {
    progress.panel.dataset.effectPhase = "arming";
    progress.panel.dataset.effectKind = impact.delta > 0 ? "gain-arming" : "loss-arming";
    progress.panel.dataset.effectArmedAt = String(performance.now());
    progress.panel.dataset.effectStartedWithModalHidden = String(document.getElementById("rewardPop")?.hidden === true);
    await waitForBasketProgress(preEffectDelay);
  }
  return syncBasketPlayProgress(state, {
    animate: true,
    celebrate: impact.delta > 0,
    delta: impact.delta,
    afterModalDismiss: true,
  });
}

globalThis.onRewardReveal = onRewardReveal;
globalThis.onRewardDismiss = onRewardDismiss;
globalThis.__playProgressQa = {
  syncProgress() {
    return syncBasketPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = basketPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingBasketRewardImpact?.delta ?? null,
      panelClasses: basketPlayProgress?.panel?.className || "",
      effectPhase: basketPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: basketPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: basketPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: basketPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: basketPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: basketPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: basketPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;

function ensureScoopStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".scoop-stage-art")) return;
  const image = document.createElement("img");
  image.className = "scoop-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  syncBasketPlayProgress(state);
  ensureScoopStageArt();
  ui.visualArea.dataset.groupValue = "";
  ui.visualArea.dataset.scoopValue = "";
  ui.visualArea.dataset.scoopState = "idle";
  renderScoopWorkbench(problem, 0);
}
function updateProblemVisualForStep(problem, step, state) {
  syncBasketPlayProgress(state);
  ui.visualArea.dataset.scoopState = "idle";
  renderScoopWorkbench(problem, state.stepIndex);
}
function revealCorrectStep(problem, step, state) {
  if (step.id === "find-group") ui.visualArea.dataset.groupValue = String(problem.groupSize);
  if (step.id === "fill-basket") ui.visualArea.dataset.scoopValue = String(problem.answer);
  ui.visualArea.dataset.scoopState = "correct";
  renderScoopWorkbench(problem, state.stepIndex);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.scoopState = "wrong";
  renderScoopWorkbench(problem, state.stepIndex, selected.value);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "number-card";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button quantity-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.value}개`);
    const svg = document.createElementNS(SCOOP_SVG_NS, "svg");
    svg.classList.add("quantity-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 130");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<path class="choice-basket" d="M54 48h132l-14 58H68z"/><path class="choice-handle" d="M82 50c2-39 74-39 76 0"/><text class="choice-number" x="120" y="91" text-anchor="middle">${selected.value}</text>`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderScoopWorkbench(problem, stepIndex, wrongValue = null) {
  const groupValue = ui.visualArea.dataset.groupValue;
  const scoopValue = ui.visualArea.dataset.scoopValue;
  const state = ui.visualArea.dataset.scoopState || "idle";
  const groupFactor = groupValue || "?";
  const svg = document.createElementNS(SCOOP_SVG_NS, "svg");
  svg.classList.add(scoopValue ? "scoop-confirm-svg" : "scoop-workbench-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 700 290");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `전체 ${problem.total}개를 ${problem.den}묶음으로 나누고 ${problem.num}묶음 담기`);
  const groups = groupValue
    ? groupMarkup(problem, { showItems: true, showChosen: true })
    : wholeItemsMarkup(problem);
  const firstValue = groupValue || (wrongValue != null && stepIndex === 0 ? String(wrongValue) : "?");
  const secondValue = scoopValue || (wrongValue != null && stepIndex === 1 ? String(wrongValue) : "?");
  svg.innerHTML = `
    ${groups}
    <g class="calculation ${stepIndex === 0 ? "is-current" : "is-done"}">
      <rect class="calc-card" x="32" y="188" width="290" height="82" rx="24"/>
      <text class="calc-label" x="177" y="214" text-anchor="middle">한 묶음</text>
      <text class="calc-expression" x="177" y="252" text-anchor="middle">${problem.total} ÷ ${problem.den} = ${firstValue}</text>
    </g>
    <g class="calculation ${stepIndex === 1 ? "is-current" : "is-waiting"}">
      <rect class="calc-card" x="378" y="188" width="290" height="82" rx="24"/>
      <text class="calc-label" x="523" y="214" text-anchor="middle">${problem.num}묶음 담기</text>
      <text class="calc-expression" x="523" y="252" text-anchor="middle">${groupFactor} × ${problem.num} = ${secondValue}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function wholeItemsMarkup(problem) {
  const columns = Math.min(6, problem.total);
  const rows = Math.ceil(problem.total / columns);
  let markup = '<g class="whole-tray"><rect x="72" y="18" width="556" height="142" rx="22"/><text class="whole-label" x="350" y="48" text-anchor="middle">전체 ' + problem.total + '개</text>';
  for (let index = 0; index < problem.total; index += 1) {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const dotX = 350 + (col - (columns - 1) / 2) * Math.min(52, 450 / Math.max(columns - 1, 1));
    const dotY = 82 + row * Math.min(40, 58 / Math.max(rows - 1, 1));
    markup += `<circle class="whole-dot" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="11"/>`;
  }
  return markup + '</g>';
}

function groupMarkup(problem, { showItems = false, showChosen = false } = {}) {
  const startX = 28;
  const gap = 8;
  const width = (644 - gap * (problem.den - 1)) / problem.den;
  let markup = "";
  for (let group = 0; group < problem.den; group += 1) {
    const x = startX + group * (width + gap);
    const chosen = showChosen && group < problem.num;
    markup += `<g class="item-group ${chosen ? "is-chosen" : ""}"><rect x="${x.toFixed(1)}" y="18" width="${width.toFixed(1)}" height="142" rx="18"/>`;
    markup += `<text class="group-name" x="${(x + width / 2).toFixed(1)}" y="48" text-anchor="middle">${group + 1}묶음</text>`;
    const columns = Math.min(problem.groupSize, 4);
    const rows = Math.ceil(problem.groupSize / columns);
    for (let index = 0; showItems && index < problem.groupSize; index += 1) {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const dotX = x + width / 2 + (col - (columns - 1) / 2) * Math.min(23, (width - 24) / columns);
      const dotY = 78 + row * Math.min(25, 62 / Math.max(rows - 1, 1));
      markup += `<circle class="fruit-dot" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="9"/>`;
    }
    markup += `</g>`;
  }
  return markup;
}

primeBasketRewardArt();
