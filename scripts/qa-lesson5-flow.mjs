#!/usr/bin/env node
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { loadLessonSourceModel } from "./lib/load-lesson-source-model.mjs";

const ROOT = process.cwd();
const BASE_SEED = 20260723;
const LESSONS = [
  "3-2-5-1-mathmon-water-fill",
  "3-2-5-2-mathmon-drink-order",
  "3-2-5-3-mathmon-scale-balance",
  "3-2-5-4-mathmon-package-weight",
];
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800, dpr: 1 },
  { name: "tablet-landscape", width: 1024, height: 768, dpr: 1 },
  { name: "short-dpr2", width: 1280, height: 720, dpr: 2 },
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
  if (condition) return;
  const error = new Error(message);
  if (details !== undefined) error.details = details;
  throw error;
}

function getChromePath() {
  const candidate = CHROME_CANDIDATES.find((item) => fs.existsSync(item));
  assert(candidate, `Chrome not found: ${CHROME_CANDIDATES.join(", ")}`);
  return candidate;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => typeof address === "object" && address ? resolve(address.port) : reject(new Error("port allocation failed")));
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
    let pathname;
    try {
      pathname = decodeURIComponent(requestUrl.pathname);
    } catch {
      response.writeHead(400);
      response.end("bad path");
      return;
    }
    const resolved = path.resolve(ROOT, `.${pathname}`);
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
        response.writeHead(error.code === "ENOENT" ? 404 : 500);
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
  const stopped = await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(2000).then(() => false),
  ]);
  if (stopped) return;
  child.kill("SIGKILL");
}

async function fetchJson(url, attempts = 60) {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) return response.json();
      lastError = new Error(`HTTP ${response.status}: ${url}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw lastError || new Error(`request failed: ${url}`);
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
    if (message.error) pending.reject(new Error(message.error.message || JSON.stringify(message.error)));
    else pending.resolve(message.result || {});
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 20000);
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

async function launchChrome(pageUrl, debugPort, profileDir) {
  const child = spawn(getChromePath(), [
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
  return child;
}

async function waitForPageTarget(debugPort) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`, 1).catch(() => []);
    const page = targets.find((target) => target.type === "page" && target.webSocketDebuggerUrl);
    if (page) return page.webSocketDebuggerUrl;
    await delay(100);
  }
  throw new Error("Chrome page target not found");
}

async function evaluate(page, expression) {
  const response = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (response.exceptionDetails) {
    throw new Error(response.exceptionDetails.exception?.description || response.exceptionDetails.text || "browser evaluation failed");
  }
  return response.result?.value;
}

async function waitUntil(page, expression, message, timeout = 7000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(page, expression)) return;
    await delay(70);
  }
  throw new Error(message);
}

async function waitForLoad(page) {
  await waitUntil(page, "document.readyState === 'complete'", "page load timed out");
  await evaluate(page, `Promise.all([...document.images].map((image) => image.complete
    ? true
    : new Promise((resolve) => {
        image.addEventListener("load", resolve, { once:true });
        image.addEventListener("error", resolve, { once:true });
      })))`);
}

async function setViewport(page, viewport) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.dpr,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 },
  });
}

async function clickSelector(page, selector) {
  const point = await evaluate(page, `(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) throw new Error("Missing selector: " + ${JSON.stringify(selector)});
    const rect = node.getBoundingClientRect();
    return { x:rect.left + rect.width / 2, y:rect.top + rect.height / 2, width:rect.width, height:rect.height };
  })()`);
  assert(point.width >= 1 && point.height >= 1, `${selector} is not clickable`, point);
  await page.send("Input.dispatchMouseEvent", { type: "mouseMoved", x: point.x, y: point.y, button: "none" });
  await page.send("Input.dispatchMouseEvent", { type: "mousePressed", x: point.x, y: point.y, button: "left", buttons: 1, clickCount: 1 });
  await page.send("Input.dispatchMouseEvent", { type: "mouseReleased", x: point.x, y: point.y, button: "left", buttons: 0, clickCount: 1 });
  await delay(80);
}

async function capture(page, lesson, viewport, name) {
  const result = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const outputDir = path.join(ROOT, lesson, "screenshots");
  await fsp.mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `qa5-${viewport.name}-${name}.png`);
  await fsp.writeFile(filePath, Buffer.from(result.data, "base64"));
  return path.relative(ROOT, filePath);
}

function findQaSeeds(lesson, offset) {
  const { config, model } = loadLessonSourceModel(ROOT, lesson);
  const requiredTypes = [...new Set(config.typesPerRun || [])];
  const byType = {};
  let primary = null;
  let primaryType = "";
  for (let seed = BASE_SEED + offset; seed < BASE_SEED + offset + 100000; seed += 1) {
    const firstProblem = model.generateRun(seed)[0];
    const firstStep = firstProblem?.steps?.[0];
    if (!firstProblem || !firstStep) continue;
    const wrongChoices = firstStep.choices.filter((choice) => !model.validateChoice(firstStep, choice));
    const relations = new Set(wrongChoices.map((choice) => choice.relation));
    if (requiredTypes.includes(firstProblem.type) && byType[firstProblem.type] == null && wrongChoices.length >= 2) {
      byType[firstProblem.type] = seed;
    }
    if (primary == null && relations.has("low") && relations.has("high")) {
      primary = seed;
      primaryType = firstProblem.type;
    }
    if (primary != null && requiredTypes.every((type) => byType[type] != null)) break;
  }
  assert(primary != null, `${lesson}: no QA seed with low/high first-step choices`);
  assert(requiredTypes.every((type) => byType[type] != null), `${lesson}: missing problem-type QA seed`, { requiredTypes, byType });
  return { primary, primaryType, byType };
}

async function auditLayout(page, label, { requireRewardMargin = false, baselineVisual = null } = {}) {
  const audit = await evaluate(page, `(() => {
    const shown = (node) => {
      if (!node) return false;
      const style = getComputedStyle(node);
      const rect = node.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && !node.hidden && rect.width > 2 && rect.height > 2;
    };
    const box = (node) => {
      if (!shown(node)) return null;
      const rect = node.getBoundingClientRect();
      return { left:rect.left, top:rect.top, right:rect.right, bottom:rect.bottom, width:rect.width, height:rect.height, cx:rect.left + rect.width / 2, cy:rect.top + rect.height / 2 };
    };
    const overlap = (a, b) => !a || !b ? 0 : Math.max(0, Math.min(a.right,b.right) - Math.max(a.left,b.left)) * Math.max(0, Math.min(a.bottom,b.bottom) - Math.max(a.top,b.top));
    const stage = box(document.querySelector(".stage-shell"));
    const active = document.querySelector(".screen.is-active");
    const regionNodes = active?.id === "screen-play"
      ? [active.querySelector(".problem-card"), active.querySelector(".step-board"), active.querySelector(".choices-panel"), active.querySelector(".complete-panel")].filter(shown)
      : [];
    const intersections = [];
    for (let left = 0; left < regionNodes.length; left += 1) {
      for (let right = left + 1; right < regionNodes.length; right += 1) {
        const area = overlap(box(regionNodes[left]), box(regionNodes[right]));
        if (area > 0.5) intersections.push({ left:regionNodes[left].className, right:regionNodes[right].className, area });
      }
    }
    const overflowSelectors = [
      ".brand-badge", ".unit-badge", ".mini-badge", ".screen-title", ".big-problem",
      ".instruction", ".feedback-line", ".answer-slot", ".step-chip", ".choice-button",
      ".complete-text", ".primary-button", ".reward-change", ".settings-modal button",
      ".column-head", ".column-row", ".column-attempt", ".weight-column-head",
      ".weight-column-row", ".weight-column-attempt", ".limit-axis-difference",
      ".amount-axis-difference", ".scale-difference"
    ];
    const overflowing = [...document.querySelectorAll(overflowSelectors.join(","))]
      .filter(shown)
      .filter((node) => node.scrollWidth > node.clientWidth + 3 || node.scrollHeight > node.clientHeight + 3)
      .map((node) => ({ selector:node.id ? "#" + node.id : node.className, client:[node.clientWidth,node.clientHeight], scroll:[node.scrollWidth,node.scrollHeight], text:node.textContent.trim().slice(0,80) }));
    const touch = [...document.querySelectorAll("button")].filter(shown).map((node) => ({ selector:node.id ? "#" + node.id : node.className, box:box(node) }));
    const smallTouch = touch.filter((item) => item.box.width < 42 || item.box.height < 42);
    const fontRules = [
      { selector:"#problemTitle", min:28 },
      { selector:"#stepInstruction", min:16 },
      { selector:".choice-button", min:18 },
      { selector:"#feedbackLine", min:14 },
      { selector:".primary-button", min:16 },
      { selector:".step-chip", min:12 }
    ];
    const smallFonts = fontRules.flatMap((rule) => [...document.querySelectorAll(rule.selector)]
      .filter(shown)
      .filter((node) => {
        const style = getComputedStyle(node);
        return parseFloat(style.fontSize) > 0 && style.color !== "transparent" && style.color !== "rgba(0, 0, 0, 0)";
      })
      .map((node) => ({ selector:node.id ? "#" + node.id : node.className, size:parseFloat(getComputedStyle(node).fontSize), min:rule.min, text:node.textContent.trim().slice(0,60) }))
      .filter((item) => item.size + .01 < item.min));
    const sizeRules = [
      { selector:"#visualArea", minWidth:300, minHeight:240 },
      { selector:"#answerSlot", minWidth:150, minHeight:70 },
      { selector:".choice-button", minWidth:96, minHeight:60 },
      { selector:".column-board", minWidth:360, minHeight:180 },
      { selector:".weight-column-board", minWidth:360, minHeight:180 },
      { selector:".amount-axis", minWidth:360, minHeight:100 },
      { selector:".limit-axis", minWidth:360, minHeight:100 },
      { selector:"#screen-reward .reward-object", minWidth:180, minHeight:180 }
    ];
    const keyTooSmall = sizeRules.flatMap((rule) => [...document.querySelectorAll(rule.selector)]
      .filter(shown)
      .map((node) => ({ selector:node.id ? "#" + node.id : node.className, box:box(node), rule }))
      .filter((item) => item.box.width + .5 < rule.minWidth || item.box.height + .5 < rule.minHeight));
    const settings = box(document.getElementById("settingsButton"));
    const headerControls = [...(active?.querySelectorAll(".top-row > *, .hud .brand-badge, .hud .unit-badge, .hud .mini-badge, .hud .progress-line") || [])].filter(shown);
    const start = box(document.getElementById("startButton"));
    const startArt = box(document.querySelector("#startButton .start-button-art"));
    const visual = box(document.getElementById("visualArea"));
    const rewardButton = box(document.getElementById("rewardNextButton"));
    const completePanel = box(document.getElementById("completePanel"));
    const completeButton = box(document.getElementById("rewardButton"));
    const actionOnly = document.getElementById("completePanel")?.classList.contains("is-action-only") || false;
    const problemGrid = box(active?.querySelector(".problem-grid"));
    const problemCard = box(active?.querySelector(".problem-card"));
    const stepBoard = box(active?.querySelector(".step-board"));
    const choicesPanel = box(active?.querySelector(".choices-panel"));
    const learning = active?.id === "screen-play" && stage ? {
      gridWidthRatio:problemGrid ? problemGrid.width / stage.width : 0,
      gridHeightRatio:problemGrid ? problemGrid.height / stage.height : 0,
      problemWidthRatio:problemCard ? problemCard.width / stage.width : 0,
      visualHeightRatio:visual && problemCard ? visual.height / problemCard.height : 0,
      stepWidthRatio:stepBoard ? stepBoard.width / stage.width : 0,
      choicesWidthRatio:choicesPanel ? choicesPanel.width / stage.width : null
    } : null;
    const surfaceSelectors = [
      ".problem-card", ".step-board", ".choices-panel", ".complete-panel",
      ".reward-panel", ".settings-modal", ".tutorial-poster-stage"
    ];
    const outsideStage = stage ? [...document.querySelectorAll(surfaceSelectors.join(","))]
      .filter(shown)
      .map((node) => ({ selector:node.id ? "#" + node.id : node.className, box:box(node) }))
      .filter((item) => item.box.left < stage.left - 1 || item.box.top < stage.top - 1 || item.box.right > stage.right + 1 || item.box.bottom > stage.bottom + 1) : [];
    const distortedImages = [...document.images]
      .filter(shown)
      .filter((image) => getComputedStyle(image).objectFit === "fill")
      .map((image) => {
        const imageBox = box(image);
        const naturalRatio = image.naturalWidth / image.naturalHeight;
        const renderedRatio = imageBox.width / imageBox.height;
        return { source:image.getAttribute("src"), naturalRatio, renderedRatio, difference:Math.abs(naturalRatio - renderedRatio) };
      })
      .filter((image) => image.difference > .005);
    const visualCollisionGroups = [
      [...document.querySelectorAll(".limit-axis-marker b")],
      [...document.querySelectorAll(".limit-axis-values > span")],
      [...document.querySelectorAll(".amount-marker b")],
      [...document.querySelectorAll(".amount-axis-values > span")]
    ];
    const mathVisualCollisions = [];
    for (const group of visualCollisionGroups) {
      const visibleGroup = group.filter(shown);
      for (let left = 0; left < visibleGroup.length; left += 1) {
        for (let right = left + 1; right < visibleGroup.length; right += 1) {
          const area = overlap(box(visibleGroup[left]), box(visibleGroup[right]));
          if (area > .5) {
            mathVisualCollisions.push({
              left:visibleGroup[left].textContent.trim(),
              right:visibleGroup[right].textContent.trim(),
              area
            });
          }
        }
      }
    }
    const boundaryLabelsOutside = [...document.querySelectorAll(".measure-tick.is-min .measure-tick-label,.measure-tick.is-max .measure-tick-label")]
      .filter(shown)
      .map((node) => ({ text:node.textContent.trim(), box:box(node), bottle:box(node.closest(".measure-bottle")) }))
      .filter((item) => !item.bottle || item.box.left < item.bottle.left + 3 || item.box.top < item.bottle.top + 3 || item.box.right > item.bottle.right - 3 || item.box.bottom > item.bottle.bottom - 3);
    const ambiguousPlaceholder = ["#boardLiter", "#weightBoardKg"]
      .map((selector) => document.querySelector(selector))
      .filter(shown)
      .some((node) => node.textContent.trim() === "·");
    const imagesMissing = [...document.images].filter((image) => shown(image) && (!image.complete || image.naturalWidth === 0)).map((image) => image.getAttribute("src"));
    return {
      screen:active?.id || "",
      stage,
      ratio:stage ? stage.width / stage.height : 0,
      intersections,
      overflowing,
      smallTouch,
      smallFonts,
      keyTooSmall,
      outsideStage,
      distortedImages,
      mathVisualCollisions,
      boundaryLabelsOutside,
      ambiguousPlaceholder,
      topSettingsOverlap:headerControls.reduce((maximum, node) => Math.max(maximum, overlap(box(node), settings)), 0),
      startDelta:start && startArt ? { left:Math.abs(start.left-startArt.left), top:Math.abs(start.top-startArt.top), right:Math.abs(start.right-startArt.right), bottom:Math.abs(start.bottom-startArt.bottom) } : null,
      visual,
      learning,
      completeActionCenterDelta:actionOnly && completePanel && completeButton ? Math.abs(completePanel.cx - completeButton.cx) : null,
      rewardBottomMargin:stage && rewardButton ? stage.bottom - rewardButton.bottom : null,
      imagesMissing
    };
  })()`);
  assert(Math.abs(audit.ratio - 1.6) <= 0.002, `${label}: stage ratio`, audit);
  assert(audit.intersections.length === 0, `${label}: layout regions overlap`, audit);
  assert(audit.overflowing.length === 0, `${label}: text overflow`, audit);
  assert(audit.smallTouch.length === 0, `${label}: touch target below 42px`, audit);
  assert(audit.smallFonts.length === 0, `${label}: student text is too small`, audit);
  assert(audit.keyTooSmall.length === 0, `${label}: key learning or reward element is too small`, audit);
  assert(audit.outsideStage.length === 0, `${label}: surface leaves the 16:10 stage`, audit);
  assert(audit.distortedImages.length === 0, `${label}: visible image uses distorted fill sizing`, audit);
  assert(audit.mathVisualCollisions.length === 0, `${label}: labels collide inside the math visual`, audit);
  assert(audit.boundaryLabelsOutside.length === 0, `${label}: end tick label touches the bottle border`, audit);
  assert(!audit.ambiguousPlaceholder, `${label}: pending unit column uses an ambiguous multiplication dot`, audit);
  assert(audit.topSettingsOverlap <= 0.5, `${label}: settings overlaps header`, audit);
  assert(audit.imagesMissing.length === 0, `${label}: visible image missing`, audit);
  if (audit.startDelta) {
    assert(Object.values(audit.startDelta).every((delta) => delta <= 1), `${label}: start art and hitbox differ`, audit);
  }
  if (baselineVisual && audit.visual) {
    assert(Math.abs(audit.visual.cx - baselineVisual.cx) <= 1, `${label}: visual center shifted`, { baselineVisual, audit });
    assert(Math.abs(audit.visual.left - baselineVisual.left) <= 1 && Math.abs(audit.visual.right - baselineVisual.right) <= 1, `${label}: visual width shifted`, { baselineVisual, audit });
  }
  if (audit.learning) {
    assert(audit.learning.gridWidthRatio >= .9 && audit.learning.gridHeightRatio >= .7, `${label}: learning grid is too small`, audit);
    assert(audit.learning.problemWidthRatio >= .43, `${label}: primary problem area is too narrow`, audit);
    assert(audit.learning.visualHeightRatio >= .45, `${label}: central math visual is too short`, audit);
    assert(audit.learning.stepWidthRatio >= .25, `${label}: current-step board is too narrow`, audit);
    if (audit.learning.choicesWidthRatio != null) {
      assert(audit.learning.choicesWidthRatio >= .25, `${label}: choice area is too narrow`, audit);
    }
  }
  if (audit.completeActionCenterDelta != null) {
    assert(audit.completeActionCenterDelta <= 1, `${label}: completion action is not centered`, audit);
  }
  if (requireRewardMargin) {
    assert(audit.rewardBottomMargin >= 16, `${label}: reward button is too close to stage edge`, audit);
  }
  return audit;
}

async function auditAttemptEvidence(page, label, relation) {
  const evidence = await evaluate(page, `(() => {
    const feedback = document.getElementById("feedbackLine");
    const marker = document.querySelector(".chosen-level:not([hidden])");
    const capacityBoard = document.querySelector(".column-board[data-attempt]");
    const weightBoard = document.querySelector(".weight-column-board[data-attempt]");
    const amountAxis = document.querySelector(".amount-axis[data-attempt]");
    const limitAxis = document.querySelector(".limit-axis[data-attempt]");
    const pickedBottle = document.querySelector(".bottle-wrap[data-picked-side]");
    const scale = document.querySelector(".scale-visual");
    const scaleDifference = document.getElementById("scaleDifference");
    const changedScale = scale && (scale.dataset.attempt !== "waiting" || (scaleDifference?.textContent.trim() || ""));
    return {
      feedback:feedback?.textContent.trim() || "",
      state:feedback?.dataset.state || "",
      visualChanged:Boolean(marker || capacityBoard || weightBoard || amountAxis || limitAxis || pickedBottle || changedScale),
      wrongButtons:[...document.querySelectorAll(".choice-button[data-state='wrong']")].map((button) => ({
        relation:button.dataset.relation || "",
        text:button.textContent.trim()
      })),
      relation:${JSON.stringify(relation)}
    };
  })()`);
  assert(evidence.state === "wrong" && evidence.feedback, `${label}: wrong feedback missing`, evidence);
  assert(evidence.visualChanged, `${label}: chosen wrong value was not kept in the visual`, evidence);
  assert(evidence.wrongButtons.length === 1, `${label}: only the latest wrong choice may stay red`, evidence);
  assert(evidence.wrongButtons[0].relation === relation, `${label}: the wrong highlight does not match the latest choice`, evidence);
}

async function auditStepLock(page, label) {
  const chips = await evaluate(page, `[...document.querySelectorAll(".step-chip")].map((chip) => ({
    text:chip.textContent.trim(), current:chip.classList.contains("is-current"), done:chip.classList.contains("is-done")
  }))`);
  const currentIndex = chips.findIndex((chip) => chip.current);
  assert(currentIndex >= 0, `${label}: current step chip missing`, chips);
  assert(chips.slice(currentIndex + 1).every((chip) => chip.text === "?"), `${label}: future step must stay locked`, chips);
}

async function solveFirstProblem(page, lesson, viewport, shots, { prefix = "", wrongRelations = ["low", "high"] } = {}) {
  const shotName = (name) => prefix ? `${prefix}-${name}` : name;
  const waitingAudit = await auditLayout(page, `${lesson} ${viewport.name} play waiting`);
  await auditStepLock(page, `${lesson} ${viewport.name} play waiting`);
  const scaleWaiting = await evaluate(page, `(() => {
    const beam = document.querySelector(".scale-beam");
    return beam ? getComputedStyle(beam).transform : null;
  })()`);
  if (lesson.includes("scale-balance")) {
    assert(scaleWaiting === "matrix(1, 0, 0, 1, 0, 0)" || scaleWaiting === "none", `${lesson} ${viewport.name}: scale reveals answer before selection`, scaleWaiting);
  }

  for (let index = 0; index < wrongRelations.length; index += 1) {
    const relation = wrongRelations[index];
    await clickSelector(page, `button.choice-button[data-relation='${relation}'][data-correct='false']:not(:disabled)`);
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false", `${lesson} ${viewport.name}: ${relation} wrong state`);
    const sequence = String(index + 6).padStart(2, "0");
    shots.push(await capture(page, lesson, viewport, shotName(`${sequence}-wrong-${relation}`)));
    await auditAttemptEvidence(page, `${lesson} ${viewport.name} ${relation} wrong`, relation);
    await auditLayout(page, `${lesson} ${viewport.name} ${relation} wrong`);
  }

  let stepNumber = 1;
  while (true) {
    const before = await evaluate(page, `(() => {
      const step = window.__mathmonEngineQa.getCurrentStep();
      const problem = window.__mathmonEngineQa.getCurrentProblem();
      return { id:step.id, last:problem.steps.at(-1).id === step.id };
    })()`);
    await clickSelector(page, "button.choice-button[data-correct='true']:not(:disabled)");
    await waitUntil(page, "document.getElementById('feedbackLine').dataset.state === 'correct'", `${lesson} ${viewport.name}: step ${stepNumber} confirmation`);
    const choiceState = await evaluate(page, `(() => ({
      wrong:document.querySelectorAll(".choice-button[data-state='wrong']").length,
      correct:document.querySelectorAll(".choice-button[data-state='correct']").length
    }))()`);
    assert(choiceState.wrong === 0 && choiceState.correct === 1, `${lesson} ${viewport.name}: correct confirmation keeps stale choice colors`, choiceState);
    shots.push(await capture(page, lesson, viewport, shotName(`08-step-${stepNumber}-confirm`)));
    await auditLayout(page, `${lesson} ${viewport.name} step ${stepNumber} confirmation`);
    if (before.last) break;
    await waitUntil(page, `(window.__mathmonEngineQa.getCurrentStep()?.id || "") !== ${JSON.stringify(before.id)} && window.__mathmonEngineQa.getState().inputLocked === false`, `${lesson} ${viewport.name}: step ${stepNumber} did not advance`);
    stepNumber += 1;
    shots.push(await capture(page, lesson, viewport, shotName(`09-step-${stepNumber}-waiting`)));
    await auditStepLock(page, `${lesson} ${viewport.name} step ${stepNumber} waiting`);
    await auditLayout(page, `${lesson} ${viewport.name} step ${stepNumber} waiting`);
  }

  await waitUntil(page, "document.getElementById('completePanel').classList.contains('is-visible')", `${lesson} ${viewport.name}: complete panel`);
  const completion = await evaluate(page, `(() => ({
    actionOnly:document.getElementById("completePanel").classList.contains("is-action-only"),
    expressionVisible:!document.getElementById("completeExpression").hidden,
    expression:document.getElementById("completeExpression").textContent.trim()
  }))()`);
  assert(completion.actionOnly && !completion.expressionVisible && !completion.expression, `${lesson} ${viewport.name}: completion repeats a wrapping expression`, completion);
  shots.push(await capture(page, lesson, viewport, shotName("10-complete")));
  await auditLayout(page, `${lesson} ${viewport.name} complete`, { baselineVisual: waitingAudit.visual });
}

async function openLessonFlow(page, lesson, viewport, pageUrl, seed, shots) {
  await setViewport(page, viewport);
  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await page.send("Page.navigate", { url: `${pageUrl}/${lesson}/index.html?seed=${seed}&qa=lesson5-${viewport.name}` });
  await waitForLoad(page);
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-cover'", `${lesson} ${viewport.name}: cover`);
  const canonical = await evaluate(page, `(() => ({
    marker:document.querySelector(".game")?.dataset.coverStartAsset,
    source:document.querySelector("#startButton img")?.getAttribute("src")
  }))()`);
  assert(canonical.marker === "shared-canonical-v1" && canonical.source === "../_shared/mathmon/cover-start-button/start-button-generated.webp", `${lesson}: shared start button contract`, canonical);
  shots.push(await capture(page, lesson, viewport, "01-cover"));
  await auditLayout(page, `${lesson} ${viewport.name} cover`);

  await clickSelector(page, "#settingsButton");
  await waitUntil(page, "!document.getElementById('settingsBackdrop').hidden", `${lesson} ${viewport.name}: settings open`);
  shots.push(await capture(page, lesson, viewport, "02-settings"));
  await auditLayout(page, `${lesson} ${viewport.name} settings`);
  await clickSelector(page, "#settingsCloseButton");

  await clickSelector(page, "#startButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial'", `${lesson} ${viewport.name}: tutorial 1`);
  shots.push(await capture(page, lesson, viewport, "03-tutorial-1"));
  await auditLayout(page, `${lesson} ${viewport.name} tutorial 1`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.getElementById('tutorialStartButton').textContent.trim() === '문제 시작'", `${lesson} ${viewport.name}: tutorial 2`);
  shots.push(await capture(page, lesson, viewport, "04-tutorial-2"));
  await auditLayout(page, `${lesson} ${viewport.name} tutorial 2`);
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${lesson} ${viewport.name}: play`);
  shots.push(await capture(page, lesson, viewport, "05-play-waiting"));
}

async function openProblemVariant(page, lesson, viewport, pageUrl, type, seed, shots) {
  await setViewport(page, viewport);
  await page.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  await page.send("Page.navigate", { url: `${pageUrl}/${lesson}/index.html?seed=${seed}&qa=lesson5-type-${type}-${viewport.name}` });
  await waitForLoad(page);
  await evaluate(page, "window.__mathmonEngineQa.startGame()");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${lesson} ${viewport.name} ${type}: play`);
  const variant = await evaluate(page, `(() => {
    const problem = window.__mathmonEngineQa.getCurrentProblem();
    const step = window.__mathmonEngineQa.getCurrentStep();
    const relations = [...new Set([...document.querySelectorAll(".choice-button[data-correct='false']")]
      .map((button) => button.dataset.relation)
      .filter(Boolean))];
    return { type:problem?.type || "", step:step?.id || "", relations };
  })()`);
  assert(variant.type === type, `${lesson} ${viewport.name}: requested problem type was not generated`, { type, seed, variant });
  const wrongRelations = variant.relations.includes("low") && variant.relations.includes("high")
    ? ["low", "high"]
    : variant.relations.slice(0, 2);
  assert(wrongRelations.length === 2, `${lesson} ${viewport.name} ${type}: two representative wrong states are required`, variant);
  shots.push(await capture(page, lesson, viewport, `type-${type}-05-play-waiting`));
  return wrongRelations;
}

async function auditReward(page, lesson, viewport, shots) {
  await evaluate(page, `(() => {
    const button = document.getElementById("rewardButton");
    button.click();
    button.click();
  })()`);
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-reward'", `${lesson} ${viewport.name}: reward`);
  const stageReveal = await evaluate(page, "document.querySelector('.game').dataset.rewardMode === 'stage-reveal'");
  if (stageReveal) {
    const before = await evaluate(page, "window.__mathmonEngineQa.getState()");
    assert(before.rewardPhase === "closed" && before.power === 0, `${lesson} ${viewport.name}: closed reward was applied early or twice`, before);
    shots.push(await capture(page, lesson, viewport, "11-reward-closed"));
    await auditLayout(page, `${lesson} ${viewport.name} reward closed`, { requireRewardMargin: viewport.name === "short-dpr2" });
    await clickSelector(page, "#rewardNextButton");
    await waitUntil(page, "window.__mathmonEngineQa.getState().rewardPhase === 'revealed'", `${lesson} ${viewport.name}: reward reveal`);
    const after = await evaluate(page, `(() => ({
      state:window.__mathmonEngineQa.getState(),
      line:document.getElementById("rewardChange").textContent.trim(),
      phase:document.querySelector(".truck-reward-stage")?.dataset.phase || ""
    }))()`);
    assert(after.state.power > 0 && after.phase === "revealed", `${lesson} ${viewport.name}: reward did not apply once`, after);
    assert(!after.line.includes("황금밭"), `${lesson} ${viewport.name}: farm copy leaked into truck reward`, after);
    shots.push(await capture(page, lesson, viewport, "12-reward-open"));
    await auditLayout(page, `${lesson} ${viewport.name} reward open`, { requireRewardMargin: viewport.name === "short-dpr2" });
  } else {
    const state = await evaluate(page, "window.__mathmonEngineQa.getState()");
    assert(state.rewardPhase === "revealed" && state.power > 0, `${lesson} ${viewport.name}: stage reward did not apply exactly once`, state);
    const visibleCopyCount = await evaluate(page, `[...document.querySelectorAll("#screen-reward .reward-title,#screen-reward .reward-stage,#screen-reward .reward-change")]
      .filter((node) => getComputedStyle(node).display !== "none" && node.textContent.trim()).length`);
    assert(visibleCopyCount === 1, `${lesson} ${viewport.name}: reward repeats title/stage/copy`, visibleCopyCount);
    const meter = await evaluate(page, `(() => {
      const object = document.querySelector("#screen-reward .reward-object");
      const liquid = document.getElementById("rewardLiquid");
      return {
        direction:object?.dataset.direction || "",
        symbol:object?.dataset.symbol || "",
        fill:liquid?.style.getPropertyValue("--fill") || ""
      };
    })()`);
    assert(meter.direction && meter.symbol && meter.fill && meter.fill !== "0%", `${lesson} ${viewport.name}: reward meter is visually empty`, meter);
    shots.push(await capture(page, lesson, viewport, "11-reward"));
    await auditLayout(page, `${lesson} ${viewport.name} reward`);
  }
}

async function captureResultTiers(page, lesson, viewport, shots) {
  const cases = await evaluate(page, `(() => {
    const tiers = LESSON_CONFIG.results;
    return [tiers[0], tiers[Math.floor(tiers.length / 2)], tiers.at(-1)].map((tier) => ({
      id:tier.id,
      power:tier.minPower,
      correct:tier.minCorrect,
      special:Boolean(tier.needsSpecial)
    }));
  })()`);
  const names = ["low", "middle", "top"];
  for (let index = 0; index < cases.length; index += 1) {
    const item = cases[index];
    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:${item.power},
        correctFirstTry:${item.correct},
        specialSeen:${item.special},
        currentResult:null
      });
      window.__mathmonEngineQa.showResult();
    })()`);
    await waitUntil(page, `document.getElementById("screen-result").dataset.resultTier === ${JSON.stringify(item.id)}
      && document.getElementById("resultBg").complete
      && document.getElementById("resultBg").naturalWidth > 0`, `${lesson} ${viewport.name}: result ${item.id}`);
    shots.push(await capture(page, lesson, viewport, `13-result-${names[index]}-${item.id}`));
    await auditLayout(page, `${lesson} ${viewport.name} result ${item.id}`);
  }
}

async function runCase(page, serverOrigin, lesson, viewport, seed) {
  const shots = [];
  await openLessonFlow(page, lesson, viewport, serverOrigin, seed, shots);
  await solveFirstProblem(page, lesson, viewport, shots);
  await auditReward(page, lesson, viewport, shots);
  await captureResultTiers(page, lesson, viewport, shots);
  return { lesson, viewport, seed, shots };
}

async function runVariantCase(page, serverOrigin, lesson, viewport, type, seed) {
  const shots = [];
  const wrongRelations = await openProblemVariant(page, lesson, viewport, serverOrigin, type, seed, shots);
  await solveFirstProblem(page, lesson, viewport, shots, { prefix: `type-${type}`, wrongRelations });
  return { lesson, viewport, type, seed, wrongRelations, shots };
}

async function main() {
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = await fsp.mkdtemp(path.join(os.tmpdir(), "lesson5-flow-qa-"));
  const server = await makeServer(serverPort);
  const serverOrigin = `http://127.0.0.1:${serverPort}`;
  let chrome;
  let page;
  try {
    chrome = await launchChrome(`${serverOrigin}/${LESSONS[0]}/index.html`, debugPort, profileDir);
    page = new Cdp(await waitForPageTarget(debugPort));
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    const seeds = Object.fromEntries(LESSONS.map((lesson, index) => [lesson, findQaSeeds(lesson, index * 10000)]));
    const results = [];
    const variantResults = [];
    for (const lesson of LESSONS) {
      for (const viewport of VIEWPORTS) {
        const eventStart = page.events.length;
        results.push(await runCase(page, serverOrigin, lesson, viewport, seeds[lesson].primary));
        const runtimeErrors = page.events.slice(eventStart).filter((event) => event.method === "Runtime.exceptionThrown");
        assert(runtimeErrors.length === 0, `${lesson} ${viewport.name}: runtime exception`, runtimeErrors);
      }
      for (const [type, seed] of Object.entries(seeds[lesson].byType)) {
        if (type === seeds[lesson].primaryType) continue;
        for (const viewport of VIEWPORTS) {
          const eventStart = page.events.length;
          variantResults.push(await runVariantCase(page, serverOrigin, lesson, viewport, type, seed));
          const runtimeErrors = page.events.slice(eventStart).filter((event) => event.method === "Runtime.exceptionThrown");
          assert(runtimeErrors.length === 0, `${lesson} ${viewport.name} ${type}: runtime exception`, runtimeErrors);
        }
      }
    }
    console.log("QA_LESSON5_FLOW: PASS");
    console.log(JSON.stringify({ lessons: LESSONS, viewports: VIEWPORTS, seeds, results, variantResults }, null, 2));
  } finally {
    page?.close();
    await stopProcess(chrome);
    await closeServer(server);
    await fsp.rm(profileDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error(error.stack || error);
  if (error.details !== undefined) console.error(JSON.stringify(error.details, null, 2));
  process.exitCode = 1;
});
