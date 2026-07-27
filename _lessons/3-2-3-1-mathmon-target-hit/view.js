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
let targetRewardStage = null;
let targetRewardArtPrimed = false;
const targetRewardPreloads = [];

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

  ui.choices.classList.add("target-console");
  ensureScoreViewButtonArt();
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

function alignCircleResultNextGoal() {
  const nextGoal = document.getElementById("resultNextSvg");
  if (!nextGoal) return;
  nextGoal.setAttribute("x", "730");
  nextGoal.setAttribute("y", "610");
}

function renderProblemVisual(problem, state) {
  ensureCircleStageArt();
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
  const targetMarks = `
    <path class="relation-target-mark" d="M120 21v9M120 150v9M51 90h9M180 90h9"/>
    <path class="relation-corner-mark" d="M31 49v-13h13M196 36h13v13M31 131v13h13M196 144h13v-13"/>
  `;

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
    <g class="relation-target-frame">${targetMarks}</g>
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

function getTargetRewardImage(event) {
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  return event?.image
    || artMap[event?.id]
    || artMap[event?.family]
    || LESSON_CONFIG.imageAssets.rewardClosed;
}

function primeTargetRewardArt() {
  if (targetRewardArtPrimed || typeof Image === "undefined") return;
  targetRewardArtPrimed = true;
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  const sources = new Set([
    LESSON_CONFIG.imageAssets.rewardClosed,
    ...Object.values(artMap),
  ].filter(Boolean));
  sources.forEach((src) => {
    const image = new Image();
    image.src = src;
    targetRewardPreloads.push(image);
  });
}

function setTargetRewardArt(image, src) {
  if (!(image instanceof HTMLImageElement)) return;
  const fallback = LESSON_CONFIG.imageAssets.rewardClosed;
  image.onerror = () => {
    image.onerror = null;
    if (image.getAttribute("src") !== fallback) image.src = fallback;
  };
  image.src = src || fallback;
}

function ensureTargetRewardStage() {
  primeTargetRewardArt();
  if (targetRewardStage?.root?.isConnected) return targetRewardStage;
  const panel = document.querySelector("#screen-reward .reward-panel");
  const title = document.getElementById("rewardTitle");
  const engineLabel = document.getElementById("rewardChange");
  const button = document.getElementById("rewardNextButton");
  if (!panel || !title || !engineLabel || !button) return null;

  title.classList.add("visually-hidden");
  engineLabel.className = "visually-hidden";
  engineLabel.setAttribute("aria-hidden", "true");

  const story = document.createElement("div");
  story.className = "target-reward-story";
  story.dataset.rewardStageStory = "true";
  story.dataset.phase = "closed";

  const visual = document.createElement("div");
  visual.className = "target-reward-visual";
  const art = document.createElement("img");
  art.className = "target-reward-art";
  art.alt = "";
  art.setAttribute("aria-hidden", "true");
  visual.appendChild(art);

  const copy = document.createElement("div");
  copy.className = "target-reward-copy";
  const score = document.createElement("div");
  score.className = "target-reward-score";
  const scoreLabel = document.createElement("span");
  scoreLabel.className = "target-reward-score-label";
  scoreLabel.textContent = "이번 점수";
  const value = document.createElement("strong");
  value.className = "target-reward-value";
  value.setAttribute("aria-live", "polite");
  score.append(scoreLabel, value);
  const meter = document.createElement("div");
  meter.className = "target-reward-meter";
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = document.createElement("span");
  meterFill.className = "target-reward-meter-fill";
  meter.appendChild(meterFill);
  const context = document.createElement("p");
  context.className = "target-reward-context";
  copy.append(score, meter, context, button);
  story.append(visual, copy);
  panel.replaceChildren(title, story, engineLabel);

  targetRewardStage = { root: story, art, scoreLabel, value, meter, meterFill, context, button };
  return targetRewardStage;
}

function onRewardPrepare({ beforePower, beforeResult }) {
  const stage = ensureTargetRewardStage();
  if (!stage) return;
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  setTargetRewardArt(stage.art, LESSON_CONFIG.imageAssets.rewardClosed);
  stage.scoreLabel.textContent = "이번 점수";
  stage.value.textContent = "?";
  stage.context.textContent = targetRewardProgressText(beforePower, beforeResult);
  stage.meter.setAttribute("aria-valuenow", String(beforePower));
  stage.meter.setAttribute("aria-valuetext", `${beforePower}점, ${beforeResult.name}`);
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, beforePower / maxPower * 100))}%`;
  stage.root.dataset.phase = "closed";
  stage.root.dataset.reward = "closed";
  stage.root.dataset.currentTier = beforeResult.id;
  stage.root.setAttribute("aria-label", `현재 ${beforeResult.name}. 가림막이 닫혀 있어요.`);
  setTargetRewardArt(ui.rewardScene, LESSON_CONFIG.imageAssets.rewardClosed);
}

function onRewardReveal({ event, beforePower, afterPower, beforeResult, afterResult }) {
  const stage = ensureTargetRewardStage();
  if (!stage) return Promise.resolve();
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  const eventImage = getTargetRewardImage(event);
  setTargetRewardArt(stage.art, eventImage);
  const change = afterPower - beforePower;
  stage.scoreLabel.textContent = "이번 점수";
  stage.value.textContent = change > 0 ? `+${change}` : change < 0 ? `−${Math.abs(change)}` : "0";
  stage.context.textContent = targetRewardProgressText(afterPower, afterResult);
  stage.meter.setAttribute("aria-valuenow", String(afterPower));
  stage.meter.setAttribute("aria-valuetext", `${afterPower}점, ${afterResult.name}`);
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, afterPower / maxPower * 100))}%`;
  stage.root.dataset.phase = "revealed";
  stage.root.dataset.reward = event.family || event.id || "normal";
  stage.root.dataset.currentTier = afterResult.id;
  stage.root.setAttribute(
    "aria-label",
    `${targetRewardAccessibleSummary(event, beforePower, afterPower, beforeResult, afterResult)} 지금 ${afterResult.name}.`,
  );
  setTargetRewardArt(ui.rewardScene, eventImage);
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return reducedMotion ? Promise.resolve() : waitForTargetReward(480);
}

function targetRewardProgressText(power, result) {
  const nextResult = typeof Lesson3TargetHitModel.getNextResult === "function"
    ? Lesson3TargetHitModel.getNextResult(result)
    : result;
  if (!nextResult || nextResult.id === result.id) return `${result.name} · 최고예요!`;
  const missingCorrect = Math.max(0, Number(nextResult.minCorrect || 0) - state.correctFirstTry);
  if (power >= Number(nextResult.minPower || 0) && missingCorrect > 0) {
    return `${result.name} · ${missingCorrect}문제 남음`;
  }
  const remaining = Math.max(0, Number(nextResult.minPower || 0) - power);
  return `${result.name} · 다음까지 ${remaining}점`;
}

function targetRewardAccessibleSummary(event, beforePower, afterPower, beforeResult, afterResult) {
  if (event.special || afterResult.needsSpecial) return "전설 명중을 찾았어요!";
  const change = afterPower - beforePower;
  const changeText = change > 0 ? `점수 +${change}` : change < 0 ? `점수 ${change}` : "점수 그대로";
  if (beforeResult.id !== afterResult.id) return `${changeText} · ${afterResult.name}에 닿았어요!`;
  const nextResult = typeof Lesson3TargetHitModel.getNextResult === "function"
    ? Lesson3TargetHitModel.getNextResult(afterResult)
    : afterResult;
  if (!nextResult || nextResult.id === afterResult.id) return `${changeText} · 가장 높은 표적이에요!`;
  const missingCorrect = Math.max(0, Number(nextResult.minCorrect || 0) - state.correctFirstTry);
  if (afterPower >= Number(nextResult.minPower || 0) && missingCorrect > 0) {
    return `${changeText} · 문제 ${missingCorrect}개 더`;
  }
  const remaining = Math.max(0, Number(nextResult.minPower || 0) - afterPower);
  return `${changeText} · ${nextResult.name}까지 ${remaining} 더`;
}

function waitForTargetReward(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

ensureScoreViewButtonArt();
installCircleTutorialNextArt();
alignCircleResultNextGoal();
primeTargetRewardArt();
