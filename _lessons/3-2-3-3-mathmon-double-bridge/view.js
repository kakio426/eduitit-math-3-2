const BRIDGE_SVG_NS = "http://www.w3.org/2000/svg";
const BRIDGE_SCALE_MAX_PX = 232;

function ensureBridgeStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;
  playScreen.querySelector(".problem-grid")?.classList.add("bridge-workshop");
  if (playScreen.querySelector(".bridge-stage-art")) return;
  const image = document.createElement("img");
  image.className = "bridge-stage-art";
  image.src = LESSON_CONFIG.imageAssets.problemStage;
  image.alt = "";
  image.setAttribute("aria-hidden", "true");
  playScreen.prepend(image);
}

function getBridgeGeometry(problem, choices = problem.steps?.[0]?.choices ?? []) {
  const values = choices.map((choice) => Number(choice.value)).filter(Number.isFinite);
  const maxVisibleCm = Math.max(problem.diameter, ...values);
  const pxPerCm = BRIDGE_SCALE_MAX_PX / maxVisibleCm;
  const centerX = 380;
  const circleY = 122;
  const circleDiameterPx = problem.diameter * pxPerCm;
  const circleRadiusPx = circleDiameterPx / 2;
  const circleLeft = centerX - circleRadiusPx;
  const circleRight = centerX + circleRadiusPx;
  const answer = problem.ask === "지름" ? problem.diameter : problem.radius;
  const targetStart = problem.ask === "지름" ? circleLeft : centerX;
  const targetEnd = targetStart + answer * pxPerCm;
  return {
    answer,
    centerX,
    circleY,
    circleDiameterPx,
    circleRadiusPx,
    circleLeft,
    circleRight,
    maxVisibleCm,
    pxPerCm,
    targetStart,
    targetEnd,
    targetWidth: answer * pxPerCm,
  };
}

function getBridgeFit(value, geometry) {
  const width = value * geometry.pxPerCm;
  const end = geometry.targetStart + width;
  const difference = end - geometry.targetEnd;
  return {
    x: geometry.targetStart,
    width,
    end,
    difference,
    fit: Math.abs(difference) < 0.001 ? "fit" : difference < 0 ? "short" : "long",
  };
}

function renderProblemVisual(problem) {
  ensureBridgeStageArt();
  setBridgeVisualState("idle");
  renderCircleBridgeWorkbench(problem);
}

function updateProblemVisualForStep(problem) {
  setBridgeVisualState("idle");
  renderCircleBridgeWorkbench(problem);
}

function revealCorrectStep(problem, step) {
  setBridgeVisualState("correct", step.answer, "fit");
  renderCircleBridgeWorkbench(problem);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  const geometry = getBridgeGeometry(problem, step.choices);
  const fit = getBridgeFit(selected.value, geometry).fit;
  setBridgeVisualState("wrong", selected.value, fit);
  result.button.disabled = true;
  result.button.setAttribute("aria-label", `${selected.value} cm 다리, 맞지 않아요.`);
  renderCircleBridgeWorkbench(problem);
}

function setBridgeVisualState(bridgeState, selectedLength = "", bridgeFit = "waiting") {
  ui.visualArea.dataset.bridgeState = bridgeState;
  ui.visualArea.dataset.selectedLength = String(selectedLength);
  ui.visualArea.dataset.bridgeFit = bridgeFit;
}

function renderChoicesForStep(problem, step, state, choose) {
  const geometry = getBridgeGeometry(problem, step.choices);
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = "bridge-parts";
  ui.choices.style.setProperty("--bridge-px-per-cm", geometry.pxPerCm);
  step.choices.forEach((selected) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button bridge-part";
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.dataset.bridgeLength = String(selected.value);
    if (selected.misconceptionId) button.dataset.misconception = selected.misconceptionId;
    button.setAttribute("aria-label", `${selected.value} cm 다리 놓기`);

    const svg = document.createElementNS(BRIDGE_SVG_NS, "svg");
    svg.classList.add("bridge-part-svg");
    svg.setAttribute("viewBox", "0 0 380 84");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = bridgePartMarkup(selected.value, geometry.pxPerCm);
    button.appendChild(svg);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  });
  return true;
}

function onResult() {
  document.getElementById("restartButton")?.classList.add("result-restart-hitbox");
}

function bridgePartMarkup(value, pxPerCm) {
  const x = 24;
  const y = 19;
  const width = value * pxPerCm;
  return `
    <g class="bridge-part-shape" data-length="${value}">
      ${bridgeStructureMarkup(x, y, width, value, "candidate")}
    </g>
    <text class="bridge-part-label" x="356" y="55" text-anchor="end">${value} cm</text>
  `;
}

function bridgeStructureMarkup(x, y, width, value, kind) {
  const deckHeight = kind === "installed" ? 15 : 13;
  const trussDepth = kind === "installed" ? 27 : 23;
  const sectionCount = Math.max(2, Math.min(7, Math.round(value / 2)));
  const sectionWidth = width / sectionCount;
  let supports = "";
  for (let index = 0; index <= sectionCount; index += 1) {
    const supportX = x + sectionWidth * index;
    supports += `<line class="${kind}-support" x1="${supportX}" y1="${y + deckHeight}" x2="${supportX}" y2="${y + deckHeight + trussDepth}"/>`;
    if (index < sectionCount) {
      const nextX = x + sectionWidth * (index + 1);
      const lowY = y + deckHeight + trussDepth;
      supports += `<line class="${kind}-support" x1="${supportX}" y1="${y + deckHeight}" x2="${nextX}" y2="${lowY}"/>`;
    }
  }
  return `
    <line class="${kind}-shadow" x1="${x + 2}" y1="${y + deckHeight + trussDepth + 5}" x2="${x + width + 2}" y2="${y + deckHeight + trussDepth + 5}"/>
    <g class="${kind}-truss">
      <line class="${kind}-beam" x1="${x}" y1="${y + deckHeight}" x2="${x + width}" y2="${y + deckHeight}"/>
      <line class="${kind}-beam" x1="${x}" y1="${y + deckHeight + trussDepth}" x2="${x + width}" y2="${y + deckHeight + trussDepth}"/>
      ${supports}
    </g>
    <rect class="${kind}-deck" x="${x}" y="${y}" width="${width}" height="${deckHeight}" rx="3"/>
    <line class="${kind}-highlight" x1="${x + 4}" y1="${y + 4}" x2="${x + width - 4}" y2="${y + 4}"/>
  `;
}

function renderCircleBridgeWorkbench(problem) {
  const state = ui.visualArea.dataset.bridgeState || "idle";
  const selected = Number(ui.visualArea.dataset.selectedLength || 0);
  const fit = ui.visualArea.dataset.bridgeFit || "waiting";
  const choices = problem.steps?.[0]?.choices ?? [];
  const geometry = getBridgeGeometry(problem, choices);
  const svg = document.createElementNS(BRIDGE_SVG_NS, "svg");
  svg.classList.add("circle-bridge-confirm-svg");
  svg.dataset.state = state;
  svg.dataset.fit = fit;
  svg.dataset.pxPerCm = geometry.pxPerCm.toFixed(3);
  svg.setAttribute("viewBox", "0 0 760 340");
  svg.setAttribute("role", "img");

  const relationLabel = problem.ask === "지름"
    ? `반지름 ${problem.radius} 센티미터 두 개를 이은 지름`
    : `지름 ${problem.diameter} 센티미터를 반으로 나눈 반지름`;
  const fitLabel = state === "idle"
    ? "다리 부품을 고르는 중"
    : fit === "fit"
      ? `고른 ${selected} 센티미터 다리가 두 기둥에 맞음`
      : fit === "short"
        ? `고른 ${selected} 센티미터 다리가 두 번째 기둥에 닿지 않음`
        : `고른 ${selected} 센티미터 다리가 두 번째 기둥을 넘어감`;
  svg.setAttribute("aria-label", `${relationLabel}. ${fitLabel}`);
  svg.innerHTML = circleBridgeMarkup(problem, geometry, state === "idle" ? null : selected);
  ui.visualArea.replaceChildren(svg);
}

function installedBridgeMarkup(fitGeometry, value) {
  const y = 216;
  return `
    <g class="installed-bridge" data-fit="${fitGeometry.fit}">
      ${bridgeStructureMarkup(fitGeometry.x, y, fitGeometry.width, value, "installed")}
      <text class="installed-bridge-length" x="${fitGeometry.x + fitGeometry.width / 2}" y="${y - 10}" text-anchor="middle">${value} cm</text>
    </g>
  `;
}

function bridgeDifferenceMarkup(fitGeometry, geometry) {
  if (fitGeometry.fit === "fit") {
    return `
      <circle class="bridge-lock" cx="${geometry.targetStart}" cy="232" r="9"/>
      <circle class="bridge-lock" cx="${geometry.targetEnd}" cy="232" r="9"/>
      <path class="bridge-fit-check" d="M ${geometry.targetEnd + 17} 229 l 8 8 l 17 -19"/>
    `;
  }
  const start = Math.min(fitGeometry.end, geometry.targetEnd);
  const end = Math.max(fitGeometry.end, geometry.targetEnd);
  const label = fitGeometry.fit === "short" ? "여기만큼 짧아요" : "여기만큼 길어요";
  return `
    <line class="bridge-difference" x1="${start}" y1="267" x2="${end}" y2="267"/>
    <line class="bridge-difference-cap" x1="${start}" y1="259" x2="${start}" y2="275"/>
    <line class="bridge-difference-cap" x1="${end}" y1="259" x2="${end}" y2="275"/>
    <text class="bridge-difference-label" x="${(start + end) / 2}" y="290" text-anchor="middle">${label}</text>
  `;
}

function circleBridgeMarkup(problem, geometry, selected) {
  const askDiameter = problem.ask === "지름";
  const equation = selected == null
    ? ""
    : askDiameter
      ? `${problem.radius} + ${problem.radius} ${selected === geometry.answer ? "=" : "≠"} ${selected}`
      : `${problem.diameter} ÷ 2 ${selected === geometry.answer ? "=" : "≠"} ${selected}`;
  const fitGeometry = selected == null ? null : getBridgeFit(selected, geometry);
  const targetQuestion = selected == null
    ? `<text class="target-kind-label" x="${(geometry.targetStart + geometry.targetEnd) / 2}" y="200" text-anchor="middle">${problem.ask} ? cm</text>`
    : "";
  const relationMarkup = askDiameter
    ? `
      <text class="radius-name" x="${(geometry.circleLeft + geometry.centerX) / 2}" y="${geometry.circleY - 40}" text-anchor="middle">반지름</text>
      <text class="radius-value" x="${(geometry.circleLeft + geometry.centerX) / 2}" y="${geometry.circleY - 13}" text-anchor="middle">${problem.radius} cm</text>
      <text class="radius-name" x="${(geometry.centerX + geometry.circleRight) / 2}" y="${geometry.circleY - 40}" text-anchor="middle">반지름</text>
      <text class="radius-value" x="${(geometry.centerX + geometry.circleRight) / 2}" y="${geometry.circleY - 13}" text-anchor="middle">${problem.radius} cm</text>
      ${targetQuestion}
    `
    : `
      <line class="diameter-brace" x1="${geometry.circleLeft}" y1="${geometry.circleY - 27}" x2="${geometry.circleRight}" y2="${geometry.circleY - 27}"/>
      <line class="diameter-brace" x1="${geometry.circleLeft}" y1="${geometry.circleY - 34}" x2="${geometry.circleLeft}" y2="${geometry.circleY - 20}"/>
      <line class="diameter-brace" x1="${geometry.circleRight}" y1="${geometry.circleY - 34}" x2="${geometry.circleRight}" y2="${geometry.circleY - 20}"/>
      <text class="diameter-value" x="${geometry.centerX}" y="${geometry.circleY - 41}" text-anchor="middle">지름 ${problem.diameter} cm</text>
      ${targetQuestion}
    `;
  const installed = fitGeometry
    ? installedBridgeMarkup(fitGeometry, selected)
    : `
      <line class="bridge-empty-slot" x1="${geometry.targetStart}" y1="232" x2="${geometry.targetEnd}" y2="232"/>
      <text class="bridge-empty-label" x="${(geometry.targetStart + geometry.targetEnd) / 2}" y="240" text-anchor="middle">?</text>
    `;
  return `
    <g class="circle-relation">
      <circle class="bridge-circle-shadow" cx="${geometry.centerX}" cy="${geometry.circleY + 5}" r="${geometry.circleRadiusPx}"/>
      <circle class="bridge-circle" cx="${geometry.centerX}" cy="${geometry.circleY}" r="${geometry.circleRadiusPx}"/>
      <line class="radius-half radius-half-left" x1="${geometry.circleLeft}" y1="${geometry.circleY}" x2="${geometry.centerX}" y2="${geometry.circleY}"/>
      <line class="radius-half radius-half-right" x1="${geometry.centerX}" y1="${geometry.circleY}" x2="${geometry.circleRight}" y2="${geometry.circleY}"/>
      <circle class="bridge-center" cx="${geometry.centerX}" cy="${geometry.circleY}" r="8"/>
      <circle class="bridge-end" cx="${geometry.circleLeft}" cy="${geometry.circleY}" r="7"/>
      <circle class="bridge-end" cx="${geometry.circleRight}" cy="${geometry.circleY}" r="7"/>
      ${relationMarkup}
    </g>
    <g class="bridge-target">
      <line class="target-projection" x1="${geometry.targetStart}" y1="${geometry.circleY + 10}" x2="${geometry.targetStart}" y2="264"/>
      <line class="target-projection" x1="${geometry.targetEnd}" y1="${geometry.circleY + 10}" x2="${geometry.targetEnd}" y2="264"/>
      <path class="bridge-pier" d="M ${geometry.targetStart - 12} 268 L ${geometry.targetStart + 12} 268 L ${geometry.targetStart + 8} 232 L ${geometry.targetStart - 8} 232 Z"/>
      <path class="bridge-pier" d="M ${geometry.targetEnd - 12} 268 L ${geometry.targetEnd + 12} 268 L ${geometry.targetEnd + 8} 232 L ${geometry.targetEnd - 8} 232 Z"/>
      ${installed}
      ${fitGeometry ? bridgeDifferenceMarkup(fitGeometry, geometry) : ""}
    </g>
    <text class="bridge-equation" x="380" y="322" text-anchor="middle">${equation}</text>
  `;
}
