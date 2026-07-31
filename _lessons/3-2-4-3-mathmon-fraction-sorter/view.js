const SORT_SVG_NS = "http://www.w3.org/2000/svg";

function ensureSorterStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".sorter-stage-art")) return;
  const image = document.createElement("img");
  image.className = "sorter-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}
function renderProblemVisual(problem) {
  ensureSorterStageArt();
  ui.visualArea.dataset.sortState = "idle";
  ui.visualArea.dataset.sortChoice = "";
  renderFractionModel(problem);
}
function updateProblemVisualForStep(problem) { renderFractionModel(problem); }
function revealCorrectStep(problem) {
  ui.visualArea.dataset.sortState = "correct";
  ui.visualArea.dataset.sortChoice = problem.kind;
  renderFractionModel(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.sortState = "wrong";
  ui.visualArea.dataset.sortChoice = selected.value;
  renderFractionModel(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-name";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button sort-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.label}, ${selected.relation}`);
    const svg = document.createElementNS(SORT_SVG_NS, "svg");
    svg.classList.add("sort-choice-svg");
    svg.setAttribute("viewBox", "0 0 260 160");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<path class="sort-bin" d="M36 48h188l-18 92H54z"/><path class="sort-rim" d="M26 43h208"/><text class="sort-name" x="130" y="88" text-anchor="middle">${selected.label}</text><text class="sort-relation" x="130" y="119" text-anchor="middle">${selected.relation}</text>`;
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderFractionModel(problem) {
  const state = ui.visualArea.dataset.sortState || "idle";
  const selected = ui.visualArea.dataset.sortChoice || "";
  const svg = document.createElementNS(SORT_SVG_NS, "svg");
  svg.classList.add("fraction-model-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 720 285");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.spokenNotation}, ${problem.kind}`);
  const notation = problem.whole ? mixedNotation(problem.whole, problem.num, problem.den, 160, 146) : fractionNotation(problem.num, problem.den, 160, 130);
  const quantity = quantityBars(problem);
  const relation = selected ? `<g class="sort-result"><rect x="486" y="204" width="208" height="58" rx="22"/><text x="590" y="242" text-anchor="middle">${selected}</text></g>` : "";
  svg.innerHTML = `${notation}<path class="model-arrow" d="M280 132h55"/><path class="model-arrow-head" d="M335 132l-15-11v22z"/>${quantity}${relation}`;
  ui.visualArea.replaceChildren(svg);
}

function fractionNotation(num, den, cx, cy) {
  return `<g class="big-notation"><text x="${cx}" y="${cy - 35}" text-anchor="middle">${num}</text><line x1="${cx - 48}" y1="${cy - 10}" x2="${cx + 48}" y2="${cy - 10}"/><text x="${cx}" y="${cy + 55}" text-anchor="middle">${den}</text></g>`;
}
function mixedNotation(whole, num, den, cx, cy) {
  return `<g class="big-notation"><text class="whole-number" x="${cx - 58}" y="${cy + 5}" text-anchor="middle">${whole}</text><text x="${cx + 32}" y="${cy - 48}" text-anchor="middle">${num}</text><line x1="${cx - 8}" y1="${cy - 21}" x2="${cx + 72}" y2="${cy - 21}"/><text x="${cx + 32}" y="${cy + 48}" text-anchor="middle">${den}</text></g>`;
}
function quantityBars(problem) {
  const filledUnits = problem.whole ? problem.whole * problem.den + problem.num : problem.num;
  const bars = Math.max(1, Math.ceil(filledUnits / problem.den));
  const barWidth = 290;
  const x = 386;
  const startY = bars === 1 ? 104 : bars === 2 ? 67 : 34;
  const barHeight = bars === 1 ? 76 : bars === 2 ? 62 : 52;
  const gapY = 16;
  let markup = `<g class="quantity-bars">`;
  for (let bar = 0; bar < bars; bar += 1) {
    const y = startY + bar * (barHeight + gapY);
    const segmentWidth = barWidth / problem.den;
    for (let segment = 0; segment < problem.den; segment += 1) {
      const index = bar * problem.den + segment;
      markup += `<rect class="quantity-segment ${index < filledUnits ? "is-filled" : ""}" x="${(x + segment * segmentWidth).toFixed(1)}" y="${y}" width="${segmentWidth.toFixed(1)}" height="${barHeight}"/>`;
    }
  }
  return markup + `</g>`;
}
