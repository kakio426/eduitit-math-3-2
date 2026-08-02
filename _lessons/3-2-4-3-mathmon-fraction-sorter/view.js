const SORT_SVG_NS = "http://www.w3.org/2000/svg";
let sorterPlayProgress = null;
let pendingSorterRewardImpact = null;
let sorterRewardArtPrimed = false;
const sorterRewardPreloads = [];

function ensureSorterPlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (sorterPlayProgress?.panel?.isConnected) return sorterPlayProgress;

  const imageSet = LESSON_CONFIG.workbench?.playStateImageSet || {};
  const panel = document.createElement("aside");
  panel.className = "sorter-play-progress";
  panel.dataset.playProgressStandard = imageSet.standard || "";
  panel.dataset.protagonist = imageSet.protagonist || "";
  panel.dataset.cacheVersion = imageSet.cacheVersion || "";

  const art = document.createElement("img");
  art.className = "sorter-play-progress-art";
  art.alt = "";
  art.setAttribute("aria-hidden", "true");

  const flare = document.createElement("span");
  flare.className = "sorter-play-progress-flare";
  flare.setAttribute("aria-hidden", "true");

  const stageImpact = document.createElement("span");
  stageImpact.className = "sorter-play-progress-impact-stage";
  stageImpact.setAttribute("aria-hidden", "true");

  const readout = document.createElement("div");
  readout.className = "sorter-play-progress-readout";
  const eyebrow = document.createElement("span");
  eyebrow.className = "sorter-play-progress-eyebrow";
  eyebrow.textContent = "지금의 분류";
  const name = document.createElement("strong");
  name.className = "sorter-play-progress-name";
  const meter = document.createElement("span");
  meter.className = "sorter-play-progress-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("i");
  meterFill.className = "sorter-play-progress-meter-fill";
  meter.appendChild(meterFill);
  readout.append(eyebrow, name, meter);
  panel.append(art, flare, readout);
  playScreen.append(panel, stageImpact);
  sorterPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return sorterPlayProgress;
}

function syncSorterPlayProgress(state, options = {}) {
  const progress = ensureSorterPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson4FractionSorterModel.getResult(
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
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}예요. 컨베이어 빛은 ${power}이에요.`);
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
      : delta > 0
        ? "gain"
        : delta < 0
          ? "loss"
          : "none";
    progress.panel.dataset.effectStartedAt = String(performance.now());
    if (options.afterModalDismiss === true) {
      progress.panel.dataset.effectStartedWithModalHidden = String(
        document.getElementById("rewardPop")?.hidden === true
      );
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

function ensureSorterStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".sorter-stage-art")) return;
  const image = document.createElement("img");
  image.className = "sorter-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}
function renderProblemVisual(problem, state) {
  syncSorterPlayProgress(state);
  ensureSorterStageArt();
  ui.visualArea.dataset.sortState = "idle";
  ui.visualArea.dataset.sortChoice = "";
  renderFractionModel(problem);
}
function updateProblemVisualForStep(problem, step, state) {
  syncSorterPlayProgress(state);
  renderFractionModel(problem);
}
function revealCorrectStep(problem) {
  ui.visualArea.dataset.sortState = "correct";
  ui.visualArea.dataset.sortChoice = problem.kind;
  renderFractionModel(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.sortState = "wrong";
  ui.visualArea.dataset.sortChoice = selected.value;
  renderFractionModel(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-name";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button sort-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.label}, ${selected.relation}`);
    const svg = document.createElementNS(SORT_SVG_NS, "svg");
    svg.classList.add("sort-choice-svg");
    svg.setAttribute("viewBox", "0 0 260 160");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<path class="sort-bin" d="M36 48h188l-18 92H54z"/><path class="sort-rim" d="M26 43h208"/><text class="sort-name" x="130" y="88" text-anchor="middle">${selected.label}</text><text class="sort-relation" x="130" y="119" text-anchor="middle">${selected.relation}</text>`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderFractionModel(problem) {
  const state = ui.visualArea.dataset.sortState || "idle";
  const selected = ui.visualArea.dataset.sortChoice || "";
  const svg = document.createElementNS(SORT_SVG_NS, "svg");
  svg.classList.add("fraction-model-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 720 285");
  svg.setAttribute("role", "img");
  const modelLabel = state === "correct"
    ? `${problem.spokenNotation}, ${problem.kind}`
    : selected
      ? `${problem.spokenNotation}, 고른 답은 ${selected}예요.`
      : `${problem.spokenNotation}, 분수 그림`;
  svg.setAttribute("aria-label", modelLabel);
  const notation = problem.whole ? mixedNotation(problem.whole, problem.num, problem.den, 160, 146) : fractionNotation(problem.num, problem.den, 160, 130);
  const quantity = quantityBars(problem);
  const relation = selected ? `<g class="sort-result"><rect x="486" y="204" width="208" height="58" rx="22"/><text x="590" y="242" text-anchor="middle">${selected}</text></g>` : "";
  svg.innerHTML = `${notation}<path class="model-arrow" d="M280 132h55"/><path class="model-arrow-head" d="M335 132l-15-11v22z"/>${quantity}${relation}`;
  ui.visualArea.replaceChildren(svg);
}

function fractionNotation(num, den, cx, cy) {
  return `<g class="big-notation"><text x="${cx}" y="${cy - 35}" text-anchor="middle">${num}</text><line x1="${cx - 48}" y1="${cy - 10}" x2="${cx + 48}" y2="${cy - 10}"/><text x="${cx}" y="${cy + 55}" text-anchor="middle">${den}</text></g>`;
}
function mixedNotation(whole, num, den, cx, cy) {
  return `<g class="big-notation"><text class="whole-number" x="${cx - 58}" y="${cy + 5}" text-anchor="middle">${whole}</text><text x="${cx + 32}" y="${cy - 48}" text-anchor="middle">${num}</text><line x1="${cx - 8}" y1="${cy - 21}" x2="${cx + 72}" y2="${cy - 21}"/><text x="${cx + 32}" y="${cy + 48}" text-anchor="middle">${den}</text></g>`;
}
function quantityBars(problem) {
  const filledUnits = problem.whole ? problem.whole * problem.den + problem.num : problem.num;
  const bars = Math.max(1, Math.ceil(filledUnits / problem.den));
  const barWidth = 290;
  const x = 386;
  const startY = bars === 1 ? 104 : bars === 2 ? 67 : 34;
  const barHeight = bars === 1 ? 76 : bars === 2 ? 62 : 52;
  const gapY = 16;
  let markup = `<g class="quantity-bars">`;
  for (let bar = 0; bar < bars; bar += 1) {
    const y = startY + bar * (barHeight + gapY);
    const segmentWidth = barWidth / problem.den;
    for (let segment = 0; segment < problem.den; segment += 1) {
      const index = bar * problem.den + segment;
      markup += `<rect class="quantity-segment ${index < filledUnits ? "is-filled" : ""}" x="${(x + segment * segmentWidth).toFixed(1)}" y="${y}" width="${segmentWidth.toFixed(1)}" height="${barHeight}"/>`;
    }
  }
  return markup + `</g>`;
}

function primeSorterRewardArt() {
  if (sorterRewardArtPrimed || typeof Image === "undefined") return;
  sorterRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    sorterRewardPreloads.push(image);
  });
}

function waitForSorter(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingSorterRewardImpact = {
    event,
    delta: afterPower - beforePower,
  };
}

async function onRewardDismiss({ state }) {
  const impact = pendingSorterRewardImpact;
  pendingSorterRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncSorterPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensureSorterPlayProgress();
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preEffectDelay = reducedMotion
    ? Math.min(140, Number(effectConfig.preEffectDelayMs || 0))
    : Number(effectConfig.preEffectDelayMs || 0);
  if (progress?.panel && preEffectDelay > 0) {
    progress.panel.dataset.effectPhase = "arming";
    progress.panel.dataset.effectKind = impact.delta > 0 ? "gain-arming" : "loss-arming";
    progress.panel.dataset.effectArmedAt = String(performance.now());
    progress.panel.dataset.effectStartedWithModalHidden = String(
      document.getElementById("rewardPop")?.hidden === true
    );
    await waitForSorter(preEffectDelay);
  }
  return syncSorterPlayProgress(state, {
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
    return syncSorterPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = sorterPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingSorterRewardImpact?.delta ?? null,
      panelClasses: sorterPlayProgress?.panel?.className || "",
      effectPhase: sorterPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: sorterPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: sorterPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: sorterPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: sorterPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: sorterPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: sorterPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;
primeSorterRewardArt();
