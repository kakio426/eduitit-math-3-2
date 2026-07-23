function escapeLessonText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function getAttemptChoiceValue(choice) {
  return choice && typeof choice === "object" ? choice.value : choice;
}

function getAttemptNumericValue(choice) {
  return choice && typeof choice === "object" && Number.isFinite(choice.numericValue)
    ? choice.numericValue
    : null;
}

function makeScaleTicks(max, interval) {
  const ticks = [];
  for (let value = 0; value <= max; value += interval) {
    const percent = (value / max) * 100;
    const isMajor = value % 1000 === 0 || max === 1000 && value % 500 === 0;
    const label = isMajor
      ? (value === 0 ? "0" : value >= 1000 ? `${value / 1000}L` : `${value}mL`)
      : "";
    const boundaryClass = value === 0 ? " is-min" : value === max ? " is-max" : "";
    ticks.push(
      `<span class="measure-tick${isMajor ? " is-major" : ""}${boundaryClass}" style="--tick:${percent}%">`
      + `<span class="measure-tick-label">${label}</span></span>`,
    );
  }
  return ticks.join("");
}

function bottleMarkup(amount, max, interval, label, side = "") {
  const fill = Math.round((amount / max) * 1000) / 10;
  return `<div class="compare-label" data-side="${escapeLessonText(side)}">`
    + `<div class="measure-bottle" style="--fill:${fill}%">`
    + '<div class="water-fill"></div>'
    + makeScaleTicks(max, interval)
    + '<span class="chosen-level" hidden></span>'
    + '</div>'
    + `<div class="bottle-label">${escapeLessonText(label)}</div>`
    + '</div>';
}

function renderCapacityBoard(problem) {
  const left = problem.left || problem.top;
  const right = problem.right || problem.bottom;
  const operation = problem.visual.operation;
  return `<div class="column-board" data-operation="${operation === "+" ? "add" : "subtract"}">`
    + '<div class="column-head"><span></span><span>L</span><span>mL</span></div>'
    + `<div class="column-row"><span></span><strong>${left.l}</strong><strong>${left.ml}</strong></div>`
    + `<div class="column-row"><span>${operation}</span><strong>${right.l}</strong><strong>${right.ml}</strong></div>`
    + '<div class="column-rule"></div>'
    + '<div class="column-attempt"><span></span><strong id="boardLiter">?</strong><strong id="boardSmallUnit">?</strong></div>'
    + '</div>';
}

function renderAmountAxis(problem) {
  const made = problem.visual.made;
  const target = problem.visual.target;
  const max = problem.visual.max;
  return '<div class="amount-axis" style="--made:'
    + `${(made / max) * 100}%;--target:${(target / max) * 100}%">`
    + '<div class="amount-axis-track"><span class="amount-fill"></span>'
    + '<span class="amount-marker is-made"><b>만든 양</b></span>'
    + '<span class="amount-marker is-target"><b>주문</b></span></div>'
    + `<div class="amount-axis-values"><span>${escapeLessonText(Lesson5WaterFillModel.formatCapacity(made))}</span>`
    + `<span>${escapeLessonText(Lesson5WaterFillModel.formatCapacity(target))}</span></div>`
    + '<p class="amount-axis-difference" id="axisDifference"></p></div>';
}

function scaleMarkup(visual) {
  return '<div class="scale-visual" data-attempt="waiting">'
    + `<div class="scale-beam" style="--tilt:${escapeLessonText(visual.tilt || "0deg")}"></div>`
    + '<div class="scale-pans">'
    + `<div class="scale-pan" data-side="left"><div><strong>왼쪽</strong><span id="leftScaleValue">${escapeLessonText(visual.left)}</span></div></div>`
    + `<div class="scale-pan" data-side="right"><div><strong>오른쪽</strong><span>${escapeLessonText(visual.right)}</span></div></div>`
    + '</div><p class="scale-difference" id="scaleDifference"></p></div>';
}

function renderProblemVisual(problem) {
  ui.visualArea.innerHTML = "";
  const visual = problem.visual || {};
  const wrapper = document.createElement("div");
  wrapper.className = "capacity-visual";
  wrapper.dataset.visualKind = visual.kind || "";

  if (visual.kind === "bottle") {
    wrapper.innerHTML = `<div class="bottle-wrap">${bottleMarkup(visual.amount, visual.max, visual.interval, visual.label)}</div>`;
  } else if (visual.kind === "compareBottle") {
    wrapper.innerHTML = '<div class="bottle-wrap is-compare">'
      + bottleMarkup(visual.left, visual.max, visual.interval, "왼쪽", "left")
      + bottleMarkup(visual.right, visual.max, visual.interval, "오른쪽", "right")
      + '</div>';
  } else if (visual.kind === "capacityBoard") {
    wrapper.innerHTML = renderCapacityBoard(problem);
  } else if (visual.kind === "amountAxis") {
    wrapper.innerHTML = renderAmountAxis(problem);
  } else if (visual.kind === "scale") {
    wrapper.innerHTML = scaleMarkup(visual);
  }
  ui.visualArea.append(wrapper);
}

function updateCapacityBoardAttempt(problem, step, choice, correct) {
  const smallCell = document.getElementById("boardSmallUnit");
  const literCell = document.getElementById("boardLiter");
  if (!smallCell || !literCell) return;
  const value = getAttemptChoiceValue(choice);
  const numeric = getAttemptNumericValue(choice);

  if (step.id === "addMl" || step.id === "subtractMl") {
    smallCell.textContent = numeric == null ? value : String(numeric);
    literCell.textContent = "?";
  } else if (step.id === "addChange" || step.id === "borrowLiter") {
    const match = String(value).match(/(\d+)L\s+(\d+)mL/);
    literCell.textContent = match ? match[1] : "?";
    smallCell.textContent = match ? match[2] : String(value);
  } else {
    const total = numeric;
    if (Number.isFinite(total)) {
      const capacity = Lesson5WaterFillModel.fromTotalMl(total);
      literCell.textContent = String(capacity.l);
      smallCell.textContent = String(capacity.ml);
    } else {
      smallCell.textContent = String(value);
    }
  }
  document.querySelector(".column-board")?.setAttribute("data-attempt", correct ? "correct" : choice.relation || "unit");
}

function updateBottleAttempt(problem, choice) {
  const marker = document.querySelector(".chosen-level");
  const numeric = getAttemptNumericValue(choice);
  if (!marker || !Number.isFinite(numeric)) return;
  marker.hidden = false;
  marker.style.setProperty("--chosen", `${(numeric / problem.visual.max) * 100}%`);
  marker.dataset.relation = choice.relation || "unit";
}

function updateScaleAttempt(problem, choice, correct) {
  const scale = document.querySelector(".scale-visual");
  const beam = document.querySelector(".scale-beam");
  if (!scale || !beam) return;
  let leftValue = problem.visual.leftValue;
  const rightValue = problem.visual.rightValue;
  const selectedValue = getAttemptNumericValue(choice);

  if (problem.type === "balanceMissing" && Number.isFinite(selectedValue)) {
    leftValue = problem.visual.baseLeftValue + selectedValue;
    const leftLabel = document.getElementById("leftScaleValue");
    if (leftLabel) leftLabel.textContent = `${Lesson5WaterFillModel.formatWeight(problem.left)} + ${choice.label}`;
  }

  const difference = Math.abs(leftValue - rightValue);
  const tilt = leftValue === rightValue ? 0 : leftValue > rightValue ? -5 : 5;
  beam.style.setProperty("--tilt", `${tilt}deg`);
  scale.dataset.attempt = correct ? "correct" : choice.relation || "wrong";
  const differenceNode = document.getElementById("scaleDifference");
  if (differenceNode) {
    differenceNode.textContent = difference === 0
      ? "저울이 수평이에요."
      : `${leftValue > rightValue ? "왼쪽" : "오른쪽"}이 ${difference >= 1000 ? Lesson5WaterFillModel.formatWeight(Lesson5WaterFillModel.fromTotalGrams(difference)) : `${difference}g`} 더 무거워요.`;
  }
}

function renderAttempt(problem, step, choice, state, result) {
  if (problem.visual.kind === "bottle") {
    updateBottleAttempt(problem, choice);
  } else if (problem.visual.kind === "compareBottle") {
    const side = String(getAttemptChoiceValue(choice)).startsWith("왼쪽") ? "left"
      : String(getAttemptChoiceValue(choice)).startsWith("오른쪽") ? "right"
        : "same";
    document.querySelector(".bottle-wrap")?.setAttribute("data-picked-side", side);
  } else if (problem.visual.kind === "capacityBoard") {
    updateCapacityBoardAttempt(problem, step, choice, result.correct);
  } else if (problem.visual.kind === "amountAxis") {
    const difference = Math.abs(problem.visual.made - problem.visual.target);
    const differenceNode = document.getElementById("axisDifference");
    if (differenceNode) {
      differenceNode.textContent = `${Lesson5WaterFillModel.formatMl(difference)} ${problem.visual.made < problem.visual.target ? "부족해요." : "남아요."}`;
    }
    document.querySelector(".amount-axis")?.setAttribute("data-attempt", result.correct ? "correct" : "wrong");
  } else if (problem.visual.kind === "scale") {
    updateScaleAttempt(problem, choice, result.correct);
  }
}
