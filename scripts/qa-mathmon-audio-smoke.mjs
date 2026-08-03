import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const DEBUG_PORT = Number(process.env.MATHMON_AUDIO_QA_PORT || 9261);
const PROFILE = path.join(ROOT, ".tmp-qa", "mathmon-audio-smoke-profile");
const PREF_KEYS = {
  bgm: "mathmon-audio-bgm-enabled",
  sfx: "mathmon-audio-sfx-enabled",
};
const MIGRATION_FIXTURES = new Set(["3-2-1-1", "3-2-1-3", "3-2-1-4", "3-2-2-2", "3-2-5-4"]);
const manifest = JSON.parse(await readFile(path.join(ROOT, "manifest.json"), "utf8"));
const lessons = manifest.lessons;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function contentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".ogg": "audio/ogg",
    ".wav": "audio/wav",
    ".webp": "image/webp",
    ".png": "image/png",
    ".svg": "image/svg+xml",
  }[extension] || "application/octet-stream";
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", "http://127.0.0.1");
    const relative = decodeURIComponent(requestUrl.pathname).replace(/^\/+/, "");
    let filePath = path.resolve(ROOT, relative || "index.html");
    assert(filePath === ROOT || filePath.startsWith(`${ROOT}${path.sep}`), "path outside workspace");
    const info = await stat(filePath);
    if (info.isDirectory()) filePath = path.join(filePath, "index.html");
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentType(filePath),
      "Cache-Control": "no-store",
      "Content-Length": body.length,
    });
    response.end(body);
  } catch (error) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
});

await new Promise((resolve, reject) => {
  server.once("error", reject);
  server.listen(0, "127.0.0.1", resolve);
});
const serverAddress = server.address();
const webPort = typeof serverAddress === "object" && serverAddress ? serverAddress.port : 0;

await rm(PROFILE, { recursive: true, force: true });
const browser = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${DEBUG_PORT}`,
  `--user-data-dir=${PROFILE}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
], { stdio: ["ignore", "ignore", "pipe"] });
browser.stderr.on("data", () => {});

async function waitForDebugger() {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
      const pages = await response.json();
      const page = pages.find((item) => item.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch (error) {
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
    this.listeners = new Map();
  }

  async open() {
    this.socket = new WebSocket(this.socketUrl);
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
        else pending.resolve(message.result || {});
        return;
      }
      for (const listener of this.listeners.get(message.method) || []) listener(message.params || {});
    });
    await new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener("error", reject, { once: true });
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.socket.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  on(method, listener) {
    const listeners = this.listeners.get(method) || [];
    listeners.push(listener);
    this.listeners.set(method, listeners);
  }

  close() {
    this.socket.close();
  }
}

const cdp = new Cdp(await waitForDebugger());
await cdp.open();
const pageExceptions = [];
cdp.on("Runtime.exceptionThrown", ({ exceptionDetails }) => {
  pageExceptions.push(exceptionDetails?.exception?.description || exceptionDetails?.text || "Unknown page exception");
});

async function evaluate(expression, userGesture = false) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
    userGesture,
  });
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
}

async function waitUntil(expression, message, timeout = 5000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeout) {
    if (await evaluate(expression)) return;
    await delay(80);
  }
  throw new Error(message);
}

function lessonUrl(lesson, suffix = "") {
  return `http://127.0.0.1:${webPort}/${lesson.folder}/${lesson.entryFile || "index.html"}?seed=12345&audioQa=${encodeURIComponent(`${lesson.id}-${suffix}-${Date.now()}`)}`;
}

async function navigate(lesson, suffix = "main") {
  pageExceptions.length = 0;
  await cdp.send("Page.navigate", { url: lessonUrl(lesson, suffix) });
  await waitUntil("document.readyState === 'complete'", `${lesson.id}: document did not finish loading`, 10000);
  await waitUntil(
    "window.MathmonAudio?.version === 'mathmon-audio-v1' && window.__mathmonAudioQa?.version === 'mathmon-audio-v1'",
    `${lesson.id}: shared audio engine or QA hook is missing`,
    5000,
  );
  await waitUntil(
    "document.querySelector('main.game')?.dataset.audioStandard === 'mathmon-audio-v1'",
    `${lesson.id}: runtime audio standard marker is missing`,
    2000,
  );
}

async function click(selector) {
  await evaluate(`(() => {
    const element = document.querySelector(${JSON.stringify(selector)});
    if (!element) throw new Error(${JSON.stringify(`missing selector: ${selector}`)});
    element.click();
    return true;
  })()`, true);
}

async function getSnapshot() {
  return evaluate(`(() => ({
    prefs: window.__mathmonAudioQa.getPrefs(),
    log: window.__mathmonAudioQa.getLog(),
    storage: {
      bgm: localStorage.getItem(${JSON.stringify(PREF_KEYS.bgm)}),
      sfx: localStorage.getItem(${JSON.stringify(PREF_KEYS.sfx)})
    },
    toggles: {
      bgm: document.querySelector('#settingsBgmToggle')?.getAttribute('aria-checked'),
      sfx: document.querySelector('#settingsSfxToggle')?.getAttribute('aria-checked')
    }
  }))()`);
}

async function setPrefs(bgmEnabled, sfxEnabled) {
  await evaluate(`window.__mathmonAudioQa.setPrefs(${JSON.stringify({ bgmEnabled, sfxEnabled })})`);
  await waitUntil(
    `window.__mathmonAudioQa.getPrefs().bgmEnabled === ${bgmEnabled} && window.__mathmonAudioQa.getPrefs().sfxEnabled === ${sfxEnabled}`,
    `preferences did not settle to ${bgmEnabled}/${sfxEnabled}`,
    3000,
  );
}

async function checkLegacyMigration(lesson) {
  await evaluate(`(() => {
    localStorage.setItem(${JSON.stringify(PREF_KEYS.bgm)}, 'on');
    localStorage.setItem(${JSON.stringify(PREF_KEYS.sfx)}, 'off');
  })()`);
  await cdp.send("Page.reload", { ignoreCache: true });
  await waitUntil("document.readyState === 'complete'", `${lesson.id}: migration reload did not complete`, 10000);
  await waitUntil("window.__mathmonAudioQa?.version === 'mathmon-audio-v1'", `${lesson.id}: QA hook missing after migration reload`, 5000);
  const snapshot = await getSnapshot();
  assert(snapshot.prefs.bgmEnabled === true && snapshot.prefs.sfxEnabled === false, `${lesson.id}: on/off migration changed meaning`);
  assert(snapshot.storage.bgm === "true" && snapshot.storage.sfx === "false", `${lesson.id}: on/off migration did not write canonical booleans`);
  assert(snapshot.toggles.bgm === "true" && snapshot.toggles.sfx === "false", `${lesson.id}: migrated preferences did not reach settings toggles`);
}

async function checkLesson(lesson) {
  await navigate(lesson);
  if (MIGRATION_FIXTURES.has(lesson.id)) await checkLegacyMigration(lesson);

  let snapshot = await getSnapshot();
  assert(snapshot.prefs.bgmEnabled === true, `${lesson.id}: BGM was not enabled before the real start gesture`);
  const realGestureStartCount = snapshot.prefs.bgmStartCount;
  await click("#startButton");
  await waitUntil(
    "window.__mathmonAudioQa.getPrefs().bgmPlaying && window.__mathmonAudioQa.getPrefs().bgmLoaded",
    `${lesson.id}: real start-button gesture did not start BGM under the normal autoplay policy`,
    15000,
  );
  snapshot = await getSnapshot();
  assert(snapshot.prefs.bgmStartCount === realGestureStartCount + 1, `${lesson.id}: real start gesture created duplicate BGM sources`);
  await evaluate("window.MathmonAudio.stopBgm({ immediate: true })");

  await setPrefs(false, false);
  await evaluate("window.__mathmonAudioQa.clearLog()");
  await evaluate("window.__mathmonAudioQa.play('correct')");
  await delay(250);
  snapshot = await getSnapshot();
  assert(snapshot.log.length === 0, `${lesson.id}: muted SFX still played`);
  assert(snapshot.storage.bgm === "false" && snapshot.storage.sfx === "false", `${lesson.id}: false preferences were not stored canonically`);
  assert(snapshot.toggles.bgm === "false" && snapshot.toggles.sfx === "false", `${lesson.id}: false preferences did not reach both toggles`);

  await click("#settingsSfxToggle");
  await waitUntil("window.__mathmonAudioQa.getPrefs().sfxEnabled === true", `${lesson.id}: SFX toggle did not enable SFX`, 3000);
  snapshot = await getSnapshot();
  assert(snapshot.prefs.bgmEnabled === false, `${lesson.id}: SFX toggle unexpectedly enabled BGM`);
  assert(snapshot.storage.bgm === "false" && snapshot.storage.sfx === "true", `${lesson.id}: SFX toggle storage linkage failed`);
  await evaluate("window.__mathmonAudioQa.clearLog()");
  await evaluate("window.__mathmonAudioQa.play('correct')");
  await waitUntil("window.__mathmonAudioQa.getLog().includes('correct')", `${lesson.id}: enabled SFX did not play`, 3000);

  const startCountBefore = (await getSnapshot()).prefs.bgmStartCount;
  await click("#settingsBgmToggle");
  await waitUntil("window.__mathmonAudioQa.getPrefs().bgmEnabled === true", `${lesson.id}: BGM toggle did not enable BGM`, 3000);
  await waitUntil(
    "window.__mathmonAudioQa.getPrefs().bgmPlaying && window.__mathmonAudioQa.getPrefs().bgmLoaded",
    `${lesson.id}: approved BGM did not load and start`,
    15000,
  );
  snapshot = await getSnapshot();
  assert(snapshot.prefs.sfxEnabled === true, `${lesson.id}: BGM toggle unexpectedly disabled SFX`);
  assert(snapshot.prefs.bgmStartCount === startCountBefore + 1, `${lesson.id}: duplicate BGM sources started`);
  assert(snapshot.prefs.bgmDuration > 60 && snapshot.prefs.bgmDuration < 90, `${lesson.id}: unexpected BGM duration ${snapshot.prefs.bgmDuration}`);
  assert(snapshot.prefs.bgmTrack.includes("sketchbook-2025-11-26.ogg"), `${lesson.id}: wrong BGM track is connected`);
  assert(snapshot.storage.bgm === "true" && snapshot.storage.sfx === "true", `${lesson.id}: enabled preferences were not stored canonically`);

  await evaluate("window.__mathmonAudioQa.clearLog()");
  await click("#settingsSfxToggle");
  await waitUntil("window.__mathmonAudioQa.getPrefs().sfxEnabled === false", `${lesson.id}: SFX toggle did not disable SFX`, 3000);
  snapshot = await getSnapshot();
  assert(snapshot.prefs.bgmPlaying === true, `${lesson.id}: disabling SFX stopped BGM`);
  await evaluate("window.__mathmonAudioQa.play('finish')");
  await delay(250);
  snapshot = await getSnapshot();
  assert(snapshot.log.length === 0, `${lesson.id}: disabled SFX logged a finish cue`);

  await click("#settingsBgmToggle");
  await waitUntil(
    "window.__mathmonAudioQa.getPrefs().bgmEnabled === false && !window.__mathmonAudioQa.getPrefs().bgmPlaying",
    `${lesson.id}: BGM toggle did not stop BGM`,
    3000,
  );
  snapshot = await getSnapshot();
  assert(snapshot.prefs.sfxEnabled === false, `${lesson.id}: BGM toggle unexpectedly enabled SFX`);
  assert(snapshot.storage.bgm === "false" && snapshot.storage.sfx === "false", `${lesson.id}: disabled toggle storage linkage failed`);

  await setPrefs(true, true);
  snapshot = await getSnapshot();
  assert(snapshot.toggles.bgm === "true" && snapshot.toggles.sfx === "true", `${lesson.id}: QA preferences did not synchronize the settings UI`);
  assert(snapshot.storage.bgm === "true" && snapshot.storage.sfx === "true", `${lesson.id}: final preferences are not canonical`);
  assert(pageExceptions.length === 0, `${lesson.id}: uncaught page exceptions: ${pageExceptions.join(" | ")}`);

  return {
    id: lesson.id,
    title: lesson.title,
    bgmDuration: Math.round(snapshot.prefs.bgmDuration * 1000) / 1000,
    duplicateBgmSources: 0,
    independentToggles: true,
    canonicalStorage: true,
    legacyMigration: MIGRATION_FIXTURES.has(lesson.id),
  };
}

const summaries = [];
try {
  await cdp.send("Page.enable");
  await cdp.send("Runtime.enable");
  for (const lesson of lessons) {
    summaries.push(await checkLesson(lesson));
    console.log(`AUDIO_QA ${lesson.id}: PASS`);
  }
  console.log("MATHMON_AUDIO_SMOKE_QA: PASS");
  console.log(JSON.stringify({ lessonCount: summaries.length, lessons: summaries }, null, 2));
} finally {
  cdp.close();
  if (browser.exitCode === null) {
    browser.kill();
    await Promise.race([new Promise((resolve) => browser.once("exit", resolve)), delay(2000)]);
  }
  await rm(PROFILE, { recursive: true, force: true });
  await new Promise((resolve) => server.close(resolve));
}
