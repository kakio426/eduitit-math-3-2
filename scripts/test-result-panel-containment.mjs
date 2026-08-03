#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_ROOT = path.join(ROOT, "fixtures", "result-panel-containment");
const FIXTURES = [
  "valid.json",
  "axis-correct-outside-panel.json",
  "panel-too-short.json",
  "retry-hitbox-outside-panel.json",
  "hidden-node-still-rendered.json",
  "stage-cropped-at-user-viewport.json",
];
const ORDER = ["title", "measure", "track", "correct", "next", "retry"];

function normalizeInset(value) {
  return typeof value === "number"
    ? { top:value, right:value, bottom:value, left:value }
    : value;
}

function validate(fixture) {
  const inset = normalizeInset(fixture.safeInsetPx || 0);
  const safe = {
    left:fixture.panel.left + inset.left,
    top:fixture.panel.top + inset.top,
    right:fixture.panel.right - inset.right,
    bottom:fixture.panel.bottom - inset.bottom,
  };
  const failures = [];
  const leaves = (rect, bounds) => rect.left < bounds.left
    || rect.top < bounds.top
    || rect.right > bounds.right
    || rect.bottom > bounds.bottom;
  if (Number(fixture.requiredContentHeight) > safe.bottom - safe.top) {
    failures.push("safe panel height is too short");
  }
  for (const [key, rect] of Object.entries(fixture.nodes)) {
    if (leaves(rect, safe)) {
      failures.push(`${key} leaves panel`);
    }
  }
  const visible = ORDER.map((key) => fixture.nodes[key] ? { key, rect:fixture.nodes[key] } : null).filter(Boolean);
  for (let index = 0; index < visible.length - 1; index += 1) {
    const first = visible[index];
    const second = visible[index + 1];
    if (second.rect.top - first.rect.bottom < fixture.minimumVisibleGapPx) {
      failures.push(`${first.key}/${second.key} gap is too small`);
    }
  }
  for (const pair of fixture.pairedRects || []) {
    if (leaves(pair.visual, safe)) failures.push(`${pair.name} visual leaves panel`);
    if (leaves(pair.hitbox, safe)) failures.push(`${pair.name} hitbox leaves panel`);
    const tolerance = Number(pair.tolerancePx || 0);
    if (["left", "top", "right", "bottom"].some((edge) => Math.abs(pair.visual[edge] - pair.hitbox[edge]) > tolerance)) {
      failures.push(`${pair.name} visual and hitbox do not match`);
    }
  }
  for (const [key, node] of Object.entries(fixture.hiddenNodes || {})) {
    if (node.hidden && (node.rect.width !== 0 || node.rect.height !== 0)) {
      failures.push(`hidden ${key} still renders`);
    }
  }
  if (fixture.viewport && fixture.stage && leaves(fixture.stage, {
    left:0,
    top:0,
    right:fixture.viewport.width,
    bottom:fixture.viewport.height,
  })) {
    failures.push("stage leaves viewport");
  }
  return failures;
}

for (const filename of FIXTURES) {
  const fixture = JSON.parse(await readFile(path.join(FIXTURE_ROOT, filename), "utf8"));
  const failures = validate(fixture);
  const valid = failures.length === 0;
  if (valid !== fixture.expectedValid) {
    throw new Error(`${fixture.name}: expectedValid=${fixture.expectedValid}, failures=${JSON.stringify(failures)}`);
  }
  if (fixture.expectedFailure && !failures.includes(fixture.expectedFailure)) {
    throw new Error(`${fixture.name}: expected failure ${fixture.expectedFailure}, got ${JSON.stringify(failures)}`);
  }
  console.log(JSON.stringify({ fixture:fixture.name, valid, failures }));
}

console.log("RESULT_PANEL_CONTAINMENT_FIXTURES: PASS");
