#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createReadStream, readFileSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const manifest = JSON.parse(readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const lessons = manifest.lessons.filter((lesson) => {
  try {
    return readFileSync(path.join(ROOT, lesson.folder, lesson.entryFile || "index.html"), "utf8").includes("window.__mathmonEngineQa");
  } catch {
    return false;
  }
});
const customLessons = [
  {
    id: "3-2-1-1",
    folder: "3-2-1-1-mathmon-box-run",
  },
  {
    id: "3-2-1-2",
    folder: "3-2-1-2-mathmon-rocket-charge",
  },
  {
    id: "3-2-1-4",
    folder: "3-2-1-4-mathmon-fusion",
    fixedQuery: "qa-seed=61",
  },
  {
    id: "3-2-5-4",
    folder: "3-2-5-4-mathmon-package-weight",
    fixedQuery: "seed=61&qa=randomness",
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => resolve(address.port));
    });
  });
}

function makeServer(port) {
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".png": "image/png" };
  const server = http.createServer((request, response) => {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    const relative = pathname.replace(/^\/+/, "") || "index.html";
    const filePath = path.resolve(ROOT, relative);
    if (!filePath.startsWith(`${ROOT}${path.sep}`)) {
      response.writeHead(403).end();
      return;
    }
    const stream = createReadStream(filePath);
    stream.once("error", () => {
      if (!response.headersSent) response.writeHead(404);
      response.end();
    });
    stream.once("open", () => {
      response.writeHead(200, { "Content-Type": types[path.extname(filePath)] || "application/octet-stream" });
      stream.pipe(response);
    });
  });
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
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
      const pending = this.pending.get(message.id);
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(JSON.stringify(message.error)));
      else pending.resolve(message.result || {});
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
    this.ws?.close();
  }
}

async function waitForPage(debugPort) {
  for (let index = 0; index < 100; index += 1) {
    try {
      const pages = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
      const page = pages.find((item) => item.type === "page");
      if (page?.webSocketDebuggerUrl) return page.webSocketDebuggerUrl;
    } catch {
      // Chrome is still starting.
    }
    await delay(100);
  }
  throw new Error("Chrome DevTools endpoint did not open");
}

async function evaluate(page, expression) {
  const result = await page.send("Runtime.evaluate", { expression, awaitPromise:true, returnByValue:true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}

async function waitUntil(page, expression, message, timeout = 8000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(page, expression)) return;
    await delay(80);
  }
  throw new Error(message);
}

const runSignatureSource = `(() => {
  const qa = window.__mathmonEngineQa;
  qa.startGame();
  return JSON.stringify(qa.getCurrentProblem());
})()`;

const serverPort = await getFreePort();
const debugPort = await getFreePort();
const profile = await mkdtemp(path.join(os.tmpdir(), "mathmon-run-randomness-"));
const server = await makeServer(serverPort);
const chrome = spawn(CHROME, [
  "--headless=new",
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  "--disable-gpu",
  "--no-first-run",
  "--no-default-browser-check",
  "about:blank",
], { stdio:["ignore", "ignore", "ignore"] });

let page;
try {
  page = new Cdp(await waitForPage(debugPort));
  await page.open();
  await page.send("Page.enable");
  await page.send("Runtime.enable");

  const results = [];
  for (const lesson of lessons) {
    const base = `http://127.0.0.1:${serverPort}/${lesson.folder}/${lesson.entryFile || "index.html"}`;
    await page.send("Page.navigate", { url:`${base}?seed=61&randomnessAudit=${Date.now()}` });
    await waitUntil(page, "document.readyState === 'complete' && Boolean(window.__mathmonEngineQa)", `${lesson.id}: normal page did not load`);
    const randomRuns = [];
    for (let attempt = 0; attempt < 5; attempt += 1) randomRuns.push(await evaluate(page, runSignatureSource));
    assert(new Set(randomRuns).size >= 2, `${lesson.id}: normal retries kept the same first problem`);

    await page.send("Page.navigate", { url:`${base}?seed=61&qa=randomness-${Date.now()}` });
    await waitUntil(page, "document.readyState === 'complete' && Boolean(window.__mathmonEngineQa)", `${lesson.id}: QA page did not load`);
    const fixedRuns = [];
    for (let attempt = 0; attempt < 3; attempt += 1) fixedRuns.push(await evaluate(page, runSignatureSource));
    assert.equal(new Set(fixedRuns).size, 1, `${lesson.id}: QA seed is not reproducible`);
    results.push(lesson.id);
  }

  for (const lesson of customLessons) {
    const base = `http://127.0.0.1:${serverPort}/${lesson.folder}/index.html`;
    await page.send("Page.navigate", { url:`${base}?randomnessAudit=${Date.now()}` });
    await waitUntil(page, "document.readyState === 'complete' && Boolean(window.__mathmonRunQa)", `${lesson.id}: custom page did not load`);
    const randomRuns = [];
    for (let attempt = 0; attempt < 5; attempt += 1) randomRuns.push(await evaluate(page, "window.__mathmonRunQa.generateSignature()"));
    assert(new Set(randomRuns).size >= 2, `${lesson.id}: normal retries kept the same problem run`);

    if (lesson.fixedQuery) {
      await page.send("Page.navigate", { url:`${base}?${lesson.fixedQuery}` });
      await waitUntil(page, "document.readyState === 'complete' && Boolean(window.__mathmonRunQa)", `${lesson.id}: custom QA page did not load`);
      const fixedRuns = [];
      for (let attempt = 0; attempt < 3; attempt += 1) fixedRuns.push(await evaluate(page, "window.__mathmonRunQa.generateSignature()"));
      assert.equal(new Set(fixedRuns).size, 1, `${lesson.id}: custom QA seed is not reproducible`);
    }
    results.push(lesson.id);
  }

  console.log(`QA_RUN_RANDOMNESS_BROWSER: PASS (${results.length} lessons)`);
  console.log(results.join(", "));
} finally {
  page?.close();
  if (chrome.exitCode === null) {
    chrome.kill("SIGTERM");
    await Promise.race([
      new Promise((resolve) => chrome.once("exit", resolve)),
      delay(2000),
    ]);
  }
  await new Promise((resolve) => server.close(resolve));
  await rm(profile, { recursive:true, force:true, maxRetries:5, retryDelay:100 });
}
