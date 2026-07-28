let unit6RewardStage = null;

function unit6Create(tag, className, text = "") {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== "") node.textContent = text;
  return node;
}

function unit6RenderMarks(container, count, mark, color, small = false) {
  for (let index = 0; index < count; index += 1) {
    const item = unit6Create("span", `unit6-mark${small ? " is-small" : ""}`, mark);
    item.style.setProperty("--mark-color", color);
    item.dataset.index = String(index + 1);
    container.append(item);
  }
}

function renderCensusBoard(problem) {
  const board = unit6Create("div", "unit6-board census-board");
  board.dataset.targetId = problem.visual.targetId;
  const items = unit6Create("div", "census-items");
  const table = unit6Create("div", "census-table");
  problem.visual.rows.forEach((row) => {
    const itemRow = unit6Create("div", "census-item-row");
    itemRow.dataset.rowId = row.id;
    if (row.id === problem.visual.targetId) itemRow.classList.add("is-target");
    itemRow.append(unit6Create("span", "unit6-row-label", row.label));
    const marks = unit6Create("div", "unit6-marks");
    unit6RenderMarks(marks, row.count, row.mark, row.color, true);
    itemRow.append(marks);
    items.append(itemRow);

    const tableRow = unit6Create("div", "census-table-row");
    tableRow.dataset.rowId = row.id;
    tableRow.append(unit6Create("span", "unit6-table-label", row.label));
    const value = unit6Create("span", "unit6-table-value", row.id === problem.visual.targetId ? "?" : `${row.count}`);
    value.dataset.valueCell = row.id;
    tableRow.append(value);
    table.append(tableRow);
  });
  board.append(items, table);
  return board;
}

function renderDecoderBoard(problem) {
  const { unit, iconCount } = problem.visual;
  const board = unit6Create("div", "unit6-board decoder-board");
  const key = unit6Create("div", "decoder-key");
  key.append(unit6Create("span", "decoder-icon", "◆"), unit6Create("strong", "", `= ${unit}`));
  const icons = unit6Create("div", "decoder-icons");
  for (let index = 0; index < iconCount; index += 1) {
    const group = unit6Create("div", "decoder-group");
    group.append(unit6Create("span", "decoder-icon", "◆"), unit6Create("small", "", `${unit}`));
    icons.append(group);
  }
  const total = unit6Create("div", "decoder-total", `${unit} + `.repeat(Math.max(0, iconCount - 1)) + `${unit} = ?`);
  total.dataset.totalSlot = "true";
  board.append(key, icons, total);
  return board;
}

function renderStampBoard(problem) {
  const board = unit6Create("div", "unit6-board stamp-board");
  board.dataset.bigCount = String(problem.visual.big);
  board.dataset.smallCount = String(problem.visual.small);
  const target = unit6Create("div", "stamp-target");
  target.append(unit6Create("span", "", "나타낼 수"), unit6Create("strong", "", `${problem.visual.value}`));
  const work = unit6Create("div", "stamp-work");
  const big = unit6Create("div", "stamp-group");
  big.dataset.stampGroup = "big";
  big.append(unit6Create("span", "stamp-label", "큰 도장 ×10"), unit6Create("div", "stamp-slots"));
  const small = unit6Create("div", "stamp-group");
  small.dataset.stampGroup = "small";
  small.append(unit6Create("span", "stamp-label", "작은 도장 ×1"), unit6Create("div", "stamp-slots"));
  const equation = unit6Create("div", "stamp-equation", "?×10 + ?×1 = ?");
  equation.dataset.stampEquation = "true";
  work.append(big, small);
  board.append(target, work, equation);
  return board;
}

function renderDetectiveBoard(problem) {
  const board = unit6Create("div", "unit6-board detective-board");
  const key = unit6Create("div", "detective-key", `그림 하나 = ${problem.visual.unit}`);
  const rows = unit6Create("div", "detective-rows");
  problem.visual.rows.forEach((row) => {
    const item = unit6Create("div", "detective-row");
    item.dataset.rowId = row.id;
    item.append(unit6Create("span", "unit6-row-label", row.label));
    const marks = unit6Create("div", "unit6-marks");
    unit6RenderMarks(marks, row.iconCount, "●", "#7cd7ff", true);
    item.append(marks);
    const value = unit6Create("span", "detective-value", "?");
    value.dataset.rowValue = row.id;
    item.append(value);
    rows.append(item);
  });
  const relation = unit6Create("div", "detective-relation");
  relation.dataset.detectiveRelation = "true";
  board.append(key, rows, relation);
  return board;
}

function renderProblemVisual(problem) {
  ui.visualArea.innerHTML = "";
  let board;
  if (problem.visual.kind === "census") board = renderCensusBoard(problem);
  if (problem.visual.kind === "decoder") board = renderDecoderBoard(problem);
  if (problem.visual.kind === "stamp") board = renderStampBoard(problem);
  if (problem.visual.kind === "detective") board = renderDetectiveBoard(problem);
  if (board) ui.visualArea.append(board);
}

function updateProblemVisualForStep(problem, step) {
  ui.visualArea.dataset.step = step.id;
  ui.visualArea.dataset.state = "waiting";
  ui.visualArea.querySelectorAll(".is-picked-wrong").forEach((node) => node.classList.remove("is-picked-wrong"));
  document.querySelector(".unit6-step-next")?.remove();
  if (problem.visual.kind === "stamp") {
    ui.visualArea.querySelectorAll(".stamp-group").forEach((group) => {
      group.classList.toggle("is-current", group.dataset.stampGroup === (step.id === "big-stamps" ? "big" : "small"));
    });
  }
}

function renderAttempt(problem, step, choice, currentState, outcome) {
  ui.visualArea.dataset.state = outcome.correct ? "correct" : "wrong";
  ui.visualArea.dataset.attemptValue = String(choice.value);
  if (outcome.correct) return;
  if (problem.visual.kind === "census") {
    const target = problem.visual.rows.find((row) => row.id === problem.visual.targetId);
    const marksContainer = ui.visualArea.querySelector(".census-item-row.is-target .unit6-marks");
    marksContainer?.querySelectorAll(".is-extra-attempt").forEach((mark) => mark.remove());
    const marks = [...ui.visualArea.querySelectorAll(".census-item-row.is-target .unit6-mark")];
    const picked = Number(choice.value);
    marks.forEach((mark, index) => {
      mark.classList.toggle("is-picked-wrong", picked < target.count && index >= picked);
    });
    if (picked > target.count && marksContainer) {
      for (let index = target.count; index < picked; index += 1) {
        const extra = unit6Create(
          "span",
          "unit6-mark is-small is-picked-wrong is-extra-attempt",
          target.mark,
        );
        extra.style.setProperty("--mark-color", target.color);
        marksContainer.append(extra);
      }
    }
  }
  if (problem.visual.kind === "decoder") {
    const total = ui.visualArea.querySelector("[data-total-slot]");
    if (total) {
      total.textContent = `${problem.visual.unit} × ${problem.visual.iconCount} ≠ ${choice.value}`;
      total.classList.add("is-attempt-wrong");
    }
  }
  if (problem.visual.kind === "stamp") {
    const groupName = step.id === "big-stamps" ? "big" : "small";
    const slots = ui.visualArea.querySelector(`[data-stamp-group="${groupName}"] .stamp-slots`);
    const count = Math.max(0, Number(choice.value) || 0);
    if (slots) {
      slots.innerHTML = "";
      for (let index = 0; index < count; index += 1) {
        const mark = unit6Create(
          "span",
          `stamp-mark ${groupName === "small" ? "is-small " : ""}is-attempt-wrong`,
          groupName === "big" ? "10" : "1",
        );
        slots.append(mark);
      }
      if (count === 0) slots.append(unit6Create("span", "stamp-zero is-attempt-wrong", "0개"));
    }
    const equation = ui.visualArea.querySelector("[data-stamp-equation]");
    if (equation) {
      equation.textContent = step.id === "big-stamps"
        ? `${choice.value}×10 + ?×1 ≠ ${problem.visual.value}`
        : `${problem.visual.big}×10 + ${choice.value}×1 ≠ ${problem.visual.value}`;
      equation.classList.add("is-attempt-wrong");
    }
  }
  if (problem.visual.kind === "detective" && typeof choice.value === "string") {
    const picked = problem.visual.rows.find((row) => row.label === choice.value);
    problem.visual.rows.forEach((row) => {
      const value = ui.visualArea.querySelector(`[data-row-value="${row.id}"]`);
      if (value) value.textContent = `${row.value}`;
    });
    ui.visualArea.querySelector(`[data-row-id="${picked?.id || ""}"]`)?.classList.add("is-picked-wrong");
    const relation = ui.visualArea.querySelector("[data-detective-relation]");
    if (relation && picked) {
      relation.textContent = `고른 값: ${picked.label} ${picked.value}`;
      relation.classList.add("is-attempt-wrong");
    }
  }
  if (problem.visual.kind === "detective" && typeof choice.value === "number") {
    problem.visual.rows.forEach((row) => {
      const value = ui.visualArea.querySelector(`[data-row-value="${row.id}"]`);
      if (value) value.textContent = `${row.value}`;
    });
    const relation = ui.visualArea.querySelector("[data-detective-relation]");
    if (relation) {
      relation.textContent = `고른 차이 ${choice.value}`;
      relation.classList.add("is-attempt-wrong");
    }
  }
}

function revealCorrectStep(problem, step) {
  ui.visualArea.querySelectorAll(".is-extra-attempt").forEach((node) => node.remove());
  ui.visualArea.querySelectorAll(".is-picked-wrong, .is-attempt-wrong").forEach((node) => {
    node.classList.remove("is-picked-wrong", "is-attempt-wrong");
  });
  if (problem.visual.kind === "census") {
    const target = problem.visual.rows.find((row) => row.id === problem.visual.targetId);
    const slot = ui.visualArea.querySelector(`[data-value-cell="${target.id}"]`);
    if (slot) {
      slot.textContent = `${target.count}`;
      slot.classList.add("is-filled");
    }
  }
  if (problem.visual.kind === "decoder") {
    const slot = ui.visualArea.querySelector("[data-total-slot]");
    if (slot) {
      slot.textContent = `${problem.visual.unit} × ${problem.visual.iconCount} = ${problem.visual.answer}`;
      slot.classList.add("is-filled");
    }
  }
  if (problem.visual.kind === "stamp") {
    const groupName = step.id === "big-stamps" ? "big" : "small";
    const count = groupName === "big" ? problem.visual.big : problem.visual.small;
    const slots = ui.visualArea.querySelector(`[data-stamp-group="${groupName}"] .stamp-slots`);
    if (slots) {
      slots.innerHTML = "";
      for (let index = 0; index < count; index += 1) {
        slots.append(unit6Create("span", `stamp-mark is-${groupName}`, groupName === "big" ? "10" : "1"));
      }
      if (count === 0) slots.append(unit6Create("span", "stamp-zero", "0개"));
    }
    const equation = ui.visualArea.querySelector("[data-stamp-equation]");
    if (equation) {
      equation.textContent = step.id === "big-stamps"
        ? `${problem.visual.big}×10 + ?×1 = ?`
        : `${problem.visual.big}×10 + ${problem.visual.small}×1 = ${problem.visual.value}`;
      equation.classList.toggle("is-filled", step.id === "small-stamps");
    }
  }
  if (problem.visual.kind === "detective") {
    problem.visual.rows.forEach((row) => {
      const value = ui.visualArea.querySelector(`[data-row-value="${row.id}"]`);
      if (value) value.textContent = `${row.value}`;
    });
    const relation = ui.visualArea.querySelector("[data-detective-relation]");
    if (relation) {
      relation.textContent = problem.finalExpression;
      relation.classList.add("is-filled");
    }
    const answerRow = problem.visual.rows.find((row) => (
      problem.visual.answerId ? row.id === problem.visual.answerId : row.id === problem.visual.highId || row.id === problem.visual.lowId
    ));
    if (answerRow) ui.visualArea.querySelector(`[data-row-id="${answerRow.id}"]`)?.classList.add("is-answer");
  }
}

function prepareStepAdvance(problem, step, currentState, advance) {
  document.querySelector(".unit6-step-next")?.remove();
  const button = unit6Create(
    "button",
    "unit6-step-next farm-step-next-button farm-confirm-next-button",
    step.advance?.label || "다음",
  );
  button.type = "button";
  button.addEventListener("click", advance, { once: true });
  document.querySelector(".step-board")?.append(button);
  button.focus({ preventScroll: true });
  return true;
}

function onProblemComplete({ problem }) {
  ui.visualArea.dataset.state = "complete";
  if (problem.visual.kind === "stamp") {
    const equation = ui.visualArea.querySelector("[data-stamp-equation]");
    if (equation) equation.textContent = problem.finalExpression;
  }
}

function unit6RewardImage(event) {
  const artMap = LESSON_CONFIG.reward?.artMap || {};
  return event?.image
    || artMap[event?.id]
    || artMap[event?.family]
    || LESSON_CONFIG.imageAssets.rewardClosed;
}

function ensureUnit6RewardStage() {
  if (unit6RewardStage?.root?.isConnected) return unit6RewardStage;
  const panel = document.querySelector("#screen-reward .reward-panel");
  const title = document.getElementById("rewardTitle");
  const engineLabel = document.getElementById("rewardChange");
  const button = document.getElementById("rewardNextButton");
  if (!panel || !title || !engineLabel || !button) return null;

  title.classList.add("visually-hidden");
  engineLabel.className = "visually-hidden";
  engineLabel.setAttribute("aria-hidden", "true");

  const story = unit6Create("div", "unit6-reward-story");
  story.dataset.rewardStageStory = "true";
  story.dataset.phase = "closed";
  const visual = unit6Create("div", "unit6-reward-visual");
  const art = unit6Create("img", "unit6-reward-art");
  art.alt = "";
  art.setAttribute("aria-hidden", "true");
  visual.append(art);

  const copy = unit6Create("div", "unit6-reward-copy");
  const eyebrow = unit6Create("span", "unit6-reward-eyebrow", "현재 단계");
  const tier = unit6Create("strong", "unit6-reward-tier");
  const meter = unit6Create("div", "unit6-reward-meter");
  meter.setAttribute("role", "progressbar");
  meter.setAttribute("aria-valuemin", "0");
  meter.setAttribute("aria-valuemax", String(LESSON_CONFIG.reward?.maxPower || 100));
  const meterFill = unit6Create("span", "unit6-reward-meter-fill");
  meter.append(meterFill);
  const status = unit6Create("p", "unit6-reward-status");
  status.setAttribute("aria-live", "polite");
  copy.append(eyebrow, tier, meter, status, button);
  story.append(visual, copy);
  panel.replaceChildren(title, story, engineLabel);

  unit6RewardStage = { root: story, art, tier, meter, meterFill, status };
  return unit6RewardStage;
}

function onRewardPrepare({ beforePower, beforeResult }) {
  const stage = ensureUnit6RewardStage();
  if (!stage) return;
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  stage.art.src = LESSON_CONFIG.imageAssets.rewardClosed;
  stage.tier.textContent = beforeResult.name;
  stage.meter.setAttribute("aria-valuenow", String(beforePower));
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, beforePower / maxPower * 100))}%`;
  stage.status.textContent = "";
  stage.root.dataset.phase = "closed";
  stage.root.dataset.reward = "closed";
  stage.root.setAttribute("aria-label", `현재 ${beforeResult.name}. 상자가 닫혀 있어요.`);
}

function onRewardReveal({ event, beforePower, afterPower, afterResult }) {
  const stage = ensureUnit6RewardStage();
  if (!stage) return Promise.resolve();
  const maxPower = LESSON_CONFIG.reward?.maxPower || 100;
  const change = afterPower - beforePower;
  const changeText = change > 0 ? `+${change}` : change < 0 ? String(change) : "그대로";
  stage.art.src = unit6RewardImage(event);
  stage.tier.textContent = afterResult.name;
  stage.meter.setAttribute("aria-valuenow", String(afterPower));
  stage.meterFill.style.width = `${Math.max(0, Math.min(100, afterPower / maxPower * 100))}%`;
  stage.status.textContent = event.special ? event.text : changeText;
  stage.root.dataset.phase = "revealed";
  stage.root.dataset.reward = event.family || event.id || "normal";
  stage.root.setAttribute("aria-label", `${stage.status.textContent}. 지금 ${afterResult.name}.`);
  return matchMedia("(prefers-reduced-motion: reduce)").matches
    ? Promise.resolve()
    : new Promise((resolve) => window.setTimeout(resolve, 480));
}
