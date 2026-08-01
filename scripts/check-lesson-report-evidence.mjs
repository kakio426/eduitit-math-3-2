#!/usr/bin/env node
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function isTarget(folder) {
  const match = folder.match(/^3-2-(\d+)-(\d+)-/);
  if (!match) return false;
  const unit = Number(match[1]);
  const lesson = Number(match[2]);
  return (unit === 3 && lesson >= 3) || (unit >= 4 && unit <= 6);
}

function hash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function assert(value, message) {
  if (!value) throw new Error(message);
}

const requested = process.argv.slice(2);
const folders = requested.length ? requested : readdirSync(ROOT).filter(isTarget).sort();
for (const folder of folders) {
  const lessonDir = path.join(ROOT, folder);
  const manifestPath = path.join(lessonDir, "screenshots", "report-evidence-manifest.json");
  assert(existsSync(manifestPath), `${folder}: report evidence manifest is missing`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  assert(manifest.standard === "lesson-report-evidence-v1" && manifest.lesson === folder, `${folder}: evidence manifest identity is invalid`);
  const indexPath = path.join(lessonDir, manifest.index.file);
  assert(existsSync(indexPath) && hash(indexPath) === manifest.index.sha256, `${folder}: evidence was captured from an older index.html`);
  const sheetPath = path.join(lessonDir, manifest.contactSheet.file);
  assert(existsSync(sheetPath) && hash(sheetPath) === manifest.contactSheet.sha256, `${folder}: contact sheet is missing or stale`);
  assert(Array.isArray(manifest.screenshots) && manifest.screenshots.length >= 6, `${folder}: too few browser states in evidence`);
  const names = manifest.screenshots.map(({ file }) => file);
  for (const entry of manifest.screenshots) {
    assert(/^[a-f0-9]{64}$/.test(entry.sha256), `${folder}: screenshot evidence hash is invalid: ${entry.file}`);
    assert(entry.mtimeMs + 1000 >= manifest.index.mtimeMs, `${folder}: captured evidence predates the recorded index: ${entry.file}`);
  }
  for (const required of [/cover/, /play/, /wrong/, /(?:confirm|complete)/, /reward/, /result/]) {
    assert(names.some((name) => required.test(name)), `${folder}: missing ${required} browser state evidence`);
  }
  console.log(`REPORT_EVIDENCE: PASS (${folder}, ${names.length} states)`);
}
