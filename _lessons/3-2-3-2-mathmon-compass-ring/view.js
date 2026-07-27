const COMPASS_SVG_NS = "http://www.w3.org/2000/svg";
const COMPASS_RULER_MAX = 12;
const COMPASS_TARGET_RADIUS = 92;
let compassProofToken = 0;
let compassRewardStage = null;
let compassRewardArtPrimed = false;
const compassRewardPreloads = [];

function ensureCompassStageArt() {
  primeCompassRewardArt();
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".compass-stage-art")) return;
  const image = document.createElement("img");
  image.className = "compass-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureCompassStageArt();
  compassProofToken += 1;
  ui.visualArea.closest(".problem-grid")?.classList.remove("is-proving");
  setCompassVisualState("waiting", problem.radius, null);
  renderCompassWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
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
    return `바늘을 중심에 고정하고 반지름 ${radius} cm를 유지한 채 컴퍼스를 돌리는 모습`;
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
  const jointX = centerX + COMPASS_TARGET_RADIUS / 2;
  const jointY = 54;
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
    <g class="waiting-compass-rotor" style="transform-origin:${centerX}px ${centerY}px">
      <line class="proof-compass-leg proof-needle-leg" x1="${jointX}" y1="${jointY}" x2="${centerX}" y2="${centerY}"/>
      <line class="proof-compass-leg proof-pencil-leg" x1="${jointX}" y1="${jointY}" x2="${endX}" y2="${centerY}"/>
      <line class="proof-opening-band waiting-opening-band" x1="${centerX}" y1="${centerY}" x2="${endX}" y2="${centerY}"/>
      <circle class="proof-joint" cx="${jointX}" cy="${jointY}" r="11"/>
      <circle class="proof-needle" cx="${centerX}" cy="${centerY}" r="8"/>
      <circle class="proof-pencil" cx="${endX}" cy="${centerY}" r="8"/>
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

function getCompassRewardImage(event) {
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  return event?.image
    || artMap[event?.id]
    || artMap[event?.family]
    || LESSON_CONFIG.imageAssets.rewardClosed;
}

function primeCompassRewardArt() {
  if (compassRewardArtPrimed || typeof Image === "undefined") return;
  compassRewardArtPrimed = true;
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(artMap),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    compassRewardPreloads.push(image);
  });
}

function setCompassRewardArt(image, src) {
  if (!(image instanceof HTMLImageElement)) return;
  const fallback = LESSON_CONFIG.imageAssets.rewardClosed;
  image.onerror = () => {
    image.onerror = null;
    if (image.getAttribute("src") !== fallback) image.src = fallback;
  };
  image.src = src || fallback;
}

function ensureCompassRewardStage() {
  primeCompassRewardArt();
  if (compassRewardStage?.root?.isConnected) return compassRewardStage;
  const panel = document.querySelector("#screen-reward .reward-panel");
  const title = document.getElementById("rewardTitle");
  const engineLabel = document.getElementById("rewardChange");
  const button = document.getElementById("rewardNextButton");
  if (!panel || !title || !engineLabel || !button) return null;

  title.classList.add("visually-hidden");
  engineLabel.className = "visually-hidden";
  engineLabel.setAttribute("aria-hidden", "true");

  const story = document.createElement("div");
  story.className = "compass-reward-story";
  story.dataset.rewardStageStory = "true";
  story.dataset.phase = "closed";

  const visual = document.createElement("div");
  visual.className = "compass-reward-visual";
  const art = document.createElement("img");
  art.className = "compass-reward-art";
  art.alt = "";
  art.setAttribute("aria-hidden", "true");
  visual.appendChild(art);

  const copy = document.createElement("div");
  copy.className = "compass-reward-copy";
  const eyebrow = document.createElement("span");
  eyebrow.className = "compass-reward-eyebrow";
  eyebrow.textContent = "현재 마법진";
  const tier = document.createElement("strong");
  tier.className = "compass-reward-tier";
  const meter = document.createElement("div");
  meter.className = "compass-reward-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("span");
  meterFill.className = "compass-reward-meter-fill";
  meter.appendChild(meterFill);
  const status = document.createElement("p");
  status.className = "compass-reward-status";
  status.setAttribute("aria-live", "polite");
  copy.append(eyebrow, tier, meter, status, button);
  story.append(visual, copy);
  panel.replaceChildren(title, story, engineLabel);

  compassRewardStage = { root: story, art, tier, meter, meterFill, status, button };
  return compassRewardStage;
}

function onRewardPrepare({ beforePower, beforeResult }) {
  const stage = ensureCompassRewardStage();
  if (!stage) return;
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  setCompassRewardArt(stage.art, LESSON_CONFIG.imageAssets.rewardClosed);
  stage.tier.textContent = beforeResult.name;
  stage.meter.setAttribute("aria-valuenow", String(beforePower));
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, beforePower / maxPower * 100))}%`;
  stage.status.textContent = "무엇이 나올까요?";
  stage.root.dataset.phase = "closed";
  stage.root.dataset.reward = "closed";
  stage.root.setAttribute("aria-label", `현재 ${beforeResult.name}. 마법 상자가 닫혀 있어요.`);
  setCompassRewardArt(ui.rewardScene, LESSON_CONFIG.imageAssets.rewardClosed);
}

function onRewardReveal({ event, beforePower, afterPower, beforeResult, afterResult }) {
  const stage = ensureCompassRewardStage();
  if (!stage) return Promise.resolve();
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  const eventImage = getCompassRewardImage(event);
  setCompassRewardArt(stage.art, eventImage);
  stage.tier.textContent = afterResult.name;
  stage.meter.setAttribute("aria-valuenow", String(afterPower));
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, afterPower / maxPower * 100))}%`;
  stage.status.textContent = compassRewardSummary(event, beforePower, afterPower, beforeResult, afterResult);
  stage.root.dataset.phase = "revealed";
  stage.root.dataset.reward = event.family || event.id || "normal";
  stage.root.setAttribute("aria-label", `${stage.status.textContent}. 지금 ${afterResult.name}.`);
  setCompassRewardArt(ui.rewardScene, eventImage);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reducedMotion ? Promise.resolve() : waitForCompass(480);
}

function compassRewardSummary(event, beforePower, afterPower, beforeResult, afterResult) {
  if (event.special || afterResult.needsSpecial) return "전설 마법진을 찾았어요!";
  const change = afterPower - beforePower;
  const changeText = change > 0 ? `+${change}` : change < 0 ? String(change) : "그대로";
  if (beforeResult.id !== afterResult.id) return `${changeText} · ${afterResult.name}이 됐어요!`;
  const nextResult = typeof Lesson3CompassRingModel.getNextResult === "function"
    ? Lesson3CompassRingModel.getNextResult(afterResult)
    : afterResult;
  if (!nextResult || nextResult.id === afterResult.id) return `${changeText} · 가장 큰 마법진이에요!`;
  const missingCorrect = Math.max(0, Number(nextResult.minCorrect || 0) - state.correctFirstTry);
  if (afterPower >= Number(nextResult.minPower || 0) && missingCorrect > 0) {
    return `${changeText} · 문제 ${missingCorrect}개 더`;
  }
  const remaining = Math.max(0, Number(nextResult.minPower || 0) - afterPower);
  return `${changeText} · ${nextResult.name}까지 ${remaining} 더`;
}

primeCompassRewardArt();
