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
const LESSON = "3-2-5-4-mathmon-package-weight";
const LESSON_CONFIG = JSON.parse(fs.readFileSync(path.join(ROOT, "_lessons", LESSON, "lesson.json"), "utf8"));
const QA_VIEWPORTS = LESSON_CONFIG.qa.viewports;
const RESULT_AUDIT = LESSON_CONFIG.qa.resultVisualAudit;
const DEFAULT_SEED = 424242;
const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
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

function parseArgs(argv) {
  const options = { seed: DEFAULT_SEED, visualOnly:false, impactOnly:false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--seed") {
      options.seed = Number(argv[++index]);
      continue;
    }
    if (arg === "--visual-only") {
      options.visualOnly = true;
      continue;
    }
    if (arg === "--impact-only") {
      options.impactOnly = true;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }
  if (!Number.isInteger(options.seed) || options.seed < 0) {
    throw new Error("--seed must be a non-negative whole number");
  }
  return options;
}

function assert(condition, message, details = undefined) {
  if (!condition) {
    const error = new Error(message);
    if (details) error.details = details;
    throw error;
  }
}

function runPlayBrandSourceProbe() {
  const html = fs.readFileSync(path.join(ROOT, LESSON, "index.html"), "utf8");
  const playStart = html.indexOf('id="screen-play"');
  const playEnd = html.indexOf('<section class="screen', playStart + 1);
  const playMarkup = html.slice(playStart, playEnd > playStart ? playEnd : playStart + 6000);
  const match = playMarkup.match(/class="brand-badge"[^>]*>([\s\S]*?)<\/div>/);
  const visibleText = (match?.[1] || "").replace(/<[^>]+>/g, "").trim();
  return {
    name: "play_brand_contract",
    pass: visibleText === "에듀잇티 수학 게임",
    expected: "에듀잇티 수학 게임",
    observed: visibleText
  };
}

function runRewardModalSourceProbe() {
  const html = fs.readFileSync(path.join(ROOT, LESSON, "index.html"), "utf8");
  const observed = {
    modalMode:html.includes('data-reward-mode="modal-art"'),
    overlayFunction:html.includes('function showRewardOverlay()'),
    playRetained:html.includes('screens.play.classList.add("is-active")'),
    rewardRasterHidden:/#screen-reward\s+\.raster-bg\s*\{[^}]*display:\s*none/is.test(html),
    mathmonPack:html.includes('data-mathmon-pack="base-pack"'),
    mathmonId:html.includes('data-mathmon-id="base-02-foxmon"')
  };
  return {
    name:"reward_modal_source_contract",
    pass:Object.values(observed).every(Boolean),
    expected:{ playScreenBehindModal:true, rewardRasterVisible:false, mathmonPack:"base-pack/base-02-foxmon" },
    observed
  };
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
    const resolved = path.resolve(ROOT, `.${decodeURIComponent(requestUrl.pathname)}`);
    if (!resolved.startsWith(ROOT)) {
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
    pending.resolve(message.result);
  }

  send(method, params = {}) {
    const id = this.nextId++;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`${method} timed out`));
      }, 60000);
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
    const target = targets.find((item) => item.type === "page" && item.url === pageUrl)
      || targets.find((item) => item.type === "page" && item.url.includes(`/${LESSON}/index.html`));
    if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    await delay(100);
  }
  throw new Error("Chrome page target was not exposed over CDP");
}

async function launchChrome(pageUrl, debugPort, profileDir) {
  const chrome = spawn(getChromePath(), [
    `--remote-debugging-port=${debugPort}`,
    `--user-data-dir=${profileDir}`,
    "--headless=new",
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-renderer-backgrounding",
    "--disable-backgrounding-occluded-windows",
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
  return result.result.value;
}

async function captureLessonScreenshot(page, fileName) {
  const result = await page.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const outputDir = path.join(ROOT, LESSON, "screenshots");
  await fsp.mkdir(outputDir, { recursive: true });
  await fsp.writeFile(path.join(outputDir, fileName), Buffer.from(result.data, "base64"));
}

async function loadLessonPage(page, pageUrl) {
  await page.send("Page.navigate", { url: pageUrl });
  await waitForLoad(page);
}

async function dispatchMouseClick(page, x, y, clickCount = 1) {
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseMoved",
    x,
    y,
    button: "none"
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x,
    y,
    button: "left",
    buttons: 1,
    clickCount
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x,
    y,
    button: "left",
    buttons: 0,
    clickCount
  });
}

const PLAY_TO_COMPLETE = String.raw`
(async () => {
  const waitFor = (predicate, label, timeout = 5000) => new Promise((resolve, reject) => {
    const started = performance.now();
    const tick = () => {
      if (predicate()) {
        resolve(true);
        return;
      }
      if (performance.now() - started > timeout) {
        reject(new Error("Timed out waiting for " + label));
        return;
      }
      setTimeout(tick, 16);
    };
    tick();
  });
  const clickCorrect = () => {
    const button = [...document.querySelectorAll("#choicesPanel button")]
      .find((item) => item.dataset.correct === "true" && !item.disabled);
    if (!button) throw new Error("correct choice not found");
    button.click();
  };
  const openPlayScreen = async (label) => {
    document.querySelector("#startButton").click();
    for (let guard = 0; guard < 4 && !document.querySelector("#screen-play").classList.contains("is-active"); guard += 1) {
      document.querySelector("#tutorialStartButton").click();
      await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active")
        || document.querySelector("#screen-tutorial").classList.contains("is-active"), label + " tutorial advance");
    }
    await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active"), label);
  };

  await openPlayScreen("play screen");
  for (let guard = 0; guard < 8 && !document.querySelector("#completePanel").classList.contains("is-visible"); guard += 1) {
    clickCorrect();
    await waitFor(() => [...document.querySelectorAll("#choicesPanel button")].some((item) => item.dataset.correct === "true" && !item.disabled)
      || document.querySelector("#completePanel").classList.contains("is-visible"), "next choices or complete panel");
  }
	  await waitFor(() => document.querySelector("#completePanel").classList.contains("is-visible"), "complete panel");
	  const progressCard = document.querySelector("#truckProgressVisual").getBoundingClientRect();
	  const progressImage = document.querySelector("#runTruckImage").getBoundingClientRect();
	  const completeText = document.querySelector("#completeExpression");
	  const hudLeft = document.querySelector(".hud-left").getBoundingClientRect();
	  const hudRight = document.querySelector(".hud-right").getBoundingClientRect();
	  const overlaps = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
	  return {
	    progressBeforeReward: document.querySelector("#runProgressText").textContent,
	    problemCounter: document.querySelector("#problemCounter").textContent,
	    truckDisabled: document.querySelector("#truckButton").disabled,
	    progressImageShare: progressImage.width / progressCard.width,
	    progressLabelFont: parseFloat(getComputedStyle(document.querySelector("#runProgressText")).fontSize),
	    completionRole: completeText.dataset.textAlignRole,
	    completionTextAlign: getComputedStyle(completeText).textAlign,
	    progressOverlapLeft: overlaps(progressCard, hudLeft),
	    progressOverlapRight: overlaps(progressCard, hudRight)
	  };
	})()
	`;

	function expectedSingleUpgradeExpression(seed) {
	  return `(() => {
	    const model = window.Lesson5PackageWeightModel;
	    const rng = model.createRng((${seed} + 0x9e3779b9) >>> 0);
	    const event = model.pickUpgradeEvent(rng, false);
	    const upgradeResult = model.applyUpgrade({ truckPower: 0, correctFirstTry: 0, superPartSeen: false }, event, true);
	    const actualMovement = upgradeResult.truckPower - upgradeResult.before;
	    const truckResult = model.getTruckResult(upgradeResult.truckPower, upgradeResult.correctFirstTry, upgradeResult.superPartSeen);
	    return {
	      eventId: event.id,
	      family: event.family,
	      amount: event.amount,
	      expectedTruckPower: upgradeResult.truckPower,
	      expectedCorrectFirstTry: upgradeResult.correctFirstTry,
	      expectedResultId: truckResult.id,
	      expectedActualMovement: actualMovement,
	      expectedRawMovement: upgradeResult.skillPower + event.amount
	    };
	  })()`;
	}

	async function runTruckButtonTripleProbe(page, pageUrl, seed) {
	  await loadLessonPage(page, pageUrl);
	  const setup = await evalInPage(page, PLAY_TO_COMPLETE);
	  await captureLessonScreenshot(page, "truck-evolution-play.png");
	  const expected = await evalInPage(page, expectedSingleUpgradeExpression(seed));
	  const observedClosed = await evalInPage(page, String.raw`
	    (() => {
	      const button = document.querySelector("#truckButton");
	      button.click();
	      button.click();
	      button.click();
	      return {
	        rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
	        playActive: document.querySelector("#screen-play").classList.contains("is-active"),
	        rewardRasterDisplay:getComputedStyle(document.querySelector("#screen-reward .raster-bg")).display,
	        truckDisabledAfterClicks: button.disabled,
	        phase: document.querySelector("#screen-reward").dataset.rewardPhase,
	        title: document.querySelector("#rewardTitle").textContent,
	        visualSrc: document.querySelector("#rewardVisual").getAttribute("src"),
	        visibleActions: [...document.querySelectorAll(".reward-action-button")].filter((item) => !item.hidden).map((item) => item.id)
	      };
	    })()
	  `);
	  await captureLessonScreenshot(page, "reward-modal-closed-desktop.png");
	  const observedOpened = await evalInPage(page, String.raw`
	    (() => {
	      document.querySelector("#rewardOpenButton").click();
	      return {
	        phase: document.querySelector("#screen-reward").dataset.rewardPhase,
	        title: document.querySelector("#rewardTitle").textContent,
	        visualSrc: document.querySelector("#rewardVisual").getAttribute("src"),
	        visibleActions: [...document.querySelectorAll(".reward-action-button")].filter((item) => !item.hidden).map((item) => item.id)
	      };
	    })()
	  `);
	  await delay(150);
	  await captureLessonScreenshot(page, "reward-modal-open-desktop.png");
	  const pass = setup.progressImageShare >= .5
	    && setup.progressLabelFont >= 18
	    && setup.progressOverlapLeft === 0
	    && setup.progressOverlapRight === 0
	    && observedClosed.rewardActive
	    && observedClosed.playActive
	    && observedClosed.rewardRasterDisplay === "none"
	    && observedClosed.phase === "closed"
	    && observedClosed.visualSrc === "reward-event-closed-v2-generated.webp"
	    && observedClosed.visibleActions.join() === "rewardOpenButton"
	    && observedOpened.phase === "opened"
	    && observedOpened.visualSrc === `reward-event-${expected.eventId}-generated.webp`
	    && observedOpened.visibleActions.join() === "rewardNextButton";
	  return { name: "truck_button_triple_click", pass, setup, expected, observed: { closed: observedClosed, opened: observedOpened } };
	}

async function runRewardNextDoubleProbe(page, pageUrl) {
  await loadLessonPage(page, pageUrl);
	  const setup = await evalInPage(page, PLAY_TO_COMPLETE);
	  const observed = await evalInPage(page, String.raw`
	    (async () => {
	      const truckButton = document.querySelector("#truckButton");
	      truckButton.click();
	      document.querySelector("#rewardOpenButton").click();
	      const nextButton = document.querySelector("#rewardNextButton");
	      nextButton.click();
	      nextButton.click();
	      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
        playActive: document.querySelector("#screen-play").classList.contains("is-active"),
        resultActive: document.querySelector("#screen-result").classList.contains("is-active"),
        nextDisabledAfterClicks: nextButton.disabled,
        problemCounter: document.querySelector("#problemCounter").textContent,
        problemTitle: document.querySelector("#problemTitle").textContent
      };
    })()
  `);
  const pass = observed.playActive && !observed.resultActive && observed.problemCounter === "2/10";
  return { name: "reward_next_double_click", pass, setup, expected: { problemCounter: "2/10" }, observed };
}

async function runRewardNextPhysicalDoubleClickProbe(page, pageUrl) {
	  await loadLessonPage(page, pageUrl);
	  const setup = await evalInPage(page, PLAY_TO_COMPLETE);
	  const beforeClick = await evalInPage(page, String.raw`
	    (() => {
	      document.querySelector("#truckButton").click();
	      document.querySelector("#rewardOpenButton").click();
	      const rect = document.querySelector("#rewardNextButton").getBoundingClientRect();
	      return {
        rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
        buttonText: document.querySelector("#rewardNextButton").textContent,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
    })()
  `);
  await dispatchMouseClick(page, beforeClick.x, beforeClick.y, 1);
  await delay(2050);
  const targetAtSecondClick = await evalInPage(page, String.raw`
    ((x, y) => {
      const target = document.elementFromPoint(x, y);
      return {
        tagName: target?.tagName || null,
        text: target?.textContent || "",
        className: target?.className || "",
        isChoiceButton: Boolean(target?.closest?.("#choicesPanel button"))
      };
    })
  ` + `(${JSON.stringify(beforeClick.x)}, ${JSON.stringify(beforeClick.y)})`);
  await dispatchMouseClick(page, beforeClick.x, beforeClick.y, 2);
  await delay(120);
  const afterCarryThrough = await evalInPage(page, String.raw`
    (() => ({
      rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
      playActive: document.querySelector("#screen-play").classList.contains("is-active"),
      resultActive: document.querySelector("#screen-result").classList.contains("is-active"),
      problemCounter: document.querySelector("#problemCounter").textContent,
      answerSlot: document.querySelector("#answerSlot").textContent,
      answerFilled: document.querySelector("#answerSlot").classList.contains("is-filled"),
      feedbackText: document.querySelector("#feedbackLine").textContent,
      wrongChoices: document.querySelectorAll("#choicesPanel button.is-wrong").length,
      correctChoices: document.querySelectorAll("#choicesPanel button.is-correct").length,
      disabledChoices: [...document.querySelectorAll("#choicesPanel button")].filter((button) => button.disabled).length
    }))()
  `);
  await delay(450);
  const afterNormalClick = await evalInPage(page, String.raw`
    (() => {
      const button = [...document.querySelectorAll("#choicesPanel button")]
        .find((item) => item.dataset.correct === "true" && !item.disabled);
      if (!button) throw new Error("correct choice not found after carry-through guard");
      button.click();
      return {
        answerSlot: document.querySelector("#answerSlot").textContent,
        answerFilled: document.querySelector("#answerSlot").classList.contains("is-filled"),
        feedbackText: document.querySelector("#feedbackLine").textContent,
        correctChoices: document.querySelectorAll("#choicesPanel button.is-correct").length
      };
    })()
  `);
  const pass = beforeClick.rewardActive
    && afterCarryThrough.playActive
    && !afterCarryThrough.resultActive
    && afterCarryThrough.problemCounter === "2/10"
    && afterCarryThrough.answerSlot === "?"
    && !afterCarryThrough.answerFilled
    && afterCarryThrough.feedbackText === ""
    && afterCarryThrough.wrongChoices === 0
    && afterCarryThrough.correctChoices === 0
    && afterCarryThrough.disabledChoices === 0
    && afterNormalClick.answerFilled
    && afterNormalClick.correctChoices === 1;
  return {
    name: "reward_next_physical_double_click_no_carry_through",
    pass,
    setup,
    expected: {
      afterRapidDoubleClick: "problem 2/10 visible with no selected choice, no feedback, no disabled choice",
      normalClickAfterGuard: "first correct choice still works after the short guard"
    },
    observed: { beforeClick, afterCarryThrough, afterNormalClick },
    diagnostic: { targetAtSecondClick }
  };
}

	async function runTruckButtonStaleEventProbe(page, pageUrl, seed) {
	  await loadLessonPage(page, pageUrl);
	  const setup = await evalInPage(page, PLAY_TO_COMPLETE);
	  const expected = await evalInPage(page, expectedSingleUpgradeExpression(seed));
	  const observed = await evalInPage(page, String.raw`
	    (() => {
	      const button = document.querySelector("#truckButton");
	      button.click();
	      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
	      button.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
	      button.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
	      return {
	        rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
	        truckDisabledAfterEvents: button.disabled,
	        phase: document.querySelector("#screen-reward").dataset.rewardPhase,
	        title: document.querySelector("#rewardTitle").textContent,
	        visualSrc: document.querySelector("#rewardVisual").getAttribute("src")
	      };
	    })()
	  `);
	  const pass = observed.rewardActive
	    && observed.phase === "closed"
	    && observed.visualSrc === "reward-event-closed-v2-generated.webp";
	  return { name: "truck_button_stale_pointer_keyboard_events", pass, setup, expected, observed };
	}

async function runRewardNextStaleEventProbe(page, pageUrl) {
  await loadLessonPage(page, pageUrl);
	  const setup = await evalInPage(page, PLAY_TO_COMPLETE);
	  const observed = await evalInPage(page, String.raw`
	    (async () => {
	      document.querySelector("#truckButton").click();
	      document.querySelector("#rewardOpenButton").click();
	      const nextButton = document.querySelector("#rewardNextButton");
      nextButton.click();
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      nextButton.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      nextButton.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", code: "Enter", bubbles: true, cancelable: true }));
	      await new Promise((resolve) => setTimeout(resolve, 2000));
      return {
        rewardActive: document.querySelector("#screen-reward").classList.contains("is-active"),
        playActive: document.querySelector("#screen-play").classList.contains("is-active"),
        resultActive: document.querySelector("#screen-result").classList.contains("is-active"),
        nextDisabledAfterEvents: nextButton.disabled,
        problemCounter: document.querySelector("#problemCounter").textContent,
        problemTitle: document.querySelector("#problemTitle").textContent
      };
    })()
  `);
  const pass = observed.playActive && !observed.resultActive && observed.problemCounter === "2/10";
  return { name: "reward_next_stale_pointer_keyboard_events", pass, setup, expected: { problemCounter: "2/10" }, observed };
}

async function runSeedReplayProbe(page, seedPageUrl, randomPageUrl) {
  const readReplayFromResult = async (url) => {
    await loadLessonPage(page, url);
    return evalInPage(page, String.raw`
      (async () => {
        window.setTimeout = (callback) => {
          queueMicrotask(callback);
          return 0;
        };
        const waitFor = (predicate, label, timeout = 5000) => new Promise((resolve, reject) => {
          const started = performance.now();
          const tick = () => {
            if (predicate()) {
              resolve(true);
              return;
            }
            if (performance.now() - started > timeout) {
              reject(new Error("Timed out waiting for " + label));
              return;
            }
            setTimeout(tick, 16);
          };
          tick();
        });
        const clickCorrect = () => {
          const button = [...document.querySelectorAll("#choicesPanel button")]
            .find((item) => item.dataset.correct === "true" && !item.disabled);
          if (!button) throw new Error("correct choice not found");
          button.click();
        };
        const openPlayScreen = async (label) => {
          document.querySelector("#startButton").click();
          for (let guard = 0; guard < 4 && !document.querySelector("#screen-play").classList.contains("is-active"); guard += 1) {
            document.querySelector("#tutorialStartButton").click();
            await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active")
              || document.querySelector("#screen-tutorial").classList.contains("is-active"), label + " tutorial advance");
          }
          await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active"), label);
        };
        await openPlayScreen("first play screen");
        const firstTitle = document.querySelector("#problemTitle").textContent;
        for (let guard = 0; guard < 80 && !document.querySelector("#screen-result").classList.contains("is-active"); guard += 1) {
          if (document.querySelector("#screen-reward").classList.contains("is-active")) {
            if (document.querySelector("#screen-reward").dataset.rewardPhase === "closed") {
              document.querySelector("#rewardOpenButton").click();
              await waitFor(() => document.querySelector("#screen-reward").dataset.rewardPhase === "opened", "reward open");
            } else {
              document.querySelector("#rewardNextButton").click();
              await waitFor(() => document.querySelector(".stage-shell").dataset.rewardTransitioning !== "true"
                && (document.querySelector("#screen-result").classList.contains("is-active")
                  || (document.querySelector("#screen-play").classList.contains("is-active")
                    && !document.querySelector("#screen-reward").classList.contains("is-active"))), "reward advance");
            }
            continue;
          }
	          if (document.querySelector("#completePanel").classList.contains("is-visible")) {
	            document.querySelector("#truckButton").click();
	            await waitFor(() => document.querySelector("#screen-reward").classList.contains("is-active"), "reward screen");
	            continue;
          }
          clickCorrect();
          await waitFor(() => [...document.querySelectorAll("#choicesPanel button")].some((item) => item.dataset.correct === "true" && !item.disabled)
            || document.querySelector("#completePanel").classList.contains("is-visible"), "next choice or complete");
        }
        await waitFor(() => document.querySelector("#screen-result").classList.contains("is-active"), "result screen");
        const retryVisibleBeforeReplay = getComputedStyle(document.querySelector("#retryButton")).display !== "none";
        document.querySelector("#retryButton").click();
        await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active"), "replay play screen");
        const replayTitle = document.querySelector("#problemTitle").textContent;
        return { firstTitle, replayTitle, retryVisibleBeforeReplay };
      })()
    `);
  };
  const deterministic = await readReplayFromResult(seedPageUrl);
  const fresh = await readReplayFromResult(randomPageUrl);
  const pass = deterministic.firstTitle === deterministic.replayTitle
    && deterministic.retryVisibleBeforeReplay
    && fresh.retryVisibleBeforeReplay
    && fresh.firstTitle !== fresh.replayTitle;
  return {
    name: "retry_seed_policy",
    pass,
    expected: {
      explicitSeed: "same first problem on replay",
      noSeed: "at least one fresh first problem across retries"
    },
    observed: { deterministic, fresh }
  };
}

async function runResultRasterContractProbe(page, pageUrl) {
  await loadLessonPage(page, pageUrl);
  const observed = await evalInPage(page, String.raw`
    (() => {
      const retryButton = document.querySelector("#retryButton");
      const title = document.querySelector("#resultTitle");
      const summary = document.querySelector("#resultSummary");
      const next = document.querySelector("#resultNext");
      const isVisuallyHidden = (element) => {
        if (!element) return false;
        const style = getComputedStyle(element);
        return style.position === "absolute"
          && element.clientWidth <= 1
          && element.clientHeight <= 1
          && style.overflow === "hidden";
      };
      return {
        renderMode:document.querySelector("main.game")?.dataset.resultRenderMode || "",
        hasResultCard: Boolean(document.querySelector(".result-card")),
        hasCssResultHeading: Boolean(document.querySelector(".result-truck-name")),
        hasResultTitleArt: document.querySelector("#resultTitleArt")?.tagName === "IMG",
        separateTitleDisplay:getComputedStyle(document.querySelector("#resultTitleArt")).display,
        hasResultCorrectArt: document.querySelector("#resultCorrectArt")?.tagName === "IMG",
        hasResultDynamicSvg: document.querySelector(".result-dynamic-ui")?.tagName.toLowerCase() === "svg",
        hasPowerText: document.querySelector("#resultPowerText")?.tagName.toLowerCase() === "text",
        hasNextGoalText: document.querySelector("#resultNextGoalText")?.tagName.toLowerCase() === "text",
        hasProgressFill: document.querySelector("#resultProgressFill")?.tagName.toLowerCase() === "rect",
        correctArtSrc: document.querySelector("#resultCorrectArt")?.getAttribute("src") || "",
        hasRetryArt: document.querySelector(".result-retry-art")?.tagName === "IMG",
        separateRetryDisplay:getComputedStyle(document.querySelector(".result-retry-art")).display,
        retryVisibleText: retryButton?.textContent.trim() || "",
        retryAriaLabel: retryButton?.getAttribute("aria-label") || "",
        titleHidden: isVisuallyHidden(title),
        summaryHidden: isVisuallyHidden(summary),
        nextHidden: isVisuallyHidden(next)
      };
    })()
  `);
  const pass = observed.renderMode === "fullscene-generated-dynamic-slots"
    && !observed.hasResultCard
    && !observed.hasCssResultHeading
    && observed.hasResultTitleArt
    && observed.separateTitleDisplay !== "none"
    && observed.hasResultCorrectArt
    && observed.hasResultDynamicSvg
    && observed.hasPowerText
    && observed.hasNextGoalText
    && observed.hasProgressFill
    && /result-correct-\d+-generated\.webp(?:\?|$)/.test(observed.correctArtSrc)
    && observed.hasRetryArt
    && observed.separateRetryDisplay !== "none"
    && observed.retryVisibleText === ""
    && observed.retryAriaLabel === "다시"
    && observed.titleHidden
    && observed.summaryHidden
    && observed.nextHidden;
  return {
    name: "result_raster_contract_no_css_card",
    pass,
    expected: {
      visibleResultText: "one generated 1280x800 fullscene plus dynamic power/correct/next-goal",
      fixedTitleAndRetry: "separate generated title and retry raster layers",
      retryButton: "transparent accessible hitbox aligned to retry raster"
    },
    observed
  };
}

async function runTutorialPosterProbe(page, pageUrl) {
  await loadLessonPage(page, pageUrl);
  const observed = await evalInPage(page, String.raw`
    (async () => {
      const stage = document.querySelector('.stage-shell').getBoundingClientRect();
      const rect = (node) => {
        const value = node.getBoundingClientRect();
        return {
          left:value.left, top:value.top, right:value.right, bottom:value.bottom,
          width:value.width, height:value.height,
          cx:value.left + value.width / 2, cy:value.top + value.height / 2
        };
      };
      const insideStage = (node) => {
        const rect = node.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0
          && rect.left >= stage.left && rect.top >= stage.top
          && rect.right <= stage.right && rect.bottom <= stage.bottom;
      };
      const coverButton = document.querySelector('#startButton');
      const coverArt = coverButton.querySelector('.start-button-art');
      const cover = {
        standard:document.querySelector('main.game')?.dataset.coverStartAsset || '',
        source:coverArt?.getAttribute('src') || '',
        button:rect(coverButton),
        art:rect(coverArt),
        inside:insideStage(coverButton)
      };
      document.querySelector('#startButton').click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const tutorial = document.querySelector('#screen-tutorial');
      const cards = [...document.querySelectorAll('.tutorial-card')];
      const images = [...document.querySelectorAll('.tutorial-poster-art')];
      const logo = tutorial.querySelector('.brand-badge img');
      const first = {
        active: tutorial.classList.contains('is-active'),
        page: tutorial.dataset.page,
        visibleCards: cards.filter((card) => !card.hidden).length,
        nextInside: insideStage(document.querySelector('#tutorialStartButton'))
      };
      document.querySelector('#tutorialStartButton').click();
      await new Promise((resolve) => setTimeout(resolve, 80));
      const second = {
        page: tutorial.dataset.page,
        visibleCards: cards.filter((card) => !card.hidden).length,
        backInside: insideStage(document.querySelector('#tutorialBackButton')),
        startInside: insideStage(document.querySelector('#tutorialStartButton'))
      };
      return {
        cover,
        first,
        second,
        imageWidths: images.map((image) => image.naturalWidth),
        imageHeights: images.map((image) => image.naturalHeight),
        logoWidth: logo?.naturalWidth || 0
      };
    })()
  `);
  const pass = observed.first.active
    && observed.cover.standard === 'shared-canonical-v1'
    && observed.cover.source === '../_shared/mathmon/cover-start-button/start-button-generated.webp'
    && observed.cover.inside
    && Math.abs(observed.cover.button.width - observed.cover.art.width) <= 1
    && Math.abs(observed.cover.button.height - observed.cover.art.height) <= 1
    && Math.abs(observed.cover.button.cx - observed.cover.art.cx) <= 1
    && Math.abs(observed.cover.button.cy - observed.cover.art.cy) <= 1
    && Math.abs((observed.cover.button.width / observed.cover.button.height) - (1611 / 680)) <= .02
    && observed.first.page === '0'
    && observed.first.visibleCards === 1
    && observed.first.nextInside
    && observed.second.page === '1'
    && observed.second.visibleCards === 1
    && observed.second.backInside
    && observed.second.startInside
    && observed.imageWidths.every((width) => width === 1280)
    && observed.imageHeights.every((height) => height === 800)
    && observed.logoWidth > 0;
  return {
    name: 'tutorial_two_poster_contract',
    pass,
    expected: {
      coverStartAsset: 'shared-canonical-v1',
      coverStartSource: '../_shared/mathmon/cover-start-button/start-button-generated.webp',
      coverStartAspectRatio: '1611:680',
      pages: 2,
      size: '1280x800',
      visibleCardsPerPage: 1,
      realLogo: true
    },
    observed
  };
}

async function runTabletLandscapeProbe(page, pageUrl) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: 1024,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  try {
    await loadLessonPage(page, pageUrl);
    const coverTutorial = await evalInPage(page, String.raw`
      (async () => {
        const inside = (outer, inner) => inner.left >= outer.left - 1
          && inner.top >= outer.top - 1
          && inner.right <= outer.right + 1
          && inner.bottom <= outer.bottom + 1;
        const rect = (node) => {
          const value = node.getBoundingClientRect();
          return {
            left:value.left, top:value.top, right:value.right, bottom:value.bottom,
            width:value.width, height:value.height
          };
        };
        const stage = rect(document.querySelector(".stage-shell"));
        const start = rect(document.querySelector("#startButton"));
        document.querySelector("#startButton").click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        const firstButton = rect(document.querySelector("#tutorialStartButton"));
        document.querySelector("#tutorialStartButton").click();
        await new Promise((resolve) => setTimeout(resolve, 80));
        const secondBack = rect(document.querySelector("#tutorialBackButton"));
        const secondStart = rect(document.querySelector("#tutorialStartButton"));
        return {
          viewport:{ width:innerWidth, height:innerHeight, dpr:devicePixelRatio },
          stage,
          stageRatio:stage.width / stage.height,
          coverStartInside:inside(stage, start),
          tutorialFirstInside:inside(stage, firstButton),
          tutorialSecondBackInside:inside(stage, secondBack),
          tutorialSecondStartInside:inside(stage, secondStart)
        };
      })()
    `);
    await loadLessonPage(page, pageUrl);
    const setup = await evalInPage(page, PLAY_TO_COMPLETE);
    await captureLessonScreenshot(page, "tablet-landscape-current-play.png");
    const reward = await evalInPage(page, String.raw`
      (async () => {
        document.querySelector("#truckButton").click();
        await new Promise((resolve) => setTimeout(resolve, 900));
        const rect = (node) => {
          const value = node.getBoundingClientRect();
          return {
            left:value.left, top:value.top, right:value.right, bottom:value.bottom,
            width:value.width, height:value.height
          };
        };
        const stage = rect(document.querySelector(".stage-shell"));
        const card = rect(document.querySelector(".reward-card"));
        const visual = rect(document.querySelector("#rewardVisual"));
        const button = document.querySelector("#rewardOpenButton");
        const buttonRect = rect(button);
        const textNodes = [
          document.querySelector("#rewardTitle"),
          button
        ];
        return {
          active:document.querySelector("#screen-reward").classList.contains("is-active"),
          playActive:document.querySelector("#screen-play").classList.contains("is-active"),
          rewardRasterDisplay:getComputedStyle(document.querySelector("#screen-reward .raster-bg")).display,
          phase:document.querySelector("#screen-reward").dataset.rewardPhase,
          card,
          visual,
          cardInside:card.left >= stage.left - 1 && card.top >= stage.top - 1
            && card.right <= stage.right + 1 && card.bottom <= stage.bottom + 1,
          buttonInside:buttonRect.left >= stage.left - 1 && buttonRect.top >= stage.top - 1
            && buttonRect.right <= stage.right + 1 && buttonRect.bottom <= stage.bottom + 1,
          textOverflow:textNodes.filter(Boolean).filter((node) =>
            node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1
          ).map((node) => node.id || node.tagName)
        };
      })()
    `);
    await captureLessonScreenshot(page, "reward-modal-closed-tablet-landscape.png");
    const rewardOpened = await evalInPage(page, String.raw`
      (() => {
        document.querySelector("#rewardOpenButton").click();
        const visibleActions = [...document.querySelectorAll(".reward-action-button")]
          .filter((item) => !item.hidden).map((item) => item.id);
        return {
          phase:document.querySelector("#screen-reward").dataset.rewardPhase,
          visibleActions,
          title:document.querySelector("#rewardTitle").textContent,
          visualSrc:document.querySelector("#rewardVisual").getAttribute("src")
        };
      })()
    `);
    await captureLessonScreenshot(page, "reward-modal-open-tablet-landscape.png");
    const pass = coverTutorial.viewport.width === 1024
      && coverTutorial.viewport.height === 768
      && Math.abs(coverTutorial.stageRatio - 1.6) <= .01
      && coverTutorial.coverStartInside
      && coverTutorial.tutorialFirstInside
      && coverTutorial.tutorialSecondBackInside
      && coverTutorial.tutorialSecondStartInside
      && setup.progressOverlapLeft === 0
      && setup.progressOverlapRight === 0
      && reward.active
      && reward.playActive
      && reward.rewardRasterDisplay === "none"
      && reward.phase === "closed"
      && reward.cardInside
      && reward.buttonInside
      && Math.abs(reward.card.width - 560) <= 1
      && Math.abs(reward.card.height - 480) <= 1
      && Math.abs(reward.visual.width - 250) <= 1
      && Math.abs(reward.visual.height - 250) <= 1
      && reward.textOverflow.length === 0
      && rewardOpened.phase === "opened"
      && rewardOpened.visibleActions.join() === "rewardNextButton";
    return {
      name: "tablet_landscape_current_flow",
      pass,
      expected: {
        viewport: "1024x768",
        stageRatio: "16:10",
        overflowOrOverlap: 0
      },
      observed: { coverTutorial, setup, reward, rewardOpened }
    };
  } finally {
    await page.send("Emulation.clearDeviceMetricsOverride");
  }
}

async function runRewardEventSetProbe(page, pageUrl) {
  const viewports = [
    { name: "desktop", width: 1280, height: 800 },
    { name: "tablet-landscape", width: 1024, height: 768 }
  ];
  const eventIds = ["normal", "loss", "mega", "jackpot", "empty", "special"];
  const observations = [];

  for (const viewport of viewports) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: 1,
      mobile: false
    });
    for (const eventId of eventIds) {
      await loadLessonPage(page, pageUrl);
      const closed = await evalInPage(page, String.raw`
        (async (eventId) => {
          window.__lesson5PackageQa.forceRewardEvent(eventId);
          await document.querySelector("#rewardVisual").decode();
          const rect = (node) => {
            const value = node.getBoundingClientRect();
            return { left:value.left, top:value.top, right:value.right, bottom:value.bottom, width:value.width, height:value.height };
          };
          const stage = rect(document.querySelector(".stage-shell"));
          const card = rect(document.querySelector(".reward-card"));
          const visual = rect(document.querySelector("#rewardVisual"));
          return {
            eventId,
            playActive:document.querySelector("#screen-play").classList.contains("is-active"),
            rewardRasterDisplay:getComputedStyle(document.querySelector("#screen-reward .raster-bg")).display,
            phase:document.querySelector("#screen-reward").dataset.rewardPhase,
            title:document.querySelector("#rewardTitle").textContent,
            visualSrc:document.querySelector("#rewardVisual").getAttribute("src"),
            natural:[document.querySelector("#rewardVisual").naturalWidth, document.querySelector("#rewardVisual").naturalHeight],
            stage, card, visual,
            visibleActions:[...document.querySelectorAll(".reward-action-button")].filter((item) => !item.hidden).map((item) => item.id),
            overflow:[...document.querySelectorAll(".reward-card *")].filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1).map((node) => node.id || node.className)
          };
        })
      ` + `(${JSON.stringify(eventId)})`);
      if (eventId === eventIds[0]) {
        await captureLessonScreenshot(page, `reward-event-closed-${viewport.name}.png`);
      }
      const opened = await evalInPage(page, String.raw`
        (async () => {
          window.__lesson5PackageQa.openReward();
          await document.querySelector("#rewardVisual").decode();
          return {
            phase:document.querySelector("#screen-reward").dataset.rewardPhase,
            title:document.querySelector("#rewardTitle").textContent,
            visualSrc:document.querySelector("#rewardVisual").getAttribute("src"),
            natural:[document.querySelector("#rewardVisual").naturalWidth, document.querySelector("#rewardVisual").naturalHeight],
            visibleActions:[...document.querySelectorAll(".reward-action-button")].filter((item) => !item.hidden).map((item) => item.id),
            overflow:[...document.querySelectorAll(".reward-card *")].filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1).map((node) => node.id || node.className)
          };
        })()
      `);
      await captureLessonScreenshot(page, `reward-event-${eventId}-open-${viewport.name}.png`);
      observations.push({ viewport, eventId, closed, opened });
    }
  }
  await page.send("Emulation.clearDeviceMetricsOverride");

  const expectedOpenedSources = new Set(eventIds.map((eventId) => `reward-event-${eventId}-generated.webp`));
  const observedOpenedSources = new Set(observations.map((item) => item.opened.visualSrc));
  const pass = observations.every(({ eventId, closed, opened }) =>
    closed.phase === "closed"
    && closed.playActive
    && closed.rewardRasterDisplay === "none"
    && closed.title === "두근두근!"
    && closed.visualSrc === "reward-event-closed-v2-generated.webp"
    && closed.natural.join("x") === "512x512"
    && Math.abs(closed.card.width - 560) <= 1
    && Math.abs(closed.card.height - 480) <= 1
    && Math.abs(closed.visual.width - 250) <= 1
    && Math.abs(closed.visual.height - 250) <= 1
    && closed.card.left >= closed.stage.left - 1
    && closed.card.top >= closed.stage.top - 1
    && closed.card.right <= closed.stage.right + 1
    && closed.card.bottom <= closed.stage.bottom + 1
    && closed.visibleActions.join() === "rewardOpenButton"
    && closed.overflow.length === 0
    && opened.phase === "opened"
    && opened.visualSrc === `reward-event-${eventId}-generated.webp`
    && opened.natural.join("x") === "512x512"
    && opened.visibleActions.join() === "rewardNextButton"
    && opened.title.length > 0
    && !opened.title.includes("\n")
    && !opened.title.includes("바로 맞힌")
    && opened.overflow.length === 0
  ) && observedOpenedSources.size === expectedOpenedSources.size;

  return {
    name: "reward_modal_all_events_all_viewports",
    pass,
    expected: {
      viewports:viewports.map((item) => `${item.width}x${item.height}`),
      phases:["closed", "opened"],
      events:eventIds,
      card:"560x480",
      visual:"250x250",
      visibleActionCount:1,
      overflow:0
    },
    observed: observations
  };
}

async function runEmptyRewardFixtureProbe(page, pageUrl) {
  const viewportName = LESSON_CONFIG.qa.emptyRewardAuditViewport;
  const viewport = QA_VIEWPORTS.find((item) => item.name === viewportName);
  if (!viewport) {
    return {
      name:"empty_reward_fixture_preserves_progress",
      pass:false,
      expected:{ viewport:viewportName },
      observed:{ reason:"configured empty reward viewport is missing" }
    };
  }

  await page.send("Emulation.setDeviceMetricsOverride", {
    width:viewport.width,
    height:viewport.height,
    deviceScaleFactor:viewport.deviceScaleFactor || viewport.dpr || 1,
    mobile:false
  });
  await loadLessonPage(page, pageUrl);
  const setup = await evalInPage(page, String.raw`
    (async () => {
      const forced = window.__lesson5PackageQa.forceRewardEvent("empty");
      await document.querySelector("#rewardVisual").decode();
      const sourceBefore = document.querySelector("#runTruckImage").getAttribute("src");
      const closed = {
        phase:document.querySelector("#screen-reward").dataset.rewardPhase,
        title:document.querySelector("#rewardTitle").textContent,
        power:window.__lesson5PackageQa.getState().truckPower
      };
      window.__lesson5PackageQa.openReward();
      await document.querySelector("#rewardVisual").decode();
      const opened = {
        phase:document.querySelector("#screen-reward").dataset.rewardPhase,
        eventId:window.__lesson5PackageQa.getState().latestEventId,
        visualSrc:document.querySelector("#rewardVisual").getAttribute("src"),
        power:window.__lesson5PackageQa.getState().truckPower
      };
      return { forced, sourceBefore, closed, opened };
    })()
  `);
  await captureLessonScreenshot(page, `empty-reward-fixture-01-open.png`);
  await evalInPage(page, `document.querySelector("#rewardNextButton").click()`);
  await delay(120);
  const during = await evalInPage(page, String.raw`
    (() => ({
      power:window.__lesson5PackageQa.getState().truckPower,
      transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
      source:document.querySelector("#runTruckImage").getAttribute("src"),
      effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => ["is-changing","is-dimming","is-celebrating","is-tier-up"].includes(name)),
      impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
      counter:document.querySelector("#problemCounter").textContent
    }))()
  `);
  await delay(300);
  const after = await evalInPage(page, String.raw`
    (() => ({
      power:window.__lesson5PackageQa.getState().truckPower,
      transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
      source:document.querySelector("#runTruckImage").getAttribute("src"),
      effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => ["is-changing","is-dimming","is-celebrating","is-tier-up"].includes(name)),
      impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
      counter:document.querySelector("#problemCounter").textContent
    }))()
  `);
  await captureLessonScreenshot(page, `empty-reward-fixture-02-after.png`);
  await page.send("Emulation.clearDeviceMetricsOverride");

  const pass = setup.forced.eventId === "empty"
    && setup.forced.amount === 0
    && setup.forced.beforePower === setup.forced.afterPower
    && setup.closed.phase === "closed"
    && setup.opened.phase === "opened"
    && setup.opened.eventId === "empty"
    && setup.opened.visualSrc === "reward-event-empty-generated.webp"
    && setup.closed.power === setup.forced.beforePower
    && setup.opened.power === setup.forced.beforePower
    && during.power === setup.forced.beforePower
    && during.source === setup.sourceBefore
    && during.effectClasses.length === 0
    && !during.impactActive
    && during.counter === "1/10"
    && after.power === setup.forced.beforePower
    && after.source === setup.sourceBefore
    && after.effectClasses.length === 0
    && !after.impactActive
    && after.transitioning === "false"
    && after.counter === "2/10";
  return {
    name:"empty_reward_fixture_preserves_progress",
    pass,
    expected:{ viewport:viewportName, amount:0, powerPreserved:true, sceneEffect:false, counter:"1/10→2/10" },
    observed:{ setup, during, after }
  };
}

async function runRewardWorldImpactProbe(page, pageUrl) {
  await page.send("Emulation.setDeviceMetricsOverride", { width:1280, height:800, deviceScaleFactor:1, mobile:false });
  await loadLessonPage(page, pageUrl);
  const setup = await evalInPage(page, String.raw`
    (async () => {
      window.__lesson5PackageQa.forceRewardEvent("normal");
      await document.querySelector("#runTruckImage").decode();
      await new Promise((resolve) => setTimeout(resolve, 1250));
      const closed = {
        phase:document.querySelector("#screen-reward").dataset.rewardPhase,
        rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
        source:document.querySelector("#runTruckImage").getAttribute("src"),
        label:document.querySelector("#runProgressText").textContent,
        counter:document.querySelector("#problemCounter").textContent
      };
      window.__lesson5PackageQa.openReward();
      const opened = {
        phase:document.querySelector("#screen-reward").dataset.rewardPhase,
        rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
        source:document.querySelector("#runTruckImage").getAttribute("src"),
        label:document.querySelector("#runProgressText").textContent,
        counter:document.querySelector("#problemCounter").textContent
      };
      return { closed, opened };
    })()
  `);
  await captureLessonScreenshot(page, "reward-transition-01-modal-open.png");
  const startedAt = performance.now();
  const immediate = await evalInPage(page, String.raw`
    (() => {
      document.querySelector("#rewardNextButton").click();
      return {
        rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
        playActive:document.querySelector("#screen-play").classList.contains("is-active"),
        transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
        source:document.querySelector("#runTruckImage").getAttribute("src"),
        counter:document.querySelector("#problemCounter").textContent
      };
    })()
  `);
  await delay(200);
  const preEffect = await evalInPage(page, String.raw`
    (() => ({
      rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
      transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
      source:document.querySelector("#runTruckImage").getAttribute("src"),
      effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => name.startsWith("is-")),
      impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
      counter:document.querySelector("#problemCounter").textContent
    }))()
  `);
  await delay(150);
  const active = await evalInPage(page, String.raw`
    (() => {
      const stage = document.querySelector(".stage-shell").getBoundingClientRect();
      const impact = document.querySelector("#progressImpactStage").getBoundingClientRect();
      return {
        rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
        transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
        source:document.querySelector("#runTruckImage").getAttribute("src"),
        effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => name.startsWith("is-")),
        impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
        impactStageWidthRatio:impact.width / stage.width,
        counter:document.querySelector("#problemCounter").textContent
      };
    })()
  `);
  await captureLessonScreenshot(page, "reward-transition-03-active.png");
  await delay(650);
  const minimumVisible = await evalInPage(page, String.raw`
    (() => ({
      transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
      source:document.querySelector("#runTruckImage").getAttribute("src"),
      effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => name.startsWith("is-")),
      impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
      counter:document.querySelector("#problemCounter").textContent
    }))()
  `);
  await captureLessonScreenshot(page, "reward-transition-04-minimum-visible.png");
  await delay(900);
  const after = await evalInPage(page, String.raw`
    (() => ({
      rewardActive:document.querySelector("#screen-reward").classList.contains("is-active"),
      playActive:document.querySelector("#screen-play").classList.contains("is-active"),
      transitioning:document.querySelector(".stage-shell").dataset.rewardTransitioning,
      source:document.querySelector("#runTruckImage").getAttribute("src"),
      effectClasses:[...document.querySelector("#truckProgressVisual").classList].filter((name) => ["is-changing","is-dimming","is-celebrating","is-tier-up"].includes(name)),
      impactActive:document.querySelector("#progressImpactStage").classList.contains("is-active"),
      counter:document.querySelector("#problemCounter").textContent
      ,timing:{
        modalClosedAt:Number(document.querySelector(".stage-shell").dataset.rewardModalClosedAt),
        effectStartedAt:Number(document.querySelector(".stage-shell").dataset.rewardEffectStartedAt),
        effectEndedAt:Number(document.querySelector(".stage-shell").dataset.rewardEffectEndedAt),
        advancedAt:Number(document.querySelector(".stage-shell").dataset.rewardAdvancedAt)
      }
    }))()
  `);
  await captureLessonScreenshot(page, "reward-transition-05-next-problem.png");
  await page.send("Emulation.clearDeviceMetricsOverride");
  const beforeSource = "play-truck-v1-swift-generated.webp";
  const afterSource = "play-truck-v1-cool-generated.webp";
  const pass = setup.closed.phase === "closed"
    && setup.opened.phase === "opened"
    && setup.closed.source === beforeSource
    && setup.opened.source === beforeSource
    && setup.closed.counter === "1/10"
    && setup.opened.counter === "1/10"
    && !immediate.rewardActive
    && immediate.playActive
    && immediate.transitioning === "true"
    && immediate.source === beforeSource
    && immediate.counter === "1/10"
    && !preEffect.rewardActive
    && preEffect.transitioning === "true"
    && preEffect.source === beforeSource
    && preEffect.effectClasses.every((name) => name === "is-upgraded")
    && !preEffect.impactActive
    && preEffect.counter === "1/10"
    && !active.rewardActive
    && active.transitioning === "true"
    && active.source === afterSource
    && active.effectClasses.includes("is-tier-up")
    && active.impactActive
    && active.impactStageWidthRatio >= .32
    && active.counter === "1/10"
    && minimumVisible.source === afterSource
    && !after.rewardActive
    && after.playActive
    && after.transitioning === "false"
    && after.source === afterSource
    && after.effectClasses.length === 0
    && !after.impactActive
    && after.counter === "2/10"
    && after.timing.effectStartedAt - after.timing.modalClosedAt >= 300
    && after.timing.effectEndedAt - after.timing.effectStartedAt >= 1500
    && after.timing.advancedAt >= after.timing.effectEndedAt;
  return {
    name:"modal_dismiss_world_impact_v2",
    pass,
    expected:{ modalClosedBeforeEffect:true, preEffectDelayMs:320, imageSwap:"swift→cool", minimumVisibleMs:1200, impactStageWidthRatio:">=0.32", problemCounterHeld:"1/10", nextAfterEffect:"2/10" },
    observed:{ setup, immediate, preEffect, active, minimumVisible, after, totalElapsedMs:Math.round(performance.now() - startedAt) }
  };
}

async function runReportEvidenceCaptureProbe(page, pageUrl) {
  const tiers = RESULT_AUDIT.expectedStates;
  const observations = [];
  for (const viewport of QA_VIEWPORTS) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width:viewport.width,
      height:viewport.height,
      deviceScaleFactor:viewport.deviceScaleFactor || viewport.dpr || 1,
      mobile:false
    });
    await loadLessonPage(page, pageUrl);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-01-cover.png`);
    await evalInPage(page, `document.querySelector("#settingsButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-02-settings.png`);
    await evalInPage(page, `document.querySelector("#settingsCloseButton").click(); document.querySelector("#startButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-03-tutorial-1.png`);
    await evalInPage(page, `document.querySelector("#tutorialStartButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-04-tutorial-2.png`);
    await evalInPage(page, `document.querySelector("#tutorialStartButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-05-play-step1.png`);

    await loadLessonPage(page, pageUrl);
    await evalInPage(page, PLAY_TO_COMPLETE);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-06-confirm.png`);
    await evalInPage(page, `document.querySelector("#truckButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-07-reward-closed.png`);
    await evalInPage(page, `document.querySelector("#rewardOpenButton").click()`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-07b-reward-open.png`);

    const rewardEventId = viewport.name === LESSON_CONFIG.qa.emptyRewardAuditViewport ? "empty" : "normal";
    await evalInPage(page, String.raw`
      (() => {
        window.__lesson5PackageQa.forceRewardEvent(REWARD_EVENT_ID);
        window.__lesson5PackageQa.openReward();
        document.querySelector("#rewardNextButton").click();
      })()
    `.replace("REWARD_EVENT_ID", JSON.stringify(rewardEventId)));
    await delay(400);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-07c-reward-${rewardEventId === "empty" ? "empty" : "impact"}.png`);
    await delay(1650);

    await evalInPage(page, `window.__lesson5PackageQa.forceResultTier("plain")`);
    await captureLessonScreenshot(page, `engine-flow-${viewport.name}-08-result.png`);
    for (const tierId of tiers) {
      await evalInPage(page, `window.__lesson5PackageQa.forceResultTier(${JSON.stringify(tierId)})`);
      await evalInPage(page, `document.querySelector("#resultBg").decode()`);
      await captureLessonScreenshot(page, `engine-flow-${viewport.name}-08a-result-${tierId}.png`);
    }
    observations.push({ viewport:viewport.name, requiredScreens:9, resultStates:tiers.length });
  }
  await page.send("Emulation.clearDeviceMetricsOverride");
  return {
    name:"report_evidence_all_viewports",
    pass:observations.length === QA_VIEWPORTS.length && observations.every((item) => item.resultStates === tiers.length),
    expected:{ viewports:QA_VIEWPORTS.length, requiredScreensPerViewport:9, resultStates:tiers.length },
    observed:observations
  };
}

async function runCoreScreenEvidenceProbe(page, pageUrl) {
  const viewports = [
    { name:"desktop", width:1280, height:800 },
    { name:"tablet-landscape", width:1024, height:768 }
  ];
  const observations = [];
  for (const viewport of viewports) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width:viewport.width,
      height:viewport.height,
      deviceScaleFactor:1,
      mobile:false
    });
    await loadLessonPage(page, pageUrl);
    await captureLessonScreenshot(page, `current-${viewport.name}-01-cover.png`);
    await evalInPage(page, `document.querySelector("#settingsButton").click()`);
    await captureLessonScreenshot(page, `current-${viewport.name}-02-settings.png`);
    await evalInPage(page, `document.querySelector("#settingsCloseButton").click(); document.querySelector("#startButton").click()`);
    await captureLessonScreenshot(page, `current-${viewport.name}-03-tutorial-1.png`);
    await evalInPage(page, `document.querySelector("#tutorialStartButton").click()`);
    await captureLessonScreenshot(page, `current-${viewport.name}-04-tutorial-2.png`);
    await evalInPage(page, `document.querySelector("#tutorialStartButton").click()`);
    await captureLessonScreenshot(page, `current-${viewport.name}-05-play-wait.png`);
    const instruction = await evalInPage(page, String.raw`
      (() => {
        const node = document.querySelector("#stepInstruction");
        const style = getComputedStyle(node);
        const range = document.createRange();
        range.selectNodeContents(node);
        return {
          text:node.textContent.trim(),
          textAlign:style.textAlign,
          wordBreak:style.wordBreak,
          overflowWrap:style.overflowWrap,
          lineCount:range.getClientRects().length,
          overflowX:Math.max(0, node.scrollWidth - node.clientWidth),
          overflowY:Math.max(0, node.scrollHeight - node.clientHeight)
        };
      })()
    `);
    const topControlsConfig = LESSON_CONFIG.qa.topControlsAudit;
    const topControls = await evalInPage(page, String.raw`
      (() => {
        const config = TOP_CONTROLS_CONFIG;
        const unit = document.querySelector(config.unitBadge).getBoundingClientRect();
        const settings = document.querySelector(config.settingsButton).getBoundingClientRect();
        return {
          standard:config.standard,
          topDelta:Math.abs(unit.top - settings.top),
          bottomDelta:Math.abs(unit.bottom - settings.bottom),
          centerYDelta:Math.abs((unit.top + unit.bottom) / 2 - (settings.top + settings.bottom) / 2),
          heightDelta:Math.abs(unit.height - settings.height),
          gap:settings.left - unit.right
        };
      })()
    `.replace("TOP_CONTROLS_CONFIG", JSON.stringify(topControlsConfig)));
    const wrong = await evalInPage(page, String.raw`
      (() => {
        const button = [...document.querySelectorAll("#choicesPanel button")].find((item) => item.dataset.correct !== "true");
        if (!button) throw new Error("wrong choice not found");
        button.click();
        const feedback = document.querySelector("#feedbackLine");
        return { feedback:feedback.textContent, textAlign:getComputedStyle(feedback).textAlign, wrongChoices:document.querySelectorAll("#choicesPanel .is-wrong").length };
      })()
    `);
    await captureLessonScreenshot(page, `current-${viewport.name}-06-play-wrong.png`);
    await loadLessonPage(page, pageUrl);
    const complete = await evalInPage(page, PLAY_TO_COMPLETE);
    await captureLessonScreenshot(page, `current-${viewport.name}-07-complete-confirm.png`);
    const overflow = await evalInPage(page, String.raw`
      (() => [...document.querySelectorAll("#screen-play.is-active .problem-grid, #screen-play.is-active .problem-card, #screen-play.is-active .step-board, #screen-play.is-active .choices-panel, #screen-play.is-active .complete-panel, #screen-play.is-active .instruction, #screen-play.is-active .answer-slot, #screen-play.is-active .feedback-line, #screen-play.is-active button")]
        .filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
        .map((node) => node.id || node.className)
        .concat([...document.querySelectorAll("#screen-play.is-active .progress-eyebrow, #screen-play.is-active .progress-text")]
          .filter((node) => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1)
          .map((node) => node.id || node.className)))()
    `);
    observations.push({ viewport, instruction, topControls, wrong, complete, overflow });
  }
  await page.send("Emulation.clearDeviceMetricsOverride");
  const pass = observations.every((item) => item.wrong.feedback === "1kg을 빌린 위 무게를 다시 써요."
    && item.wrong.wrongChoices === 1
    && item.complete.truckDisabled === false
    && item.complete.completionRole === "math"
    && item.complete.completionTextAlign === "center"
    && item.instruction.text === "1kg은 1000g이에요."
    && item.instruction.textAlign === "left"
    && item.instruction.wordBreak === "keep-all"
    && item.instruction.overflowWrap === "normal"
    && item.instruction.lineCount === 1
    && item.instruction.overflowX <= 1
    && item.instruction.overflowY <= 1
    && item.wrong.textAlign === "left"
    && item.topControls.standard === "stage-top-controls-v1"
    && item.topControls.topDelta <= LESSON_CONFIG.qa.topControlsAudit.topTolerancePx
    && item.topControls.bottomDelta <= LESSON_CONFIG.qa.topControlsAudit.bottomTolerancePx
    && item.topControls.centerYDelta <= LESSON_CONFIG.qa.topControlsAudit.centerYTolerancePx
    && item.topControls.heightDelta <= LESSON_CONFIG.qa.topControlsAudit.heightTolerancePx
    && item.topControls.gap >= LESSON_CONFIG.qa.topControlsAudit.minGapPx
    && item.overflow.length === 0);
  return {
    name:"core_screen_evidence_all_viewports",
    pass,
    expected:{ screens:["cover", "settings", "tutorial-1", "tutorial-2", "play-wait", "play-wrong", "complete-confirm"], instruction:"1kg은 1000g이에요. (one line, left, keep-all)", wrongFeedback:"1kg을 빌린 위 무게를 다시 써요. (left)", topControls:"<=1px, gap>=8px", overflow:0 },
    observed:observations
  };
}

async function runCalculationBoardStateProbe(page, pageUrl) {
  const viewports = [
    { name:"desktop", width:1280, height:800 },
    { name:"tablet-landscape", width:1024, height:768 }
  ];
  const observations = [];
  const snapshotExpression = String.raw`
    (() => {
      const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
      const readRow = (node) => ({
        className:node.className,
        operator:normalize(node.querySelector(".weight-operator")?.textContent),
        major:normalize(node.querySelector(".weight-major-slot")?.textContent),
        minor:normalize(node.querySelector(".weight-minor-slot")?.textContent),
        ariaLabel:node.getAttribute("aria-label") || ""
      });
      const rows = [...document.querySelectorAll("#problemTitle .weight-row:not(.weight-columns-header)")];
      const valueNodes = [...document.querySelectorAll("#problemTitle .weight-row:not(.weight-columns-header) .weight-value")];
      const majorRightEdges = [...document.querySelectorAll("#problemTitle .weight-row:not(.weight-columns-header) .weight-major-slot")].map((node) => node.getBoundingClientRect().right);
      const minorRightEdges = [...document.querySelectorAll("#problemTitle .weight-row:not(.weight-columns-header) .weight-minor-slot")].map((node) => node.getBoundingClientRect().right);
      const rule = document.querySelector("#problemTitle .equation-rule")?.getBoundingClientRect();
      const resultNode = document.querySelector("#problemTitle .equation-result-row");
      const result = resultNode?.getBoundingClientRect();
      const annotationNode = document.querySelector("#problemTitle .borrow-annotation-row");
      const originalNode = document.querySelector("#problemTitle .is-borrowed-source");
      const title = document.querySelector("#problemTitle");
      const qaState = window.__lesson5PackageQa.getState();
      return {
        problemType:qaState.problemType,
        solvedStepIds:qaState.solvedStepIds,
        rows:rows.filter((node) => !node.classList.contains("equation-result-row") && !node.classList.contains("borrow-annotation-row")).map(readRow),
        annotation:annotationNode ? readRow(annotationNode) : null,
        result:resultNode ? readRow(resultNode) : null,
        resultNote:normalize(document.querySelector("#problemTitle .equation-result-note")?.textContent),
        answerSlot:normalize(document.querySelector("#answerSlot")?.textContent),
        completeVisible:document.querySelector("#completePanel")?.classList.contains("is-visible"),
        resultBelowRule:Boolean(rule && result && result.top >= rule.bottom),
        annotationAboveOriginal:Boolean(annotationNode && originalNode && annotationNode.getBoundingClientRect().bottom <= originalNode.getBoundingClientRect().top + 1),
        maxMajorRightSpread:majorRightEdges.length ? Math.max(...majorRightEdges) - Math.min(...majorRightEdges) : 0,
        maxMinorRightSpread:minorRightEdges.length ? Math.max(...minorRightEdges) - Math.min(...minorRightEdges) : 0,
        overflowX:Math.max(0, title.scrollWidth - title.clientWidth),
        overflowY:Math.max(0, title.scrollHeight - title.clientHeight)
      };
    })()
  `;
  const openPlay = String.raw`
    (async () => {
      const waitFor = (predicate, label, timeout = 5000) => new Promise((resolve, reject) => {
        const started = performance.now();
        const tick = () => {
          if (predicate()) return resolve(true);
          if (performance.now() - started > timeout) return reject(new Error("Timed out waiting for " + label));
          setTimeout(tick, 16);
        };
        tick();
      });
      document.querySelector("#startButton").click();
      for (let guard = 0; guard < 4 && !document.querySelector("#screen-play").classList.contains("is-active"); guard += 1) {
        document.querySelector("#tutorialStartButton").click();
        await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active")
          || document.querySelector("#screen-tutorial").classList.contains("is-active"), "tutorial");
      }
      await waitFor(() => document.querySelector("#screen-play").classList.contains("is-active"), "play");
      return window.__lesson5PackageQa.getState();
    })()
  `;
  const chooseCorrect = String.raw`
    (() => {
      const button = [...document.querySelectorAll("#choicesPanel button")]
        .find((item) => item.dataset.correct === "true" && !item.disabled);
      if (!button) throw new Error("correct choice not found");
      const answer = button.textContent;
      button.click();
      return answer;
    })()
  `;

  for (const viewport of viewports) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width:viewport.width,
      height:viewport.height,
      deviceScaleFactor:1,
      mobile:false
    });
    await loadLessonPage(page, pageUrl);
    await evalInPage(page, openPlay);
    const waiting = await evalInPage(page, snapshotExpression);

    const borrowAnswer = await evalInPage(page, chooseCorrect);
    await delay(80);
    const borrowed = await evalInPage(page, snapshotExpression);
    await captureLessonScreenshot(page, `calculation-${viewport.name}-01-borrowed.png`);

    await delay(1250);
    const gramAnswer = await evalInPage(page, chooseCorrect);
    await delay(80);
    const grams = await evalInPage(page, snapshotExpression);
    await captureLessonScreenshot(page, `calculation-${viewport.name}-02-grams.png`);

    await delay(1250);
    const finalAnswer = await evalInPage(page, chooseCorrect);
    await delay(650);
    const completed = await evalInPage(page, snapshotExpression);
    await captureLessonScreenshot(page, `calculation-${viewport.name}-03-complete.png`);

    observations.push({ viewport, answers:{ borrowAnswer, gramAnswer, finalAnswer }, waiting, borrowed, grams, completed });
  }
  await page.send("Emulation.clearDeviceMetricsOverride");

  const parseWeight = (value) => {
    const match = String(value).match(/(\d+)kg\s*(\d+)g/);
    return match ? { major:match[1], minor:match[2] } : null;
  };
  const parseGrams = (value) => String(value).match(/(\d+)g/)?.[1] || "";
  const pass = observations.every(({ answers, waiting, borrowed, grams, completed }) =>
    waiting.problemType === "subtractBorrow"
    && waiting.result === null
    && waiting.annotation === null
    && waiting.solvedStepIds.length === 0
    && waiting.rows.length === 2
    && borrowed.solvedStepIds.includes("borrowKg")
    && borrowed.result === null
    && borrowed.resultNote === ""
    && borrowed.annotationAboveOriginal
    && borrowed.annotation?.major === parseWeight(answers.borrowAnswer)?.major
    && borrowed.annotation?.minor === parseWeight(answers.borrowAnswer)?.minor
    && borrowed.rows[0].major === waiting.rows[0].major
    && borrowed.rows[0].minor === waiting.rows[0].minor
    && grams.solvedStepIds.includes("subtractGrams")
    && grams.result?.operator === "="
    && grams.result?.major === ""
    && grams.result?.minor === parseGrams(answers.gramAnswer)
    && grams.resultNote === "g끼리 뺀 값"
    && completed.solvedStepIds.includes("subtractFinal")
    && completed.result?.major === parseWeight(answers.finalAnswer)?.major
    && completed.result?.minor === parseWeight(answers.finalAnswer)?.minor
    && completed.resultNote === "완성 무게"
    && completed.completeVisible
    && [borrowed, grams, completed].every((stage) => stage.maxMajorRightSpread <= 1
      && stage.maxMinorRightSpread <= 1
      && stage.overflowX <= 1
      && stage.overflowY <= 1)
    && [grams, completed].every((stage) => stage.resultBelowRule));

  return {
    name:"calculation_board_wait_borrow_grams_complete_all_viewports",
    pass,
    expected:{ problemType:"subtractBorrow", states:["waiting", "borrowed", "grams", "complete"], originalMinuendRetained:true, borrowAnnotationAboveOriginal:true, noFalseBorrowEquality:true, gramsMajorColumnBlank:true, columnRightEdgeTolerancePx:1, overflow:0 },
    observed:observations
  };
}

async function runPlayProgressSetProbe(page, pageUrl) {
  const audit = LESSON_CONFIG.qa.playProgressAudit;
  const tierIds = audit.expectedStates;
  const observations = [];
  for (const viewport of QA_VIEWPORTS) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width:viewport.width,
      height:viewport.height,
      deviceScaleFactor:viewport.deviceScaleFactor || 1,
      mobile:false
    });
    for (const tierId of tierIds) {
      await loadLessonPage(page, pageUrl);
      const observed = await evalInPage(page, String.raw`
        (async (tierId, audit, results) => {
          const forced = window.__lesson5PackageQa.forcePlayTier(tierId);
          const imageNode = document.querySelector(audit.image);
          await imageNode.decode();
          await new Promise((resolve) => setTimeout(resolve, 1250));
          const rect = (node) => {
            const value = node?.getBoundingClientRect();
            return value ? { left:value.left, top:value.top, right:value.right, bottom:value.bottom, width:value.width, height:value.height, cx:value.left + value.width / 2, cy:value.top + value.height / 2 } : null;
          };
          const intersects = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          const stage = rect(document.querySelector(".stage-shell"));
          const panel = rect(document.querySelector(audit.panel));
          const image = rect(imageNode);
          const labelNode = document.querySelector(audit.label);
          const label = rect(labelNode);
          const problemGrid = rect(document.querySelector(".problem-grid"));
          const learningNodes = [".problem-card", ".step-board", ".choices-panel"].map((selector) => rect(document.querySelector(selector))).filter(Boolean);
          const placement = audit.panelPlacement;
          const expectedPanel = {
            left:stage.left + stage.width * placement.leftRatio,
            top:stage.top + stage.height * placement.topRatio,
            right:stage.left + stage.width * (placement.leftRatio + placement.widthRatio),
            bottom:stage.top + stage.height * (placement.topRatio + placement.heightRatio)
          };
          expectedPanel.width = expectedPanel.right - expectedPanel.left;
          expectedPanel.height = expectedPanel.bottom - expectedPanel.top;
          expectedPanel.cx = expectedPanel.left + expectedPanel.width / 2;
          const expected = results.find((result) => result.id === tierId);
          const imageStyle = getComputedStyle(imageNode);
          return {
            forced,
            tierId,
            stage,
            panel,
            image,
            label,
            problemGrid,
            learningIntersections:learningNodes.map((node) => intersects(panel, node)),
            expectedPanel,
            panelImageCenterDelta:Math.abs(panel.cx - image.cx),
            panelLaneCenterDelta:Math.abs(panel.cx - expectedPanel.cx),
            labelInside:label.left >= panel.left - 1 && label.right <= panel.right + 1 && label.top >= panel.top - 1 && label.bottom <= panel.bottom + 1,
            labelOverflow:labelNode.scrollWidth > labelNode.clientWidth + 1 || labelNode.scrollHeight > labelNode.clientHeight + 1,
            labelText:labelNode.textContent.trim(),
            source:imageNode.getAttribute("src") || "",
            expectedSource:expected.playImage,
            resultSource:expected.image,
            natural:[imageNode.naturalWidth, imageNode.naturalHeight],
            objectFit:imageStyle.objectFit,
            active:document.querySelector("#screen-play").classList.contains("is-active")
          };
        })
      ` + `(${JSON.stringify(tierId)}, ${JSON.stringify(audit)}, ${JSON.stringify(LESSON_CONFIG.results)})`);
      await captureLessonScreenshot(page, `play-progress-${tierId}-${viewport.name}.png`);
      observations.push({ viewport, tierId, observed });
    }
  }
  await page.send("Emulation.clearDeviceMetricsOverride");
  const tolerance = audit.panelPlacement.tolerancePx;
  const pass = observations.every(({ observed }) =>
    observed.active
    && observed.source === observed.expectedSource
    && observed.source !== observed.resultSource
    && observed.natural.join("x") === "768x1536"
    && observed.objectFit === "contain"
    && ["left", "top", "right", "bottom"].every((edge) => Math.abs(observed.panel[edge] - observed.expectedPanel[edge]) <= tolerance)
    && observed.panelLaneCenterDelta <= audit.panelLaneCenterTolerancePx
    && observed.panelImageCenterDelta <= audit.imagePanelCenterTolerancePx
    && observed.learningIntersections.every((area) => area === 0)
    && observed.problemGrid.left >= observed.panel.right
    && observed.labelInside
    && !observed.labelOverflow
    && observed.labelText.length > 0
  );
  return {
    name:"play_progress_all_tiers_all_viewports",
    pass,
    expected:{ tiers:tierIds, viewports:QA_VIEWPORTS.map((item) => `${item.width}x${item.height}@${item.deviceScaleFactor || 1}x`), panelEdges:"<=1px", learningIntersection:0, canvas:"768x1536", objectFit:"contain", resultCropReuse:false },
    observed:observations
  };
}

async function runResultTierSetProbe(page, pageUrl) {
  const viewports = QA_VIEWPORTS;
  const tierIds = RESULT_AUDIT.expectedStates;
  const observations = [];
  for (const viewport of viewports) {
    await page.send("Emulation.setDeviceMetricsOverride", {
      width: viewport.width,
      height: viewport.height,
      deviceScaleFactor: viewport.deviceScaleFactor || 1,
      mobile: false
    });
    for (const tierId of tierIds) {
      await loadLessonPage(page, pageUrl);
      const observed = await evalInPage(page, String.raw`
        (async (tierId, config, results) => {
          const forced = window.__lesson5PackageQa.forceResultTier(tierId);
          await Promise.all([document.querySelector("#resultBg").decode(), document.querySelector("#resultPanelArt")?.decode?.(), document.querySelector("#resultCorrectArt").decode()]);
          const rect = (node) => {
            const value = node?.getBoundingClientRect();
            return value ? { left:value.left, top:value.top, right:value.right, bottom:value.bottom, width:value.width, height:value.height, cx:value.left + value.width / 2, cy:value.top + value.height / 2 } : null;
          };
          const intersects = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
          const stage = rect(document.querySelector(".stage-shell"));
          const sceneNode = document.querySelector("#resultBg");
          const panelNode = document.querySelector("#resultPanelArt");
          const scene = rect(sceneNode);
          const panelLayer = rect(panelNode);
          const correct = rect(document.querySelector("#resultCorrectArt"));
          const retry = rect(document.querySelector("#retryButton"));
          const fill = rect(document.querySelector("#resultProgressFill"));
          const track = rect(document.querySelector("#resultProgressTrack"));
          const powerText = document.querySelector("#resultPowerText");
          const nextText = document.querySelector("#resultNextGoalText");
          const measure = rect(powerText);
          const next = rect(nextText);
          const scaleX = stage.width / 1280;
          const scaleY = stage.height / 800;
          const baseAxis = Number(config.dynamicAxisX);
          const tierAxis = Number(config.dynamicAxisByTier[tierId]);
          const shiftedSlots = Object.fromEntries(Object.entries(config.slots).map(([key, slot]) => [
            key,
            { ...slot, x:slot.x + tierAxis - baseAxis }
          ]));
          const toScreenRect = (slot) => ({
            left:stage.left + slot.x * scaleX,
            top:stage.top + slot.y * scaleY,
            right:stage.left + (slot.x + slot.width) * scaleX,
            bottom:stage.top + (slot.y + slot.height) * scaleY,
            width:slot.width * scaleX,
            height:slot.height * scaleY,
            cx:stage.left + (slot.x + slot.width / 2) * scaleX,
            cy:stage.top + (slot.y + slot.height / 2) * scaleY
          });
          const slots = Object.fromEntries(Object.entries(shiftedSlots).map(([key, slot]) => [key, toScreenRect(slot)]));
          const detectPanel = () => {
            const panelConfig = config.panelPixelAudit;
            if (panelConfig.mode === "element-bounds") {
              if (!panelLayer || !stage || panelLayer.width <= 0 || panelLayer.height <= 0) return { error:"panel-layer-missing" };
              return {
                left:(panelLayer.left - stage.left) / scaleX,
                top:(panelLayer.top - stage.top) / scaleY,
                right:(panelLayer.right - stage.left) / scaleX - 1,
                bottom:(panelLayer.bottom - stage.top) / scaleY - 1,
                width:panelLayer.width / scaleX,
                height:panelLayer.height / scaleY,
                cx:(panelLayer.left + panelLayer.right) / 2 / scaleX - stage.left / scaleX
              };
            }
            const canvas = document.createElement("canvas");
            canvas.width = 1280;
            canvas.height = 800;
            const context = canvas.getContext("2d", { willReadFrequently:true });
            context.drawImage(sceneNode, 0, 0, 1280, 800);
            const pixels = context.getImageData(0, 0, 1280, 800).data;
            const search = panelConfig.searchRect;
            const rgb = panelConfig.lightRgbMin;
            const median = (values) => {
              const sorted = [...values].sort((a, b) => a - b);
              const middle = Math.floor(sorted.length / 2);
              return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
            };
            const rows = [];
            for (let y = search.y; y < search.y + search.height; y += 1) {
              let start = null;
              let best = null;
              for (let x = search.x; x <= search.x + search.width; x += 1) {
                let matches = false;
                if (x < search.x + search.width) {
                  const offset = (y * 1280 + x) * 4;
                  const red = pixels[offset];
                  const green = pixels[offset + 1];
                  const blue = pixels[offset + 2];
                  const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
                  matches = red >= rgb.r && green >= rgb.g && blue >= rgb.b && spread <= panelConfig.channelSpreadMax;
                }
                if (matches && start === null) start = x;
                if ((!matches || x === search.x + search.width) && start !== null) {
                  const right = x - 1;
                  const run = { y, left:start, right, width:right - start + 1, cx:(start + right) / 2 };
                  if (!best || run.width > best.width) best = run;
                  start = null;
                }
              }
              if (best && best.width >= panelConfig.minRunWidth) rows.push(best);
            }
            const groups = [];
            for (const row of rows) {
              const previous = groups.at(-1);
              if (!previous || row.y !== previous.at(-1).y + 1 || Math.abs(row.cx - median(previous.map((item) => item.cx))) > 64) groups.push([row]);
              else previous.push(row);
            }
            groups.sort((a, b) => b.length * median(b.map((item) => item.width)) - a.length * median(a.map((item) => item.width)));
            const group = groups[0] || [];
            if (!group.length) return { error:"no-panel-row-run" };
            const middleWidth = median(group.map((item) => item.width));
            const stable = group.filter((item) => item.width >= middleWidth * .9);
            const left = median(stable.map((item) => item.left));
            const right = median(stable.map((item) => item.right));
            const top = Math.min(...stable.map((item) => item.y));
            const bottom = Math.max(...stable.map((item) => item.y));
            return { left, right, top, bottom, width:right - left + 1, height:bottom - top + 1, cx:(left + right) / 2 };
          };
          const panel = detectPanel();
          const title = rect(document.querySelector("#resultTitleArt"));
          const retryArt = rect(document.querySelector(".result-retry-art"));
          const retryHitbox = retry;
          const rects = { title, measure, track, correct, next, retryArt, retryHitbox, retry };
          const pairs = [];
          const keys = Object.keys(rects);
          for (let first = 0; first < keys.length; first += 1) for (let second = first + 1; second < keys.length; second += 1) {
            const pair = keys[first] + ":" + keys[second];
            const expectedButtonOverlap = new Set(["retryArt:retryHitbox", "retryArt:retry", "retryHitbox:retry"]);
            if (expectedButtonOverlap.has(pair)) continue;
            pairs.push({ pair, area:intersects(rects[keys[first]], rects[keys[second]]) });
          }
          const panelScreen = panel.error ? null : config.panelPixelAudit?.mode === "element-bounds"
            ? panelLayer
            : {
            left:stage.left + panel.left * scaleX,
            top:stage.top + panel.top * scaleY,
            right:stage.left + (panel.right + 1) * scaleX,
            bottom:stage.top + (panel.bottom + 1) * scaleY,
            width:(panel.right + 1 - panel.left) * scaleX,
            height:(panel.bottom + 1 - panel.top) * scaleY
          };
          const panelSafeRect = panelScreen ? {
            left:panelScreen.left + 24 * scaleX,
            top:panelScreen.top + 24 * scaleY,
            right:panelScreen.right - 24 * scaleX,
            bottom:panelScreen.bottom - 24 * scaleY,
            width:panelScreen.width - 48 * scaleX,
            height:panelScreen.height - 48 * scaleY
          } : null;
          const contained = (node) => Boolean(node && panelSafeRect
            && node.left >= panelSafeRect.left - 1 && node.top >= panelSafeRect.top - 1
            && node.right <= panelSafeRect.right + 1 && node.bottom <= panelSafeRect.bottom + 1);
          const visualKeys = ["title", "measure", "track", "correct", "next", "retryArt"];
          const visualIntersections = [];
          for (let first = 0; first < visualKeys.length; first += 1) for (let second = first + 1; second < visualKeys.length; second += 1) {
            const area = intersects(rects[visualKeys[first]], rects[visualKeys[second]]);
            if (area > 0) visualIntersections.push({ pair:visualKeys[first] + ":" + visualKeys[second], area });
          }
          const sceneStyle = getComputedStyle(sceneNode);
          const forbiddenVisible = config.forbiddenSelectors.flatMap((selector) => [...document.querySelectorAll(selector)]).filter((node) => {
            const style = getComputedStyle(node);
            return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 0) > 0;
          }).map((node) => node.className || node.id || node.tagName);
          return {
            forced,
            active:document.querySelector("#screen-result").classList.contains("is-active"),
            tier:document.querySelector("#screen-result").dataset.resultTier,
            stage, scene, rects, slots, panel, panelScreen, panelSafeRect, fill,
            containment:Object.fromEntries(Object.entries(rects).map(([key, node]) => [key, contained(node)])),
            visualIntersections,
            retryArtHitboxEdges:retryArt && retryHitbox ? { left:Math.abs(retryArt.left - retryHitbox.left), top:Math.abs(retryArt.top - retryHitbox.top), right:Math.abs(retryArt.right - retryHitbox.right), bottom:Math.abs(retryArt.bottom - retryHitbox.bottom) } : null,
            targetAxis:tierAxis,
            targetScreenAxis:stage.left + tierAxis * scaleX,
            scaleX, scaleY,
            intersections:pairs,
            styles:{ objectFit:sceneStyle.objectFit, mixBlendMode:sceneStyle.mixBlendMode, filter:sceneStyle.filter, opacity:Number(sceneStyle.opacity) },
            separateLayers:{ title:getComputedStyle(document.querySelector("#resultTitleArt")).display, retry:getComputedStyle(document.querySelector(".result-retry-art")).display },
            forbiddenVisible,
            text:{ power:powerText.textContent, next:nextText.textContent, powerLength:powerText.getComputedTextLength(), nextLength:nextText.getComputedTextLength(), powerFont:parseFloat(getComputedStyle(powerText).fontSize), nextFont:parseFloat(getComputedStyle(nextText).fontSize) },
            natural:{ bg:[sceneNode.naturalWidth, sceneNode.naturalHeight] },
            source:sceneNode.getAttribute("src"),
            resultImage:results.find((result) => result.id === tierId)?.image || ""
          };
        })
      ` + `(${JSON.stringify(tierId)}, ${JSON.stringify(RESULT_AUDIT)}, ${JSON.stringify(LESSON_CONFIG.results)})`);
      await captureLessonScreenshot(page, `result-tier-${tierId}-${viewport.name}.png`);
      observations.push({ viewport, tierId, observed });
    }
  }
  await page.send("Emulation.clearDeviceMetricsOverride");
  const contains = (outer, inner, tolerance = 1) => inner.left >= outer.left - tolerance
    && inner.top >= outer.top - tolerance && inner.right <= outer.right + tolerance && inner.bottom <= outer.bottom + tolerance;
  const edgeMatch = (first, second, tolerance = 1) => ["left", "top", "right", "bottom"].every((edge) => Math.abs(first[edge] - second[edge]) <= tolerance);
  const panelSizeGroups = new Map();
  for (const item of observations) {
    const key = item.viewport.name;
    const size = item.observed.panelScreen;
    if (!size) continue;
    const first = panelSizeGroups.get(key);
    if (!first) panelSizeGroups.set(key, size);
  }
  const samePanelSize = observations.every((item) => {
    const first = panelSizeGroups.get(item.viewport.name);
    const current = item.observed.panelScreen;
    return !first || !current || Math.abs(first.width - current.width) <= 1 && Math.abs(first.height - current.height) <= 1;
  });
  const pass = observations.every(({ tierId, observed }) => {
    const ordered = ["measure", "track", "correct", "next", "retry"];
    const gap = RESULT_AUDIT.minVerticalGapPx * observed.scaleX;
    return observed.active
      && observed.tier === tierId
      && observed.source === observed.resultImage
      && observed.natural.bg.join("x") === "1280x800"
      && observed.styles.objectFit === "cover"
      && observed.styles.mixBlendMode === "normal"
      && observed.styles.filter === "none"
      && observed.styles.opacity === 1
      && observed.separateLayers.title !== "none"
      && observed.separateLayers.retry !== "none"
      && observed.forbiddenVisible.length === 0
      && edgeMatch(observed.scene, observed.stage)
      && !observed.panel.error
      && observed.panelScreen
      && observed.panelSafeRect.width > 0
      && observed.panelSafeRect.height > 0
      && Object.values(observed.containment).every(Boolean)
      && observed.visualIntersections.length === 0
      && observed.retryArtHitboxEdges && Object.values(observed.retryArtHitboxEdges).every((value) => value <= 1)
      && Math.abs(observed.panel.cx - observed.targetAxis) <= RESULT_AUDIT.panelPixelAudit.centerTolerancePx
      && ["measure", "track", "correct", "next", "retry"].every((key) => contains(observed.slots[key], observed.rects[key]))
      && ["measure", "track", "correct", "next", "retry"].every((key) => Math.abs(observed.rects[key].cx - observed.targetScreenAxis) <= RESULT_AUDIT.axisTolerancePx)
      && edgeMatch(observed.rects.track, observed.slots.track)
      && edgeMatch(observed.rects.retry, observed.slots.retry)
      && observed.intersections.every((item) => item.area === 0)
      && ordered.slice(0, -1).every((key, index) => observed.rects[ordered[index + 1]].top - observed.rects[key].bottom >= gap - 1)
      && observed.fill.width <= observed.rects.track.width + 1
      && observed.text.powerFont === RESULT_AUDIT.measureFontPx
      && observed.text.nextFont === RESULT_AUDIT.nextFontPx
      && observed.text.power.includes("트럭 힘")
      && observed.text.next.length > 0
      && samePanelSize;
  });
  return {
    name:"result_all_tiers_all_viewports",
    pass,
    expected:{ tiers:tierIds, viewports:viewports.map((item) => `${item.width}x${item.height}@${item.deviceScaleFactor || 1}x`), siblingIntersections:0, panelAndDynamicAxisError:"<=3px/<=1px", separateTitleAndRetryVisible:0, fullScene:"1280x800" },
    observed:observations
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = await fsp.mkdtemp(path.join(os.tmpdir(), "lesson5-click-guards-"));
  const seedPageUrl = `http://127.0.0.1:${serverPort}/${LESSON}/index.html?seed=${options.seed}&qa=click-guards`;
  const randomPageUrl = `http://127.0.0.1:${serverPort}/${LESSON}/index.html`;
  let server;
  let chrome;
  let page;
  const cleanup = { serverPort, debugPort, profileDir, serverClosed: false, chromeKilled: false, profileRemoved: false };

  try {
    server = await makeServer(serverPort);
    chrome = await launchChrome(seedPageUrl, debugPort, profileDir);
    const pageWs = await waitForPageTarget(debugPort, seedPageUrl);
    page = new Cdp(pageWs);
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await waitForLoad(page);

    const probes = [];
    if (options.impactOnly) {
      probes.push(await runRewardWorldImpactProbe(page, seedPageUrl));
    } else if (options.visualOnly) {
      probes.push(await runResultRasterContractProbe(page, seedPageUrl));
      probes.push(await runPlayProgressSetProbe(page, seedPageUrl));
      probes.push(await runResultTierSetProbe(page, seedPageUrl));
      probes.push(await runReportEvidenceCaptureProbe(page, seedPageUrl));
    } else {
      probes.push(runPlayBrandSourceProbe());
      probes.push(runRewardModalSourceProbe());
      probes.push(await runTutorialPosterProbe(page, seedPageUrl));
      probes.push(await runCoreScreenEvidenceProbe(page, seedPageUrl));
      probes.push(await runCalculationBoardStateProbe(page, seedPageUrl));
      probes.push(await runTabletLandscapeProbe(page, seedPageUrl));
      probes.push(await runRewardEventSetProbe(page, seedPageUrl));
      probes.push(await runEmptyRewardFixtureProbe(page, seedPageUrl));
      probes.push(await runRewardWorldImpactProbe(page, seedPageUrl));
      probes.push(await runTruckButtonTripleProbe(page, seedPageUrl, options.seed));
      probes.push(await runRewardNextDoubleProbe(page, seedPageUrl));
      probes.push(await runRewardNextPhysicalDoubleClickProbe(page, seedPageUrl));
      probes.push(await runTruckButtonStaleEventProbe(page, seedPageUrl, options.seed));
      probes.push(await runRewardNextStaleEventProbe(page, seedPageUrl));
      probes.push(await runSeedReplayProbe(page, seedPageUrl, randomPageUrl));
      probes.push(await runResultRasterContractProbe(page, seedPageUrl));
      probes.push(await runPlayProgressSetProbe(page, seedPageUrl));
      probes.push(await runResultTierSetProbe(page, seedPageUrl));
      probes.push(await runReportEvidenceCaptureProbe(page, seedPageUrl));
    }
    const pass = probes.every((probe) => probe.pass);
    const payload = {
      status: pass ? "PASS" : "FAIL",
      seed: options.seed,
      browser: getChromePath(),
      seedPageUrl,
      randomPageUrl,
      probes
    };
    console.log("LESSON5_PACKAGE_WEIGHT_CLICK_GUARDS: " + payload.status);
    console.log(JSON.stringify(payload, null, 2));
    if (!pass) {
      process.exitCode = 1;
    }
  } finally {
    if (page) page.close();
    if (server) {
      await closeServer(server);
      cleanup.serverClosed = true;
    }
    cleanup.chromeKilled = await stopProcess(chrome);
    await fsp.rm(profileDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    cleanup.profileRemoved = true;
    console.error("CLEANUP " + JSON.stringify(cleanup));
  }
}

main().catch((error) => {
  console.error("LESSON5_PACKAGE_WEIGHT_CLICK_GUARDS: ERROR");
  console.error(error.stack || error.message);
  if (error.details) console.error(JSON.stringify(error.details, null, 2));
  process.exit(1);
});
