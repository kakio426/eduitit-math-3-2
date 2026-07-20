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
  { name: "reported-browser", width: 918, height: 897 },
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
  server.closeAllConnections?.();
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
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Runtime.evaluate failed");
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
    deviceScaleFactor: viewport.dpr || 1,
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
    if (!node) throw new Error(${JSON.stringify(`missing selector ${selector}`)});
    const rect = node.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, width: rect.width, height: rect.height };
  })()`);
  assert(rect.width > 0 && rect.height > 0, `${selector} has no clickable size`, rect);
  await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: rect.x, y: rect.y, button: "none" });
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: rect.x, y: rect.y, button: "left", buttons: 1, clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: rect.x, y: rect.y, button: "left", buttons: 0, clickCount: 1 });
  await delay(80);
}

async function dragSelectorToSelector(page, fromSelector, toSelector) {
  const points = await evaluate(page, `(() => {
    const from = document.querySelector(${JSON.stringify(fromSelector)});
    const to = document.querySelector(${JSON.stringify(toSelector)});
    if (!from || !to) return null;
    const a = from.getBoundingClientRect();
    const b = to.getBoundingClientRect();
    return {
      from:{ x:a.left + a.width / 2, y:a.top + a.height / 2 },
      to:{ x:b.left + b.width / 2, y:b.top + b.height / 2 }
    };
  })()`);
  assert(points, `drag endpoints missing: ${fromSelector} -> ${toSelector}`);
  await page.send("Input.dispatchMouseEvent", { type:"mouseMoved", x:points.from.x, y:points.from.y, button:"none" });
  await page.send("Input.dispatchMouseEvent", { type:"mousePressed", x:points.from.x, y:points.from.y, button:"left", buttons:1, clickCount:1 });
  await page.send("Input.dispatchMouseEvent", { type:"mouseMoved", x:points.to.x, y:points.to.y, button:"left", buttons:1 });
  await page.send("Input.dispatchMouseEvent", { type:"mouseReleased", x:points.to.x, y:points.to.y, button:"left", buttons:0, clickCount:1 });
  await delay(70);
}

async function dragFarmDistribution(page, correct) {
  const setup = await evaluate(page, `(() => ({
    step:window.__mathmonEngineQa.getCurrentStep(),
    source:document.querySelectorAll('.farm-share-source-pieces .farm-drag-piece').length,
    counts:[...document.querySelectorAll('.farm-share-basket')].map((node) => Number(node.dataset.count || 0))
  }))()`);
  const divisor = setup.counts.length;
  const answerUnits = Number(setup.step.answer) / Number(setup.step.unitValue || 1);
  if (setup.source > 0) {
    const targets = Array(divisor).fill(answerUnits);
    if (!correct && answerUnits > 0 && answerUnits < 4) {
      targets[0] += 1;
      targets[1] -= 1;
    }
    for (let basket = 0; basket < divisor; basket += 1) {
      for (let count = 0; count < targets[basket]; count += 1) {
        await dragSelectorToSelector(page, '.farm-share-source-pieces .farm-drag-piece', `.farm-share-basket[data-basket-index="${basket}"]`);
      }
    }
    return;
  }
  if (correct) {
    const high = setup.counts.findIndex((count) => count > answerUnits);
    const low = setup.counts.findIndex((count) => count < answerUnits);
    assert(high >= 0 && low >= 0, "unequal farm distribution has no movable correction", setup);
    await dragSelectorToSelector(page, `.farm-share-basket[data-basket-index="${high}"]`, `.farm-share-basket[data-basket-index="${low}"]`);
  }
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
  if (interaction === "share-drag-distribution") {
    await dragFarmDistribution(page, correct);
    return;
  }
  if (interaction === "share-relation-choice") {
    const answerUnits = Number(step.answer) / Number(step.unitValue || 1);
    const units = correct
      ? answerUnits
      : answerUnits > 1 ? answerUnits - 1 : answerUnits + 1;
    const selected = await evaluate(page, `(() => {
      const card = document.querySelector('.farm-share-option[data-units="${units}"]:not(:disabled)');
      if (!card) return { ok:false, units:${units} };
      card.click();
      return { ok:true };
    })()`);
    assert(selected.ok, `farm share card input failed for ${units}`, { interaction, step, selected });
    await delay(100);
    return;
  }
  if (interaction === "enter-share" || interaction === "enter-quotient") {
    const answerValue = Number(step.answer);
    const wrongAmount = interaction === "enter-share" && step.id === "tens"
      ? answerValue > 10 ? answerValue - 10 : answerValue + 10
      : answerValue === 99 ? 98 : answerValue + 1;
    const amount = correct ? answerValue : wrongAmount;
    const entered = await evaluate(page, `(() => {
      const clear = document.querySelector('.farm-key.is-clear:not(:disabled)');
      if (!clear) return { ok:false, reason:'clear' };
      clear.click();
      for (const digit of ${JSON.stringify(String(amount))}) {
        const key = document.querySelector('.farm-key[data-digit="' + digit + '"]:not(:disabled)');
        if (!key) return { ok:false, reason:'digit-' + digit };
        key.click();
      }
      const enter = document.querySelector('.farm-key.is-enter:not(:disabled)');
      if (!enter) return { ok:false, reason:'enter', text:document.querySelector('.farm-share-answer, .farm-quotient-display')?.textContent || '' };
      enter.click();
      return { ok:true };
    })()`);
    assert(entered.ok, `farm keypad input failed for ${amount}`, { interaction, step, entered });
    await delay(100);
    return;
  }
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

async function clickMisconception(page, misconceptionId) {
  const selector = `button.choice-button[data-misconception=${JSON.stringify(misconceptionId)}]:not(:disabled)`;
  const exists = await evaluate(page, `Boolean(document.querySelector(${JSON.stringify(selector)}))`);
  if (exists) {
    await clickSelector(page, selector);
    return;
  }

  const interaction = await evaluate(page, "document.getElementById('choicesPanel')?.dataset.interaction || ''");
  const step = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()");
  const selected = step?.choices?.find((choice) => choice.misconceptionId === misconceptionId);
  assert(selected, `Missing deterministic misconception choice: ${misconceptionId}`, { interaction, step });

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
    assert(clicked, `keypad misconception input failed for ${misconceptionId}`, { digits, step });
    await delay(100);
    return;
  }

  throw new Error(`Unsupported deterministic misconception interaction: ${interaction}`);
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
      ".farm-share-option",
      ".farm-entry-message",
      ".farm-answer-basket-card",
      ".farm-final-sum",
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
      '.farm-share-option', '.farm-share-feedback',
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
    }).map((node) => ({ name:node.className || node.id || node.tagName, rect:rectOf(node), stage:rectOf(document.querySelector('.stage-shell')) }));
    const logo = document.querySelector('img.brand-logo');
    const retry = document.querySelector('.result-retry-art');
    const retryHitbox = document.querySelector('.result-restart-hitbox');
    const resultBg = document.getElementById('resultBg');
    const farmStage = document.querySelector('.farm-stage-art');
    const hud = document.querySelector('#screen-play .hud');
    const problemGrid = document.querySelector('.problem-grid');
    const completePanel = document.getElementById('completePanel');
    return {
      collisions,
      outside,
      logo: logo ? { complete:logo.complete, naturalWidth:logo.naturalWidth, width:logo.getBoundingClientRect().width } : null,
      retry: retry ? { complete:retry.complete, naturalWidth:retry.naturalWidth, width:retry.getBoundingClientRect().width, height:retry.getBoundingClientRect().height } : null,
      retryHitbox: retryHitbox ? { width:retryHitbox.getBoundingClientRect().width, height:retryHitbox.getBoundingClientRect().height } : null,
      resultBg: resultBg ? { complete:resultBg.complete, naturalWidth:resultBg.naturalWidth, width:resultBg.getBoundingClientRect().width, height:resultBg.getBoundingClientRect().height } : null,
      farmStage:farmStage ? { rect:rectOf(farmStage), cssWidth:getComputedStyle(farmStage).width, cssHeight:getComputedStyle(farmStage).height } : null,
      hud:hud ? { rect:rectOf(hud), cssWidth:getComputedStyle(hud).width, grid:getComputedStyle(hud).gridTemplateColumns } : null,
      problemGrid:problemGrid ? { rect:rectOf(problemGrid), cssWidth:getComputedStyle(problemGrid).width, grid:getComputedStyle(problemGrid).gridTemplateColumns } : null,
      completePanel:completePanel ? { rect:rectOf(completePanel), cssWidth:getComputedStyle(completePanel).width, grid:getComputedStyle(completePanel).gridTemplateColumns } : null
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

async function auditGeneratedActionButton(page, label, selector, expectedSource, expectedLabel) {
  const audit = await evaluate(page, `(() => {
    const button = document.querySelector(${JSON.stringify(selector)});
    const image = button?.querySelector('.generated-action-button-art, .result-retry-art');
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height } : null;
    };
    return {
      button:rectOf(button),
      image:rectOf(image),
      source:image?.getAttribute('src') || '',
      naturalWidth:image?.naturalWidth || 0,
      naturalHeight:image?.naturalHeight || 0,
      complete:Boolean(image?.complete),
      ariaLabel:button?.getAttribute('aria-label') || '',
      visibleText:button?.textContent.trim() || '',
      hidden:Boolean(button?.hidden),
      display:button ? getComputedStyle(button).display : ''
    };
  })()`);
  assert(audit.button && audit.image, `${label}: generated action button or art is missing`, audit);
  assert(!audit.hidden && audit.display !== 'none', `${label}: generated action button is not visible`, audit);
  assert(audit.complete && audit.naturalWidth > 0 && audit.naturalHeight > 0, `${label}: generated action art did not load`, audit);
  assert(audit.source.endsWith(expectedSource), `${label}: wrong generated action asset`, audit);
  assert(audit.ariaLabel === expectedLabel, `${label}: generated action accessible label is wrong`, audit);
  assert(audit.visibleText === '', `${label}: visible HTML text duplicates generated button art`, audit);
  for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height']) {
    assert(Math.abs(audit.button[edge] - audit.image[edge]) <= 1, `${label}: art and hitbox ${edge} differ by more than 1px`, audit);
  }
  assert(audit.button.width >= 42 && audit.button.height >= 42, `${label}: generated action touch target is too small`, audit);
}

async function auditElevatorTutorialGoalRaster(page, label) {
  const audit = await evaluate(page, `(() => {
    const cards = [...document.querySelectorAll('#screen-tutorial .tutorial-card')];
    const card = cards[1];
    const image = card?.querySelector('.tutorial-poster-art');
    const directTitle = [...(card?.children || [])].find((node) => node.tagName === 'STRONG');
    const directBody = [...(card?.children || [])].find((node) => node.tagName === 'P');
    const topRow = document.querySelector('#screen-tutorial > .top-row');
    const readRect = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    return {
      source:image?.getAttribute('src') || '',
      complete:Boolean(image?.complete),
      naturalWidth:image?.naturalWidth || 0,
      naturalHeight:image?.naturalHeight || 0,
      objectFit:image ? getComputedStyle(image).objectFit : '',
      card:readRect(card),
      image:readRect(image),
      title:directTitle?.textContent?.trim() || '',
      body:directBody?.textContent?.trim() || '',
      titleRect:readRect(directTitle),
      bodyRect:readRect(directBody),
      guideCount:card?.querySelectorAll('.tutorial-reward-guide').length ?? null,
      topRowJustify:topRow ? getComputedStyle(topRow).justifyContent : '',
    };
  })()`);
  assert(audit.source.endsWith('tutorial-page-2-v3-generated.webp'), `${label}: wrong generated tutorial image`, audit);
  assert(audit.complete && audit.naturalWidth === 1280 && audit.naturalHeight === 800, `${label}: tutorial image size/load contract changed`, audit);
  assert(audit.objectFit === 'cover', `${label}: tutorial image must fill the 16:10 card`, audit);
  assert(audit.title === '나눗셈을 풀고 문을 열어요', `${label}: accessible tutorial title regressed`, audit);
  assert(audit.body === '나눗셈을 풀어요. 문을 열어 힘을 봐요. +는 위로, −는 아래로 가요. 10문제 뒤 도착한 층을 확인해요.', `${label}: accessible tutorial flow copy regressed`, audit);
  assert(audit.guideCount === 0, `${label}: HTML tutorial panel duplicates generated image text`, audit);
  assert(audit.titleRect?.width <= 1 && audit.titleRect?.height <= 1 && audit.bodyRect?.width <= 1 && audit.bodyRect?.height <= 1, `${label}: accessible HTML copy is visible over the generated poster`, audit);
  for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height']) {
    assert(Math.abs(audit.card[edge] - audit.image[edge]) <= 1, `${label}: poster and tutorial card ${edge} differ by more than 1px`, audit);
  }
  assert(audit.topRowJustify === 'flex-start', `${label}: top badges were not moved into the image safe zone`, audit);
}

async function auditMathmonReactionAlphaEdge(page, label) {
  const audit = await evaluate(page, `(async () => {
    const image = document.querySelector('.play-mathmon-reaction');
    if (!image) return { missing:true };
    await image.decode();
    const stage = document.querySelector('.stage-shell')?.getBoundingClientRect();
    const panel = document.getElementById('completePanel')?.getBoundingClientRect();
    const imageRect = image.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d', { willReadFrequently:true });
    context.drawImage(image, 0, 0);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
    let minX = canvas.width;
    let maxX = -1;
    let minY = canvas.height;
    let maxY = -1;
    for (let y = 0; y < canvas.height; y += 1) {
      for (let x = 0; x < canvas.width; x += 1) {
        const alpha = pixels[(y * canvas.width + x) * 4 + 3];
        if (alpha < 16) continue;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
    let leftOpaquePixels = 0;
    if (maxX >= minX) {
      for (let y = minY; y <= maxY; y += 1) {
        if (pixels[(y * canvas.width + minX) * 4 + 3] >= 128) leftOpaquePixels += 1;
      }
    }
    return {
      missing:false,
      src:image.getAttribute('src') || '',
      naturalWidth:image.naturalWidth,
      naturalHeight:image.naturalHeight,
      alphaBounds:maxX >= minX ? { minX, minY, maxX:maxX + 1, maxY:maxY + 1 } : null,
      transparentMargins:maxX >= minX ? {
        left:minX,
        right:canvas.width - maxX - 1,
        top:minY,
        bottom:canvas.height - maxY - 1,
      } : null,
      leftOpaquePixels,
      layout: {
        gapToPanel:panel ? panel.left - imageRect.right : null,
        insideStage:stage ? imageRect.left >= stage.left - 1 && imageRect.bottom <= stage.bottom + 1 : false,
        image:{ left:imageRect.left, right:imageRect.right, top:imageRect.top, bottom:imageRect.bottom, width:imageRect.width, height:imageRect.height },
        panel:panel ? { left:panel.left, right:panel.right, top:panel.top, bottom:panel.bottom, width:panel.width, height:panel.height } : null,
      },
    };
  })()`);
  assert(!audit.missing, `${label}: Mathmon reaction image is missing`, audit);
  assert(audit.src.endsWith('mathmon-reaction-reward.webp'), `${label}: reward reaction asset is not active`, audit);
  assert(audit.naturalWidth === 512 && audit.naturalHeight === 640, `${label}: reaction canvas contract changed`, audit);
  assert(audit.transparentMargins?.left >= 12 && audit.transparentMargins?.right >= 12, `${label}: reaction art lacks horizontal safety margin`, audit);
  assert(audit.leftOpaquePixels <= 24, `${label}: eagle left wing has a hard clipped edge`, audit);
  assert(audit.layout.insideStage, `${label}: eagle reaction left the Stage`, audit);
  assert(audit.layout.gapToPanel >= 4, `${label}: eagle reaction overlaps the completion panel`, audit);
}

async function auditElevatorDivisionSvgClearance(page, label, mode) {
  const selectors = mode === "tutorial"
    ? {
        svg: ".tutorial-division-board svg",
        arrow: "[data-tutorial-arrow-head]",
        brought: ".tutorial-brought-ones",
        line: ".tutorial-final-line",
        zero: ".tutorial-final-zero",
      }
    : {
        svg: ".elevator-math-svg",
        arrow: "[data-board-arrow-head]",
        brought: ".board-brought-ones",
        line: ".board-final-line",
        zero: ".board-final-zero",
        firstLine: ".board-final-first-line",
        downDigits: ".board-final-down-digit",
        subtrahends: ".board-final-subtrahend",
      };
  const audit = await evaluate(page, `(() => {
    const selectors = ${JSON.stringify(selectors)};
    const svg = document.querySelector(selectors.svg);
    const readBox = (selector) => {
      const node = svg?.querySelector(selector);
      if (!node) return null;
      const box = node.getBoundingClientRect();
      return { x:box.x, y:box.y, width:box.width, height:box.height, right:box.right, bottom:box.bottom };
    };
    const arrow = readBox(selectors.arrow);
    const brought = readBox(selectors.brought);
    const line = readBox(selectors.line);
    const zero = readBox(selectors.zero);
    const firstLine = selectors.firstLine ? readBox(selectors.firstLine) : null;
    const downDigits = selectors.downDigits
      ? [...(svg?.querySelectorAll(selectors.downDigits) || [])].map((node) => {
          const box = node.getBoundingClientRect();
          return { x:box.x, y:box.y, width:box.width, height:box.height, right:box.right, bottom:box.bottom };
        })
      : [];
    const subtrahends = selectors.subtrahends
      ? [...(svg?.querySelectorAll(selectors.subtrahends) || [])].map((node) => {
          const box = node.getBoundingClientRect();
          return { x:box.x, y:box.y, width:box.width, height:box.height, right:box.right, bottom:box.bottom };
        })
      : [];
    const lineNode = svg?.querySelector(selectors.line);
    const firstLineNode = selectors.firstLine ? svg?.querySelector(selectors.firstLine) : null;
    const svgRect = svg?.getBoundingClientRect();
    const viewBox = svg?.viewBox?.baseVal;
    const scale = svgRect && viewBox?.width && viewBox?.height
      ? Math.min(svgRect.width / viewBox.width, svgRect.height / viewBox.height)
      : 1;
    const strokeWidth = (lineNode ? Number.parseFloat(getComputedStyle(lineNode).strokeWidth) || 0 : 0) * scale;
    const firstStrokeWidth = (firstLineNode ? Number.parseFloat(getComputedStyle(firstLineNode).strokeWidth) || 0 : 0) * scale;
    const overlapArea = (a, b, aStroke = 0) => {
      if (!a || !b) return null;
      const left = a.x - aStroke / 2;
      const right = a.right + aStroke / 2;
      const top = a.y - aStroke / 2;
      const bottom = a.bottom + aStroke / 2;
      return Math.max(0, Math.min(right, b.right) - Math.max(left, b.x))
        * Math.max(0, Math.min(bottom, b.bottom) - Math.max(top, b.y));
    };
    const arrowGap = arrow && brought ? brought.y - arrow.bottom : null;
    const lineGap = line && zero ? zero.y - (line.bottom + strokeWidth / 2) : null;
    const firstLineGap = firstLine && downDigits.length
      ? Math.min(...downDigits.map((item) => item.y)) - (firstLine.bottom + firstStrokeWidth / 2)
      : null;
    const middleGap = downDigits.length && subtrahends.length
      ? Math.min(...subtrahends.map((item) => item.y)) - Math.max(...downDigits.map((item) => item.bottom))
      : null;
    const choiceBoxCount = svg?.querySelectorAll('.board-cell, .board-down-slot').length ?? null;
    const completedText = [...(svg?.querySelectorAll('.division-board--complete text') || [])].map((node) => {
      const box = node.getBoundingClientRect();
      return { text:node.textContent.trim(), x:box.x, y:box.y, width:box.width, height:box.height, right:box.right, bottom:box.bottom };
    });
    const textOverlaps = [];
    for (let index = 0; index < completedText.length; index += 1) {
      for (let other = index + 1; other < completedText.length; other += 1) {
        const a = completedText[index], b = completedText[other];
        const overlapX = Math.min(a.right, b.right) - Math.max(a.x, b.x);
        const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y);
        if (overlapX > 1 && overlapY > 1) textOverlaps.push({ a:a.text, b:b.text, overlapX, overlapY });
      }
    }
    return {
      selectors, arrow, brought, line, zero, firstLine, downDigits, subtrahends,
      strokeWidth, firstStrokeWidth, scale, choiceBoxCount, textOverlaps,
      arrowGap, arrowGapPx:arrowGap,
      lineGap, lineGapPx:lineGap,
      firstLineGapPx:firstLineGap,
      middleGapPx:middleGap,
      arrowOverlap:overlapArea(arrow, brought),
      lineOverlap:overlapArea(line, zero, strokeWidth)
    };
  })()`);
  assert(audit.arrow && audit.brought && audit.line && audit.zero, `${label}: SVG clearance target missing`, audit);
  assert(audit.arrowOverlap === 0 && audit.arrowGapPx >= 4, `${label}: arrow overlaps the brought digit`, audit);
  assert(audit.lineOverlap === 0 && audit.lineGapPx >= 4, `${label}: subtraction line overlaps zero`, audit);
  if (mode === "complete") {
    assert(audit.choiceBoxCount === 0, `${label}: completed board still shows choice boxes`, audit);
    assert(audit.downDigits.length === 2 && audit.subtrahends.length === 2, `${label}: completed long division digits are missing`, audit);
    assert(audit.firstLineGapPx >= 4, `${label}: first subtraction line overlaps the brought-down number`, audit);
    assert(audit.middleGapPx >= 4, `${label}: brought-down number overlaps the second subtraction`, audit);
    assert(audit.textOverlaps.length === 0, `${label}: completed long division text overlaps`, audit);
  }
  return audit;
}

async function auditDivideFarmLayout(page, label, { confirmation = false, complete = false, finalAnswer = false } = {}) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const entry = rectOf(document.querySelector('.farm-share-entry'));
    const source = rectOf(document.querySelector('.farm-share-source'));
    const problemBox = rectOf(document.querySelector('.farm-problem-box'));
    const stepBox = rectOf(document.querySelector('.farm-step-box'));
    const problemText = rectOf(document.querySelector('.farm-problem'));
    const stepText = rectOf(document.querySelector('.farm-step-expression'));
    const instructionText = rectOf(document.querySelector('.farm-instruction'));
    const contains = (outer, inner, tolerance = 1) => Boolean(outer && inner
      && inner.left >= outer.left - tolerance && inner.top >= outer.top - tolerance
      && inner.right <= outer.right + tolerance && inner.bottom <= outer.bottom + tolerance);
    const dragPieces = [...document.querySelectorAll('.farm-share-source-pieces .farm-drag-piece')].filter(visible).map(rectOf);
    const preview = rectOf(document.querySelector('.farm-share-preview'));
    const baskets = [...document.querySelectorAll('.farm-share-basket')].filter(visible).map(rectOf);
    const basketUnitCount = [...document.querySelectorAll('.farm-share-basket')]
      .reduce((sum, node) => sum + Number(node.dataset.count || 0), 0);
    const currentStep = window.__mathmonEngineQa?.getCurrentStep?.();
    const sourcePieceCount = document.querySelectorAll('.farm-share-source-pieces .farm-produce-piece').length;
    const sourcePieceRects = [...document.querySelectorAll('.farm-share-source-pieces .farm-produce-piece')].map(rectOf);
    const sourceBundleLabels = [...document.querySelectorAll('.farm-share-source-pieces .farm-produce-piece--bundle .farm-produce-value')].map((label) => {
      const style = getComputedStyle(label);
      return {
        rect:rectOf(label),
        text:label.textContent.trim(),
        clientHeight:label.clientHeight,
        scrollHeight:label.scrollHeight,
        fontSize:Number.parseFloat(style.fontSize) || 0
      };
    });
    const sourcePiecesInside = sourcePieceRects.every((rect) => contains(source, rect, 1));
    const sourcePieceTopGap = sourcePieceRects.length ? Math.min(...sourcePieceRects.map((rect) => rect.top - source.top)) : null;
    const sourcePieceBottomGap = sourcePieceRects.length ? Math.min(...sourcePieceRects.map((rect) => source.bottom - rect.bottom)) : null;
    let sourcePieceOverlaps = 0;
    for (let i = 0; i < sourcePieceRects.length; i += 1) for (let j = i + 1; j < sourcePieceRects.length; j += 1) {
      const a = sourcePieceRects[i], b = sourcePieceRects[j];
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 1 && overlapY > 1) sourcePieceOverlaps += 1;
    }
    const sourceMoreCount = document.querySelectorAll('.farm-share-source-pieces .farm-piece-more').length;
    const basketLabelCount = document.querySelectorAll('.farm-share-basket-name, .farm-share-basket-amount').length;
    const feedbackText = document.querySelector('.farm-share-feedback')?.textContent.trim() || '';
    const core = ['.farm-share-source', '.farm-share-preview', '.farm-share-decision', '.farm-share-feedback']
      .map((selector) => ({ selector, rect:rectOf(document.querySelector(selector)) }));
    const coreInside = core.every((item) => !item.rect || (entry
      && item.rect.left >= entry.left - 1 && item.rect.top >= entry.top - 1
      && item.rect.right <= entry.right + 1 && item.rect.bottom <= entry.bottom + 1));
    const confirmationPanel = rectOf(document.querySelector('.farm-share-confirmation'));
    const confirmationTitle = rectOf(document.querySelector('.farm-confirm-title'));
    const confirmationBaskets = rectOf(document.querySelector('.farm-confirm-baskets'));
    const confirmationEquation = rectOf(document.querySelector('.farm-confirm-equation'));
    const confirmationButton = rectOf(document.querySelector('.farm-confirm-next-button:not([hidden])'));
    const problemGrid = rectOf(document.querySelector('.problem-grid'));
    const completePanel = rectOf(document.querySelector('#completePanel.is-visible'));
    const completeText = rectOf(document.querySelector('#completePanel.is-visible .complete-text'));
    const finalAnswerEntry = rectOf(document.querySelector('.farm-final-answer-entry'));
    const finalAnswerWork = rectOf(document.querySelector('.farm-final-answer-work'));
    const finalAnswerControls = rectOf(document.querySelector('.farm-final-answer-controls'));
    const finalAnswerExpression = rectOf(document.querySelector('.farm-final-answer-expression'));
    const finalAnswerKeypad = rectOf(document.querySelector('.farm-final-answer-keypad'));
    const finalAnswerKeys = [...document.querySelectorAll('.farm-final-answer-keypad .farm-key')].filter(visible).map(rectOf);
    const finalAnswerSources = [...document.querySelectorAll('.farm-final-answer-source')].map((row) => {
      const rowRect = rectOf(row);
      const label = row.querySelector('.farm-final-answer-source-label');
      const equation = row.querySelector('.farm-final-answer-source-equation');
      const labelRect = rectOf(label);
      const equationRect = rectOf(equation);
      return {
        row:rowRect,
        label:labelRect,
        equation:equationRect,
        labelText:label?.textContent.trim() || '',
        equationText:equation?.textContent.trim() || '',
        gap:labelRect && equationRect ? equationRect.left - labelRect.right : null,
        centerDelta:labelRect && equationRect ? Math.abs((labelRect.top + labelRect.height / 2) - (equationRect.top + equationRect.height / 2)) : null
      };
    });
    const finalAnswerMergeArrow = rectOf(document.querySelector('.farm-final-answer-merge-arrow'));
    const pendingAnswerBox = rectOf(document.querySelector('.farm-pending-answer-box'));
    const pendingAnswerText = rectOf(document.querySelector('.farm-pending-answer-header .farm-problem'));
    const currentProblem = window.__mathmonEngineQa?.getCurrentProblem?.();
    const expectedFinalSourceRows = currentProblem ? [
      ['묶음 나누기', currentProblem.tensValue + ' ÷ ' + currentProblem.divisor + ' = ' + currentProblem.tensShare],
      ['낱개 나누기', currentProblem.ones + ' ÷ ' + currentProblem.divisor + ' = ' + currentProblem.onesQuotient]
    ] : [];
    const visibleCompleteSummary = visible(document.querySelector('.farm-complete-summary'));
    const ariaLabels = [...document.querySelectorAll('.problem-grid [aria-label]')]
      .filter(visible)
      .map((node) => node.getAttribute('aria-label') || '');
    const fullAnswerLabel = currentProblem
      ? currentProblem.dividend + ' ÷ ' + currentProblem.divisor + ' = ' + currentProblem.quotient
      : '';
    const completeProcessRows = [...document.querySelectorAll('#completePanel.is-visible .farm-complete-process-line:not(.is-total)')].map((row) => {
      const label = rectOf(row.querySelector('small'));
      const equation = rectOf(row.querySelector('.farm-complete-process-equation'));
      return {
        label,
        equation,
        gap:label && equation ? equation.left - label.right : null,
        centerDelta:label && equation ? Math.abs((label.top + label.height / 2) - (equation.top + equation.height / 2)) : null,
        labelText:row.querySelector('small')?.textContent?.trim() || ''
      };
    });
    const reaction = document.querySelector('.play-mathmon-reaction');
    return {
      stage, entry, source, preview, dragPieceCount:dragPieces.length,
      problemBox, stepBox,
      headerGap:problemBox && stepBox ? stepBox.left - problemBox.right : null,
      problemTextInside:contains(problemBox, problemText, 2),
      stepTextInside:contains(stepBox, stepText, 2),
      instructionTextInside:contains(stepBox, instructionText, 2),
      minDragWidth:dragPieces.length ? Math.min(...dragPieces.map((rect) => rect.width)) : 0,
      minDragHeight:dragPieces.length ? Math.min(...dragPieces.map((rect) => rect.height)) : 0,
      minBasketHeight:baskets.length ? Math.min(...baskets.map((rect) => rect.height)) : 0,
      expectedSourcePieceCount:Number(currentStep?.unitCount || 0),
      sourcePieceCount, basketUnitCount, totalUnitCount:sourcePieceCount + basketUnitCount,
      sourcePieceOverlaps, sourcePiecesInside, sourcePieceTopGap, sourcePieceBottomGap,
      sourceBundleLabelCount:sourceBundleLabels.length,
      sourceBundleLabelsInside:sourceBundleLabels.every((label) => contains(source, label.rect, 1)),
      sourceBundleLabelsClipped:sourceBundleLabels.filter((label) => label.scrollHeight > label.clientHeight).length,
      sourceBundleLabelMinHeight:sourceBundleLabels.length ? Math.min(...sourceBundleLabels.map((label) => label.rect.height)) : null,
      sourceBundleLabelMinFontSize:sourceBundleLabels.length ? Math.min(...sourceBundleLabels.map((label) => label.fontSize)) : null,
      sourceMoreCount, basketLabelCount, feedbackText,
      reactionVisible:visible(reaction),
      entryWidthRatio:stage && entry ? entry.width / stage.width : null,
      coreInside,
      confirmationPanel, confirmationTitle, confirmationBaskets, confirmationEquation, confirmationButton,
      confirmationInside:confirmationPanel && confirmationBaskets
        ? confirmationBaskets.left >= confirmationPanel.left - 1 && confirmationBaskets.right <= confirmationPanel.right + 1
          && confirmationBaskets.top >= confirmationPanel.top - 1 && confirmationBaskets.bottom <= confirmationPanel.bottom + 1
        : true,
      confirmationButtonInside:confirmationPanel && confirmationButton ? contains(confirmationPanel, confirmationButton, 1) : true,
      confirmationTitleGap:confirmationTitle && confirmationBaskets ? confirmationBaskets.top - confirmationTitle.bottom : null,
      confirmationEquationGap:confirmationBaskets && confirmationEquation ? confirmationEquation.top - confirmationBaskets.bottom : null,
      confirmationButtonGap:confirmationEquation && confirmationButton ? confirmationButton.top - confirmationEquation.bottom : null,
      completePanel, completeText, completeProcessRows,
      finalAnswerEntry, finalAnswerWork, finalAnswerControls, finalAnswerExpression, finalAnswerKeypad,
      finalAnswerSources, finalAnswerMergeArrow, expectedFinalSourceRows,
      finalAnswerKeyCount:finalAnswerKeys.length,
      finalAnswerMinKeyWidth:finalAnswerKeys.length ? Math.min(...finalAnswerKeys.map((rect) => rect.width)) : 0,
      finalAnswerMinKeyHeight:finalAnswerKeys.length ? Math.min(...finalAnswerKeys.map((rect) => rect.height)) : 0,
      finalAnswerColumnsGap:finalAnswerWork && finalAnswerControls ? finalAnswerControls.left - finalAnswerWork.right : null,
      finalAnswerInside:contains(entry || rectOf(document.querySelector('.choices-panel')), finalAnswerEntry, 1),
      finalAnswerWorkInside:contains(finalAnswerEntry, finalAnswerWork, 1),
      finalAnswerControlsInside:contains(finalAnswerEntry, finalAnswerControls, 1),
      finalAnswerExpressionInside:contains(finalAnswerWork, finalAnswerExpression, 1),
      finalAnswerSourcesInside:finalAnswerSources.every((source) => contains(finalAnswerWork, source.row, 1)
        && contains(source.row, source.label, 1) && contains(source.row, source.equation, 1)),
      finalAnswerMergeInside:contains(finalAnswerWork, finalAnswerMergeArrow, 1),
      finalAnswerSourceExpressionGap:finalAnswerMergeArrow && finalAnswerExpression
        ? finalAnswerExpression.top - finalAnswerMergeArrow.bottom
        : null,
      finalAnswerKeypadInside:contains(finalAnswerControls, finalAnswerKeypad, 1),
      pendingAnswerTextInside:contains(pendingAnswerBox, pendingAnswerText, 2),
      pendingEquation:document.querySelector('.farm-pending-answer-header .farm-problem')?.textContent.trim() || '',
      finalAnswerDisplay:document.querySelector('.farm-final-answer-display')?.textContent.trim() || '',
      visibleCompleteSummary,
      leakedFullAnswer:fullAnswerLabel ? ariaLabels.some((label) => label.includes(fullAnswerLabel)) : false,
      completeWidthRatio:stage && completePanel ? completePanel.width / stage.width : null,
      completeSameColumn:problemGrid && completePanel
        ? Math.abs(problemGrid.left - completePanel.left) <= 1 && Math.abs(problemGrid.right - completePanel.right) <= 1
        : true,
    };
  })()`);
  if (!complete && !finalAnswer && (audit.problemBox || audit.stepBox)) {
    assert(audit.problemBox && audit.stepBox && audit.headerGap >= 8, `${label}: full problem and current step are not visibly separated`, audit);
    assert(audit.problemTextInside, `${label}: full problem left its own panel`, audit);
    assert(audit.stepTextInside && audit.instructionTextInside, `${label}: current step left its own panel`, audit);
  }
  if (!confirmation && !complete && !finalAnswer) {
    assert(audit.problemBox && audit.stepBox, `${label}: split problem header is missing`, audit);
    assert(audit.entry && audit.preview, `${label}: drag distribution state missing`, audit);
    assert(audit.entryWidthRatio >= 0.65, `${label}: share workbench is narrower than 65% of the Stage`, audit);
    if (audit.dragPieceCount > 0) assert(audit.minDragWidth >= 28 && audit.minDragHeight >= 42, `${label}: draggable produce is too small`, audit);
    assert(audit.totalUnitCount === audit.expectedSourcePieceCount && audit.sourceMoreCount === 0, `${label}: produce units were lost or abbreviated`, audit);
    assert(audit.sourcePieceOverlaps === 0, `${label}: source produce images overlap instead of showing every bundle`, audit);
    assert(audit.sourcePiecesInside, `${label}: source produce left its original card`, audit);
    if (audit.sourceBundleLabelCount > 0) {
      assert(audit.sourceBundleLabelsInside, `${label}: bundle value label left its original card`, audit);
      assert(audit.sourceBundleLabelsClipped === 0, `${label}: bundle value text is vertically clipped`, audit);
      assert(audit.sourceBundleLabelMinHeight >= 20 && audit.sourceBundleLabelMinFontSize >= 14, `${label}: bundle value label is too small`, audit);
    }
    if (audit.dragPieceCount > 0) assert(audit.sourcePieceTopGap >= 8 && audit.sourcePieceBottomGap >= 8, `${label}: source produce touches the card border`, audit);
    assert(!audit.reactionVisible, `${label}: play reaction character covers the basket workbench`, audit);
    assert(audit.basketLabelCount === 0, `${label}: redundant basket labels or question marks returned`, audit);
    assert(audit.feedbackText !== "바구니마다 같은 양이어야 해요.", `${label}: default helper sentence returned`, audit);
    assert(audit.minBasketHeight >= 70, `${label}: empty baskets are too small`, audit);
    assert(audit.coreInside, `${label}: share decision content left its reserved panel`, audit);
  }
  if (confirmation) {
    assert(audit.confirmationPanel && audit.confirmationBaskets && audit.confirmationInside, `${label}: share confirmation panel is incomplete`, audit);
    if (audit.confirmationButton) {
      assert(audit.confirmationButtonInside, `${label}: manual next button left the confirmation panel`, audit);
      assert(audit.confirmationButton.width >= 200 && audit.confirmationButton.height >= 42, `${label}: manual next button is smaller than the touch target`, audit);
      assert(audit.confirmationTitleGap >= 4 && audit.confirmationEquationGap >= 4 && audit.confirmationButtonGap >= 4, `${label}: confirmation content overlaps the manual next button`, audit);
    }
  }
  if (finalAnswer) {
    assert(audit.finalAnswerEntry && audit.finalAnswerWork && audit.finalAnswerControls, `${label}: final sum entry is missing`, audit);
    assert(audit.finalAnswerWorkInside && audit.finalAnswerControlsInside, `${label}: final sum columns left their panel`, audit);
    assert(audit.finalAnswerExpressionInside && audit.finalAnswerKeypadInside, `${label}: final expression or keypad left its card`, audit);
    assert(audit.finalAnswerSources.length === 2 && audit.finalAnswerSourcesInside, `${label}: the two source equations are missing or outside their card`, audit);
    assert(audit.finalAnswerMergeInside && audit.finalAnswerSourceExpressionGap >= 4, `${label}: the source equations do not lead cleanly into the final sum`, audit);
    audit.finalAnswerSources.forEach((source, index) => {
      assert(['묶음 나누기', '낱개 나누기'].includes(source.labelText), `${label}: final sum source ${index + 1} has an unclear label`, audit);
      assert(source.gap >= 8 && source.gap <= 24 && source.centerDelta <= 3, `${label}: final sum source ${index + 1} is detached from its equation`, audit);
      assert(source.labelText === audit.expectedFinalSourceRows[index][0] && source.equationText === audit.expectedFinalSourceRows[index][1], `${label}: final sum source ${index + 1} does not explain the addition`, audit);
    });
    assert(audit.finalAnswerColumnsGap >= 8, `${label}: final expression and keypad overlap`, audit);
    assert(audit.finalAnswerKeyCount === 12, `${label}: final answer keypad is incomplete`, audit);
    assert(audit.finalAnswerMinKeyWidth >= 42 && audit.finalAnswerMinKeyHeight >= 42, `${label}: final answer key is smaller than 42px`, audit);
    assert(audit.pendingAnswerTextInside && /=\s*\?$/.test(audit.pendingEquation), `${label}: full division answer is not hidden with a question mark`, audit);
    assert(!audit.visibleCompleteSummary && !audit.leakedFullAnswer, `${label}: completed quotient leaked before the final sum was checked`, audit);
  }
  if (complete) {
    assert(audit.completePanel && audit.completeText, `${label}: completed division panel is missing`, audit);
    assert(audit.completeProcessRows.length >= 1, `${label}: completed division process rows are missing`, audit);
    audit.completeProcessRows.forEach((row, index) => {
      assert(row.label && row.equation, `${label}: completed division row ${index + 1} is incomplete`, audit);
      assert(row.gap >= 8 && row.gap <= 24, `${label}: completed division row ${index + 1} label is detached from its equation`, audit);
      assert(row.centerDelta <= 3, `${label}: completed division row ${index + 1} label is not aligned with its equation`, audit);
      assert(['묶음 나누기', '낱개 나누기'].includes(row.labelText), `${label}: completed division row ${index + 1} has an unclear label`, audit);
    });
    assert(audit.completeWidthRatio >= 0.7 && audit.completeSameColumn, `${label}: completed division panel split the learning column`, audit);
  }
  return audit;
}

async function auditCheckLockLayout(page, label) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const contains = (outer, inner, tolerance = 1) => Boolean(outer && inner
      && inner.left >= outer.left - tolerance
      && inner.top >= outer.top - tolerance
      && inner.right <= outer.right + tolerance
      && inner.bottom <= outer.bottom + tolerance);
    const stage = rectOf(document.querySelector('.stage-shell'));
    const grid = rectOf(document.querySelector('.problem-grid'));
    const problem = rectOf(document.querySelector('.problem-card'));
    const visual = rectOf(document.querySelector('.visual-area'));
    const svg = rectOf(document.querySelector('.check-lock-svg'));
    const surface = rectOf(document.querySelector('.lock-board-bg'));
    const step = rectOf(document.querySelector('.step-board'));
    const choices = rectOf(document.querySelector('.choices-panel'));
    const keypad = rectOf(document.querySelector('.vault-keypad'));
    const controls = [...document.querySelectorAll('.vault-key, .check-lock-choice')]
      .filter((node) => {
        const style = getComputedStyle(node);
        const rect = node.getBoundingClientRect();
        return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
      })
      .map(rectOf);
    const textOutsideSurface = [...document.querySelectorAll('.check-lock-svg text')]
      .map((node) => ({ text:node.textContent.trim(), rect:rectOf(node) }))
      .filter((item) => !contains(surface, item.rect, 2));
    return {
      stage, grid, problem, visual, svg, surface, step, choices, keypad,
      gridWidthRatio: stage && grid ? grid.width / stage.width : null,
      surfaceWidthRatio: stage && surface ? surface.width / stage.width : null,
      surfaceAreaRatio: stage && surface ? (surface.width * surface.height) / (stage.width * stage.height) : null,
      surfaceGap: surface && step ? step.top - surface.bottom : null,
      stepChoiceGap: step && choices ? choices.top - step.bottom : null,
      surfaceInsideVisual: contains(visual, surface, 1),
      svgInsideProblem: contains(problem, svg, 1),
      keypadInsideChoices: keypad ? contains(choices, keypad, 1) : true,
      minControlWidth: controls.length ? Math.min(...controls.map((rect) => rect.width)) : 0,
      minControlHeight: controls.length ? Math.min(...controls.map((rect) => rect.height)) : 0,
      controlCount: controls.length,
      textOutsideSurface
    };
  })()`);
  assert(audit.stage && audit.grid && audit.problem && audit.visual && audit.svg && audit.surface && audit.step && audit.choices, `${label}: check-lock layout state missing`, audit);
  assert(audit.gridWidthRatio >= 0.7, `${label}: learning workbench is narrower than 70% of the Stage`, audit);
  assert(audit.surfaceWidthRatio >= 0.65, `${label}: core verification board is narrower than 65% of the Stage`, audit);
  assert(audit.surfaceGap >= 6, `${label}: vault calculation surface overlaps instruction`, audit);
  assert(audit.stepChoiceGap >= 4, `${label}: instruction overlaps keypad or lever choices`, audit);
  assert(audit.surfaceInsideVisual && audit.svgInsideProblem, `${label}: vault calculation surface left its reserved grid track`, audit);
  assert(audit.keypadInsideChoices, `${label}: keypad left its reserved choice track`, audit);
  assert(audit.controlCount > 0 && audit.minControlWidth >= 42 && audit.minControlHeight >= 42, `${label}: check-lock touch target is smaller than 42px`, audit);
  assert(audit.textOutsideSurface.length === 0, `${label}: SVG text left the vault calculation surface`, audit);
  return audit;
}

async function auditCheckLockCompleteLayout(page, label) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const grid = rectOf(document.querySelector('.problem-grid'));
    const surface = rectOf(document.querySelector('.lock-board-bg'));
    const complete = rectOf(document.querySelector('.complete-panel'));
    return {
      stage, grid, surface, complete,
      surfaceWidthRatio: stage && surface ? surface.width / stage.width : null,
      completeWidthRatio: stage && complete ? complete.width / stage.width : null,
      surfaceCompleteGap: surface && complete ? complete.top - surface.bottom : null,
      sameColumn: grid && complete ? Math.abs(grid.left - complete.left) <= 1 && Math.abs(grid.right - complete.right) <= 1 : false
    };
  })()`);
  assert(audit.stage && audit.grid && audit.surface && audit.complete, `${label}: final confirmation layout state missing`, audit);
  assert(audit.surfaceWidthRatio >= 0.65, `${label}: final verification board is narrower than 65% of the Stage`, audit);
  assert(audit.completeWidthRatio >= 0.7 && audit.sameColumn, `${label}: reward action split the learning workbench into another column`, audit);
  assert(audit.surfaceCompleteGap >= 6, `${label}: final verification board overlaps the reward action`, audit);
  return audit;
}

async function auditResultLeaderboardButton(page, label) {
  const audit = await evaluate(page, `(() => {
    const art = document.getElementById('leaderboardButtonArt');
    const hitbox = document.getElementById('leaderboardButton');
    const read = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2 };
    };
    return {
      art: art ? { hidden:art.hidden, complete:art.complete, naturalWidth:art.naturalWidth, rect:read(art) } : null,
      hitbox: hitbox ? { hidden:hitbox.hidden, rect:read(hitbox) } : null
    };
  })()`);
  assert(audit.art && !audit.art.hidden && audit.art.complete && audit.art.naturalWidth > 0, `${label}: generated leaderboard button art missing`, audit);
  assert(audit.hitbox && !audit.hitbox.hidden && audit.hitbox.rect.width >= 42 && audit.hitbox.rect.height >= 42, `${label}: leaderboard hitbox missing`, audit);
  assert(Math.abs(audit.art.rect.cx - audit.hitbox.rect.cx) <= 1 && Math.abs(audit.art.rect.cy - audit.hitbox.rect.cy) <= 1, `${label}: leaderboard art and hitbox centers differ`, audit);
  assert(Math.abs(audit.art.rect.width - audit.hitbox.rect.width) <= 1 && Math.abs(audit.art.rect.height - audit.hitbox.rect.height) <= 1, `${label}: leaderboard art and hitbox sizes differ`, audit);
}

async function renderScoreboardQaState(page, mode) {
  await evaluate(page, `(() => {
    const root = document.getElementById('screen-scoreboard');
    const entries = Array.from({ length: 10 }, (_, index) => ({
      rank: index + 1,
      nickname: '아주긴매스몬이름' + (index + 1),
      score: String(100 - index * 3),
      correctCount: 10 - (index % 3),
      weekStart: '2026-07-13',
      rewardResult: { id: 'qa' }
    }));
    const state = {
      root,
      apiEnabled: ${JSON.stringify("MODE")} !== 'offline',
      loading: ${JSON.stringify("MODE")} === 'loading',
      error: ${JSON.stringify("MODE")} === 'error',
      session: ${JSON.stringify("MODE")} === 'offline' ? null : { nickname: '반짝여우몬' },
      submission: ${JSON.stringify("MODE")} === 'success' ? { nickname: '반짝여우몬', score: '82', correctCount: 9 } : null,
      score: 82,
      rewardResult: { id: 'qa' },
      myEntry: ${JSON.stringify("MODE")} === 'success' ? entries[6] : null,
      weekLabel: '이번 주',
      entries: ${JSON.stringify("MODE")} === 'success' ? entries : [],
      totalQuestions: 10
    };
    MathmonScoreboard.render(state);
  })()`.replaceAll('"MODE"', JSON.stringify(mode)));
}

async function auditScoreboard(page, label, { expectedFirstRank = null, expectedLastRank = null } = {}) {
  const audit = await evaluate(page, `(() => {
    const root = document.getElementById('screen-scoreboard');
    const stage = root.querySelector('.mathmon-scoreboard-stage');
    const faces = [...root.querySelectorAll('.mathmon-scoreboard-button-face')];
    const hitboxes = [...root.querySelectorAll('.mathmon-scoreboard-hitbox')];
    const rect = (node) => {
      const box = node.getBoundingClientRect();
      return { left:box.left, top:box.top, width:box.width, height:box.height, cx:box.left + box.width / 2, cy:box.top + box.height / 2 };
    };
    const buttonDeltas = hitboxes.map((button, index) => {
      const hit = rect(button), face = rect(faces[index]);
      return { centerX:Math.abs(hit.cx - face.cx), centerY:Math.abs(hit.cy - face.cy), width:Math.abs(hit.width - face.width), height:Math.abs(hit.height - face.height), hit };
    });
    const svgTextOutside = [...root.querySelectorAll('svg text')].filter((node) => {
      try {
        const box = node.getBBox();
        const viewBox = node.ownerSVGElement.viewBox.baseVal;
        return box.x < viewBox.x - 1 || box.y < viewBox.y - 1 || box.x + box.width > viewBox.x + viewBox.width + 1 || box.y + box.height > viewBox.y + viewBox.height + 1;
      } catch { return false; }
    }).map((node) => node.textContent.trim());
    const ranks = [...root.querySelectorAll('.mathmon-scoreboard-rank')].map((node) => Number(node.textContent.trim())).filter(Number.isFinite);
    const names = [...root.querySelectorAll('.mathmon-scoreboard-name')].map((node) => node.textContent.trim());
    const image = root.querySelector('.mathmon-scoreboard-stage-art');
    return {
      active: root.classList.contains('is-active'),
      viewBox: stage?.getAttribute('viewBox') || '',
      status: root.querySelector('[data-scoreboard-status]')?.textContent.trim() || '',
      empty: root.querySelector('.mathmon-scoreboard-empty')?.textContent.trim() || '',
      ranks,
      names,
      buttonDeltas,
      svgTextOutside,
      image: image ? { href:image.getAttribute('href'), width:image.getBoundingClientRect().width, height:image.getBoundingClientRect().height } : null
    };
  })()`);
  assert(audit.active && audit.viewBox === "0 0 1280 800", `${label}: scoreboard Stage contract missing`, audit);
  assert(audit.image?.href?.includes('scoreboard-celebration-bg-generated.webp') && audit.image.width > 0 && audit.image.height > 0, `${label}: generated celebration background missing`, audit);
  assert(audit.buttonDeltas.length === 3 && audit.buttonDeltas.every((item) => item.centerX <= 1 && item.centerY <= 1 && item.width <= 1 && item.height <= 1 && item.hit.width >= 42 && item.hit.height >= 42), `${label}: SVG button and HTML hitbox mismatch`, audit);
  assert(audit.svgTextOutside.length === 0, `${label}: SVG text left its viewBox`, audit);
  assert(audit.names.every((name) => name.length <= 12), `${label}: long nickname was not truncated`, audit);
  if (expectedFirstRank !== null) assert(audit.ranks[0] === expectedFirstRank, `${label}: first visible rank mismatch`, audit);
  if (expectedLastRank !== null) assert(audit.ranks.at(-1) === expectedLastRank, `${label}: last visible rank mismatch`, audit);
  return audit;
}

async function auditElevatorPlayStackClearance(page, label) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const overlapArea = (a, b) => {
      if (!a || !b) return null;
      return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
        * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
    };
    const stage = rectOf('.stage-shell');
    const problem = rectOf('.problem-card');
    const step = rectOf('.step-board');
    const choices = rectOf('.choices-panel');
    const floor = rectOf('.elevator-floor-panel');
    return {
      stage,
      problem,
      step,
      choices,
      floor,
      problemStepGap: problem && step ? step.top - problem.bottom : null,
      stepChoicesGap: step && choices ? choices.top - step.bottom : null,
      problemStepOverlapArea: overlapArea(problem, step),
      stepChoicesOverlapArea: overlapArea(step, choices),
      choicesStageBottomGap: stage && choices ? stage.bottom - choices.bottom : null
    };
  })()`);
  assert(audit.stage && audit.problem && audit.step && audit.choices && audit.floor, `${label}: play stack surface is missing`, audit);
  assert(audit.problemStepOverlapArea === 0 && audit.problemStepGap >= 7.5, `${label}: calculation board overlaps instruction`, audit);
  assert(audit.stepChoicesOverlapArea === 0 && audit.stepChoicesGap >= 7.5, `${label}: instruction overlaps choices`, audit);
  assert(audit.choicesStageBottomGap >= 7.5, `${label}: choices leave the Stage`, audit);
  assert(
    Math.abs(audit.floor.left - audit.choices.left) <= 1
      && Math.abs(audit.floor.top - audit.choices.top) <= 1
      && Math.abs(audit.floor.right - audit.choices.right) <= 1
      && Math.abs(audit.floor.bottom - audit.choices.bottom) <= 1,
    `${label}: choice surface leaves its grid slot`,
    audit
  );
  return audit;
}

async function auditElevatorDivisionBoard(page, label, { expectDown = false } = {}) {
  await auditElevatorPlayStackClearance(page, `${label} play stack`);
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2 };
    };
    const surface = rectOf(document.querySelector('.math-board-surface rect'));
    const work = rectOf(document.querySelector('.division-work'));
    const step = rectOf(document.querySelector('.step-board'));
    const tensCell = rectOf(document.querySelector('.board-cell[aria-label^="십의 자리 수"] rect'));
    const onesCell = rectOf(document.querySelector('.board-cell[aria-label^="일의 자리 수"] rect'));
    const product = rectOf(document.querySelector('.board-work-product'));
    const remainder = rectOf(document.querySelector('.division-work .board-work-digit'));
    const combinedSlots = [...document.querySelectorAll('.board-combined-target .board-down-slot')].map((node) => ({ place:node.dataset.place || '', rect:rectOf(node) }));
    const combinedLabelNode = document.querySelector('.board-combined-label');
    const combinedLabelRect = rectOf(combinedLabelNode);
    const combinedValues = [...document.querySelectorAll('.board-combined-value')].map((node) => ({ place:node.dataset.place || '', text:node.textContent.trim(), rect:rectOf(node) }));
    const combinedTarget = combinedSlots.length === 2 ? {
      left:combinedSlots[0].rect.left,
      top:Math.min(...combinedSlots.map((item) => item.rect.top)),
      right:combinedSlots[1].rect.right,
      bottom:Math.max(...combinedSlots.map((item) => item.rect.bottom)),
      width:combinedSlots[1].rect.right - combinedSlots[0].rect.left,
      height:Math.max(...combinedSlots.map((item) => item.rect.height))
    } : null;
    const combineSource = document.querySelector('.board-combine-source');
    const arrow = document.querySelector('.board-down-arrow')?.getAttribute('d') || '';
    const texts = [...document.querySelectorAll('.division-work text')].map((node) => ({ text:node.textContent, rect:rectOf(node) }));
    const textOverlaps = [];
    for (let i = 0; i < texts.length; i += 1) for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i].rect, b = texts[j].rect;
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 1 && overlapY > 1) textOverlaps.push([texts[i].text, texts[j].text, overlapX, overlapY]);
    }
    return {
      surface, work, step, tensCell, onesCell, product, remainder, combinedSlots, combinedTarget, combinedLabelRect, combinedValues, combineSource: Boolean(combineSource), arrow, textOverlaps,
      surfaceGap: surface && step ? step.top - surface.bottom : null,
      workGap: work && step ? step.top - work.bottom : null,
      productTopGap: product && tensCell ? product.top - tensCell.bottom : null,
      combinedValueColumnDeltas: combinedValues.map((item) => Math.abs(item.rect.cx - (item.place === 'tens' ? tensCell.cx : onesCell.cx))),
      combinedValueVerticalDeltas: combinedValues.map((item) => {
        const slot = combinedSlots.find((candidate) => candidate.place === item.place)?.rect;
        return slot ? Math.abs(item.rect.cy - slot.cy) : Infinity;
      }),
      productColumnDelta: product && tensCell ? Math.abs(product.cx - tensCell.cx) : null,
      remainderColumnDelta: remainder && tensCell ? Math.abs(remainder.cx - tensCell.cx) : null
    };
  })()`);
  assert(audit.surface && audit.work && audit.step, `${label}: division board state missing`, audit);
  assert(audit.surfaceGap >= 4, `${label}: calculation board overlaps instruction`, audit);
  assert(audit.workGap >= 4, `${label}: calculation work overlaps instruction`, audit);
  assert(audit.productColumnDelta <= 1, `${label}: partial product left its tens column`, audit);
  assert(audit.productTopGap >= 8, `${label}: partial product overlaps the dividend cell`, audit);
  assert(audit.remainderColumnDelta <= 1, `${label}: remainder left its tens column`, audit);
  assert(audit.textOverlaps.length === 0, `${label}: calculation text overlaps`, audit);
  if (expectDown) {
    assert(audit.combinedTarget, `${label}: combined-number target missing`, audit);
    assert(audit.combinedSlots.length === 2 && audit.combinedSlots[0].place === 'tens' && audit.combinedSlots[1].place === 'ones', `${label}: combined-number target is not split into two place-value cells`, audit);
    assert(Math.abs(audit.combinedSlots[0].rect.left - audit.tensCell.left) <= 1 && Math.abs(audit.combinedSlots[0].rect.right - audit.tensCell.right) <= 1, `${label}: combined-number tens cell is not aligned`, audit);
    assert(Math.abs(audit.combinedSlots[1].rect.left - audit.onesCell.left) <= 1 && Math.abs(audit.combinedSlots[1].rect.right - audit.onesCell.right) <= 1, `${label}: combined-number ones cell is not aligned`, audit);
    assert(audit.combinedSlots.every((item) => item.rect.width >= 80 && item.rect.height >= 48), `${label}: combined-number place-value cell is too small`, audit);
    assert(!audit.combinedLabelRect && audit.combinedValues.length >= 1 && audit.combinedValues.every((item) => item.rect.height >= 30), `${label}: combined-number target has an unnecessary label or a small value`, audit);
    assert(audit.combinedValueColumnDeltas.every((delta) => delta <= 1) && audit.combinedValueVerticalDeltas.every((delta) => delta <= 3), `${label}: combined-number digits left their place-value columns`, audit);
    assert(audit.surface.bottom - audit.combinedTarget.bottom >= 7, `${label}: calculation board has no breathing room below the combined-number target`, audit);
    assert(!audit.combineSource, `${label}: redundant combined-number explanation is still visible`, audit);
    assert(audit.arrow === 'M631 194 V226', `${label}: bring-down arrow is not vertical`, audit);
  }
}

async function auditElevatorPlayHeader(page, label) {
  const header = await evaluate(page, `(() => {
    const read = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        text: node.textContent.trim().replace(/\\s+/g, ' '),
        visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1,
        top: rect.top,
        bottom: rect.bottom,
        fontSize: parseFloat(style.fontSize),
        overflows: node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1
      };
    };
    return {
      brand: read('#screen-play .hud-left .brand-badge'),
      unit: read('#screen-play .hud-right .unit-badge'),
      counter: read('#problemCounter'),
      route: read('.elevator-route-summary')
    };
  })()`);
  assert(header.brand?.visible && header.brand.text === "에듀잇티 수학 게임", `${label}: Eduitit play badge missing`, header);
  assert(header.unit?.visible && header.unit.text === "2단원 나눗셈", `${label}: unit play badge missing`, header);
  assert(header.counter?.visible, `${label}: problem counter missing`, header);
  assert(header.route?.visible && /지금.*다음.*끝/.test(header.route.text), `${label}: current, next, and final floors are not visible`, header);
  assert(!header.route.overflows, `${label}: floor progress text overflows`, header);
  assert(Math.abs(header.brand.top - header.unit.top) <= 1, `${label}: brand and unit badges are off baseline`, header);
}

async function auditStarPickupPlayHeader(page, label) {
  const header = await evaluate(page, `(() => {
    const read = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        text: node.textContent.trim(),
        visible: style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1,
        top: rect.top,
        bottom: rect.bottom,
        ariaLabel: node.getAttribute('aria-label') || '',
        width: rect.width,
        height: rect.height
      };
    };
    const stage = document.querySelector('.stage-shell')?.getBoundingClientRect();
    const world = document.getElementById('starWorldPanel');
    const worldRect = world?.getBoundingClientRect();
    const image = document.getElementById('starWorldImage');
    return {
      brand: read('#screen-play .hud-left .brand-badge'),
      unit: read('#screen-play .hud-right .unit-badge'),
      counter: read('#problemCounter'),
      world: worldRect && stage ? {
        visible: worldRect.width > 1 && worldRect.height > 1,
        leftRatio: (worldRect.left - stage.left) / stage.width,
        topRatio: (worldRect.top - stage.top) / stage.height,
        widthRatio: worldRect.width / stage.width,
        heightRatio: worldRect.height / stage.height,
        imageSrc: image?.getAttribute('src') || '',
        complete: Boolean(image?.complete),
        naturalWidth: image?.naturalWidth || 0,
        naturalHeight: image?.naturalHeight || 0
      } : null
    };
  })()`);
  assert(header.brand?.visible && header.brand.text === "에듀잇티 수학 게임", `${label}: Eduitit play badge missing`, header);
  assert(header.unit?.visible && header.unit.text === "2단원 나눗셈", `${label}: unit play badge missing`, header);
  assert(header.counter?.visible && /^\d+\/10$/.test(header.counter.text) && header.counter.ariaLabel.includes("번째 문제"), `${label}: count-only progress is missing`, header);
  assert(header.world?.visible, `${label}: unicorn constellation board is missing`, header);
  assert(header.world.complete && header.world.naturalWidth === 600 && header.world.naturalHeight === 1312, `${label}: constellation state image is missing or has the wrong canvas`, header);
  assert(/^play-constellation-.+-generated\.webp$/.test(header.world.imageSrc), `${label}: constellation state image is not connected`, header);
  assert(Math.abs(header.world.leftRatio - .025) <= .006 && Math.abs(header.world.topRatio - .115) <= .008, `${label}: constellation board position drifted`, header);
  assert(Math.abs(header.world.widthRatio - .234375) <= .008 && Math.abs(header.world.heightRatio - .82) <= .01, `${label}: constellation board slot drifted`, header);
  assert(Math.abs(header.brand.top - header.unit.top) <= 1, `${label}: brand and unit badges are off baseline`, header);
  assert(Math.abs(header.brand.top - header.counter.top) <= 1, `${label}: play badges and journey are off baseline`, header);
}

async function auditStarPickupWaiting(page, label, expectedDividend) {
  const audit = await evaluate(page, `(() => {
    const choices = [...document.querySelectorAll('.star-choice')];
    const choiceRects = choices.map((node) => node.getBoundingClientRect());
    const products = choices.map((node) => node.querySelector('strong')?.textContent.trim() || '');
    const groups = choices.map((node) => node.querySelector('span')?.textContent.trim() || '');
    const stage = document.querySelector('.stage-shell')?.getBoundingClientRect();
    const world = document.getElementById('starWorldPanel')?.getBoundingClientRect();
    const board = document.getElementById('visualArea')?.getBoundingClientRect();
    return {
      dividend: window.__mathmonEngineQa.getCurrentProblem()?.dividend,
      looseStars: document.querySelectorAll('.star-loose-grid .star-glyph[data-tone="loose"]').length,
      instruction: document.getElementById('stepInstruction')?.textContent.trim() || '',
      choiceCount: choices.length,
      choiceHeights: choiceRects.map((rect) => rect.height),
      productFont: choices.length ? Math.min(...choices.map((node) => parseFloat(getComputedStyle(node.querySelector('strong')).fontSize))) : 0,
      groupFont: choices.length ? Math.min(...choices.map((node) => parseFloat(getComputedStyle(node.querySelector('span')).fontSize))) : 0,
      products,
      groups,
      worldBoardGap: world && board ? board.left - world.right : -1,
      stageVisible: Boolean(stage?.width && stage?.height)
    };
  })()`);
  assert(audit.stageVisible, `${label}: stage is missing`, audit);
  assert(audit.dividend === expectedDividend && audit.looseStars === expectedDividend, `${label}: loose star count does not match the dividend`, audit);
  assert(/×몇이 .* 넘지 않을까요\?$/.test(audit.instruction), `${label}: product-comparison instruction is missing`, audit);
  assert(audit.choiceCount === 3, `${label}: quotient choices must stay in one three-card row`, audit);
  assert(audit.choiceHeights.every((height) => height >= 108 && height <= 116), `${label}: quotient card height is not fixed at 112px`, audit);
  assert(audit.productFont >= 29 && audit.groupFont >= 23, `${label}: choice hierarchy is too small`, audit);
  assert(audit.products.every((text) => /^\d+×\d+=\d+$/.test(text)), `${label}: product and result are not the primary choice text`, audit);
  assert(audit.groups.every((text) => /^\d+묶음$/.test(text)), `${label}: group count is not the secondary choice text`, audit);
  assert(audit.worldBoardGap >= 12, `${label}: constellation board and calculation board overlap`, audit);
}

async function auditStarPickupEvidence(page, label, kind) {
  const audit = await evaluate(page, `(() => ({
    step: window.__mathmonEngineQa.getCurrentStep()?.id || '',
    proofStep: document.getElementById('visualArea')?.dataset.proofStep || '',
    revealedStep: document.getElementById('visualArea')?.dataset.revealedStep || '',
    feedback: document.getElementById('feedbackLine')?.textContent.trim() || '',
    capsuleCount: document.querySelectorAll('.star-capsule').length,
    missingSlotCount: document.querySelectorAll('.star-glyph[data-tone="missing-slot"]').length,
    hasNextGroup: Boolean(document.querySelector('.star-next-group')),
    hasFill: Boolean(document.querySelector('.star-capsule[data-state="full"]')),
    hasRemainderPanel: Boolean(document.querySelector('.star-remainder-focus')),
    minChoiceHeight: Math.min(...[...document.querySelectorAll('.star-choice')].map((node) => node.getBoundingClientRect().height))
  }))()`);
  assert(audit.feedback.length > 0, `${label}: one-line feedback is missing`, audit);
  assert(audit.minChoiceHeight >= 42, `${label}: choice touch target is too short`, audit);
  if (kind === "quotient-too-low") {
    assert(audit.step === "quotient" && audit.proofStep === "quotient", `${label}: quotient evidence state missing`, audit);
    assert(audit.hasNextGroup && audit.feedback.includes("한 묶음을 더"), `${label}: another possible group is not shown`, audit);
  } else if (kind === "quotient-too-high") {
    assert(audit.step === "quotient" && audit.proofStep === "quotient", `${label}: quotient evidence state missing`, audit);
    assert(audit.missingSlotCount > 0 && audit.feedback.includes("모자라"), `${label}: missing star slots are not shown`, audit);
  } else if (kind === "quotient-confirm") {
    assert(audit.step === "quotient" && audit.revealedStep === "quotient", `${label}: chosen quotient was not placed on the board`, audit);
    assert(audit.hasFill && audit.hasRemainderPanel && audit.feedback.includes("묶음"), `${label}: quotient confirmation is not visible`, audit);
  } else if (kind === "remainder-wrong") {
    assert(audit.step === "remainder" && audit.proofStep === "remainder", `${label}: remainder evidence state missing`, audit);
    assert(audit.hasNextGroup && audit.feedback.includes("한 묶음"), `${label}: divisor-sized leftover group is not shown`, audit);
  }
}

async function auditStarPickupResultTier(page, label, expectedTier) {
  const audit = await evaluate(page, `(() => {
    const screen = document.getElementById('screen-result');
    const background = document.getElementById('resultBg');
    const title = document.getElementById('resultTitleArt');
    return {
      tier: screen?.dataset.resultTier || '',
      heading: document.getElementById('resultTitle')?.textContent.trim() || '',
      background: {
        src: background?.getAttribute('src') || '',
        complete: Boolean(background?.complete),
        naturalWidth: background?.naturalWidth || 0,
        naturalHeight: background?.naturalHeight || 0
      },
      title: {
        src: title?.getAttribute('src') || '',
        complete: Boolean(title?.complete),
        naturalWidth: title?.naturalWidth || 0,
        naturalHeight: title?.naturalHeight || 0
      }
    };
  })()`);
  assert(audit.tier === expectedTier, `${label}: wrong result tier`, audit);
  assert(audit.background.complete && audit.background.naturalWidth === 1280 && audit.background.naturalHeight === 800, `${label}: generated result scene is missing or has the wrong canvas`, audit);
  assert(/^result-unicorn-.+-generated\.webp$/.test(audit.background.src), `${label}: result scene is not connected`, audit);
  assert(audit.title.complete && audit.title.naturalWidth > 0 && audit.title.naturalHeight > 0, `${label}: generated result title is missing`, audit);
  assert(/^result-title-.+-generated\.webp$/.test(audit.title.src), `${label}: result title is not connected`, audit);
}

async function auditElevatorLearningLegibility(page, label) {
  const audit = await evaluate(page, `(() => {
    const stage = document.querySelector('.stage-shell');
    const stageRect = stage?.getBoundingClientRect();
    const surfaceRect = document.querySelector('.math-board-surface rect')?.getBoundingClientRect();
    const choicesRect = document.querySelector('.choices-panel')?.getBoundingClientRect();
    const instructionRect = document.querySelector('.step-board')?.getBoundingClientRect();
    const scale = stage && stageRect ? stageRect.width / stage.offsetWidth : 1;
    const physicalFont = (selector) => {
      const node = document.querySelector(selector);
      return node ? parseFloat(getComputedStyle(node).fontSize) * scale : 0;
    };
    const choices = [...document.querySelectorAll('.elevator-choice--pair')];
    const choiceRects = choices.map((node) => node.getBoundingClientRect());
    const labels = choices.map((node) => [...node.querySelectorAll('.elevator-choice-label')].map((part) => part.textContent.trim()));
    const values = choices.map((node) => [...node.querySelectorAll('.elevator-choice-value')].map((part) => Number(part.textContent.trim())));
    return {
      scale,
      bigProblem: physicalFont('.big-problem'),
      boardNumber: physicalFont('.board-number'),
      instruction: physicalFont('.instruction'),
      choiceLabel: physicalFont('.elevator-choice-label'),
      choiceValue: physicalFont('.elevator-choice-value'),
      minChoiceHeight: choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.height)) : 0,
      labels,
      values,
      priorityLayout: stageRect && surfaceRect ? {
        priority: '1-current-calculation',
        informationBundles: 4,
        stage: { width:stageRect.width, height:stageRect.height },
        primary: {
          width:surfaceRect.width,
          height:surfaceRect.height,
          stageWidthRatio:surfaceRect.width / stageRect.width,
          stageAreaRatio:(surfaceRect.width * surfaceRect.height) / (stageRect.width * stageRect.height)
        },
        secondary: choicesRect ? { width:choicesRect.width, height:choicesRect.height } : null,
        tertiary: instructionRect ? { width:instructionRect.width, height:instructionRect.height } : null,
        judgement: 'pass'
      } : null
    };
  })()`);
  assert(audit.bigProblem >= 40, `${label}: main problem text is too small`, audit);
  assert(audit.boardNumber >= 32, `${label}: calculation board numbers are too small`, audit);
  assert(audit.instruction >= 14, `${label}: instruction text is too small`, audit);
  assert(audit.choiceLabel >= 12, `${label}: choice labels are too small`, audit);
  assert(audit.choiceValue >= 21, `${label}: choice values are too small`, audit);
  assert(audit.minChoiceHeight >= 42, `${label}: choice touch target is too short`, audit);
  assert(audit.labels.every((parts) => parts.join('|') === '몫|남은 수'), `${label}: choice meanings are unclear`, audit);
  assert(audit.values.every((parts) => parts.length === 2 && parts.every((value) => value % 10 === 0)), `${label}: first-step choices must show 20/10-style place values`, audit);
  assert(audit.priorityLayout?.primary?.stageWidthRatio >= 0.65, `${label}: current calculation board must use at least 65% of the Stage width`, audit);
  const primaryArea = audit.priorityLayout.primary.width * audit.priorityLayout.primary.height;
  const secondaryArea = audit.priorityLayout.secondary.width * audit.priorityLayout.secondary.height;
  assert(primaryArea > secondaryArea, `${label}: current calculation board must remain the largest content area`, audit);
  return audit.priorityLayout;
}

async function auditElevatorWrongEvidence(page, label, misconceptionId) {
  const audit = await evaluate(page, `(() => {
    const note = document.querySelector('.board-attempt-note');
    const wrongCell = document.querySelector('.board-cell.is-wrong');
    const work = document.querySelector('.division-work.is-wrong-attempt');
    const combinedWrong = document.querySelector('.board-combined-target.is-wrong');
    const noteRect = note?.querySelector('rect')?.getBoundingClientRect();
    const combinedRects = [...(combinedWrong?.querySelectorAll('rect') || [])].map((node) => node.getBoundingClientRect());
    const combinedRect = combinedRects.length ? {
      width:Math.max(...combinedRects.map((rect) => rect.right)) - Math.min(...combinedRects.map((rect) => rect.left)),
      height:Math.max(...combinedRects.map((rect) => rect.height))
    } : null;
    return {
      misconception: document.getElementById('visualArea')?.dataset.misconception || '',
      noteText: note?.textContent.trim().replace(/\\s+/g, ' ') || '',
      noteWidth: noteRect?.width || 0,
      noteHeight: noteRect?.height || 0,
      combinedText: combinedWrong?.textContent.trim().replace(/\\s+/g, ' ') || '',
      combinedWidth: combinedRect?.width || 0,
      combinedHeight: combinedRect?.height || 0,
      wrongCell: Boolean(wrongCell),
      wrongWork: Boolean(work),
      feedback: document.getElementById('feedbackLine')?.textContent.trim() || ''
    };
  })()`);
  assert(audit.misconception === misconceptionId, `${label}: wrong misconception state was not kept`, audit);
  const hasAttemptNote = audit.noteText.length > 0 && audit.noteWidth >= 70 && audit.noteHeight >= 30;
  const hasCombinedEvidence = audit.combinedText.length > 0 && audit.combinedWidth >= 120 && audit.combinedHeight >= 36;
  assert(hasAttemptNote || hasCombinedEvidence, `${label}: chosen wrong value is not visible on the board`, audit);
  assert(audit.wrongWork, `${label}: calculation board did not enter the wrong-evidence state`, audit);
  if (misconceptionId.includes('QUOTIENT')) assert(audit.wrongCell, `${label}: chosen quotient did not enter its board slot`, audit);
  assert(audit.feedback.length > 0, `${label}: one-line wrong reason is missing`, audit);
}

async function auditElevatorNumericLegibility(page, label) {
  const audit = await evaluate(page, `(() => {
    const instruction = document.querySelector('.instruction');
    const values = [...document.querySelectorAll('.elevator-number-value')];
    const choices = [...document.querySelectorAll('.elevator-choice')];
    const choicesPanel = document.querySelector('.choices-panel');
    const floorPanel = document.querySelector('.elevator-floor-panel');
    const choicesPanelRect = choicesPanel?.getBoundingClientRect();
    const floorPanelRect = floorPanel?.getBoundingClientRect();
    const choiceRects = choices.map((node) => node.getBoundingClientRect());
    const valueRects = values.map((node) => node.getBoundingClientRect());
    const widths = choiceRects.map((rect) => rect.width);
    const heights = choiceRects.map((rect) => rect.height);
    return {
      instruction: instruction ? parseFloat(getComputedStyle(instruction).fontSize) : 0,
      numericValue: values[0] ? parseFloat(getComputedStyle(values[0]).fontSize) : 0,
      minValueHeight: valueRects.length ? Math.min(...valueRects.map((rect) => rect.height)) : 0,
      valueCount: values.length,
      minChoiceHeight: heights.length ? Math.min(...heights) : 0,
      widthSpread: widths.length ? Math.max(...widths) - Math.min(...widths) : Infinity,
      heightSpread: heights.length ? Math.max(...heights) - Math.min(...heights) : Infinity,
      panelWidthDelta: choicesPanelRect && floorPanelRect ? Math.abs(choicesPanelRect.width - floorPanelRect.width) : Infinity,
      panelHeightDelta: choicesPanelRect && floorPanelRect ? Math.abs(choicesPanelRect.height - floorPanelRect.height) : Infinity,
      interaction: choicesPanel?.dataset.interaction || '',
      dropZone: Boolean(document.querySelector('.elevator-down-zone')),
      dragChoice: Boolean(document.querySelector('[data-direct-choice="true"]'))
    };
  })()`);
  assert(audit.instruction >= 14, `${label}: instruction text is too small`, audit);
  assert(audit.numericValue >= 28, `${label}: numeric choices are too small`, audit);
  assert(audit.minValueHeight >= 21, `${label}: numeric choice values render too small`, audit);
  assert(audit.valueCount === 4, `${label}: four numeric choices must stay visible`, audit);
  assert(audit.minChoiceHeight >= 42, `${label}: numeric choice touch target is too short`, audit);
  assert(audit.widthSpread <= 1 && audit.heightSpread <= 1, `${label}: numeric choices do not form an equal 2x2 grid`, audit);
  assert(audit.panelWidthDelta <= 1 && audit.panelHeightDelta <= 1, `${label}: numeric choice grid does not fill the choice area`, audit);
  assert(audit.interaction === 'floor-panel', `${label}: removed drag interaction is still declared`, audit);
  assert(!audit.dropZone && !audit.dragChoice, `${label}: removed drop target or drag wiring is still present`, audit);
}

async function inputFarmFinalValue(page, value) {
  for (const digit of String(value)) {
    await clickSelector(page, `.farm-final-answer-keypad .farm-key[data-key="${digit}"]`);
  }
  await clickSelector(page, '.farm-final-answer-keypad .farm-key[data-key="확인"]:not(:disabled)');
}

async function enterFarmFinalAnswer(page, { wrongFirst = false } = {}) {
  await waitUntil(page, "Boolean(document.querySelector('.farm-final-answer-entry'))", "final sum entry did not appear", 6000);
  const quotient = await evaluate(page, "window.__mathmonEngineQa.getCurrentProblem()?.quotient");
  assert(Number.isInteger(quotient), "final sum answer is missing from the current problem", { quotient });

  if (wrongFirst) {
    const lower = quotient - 1;
    const wrongValue = lower > 0 && String(lower).length === String(quotient).length ? lower : quotient + 1;
    await inputFarmFinalValue(page, wrongValue);
    await waitUntil(page, "Boolean(document.querySelector('.farm-final-answer-entry.is-wrong'))", "wrong final sum was not kept on screen", 6000);
  }

  await inputFarmFinalValue(page, quotient);
  await waitUntil(page, "document.getElementById('completePanel').classList.contains('is-visible')", "correct final sum did not reveal the completed division", 8000);
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
    const ready = `document.getElementById('completePanel').classList.contains('is-visible') || Boolean(document.querySelector('.farm-confirm-next-button:not([hidden]):not(:disabled)')) || (window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)})`;
    await waitUntil(page, ready, "correct response did not reach a confirmation", 6000);
    const manualAdvanceReady = await evaluate(page, "Boolean(document.querySelector('.farm-step-next-button:not([hidden]):not(:disabled)'))");
    if (manualAdvanceReady) {
      await clickSelector(page, ".farm-step-next-button:not([hidden]):not(:disabled)");
      await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)} && window.__mathmonEngineQa.getState().inputLocked === false`, "manual confirmation did not advance", 6000);
      continue;
    }
    const manualCompleteReady = await evaluate(page, "Boolean(document.querySelector('.farm-problem-complete-button:not([hidden]):not(:disabled)'))");
    if (manualCompleteReady) {
      await clickSelector(page, ".farm-problem-complete-button:not([hidden]):not(:disabled)");
      await enterFarmFinalAnswer(page);
    }
  }
}

async function solveCheckLockProblemWithAudits(page, lesson, viewport, shots, shotPrefix = "05-lock") {
  let stepNumber = 0;
  while (!(await evaluate(page, "document.getElementById('completePanel').classList.contains('is-visible')"))) {
    stepNumber += 1;
    assert(stepNumber <= 3, `${viewport.name}: check-lock exposed too many steps`, { stepNumber });
    const stepId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    assert(stepId !== "compare", `${viewport.name}: deterministic comparison was exposed as a student action`, { stepNumber, stepId });
    const safeStepId = stepId.replace(/[^a-z0-9-]/gi, "-") || `step-${stepNumber}`;
    shots.push(await screenshot(page, lesson, viewport, `${shotPrefix}-${stepNumber}-${safeStepId}-waiting`));
    await auditGeometry(page, `${viewport.name} ${stepId} waiting`);
    await auditCheckLockLayout(page, `${viewport.name} ${stepId} waiting`);

    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct'", `${viewport.name}: ${stepId} confirmation did not appear`, 6000);
    await delay(360);
    shots.push(await screenshot(page, lesson, viewport, `${shotPrefix}-${stepNumber}-${safeStepId}-confirm`));
    await auditGeometry(page, `${viewport.name} ${stepId} confirmation`);
    const completeShown = await evaluate(page, "document.getElementById('completePanel').classList.contains('is-visible')");
    if (!completeShown) await auditCheckLockLayout(page, `${viewport.name} ${stepId} confirmation`);

    const advanced = `document.getElementById('completePanel').classList.contains('is-visible') || (window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(stepId)})`;
    await waitUntil(page, advanced, `${viewport.name}: ${stepId} did not advance`, 6000);
  }
}

async function waitForReward(page, label) {
  const rewardMode = await evaluate(page, "document.querySelector('.game')?.dataset.rewardMode || ''");
  const modalReward = rewardMode === "modal-art";
  if (modalReward) {
    await waitUntil(page, "document.getElementById('rewardPop')?.hidden === false", `${label}: reward modal not shown`);
    return { modal: true, openSelector: "#modalRewardOpenButton", nextSelector: "#modalRewardNextButton" };
  }
  try {
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-reward'", `${label}: reward not shown`);
  } catch (error) {
    error.details = await evaluate(page, `(() => ({
      active:document.querySelector('.screen.is-active')?.id || '',
      state:window.__mathmonEngineQa?.getState?.() || null,
      completeVisible:document.getElementById('completePanel')?.classList.contains('is-visible') || false,
      rewardButton:{ hidden:document.getElementById('rewardButton')?.hidden, disabled:document.getElementById('rewardButton')?.disabled }
    }))()`);
    throw error;
  }
  return { modal: false, stageReveal: rewardMode === "stage-reveal", nextSelector: "#rewardNextButton" };
}

async function revealReward(page, reward, label) {
  if (reward.stageReveal) {
    const before = await evaluate(page, "window.__mathmonEngineQa.getState()");
    await evaluate(page, "(() => { const button = document.getElementById('rewardNextButton'); button.click(); button.click(); })()");
    await waitUntil(page, "window.__mathmonEngineQa.getState().rewardPhase === 'revealed' && document.querySelector('.farm-reward-story')?.dataset.phase === 'revealed'", `${label}: stage reward did not reveal`, 8000);
    const after = await evaluate(page, "window.__mathmonEngineQa.getState()");
    const expectedPower = before.pendingRewardSpecial
      ? 100
      : Math.max(0, Math.min(100, before.power + before.pendingRewardAmount));
    assert(after.power === expectedPower, `${label}: rapid reward clicks applied the event more than once`, { before, after, expectedPower });
    return;
  }
  if (!reward.modal) return;
  await clickSelector(page, reward.openSelector);
  await waitUntil(page, "document.querySelector('.reward-card')?.dataset.rewardPhase === 'revealed' && !document.getElementById('modalRewardNextButton')?.hidden", `${label}: reward did not reveal`, 8000);
}

async function auditFarmReward(page, label, phase) {
  await waitUntil(
    page,
    "[...document.querySelectorAll('.farm-reward-before, .farm-reward-after, .farm-reward-event img')].every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0)",
    `${label}: farm reward images did not finish loading`,
    8000,
  );
  const audit = await evaluate(page, `(() => {
    const story = document.querySelector('.farm-reward-story');
    const before = document.querySelector('.farm-reward-before');
    const after = document.querySelector('.farm-reward-after');
    const event = document.querySelector('.farm-reward-event img');
    const line = document.querySelector('.farm-reward-line');
    const button = document.getElementById('rewardNextButton');
    const readImage = (image) => image ? {
      src:image.getAttribute('src') || '', complete:image.complete,
      naturalWidth:image.naturalWidth, naturalHeight:image.naturalHeight
    } : null;
    const style = line ? getComputedStyle(line) : null;
    return {
      phase: story?.dataset.phase || '',
      before: readImage(before), after: readImage(after), event: readImage(event),
      line: line ? {
        text:line.textContent.trim(), visible:style.visibility !== 'hidden',
        overflows:line.scrollWidth > line.clientWidth + 1 || line.scrollHeight > line.clientHeight + 1
      } : null,
      button: button ? {
        text:button.textContent.trim(),
        label:button.textContent.trim() || button.getAttribute('aria-label') || '',
        disabled:button.disabled
      } : null,
      modalVisible: !document.getElementById('rewardPop')?.hidden
    };
  })()`);
  assert(audit.phase === phase, `${label}: wrong farm reward phase`, audit);
  assert(!audit.modalVisible, `${label}: legacy reward popup is still visible`, audit);
  for (const image of [audit.before, audit.after, audit.event]) {
    assert(image?.complete && image.naturalWidth > 0 && image.naturalHeight > 0, `${label}: farm reward image is missing`, audit);
  }
  assert(audit.before.naturalWidth === 512 && audit.before.naturalHeight === 512, `${label}: farm stage canvas must be 512x512`, audit);
  assert(audit.after.naturalWidth === 512 && audit.after.naturalHeight === 512, `${label}: revealed farm stage canvas must be 512x512`, audit);
  assert(audit.event.naturalWidth === 512 && audit.event.naturalHeight === 512, `${label}: reward event canvas must be 512x512`, audit);
  if (phase === "closed") {
    assert(audit.event.src.endsWith("reward-closed-generated.webp"), `${label}: closed basket art is wrong`, audit);
    assert(!audit.line.visible && audit.button.label === "바구니 열기", `${label}: closed reward must show only the open action`, audit);
  } else {
    assert(/reward-event-.+-generated\.webp$/.test(audit.event.src), `${label}: revealed event art is wrong`, audit);
    assert(audit.line.visible && audit.line.text.length > 0 && !audit.line.overflows, `${label}: revealed reward needs one readable line`, audit);
  }
}

async function auditFarmResultTier(page, label, expectedTier) {
  const audit = await evaluate(page, `(() => {
    const read = (selector) => {
      const image = document.querySelector(selector);
      return image ? { src:image.getAttribute('src') || '', complete:image.complete, naturalWidth:image.naturalWidth, naturalHeight:image.naturalHeight } : null;
    };
    const dynamic = document.querySelector('.result-dynamic-ui');
    return {
      tier:document.getElementById('screen-result')?.dataset.resultTier || '',
      background:read('#resultBg'), title:read('#resultTitleArt'), next:read('.result-next-art'), correct:read('#resultCorrectArt'),
      dynamicVisible:dynamic ? getComputedStyle(dynamic).display !== 'none' : false
    };
  })()`);
  assert(audit.tier === expectedTier, `${label}: wrong farm result tier`, audit);
  assert(audit.background?.complete && audit.background.naturalWidth === 1280 && audit.background.naturalHeight === 800, `${label}: tier farm scene is missing`, audit);
  assert(audit.background.src === `result-tier-${expectedTier}.webp`, `${label}: shared result scene is still connected`, audit);
  assert(audit.title?.complete && audit.title.naturalWidth > 0, `${label}: result tier title is missing`, audit);
  assert(audit.next?.complete && audit.next.naturalWidth > 0, `${label}: next-target title is missing`, audit);
  assert(audit.correct?.complete && audit.correct.naturalWidth > 0, `${label}: correct-count art is missing`, audit);
  assert(!audit.dynamicVisible, `${label}: numeric power gauge is still visible`, audit);
}

async function forceFarmRewardCases(page, lesson, viewport, shots) {
  const stageNames = { seed:"씨앗", sprout:"새싹", garden:"텃밭", rainbow:"황금밭" };
  const cases = [
    { name:"increase", event:"harvest", amount:8, power:10, correct:2, special:false, tier:"sprout", text:"이번에 +8점→지금 18점" },
    { name:"decrease", event:"bug", amount:-4, power:18, correct:2, special:false, tier:"seed", text:"이번에 -4점→지금 14점" },
    { name:"zero", event:"empty", amount:0, power:40, correct:4, special:false, tier:"garden", text:"이번에 0점→지금 40점" },
    { name:"correct-gate", event:"empty", amount:0, power:55, correct:5, special:false, tier:"garden", text:"이번에 0점→지금 55점" },
    { name:"golden-field", event:"rainbow", amount:0, power:50, correct:6, special:true, tier:"rainbow", text:"황금밭 발견!→지금 100점" },
  ];
  for (const item of cases) {
    const prepared = await evaluate(page, `(() => {
      const base = LESSON_CONFIG.rewardEvents.find((event) => event.id === ${JSON.stringify(item.event)});
      const forced = { ...base, amount:${item.amount} };
      Lesson2DivideFarmModel.pickRewardEvent = () => forced;
      window.__mathmonEngineQa.setState({
        power:${item.power}, correctFirstTry:${item.correct}, specialSeen:false,
        completed:true, mistakeTouched:false, rewardPhase:'idle', pendingRewardEvent:null, currentResult:null
      });
      return window.__mathmonEngineQa.showReward().then(() => window.__mathmonEngineQa.getState());
    })()`);
    assert(prepared.rewardPhase === "closed", `${viewport.name} ${item.name}: forced reward did not prepare`, prepared);
    await waitUntil(page, "document.querySelector('.farm-reward-story')?.dataset.phase === 'closed'", `${viewport.name} ${item.name}: closed farm reward missing`);
    await auditFarmReward(page, `${viewport.name} forced ${item.name} closed`, "closed");
    await revealReward(page, { stageReveal:true, nextSelector:"#rewardNextButton" }, `${viewport.name} forced ${item.name}`);
    await waitUntil(page, `document.querySelector('.farm-reward-line')?.textContent.trim() === ${JSON.stringify(item.text)}`, `${viewport.name} ${item.name}: target message is wrong`);
    const revealed = await evaluate(page, `(() => ({
      tier:document.querySelector('.farm-reward-story')?.getAttribute('aria-label') || '',
      eventSrc:document.querySelector('.farm-reward-event img')?.getAttribute('src') || '',
      line:document.querySelector('.farm-reward-line')?.textContent.trim() || '',
      state:window.__mathmonEngineQa.getState()
    }))()`);
    assert(revealed.tier.includes(stageNames[item.tier]), `${viewport.name} ${item.name}: forced farm tier did not reveal`, revealed);
    assert(revealed.eventSrc === `reward-event-${item.event}-generated.webp`, `${viewport.name} ${item.name}: wrong event art`, revealed);
    assert(revealed.line === item.text, `${viewport.name} ${item.name}: wrong reward line`, revealed);
    shots.push(await screenshot(page, lesson, viewport, `07c-reward-${item.name}`));
    await auditGeometry(page, `${viewport.name} forced ${item.name}`);
    await auditFarmReward(page, `${viewport.name} forced ${item.name}`, "revealed");
  }
}

async function runViewport(page, lesson, pageUrl, viewport, seed) {
  await setViewport(page, viewport);
  await page.send("Emulation.setEmulatedMedia", {
    features: [{ name: "prefers-reduced-motion", value: "reduce" }],
  });
  await page.send("Page.navigate", { url: `${pageUrl}?seed=${seed}&qa=${viewport.name}-${Date.now()}` });
  await waitForLoad(page);
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-cover'", `${viewport.name}: cover not active`);

  if (lesson === "3-2-2-1-mathmon-divide-farm") {
    const audioQa = await evaluate(page, `(() => {
      const qa = window.__mathmonAudioQa;
      if (!qa) return null;
      qa.setPrefs({ bgmEnabled: false, sfxEnabled: false });
      const off = qa.getPrefs();
      qa.setPrefs({ bgmEnabled: true, sfxEnabled: true });
      const on = qa.getPrefs();
      return { keys: qa.keys, off, on };
    })()`);
    assert(audioQa?.keys?.bgm === "mathmon-audio-bgm-enabled", `${viewport.name}: BGM QA key mismatch`, audioQa);
    assert(audioQa?.keys?.sfx === "mathmon-audio-sfx-enabled", `${viewport.name}: SFX QA key mismatch`, audioQa);
    assert(audioQa.off.bgmEnabled === false && audioQa.off.sfxEnabled === false, `${viewport.name}: audio off state did not persist`, audioQa);
    assert(audioQa.on.bgmEnabled === true && audioQa.on.sfxEnabled === true, `${viewport.name}: audio on state did not persist`, audioQa);
  }

  const shots = [];
  let initialLearningLayout = null;
  shots.push(await screenshot(page, lesson, viewport, "01-cover"));
  await auditGeometry(page, `${viewport.name} cover`, { requireLogo: true });
  await clickSelector(page, "#settingsButton");
  await waitUntil(page, "!document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not open`);
  shots.push(await screenshot(page, lesson, viewport, "02-settings"));
  await auditGeometry(page, `${viewport.name} settings`);
  await clickSelector(page, "#settingsCloseButton");
  await waitUntil(page, "document.getElementById('settingsBackdrop').hidden", `${viewport.name}: settings did not close`);

  await clickSelector(page, "#startButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial' && (document.getElementById('tutorialStartButton').textContent.trim() || document.getElementById('tutorialStartButton').getAttribute('aria-label')) === '다음'", `${viewport.name}: tutorial 1 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "03-tutorial-1"));
  await auditGeometry(page, `${viewport.name} tutorial 1`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorDivisionSvgClearance(page, `${viewport.name} tutorial division SVG`, "tutorial");
    await auditGeneratedActionButton(page, `${viewport.name} tutorial next button`, "#tutorialStartButton", "action-buttons/next-button-generated.webp", "다음");
  }
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "(document.getElementById('tutorialStartButton').textContent.trim() || document.getElementById('tutorialStartButton').getAttribute('aria-label')) === '문제 시작'", `${viewport.name}: tutorial 2 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "04-tutorial-2"));
  await auditGeometry(page, `${viewport.name} tutorial 2`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorTutorialGoalRaster(page, `${viewport.name} generated tutorial goal poster`);
    await auditGeneratedActionButton(page, `${viewport.name} tutorial previous button`, "#tutorialBackButton", "action-buttons/previous-button-generated.webp", "이전");
    await auditGeneratedActionButton(page, `${viewport.name} tutorial problem-start button`, "#tutorialStartButton", "action-buttons/problem-start-button-generated.webp", "문제 시작");
  }
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not shown`);
  if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await evaluate(page, "window.__starPickupQa.forceProblem(47, 6)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 47", `${viewport.name}: fixed 47-star board did not render`);
  }
  shots.push(await screenshot(page, lesson, viewport, "05-play-step1"));
  await auditGeometry(page, `${viewport.name} play`);
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditDivideFarmLayout(page, `${viewport.name} farm waiting`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorPlayHeader(page, `${viewport.name} play header`);
    await auditElevatorPlayStackClearance(page, `${viewport.name} waiting play stack`);
    initialLearningLayout = await auditElevatorLearningLegibility(page, `${viewport.name} learning legibility`);
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await auditStarPickupPlayHeader(page, `${viewport.name} play header`);
    await auditStarPickupWaiting(page, `${viewport.name} fixed 47-star waiting`, 47);

    await evaluate(page, "window.__starPickupQa.forceProblem(20, 3)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 20", `${viewport.name}: 20-star boundary board did not render`);
    shots.push(await screenshot(page, lesson, viewport, "05a-boundary-20-stars"));
    await auditGeometry(page, `${viewport.name} 20-star boundary`);
    await auditStarPickupWaiting(page, `${viewport.name} 20-star boundary`, 20);

    await evaluate(page, "window.__starPickupQa.forceProblem(99, 4)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 99", `${viewport.name}: 99-star boundary board did not render`);
    shots.push(await screenshot(page, lesson, viewport, "05a2-boundary-99-stars"));
    await auditGeometry(page, `${viewport.name} 99-star boundary`);
    await auditStarPickupWaiting(page, `${viewport.name} 99-star boundary`, 99);

    await evaluate(page, "window.__starPickupQa.forceProblem(95, 3)");
    await clickMisconception(page, "DIV3_QUOTIENT_TOO_HIGH");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: 32-capsule boundary did not render`);
    const capsuleBoundary = await evaluate(page, `(() => ({
      capsules: document.querySelectorAll('.star-capsule').length,
      missingSlots: document.querySelectorAll('.star-glyph[data-tone="missing-slot"]').length
    }))()`);
    assert(capsuleBoundary.capsules === 32 && capsuleBoundary.missingSlots === 1, `${viewport.name}: 8x4 capsule boundary is incorrect`, capsuleBoundary);
    shots.push(await screenshot(page, lesson, viewport, "05a3-boundary-32-capsules"));
    await auditGeometry(page, `${viewport.name} 32-capsule boundary`);
    await auditStarPickupEvidence(page, `${viewport.name} 32-capsule boundary`, "quotient-too-high");

    await evaluate(page, "window.__starPickupQa.forceProblem(47, 6)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 47", `${viewport.name}: fixed 47-star board did not restore`);
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    initialLearningLayout = await auditCheckLockLayout(page, `${viewport.name} check-lock play`);
  }
  const answerLeak = await evaluate(page, "document.getElementById('answerSlot')?.textContent.trim() !== '?' || Boolean(document.querySelector('#choicesPanel [data-state=\"correct\"]'))");
  assert(!answerLeak, `${viewport.name}: answer was exposed before student action`);

  if (lesson === "3-2-2-2-mathmon-elevator") {
    await clickMisconception(page, "DIV2_TENS_QUOTIENT_TOO_HIGH");
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await clickMisconception(page, "DIV3_QUOTIENT_TOO_LOW");
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    await clickMisconception(page, "DIV4_PRODUCT_TOO_HIGH");
  } else {
    await clickChoice(page, false);
  }
  await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0", `${viewport.name}: wrong feedback did not appear`);
  if (lesson === "3-2-2-1-mathmon-divide-farm") {
    await waitUntil(page, "Boolean(document.querySelector('.farm-share-entry.is-wrong'))", `${viewport.name}: wrong share was not shown in the baskets`);
  } else {
    await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: input stayed locked after wrong feedback`);
  }
  const firstWrongShot = lesson === "3-2-2-3-mathmon-star-pickup"
    ? "05b-play-quotient-too-low"
    : lesson === "3-2-2-4-mathmon-check-lock"
      ? "05b-play-product-too-high"
      : "05b-play-wrong";
  shots.push(await screenshot(page, lesson, viewport, firstWrongShot));
  await auditGeometry(page, `${viewport.name} wrong feedback`);
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditDivideFarmLayout(page, `${viewport.name} farm wrong`);
  if (lesson === "3-2-2-4-mathmon-check-lock") await auditCheckLockLayout(page, `${viewport.name} product-too-high`);
  await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: input stayed locked after wrong feedback`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorWrongEvidence(page, `${viewport.name} quotient-too-high`, "DIV2_TENS_QUOTIENT_TOO_HIGH");
    await auditElevatorDivisionBoard(page, `${viewport.name} quotient-too-high`);
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await auditStarPickupEvidence(page, `${viewport.name} quotient-too-low`, "quotient-too-low");
  }
  if (lesson === "3-2-2-1-mathmon-divide-farm") {
    let beforeStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' && Boolean(document.querySelector('.farm-share-confirmation'))", `${viewport.name}: tens confirmation did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05c-play-tens-confirm"));
    await auditGeometry(page, `${viewport.name} tens confirmation`);
    await auditDivideFarmLayout(page, `${viewport.name} tens confirmation`, { confirmation:true });
    const manualAdvanceReady = await evaluate(page, "Boolean(document.querySelector('.farm-step-next-button:not([hidden]):not(:disabled)'))");
    assert(manualAdvanceReady, `${viewport.name}: tens confirmation manual button is missing`);
    await delay(1800);
    const heldStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    assert(heldStep === beforeStep, `${viewport.name}: tens confirmation advanced without the student button`, { beforeStep, heldStep });
    await clickSelector(page, ".farm-step-next-button:not([hidden]):not(:disabled)");
    await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)} && window.__mathmonEngineQa.getState().inputLocked === false`, `${viewport.name}: tens share did not advance`, 8000);
    shots.push(await screenshot(page, lesson, viewport, "05c-play-step2"));
    await auditGeometry(page, `${viewport.name} ones share`);
    await auditDivideFarmLayout(page, `${viewport.name} ones waiting`);

    beforeStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' && Boolean(document.querySelector('.farm-share-confirmation'))", `${viewport.name}: ones confirmation did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-ones-confirm"));
    await auditGeometry(page, `${viewport.name} ones confirmation`);
    await auditDivideFarmLayout(page, `${viewport.name} ones confirmation`, { confirmation:true });
    const manualCompleteReady = await evaluate(page, "Boolean(document.querySelector('.farm-problem-complete-button:not([hidden]):not(:disabled)'))");
    assert(manualCompleteReady, `${viewport.name}: ones confirmation manual button is missing`);
    await delay(1800);
    const completedTooSoon = await evaluate(page, "document.getElementById('completePanel')?.classList.contains('is-visible')");
    assert(!completedTooSoon, `${viewport.name}: ones confirmation advanced without the student button`);
    await clickSelector(page, ".farm-problem-complete-button:not([hidden]):not(:disabled)");
    await waitUntil(page, "Boolean(document.querySelector('.farm-final-answer-entry'))", `${viewport.name}: final sum entry did not appear`, 8000);
    shots.push(await screenshot(page, lesson, viewport, "05e-play-final-sum"));
    await auditGeometry(page, `${viewport.name} final sum waiting`);
    await auditDivideFarmLayout(page, `${viewport.name} final sum waiting`, { finalAnswer:true });
    await delay(1800);
    const finalSumCompletedTooSoon = await evaluate(page, "document.getElementById('completePanel')?.classList.contains('is-visible')");
    assert(!finalSumCompletedTooSoon, `${viewport.name}: final sum completed before the student entered an answer`);

    const quotient = await evaluate(page, "window.__mathmonEngineQa.getCurrentProblem()?.quotient");
    const lowerQuotient = quotient - 1;
    const wrongQuotient = lowerQuotient > 0 && String(lowerQuotient).length === String(quotient).length
      ? lowerQuotient
      : quotient + 1;
    const correctCountBeforeFinalSum = await evaluate(page, "(() => { window.__mathmonEngineQa.setState({ mistakeTouched:false }); return window.__mathmonEngineQa.getState().correctFirstTry; })()");
    await inputFarmFinalValue(page, wrongQuotient);
    await waitUntil(page, "Boolean(document.querySelector('.farm-final-answer-entry.is-wrong'))", `${viewport.name}: wrong final sum was not shown`, 8000);
    shots.push(await screenshot(page, lesson, viewport, "05f-play-final-sum-wrong"));
    await auditGeometry(page, `${viewport.name} final sum wrong`);
    await auditDivideFarmLayout(page, `${viewport.name} final sum wrong`, { finalAnswer:true });

    await inputFarmFinalValue(page, quotient);
    await waitUntil(page, "document.getElementById('completePanel')?.classList.contains('is-visible')", `${viewport.name}: one-basket completion did not appear`, 8000);
    const correctCountAfterFinalSum = await evaluate(page, "window.__mathmonEngineQa.getState().correctFirstTry");
    assert(correctCountAfterFinalSum === correctCountBeforeFinalSum, `${viewport.name}: wrong final sum was counted as first-try correct`, { correctCountBeforeFinalSum, correctCountAfterFinalSum });
    shots.push(await screenshot(page, lesson, viewport, "05d-play-one-basket-complete"));
    await auditGeometry(page, `${viewport.name} one-basket completion`);
    await auditDivideFarmLayout(page, `${viewport.name} completed division`, { complete:true });
  } else if (lesson === "3-2-2-2-mathmon-elevator") {
    await clickMisconception(page, "DIV2_TENS_QUOTIENT_TOO_LOW");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: quotient-too-low feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05b2-play-quotient-too-low"));
    await auditGeometry(page, `${viewport.name} quotient-too-low`);
    await auditElevatorWrongEvidence(page, `${viewport.name} quotient-too-low`, "DIV2_TENS_QUOTIENT_TOO_LOW");
    await auditElevatorDivisionBoard(page, `${viewport.name} quotient-too-low`);

    const firstStepId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' && Boolean(document.querySelector('.division-work.is-tens-check'))", `${viewport.name}: first-step confirmation did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05c-play-step1-confirm"));
    await auditGeometry(page, `${viewport.name} first-step confirmation`);
    await auditElevatorDivisionBoard(page, `${viewport.name} first-step confirmation`);
    await waitUntil(page, `window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(firstStepId)}`, `${viewport.name}: first step did not advance`, 6000);
    await waitUntil(page, "Boolean(document.querySelector('.division-work.is-down-step'))", `${viewport.name}: down step did not render`);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-step2"));
    await auditGeometry(page, `${viewport.name} down step`);
    await auditElevatorDivisionBoard(page, `${viewport.name} down step`, { expectDown: true });
    await auditElevatorNumericLegibility(page, `${viewport.name} down-step legibility`);

    await clickMisconception(page, "DIV2_IGNORE_REMAINING_TEN");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: down-step wrong feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05d2-play-down-wrong"));
    await auditGeometry(page, `${viewport.name} down-step wrong`);
    await auditElevatorWrongEvidence(page, `${viewport.name} down-step wrong`, "DIV2_IGNORE_REMAINING_TEN");
    await auditElevatorDivisionBoard(page, `${viewport.name} down-step wrong`, { expectDown: true });

    const downStepId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, `window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(downStepId)}`, `${viewport.name}: down step did not advance`, 6000);
    shots.push(await screenshot(page, lesson, viewport, "05e-play-step3"));
    await auditGeometry(page, `${viewport.name} final quotient step`);
    await auditElevatorDivisionBoard(page, `${viewport.name} final quotient step`, { expectDown: true });
    await auditElevatorNumericLegibility(page, `${viewport.name} final quotient legibility`);

    await clickMisconception(page, "DIV2_ONES_QUOTIENT_TOO_HIGH");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: final quotient-too-high feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05e2-play-ones-too-high"));
    await auditGeometry(page, `${viewport.name} final quotient-too-high`);
    await auditElevatorWrongEvidence(page, `${viewport.name} final quotient-too-high`, "DIV2_ONES_QUOTIENT_TOO_HIGH");
    await auditElevatorDivisionBoard(page, `${viewport.name} final quotient-too-high`, { expectDown: true });

    await clickMisconception(page, "DIV2_ONES_QUOTIENT_TOO_LOW");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: final quotient-too-low feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05e3-play-ones-too-low"));
    await auditGeometry(page, `${viewport.name} final quotient-too-low`);
    await auditElevatorWrongEvidence(page, `${viewport.name} final quotient-too-low`, "DIV2_ONES_QUOTIENT_TOO_LOW");
    await auditElevatorDivisionBoard(page, `${viewport.name} final quotient-too-low`, { expectDown: true });
    await solveCurrentProblem(page);
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await clickMisconception(page, "DIV3_QUOTIENT_TOO_HIGH");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: quotient-too-high feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05b2-play-quotient-too-high"));
    await auditGeometry(page, `${viewport.name} quotient-too-high`);
    await auditStarPickupEvidence(page, `${viewport.name} quotient-too-high`, "quotient-too-high");

    const quotientStepId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' && document.getElementById('visualArea').dataset.revealedStep === 'quotient'", `${viewport.name}: quotient confirmation did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05c-play-quotient-confirm"));
    await auditGeometry(page, `${viewport.name} quotient confirmation`);
    await auditStarPickupEvidence(page, `${viewport.name} quotient confirmation`, "quotient-confirm");
    await waitUntil(page, `window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(quotientStepId)}`, `${viewport.name}: quotient step did not advance`, 6000);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-remainder"));
    await auditGeometry(page, `${viewport.name} remainder step`);

    await clickMisconception(page, "DIV3_REMAINDER_EQUALS_DIVISOR");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: remainder wrong feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05d2-play-remainder-wrong"));
    await auditGeometry(page, `${viewport.name} remainder wrong`);
    await auditStarPickupEvidence(page, `${viewport.name} remainder wrong`, "remainder-wrong");
    await solveCurrentProblem(page);
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    await clickMisconception(page, "DIV4_PRODUCT_TOO_LOW");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: product-too-low feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05b2-play-product-too-low"));
    await auditGeometry(page, `${viewport.name} product-too-low`);
    await auditCheckLockLayout(page, `${viewport.name} product-too-low`);
    await solveCheckLockProblemWithAudits(page, lesson, viewport, shots);
  } else {
    await solveCurrentProblem(page);
  }
  shots.push(await screenshot(page, lesson, viewport, "06-confirm"));
  await auditGeometry(page, `${viewport.name} confirmation`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorDivisionSvgClearance(page, `${viewport.name} completed division SVG`, "complete");
    await auditMathmonReactionAlphaEdge(page, `${viewport.name} completed eagle reward reaction`);
    await auditGeneratedActionButton(page, `${viewport.name} door-open button`, "#rewardButton", "door-open-button-generated.webp", "문 열기");
  }
  if (lesson === "3-2-2-4-mathmon-check-lock") await auditCheckLockCompleteLayout(page, `${viewport.name} final confirmation`);
  await evaluate(page, "document.getElementById('rewardButton').click()");
  const firstReward = await waitForReward(page, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07-reward-closed"));
  await auditGeometry(page, `${viewport.name} closed reward`);
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditFarmReward(page, `${viewport.name} closed reward`, "closed");
  await revealReward(page, firstReward, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07b-reward-open"));
  await auditGeometry(page, `${viewport.name} revealed reward`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditGeneratedActionButton(page, `${viewport.name} reward next button`, "#modalRewardNextButton", "action-buttons/next-button-generated.webp", "다음");
  }
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditFarmReward(page, `${viewport.name} revealed reward`, "revealed");
  await clickSelector(page, firstReward.nextSelector);

  let checkLockMatchCaptured = false;
  for (let problemIndex = 2; problemIndex <= 10; problemIndex += 1) {
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not active for problem ${problemIndex}`);
    const captureCheckLockMatch = lesson === "3-2-2-4-mathmon-check-lock"
      && !checkLockMatchCaptured
      && await evaluate(page, "window.__mathmonEngineQa.getCurrentProblem()?.matchesOriginal === true");
    if (captureCheckLockMatch) {
      await solveCheckLockProblemWithAudits(page, lesson, viewport, shots, "05-match-lock");
      shots.push(await screenshot(page, lesson, viewport, "06b-match-auto-confirm"));
      await auditGeometry(page, `${viewport.name} matching final confirmation`);
      await auditCheckLockCompleteLayout(page, `${viewport.name} matching final confirmation`);
      checkLockMatchCaptured = true;
    } else {
      await solveCurrentProblem(page, { wrongFirst: lesson === "3-2-2-2-mathmon-elevator" });
    }
    await evaluate(page, "document.getElementById('rewardButton').click()");
    const reward = await waitForReward(page, `${viewport.name} problem ${problemIndex}`);
    if (lesson === "3-2-2-1-mathmon-divide-farm" && problemIndex === 10) {
      shots.push(await screenshot(page, lesson, viewport, "07d-final-reward-closed"));
      await auditGeometry(page, `${viewport.name} final closed reward`);
      await auditFarmReward(page, `${viewport.name} final closed reward`, "closed");
    }
    await revealReward(page, reward, `${viewport.name} problem ${problemIndex}`);
    if (lesson === "3-2-2-2-mathmon-elevator" && problemIndex === 10) {
      await auditGeneratedActionButton(page, `${viewport.name} final result-view button`, "#modalRewardNextButton", "action-buttons/result-view-button-generated.webp", "결과 보기");
    }
    if (lesson === "3-2-2-1-mathmon-divide-farm" && problemIndex === 10) {
      shots.push(await screenshot(page, lesson, viewport, "07e-final-reward-open"));
      await auditGeometry(page, `${viewport.name} final revealed reward`);
      await auditFarmReward(page, `${viewport.name} final revealed reward`, "revealed");
    }
    await clickSelector(page, reward.nextSelector);
  }
  if (lesson === "3-2-2-4-mathmon-check-lock") {
    assert(checkLockMatchCaptured, `${viewport.name}: matching auto-comparison state was not captured`);
  }

  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result not shown`, 8000);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditGeneratedActionButton(page, `${viewport.name} shared result retry button`, "#restartButton", "result-actions/retry-button-generated.webp", "다시하기");
    const lowResult = await evaluate(page, `(() => ({
      correctFirstTry: window.__mathmonEngineQa.getState().correctFirstTry,
      result: document.getElementById('resultTitle')?.textContent.trim() || '',
      tier: document.getElementById('screen-result')?.dataset.resultTier || ''
    }))()`);
    assert(lowResult.correctFirstTry === 0, `${viewport.name}: low-result scenario must finish at 0/10`, lowResult);
    assert(lowResult.result === "지하 정비층" && lowResult.tier === "basement", `${viewport.name}: 0/10 must still arrive at a visible place`, lowResult);
    shots.push(await screenshot(page, lesson, viewport, "08-result-low-0-of-10"));
  } else {
    shots.push(await screenshot(page, lesson, viewport, "08-result"));
  }
  await auditGeometry(page, `${viewport.name} result`, { requireRetry: true });

  if (lesson === "3-2-2-1-mathmon-divide-farm") {
    await forceFarmRewardCases(page, lesson, viewport, shots);
    const tierStates = [
      { id: "seed", power: 0, correct: 0, special: false },
      { id: "sprout", power: 15, correct: 2, special: false },
      { id: "garden", power: 35, correct: 4, special: false },
      { id: "farm", power: 55, correct: 6, special: false },
      { id: "bigfarm", power: 78, correct: 8, special: false },
      { id: "rainbow", power: 100, correct: 10, special: true },
    ];
    for (const tier of tierStates) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({
          power:${tier.power}, correctFirstTry:${tier.correct}, specialSeen:${tier.special}, currentResult:null
        });
        window.__mathmonEngineQa.showResult();
      })()`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)} && document.querySelector('.result-next-art')?.complete && document.querySelector('.result-next-art')?.naturalWidth > 0`, `${viewport.name}: farm result ${tier.id} did not render`);
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tier.id}`));
      await auditGeometry(page, `${viewport.name} result ${tier.id}`, { requireRetry: true });
      await auditFarmResultTier(page, `${viewport.name} result ${tier.id}`, tier.id);
    }
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    const tierIds = await evaluate(page, "LESSON_CONFIG.results.map((result) => result.id)");
    for (const tierId of tierIds) {
      await evaluate(page, `window.__starPickupQa.forceResult(${JSON.stringify(tierId)})`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tierId)} && document.getElementById('resultBg')?.complete && document.getElementById('resultBg')?.naturalWidth > 0`, `${viewport.name}: result tier ${tierId} did not render`);
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tierId}`));
      await auditGeometry(page, `${viewport.name} result ${tierId}`, { requireRetry: true });
      await auditStarPickupResultTier(page, `${viewport.name} result ${tierId}`, tierId);
    }
  }

  const scoreboardEnabled = await evaluate(page, "document.querySelector('.game')?.dataset.scoreboardEnabled === 'true'");
  if (scoreboardEnabled) {
    await auditResultLeaderboardButton(page, `${viewport.name} result leaderboard button`);
    await clickSelector(page, "#leaderboardButton");
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-scoreboard'", `${viewport.name}: scoreboard not shown`);
    await renderScoreboardQaState(page, "offline");
    shots.push(await screenshot(page, lesson, viewport, "09-scoreboard-offline"));
    const offline = await auditScoreboard(page, `${viewport.name} scoreboard offline`);
    assert(offline.empty.includes("10위까지"), `${viewport.name}: offline guidance missing`, offline);

    await renderScoreboardQaState(page, "loading");
    const loading = await auditScoreboard(page, `${viewport.name} scoreboard loading`);
    assert(loading.empty.includes("불러오고"), `${viewport.name}: loading guidance missing`, loading);

    await renderScoreboardQaState(page, "error");
    const error = await auditScoreboard(page, `${viewport.name} scoreboard error`);
    assert(error.empty.includes("볼 수 없어요"), `${viewport.name}: error guidance missing`, error);

    await renderScoreboardQaState(page, "empty");
    const empty = await auditScoreboard(page, `${viewport.name} scoreboard empty`);
    assert(empty.empty.includes("기록이 아직 없어요"), `${viewport.name}: empty-state guidance missing`, empty);

    await renderScoreboardQaState(page, "success");
    shots.push(await screenshot(page, lesson, viewport, "09b-scoreboard-10rows-start"));
    await auditScoreboard(page, `${viewport.name} scoreboard rows 1-4`, { expectedFirstRank: 1, expectedLastRank: 4 });
    await evaluate(page, `(() => {
      const viewport = document.querySelector('[data-scoreboard-list-viewport]');
      for (let index = 0; index < 8; index += 1) viewport.dispatchEvent(new WheelEvent('wheel', { deltaY: 120, bubbles: true, cancelable: true }));
    })()`);
    shots.push(await screenshot(page, lesson, viewport, "09c-scoreboard-10rows-end"));
    await auditScoreboard(page, `${viewport.name} scoreboard rows 7-10`, { expectedFirstRank: 7, expectedLastRank: 10 });
    await clickSelector(page, "#scoreboardResultButton");
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result return failed`);
  }

  const snapshot = await readSnapshot(page);
  assert(!snapshot.placeholders, `${viewport.name}: template placeholders leaked`, snapshot);
  assert(snapshot.missingImages.length === 0, `${viewport.name}: missing images`, snapshot);
  assert(snapshot.overflowing.length === 0, `${viewport.name}: text overflow`, snapshot);
  assert(snapshot.stage?.width > 0 && snapshot.stage?.height > 0, `${viewport.name}: stage not visible`, snapshot);
  return { viewport, shots, learningLayout: initialLearningLayout, snapshot };
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
  const configuredViewports = Array.isArray(config.qa?.viewports) && config.qa.viewports.length ? config.qa.viewports : DEFAULT_VIEWPORTS;
  const requestedViewport = process.env.MATHMON_QA_VIEWPORT || "";
  const viewports = requestedViewport
    ? configuredViewports.filter((viewport) => viewport.name === requestedViewport)
    : configuredViewports;
  assert(viewports.length > 0, `Unknown QA viewport: ${requestedViewport}`);
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
