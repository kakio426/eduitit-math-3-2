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
  ui.choices.dataset.interaction = step.id === "down" ? "drag-down" : "floor-panel";
  const panel = document.createElement("div");
  panel.className = step.id === "down" ? "elevator-drop-layout" : "elevator-floor-panel";
  let drop = null;
  let tray = panel;
  if (step.id === "down") {
    drop = document.createElement("button");
    drop.type = "button";
    drop.className = "elevator-down-zone";
    drop.setAttribute("aria-label", "남은 수와 일의 자리 수를 합친 수를 아래 칸으로 내리기");
    drop.innerHTML = `<span aria-hidden="true">↓</span><strong>아래 칸</strong>`;
    tray = document.createElement("div");
    tray.className = "elevator-down-tray";
    panel.append(drop, tray);
  }

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

    if (drop) wireDirectChoice(button, drop, choice, choose);
    else button.addEventListener("click", () => choose(choice, button));
    tray.appendChild(button);
  }
  ui.choices.appendChild(panel);
  return true;
}

function onStepCorrect({ step }) { return moveElevator(step.id === "down" ? "down" : "correct"); }
function onStepWrong() { return moveElevator("wrong"); }
function onProblemComplete() { return moveElevator("arrived"); }
function onRewardReveal() { return moveElevator("reward"); }

function moveElevator(sceneState) {
  const art = document.querySelector(".elevator-stage-art");
  if (!art) return Promise.resolve();
  art.dataset.sceneState = sceneState;
  return new Promise((resolve) => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420));
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
  svg.setAttribute("viewBox", "0 0 920 300");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", getBoardAriaLabel(problem, state, revealedStep));

  const showRemainingEvidence = misconception === "DIV2_OMIT_REMAINING_TEN"
    || misconception === "DIV2_IGNORE_REMAINING_TEN";
  const remainingValue = tensDone || showRemainingEvidence ? String(problem.remainingTens) : "?";
  const downOnesValue = downDone ? String(problem.onesDigit) : "?";
  const partialProduct = problem.divisor * problem.tensQuotient;
  const showTensWork = tensDone || showRemainingEvidence;
  const showDownWork = state.stepIndex > 0 || revealedStep === "down" || revealedStep === "ones";
  const downTargetActive = state.stepIndex === 1 && !downDone;
  const workMarkup = showTensWork ? `
      <g class="division-work ${showDownWork ? "is-down-step" : "is-tens-check"}">
        <text x="414" y="208" class="board-work-minus">−</text>
        <text x="463" y="208" class="board-work-product">${partialProduct}</text>
        <path d="M416 219 H510" class="board-work-line" />
        <text x="386" y="270" class="board-work-label" text-anchor="end">남은 십</text>
        <text x="463" y="277" class="board-work-digit">${remainingValue}</text>
        ${showDownWork ? `
          <path d="M631 181 V231" class="board-down-arrow" marker-end="url(#arrowhead)" />
          <rect x="590" y="238" width="82" height="52" rx="14" class="board-down-slot ${downTargetActive ? "is-active" : ""}" />
          <text x="631" y="277" class="board-work-digit board-down-value ${downTargetActive ? "is-active" : ""}">${downOnesValue}</text>
          <text x="704" y="270" class="board-work-label" text-anchor="start">내린 수</text>
        ` : ""}
      </g>
  ` : "";

  svg.innerHTML = `
    <g class="math-board-surface">
      <rect x="112" y="8" width="720" height="284" rx="28" fill="#102d35" fill-opacity="0.93" stroke="#f3c45f" stroke-width="4" />
    </g>
    <g class="division-board" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="210" y="156" class="board-number board-divisor">${problem.divisor}</text>
      <path d="M285 92 Q305 92 305 112 L305 174 M305 92 H720" fill="none" stroke="#fff4d6" stroke-width="8" stroke-linecap="round" />

      ${renderSvgCell(392, 18, 142, 58, tensDone ? problem.tensQuotient : "?", state.stepIndex === 0, "십의 자리 몫")}
      ${renderSvgCell(560, 18, 142, 58, onesDone ? problem.onesQuotient : "?", state.stepIndex === 2, "일의 자리 몫")}

      ${renderSvgCell(392, 108, 142, 64, problem.tensDigit, state.stepIndex === 0, "십의 자리 수")}
      ${renderSvgCell(560, 108, 142, 64, problem.onesDigit, false, "일의 자리 수")}

      ${workMarkup}
    </g>
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
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
  if (state.stepIndex === 0) return `${problem.prompt}, 십의 자리 몫 ${problem.tensQuotient * 10}과 남은 수 ${problem.carriedTens}를 고르는 중`;
  if (state.stepIndex === 1) return `남은 수 ${problem.carriedTens}, 일의 자리 ${problem.onesDigit}, 내린 수 ${problem.downNumber}`;
  return `${problem.downNumber}을 ${problem.divisor}로 나누는 중`;
}
