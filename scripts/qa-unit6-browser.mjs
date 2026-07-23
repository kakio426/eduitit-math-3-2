#!/usr/bin/env node
// Unit 6 browser QA: settings accessibility, wrong-state evidence, stable workbench,
// every generated result tier, WebP decoding, and ranking-network exclusion.
import fs from "node:fs";
import fsp from "node:fs/promises";
import http from "node:http";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const LESSONS = [
  "3-2-6-1-mathmon-data-rangers",
  "3-2-6-2-mathmon-picture-decoder",
  "3-2-6-3-mathmon-picture-stamp",
  "3-2-6-4-mathmon-data-detective",
];
const RESULT_CASES = [
  { power: 0, correct: 0, special: false },
  { power: 19, correct: 2, special: false },
  { power: 39, correct: 4, special: false },
  { power: 61, correct: 6, special: false },
  { power: 83, correct: 8, special: false },
  { power: 100, correct: 10, special: true },
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
  if (details) error.details = details;
  throw error;
}

function getChromePath() {
  const chromePath = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  assert(chromePath, `Chrome 실행 파일을 찾지 못했습니다: ${CHROME_CANDIDATES.join(", ")}`);
  return chromePath;
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      server.close(() => {
        if (typeof address === "object" && address?.port) resolve(address.port);
        else reject(new Error("빈 포트를 만들지 못했습니다."));
      });
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
    let decoded;
    try {
      decoded = decodeURIComponent(requestUrl.pathname);
    } catch {
      response.writeHead(400);
      response.end("bad path");
      return;
    }
    const resolved = path.resolve(ROOT, `.${decoded}`);
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
      response.writeHead(200, {
        "content-type": MIME.get(path.extname(filePath)) || "application/octet-stream",
      });
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
  const exited = await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(2000).then(() => false),
  ]);
  if (exited) return;
  child.kill("SIGKILL");
  await Promise.race([
    new Promise((resolve) => child.once("exit", () => resolve(true))),
    delay(1000).then(() => false),
  ]);
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
  throw lastError || new Error(`요청 실패: ${url}`);
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
      }, 15000);
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

async function waitForPageTarget(debugPort, pageUrl, lesson) {
  for (let attempt = 0; attempt < 80; attempt += 1) {
    const targets = await fetchJson(`http://127.0.0.1:${debugPort}/json/list`, 1).catch(() => []);
    const target = targets.find((item) => item.type === "page" && item.url.startsWith(pageUrl))
      || targets.find((item) => item.type === "page" && item.url.includes(`/${lesson}/index.html`));
    if (target?.webSocketDebuggerUrl) return target.webSocketDebuggerUrl;
    await delay(100);
  }
  throw new Error("Chrome CDP 페이지를 찾지 못했습니다.");
}

async function evaluate(page, expression) {
  const result = await page.send("Runtime.evaluate", {
    expression,
    awaitPromise: true,
    returnByValue: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || "Runtime.evaluate failed");
  }
  return result.result?.value;
}

async function waitUntil(page, expression, message, timeout = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    if (await evaluate(page, expression)) return;
    await delay(80);
  }
  throw new Error(message);
}

async function waitForLoad(page) {
  await waitUntil(page, "document.readyState === 'complete'", "페이지 로드 실패");
  await evaluate(page, `Promise.all([...document.images].map((img) => {
    if (img.complete) return true;
    return new Promise((resolve) => {
      img.addEventListener('load', resolve, { once:true });
      img.addEventListener('error', resolve, { once:true });
    });
  }))`);
}

async function navigate(page, url) {
  await page.send("Page.navigate", { url });
  await waitForLoad(page);
}

async function setViewport(page, viewport) {
  await page.send("Emulation.setDeviceMetricsOverride", {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.dpr || 1,
    mobile: false,
    screenOrientation: { type: "landscapePrimary", angle: 90 },
  });
}

async function screenshot(page, lesson, viewport, name) {
  const capture = await page.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const filePath = path.join(
    ROOT,
    lesson,
    "screenshots",
    `engine-flow-${viewport.name}-${name}.png`,
  );
  await fsp.writeFile(filePath, Buffer.from(capture.data, "base64"));
  return path.relative(ROOT, filePath);
}

async function clickSelector(page, selector) {
  const rect = await evaluate(page, `(() => {
    const node = document.querySelector(${JSON.stringify(selector)});
    if (!node) throw new Error(${JSON.stringify(`missing selector ${selector}`)});
    const rect = node.getBoundingClientRect();
    return {
      x:rect.left + rect.width / 2,
      y:rect.top + rect.height / 2,
      width:rect.width,
      height:rect.height
    };
  })()`);
  assert(rect.width > 0 && rect.height > 0, `${selector}: 클릭 영역이 없습니다.`, rect);
  await page.send("Input.dispatchMouseEvent", {
    type: "mousePressed",
    x: rect.x,
    y: rect.y,
    button: "left",
    buttons: 1,
    clickCount: 1,
  });
  await page.send("Input.dispatchMouseEvent", {
    type: "mouseReleased",
    x: rect.x,
    y: rect.y,
    button: "left",
    buttons: 0,
    clickCount: 1,
  });
  await delay(80);
}

async function pressKey(page, key, modifiers = 0) {
  const keyCode = key === "Tab" ? 9 : key === "Escape" ? 27 : 0;
  await page.send("Input.dispatchKeyEvent", {
    type: "keyDown",
    key,
    code: key,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode,
    modifiers,
  });
  await page.send("Input.dispatchKeyEvent", {
    type: "keyUp",
    key,
    code: key,
    windowsVirtualKeyCode: keyCode,
    nativeVirtualKeyCode: keyCode,
    modifiers,
  });
  await delay(80);
}

async function enterPlay(page) {
  await clickSelector(page, "#startButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial'", "설명 화면 진입 실패");
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.getElementById('screen-tutorial')?.dataset.page === '1'", "설명 2 진입 실패");
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", "문제 화면 진입 실패");
}

async function auditSettings(page, pageUrl, lesson) {
  await navigate(page, `${pageUrl}?seed=20260723&qa=unit6-settings`);
  await clickSelector(page, "#settingsButton");
  await waitUntil(page, "!document.getElementById('settingsBackdrop').hidden", `${lesson}: 설정 열기 실패`);
  assert(
    await evaluate(page, "document.activeElement?.id === 'settingsBgmToggle'"),
    `${lesson}: 설정 첫 초점이 배경 소리에 있지 않습니다.`,
  );
  await pressKey(page, "Tab", 8);
  assert(
    await evaluate(page, "document.activeElement?.id === 'settingsCloseButton'"),
    `${lesson}: Shift+Tab 순환이 마지막 버튼으로 가지 않습니다.`,
  );
  await pressKey(page, "Tab");
  assert(
    await evaluate(page, "document.activeElement?.id === 'settingsBgmToggle'"),
    `${lesson}: Tab 순환이 첫 버튼으로 돌아오지 않습니다.`,
  );
  await pressKey(page, "Escape");
  assert(
    await evaluate(page, "document.getElementById('settingsBackdrop').hidden && document.activeElement?.id === 'settingsButton'"),
    `${lesson}: Escape 닫기 또는 설정 버튼 초점 복귀 실패`,
  );

  await clickSelector(page, "#settingsButton");
  await clickSelector(page, "#settingsBgmToggle");
  await clickSelector(page, "#settingsSfxToggle");
  const toggledOff = await evaluate(page, `(() => ({
    prefs:window.__mathmonAudioQa.getPrefs(),
    bgm:localStorage.getItem('mathmon-audio-bgm-enabled'),
    sfx:localStorage.getItem('mathmon-audio-sfx-enabled')
  }))()`);
  assert(
    toggledOff.prefs.bgmEnabled === false
      && toggledOff.prefs.sfxEnabled === false
      && toggledOff.bgm === "false"
      && toggledOff.sfx === "false",
    `${lesson}: BGM/SFX 끄기 저장 실패`,
    toggledOff,
  );
  await pressKey(page, "Escape");
  await navigate(page, `${pageUrl}?seed=20260723&qa=unit6-settings-reload`);
  const persisted = await evaluate(page, "window.__mathmonAudioQa.getPrefs()");
  assert(
    persisted.bgmEnabled === false && persisted.sfxEnabled === false,
    `${lesson}: BGM/SFX 새로고침 저장 실패`,
    persisted,
  );
  await evaluate(page, "window.__mathmonAudioQa.setPrefs({ bgmEnabled:true, sfxEnabled:true })");

  await enterPlay(page);
  const beforeReview = await evaluate(page, `(() => ({
    screen:window.__mathmonEngineQa.getState().screen,
    problem:window.__mathmonEngineQa.getCurrentProblem()?.id || '',
    counter:document.getElementById('problemCounter')?.textContent.trim() || ''
  }))()`);
  await clickSelector(page, "#settingsButton");
  await clickSelector(page, "#settingsMethodButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-tutorial'", `${lesson}: 방법 복습 진입 실패`);
  await clickSelector(page, "#tutorialStartButton");
  await clickSelector(page, "#tutorialStartButton");
  await waitUntil(page, "document.querySelector('.screen.is-active')?.id === 'screen-play'", `${lesson}: 방법 복습 복귀 실패`);
  const afterReview = await evaluate(page, `(() => ({
    screen:window.__mathmonEngineQa.getState().screen,
    problem:window.__mathmonEngineQa.getCurrentProblem()?.id || '',
    counter:document.getElementById('problemCounter')?.textContent.trim() || ''
  }))()`);
  assert(
    beforeReview.screen === "play"
      && afterReview.screen === "play"
      && beforeReview.problem === afterReview.problem
      && beforeReview.counter === afterReview.counter,
    `${lesson}: 방법 복습 뒤 원래 문제로 돌아오지 않습니다.`,
    { beforeReview, afterReview },
  );

  await clickSelector(page, "#settingsButton");
  await clickSelector(page, "#settingsRestartButton");
  assert(
    await evaluate(page, "!document.getElementById('settingsRestartConfirm').hidden && document.activeElement?.id === 'settingsRestartConfirmButton'"),
    `${lesson}: 처음부터 확인 화면 또는 첫 초점 실패`,
  );
  await clickSelector(page, "#settingsRestartCancelButton");
  assert(
    await evaluate(page, "document.getElementById('settingsRestartConfirm').hidden && document.activeElement?.id === 'settingsRestartButton'"),
    `${lesson}: 처음부터 취소 뒤 초점 복귀 실패`,
  );
  await clickSelector(page, "#settingsRestartButton");
  await clickSelector(page, "#settingsRestartConfirmButton");
  assert(
    await evaluate(page, "document.querySelector('.screen.is-active')?.id === 'screen-cover' && document.activeElement?.id === 'startButton'"),
    `${lesson}: 처음부터 확인 뒤 표지 복귀 실패`,
  );
}

function rectStability(before, after) {
  return {
    left: Math.abs(before.left - after.left),
    right: Math.abs(before.right - after.right),
    center: Math.abs((before.left + before.right) / 2 - (after.left + after.right) / 2),
  };
}

async function setProblemWithMisconception(page, ids) {
  return evaluate(page, `(() => {
    const wanted = ${JSON.stringify(ids)};
    for (let index = 0; index < 10; index += 1) {
      window.__mathmonEngineQa.setState({ problemIndex:index });
      window.__mathmonEngineQa.renderProblem();
      const step = window.__mathmonEngineQa.getCurrentStep();
      const choice = step?.choices?.find((item) => wanted.includes(item.misconceptionId));
      if (choice) {
        return {
          index,
          choiceId:String(choice.id),
          value:String(choice.value),
          misconceptionId:choice.misconceptionId,
          kind:window.__mathmonEngineQa.getCurrentProblem()?.visual?.kind || ''
        };
      }
    }
    return null;
  })()`);
}

async function auditWrongState(page, lesson, viewport, ids, shotName) {
  const target = await setProblemWithMisconception(page, ids);
  assert(target, `${lesson} ${shotName}: 오개념 선택지를 찾지 못했습니다.`);
  const waiting = await evaluate(page, `(() => {
    const stage = document.querySelector('.stage-shell').getBoundingClientRect();
    const card = document.querySelector('.problem-card').getBoundingClientRect();
    const board = document.querySelector('.unit6-board').getBoundingClientRect();
    const choices = document.getElementById('choicesPanel').getBoundingClientRect();
    const step = document.querySelector('.step-board').getBoundingClientRect();
    const choiceNodes = [...document.querySelectorAll('.choice-button')];
    const choiceRects = choiceNodes.map((node) => node.getBoundingClientRect());
    return {
      stage:{ left:stage.left, top:stage.top, right:stage.right, bottom:stage.bottom, width:stage.width, height:stage.height },
      card:{ left:card.left, top:card.top, right:card.right, bottom:card.bottom, width:card.width, height:card.height },
      board:{ left:board.left, top:board.top, right:board.right, bottom:board.bottom, width:board.width, height:board.height },
      step:{ left:step.left, top:step.top, right:step.right, bottom:step.bottom, width:step.width, height:step.height },
      choices:{ left:choices.left, top:choices.top, right:choices.right, bottom:choices.bottom, width:choices.width, height:choices.height },
      minChoiceWidth:choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.width)) : 0,
      minChoiceHeight:choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.height)) : 0,
      choiceFont:choiceNodes[0] ? parseFloat(getComputedStyle(choiceNodes[0]).fontSize) : 0,
      instructionFont:parseFloat(getComputedStyle(document.getElementById('stepInstruction')).fontSize),
      settingsSize:document.getElementById('settingsButton').getBoundingClientRect().width
    };
  })()`);
  await clickSelector(page, `[data-choice="${target.choiceId}"]`);
  await waitUntil(
    page,
    "document.getElementById('feedbackLine')?.dataset.state === 'wrong' && window.__mathmonEngineQa.getState().inputLocked === false",
    `${lesson} ${shotName}: 오답 상태가 나타나지 않았습니다.`,
  );
  const audit = await evaluate(page, `(() => {
    const feedback = document.getElementById('feedbackLine').getBoundingClientRect();
    const choices = document.getElementById('choicesPanel').getBoundingClientRect();
    const card = document.querySelector('.problem-card').getBoundingClientRect();
    const board = document.querySelector('.unit6-board').getBoundingClientRect();
    const overlapWidth = Math.max(0, Math.min(feedback.right, choices.right) - Math.max(feedback.left, choices.left));
    const overlapHeight = Math.max(0, Math.min(feedback.bottom, choices.bottom) - Math.max(feedback.top, choices.top));
    const kind = ${JSON.stringify(target.kind)};
    const evidence = kind === 'census'
      ? Boolean(document.querySelector('.unit6-mark.is-picked-wrong'))
      : kind === 'decoder'
        ? Boolean(document.querySelector('.decoder-total.is-attempt-wrong'))
        : kind === 'stamp'
          ? Boolean(document.querySelector('.stamp-equation.is-attempt-wrong'))
          : Boolean(document.querySelector('.detective-relation.is-attempt-wrong, .detective-row.is-picked-wrong'));
    return {
      attempt:document.getElementById('visualArea')?.dataset.attemptValue || '',
      feedback:document.getElementById('feedbackLine')?.textContent.trim() || '',
      intersection:overlapWidth * overlapHeight,
      boardInside:board.left >= card.left - 1 && board.right <= card.right + 1,
      evidence,
      card:{ left:card.left, right:card.right },
      board:{ left:board.left, right:board.right }
    };
  })()`);
  assert(audit.attempt === target.value, `${lesson} ${shotName}: 고른 값이 작업판 상태에 남지 않았습니다.`, { target, audit });
  assert(audit.feedback.length > 0, `${lesson} ${shotName}: 한 줄 오답 이유가 없습니다.`, audit);
  assert(audit.intersection === 0, `${lesson} ${shotName}: 피드백과 선택지가 겹칩니다.`, audit);
  assert(audit.boardInside && audit.evidence, `${lesson} ${shotName}: 작업판 안 오답 증거가 없습니다.`, audit);
  assert(rectStability(waiting.card, audit.card).center <= 1, `${lesson} ${shotName}: 문제판 중심이 흔들립니다.`, { waiting, audit });
  await screenshot(page, lesson, viewport, shotName);
}

async function auditCorrectAndComplete(page, lesson, viewport) {
  await evaluate(page, "window.__mathmonEngineQa.setState({ problemIndex:0 }); window.__mathmonEngineQa.renderProblem(); true");
  const waiting = await evaluate(page, `(() => {
    const stage = document.querySelector('.stage-shell').getBoundingClientRect();
    const card = document.querySelector('.problem-card').getBoundingClientRect();
    const board = document.querySelector('.unit6-board').getBoundingClientRect();
    const choices = document.getElementById('choicesPanel').getBoundingClientRect();
    const step = document.querySelector('.step-board').getBoundingClientRect();
    const choiceNodes = [...document.querySelectorAll('.choice-button')];
    const choiceRects = choiceNodes.map((node) => node.getBoundingClientRect());
    return {
      stage:{ left:stage.left, top:stage.top, right:stage.right, bottom:stage.bottom, width:stage.width, height:stage.height },
      card:{ left:card.left, top:card.top, right:card.right, bottom:card.bottom, width:card.width, height:card.height },
      board:{ left:board.left, top:board.top, right:board.right, bottom:board.bottom, width:board.width, height:board.height },
      step:{ left:step.left, top:step.top, right:step.right, bottom:step.bottom, width:step.width, height:step.height },
      choices:{ left:choices.left, top:choices.top, right:choices.right, bottom:choices.bottom, width:choices.width, height:choices.height },
      minChoiceWidth:choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.width)) : 0,
      minChoiceHeight:choiceRects.length ? Math.min(...choiceRects.map((rect) => rect.height)) : 0,
      choiceFont:choiceNodes[0] ? parseFloat(getComputedStyle(choiceNodes[0]).fontSize) : 0,
      instructionFont:parseFloat(getComputedStyle(document.getElementById('stepInstruction')).fontSize),
      settingsSize:document.getElementById('settingsButton').getBoundingClientRect().width
    };
  })()`);
  const correctId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep().answerChoiceId");
  await clickSelector(page, `[data-choice="${correctId}"]`);
  await waitUntil(
    page,
    "document.getElementById('feedbackLine')?.dataset.state === 'correct'",
    `${lesson}: 정답 확인 상태가 나타나지 않았습니다.`,
  );
  const firstStep = await evaluate(page, "window.__mathmonEngineQa.getCurrentProblem()?.steps?.length || 0");
  if (firstStep > 1) {
    await screenshot(page, lesson, viewport, "06a-step-1-correct");
    await waitUntil(
      page,
      "Boolean(document.querySelector('.unit6-step-next:not([disabled])'))",
      `${lesson}: 첫 단계 확인 버튼이 나타나지 않았습니다.`,
    );
    await clickSelector(page, ".unit6-step-next:not([disabled])");
    await waitUntil(page, "window.__mathmonEngineQa.getState().stepIndex === 1", `${lesson}: 두 번째 단계 진입 실패`);
    const secondCorrectId = await evaluate(page, "window.__mathmonEngineQa.getCurrentStep().answerChoiceId");
    await clickSelector(page, `[data-choice="${secondCorrectId}"]`);
  }
  await waitUntil(
    page,
    "document.getElementById('completePanel')?.classList.contains('is-visible')",
    `${lesson}: 마지막 완성 상태가 나타나지 않았습니다.`,
  );
  const completed = await evaluate(page, `(() => {
    const card = document.querySelector('.problem-card').getBoundingClientRect();
    const board = document.querySelector('.unit6-board').getBoundingClientRect();
    return {
      card:{ left:card.left, right:card.right },
      board:{ left:board.left, right:board.right },
      expression:document.getElementById('completeExpression')?.textContent.trim() || ''
    };
  })()`);
  const cardDelta = rectStability(waiting.card, completed.card);
  const boardDelta = rectStability(waiting.board, completed.board);
  assert(
    cardDelta.left <= 1 && cardDelta.right <= 1 && cardDelta.center <= 1,
    `${lesson}: 대기·완료 문제판의 좌우 경계 또는 중심이 흔들립니다.`,
    { waiting, completed, cardDelta },
  );
  assert(
    boardDelta.left <= 1 && boardDelta.right <= 1 && boardDelta.center <= 1,
    `${lesson}: 대기·완료 작업판의 좌우 경계 또는 중심이 흔들립니다.`,
    { waiting, completed, boardDelta },
  );
  assert(completed.expression.length > 0, `${lesson}: 마지막 완성식이 없습니다.`, completed);
  await screenshot(page, lesson, viewport, "06b-final-complete");
  return {
    cardDelta,
    boardDelta,
    layout: {
      stage: { width: waiting.stage.width, height: waiting.stage.height },
      problemCard: {
        width: waiting.card.width,
        height: waiting.card.height,
        stageWidthPercent: Number((waiting.card.width / waiting.stage.width * 100).toFixed(2)),
        stageAreaPercent: Number((waiting.card.width * waiting.card.height / (waiting.stage.width * waiting.stage.height) * 100).toFixed(2)),
      },
      workbench: {
        width: waiting.board.width,
        height: waiting.board.height,
        stageWidthPercent: Number((waiting.board.width / waiting.stage.width * 100).toFixed(2)),
        stageAreaPercent: Number((waiting.board.width * waiting.board.height / (waiting.stage.width * waiting.stage.height) * 100).toFixed(2)),
      },
      stepBoard: { width: waiting.step.width, height: waiting.step.height },
      choices: {
        width: waiting.choices.width,
        height: waiting.choices.height,
        minChoiceWidth: waiting.minChoiceWidth,
        minChoiceHeight: waiting.minChoiceHeight,
      },
      typography: {
        choice: waiting.choiceFont,
        instruction: waiting.instructionFont,
        settingsTouch: waiting.settingsSize,
      },
    },
  };
}

async function auditWrongAndComplete(page, pageUrl, lesson, viewport) {
  await navigate(page, `${pageUrl}?seed=20260723&qa=unit6-wrong-${viewport.name}`);
  await enterPlay(page);
  await auditWrongState(
    page,
    lesson,
    viewport,
    ["one-less", "one-unit-less"],
    "05b-play-wrong-low",
  );
  await auditWrongState(
    page,
    lesson,
    viewport,
    ["one-more", "one-unit-more"],
    "05c-play-wrong-high",
  );
  return auditCorrectAndComplete(page, lesson, viewport);
}

async function decodeWebpAssets(page, lesson, pageUrl) {
  const localWebps = (await fsp.readdir(path.join(ROOT, lesson)))
    .filter((name) => name.endsWith(".webp"))
    .sort();
  const sharedCounts = Array.from(
    { length: 11 },
    (_, index) => `../_shared/result-count/result-correct-${index}-generated.webp`,
  );
  const configured = await evaluate(page, "LESSON_CONFIG.assets.filter((asset) => /\\.webp$/i.test(asset))");
  const urls = [...new Set([...localWebps, ...sharedCounts, ...configured])]
    .map((asset) => new URL(asset, pageUrl).href);
  const failures = await evaluate(page, `Promise.all(${JSON.stringify(urls)}.map(async (src) => {
    const image = new Image();
    image.src = src;
    try {
      await image.decode();
      return image.naturalWidth > 0 && image.naturalHeight > 0 ? null : { src, reason:'zero-size' };
    } catch (error) {
      return { src, reason:String(error) };
    }
  })).then((items) => items.filter(Boolean))`);
  assert(failures.length === 0, `${lesson}: WebP decode() 실패`, failures);
  return urls.length;
}

async function auditResultTiers(page, pageUrl, lesson, viewport, config) {
  await navigate(page, `${pageUrl}?seed=20260723&qa=unit6-results-${viewport.name}`);
  const shots = [];
  for (let index = 0; index < RESULT_CASES.length; index += 1) {
    const item = RESULT_CASES[index];
    const result = config.results[index];
    await evaluate(page, `(() => {
      window.__mathmonEngineQa.setState({
        power:${item.power},
        correctFirstTry:${item.correct},
        specialSeen:${item.special},
        currentResult:null
      });
      window.__mathmonEngineQa.showResult();
      return true;
    })()`);
    await waitUntil(
      page,
      `document.getElementById('screen-result')?.dataset.resultTier === ${JSON.stringify(result.id)}
        && document.getElementById('resultBg')?.complete
        && document.getElementById('resultBg')?.naturalWidth === 1280
        && document.getElementById('resultBg')?.naturalHeight === 800
        && document.getElementById('resultTitleArt')?.complete
        && document.getElementById('resultTitleArt')?.naturalWidth > 0
        && document.getElementById('resultCorrectArt')?.complete
        && document.querySelector('.result-retry-art')?.complete`,
      `${lesson} ${viewport.name}: 결과 ${result.id} 이미지 로드 실패`,
    );
    const audit = await evaluate(page, `(() => {
      const stage = document.querySelector('.stage-shell').getBoundingClientRect();
      const title = document.getElementById('resultTitleArt').getBoundingClientRect();
      const hitbox = document.querySelector('.result-retry-hitbox').getBoundingClientRect();
      const art = document.querySelector('.result-retry-art').getBoundingClientRect();
      const missing = [...document.images]
        .filter((img) => !img.hidden && img.offsetParent !== null && (!img.complete || img.naturalWidth === 0))
        .map((img) => img.id || img.className || img.src);
      return {
        title:document.getElementById('resultTitle')?.textContent.trim() || '',
        titleSource:document.getElementById('resultTitleArt')?.getAttribute('src') || '',
        correctSource:document.getElementById('resultCorrectArt')?.getAttribute('src') || '',
        stageRatio:stage.width / stage.height,
        titleInside:title.left >= stage.left - 1 && title.right <= stage.right + 1 && title.top >= stage.top - 1 && title.bottom <= stage.bottom + 1,
        stage:{ left:stage.left, top:stage.top, right:stage.right, bottom:stage.bottom },
        titleRect:{ left:title.left, top:title.top, right:title.right, bottom:title.bottom },
        retryDelta:{
          left:Math.abs(hitbox.left - art.left),
          top:Math.abs(hitbox.top - art.top),
          width:Math.abs(hitbox.width - art.width),
          height:Math.abs(hitbox.height - art.height)
        },
        leaderboardHidden:document.getElementById('leaderboardButton')?.hidden === true,
        destinationHidden:getComputedStyle(document.getElementById('resultDestinationSvg')).display === 'none',
        restartSurfaceHidden:getComputedStyle(document.querySelector('.result-restart-surface')).display === 'none',
        missing
      };
    })()`);
    assert(audit.title === result.name, `${lesson}: 결과 제목 불일치`, { result, audit });
    assert(audit.titleSource === result.titleImage, `${lesson}: 결과 제목 자산 불일치`, { result, audit });
    assert(
      audit.correctSource.endsWith(`result-correct-${item.correct}-generated.webp`),
      `${lesson}: 공용 정답 수 자산 불일치`,
      { result, audit },
    );
    assert(Math.abs(audit.stageRatio - 1.6) <= 0.001, `${lesson}: 결과 Stage가 16:10이 아닙니다.`, audit);
    assert(audit.titleInside && audit.missing.length === 0, `${lesson}: 결과 자산이 Stage 밖이거나 누락됐습니다.`, audit);
    assert(
      Object.values(audit.retryDelta).every((value) => value <= 1),
      `${lesson}: 다시 버튼 아트와 hitbox 차이가 1px을 넘습니다.`,
      audit,
    );
    assert(
      audit.leaderboardHidden && audit.destinationHidden && audit.restartSurfaceHidden,
      `${lesson}: 랭킹 또는 중복 결과 표면이 노출됩니다.`,
      audit,
    );
    shots.push(await screenshot(page, lesson, viewport, `08a-result-${result.id}`));
  }
  return shots;
}

async function runLesson(lesson) {
  const config = JSON.parse(
    await fsp.readFile(path.join(SOURCE_ROOT, lesson, "lesson.json"), "utf8"),
  );
  const viewports = config.qa.viewports;
  await fsp.mkdir(path.join(ROOT, lesson, "screenshots"), { recursive: true });
  const serverPort = await getFreePort();
  const debugPort = await getFreePort();
  const profileDir = await fsp.mkdtemp(path.join(os.tmpdir(), "unit6-browser-qa-"));
  const server = await makeServer(serverPort);
  const pageUrl = `http://127.0.0.1:${serverPort}/${lesson}/index.html`;
  let chrome;
  let page;
  try {
    chrome = await launchChrome(pageUrl, debugPort, profileDir);
    const wsUrl = await waitForPageTarget(debugPort, pageUrl, lesson);
    page = new Cdp(wsUrl);
    await page.open();
    await page.send("Page.enable");
    await page.send("Runtime.enable");
    await page.send("Network.enable");
    await setViewport(page, viewports[0]);
    await auditSettings(page, pageUrl, lesson);

    const viewportResults = [];
    for (const viewport of viewports) {
      await setViewport(page, viewport);
      const alignment = await auditWrongAndComplete(page, pageUrl, lesson, viewport);
      const resultShots = await auditResultTiers(page, pageUrl, lesson, viewport, config);
      viewportResults.push({ viewport: viewport.name, alignment, resultShots });
    }
    const decodedWebps = await decodeWebpAssets(page, lesson, pageUrl);
    const rankingRequests = page.events
      .filter((event) => event.method === "Network.requestWillBeSent")
      .map((event) => event.params?.request?.url || "")
      .filter((url) => /(?:leaderboard|ranking|scoreboard|api\/scores)/i.test(url));
    assert(rankingRequests.length === 0, `${lesson}: 랭킹 네트워크 요청이 발생했습니다.`, rankingRequests);
    const runtimeErrors = page.events.filter((event) => event.method === "Runtime.exceptionThrown");
    assert(runtimeErrors.length === 0, `${lesson}: 브라우저 런타임 예외가 발생했습니다.`, runtimeErrors);
    return { lesson, decodedWebps, rankingRequests: rankingRequests.length, viewportResults };
  } finally {
    page?.close();
    await stopProcess(chrome);
    await closeServer(server);
    await fsp.rm(profileDir, { recursive: true, force: true }).catch(() => {});
  }
}

const requested = process.argv.slice(2);
const lessons = requested.length ? requested : LESSONS;
const unknown = lessons.filter((lesson) => !LESSONS.includes(lesson));
assert(unknown.length === 0, `알 수 없는 6단원 차시: ${unknown.join(", ")}`);

const results = [];
for (const lesson of lessons) {
  results.push(await runLesson(lesson));
  console.log(`UNIT6_BROWSER: PASS (${lesson})`);
}
console.log(`UNIT6_BROWSER: PASS (${results.length} lessons)`);
console.log(JSON.stringify(results, null, 2));
