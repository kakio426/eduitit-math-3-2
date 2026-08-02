#!/usr/bin/env node
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = process.cwd();
const lesson = process.argv[2];
if (!lesson) {
  console.error("Usage: node scripts/detect-result-board-axis.mjs <lesson-folder>");
  process.exit(1);
}

const config = JSON.parse(await readFile(path.join(root, "_lessons", lesson, "lesson.json"), "utf8"));
const audit = config.qa?.resultBoardAudit || config.qa?.resultVisualAudit;
if (!audit) throw new Error(`${lesson}: resultBoardAudit/resultVisualAudit is missing`);
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

async function detectAxis(result) {
  const imagePath = path.join(root, lesson, result.image);
  const { data, info } = await sharp(imagePath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const threshold = audit.threshold || {};
  const redMax = Number(threshold.redMax ?? 42);
  const greenMax = Number(threshold.greenMax ?? 82);
  const blueMax = Number(threshold.blueMax ?? 96);
  const minimumRun = info.width * Number(audit.minimumRunRatio || 0.18);
  const scanStartX = Math.floor(info.width * Number(audit.scanStartRatio ?? 0.22));
  const scanEndX = Math.floor(info.width * Number(audit.scanEndRatio ?? 1));
  const runs = [];
  for (let y = Math.floor(info.height * 0.08); y < Math.floor(info.height * 0.88); y += 1) {
    let start = -1;
    let best = null;
    for (let x = scanStartX; x <= scanEndX; x += 1) {
      let matches = false;
      if (x < scanEndX && x < info.width) {
        const offset = (y * info.width + x) * info.channels;
        matches = data[offset] < redMax && data[offset + 1] < greenMax && data[offset + 2] < blueMax;
      }
      if (matches && start < 0) start = x;
      if ((!matches || x === scanEndX) && start >= 0) {
        const end = x - 1;
        const length = end - start + 1;
        if (!best || length > best.length) best = { y, start, end, length, center: (start + end) / 2 };
        start = -1;
      }
    }
    if (best && best.length >= minimumRun) runs.push(best);
  }
  const groups = [];
  for (const run of runs) {
    const previous = groups.at(-1);
    if (!previous || run.y !== previous.at(-1).y + 1
      || Math.abs(run.center - median(previous.map((item) => item.center))) > info.width * 0.05) {
      groups.push([run]);
    } else {
      previous.push(run);
    }
  }
  groups.sort((first, second) => (
    second.length * median(second.map((item) => item.length))
    - first.length * median(first.map((item) => item.length))
  ));
  const group = groups[0] || [];
  const middleLength = group.length ? median(group.map((item) => item.length)) : 0;
  const stable = group.filter((run) => run.length >= middleLength * 0.9);
  const detectedAxisX = stable.length
    ? (median(stable.map((item) => item.start)) + median(stable.map((item) => item.end))) / 2
    : null;
  return { tier: result.id, image: result.image, detectedAxisX, runRows: group.length };
}

const results = [];
for (const result of config.results || []) results.push(await detectAxis(result));
console.log(JSON.stringify({ lesson, standard: audit.standard, results }, null, 2));
