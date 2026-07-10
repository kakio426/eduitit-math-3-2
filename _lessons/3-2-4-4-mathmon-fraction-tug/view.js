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
function renderAttempt() {}

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
  const correct = ui.visualArea.dataset.compareState === "correct";
  const svg = document.createElementNS(TUG_SVG_NS, "svg");
  svg.classList.add(correct ? "fraction-compare-confirm-svg" : "compare-stage-svg");
  svg.setAttribute("viewBox", "0 0 760 260");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", correct ? `${problem.larger.num}/${problem.larger.den}이 ${problem.smaller.num}/${problem.smaller.den}보다 큼` : "두 분수 막대의 길이 비교");
  if (!correct) {
    svg.innerHTML = `<path class="tug-rope" d="M92 130c105-44 177 42 278 0s177 44 298 0"/><circle class="rope-mark" cx="380" cy="130" r="20"/>`;
  } else {
    svg.innerHTML = `
      <g transform="translate(8 0)">${fractionNotation(problem.larger, 150, 66, "confirm")}${fractionBar(problem.larger, 22, 108, 256, 58, "confirm")}</g>
      <text class="compare-sign" x="380" y="145" text-anchor="middle">&gt;</text>
      <g transform="translate(474 0)">${fractionNotation(problem.smaller, 150, 66, "confirm")}${fractionBar(problem.smaller, 22, 108, 256, 58, "confirm")}</g>
      <text class="confirm-label" x="380" y="224" text-anchor="middle">왼쪽 막대가 더 길어요.</text>
    `;
  }
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
