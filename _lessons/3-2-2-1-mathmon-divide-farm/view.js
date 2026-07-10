const FARM_SVG_NS = "http://www.w3.org/2000/svg";

function ensureFarmStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".farm-stage-art")) return;
  const image = document.createElement("img");
  image.className = "farm-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureFarmStageArt();
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderFarmBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderFarmBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(step.answer);
  renderFarmBoard(problem, state);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(selected.value);
  renderFarmBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button farm-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", selected.label);
    const value = document.createElement("strong");
    value.textContent = selected.label;
    button.appendChild(value);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function renderFarmBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const attemptStep = ui.visualArea.dataset.attemptStep;
  const attemptValue = ui.visualArea.dataset.attemptValue;
  const tensDone = state.stepIndex > 0 || revealedStep === "tens";
  const onesDone = state.stepIndex > 1 || revealedStep === "ones";
  const combineDone = revealedStep === "combine";
  const selectedValue = attemptStep === step.id && attemptValue !== "" ? attemptValue : "?";
  const tensValue = step.id === "tens" && !tensDone ? selectedValue : (tensDone ? problem.tensQuotient : "?");
  const onesValue = step.id === "ones" && !onesDone ? selectedValue : (onesDone ? problem.onesQuotient : "?");
  const totalValue = step.id === "combine" && !combineDone ? selectedValue : (combineDone ? problem.quotient : "?");

  const svg = document.createElementNS(FARM_SVG_NS, "svg");
  svg.classList.add("place-value-farm-svg");
  svg.setAttribute("viewBox", "0 0 700 455");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 자리 나누기</title>
    <rect x="14" y="12" width="672" height="430" rx="34" class="farm-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="350" y="72" class="farm-problem">${problem.dividend} ÷ ${problem.divisor}</text>

      <rect x="44" y="105" width="292" height="180" rx="24" class="farm-place-panel ${step.id === "tens" ? "is-current-panel" : ""}"/>
      <text x="190" y="145" class="farm-label">10개 묶음 몫</text>
      <text x="190" y="202" class="farm-calc">${problem.tens}묶음 ÷ ${problem.divisor}</text>
      <text x="190" y="258" class="farm-answer ${step.id === "tens" ? "is-current" : ""}">${tensValue}묶음</text>

      <rect x="364" y="105" width="292" height="180" rx="24" class="farm-place-panel ${step.id === "ones" ? "is-current-panel" : ""}"/>
      <text x="510" y="145" class="farm-label">낱개 몫</text>
      <text x="510" y="202" class="farm-calc">${problem.ones}개 ÷ ${problem.divisor}</text>
      <text x="510" y="258" class="farm-answer ${step.id === "ones" ? "is-current" : ""}">${onesValue}개</text>

      <rect x="128" y="316" width="444" height="94" rx="25" class="farm-total-panel ${step.id === "combine" ? "is-current-panel" : ""}"/>
      <text x="250" y="352" class="farm-label">전체 몫</text>
      <text x="250" y="390" class="farm-place-hint">십의 자리 · 일의 자리</text>
      <text x="470" y="382" class="farm-total ${step.id === "combine" ? "is-current" : ""}">${totalValue}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}
