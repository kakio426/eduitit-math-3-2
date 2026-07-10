const CHECK_LOCK_SVG_NS = "http://www.w3.org/2000/svg";

function ensureCheckLockStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".check-lock-stage-art")) return;
  const image = document.createElement("img");
  image.className = "check-lock-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureCheckLockStageArt();
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderCheckLockBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderCheckLockBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(step.answer);
  renderCheckLockBoard(problem, state);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(selected.value);
  renderCheckLockBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button check-lock-choice";
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

function renderCheckLockBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const attemptStep = ui.visualArea.dataset.attemptStep;
  const attemptValue = ui.visualArea.dataset.attemptValue;
  const productDone = state.stepIndex > 0 || revealedStep === "multiply";
  const totalDone = state.stepIndex > 1 || revealedStep === "add";
  const selectedForCurrent = attemptStep === step.id && attemptValue !== "" ? attemptValue : "?";
  const productText = step.id === "multiply" && !productDone ? selectedForCurrent : (productDone ? problem.product : "?");
  const totalText = step.id === "add" && !totalDone ? selectedForCurrent : (totalDone ? problem.checkTotal : "?");
  const showComparison = state.stepIndex >= 2 || revealedStep === "compare" || revealedStep === "locate";
  const locateStep = step.id === "locate";
  const comparisonMark = showComparison ? (problem.matchesOriginal ? "=" : "≠") : "?";

  const svg = document.createElementNS(CHECK_LOCK_SVG_NS, "svg");
  svg.classList.add("check-lock-svg");
  svg.setAttribute("viewBox", "0 0 600 470");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 검산판</title>
    <rect x="18" y="14" width="564" height="442" rx="32" class="lock-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="300" y="62" class="lock-small-label">나눗셈</text>
      <text x="300" y="112" class="lock-problem-text">${problem.dividend} ÷ ${problem.divisor} = ${problem.shownQuotient} … ${problem.shownRemainder}</text>

      <rect x="54" y="146" width="492" height="122" rx="22" class="lock-calc-panel"/>
      <text x="150" y="178" class="lock-small-label">나누는 수 × 몫</text>
      <text x="150" y="226" class="lock-value ${step.id === "multiply" ? "is-current" : ""}">${problem.divisor} × ${problem.shownQuotient}</text>
      <text x="282" y="226" class="lock-sign">=</text>
      <text x="370" y="226" class="lock-value ${step.id === "multiply" ? "is-current" : ""}">${productText}</text>
      <text x="438" y="226" class="lock-sign">+</text>
      <g class="${locateStep && problem.mismatchPart === "remainder" ? "is-error-part" : ""}">
        <text x="498" y="178" class="lock-small-label">나머지</text>
        <text x="498" y="226" class="lock-value ${step.id === "add" ? "is-current" : ""}">${problem.shownRemainder}</text>
      </g>

      <rect x="54" y="292" width="214" height="118" rx="22" class="lock-total-panel ${step.id === "add" ? "is-current-panel" : ""}"/>
      <text x="161" y="326" class="lock-small-label">검산값</text>
      <text x="161" y="382" class="lock-total-value">${totalText}</text>
      <text x="300" y="366" class="lock-compare-mark ${step.id === "compare" ? "is-current" : ""}">${comparisonMark}</text>
      <rect x="332" y="292" width="214" height="118" rx="22" class="lock-total-panel ${locateStep && problem.mismatchPart === "quotient" ? "is-error-part" : ""}"/>
      <text x="439" y="326" class="lock-small-label">처음 수</text>
      <text x="439" y="382" class="lock-total-value">${problem.dividend}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}
