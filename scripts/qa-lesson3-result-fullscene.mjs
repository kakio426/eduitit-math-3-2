import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { measureForbiddenScoreLabel, measureScoreCenter } from "./result-score-center.mjs";

const ROOT = process.cwd();
const LESSON = join(ROOT, "3-2-1-3-mathmon-jump-islands");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html?seed=12345&qaProblem=tenfold`;
const PORT = Number(process.env.LESSON3_RESULT_QA_PORT || 9254);
const PROFILE = join(ROOT, ".tmp-qa", "lesson3-result-profile");
const EVIDENCE_DIR = join(ROOT, ".tmp-qa", "lesson3-result-fullscene");
const VIEWPORTS = [{ name: "desktop", width: 1280, height: 800 }, { name: "tablet-landscape", width: 1024, height: 768 }];
const SCENARIOS = ["start:6", "sand:6", "forest:6", "cloud:8", "starlight:10", "rainbow:10"].map((item) => ({ id: item.split(":")[0], correct: Number(item.split(":")[1]) }));
const SCORE_BOXES = Object.fromEntries("start:63.9,57.5,25.3,12.4 sand:64.4,55.5,25.2,12.5 forest:64.7,56,24.9,11.8 cloud:63,55.5,26.5,12.4 starlight:63.1,57.5,26.8,12 rainbow:63.9,54.3,26.9,12.1".split(" ").map((entry) => {
  const [id, values] = entry.split(":");
  const slot = values.split(",").map(Number);
  return [id, { left: slot[0], top: slot[1], width: slot[2], height: slot[3] }];
}));

await rm(PROFILE, { recursive: true, force: true });
await rm(EVIDENCE_DIR, { recursive: true, force: true });
await mkdir(EVIDENCE_DIR, { recursive: true });

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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitForJson() {
  for (let index = 0; index < 80; index += 1) {
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

  close() {
    this.ws.close();
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

async function captureScreenshot(name, canonicalPath = "") {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false
  });
  const evidencePath = join(EVIDENCE_DIR, `${name}.png`);
  await writeFile(evidencePath, data, "base64");
  if (canonicalPath) {
    await writeFile(canonicalPath, data, "base64");
  }
  return evidencePath;
}

async function openLesson(viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 }
  });
  await cdp.send("Page.navigate", { url: `${FILE_URL}&resultQa=${viewport.name}-${Date.now()}` });
  await waitUntil("document.readyState === 'complete'", `${viewport.name}: lesson did not load`);
  await delay(250);
}

async function showResult(id, correct) {
  const escapedId = JSON.stringify(id);
  await evaluate(`
(() => {
  const islandIndex = ISLANDS.findIndex((item) => item.id === ${escapedId});
  if (islandIndex < 0) throw new Error("unknown island id");
  const island = ISLANDS[islandIndex];
  state.correct = ${correct};
  state.jumpDistance = island.minDistance;
  state.rainbowPath = Boolean(island.requiresRainbow);
  clearResultRevealTimers();
  setResultRevealPhase("idle");
  startResultReveal({ ...island, index: islandIndex });
})()
`);
  await waitUntil(`document.getElementById("finalCorrectText").textContent.trim() === "${correct}/10"`, `${id}: final score did not appear`);
  await waitUntil("document.getElementById('resultRaster').complete", `${id}: result raster did not load`);
  await delay(160);
}

async function readResultSnapshot() {
  return evaluate(`
(() => {
  const screen = document.getElementById("resultScreen");
  const score = document.getElementById("resultCountOverlay");
  const retry = document.getElementById("restartButton");
  const raster = document.getElementById("resultRaster");
  const rect = (node) => {
    const item = node.getBoundingClientRect();
    return { left: item.left, top: item.top, width: item.width, height: item.height };
  };
  const screenRect = rect(screen);
  const scoreRect = rect(score);
  const retryStyle = getComputedStyle(retry);
  const walker = document.createTreeWalker(screen, NodeFilter.SHOW_TEXT);
  const visibleTexts = [];
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim();
    const parent = walker.currentNode.parentElement;
    if (!text || !parent || parent.closest(".visually-hidden")) continue;
    const style = getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) continue;
    if (parent.getClientRects().length === 0) continue;
    visibleTexts.push(text);
  }
  return {
    bodyText: document.body.innerText,
    rasterSrc: raster.getAttribute("src"),
    scoreText: document.getElementById("finalCorrectText").textContent.trim(),
    scoreAria: score.getAttribute("aria-label"),
    scorePct: {
      left: ((scoreRect.left - screenRect.left) / screenRect.width) * 100,
      top: ((scoreRect.top - screenRect.top) / screenRect.height) * 100,
      width: (scoreRect.width / screenRect.width) * 100,
      height: (scoreRect.height / screenRect.height) * 100
    },
    screenRect,
    forbiddenCards: document.querySelectorAll(".result-stats, .result-stat, .result-card, .result-copy").length,
    resultTopRow: document.querySelectorAll("#resultScreen .top-row").length,
    resultTitleHidden: document.getElementById("resultTitle").classList.contains("visually-hidden"),
    praiseHidden: document.getElementById("praiseText").classList.contains("visually-hidden"),
    finalIslandHidden: document.getElementById("finalIslandText").classList.contains("visually-hidden"),
    retryTransparent: retryStyle.backgroundColor === "rgba(0, 0, 0, 0)" && retryStyle.color === "rgba(0, 0, 0, 0)",
    retryEnabled: !retry.disabled,
    visibleTexts
  };
})()
`);
}

const assertNear = (actual, expected, label) => assert(Math.abs(actual - expected) <= 0.15, `${label}: expected ${expected}, got ${actual.toFixed(2)}`);

const results = [];

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  for (const viewport of VIEWPORTS) {
    await openLesson(viewport);
    for (const scenario of SCENARIOS) {
      await showResult(scenario.id, scenario.correct);
      const snapshot = await readResultSnapshot();
      assert(snapshot.rasterSrc.includes(`result-final-${scenario.id}-generated.webp?v=clean-slot-20260630`), `${viewport.name}/${scenario.id}: wrong raster ${snapshot.rasterSrc}`);
      assert(snapshot.scoreText === `${scenario.correct}/10`, `${viewport.name}/${scenario.id}: wrong score ${snapshot.scoreText}`);
      assert(snapshot.scoreAria === `정답 ${scenario.correct}/10`, `${viewport.name}/${scenario.id}: wrong aria ${snapshot.scoreAria}`);
      assert(!snapshot.bodyText.includes("맞힌 문제"), `${viewport.name}/${scenario.id}: forbidden label remains`);
      assert(snapshot.forbiddenCards === 0, `${viewport.name}/${scenario.id}: CSS result card remnants remain`);
      assert(snapshot.resultTopRow === 0, `${viewport.name}/${scenario.id}: result top-row should not render`);
      assert(snapshot.resultTitleHidden && snapshot.praiseHidden && snapshot.finalIslandHidden, `${viewport.name}/${scenario.id}: hidden result text leaked`);
      assert(snapshot.retryTransparent && snapshot.retryEnabled, `${viewport.name}/${scenario.id}: restart hitbox is not transparent/enabled`);
      assert(snapshot.visibleTexts.length === 1 && snapshot.visibleTexts[0] === `${scenario.correct}/10`, `${viewport.name}/${scenario.id}: visible DOM text is not score-only ${JSON.stringify(snapshot.visibleTexts)}`);
      const expectedBox = SCORE_BOXES[scenario.id];
      assertNear(snapshot.scorePct.left, expectedBox.left, `${viewport.name}/${scenario.id}: score left`);
      assertNear(snapshot.scorePct.top, expectedBox.top, `${viewport.name}/${scenario.id}: score top`);
      assertNear(snapshot.scorePct.width, expectedBox.width, `${viewport.name}/${scenario.id}: score width`);
      assertNear(snapshot.scorePct.height, expectedBox.height, `${viewport.name}/${scenario.id}: score height`);
      const canonical = viewport.name === "desktop" && scenario.id === "rainbow"
        ? join(LESSON, "screenshots", "result.png")
        : "";
      const screenshot = await captureScreenshot(`${viewport.name}-${scenario.id}-${scenario.correct}`, canonical);
      const visualScore = await measureScoreCenter(screenshot, snapshot.screenRect, expectedBox);
      assert(Math.abs(visualScore.dx) <= visualScore.tolerance, `${viewport.name}/${scenario.id}: score is not horizontally centered in the image box (${visualScore.dx.toFixed(1)}px)`);
      assert(Math.abs(visualScore.dy) <= visualScore.tolerance, `${viewport.name}/${scenario.id}: score is not vertically centered in the image box (${visualScore.dy.toFixed(1)}px)`);
      const forbiddenLabel = await measureForbiddenScoreLabel(screenshot, snapshot.screenRect, expectedBox);
      assert(forbiddenLabel.darkPixels <= forbiddenLabel.maxAllowed, `${viewport.name}/${scenario.id}: forbidden score label pixels remain above the score box (${forbiddenLabel.darkPixels} > ${forbiddenLabel.maxAllowed})`);
      results.push({ viewport: viewport.name, scenario, screenshot, scorePct: snapshot.scorePct, visualScore, forbiddenLabel });
    }
  }
  console.log("LESSON3_RESULT_FULLSCENE_QA: PASS");
  console.log(JSON.stringify({ evidenceDir: EVIDENCE_DIR, results }, null, 2));
} finally {
  cdp.close();
  if (browser.exitCode === null) {
    browser.kill();
    await Promise.race([
      new Promise((resolve) => browser.once("exit", resolve)),
      delay(2000)
    ]);
  }
  await rm(PROFILE, { recursive: true, force: true });
}
