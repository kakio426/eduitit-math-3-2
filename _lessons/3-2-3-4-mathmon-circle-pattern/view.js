const PATTERN_SVG_NS = "http://www.w3.org/2000/svg";
const CIRCLE_RULER_ZERO_X = 82;
const CIRCLE_RULER_Y = 330;
const CIRCLE_RULER_UNIT_PX = 42;
const CIRCLE_DRAW_UNIT_PX = 50;
let patternPlayProgress = null;
let pendingPatternRewardImpact = null;
let patternRewardArtPrimed = false;
const patternRewardPreloads = [];
const circleWorkbench = {
  problemId: "",
  selectedRadius: 1,
  adjusted: false,
  phase: "setting",
  choose: null,
  button: null,
  engineState: null,
  dragPointerId: null,
};

async function onStepCorrect() {
  const svg = document.querySelector("#screen-play .circle-draw-svg[data-state='correct']");
  if (!svg) return;
  const effectConfig = LESSON_CONFIG.qa?.correctFeedbackEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0 : Number(effectConfig.durationMs || 1100);
  svg.classList.remove("is-answer-locking");
  void svg.getBoundingClientRect();
  svg.classList.add("is-answer-locking");
  svg.dataset.correctEffectPhase = "active";
  if (duration > 0) await waitForPattern(duration);
  svg.classList.remove("is-answer-locking");
  svg.dataset.correctEffectPhase = "idle";
}

function ensurePatternPlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (patternPlayProgress?.panel?.isConnected) return patternPlayProgress;

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
  eyebrow.textContent = "지금의 정원";
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
  patternPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return patternPlayProgress;
}

function syncPatternPlayProgress(state, options = {}) {
  const progress = ensurePatternPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson3CirclePatternModel.getResult(
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
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}이에요. 원의 점수는 ${power}점이에요.`);
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
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const duration = shouldAnimate && !reducedMotion
    ? tierChanged
      ? Number(effectConfig.tierUpDurationMs || 1800)
      : Number(effectConfig.durationMs || 900)
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

function ensurePatternStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;
  const stepBoard = playScreen.querySelector(".step-board");
  const feedback = stepBoard?.querySelector(".feedback-line");
  if (feedback) {
    feedback.classList.add("visually-hidden");
    playScreen.append(feedback);
  }
  stepBoard?.remove();
  if (playScreen.querySelector(".pattern-stage-art")) return;
  const image = document.createElement("img");
  image.className = "pattern-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  syncPatternPlayProgress(state);
  ensurePatternStageArt();
  resetCircleWorkbench(problem, state);
  renderCircleWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  syncPatternPlayProgress(state);
  if (circleWorkbench.problemId !== problem.id) resetCircleWorkbench(problem, state);
  circleWorkbench.engineState = state;
  renderCircleWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  circleWorkbench.phase = "correct";
  circleWorkbench.engineState = state;
  renderCircleWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  circleWorkbench.phase = "wrong";
  circleWorkbench.engineState = state;
  renderCircleWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "circle-draw";
  ui.choices.dataset.interaction = "compass-radius-drag";
  circleWorkbench.choose = choose;
  circleWorkbench.engineState = state;

  const button = document.createElement("button");
  button.type = "button";
  button.className = "choice-button compass-draw-button";
  button.textContent = "원 그리기";
  button.dataset.textAlignRole = "label";
  button.addEventListener("click", () => {
    const selected = step.choices.find((choice) => Number(choice.value) === circleWorkbench.selectedRadius);
    if (!selected || !circleWorkbench.adjusted) return;
    button.dataset.choice = selected.id;
    button.dataset.misconception = selected.misconceptionId || "";
    choose(selected, button);
  });
  ui.choices.appendChild(button);
  circleWorkbench.button = button;
  syncCircleDrawButton();
  renderCircleWorkbench(problem);
  return true;
}

function resetCircleWorkbench(problem, state) {
  circleWorkbench.problemId = problem.id;
  circleWorkbench.selectedRadius = 1;
  circleWorkbench.adjusted = false;
  circleWorkbench.phase = "setting";
  circleWorkbench.choose = null;
  circleWorkbench.button = null;
  circleWorkbench.engineState = state;
  circleWorkbench.dragPointerId = null;
}

function clampCircleRadius(value) {
  return Math.max(1, Math.min(4, Math.round(Number(value) || 1)));
}

function syncCircleDrawButton() {
  const button = circleWorkbench.button;
  if (!button) return;
  button.disabled = !circleWorkbench.adjusted || circleWorkbench.phase === "correct";
  button.dataset.selectedRadius = String(circleWorkbench.selectedRadius);
  button.setAttribute(
    "aria-label",
    circleWorkbench.adjusted
      ? `반지름 ${circleWorkbench.selectedRadius} 센티미터로 원 그리기`
      : "컴퍼스를 움직인 뒤 원 그리기",
  );
}

function setCircleRadius(value, adjusted = true) {
  if (circleWorkbench.phase === "correct") return;
  circleWorkbench.selectedRadius = clampCircleRadius(value);
  circleWorkbench.adjusted = circleWorkbench.adjusted || adjusted;
  circleWorkbench.phase = "setting";
  if (circleWorkbench.button) {
    delete circleWorkbench.button.dataset.state;
    delete circleWorkbench.button.dataset.misconception;
  }
  syncCircleDrawButton();
  const problem = circleWorkbench.engineState?.problems?.[circleWorkbench.engineState.problemIndex];
  if (problem) renderCircleWorkbench(problem);
}

function rulerTicksMarkup() {
  return [0, 1, 2, 3, 4].map((value) => {
    const x = CIRCLE_RULER_ZERO_X + value * CIRCLE_RULER_UNIT_PX;
    return `<g class="circle-ruler-tick" data-value="${value}"><line x1="${x}" y1="${CIRCLE_RULER_Y - 18}" x2="${x}" y2="${CIRCLE_RULER_Y + 2}"/><text x="${x}" y="${CIRCLE_RULER_Y + 27}">${value}</text></g>`;
  }).join("");
}

function compassMarkup(anchorX, anchorY, radius, unitPx, className) {
  const pencilX = anchorX + radius * unitPx;
  const hingeX = anchorX + radius * unitPx / 2;
  const hingeY = anchorY - 112;
  return `<g class="${className}" data-radius="${radius}">
    <line class="compass-leg compass-needle-leg" x1="${hingeX}" y1="${hingeY}" x2="${anchorX}" y2="${anchorY}"/>
    <line class="compass-leg compass-pencil-leg" x1="${hingeX}" y1="${hingeY}" x2="${pencilX}" y2="${anchorY}"/>
    <circle class="compass-hinge" cx="${hingeX}" cy="${hingeY}" r="16"/>
    <line class="compass-grip" x1="${hingeX}" y1="${hingeY - 37}" x2="${hingeX}" y2="${hingeY - 13}"/>
    <path class="compass-needle" d="M ${anchorX - 5} ${anchorY - 12} L ${anchorX} ${anchorY + 6} L ${anchorX + 5} ${anchorY - 12} Z"/>
    <rect class="compass-pencil" x="${pencilX - 7}" y="${anchorY - 28}" width="14" height="34" rx="5"/>
  </g>`;
}

function circleWorkbenchMarkup(problem) {
  const radius = circleWorkbench.selectedRadius;
  const phase = circleWorkbench.phase;
  const drawRadius = radius * CIRCLE_DRAW_UNIT_PX;
  const centerX = 540;
  const centerY = 220;
  const showDrawing = phase === "wrong" || phase === "correct";
  const rulerInteractive = phase !== "correct";
  const statusClass = phase === "wrong" ? " is-wrong" : phase === "correct" ? " is-correct" : "";
  const labelX = centerX + Math.min(drawRadius * .5, 100);
  const measureLabel = phase === "correct" && problem.conditionType === "diameter"
    ? `지름 ${problem.givenValue} cm`
    : `반지름 ${radius} cm`;
  const radiusLine = showDrawing
    ? `<line class="draw-radius-line" x1="${centerX}" y1="${centerY}" x2="${centerX + drawRadius}" y2="${centerY}"/>
      <g class="draw-radius-readout">
        <rect class="draw-radius-chip" x="${labelX - 72}" y="${centerY + 16}" width="144" height="40" rx="18"/>
        <text class="draw-radius-label" x="${labelX}" y="${centerY + 37}">${measureLabel}</text>
      </g>`
    : "";
  const correctEffect = phase === "correct"
    ? `<g class="circle-correct-effect" aria-hidden="true">
        <circle class="circle-correct-halo" cx="${centerX}" cy="${centerY}" r="${drawRadius + 5}"/>
        <g class="circle-correct-badge-anchor" transform="translate(${centerX + drawRadius * .7} ${centerY - drawRadius * .62})">
          <g class="circle-correct-badge">
            <circle r="25"/>
            <path d="M -11 0 L -3 9 L 14 -11"/>
          </g>
        </g>
      </g>`
    : "";
  const drawnCircle = showDrawing
    ? `<circle class="drawn-circle${statusClass}" cx="${centerX}" cy="${centerY}" r="${drawRadius}" pathLength="100"/>${radiusLine}${compassMarkup(centerX, centerY, radius, CIRCLE_DRAW_UNIT_PX, "drawing-compass")}${correctEffect}`
    : `<circle class="circle-place-guide" cx="${centerX}" cy="${centerY}" r="54"/><text class="circle-place-text" x="${centerX}" y="${centerY + 6}">중심</text>`;
  const pencilX = CIRCLE_RULER_ZERO_X + radius * CIRCLE_RULER_UNIT_PX;
  const settingCompass = `${compassMarkup(CIRCLE_RULER_ZERO_X, CIRCLE_RULER_Y - 8, radius, CIRCLE_RULER_UNIT_PX, "setting-compass")}
    ${rulerInteractive
      ? `
      <circle class="compass-pencil-handle" cx="${pencilX}" cy="${CIRCLE_RULER_Y - 11}" r="25" tabindex="0" role="slider" aria-label="컴퍼스 반지름" aria-valuemin="1" aria-valuemax="4" aria-valuenow="${radius}"/>`
      : ""}`;
  const rulerControls = `<g class="circle-ruler">
        <rect class="circle-ruler-body" x="48" y="${CIRCLE_RULER_Y - 28}" width="236" height="67" rx="12"/>
        ${rulerTicksMarkup()}
        ${rulerInteractive ? `<rect class="circle-ruler-hitbox" x="66" y="${CIRCLE_RULER_Y - 48}" width="200" height="92" rx="16"/>` : ""}
      </g>
      ${settingCompass}`;
  return `<rect class="circle-paper" x="10" y="8" width="740" height="424" rx="30"/>
    <line class="circle-workbench-divider" x1="330" y1="34" x2="330" y2="406"/>
    ${drawnCircle}
    <circle class="circle-center-dot" cx="${centerX}" cy="${centerY}" r="6"/>
    ${rulerControls}`;
}

function svgPointFromEvent(svg, event) {
  const matrix = svg.getScreenCTM();
  if (!matrix) return null;
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(matrix.inverse());
}

function radiusFromPointer(svg, event) {
  const point = svgPointFromEvent(svg, event);
  if (!point) return circleWorkbench.selectedRadius;
  return clampCircleRadius((point.x - CIRCLE_RULER_ZERO_X) / CIRCLE_RULER_UNIT_PX);
}

function wireCircleWorkbench(svg) {
  const handle = svg.querySelector(".compass-pencil-handle");
  const ruler = svg.querySelector(".circle-ruler-hitbox");
  if (ruler) {
    ruler.addEventListener("pointerdown", (event) => {
      if (circleWorkbench.engineState?.inputLocked) return;
      event.preventDefault();
      setCircleRadius(radiusFromPointer(svg, event));
    });
  }
  if (!handle) return;
  handle.addEventListener("pointerdown", (event) => {
    if (circleWorkbench.engineState?.inputLocked) return;
    event.preventDefault();
    event.stopPropagation();
    circleWorkbench.dragPointerId = event.pointerId;
    svg.setPointerCapture?.(event.pointerId);
    setCircleRadius(radiusFromPointer(svg, event));
  });
  svg.onpointermove = (event) => {
    if (circleWorkbench.dragPointerId !== event.pointerId) return;
    event.preventDefault();
    setCircleRadius(radiusFromPointer(svg, event));
  };
  const finishDrag = (event) => {
    if (circleWorkbench.dragPointerId !== event.pointerId) return;
    circleWorkbench.dragPointerId = null;
    svg.releasePointerCapture?.(event.pointerId);
  };
  svg.onpointerup = finishDrag;
  svg.onpointercancel = finishDrag;
  handle.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowDown" && event.key !== "ArrowRight" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 1;
    setCircleRadius(circleWorkbench.selectedRadius + delta);
    requestAnimationFrame(() => ui.visualArea.querySelector(".compass-pencil-handle")?.focus());
  });
}

function renderCircleWorkbench(problem) {
  let svg = ui.visualArea.querySelector(".circle-draw-svg");
  if (!svg) {
    svg = document.createElementNS(PATTERN_SVG_NS, "svg");
    svg.classList.add("circle-draw-svg");
    ui.visualArea.replaceChildren(svg);
  }
  svg.dataset.state = circleWorkbench.phase;
  svg.dataset.selectedRadius = String(circleWorkbench.selectedRadius);
  svg.dataset.adjusted = String(circleWorkbench.adjusted);
  svg.setAttribute("viewBox", "0 0 760 440");
  svg.setAttribute("role", "img");
  svg.setAttribute(
    "aria-label",
    `${problem.prompt} 현재 컴퍼스의 반지름은 ${circleWorkbench.selectedRadius} 센티미터예요.`,
  );
  svg.innerHTML = circleWorkbenchMarkup(problem);
  wireCircleWorkbench(svg);
}

globalThis.__circleDrawQa = {
  setRadius(value) {
    setCircleRadius(value, true);
    return this.getState();
  },
  submit() {
    circleWorkbench.button?.click();
  },
  getState() {
    const svg = ui.visualArea.querySelector(".circle-draw-svg");
    const handle = svg?.querySelector(".compass-pencil-handle");
    const handleRect = handle?.getBoundingClientRect();
    return {
      selectedRadius: circleWorkbench.selectedRadius,
      adjusted: circleWorkbench.adjusted,
      phase: circleWorkbench.phase,
      buttonDisabled: Boolean(circleWorkbench.button?.disabled),
      handleRect: handleRect ? {
        left: handleRect.left,
        top: handleRect.top,
        width: handleRect.width,
        height: handleRect.height,
      } : null,
    };
  },
};

function primePatternRewardArt() {
  if (patternRewardArtPrimed || typeof Image === "undefined") return;
  patternRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    patternRewardPreloads.push(image);
  });
}

function waitForPattern(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingPatternRewardImpact = {
    event,
    delta: afterPower - beforePower,
  };
}

async function onRewardDismiss({ state }) {
  const impact = pendingPatternRewardImpact;
  pendingPatternRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncPatternPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensurePatternPlayProgress();
  const effectConfig = LESSON_CONFIG.qa?.rewardEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const preEffectDelay = reducedMotion
    ? Math.min(140, Number(effectConfig.preEffectDelayMs || 0))
    : Number(effectConfig.preEffectDelayMs || 0);
  if (progress?.panel && preEffectDelay > 0) {
    progress.panel.dataset.effectPhase = "arming";
    progress.panel.dataset.effectKind = impact.delta > 0
      ? "gain-arming"
      : impact.delta < 0
        ? "loss-arming"
        : "none";
    progress.panel.dataset.effectArmedAt = String(performance.now());
    progress.panel.dataset.effectStartedWithModalHidden = String(
      document.getElementById("rewardPop")?.hidden === true
    );
    await waitForPattern(preEffectDelay);
  }
  return syncPatternPlayProgress(state, {
    animate: true,
    celebrate: impact.delta > 0,
    delta: impact.delta,
    afterModalDismiss: true,
  });
}

globalThis.onRewardReveal = onRewardReveal;
globalThis.onRewardDismiss = onRewardDismiss;
globalThis.onStepCorrect = onStepCorrect;
globalThis.__playProgressQa = {
  syncProgress() {
    return syncPatternPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = patternPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingPatternRewardImpact?.delta ?? null,
      panelClasses: patternPlayProgress?.panel?.className || "",
      effectPhase: patternPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: patternPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: patternPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: patternPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: patternPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: patternPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: patternPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;
primePatternRewardArt();
