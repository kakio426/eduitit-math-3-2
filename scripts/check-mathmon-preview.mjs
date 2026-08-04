#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import process from 'node:process';

function parseArgs(argv) {
  const args = new Map();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    const value = argv[index + 1];
    if (!token.startsWith('--') || !value || value.startsWith('--')) continue;
    args.set(token.slice(2), value);
    index += 1;
  }
  return args;
}

function fail(message) {
  process.stderr.write(`FAIL: ${message}\n`);
  process.exit(1);
}

function gitOriginMain(repo) {
  const result = spawnSync('git', ['-C', repo, 'rev-parse', 'origin/main'], {
    encoding: 'utf8',
  });
  if (result.status !== 0) fail((result.stderr || 'origin/main 확인 실패').trim());
  return result.stdout.trim();
}

const args = parseArgs(process.argv.slice(2));
const repo = args.get('repo') || process.cwd();
const baseUrl = (args.get('url') || 'http://127.0.0.1:3235').replace(/\/$/, '');
const lessonPath = args.get('lesson') || '/3-2-3-3-mathmon-double-bridge/';
const lessonFolder = lessonPath.split('/').filter(Boolean)[0];
if (!lessonFolder) fail(`차시 경로에서 폴더를 찾을 수 없습니다: ${lessonPath}`);
const lessonSourcePath = `/_lessons/${encodeURIComponent(lessonFolder)}/lesson.json`;
const expectedCommit = gitOriginMain(repo);

let statusResponse;
let lessonResponse;
let lessonSourceResponse;
try {
  [statusResponse, lessonResponse, lessonSourceResponse] = await Promise.all([
    fetch(`${baseUrl}/__mathmon_preview__/status.json`, { cache: 'no-store' }),
    fetch(`${baseUrl}${lessonPath}`, { cache: 'no-store' }),
    fetch(`${baseUrl}${lessonSourcePath}`, { cache: 'no-store' }),
  ]);
} catch (error) {
  fail(`프리뷰 서버에 연결할 수 없습니다: ${error.message}`);
}

if (!statusResponse.ok) fail(`상태 응답 오류: HTTP ${statusResponse.status}`);
if (!lessonResponse.ok) fail(`차시 응답 오류: HTTP ${lessonResponse.status}`);
if (!lessonSourceResponse.ok) fail(`차시 원본 응답 오류: HTTP ${lessonSourceResponse.status}`);

const status = await statusResponse.json();
const html = await lessonResponse.text();
const lessonJsonSource = await lessonSourceResponse.text();
const expectedLessonJsonSha = createHash('sha256').update(lessonJsonSource).digest('hex');
const headerCommit = lessonResponse.headers.get('x-mathmon-preview-commit');
const metaCommit = /<meta\s+name="mathmon-preview-commit"\s+content="([0-9a-f]{40})">/i.exec(html)?.[1];
const runtimeBuildMeta = /<div\b[^>]*\bid="mathmonRuntimeBuildMeta"[^>]*>/i.exec(html)?.[0] || '';
const runtimeLessonJsonSha = /data-lesson-json-sha256="([0-9a-f]{64})"/i.exec(runtimeBuildMeta)?.[1];
const noStore = lessonResponse.headers.get('cache-control')?.includes('no-store');

if (status.server !== 'mathmon-canonical-preview-v1') fail(`알 수 없는 서버: ${status.server}`);
if (!status.inSync) fail(`서버 작업공간과 origin/main이 다릅니다: ${status.servedCommit} / ${status.originMain}`);
if (status.syncError) fail(`서버 동기화 오류: ${status.syncError}`);
if (status.servedCommit !== expectedCommit) fail(`서버 해시가 origin/main과 다릅니다: ${status.servedCommit} / ${expectedCommit}`);
if (headerCommit !== expectedCommit) fail(`응답 헤더 해시가 다릅니다: ${headerCommit} / ${expectedCommit}`);
if (metaCommit !== expectedCommit) fail(`브라우저 메타 해시가 다릅니다: ${metaCommit} / ${expectedCommit}`);
if (!runtimeBuildMeta) fail('배포용 index.html에 mathmonRuntimeBuildMeta가 없습니다. 차시를 다시 빌드해야 합니다.');
if (runtimeLessonJsonSha !== expectedLessonJsonSha) fail(`배포용 index.html과 lesson.json 해시가 다릅니다: ${runtimeLessonJsonSha || '없음'} / ${expectedLessonJsonSha}`);
if (!noStore) fail('HTML 응답에 no-store 캐시 정책이 없습니다.');
if (!html.includes('data-mathmon-preview-runtime')) fail('자동 새로고침 런타임이 주입되지 않았습니다.');

process.stdout.write([
  'PASS mathmon canonical preview',
  `commit=${expectedCommit}`,
  `lesson=${new URL(lessonPath, `${baseUrl}/`).href}`,
  `worktree=${status.worktree}`,
  `lessonJsonSha=${expectedLessonJsonSha}`,
  'cache=no-store',
  'autoReload=enabled',
].join('\n') + '\n');
