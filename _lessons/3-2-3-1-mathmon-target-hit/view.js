const CIRCLE_SVG_NS = "http://www.w3.org/2000/svg";
const CIRCLE_RELATION_KINDS = new Set([
  "center",
  "edge-point",
  "inner-point",
  "outer-point",
  "radius",
  "diameter",
  "off-center-chord",
  "inner-segment",
]);
function ensureCircleStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (playScreen && !playScreen.querySelector(".circle-stage-art")) {
    const image = document.createElement("img");
    image.className = "circle-stage-art";
    image.src = LESSON_CONFIG.imageAssets.problemStage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    playScreen.prepend(image);
  }

  ensureCircleWorldPanel();
  ui.choices.classList.add("target-console");
  ensureScoreViewButtonArt();
}

function ensureCircleWorldPanel() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".circle-world-panel")) return;

  const panel = document.createElement("aside");
  panel.className = "circle-world-panel";
  panel.id = "circleWorldPanel";
  panel.setAttribute("aria-live", "polite");
  panel.innerHTML = `
    <img class="circle-world-image" id="circleWorldImage" alt="" aria-hidden="true">
    <span class="circle-world-flare" aria-hidden="true"></span>
    <span class="visually-hidden" id="circleWorldStatus"></span>
  `;
  playScreen.appendChild(panel);
}

function getCircleWorldResult(state) {
  return Lesson3TargetHitModel.getResult(
    state.power,
    state.correctFirstTry,
    state.specialSeen,
  );
}

function syncCircleWorld(state, options = {}) {
  ensureCircleWorldPanel();
  const panel = document.getElementById("circleWorldPanel");
  const image = document.getElementById("circleWorldImage");
  const status = document.getElementById("circleWorldStatus");
  if (!panel || !image || !status) return Promise.resolve();

  const result = getCircleWorldResult(state);
  const nextSrc = result.playImage || LESSON_CONFIG.results[0]?.playImage || "";
  const changed = image.getAttribute("src") !== nextSrc;
  panel.dataset.resultTier = result.id;
  status.textContent = `지금 표적은 ${result.name}이에요.`;
  panel.setAttribute("aria-label", status.textContent);

  if (changed) {
    panel.classList.remove("is-changing", "is-dimming", "is-celebrating");
    void panel.offsetWidth;
    image.src = nextSrc;
    panel.classList.add(options.delta < 0 ? "is-dimming" : "is-changing");
  }
  if (options.celebrate) panel.classList.add("is-celebrating");

  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 720;
  return new Promise((resolve) => {
    setTimeout(() => {
      panel.classList.remove("is-changing", "is-dimming", "is-celebrating");
      resolve();
    }, duration);
  });
}

function ensureScoreViewButtonArt() {
  const button = document.getElementById("rewardButton");
  const source = LESSON_CONFIG.imageAssets?.scoreViewButton;
  if (!button || !source) return;

  button.classList.add("score-view-button");
  button.setAttribute("aria-label", LESSON_CONFIG.buttonLabel || "점수 보기");

  let image = button.querySelector(".score-view-button-art");
  if (!image) {
    image = document.createElement("img");
    image.className = "score-view-button-art";
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    button.replaceChildren(image);
  }
  if (image.getAttribute("src") !== source) image.src = source;
}

function syncCircleTutorialNextArt() {
  const button = ui.nextTutorialButton;
  const tutorialScreen = document.getElementById("screen-tutorial");
  if (!button || !tutorialScreen) return;

  const isFirstPage = tutorialScreen.dataset.page === "0";
  const image = button.querySelector(".generated-action-button-art");
  if (!isFirstPage) {
    const label = button.textContent.trim() || LESSON_CONFIG.tutorialButton || "문제 시작";
    if (image) button.replaceChildren(document.createTextNode(label));
    button.classList.remove("target-tutorial-next-button");
    delete button.dataset.actionLabel;
    button.setAttribute("aria-label", label);
    return;
  }

  const source = LESSON_CONFIG.imageAssets?.tutorialNextButton;
  if (!source) return;
  if (image?.getAttribute("src") === source && button.dataset.actionLabel === "다음") return;

  const nextImage = document.createElement("img");
  nextImage.className = "generated-action-button-art";
  nextImage.src = source;
  nextImage.alt = "";
  nextImage.setAttribute("aria-hidden", "true");
  button.classList.add("target-tutorial-next-button");
  button.dataset.actionLabel = "다음";
  button.setAttribute("aria-label", "다음");
  button.replaceChildren(nextImage);
}

function installCircleTutorialNextArt() {
  const button = ui.nextTutorialButton;
  const tutorialScreen = document.getElementById("screen-tutorial");
  if (!button || !tutorialScreen || button.dataset.targetTutorialObserver === "true") return;

  button.dataset.targetTutorialObserver = "true";
  new MutationObserver(syncCircleTutorialNextArt)
    .observe(button, { childList: true, characterData: true, subtree: true });
  new MutationObserver(syncCircleTutorialNextArt)
    .observe(tutorialScreen, { attributes: true, attributeFilter: ["data-page"] });
  syncCircleTutorialNextArt();
}

function ensureCircleResultNextGoal() {
  const layer = document.querySelector("#screen-result .result-layer");
  if (!layer) return null;

  let goal = layer.querySelector(".result-next-goal-art");
  if (!goal) {
    goal = document.createElement("img");
    goal.className = "result-next-goal-art";
    goal.alt = "";
    goal.setAttribute("aria-hidden", "true");
    layer.appendChild(goal);
  }
  return goal;
}

function onResult({ result }) {
  const regularNext = Lesson3TargetHitModel.getNextResult(result);
  const specialResult = LESSON_CONFIG.results.find((item) => item.needsSpecial);
  const nextResult = !result?.needsSpecial && regularNext?.id === result?.id
    ? specialResult
    : regularNext;
  const isFinal = Boolean(result?.needsSpecial);
  const goal = ensureCircleResultNextGoal();
  if (!goal) return;
  goal.src = isFinal
    ? LESSON_CONFIG.imageAssets.resultNextGoalTitles.final
    : LESSON_CONFIG.imageAssets.resultNextGoalTitles[nextResult?.id || "legend"];

  const nextText = isFinal
    ? "최고 단계예요!"
    : `다음엔 ${nextResult?.name || "전설 명중"}`;
  if (ui.resultNextSvg) {
    ui.resultNextSvg.textContent = nextText;
    ui.resultNextSvg.setAttribute("x", "830");
    ui.resultNextSvg.setAttribute("y", "340");
    ui.resultNextSvg.hidden = false;
  }
  if (ui.resultMeasureSvg) ui.resultMeasureSvg.textContent = "";
  if (ui.resultNext) ui.resultNext.textContent = nextText;
}

function renderProblemVisual(problem, state) {
  ensureCircleStageArt();
  syncCircleWorld(state);
  ui.problemText.textContent = problem.term;
  ui.visualArea.dataset.relation = "neutral";
  ui.visualArea.dataset.relationState = "idle";
  ui.choices.dataset.boardState = "idle";
  renderCircleWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.problemText.textContent = problem.term;
  ui.visualArea.dataset.relation = "neutral";
  ui.visualArea.dataset.relationState = "idle";
  ui.choices.dataset.boardState = "idle";
  renderCircleWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.relation = problem.answerKind;
  ui.visualArea.dataset.relationState = "correct";

  const answer = [...ui.choices.querySelectorAll(".circle-choice")]
    .find((button) => button.dataset.choice === step.answerChoiceId);
  if (answer) {
    answer.dataset.state = "correct";
    answer.dataset.activeTarget = "true";
    answer.setAttribute("aria-describedby", "feedbackLine");
    renderChoiceRelation(answer, answer.dataset.visualKind);
  }

  ui.choices.dataset.boardState = "correct";
  ui.choices.querySelectorAll(".circle-choice").forEach((button) => {
    if (button !== answer) {
      delete button.dataset.state;
      delete button.dataset.activeTarget;
      delete button.dataset.diagnostic;
      button.removeAttribute("aria-describedby");
      renderChoiceRelation(button, button.dataset.visualKind);
    }
    button.dataset.dimmed = button === answer ? "false" : "true";
  });
  renderCircleWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;

  const activeButton = result.button
    || ui.choices.querySelector(`[data-choice="${cssEscapeValue(selected.id)}"]`);
  ui.visualArea.dataset.relation = selected.visualKind;
  ui.visualArea.dataset.relationState = "wrong";
  ui.choices.dataset.boardState = "wrong";

  ui.choices.querySelectorAll(".circle-choice").forEach((button) => {
    if (button !== activeButton && button.dataset.state === "wrong") {
      delete button.dataset.state;
      delete button.dataset.activeTarget;
      delete button.dataset.diagnostic;
      button.removeAttribute("aria-describedby");
      renderChoiceRelation(button, button.dataset.visualKind);
    }
    button.dataset.dimmed = "false";
  });

  if (activeButton) {
    activeButton.dataset.activeTarget = "true";
    activeButton.dataset.diagnostic = selected.misconceptionId || "";
    activeButton.setAttribute("aria-describedby", "feedbackLine");
    renderChoiceRelation(activeButton, selected.visualKind, selected.misconceptionId);
  }
  renderCircleWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ensureCircleStageArt();
  ui.choices.innerHTML = "";
  ui.choices.classList.add("target-console");
  ui.choices.dataset.choiceKind = "circle-diagram";
  ui.choices.dataset.boardState = "idle";

  step.choices.forEach((selected, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button circle-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.dataset.visualKind = selected.visualKind;
    button.dataset.slot = String(index + 1);
    button.dataset.dimmed = "false";
    if (selected.misconceptionId) button.dataset.misconception = selected.misconceptionId;
    button.setAttribute("aria-label", selected.label);

    const svg = document.createElementNS(CIRCLE_SVG_NS, "svg");
    svg.classList.add("circle-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 180");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.innerHTML = circleRelationMarkup(selected.visualKind, false);
    button.appendChild(svg);

    const slotLight = document.createElement("span");
    slotLight.className = "target-slot-light";
    slotLight.setAttribute("aria-hidden", "true");
    button.appendChild(slotLight);

    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderChoiceRelation(button, kind, diagnosticId = "") {
  if (!button || !CIRCLE_RELATION_KINDS.has(kind)) return;
  const svg = button.querySelector(".circle-choice-svg");
  if (!svg) return;
  svg.innerHTML = circleRelationMarkup(kind, false, diagnosticId);
}

function renderCircleWorkbench(problem) {
  const relationState = ui.visualArea.dataset.relationState || "idle";
  const svg = document.createElementNS(CIRCLE_SVG_NS, "svg");
  svg.classList.add("circle-confirm-svg");
  svg.dataset.state = relationState;
  svg.setAttribute("viewBox", "0 0 80 80");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.innerHTML = `
    <circle class="console-signal-ring" cx="40" cy="40" r="27"/>
    <circle class="console-signal-core" cx="40" cy="40" r="7"/>
    <path class="console-signal-tick" d="M40 7v10M40 63v10M7 40h10M63 40h10"/>
  `;
  ui.visualArea.replaceChildren(svg);
}

function circleRelationMarkup(kind, large, diagnosticId = "") {
  const circle = `<circle class="relation-circle" cx="120" cy="90" r="58"/>`;
  const centerReference = `<circle class="relation-center-reference" cx="120" cy="90" r="5"/>`;
  const endpoint = (x, y) => `<circle class="relation-endpoint" cx="${x}" cy="${y}" r="5"/>`;
  const line = (x1, y1, x2, y2) => (
    `<line class="relation-candidate" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`
  );
  let relation = "";
  if (kind === "center") {
    relation = `${circle}<circle class="relation-point-candidate" cx="120" cy="90" r="10"/>`;
  } else if (kind === "edge-point") {
    relation = `${circle}<circle class="relation-point-candidate" cx="178" cy="90" r="10"/>`;
  } else if (kind === "inner-point") {
    relation = `${circle}<circle class="relation-point-candidate" cx="150" cy="66" r="10"/>`;
  } else if (kind === "outer-point") {
    relation = `${circle}<circle class="relation-point-candidate" cx="194" cy="48" r="10"/>`;
  } else if (kind === "radius") {
    relation = `${circle}${centerReference}${line(120, 90, 178, 90)}${endpoint(178, 90)}`;
  } else if (kind === "diameter") {
    relation = `${circle}${centerReference}${line(62, 90, 178, 90)}${endpoint(62, 90)}${endpoint(178, 90)}`;
  } else if (kind === "off-center-chord") {
    relation = `${circle}${centerReference}${line(74, 55, 166, 55)}${endpoint(74, 55)}${endpoint(166, 55)}`;
  } else if (kind === "inner-segment") {
    relation = `${circle}${centerReference}${line(120, 90, 158, 65)}${endpoint(158, 65)}`;
  } else {
    relation = circle;
  }

  return `
    <g class="relation-geometry">${relation}</g>
    ${circleDiagnosticMarkup(diagnosticId)}
  `;
}

function circleDiagnosticMarkup(misconceptionId) {
  const centerClue = `
    <circle class="diagnostic-needed-ring" cx="120" cy="90" r="15"/>
    <path class="diagnostic-needed-cross" d="M120 68v11M120 101v11M98 90h11M131 90h11"/>
  `;

  const diagnostics = {
    CIRCLE_CENTER_ON_EDGE: `
      <path class="diagnostic-guide" d="M166 90H137"/>
      ${centerClue}
    `,
    CIRCLE_CENTER_OFF_MIDDLE: `
      <path class="diagnostic-guide" d="M142 72l-11 9"/>
      ${centerClue}
    `,
    CIRCLE_CENTER_OUTSIDE: `
      <path class="diagnostic-guide" d="M181 57l-45 25"/>
      ${centerClue}
    `,
    CIRCLE_RADIUS_AS_DIAMETER: `
      <line class="diagnostic-extra" x1="62" y1="90" x2="120" y2="90"/>
      ${centerClue}
    `,
    CIRCLE_RADIUS_MISSES_CENTER: `
      <path class="diagnostic-guide" d="M120 75V58"/>
      ${centerClue}
    `,
    CIRCLE_RADIUS_NOT_TO_EDGE: `
      <line class="diagnostic-missing" x1="158" y1="65" x2="169" y2="58"/>
      <circle class="diagnostic-needed-ring" cx="169" cy="58" r="9"/>
    `,
    CIRCLE_DIAMETER_AS_RADIUS: `
      <line class="diagnostic-missing" x1="120" y1="90" x2="62" y2="90"/>
      <circle class="diagnostic-needed-ring" cx="62" cy="90" r="9"/>
    `,
    CIRCLE_DIAMETER_MISSES_CENTER: `
      <path class="diagnostic-guide" d="M120 75V58"/>
      ${centerClue}
    `,
    CIRCLE_DIAMETER_NOT_EDGE_TO_EDGE: `
      <line class="diagnostic-missing" x1="120" y1="90" x2="71" y2="122"/>
      <line class="diagnostic-missing" x1="158" y1="65" x2="169" y2="58"/>
      <circle class="diagnostic-needed-ring" cx="71" cy="122" r="9"/>
      <circle class="diagnostic-needed-ring" cx="169" cy="58" r="9"/>
    `,
  };

  const markup = diagnostics[misconceptionId];
  return markup ? `<g class="relation-diagnostic">${markup}</g>` : "";
}

function cssEscapeValue(value) {
  const string = String(value ?? "");
  if (globalThis.CSS?.escape) return CSS.escape(string);
  return string.replace(/["\\]/g, "\\$&");
}

function onProblemComplete() {
  ui.choices.dataset.boardState = "complete";
  ensureScoreViewButtonArt();
}

function onRewardReveal({ beforePower, afterPower, state }) {
  const delta = afterPower - beforePower;
  return syncCircleWorld(state, { celebrate: delta > 0, delta });
}

ensureScoreViewButtonArt();
installCircleTutorialNextArt();
ensureCircleResultNextGoal();

window.__targetHitQa = {
  forcePlayTier(resultId) {
    const result = LESSON_CONFIG.results.find((item) => item.id === resultId);
    if (!result) throw new Error(`Unknown result tier: ${resultId}`);
    state.power = result.minPower;
    state.correctFirstTry = result.minCorrect;
    state.specialSeen = Boolean(result.needsSpecial);
    state.currentResult = null;
    syncCircleWorld(state, { celebrate: true });
    return result;
  },
  forceResult(resultId) {
    const result = LESSON_CONFIG.results.find((item) => item.id === resultId);
    if (!result) throw new Error(`Unknown result tier: ${resultId}`);
    state.power = result.minPower;
    state.correctFirstTry = result.minCorrect;
    state.specialSeen = Boolean(result.needsSpecial);
    state.currentResult = null;
    showResult();
    return result;
  },
  getSnapshot() {
    return {
      result: getCircleWorldResult(state),
      worldImage: document.getElementById("circleWorldImage")?.getAttribute("src") || "",
    };
  },
};
