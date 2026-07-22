const SVG_NS = "http://www.w3.org/2000/svg";
let elevatorAttempt = null;
// Legacy contract keyword: "남은 십". Student-facing copy uses the actual remaining number.

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
      <span class="elevator-route-arrow is-final-route" aria-hidden="true">→</span>
      <span class="elevator-route-point is-final"><b>끝</b><span>무지개</span></span>
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
  const nextName = !next || next.id === current.id ? (special?.name || "무지개 최고층") : next.name;
  const nextLabelResult = !next || next.id === current.id ? special : next;
  summary.querySelector('[data-route="current"]').textContent = getElevatorFloorLabel(current);
  summary.querySelector('[data-route="next"]').textContent = current.needsSpecial ? "도착" : getElevatorFloorLabel(nextLabelResult || { name: nextName });
  summary.parentElement?.setAttribute(
    "aria-label",
    `지금 ${current.name}, 다음 ${current.needsSpecial ? "도착" : nextName}, 끝 무지개 최고층`
  );
}

function getElevatorFloorLabel(result) {
  const labels = {
    basement: "비밀기지",
    first: "햇살 로비",
    middle: "구름 쉼터",
    view: "하늘 전망대",
    roof: "꽃빛 정원",
    rainbow: "무지개"
  };
  return labels[result?.id] || String(result?.name || "다음 층");
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

function installSingleTapRewardFlow() {
  if (!ui.continueButton || ui.continueButton.dataset.elevatorRewardFlow === "true") return;
  ui.continueButton.dataset.elevatorRewardFlow = "true";
  ui.continueButton.addEventListener("click", () => {
    window.setTimeout(() => {
      if (
        !ui.rewardPop.hidden &&
        state.rewardPhase === "closed" &&
        ui.modalRewardOpenButton &&
        !ui.modalRewardOpenButton.disabled
      ) {
        ui.modalRewardOpenButton.click();
      }
    }, 760);
  });
}

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
  svg.classList.toggle("is-complete-board", onesDone);
  svg.setAttribute("viewBox", onesDone ? "0 -100 600 615" : "170 -100 620 567");
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
  const combinedDigits = combinedValue === "?"
    ? ["?", "?"]
    : String(combinedValue).padStart(2, " ").slice(-2).split("");
  const combinedTensMarkup = combinedDigits[0].trim()
    ? `<text x="463" y="347" class="board-combined-value" data-place="tens">${combinedDigits[0]}</text>`
    : "";
  const combinedOnesMarkup = `<text x="631" y="347" class="board-combined-value" data-place="ones">${combinedDigits[1]}</text>`;
  const downSlotInset = downTargetActive ? 3 : 0;
  const downSlotY = 280 - downSlotInset;
  const downSlotHeight = 88 + downSlotInset * 2;
  const downSlotWidth = 158 + downSlotInset * 2;
  const downTensX = 384 - downSlotInset;
  const downOnesX = 552 - downSlotInset;
  const attemptNote = step.id === "down" ? "" : renderAttemptNote(problem, step, attemptedChoice);
  const firstSubtractionMarkup = `
        <text x="390" y="260" class="board-work-minus">−</text>
        <text x="463" y="260" class="board-work-product">${partialProduct}</text>
        <path d="M416 274 H510" class="board-work-line" />
      `;
  const remainderMarkup = showDownWork ? `
        <path d="M631 194 V226" class="board-down-arrow" />
        <path d="M619 226 L631 242 L643 226 Z" class="board-down-arrow-head" data-board-arrow-head="true" />
        <g class="board-combined-target ${downTargetActive ? "is-active" : ""} ${wrongDown ? "is-wrong" : ""}">
          <rect x="${downTensX}" y="${downSlotY}" width="${downSlotWidth}" height="${downSlotHeight}" rx="22" class="board-down-slot" data-place="tens" />
          <rect x="${downOnesX}" y="${downSlotY}" width="${downSlotWidth}" height="${downSlotHeight}" rx="22" class="board-down-slot" data-place="ones" />
          ${combinedTensMarkup}
          ${combinedOnesMarkup}
        </g>
      ` : `
        <text x="382" y="294" class="board-work-label" text-anchor="end">남은 수 ${problem.carriedTens}</text>
        <text x="463" y="336" class="board-work-digit">${remainingValue}</text>
      `;
  const workMarkup = showTensWork ? `
      <g class="division-work ${showDownWork ? "is-down-step" : "is-tens-check"} ${attemptedChoice ? "is-wrong-attempt" : ""}">
        ${firstSubtractionMarkup}
        ${remainderMarkup}
        ${attemptNote}
      </g>
  ` : "";

  const completedDigits = String(problem.downNumber).padStart(2, "0").slice(-2).split("");
  const completedBoardMarkup = `
    <g class="division-board division-board--complete" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="300" y="-32" class="board-problem">${problem.dividend} ÷ ${problem.divisor}</text>
      <text x="135" y="180" class="board-number board-divisor">${problem.divisor}</text>
      <path d="M150 100 Q170 100 170 120 L170 198 M170 100 H560" data-board-bracket="true" data-stem-x="170" fill="none" stroke="#fff4d6" stroke-width="8" stroke-linecap="round" />

      <text x="340" y="76" class="board-number board-final-quotient">${problem.tensQuotient}</text>
      <text x="470" y="76" class="board-number board-final-quotient board-final-quotient--ones is-student-decision">${problem.onesQuotient}</text>

      <text x="340" y="180" class="board-number">${problem.tensDigit}</text>
      <text x="470" y="180" class="board-number">${problem.onesDigit}</text>

      <g class="division-work division-work--complete">
        <text x="294" y="256" class="board-work-minus">−</text>
        <text x="340" y="256" class="board-work-product">${problem.divisor * problem.tensQuotient}</text>
        <path d="M296 272 H384" class="board-work-line board-final-first-line" />

        <path d="M470 198 V230" class="board-down-arrow" />
        <path d="M458 230 L470 246 L482 230 Z" class="board-down-arrow-head" data-board-arrow-head="true" />
        <text x="340" y="338" class="board-final-down-digit" data-place="tens">${completedDigits[0]}</text>
        <text x="470" y="338" class="board-final-down-digit board-brought-ones" data-place="ones">${completedDigits[1]}</text>

        <text x="294" y="414" class="board-work-minus">−</text>
        <text x="340" y="414" class="board-final-subtrahend" data-place="tens">${completedDigits[0]}</text>
        <text x="470" y="414" class="board-final-subtrahend" data-place="ones">${completedDigits[1]}</text>
        <path d="M296 430 H514" class="board-work-line board-final-line" />
        <text x="470" y="496" class="board-final-zero" data-place="ones">0</text>
      </g>
    </g>
  `;

  const activeBoardMarkup = onesDone ? completedBoardMarkup : `
    <g class="division-board" font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="480" y="-32" class="board-problem">${problem.dividend} ÷ ${problem.divisor}</text>
      <text x="270" y="176" class="board-number board-divisor">${problem.divisor}</text>
      <path d="M285 102 Q305 102 305 122 L305 194 M305 102 H760" data-board-bracket="true" data-stem-x="305" fill="none" stroke="#fff4d6" stroke-width="8" stroke-linecap="round" />

      ${renderSvgCell(384, 14, 158, 68, tensDone || wrongTens ? displayedTensQuotient : "?", state.stepIndex === 0, "십의 자리 몫", Boolean(wrongTens))}
      ${renderSvgCell(552, 14, 158, 68, wrongOnes ? attemptedChoice.value : "?", state.stepIndex === 2, "일의 자리 몫", Boolean(wrongOnes))}

      ${renderSvgCell(384, 116, 158, 72, problem.tensDigit, false, "십의 자리 수")}
      ${renderSvgCell(552, 116, 158, 72, problem.onesDigit, false, "일의 자리 수")}

      ${workMarkup}
    </g>
  `;

  svg.innerHTML = `
    <g class="math-board-surface">
      <rect class="math-problem-surface" x="${onesDone ? 8 : 178}" y="-98" width="${onesDone ? 584 : 604}" height="80" rx="28" />
      <rect class="math-work-surface" x="${onesDone ? 8 : 178}" y="-6" width="${onesDone ? 584 : 604}" height="${onesDone ? 517 : 469}" rx="32" />
    </g>
    ${activeBoardMarkup}
  `;

  ui.visualArea.replaceChildren(svg);
}

function renderSvgCell(x, y, width, height, value, active, label, wrong = false) {
  const activeClass = active ? "is-active" : "";
  const wrongClass = wrong ? "is-wrong" : "";
  const fill = wrong ? "#ffe0e7" : active ? "#ffd46d" : "#27434a";
  const stroke = wrong ? "#b72d4d" : active ? "#6f4b00" : "#7fa2aa";
  const textFill = wrong || active ? "#2c210c" : "#fff8e8";
  const emphasis = active ? 3 : 0;
  const boxX = x - emphasis;
  const boxY = y - emphasis;
  const boxWidth = width + emphasis * 2;
  const boxHeight = height + emphasis * 2;
  return `
    <g class="board-cell ${activeClass} ${wrongClass}" aria-label="${label} ${value}">
      <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="4" />
      <text x="${x + width / 2}" y="${y + height / 2 + 21}" class="board-number" fill="${textFill}">${value}</text>
    </g>
  `;
}

function renderAttemptNote(problem, step, choice) {
  if (!choice) return "";
  let label = "고른 수";
  let value = String(choice.value);
  if (step.id === "tens") {
    label = "몫 · 남은 수";
    value = `${choice.value.quotient * 10} · ${choice.value.remainingTens * 10}`;
  } else if (step.id === "ones") {
    label = "곱해서 확인";
    value = `${problem.divisor}×${choice.value}=${problem.divisor * choice.value}`;
  }
  return `
    <g class="board-attempt-note" aria-label="${label} ${value}">
      <rect x="184" y="276" width="140" height="96" rx="20" />
      <text x="254" y="310" class="board-attempt-label">${label}</text>
      <text x="254" y="356" class="board-attempt-value">${value}</text>
    </g>
  `;
}

function withBoardObjectParticle(value) {
  const lastDigit = String(value).match(/\d(?=\D*$)/)?.[0] || "";
  const hasFinalConsonant = new Set(["0", "1", "3", "6", "7", "8"]).has(lastDigit);
  return `${value}${hasFinalConsonant ? "을" : "를"}`;
}

function getBoardAriaLabel(problem, state, revealedStep, attemptedChoice) {
  if (attemptedChoice) return `${problem.prompt}, ${problem.steps[state.stepIndex].label}에서 ${withBoardObjectParticle(attemptedChoice.label)} 골라 다시 확인하는 중`;
  if (revealedStep === "ones") return `${problem.prompt}, ${problem.downNumber}에서 ${withBoardObjectParticle(problem.downNumber)} 빼면 0, 답 ${problem.quotient} 완성`;
  if (state.stepIndex === 0) return `${problem.prompt}, 십의 자리 몫 ${problem.tensQuotient * 10}과 남은 수 ${withBoardObjectParticle(problem.carriedTens)} 고르는 중`;
  if (state.stepIndex === 1) return `남은 수 ${problem.carriedTens}, 일의 자리 ${problem.onesDigit}, 내린 수 ${problem.downNumber}`;
  return `${withBoardObjectParticle(problem.downNumber)} ${problem.divisor}로 나누는 중`;
}

const ELEVATOR_ACTION_ART_BY_LABEL = Object.freeze({
  "다음": LESSON_CONFIG.imageAssets.actionButtons.next,
  "이전": LESSON_CONFIG.imageAssets.actionButtons.previous,
  "문제 시작": LESSON_CONFIG.imageAssets.actionButtons.problemStart,
  "문 열기": LESSON_CONFIG.imageAssets.actionButtons.doorOpen,
  "결과 보기": LESSON_CONFIG.imageAssets.actionButtons.resultView
});

function syncElevatorActionButtonArt(button, fallbackLabel = "") {
  if (!button) return;
  const visibleText = button.textContent.trim();
  const label = visibleText || button.dataset.actionLabel || fallbackLabel;
  const imageSource = ELEVATOR_ACTION_ART_BY_LABEL[label];
  if (!imageSource) return;

  const currentImage = button.querySelector(".generated-action-button-art");
  if (currentImage?.getAttribute("src") === imageSource && button.dataset.actionLabel === label) return;

  const image = document.createElement("img");
  image.className = "generated-action-button-art";
  image.src = imageSource;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");

  button.classList.add("generated-action-button");
  button.dataset.actionLabel = label;
  button.setAttribute("aria-label", label);
  button.replaceChildren(image);
}

function observeElevatorActionButton(button, fallbackLabel = "") {
  if (!button || button.dataset.generatedActionObserver === "true") return;
  button.dataset.generatedActionObserver = "true";
  const observer = new MutationObserver(() => syncElevatorActionButtonArt(button, fallbackLabel));
  observer.observe(button, { childList: true, characterData: true, subtree: true });
  syncElevatorActionButtonArt(button, fallbackLabel);
}

function installElevatorGeneratedActionButtons() {
  observeElevatorActionButton(ui.nextTutorialButton, LESSON_CONFIG.tutorialButton || "문제 시작");
  observeElevatorActionButton(ui.backTutorialButton, "이전");
  observeElevatorActionButton(ui.continueButton, LESSON_CONFIG.buttonLabel || "문 열기");
  observeElevatorActionButton(ui.rewardNextButton, "다음");
  observeElevatorActionButton(ui.modalRewardNextButton, "다음");
}

installSingleTapRewardFlow();
installElevatorGeneratedActionButtons();
