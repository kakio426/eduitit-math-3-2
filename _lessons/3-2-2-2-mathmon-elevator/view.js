const SVG_NS = "http://www.w3.org/2000/svg";
let elevatorAttempt = null;

function ensureElevatorStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;
  if (!playScreen.querySelector(".elevator-stage-art")) {
    const image = document.createElement("img");
    image.className = "elevator-stage-art";
    image.src = LESSON_CONFIG.imageAssets.problemStage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    playScreen.prepend(image);
  }

  const progressLine = playScreen.querySelector(".progress-line");
  if (progressLine && !progressLine.querySelector(".elevator-route-summary")) {
    const summary = document.createElement("div");
    summary.className = "elevator-route-summary";
    summary.innerHTML = `
      <span class="elevator-route-point is-current"><b>지금</b><span data-route="current">지하</span></span>
      <span class="elevator-route-arrow" aria-hidden="true">→</span>
      <span class="elevator-route-point is-next"><b>다음</b><span data-route="next">1층</span></span>
      <span class="elevator-route-arrow" aria-hidden="true">→</span>
      <span class="elevator-route-point is-final"><b>끝</b><span>꼭대기</span></span>
    `;
    progressLine.appendChild(summary);
  }
}

function syncElevatorRoute(state) {
  const summary = document.querySelector("#screen-play .elevator-route-summary");
  if (!summary) return;
  const current = Lesson2ElevatorModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
  const special = Lesson2ElevatorModel.RESULT_TIERS.find((result) => result.needsSpecial);
  const next = current.needsSpecial ? null : Lesson2ElevatorModel.getNextResult(current);
  const nextName = !next || next.id === current.id ? (special?.name || "꼭대기 전망대") : next.name;
  const nextLabelResult = !next || next.id === current.id ? special : next;
  summary.querySelector('[data-route="current"]').textContent = getElevatorFloorLabel(current);
  summary.querySelector('[data-route="next"]').textContent = current.needsSpecial ? "도착" : getElevatorFloorLabel(nextLabelResult || { name: nextName });
  summary.parentElement?.setAttribute(
    "aria-label",
    `지금 ${current.name}, 다음 ${current.needsSpecial ? "도착" : nextName}, 끝 꼭대기 전망대`
  );
}

function getElevatorFloorLabel(result) {
  const labels = {
    basement: "지하",
    first: "1층",
    middle: "중간층",
    view: "전망층",
    roof: "옥상",
    rainbow: "꼭대기"
  };
  return labels[result?.id] || String(result?.name || "다음 층").replace(" 정비층", "").replace(" 로비", "").replace(" 전망대", "");
}

function renderProblemVisual(problem, state) {
  ensureElevatorStageArt();
  elevatorAttempt = null;
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.misconception = "";
  syncElevatorRoute(state);
  renderElevatorMathBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  elevatorAttempt = null;
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.misconception = "";
  renderElevatorMathBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  elevatorAttempt = null;
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.misconception = "";
  renderElevatorMathBoard(problem, state);
}

function renderAttempt(problem, step, choice, state, result) {
  if (result.correct) return;
  elevatorAttempt = { stepId: step.id, choice };
  ui.visualArea.dataset.misconception = choice.misconceptionId || "";
  renderElevatorMathBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.choices[0]?.kind || "number";
  ui.choices.dataset.interaction = "floor-panel";
  const panel = document.createElement("div");
  panel.className = "elevator-floor-panel";

  for (const choice of step.choices) {
    const button = document.createElement("button");
    button.className = "choice-button elevator-choice";
    button.type = "button";
    button.dataset.choice = choice.id;
    button.dataset.correct = choice.id === step.answerChoiceId ? "true" : "false";
    button.dataset.misconception = choice.misconceptionId || "";
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
    panel.appendChild(button);
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
  const attemptedChoice = elevatorAttempt?.stepId === step.id ? elevatorAttempt.choice : null;
  const wrongTens = step.id === "tens" && attemptedChoice;
  const wrongDown = step.id === "down" && attemptedChoice;
  const wrongOnes = step.id === "ones" && attemptedChoice;
  const tensDone = state.stepIndex > 0 || revealedStep === "tens";
  const downDone = state.stepIndex > 1 || revealedStep === "down" || revealedStep === "ones";
  const onesDone = revealedStep === "ones";

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.classList.add("elevator-math-svg");
  svg.setAttribute("viewBox", "0 0 920 400");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", getBoardAriaLabel(problem, state, revealedStep, attemptedChoice));

  const showRemainingEvidence = misconception === "DIV2_OMIT_REMAINING_TEN"
    || misconception === "DIV2_IGNORE_REMAINING_TEN";
  const displayedTensQuotient = wrongTens ? attemptedChoice.value.quotient : problem.tensQuotient;
  const partialProduct = problem.divisor * displayedTensQuotient;
  const calculatedRemaining = problem.tensDigit - partialProduct;
  const remainingValue = wrongTens
    ? String(calculatedRemaining)
    : tensDone || showRemainingEvidence
      ? String(problem.remainingTens)
      : "?";
  const showTensWork = tensDone || showRemainingEvidence || wrongTens;
  const showDownWork = state.stepIndex > 0 || revealedStep === "down" || revealedStep === "ones";
  const downTargetActive = state.stepIndex === 1 && !downDone;
  const combinedValue = wrongDown
    ? String(attemptedChoice.value)
    : downDone
      ? String(problem.downNumber)
      : "?";
  const attemptNote = step.id === "down" ? "" : renderAttemptNote(problem, step, attemptedChoice);
  const remainderMarkup = showDownWork ? `
        <path d="M631 194 V239" class="board-down-arrow" marker-end="url(#arrowhead)" />
        <g class="board-combined-target ${downTargetActive ? "is-active" : ""} ${wrongDown ? "is-wrong" : ""}">
          <rect x="380" y="276" width="334" height="96" rx="18" class="board-down-slot" />
          <text x="547" y="347" class="board-combined-value">${combinedValue}</text>
        </g>
      ` : `
        <text x="386" y="304" class="board-work-label" text-anchor="end">남은 십</text>
        <text x="463" y="318" class="board-work-digit">${remainingValue}</text>
      `;
  const workMarkup = showTensWork ? `
      <g class="division-work ${showDownWork ? "is-down-step" : "is-tens-check"} ${attemptedChoice ? "is-wrong-attempt" : ""}">
        <text x="414" y="250" class="board-work-minus">−</text>
        <text x="463" y="250" class="board-work-product">${partialProduct}</text>
        <path d="M416 264 H510" class="board-work-line" />
        ${remainderMarkup}
        ${attemptNote}
      </g>
  ` : "";

  svg.innerHTML = `
    <g class="math-board-surface">
      <rect x="72" y="6" width="780" height="382" rx="34" fill="#102d35" fill-opacity="0.93" stroke="#f3c45f" stroke-width="4" />
    </g>
    <g class="division-board" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="210" y="176" class="board-number board-divisor">${problem.divisor}</text>
      <path d="M285 102 Q305 102 305 124 L305 194 M305 102 H760" fill="none" stroke="#fff4d6" stroke-width="8" stroke-linecap="round" />

      ${renderSvgCell(380, 12, 166, 72, tensDone || wrongTens ? displayedTensQuotient : "?", state.stepIndex === 0, "십의 자리 몫", Boolean(wrongTens))}
      ${renderSvgCell(548, 12, 166, 72, onesDone || wrongOnes ? (wrongOnes ? attemptedChoice.value : problem.onesQuotient) : "?", state.stepIndex === 2, "일의 자리 몫", Boolean(wrongOnes))}

      ${renderSvgCell(380, 112, 166, 80, problem.tensDigit, state.stepIndex === 0, "십의 자리 수")}
      ${renderSvgCell(548, 112, 166, 80, problem.onesDigit, false, "일의 자리 수")}

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

function renderSvgCell(x, y, width, height, value, active, label, wrong = false) {
  const activeClass = active ? "is-active" : "";
  const wrongClass = wrong ? "is-wrong" : "";
  const fill = wrong ? "#ffe0e7" : active ? "#ffd46d" : "#27434a";
  const stroke = wrong ? "#b72d4d" : active ? "#6f4b00" : "#7fa2aa";
  const textFill = wrong || active ? "#2c210c" : "#fff8e8";
  return `
    <g class="board-cell ${activeClass} ${wrongClass}" aria-label="${label} ${value}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="4" />
      <text x="${x + width / 2}" y="${y + height / 2 + 21}" class="board-number" fill="${textFill}">${value}</text>
    </g>
  `;
}

function renderAttemptNote(problem, step, choice) {
  if (!choice) return "";
  let label = "고른 수";
  let value = String(choice.value);
  if (step.id === "tens") {
    label = "고른 남은 수";
    value = String(choice.value.remainingTens * 10);
  } else if (step.id === "ones") {
    label = "곱해서 확인";
    value = `${problem.divisor}×${choice.value}=${problem.divisor * choice.value}`;
  }
  return `
    <g class="board-attempt-note" aria-label="${label} ${value}">
      <rect x="96" y="276" width="220" height="96" rx="16" />
      <text x="206" y="310" class="board-attempt-label">${label}</text>
      <text x="206" y="356" class="board-attempt-value">${value}</text>
    </g>
  `;
}

function getBoardAriaLabel(problem, state, revealedStep, attemptedChoice) {
  if (attemptedChoice) return `${problem.prompt}, ${problem.steps[state.stepIndex].label}에서 ${attemptedChoice.label}을 골라 다시 확인하는 중`;
  if (revealedStep === "ones") return `${problem.prompt}, 답 ${problem.quotient} 완성`;
  if (state.stepIndex === 0) return `${problem.prompt}, 십의 자리 몫 ${problem.tensQuotient * 10}과 남은 수 ${problem.carriedTens}를 고르는 중`;
  if (state.stepIndex === 1) return `남은 수 ${problem.carriedTens}, 일의 자리 ${problem.onesDigit}, 내린 수 ${problem.downNumber}`;
  return `${problem.downNumber}을 ${problem.divisor}로 나누는 중`;
}
