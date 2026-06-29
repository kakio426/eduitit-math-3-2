#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const LESSON = "3-2-2-1-mathmon-divide-farm";
const LESSON_ROOT = path.join(ROOT, LESSON);
const SCREENSHOTS = path.join(LESSON_ROOT, "screenshots");
const SCREENSHOTS_RELATIVE = path.join(LESSON, "screenshots");
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
];
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800, prefix: "" },
  { name: "tablet", width: 1024, height: 640, prefix: "tablet-" }
];
const SCREENSHOT_NAMES = {
  cover: "01-cover.png",
  tutorial: "02-tutorial.png",
  step1: "03-problem-step1.png",
  step2: "04-problem-step2.png",
  confirm: "05-final-confirm.png",
  reward: "06-reward.png",
  resultMeasure: "07-result-measuring.png",
  result: "08-result.png"
};
const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml; charset=utf-8"]
]);

function assert(condition, message, details = undefined) {
  if (!condition) {
    const error = new Error(message);
    if (details) error.details = details;
    throw error;
  }
}

function getChromePath() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  assert(chromePath, `No Chrome binary found in: ${CHROME_CANDIDATES.join(", ")}`);
  return chromePath;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close(() => port ? resolve(port) : reject(new Error("No free port allocated")));
    });
    server.on("error", reject);
  });
}

function makeServer(port) {
  const server = http.createServer((request, response) => {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "127.0.0.1"}`);
    if (requestUrl.pathname === "/favicon.ico") {
      response.writeHead(204);
      response.end();
      return;
    }
    const lessonPrefix = `/${LESSON}/`;
    if (requestUrl.pathname !== `/${LESSON}` && !requestUrl.pathname.startsWith(lessonPrefix)) {
      response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      response.end("not found");
      return;
    }
    const lessonRelativeUrl = requestUrl.pathname === `/${LESSON}`
      ? "/"
      : requestUrl.pathname.slice(lessonPrefix.length);
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(lessonRelativeUrl);
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("bad path");
      return;
    }
    const resolved = path.resolve(LESSON_ROOT, `.${decodedPath.startsWith("/") ? decodedPath : `/${decodedPath}`}`);
    const relativeToLesson = path.relative(LESSON_ROOT, resolved);
    if (relativeToLesson.startsWith("..") || path.isAbsolute(relativeToLesson)) {
      response.writeHead(403);
      response.end("forbidden");
      return;
    }
    const filePath = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()
      ? path.join(resolved, "index.html")
      : resolved;
    fs.readFile(filePath, (error, data) => {
      if (error) {
        response.writeHead(error.code === "ENOENT" ? 404 : 500, { "content-type": "text/plain; charset=utf-8" });
        response.end(error.code || "error");
        return;
      }
      response.writeHead(200, { "content-type": MIME.get(path.extname(filePath)) || "application/octet-stream" });
      response.end(data);
    });
  });
  return new Promise((resolve, reject) => {
    server.listen(port, "127.0.0.1", () => resolve(server));
    server.on("error", reject);
  });
}

function closeServer(server) {
  return new Promise((resolve) => server.close(resolve));
}

async function stopProcess(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return false;
  child.kill("SIGTERM");
  const exited = await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(2000).then(() => false)
  ]);
  if (exited) return true;
  child.kill("SIGKILL");
  await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(1000).then(() => false)
  ]);
  return true;
}

async function fetchJson(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status} for ${url}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw lastError || new Error(`Failed to fetch ${url}`);
}

class Cdp {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.nextId = 1;
    this.pending = new Map();
  }

  async open() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
    this.ws.addEventListener("message", (event) => this.onMessage(event));
  }

  onMessage(event) {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const pending = this.pending.get(message.id);
    if (!pending) return;
    this.pending.delete(message.id);
    if (message.error) {
      pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
      return;
    }
    pending.resolve(message.result || {});
  }

  send(method, params = {}) {
    const id = this.nextId++;
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

  close() {
    this.ws.close();
  }
}

async function waitForPageTarget(debugPort, lessonUrl) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`, 1).catch(() => []);
    const target = targets.find((item) => item.type === "page" && item.url.startsWith(lessonUrl))
      || targets.find((item) => item.type === "page" && item.url.includes(`/${LESSON}/index.html`));
    if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    await delay(100);
  }
  throw new Error("Chrome page target was not exposed over CDP");
}

async function launchChrome(pageUrl, debugPort, profileDir) {
  const chrome = spawn(getChromePath(), [
    "--headless=new",
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "--mute-audio",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-popup-blocking",
    "--window-size=1280,800",
    pageUrl
  ], { stdio: "ignore" });
  await fetchJson(`http://127.0.0.1:${debugPort}/json/version`);
  return chrome;
}

async function waitForLoad(page) {
  await page.send("Runtime.evaluate", {
    expression: "new Promise((resolve) => { if (document.readyState === 'complete') resolve(true); else window.addEventListener('load', () => resolve(true), { once: true }); })",
    awaitPromise: true,
    returnByValue: true
  });
  await page.send("Runtime.evaluate", {
    expression: "Promise.all([document.fonts?.ready || Promise.resolve(), ...[...document.images].map((img) => img.complete ? true : new Promise((resolve) => img.addEventListener('load', resolve, { once: true })))])",
    awaitPromise: true,
    returnByValue: true
  });
}

async function evalInPage(page, expression) {
  const result = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  }
  return result.result?.value;
}

async function waitUntil(page, expression, message, timeout = 4000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evalInPage(page, expression)) return;
    await delay(80);
  }
  const snapshot = await readSnapshot(page).catch(() => ({}));
  throw new Error(`${message}; snapshot=${JSON.stringify(snapshot)}`);
}

async function setViewport(page, viewport) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 }
  });
}

async function loadLesson(page, lessonUrl, viewport) {
  await setViewport(page, viewport);
  await page.send("Page.addScriptToEvaluateOnNewDocument", {
    source: `(() => {
      let qaSeed = 246813579;
      Object.defineProperty(Math, "random", {
        value: () => {
          qaSeed = (Math.imul(qaSeed, 1664525) + 1013904223) >>> 0;
          return (qaSeed / 4294967296) * 0.9;
        },
        configurable: true
      });
      const nativeSetTimeout = window.setTimeout.bind(window);
      Object.defineProperty(window, "setTimeout", {
        value: (handler, timeout = 0, ...args) => nativeSetTimeout(handler, timeout > 1800 ? timeout : Math.min(timeout, 120), ...args),
        configurable: true
      });
    })();`
  });
  await page.send("Page.navigate", { url: `${lessonUrl}?qa=${viewport.name}-${Date.now()}` });
  await waitForLoad(page);
  await evalInPage(page, `document.getElementById("soundToggle").click()`);
  await delay(250);
}

async function clickById(page, id) {
  await evalInPage(page, `document.getElementById(${JSON.stringify(id)}).click()`);
}

async function capture(page, viewport, key) {
  await fsp.mkdir(SCREENSHOTS, { recursive: true });
  const fileName = `${viewport.prefix}${SCREENSHOT_NAMES[key]}`;
  const result = await page.send("Page.captureScreenshot", { format: "png", fromSurface: true });
  await fsp.writeFile(path.join(SCREENSHOTS, fileName), Buffer.from(result.data, "base64"));
  return fileName;
}

async function verifyModel(page) {
  const model = await evalInPage(page, String.raw`
(() => {
  const qa = window.__divideFarmQa;
  const candidates = qa.buildProblemCandidates();
  const invalidCandidates = candidates.filter((problem) => {
    return problem.dividend < 20
      || problem.dividend > 99
      || problem.divisor < 2
      || problem.divisor > 9
      || problem.tens % problem.divisor !== 0
      || problem.ones % problem.divisor !== 0
      || problem.answer !== problem.tensQuot * 10 + problem.onesQuot
      || problem.answer < 10;
  }).map(qa.getProblemKey);
  const run = qa.buildProblems();
  const runKeys = run.map(qa.getProblemKey);
  const duplicateRunKeys = runKeys.filter((key, index) => runKeys.indexOf(key) !== index);
  const divisorsInRun = [...new Set(run.map((problem) => problem.divisor))];
  const stepFailures = [];
  for (const problem of candidates) {
    const steps = qa.buildSteps(problem);
    if (steps.length !== 3 || steps[0].id !== "tens" || steps[1].id !== "ones" || steps[2].id !== "combine") {
      stepFailures.push(qa.getProblemKey(problem) + ": step order");
      continue;
    }
    const combineOptions = qa.buildStepOptions(steps[2], problem);
    const placeMistake = problem.tensQuot + problem.onesQuot;
    if (!combineOptions.some((option) => option.value === placeMistake)) {
      stepFailures.push(qa.getProblemKey(problem) + ": missing place-value mistake " + placeMistake);
    }
  }
  const eventSamples = {
    normal: qa.pickFuelEventForRoll(0, () => 7),
    smallExplosion: qa.pickFuelEventForRoll(80, () => 7),
    megaFuel: qa.pickFuelEventForRoll(90, () => 7),
    instantLaunch: qa.pickFuelEventForRoll(97.6, () => 7),
    emptyTank: qa.pickFuelEventForRoll(98.5, () => 7),
    rainbowFuel: qa.pickFuelEventForRoll(99.99, () => 7),
    leak: qa.createLeakEvent()
  };
  return {
    candidateCount: candidates.length,
    invalidCandidates,
    runCount: run.length,
    duplicateRunKeys,
    divisorsInRun,
    stepFailures,
    eventSamples
  };
})()
`);
  assert(model.candidateCount === 48, "candidate problem count changed", model);
  assert(model.invalidCandidates.length === 0, "candidate set contains remainder/borrowing problems", model);
  assert(model.runCount === 10, "one round must contain 10 problems", model);
  assert(model.duplicateRunKeys.length === 0, "one round contains duplicated problems", model);
  assert(model.divisorsInRun.length >= 8, "one round should cover all eight divisors before filling extras", model);
  assert(model.stepFailures.length === 0, "step model is missing expected combine mistakes", model);
  assert(model.eventSamples.normal.id === "normal" && model.eventSamples.normal.amount === 7, "normal reward roll changed", model);
  assert(model.eventSamples.smallExplosion.id === "smallExplosion" && model.eventSamples.smallExplosion.amount === -7, "loss reward roll changed", model);
  assert(model.eventSamples.megaFuel.id === "megaFuel" && model.eventSamples.megaFuel.amount === 7, "large reward roll changed", model);
  assert(model.eventSamples.instantLaunch.id === "instantLaunch", "big harvest roll changed", model);
  assert(model.eventSamples.emptyTank.id === "emptyTank", "empty basket roll changed", model);
  assert(model.eventSamples.rainbowFuel.id === "rainbowFuel", "golden reward roll changed", model);
  assert(model.eventSamples.leak.id === "leak" && model.eventSamples.leak.amount < 0, "wrong-answer leak event changed", model);
  return model;
}

async function readSnapshot(page) {
  return evalInPage(page, String.raw`
(() => {
  const active = document.querySelector(".screen.is-active")?.id || "";
  const playActive = active === "playScreen";
  const rewardPop = document.getElementById("rewardPop");
  const rewardVisible = playActive && rewardPop?.classList.contains("is-visible");
  const state = window.__divideFarmQa?.getState?.() || {};
  const choiceGrid = document.getElementById("choiceGrid");
  const choiceStyle = choiceGrid ? getComputedStyle(choiceGrid) : null;
  return {
    active,
    state,
    question: playActive ? document.getElementById("questionText")?.textContent.trim() || "" : "",
    prompt: playActive ? document.getElementById("promptText")?.textContent.trim() || "" : "",
    feedback: playActive ? document.getElementById("feedbackText")?.textContent.trim() || "" : "",
    answer: playActive ? document.getElementById("hundredsAnswer")?.textContent.trim() || "" : "",
    harvestVisible: playActive && !!document.getElementById("harvestButton") && !document.getElementById("harvestButton").hidden,
    choiceGridVisible: playActive && !!choiceGrid && !choiceGrid.hidden && choiceStyle?.display !== "none",
    rewardVisible,
    rewardDelta: rewardVisible ? document.getElementById("rewardDelta")?.textContent.trim() || "" : "",
    resultTitle: document.getElementById("resultTitle")?.textContent.trim() || "",
    soundText: document.getElementById("soundToggle")?.innerText.trim() || ""
  };
})()
`);
}

async function assertNoVisibleOverflow(page, label) {
  const problems = await evalInPage(page, String.raw`
(() => {
  const selectors = [
    "#coverScreen.is-active .hero-copy p",
    "#coverScreen.is-active #startButton",
    "#tutorialScreen.is-active .tutorial-copy",
    "#tutorialScreen.is-active #tutorialNextButton",
    "#playScreen.is-active #questionText",
    "#playScreen.is-active #phaseLabel",
    "#playScreen.is-active #stepFormula",
    "#playScreen.is-active #stepMeaning",
    "#playScreen.is-active #promptText",
    "#playScreen.is-active #feedbackText",
    "#playScreen.is-active .choice-button",
    "#playScreen.is-active #harvestButton",
    "#rewardPop.is-visible #rewardDelta",
    "#rewardPop.is-visible #rewardNextButton",
    "#resultScreen.is-active #resultTitle",
    "#resultScreen.is-active #praiseText",
    "#resultScreen.is-active .result-stat",
    "#resultScreen.is-active #restartButton"
  ];
  const visible = (element) => {
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  return selectors.flatMap((selector) => [...document.querySelectorAll(selector)]
    .filter(visible)
    .filter((element) => element.scrollWidth > element.clientWidth + 2 || element.scrollHeight > element.clientHeight + 2)
    .map((element) => ({
      selector,
      text: element.textContent.trim(),
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
      scrollHeight: element.scrollHeight,
      clientHeight: element.clientHeight
    })));
})()
`);
  assert(problems.length === 0, `${label}: visible text overflow detected`, problems);
  const soundText = await evalInPage(page, `document.getElementById("soundToggle").innerText.trim()`);
  assert(soundText === "", `${label}: sound button exposes visible text`, { soundText });
}

async function chooseCorrectStep(page) {
  return evalInPage(page, String.raw`
(() => {
  const qa = window.__divideFarmQa;
  const problem = qa.currentProblem();
  const state = qa.getState();
  const step = qa.buildSteps(problem)[state.stepIndex];
  const target = qa.formatStepAnswer(step, step.correct);
  const button = [...document.querySelectorAll("#choiceGrid .choice-button")]
    .find((candidate) => candidate.textContent.trim() === target && !candidate.disabled);
  if (!button) throw new Error("correct choice not found: " + target);
  button.click();
  return { stepId: step.id, stepIndex: state.stepIndex, target, answer: problem.answer };
})()
`);
}

async function chooseWrongStep(page) {
  return evalInPage(page, String.raw`
(() => {
  const qa = window.__divideFarmQa;
  const problem = qa.currentProblem();
  const state = qa.getState();
  const step = qa.buildSteps(problem)[state.stepIndex];
  const target = qa.formatStepAnswer(step, step.correct);
  const button = [...document.querySelectorAll("#choiceGrid .choice-button")]
    .find((candidate) => candidate.textContent.trim() !== target && !candidate.disabled);
  if (!button) throw new Error("wrong choice not found away from: " + target);
  const label = button.textContent.trim();
  button.click();
  return { stepId: step.id, stepIndex: state.stepIndex, wrongLabel: label, target };
})()
`);
}

async function waitForStep(page, stepIndex, label) {
  await waitUntil(page, `window.__divideFarmQa.getState().stepIndex === ${stepIndex}`, label, 3000);
}

async function waitForHarvest(page, label) {
  await waitUntil(page, `!document.getElementById("harvestButton").hidden && !document.getElementById("rewardPop").classList.contains("is-visible")`, label, 4000);
  const snapshot = await readSnapshot(page);
  assert(snapshot.answer.startsWith("몫 "), `${label}: final quotient is not visible before reward`, snapshot);
  assert(snapshot.feedback.endsWith("완성!"), `${label}: final confirmation copy missing`, snapshot);
  assert(snapshot.harvestVisible, `${label}: harvest button is not visible`, snapshot);
  assert(!snapshot.choiceGridVisible, `${label}: answer choices are still visible`, snapshot);
  return snapshot;
}

async function finishProblemFromConfirmation(page, label) {
  await clickById(page, "harvestButton");
  await waitUntil(page, `document.getElementById("rewardPop").classList.contains("is-visible")`, `${label}: reward did not open`, 4000);
  await assertNoVisibleOverflow(page, `${label} reward`);
  return readSnapshot(page);
}

async function playProblem(page, options = {}) {
  const { wrongFirstStep = false, expectLeak = false } = options;
  if (wrongFirstStep) {
    await chooseWrongStep(page);
    await delay(180);
    const retrySnapshot = await readSnapshot(page);
    assert(retrySnapshot.feedback.includes("다시 골라요"), "first wrong answer should keep the student on the step", retrySnapshot);
    await chooseWrongStep(page);
    await waitForStep(page, 1, "second wrong answer did not reveal and move to the next step");
  }

  for (;;) {
    const before = await evalInPage(page, `window.__divideFarmQa.getState().stepIndex`);
    await chooseCorrectStep(page);
    if (before >= 2) break;
    await waitForStep(page, before + 1, `correct step ${before} did not advance`);
  }

  const confirmSnapshot = await waitForHarvest(page, "final confirmation");
  if (expectLeak) {
    assert(confirmSnapshot.state.pendingRewardEvent?.id === "leak", "wrong-answer problem must prepare a leak reward", confirmSnapshot);
  }
  const rewardSnapshot = await finishProblemFromConfirmation(page, "harvest confirmation");
  if (expectLeak) {
    assert(rewardSnapshot.state.lastFuelEvent?.id === "leak", "wrong-answer problem did not become a bug-eaten reward", rewardSnapshot);
  }
  return rewardSnapshot;
}

async function assertRewardClass(page, className, label) {
  const hasClass = await evalInPage(page, `document.getElementById("rewardPop").classList.contains(${JSON.stringify(className)})`);
  assert(hasClass, `${label}: reward modal missing ${className}`);
}

async function advanceAfterReward(page, label) {
  await clickById(page, "rewardNextButton");
  await waitUntil(page, `document.querySelector(".screen.is-active")?.id === "playScreen" || document.querySelector(".screen.is-active")?.id === "resultScreen"`, `${label}: did not leave reward`, 4000);
}

async function runViewport(page, lessonUrl, viewport, { verifyMath = false } = {}) {
  console.log(`${viewport.name}: load`);
  await loadLesson(page, lessonUrl, viewport);
  await assertNoVisibleOverflow(page, `${viewport.name} cover`);
  await capture(page, viewport, "cover");

  if (verifyMath) {
    console.log(`${viewport.name}: verify model`);
    await verifyModel(page);
  }

  console.log(`${viewport.name}: tutorial`);
  await clickById(page, "startButton");
  await waitUntil(page, `document.querySelector(".screen.is-active")?.id === "tutorialScreen"`, `${viewport.name}: tutorial did not open`);
  await assertNoVisibleOverflow(page, `${viewport.name} tutorial`);
  await capture(page, viewport, "tutorial");

  console.log(`${viewport.name}: first problem screenshots`);
  await clickById(page, "tutorialNextButton");
  await waitUntil(page, `document.querySelector(".screen.is-active")?.id === "playScreen"`, `${viewport.name}: play did not open`);
  await waitForStep(page, 0, `${viewport.name}: first step did not render`);
  await assertNoVisibleOverflow(page, `${viewport.name} problem step 1`);
  await capture(page, viewport, "step1");

  await chooseCorrectStep(page);
  await waitForStep(page, 1, `${viewport.name}: first step did not advance`);
  await assertNoVisibleOverflow(page, `${viewport.name} problem step 2`);
  await capture(page, viewport, "step2");

  await chooseCorrectStep(page);
  await waitForStep(page, 2, `${viewport.name}: second step did not advance`);
  await chooseCorrectStep(page);
  await waitForHarvest(page, `${viewport.name}: final confirmation did not hold`);
  await assertNoVisibleOverflow(page, `${viewport.name} final confirmation`);
  await capture(page, viewport, "confirm");

  await finishProblemFromConfirmation(page, `${viewport.name}: first reward`);
  await capture(page, viewport, "reward");
  await advanceAfterReward(page, `${viewport.name}: after first reward`);

  console.log(`${viewport.name}: wrong-answer path`);
  await playProblem(page, { wrongFirstStep: true, expectLeak: true });
  await assertRewardClass(page, "fuel-event--leak", `${viewport.name}: wrong path`);
  await advanceAfterReward(page, `${viewport.name}: after wrong reward`);

  for (let problemIndex = 2; problemIndex < 10; problemIndex += 1) {
    console.log(`${viewport.name}: problem ${problemIndex + 1}`);
    await playProblem(page);
    await advanceAfterReward(page, `${viewport.name}: after reward ${problemIndex + 1}`);
  }

  console.log(`${viewport.name}: result`);
  await waitUntil(page, `document.querySelector(".screen.is-active")?.id === "resultScreen"`, `${viewport.name}: result did not open`, 5000);
  await waitUntil(page, `document.getElementById("resultScreen").classList.contains("is-measuring")`, `${viewport.name}: result measuring state missing`, 1000);
  await assertNoVisibleOverflow(page, `${viewport.name} result measuring`);
  await capture(page, viewport, "resultMeasure");
  await waitUntil(page, `!document.getElementById("resultScreen").classList.contains("is-measuring") && !document.getElementById("restartButton").hidden`, `${viewport.name}: result did not finish`, 4000);
  await assertNoVisibleOverflow(page, `${viewport.name} result final`);
  await capture(page, viewport, "result");

  return readSnapshot(page);
}

async function main() {
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = path.join(os.tmpdir(), `divide-farm-qa-${process.pid}`);
  const lessonUrl = `http://127.0.0.1:${serverPort}/${LESSON}/index.html`;
  let server;
  let chrome;
  let page;

  try {
    server = await makeServer(serverPort);
    chrome = await launchChrome(lessonUrl, debugPort, profileDir);
    const wsUrl = await waitForPageTarget(debugPort, lessonUrl);
    page = new Cdp(wsUrl);
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");

    const results = [];
    for (const viewport of VIEWPORTS) {
      results.push({
        viewport: viewport.name,
        result: await runViewport(page, lessonUrl, viewport, { verifyMath: viewport.name === "desktop" })
      });
    }

    console.log("LESSON2_DIVIDE_FARM_QA: PASS");
    console.log(JSON.stringify({ lesson: LESSON, screenshots: SCREENSHOTS_RELATIVE, results }, null, 2));
  } finally {
    if (page) page.close();
    await stopProcess(chrome);
    if (server) await closeServer(server);
    await fsp.rm(profileDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("LESSON2_DIVIDE_FARM_QA: FAIL");
  console.error(error.stack || error.message);
  if (error.details) console.error(JSON.stringify(error.details, null, 2));
  process.exitCode = 1;
});
