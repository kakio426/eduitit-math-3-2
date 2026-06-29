import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve, sep } from "node:path";

const ROOT = resolve(process.cwd());
const LESSON = join(ROOT, "3-2-2-2-mathmon-elevator");
const SCREENSHOT_DIR = join(LESSON, "screenshots");
const PROFILE_BASE = join(SCREENSHOT_DIR, ".qa-profile");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html`;
const PORT = Number(process.env.LESSON2_ELEVATOR_QA_PORT || 9262);
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
      this.pending.set(id, { resolve, reject });
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

async function waitUntil(predicateSource, message, timeout = 3500) {
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
  await cdp.send("Page.navigate", {
    url: `${FILE_URL}?qa=${viewport.name}-${Date.now()}`
  });
  await waitUntil("document.readyState === 'complete'", `${viewport.name}: page did not finish loading`, 6000);
  await delay(700);
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

async function clickWrongChoice() {
  await click('#choiceGrid [data-correct="false"]');
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
    ".stat-pill",
    ".choice-button",
    ".feedback",
    ".prompt",
    ".step-formula",
    ".answer-cell",
    ".down-box",
    ".result-stat",
    ".result-copy h2",
    ".praise",
    ".reward-delta",
    ".arrival-floor"
  ].join(",");
  const screen = document.querySelector(".screen.is-active");
  const screenRect = screen.getBoundingClientRect();
  const summarize = (node, reason) => ({
    reason,
    tag: node.tagName,
    className: node.className,
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
    screenRect: {
      top: Math.round(screenRect.top),
      right: Math.round(screenRect.right),
      bottom: Math.round(screenRect.bottom),
      left: Math.round(screenRect.left)
    },
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
  const keyFor = (problem) => \`\${problem.dividend}/\${problem.divisor}=\${problem.quotient}\`;
  const validate = (problem) => {
    const issues = [];
    const steps = buildSteps(problem);
    const tensDigit = Math.floor(problem.dividend / 10);
    const onesDigit = problem.dividend % 10;
    if (problem.dividend < 20 || problem.dividend > 99) issues.push("not-two-digit");
    if (problem.divisor < 2 || problem.divisor > 8) issues.push("bad-divisor");
    if (problem.divisor * problem.quotient !== problem.dividend) issues.push("bad-quotient");
    if (problem.tensDigit !== tensDigit || problem.onesDigit !== onesDigit) issues.push("bad-place-digits");
    if (problem.tensQuot !== Math.floor(problem.tensDigit / problem.divisor)) issues.push("bad-tens-quot");
    if (problem.remainderTens !== problem.tensDigit % problem.divisor) issues.push("bad-remainder-tens");
    if (problem.remainderTens === 0) issues.push("no-carry-down");
    if (problem.carryDown !== problem.remainderTens * 10) issues.push("bad-carry-down");
    if (problem.downNumber !== problem.carryDown + problem.onesDigit) issues.push("bad-down-number");
    if (problem.downNumber % problem.divisor !== 0) issues.push("final-remainder");
    if (problem.onesQuot !== problem.downNumber / problem.divisor) issues.push("bad-ones-quot");
    if (!steps[1].options.some((option) => option.key === \`down:\${problem.onesDigit}\` && option.label.includes("일의 자리만"))) {
      issues.push("missing-down-no-carry-wrong");
    }
    if (!steps[2].options.some((option) => option.key === \`ones:\${Math.floor(problem.onesDigit / problem.divisor)}\`)) {
      issues.push("missing-ones-no-carry-wrong");
    }
    return { key: keyFor(problem), issues };
  };
  const candidates = getProblemCandidates();
  const candidateKeys = new Set(candidates.map(keyFor));
  const sampledProblems = [];
  for (let index = 0; index < 20; index += 1) {
    sampledProblems.push(...buildProblems());
  }
  const failures = candidates.map(validate).filter((item) => item.issues.length > 0);
  const sampleFailures = sampledProblems.map(validate).filter((item) => item.issues.length > 0);
  const sampleNotFromBank = sampledProblems
    .filter((problem) => !candidateKeys.has(keyFor(problem)))
    .map(keyFor);
  return {
    candidateCount: candidates.length,
    sampledCount: sampledProblems.length,
    failures: failures.slice(0, 5),
    sampleFailures: sampleFailures.slice(0, 5),
    sampleNotFromBank: sampleNotFromBank.slice(0, 5)
  };
})()
`);
  assert(result.candidateCount > 20, `math model candidate count too small: ${JSON.stringify(result)}`);
  assert(result.failures.length === 0, `math model failures: ${JSON.stringify(result.failures)}`);
  assert(result.sampledCount === TOTAL_QUESTIONS * 20, `buildProblems sample count wrong: ${JSON.stringify(result)}`);
  assert(result.sampleFailures.length === 0, `buildProblems sample failures: ${JSON.stringify(result.sampleFailures)}`);
  assert(result.sampleNotFromBank.length === 0, `buildProblems emitted non-bank problems: ${JSON.stringify(result.sampleNotFromBank)}`);
  return result;
}

async function verifyRewardModel() {
  const result = await evaluate(`
(() => {
  const amountPicker = (min) => min;
  const cases = [
    { roll: 1, id: "motor", label: "힘 +5" },
    { roll: 80, id: "blackout", label: "힘 -5" },
    { roll: 90, id: "superMotor", label: "힘 +13" },
    { roll: 97.7, id: "express", label: "급행!" },
    { roll: 99, id: "stop", label: "힘 0" },
    { roll: 99.99, id: "rainbow", label: "무지개!" }
  ];
  return cases.map((expected) => {
    const event = pickPowerEventForRoll(expected.roll, amountPicker);
    const label = getPowerEventDeltaLabel({ ...event, actualDelta: event.amount });
    return { expected, actual: { id: event.id, label } };
  });
})()
`);
  const failures = result.filter((item) => item.expected.id !== item.actual.id || item.expected.label !== item.actual.label);
  assert(failures.length === 0, `reward model failures: ${JSON.stringify(failures)}`);
  return result;
}

async function runDesktopScenario() {
  await navigate(VIEWPORTS.desktop);
  await capture("01-cover.png");
  await click("#startButton");
  await waitUntil('document.getElementById("tutorialScreen").classList.contains("is-active")', "tutorial did not open");
  await capture("02-tutorial.png");
  await click("#tutorialNextButton");
  await waitUntil('document.getElementById("playScreen").classList.contains("is-active") && document.querySelectorAll("#choiceGrid button").length === 4', "play screen did not start");

  const mathModel = await verifyMathModel();
  const rewardModel = await verifyRewardModel();

  await capture("03-problem.png");
  await click("#hintToggleButton");
  await waitUntil('document.getElementById("hintToggleButton").getAttribute("aria-expanded") === "true"', "hint did not open");
  await capture("03-problem-hint.png");
  await click("#hintToggleButton");
  await waitUntil('document.getElementById("hintToggleButton").getAttribute("aria-expanded") === "false"', "hint did not close");

  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 1", "first step did not complete");
  await capture("03-problem-step2.png");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 2", "second step did not complete");
  await clickCorrectChoice();
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "final confirmation button did not appear");
  await capture("03-final-confirm.png");

  const held = await evaluate(`
(() => ({
  rewardVisible: document.getElementById("rewardPop").classList.contains("is-visible"),
  prompt: document.getElementById("promptText").textContent.trim(),
  feedback: document.getElementById("feedbackText").textContent.trim(),
  button: document.getElementById("confirmRewardButton").textContent.trim()
}))()
`);
  assert(!held.rewardVisible, `reward opened before confirmation: ${JSON.stringify(held)}`);
  assert(held.prompt.startsWith("답 ") && held.prompt.includes("완성"), `final answer confirmation copy missing: ${JSON.stringify(held)}`);
  assert(held.button === "엘리베이터 움직이기", `wrong final confirmation button: ${JSON.stringify(held)}`);
  assert(await evaluate('document.getElementById("hintToggleButton").disabled'), "hint button should be disabled during final confirmation");
  await click("#hintToggleButton");
  await delay(120);
  const afterHintClick = await evaluate(`
(() => ({
  stepIndex: state.stepIndex,
  awaitingRewardConfirm: state.awaitingRewardConfirm,
  confirmHidden: document.getElementById("confirmRewardButton").hidden,
  feedback: document.getElementById("feedbackText").textContent.trim()
}))()
`);
  assert(afterHintClick.stepIndex === 2 && afterHintClick.awaitingRewardConfirm && !afterHintClick.confirmHidden, `hint click broke final confirmation: ${JSON.stringify(afterHintClick)}`);
  const afterHintPrompt = await evaluate('document.getElementById("promptText").textContent.trim()');
  assert(afterHintPrompt.startsWith("답 ") && afterHintPrompt.includes("완성"), `hint click cleared final answer confirmation: ${JSON.stringify({ ...afterHintClick, prompt: afterHintPrompt })}`);

  await evaluate(`
(() => {
  state.index = TOTAL_QUESTIONS - 1;
  state.correct = 8;
  state.power = 81;
  rollPowerEvent = () => ({ id: "motor", amount: 7, title: "힘이 늘었어요", message: "힘이 늘었어요." });
})()
`);
  await click("#confirmRewardButton");
  await waitUntil('document.getElementById("rewardPop").classList.contains("is-visible")', "reward modal did not open after confirmation");
  const rewardSnapshot = await evaluate(`
(() => {
  const isActuallyHidden = (id) => {
    const node = document.getElementById(id);
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
  return {
    delta: document.getElementById("rewardDelta").textContent.trim(),
    titleHidden: isActuallyHidden("rewardTitle"),
    messageHidden: isActuallyHidden("rewardMessage"),
    button: document.getElementById("rewardNextButton").textContent.trim()
  };
})()
`);
  assert(rewardSnapshot.delta === "힘 +7", `reward delta wrong: ${JSON.stringify(rewardSnapshot)}`);
  assert(rewardSnapshot.titleHidden && rewardSnapshot.messageHidden, `reward modal still shows extra copy: ${JSON.stringify(rewardSnapshot)}`);
  assert(rewardSnapshot.button === "보기", `final reward button should be 보기: ${JSON.stringify(rewardSnapshot)}`);
  await capture("04-reward.png");

  await click("#rewardNextButton");
  await waitUntil('document.getElementById("resultScreen").classList.contains("is-active")', "result screen did not open");
  await waitUntil('!document.getElementById("resultScreen").classList.contains("is-measuring")', "result screen did not finish measuring", 4200);
  const resultSnapshot = await evaluate(`
(() => {
  const isActuallyHidden = (id) => {
    const node = document.getElementById(id);
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
  return {
    praiseHidden: isActuallyHidden("praiseText"),
    titleHidden: isActuallyHidden("resultTitle"),
    measureHidden: isActuallyHidden("resultMeasure"),
    title: document.getElementById("resultTitle").textContent.trim(),
    power: document.getElementById("finalPowerText").textContent.trim(),
    correct: document.getElementById("finalCorrectText").textContent.trim()
  };
})()
`);
  assert(resultSnapshot.praiseHidden, `result screen still shows fixed praise copy: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.titleHidden, `result screen still shows fixed destination copy: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.measureHidden, `result screen still shows fixed measure panel: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.power.startsWith("힘") || resultSnapshot.power === "무지개 힘", `result power label wrong: ${JSON.stringify(resultSnapshot)}`);
  assert(resultSnapshot.correct.includes("/"), `result correct count missing: ${JSON.stringify(resultSnapshot)}`);
  await capture("05-result-success.png");

  await evaluate(`
(() => {
  state.power = 0;
  state.correct = 0;
  state.rainbowPower = false;
  showResult();
})()
`);
  await waitUntil('!document.getElementById("resultScreen").classList.contains("is-measuring")', "retry result did not finish", 4200);
  await capture("06-result-retry.png");

  await evaluate(`
(() => {
  state.power = 100;
  state.correct = 0;
  state.rainbowPower = true;
  showResult();
})()
`);
  await waitUntil('!document.getElementById("resultScreen").classList.contains("is-measuring")', "rainbow result did not finish", 4200);
  await capture("08-result-rainbow.png");

  return { mathModel, rewardModel };
}

async function runWrongAnswerScenario() {
  await navigate(VIEWPORTS.desktop);
  await click("#startButton");
  await waitUntil('document.getElementById("tutorialScreen").classList.contains("is-active")', "wrong path tutorial did not open");
  await click("#tutorialNextButton");
  await waitUntil('document.getElementById("playScreen").classList.contains("is-active") && document.querySelectorAll("#choiceGrid button").length === 4', "wrong path play screen did not start");
  await evaluate(`
(() => {
  state.problems = [getProblemCandidates()[0]];
  state.index = 0;
  state.power = 30;
  state.correct = 0;
  state.rainbowPower = false;
  state.express = false;
  state.lastPowerEvent = null;
  renderProblem();
})()
`);
  await clickWrongChoice();
  await waitUntil("state.problemHadMistake === true", "wrong path did not mark mistake");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 1", "wrong path first step did not advance");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 2", "wrong path second step did not advance");
  await clickCorrectChoice();
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "wrong path final confirmation did not appear");
  await click("#confirmRewardButton");
  await waitUntil('document.getElementById("rewardPop").classList.contains("is-visible")', "wrong path reward modal did not open");
  const wrongReward = await evaluate(`
(() => ({
  correct: state.correct,
  eventId: state.lastPowerEvent && state.lastPowerEvent.id,
  delta: document.getElementById("rewardDelta").textContent.trim(),
  button: document.getElementById("rewardNextButton").textContent.trim()
}))()
`);
  assert(wrongReward.correct === 0, `wrong answer should not count as correct: ${JSON.stringify(wrongReward)}`);
  assert(wrongReward.eventId === "blackout", `wrong answer should force blackout: ${JSON.stringify(wrongReward)}`);
  assert(wrongReward.delta.startsWith("힘 -"), `wrong answer should show loss delta: ${JSON.stringify(wrongReward)}`);
  assert(wrongReward.button === "다음", `wrong answer non-final reward should continue: ${JSON.stringify(wrongReward)}`);
  return wrongReward;
}

async function runTabletScenario() {
  await navigate(VIEWPORTS.tablet);
  await capture("07-tablet-cover.png");
  await click("#startButton");
  await waitUntil('document.getElementById("tutorialScreen").classList.contains("is-active")', "tablet tutorial did not open");
  await capture("09-tablet-tutorial.png");
  await click("#tutorialNextButton");
  await waitUntil('document.getElementById("playScreen").classList.contains("is-active") && document.querySelectorAll("#choiceGrid button").length === 4', "tablet play screen did not start");
  await capture("10-tablet-problem.png");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 1", "tablet first step did not complete");
  await clickCorrectChoice();
  await waitUntil("state.stepIndex === 2", "tablet second step did not complete");
  await clickCorrectChoice();
  await waitUntil('!document.getElementById("confirmRewardButton").hidden', "tablet final confirmation button did not appear");
  await capture("11-tablet-final-confirm.png");
  await evaluate(`
(() => {
  state.index = TOTAL_QUESTIONS - 1;
  state.correct = 8;
  state.power = 81;
  rollPowerEvent = () => ({ id: "motor", amount: 7, title: "힘이 늘었어요", message: "힘이 늘었어요." });
})()
`);
  await click("#confirmRewardButton");
  await waitUntil('document.getElementById("rewardPop").classList.contains("is-visible")', "tablet reward modal did not open");
  await click("#rewardNextButton");
  await waitUntil('document.getElementById("resultScreen").classList.contains("is-active")', "tablet result screen did not open");
  await waitUntil('!document.getElementById("resultScreen").classList.contains("is-measuring")', "tablet result screen did not finish measuring", 4200);
  await capture("12-tablet-result.png");
}

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const desktop = await runDesktopScenario();
  const wrongAnswer = await runWrongAnswerScenario();
  await runTabletScenario();
  console.log("LESSON2_ELEVATOR_QA: PASS");
  console.log(JSON.stringify({ screenshots: SCREENSHOT_DIR, desktop, wrongAnswer }, null, 2));
} finally {
  await Promise.race([
    cdp.send("Browser.close").catch(() => {}),
    delay(1000)
  ]);
  await cdp.close();
  if (!hasBrowserExited()) {
    browser.kill();
    await waitForBrowserExit(5000);
  }
  if (!hasBrowserExited()) {
    browser.kill("SIGKILL");
    await waitForBrowserExit(2000);
  }
  await rm(assertSafeProfilePath(PROFILE), { recursive: true, force: true });
  await rm(assertSafeProfileBasePath(PROFILE_BASE), { recursive: true, force: true });
}
