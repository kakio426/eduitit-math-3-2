import { spawn } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PORT = Number(process.env.UNIT1_RESULT_QA_PORT || 9264);
const PROFILE = join(ROOT, ".tmp-qa", "unit1-result-profile");
const EVIDENCE_DIR = join(ROOT, ".tmp-qa", "unit1-result-screens");
const VIEWPORTS = [
  { name: "desktop", width: 1280, height: 800 },
  { name: "tablet-landscape", width: 1024, height: 768 }
];

const LESSONS = [
  {
    id: "1-1",
    dir: "3-2-1-1-mathmon-box-run",
    mode: "hybrid",
    forceResult: `
      window.__unit1ResultQa.showResult("1250000", 8);
    `,
    generatedTitleArt: true,
    download: true
  },
  {
    id: "1-2",
    dir: "3-2-1-2-mathmon-rocket-charge",
    mode: "hybrid",
    forceResult: `
      window.__unit1ResultQa.showResult(86, 9, false);
    `,
    generatedTitleArt: true
  },
  {
    id: "1-3",
    dir: "3-2-1-3-mathmon-jump-islands",
    mode: "fullscene",
    query: "?seed=12345&qaProblem=tenfold",
    forceResult: `
      window.__lesson3Qa.showResultIsland("rainbow");
    `
  },
  {
    id: "1-4",
    dir: "3-2-1-4-mathmon-fusion",
    mode: "hybrid",
    forceResult: `
      window.__mathmonFusionQa.showResult("ultra", 9);
    `,
    generatedTitleArt: true
  }
];

const FORBIDDEN_GENERATED_RESULT_LABELS = new Set([
  "점수",
  "정답",
  "매스몬",
  "도착한 곳",
  "연료",
  "이번 합체",
  "합체 힘"
]);

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
      if (message.error) {
        reject(new Error(JSON.stringify(message.error)));
      } else {
        resolve(message.result || {});
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

async function waitUntil(predicateSource, message, timeout = 7000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await evaluate(predicateSource)) return;
    await delay(80);
  }
  throw new Error(message);
}

async function captureScreenshot(name) {
  const { data } = await cdp.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false
  });
  const evidencePath = join(EVIDENCE_DIR, `${name}.png`);
  await writeFile(evidencePath, data, "base64");
  return evidencePath;
}

function lessonUrl(lesson) {
  const encoded = join(ROOT, lesson.dir).replaceAll(" ", "%20");
  const query = lesson.query || "";
  const joiner = query ? "&" : "?";
  return `file://${encoded}/index.html${query}${joiner}unit1ResultQa=${Date.now()}`;
}

async function openLesson(lesson, viewport) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 }
  });
  await cdp.send("Page.navigate", { url: lessonUrl(lesson) });
  await waitUntil("document.readyState === 'complete'", `${lesson.id}/${viewport.name}: lesson did not load`);
  await delay(250);
}

async function forceResult(lesson) {
  await evaluate(`(() => { ${lesson.forceResult} })()`);
  await waitUntil("document.getElementById('resultScreen')?.classList.contains('is-active')", `${lesson.id}: result screen did not open`);
  await waitUntil("document.querySelector('#resultScreen img')?.complete !== false", `${lesson.id}: result image did not finish`);
  await delay(lesson.mode === "fullscene" ? 2100 : 2750);
}

async function readResultSnapshot(lesson) {
  const mode = JSON.stringify(lesson.mode);
  return evaluate(`
(() => {
  const mode = ${mode};
  const screen = document.getElementById("resultScreen");
  const stage = document.querySelector(".stage-shell");
  const rectOf = (node) => {
    const rect = node.getBoundingClientRect();
    return { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom, width: rect.width, height: rect.height };
  };
  const screenRect = rectOf(screen);
  const visibleTexts = [];
  const overflowTexts = [];
  const walker = document.createTreeWalker(screen, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim();
    const parent = walker.currentNode.parentElement;
    if (!text || !parent || parent.closest(".visually-hidden, .sr-only")) continue;
    const style = getComputedStyle(parent);
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || style.color === "rgba(0, 0, 0, 0)") continue;
    const rects = [...parent.getClientRects()];
    if (!rects.length) continue;
    visibleTexts.push(text);
    rects.forEach((rect) => {
      const parentRect = parent.getBoundingClientRect();
      if (rect.left < parentRect.left - 1 || rect.right > parentRect.right + 1 || rect.top < parentRect.top - 1 || rect.bottom > parentRect.bottom + 1) {
        overflowTexts.push({ text, rect: rectOf(parent), parent: rectOf(parent) });
      }
    });
  }
	  const svg = screen.querySelector(".result-dynamic-ui");
	  const titleArt = screen.querySelector(".result-title-art");
	  const correctArt = screen.querySelector(".result-correct-art");
	  const titleArtStyle = titleArt ? getComputedStyle(titleArt) : null;
	  const correctArtStyle = correctArt ? getComputedStyle(correctArt) : null;
	  const titleArtRect = titleArt ? rectOf(titleArt) : null;
	  const correctArtRect = correctArt ? rectOf(correctArt) : null;
	  const titleArtVisible = Boolean(titleArt
	    && !titleArt.hidden
	    && titleArtStyle.display !== "none"
	    && titleArtStyle.visibility !== "hidden"
	    && Number(titleArtStyle.opacity || "1") > 0
	    && titleArt.complete
	    && titleArt.naturalWidth > 0
	    && titleArtRect.width > 0
	    && titleArtRect.height > 0);
	  const correctArtVisible = Boolean(correctArt
	    && !correctArt.hidden
	    && correctArtStyle.display !== "none"
	    && correctArtStyle.visibility !== "hidden"
	    && Number(correctArtStyle.opacity || "1") > 0
	    && correctArt.complete
	    && correctArt.naturalWidth > 0
	    && correctArtRect.width > 0
	    && correctArtRect.height > 0);
	  const svgTextsOutside = svg ? [...svg.querySelectorAll("text")].map((node) => {
	    const box = node.getBBox();
	    return { text: node.textContent.trim(), x: box.x, y: box.y, width: box.width, height: box.height };
	  }).filter((box) => box.x < -1 || box.y < -1 || box.x + box.width > 1281 || box.y + box.height > 801) : [];
  const hitboxStyles = [...screen.querySelectorAll(".result-action-hitbox, .result-leaderboard-hitbox, .result-restart-hitbox")].map((node) => {
    const style = getComputedStyle(node);
    return { id: node.id || node.dataset.action || node.className, background: style.backgroundColor, color: style.color, border: style.borderTopWidth, rect: rectOf(node), hidden: node.hidden, disabled: node.disabled };
  });
  return {
    mode,
    mainHasGenerated: document.querySelector("main.game")?.dataset.resultVisualStandard === "generated-assets",
    renderMode: document.querySelector("main.game")?.dataset.resultRenderMode || "",
	    forbiddenCards: screen.querySelectorAll(".result-card, .result-stats, .result-stat, .result-copy").length,
	    hybridSvg: Boolean(svg && svg.getAttribute("viewBox") === "0 0 1280 800"),
	    generatedTitleArt: {
	      visible: titleArtVisible,
	      src: titleArt?.getAttribute("src") || "",
	      rect: titleArtRect,
	      legacySvgTitleText: screen.querySelector("#resultDestinationSvg")?.textContent.trim() || ""
	    },
	    generatedCorrectArt: {
	      visible: correctArtVisible,
	      src: correctArt?.getAttribute("src") || "",
	      rect: correctArtRect
	    },
	    fullsceneScoreOnly: mode !== "fullscene" || (visibleTexts.length === 1 && /\\/10$/.test(visibleTexts[0])),
    visibleTexts,
    overflowTexts,
    svgTextsOutside,
    hitboxStyles,
    stage: rectOf(stage),
    screen: screenRect,
    activeScreenId: document.querySelector(".screen.is-active")?.id || ""
  };
})()
`);
}

function validateSnapshot(lesson, viewport, snapshot) {
  assert(snapshot.mainHasGenerated, `${lesson.id}/${viewport.name}: generated result standard missing`);
  assert(snapshot.renderMode === (lesson.mode === "fullscene" ? "fullscene-score-slot" : "hybrid-generated-dynamic"), `${lesson.id}/${viewport.name}: wrong result render mode ${snapshot.renderMode}`);
  assert(snapshot.forbiddenCards === 0, `${lesson.id}/${viewport.name}: legacy result card classes remain`);
	  if (lesson.mode === "hybrid") {
	    assert(snapshot.hybridSvg, `${lesson.id}/${viewport.name}: hybrid SVG missing`);
	    assert(snapshot.svgTextsOutside.length === 0, `${lesson.id}/${viewport.name}: SVG text outside viewBox ${JSON.stringify(snapshot.svgTextsOutside)}`);
	  }
	  if (lesson.generatedTitleArt) {
	    assert(snapshot.generatedTitleArt.visible, `${lesson.id}/${viewport.name}: generated result title art is not visible ${JSON.stringify(snapshot.generatedTitleArt)}`);
	    assert(/result-title-[^/]+-generated\.webp(?:\?|$)/.test(snapshot.generatedTitleArt.src), `${lesson.id}/${viewport.name}: generated result title art src is not a result-title asset ${snapshot.generatedTitleArt.src}`);
	    assert(snapshot.generatedTitleArt.legacySvgTitleText === "", `${lesson.id}/${viewport.name}: legacy SVG result title text remains ${snapshot.generatedTitleArt.legacySvgTitleText}`);
	    assert(snapshot.generatedCorrectArt.visible, `${lesson.id}/${viewport.name}: generated correct-count art is not visible ${JSON.stringify(snapshot.generatedCorrectArt)}`);
	    assert(/result-correct-\d+-generated\.webp(?:\?|$)/.test(snapshot.generatedCorrectArt.src), `${lesson.id}/${viewport.name}: generated correct-count art src is not a result-correct asset ${snapshot.generatedCorrectArt.src}`);
	    const leakedLabels = snapshot.visibleTexts.filter((text) => FORBIDDEN_GENERATED_RESULT_LABELS.has(text));
	    assert(leakedLabels.length === 0, `${lesson.id}/${viewport.name}: fixed SVG result label remains ${JSON.stringify(leakedLabels)}`);
	    const leakedCorrectText = snapshot.visibleTexts.filter((text) => /^\d+\/10$/.test(text));
	    assert(leakedCorrectText.length === 0, `${lesson.id}/${viewport.name}: correct-count remains visible as font text ${JSON.stringify(leakedCorrectText)}`);
	  }
  assert(snapshot.fullsceneScoreOnly, `${lesson.id}/${viewport.name}: fullscene visible DOM text is not score-only ${JSON.stringify(snapshot.visibleTexts)}`);
  assert(snapshot.overflowTexts.length === 0, `${lesson.id}/${viewport.name}: visible text overflow ${JSON.stringify(snapshot.overflowTexts)}`);
  snapshot.hitboxStyles.forEach((hitbox) => {
    if (hitbox.hidden || hitbox.disabled) return;
    assert(hitbox.background === "rgba(0, 0, 0, 0)", `${lesson.id}/${viewport.name}: hitbox ${hitbox.id} draws a background`);
    assert(hitbox.color === "rgba(0, 0, 0, 0)", `${lesson.id}/${viewport.name}: hitbox ${hitbox.id} draws text color`);
    assert(hitbox.border === "0px", `${lesson.id}/${viewport.name}: hitbox ${hitbox.id} draws a border`);
  });
}

async function verifyActions(lesson) {
  if (lesson.download) {
    await waitUntil("document.querySelector('[data-action=\"download-mathmon\"]')?.getAttribute('href') !== '#'", `${lesson.id}: download card did not become ready`, 8000);
  }
  await evaluate("document.getElementById('leaderboardButton')?.click()");
  await waitUntil("document.querySelector('.screen.is-active')?.id === 'scoreboardScreen'", `${lesson.id}: leaderboard did not open`, 8000);
  await forceResult(lesson);
  await evaluate("document.getElementById('restartButton')?.click()");
  await waitUntil("document.querySelector('.screen.is-active')?.id !== 'resultScreen'", `${lesson.id}: restart did not leave result`, 5000);
}

const results = [];

try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  for (const viewport of VIEWPORTS) {
    for (const lesson of LESSONS) {
      await openLesson(lesson, viewport);
      await forceResult(lesson);
      const snapshot = await readResultSnapshot(lesson);
      validateSnapshot(lesson, viewport, snapshot);
      const screenshot = await captureScreenshot(`${lesson.id}-${viewport.name}-result`);
      if (viewport.name === "desktop") {
        await verifyActions(lesson);
      }
      results.push({ lesson: lesson.id, viewport: viewport.name, screenshot, visibleTexts: snapshot.visibleTexts });
    }
  }
  console.log("UNIT1_RESULT_QA: PASS");
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
