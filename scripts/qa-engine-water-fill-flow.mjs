#!/usr/bin/env node
// Browser QA for the first source-driven Mathmon engine pilot.
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const LESSON = "3-2-5-1-mathmon-water-fill";
const SCREENSHOTS = path.join(ROOT, LESSON, "screenshots");
const DEFAULT_SEED = 20260709;
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
];
const VIEWPORTS = [
  { name: "engine-desktop", width: 1280, height: 800 },
  { name: "engine-tablet", width: 1024, height: 768 }
];
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

function assert(condition, message, details) {
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
    let decodedPath;
    try {
      decodedPath = decodeURIComponent(requestUrl.pathname);
    } catch {
      response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
      response.end("bad path");
      return;
    }
    const resolved = path.resolve(ROOT, `.${decodedPath}`);
    const relative = path.relative(ROOT, resolved);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
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
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  const exited = await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(2000).then(() => false)
  ]);
  if (exited) return;
  child.kill("SIGKILL");
  await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(1000).then(() => false)
  ]);
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
    this.events = [];
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
    if (!message.id) {
      this.events.push(message);
      return;
    }
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

async function waitForPageTarget(debugPort, pageUrl) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`, 1).catch(() => []);
    const target = targets.find((item) => item.type === "page" && item.url.startsWith(pageUrl))
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

async function evaluate(page, expression) {
  const result = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true
  });
  if (result.exceptionDetails) {
    throw new Error(
      result.exceptionDetails.exception?.description
        || result.exceptionDetails.exception?.value
        || result.exceptionDetails.text
        || "Runtime.evaluate failed",
    );
  }
  return result.result?.value;
}

async function waitUntil(page, expression, message, timeout = 5000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(page, expression)) return;
    await delay(80);
  }
  throw new Error(message);
}

async function waitForLoad(page) {
  await waitUntil(page, "document.readyState === 'complete'", "page did not load");
  await evaluate(page, "Promise.all([...document.images].map((img) => img.complete ? true : new Promise((resolve) => { img.addEventListener('load', resolve, { once: true }); img.addEventListener('error', resolve, { once: true }); })))");
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

async function screenshot(page, viewport, name) {
  const capture = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const filePath = path.join(SCREENSHOTS, `${viewport.name}-${name}.png`);
  await fsp.writeFile(filePath, Buffer.from(capture.data, "base64"));
  return path.relative(ROOT, filePath);
}

async function clickSelector(page, selector) {
  const rect = await evaluate(page, `(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) throw new Error("missing selector ${selector}");
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
  })()`);
  assert(rect.width > 0 && rect.height > 0, `${selector} has no clickable size`, rect);
  await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y, button: "none" });
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: rect.x, y: rect.y, button: "left", buttons: 1, clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rect.x, y: rect.y, button: "left", buttons: 0, clickCount: 1 });
  await delay(80);
}

async function clickChoice(page, correct) {
  const index = await evaluate(page, `(() => {
    const problem = state.problems[state.problemIndex];
    const step = problem.steps[state.stepIndex];
    const buttons = [...document.querySelectorAll("#choicesPanel button.choice-button:not(:disabled)")];
    return buttons.findIndex((button) => {
      const choice = step.choices.find((item) => String(
        item && typeof item === "object" ? (item.id ?? item.value ?? item.label) : item,
      ) === button.dataset.choice);
      return choice && LessonModel.validateChoice(step, choice) === ${correct};
    });
  })()`);
  assert(index >= 0, `${correct ? "correct" : "wrong"} choice is not available`, { index });
  const selector = `#choicesPanel button.choice-button:nth-child(${index + 1}):not(:disabled)`;
  await clickSelector(page, selector);
}

async function readSnapshot(page) {
  return evaluate(page, `(() => {
    const active = document.querySelector(".screen.is-active")?.id || "";
    const completeVisible = document.getElementById("completePanel")?.classList.contains("is-visible") || false;
    const settingsOpen = !document.getElementById("settingsBackdrop")?.hidden;
    const problemCounter = document.getElementById("problemCounter")?.textContent || "";
    const feedback = document.getElementById("feedbackLine")?.textContent || "";
    const result = document.getElementById("resultTitle")?.textContent || "";
    const placeholders = document.documentElement.outerHTML.includes("{{");
    const overflowing = [...document.querySelectorAll("button:not(.result-retry-hitbox), .brand-badge, .unit-badge, .mini-badge, .choice-button, .tutorial-card, .reward-panel")]
      .filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
      .map((node) => node.className || node.id || node.tagName);
    const missingImages = [...document.images]
      .filter((img) => img.getAttribute("src") && (!img.complete || img.naturalWidth === 0))
      .map((img) => img.getAttribute("src"));
    return { active, completeVisible, settingsOpen, problemCounter, feedback, result, placeholders, overflowing, missingImages };
  })()`);
}

async function solveCurrentProblem(page, { wrongFirst = false } = {}) {
  if (wrongFirst) {
    await clickChoice(page, false);
    await waitUntil(
      page,
      "document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0",
      "wrong feedback did not appear",
    );
  }
  while (!(await evaluate(page, "document.getElementById('completePanel').classList.contains('is-visible')"))) {
    await clickChoice(page, true);
    await delay(1100);
  }
  await waitUntil(
    page,
    `(() => {
      const button = document.querySelector('#completePanel.is-visible #rewardButton:not([hidden]):not(:disabled)');
      if (!button) return false;
      const rect = button.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    })()`,
    "reward button did not become clickable after the answer confirmation",
    8000,
  );
}

async function runViewport(page, pageUrl, viewport) {
  await setViewport(page, viewport);
  await page.send("Page.navigate", { url: `${pageUrl}?seed=${DEFAULT_SEED}&qa=${viewport.name}-${Date.now()}` });
  await waitForLoad(page);
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-cover'", `${viewport.name}: cover not active`);

  const shots = [];
  shots.push(await screenshot(page, viewport, "01-cover"));
  await clickSelector(page, "#settingsButton");
  await waitUntil(page, "!document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not open`);
  shots.push(await screenshot(page, viewport, "02-settings"));
  await clickSelector(page, "#settingsCloseButton");
  await waitUntil(page, "document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not close`);

  await clickSelector(page, "#startButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial' && document.getElementById('tutorialStartButton').textContent.trim() === '다음'", `${viewport.name}: tutorial 1 not shown`);
  shots.push(await screenshot(page, viewport, "03-tutorial-1"));
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.getElementById('tutorialStartButton').textContent.trim() === '문제 시작'", `${viewport.name}: tutorial 2 not shown`);
  shots.push(await screenshot(page, viewport, "04-tutorial-2"));
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not shown`);
  shots.push(await screenshot(page, viewport, "05-play-step1"));

  await solveCurrentProblem(page, { wrongFirst: true });
  shots.push(await screenshot(page, viewport, "06-confirm"));
  await clickSelector(page, "#rewardButton");
  await waitUntil(
    page,
    "!document.getElementById('rewardPop').hidden && document.querySelector('.reward-card')?.dataset.rewardPhase === 'closed'",
    `${viewport.name}: closed reward modal not shown`,
  );
  shots.push(await screenshot(page, viewport, "07-reward-closed"));
  await clickSelector(page, "#modalRewardOpenButton");
  await waitUntil(
    page,
    "document.querySelector('.reward-card')?.dataset.rewardPhase === 'revealed' && !document.getElementById('modalRewardNextButton').hidden",
    `${viewport.name}: opened reward modal not shown`,
  );
  shots.push(await screenshot(page, viewport, "07b-reward-open"));
  await clickSelector(page, "#modalRewardNextButton");

  for (let problemIndex = 2; problemIndex <= 10; problemIndex += 1) {
    await waitUntil(
      page,
      `(() => {
        const state = window.__mathmonEngineQa?.getState?.();
        return document.querySelector('.screen.is-active')?.id === 'screen-play'
          && state?.problemIndex === ${problemIndex - 1}
          && state?.completed === false
          && !document.getElementById('completePanel')?.classList.contains('is-visible');
      })()`,
      `${viewport.name}: problem ${problemIndex} did not become ready`,
      10000,
    );
    await solveCurrentProblem(page);
    await clickSelector(page, "#rewardButton");
    await waitUntil(page, "!document.getElementById('rewardPop').hidden", `${viewport.name}: reward modal not shown for problem ${problemIndex}`);
    await clickSelector(page, "#modalRewardOpenButton");
    await waitUntil(page, "!document.getElementById('modalRewardNextButton').hidden", `${viewport.name}: reward modal did not open for problem ${problemIndex}`);
    await clickSelector(page, "#modalRewardNextButton");
  }

  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result not shown`, 8000);
  shots.push(await screenshot(page, viewport, "08-result"));
  const snapshot = await readSnapshot(page);
  assert(!snapshot.placeholders, `${viewport.name}: template placeholders leaked`, snapshot);
  assert(snapshot.missingImages.length === 0, `${viewport.name}: missing images`, snapshot);
  assert(snapshot.overflowing.length === 0, `${viewport.name}: text overflow`, snapshot);
  return { viewport, shots, snapshot };
}

async function main() {
  await fsp.mkdir(SCREENSHOTS, { recursive: true });
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = await fsp.mkdtemp(path.join(os.tmpdir(), "mathmon-engine-qa-"));
  const server = await makeServer(serverPort);
  const pageUrl = `http://127.0.0.1:${serverPort}/${LESSON}/index.html`;
  let chrome;
  let page;
  try {
    chrome = await launchChrome(pageUrl, debugPort, profileDir);
    const wsUrl = await waitForPageTarget(debugPort, pageUrl);
    page = new Cdp(wsUrl);
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    const results = [];
    for (const viewport of VIEWPORTS) {
      results.push(await runViewport(page, pageUrl, viewport));
    }
    const runtimeErrors = page.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert(runtimeErrors.length === 0, "runtime exceptions were thrown", runtimeErrors);
    console.log("QA_ENGINE_WATER_FILL_FLOW: PASS");
    console.log(JSON.stringify({ seed: DEFAULT_SEED, results }, null, 2));
  } finally {
    page?.close();
    await stopProcess(chrome);
    await closeServer(server);
    await fsp.rm(profileDir, { force: true, recursive: true }).catch(() => {});
  }
}

main().catch((error) => {
  console.error(error?.stack || error);
  if (error?.details) console.error(JSON.stringify(error.details, null, 2));
  process.exitCode = 1;
});
