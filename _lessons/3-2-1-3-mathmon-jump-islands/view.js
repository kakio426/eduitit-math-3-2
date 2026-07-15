function renderProblemVisual(problem, state) {
  ui.visualArea.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "jump-visual";

  const map = document.createElement("div");
  map.className = "jump-map";
  map.setAttribute("aria-label", "점프섬 지도");

  const mapImage = document.createElement("img");
  mapImage.src = "play-map-strip-generated.webp";
  mapImage.alt = "";
  mapImage.setAttribute("aria-hidden", "true");
  map.appendChild(mapImage);

  const marker = document.createElement("img");
  marker.className = "jump-marker";
  marker.src = "mathmon-zfa-04-nyangnyangmon.webp";
  marker.alt = "";
  marker.setAttribute("aria-hidden", "true");
  map.appendChild(marker);

  const chips = document.createElement("div");
  chips.className = "jump-islands";
  for (const result of LESSON_CONFIG.results) {
    const chip = document.createElement("span");
    chip.className = "jump-island-chip";
    chip.textContent = result.name;
    chip.dataset.island = result.id;
    chips.appendChild(chip);
  }
  map.appendChild(chips);

  const board = document.createElement("div");
  board.className = "jump-board";

  const expression = document.createElement("strong");
  expression.className = "jump-expression";
  expression.textContent = problem.prompt;
  board.appendChild(expression);

  const transform = document.createElement("div");
  transform.className = "jump-transform";
  transform.textContent = problem.steps[state.stepIndex]?.preview || problem.smallExpression;
  board.appendChild(transform);

  const note = document.createElement("p");
  note.className = "jump-note";
  note.textContent = problem.type === "hundredfold"
    ? "양쪽에서 0을 하나씩 가렸어요."
    : "한쪽의 0을 하나 가렸어요.";
  board.appendChild(note);

  wrap.append(map, board);
  ui.visualArea.appendChild(wrap);
  syncJumpMap(state);
}

function updateProblemVisualForStep(problem, step, state) {
  const transform = ui.visualArea.querySelector(".jump-transform");
  if (transform) transform.textContent = step.preview;
  const note = ui.visualArea.querySelector(".jump-note");
  if (note) {
    note.textContent = step.id === "smallProduct"
      ? "먼저 작은 곱셈을 골라요."
      : "처음에 가린 0을 다시 붙여요.";
  }
  syncJumpMap(state);
}

function revealCorrectStep(problem, step, state) {
  const transform = ui.visualArea.querySelector(".jump-transform");
  if (!transform) return;
  transform.textContent = step.id === "scaleFooting" ? problem.finalExpression : step.reveal;
  transform.classList.remove("is-step-confirmed");
  void transform.offsetWidth;
  transform.classList.add("is-step-confirmed");
  syncJumpMap(state);
}

function syncJumpMap(state) {
  const marker = ui.visualArea.querySelector(".jump-marker");
  const chips = [...ui.visualArea.querySelectorAll(".jump-island-chip")];
  if (!marker || chips.length === 0) return;
  const currentIndex = getCurrentIslandIndex(state.power);
  const percent = chips.length === 1 ? 50 : 8 + (currentIndex / (chips.length - 1)) * 84;
  marker.style.left = `${percent}%`;
  chips.forEach((chip, index) => {
    chip.classList.toggle("is-reached", index <= currentIndex);
    chip.classList.toggle("is-current", index === currentIndex);
  });
}

function getCurrentIslandIndex(power) {
  let index = 0;
  for (let resultIndex = 0; resultIndex < LESSON_CONFIG.results.length; resultIndex += 1) {
    if (power >= LESSON_CONFIG.results[resultIndex].minPower) index = resultIndex;
  }
  return index;
}
