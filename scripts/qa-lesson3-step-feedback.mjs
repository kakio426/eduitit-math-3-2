import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = process.cwd();
const LESSON = join(ROOT, "3-2-1-3-mathmon-jump-islands");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const FILE_URL = `file://${LESSON.replaceAll(" ", "%20")}/index.html?seed=12345&qaProblem=tenfold`;
const VIEWPORT = {
  name: process.env.LESSON3_QA_NAME || "desktop",
  width: Number(process.env.LESSON3_QA_WIDTH || 1280),
  height: Number(process.env.LESSON3_QA_HEIGHT || 800),
};
const PORT = Number(process.env.LESSON3_QA_PORT || 9251);
const PROFILE = await mkdtemp(join(tmpdir(), "lesson3-step-feedback-profile-"));

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

async function clickCorrectChoice() {
  return evaluate(`
(() => {
  const step = window.__mathmonEngineQa.getCurrentStep();
  const button = [...document.querySelectorAll("#choicesPanel .choice-button:not(:disabled)")]
    .find((candidate) => candidate.dataset.choice === String(step.answer));
  if (!button) throw new Error("correct choice not found: " + step.answer);
  button.click();
  return { id:step.id, reveal:step.reveal, correctText:step.correctText };
})()
`);
}

async function readSnapshot() {
  return evaluate(`
(() => {
  const fits = (node) => {
    if (!node || node.hidden || getComputedStyle(node).display === "none") return true;
    const box = node.getBoundingClientRect();
    const range = document.createRange();
    range.selectNodeContents(node);
    return [...range.getClientRects()].every((rect) => rect.left >= box.left - 1 && rect.right <= box.right + 1 && rect.top >= box.top - 1 && rect.bottom <= box.bottom + 1);
  };
  const transform = document.querySelector(".jump-transform");
  const feedback = document.getElementById("feedbackLine");
  const complete = document.getElementById("completePanel");
  const completeText = document.getElementById("completeExpression");
  const rewardButton = document.getElementById("rewardButton");
  const state = window.__mathmonEngineQa.getState();
  return {
    stepIndex:state.stepIndex,
    pendingAdvance:state.pendingAdvance,
    completed:state.completed,
    feedback:feedback.textContent.trim(),
    feedbackState:feedback.dataset.state || "",
    instructionHidden:document.getElementById("stepInstruction").hidden,
    transform:transform?.textContent.trim() || "",
    completeVisible:complete.classList.contains("is-visible"),
    completeText:completeText.textContent.trim(),
    rewardButtonLabel:rewardButton.textContent.trim() || rewardButton.getAttribute("aria-label") || "",
    rewardVisible:!document.getElementById("rewardPop").hidden,
    fits:{ feedback:fits(feedback), transform:fits(transform), complete:fits(completeText) },
  };
})()
`);
}

async function runScenario(viewport) {
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

  const firstStep = await clickCorrectChoice();
  await waitUntil("document.getElementById('feedbackLine').dataset.state === 'correct'", `${viewport.name}: first confirmation did not appear`);
  const firstSnapshot = await readSnapshot();
  assert(firstSnapshot.transform === firstStep.reveal, `${viewport.name}: first calculation was not revealed: ${JSON.stringify(firstSnapshot)}`);
  assert(firstSnapshot.feedback === firstStep.correctText && firstSnapshot.instructionHidden, `${viewport.name}: first confirmation copy is wrong: ${JSON.stringify(firstSnapshot)}`);
  assert(!firstSnapshot.completeVisible && !firstSnapshot.rewardVisible, `${viewport.name}: first confirmation was covered: ${JSON.stringify(firstSnapshot)}`);
  assert(Object.values(firstSnapshot.fits).every(Boolean), `${viewport.name}: first confirmation overflowed: ${JSON.stringify(firstSnapshot)}`);

  await waitUntil("window.__mathmonEngineQa.getState().stepIndex === 1 && !window.__mathmonEngineQa.getState().inputLocked", `${viewport.name}: second step did not open`);
  const secondStep = await clickCorrectChoice();
  await waitUntil("document.getElementById('feedbackLine').dataset.state === 'correct'", `${viewport.name}: second confirmation did not appear`);
  const secondSnapshot = await readSnapshot();
  assert(secondSnapshot.transform === secondStep.reveal, `${viewport.name}: final calculation was not revealed: ${JSON.stringify(secondSnapshot)}`);
  assert(secondSnapshot.feedback === secondStep.correctText && !secondSnapshot.rewardVisible, `${viewport.name}: second confirmation was covered: ${JSON.stringify(secondSnapshot)}`);

  await waitUntil("window.__mathmonEngineQa.getState().completed && document.getElementById('completePanel').classList.contains('is-visible')", `${viewport.name}: completion did not appear`, 7000);
  const heldSnapshot = await readSnapshot();
  const finalExpression = await evaluate("window.__mathmonEngineQa.getCurrentProblem().finalExpression");
  assert(heldSnapshot.completeText === finalExpression, `${viewport.name}: completed expression is wrong: ${JSON.stringify(heldSnapshot)}`);
  assert(heldSnapshot.rewardButtonLabel === "바람 보기", `${viewport.name}: reward action label changed: ${JSON.stringify(heldSnapshot)}`);
  assert(!heldSnapshot.rewardVisible && Object.values(heldSnapshot.fits).every(Boolean), `${viewport.name}: completion was covered or overflowed: ${JSON.stringify(heldSnapshot)}`);

  await evaluate('document.getElementById("rewardButton").click()');
  await waitUntil("!document.getElementById('rewardPop').hidden", `${viewport.name}: reward modal did not open`);
  return { viewport, firstSnapshot, secondSnapshot, heldSnapshot };
}

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  const result = await runScenario(VIEWPORT);
  console.log("LESSON3_STEP_FEEDBACK_QA: PASS");
  console.log(JSON.stringify({ result }, null, 2));
} finally {
  cdp.close();
  if (browser.exitCode === null) {
    browser.kill();
    await Promise.race([new Promise((resolve) => browser.once("exit", resolve)), delay(2000)]);
  }
  await rm(PROFILE, { recursive: true, force: true });
}
