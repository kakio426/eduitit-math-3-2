const TUG_SVG_NS = "http://www.w3.org/2000/svg";
let tugPlayProgress = null;
let pendingTugRewardImpact = null;
let tugRewardArtPrimed = false;
const tugRewardPreloads = [];

function ensureTugPlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (tugPlayProgress?.panel?.isConnected) return tugPlayProgress;
  const imageSet = LESSON_CONFIG.workbench?.playStateImageSet || {};
  if (imageSet.standard !== "generated-play-progress-v3-left-character") return null;

  document.querySelector(".game")?.classList.add("has-play-progress");
  const panel = document.createElement("aside");
  panel.className = "tug-play-progress";
  panel.dataset.playProgressStandard = imageSet.standard || "";
  panel.dataset.protagonist = imageSet.protagonist || "";
  panel.dataset.cacheVersion = imageSet.cacheVersion || "";

  const art = document.createElement("img");
  art.className = "tug-play-progress-art";
  art.alt = "";
  art.decoding = "async";
  art.setAttribute("aria-hidden", "true");

  const flare = document.createElement("span");
  flare.className = "tug-play-progress-flare";
  flare.setAttribute("aria-hidden", "true");

  const stageImpact = document.createElement("span");
  stageImpact.className = "tug-play-progress-impact-stage";
  stageImpact.setAttribute("aria-hidden", "true");

  const readout = document.createElement("div");
  readout.className = "tug-play-progress-readout";
  const eyebrow = document.createElement("span");
  eyebrow.className = "tug-play-progress-eyebrow";
  eyebrow.textContent = "지금 모습";
  const name = document.createElement("strong");
  name.className = "tug-play-progress-name";
  const meter = document.createElement("span");
  meter.className = "tug-play-progress-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("i");
  meterFill.className = "tug-play-progress-meter-fill";
  meter.appendChild(meterFill);
  readout.append(eyebrow, name, meter);
  panel.append(art, flare, readout);
  playScreen.append(panel, stageImpact);
  tugPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return tugPlayProgress;
}

function syncTugPlayProgress(state, options = {}) {
  const progress = ensureTugPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson4FractionTugModel.getResult(
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
  progress.panel.setAttribute("aria-label", `지금은 ${result.name} 단계예요. 줄다리기 힘은 ${power}이에요.`);
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

function primeTugRewardArt() {
  if (tugRewardArtPrimed || typeof Image === "undefined") return;
  tugRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    tugRewardPreloads.push(image);
  });
}

function waitForTugProgress(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingTugRewardImpact = { event, delta: afterPower - beforePower };
}

async function onRewardDismiss({ state }) {
  const impact = pendingTugRewardImpact;
  pendingTugRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncTugPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensureTugPlayProgress();
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
    await waitForTugProgress(preEffectDelay);
  }
  return syncTugPlayProgress(state, {
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
    return syncTugPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = tugPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingTugRewardImpact?.delta ?? null,
      panelClasses: tugPlayProgress?.panel?.className || "",
      effectPhase: tugPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: tugPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: tugPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: tugPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: tugPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: tugPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: tugPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;

function ensureTugStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".tug-stage-art")) return;
  const image = document.createElement("img");
  image.className = "tug-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}
function renderProblemVisual(problem, state) {
  syncTugPlayProgress(state);
  ensureTugStageArt();
  ui.visualArea.dataset.compareState = "idle";
  renderCompareStage(problem);
}
function updateProblemVisualForStep(problem, step, state) {
  syncTugPlayProgress(state);
  renderCompareStage(problem);
}
function revealCorrectStep(problem, step, state) {
  syncTugPlayProgress(state);
  ui.visualArea.dataset.compareState = "correct";
  renderCompareStage(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.compareState = "wrong";
  ui.visualArea.dataset.selectedSide = selected.side;
  renderCompareStage(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-bar";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button compare-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.fraction.den}분의 ${selected.fraction.num}`);
    const svg = document.createElementNS(TUG_SVG_NS, "svg");
    svg.classList.add("compare-choice-svg");
    svg.setAttribute("viewBox", "0 0 400 220");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `${fractionNotation(selected.fraction, 200, 72, "choice")}${fractionBar(selected.fraction, 55, 125, 290, 62, "choice")}`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderCompareStage(problem) {
  const compareState = ui.visualArea.dataset.compareState || "idle";
  const correct = compareState === "correct";
  const wrong = compareState === "wrong";
  const svg = document.createElementNS(TUG_SVG_NS, "svg");
  svg.classList.add(correct || wrong ? "fraction-compare-confirm-svg" : "compare-stage-svg");
  svg.setAttribute("viewBox", "0 0 760 260");
  svg.setAttribute("role", "img");
  if (wrong) svg.dataset.state = "wrong";
  const leftValue = problem.left.num / problem.left.den;
  const rightValue = problem.right.num / problem.right.den;
  const relation = leftValue > rightValue ? ">" : "<";
  const selected = ui.visualArea.dataset.selectedSide === "left" ? problem.left : problem.right;
  const other = ui.visualArea.dataset.selectedSide === "left" ? problem.right : problem.left;
  svg.setAttribute("aria-label", correct
    ? `${problem.left.den}분의 ${problem.left.num}은 ${problem.right.den}분의 ${problem.right.num}보다 ${relation === ">" ? "커요." : "작아요."}`
    : wrong
      ? `고른 ${selected.den}분의 ${selected.num}은 ${other.den}분의 ${other.num}보다 작아요.`
      : "두 분수 막대의 길이를 비교해요.");
  const shownSign = correct ? relation : "?";
  const confirmLabel = correct
    ? (relation === ">" ? "왼쪽 막대가 더 길어요." : "오른쪽 막대가 더 길어요.")
    : wrong ? "고른 막대의 길이를 다시 봐요." : "두 막대의 길이를 비교해요.";
  svg.innerHTML = `
    <g transform="translate(8 0)">${fractionNotation(problem.left, 150, 66, "confirm")}${fractionBar(problem.left, 22, 108, 256, 58, "confirm")}</g>
    <text class="compare-sign" x="380" y="145" text-anchor="middle">${shownSign}</text>
    <g transform="translate(474 0)">${fractionNotation(problem.right, 150, 66, "confirm")}${fractionBar(problem.right, 22, 108, 256, 58, "confirm")}</g>
    <text class="confirm-label" x="380" y="224" text-anchor="middle">${confirmLabel}</text>
  `;
  ui.visualArea.replaceChildren(svg);
}

function fractionNotation(fraction, cx, cy, kind) {
  return `<g class="fraction-notation fraction-notation-${kind}"><text x="${cx}" y="${cy - 24}" text-anchor="middle">${fraction.num}</text><line x1="${cx - 32}" y1="${cy - 8}" x2="${cx + 32}" y2="${cy - 8}"/><text x="${cx}" y="${cy + 38}" text-anchor="middle">${fraction.den}</text></g>`;
}
function fractionBar(fraction, x, y, width, height, kind) {
  const segmentWidth = width / fraction.den;
  let markup = `<g class="fraction-bar fraction-bar-${kind}">`;
  for (let index = 0; index < fraction.den; index += 1) {
    markup += `<rect class="bar-segment ${index < fraction.num ? "is-filled" : ""}" x="${(x + index * segmentWidth).toFixed(1)}" y="${y}" width="${segmentWidth.toFixed(1)}" height="${height}"/>`;
  }
  return markup + `</g>`;
}

primeTugRewardArt();
