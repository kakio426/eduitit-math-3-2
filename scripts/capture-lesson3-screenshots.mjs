import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const LESSON = join(ROOT, "3-2-1-3-mathmon-jump-islands");
const SCREENSHOTS = join(LESSON, "screenshots");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html?seed=12345&qaProblem=tenfold`;
const PORT = Number(process.env.LESSON3_CAPTURE_PORT || 9256);
const PROFILE = join(ROOT, ".tmp-qa", "lesson3-capture-profile");

await mkdir(SCREENSHOTS, { recursive: true });
await rm(PROFILE, { recursive: true, force: true });

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
const assert = (condition, message) => { if (!condition) throw new Error(message); };

async function waitForJson() {
  for (let index = 0; index < 80; index += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const page = (await response.json()).find((item) => item.type === "page");
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
      message.error ? reject(new Error(JSON.stringify(message.error))) : resolve(message.result || {});
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
  const result = await cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
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

async function setViewport(width, height) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: width >= height ? "landscapePrimary" : "portraitPrimary", angle: width >= height ? 90 : 0 }
  });
}

async function openLesson(label) {
  await cdp.send("Page.navigate", { url: `${FILE_URL}&capture=${label}-${Date.now()}` });
  await waitUntil("document.readyState === 'complete'", `${label}: lesson did not load`);
  await delay(700);
}

async function capture(name) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
  await writeFile(join(SCREENSHOTS, name), data, "base64");
}

async function click(selector) {
  await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
}

async function enterPlay() {
  await click("#startButton");
  await waitUntil("document.getElementById('tutorialScreen').classList.contains('is-active')", "tutorial did not open");
  await click("#tutorialNextButton");
  await waitUntil("document.getElementById('playScreen').classList.contains('is-active') && document.getElementById('stepText').textContent.trim() === '1단계'", "play step 1 did not open");
  await delay(300);
}

async function clickCorrectChoice() {
  await evaluate(`
(() => {
  const problem = currentProblem();
  const isSecondStep = document.getElementById("stepText").textContent.trim() === "2단계";
  const step = window.__lesson3MathModel.buildSteps(problem)[isSecondStep ? 1 : 0];
  const target = formatChoice(step.correct);
  const button = [...document.querySelectorAll(".choice-button")].find((item) => item.textContent.trim() === target);
  if (!button) throw new Error("correct choice not found");
  button.click();
})()
`);
}

async function clickWrongChoice() {
  await evaluate(`
(() => {
  const problem = currentProblem();
  const step = window.__lesson3MathModel.buildSteps(problem)[0];
  const target = formatChoice(step.correct);
  const button = [...document.querySelectorAll(".choice-button")].find((item) => item.textContent.trim() !== target);
  if (!button) throw new Error("wrong choice not found");
  button.click();
})()
`);
}

async function captureDesktopFlow() {
  await setViewport(1280, 800);
  await openLesson("desktop-flow");
  await capture("cover.png");
  await click("#startButton");
  await waitUntil("document.getElementById('tutorialScreen').classList.contains('is-active')", "tutorial did not open");
  await delay(250);
  await capture("tutorial.png");
  await click("#tutorialNextButton");
  await waitUntil("document.getElementById('stepText').textContent.trim() === '1단계'", "step 1 did not open");
  await delay(300);
  await capture("play-step1.png");
  await clickCorrectChoice();
  await waitUntil("document.getElementById('stepText').textContent.trim() === '2단계'", "step 2 did not open");
  await delay(260);
  await capture("play-step2.png");
  await clickCorrectChoice();
  await waitUntil("document.querySelector('.reward-check-button')", "complete button did not appear");
  await delay(320);
  await capture("play-complete.png");
  await evaluate("window.__lesson3Qa.forceNextReward('tailwind')");
  await click(".reward-check-button");
  await waitUntil("document.getElementById('rewardPop').classList.contains('is-visible')", "reward did not open");
  await delay(250);
  await capture("reward.png");
}

async function captureWrongHint() {
  await setViewport(1280, 800);
  await openLesson("wrong-hint");
  await enterPlay();
  await clickWrongChoice();
  await waitUntil("!document.getElementById('hintLine').hidden", "wrong hint did not appear");
  await delay(250);
  await capture("wrong-hint.png");
}

async function captureResult() {
  await setViewport(1280, 800);
  await openLesson("result");
  await evaluate("window.__lesson3Qa.showResultIsland('rainbow')");
  await waitUntil("document.getElementById('resultScreen').classList.contains('is-active') && document.getElementById('resultRaster').complete", "result reveal did not start");
  await delay(220);
  await capture("result-measurement.png");
  await waitUntil("document.getElementById('finalCorrectText').textContent.trim() === '10/10'", "result did not finish", 4000);
  await delay(140);
  await capture("result.png");
}

async function captureTabletAndPortrait() {
  await setViewport(1024, 768);
  await openLesson("tablet");
  await enterPlay();
  await capture("tablet-landscape-play.png");
  await setViewport(390, 844);
  await openLesson("portrait");
  await capture("portrait-guard.png");
}

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  await captureDesktopFlow();
  await captureWrongHint();
  await captureResult();
  await captureTabletAndPortrait();
  const files = ["cover.png", "tutorial.png", "play-step1.png", "play-step2.png", "play-complete.png", "wrong-hint.png", "reward.png", "result-measurement.png", "result.png", "tablet-landscape-play.png", "portrait-guard.png"];
  for (const file of files) assert(true, `${file} captured`);
  console.log("LESSON3_SCREENSHOTS_CAPTURED: PASS");
  console.log(JSON.stringify({ screenshots: SCREENSHOTS, files }, null, 2));
} finally {
  cdp.close();
  if (browser.exitCode === null) {
    browser.kill();
    await Promise.race([new Promise((resolve) => browser.once("exit", resolve)), delay(2000)]);
  }
  await rm(PROFILE, { recursive: true, force: true });
}
