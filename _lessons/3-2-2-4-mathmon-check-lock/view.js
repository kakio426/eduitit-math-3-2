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
  ui.choices.dataset.interaction = step.id === "multiply" || step.id === "add" ? "vault-keypad" : "vault-lever";
  if (step.id === "multiply" || step.id === "add") {
    renderVaultKeypad(step, choose);
    return true;
  }
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button check-lock-choice check-lock-lever";
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

function renderVaultKeypad(step, choose) {
  let input = "";
  const keypad = document.createElement("div");
  keypad.className = "vault-keypad";
  const display = document.createElement("output");
  display.className = "vault-keypad-display";
  display.textContent = "?";
  const keys = document.createElement("div");
  keys.className = "vault-key-grid";
  const render = () => { display.textContent = input || "?"; };
  for (const digit of [1,2,3,4,5,6,7,8,9,0]) {
    const key = document.createElement("button");
    key.type = "button";
    key.className = "vault-key";
    key.textContent = String(digit);
    key.dataset.digit = String(digit);
    key.addEventListener("click", () => { if (input.length < 3) input += digit; render(); });
    keys.appendChild(key);
  }
  const clear = document.createElement("button");
  clear.type = "button";
  clear.className = "vault-key is-clear";
  clear.textContent = "지우기";
  clear.addEventListener("click", () => { input = ""; render(); });
  const enter = document.createElement("button");
  enter.type = "button";
  enter.className = "vault-key is-enter";
  enter.textContent = "넣기";
  enter.addEventListener("click", () => {
    const value = Number(input);
    const selected = step.choices.find((choice) => Number(choice.value) === value) || {
      id: `${step.id}:direct:${input || "empty"}`,
      value,
      label: input || "빈칸",
      misconceptionId: "DIV4_CALCULATION_SLIP",
      feedback: "식을 보고 다시 눌러 봐요.",
    };
    enter.dataset.choice = selected.id;
    enter.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    choose(selected, enter);
  });
  keypad.append(display, keys, clear, enter);
  ui.choices.appendChild(keypad);
}

function onStepCorrect() { return turnVault("correct"); }
function onStepWrong() { return turnVault("wrong"); }
function onProblemComplete() { return turnVault("open"); }
function onRewardReveal() { return turnVault("reward"); }
function turnVault(sceneState) {
  const art = document.querySelector(".check-lock-stage-art");
  if (!art) return Promise.resolve();
  art.dataset.sceneState = sceneState;
  return new Promise((resolve) => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 380));
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
  const showComparison = totalDone || revealedStep === "locate";
  const locateStep = step.id === "locate";
  const comparisonMark = showComparison ? (problem.matchesOriginal ? "=" : "≠") : "?";
  const locateRevealed = revealedStep === "locate";
  const attemptedLocatePart = attemptStep === "locate" ? attemptValue : "";
  const locateClass = (part) => {
    if (locateRevealed && problem.mismatchPart === part) return "is-error-part is-confirmed-part";
    if (attemptedLocatePart === part) return "is-attempt-part";
    return "";
  };

  const svg = document.createElementNS(CHECK_LOCK_SVG_NS, "svg");
  svg.classList.add("check-lock-svg");
  svg.setAttribute("viewBox", "0 0 1000 360");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 검산판</title>
    <rect x="18" y="8" width="964" height="344" rx="30" class="lock-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="500" y="40" class="lock-small-label">나눗셈</text>
      <text x="500" y="84" class="lock-problem-text">${problem.dividend} ÷ ${problem.divisor} = ${problem.shownQuotient} … ${problem.shownRemainder}</text>

      <rect x="54" y="104" width="892" height="108" rx="22" class="lock-calc-panel"/>
      <rect x="104" y="143" width="226" height="55" rx="16" class="lock-term-target ${locateStep ? locateClass("quotient") : ""}"/>
      <text x="217" y="134" class="lock-small-label">나누는 수 × 몫</text>
      <text x="217" y="184" class="lock-value ${step.id === "multiply" ? "is-current" : ""}">${problem.divisor} × ${problem.shownQuotient}</text>
      <text x="382" y="184" class="lock-sign">=</text>
      <text x="492" y="184" class="lock-value ${step.id === "multiply" ? "is-current" : ""}">${productText}</text>
      <text x="608" y="184" class="lock-sign">+</text>
      <rect x="690" y="143" width="128" height="55" rx="16" class="lock-term-target ${locateStep ? locateClass("remainder") : ""}"/>
      <text x="754" y="134" class="lock-small-label">나머지</text>
      <text x="754" y="184" class="lock-value ${step.id === "add" ? "is-current" : ""}">${problem.shownRemainder}</text>

      <rect x="54" y="230" width="892" height="98" rx="22" class="lock-total-panel ${step.id === "add" ? "is-current-panel" : ""}"/>
      <text x="286" y="258" class="lock-small-label">곱하고 더한 값</text>
      <text x="286" y="306" class="lock-total-value">${totalText}</text>
      <text x="500" y="306" class="lock-compare-mark ${showComparison ? "is-revealed" : ""}">${comparisonMark}</text>
      <text x="740" y="258" class="lock-small-label">처음 수</text>
      <text x="740" y="306" class="lock-total-value">${problem.dividend}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}
