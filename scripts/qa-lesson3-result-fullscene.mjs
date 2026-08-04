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
  const island = LESSON_CONFIG.results.find((item) => item.id === ${escapedId});
  if (!island) throw new Error("unknown island id");
  window.__mathmonEngineQa.setState({
    power:island.minPower,
    correctFirstTry:${correct},
    specialSeen:Boolean(island.needsSpecial),
    currentResult:null
  });
  window.__mathmonEngineQa.showResult();
})()
`);
  await waitUntil(`document.getElementById("screen-result")?.dataset.resultTier === ${escapedId}`, `${id}: result tier did not update`);
  const scoreState = await evaluate(`(() => ({
    summary:document.getElementById("resultSummary").textContent.trim(),
    correct:window.__mathmonEngineQa.getState().correctFirstTry,
    problems:LESSON_CONFIG.typesPerRun.length
  }))()`);
  assert(scoreState.summary === `정답 ${correct}/10`, `${id}: hidden final score did not update: ${JSON.stringify(scoreState)}`);
  await waitUntil(`(() => {
    const art = document.getElementById("resultCorrectArt");
    return Boolean(art && !art.hidden && art.complete && art.naturalWidth > 0 && art.getAttribute("src").includes("result-correct-${correct}-generated.webp"));
  })()`, `${id}: generated correct-count art did not appear`);
  await waitUntil("document.getElementById('resultBg').complete && document.getElementById('resultBg').naturalWidth === 1280", `${id}: result raster did not load`);
  await delay(160);
}

async function readResultSnapshot() {
  return evaluate(`
(() => {
  const screen = document.getElementById("screen-result");
  const retry = document.getElementById("retryButton");
  const raster = document.getElementById("resultBg");
  const correctArt = document.getElementById("resultCorrectArt");
  const rect = (node) => {
    const item = node.getBoundingClientRect();
    return { left: item.left, top: item.top, width: item.width, height: item.height };
  };
  const screenRect = rect(screen);
  const correctArtRect = rect(correctArt);
  const correctArtStyle = getComputedStyle(correctArt);
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
    scoreText: document.getElementById("resultSummary").textContent.trim(),
    tier: screen.dataset.resultTier || "",
    correctArt: {
      visible: Boolean(correctArt
        && !correctArt.hidden
        && correctArtStyle.display !== "none"
        && correctArtStyle.visibility !== "hidden"
        && Number(correctArtStyle.opacity || "1") > 0
        && correctArt.complete
        && correctArt.naturalWidth > 0
        && correctArtRect.width > 0
        && correctArtRect.height > 0),
      src: correctArt.getAttribute("src"),
      pct: {
        left: ((correctArtRect.left - screenRect.left) / screenRect.width) * 100,
        top: ((correctArtRect.top - screenRect.top) / screenRect.height) * 100,
        width: (correctArtRect.width / screenRect.width) * 100,
        height: (correctArtRect.height / screenRect.height) * 100
      }
    },
    scorePct: {
      left: ((correctArtRect.left - screenRect.left) / screenRect.width) * 100,
      top: ((correctArtRect.top - screenRect.top) / screenRect.height) * 100,
      width: (correctArtRect.width / screenRect.width) * 100,
      height: (correctArtRect.height / screenRect.height) * 100
    },
    screenRect,
    forbiddenCards: document.querySelectorAll(".result-stats, .result-stat, .result-card, .result-copy").length,
    resultTopRowVisible: (() => {
      const row = screen.querySelector(".top-row");
      return Boolean(row && getComputedStyle(row).display !== "none" && row.getBoundingClientRect().width > 0);
    })(),
    resultTitleHidden: document.getElementById("resultTitle").classList.contains("visually-hidden"),
    resultSummaryHidden: document.getElementById("resultSummary").classList.contains("visually-hidden"),
    retryTransparent: retryStyle.backgroundColor === "rgba(0, 0, 0, 0)" && retryStyle.borderTopWidth === "0px",
    retryEnabled: !retry.disabled,
    leaderboardHidden: document.getElementById("leaderboardButton").hidden,
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
      assert(snapshot.tier === scenario.id, `${viewport.name}/${scenario.id}: wrong result tier ${snapshot.tier}`);
      assert(snapshot.rasterSrc.endsWith(`result-final-${scenario.id}-generated.webp`), `${viewport.name}/${scenario.id}: wrong raster ${snapshot.rasterSrc}`);
      assert(snapshot.scoreText === `정답 ${scenario.correct}/10`, `${viewport.name}/${scenario.id}: wrong hidden score ${snapshot.scoreText}`);
      assert(snapshot.correctArt.visible, `${viewport.name}/${scenario.id}: generated correct-count art is not visible ${JSON.stringify(snapshot.correctArt)}`);
      assert(snapshot.correctArt.src.includes(`result-correct-${scenario.correct}-generated.webp`), `${viewport.name}/${scenario.id}: wrong correct-count art ${snapshot.correctArt.src}`);
      assert(!snapshot.bodyText.includes("맞힌 문제"), `${viewport.name}/${scenario.id}: forbidden label remains`);
      assert(snapshot.forbiddenCards === 0, `${viewport.name}/${scenario.id}: CSS result card remnants remain`);
      assert(!snapshot.resultTopRowVisible, `${viewport.name}/${scenario.id}: result top-row should not render`);
      assert(snapshot.resultTitleHidden && snapshot.resultSummaryHidden, `${viewport.name}/${scenario.id}: hidden result text leaked`);
      assert(snapshot.retryTransparent && snapshot.retryEnabled, `${viewport.name}/${scenario.id}: restart hitbox is not transparent/enabled`);
      assert(snapshot.leaderboardHidden, `${viewport.name}/${scenario.id}: disabled leaderboard entry is visible`);
      assert(!snapshot.visibleTexts.some((text) => /^\d+\/10$/.test(text)), `${viewport.name}/${scenario.id}: correct-count remains visible as font text ${JSON.stringify(snapshot.visibleTexts)}`);
      const slot = SCORE_BOXES[scenario.id];
      const expectedBox = { ...slot, top:slot.top - slot.height * 0.08 };
      assertNear(snapshot.scorePct.left, expectedBox.left, `${viewport.name}/${scenario.id}: score left`);
      assertNear(snapshot.scorePct.top, expectedBox.top, `${viewport.name}/${scenario.id}: score top`);
      assertNear(snapshot.scorePct.width, expectedBox.width, `${viewport.name}/${scenario.id}: score width`);
      assertNear(snapshot.scorePct.height, expectedBox.height, `${viewport.name}/${scenario.id}: score height`);
      const canonical = viewport.name === "desktop" && scenario.id === "rainbow"
        ? join(LESSON, "screenshots", "result.png")
        : "";
      const screenshot = await captureScreenshot(`${viewport.name}-${scenario.id}-${scenario.correct}`, canonical);
      const visualScore = await measureScoreCenter(screenshot, snapshot.screenRect, expectedBox);
      const artTolerance = Math.max(14, visualScore.tolerance * 3);
      assert(Math.abs(visualScore.dx) <= artTolerance, `${viewport.name}/${scenario.id}: correct-count art is not horizontally centered in the image box (${visualScore.dx.toFixed(1)}px)`);
      assert(Math.abs(visualScore.dy) <= artTolerance, `${viewport.name}/${scenario.id}: correct-count art is not vertically centered in the image box (${visualScore.dy.toFixed(1)}px)`);
      const forbiddenLabel = await measureForbiddenScoreLabel(screenshot, snapshot.screenRect, slot);
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
