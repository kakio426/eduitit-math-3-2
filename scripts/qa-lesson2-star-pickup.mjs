import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd());
const LESSON = join(ROOT, "3-2-2-3-mathmon-star-pickup");
const SCREENSHOT_DIR = join(LESSON, "screenshots");
const PROFILE_BASE = join(SCREENSHOT_DIR, ".qa-profile");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html`;
const PORT = Number(process.env.LESSON2_STAR_QA_PORT || 9263);
const PROFILE = join(PROFILE_BASE, "chrome-user-data");
const TOTAL_QUESTIONS = 10;

const VIEWPORTS = {
  desktop: { name: "desktop", width: 1280, height: 800 },
  tablet: { name: "tablet", width: 1024, height: 768 }
};

function assertSafeProfilePath(path) {
  const resolved = resolve(path);
  const base = resolve(PROFILE_BASE);
  if (!resolved.startsWith(`${base}${sep}`) || basename(resolved) !== "chrome-user-data" || basename(dirname(resolved)) !== ".qa-profile") {
    throw new Error(`Refusing to delete unsafe QA profile path: ${resolved}`);
  }
  return resolved;
}

function assertSafeProfileBasePath(path) {
  const resolved = resolve(path);
  const expected = resolve(SCREENSHOT_DIR, ".qa-profile");
  if (resolved !== expected) {
    throw new Error(`Refusing to delete unsafe QA profile base path: ${resolved}`);
  }
  return resolved;
}

await rm(assertSafeProfileBasePath(PROFILE_BASE), { recursive: true, force: true });
await mkdir(PROFILE_BASE, { recursive: true });

const browser = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${PROFILE}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "about:blank"
], { stdio: ["ignore", "ignore", "pipe"] });

browser.stderr.on("data", () => {});

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ignoreTimeout(promise, ms) {
  await Promise.race([
    promise.catch(() => {}),
    delay(ms)
  ]);
}

function hasBrowserExited() {
  return browser.exitCode !== null || browser.signalCode !== null;
}

function waitForBrowserExit(ms) {
  return new Promise((resolve) => {
    if (hasBrowserExited()) {
      resolve();
      return;
    }
    const onExit = () => {
      clearTimeout(timer);
      resolve();
    };
    const timer = setTimeout(() => {
      browser.off("exit", onExit);
      resolve();
    }, ms);
    browser.once("exit", onExit);
    if (hasBrowserExited()) {
      browser.off("exit", onExit);
      onExit();
    }
  });
}

async function waitForJson() {
  for (let index = 0; index < 90; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const pages = await response.json();
      const page = pages.find((item) => item.type === "page");
      if (page?.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl;
      }
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not open");
}

class Cdp {
  constructor(socketUrl) {
    this.socketUrl = socketUrl;
    this.id = 0;
    this.pending = new Map();
  }

  async open() {
    this.ws = new WebSocket(this.socketUrl);
    this.ws.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const { resolve, reject } = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) {
          reject(new Error(JSON.stringify(message.error)));
        } else {
          resolve(message.result || {});
        }
      }
    });
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 15000);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        }
      });
    });
  }

  async close() {
    if (!this.ws || this.ws.readyState === WebSocket.CLOSED) {
      return;
    }
    await new Promise((resolve) => {
      const timer = setTimeout(resolve, 1000);
      this.ws.addEventListener("close", () => {
        clearTimeout(timer);
        resolve();
      }, { once: true });
      this.ws.close();
    });
  }
}

const cdp = new Cdp(await waitForJson());
await cdp.open();

async function evaluate(expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(JSON.stringify(result.exceptionDetails));
  }
  return result.result?.value;
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function waitUntil(predicateSource, message, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(predicateSource)) {
      return;
    }
    await delay(80);
  }
  throw new Error(message);
}

async function setViewport(viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 }
  });
}

async function navigate(viewport) {
  await setViewport(viewport);
  await cdp.send("Page.navigate", { url: `${FILE_URL}?qa=${viewport.name}-${Date.now()}` });
  await waitUntil("document.readyState === 'complete'", `${viewport.name}: page did not finish loading`, 6000);
  await evaluate('window.__mathmonAudioQa?.setState({ bgmEnabled: false, sfxEnabled: false }); document.getElementById("settingsConfirm").textContent = ""');
  await delay(500);
}

async function click(selector) {
  await evaluate(`
(() => {
  const node = document.querySelector(${JSON.stringify(selector)});
  if (!node) throw new Error(${JSON.stringify(`Missing selector: ${selector}`)});
  node.click();
})()
`);
}

async function clickCorrectChoice() {
  await click('#choiceGrid [data-correct="true"]');
}

async function clickChoiceByText(text) {
  await evaluate(`
(() => {
  const button = [...document.querySelectorAll("#choiceGrid button")]
    .find((node) => node.textContent.trim() === ${JSON.stringify(text)});
  if (!button) throw new Error(${JSON.stringify(`Missing choice: ${text}`)});
  button.click();
})()
`);
}

async function loadFixedProblem() {
  await evaluate(`
(() => {
  state.problems = [{ dividend: 89, divisor: 3, quotient: 29, remainder: 2 }];
  state.index = 0;
  state.starScore = 0;
  state.remainderStars = 0;
  state.correct = 0;
  state.chain = 0;
  state.rainbowStar = false;
  showScreen("play");
  renderProblem();
})()
`);
  await waitUntil('document.getElementById("questionText").textContent.trim() === "89 ÷ 3"', "deterministic problem did not render");
}

async function capture(name) {
  const layoutIssues = await evaluate(`
(() => {
  const selector = [
    "button",
    ".hud",
    ".top-row",
    ".brand-badge",
    ".unit-badge",
    ".lesson-badge",
    ".mini-badge",
    ".tutorial-progress",
    ".stat-pill",
    ".choice-button",
    ".feedback",
    ".prompt",
    ".step-formula",
    ".group-proof",
    ".check-preview",
    ".flow-card",
    ".settings-modal",
    ".settings-switch",
    ".settings-action",
    ".settings-restart-confirm",
    ".reward-delta",
    ".result-restart-hitbox"
  ].join(",");
  const screen = document.querySelector(".screen.is-active");
  const screenRect = screen.getBoundingClientRect();
  const summarize = (node, reason) => ({
    reason,
    tag: node.tagName,
    className: String(node.className),
    id: node.id,
    text: node.textContent.trim().replace(/\\s+/g, " ").slice(0, 80),
    scrollWidth: node.scrollWidth,
    clientWidth: node.clientWidth,
    scrollHeight: node.scrollHeight,
    clientHeight: node.clientHeight,
    rect: (() => {
      const rect = node.getBoundingClientRect();
      return {
        top: Math.round(rect.top),
        right: Math.round(rect.right),
        bottom: Math.round(rect.bottom),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    })(),
    clipped: (() => {
      const rect = node.getBoundingClientRect();
      return rect.top < screenRect.top - 2
        || rect.left < screenRect.left - 2
        || rect.right > screenRect.right + 2
        || rect.bottom > screenRect.bottom + 2;
    })()
  });
  const isActuallyHidden = (node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display === "none"
      || style.visibility === "hidden"
      || (
        rect.width <= 2
        && rect.height <= 2
        && style.overflow === "hidden"
        && (style.clip !== "auto" || style.clipPath !== "none")
      );
  };
  const isSuppressedByHiddenAncestor = (node) => {
    const hiddenAncestor = node.closest(".visually-hidden");
    return hiddenAncestor ? isActuallyHidden(hiddenAncestor) : false;
  };
  const isVisible = (node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return node.offsetParent
      && !isSuppressedByHiddenAncestor(node)
      && style.visibility !== "hidden"
      && style.display !== "none"
      && rect.width > 0
      && rect.height > 0;
  };
  const visibleIssues = [...document.querySelectorAll(selector)]
    .filter(isVisible)
    .map((node) => summarize(node, "visible-overflow-or-clipped"))
    .filter((node) => node.clipped || node.scrollWidth > node.clientWidth + 2 || node.scrollHeight > node.clientHeight + 3);
  const hiddenIssues = [...document.querySelectorAll(".visually-hidden")]
    .filter((node) => !isActuallyHidden(node))
    .map((node) => summarize(node, "visually-hidden-class-not-hidden"));
  return [...visibleIssues, ...hiddenIssues];
})()
`);
  assert(layoutIssues.length === 0, `${name}: text overflow or clipping detected ${JSON.stringify(layoutIssues)}`);

  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false
  });
  const path = join(SCREENSHOT_DIR, name);
  await writeFile(path, Buffer.from(data, "base64"));
  return path;
}

async function verifyMathModel() {
  const result = await evaluate(`
(() => {
  const keyFor = (problem) => \`\${problem.dividend}/\${problem.divisor}\`;
  const validate = (problem) => {
    const issues = [];
    const steps = buildSteps(problem);
    if (problem.dividend < 20 || problem.dividend > 99) issues.push("not-two-digit");
    if (problem.divisor < 3 || problem.divisor > 9) issues.push("bad-divisor");
    if (problem.quotient < 2) issues.push("bad-quotient-range");
    if (problem.remainder <= 0 || problem.remainder >= problem.divisor) issues.push("bad-remainder");
    if (problem.divisor * problem.quotient + problem.remainder !== problem.dividend) issues.push("bad-equation");
    if (steps.length !== 3 || steps[0].id !== "quotient" || steps[1].id !== "remainder" || steps[2].id !== "check") issues.push("bad-steps");
    if (!steps[1].hint.includes(String(problem.divisor))) issues.push("missing-remainder-bound-hint");
    return { key: keyFor(problem), issues };
  };
  const sampledProblems = [];
  for (let index = 0; index < 20; index += 1) {
    sampledProblems.push(...buildProblems());
  }
  const duplicateRun = buildProblems();
  return {
    sampledCount: sampledProblems.length,
    sampleFailures: sampledProblems.map(validate).filter((item) => item.issues.length > 0).slice(0, 5),
    duplicateCount: duplicateRun.length - new Set(duplicateRun.map(keyFor)).size
  };
})()
`);
  assert(result.sampledCount === TOTAL_QUESTIONS * 20, `buildProblems sample count wrong: ${JSON.stringify(result)}`);
  assert(result.sampleFailures.length === 0, `buildProblems sample failures: ${JSON.stringify(result.sampleFailures)}`);
  assert(result.duplicateCount === 0, `one build emitted duplicate problems: ${JSON.stringify(result)}`);
  return result;
}

async function verifyRewardModel() {
  const result = await evaluate(`
(() => {
  const amountPicker = (min) => min;
  const cases = [
    { roll: 1, id: "meteor", label: "별빛 +4" },
    { roll: 80, id: "cloud", label: "별빛 -5" },
    { roll: 90, id: "bigMeteor", label: "별빛 +12" },
    { roll: 95, id: "shooting", label: "별똥별!" },
    { roll: 98, id: "dark", label: "별빛 0" },
    { roll: 99.9, id: "rainbow", label: "초신성!" }
  ];
  return cases.map((expected) => {
    const event = pickStarEventForRoll(expected.roll, amountPicker);
    const label = getStarEventDeltaLabel({ ...event, actualDelta: event.amount });
    return { expected, actual: { id: event.id, label } };
  });
})()
`);
  const failures = result.filter((item) => item.expected.id !== item.actual.id || item.expected.label !== item.actual.label);
  assert(failures.length === 0, `reward model failures: ${JSON.stringify(failures)}`);
  return result;
}

async function verifyContractFlags() {
  const contract = await evaluate(`
(() => {
  const main = document.querySelector("main.game");
  const audioQa = window.__mathmonAudioQa;
  return {
    coverStart: main?.dataset.coverStartStandard,
    settings: main?.dataset.settingsStandard,
    resultVisual: main?.dataset.resultVisualStandard,
    resultMode: main?.dataset.resultRenderMode,
    audioKeys: audioQa?.keys || null,
    forbiddenResultNodes: document.querySelectorAll("#resultScreen .result-stats, #resultScreen .result-stat, #resultScreen .result-copy, #resultScreen .result-card").length,
    hasHybridSvg: Boolean(document.querySelector("#resultScreen .result-dynamic-ui")),
    hasGeneratedButton: Boolean(document.querySelector("#startButton .start-button-art"))
  };
})()
`);
  assert(contract.coverStart === "generated-button-art", `generated start button flag missing: ${JSON.stringify(contract)}`);
  assert(contract.settings === "modal-controls", `settings modal flag missing: ${JSON.stringify(contract)}`);
  assert(contract.resultVisual === "generated-assets", `generated result flag missing: ${JSON.stringify(contract)}`);
  assert(contract.resultMode === "hybrid-generated-dynamic", `hybrid result mode missing: ${JSON.stringify(contract)}`);
  assert(contract.audioKeys?.bgm === "mathmon-audio-bgm-enabled", `bgm key mismatch: ${JSON.stringify(contract)}`);
  assert(contract.audioKeys?.sfx === "mathmon-audio-sfx-enabled", `sfx key mismatch: ${JSON.stringify(contract)}`);
  assert(contract.forbiddenResultNodes === 0, `legacy result nodes remain: ${JSON.stringify(contract)}`);
  assert(contract.hasHybridSvg && contract.hasGeneratedButton, `required visual standard nodes missing: ${JSON.stringify(contract)}`);
  return contract;
}

async function runDesktopScenario() {
  await navigate(VIEWPORTS.desktop);
  const contract = await verifyContractFlags();
  await capture("01-cover.png");
  await click("#settingsButton");
  await waitUntil('!document.getElementById("settingsBackdrop").hidden', "settings did not open");
  await capture("01b-settings.png");
  await click("#settingsCloseButton");
  await waitUntil('document.getElementById("settingsBackdrop").hidden', "settings did not close");
  await click("#startButton");
  await waitUntil('document.getElementById("tutorialScreen").classList.contains("is-active")', "tutorial did not open");
  await capture("02-tutorial.png");
  await click("#tutorialNextButton");
  await waitUntil('document.getElementById("tutorialProgress").textContent.trim() === "2/2"', "tutorial page 2 did not open");
  await capture("02b-tutorial-page2.png");
  await click("#tutorialNextButton");
  await waitUntil('document.getElementById("playScreen").classList.contains("is-active") && document.querySelectorAll("#choiceGrid button").length === 4', "play screen did not start");

  const mathModel = await verifyMathModel();
  const rewardModel = await verifyRewardModel();

  await loadFixedProblem();
  const initialQuotientUi = await evaluate(`
(() => ({
  prompt: document.getElementById("promptText").textContent.trim(),
  divisorCardHeight: document.getElementById("divisorCard").getBoundingClientRect().height,
  divisorLabelFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#divisorCard span")).fontSize),
  divisorValueFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#divisorCard strong")).fontSize),
  firstChoiceHeight: document.querySelector("#choiceGrid button")?.getBoundingClientRect().height || 0,
  firstChoiceFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#choiceGrid button")).fontSize)
}))()
`);
  assert(initialQuotientUi.prompt === "3개씩 몇 번 묶을까요?", `quotient prompt copy mismatch: ${JSON.stringify(initialQuotientUi)}`);
  assert(initialQuotientUi.divisorCardHeight >= 100, `desktop division card is too short: ${JSON.stringify(initialQuotientUi)}`);
  assert(initialQuotientUi.divisorLabelFontSize >= 15, `desktop division card label is too small: ${JSON.stringify(initialQuotientUi)}`);
  assert(initialQuotientUi.divisorValueFontSize >= 32, `desktop division card value is too small: ${JSON.stringify(initialQuotientUi)}`);
  assert(initialQuotientUi.firstChoiceHeight >= 96, `desktop choice button is too short: ${JSON.stringify(initialQuotientUi)}`);
  assert(initialQuotientUi.firstChoiceFontSize >= 28, `desktop choice button text is too small: ${JSON.stringify(initialQuotientUi)}`);
  const desktopInitialRects = await evaluate(`
(() => {
  const board = document.querySelector(".division-board").getBoundingClientRect();
  const prompt = document.getElementById("promptText").getBoundingClientRect();
  const choices = document.getElementById("choiceGrid").getBoundingClientRect();
  return {
    boardBottom: board.bottom,
    promptTop: prompt.top,
    promptBottom: prompt.bottom,
    choicesTop: choices.top
  };
})()
`);
  assert(desktopInitialRects.boardBottom <= desktopInitialRects.promptTop + 1, `desktop prompt overlaps division board: ${JSON.stringify(desktopInitialRects)}`);
  assert(desktopInitialRects.promptBottom <= desktopInitialRects.choicesTop + 1, `desktop choices overlap prompt: ${JSON.stringify(desktopInitialRects)}`);
  await capture("03-problem.png");

  await clickChoiceByText("30묶음");
  await waitUntil('document.getElementById("groupProof").classList.contains("is-too-many")', "too-many quotient proof did not show");
  const tooManyProof = await evaluate(`
(() => ({
  stepIndex: state.stepIndex,
  text: document.getElementById("groupProofText").textContent.trim(),
  overflow: getComputedStyle(document.getElementById("groupProofBar")).getPropertyValue("--proof-overflow").trim()
}))()
`);
  assert(tooManyProof.stepIndex === 0, `too-many quotient advanced unexpectedly: ${JSON.stringify(tooManyProof)}`);
  assert(tooManyProof.text === "30묶음은 90개라 별이 모자라요.", `too-many proof copy mismatch: ${JSON.stringify(tooManyProof)}`);
  assert(tooManyProof.overflow !== "0%", `too-many overflow bar missing: ${JSON.stringify(tooManyProof)}`);
  await capture("03-problem-quotient-too-many.png");

  await loadFixedProblem();
  await clickChoiceByText("28묶음");
  await waitUntil('document.getElementById("groupProof").classList.contains("is-too-small")', "too-small quotient proof did not show");
  const tooSmallProof = await evaluate(`
(() => ({
  stepIndex: state.stepIndex,
  text: document.getElementById("groupProofText").textContent.trim(),
  hidden: document.getElementById("groupProof").hidden
}))()
`);
  assert(tooSmallProof.stepIndex === 0, `too-small quotient advanced unexpectedly: ${JSON.stringify(tooSmallProof)}`);
  assert(tooSmallProof.text === "28묶음은 84개예요. 한 묶음 더 돼요.", `too-small proof copy mismatch: ${JSON.stringify(tooSmallProof)}`);
  assert(!tooSmallProof.hidden, `too-small proof hidden: ${JSON.stringify(tooSmallProof)}`);
  await capture("03-problem-quotient-too-small.png");

  await loadFixedProblem();
  await clickChoiceByText("29묶음");
  await waitUntil('document.getElementById("groupProof").classList.contains("is-good")', "correct quotient proof did not show");
  const correctProof = await evaluate(`
(() => ({
  text: document.getElementById("groupProofText").textContent.trim(),
  leftoverDots: document.querySelectorAll("#groupProofStars .proof-star-dot").length,
  quotient: document.getElementById("boardQuotient").textContent.trim()
}))()
`);
  assert(correctProof.text === "3개씩 29묶음 = 87개", `correct quotient proof mismatch: ${JSON.stringify(correctProof)}`);
  assert(correctProof.leftoverDots === 2, `correct quotient leftover dots missing: ${JSON.stringify(correctProof)}`);
  assert(correctProof.quotient === "29묶음", `board quotient did not fill: ${JSON.stringify(correctProof)}`);
  await capture("03-problem-quotient-good.png");
  await waitUntil("state.stepIndex === 1", "quotient step did not complete");
  await capture("03-problem-remainder.png");
  await clickChoiceByText("2개");
  await waitUntil("state.stepIndex === 2", "remainder step did not complete");
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "final confirmation button did not appear", 4000);
  await capture("03-final-confirm.png");

  const held = await evaluate(`
(() => ({
  rewardVisible: document.getElementById("rewardPop").classList.contains("is-visible"),
  prompt: document.getElementById("promptText").textContent.trim(),
  check: document.getElementById("checkPreview").textContent.trim(),
  button: document.getElementById("confirmRewardButton").textContent.trim(),
  hintDisabled: document.getElementById("hintToggleButton").disabled
}))()
`);
  assert(!held.rewardVisible, `reward opened before confirmation: ${JSON.stringify(held)}`);
  assert(held.prompt === "2개가 남았어요.", `final confirmation copy missing: ${JSON.stringify(held)}`);
  assert(held.check === "3 × 29 + 2 = 89", `final check equation missing: ${JSON.stringify(held)}`);
  assert(held.button === "별빛 열기", `wrong final confirmation button: ${JSON.stringify(held)}`);
  assert(held.hintDisabled, `hint should be disabled during final confirmation: ${JSON.stringify(held)}`);

  await evaluate(`
(() => {
  state.problems = buildProblems();
  state.index = TOTAL_QUESTIONS - 1;
  state.correct = 7;
  state.starScore = 58;
  state.remainderStars = 8;
})()
`);
  await click("#confirmRewardButton");
  await waitUntil('document.getElementById("rewardPop").classList.contains("is-visible")', "reward did not open after confirmation", 4000);
  await capture("04-reward.png");
  await click("#rewardNextButton");
  await waitUntil('document.getElementById("resultScreen").classList.contains("is-active")', "result screen did not open");
  await waitUntil('!document.getElementById("restartButton").hidden', "result did not finish measuring", 3500);
  await capture("08-result.png");

  const resultSnapshot = await evaluate(`
(() => ({
  destination: document.getElementById("resultDestinationSvg").textContent.trim(),
  score: document.getElementById("resultScoreSvg").textContent.trim(),
  measure: document.getElementById("resultMeasureSvg").textContent.trim(),
  finalCorrect: document.getElementById("finalCorrectText").textContent.trim(),
  forbiddenResultNodes: document.querySelectorAll("#resultScreen .result-stats, #resultScreen .result-stat, #resultScreen .result-copy, #resultScreen .result-card").length,
  resultTitleHidden: document.getElementById("resultTitle").classList.contains("visually-hidden"),
  praiseHidden: document.getElementById("praiseText").classList.contains("visually-hidden")
}))()
`);
  assert(resultSnapshot.destination && resultSnapshot.destination !== "별빛 측정", `result destination did not settle: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.score === resultSnapshot.finalCorrect, `result score mismatch: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.measure.startsWith("별빛") || resultSnapshot.measure === "무지개 별", `result measure missing: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.forbiddenResultNodes === 0, `legacy result nodes remain: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.resultTitleHidden && resultSnapshot.praiseHidden, `result a11y text leaked: ${JSON.stringify(resultSnapshot)}`);

  return { contract, mathModel, rewardModel, resultSnapshot };
}

async function runTabletScenario() {
  await navigate(VIEWPORTS.tablet);
  await capture("tablet-01-cover.png");
  await loadFixedProblem();
  const tabletQuotientUi = await evaluate(`
(() => ({
  prompt: document.getElementById("promptText").textContent.trim(),
  divisorCardHeight: document.getElementById("divisorCard").getBoundingClientRect().height,
  divisorLabelFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#divisorCard span")).fontSize),
  divisorValueFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#divisorCard strong")).fontSize),
  firstChoiceHeight: document.querySelector("#choiceGrid button")?.getBoundingClientRect().height || 0,
  firstChoiceFontSize: Number.parseFloat(getComputedStyle(document.querySelector("#choiceGrid button")).fontSize)
}))()
`);
  assert(tabletQuotientUi.prompt === "3개씩 몇 번 묶을까요?", `tablet quotient prompt copy mismatch: ${JSON.stringify(tabletQuotientUi)}`);
  assert(tabletQuotientUi.divisorCardHeight >= 80, `tablet division card is too short: ${JSON.stringify(tabletQuotientUi)}`);
  assert(tabletQuotientUi.divisorLabelFontSize >= 15, `tablet division card label is too small: ${JSON.stringify(tabletQuotientUi)}`);
  assert(tabletQuotientUi.divisorValueFontSize >= 32, `tablet division card value is too small: ${JSON.stringify(tabletQuotientUi)}`);
  assert(tabletQuotientUi.firstChoiceHeight >= 78, `tablet choice button is too short: ${JSON.stringify(tabletQuotientUi)}`);
  assert(tabletQuotientUi.firstChoiceFontSize >= 23, `tablet choice button text is too small: ${JSON.stringify(tabletQuotientUi)}`);
  const tabletInitialRects = await evaluate(`
(() => {
  const board = document.querySelector(".division-board").getBoundingClientRect();
  const prompt = document.getElementById("promptText").getBoundingClientRect();
  const choices = document.getElementById("choiceGrid").getBoundingClientRect();
  return {
    boardBottom: board.bottom,
    promptTop: prompt.top,
    promptBottom: prompt.bottom,
    choicesTop: choices.top
  };
})()
`);
  assert(tabletInitialRects.boardBottom <= tabletInitialRects.promptTop + 1, `tablet prompt overlaps division board: ${JSON.stringify(tabletInitialRects)}`);
  assert(tabletInitialRects.promptBottom <= tabletInitialRects.choicesTop + 1, `tablet choices overlap prompt: ${JSON.stringify(tabletInitialRects)}`);
  await capture("tablet-03-problem.png");
  await clickChoiceByText("30묶음");
  await waitUntil('document.getElementById("groupProof").classList.contains("is-too-many")', "tablet too-many quotient proof did not show");
  await capture("tablet-03-problem-quotient-too-many.png");
  await loadFixedProblem();
  await clickChoiceByText("29묶음");
  await waitUntil('document.getElementById("groupProof").classList.contains("is-good")', "tablet correct quotient proof did not show");
  await capture("tablet-03-problem-quotient-good.png");
  await waitUntil("state.stepIndex === 1", "tablet quotient step did not complete");
  await capture("tablet-04-problem-remainder.png");
  await clickChoiceByText("2개");
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "tablet final confirmation button did not appear", 4000);
  await capture("tablet-05-final-confirm.png");

  await evaluate(`
(() => {
  state.correct = 8;
  state.starScore = 76;
  state.remainderStars = 10;
  state.rainbowStar = false;
  showResult();
})()
`);
  await waitUntil('document.getElementById("resultScreen").classList.contains("is-active")', "tablet result did not open");
  await waitUntil('!document.getElementById("restartButton").hidden', "tablet result did not finish", 3500);
  await capture("tablet-08-result.png");
}

const results = {};

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  results.desktop = await runDesktopScenario();
  await runTabletScenario();
  console.log("LESSON2_STAR_PICKUP_QA: PASS");
  console.log(JSON.stringify({ screenshots: SCREENSHOT_DIR, results }, null, 2));
  await cdp.close();
  browser.kill();
  await ignoreTimeout(waitForBrowserExit(2000), 2200);
  await rm(assertSafeProfilePath(PROFILE), { recursive: true, force: true });
  await rm(assertSafeProfileBasePath(PROFILE_BASE), { recursive: true, force: true });
  process.exit(0);
} catch (error) {
  console.error(error);
  await cdp.close();
  browser.kill();
  await ignoreTimeout(waitForBrowserExit(2000), 2200);
  await rm(assertSafeProfilePath(PROFILE), { recursive: true, force: true });
  await rm(assertSafeProfileBasePath(PROFILE_BASE), { recursive: true, force: true });
  process.exit(1);
}
