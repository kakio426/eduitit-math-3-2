const PIZZA_SVG_NS = "http://www.w3.org/2000/svg";
let pizzaPlayProgress = null;
let pendingPizzaRewardImpact = null;
let pizzaRewardArtPrimed = false;
const pizzaRewardPreloads = [];

function ensurePizzaPlayProgress() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  if (pizzaPlayProgress?.panel?.isConnected) return pizzaPlayProgress;
  const imageSet = LESSON_CONFIG.workbench?.playStateImageSet || {};
  if (imageSet.standard !== "generated-play-progress-v3-left-character") return null;

  document.querySelector(".game")?.classList.add("has-play-progress");
  const panel = document.createElement("aside");
  panel.className = "pizza-play-progress";
  panel.dataset.playProgressStandard = imageSet.standard || "";
  panel.dataset.protagonist = imageSet.protagonist || "";
  panel.dataset.cacheVersion = imageSet.cacheVersion || "";

  const art = document.createElement("img");
  art.className = "pizza-play-progress-art";
  art.alt = "";
  art.decoding = "async";
  art.setAttribute("aria-hidden", "true");

  const flare = document.createElement("span");
  flare.className = "pizza-play-progress-flare";
  flare.setAttribute("aria-hidden", "true");

  const stageImpact = document.createElement("span");
  stageImpact.className = "pizza-play-progress-impact-stage";
  stageImpact.setAttribute("aria-hidden", "true");

  const readout = document.createElement("div");
  readout.className = "pizza-play-progress-readout";
  const eyebrow = document.createElement("span");
  eyebrow.className = "pizza-play-progress-eyebrow";
  eyebrow.textContent = "지금 피자";
  const name = document.createElement("strong");
  name.className = "pizza-play-progress-name";
  const meter = document.createElement("span");
  meter.className = "pizza-play-progress-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("i");
  meterFill.className = "pizza-play-progress-meter-fill";
  meter.appendChild(meterFill);
  readout.append(eyebrow, name, meter);
  panel.append(art, flare, readout);
  playScreen.append(panel, stageImpact);
  pizzaPlayProgress = { panel, art, flare, stageImpact, name, meter, meterFill };
  return pizzaPlayProgress;
}

function syncPizzaPlayProgress(state, options = {}) {
  const progress = ensurePizzaPlayProgress();
  if (!progress) return Promise.resolve();
  const result = Lesson4PizzaFractionModel.getResult(
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
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}이에요. 피자 빛은 ${power}이에요.`);
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

function primePizzaRewardArt() {
  if (pizzaRewardArtPrimed || typeof Image === "undefined") return;
  pizzaRewardArtPrimed = true;
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(LESSON_CONFIG.reward?.artMap || {}),
    ...LESSON_CONFIG.results.map((result) => result.playImage),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    pizzaRewardPreloads.push(image);
  });
}

function waitForPizzaProgress(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function onRewardReveal({ event, beforePower, afterPower }) {
  pendingPizzaRewardImpact = { event, delta: afterPower - beforePower };
}

async function onRewardDismiss({ state }) {
  const impact = pendingPizzaRewardImpact;
  pendingPizzaRewardImpact = null;
  if (!impact) return Promise.resolve();
  if (impact.delta === 0) {
    return syncPizzaPlayProgress(state, { animate: false, delta: 0, afterModalDismiss: true });
  }
  const progress = ensurePizzaPlayProgress();
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
    await waitForPizzaProgress(preEffectDelay);
  }
  return syncPizzaPlayProgress(state, {
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
    return syncPizzaPlayProgress(window.__mathmonEngineQa?.getState?.() || {}, { animate: false });
  },
  getRewardEffectState() {
    const impactRect = pizzaPlayProgress?.stageImpact?.getBoundingClientRect?.();
    return {
      pendingDelta: pendingPizzaRewardImpact?.delta ?? null,
      panelClasses: pizzaPlayProgress?.panel?.className || "",
      effectPhase: pizzaPlayProgress?.panel?.dataset.effectPhase || "idle",
      effectKind: pizzaPlayProgress?.panel?.dataset.effectKind || "none",
      effectArmedAt: pizzaPlayProgress?.panel?.dataset.effectArmedAt || "",
      effectStartedAt: pizzaPlayProgress?.panel?.dataset.effectStartedAt || "",
      effectStartedWithModalHidden: pizzaPlayProgress?.panel?.dataset.effectStartedWithModalHidden || "",
      resultTier: pizzaPlayProgress?.panel?.dataset.resultTier || "",
      imageSrc: pizzaPlayProgress?.art?.getAttribute("src") || "",
      impactLayerRect: impactRect
        ? { left: impactRect.left, top: impactRect.top, width: impactRect.width, height: impactRect.height }
        : null,
    };
  },
};
globalThis.__compassRingQa = globalThis.__playProgressQa;

function ensurePizzaStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".pizza-stage-art")) return;
  const image = document.createElement("img");
  image.className = "pizza-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  syncPizzaPlayProgress(state);
  ensurePizzaStageArt();
  ui.visualArea.dataset.pizzaState = "idle";
  ui.visualArea.dataset.selectedNum = "";
  ui.visualArea.dataset.selectedDen = "";
  renderPizzaWorkbench(problem);
}
function updateProblemVisualForStep(problem, step, state) {
  syncPizzaPlayProgress(state);
  renderPizzaWorkbench(problem);
}
function revealCorrectStep(problem) {
  ui.visualArea.dataset.pizzaState = "correct";
  ui.visualArea.dataset.selectedNum = String(problem.num);
  ui.visualArea.dataset.selectedDen = String(problem.den);
  renderPizzaWorkbench(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.pizzaState = "wrong";
  ui.visualArea.dataset.selectedNum = String(selected.num);
  ui.visualArea.dataset.selectedDen = String(selected.den);
  renderPizzaWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-card";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button fraction-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.den}분의 ${selected.num}`);
    const svg = document.createElementNS(PIZZA_SVG_NS, "svg");
    svg.classList.add("fraction-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 150");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = fractionMarkup(selected.num, selected.den, 120, 76, "choice");
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderPizzaWorkbench(problem) {
  const state = ui.visualArea.dataset.pizzaState || "idle";
  const selectedNum = Number(ui.visualArea.dataset.selectedNum || 0);
  const selectedDen = Number(ui.visualArea.dataset.selectedDen || 1);
  const svg = document.createElementNS(PIZZA_SVG_NS, "svg");
  svg.classList.add("pizza-confirm-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  const spoken = `${selectedDen}분의 ${selectedNum}`;
  svg.setAttribute("aria-label", state === "idle"
    ? "색칠된 부분이 있는 피자"
    : state === "correct"
      ? `전체 ${problem.den}조각 중 색칠된 ${problem.num}조각, ${problem.den}분의 ${problem.num}`
      : `색칠된 피자와 고른 ${spoken}이 서로 달라요`);
  const pizza = pizzaSlicesMarkup(problem.num, problem.den, 120, 125, 92);
  if (state === "idle") {
    svg.innerHTML = pizza;
  } else if (state === "wrong") {
    svg.innerHTML = `${pizza}<text class="fraction-relation" x="350" y="137" text-anchor="middle">≠</text>${fractionMarkup(selectedNum, selectedDen, 455, 126, "selected")}`;
  } else {
    svg.innerHTML = `
      ${pizza}
      <text class="count-name" x="250" y="91">색칠된 조각</text>
      <text class="count-value" x="350" y="92" text-anchor="middle">${problem.num}</text>
      <line class="count-line" x1="313" y1="119" x2="387" y2="119"/>
      <text class="count-name" x="250" y="158">전체 조각</text>
      <text class="count-value" x="350" y="159" text-anchor="middle">${problem.den}</text>
      <text class="fraction-relation" x="405" y="137" text-anchor="middle">=</text>
      ${fractionMarkup(problem.num, problem.den, 455, 126, "selected")}
    `;
  }
  ui.visualArea.replaceChildren(svg);
}

function fractionMarkup(num, den, cx, cy, kind) {
  return `
    <g class="fraction-mark fraction-mark-${kind}">
      <text class="fraction-num" x="${cx}" y="${cy - 18}" text-anchor="middle">${num}</text>
      <line class="fraction-line" x1="${cx - 30}" y1="${cy}" x2="${cx + 30}" y2="${cy}"/>
      <text class="fraction-den" x="${cx}" y="${cy + 42}" text-anchor="middle">${den}</text>
    </g>
  `;
}

function pizzaSlicesMarkup(num, den, cx, cy, radius) {
  let markup = `<circle class="pizza-crust" cx="${cx}" cy="${cy}" r="${radius + 9}"/>`;
  const angle = 360 / den;
  for (let index = 0; index < den; index += 1) {
    const start = -90 + index * angle;
    const end = start + angle;
    const p1 = polarPoint(cx, cy, radius, start);
    const p2 = polarPoint(cx, cy, radius, end);
    const largeArc = angle > 180 ? 1 : 0;
    const shaded = index < num;
    markup += `<path class="pizza-slice ${shaded ? "is-shaded" : "is-open"}" d="M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z"/>`;
    if (shaded) {
      const mid = polarPoint(cx, cy, radius * .58, start + angle / 2);
      markup += `<circle class="pizza-topping" cx="${mid.x}" cy="${mid.y}" r="8"/>`;
    }
  }
  return markup;
}

function polarPoint(cx, cy, radius, degrees) {
  const radians = degrees * Math.PI / 180;
  return { x: (cx + Math.cos(radians) * radius).toFixed(2), y: (cy + Math.sin(radians) * radius).toFixed(2) };
}

primePizzaRewardArt();
