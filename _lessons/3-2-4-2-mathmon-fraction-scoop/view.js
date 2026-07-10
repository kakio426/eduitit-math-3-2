const SCOOP_SVG_NS = "http://www.w3.org/2000/svg";

function ensureScoopStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".scoop-stage-art")) return;
  const image = document.createElement("img");
  image.className = "scoop-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem) {
  ensureScoopStageArt();
  ui.visualArea.dataset.groupValue = "";
  ui.visualArea.dataset.scoopValue = "";
  ui.visualArea.dataset.scoopState = "idle";
  renderScoopWorkbench(problem, 0);
}
function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.scoopState = "idle";
  renderScoopWorkbench(problem, state.stepIndex);
}
function revealCorrectStep(problem, step, state) {
  if (step.id === "find-group") ui.visualArea.dataset.groupValue = String(problem.groupSize);
  if (step.id === "fill-basket") ui.visualArea.dataset.scoopValue = String(problem.answer);
  ui.visualArea.dataset.scoopState = "correct";
  renderScoopWorkbench(problem, state.stepIndex);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.scoopState = "wrong";
  renderScoopWorkbench(problem, state.stepIndex, selected.value);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "number-card";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button quantity-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.value}개`);
    const svg = document.createElementNS(SCOOP_SVG_NS, "svg");
    svg.classList.add("quantity-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 130");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<path class="choice-basket" d="M54 48h132l-14 58H68z"/><path class="choice-handle" d="M82 50c2-39 74-39 76 0"/><text class="choice-number" x="120" y="91" text-anchor="middle">${selected.value}</text>`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderScoopWorkbench(problem, stepIndex, wrongValue = null) {
  const groupValue = ui.visualArea.dataset.groupValue;
  const scoopValue = ui.visualArea.dataset.scoopValue;
  const state = ui.visualArea.dataset.scoopState || "idle";
  const groupFactor = groupValue || "?";
  const svg = document.createElementNS(SCOOP_SVG_NS, "svg");
  svg.classList.add(scoopValue ? "scoop-confirm-svg" : "scoop-workbench-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 700 290");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `전체 ${problem.total}개를 ${problem.den}묶음으로 나누고 ${problem.num}묶음 담기`);
  const groups = groupMarkup(problem);
  const firstValue = groupValue || (wrongValue != null && stepIndex === 0 ? String(wrongValue) : "?");
  const secondValue = scoopValue || (wrongValue != null && stepIndex === 1 ? String(wrongValue) : "?");
  svg.innerHTML = `
    ${groups}
    <g class="calculation ${stepIndex === 0 ? "is-current" : "is-done"}">
      <rect class="calc-card" x="32" y="188" width="290" height="82" rx="24"/>
      <text class="calc-label" x="177" y="214" text-anchor="middle">한 묶음</text>
      <text class="calc-expression" x="177" y="252" text-anchor="middle">${problem.total} ÷ ${problem.den} = ${firstValue}</text>
    </g>
    <g class="calculation ${stepIndex === 1 ? "is-current" : "is-waiting"}">
      <rect class="calc-card" x="378" y="188" width="290" height="82" rx="24"/>
      <text class="calc-label" x="523" y="214" text-anchor="middle">${problem.num}묶음 담기</text>
      <text class="calc-expression" x="523" y="252" text-anchor="middle">${groupFactor} × ${problem.num} = ${secondValue}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function groupMarkup(problem) {
  const startX = 28;
  const gap = 8;
  const width = (644 - gap * (problem.den - 1)) / problem.den;
  let markup = "";
  for (let group = 0; group < problem.den; group += 1) {
    const x = startX + group * (width + gap);
    const chosen = group < problem.num;
    markup += `<g class="item-group ${chosen ? "is-chosen" : ""}"><rect x="${x.toFixed(1)}" y="18" width="${width.toFixed(1)}" height="142" rx="18"/>`;
    markup += `<text class="group-name" x="${(x + width / 2).toFixed(1)}" y="48" text-anchor="middle">${group + 1}묶음</text>`;
    const columns = Math.min(problem.groupSize, 4);
    const rows = Math.ceil(problem.groupSize / columns);
    for (let index = 0; index < problem.groupSize; index += 1) {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const dotX = x + width / 2 + (col - (columns - 1) / 2) * Math.min(23, (width - 24) / columns);
      const dotY = 78 + row * Math.min(25, 62 / Math.max(rows - 1, 1));
      markup += `<circle class="fruit-dot" cx="${dotX.toFixed(1)}" cy="${dotY.toFixed(1)}" r="9"/>`;
    }
    markup += `</g>`;
  }
  return markup;
}
