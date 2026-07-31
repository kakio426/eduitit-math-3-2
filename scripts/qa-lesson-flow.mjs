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
  const choiceValue = (choice) => String(choice?.value ?? choice?.label ?? choice?.id ?? choice);
  const answer = step.answerChoiceId === undefined
    ? step.choices.find((choice) => choiceValue(choice) === String(step.correct ?? step.answer))
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

  if (!interaction) {
    const selectedId = String(selected.id ?? selected.value ?? selected);
    const clicked = await evaluate(page, `(() => {
      const button = [...document.querySelectorAll('button.choice-button:not(:disabled)')]
        .find((item) => item.dataset.choice === ${JSON.stringify(selectedId)});
      if (!button) return false;
      button.click();
      return true;
    })()`);
    assert(clicked, `direct misconception choice failed for ${misconceptionId}`, { selectedId, step });
    await delay(100);
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
    const visibleContentOutside = (node) => {
      const box = node.getBoundingClientRect();
      const inside = {
        left: box.left + node.clientLeft,
        top: box.top + node.clientTop,
        right: box.left + node.clientLeft + node.clientWidth,
        bottom: box.top + node.clientTop + node.clientHeight
      };
      const outside = (rect) => rect.width > 0 && rect.height > 0 && (
        rect.left < inside.left - 1 || rect.top < inside.top - 1
        || rect.right > inside.right + 1 || rect.bottom > inside.bottom + 1
      );
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (!textNode.nodeValue?.trim()) continue;
        const owner = textNode.parentElement;
        const style = owner ? getComputedStyle(owner) : null;
        if (!owner || owner.closest('.visually-hidden, [aria-hidden="true"]')
          || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || 1) === 0
          || style.clip !== 'auto' || style.clipPath !== 'none'
          || ((owner.clientWidth <= 1 || owner.clientHeight <= 1) && style.overflow === 'hidden')) continue;
        const range = document.createRange();
        range.selectNodeContents(textNode);
        if ([...range.getClientRects()].some(outside)) return true;
      }
      return [...node.querySelectorAll('img, svg, canvas, math-field')].some((visual) => {
        const style = getComputedStyle(visual);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0
          && outside(visual.getBoundingClientRect());
      });
    };
    const overflowing = [...document.querySelectorAll(overflowSelector)]
      .filter(visibleContentOutside)
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
    const overflowSelector = [
      'button:not(.result-retry-hitbox):not(.result-restart-hitbox)',
      '.brand-badge', '.unit-badge', '.mini-badge', '.big-problem',
      '.instruction', '.feedback-line', '.choice-button', '.complete-text',
      '.tutorial-card', '.reward-card', '.complete-panel',
      '.calculation-board', '.capacity-result-note', '.unit6-board',
      '.data-board-title', '.data-label', '.data-row'
    ].join(',');
    const overflowNodes = [...(root?.querySelectorAll(overflowSelector) || [])].filter((node) => {
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden'
        && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    });
    const visibleContentOutside = (node) => {
      const box = node.getBoundingClientRect();
      const inside = {
        left: box.left + node.clientLeft,
        top: box.top + node.clientTop,
        right: box.left + node.clientLeft + node.clientWidth,
        bottom: box.top + node.clientTop + node.clientHeight
      };
      const outside = (rect) => rect.width > 0 && rect.height > 0 && (
        rect.left < inside.left - 1 || rect.top < inside.top - 1
        || rect.right > inside.right + 1 || rect.bottom > inside.bottom + 1
      );
      const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const textNode = walker.currentNode;
        if (!textNode.nodeValue?.trim()) continue;
        const owner = textNode.parentElement;
        const style = owner ? getComputedStyle(owner) : null;
        if (!owner || owner.closest('.visually-hidden, [aria-hidden="true"]')
          || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity || 1) === 0
          || style.clip !== 'auto' || style.clipPath !== 'none'
          || ((owner.clientWidth <= 1 || owner.clientHeight <= 1) && style.overflow === 'hidden')) continue;
        const range = document.createRange();
        range.selectNodeContents(textNode);
        if ([...range.getClientRects()].some(outside)) return true;
      }
      return [...node.querySelectorAll('img, svg, canvas, math-field')].some((visual) => {
        const style = getComputedStyle(visual);
        return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0
          && outside(visual.getBoundingClientRect());
      });
    };
    const overflowing = overflowNodes.filter(visibleContentOutside).map((node) => ({
      name:node.className || node.id || node.tagName,
      scrollWidth:node.scrollWidth,
      clientWidth:node.clientWidth,
      scrollHeight:node.scrollHeight,
      clientHeight:node.clientHeight
    }));
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
    const retryHitbox = document.querySelector('.result-restart-hitbox, .result-retry-hitbox');
    const resultBg = document.getElementById('resultBg');
    const farmStage = document.querySelector('.farm-stage-art');
    const hud = document.querySelector('#screen-play .hud');
    const problemGrid = document.querySelector('.problem-grid');
    const completePanel = document.getElementById('completePanel');
    return {
      collisions,
      outside,
      overflowing,
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
  assert(audit.overflowing.length === 0, `${label}: visible UI text or content overflows its box`, audit);
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
    const image = button?.querySelector('.generated-action-button-art, .result-retry-art, .score-view-button-art');
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

async function auditSharedCoverStartButton(page, label) {
  const audit = await evaluate(page, `(() => {
    const game = document.querySelector('main.game');
    const button = document.getElementById('startButton');
    const image = button?.querySelector('.start-button-art');
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2
      } : null;
    };
    return {
      standard:game?.dataset.coverStartStandard || '',
      asset:game?.dataset.coverStartAsset || '',
      source:image?.getAttribute('src') || '',
      complete:Boolean(image?.complete),
      naturalWidth:image?.naturalWidth || 0,
      naturalHeight:image?.naturalHeight || 0,
      button:rectOf(button),
      image:rectOf(image),
      viewport:{ width:window.innerWidth, height:window.innerHeight }
    };
  })()`);
  assert(audit.standard === "generated-button-art" && audit.asset === "shared-canonical-v1", `${label}: shared cover start marker is missing`, audit);
  assert(audit.source === "../_shared/mathmon/cover-start-button/start-button-generated.webp", `${label}: wrong shared cover start asset`, audit);
  assert(audit.complete && audit.naturalWidth > 0 && audit.naturalHeight > 0, `${label}: shared cover start art did not load`, audit);
  assert(audit.button && audit.image, `${label}: cover start hitbox or art is missing`, audit);
  for (const key of ["width", "height", "cx", "cy"]) {
    assert(Math.abs(audit.button[key] - audit.image[key]) <= 1, `${label}: cover start ${key} differs by more than 1px`, audit);
  }
  assert(audit.button.width >= 300 && audit.button.width <= 360.5, `${label}: cover start width is outside the canonical range`, audit);
  assert(audit.button.width >= 42 && audit.button.height >= 42, `${label}: cover start touch target is too small`, audit);
  if (audit.viewport.width >= 1280) assert(Math.abs(audit.button.width - 360) <= 1, `${label}: 1280 cover start must be 360px wide`, audit);
  if (audit.viewport.width <= 1024) assert(Math.abs(audit.button.width - 300) <= 1, `${label}: 1024 cover start must use the 300px minimum`, audit);
  return audit;
}

async function auditConfiguredPlayHeader(page, label) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height } : null;
    };
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
    };
    const topControlsConfig = LESSON_CONFIG.qa?.topControlsAudit || null;
    const nodes = {
      brand:document.querySelector('#screen-play .hud .brand-badge'),
      counter:document.getElementById('problemCounter'),
      unit:document.querySelector(topControlsConfig?.unitBadge || '#screen-play .hud-right .unit-badge'),
      settings:document.querySelector(topControlsConfig?.settingsButton || '#settingsButton')
    };
    const rects = Object.fromEntries(Object.entries(nodes).map(([key, node]) => [key, rectOf(node)]));
    const collisions = [];
    const entries = Object.entries(rects);
    for (let i = 0; i < entries.length; i += 1) for (let j = i + 1; j < entries.length; j += 1) {
      const [aName, a] = entries[i], [bName, b] = entries[j];
      if (!a || !b) continue;
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 0 && overlapY > 0) collisions.push({ a:aName, b:bName, overlapX, overlapY });
    }
    const topControls = rects.unit && rects.settings ? {
      standard:topControlsConfig?.standard || '',
      topDelta:Math.abs(rects.unit.top - rects.settings.top),
      centerYDelta:Math.abs((rects.unit.top + rects.unit.height / 2) - (rects.settings.top + rects.settings.height / 2)),
      heightDelta:Math.abs(rects.unit.height - rects.settings.height),
      gap:rects.settings.left - rects.unit.right,
      viewport:{ width:innerWidth, height:innerHeight, dpr:devicePixelRatio }
    } : null;
    return {
      text:{
        brand:nodes.brand?.textContent.trim() || '',
        counter:nodes.counter?.textContent.trim() || '',
        unit:nodes.unit?.textContent.trim() || ''
      },
      visible:Object.fromEntries(Object.entries(nodes).map(([key, node]) => [key, visible(node)])),
      rects,
      collisions,
      topControlsConfig,
      topControls,
      expectedUnit:LESSON_CONFIG.unitBadge
    };
  })()`);
  assert(Object.values(audit.visible).every(Boolean), `${label}: brand, counter, unit, or settings is hidden`, audit);
  assert(audit.text.brand === "에듀잇티 수학 게임", `${label}: play brand copy is wrong`, audit);
  assert(/^\d+\/10$/.test(audit.text.counter), `${label}: problem counter is wrong`, audit);
  assert(audit.text.unit === audit.expectedUnit, `${label}: unit badge is wrong`, audit);
  assert(audit.collisions.length === 0, `${label}: play header controls overlap`, audit);
  if (audit.topControlsConfig) {
    assert(audit.topControls, `${label}: configured top controls did not resolve`, audit);
    assert(audit.topControls.standard === "stage-top-controls-v1", `${label}: top control standard is wrong`, audit);
    assert(audit.topControls.topDelta <= audit.topControlsConfig.topTolerancePx, `${label}: unit badge and settings top edges are misaligned`, audit);
    assert(audit.topControls.centerYDelta <= audit.topControlsConfig.centerYTolerancePx, `${label}: unit badge and settings centers are misaligned`, audit);
    assert(audit.topControls.heightDelta <= audit.topControlsConfig.heightTolerancePx, `${label}: unit badge and settings heights differ`, audit);
    assert(audit.topControls.gap >= audit.topControlsConfig.minGapPx, `${label}: unit badge and settings gap is too small`, audit);
  }
  return audit;
}

async function auditConfiguredLearningLayout(page, label) {
  const audit = await evaluate(page, `(() => {
    const config = LESSON_CONFIG.qa?.layoutAudit;
    if (!config) return null;
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height, cx:rect.left + rect.width / 2,
        area:rect.width * rect.height
      } : null;
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const nodes = {
      workArea:document.querySelector(config.workArea),
      primary:document.querySelector(config.primary),
      secondary:document.querySelector(config.secondary),
      tertiary:document.querySelector(config.tertiary),
      complete:document.querySelector(config.complete)
    };
    const rects = Object.fromEntries(Object.entries(nodes).map(([key, node]) => [key, rectOf(node)]));
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
    };
    const bundleCounts = {
      primary:[...nodes.primary?.querySelectorAll('.big-problem, .visual-area') || []].filter(visible).length,
      secondary:[...nodes.secondary?.querySelectorAll('.choice-button, .farm-share-option') || []].filter(visible).length,
      tertiary:[...nodes.tertiary?.querySelectorAll('.instruction, .feedback-line, .answer-slot, .step-chips') || []].filter((node) => visible(node) && node.textContent.trim().length > 0).length,
      complete:[...nodes.complete?.querySelectorAll('.complete-text, button') || []].filter(visible).length
    };
    const choiceRects = [...document.querySelectorAll('#choicesPanel button, #choicesPanel .farm-share-option')]
      .filter(visible).map((node) => rectOf(node));
    const intersections = [];
    const peers = ['primary', 'secondary', 'tertiary'];
    for (let i = 0; i < peers.length; i += 1) for (let j = i + 1; j < peers.length; j += 1) {
      const a = rects[peers[i]], b = rects[peers[j]];
      if (!a || !b) continue;
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 0 && overlapY > 0) intersections.push({ a:peers[i], b:peers[j], overlapX, overlapY });
    }
    const metrics = Object.fromEntries(Object.entries(rects).map(([key, rect]) => [key, rect && stage ? {
      ...rect,
      stageWidthRatio:rect.width / stage.width,
      stageAreaRatio:rect.area / stage.area,
      informationBundles:bundleCounts[key] ?? 0
    } : null]));
    return { config, stage, metrics, choiceRects, intersections };
  })()`);
  if (!audit) return null;
  const { config, metrics } = audit;
  assert(metrics.workArea && metrics.primary && metrics.secondary && metrics.tertiary, `${label}: configured learning selectors did not resolve`, audit);
  assert(metrics.workArea.stageWidthRatio + 0.0001 >= config.minStageWidthRatio, `${label}: learning work area is too narrow`, audit);
  assert(metrics.primary.area > metrics.secondary.area, `${label}: primary learning panel is not the largest learning area`, audit);
  assert(audit.choiceRects.length > 0 && audit.choiceRects.every((rect) => rect.width >= 42 && rect.height >= 42), `${label}: a choice touch target is smaller than 42x42`, audit);
  assert(audit.intersections.length === 0, `${label}: primary, secondary, or tertiary learning panels overlap`, audit);
  return audit;
}

async function auditConfiguredAnswerAccumulation(page, label, expectedCount) {
  const audit = await evaluate(page, `(() => {
    const config = LESSON_CONFIG.qa?.answerAccumulationAudit;
    if (!config) return null;
    const board = document.querySelector(config.board);
    const primary = document.querySelector(LESSON_CONFIG.qa?.layoutAudit?.primary || '.problem-card');
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height } : null;
    };
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    };
    const color = board ? getComputedStyle(board).backgroundColor : '';
    const channels = color.match(/[0-9.]+/g)?.map(Number) || [];
    const alpha = color.startsWith('rgba') ? Number(channels[3] ?? 1) : color.startsWith('rgb') ? 1 : 0;
    const evidence = [...(board?.querySelectorAll('*') || [])].filter((node) => {
      if (!visible(node)) return false;
      const text = node.textContent.replace(/\s+/g, ' ').trim();
      return text.length > 0 && text !== '?';
    });
    const boardRect = rectOf(board);
    const primaryRect = rectOf(primary);
    const visual = board?.closest('.capacity-visual');
    const renderedSolvedSteps = (visual?.dataset.solvedSteps || '').split(',').filter(Boolean);
    const expectedSolvedSteps = (window.__mathmonEngineQa?.getCurrentProblem?.()?.steps || [])
      .slice(0, ${Number(expectedCount)})
      .map((step) => step.id);
    return {
      standard:config.standard,
      boardRect,
      primaryRect,
      visible:visible(board),
      answerCount:Number(board?.getAttribute(config.answerCountAttribute) || 0),
      renderedSolvedSteps,
      expectedSolvedSteps,
      evidenceCount:evidence.length,
      text:board?.textContent.replace(/\s+/g, ' ').trim() || '',
      backgroundColor:color,
      backgroundAlpha:alpha,
      insidePrimary:Boolean(boardRect && primaryRect
        && boardRect.left >= primaryRect.left - 1 && boardRect.top >= primaryRect.top - 1
        && boardRect.right <= primaryRect.right + 1 && boardRect.bottom <= primaryRect.bottom + 1),
      overflowX:board ? Math.max(0, board.scrollWidth - board.clientWidth) : Infinity,
      overflowY:board ? Math.max(0, board.scrollHeight - board.clientHeight) : Infinity
    };
  })()`);
  if (!audit) return null;
  assert(audit.standard === 'primary-calculation-accumulates-v1', `${label}: answer accumulation standard is wrong`, audit);
  assert(audit.visible && audit.insidePrimary, `${label}: calculation board is hidden or outside the primary panel`, audit);
  assert(audit.answerCount === expectedCount, `${label}: correct answers did not accumulate in the calculation board`, audit);
  assert(audit.renderedSolvedSteps.length === expectedCount, `${label}: rendered solved-step evidence does not match the expected answer count`, audit);
  assert(
    JSON.stringify(audit.renderedSolvedSteps) === JSON.stringify(audit.expectedSolvedSteps),
    `${label}: rendered calculation state differs from the model's expected solved-step sequence`,
    audit,
  );
  assert(audit.evidenceCount >= 2 && audit.text.length >= 4, `${label}: primary panel lacks real decision information`, audit);
  assert(audit.backgroundAlpha === 1, `${label}: calculation board surface is translucent`, audit);
  assert(audit.overflowX <= 1 && audit.overflowY <= 1, `${label}: calculation board content overflows`, audit);
  return audit;
}

async function auditConfiguredPlayProgress(page, label) {
  const configured = await evaluate(page, "Boolean(LESSON_CONFIG.qa?.playProgressAudit)");
  if (!configured) return null;
  const before = await evaluate(page, "window.__mathmonEngineQa.getState()");
  const tiers = await evaluate(page, "LESSON_CONFIG.results.map(({ id, name, minPower, minCorrect, needsSpecial, playImage }) => ({ id, name, minPower, minCorrect, needsSpecial:Boolean(needsSpecial), playImage }))");
  const expectedCanvas = await evaluate(page, "LESSON_CONFIG.workbench?.playStateImageSet?.canvas || ''");
  const auditConfig = await evaluate(page, "LESSON_CONFIG.qa.playProgressAudit");
  const playSetConfig = await evaluate(page, "LESSON_CONFIG.workbench?.playStateImageSet || {}");
  const [expectedWidth, expectedHeight] = expectedCanvas.split("x").map(Number);
  const states = [];
  assert(auditConfig.standard === "stage-left-play-progress-v1", `${label}: play progress position standard is wrong`, auditConfig);
  assert(auditConfig.stateCount === 6, `${label}: play progress state count must be fixed at 6`, auditConfig);
  assert(auditConfig.canvas === expectedCanvas, `${label}: play progress audit canvas differs from its image-set canvas`, { auditConfig, expectedCanvas });
  assert(tiers.length === auditConfig.stateCount, `${label}: play progress result tier count differs from its fixed state count`, { tiers, auditConfig });
  assert(
    JSON.stringify(tiers.map((tier) => tier.id)) === JSON.stringify(auditConfig.expectedStates),
    `${label}: play progress state order differs from its fixed contract`,
    { tiers, auditConfig },
  );
  assert(
    JSON.stringify(playSetConfig.layoutContract?.mathmonPlacement || {}) === JSON.stringify(auditConfig.mathmonPlacement || {}),
    `${label}: play progress Mathmon placement differs between image and browser contracts`,
    { playSetConfig, auditConfig },
  );

  for (const tier of tiers) {
    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:${Number(tier.minPower || 0)},
        correctFirstTry:${Number(tier.minCorrect || 0)},
        specialSeen:${tier.needsSpecial ? "true" : "false"}
      });
      window.__mathmonEngineQa.renderProblem();
    })()`);
    await waitUntil(
      page,
      `document.querySelector('.compass-play-progress')?.dataset.resultTier === ${JSON.stringify(tier.id)}
        && document.querySelector('.compass-play-progress-art')?.complete
        && document.querySelector('.compass-play-progress-art')?.naturalWidth > 0`,
      `${label}: ${tier.id} play progress did not render`,
      8000,
    );
    const state = await evaluate(page, `(() => {
      const config = LESSON_CONFIG.qa.playProgressAudit;
      const panel = document.querySelector(config.panel);
      const image = document.querySelector(config.image);
      const labelNode = document.querySelector(config.label);
      const work = document.querySelector(LESSON_CONFIG.qa.layoutAudit.workArea);
      const stage = document.querySelector('.stage-shell');
      const rect = (node) => {
        const value = node?.getBoundingClientRect();
        return value ? { left:value.left, top:value.top, right:value.right, bottom:value.bottom, width:value.width, height:value.height } : null;
      };
      const panelRect = rect(panel);
      const imageRect = rect(image);
      const workRect = rect(work);
      const stageRect = rect(stage);
      const overlapX = panelRect && workRect ? Math.max(0, Math.min(panelRect.right, workRect.right) - Math.max(panelRect.left, workRect.left)) : Infinity;
      const overlapY = panelRect && workRect ? Math.max(0, Math.min(panelRect.bottom, workRect.bottom) - Math.max(panelRect.top, workRect.top)) : Infinity;
      const panelCenterX = panelRect ? (panelRect.left + panelRect.right) / 2 : NaN;
      const imageCenterX = imageRect ? (imageRect.left + imageRect.right) / 2 : NaN;
      const leftLaneCenterX = stageRect && workRect ? (stageRect.left + workRect.left) / 2 : NaN;
      const naturalRatio = image?.naturalHeight ? image.naturalWidth / image.naturalHeight : 0;
      const renderedRatio = imageRect?.height ? imageRect.width / imageRect.height : 0;
      const placement = config.panelPlacement || {};
      const expectedPanel = stageRect ? {
        left:stageRect.left + stageRect.width * Number(placement.leftRatio || 0),
        top:stageRect.top + stageRect.height * Number(placement.topRatio || 0),
        width:stageRect.width * Number(placement.widthRatio || 0),
        height:stageRect.height * Number(placement.heightRatio || 0)
      } : null;
      return {
        tier:panel?.dataset.resultTier || '',
        standard:panel?.dataset.playProgressStandard || '',
        protagonist:panel?.dataset.protagonist || '',
        cacheVersion:panel?.dataset.cacheVersion || '',
        src:image?.getAttribute('src') || '',
        label:labelNode?.textContent.trim() || '',
        objectFit:image ? getComputedStyle(image).objectFit : '',
        naturalWidth:image?.naturalWidth || 0,
        naturalHeight:image?.naturalHeight || 0,
        naturalRatio,
        renderedRatio,
        panelRect,
        imageRect,
        workRect,
        stageRect,
        overlapX,
        overlapY,
        panelLaneCenterDx:Math.abs(panelCenterX - leftLaneCenterX),
        imagePanelCenterDx:Math.abs(imageCenterX - panelCenterX),
        panelPlacementDelta:panelRect && expectedPanel ? {
          left:Math.abs(panelRect.left - expectedPanel.left),
          top:Math.abs(panelRect.top - expectedPanel.top),
          width:Math.abs(panelRect.width - expectedPanel.width),
          height:Math.abs(panelRect.height - expectedPanel.height)
        } : null,
        expectedPanel,
        labelOverflow:Boolean(labelNode && (labelNode.scrollWidth > labelNode.clientWidth + 1 || labelNode.scrollHeight > labelNode.clientHeight + 1))
      };
    })()`);
    assert(state.tier === tier.id, `${label}: wrong play progress tier`, { tier, state });
    assert(state.src === tier.playImage, `${label}: wrong play progress image`, { tier, state });
    assert(state.label === tier.name, `${label}: wrong play progress label`, { tier, state });
    assert(state.standard === auditConfig.expectedStandard, `${label}: wrong play progress standard`, { tier, state });
    assert(state.protagonist === auditConfig.expectedProtagonist, `${label}: play progress Mathmon is missing`, { tier, state });
    assert(state.cacheVersion === playSetConfig.cacheVersion, `${label}: play progress cache version mismatch`, { tier, state });
    assert(state.objectFit === "contain", `${label}: play progress image is not contain`, { tier, state });
    assert(state.naturalWidth === expectedWidth && state.naturalHeight === expectedHeight, `${label}: play progress natural size mismatch`, { tier, state, expectedCanvas });
    assert(state.overlapX === 0 || state.overlapY === 0, `${label}: play progress overlaps learning work area`, { tier, state });
    assert(
      state.panelLaneCenterDx <= auditConfig.panelLaneCenterTolerancePx,
      `${label}: play progress panel is not centered in the left lane`,
      { tier, state },
    );
    assert(
      state.imagePanelCenterDx <= auditConfig.imagePanelCenterTolerancePx,
      `${label}: play progress image is not centered in its panel`,
      { tier, state },
    );
    assert(
      state.panelPlacementDelta
        && Object.values(state.panelPlacementDelta).every((delta) => delta <= auditConfig.panelPlacement.tolerancePx),
      `${label}: play progress panel left/top/width/height left its fixed Stage coordinate`,
      { tier, state, panelPlacement:auditConfig.panelPlacement },
    );
    assert(!state.labelOverflow, `${label}: play progress label overflows`, { tier, state });
    assert(
      state.panelRect.left >= state.stageRect.left - 1
        && state.panelRect.top >= state.stageRect.top - 1
        && state.panelRect.right <= state.stageRect.right + 1
        && state.panelRect.bottom <= state.stageRect.bottom + 1,
      `${label}: play progress leaves the Stage`,
      { tier, state },
    );
    states.push(state);
  }

  await evaluate(page, `(() => {
    window.__mathmonEngineQa.setState(${JSON.stringify({
      problemIndex: before.problemIndex,
      stepIndex: before.stepIndex,
      power: before.power,
      correctFirstTry: before.correctFirstTry,
      specialSeen: before.specialSeen,
      completed: before.completed,
      mistakeTouched: before.mistakeTouched,
    })});
    window.__mathmonEngineQa.renderProblem();
  })()`);
  assert(new Set(states.map((state) => state.src)).size === tiers.length, `${label}: play progress states reuse an image`, states);
  return { expectedCanvas, states };
}

async function auditConfiguredTypography(page, label) {
  const audit = await evaluate(page, `(() => {
    const config = LESSON_CONFIG.qa?.typographyAudit;
    if (!config) return null;
    const readFont = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return {
        selector,
        text:node.textContent.trim(),
        fontSize:Number.parseFloat(style.fontSize) || 0,
        lineHeight:Number.parseFloat(style.lineHeight) || 0,
        rect:{ left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height },
        visible:style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1
      };
    };
    const readSvgText = (rootSelector) => [...document.querySelectorAll(rootSelector)]
      .filter((node) => node.textContent.trim().length > 0 && node.ownerSVGElement)
      .map((node) => {
        const svg = node.ownerSVGElement;
        const viewBox = svg.viewBox.baseVal;
        const svgRect = svg.getBoundingClientRect();
        const scale = viewBox.width > 0 && viewBox.height > 0
          ? Math.min(svgRect.width / viewBox.width, svgRect.height / viewBox.height)
          : 0;
        let box = null;
        try {
          const measured = node.getBBox();
          box = { x:measured.x, y:measured.y, width:measured.width, height:measured.height };
        } catch {}
        return {
          text:node.textContent.trim(),
          fontSize:Number.parseFloat(getComputedStyle(node).fontSize) || 0,
          renderedFontSize:(Number.parseFloat(getComputedStyle(node).fontSize) || 0) * scale,
          box,
          viewBox:{ x:viewBox.x, y:viewBox.y, width:viewBox.width, height:viewBox.height },
          outside:Boolean(box && (
            box.x < viewBox.x - 1
            || box.y < viewBox.y - 1
            || box.x + box.width > viewBox.x + viewBox.width + 1
            || box.y + box.height > viewBox.y + viewBox.height + 1
          ))
        };
      });
    const rectOf = (selector) => {
      const node = document.querySelector(selector);
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const primary = rectOf(LESSON_CONFIG.qa?.layoutAudit?.primary);
    const tertiary = rectOf(LESSON_CONFIG.qa?.layoutAudit?.tertiary);
    const secondary = rectOf(LESSON_CONFIG.qa?.layoutAudit?.secondary);
    const panelRects = { primary, secondary, tertiary };
    const layoutConfig = LESSON_CONFIG.qa?.layoutAudit;
    const verticalOrder = Array.isArray(layoutConfig?.verticalOrder) && layoutConfig.verticalOrder.length >= 2
      ? layoutConfig.verticalOrder
      : ['primary', 'tertiary', 'secondary'];
    const gaps = {};
    for (let index = 0; index < verticalOrder.length - 1; index += 1) {
      const from = verticalOrder[index];
      const to = verticalOrder[index + 1];
      const fromRect = panelRects[from];
      const toRect = panelRects[to];
      gaps[from + 'To' + to[0].toUpperCase() + to.slice(1)] = fromRect && toRect
        ? toRect.top - fromRect.bottom
        : null;
    }
    return {
      config,
      headline:readFont(config.headline),
      instruction:readFont(config.instruction),
      feedback:readFont(config.feedback),
      brand:readFont('#screen-play .brand-badge'),
      counter:readFont('#problemCounter'),
      unit:readFont('#screen-play .unit-badge'),
      settings:rectOf('#settingsButton'),
      primaryVisual:rectOf(config.primaryVisual),
      primary,
      primarySvgText:readSvgText(config.primarySvgText),
      choiceSvgText:readSvgText(config.choiceSvgText),
      verticalOrder,
      gaps
    };
  })()`);
  if (!audit) return null;
  const { config } = audit;
  assert(audit.headline?.visible && audit.headline.fontSize >= config.minHeadlinePx, `${label}: problem headline is too small`, audit);
  assert(audit.instruction?.visible && audit.instruction.fontSize >= config.minInstructionPx, `${label}: instruction is too small`, audit);
  assert(audit.brand?.visible && audit.brand.fontSize >= config.minBadgePx, `${label}: brand badge is too small`, audit);
  assert(audit.unit?.visible && audit.unit.fontSize >= config.minBadgePx, `${label}: unit badge is too small`, audit);
  assert(audit.counter?.visible && audit.counter.fontSize >= config.minCounterPx && /^\d+\/10$/.test(audit.counter.text), `${label}: problem counter is too small or unreadable`, audit);
  assert(audit.settings?.width >= config.minGlobalControlPx && audit.settings?.height >= config.minGlobalControlPx, `${label}: settings touch target is too small`, audit);
  assert(
    audit.primaryVisual
      && audit.primary
      && audit.primaryVisual.left >= audit.primary.left - 1
      && audit.primaryVisual.top >= audit.primary.top - 1
      && audit.primaryVisual.right <= audit.primary.right + 1
      && audit.primaryVisual.bottom <= audit.primary.bottom + 1,
    `${label}: primary SVG surface left its reserved panel`,
    audit
  );
  assert(
    Object.values(audit.gaps).length > 0
      && Object.values(audit.gaps).every((gap) => Number.isFinite(gap) && gap >= config.minPanelGapPx),
    `${label}: learning panel gap is too small`,
    audit
  );
  assert(audit.primarySvgText.every((item) => item.renderedFontSize >= config.minPrimarySvgTextPx), `${label}: primary SVG text is too small`, audit);
  assert(audit.choiceSvgText.every((item) => item.renderedFontSize >= config.minChoiceSvgTextPx), `${label}: choice SVG text is too small`, audit);
  assert([...audit.primarySvgText, ...audit.choiceSvgText].every((item) => !item.outside), `${label}: SVG text left its viewBox`, audit);
  return audit;
}

async function auditConfiguredCompletionAlignment(page, label, waitingAudit) {
  if (!waitingAudit?.metrics?.workArea) return null;
  const complete = await evaluate(page, `(() => {
    const layout = LESSON_CONFIG.qa?.layoutAudit;
    const config = LESSON_CONFIG.qa?.completionAudit;
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height, cx:rect.left + rect.width / 2
      } : null;
    };
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 1 && rect.height > 1;
    };
    const workArea = document.querySelector(layout?.workArea || '');
    const panel = document.querySelector(config?.panel || layout?.complete || '');
    if (!panel) return null;
    if (config?.standard !== 'calculation-preserved-v1') {
      const rect = rectOf(panel);
      return { standard:'legacy-work-area-v1', workArea:rectOf(workArea), panel:rect, visible:visible(panel) && panel.classList.contains('is-visible') };
    }
    const primary = document.querySelector(config.primary);
    const calculation = document.querySelector(config.calculation);
    const text = document.querySelector(config.text);
    const action = document.querySelector(config.action);
    const choices = document.querySelector(config.choices);
    return {
      standard:config.standard,
      config,
      workArea:rectOf(workArea),
      primary:rectOf(primary),
      calculation:rectOf(calculation),
      panel:rectOf(panel),
      text:rectOf(text),
      action:rectOf(action),
      visible:{
        primary:visible(primary),
        calculation:visible(calculation),
        panel:visible(panel) && panel.classList.contains('is-visible'),
        text:visible(text),
        action:visible(action),
        choices:visible(choices)
      },
      answer:calculation?.querySelector('.answer-slot')?.textContent.trim() || '',
      textValue:text?.textContent.trim() || ''
    };
  })()`);
  assert(complete?.visible?.panel ?? complete?.visible, `${label}: configured completion panel is not visible`, { complete, waitingAudit });
  if (complete.standard !== 'calculation-preserved-v1') {
    const waiting = waitingAudit.metrics.workArea;
    for (const key of ["left", "right", "cx"]) {
      assert(Math.abs(complete.panel[key] - waiting[key]) <= 1, `${label}: completion ${key} moved more than 1px`, { complete, waiting });
    }
    return complete;
  }
  const edgeTolerance = complete.config.edgeTolerancePx;
  const axisTolerance = complete.config.axisTolerancePx;
  const waitingWorkArea = waitingAudit.metrics.workArea;
  const waitingPrimary = waitingAudit.metrics.primary;
  const waitingCalculation = waitingAudit.metrics.tertiary;
  assert(complete.visible.primary && complete.visible.calculation && complete.visible.text && complete.visible.action, `${label}: completed calculation evidence or action is hidden`, { complete, waitingAudit });
  assert(!complete.visible.choices, `${label}: completed choices still occupy the learning area`, { complete, waitingAudit });
  assert(complete.answer && complete.answer !== '?', `${label}: completed calculation board does not show the chosen answer`, { complete, waitingAudit });
  assert(complete.textValue, `${label}: completed expression is empty`, { complete, waitingAudit });
  for (const key of ['left', 'right', 'cx']) {
    assert(Math.abs(complete.workArea[key] - waitingWorkArea[key]) <= edgeTolerance, `${label}: learning work area ${key} changed after confirmation`, { complete, waitingAudit });
    assert(Math.abs(complete.primary[key] - waitingPrimary[key]) <= edgeTolerance, `${label}: primary visual ${key} changed after confirmation`, { complete, waitingAudit });
    assert(Math.abs(complete.calculation[key] - waitingCalculation[key]) <= edgeTolerance, `${label}: calculation board ${key} changed after confirmation`, { complete, waitingAudit });
    assert(Math.abs(complete.panel[key] - complete.calculation[key]) <= edgeTolerance, `${label}: completion panel and calculation board ${key} differ`, { complete, waitingAudit });
  }
  assert(Math.abs(complete.text.cx - complete.panel.cx) <= axisTolerance, `${label}: completed expression left the shared center axis`, { complete, waitingAudit });
  assert(Math.abs(complete.action.cx - complete.panel.cx) <= axisTolerance, `${label}: next action left the shared center axis`, { complete, waitingAudit });
  assert(complete.calculation.bottom <= complete.panel.top + 1, `${label}: calculation board and completion panel overlap`, { complete, waitingAudit });
  return complete;
}

async function auditConfiguredResultNextGoal(page, label) {
  const audit = await evaluate(page, `(() => {
    const shouldShow = LESSON_CONFIG.result?.showNextGoal === true;
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height
      } : null;
    };
    const overlaps = (a, b) => a && b
      ? {
        x:Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)),
        y:Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      }
      : { x:0, y:0 };
    const node = document.getElementById('resultNextSvg');
    const stage = rectOf(document.querySelector('.stage-shell'));
    const next = rectOf(node);
    const correct = rectOf(document.getElementById('resultCorrectArt'));
    const retry = rectOf(document.getElementById('restartButton') || document.getElementById('retryButton'));
    return {
      shouldShow,
      text:node?.textContent.trim() || '',
      accessibleText:document.getElementById('resultNext')?.textContent.trim() || '',
      hidden:Boolean(node?.hasAttribute('hidden')),
      display:node ? getComputedStyle(node).display : '',
      stage, next, correct, retry,
      correctOverlap:overlaps(next, correct),
      retryOverlap:overlaps(next, retry)
    };
  })()`);
  assert(audit, `${label}: next-goal node is missing`);
  if (!audit.shouldShow) {
    assert(audit.hidden && audit.display === "none" && audit.next?.width === 0 && audit.next?.height === 0, `${label}: disabled next goal still occupies the result screen`, audit);
    return audit;
  }
  assert(audit.text && audit.text === audit.accessibleText, `${label}: visible and accessible next-goal copy differ`, audit);
  assert(/^다음엔 .+|^최고 단계예요!$|^모든 별자리를 밝혔어요!$/.test(audit.text), `${label}: next-goal copy is not student-facing`, audit);
  assert(!audit.hidden && audit.display !== "none" && audit.next?.width > 0 && audit.next?.height > 0, `${label}: next goal is hidden`, audit);
  assert(audit.next.left >= audit.stage.left && audit.next.right <= audit.stage.right && audit.next.top >= audit.stage.top && audit.next.bottom <= audit.stage.bottom, `${label}: next goal leaves the Stage`, audit);
  assert(!(audit.correctOverlap.x > 0 && audit.correctOverlap.y > 0), `${label}: next goal overlaps the correct-count art`, audit);
  assert(!(audit.retryOverlap.x > 0 && audit.retryOverlap.y > 0), `${label}: next goal overlaps the retry button`, audit);
  return audit;
}

async function auditConfiguredResultCohesionV2(page, label) {
  const audit = await evaluate(page, `(() => {
    const config = LESSON_CONFIG.qa?.resultCohesionAudit;
    if (!config) return null;
    const visible = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return !node.hidden && style.display !== 'none' && style.visibility !== 'hidden'
        && Number(style.opacity || 1) > 0 && rect.width > 1 && rect.height > 1;
    };
    const rectOf = (node) => {
      if (!visible(node)) return null;
      const rect = node.getBoundingClientRect();
      return {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height,
        cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2
      };
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const nodes = {
      title:document.getElementById('resultTitleArt'),
      track:document.getElementById('resultMeasureTrackSvg'),
      measure:document.getElementById('resultMeasureSvg'),
      correct:document.getElementById('resultCorrectArt'),
      next:document.getElementById('resultNextSvg'),
      retry:document.getElementById('restartButton') || document.getElementById('retryButton')
    };
    const rects = Object.fromEntries(Object.entries(nodes).map(([key, node]) => [key, rectOf(node)]));
    const axisRects = (config.axisNodes || []).map((key) => ({ key, rect:rects[key] })).filter((item) => item.rect);
    const centers = axisRects.map((item) => item.rect.cx);
    const overlapArea = (a, b) => a && b
      ? Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left))
        * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
      : 0;
    const ordered = ['track', 'measure', 'correct', 'next', 'retry'];
    const overlaps = [];
    for (let index = 0; index < ordered.length - 1; index += 1) {
      const first = ordered[index];
      const second = ordered[index + 1];
      const area = overlapArea(rects[first], rects[second]);
      if (area > 0) overlaps.push({ first, second, area });
    }
    let titleOpaqueBottom = null;
    const title = nodes.title;
    if (visible(title) && title.complete && title.naturalWidth > 0 && title.naturalHeight > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = title.naturalWidth;
        canvas.height = title.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently:true });
        context.drawImage(title, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        const threshold = Number(config.titleAlphaThreshold || 24);
        let bottomRow = -1;
        for (let y = canvas.height - 1; y >= 0 && bottomRow < 0; y -= 1) {
          for (let x = 0; x < canvas.width; x += 1) {
            if (pixels[(y * canvas.width + x) * 4 + 3] > threshold) {
              bottomRow = y;
              break;
            }
          }
        }
        if (bottomRow >= 0) {
          titleOpaqueBottom = rects.title.top + ((bottomRow + 1) / canvas.height) * rects.title.height;
        }
      } catch {}
    }
    return {
      config,
      stage,
      rects,
      axisRects,
      axisSpread:centers.length ? Math.max(...centers) - Math.min(...centers) : Infinity,
      allowedAxisSpread:stage ? stage.width * Number(config.maxAxisSpreadRatio || 0.015) : 0,
      overlaps,
      titleOpaqueBottom,
      titleTrackGap:titleOpaqueBottom !== null && rects.track ? rects.track.top - titleOpaqueBottom : null
    };
  })()`);
  if (!audit) return null;
  assert(audit.config.standard === "result-dynamic-axis-v1", `${label}: result cohesion standard is wrong`, audit);
  assert(audit.stage && audit.axisRects.length === audit.config.axisNodes.length, `${label}: result cohesion nodes are missing`, audit);
  assert(audit.axisSpread <= audit.allowedAxisSpread, `${label}: result dynamic elements left their shared axis`, audit);
  assert(audit.overlaps.length === 0, `${label}: adjacent result elements overlap`, audit);
  if (audit.titleOpaqueBottom !== null) {
    assert(
      audit.titleTrackGap >= Number(audit.config.minimumVisibleGapPx || 0),
      `${label}: visible title art overlaps or crowds the progress track`,
      audit,
    );
  }
  return audit;
}

async function auditAllConfiguredResultCohesionTiers(page, lesson, viewport, shots) {
  const tiers = await evaluate(page, `(() => {
    if (!LESSON_CONFIG.qa?.resultCohesionAudit) return [];
    return LESSON_CONFIG.results.map((result) => ({
      id:result.id,
      power:Number(result.minPower || 0),
      correct:Number(result.minCorrect || 0),
      special:Boolean(result.needsSpecial)
    }));
  })()`);
  for (const tier of tiers) {
    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:${tier.power},
        correctFirstTry:${tier.correct},
        specialSeen:${tier.special},
        currentResult:null
      });
      window.__mathmonEngineQa.showResult();
    })()`);
    await waitUntil(
      page,
      `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)}
        && document.getElementById('resultBg')?.complete
        && document.getElementById('resultBg')?.naturalWidth === 1280
        && document.getElementById('resultCorrectArt')?.complete
        && document.getElementById('resultCorrectArt')?.naturalWidth > 0`,
      `${viewport.name}: configured result cohesion tier ${tier.id} did not render`,
    );
    await auditGeometry(page, `${viewport.name} result cohesion ${tier.id}`, { requireRetry:true });
    await auditConfiguredResultNextGoal(page, `${viewport.name} result cohesion ${tier.id} next goal`);
    await auditConfiguredResultCohesionV2(page, `${viewport.name} result cohesion ${tier.id}`);
    shots.push(await screenshot(page, lesson, viewport, `08c-result-cohesion-${tier.id}`));
  }
  return tiers;
}

async function auditCompassResultVisual(page, label, expectedTier) {
  const audit = await evaluate(page, `(() => {
    const config = LESSON_CONFIG.qa?.resultVisualAudit;
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height,
        cx:rect.left + rect.width / 2,
        cy:rect.top + rect.height / 2
      } : null;
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const screen = document.getElementById('screen-result');
    const scene = document.getElementById('resultBg');
    const tier = screen?.dataset.resultTier || '';
    const scaleX = stage.width / 1280;
    const scaleY = stage.height / 800;
    const toScreenRect = (slot) => slot ? ({
      left:stage.left + slot.x * scaleX,
      top:stage.top + slot.y * scaleY,
      right:stage.left + (slot.x + slot.width) * scaleX,
      bottom:stage.top + (slot.y + slot.height) * scaleY,
      width:slot.width * scaleX,
      height:slot.height * scaleY,
      cx:stage.left + (slot.x + slot.width / 2) * scaleX,
      cy:stage.top + (slot.y + slot.height / 2) * scaleY
    }) : null;
    const nodes = {
      measure:document.getElementById('resultMeasureSvg'),
      track:document.getElementById('resultMeasureTrackSvg'),
      correct:document.getElementById('resultCorrectArt'),
      next:document.getElementById('resultNextSvg'),
      retry:document.getElementById('restartButton') || document.getElementById('retryButton')
    };
    const rects = Object.fromEntries(Object.entries(nodes).map(([key, node]) => [key, rectOf(node)]));
    const baseAxis = Number(config?.dynamicAxisX || 0);
    const tierAxis = Number(config?.dynamicAxisByTier?.[tier] ?? baseAxis);
    const axisBoundSlots = new Set(['measure', 'track', 'correct', 'next']);
    const shiftedSlots = Object.fromEntries(Object.entries(config?.slots || {}).map(([key, slot]) => [
      key,
      axisBoundSlots.has(key) ? { ...slot, x:slot.x + tierAxis - baseAxis } : slot,
    ]));
    const slots = Object.fromEntries(Object.entries(shiftedSlots).map(([key, slot]) => [key, toScreenRect(slot)]));
    const sceneStyle = getComputedStyle(scene);
    const forbiddenNodes = (config?.forbiddenSelectors || [])
      .flatMap((selector) => [...document.querySelectorAll(selector)])
      .filter((node, index, all) => all.indexOf(node) === index)
      .map((node) => ({
        selector:node.className || node.id || node.tagName,
        rect:rectOf(node),
        display:getComputedStyle(node).display,
        visibility:getComputedStyle(node).visibility,
        opacity:Number(getComputedStyle(node).opacity || 0)
      }));
    const detectPanel = () => {
      const panelConfig = config?.panelPixelAudit;
      if (!panelConfig || !scene?.complete || !scene.naturalWidth || !scene.naturalHeight) return null;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 1280;
        canvas.height = 800;
        const context = canvas.getContext('2d', { willReadFrequently:true });
        context.drawImage(scene, 0, 0, 1280, 800);
        const pixels = context.getImageData(0, 0, 1280, 800).data;
        const search = panelConfig.searchRect;
        const rgb = panelConfig.darkRgbMax;
        const ratio = Number(panelConfig.minBlueToRedRatio || 0);
        const columns = [];
        for (let x = search.x; x < search.x + search.width; x += 1) {
          let darkPixels = 0;
          for (let y = search.y; y < search.y + search.height; y += 1) {
            const offset = (y * 1280 + x) * 4;
            const red = pixels[offset];
            const green = pixels[offset + 1];
            const blue = pixels[offset + 2];
            if (red < rgb.r && green < rgb.g && blue < rgb.b && blue > red * ratio) darkPixels += 1;
          }
          columns.push({ x, darkPixels });
        }
        const runs = [];
        let start = null;
        let end = null;
        for (const column of columns) {
          if (column.darkPixels > panelConfig.minColumnDarkPixels) {
            if (start === null) start = column.x;
            end = column.x;
          } else if (start !== null) {
            runs.push({ left:start, right:end, width:end - start + 1 });
            start = null;
            end = null;
          }
        }
        if (start !== null) runs.push({ left:start, right:end, width:end - start + 1 });
        const panel = runs
          .filter((run) => run.width >= panelConfig.minRunWidth)
          .sort((first, second) => second.width - first.width)[0];
        if (!panel) return { error:'no-panel-run', runs };
        panel.cx = (panel.left + panel.right) / 2;
        panel.screenCx = stage.left + panel.cx * scaleX;
        return panel;
      } catch (error) {
        return { error:String(error?.message || error) };
      }
    };
    const panel = detectPanel();
    const resultConfig = LESSON_CONFIG.results.find((result) => result.id === tier);
    return {
      config, stage, tier,
      visualRank:Number(resultConfig?.visualRank),
      scene:{
        source:scene?.getAttribute('src') || '',
        complete:Boolean(scene?.complete),
        naturalWidth:scene?.naturalWidth || 0,
        naturalHeight:scene?.naturalHeight || 0,
        objectFit:sceneStyle.objectFit || '',
        mixBlendMode:sceneStyle.mixBlendMode || '',
        filter:sceneStyle.filter || '',
        opacity:Number(sceneStyle.opacity || 0),
        rect:rectOf(scene)
      },
      forbiddenNodes,
      targetAxisStage:tierAxis,
      targetAxis:stage.left + tierAxis * scaleX,
      panel, rects, slots,
      fontSizes:{
        measure:parseFloat(getComputedStyle(nodes.measure).fontSize),
        next:parseFloat(getComputedStyle(nodes.next).fontSize)
      }
    };
  })()`);
  assert(audit?.config?.standard === "result-tier-fullscene-native-v1", `${label}: result visual contract is missing`, audit);
  assert(audit.tier === expectedTier.id, `${label}: wrong visible tier`, audit);
  assert(audit.visualRank === expectedTier.visualRank, `${label}: visual rank does not match the tier`, audit);
  assert(audit.scene.source.endsWith(`result-${expectedTier.id}-generated.webp`), `${label}: wrong complete result scene source`, audit);
  assert(audit.scene.complete && audit.scene.naturalWidth === 1280 && audit.scene.naturalHeight === 800, `${label}: complete result scene canvas is wrong`, audit);
  assert(audit.scene.objectFit === "cover", `${label}: complete result scene must use cover`, audit);
  assert(audit.scene.mixBlendMode === "normal", `${label}: result scene must not use a blend mode`, audit);
  assert(audit.scene.filter === "none", `${label}: result scene must not use a tier CSS filter`, audit);
  assert(audit.scene.opacity === 1, `${label}: result scene opacity must stay at 1`, audit);
  assert(audit.forbiddenNodes.length === 0, `${label}: a forbidden result effect overlay exists`, audit);
  for (const edge of ["left", "top", "right", "bottom"]) {
    assert(Math.abs(audit.scene.rect[edge] - audit.stage[edge]) <= 1, `${label}: complete result scene does not fill the Stage at ${edge}`, audit);
  }
  assert(audit.fontSizes.measure === 32 && audit.fontSizes.next === 28, `${label}: result typography token changed`, audit);
  assert(audit.config.panelPixelAudit?.standard === "dark-panel-contiguous-run-v1", `${label}: result raster panel detector is missing`, audit);
  assert(audit.config.dynamicAxisByTier?.[expectedTier.id] === audit.targetAxisStage, `${label}: the result tier has no declared raster-panel axis`, audit);
  assert(audit.panel && !audit.panel.error, `${label}: the generated result panel was not detected from raster pixels`, audit);
  assert(
    Math.abs(audit.panel.cx - audit.targetAxisStage) <= Number(audit.config.panelPixelAudit.centerTolerancePx || 1),
    `${label}: declared dynamic axis does not match the generated result panel pixels`,
    audit,
  );

  const axisTolerance = Number(audit.config.axisTolerancePx || 1);
  for (const key of ["measure", "track", "correct", "next"]) {
    const rect = audit.rects[key];
    const target = audit.slots[key];
    assert(rect && target, `${label}: ${key} result slot is missing`, audit);
    assert(Math.abs(rect.cx - audit.targetAxis) <= axisTolerance, `${label}: ${key} leaves the result axis`, { audit, key });
    assert(Math.abs(rect.cx - audit.panel.screenCx) <= Math.max(axisTolerance, Number(audit.config.panelPixelAudit.centerTolerancePx || 1) * (audit.stage.width / 1280)), `${label}: ${key} is not centered on the generated result panel`, { audit, key });
    assert(
      rect.left >= target.left - 1 && rect.right <= target.right + 1
      && rect.top >= target.top - 1 && rect.bottom <= target.bottom + 1,
      `${label}: ${key} leaves its declared slot`,
      { audit, key },
    );
  }
  for (const key of ["track", "retry"]) {
    const rect = audit.rects[key];
    const target = audit.slots[key];
    for (const edge of ["left", "top", "right", "bottom"]) {
      assert(Math.abs(rect[edge] - target[edge]) <= 1, `${label}: ${key} ${edge} differs from its slot by more than 1px`, { audit, key, edge });
    }
  }
  const ordered = ["measure", "track", "correct", "next", "retry"];
  const minimumGap = Number(audit.config.minVerticalGapPx || 0) * (audit.stage.width / 1280);
  for (let index = 0; index < ordered.length - 1; index += 1) {
    const first = audit.rects[ordered[index]];
    const second = audit.rects[ordered[index + 1]];
    assert(second.top - first.bottom >= minimumGap - 1, `${label}: ${ordered[index]} and ${ordered[index + 1]} are too close or overlap`, { audit, minimumGap });
  }
  return audit;
}

async function auditConfiguredRewardSprite(page, label, phase) {
  const audit = await evaluate(page, `(async () => {
    const sprite = LESSON_CONFIG.reward?.spriteSheet;
    if (!sprite?.image) return null;
    const visual = document.getElementById('rewardVisual');
    const pop = document.getElementById('rewardPop');
    const style = getComputedStyle(visual);
    const rect = visual.getBoundingClientRect();
    const sourceSize = async (source) => {
      const image = new Image();
      image.src = source;
      await image.decode();
      return { width:image.naturalWidth, height:image.naturalHeight };
    };
    return {
      dataReward:pop?.dataset.reward || '',
      backgroundImage:style.backgroundImage,
      backgroundSize:style.backgroundSize,
      backgroundPosition:style.backgroundPosition,
      rect:{ width:rect.width, height:rect.height },
      spriteImage:sprite.image,
      closedImage:LESSON_CONFIG.imageAssets?.rewardClosed || '',
      columns:Number(sprite.columns) || 0,
      rows:Number(sprite.rows) || 0,
      slots:sprite.slots || {},
      wrongFamily:LESSON_CONFIG.wrongEvent?.family || '',
      sourceSize:await sourceSize(${phase === "closed"
        ? "LESSON_CONFIG.imageAssets.rewardClosed"
        : "sprite.image"})
    };
  })()`);
  if (!audit) return null;
  assert(audit.rect.width >= 180 && audit.rect.height >= 180, `${label}: reward art slot is too small`, audit);
  assert(Math.abs(audit.rect.width - audit.rect.height) <= 1, `${label}: reward art slot is not square`, audit);
  if (phase === "closed") {
    assert(audit.dataReward === "closed", `${label}: closed reward state is missing`, audit);
    assert(audit.backgroundImage.includes(audit.closedImage), `${label}: closed reward image is not connected`, audit);
    assert(audit.sourceSize.width === 512 && audit.sourceSize.height === 512, `${label}: closed reward source must be 512x512`, audit);
    return audit;
  }
  assert(audit.dataReward && audit.dataReward !== "closed", `${label}: revealed reward family is missing`, audit);
  assert(audit.backgroundImage.includes(audit.spriteImage), `${label}: reward sprite is not connected`, audit);
  assert(
    audit.sourceSize.width === audit.columns * 512 && audit.sourceSize.height === audit.rows * 512,
    `${label}: reward sprite dimensions do not match its grid`,
    audit,
  );
  const slot = audit.slots[audit.dataReward]
    || (audit.dataReward === audit.wrongFamily ? [audit.columns - 1, audit.rows - 1] : null);
  assert(slot, `${label}: revealed reward has no sprite slot`, audit);
  const [actualX, actualY] = audit.backgroundPosition.split(" ").map((value) => Number.parseFloat(value));
  const expectedX = audit.columns > 1 ? (slot[0] / (audit.columns - 1)) * 100 : 0;
  const expectedY = audit.rows > 1 ? (slot[1] / (audit.rows - 1)) * 100 : 0;
  assert(Math.abs(actualX - expectedX) <= 0.5 && Math.abs(actualY - expectedY) <= 0.5, `${label}: reward sprite position is wrong`, {
    ...audit,
    slot,
    expectedPosition:[expectedX, expectedY],
    actualPosition:[actualX, actualY],
  });
  return audit;
}

async function auditConfiguredRewardModal(page, label, phase) {
  const audit = await evaluate(page, `(async () => {
    const config = LESSON_CONFIG.qa?.rewardModalAudit;
    if (!config) return null;
    const expectedPhase = ${JSON.stringify(phase)};
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height,
        cx:rect.left + rect.width / 2,
        cy:rect.top + rect.height / 2
      } : null;
    };
    const overlap = (a, b) => a && b ? {
      x:Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)),
      y:Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
    } : { x:0, y:0 };
    const isVisible = (node) => {
      if (!node || node.hidden) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
    };
    const pop = document.getElementById('rewardPop');
    const stage = document.querySelector('.stage-shell');
    const card = document.querySelector(config.card);
    const visual = document.querySelector(config.visual);
    const rewardLabel = document.querySelector(config.label);
    const openButton = document.querySelector(config.openButton);
    const nextButton = document.querySelector(config.nextButton);
    const popStyle = pop ? getComputedStyle(pop) : null;
    const visualStyle = visual ? getComputedStyle(visual) : null;
    const labelStyle = rewardLabel ? getComputedStyle(rewardLabel) : null;
    const backgroundImage = visualStyle?.backgroundImage || '';
    const match = backgroundImage.match(/^url\\(["']?(.*?)["']?\\)$/);
    const source = match?.[1] || '';
    let natural = { width:0, height:0 };
    if (source) {
      const image = new Image();
      image.src = source;
      await image.decode();
      natural = { width:image.naturalWidth, height:image.naturalHeight };
    }
    const stageRect = rectOf(stage);
    const cardRect = rectOf(card);
    const visualRect = rectOf(visual);
    const labelRect = rectOf(rewardLabel);
    const openRect = rectOf(openButton);
    const nextRect = rectOf(nextButton);
    const activeButton = expectedPhase === 'closed' ? openButton : nextButton;
    const activeRect = expectedPhase === 'closed' ? openRect : nextRect;
    const expectedAssets = expectedPhase === 'closed'
      ? [LESSON_CONFIG.imageAssets?.rewardClosed]
      : Object.values(LESSON_CONFIG.reward?.artMap || {});
    const resolvedAssets = expectedAssets.filter(Boolean).map((asset) => new URL(asset, location.href).href);
    const backdropFilter = popStyle?.backdropFilter || popStyle?.webkitBackdropFilter || '';
    const backdropBlurPx = Number(backdropFilter.match(/blur\\(([\\d.]+)px\\)/)?.[1] || 0);
    return {
      standard:config.standard || '',
      activeScreen:document.querySelector('.screen.is-active')?.id || '',
      modalVisible:isVisible(pop),
      rewardPhase:card?.dataset.rewardPhase || '',
      dataReward:pop?.dataset.reward || '',
      rewardLabel:rewardLabel?.textContent.trim() || '',
      closedLabel:LESSON_CONFIG.reward?.closedLabel || '무엇이 나올까요?',
      changeLabel:LESSON_CONFIG.reward?.changeLabel || LESSON_CONFIG.reward?.unitLabel || LESSON_CONFIG.progressLabel || '힘',
      zeroLabel:LESSON_CONFIG.reward?.zeroLabel || '',
      labelDisplay:labelStyle?.display || '',
      labelOverflow:{
        x:rewardLabel ? Math.max(0, rewardLabel.scrollWidth - rewardLabel.clientWidth) : 0,
        y:rewardLabel ? Math.max(0, rewardLabel.scrollHeight - rewardLabel.clientHeight) : 0
      },
      openVisible:isVisible(openButton),
      nextVisible:isVisible(nextButton),
      activeButtonVisible:isVisible(activeButton),
      backgroundImage,
      backgroundSize:visualStyle?.backgroundSize || '',
      backgroundPosition:visualStyle?.backgroundPosition || '',
      source,
      sourceMatchesExpected:resolvedAssets.includes(source),
      backdropFilter,
      backdropBlurPx,
      natural,
      canvas:config.canvas || '',
      tolerances:{
        center:Number(config.cardCenterTolerancePx) || 0,
        cardSize:Number(config.cardSizeTolerancePx) || 0,
        square:Number(config.visualSquareTolerancePx) || 0,
        visualSize:Number(config.visualSizeTolerancePx) || 0,
        minVisual:Number(config.minVisualPx) || 0,
        minBackdropBlur:Number(config.backdropBlurMinPx) || 0
      },
      expected:{
        cardWidth:Number(config.cardWidthPx) || 0,
        cardHeight:Number(config.cardHeightPx) || 0,
        cardAspectRatio:config.cardAspectRatio || '',
        visualSize:Number(config.visualSizePx) || 0
      },
      stage:stageRect,
      card:cardRect,
      visual:visualRect,
      label:labelRect,
      openButton:openRect,
      nextButton:nextRect,
      centerDelta:stageRect && cardRect ? {
        x:Math.abs(stageRect.cx - cardRect.cx),
        y:Math.abs(stageRect.cy - cardRect.cy)
      } : null,
      visualSquareDelta:visualRect ? Math.abs(visualRect.width - visualRect.height) : null,
      visualButtonOverlap:overlap(visualRect, activeRect),
      labelButtonOverlap:overlap(labelRect, activeRect)
    };
  })()`);
  if (!audit) return null;
  const inside = (inner, outer) => inner && outer
    && inner.left >= outer.left - 1
    && inner.right <= outer.right + 1
    && inner.top >= outer.top - 1
    && inner.bottom <= outer.bottom + 1;
  const [canvasWidth, canvasHeight] = audit.canvas.split("x").map(Number);
  assert(audit.standard === "unit3-modal-art-v1", `${label}: reward modal standard is wrong`, audit);
  assert(audit.modalVisible, `${label}: reward modal is not visible`, audit);
  assert(audit.activeScreen === "screen-play", `${label}: reward modal must keep the problem screen behind it`, audit);
  assert(
    audit.backdropBlurPx >= audit.tolerances.minBackdropBlur,
    `${label}: reward modal backdrop blur is weaker than its contract`,
    audit,
  );
  assert(audit.rewardPhase === phase, `${label}: reward modal phase is wrong`, audit);
  assert(audit.card && audit.visual && audit.stage, `${label}: reward modal geometry is incomplete`, audit);
  assert(
    audit.centerDelta.x <= audit.tolerances.center && audit.centerDelta.y <= audit.tolerances.center,
    `${label}: reward card is not centered in the Stage`,
    audit,
  );
  const [aspectWidth, aspectHeight] = audit.expected.cardAspectRatio.split(":").map(Number);
  const expectedAspect = aspectHeight ? aspectWidth / aspectHeight : 0;
  assert(
    Math.abs(audit.card.width - audit.expected.cardWidth) <= audit.tolerances.cardSize
      && Math.abs(audit.card.height - audit.expected.cardHeight) <= audit.tolerances.cardSize,
    `${label}: reward card left its fixed width/height contract`,
    audit,
  );
  assert(
    expectedAspect > 0 && Math.abs((audit.card.width / audit.card.height) - expectedAspect) <= 0.003,
    `${label}: reward card left its fixed aspect ratio`,
    audit,
  );
  assert(
    audit.visual.width >= audit.tolerances.minVisual
      && audit.visual.height >= audit.tolerances.minVisual
      && audit.visualSquareDelta <= audit.tolerances.square,
    `${label}: reward visual slot is not a stable square`,
    audit,
  );
  assert(
    Math.abs(audit.visual.width - audit.expected.visualSize) <= audit.tolerances.visualSize
      && Math.abs(audit.visual.height - audit.expected.visualSize) <= audit.tolerances.visualSize,
    `${label}: reward visual left its fixed size contract`,
    audit,
  );
  assert(inside(audit.card, audit.stage), `${label}: reward card leaves the Stage`, audit);
  assert(inside(audit.visual, audit.card), `${label}: reward image leaves its card`, audit);
  assert(audit.activeButtonVisible, `${label}: active reward button is not visible`, audit);
  assert(
    !(audit.visualButtonOverlap.x > 0 && audit.visualButtonOverlap.y > 0),
    `${label}: reward image overlaps its button`,
    audit,
  );
  assert(
    !(audit.labelButtonOverlap.x > 0 && audit.labelButtonOverlap.y > 0),
    `${label}: reward label overlaps its button`,
    audit,
  );
  assert(audit.backgroundSize === "cover", `${label}: reward image must fill the square slot without empty edges`, audit);
  assert(audit.sourceMatchesExpected, `${label}: reward image is not connected to the configured state asset`, audit);
  assert(
    audit.natural.width === canvasWidth && audit.natural.height === canvasHeight,
    `${label}: reward source canvas does not match its contract`,
    audit,
  );
  if (phase === "closed") {
    assert(audit.dataReward === "closed", `${label}: closed reward family is missing`, audit);
    assert(audit.openVisible && !audit.nextVisible, `${label}: closed reward must show only the open button`, audit);
    assert(audit.labelDisplay !== "none" && audit.rewardLabel === audit.closedLabel, `${label}: closed reward must show its single short anticipation label`, audit);
    assert(audit.labelOverflow.x <= 1 && audit.labelOverflow.y <= 1, `${label}: closed reward label overflows its box`, audit);
  } else {
    assert(audit.dataReward && audit.dataReward !== "closed", `${label}: revealed reward family is missing`, audit);
    assert(!audit.openVisible && audit.nextVisible, `${label}: revealed reward must show only the next button`, audit);
    assert(audit.labelDisplay !== "none" && audit.rewardLabel, `${label}: revealed reward change is missing`, audit);
    assert(audit.rewardLabel.startsWith(`${audit.changeLabel} `), `${label}: revealed reward must label this event as a change, not accumulated power`, audit);
    assert(/^[-+]?\d+$/.test(audit.rewardLabel.slice(audit.changeLabel.length + 1)), `${label}: revealed reward change value is malformed`, audit);
    assert(audit.labelOverflow.x <= 1 && audit.labelOverflow.y <= 1, `${label}: reward label overflows its box`, audit);
  }
  return audit;
}

async function auditConfiguredResultCohesion(page, label) {
  const audit = await evaluate(page, `(async () => {
    const rectOf = (node) => {
      const rect = node?.getBoundingClientRect();
      return rect ? {
        left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom,
        width:rect.width, height:rect.height,
        cx:rect.left + rect.width / 2
      } : null;
    };
    const pixels = (image) => {
      if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return null;
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently:true });
      context.drawImage(image, 0, 0);
      const data = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const corners = [
        data[3],
        data[(canvas.width - 1) * 4 + 3],
        data[((canvas.height - 1) * canvas.width) * 4 + 3],
        data[(canvas.width * canvas.height - 1) * 4 + 3]
      ];
      let opaque = 0;
      for (let index = 3; index < data.length; index += 4) if (data[index] > 200) opaque += 1;
      return { corners, opaqueRatio:opaque / (canvas.width * canvas.height) };
    };
    const stage = rectOf(document.querySelector('.stage-shell'));
    const titleNode = document.getElementById('resultTitleArt');
    const correctNode = document.getElementById('resultCorrectArt');
    const nextNode = document.getElementById('resultNextSvg');
    const retryNode = document.getElementById('restartButton') || document.getElementById('retryButton');
    const retryArtNode = retryNode?.querySelector('.result-retry-art');
    const layout = LESSON_CONFIG.result?.layout || {};
    const targetAxis = stage.left + (Number(layout.axisX ?? 930) / 1280) * stage.width;
    return {
      stage,
      targetAxis,
      backgroundSource:document.getElementById('resultBg')?.getAttribute('src') || '',
      titleSource:titleNode?.getAttribute('src') || '',
      title:rectOf(titleNode),
      measure:rectOf(document.getElementById('resultMeasureSvg')),
      track:rectOf(document.getElementById('resultMeasureTrackSvg')),
      correct:rectOf(correctNode),
      next:nextNode && !nextNode.hasAttribute('hidden') && getComputedStyle(nextNode).display !== 'none' ? rectOf(nextNode) : null,
      retry:rectOf(retryNode),
      retryArt:rectOf(retryArtNode),
      titlePixels:pixels(titleNode),
      retryPixels:pixels(retryArtNode)
    };
  })()`);
  assert(audit?.stage, `${label}: result Stage is missing`, audit);
  assert(audit.titleSource.includes("result-title-") && audit.titleSource !== audit.backgroundSource, `${label}: generated title must be an independent result layer`, audit);
  const aligned = [audit.title, audit.measure, audit.correct, audit.next, audit.retry].filter(Boolean);
  const tolerance = audit.stage.width * 0.015;
  for (const item of aligned) {
    assert(Math.abs(item.cx - audit.targetAxis) <= tolerance, `${label}: a result element leaves the shared vertical axis`, { audit, item, tolerance });
    assert(item.left >= audit.stage.left && item.right <= audit.stage.right && item.top >= audit.stage.top && item.bottom <= audit.stage.bottom, `${label}: a result element leaves the Stage`, { audit, item });
  }
  assert(audit.title.bottom <= audit.measure.top, `${label}: title overlaps the progress label`, audit);
  assert(audit.measure.bottom <= audit.track.top, `${label}: progress label overlaps the progress bar`, audit);
  assert(audit.track.bottom <= audit.correct.top, `${label}: progress bar overlaps the correct-count art`, audit);
  if (audit.next) {
    assert(audit.correct.bottom <= audit.next.top, `${label}: correct-count art overlaps the next goal`, audit);
    assert(audit.next.bottom <= audit.retry.top, `${label}: next goal overlaps the retry button`, audit);
  } else {
    assert(audit.correct.bottom <= audit.retry.top, `${label}: correct-count art overlaps the retry button`, audit);
  }
  for (const edge of ["left", "top", "right", "bottom"]) {
    assert(Math.abs(audit.retry[edge] - audit.retryArt[edge]) <= 1, `${label}: retry hitbox and generated button art do not match`, { audit, edge });
  }
  assert(audit.titlePixels?.corners.every((alpha) => alpha <= 16) && audit.titlePixels.opaqueRatio > 0.01, `${label}: generated title transparency contract failed`, audit);
  assert(audit.retryPixels?.corners.every((alpha) => alpha <= 16) && audit.retryPixels.opaqueRatio > 0.1, `${label}: generated retry button transparency contract failed`, audit);
  return audit;
}

async function auditConfiguredMisconceptions(page, lesson, viewport, shots, remaining, problemIndex) {
  if (!remaining?.size) return [];
  const available = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.choices?.map((choice) => choice.misconceptionId).filter(Boolean) || []");
  const targets = [...remaining].filter((id) => available.includes(id));
  for (const id of targets) {
    await clickMisconception(page, id);
    await waitUntil(page, `document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0 && window.__mathmonEngineQa.getState().inputLocked === false`, `${viewport.name}: ${id} feedback did not appear`, 8000);
    const evidence = await evaluate(page, `(() => {
      const choice = window.__mathmonEngineQa.getCurrentStep()?.choices?.find((item) => item.misconceptionId === "${id}");
      const selected = [...document.querySelectorAll('button.choice-button')]
        .find((button) => button.dataset.choice === String(choice?.id ?? choice?.value ?? ''));
      const visual = document.querySelector('#visualArea [data-state="wrong"], #visualArea .is-wrong');
      const selectedVisual = selected?.querySelector('.circle-choice-svg .relation-geometry');
      const selectedVisualRect = selectedVisual?.getBoundingClientRect();
      const candidateLine = selected?.querySelector('.relation-candidate');
      const centerDistance = candidateLine ? (() => {
        const x1 = Number(candidateLine.getAttribute('x1'));
        const y1 = Number(candidateLine.getAttribute('y1'));
        const x2 = Number(candidateLine.getAttribute('x2'));
        const y2 = Number(candidateLine.getAttribute('y2'));
        const dx = x2 - x1;
        const dy = y2 - y1;
        const lengthSquared = dx * dx + dy * dy;
        if (!lengthSquared) return null;
        const raw = ((120 - x1) * dx + (90 - y1) * dy) / lengthSquared;
        const t = Math.max(0, Math.min(1, raw));
        const px = x1 + t * dx;
        const py = y1 + t * dy;
        return Math.hypot(120 - px, 90 - py);
      })() : null;
      return {
        selectedState:selected?.dataset.state || '',
        selectedVisualVisible:Boolean(selectedVisualRect?.width > 1 && selectedVisualRect?.height > 1),
        diagnosticCount:selected?.querySelectorAll('.relation-diagnostic > *').length || 0,
        centerDistance,
        visualState:visual?.getAttribute('data-state') || visual?.className?.baseVal || visual?.className || '',
        feedback:document.getElementById('feedbackLine')?.textContent.trim() || ''
      };
    })()`);
    const hasSelectedChoiceEvidence = evidence.selectedVisualVisible && evidence.diagnosticCount > 0;
    assert(
      evidence.selectedState === "wrong" && (hasSelectedChoiceEvidence || evidence.visualState),
      `${viewport.name}: ${id} did not show the selected wrong relation in the work area`,
      evidence
    );
    if (lesson === "3-2-3-1-mathmon-target-hit") {
      assert(hasSelectedChoiceEvidence, `${viewport.name}: ${id} did not annotate the selected target slot`, evidence);
      if (id === "CIRCLE_DIAMETER_MISSES_CENTER") {
        assert(evidence.centerDistance > 12, `${viewport.name}: off-center chord is too close to the center marker`, evidence);
      }
    }
    const slug = id.toLowerCase().replace(/_/g, "-");
    shots.push(await screenshot(page, lesson, viewport, `05m-p${problemIndex}-${slug}`));
    await auditGeometry(page, `${viewport.name} misconception ${id}`);
    remaining.delete(id);
  }
  return targets;
}

async function auditElevatorTutorialSolveRaster(page, label) {
  const audit = await evaluate(page, `(() => {
    const card = document.querySelector('#screen-tutorial .tutorial-card');
    const image = card?.querySelector('.tutorial-poster-art');
    const directTitle = [...(card?.children || [])].find((node) => node.tagName === 'STRONG');
    const directBody = [...(card?.children || [])].find((node) => node.tagName === 'P');
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
      instructionalMarkupCount:card?.querySelectorAll('.tutorial-math-guide, .tutorial-division-board, .tutorial-step-chip, svg').length ?? null,
    };
  })()`);
  assert(audit.source.endsWith('tutorial-page-1-v7-generated.webp'), `${label}: wrong generated tutorial image`, audit);
  assert(audit.complete && audit.naturalWidth === 1280 && audit.naturalHeight === 800, `${label}: tutorial image size/load contract changed`, audit);
  assert(audit.objectFit === 'cover', `${label}: tutorial image must fill the 16:10 card`, audit);
  assert(audit.title === '십의 자리 값부터 나눠요', `${label}: accessible tutorial title regressed`, audit);
  assert(audit.body.includes('70을 2로 먼저 나눠요') && audit.body.includes('70 = 2 × 30 + 10') && audit.body.includes('30씩 나누고 10이 남아요') && audit.body.includes('답은 38'), `${label}: operation-first tutorial flow regressed`, audit);
  assert(audit.instructionalMarkupCount === 0, `${label}: CSS/SVG tutorial explanation duplicates the generated poster`, audit);
  assert(audit.titleRect?.width <= 1 && audit.titleRect?.height <= 1 && audit.bodyRect?.width <= 1 && audit.bodyRect?.height <= 1, `${label}: accessible HTML copy is visible over the generated poster`, audit);
  for (const edge of ['left', 'top', 'right', 'bottom', 'width', 'height']) {
    assert(Math.abs(audit.card[edge] - audit.image[edge]) <= 1, `${label}: poster and tutorial card ${edge} differ by more than 1px`, audit);
  }
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
  assert(audit.source.endsWith('tutorial-page-2-v4-generated.webp'), `${label}: wrong generated tutorial image`, audit);
  assert(audit.complete && audit.naturalWidth === 1280 && audit.naturalHeight === 800, `${label}: tutorial image size/load contract changed`, audit);
  assert(audit.objectFit === 'cover', `${label}: tutorial image must fill the 16:10 card`, audit);
  assert(audit.title === '나눗셈을 풀고 문을 열어요', `${label}: accessible tutorial title regressed`, audit);
  assert(audit.body === '나눗셈을 풀어요. 문을 열어 점수를 봐요. +는 점수가 늘고, −는 점수가 줄어요. 10문제 뒤 도착한 층을 확인해요.', `${label}: accessible tutorial flow copy regressed`, audit);
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
        leftClearance:stage ? imageRect.left - stage.left : null,
        visibleLeftClearance:stage && maxX >= minX
          ? imageRect.left - stage.left + (minX / image.naturalWidth) * imageRect.width
          : null,
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
  assert(audit.layout.leftClearance >= 24, `${label}: eagle reaction sits too close to the Stage edge`, audit);
  assert(audit.layout.visibleLeftClearance >= 28, `${label}: eagle left wing lacks visible Stage-edge breathing room`, audit);
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
    const auditMode = ${JSON.stringify(mode)};
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
    const divisor = readBox('.board-divisor');
    const bracket = svg?.querySelector('[data-board-bracket="true"]');
    const stemX = Number(bracket?.dataset.stemX || 0);
    const stemPoint = bracket?.ownerSVGElement?.createSVGPoint();
    if (stemPoint) { stemPoint.x = stemX; stemPoint.y = 150; }
    const stemScreen = stemPoint && bracket?.getScreenCTM() ? stemPoint.matrixTransform(bracket.getScreenCTM()) : null;
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
    const completeStaticNumbers = auditMode === 'complete'
      ? [...(svg?.querySelectorAll('.division-board--complete .board-number:not(.is-student-decision), .division-board--complete .board-work-product, .division-board--complete .board-final-down-digit, .division-board--complete .board-final-subtrahend, .division-board--complete .board-final-zero') || [])]
      : [];
    const completeStaticFontSizes = completeStaticNumbers.map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    const completeDecisionFontSize = auditMode === 'complete'
      ? Number.parseFloat(getComputedStyle(svg?.querySelector('.division-board--complete .is-student-decision')).fontSize)
      : null;
    const completedText = [...(svg?.querySelectorAll('.division-board--complete text') || [])].map((node) => {
      const box = node.getBoundingClientRect();
      return { text:node.textContent.trim(), x:box.x, y:box.y, width:box.width, height:box.height, right:box.right, bottom:box.bottom };
    });
    const problemSurface = readBox('.math-problem-surface');
    const workSurface = readBox('.math-work-surface');
    const textOutsideSurface = completedText.filter((item) => {
      const surface = item.text.includes('÷') ? problemSurface : workSurface;
      return !surface || item.x < surface.x - 1 || item.y < surface.y - 1 || item.right > surface.right + 1 || item.bottom > surface.bottom + 1;
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
      selectors, arrow, brought, line, zero, divisor, divisorStemGap:divisor && stemScreen ? stemScreen.x - divisor.right : null,
      firstLine, downDigits, subtrahends, surface:workSurface, problemSurface, workSurface, textOutsideSurface,
      strokeWidth, firstStrokeWidth, scale, choiceBoxCount, textOverlaps,
      completeStaticFontSizes,
      completeStaticFontSpread:completeStaticFontSizes.length ? Math.max(...completeStaticFontSizes) - Math.min(...completeStaticFontSizes) : null,
      completeDecisionFontSize,
      completeDecisionRatio:completeStaticFontSizes.length && completeDecisionFontSize ? completeDecisionFontSize / completeStaticFontSizes[0] : null,
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
    assert(audit.divisor && audit.divisorStemGap >= 8 && audit.divisorStemGap <= 45, `${label}: completed divisor is not visually grouped with the division bracket`, audit);
    assert(audit.choiceBoxCount === 0, `${label}: completed board still shows choice boxes`, audit);
    assert(audit.downDigits.length === 2 && audit.subtrahends.length === 2, `${label}: completed long division digits are missing`, audit);
    assert(audit.firstLineGapPx >= 4, `${label}: first subtraction line overlaps the brought-down number`, audit);
    assert(audit.middleGapPx >= 4, `${label}: brought-down number overlaps the second subtraction`, audit);
    assert(audit.textOverlaps.length === 0, `${label}: completed long division text overlaps`, audit);
    assert(audit.textOutsideSurface.length === 0, `${label}: completed long division text left the calculation surface`, audit);
    assert(audit.completeStaticFontSizes.length >= 10 && audit.completeStaticFontSpread <= 0.1, `${label}: completed long-division numbers do not share one base size`, audit);
    assert(audit.completeDecisionRatio >= 1.05 && audit.completeDecisionRatio <= 1.09, `${label}: the orange student-decision number is not subtly larger`, audit);
  }
  return audit;
}

async function auditElevatorCompleteSplitLayout(page, label) {
  const audit = await evaluate(page, `(() => {
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2 };
    };
    const contains = (outer, inner, tolerance = 1) => Boolean(outer && inner
      && inner.left >= outer.left - tolerance && inner.top >= outer.top - tolerance
      && inner.right <= outer.right + tolerance && inner.bottom <= outer.bottom + tolerance);
    const stage = rectOf(document.querySelector('.stage-shell'));
    const grid = rectOf(document.querySelector('.problem-grid.is-complete'));
    const problem = rectOf(document.querySelector('.problem-grid.is-complete .problem-card'));
    const visual = rectOf(document.querySelector('.problem-grid.is-complete .visual-area'));
    const surface = rectOf(document.querySelector('.problem-grid.is-complete .math-board-surface'));
    const problemSurface = rectOf(document.querySelector('.problem-grid.is-complete .math-problem-surface'));
    const workSurface = rectOf(document.querySelector('.problem-grid.is-complete .math-work-surface'));
    const problemHeading = rectOf(document.querySelector('.problem-grid.is-complete .board-problem'));
    const panel = rectOf(document.querySelector('.problem-grid.is-complete .complete-panel.is-visible'));
    const expression = rectOf(document.querySelector('.problem-grid.is-complete .complete-text'));
    const button = rectOf(document.querySelector('.problem-grid.is-complete #rewardButton'));
    const quotientDigits = [...document.querySelectorAll('.problem-grid.is-complete .board-final-quotient')].map(rectOf);
    const workDigits = [
      ...document.querySelectorAll('.problem-grid.is-complete .board-work-product, .problem-grid.is-complete .board-final-down-digit, .problem-grid.is-complete .board-final-subtrahend, .problem-grid.is-complete .board-final-zero')
    ].map(rectOf);
    return {
      stage, grid, problem, visual, surface, problemSurface, workSurface, problemHeading, panel, expression, button, quotientDigits, workDigits,
      columnGap:problem && panel ? panel.left - problem.right : null,
      problemWidthRatio:stage && problem ? problem.width / stage.width : null,
      widthDominance:problem && panel ? problem.width / panel.width : null,
      panelHeightRatio:problem && panel ? panel.height / problem.height : null,
      panelCenterDelta:problem && panel ? Math.abs(problem.cy - panel.cy) : null,
      surfaceInsideVisual:contains(visual, surface, 1),
      surfaceGap:problemSurface && workSurface ? workSurface.top - problemSurface.bottom : null,
      surfaceOverlap:problemSurface && workSurface
        ? Math.max(0, Math.min(problemSurface.right, workSurface.right) - Math.max(problemSurface.left, workSurface.left))
          * Math.max(0, Math.min(problemSurface.bottom, workSurface.bottom) - Math.max(problemSurface.top, workSurface.top))
        : null,
      headingInsideProblemSurface:contains(problemSurface, problemHeading, 1),
      headingCenterDelta:problemSurface && problemHeading ? Math.abs(problemSurface.cx - problemHeading.cx) : null,
      contentInsidePanel:contains(panel, expression, 1) && contains(panel, button, 1),
      contentGap:expression && button ? button.top - expression.bottom : null,
      minQuotientHeight:quotientDigits.length ? Math.min(...quotientDigits.map((item) => item.height)) : 0,
      minWorkHeight:workDigits.length ? Math.min(...workDigits.map((item) => item.height)) : 0,
    };
  })()`);
  assert(audit.stage && audit.grid && audit.problem && audit.visual && audit.surface && audit.problemSurface && audit.workSurface && audit.problemHeading && audit.panel && audit.expression && audit.button, `${label}: horizontal completion layout is incomplete`, audit);
  assert(audit.columnGap >= 11.5, `${label}: calculation board overlaps the reward action card`, audit);
  assert(audit.problemWidthRatio >= 0.5 && audit.widthDominance >= 1.7, `${label}: reward action card still outranks the calculation board`, audit);
  assert(audit.panelHeightRatio <= 0.72 && audit.panelCenterDelta <= 1, `${label}: reward action card is not a compact centered card`, audit);
  assert(audit.surfaceInsideVisual && audit.contentInsidePanel, `${label}: calculation or action content left its reserved column`, audit);
  assert(audit.surfaceGap >= 8 && audit.surfaceOverlap === 0 && audit.headingInsideProblemSurface && audit.headingCenterDelta <= 1, `${label}: completed problem heading and long division are not clearly separated`, audit);
  assert(audit.contentGap >= 10, `${label}: completed expression overlaps the door button`, audit);
  assert(audit.minQuotientHeight >= 42 && audit.minWorkHeight >= 25, `${label}: completed calculation digits are too small`, audit);
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
    const surface = rectOf(document.querySelector('.lock-board-surface'));
    const step = rectOf(document.querySelector('.step-board'));
    const choices = rectOf(document.querySelector('.choices-panel'));
    const reward = rectOf(document.querySelector('.vault-world-panel'));
    const rewardPanel = reward;
    const rewardHeading = rectOf(document.querySelector('.vault-world-current'));
    const rewardMeter = rectOf(document.querySelector('.vault-world-power'));
    const rewardNext = rectOf(document.querySelector('.vault-world-next'));
    const rewardArt = document.getElementById('vaultWorldImage');
    const rewardCurrentName = document.getElementById('vaultCurrentName')?.textContent.trim() || '';
    const rewardNextName = document.getElementById('vaultNextName')?.textContent.trim() || '';
    const rewardPowerText = document.getElementById('vaultPowerValue')?.textContent.trim() || '';
    const rewardState = window.__mathmonEngineQa?.getState?.() || {};
    const expectedReward = Lesson2CheckLockModel.getResult(
      Number(rewardState.power || 0),
      Number(rewardState.correctFirstTry || 0),
      Boolean(rewardState.specialSeen)
    );
    const rewardSections = [rewardHeading, rewardMeter, rewardNext].filter(Boolean);
    let rewardSectionOverlaps = 0;
    for (let i = 0; i < rewardSections.length; i += 1) for (let j = i + 1; j < rewardSections.length; j += 1) {
      const a = rewardSections[i], b = rewardSections[j];
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 1 && overlapY > 1) rewardSectionOverlaps += 1;
    }
    const relationRole = rectOf(document.querySelector('.lock-relation-role'));
    const methodExpression = rectOf(document.querySelector('.lock-method-expression'));
    const stepId = document.querySelector('.check-lock-svg')?.dataset.step || '';
    const answerState = document.querySelector('.check-lock-svg')?.dataset.answerState || '';
    const stepStyle = getComputedStyle(document.querySelector('.step-board'));
    const stepBackgroundImage = stepStyle.backgroundImage;
    const relationRects = [relationRole, methodExpression].filter((item) => item && item.width > 0 && item.height > 0);
    const relationGroup = relationRects.length ? {
      top:Math.min(...relationRects.map((item) => item.top)),
      bottom:Math.max(...relationRects.map((item) => item.bottom))
    } : null;
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
      .filter((item) => item.text && item.rect.width > 0 && item.rect.height > 0)
      .filter((item) => !contains(surface, item.rect, 2));
    return {
      stage, grid, problem, visual, svg, surface, step, choices, reward, rewardPanel, rewardHeading, rewardMeter, rewardNext, methodExpression, stepId, answerState, keypad,
      gridWidthRatio: stage && grid ? grid.width / stage.width : null,
      surfaceWidthRatio: stage && surface ? surface.width / stage.width : null,
      surfaceAreaRatio: stage && surface ? (surface.width * surface.height) / (stage.width * stage.height) : null,
      rewardWidthRatio: stage && reward ? reward.width / stage.width : null,
      rewardHeightRatio: stage && reward ? reward.height / stage.height : null,
      rewardGap: reward && grid ? grid.left - reward.right : null,
      rewardInsideStage: contains(stage, reward, 1),
      rewardPanelInside: contains(reward, rewardPanel, 1),
      rewardContentInside: rewardSections.every((section) => contains(rewardPanel, section, 1)),
      rewardSectionOverlaps,
      rewardArtReady: Boolean(rewardArt?.complete && rewardArt.naturalWidth === 600 && rewardArt.naturalHeight === 1312),
      rewardCurrentName,
      rewardNextName,
      rewardPowerMatches: rewardPowerText === String(Math.max(0, Math.min(Number(rewardState.power || 0), Number(LESSON_CONFIG.reward?.maxPower || 100)))),
      rewardTierMatches: document.querySelector('.vault-world-panel')?.dataset.resultTier === expectedReward?.id,
      multiplyActionCenterDelta: stepId === 'multiply' && relationGroup && surface
        ? Math.abs((relationGroup.top + relationGroup.bottom) / 2 - (surface.top + surface.bottom) / 2)
        : null,
      multiplyActionSignedDelta: stepId === 'multiply' && relationGroup && surface
        ? (relationGroup.top + relationGroup.bottom) / 2 - (surface.top + surface.bottom) / 2
        : null,
      svgRectCount: document.querySelectorAll('.check-lock-svg rect').length,
      instructionBorderWidth: Number.parseFloat(stepStyle.borderTopWidth) || 0,
      instructionBackground: stepStyle.backgroundColor,
      instructionBackgroundImage: stepBackgroundImage,
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
  assert(audit.reward && audit.rewardPanel && audit.rewardInsideStage && audit.rewardPanelInside && audit.rewardGap >= 8, `${label}: left reward panel is hidden or overlaps the learning workbench`, audit);
  assert(audit.rewardWidthRatio >= 0.18 && audit.rewardHeightRatio >= 0.55, `${label}: left reward panel collapsed back into a small numeric badge`, audit);
  assert(audit.rewardContentInside && audit.rewardSectionOverlaps === 0 && audit.rewardArtReady, `${label}: left reward panel content is clipped, overlapping, or missing its current vault art`, audit);
  assert(audit.rewardCurrentName && audit.rewardNextName && audit.rewardPowerMatches && audit.rewardTierMatches, `${label}: left reward panel no longer connects current vault, key power, and next vault`, audit);
  if (audit.stepId === "multiply") {
    assert(audit.multiplyActionCenterDelta <= 5, `${label}: multiplication relation is not centered in its work area`, audit);
  }
  assert(audit.svgRectCount === 1, `${label}: calculation board regained unnecessary nested boxes`, audit);
  assert(audit.instructionBorderWidth >= 1 && audit.instructionBackgroundImage !== "none", `${label}: the single instruction plate lost its visual boundary`, audit);
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
    const surface = rectOf(document.querySelector('.lock-board-surface'));
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
    const choiceRects = [...document.querySelectorAll('.elevator-floor-panel .elevator-choice')].map((node) => {
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    });
    const choiceShadows = [...document.querySelectorAll('.elevator-floor-panel .elevator-choice')].map((node) => getComputedStyle(node).boxShadow);
    const choiceGaps = choiceRects.slice(1).map((rect, index) => rect.top - choiceRects[index].bottom);
    return {
      stage,
      problem,
      step,
      choices,
      floor,
      choiceRects,
      choiceShadows,
      choiceGaps,
      minChoiceGap:choiceGaps.length ? Math.min(...choiceGaps) : null,
      problemControlGap: problem && step ? step.left - problem.right : null,
      stepChoicesGap: step && choices ? choices.top - step.bottom : null,
      problemStepOverlapArea: overlapArea(problem, step),
      problemChoicesOverlapArea: overlapArea(problem, choices),
      stepChoicesOverlapArea: overlapArea(step, choices),
      choicesStageBottomGap: stage && choices ? stage.bottom - choices.bottom : null,
      controlColumnDeltas: step && choices ? {
        left:Math.abs(step.left - choices.left),
        right:Math.abs(step.right - choices.right)
      } : null
    };
  })()`);
  assert(audit.stage && audit.problem && audit.step && audit.choices && audit.floor, `${label}: play stack surface is missing`, audit);
  assert(audit.problemStepOverlapArea === 0 && audit.problemChoicesOverlapArea === 0 && audit.problemControlGap >= 9.5, `${label}: calculation board overlaps the right control column`, audit);
  assert(audit.stepChoicesOverlapArea === 0 && audit.stepChoicesGap >= 7.5, `${label}: instruction overlaps choices`, audit);
  assert(audit.choiceRects.length === 4 && audit.minChoiceGap >= 9.5, `${label}: answer cards visually collide`, audit);
  assert(audit.choiceShadows.every((shadow) => shadow === 'none' || shadow.includes('inset')), `${label}: an answer-card shadow reaches the next card`, audit);
  assert(audit.choicesStageBottomGap >= 7.5, `${label}: choices leave the Stage`, audit);
  assert(audit.controlColumnDeltas.left <= 1 && audit.controlColumnDeltas.right <= 1, `${label}: instruction and choices do not share one stable control column`, audit);
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
    const surface = rectOf(document.querySelector('.math-work-surface'));
    const work = rectOf(document.querySelector('.division-work'));
    const step = rectOf(document.querySelector('.step-board'));
    const divisor = rectOf(document.querySelector('.board-divisor'));
    const bracket = document.querySelector('[data-board-bracket="true"]');
    const stemX = Number(bracket?.dataset.stemX || 0);
    const stemPoint = bracket?.ownerSVGElement?.createSVGPoint();
    if (stemPoint) { stemPoint.x = stemX; stemPoint.y = 150; }
    const stemScreen = stemPoint && bracket?.getScreenCTM() ? stemPoint.matrixTransform(bracket.getScreenCTM()) : null;
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
    const numericNodes = [...document.querySelectorAll('.division-board .board-number, .division-board .board-work-product, .division-board .board-work-digit, .division-board .board-combined-value')];
    const decisionNumericNodes = numericNodes.filter((node) => node.closest('.board-cell.is-active, .board-combined-target.is-active'));
    const neutralNumericNodes = numericNodes.filter((node) => !node.closest('.board-cell.is-active, .board-combined-target.is-active'));
    const decisionFontSizes = decisionNumericNodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    const neutralFontSizes = neutralNumericNodes.map((node) => Number.parseFloat(getComputedStyle(node).fontSize));
    const activeCellSizes = [...document.querySelectorAll('.board-cell.is-active rect')].map((node) => ({ width:Number(node.getAttribute('width')), height:Number(node.getAttribute('height')) }));
    const activeSlotSizes = [...document.querySelectorAll('.board-combined-target.is-active .board-down-slot')].map((node) => ({ width:Number(node.getAttribute('width')), height:Number(node.getAttribute('height')) }));
    const textOverlaps = [];
    for (let i = 0; i < texts.length; i += 1) for (let j = i + 1; j < texts.length; j += 1) {
      const a = texts[i].rect, b = texts[j].rect;
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX > 1 && overlapY > 1) textOverlaps.push([texts[i].text, texts[j].text, overlapX, overlapY]);
    }
    return {
      surface, work, step, divisor, divisorStemGap:divisor && stemScreen ? stemScreen.x - divisor.right : null,
      tensCell, onesCell, product, remainder, combinedSlots, combinedTarget, combinedLabelRect, combinedValues, combineSource: Boolean(combineSource), arrow, textOverlaps,
      decisionFontSizes, neutralFontSizes, activeCellSizes, activeSlotSizes,
      neutralFontSpread:neutralFontSizes.length ? Math.max(...neutralFontSizes) - Math.min(...neutralFontSizes) : null,
      decisionFontRatio:decisionFontSizes.length && neutralFontSizes.length ? Math.min(...decisionFontSizes) / neutralFontSizes[0] : null,
      surfaceGap: surface && step ? step.left - surface.right : null,
      workGap: work && step ? step.left - work.right : null,
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
  assert(audit.divisor && audit.divisorStemGap >= 8 && audit.divisorStemGap <= 45, `${label}: divisor is not visually grouped with the division bracket`, audit);
  assert(audit.surfaceGap >= 4, `${label}: calculation board overlaps the right control column`, audit);
  assert(audit.workGap >= 4, `${label}: calculation work overlaps the right control column`, audit);
  assert(audit.productColumnDelta <= 1, `${label}: partial product left its tens column`, audit);
  assert(audit.productTopGap >= 8, `${label}: partial product overlaps the dividend cell`, audit);
  assert(audit.remainderColumnDelta <= 1, `${label}: remainder left its tens column`, audit);
  assert(audit.textOverlaps.length === 0, `${label}: calculation text overlaps`, audit);
  assert(audit.neutralFontSizes.length >= 4 && audit.neutralFontSpread <= 0.1, `${label}: visible calculation numbers do not share one base size`, audit);
  assert(audit.decisionFontRatio >= 1.04 && audit.decisionFontRatio <= 1.09, `${label}: active decision number is not subtly larger than the calculation numbers`, audit);
  assert(audit.activeCellSizes.every((size) => size.width === 164 && size.height === 74), `${label}: active quotient box emphasis changed`, audit);
  if (expectDown) {
    assert(audit.combinedTarget, `${label}: combined-number target missing`, audit);
    assert(audit.combinedSlots.length === 2 && audit.combinedSlots[0].place === 'tens' && audit.combinedSlots[1].place === 'ones', `${label}: combined-number target is not split into two place-value cells`, audit);
    assert(Math.abs(audit.combinedSlots[0].rect.cx - audit.tensCell.cx) <= 1, `${label}: combined-number tens cell left its place-value center`, audit);
    assert(Math.abs(audit.combinedSlots[1].rect.cx - audit.onesCell.cx) <= 1, `${label}: combined-number ones cell left its place-value center`, audit);
    assert(audit.combinedSlots.every((item, index) => {
      const base = index === 0 ? audit.tensCell : audit.onesCell;
      const ratio = item.rect.width / base.width;
      return audit.activeSlotSizes.length ? ratio >= 1.03 && ratio <= 1.05 : Math.abs(ratio - 1) <= 0.01;
    }), `${label}: combined-number cell emphasis does not match its active state`, audit);
    assert(audit.combinedSlots.every((item) => item.rect.width >= 80 && item.rect.height >= 48), `${label}: combined-number place-value cell is too small`, audit);
    assert(!audit.combinedLabelRect && audit.combinedValues.length >= 1 && audit.combinedValues.every((item) => item.rect.height >= 30), `${label}: combined-number target has an unnecessary label or a small value`, audit);
    assert(audit.combinedValueColumnDeltas.every((delta) => delta <= 1) && audit.combinedValueVerticalDeltas.every((delta) => delta <= 3), `${label}: combined-number digits left their place-value columns`, audit);
    if (audit.activeSlotSizes.length) {
      assert(audit.activeSlotSizes.length === 2 && audit.activeSlotSizes.every((size) => size.width === 164 && size.height === 94), `${label}: active bring-down boxes are not subtly enlarged`, audit);
    }
    assert(audit.surface.bottom - audit.combinedTarget.bottom >= 7, `${label}: calculation board has no breathing room below the combined-number target`, audit);
    assert(!audit.combineSource, `${label}: redundant combined-number explanation is still visible`, audit);
    assert(audit.arrow === 'M631 194 V226', `${label}: bring-down arrow is not vertical`, audit);
  }
}

async function auditElevatorInstructionWrap(page, label) {
  const audit = await evaluate(page, `(() => {
    const board = document.querySelector('.step-board');
    const copy = document.querySelector('.step-board .instruction:not([hidden])');
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height };
    };
    const boardRect = rectOf(board);
    const copyRect = rectOf(copy);
    const style = copy ? getComputedStyle(copy) : null;
    const lineHeight = Number.parseFloat(style?.lineHeight || '0');
    return {
      text:copy?.textContent.trim() || '',
      board:boardRect,
      copy:copyRect,
      lineHeight,
      lineCount:copyRect && lineHeight ? copyRect.height / lineHeight : null,
      wordBreak:style?.wordBreak || '',
      overflowWrap:style?.overflowWrap || '',
      inside:Boolean(boardRect && copyRect && copyRect.left >= boardRect.left && copyRect.right <= boardRect.right && copyRect.top >= boardRect.top && copyRect.bottom <= boardRect.bottom)
    };
  })()`);
  assert(/^\d+ ÷ \d+의 몫과 남은 수를 골라요\.$/.test(audit.text), `${label}: first-step instruction does not say the calculation directly`, audit);
  assert(audit.wordBreak === 'keep-all' && audit.overflowWrap === 'normal', `${label}: Korean instruction can split inside a word`, audit);
  assert(audit.inside && audit.lineCount >= 1 && audit.lineCount <= 2.1, `${label}: first-step instruction is not a balanced one- or two-line label`, audit);
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
    const values = choices.map((node) => node.querySelector('strong')?.textContent.trim() || '');
    const units = choices.map((node) => node.querySelector('span')?.textContent.trim() || '');
    const looseStars = [...document.querySelectorAll('.star-loose-grid .star-glyph[data-tone="loose"]')];
    const starCenters = looseStars.map((node) => {
      const transform = node.getAttribute('transform') || '';
      if (!transform.startsWith('translate(') || !transform.endsWith(')')) return null;
      const [x, y] = transform.slice(10, -1).split(' ').map(Number);
      return Number.isFinite(x) && Number.isFinite(y) ? { x, y } : null;
    }).filter(Boolean);
    const starFontSizes = looseStars.map((node) => parseFloat(getComputedStyle(node.querySelector('text')).fontSize));
    const stage = document.querySelector('.stage-shell')?.getBoundingClientRect();
    const world = document.getElementById('starWorldPanel')?.getBoundingClientRect();
    const board = document.getElementById('visualArea')?.getBoundingClientRect();
    return {
      dividend: window.__mathmonEngineQa.getCurrentProblem()?.dividend,
      looseStars: looseStars.length,
      instruction: document.getElementById('stepInstruction')?.textContent.trim() || '',
      choiceCount: choices.length,
      choiceHeights: choiceRects.map((rect) => rect.height),
      productFont: choices.length ? Math.min(...choices.map((node) => parseFloat(getComputedStyle(node.querySelector('strong')).fontSize))) : 0,
      groupFont: choices.length ? Math.min(...choices.map((node) => parseFloat(getComputedStyle(node.querySelector('span')).fontSize))) : 0,
      values,
      units,
      starColumns: Number(document.querySelector('.star-loose-grid')?.dataset.columns || 0),
      starCenters,
      minStarFont: starFontSizes.length ? Math.min(...starFontSizes) : 0,
      worldBoardGap: world && board ? board.left - world.right : -1,
      stageVisible: Boolean(stage?.width && stage?.height)
    };
  })()`);
  assert(audit.stageVisible, `${label}: stage is missing`, audit);
  assert(audit.dividend === expectedDividend && audit.looseStars === expectedDividend, `${label}: loose star count does not match the dividend`, audit);
  assert(new RegExp(`^별 ${expectedDividend}개를 \\d+개씩 묶으면 몇 묶음까지 만들 수 있을까요\\?$`).test(audit.instruction), `${label}: concrete maximum-bundle instruction is missing`, audit);
  assert(audit.choiceCount === 3, `${label}: quotient choices must stay in one three-card row`, audit);
  assert(audit.choiceHeights.every((height) => height >= 108 && height <= 116), `${label}: quotient card height is not fixed at 112px`, audit);
  assert(audit.productFont >= 38 && audit.groupFont >= 20, `${label}: bundle-count choice hierarchy is too small`, audit);
  assert(audit.values.every((text) => /^\d+$/.test(text)), `${label}: choices must not reveal multiplication results`, audit);
  assert(audit.units.every((text) => text === '묶음'), `${label}: bundle unit is missing from a choice`, audit);
  assert(audit.minStarFont >= 20, `${label}: loose stars are too small to count`, audit);
  assert(audit.starColumns >= 10 && audit.starColumns <= 11, `${label}: loose-star column contract drifted`, audit);
  const rowYs = [...new Set(audit.starCenters.map((point) => point.y))].sort((a, b) => a - b);
  const columnXs = [...new Set(audit.starCenters.map((point) => point.x))].sort((a, b) => a - b);
  assert(rowYs.length >= 2 && rowYs.every((y) => y >= 54 && y <= 314), `${label}: loose-star rows are not centered inside the board`, audit);
  assert(columnXs.every((x) => x >= 190 && x <= 830), `${label}: loose-star columns collide with the count chip or board edge`, audit);
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

async function auditStarPickupAlignment(page, label, mode, { expectValue = true } = {}) {
  const boardSelector = mode === "remainder" ? ".star-remainder-board" : ".star-group-board";
  const audit = await evaluate(page, `(() => {
    const board = document.querySelector(${JSON.stringify(boardSelector)});
    if (!board) return null;
    const capsuleRows = new Map();
    const capsuleSizes = [];
    for (const rect of board.querySelectorAll('.star-capsule > rect')) {
      const y = Number(rect.getAttribute('y'));
      capsuleSizes.push({
        width: Number(rect.getAttribute('width')),
        height: Number(rect.getAttribute('height'))
      });
      const row = capsuleRows.get(y) || [];
      row.push({
        left: Number(rect.getAttribute('x')),
        right: Number(rect.getAttribute('x')) + Number(rect.getAttribute('width'))
      });
      capsuleRows.set(y, row);
    }
    const rowCenters = [...capsuleRows.values()].map((row) => (
      Math.min(...row.map((item) => item.left)) + Math.max(...row.map((item) => item.right))
    ) / 2);
    const title = board.querySelector('.star-side-title');
    const value = board.querySelector('.star-side-value');
    const summary = board.querySelector('.star-group-summary');
    const capsuleRects = [...board.querySelectorAll('.star-capsule > rect')].map((node) => node.getBoundingClientRect());
    const summaryRect = summary?.getBoundingClientRect();
    const sideStars = [...board.querySelectorAll('.star-remainder-focus > .star-glyph')];
    const starRows = new Map();
    for (const star of sideStars) {
      const transform = star.transform.baseVal.getItem(0)?.matrix;
      if (!transform) continue;
      const y = Number(transform.f.toFixed(3));
      const row = starRows.get(y) || [];
      row.push(transform.e);
      starRows.set(y, row);
    }
    return {
      rowCenters,
      capsuleSizes,
      capsuleColumns: Number(board.querySelector('.star-capsule-grid')?.dataset.columns || 0),
      titleCenter: title ? title.getBBox().x + title.getBBox().width / 2 : null,
      valueCenter: value ? value.getBBox().x + value.getBBox().width / 2 : null,
      summaryFontSize: summary ? parseFloat(getComputedStyle(summary).fontSize) : 0,
      equationCapsuleGap: summaryRect && capsuleRects.length
        ? Math.min(...capsuleRects.map((rect) => rect.top)) - summaryRect.bottom
        : null,
      sideStarCount: sideStars.length,
      starRowCenters: [...starRows.values()].map((row) => (Math.min(...row) + Math.max(...row)) / 2)
    };
  })()`);
  assert(audit, `${label}: star board is missing`);
  const expectedLeftCenter = mode === "remainder" ? 300 : 350;
  const expectedSideCenter = mode === "remainder" ? 729 : 771;
  assert(audit.rowCenters.length > 0 && audit.rowCenters.every((center) => Math.abs(center - expectedLeftCenter) <= 0.01), `${label}: capsule rows are not centered under the equation`, audit);
  assert(Math.abs(audit.titleCenter - expectedSideCenter) <= 0.5, `${label}: side title is not centered`, audit);
  if (expectValue) {
    assert(Math.abs(audit.valueCenter - expectedSideCenter) <= 0.5, `${label}: revealed side value is not centered`, audit);
  } else {
    assert(audit.valueCenter === null, `${label}: remainder count is exposed before the student answers`, audit);
    assert(audit.sideStarCount === 0, `${label}: remainder stars expose the answer before the student chooses`, audit);
  }
  if (mode === "remainder") {
    assert(audit.summaryFontSize >= 34, `${label}: completed multiplication is too small`, audit);
    assert(audit.equationCapsuleGap >= 8, `${label}: completed multiplication overlaps the grouped stars`, audit);
    assert(audit.capsuleColumns === 4 && audit.capsuleSizes.every((size) => size.width >= 126 && size.height >= 58), `${label}: 12 groups did not switch to the roomy 4-column layout`, audit);
    if (expectValue) {
      assert(audit.starRowCenters.length > 0 && audit.starRowCenters.every((center) => Math.abs(center - 729) <= 0.01), `${label}: remainder-star rows are not centered under the value`, audit);
    } else {
      assert(audit.starRowCenters.length === 0, `${label}: remainder stars should stay hidden before the student chooses`, audit);
    }
  }
}

async function auditStarPickupResultTier(page, label, expectedTier) {
  const audit = await evaluate(page, `(() => {
    const rounded = (value) => Math.round(value * 100) / 100;
    const rectOf = (node) => {
      if (!node) return null;
      const rect = node.getBoundingClientRect();
      return {
        left:rounded(rect.left),
        top:rounded(rect.top),
        right:rounded(rect.right),
        bottom:rounded(rect.bottom),
        width:rounded(rect.width),
        height:rounded(rect.height),
        centerX:rounded(rect.left + rect.width / 2),
        centerY:rounded(rect.top + rect.height / 2)
      };
    };
    const stage = document.querySelector('.stage-shell');
    const screen = document.getElementById('screen-result');
    const background = document.getElementById('resultBg');
    const title = document.getElementById('resultTitleArt');
    const track = document.querySelector('.result-dynamic-ui rect:first-of-type');
    const measure = document.getElementById('resultMeasureSvg');
    const correct = document.getElementById('resultCorrectArt');
    const retry = document.getElementById('restartButton');
    const retryArt = retry?.querySelector('.result-retry-art');
    const next = document.getElementById('resultNextSvg');
    const stageRect = rectOf(stage);
    const titleRect = rectOf(title);
    const trackRect = rectOf(track);
    const measureRect = rectOf(measure);
    const correctRect = rectOf(correct);
    const retryRect = rectOf(retry);
    const retryArtRect = rectOf(retryArt);
    const nextRect = rectOf(next);
    const centers = [titleRect, nextRect, trackRect, measureRect, correctRect, retryRect]
      .filter(Boolean)
      .map((rect) => rect.centerX);
    const resultIndex = LESSON_CONFIG.results.findIndex((result) => result.id === screen?.dataset.resultTier);
    const followingResult = resultIndex >= 0 ? LESSON_CONFIG.results[resultIndex + 1] : null;
    let retryPixels = null;
    if (retryArt?.complete && retryArt.naturalWidth > 0) {
      const canvas = document.createElement('canvas');
      canvas.width = retryArt.naturalWidth;
      canvas.height = retryArt.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently:true });
      context.drawImage(retryArt, 0, 0);
      const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
      const cornerAlpha = [
        pixels[3],
        pixels[(canvas.width - 1) * 4 + 3],
        pixels[((canvas.height - 1) * canvas.width) * 4 + 3],
        pixels[((canvas.height * canvas.width) - 1) * 4 + 3]
      ];
      let transparent = 0;
      for (let index = 3; index < pixels.length; index += 64) {
        if (pixels[index] < 8) transparent += 1;
      }
      retryPixels = {
        cornerAlpha,
        transparentRatio:rounded(transparent / Math.ceil(pixels.length / 64))
      };
    }
    return {
      tier: screen?.dataset.resultTier || '',
      heading: document.getElementById('resultTitle')?.textContent.trim() || '',
      stage: stageRect,
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
      },
      layout: {
        title:titleRect,
        next:nextRect,
        track:trackRect,
        measure:measureRect,
        correct:correctRect,
        retry:retryRect,
        retryArt:retryArtRect,
        axisSpread:centers.length ? rounded(Math.max(...centers) - Math.min(...centers)) : null,
        gaps: {
          titleToNext:titleRect && nextRect ? rounded(nextRect.top - titleRect.bottom) : null,
          nextToTrack:nextRect && trackRect ? rounded(trackRect.top - nextRect.bottom) : null,
          measureToCorrect:measureRect && correctRect ? rounded(correctRect.top - measureRect.bottom) : null,
          correctToRetry:correctRect && retryRect ? rounded(retryRect.top - correctRect.bottom) : null
        }
      },
      next: {
        text:next?.textContent.trim() || '',
        expectedText:followingResult ? '다음엔 ' + followingResult.name : '모든 별자리를 밝혔어요!',
        hidden:Boolean(next?.hidden),
        display:next ? getComputedStyle(next).display : '',
        rect:nextRect
      },
      measureText:measure?.textContent.trim() || '',
      retry: {
        src:retryArt?.getAttribute('src') || '',
        complete:Boolean(retryArt?.complete),
        naturalWidth:retryArt?.naturalWidth || 0,
        naturalHeight:retryArt?.naturalHeight || 0,
        objectFit:retryArt ? getComputedStyle(retryArt).objectFit : '',
        pixels:retryPixels
      }
    };
  })()`);
  assert(audit.tier === expectedTier, `${label}: wrong result tier`, audit);
  assert(audit.background.complete && audit.background.naturalWidth === 1280 && audit.background.naturalHeight === 800, `${label}: generated result scene is missing or has the wrong canvas`, audit);
  assert(/^result-unicorn-.+-generated\.webp$/.test(audit.background.src), `${label}: result scene is not connected`, audit);
  assert(audit.title.complete && audit.title.naturalWidth > 0 && audit.title.naturalHeight > 0, `${label}: generated result title is missing`, audit);
  assert(/^result-title-.+-generated\.webp$/.test(audit.title.src), `${label}: result title is not connected`, audit);
  assert(audit.layout.axisSpread !== null && audit.layout.axisSpread <= audit.stage.width * 0.015, `${label}: title, star light, correct count, and retry button are not on one result axis`, audit);
  const resultGapScale = audit.stage.width / 1280;
  assert(audit.layout.gaps.titleToNext >= 8 * resultGapScale
    && audit.layout.gaps.nextToTrack >= 8 * resultGapScale
    && audit.layout.gaps.measureToCorrect >= 4 * resultGapScale
    && audit.layout.gaps.correctToRetry >= 8 * resultGapScale,
  `${label}: final reward elements overlap or have no readable vertical gap`, audit);
  assert([audit.layout.title, audit.layout.next, audit.layout.track, audit.layout.measure, audit.layout.correct, audit.layout.retry].every((rect) => (
    rect && rect.left >= audit.stage.left - 1 && rect.top >= audit.stage.top - 1
      && rect.right <= audit.stage.right + 1 && rect.bottom <= audit.stage.bottom + 1
  )), `${label}: a final reward element escapes the Stage`, audit);
  assert(!audit.next.hidden && audit.next.display !== "none" && audit.next.rect?.width > 0 && audit.next.rect?.height > 0, `${label}: next constellation goal is not visible`, audit);
  assert(audit.next.text === audit.next.expectedText, `${label}: next constellation goal is incorrect`, audit);
  assert(/^모은 별빛 \d+$/.test(audit.measureText), `${label}: accumulated star-light score is unclear`, audit);
  assert(audit.retry.complete && audit.retry.naturalWidth > 0 && audit.retry.naturalHeight > 0 && audit.retry.src === "result-retry-button-v2-generated.webp", `${label}: transparent generated retry button is not connected`, audit);
  assert(audit.retry.objectFit === "contain", `${label}: retry art must preserve its generated aspect ratio`, audit);
  assert(Math.abs(audit.layout.retry.left - audit.layout.retryArt.left) <= 1
    && Math.abs(audit.layout.retry.top - audit.layout.retryArt.top) <= 1
    && Math.abs(audit.layout.retry.right - audit.layout.retryArt.right) <= 1
    && Math.abs(audit.layout.retry.bottom - audit.layout.retryArt.bottom) <= 1,
  `${label}: retry hitbox and generated art do not share the same rect`, audit);
  assert(audit.retry.pixels?.cornerAlpha.every((alpha) => alpha === 0) && audit.retry.pixels.transparentRatio >= 0.25, `${label}: retry button still has an opaque rectangular canvas`, audit);
}

async function auditElevatorLearningLegibility(page, label) {
  const audit = await evaluate(page, `(() => {
    const stage = document.querySelector('.stage-shell');
    const stageRect = stage?.getBoundingClientRect();
    const surfaceRect = document.querySelector('.math-board-surface')?.getBoundingClientRect();
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
      bigProblem: physicalFont('.board-problem'),
      boardNumber: physicalFont('.board-number'),
      instruction: physicalFont('.instruction'),
      choiceLabel: physicalFont('.elevator-choice-label'),
      choiceValue: physicalFont('.elevator-choice-value'),
      problemHeading: (() => {
        const heading = document.querySelector('.board-problem')?.getBoundingClientRect();
        const surface = document.querySelector('.math-problem-surface')?.getBoundingClientRect();
        return heading && surface ? {
          text:document.querySelector('.board-problem')?.textContent.trim() || '',
          centerDelta:Math.abs((heading.left + heading.width / 2) - (surface.left + surface.width / 2)),
          inside:heading.left >= surface.left - 1 && heading.top >= surface.top - 1 && heading.right <= surface.right + 1 && heading.bottom <= surface.bottom + 1,
          topGap:heading.top - surface.top
        } : null;
      })(),
      surfaceSeparation: (() => {
        const problemSurface = document.querySelector('.math-problem-surface')?.getBoundingClientRect();
        const workSurface = document.querySelector('.math-work-surface')?.getBoundingClientRect();
        return problemSurface && workSurface ? {
          gap:workSurface.top - problemSurface.bottom,
          overlapWidth:Math.max(0, Math.min(problemSurface.right, workSurface.right) - Math.max(problemSurface.left, workSurface.left)),
          overlapHeight:Math.max(0, Math.min(problemSurface.bottom, workSurface.bottom) - Math.max(problemSurface.top, workSurface.top)),
          aligned:Math.abs(problemSurface.left - workSurface.left) <= 1 && Math.abs(problemSurface.right - workSurface.right) <= 1
        } : null;
      })(),
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
  assert(audit.problemHeading?.inside && audit.problemHeading.centerDelta <= 1 && audit.problemHeading.topGap >= 6, `${label}: main problem is not centered inside the calculation board`, audit);
  assert(audit.surfaceSeparation?.gap >= 8 && audit.surfaceSeparation.overlapHeight === 0 && audit.surfaceSeparation.aligned, `${label}: problem heading and long-division work are not separated into stable boxes`, audit);
  assert(audit.boardNumber >= 32, `${label}: calculation board numbers are too small`, audit);
  assert(audit.instruction >= 14, `${label}: instruction text is too small`, audit);
  assert(audit.choiceLabel >= 12, `${label}: choice labels are too small`, audit);
  assert(audit.choiceValue >= 21, `${label}: choice values are too small`, audit);
  assert(audit.minChoiceHeight >= 42, `${label}: choice touch target is too short`, audit);
  assert(audit.labels.every((parts) => parts.join('|') === '몫|남은 수'), `${label}: choice meanings are unclear`, audit);
  assert(audit.values.every((parts) => parts.length === 2 && parts.every((value) => value % 10 === 0)), `${label}: first-step choices must show 20/10-style place values`, audit);
  assert(audit.priorityLayout?.primary?.stageWidthRatio >= 0.48, `${label}: current calculation board became too narrow beside the control column`, audit);
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

async function solveCurrentProblem(page, { wrongFirst = false, beforeStep = null, afterCorrectStep = null } = {}) {
  if (wrongFirst) {
    await clickChoice(page, false);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && document.getElementById('feedbackLine').textContent.trim().length > 0", "wrong feedback did not appear");
    await delay(500);
    await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", "input stayed locked after wrong answer");
  }
  while (!(await evaluate(page, "document.getElementById('completePanel').classList.contains('is-visible')"))) {
    if (beforeStep) await beforeStep();
    const beforeStepId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    if (afterCorrectStep) {
      await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' || document.getElementById('completePanel').classList.contains('is-visible')", "correct answer did not enter the calculation board", 6000);
      await afterCorrectStep(beforeStepId);
    }
    const ready = `document.getElementById('completePanel').classList.contains('is-visible') || Boolean(document.querySelector('.farm-confirm-next-button:not([hidden]):not(:disabled)')) || (window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStepId)})`;
    await waitUntil(page, ready, "correct response did not reach a confirmation", 6000);
    const manualAdvanceReady = await evaluate(page, "Boolean(document.querySelector('.farm-step-next-button:not([hidden]):not(:disabled)'))");
    if (manualAdvanceReady) {
      await clickSelector(page, ".farm-step-next-button:not([hidden]):not(:disabled)");
      await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStepId)} && window.__mathmonEngineQa.getState().inputLocked === false`, "manual confirmation did not advance", 6000);
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
    await waitUntil(
      page,
      `document.querySelector('.check-lock-svg')?.dataset.step === ${JSON.stringify(stepId)}
        && (document.querySelector('.big-problem')?.textContent.trim().length || 0) > 0`,
      `${viewport.name}: ${stepId} board did not finish rendering`,
      6000,
    );
    await delay(120);
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

async function auditStageRevealImages(page, label, phase) {
  await waitUntil(
    page,
    `(() => {
      const images = [...document.querySelectorAll('#screen-reward > .raster-bg, .farm-reward-story img, [data-reward-stage-story="true"] img')];
      return images.length > 0 && images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0);
    })()`,
    `${label}: ${phase} stage-reveal image is missing`,
    8000,
  );
  const audit = await evaluate(page, `(() => {
    const story = document.querySelector('.farm-reward-story, [data-reward-stage-story="true"]');
    const images = [...document.querySelectorAll('#screen-reward > .raster-bg, .farm-reward-story img, [data-reward-stage-story="true"] img')].map((image) => ({
      src:image.getAttribute('src') || '',
      complete:image.complete,
      naturalWidth:image.naturalWidth,
      naturalHeight:image.naturalHeight,
    }));
    return { phase:story?.dataset.phase || '', images };
  })()`);
  assert(audit.phase === phase, `${label}: wrong stage-reveal phase`, audit);
  assert(
    audit.images.length > 0 && audit.images.every((image) => image.complete && image.naturalWidth > 0 && image.naturalHeight > 0),
    `${label}: broken stage-reveal image`,
    audit,
  );
  if (phase === "revealed") {
    assert(
      audit.images.some((image) => /reward-(?:event-)?[^/]+-generated\.webp$/.test(image.src)),
      `${label}: revealed event art is not connected`,
      audit,
    );
  }
}

async function waitForReward(page, label) {
  const rewardMode = await evaluate(page, "document.querySelector('.game')?.dataset.rewardMode || ''");
  const modalReward = rewardMode === "modal-art";
  if (modalReward) {
    await waitUntil(page, "document.getElementById('rewardPop')?.hidden === false", `${label}: reward modal not shown`);
    const revealOnOpen = await evaluate(page, "LESSON_CONFIG.reward?.revealOnOpen === true");
    if (revealOnOpen) {
      const immediate = await evaluate(page, `(() => {
        const pop = document.getElementById('rewardPop');
        const card = pop?.querySelector('.reward-card');
        const label = document.getElementById('modalRewardLabel')?.textContent.trim() || '';
        const changeLabel = LESSON_CONFIG.reward?.changeLabel || LESSON_CONFIG.reward?.unitLabel || LESSON_CONFIG.progressLabel || '힘';
        const zeroLabel = LESSON_CONFIG.reward?.zeroLabel || '';
        return {
          visible: pop?.hidden === false,
          phase: card?.dataset.rewardPhase || '',
          label,
          hasScore: label.startsWith(changeLabel + ' ') && (
            /^[+-]?\\d+$/.test(label.slice(changeLabel.length + 1))
            || (zeroLabel && label === changeLabel + ' ' + zeroLabel)
          ),
          openHidden: document.getElementById('modalRewardOpenButton')?.hidden === true,
        };
      })()`);
      assert(
        immediate.visible && immediate.phase === "revealed" && immediate.hasScore && immediate.openHidden,
        `${label}: reward score was not visible immediately`,
        immediate,
      );
      await waitUntil(
        page,
        "window.__mathmonEngineQa.getState().rewardPhase === 'revealed' && !document.getElementById('modalRewardNextButton')?.hidden",
        `${label}: immediate reward did not settle`,
        8000,
      );
      return { modal: true, autoRevealed: true, nextSelector: "#modalRewardNextButton" };
    }
    await waitUntil(
      page,
      `(() => {
        const button = document.getElementById('modalRewardOpenButton');
        if (!button || button.hidden || button.disabled) return false;
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0;
      })()`,
      `${label}: reward open button did not become clickable`,
      8000,
    );
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
  const stageReveal = rewardMode === "stage-reveal";
  if (stageReveal) await auditStageRevealImages(page, `${label} closed reward`, "closed");
  return { modal: false, stageReveal, nextSelector: "#rewardNextButton" };
}

async function revealReward(page, reward, label) {
  if (reward.stageReveal) {
    const before = await evaluate(page, "window.__mathmonEngineQa.getState()");
    await evaluate(page, "(() => { const button = document.getElementById('rewardNextButton'); button.click(); button.click(); })()");
    await waitUntil(
      page,
      "window.__mathmonEngineQa.getState().rewardPhase === 'revealed' && document.querySelector('.farm-reward-story, [data-reward-stage-story=\"true\"]')?.dataset.phase === 'revealed'",
      `${label}: stage reward did not reveal`,
      8000,
    );
    const after = await evaluate(page, "window.__mathmonEngineQa.getState()");
    const expectedPower = before.pendingRewardSpecial
      ? 100
      : Math.max(0, Math.min(100, before.power + before.pendingRewardAmount));
    assert(after.power === expectedPower, `${label}: rapid reward clicks applied the event more than once`, { before, after, expectedPower });
    await auditStageRevealImages(page, `${label} revealed reward`, "revealed");
    return;
  }
  if (!reward.modal) return;
  if (reward.autoRevealed) return;
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

async function auditElevatorResultTier(page, label, expected) {
  const audit = await evaluate(page, `(() => {
    const background = document.getElementById('resultBg');
    const title = document.getElementById('resultTitleArt');
    const correct = document.getElementById('resultCorrectArt');
    const meter = document.querySelector('.result-dynamic-ui rect:first-of-type');
    const meterFill = document.getElementById('resultMeasureFillSvg');
    const meterText = document.getElementById('resultMeasureSvg');
    const retryArt = document.querySelector('.result-restart-hitbox .result-retry-art');
    const retryHitbox = document.querySelector('.result-restart-hitbox');
    const stage = document.querySelector('.stage-shell');
    const layout = LESSON_CONFIG.result?.stateImageSet?.layoutByTier?.[${JSON.stringify(expected.id)}] || null;
    const configuredImage = LESSON_CONFIG.results?.find((item) => item.id === ${JSON.stringify(expected.id)})?.image || '';
    const box = (element) => {
      if (!element) return null;
      const rect = element.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2 };
    };
    const stageBox = box(stage);
    const toSourceBox = (element) => {
      const rect = box(element);
      if (!rect || !stageBox) return null;
      const scaleX = 1280 / stageBox.width;
      const scaleY = 800 / stageBox.height;
      return {
        left:(rect.left - stageBox.left) * scaleX,
        top:(rect.top - stageBox.top) * scaleY,
        right:(rect.right - stageBox.left) * scaleX,
        bottom:(rect.bottom - stageBox.top) * scaleY,
        width:rect.width * scaleX,
        height:rect.height * scaleY,
        cx:(rect.cx - stageBox.left) * scaleX,
        cy:(rect.cy - stageBox.top) * scaleY,
      };
    };
    const findYellowButton = () => {
      if (!background?.complete || !background.naturalWidth || !layout?.retryHitbox) return null;
      const canvas = document.createElement('canvas');
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;
      const context = canvas.getContext('2d', { willReadFrequently:true });
      context.drawImage(background, 0, 0);
      const [x, y, width, height] = layout.retryHitbox;
      const left = Math.max(0, Math.floor(x - 18));
      const top = Math.max(0, Math.floor(y - 18));
      const right = Math.min(canvas.width, Math.ceil(x + width + 18));
      const bottom = Math.min(canvas.height, Math.ceil(y + height + 18));
      const pixels = context.getImageData(left, top, right - left, bottom - top);
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, count = 0;
      for (let row = 0; row < pixels.height; row += 1) {
        for (let column = 0; column < pixels.width; column += 1) {
          const offset = (row * pixels.width + column) * 4;
          const red = pixels.data[offset];
          const green = pixels.data[offset + 1];
          const blue = pixels.data[offset + 2];
          if (red > 210 && green > 115 && blue < 110 && red - green > 20) {
            minX = Math.min(minX, left + column);
            minY = Math.min(minY, top + row);
            maxX = Math.max(maxX, left + column + 1);
            maxY = Math.max(maxY, top + row + 1);
            count += 1;
          }
        }
      }
      return Number.isFinite(minX) ? { left:minX, top:minY, right:maxX, bottom:maxY, width:maxX - minX, height:maxY - minY, count } : null;
    };
    const correctBox = box(correct);
    const meterBox = box(meter);
    const meterTextBox = box(meterText);
    const retryBox = box(retryHitbox);
    return {
      tier: document.getElementById('screen-result')?.dataset.resultTier || '',
      heading: document.getElementById('resultTitle')?.textContent.trim() || '',
      background: background ? {
        src: background.getAttribute('src') || '',
        complete: background.complete,
        naturalWidth: background.naturalWidth,
        naturalHeight: background.naturalHeight,
      } : null,
      titleVisible: title ? getComputedStyle(title).display !== 'none' : false,
      correct: correct ? { complete:correct.complete, naturalWidth:correct.naturalWidth, naturalHeight:correct.naturalHeight, box:correctBox } : null,
      meterBox,
      meterTextBox,
      meterText:meterText?.textContent.trim() || '',
      meterFillVisible:meterFill ? getComputedStyle(meterFill).display !== 'none' : false,
      retryArtVisible:retryArt ? getComputedStyle(retryArt).display !== 'none' && box(retryArt)?.width > 0 : false,
      retryBox,
      retrySourceBox:toSourceBox(retryHitbox),
      yellowButton:findYellowButton(),
      layout,
      configuredImage,
      centerDeltaSource:correctBox && meterBox && stageBox ? Math.abs(correctBox.cx - meterBox.cx) * 1280 / stageBox.width : null,
      correctToPanelCenterSource:correctBox && stageBox && layout?.panelCenterX ? Math.abs((correctBox.cx - stageBox.left) * 1280 / stageBox.width - layout.panelCenterX) : null,
      meterToPanelCenterSource:meterBox && stageBox && layout?.panelCenterX ? Math.abs((meterBox.cx - stageBox.left) * 1280 / stageBox.width - layout.panelCenterX) : null,
      correctToMeterGapSource:correctBox && meterBox && stageBox ? (meterBox.top - correctBox.bottom) * 800 / stageBox.height : null,
      meterToRetryGapSource:meterBox && retryBox && stageBox ? (retryBox.top - meterBox.bottom) * 800 / stageBox.height : null,
      meterTextInside:Boolean(meterBox && meterTextBox
        && meterTextBox.left >= meterBox.left + 12
        && meterTextBox.right <= meterBox.right - 12
        && meterTextBox.top >= meterBox.top + 4
        && meterTextBox.bottom <= meterBox.bottom - 4),
    };
  })()`);
  assert(audit.tier === expected.id, `${label}: wrong elevator result tier`, audit);
  assert(audit.heading === expected.name, `${label}: wrong elevator result name`, audit);
  assert(audit.background?.complete && audit.background.naturalWidth === 1280 && audit.background.naturalHeight === 800, `${label}: generated elevator result scene is missing`, audit);
  assert(/-v\d+-generated\.webp$/.test(audit.configuredImage), `${label}: elevator result scene URL is not versioned`, audit);
  assert(audit.background.src === audit.configuredImage, `${label}: wrong or stale elevator result scene`, audit);
  assert(!audit.titleVisible, `${label}: old separate title art overlaps the generated scene title`, audit);
  assert(audit.correct?.complete && audit.correct.naturalWidth > 0 && audit.correct.naturalHeight > 0, `${label}: correct-count art is missing`, audit);
  assert(audit.layout?.panelCenterX && Array.isArray(audit.layout.retryHitbox), `${label}: result layout contract is missing`, audit);
  assert(audit.meterText === `점수 ${expected.power}`, `${label}: score result copy is wrong`, { expected, ...audit });
  assert(!audit.meterFillVisible, `${label}: the old dashboard-like power bar is still visible`, audit);
  assert(!audit.retryArtVisible, `${label}: a second retry image overlaps the retry button baked into the result scene`, audit);
  assert(audit.centerDeltaSource <= 2, `${label}: correct-count and power badge do not share the result-panel center`, audit);
  assert(audit.correctToPanelCenterSource <= 2, `${label}: correct-count art is not centered on the inner result panel`, audit);
  assert(audit.meterToPanelCenterSource <= 2, `${label}: score badge is not centered on the inner result panel`, audit);
  assert(audit.correctToMeterGapSource >= 18, `${label}: correct-count art overlaps the power badge`, audit);
  assert(audit.meterToRetryGapSource >= 16, `${label}: power badge overlaps the baked retry button`, audit);
  assert(audit.meterTextInside, `${label}: power text leaves its badge`, audit);
  const [expectedLeft, expectedTop, expectedWidth, expectedHeight] = audit.layout.retryHitbox;
  const expectedEdges = { left:expectedLeft, top:expectedTop, right:expectedLeft + expectedWidth, bottom:expectedTop + expectedHeight, width:expectedWidth, height:expectedHeight };
  for (const edge of ["left", "top", "right", "bottom", "width", "height"]) {
    assert(Math.abs(audit.retrySourceBox?.[edge] - expectedEdges[edge]) <= 1.5, `${label}: retry hitbox ${edge} differs from the tier contract`, audit);
  }
  assert(audit.yellowButton?.count > 5000, `${label}: baked retry button could not be found in the generated scene`, audit);
  const yellowButtonCenter = (audit.yellowButton.left + audit.yellowButton.right) / 2;
  assert(Math.abs(yellowButtonCenter - audit.layout.panelCenterX) <= 14, `${label}: baked retry button is not centered on the inner result panel`, { ...audit, yellowButtonCenter });
  const buttonGaps = {
    left:audit.yellowButton.left - audit.retrySourceBox.left,
    top:audit.yellowButton.top - audit.retrySourceBox.top,
    right:audit.retrySourceBox.right - audit.yellowButton.right,
    bottom:audit.retrySourceBox.bottom - audit.yellowButton.bottom,
  };
  assert(Object.values(buttonGaps).every((gap) => gap >= 0 && gap <= 18), `${label}: retry hitbox does not follow the baked button edge`, { ...audit, buttonGaps });
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
  let initialPlayProgress = null;
  const hasSharedCoverStart = await evaluate(page, "document.querySelector('main.game')?.dataset.coverStartAsset === 'shared-canonical-v1'");
  const hasConfiguredLayoutAudit = await evaluate(page, "Boolean(LESSON_CONFIG.qa?.layoutAudit)");
  const hasConfiguredAnswerAccumulationAudit = await evaluate(page, "Boolean(LESSON_CONFIG.qa?.answerAccumulationAudit)");
  const hasConfiguredTopControlsAudit = await evaluate(page, "Boolean(LESSON_CONFIG.qa?.topControlsAudit)");
  const scoreViewButtonAsset = await evaluate(page, "LESSON_CONFIG.imageAssets?.scoreViewButton || ''");
  const tutorialNextButtonAsset = await evaluate(page, "LESSON_CONFIG.imageAssets?.tutorialNextButton || ''");
  const configuredMisconceptions = await evaluate(page, "LESSON_CONFIG.qa?.misconceptionCoverage || []");
  const remainingMisconceptions = new Set(configuredMisconceptions);
  shots.push(await screenshot(page, lesson, viewport, "01-cover"));
  await auditGeometry(page, `${viewport.name} cover`, { requireLogo: true });
  if (hasSharedCoverStart) await auditSharedCoverStartButton(page, `${viewport.name} cover start`);
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
  if (tutorialNextButtonAsset) {
    await auditGeneratedActionButton(page, `${viewport.name} tutorial next button`, "#tutorialStartButton", tutorialNextButtonAsset, "다음");
  }
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorTutorialSolveRaster(page, `${viewport.name} generated place-value tutorial poster`);
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
    await evaluate(page, "window.__starPickupQa.forceProblem(50, 4)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 50", `${viewport.name}: fixed 50-star board did not render`);
  }
  shots.push(await screenshot(page, lesson, viewport, "05-play-step1"));
  await auditGeometry(page, `${viewport.name} play`);
  if (hasConfiguredLayoutAudit || hasConfiguredTopControlsAudit) {
    await auditConfiguredPlayHeader(page, `${viewport.name} play header`);
  }
  if (hasConfiguredLayoutAudit) {
    initialLearningLayout = await auditConfiguredLearningLayout(page, `${viewport.name} learning layout`);
    await auditConfiguredTypography(page, `${viewport.name} typography`);
  }
  if (hasConfiguredAnswerAccumulationAudit) {
    await auditConfiguredAnswerAccumulation(page, `${viewport.name} waiting calculation evidence`, 0);
  }
  initialPlayProgress = await auditConfiguredPlayProgress(page, `${viewport.name} play progress`);
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditDivideFarmLayout(page, `${viewport.name} farm waiting`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorPlayHeader(page, `${viewport.name} play header`);
    await auditElevatorPlayStackClearance(page, `${viewport.name} waiting play stack`);
    initialLearningLayout = await auditElevatorLearningLegibility(page, `${viewport.name} learning legibility`);
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await auditStarPickupPlayHeader(page, `${viewport.name} play header`);
    await auditStarPickupWaiting(page, `${viewport.name} fixed 50-star waiting`, 50);

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

    await evaluate(page, "window.__starPickupQa.forceProblem(83, 5, 1)");
    await waitUntil(page, "document.querySelectorAll('.star-remainder-board .star-capsule').length === 16", `${viewport.name}: 16-group remainder board did not render`);
    shots.push(await screenshot(page, lesson, viewport, "05a4-boundary-16-groups"));
    await auditGeometry(page, `${viewport.name} 16-group remainder boundary`);
    await auditStarPickupAlignment(page, `${viewport.name} 16-group remainder alignment`, "remainder", { expectValue: false });

    await evaluate(page, "window.__starPickupQa.forceProblem(50, 4)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 50", `${viewport.name}: fixed 50-star board did not restore`);
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    initialLearningLayout = await auditCheckLockLayout(page, `${viewport.name} check-lock play`);
  }
  const answerLeak = await evaluate(page, "document.getElementById('answerSlot')?.textContent.trim() !== '?' || Boolean(document.querySelector('#choicesPanel [data-state=\"correct\"]'))");
  assert(!answerLeak, `${viewport.name}: answer was exposed before student action`);

  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorInstructionWrap(page, `${viewport.name} first-step instruction`);
    await clickMisconception(page, "DIV2_TENS_QUOTIENT_TOO_HIGH");
  } else if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await clickMisconception(page, "DIV3_QUOTIENT_TOO_LOW");
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    await clickMisconception(page, "DIV4_MULTIPLY_DIVIDEND_DIVISOR");
  } else if (remainingMisconceptions.size) {
    const captured = await auditConfiguredMisconceptions(page, lesson, viewport, shots, remainingMisconceptions, 1);
    assert(captured.length > 0, `${viewport.name}: no configured misconception was available for problem 1`, {
      configuredMisconceptions,
      remaining:[...remainingMisconceptions],
    });
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
      ? "05b-play-dividend-times-divisor"
      : "05b-play-wrong";
  shots.push(await screenshot(page, lesson, viewport, firstWrongShot));
  await auditGeometry(page, `${viewport.name} wrong feedback`);
  if (hasConfiguredAnswerAccumulationAudit) {
    await auditConfiguredAnswerAccumulation(page, `${viewport.name} wrong answer does not fill calculation`, 0);
  }
  if (lesson === "3-2-2-1-mathmon-divide-farm") await auditDivideFarmLayout(page, `${viewport.name} farm wrong`);
  if (lesson === "3-2-2-4-mathmon-check-lock") await auditCheckLockLayout(page, `${viewport.name} dividend-times-divisor`);
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
    await auditStarPickupAlignment(page, `${viewport.name} quotient confirmation alignment`, "grouped", { expectValue: false });
    await waitUntil(page, `window.__mathmonEngineQa.getState().inputLocked === false && (window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(quotientStepId)}`, `${viewport.name}: quotient step did not advance`, 6000);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-remainder"));
    await auditGeometry(page, `${viewport.name} remainder step`);
    await auditStarPickupAlignment(page, `${viewport.name} remainder alignment`, "remainder", { expectValue: false });

    await clickMisconception(page, "DIV3_REMAINDER_EQUALS_DIVISOR");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: remainder wrong feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05d2-play-remainder-wrong"));
    await auditGeometry(page, `${viewport.name} remainder wrong`);
    await auditStarPickupEvidence(page, `${viewport.name} remainder wrong`, "remainder-wrong");
    await auditStarPickupAlignment(page, `${viewport.name} remainder wrong alignment`, "remainder");
    await solveCurrentProblem(page);
  } else if (lesson === "3-2-2-4-mathmon-check-lock") {
    await clickMisconception(page, "DIV4_MULTIPLY_DIVISOR_REMAINDER");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: divisor-times-remainder feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05b2-play-divisor-times-remainder"));
    await auditGeometry(page, `${viewport.name} divisor-times-remainder`);
    await auditCheckLockLayout(page, `${viewport.name} divisor-times-remainder`);
    await solveCheckLockProblemWithAudits(page, lesson, viewport, shots);
  } else {
    let accumulatedAnswerCount = 0;
    await solveCurrentProblem(page, {
      beforeStep: remainingMisconceptions.size
        ? () => auditConfiguredMisconceptions(page, lesson, viewport, shots, remainingMisconceptions, 1)
        : null,
      afterCorrectStep:hasConfiguredAnswerAccumulationAudit
        ? async (stepId) => {
            accumulatedAnswerCount += 1;
            await auditConfiguredAnswerAccumulation(page, `${viewport.name} ${stepId} accumulated answer`, accumulatedAnswerCount);
          }
        : null,
    });
  }
  shots.push(await screenshot(page, lesson, viewport, "06-confirm"));
  await auditGeometry(page, `${viewport.name} confirmation`);
  if (hasConfiguredLayoutAudit) {
    await auditConfiguredCompletionAlignment(page, `${viewport.name} completion alignment`, initialLearningLayout);
  }
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorCompleteSplitLayout(page, `${viewport.name} horizontal completion hierarchy`);
    await auditElevatorDivisionSvgClearance(page, `${viewport.name} completed division SVG`, "complete");
    await auditMathmonReactionAlphaEdge(page, `${viewport.name} completed eagle reward reaction`);
    await auditGeneratedActionButton(page, `${viewport.name} door-open button`, "#rewardButton", "door-open-button-generated.webp", "문 열기");
  }
  if (scoreViewButtonAsset) {
    await auditGeneratedActionButton(page, `${viewport.name} score-view button`, "#rewardButton", scoreViewButtonAsset, "점수 보기");
  }
  if (lesson === "3-2-2-4-mathmon-check-lock") await auditCheckLockCompleteLayout(page, `${viewport.name} final confirmation`);
  await evaluate(page, "document.getElementById('rewardButton').click()");
  const firstReward = await waitForReward(page, viewport.name);
  const emptyRewardAudit = await evaluate(page, "LESSON_CONFIG.qa?.emptyRewardAudit === true");
  if (emptyRewardAudit) {
    assert(firstReward.modal && !firstReward.autoRevealed, `${viewport.name}: nonzero empty fixture requires a closed modal reward`, firstReward);
    const preparedEmpty = await evaluate(page, `(() => {
      const empty = LESSON_CONFIG.rewardEvents.find((event) => event.id === "empty");
      if (!empty) throw new Error("empty reward event is missing");
      window.__mathmonEngineQa.setState({
        power:47,
        rewardPhase:"closed",
        pendingRewardEvent:{ ...empty, amount:0 }
      });
      return window.__mathmonEngineQa.getState();
    })()`);
    assert(preparedEmpty.power === 47 && preparedEmpty.pendingRewardId === "empty" && preparedEmpty.pendingRewardAmount === 0, `${viewport.name}: nonzero empty fixture was not prepared`, preparedEmpty);
  }
  const rewardEffectConfigured = await evaluate(page, "Boolean(LESSON_CONFIG.qa?.rewardEffectAudit)");
  const rewardEffectConfig = rewardEffectConfigured
    ? await evaluate(page, "LESSON_CONFIG.qa.rewardEffectAudit")
    : null;
  let configuredRewardDelta = 0;
  if (rewardEffectConfigured) {
    await evaluate(page, `(() => {
      const forced = LESSON_CONFIG.qa.rewardEffectAudit.forceTierTransition;
      if (!forced) return;
      const event = LESSON_CONFIG.rewardEvents.find((item) => item.id === forced.eventId);
      if (!event) throw new Error("Forced reward tier event is missing: " + forced.eventId);
      window.__mathmonEngineQa.setState({
        power:Number(forced.beforePower),
        correctFirstTry:Number(forced.beforeCorrect),
        pendingRewardEvent:{ ...event, amount:Number(forced.amount) }
      });
      globalThis.__compassRingQa?.syncProgress?.();
    })()`);
  }
  if (rewardEffectConfigured && !firstReward.autoRevealed) {
    await evaluate(page, `(() => {
      const state = window.__mathmonEngineQa.getState();
      if (state.pendingRewardAmount !== 0 && !(state.power <= 0 && state.pendingRewardAmount < 0)) return;
      const common = LESSON_CONFIG.rewardEvents.find((event) => event.id === "normal");
      const amount = Math.max(1, Number(common?.min || 1));
      window.__mathmonEngineQa.setState({
        pendingRewardEvent:{ ...common, amount }
      });
    })()`);
  }
  const targetWorldBeforeReveal = lesson === "3-2-3-1-mathmon-target-hit"
    ? await evaluate(page, `(() => ({
        src: document.getElementById("circleWorldImage")?.getAttribute("src") || "",
        classes: document.getElementById("circleWorldPanel")?.className || ""
      }))()`)
    : null;
  const configuredWorldBeforeReveal = rewardEffectConfigured
    ? await evaluate(page, `(() => {
        const config = LESSON_CONFIG.qa.rewardEffectAudit;
        const panel = document.querySelector(config.panel);
        const image = document.querySelector(config.image);
        return {
          src:image?.getAttribute("src") || "",
          classes:panel?.className || "",
          resultTier:panel?.dataset.resultTier || "",
          activeClasses:config.activeClasses || [],
          power:Number(window.__mathmonEngineQa.getState().power || 0),
          revealHookType:typeof globalThis.onRewardReveal,
          dismissHookType:typeof globalThis.onRewardDismiss,
          lessonEffectState:globalThis.__compassRingQa?.getRewardEffectState?.() || null
        };
      })()`)
    : null;
  if (firstReward.autoRevealed) {
    shots.push(await screenshot(page, lesson, viewport, "07-reward-immediate"));
    await auditGeometry(page, `${viewport.name} immediate reward`);
  } else {
    shots.push(await screenshot(page, lesson, viewport, "07-reward-closed"));
    await auditGeometry(page, `${viewport.name} closed reward`);
    await auditConfiguredRewardSprite(page, `${viewport.name} closed reward sprite`, "closed");
    await auditConfiguredRewardModal(page, `${viewport.name} closed reward modal`, "closed");
    if (lesson === "3-2-2-1-mathmon-divide-farm") await auditFarmReward(page, `${viewport.name} closed reward`, "closed");
    await revealReward(page, firstReward, viewport.name);
    if (lesson === "3-2-3-1-mathmon-target-hit") {
      const targetWorldDuringModal = await evaluate(page, `(() => ({
        src: document.getElementById("circleWorldImage")?.getAttribute("src") || "",
        classes: document.getElementById("circleWorldPanel")?.className || "",
        modalHidden: document.getElementById("rewardPop")?.hidden ?? true,
        rewardText: document.getElementById("modalRewardLabel")?.textContent?.trim() || ""
      }))()`);
      assert(targetWorldDuringModal.modalHidden === false, `${viewport.name}: score modal must remain visible during score reveal`, targetWorldDuringModal);
      assert(targetWorldDuringModal.src === targetWorldBeforeReveal.src, `${viewport.name}: blurred background art must not change during score reveal`, {
        before: targetWorldBeforeReveal,
        during: targetWorldDuringModal,
      });
      assert(
        !/\bis-(?:changing|dimming|celebrating)\b/.test(targetWorldDuringModal.classes),
        `${viewport.name}: background reward effect must wait for score confirmation`,
        targetWorldDuringModal,
      );
    }
    if (rewardEffectConfigured) {
      const configuredWorldDuringModal = await evaluate(page, `(() => {
        const config = LESSON_CONFIG.qa.rewardEffectAudit;
        const panel = document.querySelector(config.panel);
        const image = document.querySelector(config.image);
        return {
          src:image?.getAttribute("src") || "",
          classes:panel?.className || "",
          modalHidden:document.getElementById("rewardPop")?.hidden ?? true,
          activeClasses:config.activeClasses || [],
          power:Number(window.__mathmonEngineQa.getState().power || 0)
        };
      })()`);
      configuredRewardDelta = configuredWorldDuringModal.power - configuredWorldBeforeReveal.power;
      assert(configuredWorldDuringModal.modalHidden === false, `${viewport.name}: reward modal must remain visible during reward reveal`, configuredWorldDuringModal);
      assert(
        configuredWorldDuringModal.src === configuredWorldBeforeReveal.src,
        `${viewport.name}: blurred problem-screen progress art must stay stable while the reward modal is open`,
        { before:configuredWorldBeforeReveal, during:configuredWorldDuringModal },
      );
      assert(
        configuredWorldDuringModal.activeClasses.every((className) => !configuredWorldDuringModal.classes.split(/\\s+/).includes(className)),
        `${viewport.name}: background reward effect must wait until the modal is dismissed`,
        configuredWorldDuringModal,
      );
    }
    shots.push(await screenshot(page, lesson, viewport, "07b-reward-open"));
    await auditGeometry(page, `${viewport.name} revealed reward`);
    await auditConfiguredRewardSprite(page, `${viewport.name} revealed reward sprite`, "revealed");
    await auditConfiguredRewardModal(page, `${viewport.name} revealed reward modal`, "revealed");
    if (lesson === "3-2-2-2-mathmon-elevator") {
      await auditGeneratedActionButton(page, `${viewport.name} reward next button`, "#modalRewardNextButton", "action-buttons/next-button-generated.webp", "다음");
    }
    if (lesson === "3-2-2-1-mathmon-divide-farm") await auditFarmReward(page, `${viewport.name} revealed reward`, "revealed");
  }
  if (emptyRewardAudit) {
    const preservedEmpty = await evaluate(page, `(() => ({
      state:window.__mathmonEngineQa.getState(),
      label:document.getElementById("modalRewardLabel")?.textContent.trim() || "",
      expected:(LESSON_CONFIG.reward?.changeLabel || "이번 변화") + " " + (LESSON_CONFIG.reward?.zeroLabel || "0")
    }))()`);
    assert(preservedEmpty.state.power === 47, `${viewport.name}: empty reward erased accumulated power`, preservedEmpty);
    assert(preservedEmpty.label === preservedEmpty.expected, `${viewport.name}: empty reward did not show the zero-change label`, preservedEmpty);
  }
  if (lesson === "3-2-3-1-mathmon-target-hit") {
    const rewardText = await evaluate(page, "document.getElementById('modalRewardLabel')?.textContent?.trim() || ''");
    const rewardDelta = Number(rewardText.match(/[+-]?\d+/)?.[0] || 0);
    await clickSelector(page, firstReward.nextSelector);
    const targetWorldAfterConfirm = await evaluate(page, `(() => ({
      classes: document.getElementById("circleWorldPanel")?.className || "",
      modalHidden: document.getElementById("rewardPop")?.hidden ?? true,
      problemIndex: window.__mathmonEngineQa.getState().problemIndex
    }))()`);
    assert(targetWorldAfterConfirm.modalHidden === true, `${viewport.name}: score confirmation must close the modal before the background effect`, targetWorldAfterConfirm);
    if (rewardDelta !== 0) {
      assert(
        /\bis-(?:changing|dimming|celebrating)\b/.test(targetWorldAfterConfirm.classes),
        `${viewport.name}: non-zero reward must trigger the visible background effect after score confirmation`,
        { rewardDelta, ...targetWorldAfterConfirm },
      );
      assert(targetWorldAfterConfirm.problemIndex === 0, `${viewport.name}: next problem must wait for the background effect`, targetWorldAfterConfirm);
    }
  } else if (rewardEffectConfigured) {
    await page.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "no-preference" }],
    });
    const effectConfig = rewardEffectConfig;
    const readConfiguredWorld = () => evaluate(page, `(() => {
      const config = LESSON_CONFIG.qa.rewardEffectAudit;
      const panel = document.querySelector(config.panel);
      const impactLayer = document.querySelector(config.impactLayer);
      const stage = document.querySelector(".stage-shell");
      const classes = panel?.className || "";
      const impactRect = impactLayer?.getBoundingClientRect();
      const stageRect = stage?.getBoundingClientRect();
      return {
        now:performance.now(),
        classes,
        src:document.querySelector(config.image)?.getAttribute("src") || "",
        resultTier:panel?.dataset.resultTier || "",
        modalHidden:document.getElementById("rewardPop")?.hidden ?? true,
        problemIndex:window.__mathmonEngineQa.getState().problemIndex,
        activeClasses:config.activeClasses || [],
        activeEffect:(config.activeClasses || []).some((className) => classes.split(/\\s+/).includes(className)),
        impactWidthRatio:impactRect && stageRect?.width ? impactRect.width / stageRect.width : 0,
        revealHookType:typeof globalThis.onRewardReveal,
        dismissHookType:typeof globalThis.onRewardDismiss,
        lessonEffectState:globalThis.__compassRingQa?.getRewardEffectState?.() || null
      };
    })()`);
    await clickSelector(page, firstReward.nextSelector);
    let configuredWorldAfterConfirm = await readConfiguredWorld();
    assert(configuredWorldAfterConfirm.modalHidden === true, `${viewport.name}: reward confirmation must close the modal before the background effect`, configuredWorldAfterConfirm);
    if (configuredRewardDelta !== 0) {
      if (effectConfig.preEffectDelayMs > 0) {
        if (!configuredWorldAfterConfirm.activeEffect) {
          assert(configuredWorldAfterConfirm.lessonEffectState?.effectPhase === "arming", `${viewport.name}: post-modal attention pause was not exposed`, configuredWorldAfterConfirm);
          assert(configuredWorldAfterConfirm.problemIndex === 0, `${viewport.name}: next problem advanced during the post-modal attention pause`, configuredWorldAfterConfirm);
          await waitUntil(
            page,
            "globalThis.__compassRingQa?.getRewardEffectState?.().effectPhase === 'active'",
            `${viewport.name}: delayed reward effect did not start`,
            Number(effectConfig.preEffectDelayMs || 0) + 1600,
          );
          configuredWorldAfterConfirm = await readConfiguredWorld();
        }
        const armedAt = Number(configuredWorldAfterConfirm.lessonEffectState?.effectArmedAt || 0);
        const startedAt = Number(configuredWorldAfterConfirm.lessonEffectState?.effectStartedAt || 0);
        assert(
          startedAt - armedAt >= Number(effectConfig.preEffectDelayMs) - 40,
          `${viewport.name}: post-modal attention pause was shorter than contracted`,
          { armedAt, startedAt, expected:effectConfig.preEffectDelayMs },
        );
      }
      assert(configuredWorldAfterConfirm.activeEffect, `${viewport.name}: non-zero reward must trigger the visible progress-panel effect`, {
        rewardDelta:configuredRewardDelta,
        ...configuredWorldAfterConfirm,
      });
      assert(configuredWorldAfterConfirm.problemIndex === 0, `${viewport.name}: next problem must wait for the progress-panel effect`, configuredWorldAfterConfirm);
      if (effectConfig.standard === "modal-dismiss-world-impact-v2") {
        assert(
          configuredWorldAfterConfirm.lessonEffectState?.effectStartedWithModalHidden === "true",
          `${viewport.name}: the world impact must start only after the reward modal is hidden`,
          configuredWorldAfterConfirm,
        );
        assert(
          configuredWorldAfterConfirm.lessonEffectState?.effectPhase === "active",
          `${viewport.name}: the post-modal effect phase must be active`,
          configuredWorldAfterConfirm,
        );
        const forced = effectConfig.forceTierTransition;
        if (forced) {
          assert(configuredWorldBeforeReveal.resultTier === forced.beforeTier, `${viewport.name}: forced tier fixture did not begin at ${forced.beforeTier}`, configuredWorldBeforeReveal);
          assert(configuredWorldAfterConfirm.resultTier === forced.afterTier, `${viewport.name}: reward did not advance to ${forced.afterTier}`, configuredWorldAfterConfirm);
          assert(configuredWorldAfterConfirm.src !== configuredWorldBeforeReveal.src, `${viewport.name}: tier-up must swap the progress scene image`, {
            before:configuredWorldBeforeReveal,
            after:configuredWorldAfterConfirm,
          });
          assert(
            configuredWorldAfterConfirm.classes.split(/\s+/).includes(effectConfig.tierUpClass),
            `${viewport.name}: tier-up must trigger the dedicated high-impact class`,
            configuredWorldAfterConfirm,
          );
          assert(configuredWorldAfterConfirm.lessonEffectState?.effectKind === "tier-up", `${viewport.name}: tier-up effect kind was not recorded`, configuredWorldAfterConfirm);
        }
        const captureDelayMs = Math.min(520, Math.max(480, Math.floor(Number(effectConfig.minVisibleMs || 0) / 3)));
        if (captureDelayMs > 0) await delay(captureDelayMs);
        configuredWorldAfterConfirm = await readConfiguredWorld();
        assert(
          configuredWorldAfterConfirm.impactWidthRatio >= Number(effectConfig.minImpactStageWidthRatio || 0),
          `${viewport.name}: post-modal effect is too small at its visible peak`,
          configuredWorldAfterConfirm,
        );
        shots.push(await screenshot(page, lesson, viewport, "07c-reward-impact"));
        const afterCaptureTiming = await readConfiguredWorld();
        const effectStartedAt = Number(afterCaptureTiming.lessonEffectState?.effectStartedAt || 0);
        const elapsedSinceEffectStart = Math.max(0, Number(afterCaptureTiming.now || 0) - effectStartedAt);
        const holdMs = Math.max(0, Number(effectConfig.minVisibleMs || 0) - elapsedSinceEffectStart - 100);
        if (holdMs > 0) {
          await delay(holdMs);
          const heldImpact = await evaluate(page, `(() => {
            const config = LESSON_CONFIG.qa.rewardEffectAudit;
            const panel = document.querySelector(config.panel);
            return {
              problemIndex:window.__mathmonEngineQa.getState().problemIndex,
              effectPhase:panel?.dataset.effectPhase || "",
              classes:panel?.className || ""
            };
          })()`);
          assert(heldImpact.problemIndex === 0, `${viewport.name}: next problem advanced before the minimum effect reading time`, heldImpact);
          assert(heldImpact.effectPhase === "active", `${viewport.name}: tier-up effect ended before the minimum visible duration`, heldImpact);
        }
      } else {
        shots.push(await screenshot(page, lesson, viewport, "07c-reward-impact"));
      }
    }
    await waitUntil(page, "window.__mathmonEngineQa.getState().problemIndex === 1", `${viewport.name}: next problem did not start after the reward effect`);
    const restoreCorrect = await evaluate(page, "LESSON_CONFIG.qa.rewardEffectAudit.forceTierTransition?.restoreCorrect ?? null");
    if (restoreCorrect != null) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({ correctFirstTry:${JSON.stringify(restoreCorrect)} });
        window.__mathmonEngineQa.renderProblem();
      })()`);
    }
    await page.send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    });
  } else {
    await clickSelector(page, firstReward.nextSelector);
  }

  let checkLockMatchCaptured = false;
  for (let problemIndex = 2; problemIndex <= 10; problemIndex += 1) {
    await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not active for problem ${problemIndex}`);
    if (remainingMisconceptions.size) {
      await auditConfiguredMisconceptions(page, lesson, viewport, shots, remainingMisconceptions, problemIndex);
    }
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
      await solveCurrentProblem(page, {
        wrongFirst: lesson === "3-2-2-2-mathmon-elevator",
        beforeStep: remainingMisconceptions.size
          ? () => auditConfiguredMisconceptions(page, lesson, viewport, shots, remainingMisconceptions, problemIndex)
          : null,
      });
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
    const problemIndexBeforeRewardDismiss = await evaluate(
      page,
      "window.__mathmonEngineQa.getState().problemIndex",
    );
    await clickSelector(page, reward.nextSelector);
    if (rewardEffectConfigured) {
      await waitUntil(
        page,
        `document.querySelector('.screen.is-active')?.id === 'screen-result' || window.__mathmonEngineQa.getState().problemIndex > ${JSON.stringify(problemIndexBeforeRewardDismiss)}`,
        `${viewport.name}: problem ${problemIndex} did not advance after its post-modal reward effect`,
        Number(rewardEffectConfig?.preEffectDelayMs || 0)
          + Number(rewardEffectConfig?.durationMs || 0)
          + 3000,
      );
    }
  }
  if (lesson === "3-2-2-4-mathmon-check-lock") {
    assert(checkLockMatchCaptured, `${viewport.name}: matching auto-comparison state was not captured`);
  }
  assert(remainingMisconceptions.size === 0, `${viewport.name}: configured misconception coverage is incomplete`, {
    configuredMisconceptions,
    remaining:[...remainingMisconceptions],
  });

  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result not shown`, 8000);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    const lowResult = await evaluate(page, `(() => ({
      correctFirstTry: window.__mathmonEngineQa.getState().correctFirstTry,
      power: window.__mathmonEngineQa.getState().power,
      result: document.getElementById('resultTitle')?.textContent.trim() || '',
      tier: document.getElementById('screen-result')?.dataset.resultTier || ''
    }))()`);
    assert(lowResult.correctFirstTry === 0, `${viewport.name}: low-result scenario must finish at 0/10`, lowResult);
    assert(lowResult.result === "지하 비밀기지" && lowResult.tier === "basement", `${viewport.name}: 0/10 must still arrive at a visible place`, lowResult);
    await auditElevatorResultTier(page, `${viewport.name} low result`, { id:"basement", name:"지하 비밀기지", power:lowResult.power });
    shots.push(await screenshot(page, lesson, viewport, "08-result-low-0-of-10"));

    const elevatorTiers = [
      { id:"basement", name:"지하 비밀기지", power:0, correct:0, special:false },
      { id:"first", name:"햇살 로비", power:19, correct:3, special:false },
      { id:"middle", name:"구름 쉼터", power:39, correct:5, special:false },
      { id:"view", name:"하늘 전망대", power:59, correct:7, special:false },
      { id:"roof", name:"꽃빛 옥상정원", power:79, correct:9, special:false },
      { id:"rainbow", name:"무지개 최고층", power:100, correct:10, special:true },
    ];
    for (const tier of elevatorTiers) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({
          power:${tier.power}, correctFirstTry:${tier.correct}, specialSeen:${tier.special}, currentResult:null
        });
        window.__mathmonEngineQa.showResult();
      })()`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)} && document.getElementById('resultBg')?.complete && document.getElementById('resultBg')?.naturalWidth === 1280 && document.getElementById('resultCorrectArt')?.complete && document.getElementById('resultCorrectArt')?.naturalWidth > 0`, `${viewport.name}: elevator result ${tier.id} did not render`);
      await auditElevatorResultTier(page, `${viewport.name} result ${tier.id}`, tier);
      await auditGeometry(page, `${viewport.name} result ${tier.id}`, { requireRetry: true });
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tier.id}`));
    }
  } else {
    shots.push(await screenshot(page, lesson, viewport, "08-result"));
  }
  await auditGeometry(page, `${viewport.name} result`, { requireRetry: true });
  await auditConfiguredResultNextGoal(page, `${viewport.name} result next goal`);
  await auditConfiguredResultCohesionV2(page, `${viewport.name} result cohesion v2`);
  await auditAllConfiguredResultCohesionTiers(page, lesson, viewport, shots);

  if (lesson === "3-2-3-2-mathmon-compass-ring") {
    const resultTiers = await evaluate(page, `LESSON_CONFIG.results.map((result) => ({
      id:result.id,
      power:result.minPower,
      correct:result.minCorrect,
      special:Boolean(result.needsSpecial),
      visualRank:Number(result.visualRank)
    }))`);
    assert(resultTiers.length === 6, `${viewport.name}: compass result set must contain six states`, resultTiers);
    let previousVisualAudit = null;
    for (const tier of resultTiers) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({
          power:${tier.power},
          correctFirstTry:${tier.correct},
          specialSeen:${tier.special},
          currentResult:null
        });
        window.__mathmonEngineQa.showResult();
      })()`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)}
        && document.getElementById('resultBg')?.complete
        && document.getElementById('resultBg')?.naturalWidth === 1280
        && document.getElementById('resultCorrectArt')?.complete
        && document.getElementById('resultCorrectArt')?.naturalWidth > 0
        && !document.querySelector('.compass-result-impact, [class*="result-impact"]')`, `${viewport.name}: compass result ${tier.id} did not render`);
      await auditGeometry(page, `${viewport.name} compass result ${tier.id}`, { requireRetry: true });
      await auditConfiguredResultNextGoal(page, `${viewport.name} compass result ${tier.id} next goal`);
      const visualAudit = await auditCompassResultVisual(
        page,
        `${viewport.name} compass result ${tier.id} visual`,
        tier,
      );
      if (previousVisualAudit) {
        assert(visualAudit.visualRank === previousVisualAudit.visualRank + 1, `${viewport.name}: compass visual rank must rise by one per tier`, { previousVisualAudit, visualAudit });
        assert(visualAudit.scene.source !== previousVisualAudit.scene.source, `${viewport.name}: adjacent compass tiers must use different complete scenes`, { previousVisualAudit, visualAudit });
      }
      previousVisualAudit = visualAudit;
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tier.id}`));
    }
  }

  if (/^3-2-4-/.test(lesson)) {
    const resultTiers = await evaluate(page, `LESSON_CONFIG.results.map((result) => ({
      id:result.id,
      power:result.minPower,
      correct:result.minCorrect,
      special:Boolean(result.needsSpecial)
    }))`);
    assert(resultTiers.length === 6, `${viewport.name}: unit 4 result set must contain six states`, resultTiers);
    for (const tier of resultTiers) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({
          power:${tier.power},
          correctFirstTry:${tier.correct},
          specialSeen:${tier.special},
          currentResult:null
        });
        window.__mathmonEngineQa.showResult();
      })()`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)}
        && document.getElementById('resultBg')?.complete
        && document.getElementById('resultBg')?.naturalWidth === 1280
        && document.getElementById('resultTitleArt')?.complete
        && document.getElementById('resultTitleArt')?.naturalWidth === 900
        && document.getElementById('resultCorrectArt')?.complete
        && document.querySelector('.result-retry-art')?.complete`, `${viewport.name}: unit 4 result ${tier.id} did not render`);
      await auditGeometry(page, `${viewport.name} result ${tier.id}`, { requireRetry: true });
      await auditConfiguredResultNextGoal(page, `${viewport.name} result ${tier.id} next goal`);
      await auditConfiguredResultCohesion(page, `${viewport.name} result ${tier.id} cohesion`);
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tier.id}`));
    }
  }

  if (/^3-2-5-[123]-/.test(lesson)) {
    const resultTiers = await evaluate(page, `LESSON_CONFIG.results.map((result) => ({
      id:result.id,
      power:result.minPower,
      correct:result.minCorrect,
      special:Boolean(result.needsSpecial)
    }))`);
    assert(resultTiers.length === 4, `${viewport.name}: unit 5 result set must contain four states`, resultTiers);
    for (const tier of resultTiers) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.setState({
          power:${tier.power},
          correctFirstTry:${tier.correct},
          specialSeen:${tier.special},
          currentResult:null
        });
        window.__mathmonEngineQa.showResult();
      })()`);
      await waitUntil(page, `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(tier.id)}
        && document.getElementById('resultBg')?.complete
        && document.getElementById('resultBg')?.naturalWidth === 1280
        && document.getElementById('resultTitleArt')?.complete
        && document.getElementById('resultTitleArt')?.naturalWidth > 0
        && document.getElementById('resultCorrectArt')?.complete
        && document.querySelector('.result-retry-art')?.complete`, `${viewport.name}: unit 5 result ${tier.id} did not render`);
      await auditGeometry(page, `${viewport.name} result ${tier.id}`, { requireRetry: true });
      await auditConfiguredResultNextGoal(page, `${viewport.name} result ${tier.id} next goal`);
      await auditConfiguredResultCohesion(page, `${viewport.name} result ${tier.id} cohesion`);
      shots.push(await screenshot(page, lesson, viewport, `08a-result-${tier.id}`));
    }
  }

  if (lesson === "3-2-3-1-mathmon-target-hit") {
    const playTiers = await evaluate(page, `LESSON_CONFIG.results.map((result) => result.id)`);
    assert(playTiers.length === 6, `${viewport.name}: target play progression must contain six states`, playTiers);
    for (const tierId of playTiers) {
      await evaluate(page, `(() => {
        window.__mathmonEngineQa.showScreen('play');
        window.__targetHitQa.forcePlayTier(${JSON.stringify(tierId)});
      })()`);
      await waitUntil(page, `(() => {
        const panel = document.getElementById('circleWorldPanel');
        const image = document.getElementById('circleWorldImage');
        return panel?.dataset.resultTier === ${JSON.stringify(tierId)}
          && image?.complete
          && image?.naturalWidth === 768
          && image?.naturalHeight === 1536;
      })()`, `${viewport.name}: target play tier ${tierId} did not load`);
      const playAudit = await evaluate(page, `(() => {
        const panel = document.getElementById('circleWorldPanel');
        const image = document.getElementById('circleWorldImage');
        const problem = document.querySelector('.problem-grid');
        const readRect = (node) => {
          const rect = node?.getBoundingClientRect();
          return rect ? { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height } : null;
        };
        const panelRect = readRect(panel);
        const imageRect = readRect(image);
        const problemRect = readRect(problem);
        const overlap = panelRect && problemRect
          ? Math.max(0, Math.min(panelRect.right, problemRect.right) - Math.max(panelRect.left, problemRect.left))
            * Math.max(0, Math.min(panelRect.bottom, problemRect.bottom) - Math.max(panelRect.top, problemRect.top))
          : null;
        return {
          tier:panel?.dataset.resultTier || '',
          source:image?.getAttribute('src') || '',
          complete:Boolean(image?.complete),
          naturalWidth:image?.naturalWidth || 0,
          naturalHeight:image?.naturalHeight || 0,
          objectFit:image ? getComputedStyle(image).objectFit : '',
          panel:panelRect,
          image:imageRect,
          problem:problemRect,
          overlap
        };
      })()`);
      assert(playAudit.tier === tierId, `${viewport.name}: target play tier state mismatch`, playAudit);
      assert(/^play-target-.+-v2-generated\.webp$/.test(playAudit.source), `${viewport.name}: target play tier reused final art`, playAudit);
      assert(playAudit.complete && playAudit.naturalWidth === 768 && playAudit.naturalHeight === 1536, `${viewport.name}: target play tier has the wrong canvas`, playAudit);
      assert(playAudit.objectFit === "contain", `${viewport.name}: target play tier may be cropped`, playAudit);
      assert(playAudit.overlap === 0, `${viewport.name}: target play tier overlaps the problem area`, playAudit);
      shots.push(await screenshot(page, lesson, viewport, `05p-play-tier-${tierId}`));
    }

    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:0, correctFirstTry:0, specialSeen:false, currentResult:null
      });
      window.__mathmonEngineQa.showResult();
    })()`);
    await waitUntil(page, "document.getElementById('screen-result')?.dataset.resultTier === 'practice' && document.getElementById('resultBg')?.complete && document.getElementById('resultBg')?.naturalWidth === 1280", `${viewport.name}: practice result did not load`);
    const practice = await evaluate(page, `(() => {
      const background = document.getElementById('resultBg');
      return {
        tier:document.getElementById('screen-result')?.dataset.resultTier || '',
        title:document.getElementById('resultTitle')?.textContent.trim() || '',
        source:background?.getAttribute('src') || '',
        complete:Boolean(background?.complete),
        naturalWidth:background?.naturalWidth || 0,
        naturalHeight:background?.naturalHeight || 0
      };
    })()`);
    assert(practice.tier === "practice" && practice.title === "연습 표적", `${viewport.name}: 0/10 result must be 연습 표적`, practice);
    assert(practice.source === "result-practice-generated.webp", `${viewport.name}: practice result uses the wrong scene`, practice);
    assert(practice.complete && practice.naturalWidth === 1280 && practice.naturalHeight === 800, `${viewport.name}: practice result scene has the wrong canvas`, practice);
    shots.push(await screenshot(page, lesson, viewport, "08a-result-practice-0-of-10"));
    await auditGeometry(page, `${viewport.name} practice result`, { requireRetry: true });
    await auditConfiguredResultNextGoal(page, `${viewport.name} practice result next goal`);
  }

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
    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:100, correctFirstTry:10, specialSeen:true, currentResult:null
      });
      window.__mathmonEngineQa.showResult();
    })()`);
    await waitUntil(page, "document.getElementById('screen-result')?.dataset.resultTier === 'rainbow-unicorn' && /result-correct-10-generated\\.webp$/.test(document.getElementById('resultCorrectArt')?.getAttribute('src') || '') && document.getElementById('resultCorrectArt')?.complete", `${viewport.name}: rainbow 10/10 result did not render`);
    shots.push(await screenshot(page, lesson, viewport, "08b-result-rainbow-10-of-10"));
    await auditGeometry(page, `${viewport.name} result rainbow 10/10`, { requireRetry: true });
    await auditStarPickupResultTier(page, `${viewport.name} result rainbow 10/10`, "rainbow-unicorn");
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
  return { viewport, shots, learningLayout: initialLearningLayout, playProgress: initialPlayProgress, snapshot };
}

async function readLessonConfig(lesson) {
  const configPath = path.join(SOURCE_ROOT, lesson, "lesson.json");
  return JSON.parse(await fsp.readFile(configPath, "utf8"));
}

async function runDelegatedFlowHarness(lesson, config) {
  const harness = config.qa?.flowHarness;
  assert(harness?.standard === "delegated-browser-v1", `${lesson}: unsupported delegated flow standard`, harness);
  const scriptPath = path.resolve(ROOT, harness.script || "");
  assert(scriptPath.startsWith(`${ROOT}${path.sep}`) && fs.existsSync(scriptPath), `${lesson}: delegated flow harness is missing`, harness);
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath], {
      cwd: ROOT,
      env: process.env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => signal ? reject(new Error(`${lesson}: delegated harness stopped by ${signal}`)) : resolve(code));
  });
  assert(exitCode === 0, `${lesson}: delegated browser harness failed with exit ${exitCode}`);
  console.log("QA_LESSON_FLOW: PASS");
  console.log(JSON.stringify({ lesson, delegatedHarness: path.relative(ROOT, scriptPath), exitCode }, null, 2));
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
  if (config.qa?.flowHarness?.standard === "delegated-browser-v1") {
    await runDelegatedFlowHarness(lesson, config);
    return;
  }
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
    await page.send("Network.enable");
    const results = [];
    for (const viewport of viewports) {
      results.push(await runViewport(page, lesson, pageUrl, viewport, seed));
    }
    const runtimeErrors = page.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert(runtimeErrors.length === 0, "runtime exceptions were thrown", runtimeErrors);
    const rankingNetworkRequests = page.events
      .filter((event) => event.method === "Network.requestWillBeSent")
      .map((event) => event.params?.request?.url || "")
      .filter((url) => /(?:scoreboard|leaderboard|ranking|supabase|\/api\/(?:score|rank))/i.test(url));
    assert(rankingNetworkRequests.length === 0, "ranking network requests must remain disabled", rankingNetworkRequests);
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
