const FARM_SVG_NS = "http://www.w3.org/2000/svg";
let farmInteractionState = null;
let farmProblemProgress = null;
let farmStatusBadge = null;
let farmRewardStage = null;
let farmResultNextArt = null;

function getFarmStageImage(result) {
  const map = LESSON_CONFIG.imageAssets?.farmStages || LESSON_CONFIG.reward?.stageImages || {};
  return map[result?.id] || map.seed || "farm-stage-seed-generated.webp";
}

function getFarmEventImage(event) {
  const map = LESSON_CONFIG.reward?.artMap || {};
  return event?.image || map[event?.id] || map[event?.family] || LESSON_CONFIG.imageAssets.rewardClosed;
}

function ensureFarmStatusBadge() {
  if (farmStatusBadge?.root?.isConnected) return farmStatusBadge;
  const hud = document.querySelector("#screen-play .hud");
  const hudRight = hud?.querySelector(".hud-right");
  if (!hud || !hudRight) return null;
  const badge = document.createElement("div");
  badge.className = "farm-current-badge";
  badge.setAttribute("aria-label", "현재 농장");
  const image = document.createElement("img");
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  const label = document.createElement("span");
  badge.append(image, label);
  hud.insertBefore(badge, hudRight);
  farmStatusBadge = { root: badge, image, label };
  return farmStatusBadge;
}

function syncFarmStatusBadge(state) {
  const badge = ensureFarmStatusBadge();
  if (!badge) return;
  const result = Lesson2DivideFarmModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
  badge.image.src = getFarmStageImage(result);
  badge.label.textContent = result.name;
  badge.root.dataset.tier = result.id;
  badge.root.setAttribute("aria-label", `현재 농장 ${result.name}`);
}

function ensureFarmRewardStage() {
  if (farmRewardStage?.root?.isConnected) return farmRewardStage;
  const panel = document.querySelector("#screen-reward .reward-panel");
  const title = document.getElementById("rewardTitle");
  const label = document.getElementById("rewardChange");
  const button = document.getElementById("rewardNextButton");
  if (!panel || !title || !label || !button) return null;

  title.classList.add("visually-hidden");
  const story = document.createElement("div");
  story.className = "farm-reward-story";
  story.dataset.phase = "closed";

  const farm = document.createElement("div");
  farm.className = "farm-reward-farm";
  const before = document.createElement("img");
  before.className = "farm-reward-before";
  before.alt = "";
  before.setAttribute("aria-hidden", "true");
  const after = document.createElement("img");
  after.className = "farm-reward-after";
  after.alt = "";
  after.setAttribute("aria-hidden", "true");
  farm.append(before, after);

  const eventWrap = document.createElement("div");
  eventWrap.className = "farm-reward-event";
  const eventArt = document.createElement("img");
  eventArt.alt = "";
  eventArt.setAttribute("aria-hidden", "true");
  eventWrap.appendChild(eventArt);

  story.append(farm, eventWrap);
  label.className = "reward-change farm-reward-line";
  panel.replaceChildren(title, story, label, button);
  farmRewardStage = { root: story, before, after, eventArt, label, button };
  return farmRewardStage;
}

function ensureFarmResultNextArt() {
  if (farmResultNextArt?.isConnected) return farmResultNextArt;
  const layer = document.querySelector("#screen-result .result-layer");
  if (!layer) return null;
  const image = document.createElement("img");
  image.className = "result-next-art";
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  layer.appendChild(image);
  farmResultNextArt = image;
  return image;
}

function ensureFarmTutorialGuide() {
  const firstCard = document.querySelector("#screen-tutorial .tutorial-card:first-child");
  if (!firstCard || firstCard.querySelector(".farm-tutorial-guide")) return;

  const guide = document.createElement("div");
  guide.className = "farm-tutorial-guide";

  const heading = document.createElement("h3");
  heading.textContent = "48 ÷ 4를 풀어 봐요";

  const steps = document.createElement("div");
  steps.className = "farm-tutorial-steps";
  steps.append(
    createFarmTutorialStep("1", "tens", 4, 1, "40 ÷ 4 = 10", "십의 자리 몫 10"),
    createFarmTutorialStep("2", "ones", 8, 2, "8 ÷ 4 = 2", "일의 자리 몫 2")
  );

  const sum = document.createElement("p");
  sum.className = "farm-tutorial-sum";
  sum.textContent = "한 바구니에는 10 + 2 = 12개";

  guide.append(heading, steps, sum);
  firstCard.appendChild(guide);
}

function createFarmTutorialStep(number, kind, sourceCount, shareCount, expression, reason) {
  const row = document.createElement("section");
  row.className = "farm-tutorial-step";

  const numberBadge = document.createElement("span");
  numberBadge.className = "farm-tutorial-step-number";
  numberBadge.textContent = number;

  const source = document.createElement("div");
  source.className = "farm-tutorial-source";
  const sourcePieces = document.createElement("div");
  sourcePieces.className = "farm-tutorial-source-pieces";
  for (let index = 0; index < sourceCount; index += 1) sourcePieces.appendChild(createFarmProducePiece(kind));
  source.appendChild(sourcePieces);

  const expressionNode = document.createElement("div");
  expressionNode.className = "farm-tutorial-expression";
  expressionNode.innerHTML = `<strong>${expression}</strong><span>${reason}</span>`;

  const result = document.createElement("div");
  result.className = "farm-tutorial-result";
  const resultScene = document.createElement("div");
  resultScene.className = "farm-tutorial-result-scene";
  const basket = createFarmBasketImage("farm-tutorial-basket-art");
  const basketPieces = document.createElement("div");
  basketPieces.className = "farm-tutorial-result-pieces";
  appendFarmPieces(basketPieces, kind, shareCount, 4);
  const resultLabel = document.createElement("strong");
  resultLabel.textContent = `한 바구니 ${kind === "tens" ? shareCount * 10 : shareCount}개`;
  resultScene.append(basket, basketPieces);
  result.append(resultScene, resultLabel);

  row.append(numberBadge, source, expressionNode, result);
  return row;
}

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
  syncFarmStatusBadge(state);
  farmInteractionState = null;
  farmProblemProgress = { problemId: problem.id, tensDone: false, onesDone: false };
  ui.visualArea.dataset.revealedStep = "";
  renderFarmHeader(problem, problem.steps[0], state);
}

function updateProblemVisualForStep(problem, step, state) {
  if (!farmProblemProgress || farmProblemProgress.problemId !== problem.id) {
    farmProblemProgress = { problemId: problem.id, tensDone: false, onesDone: false };
  }
  ui.visualArea.dataset.revealedStep = "";
  setFarmFlowPhase("enter");
  renderFarmHeader(problem, step, state);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setFarmFlowPhase("active");
      ui.choices.querySelector(".farm-key")?.focus({ preventScroll: true });
    });
  });
}

function renderChoicesForStep(problem, step, state, choose) {
  if (step.interaction === "enter-share") {
    farmInteractionState = {
      type: "share",
      problem,
      step,
      state,
      choose,
      input: "",
      locked: false,
      wrongMessage: "",
      previewValue: null,
    };
    ui.choices.dataset.interaction = "enter-share";
    ui.choices.dataset.choiceKind = step.id;
    renderFarmShareEntry();
    return true;
  }

  if (step.interaction === "enter-quotient") {
    farmInteractionState = {
      type: "quotient",
      problem,
      step,
      state,
      choose,
      input: "",
      locked: false,
      wrongMessage: "",
    };
    ui.choices.dataset.interaction = "enter-quotient";
    ui.choices.dataset.choiceKind = step.id;
    renderFarmQuotientEntry();
    return true;
  }

  return false;
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct || !farmInteractionState) return;
  if (farmInteractionState.type === "share") {
    const chosenShare = Number(selected?.value || farmInteractionState.input || 0);
    const used = chosenShare * problem.divisor;
    farmInteractionState.previewValue = chosenShare;
    if (step.id === "tens" && chosenShare % 10 !== 0) {
      farmInteractionState.wrongMessage = "10개 묶음으로 나눠요.";
    } else if (used < step.totalValue) {
      farmInteractionState.wrongMessage = `${step.totalValue - used}개가 남아요.`;
    } else if (used > step.totalValue) {
      farmInteractionState.wrongMessage = `${used - step.totalValue}개가 부족해요.`;
    } else {
      farmInteractionState.wrongMessage = "한 바구니의 수를 다시 봐요.";
    }
    renderFarmShareEntry();
    return;
  }
  farmInteractionState.wrongMessage = "10개 묶음과 낱개를 다시 더해요.";
  renderFarmQuotientEntry();
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  if (step.id === "tens" && farmProblemProgress) farmProblemProgress.tensDone = true;
  if (step.id === "ones" && farmProblemProgress) farmProblemProgress.onesDone = true;
  renderFarmHeader(problem, step, state);
  renderFarmShareConfirmation(problem, step);
}

function renderFarmShareEntry() {
  if (!farmInteractionState || farmInteractionState.type !== "share") return;
  const { problem, step, input, locked, wrongMessage, previewValue } = farmInteractionState;
  const entry = document.createElement("div");
  entry.className = `farm-share-entry ${wrongMessage ? "is-wrong" : ""}`;

  const work = document.createElement("section");
  work.className = "farm-share-work";

  const source = document.createElement("div");
  source.className = "farm-share-source";
  const sourceLabel = document.createElement("strong");
  sourceLabel.textContent = `전체 ${step.totalValue}개`;
  const sourcePieces = document.createElement("div");
  sourcePieces.className = "farm-share-source-pieces";
  for (let index = 0; index < step.unitCount; index += 1) sourcePieces.appendChild(createFarmProducePiece(step.id));
  source.append(sourceLabel, sourcePieces);

  const reason = document.createElement("p");
  reason.className = "farm-step-reason";
  reason.textContent = step.reason;

  const basketGrid = document.createElement("div");
  basketGrid.className = "farm-share-baskets";
  basketGrid.style.setProperty("--basket-count", String(problem.divisor));
  for (let index = 0; index < problem.divisor; index += 1) {
    basketGrid.appendChild(createFarmAnswerBasket(step, index, previewValue, Boolean(wrongMessage)));
  }

  const answer = document.createElement("div");
  answer.className = "farm-share-answer";
  answer.innerHTML = `<span>한 바구니에</span><strong>${input || "?"}개씩</strong>`;

  work.append(source, reason, basketGrid, answer);

  const keypadWrap = document.createElement("section");
  keypadWrap.className = "farm-keypad-wrap farm-share-keypad-wrap";
  keypadWrap.append(
    createFarmKeypad(handleFarmShareKey, input, locked),
    createFarmEntryMessage(wrongMessage || "몇 개씩 넣을지 써요.")
  );

  entry.append(work, keypadWrap);
  ui.choices.replaceChildren(entry);
}

function createFarmAnswerBasket(step, index, previewValue, showPreview) {
  const card = document.createElement("div");
  card.className = "farm-answer-basket-card";
  const name = document.createElement("span");
  name.textContent = `${index + 1}번`;
  const scene = document.createElement("div");
  scene.className = "farm-answer-basket-scene";
  const basket = createFarmBasketImage("farm-basket-art");
  const pieces = document.createElement("div");
  pieces.className = "farm-answer-basket-pieces";
  if (showPreview && Number.isFinite(previewValue)) {
    const pieceCount = step.id === "tens" && previewValue % 10 === 0 ? previewValue / 10 : step.id === "ones" ? previewValue : 0;
    appendFarmPieces(pieces, step.id, pieceCount, 4);
  }
  const front = createFarmBasketImage("farm-basket-front-art");
  const value = document.createElement("strong");
  value.textContent = showPreview && Number.isFinite(previewValue) ? `${previewValue}개` : "?";
  scene.append(basket, pieces, front, value);
  card.append(name, scene);
  return card;
}

function createFarmKeypad(onKey, input, locked) {
  const keypad = document.createElement("div");
  keypad.className = "farm-keypad";
  [1, 2, 3, 4, 5, 6, 7, 8, 9, "지우기", 0, "확인"].forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `farm-key ${key === "확인" ? "is-enter choice-button" : key === "지우기" ? "is-clear" : ""}`;
    button.textContent = String(key);
    button.disabled = locked || (key === "확인" && !input);
    if (typeof key === "number") button.dataset.digit = String(key);
    button.addEventListener("click", () => onKey(key, button));
    keypad.appendChild(button);
  });
  return keypad;
}

function createFarmEntryMessage(text) {
  const message = document.createElement("p");
  message.className = "farm-entry-message";
  message.setAttribute("aria-live", "polite");
  message.textContent = text;
  return message;
}

function handleFarmShareKey(key, button) {
  if (!farmInteractionState || farmInteractionState.type !== "share" || farmInteractionState.locked) return;
  if (key === "지우기") {
    farmInteractionState.input = "";
    farmInteractionState.previewValue = null;
    farmInteractionState.wrongMessage = "";
    renderFarmShareEntry();
    return;
  }
  if (key === "확인") {
    if (!farmInteractionState.input) return;
    const value = Number(farmInteractionState.input);
    const selected = farmInteractionState.step.choices.find((item) => item.id === `value:${value}`) || {
      id: `value:${value}`,
      value,
      label: String(value),
      misconceptionId: "DIV1_SHARE_ERROR",
      feedback: "한 바구니의 수를 다시 봐요.",
    };
    farmInteractionState.previewValue = value;
    farmInteractionState.locked = true;
    farmInteractionState.choose(selected, button);
    return;
  }
  updateFarmNumberInput(key, renderFarmShareEntry);
}

function renderFarmQuotientEntry() {
  if (!farmInteractionState || farmInteractionState.type !== "quotient") return;
  const { problem, input, locked, wrongMessage } = farmInteractionState;
  const entry = document.createElement("div");
  entry.className = `farm-quotient-entry ${wrongMessage ? "is-wrong" : ""}`;

  const oneBasket = document.createElement("section");
  oneBasket.className = "farm-final-basket-card";
  const label = document.createElement("p");
  label.textContent = "한 바구니에 모인 수";
  const basketScene = document.createElement("div");
  basketScene.className = "farm-final-basket-scene";
  const basketArt = createFarmBasketImage("farm-basket-art");
  const pieces = document.createElement("div");
  pieces.className = "farm-final-basket-pieces";
  appendFarmPieces(pieces, "tens", problem.tensQuotient, 4);
  appendFarmPieces(pieces, "ones", problem.onesQuotient, 4, problem.tensQuotient);
  const basketFrontArt = createFarmBasketImage("farm-basket-front-art");
  basketScene.append(basketArt, pieces, basketFrontArt);
  const sum = document.createElement("span");
  sum.className = "farm-final-sum";
  sum.textContent = `${problem.tensShare} + ${problem.onesQuotient}`;
  const display = document.createElement("strong");
  display.className = "farm-quotient-display";
  display.textContent = input ? `${input}개` : "?개";
  oneBasket.append(label, basketScene, sum, display);

  const keypadWrap = document.createElement("section");
  keypadWrap.className = "farm-keypad-wrap";
  keypadWrap.append(
    createFarmKeypad(handleFarmQuotientKey, input, locked),
    createFarmEntryMessage(wrongMessage || "두 수를 더해 몫을 써요.")
  );

  entry.append(oneBasket, keypadWrap);
  ui.choices.replaceChildren(entry);
}

function handleFarmQuotientKey(key, button) {
  if (!farmInteractionState || farmInteractionState.type !== "quotient" || farmInteractionState.locked) return;
  if (key === "지우기") {
    farmInteractionState.input = "";
    farmInteractionState.wrongMessage = "";
    renderFarmQuotientEntry();
    return;
  }
  if (key === "확인") {
    if (!farmInteractionState.input) return;
    const value = Number(farmInteractionState.input);
    const selected = farmInteractionState.step.choices.find((item) => item.id === `value:${value}`) || {
      id: `value:${value}`,
      value,
      label: String(value),
      misconceptionId: "DIV1_QUOTIENT_COUNT_ERROR",
      feedback: "한 바구니를 다시 세어 봐요.",
    };
    farmInteractionState.locked = true;
    farmInteractionState.choose(selected, button);
    return;
  }
  updateFarmNumberInput(key, renderFarmQuotientEntry);
}

function updateFarmNumberInput(key, render) {
  if (!farmInteractionState || typeof key !== "number") return;
  if (farmInteractionState.input.length >= 2) return;
  if (farmInteractionState.input === "" && key === 0) return;
  farmInteractionState.input += String(key);
  farmInteractionState.wrongMessage = "";
  render();
  ui.choices.querySelector(".farm-key.is-enter")?.focus({ preventScroll: true });
}

function createFarmProducePiece(stepId) {
  const piece = document.createElement("span");
  piece.className = `farm-produce-piece farm-produce-piece--${stepId === "tens" ? "bundle" : "single"}`;
  const image = document.createElement("img");
  image.className = "farm-produce-art";
  image.src = stepId === "tens"
    ? (LESSON_CONFIG.imageAssets.farmBundleTen || "farm-bundle-ten-generated.webp")
    : (LESSON_CONFIG.imageAssets.farmCarrotSingle || "farm-carrot-single-generated.webp");
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.draggable = false;
  piece.appendChild(image);
  if (stepId === "tens") {
    const value = document.createElement("span");
    value.className = "farm-produce-value";
    value.textContent = "10";
    piece.appendChild(value);
  }
  return piece;
}

function createFarmBasketImage(className) {
  const image = document.createElement("img");
  image.className = className;
  image.src = LESSON_CONFIG.imageAssets.farmBasket || "farm-basket-empty-generated.webp";
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  image.draggable = false;
  return image;
}

function appendFarmPieces(container, kind, count, maxVisible = 4, slotOffset = 0) {
  const safeCount = Math.max(0, Number(count) || 0);
  const visibleCount = Math.min(safeCount, maxVisible);
  container.dataset.count = String(Math.min(slotOffset + visibleCount, 8));
  container.dataset[kind === "tens" ? "bundleCount" : "singleCount"] = String(visibleCount);
  for (let index = 0; index < visibleCount; index += 1) {
    const piece = createFarmProducePiece(kind);
    piece.dataset.slot = String(slotOffset + index);
    piece.dataset.kindSlot = String(index);
    container.appendChild(piece);
  }
  if (safeCount > visibleCount) {
    const more = document.createElement("span");
    more.className = "farm-piece-more";
    more.textContent = `+${safeCount - visibleCount}`;
    container.appendChild(more);
  }
}

function renderFarmShareConfirmation(problem, step) {
  const isTens = step.id === "tens";
  const isOnesOrFinal = step.id !== "tens";
  const value = isTens ? problem.tensShare : problem.quotient;
  const confirmation = document.createElement("div");
  confirmation.className = "farm-share-confirmation";
  confirmation.style.setProperty("--basket-count", String(problem.divisor));
  confirmation.setAttribute("aria-label", `바구니 ${problem.divisor}개에 ${value}개씩`);

  for (let index = 0; index < problem.divisor; index += 1) {
    const basketCard = document.createElement("div");
    basketCard.className = "farm-confirm-basket";
    basketCard.style.setProperty("--piece-delay", `${index * 90}ms`);
    const scene = document.createElement("div");
    scene.className = "farm-confirm-basket-scene";
    const basket = createFarmBasketImage("farm-basket-art");
    const pieces = document.createElement("div");
    pieces.className = "farm-confirm-pieces";
    appendFarmPieces(pieces, "tens", problem.tensQuotient, 4);
    if (isOnesOrFinal) appendFarmPieces(pieces, "ones", problem.onesQuotient, 4, problem.tensQuotient);
    const front = createFarmBasketImage("farm-basket-front-art");
    scene.append(basket, pieces, front);
    const label = document.createElement("strong");
    label.textContent = `${value}개`;
    basketCard.append(scene, label);
    confirmation.appendChild(basketCard);
  }

  ui.choices.replaceChildren(confirmation);
}

function onStepCorrect() {
  setFarmFlowPhase("confirm");
  return pulseScene("correct");
}

function onStepWrong() {
  setFarmFlowPhase("wrong");
  return pulseScene("wrong").then(() => new Promise((resolve) => {
    setTimeout(() => {
      if (farmInteractionState) {
        farmInteractionState.locked = false;
        farmInteractionState.input = "";
        farmInteractionState.wrongMessage = "";
        if (farmInteractionState.type === "share") {
          farmInteractionState.previewValue = null;
          renderFarmShareEntry();
        } else {
          renderFarmQuotientEntry();
        }
      }
      setFarmFlowPhase("active");
      resolve();
    }, 1000);
  }));
}

function onProblemComplete() {
  setFarmFlowPhase("complete");
  return pulseScene("complete");
}

function onRewardPrepare({ beforeResult }) {
  const stage = ensureFarmRewardStage();
  if (!stage) return;
  const source = getFarmStageImage(beforeResult);
  stage.before.src = source;
  stage.after.src = source;
  stage.eventArt.src = LESSON_CONFIG.imageAssets.rewardClosed;
  stage.label.textContent = "";
  stage.root.dataset.phase = "closed";
  stage.root.dataset.reward = "closed";
  stage.root.setAttribute("aria-label", `현재 농장 ${beforeResult.name}. 닫힌 바구니`);
}

function onRewardReveal({ event, beforeResult, afterResult, state }) {
  const stage = ensureFarmRewardStage();
  if (!stage) return Promise.resolve();
  stage.before.src = getFarmStageImage(beforeResult);
  stage.after.src = getFarmStageImage(afterResult);
  stage.eventArt.src = getFarmEventImage(event);
  stage.root.dataset.reward = event.family || event.id || "harvest";
  stage.root.dataset.phase = "revealed";
  stage.root.setAttribute("aria-label", `${event.text}. ${afterResult.name}이 됐어요.`);
  syncFarmStatusBadge(state);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 480));
}

function onResult({ result }) {
  const nextArt = ensureFarmResultNextArt();
  const source = LESSON_CONFIG.result?.nextTitleMap?.[result.id];
  if (nextArt) {
    nextArt.src = source || "";
    nextArt.hidden = !source;
  }
  const nextText = document.getElementById("resultNext");
  if (nextText) {
    const textMap = {
      seed: "다음엔 새싹!",
      sprout: "다음엔 텃밭!",
      garden: "다음엔 농장!",
      farm: "다음엔 대농장!",
      bigfarm: "황금밭을 찾아봐요!",
      rainbow: "황금밭을 찾았어요!",
    };
    nextText.textContent = textMap[result.id] || "다시 농장을 키워요!";
  }
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

function renderFarmHeader(problem, step, state) {
  const revealed = ui.visualArea.dataset.revealedStep === step.id;
  let instruction = step.instruction;
  let reason = step.reason;
  if (revealed && step.id === "tens") {
    instruction = `${problem.tensValue} ÷ ${problem.divisor} = ${problem.tensShare}`;
    reason = `십의 자리 몫은 ${problem.tensShare}`;
  }
  if (revealed && step.id === "ones") {
    instruction = `${problem.ones} ÷ ${problem.divisor} = ${problem.onesQuotient}`;
    reason = `일의 자리 몫은 ${problem.onesQuotient}`;
  }
  if (revealed && step.id === "quotient") {
    instruction = `${problem.tensShare} + ${problem.onesQuotient} = ${problem.quotient}`;
    reason = `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}`;
  }
  const svg = document.createElementNS(FARM_SVG_NS, "svg");
  svg.classList.add("place-value-farm-svg");
  svg.setAttribute("viewBox", "0 0 760 150");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}. ${instruction} ${reason}`);
  svg.innerHTML = `
    <rect x="8" y="8" width="744" height="134" rx="28" class="farm-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="380" y="60" class="farm-problem">${problem.dividend} ÷ ${problem.divisor}</text>
      <text x="380" y="103" class="farm-instruction">${instruction}</text>
      <text x="380" y="132" class="farm-reason">${reason}</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function installDivideFarmAudioQa() {
  const keys = {
    bgm: "mathmon-audio-bgm-enabled",
    sfx: "mathmon-audio-sfx-enabled",
  };
  const read = (key, fallback = true) => {
    try {
      const saved = window.localStorage.getItem(key);
      return saved == null ? fallback : saved === "true";
    } catch (error) {
      return fallback;
    }
  };
  const syncToggle = (id, enabled) => {
    const toggle = document.getElementById(id);
    if (!toggle) return;
    const current = toggle.getAttribute("aria-checked") === "true";
    if (current !== enabled) toggle.click();
  };
  const setPrefs = ({ bgmEnabled, sfxEnabled, bgm, sfx } = {}) => {
    const nextBgm = typeof bgmEnabled === "boolean" ? bgmEnabled : bgm;
    const nextSfx = typeof sfxEnabled === "boolean" ? sfxEnabled : sfx;
    if (typeof nextBgm === "boolean") syncToggle("settingsBgmToggle", nextBgm);
    if (typeof nextSfx === "boolean") syncToggle("settingsSfxToggle", nextSfx);
    return window.__mathmonAudioQa.getPrefs();
  };
  window.__mathmonAudioQa = {
    keys,
    getPrefs: () => ({ bgmEnabled: read(keys.bgm), sfxEnabled: read(keys.sfx) }),
    setPrefs,
    setState: setPrefs,
  };
}

ensureFarmTutorialGuide();
ensureFarmStatusBadge();
ensureFarmRewardStage();
ensureFarmResultNextArt();
queueMicrotask(installDivideFarmAudioQa);
