const PIZZA_SVG_NS = "http://www.w3.org/2000/svg";

function ensurePizzaStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".pizza-stage-art")) return;
  const image = document.createElement("img");
  image.className = "pizza-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem) {
  ensurePizzaStageArt();
  ui.visualArea.dataset.pizzaState = "idle";
  ui.visualArea.dataset.selectedNum = "";
  ui.visualArea.dataset.selectedDen = "";
  renderPizzaWorkbench(problem);
}
function updateProblemVisualForStep(problem) { renderProblemVisual(problem); }
function revealCorrectStep(problem) {
  ui.visualArea.dataset.pizzaState = "correct";
  ui.visualArea.dataset.selectedNum = String(problem.num);
  ui.visualArea.dataset.selectedDen = String(problem.den);
  renderPizzaWorkbench(problem);
}
function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.pizzaState = "wrong";
  ui.visualArea.dataset.selectedNum = String(selected.num);
  ui.visualArea.dataset.selectedDen = String(selected.den);
  renderPizzaWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "fraction-card";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button fraction-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", `${selected.den}분의 ${selected.num}`);
    const svg = document.createElementNS(PIZZA_SVG_NS, "svg");
    svg.classList.add("fraction-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 150");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = fractionMarkup(selected.num, selected.den, 120, 76, "choice");
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderPizzaWorkbench(problem) {
  const state = ui.visualArea.dataset.pizzaState || "idle";
  const selectedNum = Number(ui.visualArea.dataset.selectedNum || 0);
  const selectedDen = Number(ui.visualArea.dataset.selectedDen || 1);
  const svg = document.createElementNS(PIZZA_SVG_NS, "svg");
  svg.classList.add("pizza-confirm-svg");
  svg.dataset.state = state;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `전체 ${problem.den}조각 중 색칠된 ${problem.num}조각`);
  const relation = state === "idle" ? "?" : state === "correct" ? "=" : "≠";
  const selected = state === "idle" ? `<text class="pizza-question" x="455" y="138" text-anchor="middle">?</text>` : fractionMarkup(selectedNum, selectedDen, 455, 126, "selected");
  svg.innerHTML = `
    ${pizzaSlicesMarkup(problem.num, problem.den, 120, 125, 92)}
    <text class="count-name" x="250" y="91">색칠된 조각</text>
    <text class="count-value" x="350" y="92" text-anchor="middle">${problem.num}</text>
    <line class="count-line" x1="313" y1="119" x2="387" y2="119"/>
    <text class="count-name" x="250" y="158">전체 조각</text>
    <text class="count-value" x="350" y="159" text-anchor="middle">${problem.den}</text>
    <text class="fraction-relation" x="405" y="137" text-anchor="middle">${relation}</text>
    ${selected}
  `;
  ui.visualArea.replaceChildren(svg);
}

function fractionMarkup(num, den, cx, cy, kind) {
  return `
    <g class="fraction-mark fraction-mark-${kind}">
      <text class="fraction-num" x="${cx}" y="${cy - 18}" text-anchor="middle">${num}</text>
      <line class="fraction-line" x1="${cx - 30}" y1="${cy}" x2="${cx + 30}" y2="${cy}"/>
      <text class="fraction-den" x="${cx}" y="${cy + 42}" text-anchor="middle">${den}</text>
    </g>
  `;
}

function pizzaSlicesMarkup(num, den, cx, cy, radius) {
  let markup = `<circle class="pizza-crust" cx="${cx}" cy="${cy}" r="${radius + 9}"/>`;
  const angle = 360 / den;
  for (let index = 0; index < den; index += 1) {
    const start = -90 + index * angle;
    const end = start + angle;
    const p1 = polarPoint(cx, cy, radius, start);
    const p2 = polarPoint(cx, cy, radius, end);
    const largeArc = angle > 180 ? 1 : 0;
    const shaded = index < num;
    markup += `<path class="pizza-slice ${shaded ? "is-shaded" : "is-open"}" d="M ${cx} ${cy} L ${p1.x} ${p1.y} A ${radius} ${radius} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z"/>`;
    if (shaded) {
      const mid = polarPoint(cx, cy, radius * .58, start + angle / 2);
      markup += `<circle class="pizza-topping" cx="${mid.x}" cy="${mid.y}" r="8"/>`;
    }
  }
  return markup;
}

function polarPoint(cx, cy, radius, degrees) {
  const radians = degrees * Math.PI / 180;
  return { x: (cx + Math.cos(radians) * radius).toFixed(2), y: (cy + Math.sin(radians) * radius).toFixed(2) };
}
