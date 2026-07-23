const BRIDGE_SVG_NS = "http://www.w3.org/2000/svg";

function ensureBridgeStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".bridge-stage-art")) return;
  const image = document.createElement("img");
  image.className = "bridge-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureBridgeStageArt();
  ui.visualArea.dataset.bridgeState = "idle";
  ui.visualArea.dataset.selectedLength = "";
  renderCircleBridgeWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.bridgeState = "idle";
  ui.visualArea.dataset.selectedLength = "";
  renderCircleBridgeWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.bridgeState = "correct";
  ui.visualArea.dataset.selectedLength = String(step.answer);
  renderCircleBridgeWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.bridgeState = "wrong";
  ui.visualArea.dataset.selectedLength = String(selected.value);
  renderCircleBridgeWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "bridge-length";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button bridge-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.value} cm 길이 다리`);
    const svg = document.createElementNS(BRIDGE_SVG_NS, "svg");
    svg.classList.add("bridge-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 145");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = bridgeChoiceMarkup(selected.value);
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function bridgeChoiceMarkup(value) {
  const width = 54 + value * 8;
  const x = (240 - width) / 2;
  const plankCount = Math.max(2, Math.round(width / 24));
  let seams = "";
  for (let index = 1; index < plankCount; index += 1) {
    const seamX = x + (width / plankCount) * index;
    seams += `<line class="bridge-seam" x1="${seamX}" y1="58" x2="${seamX}" y2="88"/>`;
  }
  return `
    <rect class="bridge-plank" x="${x}" y="58" width="${width}" height="30" rx="8"/>
    ${seams}
    <line class="bridge-rope" x1="${x}" y1="48" x2="${x + width}" y2="48"/>
    <line class="bridge-hanger" x1="${x + 8}" y1="48" x2="${x + 8}" y2="58"/>
    <line class="bridge-hanger" x1="${x + width - 8}" y1="48" x2="${x + width - 8}" y2="58"/>
    <text class="bridge-length-label" x="120" y="124" text-anchor="middle">${value} cm</text>
  `;
}

function renderCircleBridgeWorkbench(problem) {
  const state = ui.visualArea.dataset.bridgeState || "idle";
  const selected = Number(ui.visualArea.dataset.selectedLength || 0);
  const svg = document.createElementNS(BRIDGE_SVG_NS, "svg");
  svg.classList.add("circle-bridge-confirm-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", problem.ask === "지름" ? `반지름 ${problem.radius} cm 두 개와 지름` : `지름 ${problem.diameter} cm를 반으로 나눈 반지름`);
  svg.innerHTML = circleBridgeMarkup(problem, state === "idle" ? null : selected, state === "correct");
  ui.visualArea.replaceChildren(svg);
}

function circleBridgeMarkup(problem, selected, matches) {
  const left = 150;
  const center = 260;
  const right = 370;
  const askDiameter = problem.ask === "지름";
  const resolved = matches ? selected : null;
  const leftLabel = askDiameter ? `${problem.radius} cm` : `${resolved ?? "?"} cm`;
  const rightLabel = askDiameter ? `${problem.radius} cm` : `${resolved ?? "?"} cm`;
  const diameterLabel = askDiameter ? `${resolved ?? "?"} cm` : `${problem.diameter} cm`;
  const equation = selected == null ? "" : askDiameter
    ? `${problem.radius} + ${problem.radius} ${matches ? "=" : "≠"} ${selected}`
    : `${problem.diameter} ÷ 2 ${matches ? "=" : "≠"} ${selected}`;
  return `
    <circle class="bridge-circle" cx="260" cy="126" r="112"/>
    <line class="radius-half radius-half-left" x1="${left}" y1="126" x2="${center}" y2="126"/>
    <line class="radius-half radius-half-right" x1="${center}" y1="126" x2="${right}" y2="126"/>
    <circle class="bridge-center" cx="${center}" cy="126" r="7"/>
    <circle class="bridge-end" cx="${left}" cy="126" r="6"/>
    <circle class="bridge-end" cx="${right}" cy="126" r="6"/>
    <text class="radius-name" x="205" y="76" text-anchor="middle">반지름</text>
    <text class="radius-name" x="315" y="76" text-anchor="middle">반지름</text>
    <text class="radius-value" x="205" y="112" text-anchor="middle">${leftLabel}</text>
    <text class="radius-value" x="315" y="112" text-anchor="middle">${rightLabel}</text>
    <line class="diameter-brace" x1="${left}" y1="166" x2="${right}" y2="166"/>
    <line class="diameter-brace" x1="${left}" y1="158" x2="${left}" y2="174"/>
    <line class="diameter-brace" x1="${right}" y1="158" x2="${right}" y2="174"/>
    <text class="diameter-value" x="260" y="202" text-anchor="middle">지름 ${diameterLabel}</text>
    <text class="bridge-equation" x="260" y="238" text-anchor="middle">${equation}</text>
  `;
}
