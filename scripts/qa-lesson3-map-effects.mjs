import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const LESSON = join(ROOT, "3-2-1-3-mathmon-jump-islands");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html?seed=12345&qaProblem=tenfold`;
const PORT = Number(process.env.LESSON3_MAP_QA_PORT || 9253);
const PROFILE = await mkdtemp(join(tmpdir(), "lesson3-map-progress-profile-"));
const SCREENSHOT_DIR = await mkdtemp(join(tmpdir(), "lesson3-map-progress-"));
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 },
];

const browser = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${PROFILE}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "--allow-file-access-from-files",
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });

browser.stderr.on("data", () => {});
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

async function waitForJson() {
  for (let index = 0; index < 80; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const pages = await response.json();
      const page = pages.find((item) => item.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
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
      if (!message.id || !this.pending.has(message.id)) return;
      const { resolve, reject } = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) reject(new Error(JSON.stringify(message.error)));
      else resolve(message.result || {});
    });
    await new Promise((resolve, reject) => {
      this.ws.addEventListener("open", resolve, { once: true });
      this.ws.addEventListener("error", reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
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
    returnByValue: true,
  });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}

async function waitUntil(predicateSource, message, timeout = 5000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(predicateSource)) return;
    await delay(80);
  }
  throw new Error(message);
}

async function captureScreenshot(name) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  const output = join(SCREENSHOT_DIR, `${name}.png`);
  await writeFile(output, data, "base64");
  return output;
}

async function openLesson(viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 },
  });
  await cdp.send("Page.navigate", { url: `${FILE_URL}&viewport=${viewport.name}-${Date.now()}` });
  await waitUntil("document.readyState === 'complete'", `${viewport.name}: lesson did not load`);
  await evaluate('document.getElementById("startButton").click()');
  await waitUntil("document.querySelector('.screen.is-active')?.id === 'screen-tutorial'", `${viewport.name}: tutorial did not open`);
  await evaluate('document.getElementById("tutorialStartButton").click()');
  await waitUntil("document.querySelector('.screen.is-active')?.id === 'screen-play'", `${viewport.name}: play screen did not open`);
}

async function showMapTier(tier) {
  await evaluate(`(() => {
    window.__mathmonEngineQa.setState({ power:${tier.minPower} });
    window.__mathmonEngineQa.renderProblem();
  })()`);
  await waitUntil(`document.querySelector('.jump-island-chip.is-current')?.dataset.island === ${JSON.stringify(tier.id)}`, `${tier.id}: current island did not update`);
  await delay(420);
}

async function readMapSnapshot() {
  return evaluate(`
(() => {
  const marker = document.querySelector(".jump-marker");
  const map = document.querySelector(".jump-map");
  const choices = document.getElementById("choicesPanel");
  const chips = [...document.querySelectorAll(".jump-island-chip")];
  const current = chips.find((chip) => chip.classList.contains("is-current"));
  const rect = (node) => {
    const box = node.getBoundingClientRect();
    return { left:box.left, top:box.top, right:box.right, bottom:box.bottom, width:box.width, height:box.height };
  };
  const overlaps = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  const markerRect = rect(marker);
  const mapRect = rect(map);
  const choiceRect = rect(choices);
  const currentIndex = chips.indexOf(current);
  const expectedPercent = chips.length === 1 ? 50 : 8 + (currentIndex / (chips.length - 1)) * 84;
  const actualPercent = ((markerRect.left + markerRect.width / 2 - mapRect.left) / mapRect.width) * 100;
  return {
    currentId:current?.dataset.island || "",
    currentIndex,
    reachedCount:chips.filter((chip) => chip.classList.contains("is-reached")).length,
    markerVisible:Number(getComputedStyle(marker).opacity) > 0.9,
    markerWithinMap:markerRect.left >= mapRect.left - 1 && markerRect.right <= mapRect.right + 1 && markerRect.top >= mapRect.top - 1 && markerRect.bottom <= mapRect.bottom + 1,
    overlapsChoices:overlaps(markerRect, choiceRect),
    expectedPercent,
    actualPercent,
    markerSource:marker.getAttribute("src") || "",
    rewardVisible:!document.getElementById("rewardPop").hidden,
  };
})()
`);
}

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const results = [];
  for (const viewport of VIEWPORTS) {
    await openLesson(viewport);
    const tiers = await evaluate("LESSON_CONFIG.results.map(({ id, minPower }) => ({ id, minPower }))");
    assert(tiers.length === 6, `${viewport.name}: map must expose six islands`);
    let previousPercent = -Infinity;
    for (const tier of tiers) {
      await showMapTier(tier);
      const snapshot = await readMapSnapshot();
      assert(snapshot.currentId === tier.id, `${viewport.name}/${tier.id}: wrong current island: ${JSON.stringify(snapshot)}`);
      assert(snapshot.reachedCount === snapshot.currentIndex + 1, `${viewport.name}/${tier.id}: reached islands are wrong: ${JSON.stringify(snapshot)}`);
      assert(snapshot.markerVisible && snapshot.markerWithinMap && !snapshot.overlapsChoices, `${viewport.name}/${tier.id}: marker left its safe map area: ${JSON.stringify(snapshot)}`);
      assert(Math.abs(snapshot.actualPercent - snapshot.expectedPercent) <= 1, `${viewport.name}/${tier.id}: marker position drifted: ${JSON.stringify(snapshot)}`);
      assert(snapshot.actualPercent > previousPercent, `${viewport.name}/${tier.id}: marker did not advance`);
      assert(snapshot.markerSource.endsWith("mathmon-zfa-04-nyangnyangmon.webp"), `${viewport.name}/${tier.id}: wrong map Mathmon asset`);
      assert(!snapshot.rewardVisible, `${viewport.name}/${tier.id}: reward covered direct map QA`);
      previousPercent = snapshot.actualPercent;
      const screenshot = ["start", "forest", "rainbow"].includes(tier.id)
        ? await captureScreenshot(`${viewport.name}-${tier.id}`)
        : "";
      results.push({ viewport:viewport.name, tier:tier.id, snapshot, screenshot });
    }
  }
  console.log("LESSON3_MAP_PROGRESS_QA: PASS");
  console.log(JSON.stringify({ screenshotDir:SCREENSHOT_DIR, results }, null, 2));
} finally {
  cdp.close();
  if (browser.exitCode === null) {
    browser.kill();
    await Promise.race([new Promise((resolve) => browser.once("exit", resolve)), delay(2000)]);
  }
  await rm(PROFILE, { recursive: true, force: true });
}
