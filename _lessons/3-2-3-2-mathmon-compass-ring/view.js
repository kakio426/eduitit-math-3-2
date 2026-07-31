const COMPASS_SVG_NS = "http://www.w3.org/2000/svg";
const COMPASS_RULER_MAX = 12;
const COMPASS_TARGET_RADIUS = 92;
let compassProofToken = 0;
let compassRewardArtPrimed = false;
let compassPlayProgress = null;
let pendingCompassRewardImpact = null;
const compassRewardPreloads = [];

function ensureCompassStageArt() {
  primeCompassRewardArt();
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (!playScreen.querySelector(".compass-stage-art")) {
    const image = document.createElement("img");
    image.className = "compass-stage-art";
    image.src = LESSON_CONFIG.imageAssets.problemStage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    playScreen.prepend(image);
  }
  if (!compassPlayProgress) {
    const panel = document.createElement("aside");
    panel.className = "compass-play-progress";
    panel.dataset.playProgressStandard = LESSON_CONFIG.workbench?.playStateImageSet?.standard || "";
    panel.dataset.protagonist = LESSON_CONFIG.workbench?.playStateImageSet?.protagonist || "";
    panel.dataset.cacheVersion = LESSON_CONFIG.workbench?.playStateImageSet?.cacheVersion || "";

    const art = document.createElement("img");
    art.className = "compass-play-progress-art";
    art.alt = "";
    art.setAttribute("aria-hidden", "true");

    const flare = document.createElement("span");
    flare.className = "compass-play-progress-flare";
    flare.setAttribute("aria-hidden", "true");

    const stageImpact = document.createElement("span");
    stageImpact.className = "compass-play-progress-impact-stage";
    stageImpact.setAttribute("aria-hidden", "true");

    const readout = document.createElement("div");
    readout.className = "compass-play-progress-readout";
    const eyebrow = document.createElement("span");
    eyebrow.className = "compass-play-progress-eyebrow";
    eyebrow.textContent = "지금의 마법진";
    const name = document.createElement("strong");
    name.className = "compass-play-progress-name";
    const meter = document.createElement("span");
    meter.className = "compass-play-progress-meter";
    meter.setAttribute("role", "progressbar");
    meter.setAttribute("aria-valuemin", "0");
    meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
    const meterFill = document.createElement("i");
    meterFill.className = "compass-play-progress-meter-fill";
    meter.appendChild(meterFill);
    readout.append(eyebrow, name, meter);
    panel.append(art, flare, readout);
    playScreen.append(panel, stageImpact);
    compassPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  }
  return compassPlayProgress;
}

function syncCompassPlayProgress(state, options = {}) {
  const progress = ensureCompassStageArt();
  if (!progress) return Promise.resolve();
  const result = Lesson3CompassRingModel.getResult(
    Number(state.power || 0),
    Number(state.correctFirstTry || 0),
    Boolean(state.specialSeen)
  );
  const maxPower = Number(LESSON_CONFIG.reward?.maxPower || 100);
  const power = Math.max(0, Math.min(Number(state.power || 0), maxPower));
  const nextSrc = result.playImage
    || LESSON_CONFIG.imageAssets.playProgressStates?.[result.id]
    || LESSON_CONFIG.imageAssets.playProgressStates?.faint
    || "";
  const previousPower = Number(progress.panel.dataset.power || 0);
  const previousTier = progress.panel.dataset.resultTier || "";
  const changed = progress.art.getAttribute("src") !== nextSrc;
  const tierChanged = Boolean(previousTier && previousTier !== result.id);

  progress.panel.dataset.resultTier = result.id;
  progress.panel.dataset.power = String(power);
  progress.name.textContent = result.name;
  progress.meter.setAttribute("aria-valuenow", String(power));
  progress.meterFill.style.width = `${power / maxPower * 100}%`;
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}이에요. 마법진 빛은 ${power}이에요.`);

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
    ? Number(LESSON_CONFIG.qa?.rewardEffectAudit?.durationMs || 1180)
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

function renderProblemVisual(problem, state) {
  syncCompassPlayProgress(state);
  compassProofToken += 1;
  ui.visualArea.closest(".problem-grid")?.classList.remove("is-proving");
  setCompassVisualState("waiting", problem.radius, null);
  renderCompassWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  syncCompassPlayProgress(state);
  compassProofToken += 1;
  ui.visualArea.closest(".problem-grid")?.classList.remove("is-proving");
  setCompassVisualState("waiting", problem.radius, null);
  renderCompassWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  setCompassVisualState("correct-anchor", problem.radius, null);
  renderCompassWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  const wrongState = selected.misconceptionId === "COMPASS_TOO_NARROW"
    ? "wrong-narrow"
    : selected.misconceptionId === "COMPASS_TOO_WIDE"
      ? "wrong-wide"
      : "wrong-diameter";
  setCompassVisualState(wrongState, selected.value, selected.misconceptionId);
  renderCompassWorkbench(problem);
}

async function onStepCorrect({ problem }) {
  const proofToken = ++compassProofToken;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  ui.visualArea.closest(".problem-grid")?.classList.add("is-proving");
  const phases = [
    { state: "correct-anchor", text: "바늘을 원의 중심에 꽂아요.", delay: 320 },
    { state: "correct-open", text: `바늘과 연필 사이를 ${problem.radius} cm로 맞춰요.`, delay: 430 },
    { state: "correct-draw", text: "길이를 그대로 두고 돌려요.", delay: 1050 },
    { state: "complete-ready", text: `반지름 ${problem.radius} cm인 원이 완성됐어요.`, delay: 160 },
  ];

  for (const phase of phases) {
    if (proofToken !== compassProofToken) return;
    setCompassVisualState(phase.state, problem.radius, null);
    renderCompassWorkbench(problem);
    ui.feedback.dataset.state = "correct";
    ui.feedback.textContent = phase.text;
    if (!reducedMotion && phase.delay > 0) await waitForCompass(phase.delay);
  }
}

function onProblemComplete({ problem }) {
  ui.visualArea.closest(".problem-grid")?.classList.remove("is-proving");
  setCompassVisualState("complete-ready", problem.radius, null);
  renderCompassWorkbench(problem);
}

function setCompassVisualState(kind, opening, misconceptionId) {
  ui.visualArea.dataset.compassState = kind;
  ui.visualArea.dataset.opening = String(opening);
  if (misconceptionId) ui.visualArea.dataset.misconception = misconceptionId;
  else delete ui.visualArea.dataset.misconception;
}

function waitForCompass(duration) {
  return new Promise((resolve) => window.setTimeout(resolve, duration));
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "compass-diagram";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button compass-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `바늘과 연필 사이가 ${selected.value} cm인 컴퍼스`);

    const svg = document.createElementNS(COMPASS_SVG_NS, "svg");
    svg.classList.add("compass-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 150");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = compassOpeningMarkup(selected.value);
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function compassOpeningMarkup(value) {
  const x0 = 30;
  const unit = 14.5;
  const x1 = x0 + value * unit;
  const apexX = (x0 + x1) / 2;
  let ticks = "";
  for (let tick = 0; tick <= COMPASS_RULER_MAX; tick += 1) {
    const x = x0 + tick * unit;
    ticks += `<line class="compass-tick" x1="${x}" y1="104" x2="${x}" y2="${tick % 2 === 0 ? 113 : 109}"/>`;
  }
  return `
    <line class="compass-ruler" x1="${x0}" y1="104" x2="204" y2="104"/>
    ${ticks}
    <line class="compass-band" x1="${x0}" y1="96" x2="${x1}" y2="96"/>
    <line class="compass-leg" x1="${apexX}" y1="24" x2="${x0}" y2="96"/>
    <line class="compass-leg compass-pencil-leg" x1="${apexX}" y1="24" x2="${x1}" y2="96"/>
    <circle class="compass-joint" cx="${apexX}" cy="24" r="7"/>
    <circle class="compass-foot" cx="${x0}" cy="96" r="4"/>
    <circle class="compass-foot" cx="${x1}" cy="96" r="4"/>
    <text class="compass-opening-label" x="120" y="138" text-anchor="middle">${value} cm</text>
  `;
}

function renderCompassWorkbench(problem) {
  const visualState = ui.visualArea.dataset.compassState || "waiting";
  const opening = Number(ui.visualArea.dataset.opening || problem.radius);
  const svg = document.createElementNS(COMPASS_SVG_NS, "svg");
  svg.classList.add("compass-confirm-svg");
  svg.dataset.state = visualState.startsWith("wrong") ? "wrong" : visualState;
  svg.dataset.proofState = visualState;
  svg.setAttribute("viewBox", "0 0 640 330");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", compassVisualLabel(problem.radius, opening, visualState));
  svg.innerHTML = visualState === "waiting"
    ? targetRadiusMarkup(problem.radius)
    : compassProofMarkup(problem.radius, opening, visualState);
  ui.visualArea.replaceChildren(svg);
}

function compassVisualLabel(radius, opening, visualState) {
  if (visualState === "waiting") {
    return `중심에서 ${radius} cm 떨어진 점이 원을 따라 움직이는 모습`;
  }
  if (visualState.startsWith("wrong")) {
    return `중심에 바늘을 꽂고 ${opening} cm로 벌리면 목표 원과 크기가 달라지는 모습`;
  }
  if (visualState === "complete-ready") {
    return `바늘을 중심에 고정하고 ${radius} cm로 벌린 컴퍼스로 완성한 원`;
  }
  return `바늘을 중심에 고정하고 ${radius} cm로 벌린 컴퍼스를 돌려 원을 그리는 모습`;
}

function targetRadiusMarkup(radius) {
  const centerX = 320;
  const centerY = 172;
  const endX = centerX + COMPASS_TARGET_RADIUS;
  const startAngle = -58 * Math.PI / 180;
  const endAngle = 8 * Math.PI / 180;
  const startX = centerX + Math.cos(startAngle) * COMPASS_TARGET_RADIUS;
  const startY = centerY + Math.sin(startAngle) * COMPASS_TARGET_RADIUS;
  const arcEndX = centerX + Math.cos(endAngle) * COMPASS_TARGET_RADIUS;
  const arcEndY = centerY + Math.sin(endAngle) * COMPASS_TARGET_RADIUS;
  return `
    <circle class="target-circle waiting-target-circle" cx="${centerX}" cy="${centerY}" r="${COMPASS_TARGET_RADIUS}"/>
    <path class="waiting-draw-preview" d="M ${startX.toFixed(2)} ${startY.toFixed(2)} A ${COMPASS_TARGET_RADIUS} ${COMPASS_TARGET_RADIUS} 0 0 1 ${arcEndX.toFixed(2)} ${arcEndY.toFixed(2)}" pathLength="1"/>
    <circle class="target-center" cx="${centerX}" cy="${centerY}" r="7"/>
    <line class="target-radius" x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${centerY}"/>
    <circle class="target-end" cx="${endX}" cy="${centerY}" r="6"/>
    <g class="waiting-trace-rotor" data-preview="path-only" style="transform-origin:${centerX}px ${centerY}px">
      <circle class="waiting-pencil-halo" cx="${endX}" cy="${centerY}" r="16"/>
      <circle class="waiting-pencil-tip" cx="${endX}" cy="${centerY}" r="8"/>
    </g>
    <text class="target-radius-label" x="${centerX + COMPASS_TARGET_RADIUS / 2}" y="${centerY - 20}" text-anchor="middle">${radius} cm</text>
    <text class="target-center-label" x="${centerX}" y="${centerY + 34}" text-anchor="middle">중심</text>
  `;
}

function compassProofMarkup(radius, opening, visualState) {
  const centerX = 238;
  const centerY = 177;
  const openingRadius = Math.min(190, COMPASS_TARGET_RADIUS * opening / radius);
  const pencilX = centerX + openingRadius;
  const jointX = centerX + openingRadius / 2;
  const jointY = 58;
  const isWrong = visualState.startsWith("wrong");
  const isDrawing = visualState === "correct-draw";
  const isComplete = visualState === "complete-ready";
  const rotorClass = isWrong
    ? "compass-rotor is-wrong-sweep"
    : isDrawing
      ? "compass-rotor is-drawing"
      : "compass-rotor";
  const circleMarkup = isWrong
    ? `<circle class="attempt-arc" cx="${centerX}" cy="${centerY}" r="${openingRadius}" pathLength="1"/>`
    : `<circle class="drawn-circle${isDrawing ? " is-drawing" : ""}${isComplete ? " is-complete" : ""}" cx="${centerX}" cy="${centerY}" r="${COMPASS_TARGET_RADIUS}" pathLength="1"/>`;
  const lengthLabel = isWrong ? `${opening} cm` : `${radius} cm`;

  return `
    <circle class="target-guide" cx="${centerX}" cy="${centerY}" r="${COMPASS_TARGET_RADIUS}"/>
    ${circleMarkup}
    <circle class="target-center-halo" cx="${centerX}" cy="${centerY}" r="18"/>
    <line class="target-radius proof-radius" x1="${centerX}" y1="${centerY}" x2="${centerX + COMPASS_TARGET_RADIUS}" y2="${centerY}"/>
    <g class="${rotorClass}" style="transform-origin:${centerX}px ${centerY}px">
      <line class="proof-compass-leg proof-needle-leg" x1="${jointX}" y1="${jointY}" x2="${centerX}" y2="${centerY}"/>
      <line class="proof-compass-leg proof-pencil-leg" x1="${jointX}" y1="${jointY}" x2="${pencilX}" y2="${centerY}"/>
      <line class="proof-opening-band" x1="${centerX}" y1="${centerY}" x2="${pencilX}" y2="${centerY}"/>
      <circle class="proof-joint" cx="${jointX}" cy="${jointY}" r="11"/>
      <circle class="proof-needle" cx="${centerX}" cy="${centerY}" r="8"/>
      <circle class="proof-pencil" cx="${pencilX}" cy="${centerY}" r="8"/>
    </g>
    <text class="proof-center-label" x="${centerX}" y="${centerY + 42}" text-anchor="middle">중심</text>
    <text class="proof-length-label" x="${pencilX + 18}" y="${centerY + 8}" text-anchor="start">${lengthLabel}</text>
    ${isWrong ? `<text class="proof-size-note" x="500" y="285" text-anchor="middle">${openingRadius < COMPASS_TARGET_RADIUS ? "목표보다 작아요" : "목표보다 커요"}</text>` : ""}
  `;
}

function primeCompassRewardArt() {
  if (compassRewardArtPrimed || typeof Image === "undefined") return;
  compassRewardArtPrimed = true;
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(artMap),
    ...Object.values(LESSON_CONFIG.imageAssets.playProgressStates || {}),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    compassRewardPreloads.push(image);
  });
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingCompassRewardImpact = {
    event,
    delta: afterPower - beforePower,
  };
}

async function onRewardDismiss({ state }) {
  const impact = pendingCompassRewardImpact;
  pendingCompassRewardImpact = null;
  if (!impact) return Promise.resolve();
  const progress = ensureCompassStageArt();
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preEffectDelay = reducedMotion
    ? Math.min(140, Number(effectConfig.preEffectDelayMs || 0))
    : Number(effectConfig.preEffectDelayMs || 0);
  if (progress?.panel && preEffectDelay > 0) {
    progress.panel.dataset.effectPhase = "arming";
    progress.panel.dataset.effectKind = impact.delta > 0 ? "gain-arming" : impact.delta < 0 ? "loss-arming" : "none";
    progress.panel.dataset.effectArmedAt = String(performance.now());
    progress.panel.dataset.effectStartedWithModalHidden = String(
      document.getElementById("rewardPop")?.hidden === true
    );
    await waitForCompass(preEffectDelay);
  }
  return syncCompassPlayProgress(state, {
    animate: true,
    celebrate: impact.delta > 0,
    delta: impact.delta,
    afterModalDismiss: true,
  });
}

globalThis.onRewardReveal = onRewardReveal;
globalThis.onRewardDismiss = onRewardDismiss;
globalThis.__compassRingQa = {
  syncProgress() {
    return syncCompassPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = compassPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingCompassRewardImpact?.delta ?? null,
      panelClasses: compassPlayProgress?.panel?.className || "",
      effectPhase: compassPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: compassPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: compassPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: compassPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: compassPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: compassPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: compassPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? {
            left: impactRect.left,
            top: impactRect.top,
            width: impactRect.width,
            height: impactRect.height,
          }
        : null,
    };
  },
};
primeCompassRewardArt();
