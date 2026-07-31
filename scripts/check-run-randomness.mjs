#!/usr/bin/env node
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(readFileSync(path.join(ROOT, "manifest.json"), "utf8"));
const lessons = manifest.lessons || [];
const checked = [];

function read(relativePath) {
  return readFileSync(path.join(ROOT, relativePath), "utf8");
}

function assertCommonRunSeedContract(source, label) {
  assert.match(source, /function createRunSeed\(\)/, `${label}: createRunSeed is missing`);
  assert.match(source, /const seedParam = params\.get\("seed"\)/, `${label}: raw seed query is not checked`);
  assert.match(source, /key === "audioSmoke" \|\| key\.startsWith\("qa"\)/, `${label}: fixed seed is not limited to QA`);
  assert.match(source, /seedParam === null \? null : Number\(seedParam\)/, `${label}: an absent seed can collapse to zero`);
  assert.match(source, /hasQaMarker && Number\.isSafeInteger\(requestedSeed\)/, `${label}: a normal URL can still freeze the run`);
  assert.match(source, /crypto\?\.getRandomValues|crypto\.getRandomValues/, `${label}: browser randomness is missing`);
  assert.match(source, /seed === lastRunSeed/, `${label}: immediate retries can reuse the same seed`);
  assert.match(source, /LessonModel\.generateRun\(createRunSeed\(\)\)/, `${label}: startGame does not request a new run seed`);
  assert.doesNotMatch(
    source,
    /Number\(new URLSearchParams\(window\.location\.search\)\.get\("seed"\)\)/,
    `${label}: unsafe Number(null) seed parsing remains`
  );
}

function qaSeed(search) {
  const params = new URLSearchParams(search);
  const seedParam = params.get("seed");
  const hasQaMarker = [...params.keys()].some((key) => key === "audioSmoke" || key.startsWith("qa"));
  const requestedSeed = seedParam === null ? null : Number(seedParam);
  return hasQaMarker && Number.isSafeInteger(requestedSeed) ? requestedSeed : null;
}

assert.equal(qaSeed("?seed=61"), null, "a normal seed query must not freeze student play");
assert.equal(qaSeed("?seed=61&qa=desktop"), 61, "flow QA needs a reproducible seed");
assert.equal(qaSeed("?seed=12345&qaProblem=tenfold"), 12345, "targeted QA needs a reproducible seed");
assert.equal(qaSeed("?seed=12345&audioSmoke=lesson"), 12345, "audio QA needs a reproducible seed");
assert.equal(qaSeed("?qa=desktop"), null, "QA without an explicit seed must remain random");

assert.equal(lessons.length, 24, "manifest lesson count changed; update the randomness audit");

for (const lesson of lessons) {
  const indexPath = `${lesson.folder}/${lesson.entryFile || "index.html"}`;
  const source = read(indexPath);
  const sourceLessonDir = path.join(ROOT, "_lessons", lesson.folder);

  if (existsSync(sourceLessonDir) && lesson.id !== "3-2-5-4") {
    assertCommonRunSeedContract(source, lesson.id);
    checked.push({ id: lesson.id, strategy: "engine-qa-seed-or-fresh-random" });
    continue;
  }

  if (lesson.id === "3-2-1-1") {
    assert.match(source, /return shuffle\(QUESTION_BANK\)\s*\.slice\(0, ROUND_SIZE\)/, `${lesson.id}: question bank is not shuffled per round`);
    assert.match(source, /state\.questions = buildRound\(\)/, `${lesson.id}: retry does not rebuild the round`);
    assert.match(source, /window\.__mathmonRunQa/, `${lesson.id}: browser randomness QA hook is missing`);
    checked.push({ id: lesson.id, strategy: "math-random-question-bank" });
    continue;
  }

  if (lesson.id === "3-2-1-2") {
    assert.match(source, /return shuffle\(candidates\)\.slice\(0, TOTAL_QUESTIONS\)/, `${lesson.id}: candidate bank is not shuffled per game`);
    assert.match(source, /state\.problems = buildProblems\(\)/, `${lesson.id}: retry does not rebuild the problem set`);
    assert.match(source, /window\.__mathmonRunQa/, `${lesson.id}: browser randomness QA hook is missing`);
    checked.push({ id: lesson.id, strategy: "math-random-candidate-bank" });
    continue;
  }

  if (lesson.id === "3-2-1-4") {
    assert.match(source, /function getFixedQaRunSeed\(\)/, `${lesson.id}: fixed QA seed parser is missing`);
    assert.match(source, /rawQaSeed === null \|\| SCOREBOARD_API_URL/, `${lesson.id}: QA seed parsing can collapse an absent value`);
    assert.match(source, /function createLocalRunSeed\(\)/, `${lesson.id}: local run seed is missing`);
    assert.match(source, /crypto\?\.getRandomValues/, `${lesson.id}: browser randomness is missing`);
    assert.match(source, /seed === state\.runSeed/, `${lesson.id}: immediate local retries can reuse the same seed`);
    assert.match(source, /fixedQaSeed === null && nextRunSeed === state\.runSeed/, `${lesson.id}: repeated session seeds can freeze a retry`);
    assert.match(source, /state\.runSeed[\s\S]*createLocalRunSeed\(\)/, `${lesson.id}: retry does not request a new local seed`);
    assert.match(source, /window\.__mathmonRunQa/, `${lesson.id}: browser randomness QA hook is missing`);
    checked.push({ id: lesson.id, strategy: "qa-or-session-seed-with-fresh-retry" });
    continue;
  }

  if (lesson.id === "3-2-5-4") {
    assert.match(source, /const hasExplicitSeed = hasQaMarker && seedParam !== null/, `${lesson.id}: a normal seed query can freeze the run`);
    assert.match(source, /function createRunSeed\(\)/, `${lesson.id}: createRunSeed is missing`);
    assert.match(source, /seed === lastRunSeed/, `${lesson.id}: immediate retries can reuse the same seed`);
    assert.match(source, /createInitialState\(createRunSeed\(\)\)/, `${lesson.id}: retry does not request a new seed`);
    assert.match(source, /window\.__mathmonRunQa/, `${lesson.id}: browser randomness QA hook is missing`);
    checked.push({ id: lesson.id, strategy: "local-qa-seed-or-fresh-random" });
    continue;
  }

  assert.fail(`${lesson.id}: randomness strategy is not audited`);
}

assertCommonRunSeedContract(read("_engine/v1/runtime/core.js"), "shared engine");

console.log(`CHECK_RUN_RANDOMNESS: PASS (${checked.length} lessons)`);
for (const item of checked) console.log(`- ${item.id}: ${item.strategy}`);
