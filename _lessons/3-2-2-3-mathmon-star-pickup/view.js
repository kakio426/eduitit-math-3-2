const STAR_SVG_NS = "http://www.w3.org/2000/svg";
const STAR_GROUP_COLUMNS = 8;
const CONSTELLATION_SPARKS = {
  "first-star": [[32, 19]],
  "star-cluster": [[28, 19], [36, 23], [42, 22], [27, 27], [42, 27]],
  "star-path": [[28, 19], [36, 23], [42, 22], [27, 27], [42, 27], [42, 32], [37, 38], [31, 40], [29, 44], [34, 48], [43, 45], [46, 38]],
  "unicorn-constellation": [
    [25, 15], [32, 20], [29, 25], [39, 23], [46, 28], [42, 34], [34, 35], [28, 32],
    [25, 38], [21, 42], [23, 47], [31, 45], [42, 47], [49, 51], [61, 50], [73, 49],
    [79, 54], [73, 57], [75, 62], [70, 66], [64, 66], [60, 59], [52, 58], [49, 64],
    [43, 64], [42, 57], [33, 54], [27, 57], [23, 53]
  ],
  "shining-unicorn": [
    [25, 15], [32, 20], [29, 25], [39, 23], [46, 28], [42, 34], [34, 35], [28, 32],
    [25, 38], [21, 42], [23, 47], [31, 45], [42, 47], [49, 51], [61, 50], [73, 49],
    [79, 54], [73, 57], [75, 62], [70, 66], [64, 66], [60, 59], [52, 58], [49, 64],
    [43, 64], [42, 57], [33, 54], [27, 57], [23, 53]
  ],
  "rainbow-unicorn": [
    [25, 15], [32, 20], [29, 25], [39, 23], [46, 28], [42, 34], [34, 35], [28, 32],
    [25, 38], [21, 42], [23, 47], [31, 45], [42, 47], [49, 51], [61, 50], [73, 49],
    [79, 54], [73, 57], [75, 62], [70, 66], [64, 66], [60, 59], [52, 58], [49, 64],
    [43, 64], [42, 57], [33, 54], [27, 57], [23, 53]
  ]
};

function ensureStarStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;

  if (!playScreen.querySelector(".star-stage-art")) {
    const image = document.createElement("img");
    image.className = "star-stage-art";
    image.src = LESSON_CONFIG.imageAssets.problemStage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    playScreen.prepend(image);
  }

  if (!playScreen.querySelector(".star-world-panel")) {
    const panel = document.createElement("aside");
    panel.className = "star-world-panel";
    panel.id = "starWorldPanel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <img class="star-world-image" id="starWorldImage" alt="" aria-hidden="true">
      <img class="star-world-flare-image" id="starWorldFlareImage" alt="" aria-hidden="true">
      <span class="constellation-spark-layer" id="constellationSparkLayer" aria-hidden="true"></span>
      <span class="visually-hidden" id="starWorldStatus"></span>
    `;
    playScreen.appendChild(panel);
  }

  if (!playScreen.querySelector(".star-flight-layer")) {
    const layer = document.createElement("div");
    layer.className = "star-flight-layer";
    layer.id = "starFlightLayer";
    layer.setAttribute("aria-hidden", "true");
    playScreen.appendChild(layer);
  }
}

function getStarWorldResult(state) {
  return LessonModel.getResult(state.power, state.correctFirstTry, state.specialSeen);
}

function syncStarWorld(state, options = {}) {
  ensureStarStageArt();
  const panel = document.getElementById("starWorldPanel");
  const image = document.getElementById("starWorldImage");
  const flareImage = document.getElementById("starWorldFlareImage");
  const sparkLayer = document.getElementById("constellationSparkLayer");
  const status = document.getElementById("starWorldStatus");
  if (!panel || !image || !flareImage || !sparkLayer || !status) return Promise.resolve();

  const result = getStarWorldResult(state);
  const previousTier = panel.dataset.resultTier;
  panel.dataset.resultTier = result.id;
  status.textContent = `지금 별자리는 ${result.name}이에요.`;
  panel.setAttribute("aria-label", status.textContent);

  const nextSrc = result.playImage || LESSON_CONFIG.results[0]?.playImage || "";
  const changed = image.getAttribute("src") !== nextSrc;
  if (changed) {
    panel.classList.remove("is-changing", "is-dimming", "is-star-lighting");
    void panel.offsetWidth;
    image.src = nextSrc;
    flareImage.src = nextSrc;
    panel.classList.add(options.delta < 0 ? "is-dimming" : "is-changing");
  }

  const sparkPoints = CONSTELLATION_SPARKS[result.id] || CONSTELLATION_SPARKS["first-star"];
  sparkLayer.replaceChildren(...sparkPoints.map(([left, top], index) => {
    const spark = document.createElement("i");
    spark.className = "constellation-spark";
    spark.style.left = `${left}%`;
    spark.style.top = `${top}%`;
    spark.style.setProperty("--spark-delay", `${Math.min(index * 42, 720)}ms`);
    spark.style.setProperty("--spark-hue", `${index * 19}deg`);
    return spark;
  }));

  const lightStars = options.delta >= 0 && (options.celebrate || (changed && Boolean(previousTier)));
  if (lightStars) {
    panel.classList.remove("is-star-lighting");
    void panel.offsetWidth;
    panel.classList.add("is-star-lighting");
  }
  if (options.celebrate) panel.classList.add("is-celebrating");

  const settle = () => {
    panel.classList.remove("is-changing", "is-dimming", "is-celebrating", "is-star-lighting");
  };
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : (lightStars ? 1550 : 520);
  return new Promise((resolve) => {
    setTimeout(() => {
      settle();
      resolve();
    }, duration);
  });
}

function renderProblemVisual(problem, state) {
  ensureStarStageArt();
  ui.visualArea.dataset.proofChoice = "";
  ui.visualArea.dataset.proofStep = "";
  ui.visualArea.dataset.revealedStep = "";
  renderStarMathBoard(problem, state);
  syncStarWorld(state);
  syncStarJourneyHud(state);
}

function syncStarJourneyHud(state) {
  const count = `${Math.min(state.problemIndex + 1, LessonModel.TOTAL_PROBLEMS)}/${LessonModel.TOTAL_PROBLEMS}`;
  ui.questionCount.textContent = count;
  ui.questionCount.setAttribute("aria-label", `${state.problemIndex + 1}번째 문제`);
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

function renderAttempt(problem, step, selected, state) {
  ui.visualArea.dataset.proofStep = step.id;
  ui.visualArea.dataset.proofChoice = String(selected.value);
  renderStarMathBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  ui.choices.dataset.interaction = step.id === "quotient" ? "choose-bundle-count" : "count-leftover-stars";

  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `choice-button star-choice ${step.id === "quotient" ? "star-quotient-choice" : "star-remainder-choice"}`;
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    button.dataset.relation = selected.relation || "";
    if (selected.misconceptionId) button.dataset.misconception = selected.misconceptionId;
    if (Number.isFinite(selected.product)) button.dataset.product = String(selected.product);

    const primary = document.createElement("strong");
    const secondary = document.createElement("span");
    if (step.id === "quotient") {
      primary.textContent = String(selected.value);
      secondary.textContent = "묶음";
      button.setAttribute("aria-label", `${selected.value}묶음`);
    } else {
      primary.textContent = `${selected.value}개`;
      secondary.textContent = "남은 별";
      button.setAttribute("aria-label", `남은 별 ${selected.value}개`);
    }
    button.append(primary, secondary);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function onStepCorrect() {
  return glowStarScene("correct");
}

function onStepWrong() {
  return glowStarScene("wrong");
}

async function onProblemComplete({ problem, state }) {
  await glowStarScene("complete");
  if (!state.mistakeTouched && problem.remainder > 0) {
    await animateRemainderToJar(problem.remainder);
  }
}

async function onRewardReveal({ event, beforePower, afterPower, state }) {
  const actualDelta = afterPower - beforePower;
  event.amount = actualDelta;
  await Promise.all([
    glowStarScene("reward"),
    syncStarWorld(state, { celebrate: actualDelta > 0, delta: actualDelta })
  ]);
}

function onResult({ result, power }) {
  if (ui.resultMeasureSvg) {
    ui.resultMeasureSvg.textContent = `모은 별빛 ${power}`;
  }
  if (result?.needsSpecial) {
    const completeText = "모든 별자리를 밝혔어요!";
    if (ui.resultNextSvg) ui.resultNextSvg.textContent = completeText;
    if (ui.resultNext) ui.resultNext.textContent = completeText;
  }
}

function glowStarScene(sceneState) {
  const art = document.querySelector(".star-stage-art");
  if (!art) return Promise.resolve();
  art.dataset.sceneState = sceneState;
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 320;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function animateRemainderToJar(count) {
  const layer = document.getElementById("starFlightLayer");
  const panel = document.getElementById("starWorldPanel");
  const originNode = document.querySelector(".star-remainder-focus") || ui.visualArea;
  const stage = document.querySelector(".stage-shell");
  if (!layer || !panel || !originNode || !stage) return Promise.resolve();

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  panel.classList.add("is-collecting");
  if (reduceMotion) {
    return new Promise((resolve) => setTimeout(() => {
      panel.classList.remove("is-collecting");
      resolve();
    }, 160));
  }

  const stageRect = stage.getBoundingClientRect();
  const originRect = originNode.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const fromX = originRect.left + originRect.width * 0.5 - stageRect.left;
  const fromY = originRect.top + originRect.height * 0.52 - stageRect.top;
  const toX = panelRect.left + panelRect.width * 0.68 - stageRect.left;
  const toY = panelRect.top + panelRect.height * 0.82 - stageRect.top;
  layer.replaceChildren();

  for (let index = 0; index < count; index += 1) {
    const star = document.createElement("span");
    star.className = "star-flight-particle";
    star.textContent = "★";
    star.style.left = `${fromX + (index - (count - 1) / 2) * 13}px`;
    star.style.top = `${fromY + (index % 2) * 8}px`;
    star.style.setProperty("--flight-x", `${toX - fromX}px`);
    star.style.setProperty("--flight-y", `${toY - fromY}px`);
    star.style.setProperty("--flight-delay", `${index * 55}ms`);
    layer.appendChild(star);
  }

  const duration = 660 + count * 55;
  return new Promise((resolve) => setTimeout(() => {
    layer.replaceChildren();
    panel.classList.remove("is-collecting");
    resolve();
  }, duration));
}

function renderStarMathBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const proofStep = ui.visualArea.dataset.proofStep;
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const rawChoice = ui.visualArea.dataset.proofChoice;
  const hasChoice = rawChoice !== "";
  const selectedValue = hasChoice ? Number(rawChoice) : Number.NaN;
  const svg = createStarSvg(problem, step);

  if (step.id === "quotient" && !hasChoice && revealedStep !== "quotient") {
    svg.insertAdjacentHTML("beforeend", renderLooseStarGrid(problem.dividend));
  } else if (step.id === "quotient") {
    const shown = Number.isFinite(selectedValue) ? selectedValue : problem.quotient;
    svg.insertAdjacentHTML("beforeend", renderGroupedStars(problem, shown));
  } else {
    const hasRemainderChoice = proofStep === "remainder" && Number.isFinite(selectedValue);
    const shown = hasRemainderChoice ? selectedValue : 0;
    svg.insertAdjacentHTML("beforeend", renderRemainderBoard(problem, shown, proofStep === "remainder", revealedStep === "remainder"));
  }
  ui.visualArea.replaceChildren(svg);
}

function createStarSvg(problem, step) {
  const svg = document.createElementNS(STAR_SVG_NS, "svg");
  svg.classList.add("star-math-svg");
  svg.setAttribute("viewBox", "0 0 880 350");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `<rect class="star-board-surface" x="4" y="4" width="872" height="342" rx="28" />`;
  return svg;
}

function renderLooseStarGrid(count) {
  const columns = count > 80 ? 11 : 10;
  const rows = Math.ceil(count / columns);
  const density = rows >= 8 ? "dense" : rows === 7 ? "medium" : "comfortable";
  const gapX = columns === 11 ? 58 : 64;
  const maxGapY = density === "comfortable" ? 46 : density === "medium" ? 36 : 29;
  const gapY = rows <= 1 ? 0 : Math.min(maxGapY, 230 / (rows - 1));
  const startX = 510 - ((columns - 1) * gapX) / 2;
  const startY = 184 - ((rows - 1) * gapY) / 2;
  const radius = density === "comfortable" ? 14 : density === "medium" ? 12 : 10;
  const stars = Array.from({ length: count }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    return renderStarGlyph(startX + column * gapX, startY + row * gapY, radius, "loose");
  }).join("");
  return `
    <g class="star-loose-grid" data-density="${density}" data-columns="${columns}">
      <rect class="star-count-chip" x="34" y="22" width="112" height="42" rx="21" />
      <text class="star-count-text" x="90" y="51">${count}개</text>
      ${stars}
    </g>
  `;
}

function renderGroupedStars(problem, selectedQuotient) {
  const relation = selectedQuotient < problem.quotient
    ? "too-low"
    : selectedQuotient > problem.quotient
      ? "too-high"
      : "fit";
  const capsules = [];
  for (let index = 0; index < selectedQuotient; index += 1) {
    const isShortage = relation === "too-high" && index === selectedQuotient - 1;
    capsules.push({
      filled: isShortage ? problem.remainder : problem.divisor,
      missing: isShortage ? problem.divisor - problem.remainder : 0,
      state: isShortage ? "shortage" : "full"
    });
  }

  const gapX = 8;
  const gapY = 7;
  const width = 72;
  const height = 45;
  const startY = 65;
  const capsuleMarkup = capsules.map((capsule, index) => {
    const point = getCenteredGridPoint(index, capsules.length, {
      columns: STAR_GROUP_COLUMNS,
      centerX: 350,
      startY,
      width,
      height,
      gapX,
      gapY
    });
    return renderGroupCapsule(
      point.x,
      point.y,
      width,
      height,
      problem.divisor,
      capsule.filled,
      capsule.missing,
      capsule.state
    );
  }).join("");

  const remaining = relation === "too-low"
    ? problem.dividend - selectedQuotient * problem.divisor
    : relation === "fit"
      ? problem.remainder
      : 0;
  const missing = relation === "too-high" ? problem.divisor - problem.remainder : 0;
  const sideTitle = relation === "too-high" ? "부족한 별" : "남은 별";
  const sideValue = relation === "too-high" ? `${missing}개` : `${remaining}개`;

  return `
    <g class="star-group-board" data-relation="${relation}">
      <text class="star-group-summary" x="350" y="38">${problem.divisor}개씩 ${selectedQuotient}묶음</text>
      <g class="star-capsule-grid">${capsuleMarkup}</g>
      ${renderSideStarPanel(problem, remaining, missing, relation, sideTitle, sideValue)}
    </g>
  `;
}

function renderSideStarPanel(problem, remaining, missing, relation, title, value) {
  const showEvidence = relation !== "fit";
  const visibleCount = showEvidence ? relation === "too-high" ? missing : remaining : 0;
  const showValue = showEvidence;
  const maxColumns = 4;
  const starMarkup = Array.from({ length: visibleCount }, (_, index) => {
    const column = index % maxColumns;
    const row = Math.floor(index / maxColumns);
    const tone = relation === "too-high" ? "missing" : "remaining";
    return renderStarGlyph(713 + column * 34, 146 + row * 34, 9, tone);
  }).join("");
  const groupFrame = relation === "too-low" && remaining >= problem.divisor
    ? renderDottedGroupFrame(problem.divisor, 713, 146, 34, 4)
    : "";
  return `
    <g class="star-side-panel ${relation === "fit" ? "star-remainder-focus" : ""}">
      <rect class="star-side-surface" x="686" y="60" width="170" height="250" rx="24" />
      <text class="star-side-title" x="771" y="96">${title}</text>
      ${showValue ? `<text class="star-side-value" x="771" y="132">${value}</text>` : ""}
      ${starMarkup}
      ${groupFrame}
    </g>
  `;
}

function renderRemainderBoard(problem, selectedCount, isProof, isRevealed) {
  const isRoomyCapsuleGrid = problem.quotient <= 16;
  const capsuleColumns = isRoomyCapsuleGrid ? 4 : STAR_GROUP_COLUMNS;
  const width = isRoomyCapsuleGrid ? 126 : 63;
  const height = isRoomyCapsuleGrid ? 58 : 44;
  const gapX = isRoomyCapsuleGrid ? 12 : 5;
  const gapY = isRoomyCapsuleGrid ? 10 : 8;
  const capsuleRows = Math.ceil(problem.quotient / capsuleColumns);
  const capsuleGridHeight = capsuleRows * height + Math.max(0, capsuleRows - 1) * gapY;
  const capsuleAreaTop = 80;
  const capsuleAreaHeight = 262;
  const startY = capsuleAreaTop + Math.max(0, (capsuleAreaHeight - capsuleGridHeight) / 2);
  const capsuleState = isRoomyCapsuleGrid ? "roomy" : "compact";
  const capsules = Array.from({ length: problem.quotient }, (_, index) => {
    const point = getCenteredGridPoint(index, problem.quotient, {
      columns: capsuleColumns,
      centerX: 300,
      startY,
      width,
      height,
      gapX,
      gapY
    });
    return renderGroupCapsule(
      point.x,
      point.y,
      width,
      height,
      problem.divisor,
      problem.divisor,
      0,
      capsuleState
    );
  }).join("");

  const target = problem.remainder;
  const showRemainderEvidence = isProof || isRevealed;
  const visibleSlots = showRemainderEvidence ? Math.max(selectedCount, target) : 0;
  const showRemainderCount = showRemainderEvidence;
  const remainderColumns = visibleSlots > 12 ? 4 : 3;
  const remainderRows = Math.ceil(visibleSlots / remainderColumns);
  const remainderGapX = remainderColumns === 4 ? 38 : 48;
  const remainderGapY = remainderRows <= 1 ? 0 : Math.min(46, 120 / (remainderRows - 1));
  const remainderStartY = showRemainderCount
    ? remainderRows <= 1 ? 176 : 166
    : remainderRows <= 1 ? 154 : 146;
  const starPoints = Array.from({ length: visibleSlots }, (_, index) => getCenteredPoint(index, visibleSlots, {
    columns: remainderColumns,
    centerX: 729,
    startY: remainderStartY,
    gapX: remainderGapX,
    gapY: remainderGapY
  }));
  const stars = starPoints.map((point, index) => {
    const tone = index < selectedCount
      ? index < target ? "remaining" : "extra"
      : "missing";
    return renderStarGlyph(point.x, point.y, 13, tone);
  }).join("");
  const groupFrame = isProof && selectedCount >= problem.divisor
    ? renderDottedPointFrame(starPoints.slice(0, problem.divisor))
    : "";

  return `
    <g class="star-remainder-board" data-proof="${isProof ? "true" : "false"}" data-revealed="${isRevealed ? "true" : "false"}" data-count-visible="${showRemainderCount ? "true" : "false"}">
      <text class="star-group-summary" x="300" y="52">${problem.divisor}×${problem.quotient}=${problem.grouped}</text>
      <g class="star-capsule-grid ${isRoomyCapsuleGrid ? "is-roomy" : "is-compact"}" data-columns="${capsuleColumns}">${capsules}</g>
      <g class="star-remainder-focus">
        <rect class="star-side-surface is-focus" x="614" y="56" width="230" height="260" rx="28" />
        <text class="star-side-title" x="729" y="88">남은 별</text>
        ${showRemainderCount ? `<text class="star-side-value" x="729" y="128">${selectedCount}개</text>` : ""}
        ${stars}
        ${groupFrame}
        ${isRevealed ? '<text class="star-check-mark" x="806" y="294">✓</text>' : ""}
      </g>
    </g>
  `;
}

function getCenteredGridPoint(index, total, layout) {
  const row = Math.floor(index / layout.columns);
  const column = index % layout.columns;
  const rowCount = Math.min(layout.columns, total - row * layout.columns);
  const rowWidth = rowCount * layout.width + Math.max(0, rowCount - 1) * layout.gapX;
  const rowStartX = layout.centerX - rowWidth / 2;
  return {
    x: rowStartX + column * (layout.width + layout.gapX),
    y: layout.startY + row * (layout.height + layout.gapY)
  };
}

function getCenteredPoint(index, total, layout) {
  const row = Math.floor(index / layout.columns);
  const column = index % layout.columns;
  const rowCount = Math.min(layout.columns, total - row * layout.columns);
  const rowStartX = layout.centerX - ((rowCount - 1) * layout.gapX) / 2;
  return {
    x: rowStartX + column * layout.gapX,
    y: layout.startY + row * layout.gapY
  };
}

function renderDottedPointFrame(points) {
  if (!points.length) return "";
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  const minX = Math.min(...xs) - 17;
  const maxX = Math.max(...xs) + 17;
  const minY = Math.min(...ys) - 17;
  const maxY = Math.max(...ys) + 17;
  return `<rect class="star-next-group" x="${minX}" y="${minY}" width="${maxX - minX}" height="${maxY - minY}" rx="17" />`;
}

function renderGroupCapsule(x, y, width, height, divisor, filled, missing, stateName) {
  const isRoomy = stateName === "roomy";
  const columns = divisor <= 4 ? divisor : 3;
  const rows = Math.ceil(divisor / columns);
  const gapX = Math.min(isRoomy ? 21 : 13, (width - 20) / Math.max(columns - 1, 1));
  const gapY = rows <= 1 ? 0 : Math.min(isRoomy ? 14 : 11, (height - 18) / (rows - 1));
  const startX = x + width / 2 - ((columns - 1) * gapX) / 2;
  const startY = y + height / 2 - ((rows - 1) * gapY) / 2;
  const slots = Array.from({ length: divisor }, (_, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const slotX = startX + column * gapX;
    const slotY = startY + row * gapY;
    const isFilled = index < filled;
    const tone = isFilled ? "capsule" : "missing-slot";
    const radius = isRoomy ? 5.5 : stateName === "compact" ? 3.8 : 4;
    return renderStarGlyph(slotX, slotY, radius, tone);
  }).join("");
  return `
    <g class="star-capsule" data-state="${stateName}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" />
      ${slots}
    </g>
  `;
}

function renderDottedGroupFrame(count, startX, startY, gap, columns) {
  const usedColumns = Math.min(columns, count);
  const rows = Math.ceil(count / columns);
  const width = (usedColumns - 1) * gap + 30;
  const height = (rows - 1) * gap + 30;
  return `<rect class="star-next-group" x="${startX - 15}" y="${startY - 15}" width="${width}" height="${height}" rx="15" />`;
}

function renderStarGlyph(x, y, radius, tone) {
  return `
    <g class="star-glyph" data-tone="${tone}" transform="translate(${x} ${y})">
      <circle r="${radius}" />
      <text y="${Math.max(3, radius * 0.38)}">★</text>
    </g>
  `;
}

function makeStarQaProblem(dividend = 47, divisor = 6) {
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  if (dividend < 20 || dividend > 99 || divisor < 3 || divisor > 9 || remainder <= 0) {
    throw new Error("QA problem must be 20–99 divided by 3–9 with a nonzero remainder.");
  }
  const quotientChoice = (value, relation, misconceptionId, feedback) => ({
    id: `quotient:${value}`,
    value,
    label: `${value}묶음`,
    product: divisor * value,
    relation,
    misconceptionId,
    feedback
  });
  const remainderChoice = (value, relation, misconceptionId, feedback) => ({
    id: `remainder:${value}`,
    value,
    label: `${value}개`,
    relation,
    misconceptionId,
    feedback
  });
  return {
    id: `qa-${dividend}-by-${divisor}`,
    dividend,
    divisor,
    quotient,
    remainder,
    grouped: divisor * quotient,
    prompt: `${dividend} ÷ ${divisor}`,
    finalExpression: `${divisor}×${quotient}+${remainder}=${dividend}`,
    steps: [
      {
        id: "quotient",
        label: "몫",
        instruction: `별 ${dividend}개를 ${divisor}개씩 묶으면 몇 묶음까지 만들 수 있을까요?`,
        answer: quotient,
        answerChoiceId: `quotient:${quotient}`,
        choices: [
          quotientChoice(quotient - 1, "too-small", "DIV3_QUOTIENT_TOO_LOW", "한 묶음을 더 만들 수 있어요."),
          quotientChoice(quotient, "fit", null, ""),
          quotientChoice(quotient + 1, "too-high", "DIV3_QUOTIENT_TOO_HIGH", `별 ${divisor - remainder}개가 모자라요.`)
        ],
        correctText: `${divisor}개씩 ${quotient}묶음, ${divisor * quotient}개예요.`,
        reveal: `${quotient}묶음`,
        advance: { mode: "timed", delayMs: 1200 }
      },
      {
        id: "remainder",
        label: "남은 별",
        instruction: "묶고 남은 별을 세어 봐요.",
        answer: remainder,
        answerChoiceId: `remainder:${remainder}`,
        choices: [
          remainderChoice(remainder, "fit", null, ""),
          remainderChoice(divisor, "equals-divisor", "DIV3_REMAINDER_EQUALS_DIVISOR", `${divisor}개면 한 묶음이에요.`),
          remainderChoice(remainder + divisor, "has-full-group", "DIV3_REMAINDER_NOT_LESS_THAN_DIVISOR", `${divisor}개를 묶고 다시 봐요.`),
          remainderChoice(Math.max(0, remainder - 1), "count-off", "DIV3_LEFTOVER_COUNT_OFF_BY_ONE", "밝은 별을 다시 세어 봐요.")
        ],
        correctText: `${remainder}개가 남았어요.`,
        reveal: `${remainder}개`,
        advance: { mode: "complete" }
      }
    ]
  };
}

window.__starPickupQa = {
  forceProblem(dividend = 47, divisor = 6, stepIndex = 0) {
    const problem = makeStarQaProblem(dividend, divisor);
    state.problems[state.problemIndex] = problem;
    state.completed = false;
    state.currentResult = null;
    renderProblem();
    if (stepIndex > 0) {
      state.stepIndex = Math.min(stepIndex, problem.steps.length - 1);
      state.pendingAdvance = false;
      state.inputLocked = false;
      renderStep();
    }
    return problem;
  },
  forcePlayTier(resultId) {
    const result = LESSON_CONFIG.results.find((item) => item.id === resultId);
    if (!result) throw new Error(`Unknown result tier: ${resultId}`);
    state.power = result.minPower;
    state.correctFirstTry = result.minCorrect;
    state.specialSeen = Boolean(result.needsSpecial);
    state.currentResult = null;
    syncStarWorld(state, { celebrate: true });
    return result;
  },
  forceResult(resultId) {
    const result = LESSON_CONFIG.results.find((item) => item.id === resultId);
    if (!result) throw new Error(`Unknown result tier: ${resultId}`);
    state.power = result.minPower;
    state.correctFirstTry = result.minCorrect;
    state.specialSeen = Boolean(result.needsSpecial);
    state.currentResult = null;
    showResult();
    return result;
  },
  getSnapshot() {
    return {
      problem: state.problems[state.problemIndex] || null,
      result: getStarWorldResult(state),
      worldImage: document.getElementById("starWorldImage")?.getAttribute("src") || ""
    };
  }
};
