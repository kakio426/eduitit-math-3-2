const CHECK_LOCK_SVG_NS = "http://www.w3.org/2000/svg";
const CHECK_LOCK_RELATION_LABEL = "나누는 수 × 몫";
const RESULT_NEXT_TITLE_ART = {
  lock: "result-title-lock-transparent-v2.png",
  safe: "result-title-safe-transparent-v2.png",
  largeSafe: "result-title-largeSafe-transparent-v2.png",
  secretSafe: "result-title-secretSafe-transparent-v2.png",
  treasure: "result-title-treasure-transparent-v2.png",
  rainbow: "result-title-rainbow-transparent-v2.png"
};

const VAULT_WORLD_SPARKS = {
  lock: [[50, 10], [50, 30], [50, 46]],
  safe: [[50, 10], [50, 30], [31, 34], [69, 34], [50, 46]],
  largeSafe: [[50, 10], [50, 30], [31, 34], [69, 34], [27, 41], [73, 41], [50, 46]],
  secretSafe: [[50, 10], [50, 30], [31, 34], [69, 34], [27, 41], [73, 41], [50, 46], [35, 56], [65, 56]],
  treasure: [[50, 10], [50, 30], [31, 34], [69, 34], [27, 41], [73, 41], [50, 46], [35, 56], [65, 56], [42, 67], [58, 67]],
  rainbow: [[50, 10], [50, 30], [31, 34], [69, 34], [27, 41], [73, 41], [50, 46], [35, 56], [65, 56], [42, 67], [58, 67], [50, 78]]
};

function ensureCheckLockStageArt() {
  const playScreen = document.getElementById("screen-play");
  if (!playScreen) return;

  if (!playScreen.querySelector(".check-lock-stage-art")) {
    const image = document.createElement("img");
    image.className = "check-lock-stage-art";
    image.src = LESSON_CONFIG.imageAssets.problemStage;
    image.alt = "";
    image.setAttribute("aria-hidden", "true");
    playScreen.prepend(image);
  }

  if (!playScreen.querySelector(".vault-world-panel")) {
    const panel = document.createElement("aside");
    panel.className = "vault-world-panel";
    panel.id = "vaultWorldPanel";
    panel.setAttribute("aria-live", "polite");
    panel.innerHTML = `
      <img class="vault-world-image" id="vaultWorldImage" alt="" aria-hidden="true">
      <img class="vault-world-flare-image" id="vaultWorldFlareImage" alt="" aria-hidden="true">
      <span class="vault-spark-layer" id="vaultSparkLayer" aria-hidden="true"></span>
      <div class="vault-world-readout">
        <p class="vault-world-current"><span>지금</span><strong id="vaultCurrentName">작은 자물쇠</strong></p>
        <div class="vault-world-power">
          <span>열쇠 빛</span>
          <strong id="vaultPowerValue">0</strong>
          <i aria-hidden="true"><b id="vaultPowerFill"></b></i>
        </div>
        <p class="vault-world-next"><span>다음</span><strong id="vaultNextName">튼튼한 금고</strong></p>
      </div>
      <span class="visually-hidden" id="vaultWorldStatus"></span>
    `;
    playScreen.appendChild(panel);
  }

  if (!playScreen.querySelector(".key-flight-layer")) {
    const layer = document.createElement("div");
    layer.className = "key-flight-layer";
    layer.id = "keyFlightLayer";
    layer.setAttribute("aria-hidden", "true");
    playScreen.appendChild(layer);
  }
}

function getVaultWorldResult(state) {
  return Lesson2CheckLockModel.getResult(
    Number(state.power || 0),
    Number(state.correctFirstTry || 0),
    Boolean(state.specialSeen)
  );
}

function getNextVaultResult(current) {
  if (current?.needsSpecial) return null;
  const special = Lesson2CheckLockModel.RESULT_TIERS.find((result) => result.needsSpecial);
  const candidate = Lesson2CheckLockModel.getNextResult(current);
  if (!candidate || candidate.id === current.id) return special || null;
  return candidate;
}

function syncVaultWorld(state, options = {}) {
  ensureCheckLockStageArt();
  const panel = document.getElementById("vaultWorldPanel");
  const image = document.getElementById("vaultWorldImage");
  const flareImage = document.getElementById("vaultWorldFlareImage");
  const sparkLayer = document.getElementById("vaultSparkLayer");
  const status = document.getElementById("vaultWorldStatus");
  const currentName = document.getElementById("vaultCurrentName");
  const nextName = document.getElementById("vaultNextName");
  const powerValue = document.getElementById("vaultPowerValue");
  const powerFill = document.getElementById("vaultPowerFill");
  if (!panel || !image || !flareImage || !sparkLayer || !status) return Promise.resolve();

  const result = getVaultWorldResult(state);
  const next = getNextVaultResult(result);
  const previousTier = panel.dataset.resultTier;
  const maxPower = Number(LESSON_CONFIG.reward?.maxPower || 100);
  const power = Math.max(0, Math.min(Number(state.power || 0), maxPower));
  const nextSrc = result.playImage
    || LESSON_CONFIG.imageAssets.playRewardStates?.[result.id]
    || LESSON_CONFIG.imageAssets.playRewardStates?.lock
    || "";

  panel.dataset.resultTier = result.id;
  currentName.textContent = result.name;
  nextName.textContent = result.needsSpecial ? "모든 금고를 열었어요" : (next?.name || "무지개 금고");
  powerValue.textContent = String(power);
  powerFill.style.width = `${(power / maxPower) * 100}%`;
  status.textContent = result.needsSpecial
    ? `지금 ${result.name}, 열쇠 빛 ${power}, 모든 금고를 열었어요.`
    : `지금 ${result.name}, 열쇠 빛 ${power}, 다음은 ${next?.name || "무지개 금고"}예요.`;
  panel.setAttribute("aria-label", status.textContent);

  const changed = image.getAttribute("src") !== nextSrc;
  if (changed) {
    panel.classList.remove("is-changing", "is-dimming", "is-key-lighting");
    void panel.offsetWidth;
    image.src = nextSrc;
    flareImage.src = nextSrc;
    panel.classList.add(options.delta < 0 ? "is-dimming" : "is-changing");
  }

  const sparkPoints = VAULT_WORLD_SPARKS[result.id] || VAULT_WORLD_SPARKS.lock;
  sparkLayer.replaceChildren(...sparkPoints.map(([left, top], index) => {
    const spark = document.createElement("i");
    spark.className = "vault-spark";
    spark.style.left = `${left}%`;
    spark.style.top = `${top}%`;
    spark.style.setProperty("--spark-delay", `${Math.min(index * 52, 620)}ms`);
    spark.style.setProperty("--spark-hue", `${index * 13}deg`);
    return spark;
  }));

  const lightKeys = options.delta >= 0 && (options.celebrate || (changed && Boolean(previousTier)));
  if (lightKeys) {
    panel.classList.remove("is-key-lighting");
    void panel.offsetWidth;
    panel.classList.add("is-key-lighting");
  }
  if (options.celebrate) panel.classList.add("is-celebrating");

  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : (lightKeys ? 1450 : 520);
  return new Promise((resolve) => {
    setTimeout(() => {
      panel.classList.remove("is-changing", "is-dimming", "is-key-lighting", "is-celebrating");
      resolve();
    }, duration);
  });
}

function renderProblemVisual(problem, state) {
  ensureCheckLockStageArt();
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderCheckLockBoard(problem, state);
  syncVaultWorld(state);
  syncCheckLockHud(state);
}

function syncCheckLockHud(state) {
  const count = `${Math.min(state.problemIndex + 1, Lesson2CheckLockModel.TOTAL_PROBLEMS)}/${Lesson2CheckLockModel.TOTAL_PROBLEMS}`;
  ui.questionCount.textContent = count;
  ui.questionCount.setAttribute("aria-label", `${state.problemIndex + 1}번째 문제`);
}

function updateProblemVisualForStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = "";
  ui.visualArea.dataset.attemptStep = "";
  ui.visualArea.dataset.attemptValue = "";
  renderCheckLockBoard(problem, state);
}

function revealCorrectStep(problem, step, state) {
  ui.visualArea.dataset.revealedStep = step.id;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(step.answer);
  renderCheckLockBoard(problem, state);
}

function renderAttempt(problem, step, selected, state, result) {
  if (result.correct) return;
  ui.visualArea.dataset.attemptStep = step.id;
  ui.visualArea.dataset.attemptValue = String(selected.value);
  renderCheckLockBoard(problem, state);
}

function renderChoicesForStep(problem, step, state, choose) {
  ui.choices.innerHTML = "";
  ui.choices.dataset.choiceKind = step.id;
  ui.choices.dataset.interaction = step.id === "multiply"
    ? "choose-check-pair"
    : step.id === "add"
      ? "choose-remainder"
      : "find-different-number";

  for (const selected of step.choices) {
    const button = document.createElement("button");
    button.type = "button";
    const choiceKind = step.id === "multiply"
      ? "check-lock-relation-choice"
      : step.id === "add"
        ? "check-lock-addend-choice"
        : "check-lock-part-choice";
    button.className = `choice-button check-lock-choice ${choiceKind}`;
    button.dataset.choice = selected.id;
    button.dataset.correct = selected.id === step.answerChoiceId ? "true" : "false";
    if (selected.misconceptionId) button.dataset.misconception = selected.misconceptionId;
    button.setAttribute("aria-label", [selected.roleLabel, selected.label].filter(Boolean).join(" "));

    if (selected.roleLabel) {
      const role = document.createElement("span");
      role.className = "check-lock-choice-role";
      role.textContent = selected.roleLabel;
      button.appendChild(role);
    }

    const value = document.createElement("strong");
    value.textContent = selected.label;
    button.appendChild(value);
    button.addEventListener("click", () => choose(selected, button));
    ui.choices.appendChild(button);
  }
  return true;
}

function onStepCorrect() {
  return animateLockSignal("correct");
}

function onStepWrong() {
  return animateLockSignal("wrong");
}

async function onProblemComplete() {
  await Promise.all([
    animateLockSignal("complete"),
    animateKeyEnergyToVault()
  ]);
}

async function onRewardReveal({ event, beforePower, afterPower, state }) {
  const actualDelta = afterPower - beforePower;
  event.amount = actualDelta;
  await Promise.all([
    animateLockSignal("reward"),
    syncVaultWorld(state, { celebrate: actualDelta > 0, delta: actualDelta })
  ]);
}

function onResult({ result }) {
  const nextResult = getNextVaultResult(result);
  const nextText = result?.needsSpecial
    ? "최고 단계예요!"
    : `다음은 ${nextResult?.name || "무지개 금고"}`;
  const nextArt = ensureCheckLockResultNextArt();
  if (nextArt) {
    nextArt.prefix.hidden = Boolean(result?.needsSpecial);
    nextArt.title.classList.toggle("is-final", Boolean(result?.needsSpecial));
    nextArt.title.src = result?.needsSpecial
      ? LESSON_CONFIG.imageAssets.resultFinalTitle
      : RESULT_NEXT_TITLE_ART[nextResult?.id] || RESULT_NEXT_TITLE_ART.rainbow;
  }
  if (ui.resultNextSvg) {
    ui.resultNextSvg.textContent = nextText;
    ui.resultNextSvg.hidden = true;
  }
  if (ui.resultDestinationSvg) ui.resultDestinationSvg.textContent = nextText;
  if (ui.resultMeasureSvg) ui.resultMeasureSvg.textContent = "";
  if (ui.resultNext) ui.resultNext.textContent = nextText;
}

function ensureCheckLockResultNextArt() {
  const layer = document.querySelector("#screen-result .result-layer");
  if (!layer) return null;

  let prefix = layer.querySelector(".result-next-prefix-art");
  if (!prefix) {
    prefix = document.createElement("img");
    prefix.className = "result-next-prefix-art";
    prefix.src = LESSON_CONFIG.imageAssets.resultNextPrefix;
    prefix.alt = "";
    prefix.setAttribute("aria-hidden", "true");
    layer.appendChild(prefix);
  }

  let title = layer.querySelector(".result-next-tier-art");
  if (!title) {
    title = document.createElement("img");
    title.className = "result-next-tier-art";
    title.alt = "";
    title.setAttribute("aria-hidden", "true");
    layer.appendChild(title);
  }

  return { prefix, title };
}

function animateLockSignal(sceneState) {
  const art = document.querySelector(".check-lock-stage-art");
  const board = document.querySelector(".check-lock-svg");
  if (art) art.dataset.sceneState = sceneState;
  if (board) {
    board.classList.remove("is-signal-correct", "is-signal-wrong", "is-signal-complete");
    void board.getBoundingClientRect();
    board.classList.add(sceneState === "wrong" ? "is-signal-wrong" : sceneState === "correct" ? "is-signal-correct" : "is-signal-complete");
  }
  const duration = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 420;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

function animateKeyEnergyToVault() {
  const layer = document.getElementById("keyFlightLayer");
  const panel = document.getElementById("vaultWorldPanel");
  const originNode = document.querySelector(".check-lock-svg .lock-core") || ui.visualArea;
  const stage = document.querySelector(".stage-shell");
  if (!layer || !panel || !originNode || !stage) return Promise.resolve();

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  panel.classList.add("is-collecting");
  if (reduceMotion) {
    return new Promise((resolve) => setTimeout(() => {
      panel.classList.remove("is-collecting");
      resolve();
    }, 120));
  }

  const stageRect = stage.getBoundingClientRect();
  const originRect = originNode.getBoundingClientRect();
  const panelRect = panel.getBoundingClientRect();
  const fromX = originRect.left + originRect.width * 0.5 - stageRect.left;
  const fromY = originRect.top + originRect.height * 0.5 - stageRect.top;
  const toX = panelRect.left + panelRect.width * 0.5 - stageRect.left;
  const toY = panelRect.top + panelRect.height * 0.3 - stageRect.top;
  layer.replaceChildren();

  for (let index = 0; index < 6; index += 1) {
    const spark = document.createElement("i");
    spark.className = "key-flight-particle";
    spark.style.left = `${fromX + (index - 2.5) * 8}px`;
    spark.style.top = `${fromY + (index % 2) * 7}px`;
    spark.style.setProperty("--flight-x", `${toX - fromX}px`);
    spark.style.setProperty("--flight-y", `${toY - fromY}px`);
    spark.style.setProperty("--flight-delay", `${index * 48}ms`);
    layer.appendChild(spark);
  }

  return new Promise((resolve) => setTimeout(() => {
    layer.replaceChildren();
    panel.classList.remove("is-collecting");
    resolve();
  }, 760));
}

function renderCheckLockBoard(problem, state) {
  const step = problem.steps[state.stepIndex];
  const revealedStep = ui.visualArea.dataset.revealedStep;
  const attemptStep = ui.visualArea.dataset.attemptStep;
  const attemptValue = ui.visualArea.dataset.attemptValue;
  const hasCurrentSelection = attemptStep === step.id && attemptValue !== "";
  const currentChoice = hasCurrentSelection
    ? step.choices.find((choice) => String(choice.value) === attemptValue)
    : null;
  const currentAnswerClass = revealedStep === step.id
    ? "is-correct-answer"
    : hasCurrentSelection
      ? "is-wrong-answer"
      : "is-waiting-answer";

  let boardMarkup = "";
  if (step.id === "multiply") {
    const relationRole = currentChoice?.roleLabel || "";
    const relationExpression = currentChoice?.expression || "? × ?";
    const relationResult = revealedStep === "multiply" ? ` = ${problem.product}` : "";
    const relationExpressionY = relationRole ? 203 : 178;
    boardMarkup = `
      <text x="440" y="131" class="lock-relation-role ${currentAnswerClass}">${relationRole}</text>
      <text x="440" y="${relationExpressionY}" class="lock-method-expression ${currentAnswerClass}">${relationExpression}${relationResult}</text>
      ${renderLockPins(0, revealedStep === "multiply")}
    `;
  } else if (step.id === "add") {
    const selectedNumber = Number(currentChoice?.number);
    const hasSelectedNumber = Number.isFinite(selectedNumber);
    const addRole = currentChoice?.roleLabel || "";
    const addExpression = hasSelectedNumber
      ? `${problem.product} + ${selectedNumber}${revealedStep === "add" ? ` = ${problem.product + selectedNumber}` : ""}`
      : `${problem.product} + ?`;
    const addExpressionY = addRole ? 218 : 190;
    boardMarkup = `
      <text x="440" y="92" class="lock-done-text">✓ ${CHECK_LOCK_RELATION_LABEL} · ${problem.divisor} × ${problem.shownQuotient} = ${problem.product}</text>
      <text x="440" y="153" class="lock-relation-role ${currentAnswerClass}">${addRole}</text>
      <text x="440" y="${addExpressionY}" class="lock-method-expression ${currentAnswerClass}">${addExpression}</text>
      ${renderLockPins(1, revealedStep === "add")}
    `;
  } else {
    const locateRevealed = revealedStep === "locate";
    const attemptedPart = attemptStep === "locate" ? attemptValue : "";
    const locateClass = (part) => {
      if (locateRevealed && problem.mismatchPart === part) return "is-confirmed-part";
      if (attemptedPart === part) return "is-attempt-part";
      return "";
    };
    boardMarkup = `
      <text x="440" y="86" class="lock-done-text">✓ ${problem.divisor} × ${problem.shownQuotient} + ${problem.shownRemainder} = ${problem.checkTotal}</text>
      <g class="lock-locate-formula">
        <text x="188" y="188" class="lock-active-expression">${problem.divisor}</text>
        <text x="250" y="188" class="lock-active-expression">×</text>
        <circle cx="330" cy="169" r="43" class="lock-term-target ${locateClass("quotient")}"/>
        <text x="330" y="188" class="lock-active-answer">${problem.shownQuotient}</text>
        <text x="412" y="188" class="lock-active-expression">+</text>
        <circle cx="488" cy="169" r="43" class="lock-term-target ${locateClass("remainder")}"/>
        <text x="488" y="188" class="lock-active-answer">${problem.shownRemainder}</text>
        <text x="570" y="188" class="lock-active-expression">=</text>
        <text x="652" y="188" class="lock-active-expression">${problem.checkTotal}</text>
        <text x="330" y="232" class="lock-term-label">몫</text>
        <text x="488" y="232" class="lock-term-label">나머지</text>
      </g>
      <text x="440" y="286" class="lock-compare-summary">${problem.checkTotal} ≠ 처음 수 ${problem.dividend}</text>
      ${renderLockPins(2, locateRevealed)}
    `;
  }

  const svg = document.createElementNS(CHECK_LOCK_SVG_NS, "svg");
  svg.classList.add("check-lock-svg");
  svg.setAttribute("viewBox", "0 0 880 350");
  svg.setAttribute("role", "img");
  svg.dataset.step = step.id;
  svg.dataset.answerState = revealedStep === step.id ? "correct" : hasCurrentSelection ? "wrong" : "waiting";
  svg.setAttribute("aria-label", `${problem.prompt}, ${step.instruction}`);
  svg.innerHTML = `
    <title>${problem.prompt} 검산 자물쇠</title>
    <defs>
      <radialGradient id="lockCoreGlow">
        <stop offset="0%" stop-color="#ffd86d" stop-opacity=".3"/>
        <stop offset="52%" stop-color="#2e6c76" stop-opacity=".08"/>
        <stop offset="100%" stop-color="#08141f" stop-opacity="0"/>
      </radialGradient>
      <filter id="lockSoftGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    <rect x="2" y="2" width="876" height="346" rx="28" class="lock-board-surface"/>
    <g class="lock-mechanism" aria-hidden="true">
      <circle cx="440" cy="178" r="148" class="lock-aura"/>
      <circle cx="440" cy="178" r="125" class="lock-outer-ring"/>
      <circle cx="440" cy="178" r="105" class="lock-inner-ring"/>
      <path d="M118 54H762" class="lock-rail"/>
      <path d="M118 302H762" class="lock-rail"/>
      <circle cx="118" cy="54" r="7" class="lock-rivet"/>
      <circle cx="762" cy="54" r="7" class="lock-rivet"/>
      <circle cx="118" cy="302" r="7" class="lock-rivet"/>
      <circle cx="762" cy="302" r="7" class="lock-rivet"/>
    </g>
    <g font-family="ui-sans-serif, system-ui, sans-serif" text-anchor="middle">
      ${boardMarkup}
    </g>
  `;
  ui.visualArea.replaceChildren(svg);
}

function renderLockPins(activeIndex, currentConfirmed) {
  return `
    <g class="lock-pin-progress" aria-hidden="true">
      <path d="M378 312H502" class="lock-pin-link"/>
      ${[0, 1, 2].map((index) => {
        const stateClass = index < activeIndex || (index === activeIndex && currentConfirmed)
          ? "is-done"
          : index === activeIndex
            ? "is-active"
            : "is-locked";
        const x = 378 + index * 62;
        return `
          <g class="lock-pin ${stateClass}" transform="translate(${x} 312)">
            <circle r="18"/>
            <path class="lock-core" d="M0 -7a6 6 0 1 1 0 12v8h-5V5a6 6 0 0 1 5-12Z"/>
          </g>
        `;
      }).join("")}
    </g>
  `;
}

const CHECK_LOCK_PREVIEW_PARAMS = new URLSearchParams(window.location.search);
if (CHECK_LOCK_PREVIEW_PARAMS.get("preview") === "result") {
  requestAnimationFrame(() => {
    const preview = window.__mathmonEngineQa;
    if (!preview) return;
    const requestedTier = CHECK_LOCK_PREVIEW_PARAMS.get("tier");
    const tier = Lesson2CheckLockModel.RESULT_TIERS.find((item) => item.id === requestedTier)
      || Lesson2CheckLockModel.RESULT_TIERS.find((item) => item.id === "treasure");
    preview.setState({
      power: tier?.minPower ?? 96,
      correctFirstTry: Math.max(tier?.minCorrect ?? 10, 1),
      specialSeen: Boolean(tier?.needsSpecial),
      currentResult: null,
    });
    preview.showResult();
  });
}
