#!/usr/bin/env node
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const lightMode = process.argv.includes("--light");
const inputs = process.argv.slice(2).filter((value) => value !== "--light");
const lightThreshold = {
  redMin: Number(process.env.RESULT_BOARD_RED_MIN ?? 220),
  greenMin: Number(process.env.RESULT_BOARD_GREEN_MIN ?? 205),
  blueMin: Number(process.env.RESULT_BOARD_BLUE_MIN ?? 160),
  channelSpreadMax: Number(process.env.RESULT_BOARD_SPREAD_MAX ?? 86),
};
if (!inputs.length) {
  console.error("Usage: node scripts/detect-result-board.mjs <result-images...>");
  process.exit(1);
}

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

for (const input of inputs) {
  const { data, info } = await sharp(input).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const runs = [];
  for (let y = Math.floor(info.height * 0.08); y < Math.floor(info.height * 0.88); y += 1) {
    let best = null;
    let start = -1;
    for (let x = Math.floor(info.width * (lightMode ? 0.01 : 0.22)); x <= info.width; x += 1) {
      let boardPixel = false;
      if (x < info.width) {
        const offset = (y * info.width + x) * info.channels;
        const r = data[offset];
        const g = data[offset + 1];
        const b = data[offset + 2];
        boardPixel = lightMode
          ? r > lightThreshold.redMin && g > lightThreshold.greenMin && b > lightThreshold.blueMin
              && Math.max(r, g, b) - Math.min(r, g, b) < lightThreshold.channelSpreadMax
          : r < 42 && g < 82 && b < 96 && b >= r && g >= r * 0.72;
      }
      if (boardPixel && start < 0) start = x;
      if ((!boardPixel || x === info.width) && start >= 0) {
        const end = x - 1;
        const length = end - start + 1;
        if (!best || length > best.length) best = { y, start, end, length, center: (start + end) / 2 };
        start = -1;
      }
    }
    if (best && best.length >= info.width * 0.18) runs.push(best);
  }

  const groups = [];
  for (const run of runs) {
    const previous = groups.at(-1);
    if (!previous || run.y !== previous.at(-1).y + 1 || Math.abs(run.center - median(previous.map((item) => item.center))) > info.width * 0.05) {
      groups.push([run]);
    } else {
      previous.push(run);
    }
  }
  const group = groups.sort((a, b) => (b.length * median(b.map((item) => item.length))) - (a.length * median(a.map((item) => item.length))))[0];
  if (!group?.length) throw new Error(`${input}: no dark-teal result board detected`);
  const stable = group.filter((run) => run.length >= median(group.map((item) => item.length)) * 0.9);
  const left = median(stable.map((item) => item.start));
  const right = median(stable.map((item) => item.end));
  const top = group[0].y;
  const bottom = group.at(-1).y;
  console.log(JSON.stringify({
    file: path.basename(input),
    canvas: `${info.width}x${info.height}`,
    interior: { left, top, right, bottom, width: right - left + 1, height: bottom - top + 1 },
    axisX: (left + right) / 2,
    rows: group.length,
  }));
}
