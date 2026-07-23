function escapePackageText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function packageChoiceValue(choice) {
  return choice && typeof choice === "object" ? choice.value : choice;
}

function packageChoiceNumber(choice) {
  return choice && typeof choice === "object" && Number.isFinite(choice.numericValue)
    ? choice.numericValue
    : null;
}

function weightBoardMarkup(left, right, operation) {
  return '<div class="weight-column-board">'
    + '<div class="weight-column-head"><span></span><span>kg</span><span>g</span></div>'
    + `<div class="weight-column-row"><span></span><strong>${left.kg}</strong><strong>${left.g}</strong></div>`
    + `<div class="weight-column-row"><span>${escapePackageText(operation)}</span><strong>${right.kg}</strong><strong>${right.g}</strong></div>`
    + '<div class="weight-column-rule"></div>'
    + '<div class="weight-column-attempt"><span></span><strong id="weightBoardKg">?</strong><strong id="weightBoardG">?</strong></div>'
    + '</div>';
}

function limitAxisMarkup(problem) {
  const total = problem.visual.total;
  const limit = problem.visual.limit;
  const max = problem.visual.max;
  const totalLabelSide = total <= limit ? "is-label-left" : "is-label-right";
  const limitLabelSide = total <= limit ? "is-label-right" : "is-label-left";
  return '<div class="limit-axis" style="--total:'
    + `${(total / max) * 100}%;--limit:${(limit / max) * 100}%">`
    + '<div class="limit-axis-track"><span class="limit-axis-fill"></span>'
    + `<span class="limit-axis-marker is-total ${totalLabelSide}"><b>택배</b></span>`
    + `<span class="limit-axis-marker is-limit ${limitLabelSide}"><b>한도</b></span></div>`
    + '<div class="limit-axis-values">'
    + `<span class="is-total-value ${totalLabelSide}">${escapePackageText(Lesson5PackageWeightModel.formatWeight(Lesson5PackageWeightModel.fromTotalGrams(total)))}</span>`
    + `<span class="is-limit-value ${limitLabelSide}">${escapePackageText(Lesson5PackageWeightModel.formatWeight(Lesson5PackageWeightModel.fromTotalGrams(limit)))}</span>`
    + '</div><p class="limit-axis-difference" id="limitDifference"></p></div>';
}

function renderProblemVisual(problem, state) {
  ui.visualArea.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "package-visual";
  const isLimitComparison = problem.type === "limit" && state.stepIndex === 1;
  if (isLimitComparison) {
    wrapper.dataset.visualKind = "limitAxis";
    wrapper.innerHTML = limitAxisMarkup(problem);
  } else {
    const left = problem.left || problem.top || problem.box;
    const right = problem.right || problem.bottom || problem.wrap;
    wrapper.dataset.visualKind = "weightBoard";
    wrapper.innerHTML = weightBoardMarkup(left, right, problem.visual.operation);
  }
  ui.visualArea.append(wrapper);
}

function updateProblemVisualForStep(problem, step, state) {
  if (problem.type === "limit") renderProblemVisual(problem, state);
}

function updateWeightBoard(step, choice, correct) {
  const kgCell = document.getElementById("weightBoardKg");
  const gramCell = document.getElementById("weightBoardG");
  if (!kgCell || !gramCell) return;
  const value = String(packageChoiceValue(choice));
  const numeric = packageChoiceNumber(choice);

  if (step.id === "addGrams" || step.id === "subtractGrams") {
    kgCell.textContent = "?";
    gramCell.textContent = numeric == null ? value : String(numeric);
  } else if (Number.isFinite(numeric)) {
    const weight = Lesson5PackageWeightModel.fromTotalGrams(numeric);
    kgCell.textContent = String(weight.kg);
    gramCell.textContent = String(weight.g);
  } else {
    const match = value.match(/(\d+)kg\s+(\d+)g/);
    kgCell.textContent = match ? match[1] : "?";
    gramCell.textContent = match ? match[2] : value;
  }
  document.querySelector(".weight-column-board")?.setAttribute("data-attempt", correct ? "correct" : choice.relation || "unit");
}

function renderAttempt(problem, step, choice, state, result) {
  if (step.id === "limitFit") {
    const total = problem.visual.total;
    const limit = problem.visual.limit;
    const difference = Math.abs(total - limit);
    const node = document.getElementById("limitDifference");
    if (node) {
      node.textContent = total > limit
        ? `한도보다 ${difference}g 무거워요.`
        : `한도까지 ${difference}g 남아요.`;
    }
    document.querySelector(".limit-axis")?.setAttribute("data-attempt", result.correct ? "correct" : "wrong");
    return;
  }
  updateWeightBoard(step, choice, result.correct);
}

function truckImageForResult(result) {
  return result?.truckImage || "truck-evolution-plain-generated.webp";
}

function onRewardPrepare({ beforeResult }) {
  const rewardObject = document.querySelector(".reward-object");
  if (!rewardObject) return;
  rewardObject.innerHTML = '<div class="truck-reward-stage" data-phase="closed">'
    + `<img class="truck-reward-before" src="${escapePackageText(truckImageForResult(beforeResult))}" alt="">`
    + '<div class="truck-reward-box" aria-hidden="true"><span>?</span></div>'
    + '<img class="truck-reward-after" src="" alt="">'
    + '</div>';
  const stageText = document.getElementById("rewardStageText");
  if (stageText) stageText.textContent = beforeResult?.name || "평범 트럭";
}

function onRewardReveal({ beforeResult, afterResult }) {
  const stage = document.querySelector(".truck-reward-stage");
  const after = document.querySelector(".truck-reward-after");
  if (!stage || !after) return;
  const shownAfter = beforeResult?.id === afterResult?.id
    ? Lesson5PackageWeightModel.getNextResult(afterResult)
    : afterResult;
  after.src = truckImageForResult(shownAfter);
  stage.dataset.phase = "revealed";
  const stageText = document.getElementById("rewardStageText");
  if (stageText) stageText.textContent = afterResult?.name || "평범 트럭";
}

function formatLessonRewardTarget({ beforeResult, afterResult, state }) {
  if (afterResult?.needsSpecial) return "슈퍼 트럭이 됐어요!";
  if (afterResult?.id && beforeResult?.id !== afterResult.id) return `${afterResult.name}이 됐어요!`;
  const nextResult = Lesson5PackageWeightModel.getNextResult(afterResult);
  if (!nextResult || nextResult.id === afterResult?.id) return "슈퍼 트럭을 만나 봐요!";
  const missingCorrect = Math.max(0, Number(nextResult.minCorrect || 0) - state.correctFirstTry);
  if (state.power >= Number(nextResult.minPower || 0) && missingCorrect > 0) {
    return `${nextResult.name}까지 ${missingCorrect}문제 더`;
  }
  const remaining = Math.max(0, Number(nextResult.minPower || 0) - state.power);
  return `${nextResult.name}까지 ${remaining} 남았어요.`;
}
