const LessonModel = {{MODEL_NAME}};
const TOTAL_QUESTIONS = Array.isArray(LESSON_CONFIG.typesPerRun) ? LESSON_CONFIG.typesPerRun.length : 10;

const screens = {
  cover: document.getElementById("screen-cover"),
  tutorial: document.getElementById("screen-tutorial"),
  play: document.getElementById("screen-play"),
  reward: document.getElementById("screen-reward"),
  result: document.getElementById("screen-result"),
  scoreboard: document.getElementById("screen-scoreboard"),
};

const ui = {
  main: document.querySelector(".game"),
  stageShell: document.querySelector(".stage-shell"),
  settingsToggle: document.getElementById("settingsButton"),
  settingsBackdrop: document.getElementById("settingsBackdrop"),
  settingsModal: document.getElementById("settingsModal"),
  settingsMenu: document.getElementById("settingsMenu"),
  settingsRestartConfirm: document.getElementById("settingsRestartConfirm"),
  settingsRestartConfirmButton: document.getElementById("settingsRestartConfirmButton"),
  settingsRestartCancelButton: document.getElementById("settingsRestartCancelButton"),
  closeSettings: document.getElementById("settingsCloseButton"),
  bgmToggle: document.getElementById("settingsBgmToggle"),
  sfxToggle: document.getElementById("settingsSfxToggle"),
  reviewTutorialButton: document.getElementById("settingsMethodButton"),
  restartButton: document.getElementById("settingsRestartButton"),
  startButton: document.getElementById("startButton"),
  nextTutorialButton: document.getElementById("tutorialStartButton"),
  backTutorialButton: document.getElementById("tutorialBackButton"),
  tutorialTitle: document.getElementById("tutorialTitle"),
  tutorialText: document.getElementById("tutorialText"),
  tutorialVisual: document.getElementById("tutorialVisual"),
  tutorialProgress: document.getElementById("tutorialProgress"),
  progressLabel: document.getElementById("progressLabel"),
  progressFill: document.getElementById("runProgress"),
  progressValue: document.getElementById("runProgressText"),
  questionCount: document.getElementById("problemCounter"),
  problemText: document.getElementById("problemTitle"),
  instructionText: document.getElementById("stepInstruction"),
  visualArea: document.getElementById("visualArea"),
  playMathmonReaction: document.getElementById("playMathmonReaction"),
  choices: document.getElementById("choicesPanel"),
  feedback: document.getElementById("feedbackLine"),
  answerSlot: document.getElementById("answerSlot"),
  stepChips: document.getElementById("stepChips"),
  completePanel: document.getElementById("completePanel"),
  completeText: document.getElementById("completeExpression"),
  continueButton: document.getElementById("rewardButton"),
  rewardObject: document.querySelector("#screen-reward .reward-object"),
  rewardLiquid: document.getElementById("rewardLiquid"),
  rewardScreenTitle: document.getElementById("rewardTitle"),
  rewardScene: document.querySelector("#screen-reward .raster-bg"),
  rewardLabel: document.getElementById("rewardChange"),
  rewardNextButton: document.getElementById("rewardNextButton"),
  rewardPop: document.getElementById("rewardPop"),
  rewardVisual: document.getElementById("rewardVisual"),
  modalRewardLabel: document.getElementById("modalRewardLabel"),
  modalRewardOpenButton: document.getElementById("modalRewardOpenButton"),
  modalRewardNextButton: document.getElementById("modalRewardNextButton"),
  resultBg: document.getElementById("resultBg"),
  resultTitleArt: document.getElementById("resultTitleArt"),
  resultCorrectArt: document.getElementById("resultCorrectArt"),
  resultHeading: document.getElementById("resultTitle"),
  resultSummary: document.getElementById("resultSummary"),
  resultNext: document.getElementById("resultNext"),
  resultDestinationSvg: document.getElementById("resultDestinationSvg"),
  resultMeasureSvg: document.getElementById("resultMeasureSvg"),
  resultMeasureFillSvg: document.getElementById("resultMeasureFillSvg"),
  resultNextSvg: document.getElementById("resultNextSvg"),
  leaderboardButtonArt: document.getElementById("leaderboardButtonArt"),
  leaderboardButton: document.getElementById("leaderboardButton"),
  retryButton: document.getElementById("retryButton") || document.getElementById("restartButton"),
  scoreboardScreen: document.getElementById("screen-scoreboard"),
};

const STORAGE_KEYS = {
  bgm: "mathmon-audio-bgm-enabled",
  sfx: "mathmon-audio-sfx-enabled",
};

let audio = {
  bgm: readAudioFlag(STORAGE_KEYS.bgm, true),
  sfx: readAudioFlag(STORAGE_KEYS.sfx, true),
  ctx: null,
};

let state = createInitialState();

function createInitialState() {
  return {
    screen: "cover",
    tutorialIndex: 0,
    reviewReturnScreen: "play",
    problems: [],
    problemIndex: 0,
    stepIndex: 0,
    power: 0,
    correctFirstTry: 0,
    mistakeTouched: false,
    specialSeen: false,
    pendingAdvance: false,
    completed: false,
    lastRewardEvent: null,
    currentResult: null,
    currentScoreboardAnswer: null,
    scoreboardAnswers: [],
    scoreboardQuestionStartedAt: 0,
    scoreboardStepStartedAt: 0,
    stepAttempts: [],
    inputLocked: false,
    pendingRewardEvent: null,
    rewardPhase: "idle",
  };
}

async function runViewHook(name, payload) {
  const hook = globalThis[name];
  if (typeof hook !== "function") return;
  try {
    await hook(payload);
  } catch (error) {
    console.warn(`${name} failed`, error);
  }
}

function showMathmonReaction(kind) {
  const assets = LESSON_CONFIG.imageAssets?.mathmonReactions;
  const source = assets?.[kind];
  if (!ui.playMathmonReaction || !source) return Promise.resolve();
  ui.playMathmonReaction.src = source;
  ui.playMathmonReaction.hidden = false;
  ui.playMathmonReaction.dataset.reaction = kind;
  const wait = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;
  return new Promise((resolve) => setTimeout(resolve, wait));
}

function setProblemSceneState(kind) {
  const source = LESSON_CONFIG.imageAssets?.problemStates?.[kind];
  const scene = document.querySelector("#screen-play > img:not(.play-mathmon-reaction)");
  if (!scene || !source) return Promise.resolve();
  scene.dataset.problemSceneState = kind;
  if (scene.getAttribute("src") === source && scene.complete) return Promise.resolve();
  scene.src = source;
  if (scene.complete) return Promise.resolve();
  return new Promise((resolve) => {
    scene.addEventListener("load", resolve, { once: true });
    scene.addEventListener("error", resolve, { once: true });
  });
}

function readAudioFlag(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved == null ? fallback : saved === "true";
  } catch (error) {
    return fallback;
  }
}

function saveAudioFlag(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch (error) {
    console.warn("Audio setting could not be saved.", error);
  }
}

function showScreen(name) {
  if (!screens[name]) return;
  Object.entries(screens).forEach(([screenName, node]) => {
    if (!node) return;
    node.classList.toggle("is-active", screenName === name);
    node.setAttribute("aria-hidden", screenName === name ? "false" : "true");
  });
  state.screen = name;
  ui.stageShell.dataset.activeScreen = name;
}

function syncAudioControls() {
  ui.bgmToggle.setAttribute("aria-checked", String(audio.bgm));
  ui.sfxToggle.setAttribute("aria-checked", String(audio.sfx));
}

function syncProgress() {
  const maxPower = LESSON_CONFIG.reward?.maxPower ?? 100;
  const width = LessonModel.clamp((state.power / maxPower) * 100, 0, 100);
  ui.progressFill.style.width = `${width}%`;
  ui.progressValue.textContent = `${LESSON_CONFIG.progressLabel || "힘"} ${state.power}`;
  ui.questionCount.textContent = `${Math.min(state.problemIndex + 1, TOTAL_QUESTIONS)}/${TOTAL_QUESTIONS}`;
}

function playSample(kind) {
  if (!audio.sfx) return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!audio.ctx) audio.ctx = new AudioContext();
  const ctx = audio.ctx;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const now = ctx.currentTime;
  const frequencies = {
    "step-correct": 720,
    "step-wrong": 260,
    "problem-complete": 840,
    "reward-open": 520,
    "reward-rare": 660,
    "reward-legend": 920,
    result: 600,
    scoreboard: 440,
  };
  const frequency = frequencies[kind] || 420;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.type = kind === "step-wrong" ? "sawtooth" : "sine";
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(0.05, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.2);
}

function renderTutorial() {
  const cards = LESSON_CONFIG.tutorialCards || [];
  const card = normalizeTutorialCard(cards[state.tutorialIndex] || cards[0] || {});
  const cardNodes = [...document.querySelectorAll("#screen-tutorial .tutorial-card")];
  cardNodes.forEach((node, index) => {
    node.hidden = getTutorialMode() === "poster-two-step" && index !== state.tutorialIndex;
  });
  screens.tutorial.dataset.page = String(state.tutorialIndex);
  if (ui.backTutorialButton) ui.backTutorialButton.hidden = state.tutorialIndex === 0;
  ui.tutorialTitle.textContent = getTutorialMode() === "card-grid"
    ? (LESSON_CONFIG.tutorialTitle || LESSON_CONFIG.title)
    : (card.title || LESSON_CONFIG.title);
  if (ui.tutorialText) ui.tutorialText.textContent = card.body || "";
  if (ui.tutorialVisual) ui.tutorialVisual.textContent = card.visual || "";
  if (ui.tutorialProgress) ui.tutorialProgress.textContent = `${state.tutorialIndex + 1}/${Math.max(cards.length, 1)}`;
  if (getTutorialMode() === "card-grid") {
    ui.nextTutorialButton.textContent = LESSON_CONFIG.tutorialButton || "시작";
  } else {
    ui.nextTutorialButton.textContent = state.tutorialIndex >= cards.length - 1
      ? (LESSON_CONFIG.tutorialButton || "시작")
      : "다음";
  }
}

function normalizeTutorialCard(card) {
  if (Array.isArray(card)) {
    return { visual: card[0] || "", title: card[1] || "", body: card[2] || "" };
  }
  return card;
}

function beginTutorial(returnScreen = "play") {
  state.tutorialIndex = 0;
  state.reviewReturnScreen = returnScreen;
  renderTutorial();
  showScreen("tutorial");
}

function continueTutorial() {
  if (getTutorialMode() === "card-grid") {
    if (state.reviewReturnScreen === "cover") startGame();
    else showScreen(state.reviewReturnScreen);
    return;
  }
  const cards = LESSON_CONFIG.tutorialCards || [];
  if (state.tutorialIndex < cards.length - 1) {
    state.tutorialIndex += 1;
    renderTutorial();
    return;
  }
  if (state.reviewReturnScreen === "cover") {
    startGame();
    return;
  }
  showScreen(state.reviewReturnScreen);
}

function previousTutorial() {
  if (state.tutorialIndex <= 0) return;
  state.tutorialIndex -= 1;
  renderTutorial();
}

function getTutorialMode() {
  return LESSON_CONFIG.tutorial?.mode || "card-grid";
}

function renderProblem() {
  const problem = state.problems[state.problemIndex];
  if (!problem) {
    showResult();
    return;
  }
  state.stepIndex = 0;
  state.mistakeTouched = false;
  state.pendingAdvance = false;
  state.stepAttempts = [];
  beginScoreboardQuestion(problem);
  ui.problemText.textContent = problem.prompt;
  ui.completePanel.classList.remove("is-visible");
  ui.completePanel.closest(".problem-grid")?.classList.remove("is-complete");
  ui.completeText.textContent = "";
  if (typeof renderProblemVisual === "function") renderProblemVisual(problem, state);
  setProblemSceneState("waiting");
  renderStep();
  syncProgress();
  showScreen("play");
}

function renderStep() {
  const problem = state.problems[state.problemIndex];
  const step = problem.steps[state.stepIndex];
  beginScoreboardStep(step);
  ui.instructionText.textContent = step.instruction;
  ui.instructionText.hidden = false;
  ui.feedback.textContent = "";
  ui.feedback.dataset.state = "idle";
  ui.continueButton.hidden = true;
  ui.completePanel.classList.remove("is-visible");
  ui.completePanel.classList.toggle("is-action-only", LESSON_CONFIG.completion?.showExpression === false);
  ui.completeText.hidden = LESSON_CONFIG.completion?.showExpression === false;
  ui.completePanel.closest(".problem-grid")?.classList.remove("is-complete");
  ui.answerSlot.classList.remove("is-filled");
  ui.answerSlot.textContent = step.preview || "?";
  renderStepChips(problem);
  ui.choices.innerHTML = "";

  if (typeof renderChoicesForStep === "function") {
    const handled = renderChoicesForStep(problem, step, state, handleChoice);
    if (handled === true) {
      if (typeof updateProblemVisualForStep === "function") updateProblemVisualForStep(problem, step, state);
      return;
    }
  }

  step.choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.textContent = getChoiceLabel(choice);
    button.dataset.choice = getChoiceId(choice);
    button.dataset.correct = String(LessonModel.validateChoice(step, choice));
    const misconceptionId = getChoiceMisconceptionId(choice);
    if (misconceptionId) button.dataset.misconception = misconceptionId;
    if (choice && typeof choice === "object" && choice.relation) {
      button.dataset.relation = String(choice.relation);
    }
    button.addEventListener("click", () => handleChoice(choice, button));
    ui.choices.appendChild(button);
  });

  if (typeof updateProblemVisualForStep === "function") updateProblemVisualForStep(problem, step, state);
}

async function handleChoice(choice, button) {
  if (state.pendingAdvance || state.inputLocked) return;
  state.inputLocked = true;
  const problem = state.problems[state.problemIndex];
  const step = problem.steps[state.stepIndex];
  const correct = LessonModel.validateChoice(step, choice);
  recordScoreboardStep(problem, step, choice, correct);
  state.stepAttempts.push({
    choiceId: getChoiceId(choice),
    misconceptionId: getChoiceMisconceptionId(choice),
    correct,
  });
  [...ui.choices.querySelectorAll(".choice-button")].forEach((choiceButton) => {
    delete choiceButton.dataset.state;
    choiceButton.classList.remove("is-wrong", "is-correct");
  });

  if (!correct) {
    state.mistakeTouched = true;
    button.dataset.state = "wrong";
    ui.feedback.dataset.state = "wrong";
    ui.feedback.textContent = getChoiceFeedback(choice) || step.wrongText || "다시 골라 봐요.";
    ui.instructionText.hidden = true;
    if (typeof renderAttempt === "function") renderAttempt(problem, step, choice, state, { correct: false, button });
    playSample("step-wrong");
    await setProblemSceneState("waiting");
    await showMathmonReaction("wrong");
    await runViewHook("onStepWrong", { problem, step, choice, state, button });
    state.inputLocked = false;
    return;
  }

  button.dataset.state = "correct";
  [...ui.choices.children].forEach((choiceButton) => {
    choiceButton.disabled = true;
  });
  ui.feedback.dataset.state = "correct";
  ui.feedback.textContent = step.correctText || "좋아요. 칸에 딱 맞았어요.";
  ui.instructionText.hidden = true;
  ui.answerSlot.textContent = step.reveal || step.correctText || String(step.answer);
  ui.answerSlot.classList.add("is-filled");
  playSample("step-correct");
  await setProblemSceneState("working");
  await showMathmonReaction("correct");
  if (typeof renderAttempt === "function") renderAttempt(problem, step, choice, state, { correct: true, button });
  if (typeof revealCorrectStep === "function") revealCorrectStep(problem, step, state);
  await runViewHook("onStepCorrect", { problem, step, choice, state, button });

  if (state.stepIndex < problem.steps.length - 1) {
    state.pendingAdvance = true;
    if (step.advance?.mode === "button" && typeof prepareStepAdvance === "function") {
      const prepared = prepareStepAdvance(problem, step, state, advanceToNextStep);
      if (prepared === true) return;
    }
    const delay = Number.isFinite(step.advance?.delayMs) ? step.advance.delayMs : 900;
    setTimeout(() => {
      advanceToNextStep();
    }, Math.max(0, delay));
    return;
  }

  if (step.advance?.mode === "button" && typeof prepareProblemComplete === "function") {
    state.pendingAdvance = true;
    const prepared = prepareProblemComplete(problem, step, state, () => completeCurrentProblem(problem, step, choice));
    if (prepared === true) return;
    state.pendingAdvance = false;
  }

  await completeCurrentProblem(problem, step, choice);
}

async function completeCurrentProblem(problem, step, choice) {
  if (state.completed) return;
  state.pendingAdvance = false;
  state.completed = true;
  await setProblemSceneState("complete");
  if (!state.mistakeTouched) state.correctFirstTry += 1;
  await runViewHook("onProblemComplete", { problem, step, choice, state });
  await showMathmonReaction("reward");
  playSample("problem-complete");
  const showCompleteExpression = LESSON_CONFIG.completion?.showExpression !== false;
  ui.completeText.hidden = !showCompleteExpression;
  ui.completeText.textContent = showCompleteExpression
    ? (problem.finalExpression || ui.answerSlot.textContent)
    : "";
  ui.completePanel.classList.toggle("is-action-only", !showCompleteExpression);
  ui.completePanel.classList.add("is-visible");
  ui.completePanel.closest(".problem-grid")?.classList.add("is-complete");
  ui.continueButton.hidden = false;
  ui.continueButton.focus({ preventScroll: true });
  state.inputLocked = false;
}

function advanceToNextStep() {
  if (!state.pendingAdvance) return;
  state.stepIndex += 1;
  state.pendingAdvance = false;
  state.inputLocked = false;
  state.stepAttempts = [];
  renderStep();
}

function getChoiceLabel(choice) {
  if (choice && typeof choice === "object") return String(choice.label ?? choice.value ?? choice.id ?? "");
  return String(choice);
}

function getChoiceId(choice) {
  if (choice && typeof choice === "object") return String(choice.id ?? choice.value ?? choice.label ?? "");
  return String(choice);
}

function getChoiceMisconceptionId(choice) {
  return choice && typeof choice === "object" && choice.misconceptionId
    ? String(choice.misconceptionId)
    : null;
}

function getChoiceFeedback(choice) {
  return choice && typeof choice === "object" && choice.feedback
    ? String(choice.feedback)
    : "";
}

function wireDirectChoice(button, dropTarget, choice, choose) {
  button.draggable = true;
  button.dataset.directChoice = "true";
  const submit = () => choose(choice, button);
  button.addEventListener("click", submit);
  button.addEventListener("dragstart", (event) => {
    event.dataTransfer?.setData("text/plain", getChoiceId(choice));
    button.dataset.dragging = "true";
    dropTarget.__directChoice = { choice, button };
  });
  button.addEventListener("dragend", () => { delete button.dataset.dragging; });
  if (dropTarget.dataset.directDropReady !== "true") {
    dropTarget.dataset.directDropReady = "true";
    dropTarget.addEventListener("dragover", (event) => event.preventDefault());
    dropTarget.addEventListener("drop", (event) => {
      event.preventDefault();
      const active = dropTarget.__directChoice;
      if (active) choose(active.choice, active.button);
      dropTarget.__directChoice = null;
    });
  }

  let start = null;
  button.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse") return;
    start = { x: event.clientX, y: event.clientY };
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener("pointermove", (event) => {
    if (!start) return;
    button.style.translate = `${event.clientX - start.x}px ${event.clientY - start.y}px`;
  });
  button.addEventListener("pointerup", (event) => {
    if (!start) return;
    const rect = dropTarget.getBoundingClientRect();
    const dropped = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
    start = null;
    button.style.translate = "";
    if (dropped) submit();
  });
}

function renderStepChips(problem) {
  ui.stepChips.innerHTML = "";
  problem.steps.forEach((step, index) => {
    const chip = document.createElement("span");
    chip.className = "step-chip";
    chip.textContent = index > state.stepIndex ? "?" : (step.label || `${index + 1}단계`);
    if (index > state.stepIndex) chip.setAttribute("aria-label", `${index + 1}단계 잠김`);
    chip.classList.toggle("is-current", index === state.stepIndex);
    chip.classList.toggle("is-done", index < state.stepIndex);
    ui.stepChips.appendChild(chip);
  });
}

async function showReward() {
  if (!state.completed || state.rewardPhase !== "idle") return;
  const rng = LessonModel.createRng(Date.now() + state.problemIndex * 97 + state.power);
  const firstTry = !state.mistakeTouched;
  const event = LessonModel.pickRewardEvent(rng, !firstTry);
  state.pendingRewardEvent = event;
  state.rewardPhase = "closed";

  if (getRewardMode() === "modal-art") {
    openRewardModal(event);
    return;
  }

  if (getRewardMode() === "stage-reveal") {
    const beforeResult = LessonModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
    ui.rewardScreenTitle.textContent = LESSON_CONFIG.rewardScreenTitle || "보상";
    if (ui.rewardScene instanceof HTMLImageElement) {
      ui.rewardScene.src = LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp";
    } else if (ui.rewardScene) {
      ui.rewardScene.style.backgroundImage = `url("${LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp"}")`;
    }
    ui.rewardLabel.textContent = "";
    ui.rewardNextButton.textContent = LESSON_CONFIG.reward?.closedLabel || "열기";
    ui.rewardNextButton.disabled = false;
    await runViewHook("onRewardPrepare", { event, beforePower: state.power, beforeResult, state });
    showScreen("reward");
    ui.rewardNextButton.focus({ preventScroll: true });
    return;
  }

  const beforePower = applyPendingReward(event);
  state.rewardPhase = "revealed";
  renderRewardMeter(event, beforePower, state.power);

  ui.rewardScreenTitle.textContent = LESSON_CONFIG.rewardScreenTitle || "보상";
  if (ui.rewardScene instanceof HTMLImageElement) {
    ui.rewardScene.src = LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp";
  } else if (ui.rewardScene) {
    ui.rewardScene.style.backgroundImage = `url("${LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp"}")`;
  }
  ui.rewardLabel.textContent = formatRewardText(event);
  ui.rewardNextButton.textContent = state.problemIndex >= state.problems.length - 1 ? "결과 보기" : "다음";
  showScreen("reward");
}

function renderRewardMeter(event, beforePower, afterPower) {
  if (!ui.rewardObject || !ui.rewardLiquid) return;
  const maxPower = Number(LESSON_CONFIG.reward?.maxPower) || 100;
  const fill = LessonModel.clamp((Number(afterPower) / maxPower) * 100, 0, 100);
  const delta = Number(afterPower) - Number(beforePower);
  const direction = event?.special ? "special" : delta > 0 ? "up" : delta < 0 ? "down" : "same";
  const symbol = event?.special ? "★" : delta > 0 ? "↑" : delta < 0 ? "↓" : "↻";
  ui.rewardObject.dataset.direction = direction;
  ui.rewardObject.dataset.symbol = symbol;
  ui.rewardLiquid.style.setProperty("--fill", `${fill}%`);
}

function openRewardModal(event) {
  if (ui.playMathmonReaction) ui.playMathmonReaction.hidden = true;
  ui.modalRewardLabel.textContent = LESSON_CONFIG.reward?.closedLabel || "무엇이 나올까요?";
  ui.modalRewardNextButton.textContent = state.problemIndex >= state.problems.length - 1 ? "결과 보기" : (LESSON_CONFIG.reward?.nextLabel || "다음");
  ui.rewardPop.dataset.reward = "closed";
  ui.rewardPop.dataset.rarity = event.rarity || "common";
  ui.rewardPop.querySelector(".reward-card")?.setAttribute("data-reward-phase", "closed");
  ui.rewardVisual.style.setProperty("--reward-modal-image", `url("${getRewardClosedImage()}")`);
  ui.modalRewardOpenButton.hidden = false;
  ui.modalRewardOpenButton.disabled = false;
  ui.modalRewardNextButton.hidden = true;
  ui.rewardPop.hidden = false;
  ui.modalRewardOpenButton.focus();
}

function applyPendingReward(event) {
  const firstTry = !state.mistakeTouched;
  const beforePower = state.power;
  const rewardPatch = LessonModel.applyReward(state, event, firstTry, state.problems[state.problemIndex]);
  if (rewardPatch && typeof rewardPatch === "object") {
    if (Number.isFinite(rewardPatch.power)) state.power = rewardPatch.power;
    if (typeof rewardPatch.specialSeen === "boolean") state.specialSeen = rewardPatch.specialSeen;
  }
  finishScoreboardQuestion(event);
  state.lastRewardEvent = event;
  state.currentResult = null;
  return beforePower;
}

async function revealStageReward() {
  if (getRewardMode() !== "stage-reveal" || state.rewardPhase !== "closed" || !state.pendingRewardEvent) return;
  const event = state.pendingRewardEvent;
  const beforeResult = LessonModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
  state.rewardPhase = "opening";
  ui.rewardNextButton.disabled = true;
  const beforePower = applyPendingReward(event);
  const afterResult = LessonModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  ui.rewardLabel.textContent = formatRewardDelta(event);
  playSample(event.rarity === "legend" ? "reward-legend" : event.rarity === "rare" ? "reward-rare" : "reward-open");
  if (!reduceMotion) await waitFor(650);
  await runViewHook("onRewardReveal", {
    event,
    beforePower,
    afterPower: state.power,
    beforeResult,
    afterResult,
    state,
  });
  ui.rewardLabel.textContent = getRewardTargetText(event, beforeResult, afterResult);
  state.rewardPhase = "revealed";
  ui.rewardNextButton.textContent = state.problemIndex >= state.problems.length - 1
    ? "결과 보기"
    : (LESSON_CONFIG.reward?.nextLabel || "다음");
  ui.rewardNextButton.disabled = false;
  ui.rewardNextButton.focus({ preventScroll: true });
  syncProgress();
}

function waitFor(duration) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function formatRewardDelta(event) {
  if (event.special) return LESSON_CONFIG.reward?.specialLabel || "황금밭!";
  const amount = Number(event.amount) || 0;
  if (amount > 0) return `+${amount}`;
  if (amount < 0) return String(amount);
  return "그대로";
}

function getRewardTargetText(event, beforeResult, afterResult) {
  const formatter = globalThis.formatLessonRewardTarget;
  if (typeof formatter === "function") {
    try {
      const formatted = formatter({ event, beforeResult, afterResult, state });
      if (typeof formatted === "string" && formatted.trim()) return formatted.trim();
    } catch (error) {
      console.warn("formatLessonRewardTarget failed", error);
    }
  }
  if (afterResult?.needsSpecial) return "황금밭을 찾았어요!";
  if (afterResult?.id && beforeResult?.id !== afterResult.id) return `${afterResult.name}이 됐어요!`;
  const nextResult = typeof LessonModel.getNextResult === "function"
    ? LessonModel.getNextResult(afterResult)
    : afterResult;
  if (!nextResult || nextResult.id === afterResult?.id) return "황금밭을 찾아봐요!";
  const missingCorrect = Math.max(0, Number(nextResult.minCorrect || 0) - state.correctFirstTry);
  if (state.power >= Number(nextResult.minPower || 0) && missingCorrect > 0) {
    return `${nextResult.name}까지 문제 ${missingCorrect}개 더`;
  }
  const remaining = Math.max(0, Number(nextResult.minPower || 0) - state.power);
  return `${nextResult.name}까지 ${remaining} 더`;
}

async function revealRewardModal() {
  if (state.rewardPhase !== "closed" || !state.pendingRewardEvent) return;
  const event = state.pendingRewardEvent;
  state.rewardPhase = "opening";
  ui.modalRewardOpenButton.disabled = true;
  ui.rewardPop.querySelector(".reward-card")?.setAttribute("data-reward-phase", "opening");
  await nextAnimationFrame();
  const beforePower = applyPendingReward(event);
  ui.rewardPop.dataset.reward = event.family || event.id || "";
  ui.rewardVisual.style.setProperty("--reward-modal-image", `url("${getRewardImage(event)}")`);
  ui.rewardPop.querySelector(".reward-card")?.setAttribute("data-reward-phase", "revealed");
  playSample(event.rarity === "legend" ? "reward-legend" : event.rarity === "rare" ? "reward-rare" : "reward-open");
  await runViewHook("onRewardReveal", { event, beforePower, afterPower: state.power, state });
  await animateRewardValue(event);
  state.rewardPhase = "revealed";
  ui.modalRewardOpenButton.hidden = true;
  ui.modalRewardOpenButton.disabled = false;
  ui.modalRewardNextButton.hidden = false;
  ui.modalRewardNextButton.focus();
}

function nextAnimationFrame() {
  return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function animateRewardValue(event) {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = reduceMotion ? 0 : 650;
  const target = Number(event.amount) || 0;
  const unit = LESSON_CONFIG.reward?.unitLabel || LESSON_CONFIG.progressLabel || "힘";
  return new Promise((resolve) => {
    const started = performance.now();
    const tick = (now) => {
      const progress = duration === 0 ? 1 : Math.min(1, (now - started) / duration);
      const value = Math.round(target * progress);
      ui.modalRewardLabel.textContent = `${unit} ${value > 0 ? "+" : ""}${value}`;
      if (progress < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

function closeRewardModal() {
  ui.rewardPop.hidden = true;
  ui.rewardPop.dataset.reward = "";
  ui.rewardPop.dataset.rarity = "";
  state.pendingRewardEvent = null;
  state.rewardPhase = "idle";
}

function getRewardClosedImage() {
  return LESSON_CONFIG.imageAssets.rewardClosed || LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp";
}

function getRewardImage(event) {
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  return event.image || artMap[event.id] || artMap[event.family] || LESSON_CONFIG.imageAssets.rewardScene || "cover-generated.webp";
}

function formatRewardText(event) {
  if (event.text) return event.text;
  if (event.amount > 0) return `+${event.amount}`;
  if (event.amount < 0) return `${event.amount}`;
  return "그대로";
}

function advanceAfterReward() {
  if (getRewardMode() === "stage-reveal" && state.rewardPhase !== "revealed") return;
  if (state.pendingAdvance) return;
  state.pendingAdvance = true;
  if (getRewardMode() === "modal-art") closeRewardModal();
  if (getRewardMode() === "stage-reveal") {
    state.pendingRewardEvent = null;
    state.rewardPhase = "idle";
  }
  if (getRewardMode() === "stage-full") {
    state.pendingRewardEvent = null;
    state.rewardPhase = "idle";
  }
  if (state.problemIndex >= state.problems.length - 1) {
    showResult();
    return;
  }
  state.problemIndex += 1;
  state.completed = false;
  renderProblem();
}

function showResult() {
  const result = getCurrentResult();
  const nextResult = typeof LessonModel.getNextResult === "function"
    ? LessonModel.getNextResult(result)
    : result;
  const hasNextResult = Boolean(nextResult?.id && nextResult.id !== result?.id);
  const nextResultText = hasNextResult ? `다음엔 ${nextResult.name}` : "최고 단계예요!";
  state.currentResult = result;
  playSample("result");
  ui.resultBg.src = result.image || LESSON_CONFIG.imageAssets.resultScene || LESSON_CONFIG.imageAssets.cover;
  ui.resultTitleArt.src = result.titleImage || result.image || LESSON_CONFIG.imageAssets.cover;
  ui.resultTitleArt.alt = "";
  ui.resultHeading.textContent = result.name || LESSON_CONFIG.title;
  ui.resultSummary.textContent = result.summary || "";
  if (ui.resultNext) ui.resultNext.textContent = nextResultText;
  if (ui.resultNextSvg) {
    ui.resultNextSvg.textContent = nextResultText;
    ui.resultNextSvg.hidden = !LESSON_CONFIG.result?.showNextGoal;
  }
  if (ui.resultDestinationSvg) ui.resultDestinationSvg.textContent = result.name || LESSON_CONFIG.title;
  if (ui.resultMeasureSvg) ui.resultMeasureSvg.textContent = `${LESSON_CONFIG.progressLabel || "힘"} ${state.power}`;
  if (ui.resultMeasureFillSvg) {
    const maxPower = LESSON_CONFIG.reward?.maxPower ?? 100;
    const width = LessonModel.clamp((state.power / maxPower) * 360, 0, 360);
    ui.resultMeasureFillSvg.setAttribute("width", String(width));
  }

  const correctArt = getCorrectCountAsset();
  ui.resultCorrectArt.hidden = !correctArt;
  if (correctArt) ui.resultCorrectArt.src = correctArt;

  const fullScene = getResultRenderMode() === "fullscene-score-slot";
  ui.resultTitleArt.hidden = fullScene && !LESSON_CONFIG.imageAssets.resultScene;
  screens.result.dataset.resultTier = result.id || "";

  const leaderboardAsset = LESSON_CONFIG.imageAssets.resultLeaderboardButton;
  const showLeaderboard = Boolean(isScoreboardEnabled() && leaderboardAsset && scoreboardBridge);
  ui.leaderboardButtonArt.hidden = !showLeaderboard;
  ui.leaderboardButton.hidden = !showLeaderboard;
  if (showLeaderboard) ui.leaderboardButtonArt.src = leaderboardAsset;

  void runViewHook("onResult", {
    result,
    nextResult,
    power: state.power,
    correctFirstTry: state.correctFirstTry,
    state,
  });

  showScreen("result");
}

function getCorrectCountAsset() {
  const correctAssets = LESSON_CONFIG.imageAssets?.resultCorrectCount || {};
  return correctAssets[String(state.correctFirstTry)] || `../_shared/result-count/result-correct-${state.correctFirstTry}-generated.webp`;
}

function getCurrentResult() {
  if (state.currentResult) return state.currentResult;
  return LessonModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
}

function getRewardMode() {
  return LESSON_CONFIG.reward?.mode || "stage-full";
}

function getResultRenderMode() {
  return LESSON_CONFIG.result?.renderMode || "card-art";
}

function isScoreboardEnabled() {
  return LESSON_CONFIG.scoreboard?.enabled === true && Boolean(ui.scoreboardScreen);
}

let lastRunSeed = null;

function createRunSeed() {
  const params = new URLSearchParams(window.location.search);
  const seedParam = params.get("seed");
  const hasQaMarker = [...params.keys()].some((key) => key === "audioSmoke" || key.startsWith("qa"));
  const requestedSeed = seedParam === null ? null : Number(seedParam);
  if (hasQaMarker && Number.isSafeInteger(requestedSeed)) return requestedSeed;

  let seed = Date.now() >>> 0;
  if (globalThis.crypto?.getRandomValues) {
    const randomValues = new Uint32Array(2);
    globalThis.crypto.getRandomValues(randomValues);
    seed = (seed ^ randomValues[0] ^ randomValues[1]) >>> 0;
  } else {
    seed = (seed ^ Math.floor(Math.random() * 0x100000000)) >>> 0;
  }
  if (seed === lastRunSeed) seed = (seed + 0x6d2b79f5) >>> 0;
  lastRunSeed = seed;
  return seed;
}

function startGame() {
  state = createInitialState();
  state.problems = LessonModel.generateRun(createRunSeed());
  scoreboardBridge?.start?.();
  renderProblem();
}

function restartFromSettings() {
  if (ui.settingsMenu) ui.settingsMenu.hidden = true;
  if (ui.settingsRestartConfirm) ui.settingsRestartConfirm.hidden = false;
  ui.settingsRestartConfirmButton?.focus();
}

function cancelRestartFromSettings() {
  if (ui.settingsRestartConfirm) ui.settingsRestartConfirm.hidden = true;
  if (ui.settingsMenu) ui.settingsMenu.hidden = false;
  ui.restartButton?.focus();
}

function confirmRestartFromSettings() {
  closeSettings({ restoreFocus: false });
  closeRewardModal();
  state = createInitialState();
  scoreboardBridge?.reset?.();
  syncProgress();
  showScreen("cover");
  ui.startButton?.focus({ preventScroll: true });
}

function openSettings() {
  if (ui.settingsMenu) ui.settingsMenu.hidden = false;
  if (ui.settingsRestartConfirm) ui.settingsRestartConfirm.hidden = true;
  ui.settingsBackdrop.hidden = false;
  ui.settingsToggle.setAttribute("aria-expanded", "true");
  syncAudioControls();
  ui.bgmToggle?.focus({ preventScroll: true });
}

function closeSettings({ restoreFocus = true } = {}) {
  ui.settingsBackdrop.hidden = true;
  ui.settingsToggle.setAttribute("aria-expanded", "false");
  if (ui.settingsMenu) ui.settingsMenu.hidden = false;
  if (ui.settingsRestartConfirm) ui.settingsRestartConfirm.hidden = true;
  if (restoreFocus) ui.settingsToggle.focus({ preventScroll: true });
}

function trapSettingsFocus(event) {
  if (ui.settingsBackdrop.hidden) return;
  if (event.key === "Escape") {
    event.preventDefault();
    closeSettings();
    return;
  }
  if (event.key !== "Tab") return;
  const focusable = [...ui.settingsModal.querySelectorAll("button:not([hidden]):not(:disabled)")]
    .filter((element) => element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function beginScoreboardQuestion(problem) {
  state.scoreboardQuestionStartedAt = performance.now();
  state.currentScoreboardAnswer = {
    questionIndex: state.problemIndex + 1,
    question: problem.prompt,
    correct: true,
    elapsedMs: 0,
    steps: [],
  };
}

function beginScoreboardStep(step) {
  state.scoreboardStepStartedAt = performance.now();
  if (state.currentScoreboardAnswer && !state.currentScoreboardAnswer.steps.some((item) => item.id === step.id)) {
    state.currentScoreboardAnswer.steps.push({
      id: step.id,
      instruction: step.instruction,
      expected: step.answer,
      selected: null,
      correct: null,
      elapsedMs: 0,
      attempts: [],
    });
  }
}

function recordScoreboardStep(problem, step, choice, correct) {
  if (!state.currentScoreboardAnswer) beginScoreboardQuestion(problem);
  const record = state.currentScoreboardAnswer.steps.find((item) => item.id === step.id);
  if (!record) return;
  const attempt = {
    choiceId: getChoiceId(choice),
    value: choice && typeof choice === "object" ? (choice.value ?? choice.label ?? choice.id) : choice,
    misconceptionId: getChoiceMisconceptionId(choice),
    correct,
    elapsedMs: Math.round(performance.now() - state.scoreboardStepStartedAt),
    attemptIndex: record.attempts.length,
  };
  record.attempts.push(attempt);
  if (record.selected == null) record.selected = attempt.value;
  record.correct = record.attempts.every((item) => item.correct);
  record.elapsedMs = attempt.elapsedMs;
  if (!correct) state.currentScoreboardAnswer.correct = false;
}

function finishScoreboardQuestion(event) {
  if (!state.currentScoreboardAnswer) return;
  state.currentScoreboardAnswer.elapsedMs = Math.round(performance.now() - state.scoreboardQuestionStartedAt);
  state.currentScoreboardAnswer.reward = {
    id: event.id,
    family: event.family,
    amount: event.amount,
    text: event.text,
  };
  if (LESSON_CONFIG.reward?.version) {
    state.currentScoreboardAnswer.reward.version = LESSON_CONFIG.reward.version;
  }
  state.scoreboardAnswers.push(state.currentScoreboardAnswer);
  state.currentScoreboardAnswer = null;
}

function getScoreboardRewardResult() {
  const result = getCurrentResult();
  const resultKind = LESSON_CONFIG.scoreboard?.resultKind || "score";
  if (resultKind === "island") {
    return { id: result.id, islandId: result.id, distance: state.power, name: result.name };
  }
  if (resultKind === "rocket") {
    return { id: result.id, destinationId: result.id, power: state.power, name: result.name };
  }
  if (resultKind === "fusion") {
    return { id: result.id, gradeId: result.id, power: state.power, name: result.name };
  }
  return { id: result.id, gradeId: result.id, power: state.power, name: result.name };
}

function getScoreboardApiUrl() {
  const queryValue = new URLSearchParams(window.location.search).get("scoreboardApi");
  const configured = queryValue || window.MATHMON_SCOREBOARD_API_URL || LESSON_CONFIG.scoreboard?.apiUrl || "";
  return configured ? configured.replace(/\/$/, "") : "";
}

function createScoreboardBridge() {
  if (!isScoreboardEnabled() || !MathmonScoreboard?.createApiBridge) return null;
  return MathmonScoreboard.createApiBridge({
    root: ui.scoreboardScreen,
    apiUrl: getScoreboardApiUrl(),
    lessonId: LESSON_CONFIG.folder,
    totalQuestions: TOTAL_QUESTIONS,
    getScore: () => state.power,
    getCorrectCount: () => state.correctFirstTry,
    getAnswers: () => state.scoreboardAnswers,
    getRewardResult: getScoreboardRewardResult,
    showScoreboard: () => showScreen("scoreboard"),
    showResult: () => showScreen("result"),
    restart: () => startGame(),
    playSound: () => playSample("scoreboard"),
  });
}

const scoreboardBridge = createScoreboardBridge();

ui.startButton.addEventListener("click", () => beginTutorial("cover"));
ui.nextTutorialButton.addEventListener("click", continueTutorial);
ui.backTutorialButton?.addEventListener("click", previousTutorial);
ui.continueButton.addEventListener("click", showReward);
ui.rewardNextButton.addEventListener("click", () => {
  if (getRewardMode() === "stage-reveal") {
    if (state.rewardPhase === "closed") revealStageReward();
    else if (state.rewardPhase === "revealed") advanceAfterReward();
    return;
  }
  advanceAfterReward();
});
ui.modalRewardOpenButton?.addEventListener("click", revealRewardModal);
ui.modalRewardNextButton.addEventListener("click", advanceAfterReward);
ui.retryButton.addEventListener("click", startGame);
ui.leaderboardButton.addEventListener("click", () => scoreboardBridge?.open?.());
ui.settingsToggle.addEventListener("click", openSettings);
ui.closeSettings.addEventListener("click", () => closeSettings());
ui.settingsBackdrop.addEventListener("keydown", trapSettingsFocus);
ui.reviewTutorialButton.addEventListener("click", () => {
  closeSettings({ restoreFocus: false });
  beginTutorial(state.screen || "play");
});
ui.restartButton.addEventListener("click", restartFromSettings);
ui.settingsRestartConfirmButton?.addEventListener("click", confirmRestartFromSettings);
ui.settingsRestartCancelButton?.addEventListener("click", cancelRestartFromSettings);
ui.bgmToggle.addEventListener("click", () => {
  audio.bgm = !audio.bgm;
  saveAudioFlag(STORAGE_KEYS.bgm, audio.bgm);
  syncAudioControls();
});
ui.sfxToggle.addEventListener("click", () => {
  audio.sfx = !audio.sfx;
  saveAudioFlag(STORAGE_KEYS.sfx, audio.sfx);
  syncAudioControls();
});

syncAudioControls();
syncProgress();

window.__mathmonAudioQa = {
  keys: { bgm: STORAGE_KEYS.bgm, sfx: STORAGE_KEYS.sfx },
  getPrefs: () => ({ bgmEnabled: audio.bgm, sfxEnabled: audio.sfx }),
  setPrefs: ({ bgmEnabled, sfxEnabled } = {}) => {
    if (typeof bgmEnabled === "boolean") {
      audio.bgm = bgmEnabled;
      saveAudioFlag(STORAGE_KEYS.bgm, audio.bgm);
    }
    if (typeof sfxEnabled === "boolean") {
      audio.sfx = sfxEnabled;
      saveAudioFlag(STORAGE_KEYS.sfx, audio.sfx);
    }
    syncAudioControls();
    return window.__mathmonAudioQa.getPrefs();
  },
};

window.__mathmonEngineQa = {
  startGame,
  renderProblem,
  showResult,
  showScreen,
  showReward,
  revealStageReward,
  setState: (patch = {}) => {
    const allowed = [
      "problemIndex", "stepIndex", "power", "correctFirstTry", "specialSeen",
      "completed", "mistakeTouched", "rewardPhase", "pendingRewardEvent", "currentResult",
    ];
    for (const key of allowed) {
      if (Object.hasOwn(patch, key)) state[key] = patch[key];
    }
    return window.__mathmonEngineQa.getState();
  },
  getState: () => ({
    screen: state.screen,
    problemIndex: state.problemIndex,
    stepIndex: state.stepIndex,
    inputLocked: state.inputLocked,
    pendingAdvance: state.pendingAdvance,
    completed: state.completed,
    power: state.power,
    correctFirstTry: state.correctFirstTry,
    specialSeen: state.specialSeen,
    rewardPhase: state.rewardPhase,
    pendingRewardId: state.pendingRewardEvent?.id || "",
    pendingRewardAmount: Number(state.pendingRewardEvent?.amount) || 0,
    pendingRewardSpecial: Boolean(state.pendingRewardEvent?.special),
    lastRewardId: state.lastRewardEvent?.id || "",
    answers: state.scoreboardAnswers,
  }),
  getCurrentProblem: () => state.problems[state.problemIndex] || null,
  getCurrentStep: () => state.problems[state.problemIndex]?.steps[state.stepIndex] || null,
};
