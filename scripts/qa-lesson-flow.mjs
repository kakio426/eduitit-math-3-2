#!/usr/bin/env node
// Generic browser QA for source-driven Mathmon engine lessons.
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const DEFAULT_SEED = 20260709;
const DEFAULT_VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 },
];
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
const MIME = new Map([
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".webp", "image/webp"],
  [".svg", "image/svg+xml; charset=utf-8"],
]);

function assert(condition, message, details) {
  if (!condition) {
    const error = new Error(message);
    if (details) error.details = details;
    throw error;
  }
}

function usage() {
  console.error("Usage: node scripts/qa-lesson-flow.mjs <lesson-folder> [seed]");
  console.error("Example: node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers");
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
    delay(2000).then(() => false),
  ]);
  if (exited) return;
  child.kill("SIGKILL");
  await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(1000).then(() => false),
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
        },
      });
    });
  }

  close() {
    this.ws.close();
  }
}

async function waitForPageTarget(debugPort, pageUrl, lesson) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`, 1).catch(() => []);
    const target = targets.find((item) => item.type === "page" && item.url.startsWith(pageUrl))
      || targets.find((item) => item.type === "page" && item.url.includes(`/${lesson}/index.html`));
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
    "--disable-gpu",
    "--window-size=1280,800",
    pageUrl,
  ], { stdio: "ignore" });
  await fetchJson(`http://127.0.0.1:${debugPort}/json/version`);
  return chrome;
}

async function evaluate(page, expression) {
  const result = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
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
    screenOrientation: { type: "landscapePrimary", angle: 90 },
  });
}

async function screenshot(page, lesson, viewport, name) {
  const capture = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const filePath = path.join(ROOT, lesson, "screenshots", `engine-flow-${viewport.name}-${name}.png`);
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
  const selector = correct ? "button.choice-button[data-correct='true']:not(:disabled)" : "button.choice-button[data-correct='false']:not(:disabled)";
  const hasChoice = await evaluate(page, `Boolean(document.querySelector(${JSON.stringify(selector)}))`);
  if (hasChoice) {
    await clickSelector(page, selector);
    return;
  }
  const interaction = await evaluate(page, "document.getElementById('choicesPanel')?.dataset.interaction || ''");
  const step = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()");
  const choiceId = (choice) => String(choice?.id ?? choice?.value ?? choice);
  const answer = step.answerChoiceId === undefined
    ? step.correct
    : step.choices.find((choice) => choiceId(choice) === String(step.answerChoiceId));
  const wrongChoices = step.choices.filter((choice) => choiceId(choice) !== choiceId(answer));
  const selected = correct
    ? answer
    : interaction === "make-star-groups"
      ? wrongChoices.sort((a, b) => Number(a.value) - Number(b.value)).find((choice) => Number(choice.value) < Number(answer.value)) || wrongChoices[0]
      : wrongChoices[0];
  assert(selected, `No ${correct ? "correct" : "wrong"} direct-interaction value`, { interaction, step });

  if (!interaction) {
    const selectedId = choiceId(selected);
    const clicked = await evaluate(page, `(() => {
      const button = [...document.querySelectorAll('button.choice-button:not(:disabled)')]
        .find((item) => item.dataset.choice === ${JSON.stringify(selectedId)});
      if (!button) return false;
      button.click();
      return true;
    })()`);
    assert(clicked, `choice click failed for ${selectedId}`, { step });
    await delay(100);
    return;
  }

  if (interaction === "make-star-groups" || interaction === "count-leftover-stars") {
    const amount = Math.max(0, Number(selected.value) || 0);
    await evaluate(page, `(() => { const button = document.querySelector('.star-builder-button.is-main'); if (!button) throw new Error('missing star builder button'); for (let index = 0; index < ${amount}; index += 1) button.click(); })()`);
    await clickSelector(page, ".star-builder-confirm");
    return;
  }
  if (interaction === "vault-keypad") {
    const digits = String(Math.max(0, Number(selected.value) || 0));
    const clicked = await evaluate(page, `(() => {
      const clear = document.querySelector('.vault-key.is-clear');
      const enter = document.querySelector('.vault-key.is-enter');
      if (!clear || !enter) return false;
      clear.click();
      for (const digit of ${JSON.stringify(digits)}) {
        const key = document.querySelector('.vault-key[data-digit="' + digit + '"]');
        if (!key) return false;
        key.click();
      }
      enter.click();
      return true;
    })()`);
    assert(clicked, `keypad input failed for ${digits}`);
    await delay(100);
    return;
  }
  throw new Error(`Unsupported direct interaction: ${interaction}`);
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
    const overflowSelector = [
      "button:not(.result-retry-hitbox)",
      ".brand-badge",
      ".unit-badge",
      ".mini-badge",
      ".choice-button",
      ".tutorial-card",
      ".reward-panel",
      ".big-problem",
      ".instruction",
      ".answer-slot",
      ".complete-text",
      ".data-board-title",
      ".data-label",
      ".data-row"
    ].join(",");
    const overflowing = [...document.querySelectorAll(overflowSelector)]
      .filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
      .map((node) => node.className || node.id || node.tagName);
    const missingImages = [...document.images]
      .filter((img) => (img.getAttribute("src") || "").trim().length > 0)
      .filter((img) => !img.complete || img.naturalWidth === 0)
      .map((img) => img.getAttribute("src"));
    const stageRect = document.querySelector(".stage-shell")?.getBoundingClientRect();
    const stage = stageRect ? { width: stageRect.width, height: stageRect.height, left: stageRect.left, top: stageRect.top } : null;
    return { active, completeVisible, settingsOpen, problemCounter, feedback, result, placeholders, overflowing, missingImages, stage };
  })()`);
}

async function auditGeometry(page, label, { requireLogo = false, requireRetry = false } = {}) {
  const audit = await evaluate(page, `(() => {
    const stage = document.querySelector('.stage-shell')?.getBoundingClientRect();
    const root = !document.getElementById('settingsBackdrop')?.hidden
      ? document.getElementById('settingsBackdrop')
      : !document.getElementById('rewardPop')?.hidden
        ? document.getElementById('rewardPop')
        : document.querySelector('.screen.is-active');
    const selector = [
      'button', '.brand-badge', '.unit-badge', '.mini-badge', '.big-problem',
      '.instruction', '.feedback-line', '.choice-button', '.star-builder-count',
      '.complete-text', '.result-correct-art'
    ].join(',');
    const visible = [...(root?.querySelectorAll(selector) || [])].filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    });
    const rectOf = (node) => {
      const r = node.getBoundingClientRect();
      return { left:r.left, top:r.top, right:r.right, bottom:r.bottom, width:r.width, height:r.height };
    };
    const collisions = [];
    for (let i = 0; i < visible.length; i += 1) for (let j = i + 1; j < visible.length; j += 1) {
      const a = visible[i], b = visible[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ar = rectOf(a), br = rectOf(b);
      const overlapX = Math.min(ar.right, br.right) - Math.max(ar.left, br.left);
      const overlapY = Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top);
      if (overlapX > 2 && overlapY > 2) collisions.push([a.className || a.id || a.tagName, b.className || b.id || b.tagName, Math.round(overlapX), Math.round(overlapY)]);
    }
    const outside = !stage ? [] : visible.filter((node) => {
      const r = node.getBoundingClientRect();
      return r.left < stage.left - 1 || r.top < stage.top - 1 || r.right > stage.right + 1 || r.bottom > stage.bottom + 1;
    }).map((node) => node.className || node.id || node.tagName);
    const logo = document.querySelector('img.brand-logo');
    const retry = document.querySelector('.result-retry-art');
    const retryHitbox = document.querySelector('.result-restart-hitbox');
    const resultBg = document.getElementById('resultBg');
    return {
      collisions,
      outside,
      logo: logo ? { complete:logo.complete, naturalWidth:logo.naturalWidth, width:logo.getBoundingClientRect().width } : null,
      retry: retry ? { complete:retry.complete, naturalWidth:retry.naturalWidth, width:retry.getBoundingClientRect().width, height:retry.getBoundingClientRect().height } : null,
      retryHitbox: retryHitbox ? { width:retryHitbox.getBoundingClientRect().width, height:retryHitbox.getBoundingClientRect().height } : null,
      resultBg: resultBg ? { complete:resultBg.complete, naturalWidth:resultBg.naturalWidth, width:resultBg.getBoundingClientRect().width, height:resultBg.getBoundingClientRect().height } : null
    };
  })()`);
  assert(audit.collisions.length === 0, `${label}: unintended overlap`, audit);
  assert(audit.outside.length === 0, `${label}: element outside Stage`, audit);
  if (requireLogo) assert(audit.logo?.complete && audit.logo.naturalWidth > 0 && audit.logo.width > 0, `${label}: real Eduitit logo missing`, audit);
  if (requireRetry) {
    const independentRetryArt = audit.retry?.complete && audit.retry.naturalWidth > 0 && audit.retry.width > 0 && audit.retry.height > 0;
    const generatedSceneRetry = audit.resultBg?.complete && audit.resultBg.naturalWidth > 0
      && audit.resultBg.width > 0 && audit.resultBg.height > 0
      && audit.retryHitbox?.width > 0 && audit.retryHitbox.height > 0;
    assert(independentRetryArt || generatedSceneRetry, `${label}: generated retry button missing`, audit);
  }
}

async function solveCurrentProblem(page, { wrongFirst = false } = {}) {
  if (wrongFirst) {
    await clickChoice(page, false);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0", "wrong feedback did not appear");
    await delay(500);
    await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", "input stayed locked after wrong answer");
  }
  while (!(await evaluate(page, "document.getElementById('completePanel').classList.contains('is-visible')"))) {
    const beforeStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    const advanced = `document.getElementById('completePanel').classList.contains('is-visible') || (window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)})`;
    await waitUntil(page, advanced, "correct response did not advance", 6000);
  }
}

async function waitForReward(page, label) {
  const modalReward = await evaluate(page, "document.querySelector('.game')?.dataset.rewardMode === 'modal-art'");
  if (modalReward) {
    await waitUntil(page, "document.getElementById('rewardPop')?.hidden === false", `${label}: reward modal not shown`);
    return { modal: true, openSelector: "#modalRewardOpenButton", nextSelector: "#modalRewardNextButton" };
  }
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-reward'", `${label}: reward not shown`);
  return { modal: false, nextSelector: "#rewardNextButton" };
}

async function revealReward(page, reward, label) {
  if (!reward.modal) return;
  await clickSelector(page, reward.openSelector);
  await waitUntil(page, "document.querySelector('.reward-card')?.dataset.rewardPhase === 'revealed' && !document.getElementById('modalRewardNextButton')?.hidden", `${label}: reward did not reveal`, 8000);
}

async function runViewport(page, lesson, pageUrl, viewport, seed) {
  await setViewport(page, viewport);
  await page.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await page.send("Page.navigate", { url: `${pageUrl}?seed=${seed}&qa=${viewport.name}-${Date.now()}` });
  await waitForLoad(page);
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-cover'", `${viewport.name}: cover not active`);

  const shots = [];
  shots.push(await screenshot(page, lesson, viewport, "01-cover"));
  await auditGeometry(page, `${viewport.name} cover`, { requireLogo: true });
  await clickSelector(page, "#settingsButton");
  await waitUntil(page, "!document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not open`);
  shots.push(await screenshot(page, lesson, viewport, "02-settings"));
  await auditGeometry(page, `${viewport.name} settings`);
  await clickSelector(page, "#settingsCloseButton");
  await waitUntil(page, "document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not close`);

  await clickSelector(page, "#startButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial' && document.getElementById('tutorialStartButton').textContent.trim() === '다음'", `${viewport.name}: tutorial 1 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "03-tutorial-1"));
  await auditGeometry(page, `${viewport.name} tutorial 1`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.getElementById('tutorialStartButton').textContent.trim() === '문제 시작'", `${viewport.name}: tutorial 2 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "04-tutorial-2"));
  await auditGeometry(page, `${viewport.name} tutorial 2`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not shown`);
  shots.push(await screenshot(page, lesson, viewport, "05-play-step1"));
  await auditGeometry(page, `${viewport.name} play`);
  const answerLeak = await evaluate(page, "document.getElementById('answerSlot')?.textContent.trim() !== '?' || Boolean(document.querySelector('#choicesPanel [data-state=\"correct\"]'))");
  assert(!answerLeak, `${viewport.name}: answer was exposed before student action`);

  await clickChoice(page, false);
  await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0", `${viewport.name}: wrong feedback did not appear`);
  await delay(500);
  shots.push(await screenshot(page, lesson, viewport, "05b-play-wrong"));
  await auditGeometry(page, `${viewport.name} wrong feedback`);
  await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: input stayed locked after wrong feedback`);
  await solveCurrentProblem(page);
  shots.push(await screenshot(page, lesson, viewport, "06-confirm"));
  await auditGeometry(page, `${viewport.name} confirmation`);
  await clickSelector(page, "#rewardButton");
  const firstReward = await waitForReward(page, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07-reward-closed"));
  await auditGeometry(page, `${viewport.name} closed reward`);
  await revealReward(page, firstReward, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07b-reward-open"));
  await auditGeometry(page, `${viewport.name} revealed reward`);
  await clickSelector(page, firstReward.nextSelector);

  for (let problemIndex = 2; problemIndex <= 10; problemIndex += 1) {
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not active for problem ${problemIndex}`);
    await solveCurrentProblem(page);
    await clickSelector(page, "#rewardButton");
    const reward = await waitForReward(page, `${viewport.name} problem ${problemIndex}`);
    await revealReward(page, reward, `${viewport.name} problem ${problemIndex}`);
    await clickSelector(page, reward.nextSelector);
  }

  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result not shown`, 8000);
  shots.push(await screenshot(page, lesson, viewport, "08-result"));
  await auditGeometry(page, `${viewport.name} result`, { requireRetry: true });
  const snapshot = await readSnapshot(page);
  assert(!snapshot.placeholders, `${viewport.name}: template placeholders leaked`, snapshot);
  assert(snapshot.missingImages.length === 0, `${viewport.name}: missing images`, snapshot);
  assert(snapshot.overflowing.length === 0, `${viewport.name}: text overflow`, snapshot);
  assert(snapshot.stage?.width > 0 && snapshot.stage?.height > 0, `${viewport.name}: stage not visible`, snapshot);
  return { viewport, shots, snapshot };
}

async function readLessonConfig(lesson) {
  const configPath = path.join(SOURCE_ROOT, lesson, "lesson.json");
  return JSON.parse(await fsp.readFile(configPath, "utf8"));
}

async function main() {
  const lesson = process.argv[2];
  if (!lesson) {
    usage();
    process.exitCode = 1;
    return;
  }
  const seedArg = Number(process.argv[3]);
  const seed = Number.isInteger(seedArg) ? seedArg : DEFAULT_SEED;
  const config = await readLessonConfig(lesson);
  const viewports = Array.isArray(config.qa?.viewports) && config.qa.viewports.length ? config.qa.viewports : DEFAULT_VIEWPORTS;
  await fsp.mkdir(path.join(ROOT, lesson, "screenshots"), { recursive: true });
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = await fsp.mkdtemp(path.join(os.tmpdir(), "mathmon-flow-qa-"));
  const server = await makeServer(serverPort);
  const pageUrl = `http://127.0.0.1:${serverPort}/${lesson}/index.html`;
  let chrome;
  let page;
  try {
    chrome = await launchChrome(pageUrl, debugPort, profileDir);
    const wsUrl = await waitForPageTarget(debugPort, pageUrl, lesson);
    page = new Cdp(wsUrl);
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    const results = [];
    for (const viewport of viewports) {
      results.push(await runViewport(page, lesson, pageUrl, viewport, seed));
    }
    const runtimeErrors = page.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert(runtimeErrors.length === 0, "runtime exceptions were thrown", runtimeErrors);
    console.log("QA_LESSON_FLOW: PASS");
    console.log(JSON.stringify({ lesson, seed, results }, null, 2));
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
