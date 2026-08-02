#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const root = process.cwd();
const lessonFolder = process.argv[2];

if (!lessonFolder) {
  console.error("Usage: node scripts/build-result-browser-sheets.mjs <lesson-folder>");
  process.exit(1);
}

const configPath = path.join(root, "_lessons", lessonFolder, "lesson.json");
const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const states = config.results || [];
if (!states.length) throw new Error(`${lessonFolder}: result states are missing`);

const screenshotDir = path.join(root, lessonFolder, "screenshots");
const viewports = ["desktop", "tablet-landscape"];
const columns = 3;
const tileWidth = 520;
const previewHeight = 325;
const labelHeight = 64;
const tileHeight = previewHeight + labelHeight;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function thresholdLabel(state) {
  if (state.needsSpecial) return "특별 사건 · 100";
  return `힘 ${state.minPower ?? 0} · 정답 ${state.minCorrect ?? 0}개`;
}

for (const viewport of viewports) {
  const rows = Math.ceil(states.length / columns);
  const composites = [];
  for (const [index, state] of states.entries()) {
    const filename = `engine-flow-${viewport}-08a-result-${state.id}.png`;
    const source = path.join(screenshotDir, filename);
    if (!fs.existsSync(source)) throw new Error(`${lessonFolder}: missing ${filename}`);
    const left = (index % columns) * tileWidth;
    const top = Math.floor(index / columns) * tileHeight;
    const preview = await sharp(source)
      .resize(tileWidth, previewHeight, { fit: "contain", background: "#090d1b" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#15102a"/>
        <text x="18" y="27" fill="#ffd76a" font-size="21" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(state.name || state.id)}</text>
        <text x="18" y="50" fill="#d8ccff" font-size="14" font-weight="650"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(thresholdLabel(state))} · ${escapeXml(state.id)}</text>
      </svg>
    `);
    composites.push({ input: preview, left, top });
    composites.push({ input: label, left, top: top + previewHeight });
  }

  const output = path.join(screenshotDir, `result-all-tiers-${viewport}-contact-sheet.png`);
  await sharp({
    create: {
      width: columns * tileWidth,
      height: rows * tileHeight,
      channels: 4,
      background: "#090d1b",
    },
  }).composite(composites).png().toFile(output);
  console.log(`RESULT_BROWSER_SHEET: ${path.relative(root, output)}`);
}
