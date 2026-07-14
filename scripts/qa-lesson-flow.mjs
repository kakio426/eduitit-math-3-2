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

async function clickChoice(page, correct) {
  const selector = correct ? "button.choice-button[data-correct='true']:not(:disabled)" : "button.choice-button[data-correct='false']:not(:disabled)";
  const hasChoice = await evaluate(page, `Boolean(document.querySelector(${JSON.stringify(selector)}))`);
  if (hasChoice) {
    await clickSelector(page, selector);
    return;
  }
  const interaction = await evaluate(page, "document.getElementById('choicesPanel')?.dataset.interaction || ''");
  const step = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()");
  if (interaction === "enter-share" || interaction === "enter-quotient") {
    const answerValue = Number(step.answer);
    const wrongAmount = interaction === "enter-share" && step.id === "tens"
      ? answerValue > 10 ? answerValue - 10 : answerValue + 10
      : answerValue === 99 ? 98 : answerValue + 1;
    const amount = correct ? answerValue : wrongAmount;
    await clickSelector(page, ".farm-key.is-clear:not(:disabled)");
    for (const digit of String(amount)) await clickSelector(page, `.farm-key[data-digit="${digit}"]:not(:disabled)`);
    await clickSelector(page, ".farm-key.is-enter:not(:disabled)");
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
      ".farm-share-answer",
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
      '.farm-share-answer', '.farm-entry-message', '.farm-answer-basket-card', '.farm-final-sum',
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
    window.MathmonScoreboard.render(state);
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

async function auditElevatorDivisionBoard(page, label, { expectDown = false } = {}) {
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
    const combinedTarget = combinedSlots.length === 2 ? {
      left:combinedSlots[0].rect.left,
      top:Math.min(...combinedSlots.map((item) => item.rect.top)),
      right:combinedSlots[1].rect.right,
      bottom:Math.max(...combinedSlots.map((item) => item.rect.bottom)),
      width:combinedSlots[1].rect.right - combinedSlots[0].rect.left,
      height:Math.max(...combinedSlots.map((item) => item.rect.height))
    } : null;
    const combinedLabelRect = rectOf(document.querySelector('.board-combined-label'));
    const combinedValues = [...document.querySelectorAll('.board-combined-value')].map((node) => ({ place:node.dataset.place || '', text:node.textContent.trim(), rect:rectOf(node) }));
    const combineSource = Boolean(document.querySelector('.board-combine-source'));
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
      surface, work, step, tensCell, onesCell, product, remainder, combinedSlots, combinedTarget, combinedLabelRect, combinedValues, combineSource, arrow, textOverlaps,
      surfaceGap: surface && step ? step.top - surface.bottom : null,
      workGap: work && step ? step.top - work.bottom : null,
      productTopGap: product && tensCell ? product.top - tensCell.bottom : null,
      productColumnDelta: product && tensCell ? Math.abs(product.cx - tensCell.cx) : null,
      remainderColumnDelta: remainder && tensCell ? Math.abs(remainder.cx - tensCell.cx) : null,
      combinedValueColumnDeltas: combinedValues.map((item) => Math.abs(item.rect.cx - (item.place === 'tens' ? tensCell.cx : onesCell.cx))),
      combinedValueVerticalDeltas: combinedValues.map((item) => {
        const slot = combinedSlots.find((candidate) => candidate.place === item.place)?.rect;
        return slot ? Math.abs(item.rect.cy - slot.cy) : Infinity;
      })
    };
  })()`);
  assert(audit.surface && audit.work && audit.step, `${label}: division board state missing`, audit);
  assert(audit.surfaceGap >= 4, `${label}: calculation board overlaps instruction`, audit);
  assert(audit.workGap >= 4, `${label}: calculation work overlaps instruction`, audit);
  assert(audit.productColumnDelta <= 1, `${label}: partial product left its tens column`, audit);
  assert(audit.remainderColumnDelta <= 1, `${label}: remainder left its tens column`, audit);
  assert(audit.productTopGap >= 8, `${label}: partial product overlaps the dividend cell`, audit);
  assert(audit.textOverlaps.length === 0, `${label}: calculation text overlaps`, audit);
  if (expectDown) {
    assert(audit.combinedTarget, `${label}: combined-number target missing`, audit);
    assert(audit.combinedSlots.length === 2 && audit.combinedSlots[0].place === 'tens' && audit.combinedSlots[1].place === 'ones', `${label}: combined-number target is not split into two place-value cells`, audit);
    assert(Math.abs(audit.combinedSlots[0].rect.left - audit.tensCell.left) <= 1 && Math.abs(audit.combinedSlots[0].rect.right - audit.tensCell.right) <= 1, `${label}: combined-number tens cell is not aligned`, audit);
    assert(Math.abs(audit.combinedSlots[1].rect.left - audit.onesCell.left) <= 1 && Math.abs(audit.combinedSlots[1].rect.right - audit.onesCell.right) <= 1, `${label}: combined-number ones cell is not aligned`, audit);
    assert(audit.combinedSlots.every((item) => item.rect.width >= 80 && item.rect.height >= 48), `${label}: combined-number place-value cell is too small`, audit);
    assert(!audit.combinedLabelRect && audit.combinedValues.length >= 1 && audit.combinedValues.every((item) => item.rect.height >= 30), `${label}: combined-number target label or value hierarchy is wrong`, audit);
    assert(audit.combinedValueColumnDeltas.every((delta) => delta <= 1) && audit.combinedValueVerticalDeltas.every((delta) => delta <= 3), `${label}: combined-number digits left their place-value columns`, audit);
    assert(audit.surfaceGap >= 7, `${label}: calculation board leaves too little room above the instruction`, audit);
    assert(!audit.combineSource, `${label}: redundant combined-number source text remains`, audit);
    assert(audit.arrow === 'M631 194 V239', `${label}: bring-down arrow is not vertical`, audit);
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
      values
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
    const choicesPanel = document.querySelector('.choices-panel')?.getBoundingClientRect();
    const floorPanel = document.querySelector('.elevator-floor-panel')?.getBoundingClientRect();
    const choiceRects = choices.map((node) => node.getBoundingClientRect());
    const valueRects = values.map((node) => node.getBoundingClientRect());
    return {
      instruction: instruction ? parseFloat(getComputedStyle(instruction).fontSize) : 0,
      numericValue: values[0] ? parseFloat(getComputedStyle(values[0]).fontSize) : 0,
      valueCount: values.length,
      minChoiceHeight: choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.height)) : 0,
      minChoiceWidth: choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.width)) : 0,
      choiceWidthSpread: choiceRects.length ? Math.max(...choiceRects.map((rect) => rect.width)) - Math.min(...choiceRects.map((rect) => rect.width)) : Infinity,
      choiceHeightSpread: choiceRects.length ? Math.max(...choiceRects.map((rect) => rect.height)) - Math.min(...choiceRects.map((rect) => rect.height)) : Infinity,
      panelWidthDelta: choicesPanel && floorPanel ? Math.abs(choicesPanel.width - floorPanel.width) : Infinity,
      panelHeightDelta: choicesPanel && floorPanel ? Math.abs(choicesPanel.height - floorPanel.height) : Infinity,
      minValueHeight: valueRects.length ? Math.min(...valueRects.map((rect) => rect.height)) : 0,
      interaction: document.querySelector('.choices-panel')?.dataset.interaction || '',
      hasDownZone: Boolean(document.querySelector('.elevator-down-zone')),
      hasDirectChoice: Boolean(document.querySelector('[data-direct-choice="true"]'))
    };
  })()`);
  assert(audit.instruction >= 14, `${label}: instruction text is too small`, audit);
  assert(audit.numericValue >= 28, `${label}: numeric choices are too small`, audit);
  assert(audit.valueCount === 4, `${label}: four numeric choices must stay visible`, audit);
  assert(audit.minChoiceWidth >= 42 && audit.minChoiceHeight >= 42, `${label}: numeric choice touch target is too small`, audit);
  assert(audit.choiceWidthSpread <= 1 && audit.choiceHeightSpread <= 1, `${label}: numeric choices are not equal-sized`, audit);
  assert(audit.panelWidthDelta <= 1 && audit.panelHeightDelta <= 1, `${label}: numeric choices do not fill the choices area`, audit);
  assert(audit.minValueHeight >= 21, `${label}: rendered numeric choices are too short`, audit);
  assert(audit.interaction === 'floor-panel' && !audit.hasDownZone && !audit.hasDirectChoice, `${label}: obsolete drag-down interaction remains`, audit);
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
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial' && document.getElementById('tutorialStartButton').textContent.trim() === '다음'", `${viewport.name}: tutorial 1 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "03-tutorial-1"));
  await auditGeometry(page, `${viewport.name} tutorial 1`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.getElementById('tutorialStartButton').textContent.trim() === '문제 시작'", `${viewport.name}: tutorial 2 not shown`);
  shots.push(await screenshot(page, lesson, viewport, "04-tutorial-2"));
  await auditGeometry(page, `${viewport.name} tutorial 2`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play not shown`);
  if (lesson === "3-2-2-3-mathmon-star-pickup") {
    await evaluate(page, "window.__starPickupQa.forceProblem(47, 6)");
    await waitUntil(page, "document.querySelectorAll('.star-loose-grid .star-glyph[data-tone=\"loose\"]').length === 47", `${viewport.name}: fixed 47-star board did not render`);
  }
  shots.push(await screenshot(page, lesson, viewport, "05-play-step1"));
  await auditGeometry(page, `${viewport.name} play`);
  if (lesson === "3-2-2-2-mathmon-elevator") {
    await auditElevatorPlayHeader(page, `${viewport.name} play header`);
    await auditElevatorLearningLegibility(page, `${viewport.name} learning legibility`);
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
    await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)} && window.__mathmonEngineQa.getState().inputLocked === false`, `${viewport.name}: tens share did not advance`, 8000);
    shots.push(await screenshot(page, lesson, viewport, "05c-play-step2"));
    await auditGeometry(page, `${viewport.name} ones share`);

    beforeStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep()?.id || ''");
    await clickChoice(page, true);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct' && Boolean(document.querySelector('.farm-share-confirmation'))", `${viewport.name}: ones confirmation did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-ones-confirm"));
    await auditGeometry(page, `${viewport.name} ones confirmation`);
    await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || '') !== ${JSON.stringify(beforeStep)} && window.__mathmonEngineQa.getState().inputLocked === false`, `${viewport.name}: ones share did not advance`, 8000);
    shots.push(await screenshot(page, lesson, viewport, "05d-play-quotient"));
    await auditGeometry(page, `${viewport.name} quotient entry`);

    await clickChoice(page, false);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && Boolean(document.querySelector('.farm-quotient-entry.is-wrong'))", `${viewport.name}: quotient wrong feedback did not appear`);
    shots.push(await screenshot(page, lesson, viewport, "05e-play-quotient-wrong"));
    await auditGeometry(page, `${viewport.name} quotient wrong feedback`);
    await waitUntil(page, "window.__mathmonEngineQa.getState().inputLocked === false", `${viewport.name}: quotient input stayed locked`);
    await solveCurrentProblem(page);
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
  if (lesson === "3-2-2-4-mathmon-check-lock") await auditCheckLockCompleteLayout(page, `${viewport.name} final confirmation`);
  await clickSelector(page, "#rewardButton");
  const firstReward = await waitForReward(page, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07-reward-closed"));
  await auditGeometry(page, `${viewport.name} closed reward`);
  await revealReward(page, firstReward, viewport.name);
  shots.push(await screenshot(page, lesson, viewport, "07b-reward-open"));
  await auditGeometry(page, `${viewport.name} revealed reward`);
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
    await clickSelector(page, "#rewardButton");
    const reward = await waitForReward(page, `${viewport.name} problem ${problemIndex}`);
    await revealReward(page, reward, `${viewport.name} problem ${problemIndex}`);
    await clickSelector(page, reward.nextSelector);
  }
  if (lesson === "3-2-2-4-mathmon-check-lock") {
    assert(checkLockMatchCaptured, `${viewport.name}: matching auto-comparison state was not captured`);
  }

  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-result'", `${viewport.name}: result not shown`, 8000);
  if (lesson === "3-2-2-2-mathmon-elevator") {
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

  if (lesson === "3-2-2-3-mathmon-star-pickup") {
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
