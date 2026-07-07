import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd());
const LESSON = join(ROOT, "3-2-2-4-mathmon-check-lock");
const SCREENSHOT_DIR = join(LESSON, "screenshots");
const PROFILE_BASE = join(SCREENSHOT_DIR, ".qa-profile");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html`;
const PORT = Number(process.env.LESSON2_LOCK_QA_PORT || 9264);
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
    ".rebuild-board",
    ".rebuild-canvas",
    ".step-chip",
    ".formula-summary",
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
  const keyFor = (problem) => \`\${problem.dividend}/\${problem.divisor}=\${problem.quotient}...\${problem.remainder}\`;
  const validate = (problem) => {
    const issues = [];
    const steps = buildSteps(problem);
    const rebuilt = problem.divisor * problem.quotient + problem.remainder;
    const original = problem.divisor * problem.trueQuotient + problem.trueRemainder;
    if (problem.dividend < 20 || problem.dividend > 99) issues.push("not-two-digit");
    if (problem.divisor < 2 || problem.divisor > 9) issues.push("bad-divisor");
    if (problem.quotient < 4 || problem.quotient > 18) issues.push("bad-quotient-range");
    if (problem.remainder <= 0 || problem.remainder >= problem.divisor) issues.push("bad-remainder");
    if (problem.product !== problem.divisor * problem.quotient) issues.push("bad-product");
    if (problem.dividend !== original) issues.push("bad-original-equation");
    if (problem.answer !== rebuilt || problem.omission !== problem.product) issues.push("bad-check-values");
    if (problem.matchesOriginal !== (problem.answer === problem.dividend)) issues.push("bad-match-flag");
    if (problem.matchesOriginal && problem.mismatchPart !== null) issues.push("unexpected-mismatch-part");
    if (!problem.matchesOriginal && !["quotient", "remainder"].includes(problem.mismatchPart)) issues.push("missing-mismatch-part");
    if (steps.length !== (problem.matchesOriginal ? 3 : 4)) issues.push("bad-step-count");
    if (steps[0]?.id !== "multiply" || steps[1]?.id !== "add" || steps[2]?.id !== "dial") issues.push("bad-steps");
    if (!problem.matchesOriginal && steps[3]?.id !== "locate") issues.push("missing-locate-step");
    if (!steps[1].distractors.includes(problem.omission)) issues.push("missing-omit-remainder-distractor");
    return { key: keyFor(problem), issues };
  };
  const sampledProblems = [];
  for (let index = 0; index < 20; index += 1) {
    sampledProblems.push(...buildProblems());
  }
  const duplicateRun = buildProblems();
  const matchingCount = duplicateRun.filter((problem) => problem.matchesOriginal).length;
  const mismatchingCount = duplicateRun.filter((problem) => !problem.matchesOriginal).length;
  return {
    sampledCount: sampledProblems.length,
    sampleFailures: sampledProblems.map(validate).filter((item) => item.issues.length > 0).slice(0, 5),
    duplicateCount: duplicateRun.length - new Set(duplicateRun.map(keyFor)).size,
    matchingCount,
    mismatchingCount
  };
})()
`);
  assert(result.sampledCount === TOTAL_QUESTIONS * 20, `buildProblems sample count wrong: ${JSON.stringify(result)}`);
  assert(result.sampleFailures.length === 0, `buildProblems sample failures: ${JSON.stringify(result.sampleFailures)}`);
  assert(result.duplicateCount === 0, `one build emitted duplicate problems: ${JSON.stringify(result)}`);
  assert(result.matchingCount === 6 && result.mismatchingCount === 4, `one build did not keep 6/4 card mix: ${JSON.stringify(result)}`);
  return result;
}

async function verifyRewardModel() {
  const result = await evaluate(`
(() => {
  const amountPicker = (min) => min;
  const cases = [
    { roll: 1, id: "normal", label: "+7%" },
    { roll: 70, id: "error", label: "-4%" },
    { roll: 82, id: "boost", label: "+18%" },
    { roll: 90, id: "master", label: "마스터키" },
    { roll: 95, id: "reset", label: "0%" },
    { roll: 98, id: "rainbow", label: "무지개" }
  ];
  return cases.map((expected) => {
    const event = pickLockEventForRoll(expected.roll, amountPicker);
    const label = getLockEventDeltaLabel({ ...event, actualDelta: event.amount });
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

  await evaluate(`
(() => {
  state.index = 0;
  state.problems[0] = createProblem(6, 9, 5, true);
  renderProblem();
})()
`);
  await capture("03-problem.png");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 1", "multiply step did not complete");
  await capture("03b-problem-step1-filled.png");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 2", "add step did not complete");
  await capture("03c-problem-step2-filled.png");
  await clickCorrectChoice();
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "final confirmation button did not appear", 4000);
  await capture("03-final-confirm.png");

  const held = await evaluate(`
(() => ({
  rewardVisible: document.getElementById("rewardPop").classList.contains("is-visible"),
  prompt: document.getElementById("promptText").textContent.trim(),
  button: document.getElementById("confirmRewardButton").textContent.trim()
}))()
`);
  assert(!held.rewardVisible, `reward opened before confirmation: ${JSON.stringify(held)}`);
  assert(held.prompt === "처음 수가 다시 나왔어요.", `final confirmation copy missing: ${JSON.stringify(held)}`);
  assert(held.button === "자물쇠 돌리기", `wrong final confirmation button: ${JSON.stringify(held)}`);

  await evaluate(`
(() => {
  state.index = 0;
  state.problems[0] = {
    divisor: 8,
    quotient: 8,
    remainder: 3,
    trueQuotient: 7,
    trueRemainder: 3,
    product: 64,
    dividend: 59,
    answer: 67,
    omission: 64,
    matchesOriginal: false,
    mismatchPart: "quotient"
  };
  renderProblem();
})()
`);
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 1", "mismatch multiply step did not complete");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 2", "mismatch add step did not complete");
  await clickCorrectChoice();
  await waitUntil('state.stepIndex === 3 && document.getElementById("phaseLabel").textContent.trim() === "틀린 곳 찾기"', "locate step did not appear", 4000);
  await capture("03d-mismatch-locate.png");
  await clickCorrectChoice();
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "mismatch confirmation button did not appear", 4000);
  await capture("03e-mismatch-confirm.png");

  const mismatchHeld = await evaluate(`
(() => ({
  prompt: document.getElementById("promptText").textContent.trim(),
  formula: document.getElementById("formulaSummary").textContent.trim(),
  chips: [...document.querySelectorAll("#stepChipRow .step-chip")].map((chip) => chip.textContent.trim()),
  buttonsVisible: !document.getElementById("choiceGrid").hidden
}))()
`);
  assert(mismatchHeld.prompt === "몫이 달라서 처음 수가 안 됐어요.", `mismatch confirmation copy missing: ${JSON.stringify(mismatchHeld)}`);
  assert(mismatchHeld.formula === "8 × 8 + 3 = 67", `mismatch formula summary missing: ${JSON.stringify(mismatchHeld)}`);
  assert(mismatchHeld.chips.length === 4 && mismatchHeld.chips.at(-1) === "4 틀린 곳", `mismatch step chips wrong: ${JSON.stringify(mismatchHeld)}`);
  assert(!mismatchHeld.buttonsVisible, `choice buttons stayed visible on mismatch confirmation: ${JSON.stringify(mismatchHeld)}`);

  await evaluate("state.index = TOTAL_QUESTIONS - 1; state.correct = 8; state.unlockPower = 76; state.rainbowCore = false;");
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
  assert(resultSnapshot.destination && resultSnapshot.destination !== "금고 측정", `result destination did not settle: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.score === resultSnapshot.finalCorrect, `result score mismatch: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.measure.endsWith("%") || resultSnapshot.measure === "무지개 코어", `result measure missing: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.forbiddenResultNodes === 0, `legacy result nodes remain: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.resultTitleHidden && resultSnapshot.praiseHidden, `result a11y text leaked: ${JSON.stringify(resultSnapshot)}`);

  return { contract, mathModel, rewardModel, resultSnapshot };
}

async function runTabletScenario() {
  await navigate(VIEWPORTS.tablet);
  await capture("tablet-01-cover.png");
  await evaluate(`
(() => {
  showScreen("play");
  state.problems = [createProblem(6, 9, 5, true)];
  state.index = 0;
  state.unlockPower = 32;
  state.correct = 3;
  renderProblem();
})()
`);
  await waitUntil('document.getElementById("playScreen").classList.contains("is-active") && document.querySelectorAll("#choiceGrid button").length === 4', "tablet play did not render");
  await capture("tablet-03-problem.png");
  await evaluate(`
(() => {
  state.correct = 8;
  state.unlockPower = 86;
  state.rainbowCore = false;
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
  console.log("LESSON2_CHECK_LOCK_QA: PASS");
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
