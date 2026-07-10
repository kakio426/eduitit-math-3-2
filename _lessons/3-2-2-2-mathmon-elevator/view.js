const SVG_NS = "http://www.w3.org/2000/svg";

function ensureElevatorStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".elevator-stage-art")) return;
  const image = document.createElement("img");
  image.className = "elevator-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureElevatorStageArt();
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.misconception = "";
  renderElevatorMathBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.misconception = "";
  renderElevatorMathBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.misconception = "";
  renderElevatorMathBoard(problem, state);
}

function renderAttempt(problem, step, choice, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.misconception = choice.misconceptionId || "";
  renderElevatorMathBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.choices[0]?.kind || "number";

  for (const choice of step.choices) {
    const button = document.createElement("button");
    button.className = "choice-button elevator-choice";
    button.type = "button";
    button.dataset.choice = choice.id;
    button.dataset.correct = choice.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", choice.label);

    if (choice.kind === "quotient-remaining-pair") {
      button.classList.add("elevator-choice--pair");
      for (const part of choice.parts) {
        const cell = document.createElement("span");
        cell.className = "elevator-choice-part";

        const label = document.createElement("span");
        label.className = "elevator-choice-label";
        label.textContent = part.label;

        const value = document.createElement("strong");
        value.className = "elevator-choice-value";
        value.textContent = String(part.value);

        cell.append(label, value);
        button.appendChild(cell);
      }
    } else {
      const value = document.createElement("strong");
      value.className = "elevator-number-value";
      value.textContent = String(choice.value);
      button.appendChild(value);
    }

    button.addEventListener("click", () => choose(choice, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function renderElevatorMathBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const misconception = ui.visualArea.dataset.misconception;
  const tensDone = state.stepIndex > 0 || revealedStep === "tens";
  const downDone = state.stepIndex > 1 || revealedStep === "down" || revealedStep === "ones";
  const onesDone = revealedStep === "ones";

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("elevator-math-svg");
  svg.setAttribute("viewBox", "0 0 920 330");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", getBoardAriaLabel(problem, state, revealedStep));

  const showRemainingEvidence = misconception === "DIV2_OMIT_REMAINING_TEN"
    || misconception === "DIV2_IGNORE_REMAINING_TEN";
  const remainingValue = tensDone || showRemainingEvidence ? String(problem.remainingTens) : "?";
  const downTensValue = downDone ? String(problem.remainingTens) : remainingValue;
  const downOnesValue = downDone ? String(problem.onesDigit) : "?";
  const showCarryRow = tensDone || state.stepIndex > 0 || showRemainingEvidence;
  const remainingOnlyMarkup = showRemainingEvidence && !tensDone && state.stepIndex === 0 ? `
      <g class="remaining-row is-evidence">
        <text x="500" y="248" class="board-small-label">나머지(남은 십)</text>
        <text x="500" y="296" class="board-number board-small-value">${remainingValue}</text>
      </g>
  ` : "";
  const carryRowMarkup = showCarryRow && !remainingOnlyMarkup ? `
      <g class="remaining-row ${state.stepIndex === 1 ? "is-current" : ""}">
        <text x="392" y="248" class="board-small-label">나머지(남은 십)</text>
        <text x="392" y="292" class="board-number board-small-value">${remainingValue}</text>
        <path d="M458 238 C500 238 508 275 548 275" fill="none" stroke="#f3c45f" stroke-width="5" stroke-linecap="round" marker-end="url(#arrowhead)" />
        <text x="592" y="248" class="board-small-label">내린 수</text>
        <text x="574" y="292" class="board-number board-small-value">${downTensValue}</text>
        <text x="620" y="292" class="board-number board-small-value">${downOnesValue}</text>
      </g>
  ` : "";

  svg.innerHTML = `
    <title>${problem.prompt} 계산판</title>
    <g class="math-board-surface">
      <rect x="112" y="18" width="720" height="292" rx="28" fill="#102d35" fill-opacity="0.93" stroke="#f3c45f" stroke-width="4" />
    </g>
    <g class="division-board" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="210" y="174" class="board-number board-divisor">${problem.divisor}</text>
      <path d="M285 112 Q305 112 305 132 L305 250 M305 112 H720" fill="none" stroke="#fff4d6" stroke-width="8" stroke-linecap="round" />

      ${renderSvgCell(392, 42, 142, 72, tensDone ? problem.tensQuotient : "?", state.stepIndex === 0, "십의 자리 몫")}
      ${renderSvgCell(560, 42, 142, 72, onesDone ? problem.onesQuotient : "?", state.stepIndex === 2, "일의 자리 몫")}

      ${renderSvgCell(392, 130, 142, 78, problem.tensDigit, state.stepIndex === 0, "십의 자리 수")}
      ${renderSvgCell(560, 130, 142, 78, problem.onesDigit, false, "일의 자리 수")}

      ${remainingOnlyMarkup || carryRowMarkup}
    </g>
    <defs>
      <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="8" refY="4" orient="auto">
        <path d="M0,0 L8,4 L0,8 Z" fill="#f3c45f" />
      </marker>
    </defs>
  `;

  ui.visualArea.replaceChildren(svg);
}

function renderSvgCell(x, y, width, height, value, active, label) {
  const activeClass = active ? "is-active" : "";
  return `
    <g class="board-cell ${activeClass}" aria-label="${label} ${value}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" fill="${active ? "#ffd46d" : "#27434a"}" stroke="${active ? "#6f4b00" : "#7fa2aa"}" stroke-width="4" />
      <text x="${x + width / 2}" y="${y + height / 2 + 18}" class="board-number" fill="${active ? "#2c210c" : "#fff8e8"}">${value}</text>
    </g>
  `;
}

function getBoardAriaLabel(problem, state, revealedStep) {
  if (revealedStep === "ones") return `${problem.prompt}, 답 ${problem.quotient} 완성`;
  if (state.stepIndex === 0) return `${problem.prompt}, 십의 자리 몫과 나머지인 남은 십을 고르는 중`;
  if (state.stepIndex === 1) return `남은 ${problem.remainingTens}십을 내려 ${problem.onesDigit}와 붙이는 중`;
  return `${problem.downNumber}을 ${problem.divisor}로 나누는 중`;
}
