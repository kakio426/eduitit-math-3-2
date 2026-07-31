const TUG_SVG_NS = "http://www.w3.org/2000/svg";

function ensureTugStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".tug-stage-art")) return;
  const image = document.createElement("img");
  image.className = "tug-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}
function renderProblemVisual(problem) {
  ensureTugStageArt();
  ui.visualArea.dataset.compareState = "idle";
  renderCompareStage(problem);
}
function updateProblemVisualForStep(problem) { renderCompareStage(problem); }
function revealCorrectStep(problem) {
  ui.visualArea.dataset.compareState = "correct";
  renderCompareStage(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.compareState = "wrong";
  ui.visualArea.dataset.selectedSide = selected.side;
  renderCompareStage(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-bar";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button compare-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.fraction.den}분의 ${selected.fraction.num}`);
    const svg = document.createElementNS(TUG_SVG_NS, "svg");
    svg.classList.add("compare-choice-svg");
    svg.setAttribute("viewBox", "0 0 400 220");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `${fractionNotation(selected.fraction, 200, 72, "choice")}${fractionBar(selected.fraction, 55, 125, 290, 62, "choice")}`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderCompareStage(problem) {
  const compareState = ui.visualArea.dataset.compareState || "idle";
  const correct = compareState === "correct";
  const wrong = compareState === "wrong";
  const svg = document.createElementNS(TUG_SVG_NS, "svg");
  svg.classList.add(correct || wrong ? "fraction-compare-confirm-svg" : "compare-stage-svg");
  svg.setAttribute("viewBox", "0 0 760 260");
  svg.setAttribute("role", "img");
  if (wrong) svg.dataset.state = "wrong";
  const leftValue = problem.left.num / problem.left.den;
  const rightValue = problem.right.num / problem.right.den;
  const relation = leftValue > rightValue ? ">" : "<";
  const selected = ui.visualArea.dataset.selectedSide === "left" ? problem.left : problem.right;
  const other = ui.visualArea.dataset.selectedSide === "left" ? problem.right : problem.left;
  svg.setAttribute("aria-label", correct
    ? `${problem.left.den}분의 ${problem.left.num} ${relation === ">" ? "큼" : "작음"} ${problem.right.den}분의 ${problem.right.num}`
    : wrong
      ? `고른 ${selected.den}분의 ${selected.num}이 ${other.den}분의 ${other.num}보다 작음`
      : "두 분수 막대의 길이 비교");
  const shownSign = correct ? relation : "?";
  const confirmLabel = correct
    ? (relation === ">" ? "왼쪽 막대가 더 길어요." : "오른쪽 막대가 더 길어요.")
    : wrong ? "고른 막대의 길이를 다시 봐요." : "두 막대의 길이를 비교해요.";
  svg.innerHTML = `
    <g transform="translate(8 0)">${fractionNotation(problem.left, 150, 66, "confirm")}${fractionBar(problem.left, 22, 108, 256, 58, "confirm")}</g>
    <text class="compare-sign" x="380" y="145" text-anchor="middle">${shownSign}</text>
    <g transform="translate(474 0)">${fractionNotation(problem.right, 150, 66, "confirm")}${fractionBar(problem.right, 22, 108, 256, 58, "confirm")}</g>
    <text class="confirm-label" x="380" y="224" text-anchor="middle">${confirmLabel}</text>
  `;
  ui.visualArea.replaceChildren(svg);
}

function fractionNotation(fraction, cx, cy, kind) {
  return `<g class="fraction-notation fraction-notation-${kind}"><text x="${cx}" y="${cy - 24}" text-anchor="middle">${fraction.num}</text><line x1="${cx - 32}" y1="${cy - 8}" x2="${cx + 32}" y2="${cy - 8}"/><text x="${cx}" y="${cy + 38}" text-anchor="middle">${fraction.den}</text></g>`;
}
function fractionBar(fraction, x, y, width, height, kind) {
  const segmentWidth = width / fraction.den;
  let markup = `<g class="fraction-bar fraction-bar-${kind}">`;
  for (let index = 0; index < fraction.den; index += 1) {
    markup += `<rect class="bar-segment ${index < fraction.num ? "is-filled" : ""}" x="${(x + index * segmentWidth).toFixed(1)}" y="${y}" width="${segmentWidth.toFixed(1)}" height="${height}"/>`;
  }
  return markup + `</g>`;
}
