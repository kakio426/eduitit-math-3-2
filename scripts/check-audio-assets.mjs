import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "manifest.json");
const MODULE_PATH = path.join(ROOT, "_shared/audio/mathmon-audio-v1.js");
const BGM_PATH = path.join(
  ROOT,
  "_shared/audio/music/tallbeard/sketchbook-2025-11-26/sketchbook-2025-11-26.ogg",
);
const MODULE_REFERENCE = "../_shared/audio/mathmon-audio-v1.js?v=20260803";
const PREF_KEYS = ["mathmon-audio-bgm-enabled", "mathmon-audio-sfx-enabled"];
const REQUIRED_CUES = ["start", "correct", "try", "reward", "next", "scan", "measure", "finish"];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function extractFunction(source, name) {
  const matcher = new RegExp(`(?:async\\s+)?function\\s+${name}\\s*\\([^)]*\\)\\s*\\{`, "g");
  const match = matcher.exec(source);
  if (!match) return "";
  let depth = 0;
  let quote = "";
  let escaped = false;
  let lineComment = false;
  let blockComment = false;
  for (let index = match.index; index < source.length; index += 1) {
    const character = source[index];
    const next = source[index + 1];
    if (lineComment) {
      if (character === "\n") lineComment = false;
      continue;
    }
    if (blockComment) {
      if (character === "*" && next === "/") {
        blockComment = false;
        index += 1;
      }
      continue;
    }
    if (quote) {
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = "";
      continue;
    }
    if (character === "/" && next === "/") {
      lineComment = true;
      index += 1;
      continue;
    }
    if (character === "/" && next === "*") {
      blockComment = true;
      index += 1;
      continue;
    }
    if (character === '"' || character === "'" || character === "`") {
      quote = character;
      continue;
    }
    if (character === "{") depth += 1;
    if (character === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(match.index, index + 1);
    }
  }
  throw new Error(`unterminated function: ${name}`);
}

async function checkSharedModule() {
  const source = await readFile(MODULE_PATH, "utf8");
  const bgm = await readFile(BGM_PATH);
  const bgmInfo = await stat(BGM_PATH);
  assert(bgm.toString("ascii", 0, 4) === "OggS", "shared BGM is not an Ogg container");
  assert(bgmInfo.size > 1024 * 1024, `shared BGM is unexpectedly small: ${bgmInfo.size} bytes`);
  assert(source.includes('const VERSION = "mathmon-audio-v1"'), "shared audio version is missing");
  assert(source.includes("gain: 0.025"), "approved BGM gain 0.025 is missing");
  assert(source.includes("duckGain: 0.008"), "approved BGM duck gain 0.008 is missing");
  assert(source.includes("fadeSeconds: 1.2"), "approved BGM fade 1.2s is missing");
  for (const cue of REQUIRED_CUES) {
    assert(new RegExp(`\\b${cue}: Object\\.freeze\\(\\[`).test(source), `shared SFX cue is missing: ${cue}`);
  }
  for (const key of PREF_KEYS) {
    assert(source.includes(key), `shared preference key is missing: ${key}`);
  }
  assert(source.includes("global.__mathmonAudioQa"), "shared audio QA hook is missing");
  return { bytes: bgmInfo.size, cues: REQUIRED_CUES.length };
}

async function checkLesson(lesson) {
  const indexPath = path.join(ROOT, lesson.folder, lesson.entryFile || "index.html");
  const html = await readFile(indexPath, "utf8");
  assert(countOccurrences(html, MODULE_REFERENCE) === 1, `${lesson.id}: shared audio module must be referenced exactly once`);
  assert(html.includes('data-settings-standard="modal-controls"'), `${lesson.id}: modal settings standard is missing`);
  assert(html.includes('id="settingsBgmToggle"'), `${lesson.id}: BGM settings toggle is missing`);
  assert(html.includes('id="settingsSfxToggle"'), `${lesson.id}: SFX settings toggle is missing`);
  for (const key of PREF_KEYS) {
    assert(html.includes(key), `${lesson.id}: preference key is missing: ${key}`);
  }
  const playSample = extractFunction(html, "playSample");
  const playSound = extractFunction(html, "playSound");
  assert(
    playSample.includes("MathmonAudio?.play") || playSound.includes("MathmonAudio?.play"),
    `${lesson.id}: lesson SFX calls do not delegate to the shared engine`,
  );
  assert(
    !/localStorage\.setItem\([^\n]+enabled\s*\?\s*["']on["']\s*:\s*["']off["']/.test(html),
    `${lesson.id}: legacy on/off preference writer remains`,
  );
  return {
    id: lesson.id,
    folder: lesson.folder,
    settings: true,
    sharedBgm: true,
    sharedSfx: true,
  };
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
assert(Array.isArray(manifest.lessons), "manifest lessons are missing");
assert(manifest.lessons.length === 24, `expected 24 lessons, found ${manifest.lessons.length}`);

const shared = await checkSharedModule();
const lessons = [];
for (const lesson of manifest.lessons) lessons.push(await checkLesson(lesson));

console.log("MATHMON_AUDIO_STATIC_QA: PASS");
console.log(JSON.stringify({ ok: true, shared, lessonCount: lessons.length, lessons }, null, 2));
