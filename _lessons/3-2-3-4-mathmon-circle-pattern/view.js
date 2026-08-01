const PATTERN_SVG_NS = "http://www.w3.org/2000/svg";
let patternPlayProgress = null;

function ensurePatternPlayProgress() {
  if (patternPlayProgress) return patternPlayProgress;
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return null;
  const panel = document.createElement("aside");
  panel.className = "compass-play-progress";
  panel.dataset.playProgressStandard = LESSON_CONFIG.workbench.playStateImageSet.standard;
  panel.dataset.protagonist = LESSON_CONFIG.workbench.playStateImageSet.protagonist;
  panel.dataset.cacheVersion = LESSON_CONFIG.workbench.playStateImageSet.cacheVersion;
  const art = document.createElement("img");
  art.className = "compass-play-progress-art";
  art.alt = "";
  art.setAttribute("aria-hidden", "true");
  const readout = document.createElement("div");
  readout.className = "compass-play-progress-readout";
  const eyebrow = document.createElement("span");
  eyebrow.className = "compass-play-progress-eyebrow";
  eyebrow.textContent = "지금 무늬";
  const name = document.createElement("strong");
  name.className = "compass-play-progress-name";
  const meter = document.createElement("span");
  meter.className = "compass-play-progress-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward.maxPower || 100));
  const fill = document.createElement("i");
  fill.className = "compass-play-progress-meter-fill";
  meter.append(fill);
  readout.append(eyebrow, name, meter);
  panel.append(art, readout);
  playScreen.append(panel);
  patternPlayProgress = { panel, art, name, meter, fill };
  return patternPlayProgress;
}

function syncPatternPlayProgress(state = {}) {
  const progress = ensurePatternPlayProgress();
  if (!progress) return;
  const result = Lesson3CirclePatternModel.getResult(Number(state.power || 0), Number(state.correctFirstTry || 0), Boolean(state.specialSeen));
  const max = Number(LESSON_CONFIG.reward.maxPower || 100);
  const power = Math.max(0, Math.min(Number(state.power || 0), max));
  progress.panel.dataset.resultTier = result.id;
  progress.panel.dataset.power = String(power);
  progress.name.textContent = result.name;
  progress.art.src = result.playImage;
  progress.meter.setAttribute("aria-valuenow", String(power));
  progress.fill.style.width = `${power / max * 100}%`;
  progress.panel.setAttribute("aria-label", `지금은 ${result.name}이에요.`);
}

function ensurePatternStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".pattern-stage-art")) return;
  const image = document.createElement("img");
  image.className = "pattern-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensurePatternStageArt();
  syncPatternPlayProgress(state);
  ui.visualArea.dataset.patternState = "idle";
  ui.visualArea.dataset.patternKind = "pending";
  renderPatternWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  syncPatternPlayProgress(state);
  ui.visualArea.dataset.patternState = "idle";
  ui.visualArea.dataset.patternKind = "pending";
  renderPatternWorkbench(problem);
}

async function onRewardDismiss({ state }) {
  syncPatternPlayProgress(state);
}

globalThis.__mathmonPlayProgressQa = { syncProgress: () => syncPatternPlayProgress(window.__mathmonEngineQa?.getState?.() || {}) };

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.patternState = "correct";
  ui.visualArea.dataset.patternKind = "correct";
  renderPatternWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.patternState = "wrong";
  ui.visualArea.dataset.patternKind = selected.visualKind;
  renderPatternWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "circle-pattern";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button pattern-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", selected.label);
    const svg = document.createElementNS(PATTERN_SVG_NS, "svg");
    svg.classList.add("pattern-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 145");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = patternMarkup(problem.orientation, selected.visualKind, problem.radius, false);
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderPatternWorkbench(problem) {
  const state = ui.visualArea.dataset.patternState || "idle";
  const kind = ui.visualArea.dataset.patternKind || "pending";
  const svg = document.createElementNS(PATTERN_SVG_NS, "svg");
  svg.classList.add("pattern-confirm-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", state === "idle" ? "원 세 개 다음에 올 원 자리" : "선택한 원 무늬 확인");
  svg.innerHTML = patternMarkup(problem.orientation, kind, problem.radius * 1.5, true);
  ui.visualArea.replaceChildren(svg);
}

function basePatternGeometry(orientation, large) {
  if (large) {
    if (orientation === "up") return { start: { x: 105, y: 178 }, vector: { x: 96, y: -42 } };
    if (orientation === "down") return { start: { x: 105, y: 72 }, vector: { x: 96, y: 42 } };
    return { start: { x: 95, y: 125 }, vector: { x: 108, y: 0 } };
  }
  if (orientation === "up") return { start: { x: 46, y: 106 }, vector: { x: 47, y: -21 } };
  if (orientation === "down") return { start: { x: 46, y: 39 }, vector: { x: 47, y: 21 } };
  return { start: { x: 42, y: 72 }, vector: { x: 50, y: 0 } };
}

function patternMarkup(orientation, kind, radius, large) {
  const geometry = basePatternGeometry(orientation, large);
  const { start, vector } = geometry;
  const known = [0, 1, 2].map((index) => ({ x: start.x + vector.x * index, y: start.y + vector.y * index }));
  const expected = { x: start.x + vector.x * 3, y: start.y + vector.y * 3 };
  let candidate = { ...expected };
  let candidateRadius = radius;
  if (kind === "gap-wide") {
    candidate.x += vector.x * 0.42;
    candidate.y += vector.y * 0.42;
  } else if (kind === "off-line") {
    const length = Math.hypot(vector.x, vector.y) || 1;
    candidate.x += (-vector.y / length) * (large ? 48 : 25);
    candidate.y += (vector.x / length) * (large ? 48 : 25);
  } else if (kind === "size-changed") {
    candidateRadius *= 1.48;
  }
  const lineEnd = kind === "gap-wide" ? candidate : expected;
  const guide = `<line class="pattern-guide" x1="${start.x}" y1="${start.y}" x2="${lineEnd.x}" y2="${lineEnd.y}"/>`;
  const knownMarkup = known.map((point) => `<circle class="pattern-known" cx="${point.x}" cy="${point.y}" r="${radius}"/>`).join("");
  if (kind === "pending") {
    return `${guide}${knownMarkup}<circle class="pattern-pending" cx="${expected.x}" cy="${expected.y}" r="${radius}"/><text class="pattern-question" x="${expected.x}" y="${expected.y + radius * .35}" text-anchor="middle">?</text>`;
  }
  return `${guide}${knownMarkup}<circle class="pattern-candidate" cx="${candidate.x}" cy="${candidate.y}" r="${candidateRadius}"/>`;
}
