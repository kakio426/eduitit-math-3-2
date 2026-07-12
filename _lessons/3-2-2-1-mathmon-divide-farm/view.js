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
  setFarmFlowPhase("enter");
  renderFarmBoard(problem, state);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setFarmFlowPhase("active");
      ui.choices.querySelector("button")?.focus({ preventScroll: true });
    });
  });
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
  ui.choices.dataset.interaction = "tap-choice";
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button farm-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", selected.label);
    if (step.id === "combine") {
      button.classList.add("farm-choice--digits");
      for (const digit of String(selected.value).padStart(2, "0")) {
        const piece = document.createElement("span");
        piece.className = "farm-digit-piece";
        piece.textContent = digit;
        button.appendChild(piece);
      }
    } else {
      const value = document.createElement("strong");
      value.textContent = selected.label;
      button.appendChild(value);
    }
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function onStepCorrect() {
  setFarmFlowPhase("confirm");
  return pulseScene("correct");
}

function onStepWrong() {
  setFarmFlowPhase("wrong");
  return pulseScene("wrong").then(() => {
    setFarmFlowPhase("active");
  });
}

function onProblemComplete() {
  setFarmFlowPhase("complete");
  return pulseScene("complete");
}

function onRewardReveal() {
  return pulseScene("reward");
}

function pulseScene(stateName) {
  const scene = document.querySelector(".farm-stage-art");
  if (!scene) return Promise.resolve();
  scene.dataset.sceneState = stateName;
  return new Promise((resolve) => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360));
}

function setFarmFlowPhase(phase) {
  const grid = document.querySelector("#screen-play .problem-grid");
  if (grid) grid.dataset.flowPhase = phase;
}

function renderFarmBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const attemptStep = ui.visualArea.dataset.attemptStep;
  const attemptValue = ui.visualArea.dataset.attemptValue;
  const tensDone = revealedStep === "tens";
  const onesDone = revealedStep === "ones";
  const combineDone = revealedStep === "combine";
  const selectedValue = attemptStep === step.id && attemptValue !== "" ? attemptValue : "?";
  const tensValue = step.id === "tens" && !tensDone ? selectedValue : (tensDone ? problem.tensQuotient : "?");
  const onesValue = step.id === "ones" && !onesDone ? selectedValue : (onesDone ? problem.onesQuotient : "?");
  const totalValue = step.id === "combine" && !combineDone ? selectedValue : (combineDone ? problem.quotient : "?");
  const current = step.id === "tens"
    ? {
        calculation: `${problem.tens}묶음 ÷ ${problem.divisor} = ${tensValue}묶음`,
        question: "한 바구니에는 몇 묶음?",
      }
    : step.id === "ones"
      ? {
          calculation: `${problem.ones}개 ÷ ${problem.divisor} = ${onesValue}개`,
          question: "한 바구니에는 몇 개?",
        }
      : {
          calculation: combineDone
            ? `${problem.dividend} ÷ ${problem.divisor} = ${totalValue}`
            : `${problem.tensQuotient}  ${problem.onesQuotient}`,
          question: combineDone ? "몫을 완성했어요!" : "두 숫자로 만든 몫은?",
        };

  const svg = document.createElementNS(FARM_SVG_NS, "svg");
  svg.classList.add("place-value-farm-svg");
  svg.setAttribute("viewBox", "0 0 700 330");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 자리 나누기</title>
    <rect x="14" y="10" width="672" height="310" rx="34" class="farm-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="350" y="128" class="farm-calc farm-decision-value">${current.calculation}</text>
      <text x="350" y="226" class="farm-answer farm-decision-question">${current.question}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}
