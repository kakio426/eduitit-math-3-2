const STAR_SVG_NS = "http://www.w3.org/2000/svg";

function ensureStarStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".star-stage-art")) return;
  const image = document.createElement("img");
  image.className = "star-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureStarStageArt();
  ui.visualArea.dataset.proofChoice = "";
  ui.visualArea.dataset.proofStep = "";
  ui.visualArea.dataset.revealedStep = "";
  renderStarMathBoard(problem, state);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.proofChoice = "";
  ui.visualArea.dataset.proofStep = "";
  ui.visualArea.dataset.revealedStep = "";
  renderStarMathBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.proofStep = step.id;
  ui.visualArea.dataset.proofChoice = String(step.answer);
  renderStarMathBoard(problem, state);
}

function renderAttempt(problem, step, selected, state, result) {
  ui.visualArea.dataset.proofStep = step.id;
  ui.visualArea.dataset.proofChoice = String(selected.value);
  renderStarMathBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  ui.choices.dataset.interaction = step.id === "quotient" ? "choose-group-limit" : "choose-leftover-stars";
  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-button star-choice ${step.id === "quotient" ? "star-quotient-choice" : "star-remainder-choice"}`;
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.dataset.relation = selected.relation || "";
    if (Number.isFinite(selected.product)) button.dataset.product = String(selected.product);

    const value = document.createElement("strong");
    value.textContent = selected.label;
    const detail = document.createElement("span");
    detail.textContent = step.id === "quotient"
      ? `${problem.divisor} × ${selected.value}`
      : "남은 별";
    button.append(value, detail);
    button.setAttribute("aria-label", step.id === "quotient"
      ? `${selected.label}, ${problem.divisor} 곱하기 ${selected.value}`
      : `${selected.label}`);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function onStepCorrect() { return glowStarScene("correct"); }
function onStepWrong() { return glowStarScene("wrong"); }
function onProblemComplete() { return glowStarScene("complete"); }
function onRewardReveal() { return glowStarScene("reward"); }
function glowStarScene(sceneState) {
  const art = document.querySelector(".star-stage-art");
  if (!art) return Promise.resolve();
  art.dataset.sceneState = sceneState;
  return new Promise((resolve) => setTimeout(resolve, matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 360));
}

function renderStarMathBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const proofStep = ui.visualArea.dataset.proofStep;
  const rawProofChoice = ui.visualArea.dataset.proofChoice;
  const showProof = rawProofChoice !== "";
  const proofChoice = showProof ? Number(rawProofChoice) : Number.NaN;
  const quotientDone = state.stepIndex > 0 || revealedStep === "quotient" || revealedStep === "remainder";
  const remainderDone = revealedStep === "remainder";
  const quotientProof = showProof && proofStep === "quotient";
  const remainderProof = showProof && proofStep === "remainder";
  const shownQuotient = quotientDone ? problem.quotient : quotientProof ? proofChoice : Number.NaN;
  const selectedGrouped = Number.isFinite(shownQuotient) ? shownQuotient * problem.divisor : 0;
  const fillWidth = selectedGrouped ? Math.min(560, Math.round((selectedGrouped / problem.dividend) * 560)) : 0;
  const overflowWidth = selectedGrouped > problem.dividend
    ? Math.min(74, Math.max(24, Math.round(((selectedGrouped - problem.dividend) / problem.dividend) * 560)))
    : 0;
  const selectedGap = quotientProof ? problem.dividend - selectedGrouped : problem.remainder;
  const visibleRemaining = quotientProof && selectedGap > 0 ? selectedGap : quotientDone ? problem.remainder : 0;
  const proofSummary = getStarProofSummary(problem, {
    quotientProof,
    remainderProof,
    proofChoice,
    selectedGrouped,
    selectedGap,
    quotientDone
  });

  const svg = document.createElementNS(STAR_SVG_NS, "svg");
  svg.classList.add("star-math-svg");
  svg.setAttribute("viewBox", "0 0 920 360");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <rect x="60" y="12" width="800" height="336" rx="30" fill="#07142f" fill-opacity="0.96" stroke="#f0ce65" stroke-width="4" />
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      <text x="230" y="55" class="star-board-label">전체 별</text>
      <text x="230" y="112" class="star-board-number">${problem.dividend}</text>
      <text x="460" y="55" class="star-board-label">한 묶음</text>
      <text x="460" y="112" class="star-board-number">${problem.divisor}개씩</text>
      <text x="690" y="55" class="star-board-label">만든 묶음</text>
      <text x="690" y="112" class="star-board-number ${state.stepIndex === 0 ? "is-current" : ""}">${Number.isFinite(shownQuotient) ? `${shownQuotient}묶음` : "?"}</text>
      <g class="star-proof">
        <rect class="star-proof-bar" x="180" y="146" width="560" height="34" rx="17" fill="#17345f" />
        ${fillWidth ? `<rect class="star-proof-fill" x="180" y="146" width="${fillWidth}" height="34" rx="17" fill="#5bd4d1" />` : ""}
        ${overflowWidth ? `<rect class="star-proof-overflow" x="740" y="146" width="${overflowWidth}" height="34" rx="17" fill="#ef6688" />` : ""}
        <text x="460" y="218" class="star-proof-label">${proofSummary}</text>
        ${visibleRemaining ? `<text x="150" y="273" class="star-dot-row-label">남은 별</text>${renderStarDots(visibleRemaining, 278, quotientProof && selectedGap >= problem.divisor ? "can-group" : "actual", quotientProof && selectedGap >= problem.divisor ? problem.divisor : 0)}` : ""}
        ${remainderProof ? renderRemainderEvidence(proofChoice, problem.divisor, proofChoice === problem.remainder) : ""}
      </g>
      ${remainderDone ? `<text x="744" y="300" class="star-board-label">나머지</text><text x="744" y="337" class="star-board-number is-current is-small">${problem.remainder}</text>` : ""}
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function getStarProofSummary(problem, proof) {
  if (proof.quotientProof) {
    if (proof.selectedGap < 0) return `${proof.selectedGrouped}개가 필요해요.`;
    if (proof.selectedGap >= problem.divisor) return `${proof.selectedGrouped}개를 묶어도 ${proof.selectedGap}개가 남아요.`;
    return `${proof.selectedGrouped}개를 묶었어요.`;
  }
  if (proof.quotientDone) return `${problem.grouped}개를 묶었어요.`;
  return "묶음 수를 골라요.";
}

function renderStarDots(count, y = 278, state = "actual", groupSize = 0) {
  if (!count) return "";
  const spacing = Math.min(30, 480 / Math.max(1, count - 1));
  const start = 460 - ((count - 1) * spacing) / 2;
  const groupFrame = groupSize > 0
    ? `<rect class="star-next-group" x="${start - 15}" y="${y - 20}" width="${(groupSize - 1) * spacing + 30}" height="40" rx="16" />`
    : "";
  return Array.from({ length: count }, (_, index) => {
    const x = start + index * spacing;
    const tone = state === "candidate-wrong" ? "#ff9ab0" : "#ffd45c";
    return `<circle cx="${x}" cy="${y}" r="10" fill="${tone}"/><text x="${x}" y="${y + 5}" font-size="13" fill="#5b3a00">★</text>`;
  }).join("") + groupFrame;
}

function renderRemainderEvidence(selectedCount, divisor, isCorrect) {
  if (!Number.isFinite(selectedCount)) return "";
  const state = isCorrect ? "actual" : "candidate-wrong";
  const dots = renderStarDots(selectedCount, 324, state, !isCorrect && selectedCount >= divisor ? divisor : 0);
  return `<text x="150" y="329" class="star-dot-row-label">고른 답</text>${dots}`;
}
