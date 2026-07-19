const FARM_SVG_NS = "http://www.w3.org/2000/svg";
let farmInteractionState = null;
let farmProblemProgress = null;
let farmStatusBadge = null;
let farmRewardStage = null;
let farmResultNextArt = null;
let farmResultPanel = null;
let farmResultStep = null;
let farmHarvestButtonArt = null;
let farmRewardButtonObserver = null;

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

function ensureFarmHarvestButtonArt() {
  if (farmHarvestButtonArt?.isConnected) return farmHarvestButtonArt;
  const button = document.getElementById("rewardButton");
  const source = LESSON_CONFIG.imageAssets?.harvestViewButton;
  if (!button || !source) return null;

  button.classList.add("farm-harvest-button");
  button.setAttribute("aria-label", LESSON_CONFIG.buttonLabel || "수확 보기");
  const image = document.createElement("img");
  image.className = "farm-harvest-button-art";
  image.src = source;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  button.replaceChildren(image);
  farmHarvestButtonArt = image;
  return farmHarvestButtonArt;
}

function ensureFarmRewardNextButtonArt() {
  const button = document.getElementById("rewardNextButton");
  const source = LESSON_CONFIG.imageAssets?.nextButton;
  if (!button || !source) return null;

  const sync = () => {
    if (button.querySelector(".farm-next-button-art")) return;
    const label = button.textContent.trim();
    const nextLabel = LESSON_CONFIG.reward?.nextLabel || "다음";
    if (label !== nextLabel) {
      button.classList.remove("farm-next-button");
      delete button.dataset.actionLabel;
      return;
    }

    button.classList.add("farm-next-button");
    button.dataset.actionLabel = label;
    button.setAttribute("aria-label", label);
    const image = document.createElement("img");
    image.className = "farm-next-button-art";
    image.src = source;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    button.replaceChildren(image);
  };

  if (!farmRewardButtonObserver) {
    farmRewardButtonObserver = new MutationObserver(sync);
    farmRewardButtonObserver.observe(button, { childList: true, subtree: true, characterData: true });
  }
  sync();
  return farmRewardButtonObserver;
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
  const panel = ensureFarmResultPanel();
  if (!panel) return null;
  const image = document.createElement("img");
  image.className = "result-next-art";
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  panel.insertBefore(image, panel.querySelector("#resultCorrectArt"));
  farmResultNextArt = image;
  return image;
}

function ensureFarmResultPanel() {
  if (farmResultPanel?.isConnected) return farmResultPanel;
  const layer = document.querySelector("#screen-result .result-layer");
  const title = document.getElementById("resultTitleArt");
  const correct = document.getElementById("resultCorrectArt");
  const retry = document.getElementById("restartButton");
  if (!layer || !title || !correct || !retry) return null;

  const panel = document.createElement("section");
  panel.className = "farm-result-panel";
  panel.setAttribute("aria-label", "마지막 농장 결과");
  const divider = document.createElement("span");
  divider.className = "farm-result-divider";
  divider.setAttribute("aria-hidden", "true");
  const step = document.createElement("strong");
  step.className = "farm-result-step";
  panel.append(title, step, divider, correct, retry);
  layer.appendChild(panel);
  farmResultPanel = panel;
  farmResultStep = step;
  return panel;
}

function ensureFarmTutorialGuide() {
  const firstCard = document.querySelector("#screen-tutorial .tutorial-card:first-child");
  if (!firstCard || firstCard.querySelector(".farm-tutorial-guide")) return;

  const guide = document.createElement("div");
  guide.className = "farm-tutorial-guide";

  const heading = document.createElement("h3");
  heading.textContent = "똑같이 나누면 나눗셈";

  const steps = document.createElement("div");
  steps.className = "farm-tutorial-steps";
  steps.append(
    createFarmTutorialStep("1", "tens", 4, 1, "40 ÷ 4 = 10", "한 바구니에 10개씩"),
    createFarmTutorialStep("2", "ones", 8, 2, "8 ÷ 4 = 2", "한 바구니에 2개씩")
  );

  const sum = document.createElement("p");
  sum.className = "farm-tutorial-sum";
  sum.textContent = "한 바구니에 10 + 2 = 12개";

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
  const proof = document.createElement("div");
  proof.className = "farm-tutorial-result-proof";
  const proofPieces = document.createElement("div");
  proofPieces.className = "farm-tutorial-proof-pieces";
  appendFarmPieces(proofPieces, kind, shareCount, 4);
  const resultLabel = document.createElement("strong");
  resultLabel.textContent = `한 바구니 ${kind === "tens" ? shareCount * 10 : shareCount}개`;
  proof.append(proofPieces, resultLabel);
  result.append(proof);

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
      ui.choices.querySelector(".farm-drag-piece")?.focus({ preventScroll: true });
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
      locked: false,
      wrongMessage: "",
      basketUnits: Array(problem.divisor).fill(0),
    };
    ui.choices.dataset.interaction = "share-drag-distribution";
    ui.choices.dataset.choiceKind = step.id;
    renderFarmShareEntry();
    return true;
  }

  return false;
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct || !farmInteractionState) return;
  if (farmInteractionState.type === "share") {
    farmInteractionState.wrongMessage = "바구니를 똑같이 만들어요.";
    renderFarmShareEntry();
    return;
  }
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
  const { problem, step, locked, wrongMessage, basketUnits } = farmInteractionState;
  const placedUnits = basketUnits.reduce((sum, count) => sum + count, 0);
  const sourceRemaining = Math.max(0, step.unitCount - placedUnits);
  const entry = document.createElement("div");
  entry.className = `farm-share-entry ${wrongMessage ? "is-wrong" : ""}`;

  const source = document.createElement("section");
  source.className = "farm-share-source";
  const sourceLabel = document.createElement("strong");
  sourceLabel.textContent = `전체 ${step.totalValue}개`;
  const sourcePieces = document.createElement("div");
  sourcePieces.className = "farm-share-source-pieces";
  for (let index = 0; index < sourceRemaining; index += 1) {
    const piece = createFarmProducePiece(step.id);
    piece.classList.add("farm-drag-piece");
    piece.tabIndex = locked ? -1 : 0;
    piece.setAttribute("role", "button");
      piece.setAttribute(
        "aria-label",
        step.id === "tens" ? "당근 10개 묶음을 바구니로 옮기기" : "당근 한 개를 바구니로 옮기기"
      );
    piece.addEventListener("pointerdown", (event) => beginFarmPieceDrag(event, { type: "source" }));
    sourcePieces.appendChild(piece);
  }
  source.append(sourceLabel, sourcePieces);

  const preview = createFarmShareBasketPreview(problem, step, basketUnits, true);
  const feedback = createFarmEntryMessage(wrongMessage || "");
  feedback.classList.add("farm-share-feedback");
  const commitButton = document.createElement("button");
  commitButton.type = "button";
  commitButton.className = "farm-share-commit visually-hidden";
  commitButton.tabIndex = -1;
  entry.append(source, preview, feedback, commitButton);
  ui.choices.replaceChildren(entry);
}

function createFarmShareBasketPreview(problem, step, previewValue, interactive = false) {
  const preview = document.createElement("div");
  preview.className = "farm-share-preview farm-share-mini-basket";
  preview.style.setProperty("--basket-count", String(problem.divisor));
  const basketCounts = Array.isArray(previewValue)
    ? previewValue
    : Array(problem.divisor).fill(Number.isFinite(previewValue) ? previewValue : 0);
  preview.setAttribute("aria-label", `바구니 ${problem.divisor}개에 직접 나누어 담는 곳`);

  for (let index = 0; index < problem.divisor; index += 1) {
    const count = Number(basketCounts[index] || 0);
    const basket = document.createElement("section");
    basket.className = "farm-share-basket";
    basket.dataset.basketIndex = String(index);
    basket.dataset.count = String(count);
    if (interactive) {
      basket.tabIndex = 0;
      basket.setAttribute("role", "button");
      basket.setAttribute("aria-label", `${index + 1}번째 바구니, ${count}${step.id === "tens" ? "묶음" : "개"}`);
      basket.addEventListener("pointerdown", (event) => {
        if (count > 0) beginFarmPieceDrag(event, { type: "basket", index });
      });
    }
    const scene = document.createElement("div");
    scene.className = "farm-share-basket-scene";
    scene.appendChild(createFarmBasketStateImage(step.id, count, "farm-share-basket-art"));
    if (step.id !== "tens" && count > 0 && !(step.id === "ones" && count <= 4 && LESSON_CONFIG.imageAssets.farmBasketSingles?.[count])) {
      const pieces = document.createElement("div");
      pieces.className = "farm-share-basket-pieces";
      appendFarmPieces(pieces, step.id, count, 4);
      scene.appendChild(pieces);
    }
    const countLabel = document.createElement("strong");
    countLabel.className = "farm-share-basket-count";
    countLabel.textContent = `${count}${step.id === "tens" ? "묶음" : "개"}`;
    basket.append(scene, countLabel);
    preview.appendChild(basket);
  }
  return preview;
}

function createFarmQuantityToken(stepId, count, unitName) {
  const token = document.createElement("div");
  token.className = `farm-quantity-token farm-quantity-token--${stepId}`;
  token.appendChild(createFarmProducePiece(stepId));
  const countLabel = document.createElement("strong");
  countLabel.textContent = `× ${count}${unitName}`;
  token.appendChild(countLabel);
  return token;
}

function beginFarmPieceDrag(event, origin) {
  if (!farmInteractionState || farmInteractionState.type !== "share" || farmInteractionState.locked) return;
  if (event.pointerType === "mouse" && event.button !== 0) return;
  event.preventDefault();
  const ghost = createFarmProducePiece(farmInteractionState.step.id);
  ghost.classList.add("farm-drag-ghost");
  document.body.appendChild(ghost);
  const moveGhost = (point) => {
    ghost.style.left = `${point.clientX}px`;
    ghost.style.top = `${point.clientY}px`;
  };
  moveGhost(event);
  document.querySelector(".farm-share-entry")?.classList.add("is-dragging");

  const onMove = (moveEvent) => {
    moveEvent.preventDefault();
    moveGhost(moveEvent);
  };
  const onUp = (upEvent) => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    window.removeEventListener("pointercancel", onUp);
    ghost.remove();
    const target = document.elementFromPoint(upEvent.clientX, upEvent.clientY);
    applyFarmPieceDrop(
      origin,
      target?.closest?.(".farm-share-basket"),
      target?.closest?.(".farm-share-source")
    );
  };
  window.addEventListener("pointermove", onMove, { passive: false });
  window.addEventListener("pointerup", onUp, { once: true });
  window.addEventListener("pointercancel", onUp, { once: true });
}

function applyFarmPieceDrop(origin, targetBasket, targetSource) {
  if (!farmInteractionState || farmInteractionState.type !== "share") return;
  const counts = farmInteractionState.basketUnits;
  const targetIndex = targetBasket ? Number(targetBasket.dataset.basketIndex) : -1;
  let changed = false;
  if (origin.type === "source" && targetIndex >= 0 && counts[targetIndex] < 4) {
    counts[targetIndex] += 1;
    changed = true;
  } else if (origin.type === "basket" && targetSource && counts[origin.index] > 0) {
    counts[origin.index] -= 1;
    changed = true;
  } else if (origin.type === "basket" && targetIndex >= 0 && targetIndex !== origin.index
      && counts[origin.index] > 0 && counts[targetIndex] < 4) {
    counts[origin.index] -= 1;
    counts[targetIndex] += 1;
    changed = true;
  }
  if (!changed) {
    renderFarmShareEntry();
    return;
  }
  farmInteractionState.wrongMessage = "";
  renderFarmShareEntry();
  const remaining = farmInteractionState.step.unitCount - counts.reduce((sum, count) => sum + count, 0);
  if (remaining === 0) window.setTimeout(checkFarmDistribution, 120);
}

function checkFarmDistribution() {
  if (!farmInteractionState || farmInteractionState.type !== "share" || farmInteractionState.locked) return;
  const { basketUnits, step, choose } = farmInteractionState;
  const allEqual = basketUnits.every((count) => count === basketUnits[0]);
  const option = allEqual
    ? step.choices.find((choice) => choice.units === basketUnits[0])
    : step.choices.find((choice) => choice.units !== step.answer / step.unitValue);
  const button = document.querySelector(".farm-share-commit");
  if (!option || !button) return;
  farmInteractionState.locked = true;
  choose(option, button);
}

function createFarmEntryMessage(text) {
  const message = document.createElement("p");
  message.className = "farm-entry-message";
  message.setAttribute("aria-live", "polite");
  message.textContent = text;
  return message;
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

function createFarmBasketStateImage(stepId, count, className) {
  if (count < 1 || count > 4) return createFarmBasketImage(className);
  const stateAssets = stepId === "tens"
    ? LESSON_CONFIG.imageAssets.farmBasketBundles
    : LESSON_CONFIG.imageAssets.farmBasketSingles;
  if (!stateAssets?.[count]) return createFarmBasketImage(className);
  const image = document.createElement("img");
  image.className = className;
  image.src = stateAssets[count]
    || (stepId === "tens" ? `farm-basket-bundles-${count}-generated.webp` : `farm-basket-singles-${count}-generated.png`);
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
  const confirmation = document.createElement("div");
  const hasNextStep = problem.steps.indexOf(step) < problem.steps.length - 1;
  const isFinal = !hasNextStep;
  confirmation.className = `farm-share-confirmation ${isFinal ? "is-final has-action-button" : "is-tens has-next-step has-action-button"}`;
  confirmation.setAttribute(
    "aria-label",
    isFinal
      ? `한 바구니에 10개 묶음 ${problem.tensQuotient}개와 낱개 ${problem.onesQuotient}개, 모두 ${problem.quotient}개`
      : `한 바구니에 10개 묶음 ${problem.tensQuotient}개씩, 바구니 ${problem.divisor}개`
  );

  const title = document.createElement("p");
  title.className = "farm-confirm-title";
  title.textContent = isFinal ? "낱개도 똑같이 나눴어요." : "모든 바구니에 똑같이 들어갔어요.";
  const baskets = createFarmShareBasketPreview(problem, step, step.answer / step.unitValue);
  baskets.classList.add("farm-confirm-baskets");
  const equation = document.createElement("strong");
  equation.className = "farm-confirm-equation";
  equation.textContent = `${step.totalValue} ÷ ${problem.divisor} = ${step.answer}`;
  const action = document.createElement("button");
  action.className = `farm-confirm-next-button ${isFinal ? "farm-problem-complete-button" : "farm-step-next-button"}`;
  action.type = "button";
  action.textContent = step.advance?.label || (isFinal ? "나눈 값 더하기" : "낱개 나누기");
  action.hidden = true;
  action.disabled = true;
  confirmation.append(title, baskets, equation, action);

  ui.choices.replaceChildren(confirmation);
}

function prepareStepAdvance(problem, step, state, advance) {
  const button = ui.choices.querySelector(".farm-step-next-button");
  if (!button) return false;
  button.hidden = false;
  button.disabled = false;
  button.addEventListener("click", () => {
    button.disabled = true;
    advance();
  }, { once: true });
  button.focus({ preventScroll: true });
  return true;
}

function prepareProblemComplete(problem, step, state, complete) {
  const button = ui.choices.querySelector(".farm-problem-complete-button");
  if (!button) return false;
  button.hidden = false;
  button.disabled = false;
  button.addEventListener("click", () => {
    button.disabled = true;
    void complete();
  }, { once: true });
  button.focus({ preventScroll: true });
  return true;
}

function onStepCorrect() {
  setFarmFlowPhase("confirm");
  return pulseScene("correct");
}

function onStepWrong() {
  setFarmFlowPhase("wrong");
  return pulseScene("wrong").then(() => {
    if (farmInteractionState?.type === "share") {
      farmInteractionState.locked = false;
      renderFarmShareEntry();
    }
    setFarmFlowPhase("active");
  });
}

function onProblemComplete({ problem }) {
  renderFarmCompleteHeader(problem);
  const animation = renderFarmCompleteSummary(problem);
  setFarmFlowPhase("complete");
  const panel = document.getElementById("completePanel");
  panel?.classList.add("is-visible");
  panel?.closest(".problem-grid")?.classList.add("is-complete");
  return Promise.all([pulseScene("complete"), animation]);
}

function renderFarmCompleteHeader(problem) {
  const svg = document.createElementNS(FARM_SVG_NS, "svg");
  svg.classList.add("place-value-farm-svg");
  svg.setAttribute("viewBox", "0 0 900 170");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}. 한 바구니에 ${problem.quotient}개`);
  svg.innerHTML = `
    <rect x="8" y="8" width="884" height="154" rx="32" class="farm-board-bg"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="450" y="72" class="farm-problem">${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}</text>
      <text x="450" y="128" class="farm-instruction">한 바구니에 ${problem.quotient}개씩</text>
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function renderFarmCompleteSummary(problem) {
  const panel = document.getElementById("completePanel");
  if (!panel) return;
  let visual = panel.querySelector(".farm-complete-summary");
  if (!visual) {
    visual = document.createElement("div");
    visual.className = "farm-complete-summary";
    const text = document.getElementById("completeExpression");
    if (text) panel.insertBefore(visual, text);
    else panel.prepend(visual);
  }
  visual.style.setProperty("--basket-count", String(problem.divisor));
  visual.dataset.phase = "empty";
  visual.setAttribute(
    "aria-label",
    `바구니 ${problem.divisor}개에 당근이 똑같이 ${problem.quotient}개씩 들어갔어요.`
  );

  const heading = document.createElement("div");
  heading.className = "farm-complete-heading";
  const equation = document.createElement("strong");
  equation.textContent = `${problem.dividend} ÷ ${problem.divisor} = ${problem.quotient}`;
  heading.append(equation);

  const result = document.createElement("div");
  result.className = "farm-complete-result";
  const imageKind = problem.tensQuotient > 0 ? "tens" : "ones";
  const imageCount = imageKind === "tens" ? problem.tensQuotient : problem.onesQuotient;

  const process = document.createElement("div");
  process.className = "farm-complete-process";
  const processTitle = document.createElement("strong");
  processTitle.textContent = "나눈 값을 더해요";
  process.appendChild(processTitle);
  const processLines = [
    { label: "1단계", left: `${problem.tensValue} ÷ ${problem.divisor}`, right: problem.tensShare },
  ];
  if (problem.ones > 0) {
    processLines.push(
      { label: "2단계", left: `${problem.ones} ÷ ${problem.divisor}`, right: problem.onesQuotient },
      { label: "", text: `${problem.tensShare} + ${problem.onesQuotient} = ${problem.quotient}`, total: true }
    );
  }
  processLines.forEach(({ label, left, right, text, total }) => {
    const line = document.createElement("span");
    line.className = total ? "farm-complete-process-line is-total" : "farm-complete-process-line";
    if (label) {
      const stepLabel = document.createElement("small");
      stepLabel.textContent = label;
      line.appendChild(stepLabel);
    }
    if (total) {
      const expression = document.createElement("b");
      expression.textContent = text;
      line.appendChild(expression);
    } else {
      const leftExpression = document.createElement("b");
      leftExpression.className = "farm-complete-process-left";
      leftExpression.textContent = left;
      const equals = document.createElement("b");
      equals.className = "farm-complete-process-equals";
      equals.textContent = "=";
      const rightExpression = document.createElement("b");
      rightExpression.className = "farm-complete-process-right";
      rightExpression.textContent = String(right);
      line.append(leftExpression, equals, rightExpression);
    }
    process.appendChild(line);
  });

  const basketResult = document.createElement("div");
  basketResult.className = "farm-complete-basket-result";
  basketResult.appendChild(createFarmBasketStateImage(imageKind, imageCount, "farm-complete-result-art"));

  const answer = document.createElement("div");
  answer.className = "farm-complete-answer";
  const answerLabel = document.createElement("span");
  answerLabel.textContent = "한 바구니에";
  const answerValue = document.createElement("strong");
  answerValue.textContent = `${problem.quotient}개씩`;
  answer.append(answerLabel, answerValue);
  basketResult.append(answer);
  result.append(process, basketResult);
  visual.replaceChildren(heading, result);

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    visual.dataset.phase = "complete";
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        visual.dataset.phase = "bundles";
        window.setTimeout(() => {
          visual.dataset.phase = "complete";
          window.setTimeout(resolve, 360);
        }, 420);
      });
    });
  });
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
  window.setTimeout(() => {
    const amount = Number(event.amount) || 0;
    const earned = document.createElement("strong");
    earned.className = "farm-reward-earned";
    earned.textContent = event.special
      ? "황금밭 발견!"
      : `이번에 ${amount > 0 ? "+" : ""}${amount}점`;
    const total = document.createElement("strong");
    total.className = "farm-reward-total";
    total.textContent = `지금 ${state.power}점`;
    const arrow = document.createElement("span");
    arrow.className = "farm-reward-score-arrow";
    arrow.textContent = "→";
    arrow.setAttribute("aria-hidden", "true");
    stage.label.replaceChildren(earned, arrow, total);
    stage.label.setAttribute("aria-label", `${earned.textContent}, ${total.textContent}`);
  }, 0);
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return new Promise((resolve) => setTimeout(resolve, reduced ? 0 : 480));
}

function onResult({ result, correctFirstTry = 0 }) {
  const panel = farmResultPanel || ensureFarmResultPanel();
  const step = farmResultStep || panel?.querySelector(".farm-result-step");
  const resultIndex = (LESSON_CONFIG.results || []).findIndex((item) => item.id === result.id);
  if (panel) {
    panel.dataset.resultId = result.id;
    panel.dataset.correctCount = String(Math.max(0, Math.min(10, Number(correctFirstTry) || 0)));
  }
  if (step) step.textContent = `${Math.max(0, resultIndex) + 1}단계`;
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
  let stepExpression = step.id === "tens"
    ? `${problem.tensValue} ÷ ${problem.divisor}`
    : `${problem.ones} ÷ ${problem.divisor}`;
  let instruction = step.id === "tens" ? "한 바구니에 몇 묶음?" : "한 바구니에 몇 개?";
  let reason = "";
  if (revealed && step.id === "tens") {
    stepExpression = `${problem.tensValue} ÷ ${problem.divisor} = ${problem.tensShare}`;
    instruction = `한 바구니에 ${problem.tensShare}개씩`;
  }
  if (revealed && step.id === "ones") {
    stepExpression = `${problem.ones} ÷ ${problem.divisor} = ${problem.onesQuotient}`;
    instruction = `한 바구니에 ${problem.onesQuotient}개씩`;
  }
  const svg = document.createElementNS(FARM_SVG_NS, "svg");
  svg.classList.add("place-value-farm-svg");
  svg.setAttribute("viewBox", "0 0 900 170");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}. ${stepExpression}. ${instruction}`);
  svg.innerHTML = `
    <rect x="8" y="8" width="310" height="154" rx="28" class="farm-board-bg farm-problem-box"/>
    <rect x="332" y="8" width="560" height="154" rx="28" class="farm-board-bg farm-step-box"/>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="163" y="103" class="farm-problem">${problem.dividend} ÷ ${problem.divisor}</text>
      <text x="612" y="74" class="farm-step-expression">${stepExpression}</text>
      <text x="612" y="126" class="farm-instruction">${instruction}</text>
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

function installFarmResultPreview() {
  const tierId = new URLSearchParams(window.location.search).get("resultPreview");
  if (!tierId || !window.__mathmonEngineQa) return;
  const tierStates = {
    seed: { power: 0, correctFirstTry: 0, specialSeen: false },
    sprout: { power: 15, correctFirstTry: 2, specialSeen: false },
    garden: { power: 35, correctFirstTry: 4, specialSeen: false },
    farm: { power: 55, correctFirstTry: 6, specialSeen: false },
    bigfarm: { power: 78, correctFirstTry: 8, specialSeen: false },
    rainbow: { power: 100, correctFirstTry: 10, specialSeen: true },
  };
  const preview = tierStates[tierId];
  if (!preview) return;
  window.__mathmonEngineQa.setState({ ...preview, currentResult: null });
  window.__mathmonEngineQa.showResult();
}

ensureFarmTutorialGuide();
ensureFarmStatusBadge();
ensureFarmHarvestButtonArt();
ensureFarmRewardNextButtonArt();
ensureFarmRewardStage();
ensureFarmResultPanel();
ensureFarmResultNextArt();
queueMicrotask(installDivideFarmAudioQa);
queueMicrotask(installFarmResultPreview);
