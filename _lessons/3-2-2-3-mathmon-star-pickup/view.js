const STAR_SVG_NS = "http://www.w3.org/2000/svg";

function ensureStarStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".star-stage-art")) return;
  const image = document.createElement("img");
  image.className = "star-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureStarStageArt();
  ui.visualArea.dataset.proofChoice = "";
  ui.visualArea.dataset.revealedStep = "";
  renderStarMathBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.proofChoice = "";
  ui.visualArea.dataset.revealedStep = "";
  renderStarMathBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  if (step.id === "quotient") ui.visualArea.dataset.proofChoice = String(problem.quotient);
  renderStarMathBoard(problem, state);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct || step.id !== "quotient") return;
  ui.visualArea.dataset.proofChoice = String(selected.value);
  renderStarMathBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button star-choice";
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

function renderStarMathBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const rawProofChoice = ui.visualArea.dataset.proofChoice;
  const showProof = rawProofChoice !== "";
  const proofChoice = showProof ? Number(rawProofChoice) : Number.NaN;
  const quotientDone = state.stepIndex > 0 || revealedStep === "quotient" || revealedStep === "remainder";
  const remainderDone = revealedStep === "remainder";
  const selectedGrouped = showProof ? proofChoice * problem.divisor : 0;
  const fillWidth = showProof ? Math.min(560, Math.round((selectedGrouped / problem.dividend) * 560)) : 0;
  const overflowWidth = showProof && selectedGrouped > problem.dividend
    ? Math.min(90, Math.max(28, Math.round(((selectedGrouped - problem.dividend) / problem.dividend) * 560)))
    : 0;
  const remainingStars = quotientDone ? problem.remainder : 0;

  const svg = document.createElementNS(STAR_SVG_NS, "svg");
  svg.classList.add("star-math-svg");
  svg.setAttribute("viewBox", "0 0 920 360");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 별 묶기</title>
    <rect x="100" y="18" width="720" height="324" rx="30" fill="#07142f" fill-opacity="0.94" stroke="#f0ce65" stroke-width="4" />
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="280" y="74" class="star-board-label">전체 별</text>
      <text x="280" y="138" class="star-board-number">${problem.dividend}</text>
      <text x="460" y="74" class="star-board-label">한 묶음</text>
      <text x="460" y="138" class="star-board-number">${problem.divisor}개씩</text>
      <text x="640" y="74" class="star-board-label">만든 묶음</text>
      <text x="640" y="138" class="star-board-number ${state.stepIndex === 0 ? "is-current" : ""}">${quotientDone ? problem.quotient : "?"}</text>
      ${state.stepIndex > 0 || remainderDone ? `<text x="640" y="206" class="star-board-label">남은 별</text><text x="640" y="268" class="star-board-number is-current">${remainderDone ? problem.remainder : "?"}</text>` : ""}
      ${showProof ? `<g class="star-proof"><rect class="star-proof-bar" x="160" y="238" width="560" height="34" rx="17" fill="#17345f"/><rect x="160" y="238" width="${fillWidth}" height="34" rx="17" fill="#5bd4d1"/>${overflowWidth ? `<rect x="720" y="238" width="${overflowWidth}" height="34" rx="17" fill="#ef6688"/>` : ""}${renderStarDots(remainingStars)}</g>` : ""}
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function renderStarDots(count) {
  if (!count) return "";
  return Array.from({ length: count }, (_, index) => {
    const x = 190 + index * 42;
    return `<circle cx="${x}" cy="312" r="10" fill="#ffd45c"/><text x="${x}" y="318" font-size="14" fill="#5b3a00">★</text>`;
  }).join("");
}
