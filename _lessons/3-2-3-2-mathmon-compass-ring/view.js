const COMPASS_SVG_NS = "http://www.w3.org/2000/svg";
const COMPASS_RULER_MAX = 12;

function ensureCompassStageArt() {
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
  ui.visualArea.dataset.compassState = "idle";
  ui.visualArea.dataset.opening = "";
  renderCompassWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.compassState = "idle";
  ui.visualArea.dataset.opening = "";
  renderCompassWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.compassState = "correct";
  ui.visualArea.dataset.opening = String(problem.radius);
  renderCompassWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.compassState = "wrong";
  ui.visualArea.dataset.opening = String(selected.value);
  renderCompassWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "compass-diagram";
  step.choices.forEach((selected, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button compass-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `컴퍼스를 ${selected.value} cm만큼 벌린 그림`);

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
  const state = ui.visualArea.dataset.compassState || "idle";
  const opening = Number(ui.visualArea.dataset.opening || problem.radius);
  const svg = document.createElementNS(COMPASS_SVG_NS, "svg");
  svg.classList.add("compass-confirm-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", state === "idle" ? `반지름 ${problem.radius} cm인 원` : `반지름 ${problem.radius} cm와 컴퍼스 벌림 ${opening} cm 비교`);
  svg.innerHTML = state === "idle"
    ? targetRadiusMarkup(problem.radius, 260)
    : compareRadiusAndOpeningMarkup(problem.radius, opening, state === "correct");
  ui.visualArea.replaceChildren(svg);
}

function targetRadiusMarkup(radius, centerX) {
  return `
    <circle class="target-circle" cx="${centerX}" cy="125" r="70"/>
    <circle class="target-center" cx="${centerX}" cy="125" r="6"/>
    <line class="target-radius" x1="${centerX}" y1="125" x2="${centerX + 70}" y2="125"/>
    <circle class="target-end" cx="${centerX + 70}" cy="125" r="5"/>
    <text class="target-radius-label" x="${centerX + 35}" y="108" text-anchor="middle">${radius} cm</text>
  `;
}

function compareRadiusAndOpeningMarkup(radius, opening, matches) {
  const x0 = 325;
  const unit = 13;
  const x1 = x0 + opening * unit;
  const apexX = (x0 + x1) / 2;
  return `
    ${targetRadiusMarkup(radius, 125)}
    <text class="mapping-equals" x="260" y="138" text-anchor="middle">${matches ? "=" : "≠"}</text>
    <line class="confirm-ruler" x1="${x0}" y1="164" x2="481" y2="164"/>
    <line class="confirm-band" x1="${x0}" y1="151" x2="${x1}" y2="151"/>
    <line class="confirm-leg" x1="${apexX}" y1="54" x2="${x0}" y2="151"/>
    <line class="confirm-leg confirm-pencil-leg" x1="${apexX}" y1="54" x2="${x1}" y2="151"/>
    <circle class="confirm-joint" cx="${apexX}" cy="54" r="9"/>
    <circle class="confirm-foot" cx="${x0}" cy="151" r="5"/>
    <circle class="confirm-foot" cx="${x1}" cy="151" r="5"/>
    <text class="confirm-opening-label" x="403" y="204" text-anchor="middle">${opening} cm</text>
  `;
}
