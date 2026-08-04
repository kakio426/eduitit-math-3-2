#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createReadStream, existsSync, mkdirSync, statSync, watch } from 'node:fs';
import { readFile, realpath, stat } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

const PREVIEW_PREFIX = '/__mathmon_preview__';
const DEFAULT_PORT = 3235;
const DEFAULT_SYNC_MS = 5_000;

const MIME_TYPES = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpeg', 'image/jpeg'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.m4a', 'audio/mp4'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.mp3', 'audio/mpeg'],
  ['.mp4', 'video/mp4'],
  ['.ogg', 'audio/ogg'],
  ['.opus', 'audio/ogg'],
  ['.otf', 'font/otf'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.ttf', 'font/ttf'],
  ['.wav', 'audio/wav'],
  ['.webm', 'video/webm'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function parseArgs(argv) {
  const values = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      values.set(token.slice(2), true);
      continue;
    }
    values.set(token.slice(2), next);
    index += 1;
  }
  return values;
}

function requireString(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} 값이 필요합니다.`);
  }
  return value;
}

function positiveInteger(value, fallback, label) {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${label}은(는) 양의 정수여야 합니다.`);
  }
  return parsed;
}

function runGit(cwd, args, { allowFailure = false } = {}) {
  const result = spawnSync('git', ['-C', cwd, ...args], {
    encoding: 'utf8',
    maxBuffer: 16 * 1024 * 1024,
  });

  if (result.status !== 0 && !allowFailure) {
    const detail = (result.stderr || result.stdout || '').trim();
    throw new Error(`git ${args.join(' ')} 실패${detail ? `: ${detail}` : ''}`);
  }

  return {
    ok: result.status === 0,
    stdout: (result.stdout || '').trim(),
    stderr: (result.stderr || '').trim(),
  };
}

function log(event, detail = {}) {
  process.stdout.write(`${JSON.stringify({ time: new Date().toISOString(), event, ...detail })}\n`);
}

function fetchOrigin(repo) {
  runGit(repo, ['fetch', 'origin', '--prune']);
  return runGit(repo, ['rev-parse', 'origin/main']).stdout;
}

function ensureCanonicalWorktree({ repo, worktree }) {
  const originMain = fetchOrigin(repo);
  mkdirSync(path.dirname(worktree), { recursive: true });

  if (!existsSync(worktree)) {
    runGit(repo, ['worktree', 'add', '--detach', worktree, 'origin/main']);
    log('worktree-created', { worktree, commit: originMain });
  } else if (!existsSync(path.join(worktree, '.git'))) {
    throw new Error(`고정 프리뷰 경로가 Git 작업공간이 아닙니다: ${worktree}`);
  }

  const actualRoot = runGit(worktree, ['rev-parse', '--show-toplevel']).stdout;
  if (path.resolve(actualRoot) !== path.resolve(worktree)) {
    throw new Error(`고정 프리뷰 작업공간 루트가 예상과 다릅니다: ${actualRoot}`);
  }

  const dirty = runGit(worktree, ['status', '--porcelain', '--untracked-files=all']).stdout;
  if (dirty) {
    throw new Error(`고정 프리뷰 작업공간에 수정 파일이 있습니다. 자동 덮어쓰기를 중단합니다: ${worktree}`);
  }

  const current = runGit(worktree, ['rev-parse', 'HEAD']).stdout;
  if (current !== originMain) {
    runGit(worktree, ['switch', '--detach', 'origin/main']);
    log('worktree-updated', { from: current, to: originMain });
  }

  return originMain;
}

function escapeHtmlAttribute(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function previewRuntimeMarkup(state) {
  const commit = escapeHtmlAttribute(state.servedCommit);
  const runtime = JSON.stringify({
    servedCommit: state.servedCommit,
    originMain: state.originMain,
    worktree: state.worktree,
    loadedAt: new Date().toISOString(),
  }).replaceAll('<', '\\u003c');

  return `<meta name="mathmon-preview-commit" content="${commit}">
<script data-mathmon-preview-runtime>
(() => {
  const runtime = ${runtime};
  window.__mathmonPreviewRuntime = runtime;
  const statusUrl = '${PREVIEW_PREFIX}/status.json';
  const eventUrl = '${PREVIEW_PREFIX}/events';
  let reloading = false;
  const reload = () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  };
  const events = new EventSource(eventUrl);
  events.addEventListener('reload', (event) => {
    try {
      const next = JSON.parse(event.data);
      if (next.reason === 'files' || next.commit !== runtime.servedCommit) reload();
    } catch {
      reload();
    }
  });
  window.setInterval(async () => {
    try {
      const response = await fetch(statusUrl, { cache: 'no-store' });
      const status = await response.json();
      if (status.servedCommit !== runtime.servedCommit) reload();
    } catch {
      // launchd가 서버를 다시 띄우는 동안에는 다음 확인 주기를 기다린다.
    }
  }, 3000);
})();
</script>`;
}

function injectPreviewRuntime(html, state) {
  const markup = previewRuntimeMarkup(state);
  const headClose = html.search(/<\/head\s*>/i);
  if (headClose >= 0) {
    return `${html.slice(0, headClose)}${markup}\n${html.slice(headClose)}`;
  }
  return `${markup}\n${html}`;
}

function jsonResponse(response, statusCode, value) {
  const body = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Content-Length': body.length,
    'Content-Type': 'application/json; charset=utf-8',
    Expires: '0',
    Pragma: 'no-cache',
  });
  response.end(body);
}

function errorResponse(response, statusCode, message) {
  const body = Buffer.from(`${message}\n`);
  response.writeHead(statusCode, {
    'Cache-Control': 'no-store',
    'Content-Length': body.length,
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

function statusPayload(state) {
  return {
    ok: true,
    server: 'mathmon-canonical-preview-v1',
    servedCommit: state.servedCommit,
    originMain: state.originMain,
    inSync: state.servedCommit === state.originMain,
    worktree: state.worktree,
    repo: state.repo,
    startedAt: state.startedAt,
    lastSyncAt: state.lastSyncAt,
    syncError: state.syncError,
  };
}

function sendSse(response, event, data) {
  response.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

async function safeStaticPath(root, pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  const candidate = path.resolve(root, `.${decoded}`);
  const rootPrefix = `${path.resolve(root)}${path.sep}`;
  if (candidate !== path.resolve(root) && !candidate.startsWith(rootPrefix)) return null;

  let target = candidate;
  try {
    const info = await stat(target);
    if (info.isDirectory()) target = path.join(target, 'index.html');
    const resolvedRoot = await realpath(root);
    const resolvedTarget = await realpath(target);
    if (resolvedTarget !== resolvedRoot && !resolvedTarget.startsWith(`${resolvedRoot}${path.sep}`)) return null;
    return resolvedTarget;
  } catch {
    return target;
  }
}

function parseRange(rangeHeader, size) {
  if (!rangeHeader) return null;
  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return { invalid: true };

  let start = match[1] ? Number.parseInt(match[1], 10) : null;
  let end = match[2] ? Number.parseInt(match[2], 10) : null;

  if (start === null && end !== null) {
    start = Math.max(0, size - end);
    end = size - 1;
  } else {
    start ??= 0;
    end ??= size - 1;
  }

  if (start < 0 || end < start || start >= size) return { invalid: true };
  return { start, end: Math.min(end, size - 1) };
}

async function serveFile(request, response, filePath, state) {
  let fileInfo;
  try {
    fileInfo = await stat(filePath);
  } catch {
    errorResponse(response, 404, '파일을 찾을 수 없습니다.');
    return;
  }

  if (!fileInfo.isFile()) {
    errorResponse(response, 404, '파일을 찾을 수 없습니다.');
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  if (extension === '.html') {
    const source = await readFile(filePath, 'utf8');
    const body = Buffer.from(injectPreviewRuntime(source, state));
    response.writeHead(200, {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Content-Length': body.length,
      'Content-Type': MIME_TYPES.get(extension),
      Expires: '0',
      Pragma: 'no-cache',
      'X-Mathmon-Preview-Commit': state.servedCommit,
    });
    if (request.method === 'HEAD') response.end();
    else response.end(body);
    return;
  }

  const range = parseRange(request.headers.range, fileInfo.size);
  if (range?.invalid) {
    response.writeHead(416, { 'Content-Range': `bytes */${fileInfo.size}` });
    response.end();
    return;
  }

  const headers = {
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Content-Type': MIME_TYPES.get(extension) || 'application/octet-stream',
    Expires: '0',
    Pragma: 'no-cache',
    'X-Mathmon-Preview-Commit': state.servedCommit,
  };

  if (range) {
    headers['Content-Length'] = range.end - range.start + 1;
    headers['Content-Range'] = `bytes ${range.start}-${range.end}/${fileInfo.size}`;
    response.writeHead(206, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(filePath, { start: range.start, end: range.end }).pipe(response);
    return;
  }

  headers['Content-Length'] = fileInfo.size;
  response.writeHead(200, headers);
  if (request.method === 'HEAD') response.end();
  else createReadStream(filePath).pipe(response);
}

function createServer(state) {
  const sseClients = new Set();

  const broadcastReload = (reason) => {
    const payload = { reason, commit: state.servedCommit, at: new Date().toISOString() };
    for (const client of sseClients) sendSse(client, 'reload', payload);
    log('reload-broadcast', { reason, commit: state.servedCommit, clients: sseClients.size });
  };

  const server = http.createServer(async (request, response) => {
    try {
      if (!['GET', 'HEAD'].includes(request.method || '')) {
        errorResponse(response, 405, 'GET 또는 HEAD 요청만 지원합니다.');
        return;
      }

      const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);

      if (url.pathname === `${PREVIEW_PREFIX}/status.json`) {
        jsonResponse(response, 200, statusPayload(state));
        return;
      }

      if (url.pathname === `${PREVIEW_PREFIX}/events`) {
        if (request.method === 'HEAD') {
          response.writeHead(200, { 'Cache-Control': 'no-store', 'Content-Type': 'text/event-stream' });
          response.end();
          return;
        }
        response.writeHead(200, {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Connection: 'keep-alive',
          'Content-Type': 'text/event-stream; charset=utf-8',
          'X-Accel-Buffering': 'no',
        });
        response.write(': connected\n\n');
        sendSse(response, 'ready', statusPayload(state));
        sseClients.add(response);
        request.on('close', () => sseClients.delete(response));
        return;
      }

      const filePath = await safeStaticPath(state.worktree, url.pathname);
      if (!filePath) {
        errorResponse(response, 403, '허용되지 않은 경로입니다.');
        return;
      }
      await serveFile(request, response, filePath, state);
    } catch (error) {
      log('request-error', { message: error.message, url: request.url });
      if (!response.headersSent) errorResponse(response, 500, '프리뷰 서버 오류가 발생했습니다.');
      else response.destroy(error);
    }
  });

  server.on('clientError', (error, socket) => {
    log('client-error', { message: error.message });
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
  });

  return { server, broadcastReload, sseClients };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const repo = path.resolve(requireString(args.get('repo') || process.cwd(), '--repo'));
  const worktree = path.resolve(requireString(args.get('worktree'), '--worktree'));
  const host = requireString(args.get('host') || '127.0.0.1', '--host');
  const port = positiveInteger(args.get('port'), DEFAULT_PORT, '--port');
  const legacyPort = args.has('legacy-port')
    ? positiveInteger(args.get('legacy-port'), null, '--legacy-port')
    : null;
  const syncMs = positiveInteger(args.get('sync-ms'), DEFAULT_SYNC_MS, '--sync-ms');

  const servedCommit = ensureCanonicalWorktree({ repo, worktree });
  const state = {
    repo,
    worktree,
    servedCommit,
    originMain: servedCommit,
    startedAt: new Date().toISOString(),
    lastSyncAt: new Date().toISOString(),
    syncError: null,
    suppressFileEventsUntil: 0,
  };

  const { server, broadcastReload, sseClients } = createServer(state);
  const legacyServer = legacyPort
    ? http.createServer((request, response) => {
        const location = `http://${host}:${port}${request.url || '/'}`;
        response.writeHead(307, {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          Location: location,
        });
        response.end();
      })
    : null;
  let fileReloadTimer = null;
  let watcher = null;

  try {
    watcher = watch(worktree, { recursive: true }, (_event, filename) => {
      if (!filename || filename.startsWith('.git') || Date.now() < state.suppressFileEventsUntil) return;
      clearTimeout(fileReloadTimer);
      fileReloadTimer = setTimeout(() => broadcastReload('files'), 250);
    });
    watcher.on('error', (error) => log('watch-error', { message: error.message }));
  } catch (error) {
    log('watch-unavailable', { message: error.message });
  }

  let syncing = false;
  const sync = async () => {
    if (syncing) return;
    syncing = true;
    try {
      const originMain = fetchOrigin(repo);
      state.originMain = originMain;
      state.lastSyncAt = new Date().toISOString();
      const dirty = runGit(worktree, ['status', '--porcelain', '--untracked-files=all']).stdout;
      if (dirty) {
        state.syncError = '고정 프리뷰 작업공간에 수정 파일이 있어 origin/main 자동 반영을 멈췄습니다.';
        log('sync-skipped-dirty-worktree', { worktree });
        return;
      }

      const current = runGit(worktree, ['rev-parse', 'HEAD']).stdout;
      if (current !== originMain) {
        state.suppressFileEventsUntil = Date.now() + 5_000;
        runGit(worktree, ['switch', '--detach', 'origin/main']);
        state.servedCommit = originMain;
        state.syncError = null;
        log('origin-main-applied', { from: current, to: originMain });
        broadcastReload('origin-main');
      } else {
        state.servedCommit = current;
        state.syncError = null;
      }
    } catch (error) {
      state.syncError = error.message;
      log('sync-error', { message: error.message });
    } finally {
      syncing = false;
    }
  };

  const syncTimer = setInterval(sync, syncMs);
  syncTimer.unref();
  const heartbeatTimer = setInterval(() => {
    for (const client of sseClients) client.write(`: heartbeat ${Date.now()}\n\n`);
  }, 15_000);
  heartbeatTimer.unref();

  const shutdown = (signal) => {
    log('shutdown', { signal });
    clearInterval(syncTimer);
    clearInterval(heartbeatTimer);
    clearTimeout(fileReloadTimer);
    watcher?.close();
    for (const client of sseClients) client.end();
    legacyServer?.close();
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 3_000).unref();
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));

  server.listen(port, host, () => {
    log('listening', {
      url: `http://${host}:${port}/`,
      repo,
      worktree,
      commit: state.servedCommit,
      syncMs,
    });
  });

  legacyServer?.on('error', (error) => {
    log('legacy-listener-error', { port: legacyPort, message: error.message });
    shutdown('LEGACY_LISTENER_ERROR');
  });
  legacyServer?.listen(legacyPort, host, () => {
    log('legacy-redirect-listening', {
      from: `http://${host}:${legacyPort}/`,
      to: `http://${host}:${port}/`,
    });
  });
}

main().catch((error) => {
  log('fatal', { message: error.message, stack: error.stack });
  process.exit(1);
});
