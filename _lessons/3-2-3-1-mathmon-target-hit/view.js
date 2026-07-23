const CIRCLE_SVG_NS = "http://www.w3.org/2000/svg";

function ensureCircleStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen || playScreen.querySelector(".circle-stage-art")) return;
  const image = document.createElement("img");
  image.className = "circle-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function renderProblemVisual(problem, state) {
  ensureCircleStageArt();
  ui.visualArea.dataset.relation = "neutral";
  ui.visualArea.dataset.relationState = "idle";
  renderCircleWorkbench(problem);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.relation = "neutral";
  ui.visualArea.dataset.relationState = "idle";
  renderCircleWorkbench(problem);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.relation = problem.answerKind;
  ui.visualArea.dataset.relationState = "correct";
  renderCircleWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.relation = selected.visualKind;
  ui.visualArea.dataset.relationState = "wrong";
  renderCircleWorkbench(problem);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "circle-diagram";
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button circle-choice";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.setAttribute("aria-label", selected.label);

    const svg = document.createElementNS(CIRCLE_SVG_NS, "svg");
    svg.classList.add("circle-choice-svg");
    svg.setAttribute("viewBox", "0 0 240 180");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = circleRelationMarkup(selected.visualKind, false);
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function renderCircleWorkbench(problem) {
  const relation = ui.visualArea.dataset.relation || "neutral";
  const relationState = ui.visualArea.dataset.relationState || "idle";
  const svg = document.createElementNS(CIRCLE_SVG_NS, "svg");
  svg.classList.add("circle-confirm-svg");
  svg.dataset.state = relationState;
  svg.setAttribute("viewBox", "0 0 520 250");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", relation === "neutral" ? `${problem.term} 찾기` : `${problem.term} 확인`);
  svg.innerHTML = `
    <title>${problem.term} 관계 확인</title>
    <g transform="translate(140 5) scale(1.08)">
      ${circleRelationMarkup(relation, true)}
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function circleRelationMarkup(kind, large) {
  const circle = `<circle class="relation-circle" cx="120" cy="90" r="58"/>`;
  const centerReference = `<circle class="relation-center-reference" cx="120" cy="90" r="5"/>`;
  const endpoint = (x, y) => `<circle class="relation-endpoint" cx="${x}" cy="${y}" r="5"/>`;
  const line = (x1, y1, x2, y2) => `<line class="relation-candidate" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;

  if (kind === "neutral") {
    return `${circle}<text class="relation-question" x="120" y="105" text-anchor="middle">?</text>`;
  }
  if (kind === "center") {
    return `${circle}<circle class="relation-point-candidate" cx="120" cy="90" r="10"/>`;
  }
  if (kind === "edge-point") {
    return `${circle}<circle class="relation-point-candidate" cx="178" cy="90" r="10"/>`;
  }
  if (kind === "inner-point") {
    return `${circle}<circle class="relation-point-candidate" cx="150" cy="66" r="10"/>`;
  }
  if (kind === "outer-point") {
    return `${circle}<circle class="relation-point-candidate" cx="194" cy="48" r="10"/>`;
  }
  if (kind === "radius") {
    return `${circle}${centerReference}${line(120, 90, 178, 90)}${endpoint(178, 90)}`;
  }
  if (kind === "diameter") {
    return `${circle}${centerReference}${line(62, 90, 178, 90)}${endpoint(62, 90)}${endpoint(178, 90)}`;
  }
  if (kind === "off-center-chord") {
    return `${circle}${centerReference}${line(72, 57, 166, 126)}${endpoint(72, 57)}${endpoint(166, 126)}`;
  }
  return `${circle}${centerReference}${line(120, 90, 158, 65)}${endpoint(158, 65)}`;
}
