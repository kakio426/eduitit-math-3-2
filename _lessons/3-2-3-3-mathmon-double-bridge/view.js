const BRIDGE_SVG_NS = "http://www.w3.org/2000/svg";
let bridgePlayProgress = null;
let pendingBridgeRewardImpact = null;
let bridgeRewardArtPrimed = false;
const bridgeRewardPreloads = [];

async function onStepCorrect({ button }) {
  const workbench = document.querySelector("#screen-play .bridge-workshop");
  if (!workbench) return;
  const effectConfig = LESSON_CONFIG.qa?.correctFeedbackEffectAudit || {};
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reducedMotion ? 0 : Number(effectConfig.durationMs || 680);

  workbench.classList.remove("is-answer-locking");
  button?.classList.remove("is-answer-locking");
  void workbench.offsetWidth;
  workbench.classList.add("is-answer-locking");
  button?.classList.add("is-answer-locking");
  workbench.dataset.correctEffectPhase = "active";

  if (duration > 0) await waitForBridge(duration);
  workbench.classList.remove("is-answer-locking");
  button?.classList.remove("is-answer-locking");
  workbench.dataset.correctEffectPhase = "idle";
}

function ensureBridgePlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (bridgePlayProgress?.panel?.isConnected) return bridgePlayProgress;

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
  eyebrow.textContent = "지금의 다리";
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
  bridgePlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return bridgePlayProgress;
}

function syncBridgePlayProgress(state, options = {}) {
  const progress = ensureBridgePlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson3DoubleBridgeModel.getResult(
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
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}예요. 다리 힘은 ${power}이에요.`);
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

function ensureBridgeStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;
  playScreen.querySelector(".problem-grid")?.classList.add("bridge-workshop");
  if (playScreen.querySelector(".bridge-stage-art")) return;
  const image = document.createElement("img");
  image.className = "bridge-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function getCircleGeometry(problem) {
  const centerX = 380;
  const circleY = 158;
  const circleRadiusPx = 124;
  const circleLeft = centerX - circleRadiusPx;
  const circleRight = centerX + circleRadiusPx;
  const answer = problem.ask === "지름" ? problem.diameter : problem.radius;
  return {
    answer,
    centerX,
    circleY,
    circleRadiusPx,
    circleLeft,
    circleRight,
  };
}

function renderProblemVisual(problem, state) {
  syncBridgePlayProgress(state);
  ensureBridgeStageArt();
  setCircleRelationState("idle");
  renderCircleRelation(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  syncBridgePlayProgress(state);
  ui.instructionText.hidden = true;
  setCircleRelationState("idle");
  renderCircleRelation(problem);
}

function revealCorrectStep(problem, step) {
  setCircleRelationState("correct", step.answer);
  renderCircleRelation(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  setCircleRelationState("wrong", selected.value);
  result.button.disabled = true;
  result.button.setAttribute("aria-label", `${selected.value} cm, 맞지 않아요.`);
  renderCircleRelation(problem);
}

function setCircleRelationState(relationState, selectedLength = "") {
  ui.visualArea.dataset.relationState = relationState;
  ui.visualArea.dataset.selectedLength = String(selectedLength);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "lengths";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button length-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.dataset.length = String(selected.value);
    if (selected.misconceptionId) button.dataset.misconception = selected.misconceptionId;
    button.setAttribute("aria-label", `${selected.value} cm 고르기`);
    const value = document.createElement("span");
    value.className = "length-choice-value";
    value.textContent = `${selected.value} cm`;
    button.appendChild(value);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function onResult({ result }) {
  document.getElementById("restartButton")?.classList.remove("result-restart-hitbox");
  if (result?.needsSpecial) {
    if (ui.resultNext) ui.resultNext.textContent = "최고 단계예요!";
    if (ui.resultNextSvg) ui.resultNextSvg.textContent = "최고 단계예요!";
  }
}

function renderCircleRelation(problem) {
  const state = ui.visualArea.dataset.relationState || "idle";
  const selectedValue = ui.visualArea.dataset.selectedLength;
  const selected = selectedValue === "" ? null : Number(selectedValue);
  const geometry = getCircleGeometry(problem);
  const svg = document.createElementNS(BRIDGE_SVG_NS, "svg");
  svg.classList.add("circle-relation-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 760 336");
  svg.setAttribute("role", "img");
  const shownAnswer = selected == null ? "물음표" : `${selected} 센티미터`;
  svg.setAttribute("aria-label", problem.ask === "지름"
    ? `반지름 ${problem.radius} 센티미터 두 개. 지름은 ${shownAnswer}`
    : `지름 ${problem.diameter} 센티미터. 반지름은 ${shownAnswer}`);
  svg.innerHTML = circleRelationMarkup(problem, geometry, selected);
  ui.visualArea.replaceChildren(svg);
}

function circleRelationMarkup(problem, geometry, selected) {
  const askDiameter = problem.ask === "지름";
  const shownAnswer = selected == null ? "?" : selected;
  const equation = selected == null
    ? ""
    : askDiameter
      ? `${problem.radius} + ${problem.radius} ${selected === geometry.answer ? "=" : "≠"} ${selected}`
      : `${problem.diameter} ÷ 2 ${selected === geometry.answer ? "=" : "≠"} ${selected}`;
  const relationMarkup = askDiameter
    ? `
      <text class="known-length" x="${(geometry.circleLeft + geometry.centerX) / 2}" y="${geometry.circleY - 24}" text-anchor="middle">${problem.radius} cm</text>
      <line class="answer-measure" x1="${geometry.circleLeft}" y1="${geometry.circleY + 60}" x2="${geometry.circleRight}" y2="${geometry.circleY + 60}"/>
      <line class="answer-measure-cap" x1="${geometry.circleLeft}" y1="${geometry.circleY + 52}" x2="${geometry.circleLeft}" y2="${geometry.circleY + 68}"/>
      <line class="answer-measure-cap" x1="${geometry.circleRight}" y1="${geometry.circleY + 52}" x2="${geometry.circleRight}" y2="${geometry.circleY + 68}"/>
      <text class="source-question" x="${geometry.centerX}" y="${geometry.circleY + 100}" text-anchor="middle">${shownAnswer} cm</text>
    `
    : `
      <line class="known-measure" x1="${geometry.circleLeft}" y1="${geometry.circleY - 60}" x2="${geometry.circleRight}" y2="${geometry.circleY - 60}"/>
      <line class="known-measure-cap" x1="${geometry.circleLeft}" y1="${geometry.circleY - 68}" x2="${geometry.circleLeft}" y2="${geometry.circleY - 52}"/>
      <line class="known-measure-cap" x1="${geometry.circleRight}" y1="${geometry.circleY - 68}" x2="${geometry.circleRight}" y2="${geometry.circleY - 52}"/>
      <text class="known-length" x="${geometry.centerX}" y="${geometry.circleY - 76}" text-anchor="middle">${problem.diameter} cm</text>
      <line class="answer-measure" x1="${geometry.centerX}" y1="${geometry.circleY + 60}" x2="${geometry.circleRight}" y2="${geometry.circleY + 60}"/>
      <line class="answer-measure-cap" x1="${geometry.centerX}" y1="${geometry.circleY + 52}" x2="${geometry.centerX}" y2="${geometry.circleY + 68}"/>
      <line class="answer-measure-cap" x1="${geometry.circleRight}" y1="${geometry.circleY + 52}" x2="${geometry.circleRight}" y2="${geometry.circleY + 68}"/>
      <text class="source-question" x="${(geometry.centerX + geometry.circleRight) / 2}" y="${geometry.circleY + 100}" text-anchor="middle">${shownAnswer} cm</text>
    `;
  return `
    <g class="circle-relation">
      <circle class="bridge-circle-shadow" cx="${geometry.centerX}" cy="${geometry.circleY + 5}" r="${geometry.circleRadiusPx}"/>
      <circle class="bridge-circle" cx="${geometry.centerX}" cy="${geometry.circleY}" r="${geometry.circleRadiusPx}"/>
      <line class="radius-half radius-half-left${askDiameter ? "" : " radius-half-muted"}" x1="${geometry.circleLeft}" y1="${geometry.circleY}" x2="${geometry.centerX}" y2="${geometry.circleY}"/>
      <line class="radius-half radius-half-right radius-half-focus" x1="${geometry.centerX}" y1="${geometry.circleY}" x2="${geometry.circleRight}" y2="${geometry.circleY}"/>
      <circle class="bridge-center" cx="${geometry.centerX}" cy="${geometry.circleY}" r="8"/>
      <circle class="bridge-end" cx="${geometry.circleLeft}" cy="${geometry.circleY}" r="7"/>
      <circle class="bridge-end" cx="${geometry.circleRight}" cy="${geometry.circleY}" r="7"/>
      ${relationMarkup}
    </g>
    <text class="bridge-equation" x="${geometry.centerX}" y="324" text-anchor="middle">${equation}</text>
  `;
}

function primeBridgeRewardArt() {
  if (bridgeRewardArtPrimed || typeof Image === "undefined") return;
  bridgeRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    bridgeRewardPreloads.push(image);
  });
}

function waitForBridge(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingBridgeRewardImpact = {
    event,
    delta: afterPower - beforePower,
  };
}

async function onRewardDismiss({ state }) {
  const impact = pendingBridgeRewardImpact;
  pendingBridgeRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncBridgePlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensureBridgePlayProgress();
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
    await waitForBridge(preEffectDelay);
  }
  return syncBridgePlayProgress(state, {
    animate: true,
    celebrate: impact.delta > 0,
    delta: impact.delta,
    afterModalDismiss: true,
  });
}

globalThis.onRewardReveal = onRewardReveal;
globalThis.onRewardDismiss = onRewardDismiss;
globalThis.onStepCorrect = onStepCorrect;
globalThis.__compassRingQa = {
  syncProgress() {
    return syncBridgePlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = bridgePlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingBridgeRewardImpact?.delta ?? null,
      panelClasses: bridgePlayProgress?.panel?.className || "",
      effectPhase: bridgePlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: bridgePlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: bridgePlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: bridgePlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: bridgePlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: bridgePlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: bridgePlayProgress?.art?.getAttribute("src") || "",
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
primeBridgeRewardArt();
