#!/usr/bin/env node
const fs = require("node:fs");
const path = require("node:path");

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    return require("/Users/yubyeongju/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
  }
}

const sharp = loadSharp();

const ROOT = path.resolve(__dirname, "..");
const LESSON = "3-2-3-2-mathmon-compass-ring";
const SCREENSHOTS = path.join(ROOT, LESSON, "screenshots");
const STATES = [
  ["faint", "흐린 원", "0점 · 정답 0개"],
  ["small", "작은 마법진", "15점 · 정답 2개"],
  ["ring", "마법진", "35점 · 정답 4개"],
  ["big", "큰 마법진", "55점 · 정답 6개"],
  ["grand", "대마법진", "78점 · 정답 8개"],
  ["legend", "전설 마법진", "특별 사건 · 100점"],
];
const VIEWPORTS = [
  ["desktop", "result-all-tiers-desktop-contact-sheet.png"],
  ["tablet-landscape", "result-all-tiers-tablet-landscape-contact-sheet.png"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buildSheet(viewport, outputName) {
  const tileWidth = 520;
  const tileHeight = 390;
  const labelHeight = 64;
  const rowHeight = tileHeight + labelHeight;
  const composites = [];

  for (const [index, [id, name, threshold]] of STATES.entries()) {
    const filename = `engine-flow-${viewport}-08a-result-${id}.png`;
    const source = path.join(SCREENSHOTS, filename);
    if (!fs.existsSync(source)) throw new Error(`missing result screenshot: ${filename}`);
    const left = (index % 3) * tileWidth;
    const top = Math.floor(index / 3) * rowHeight;
    const image = await sharp(source)
      .resize(tileWidth, tileHeight, {
        fit: "contain",
        background: { r: 10, g: 8, b: 22, alpha: 1 },
      })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#100b25"/>
        <text x="18" y="27" fill="#ffd76a" font-size="21" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(name)}</text>
        <text x="18" y="50" fill="#d8ccff" font-size="14" font-weight="650"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(threshold)} · ${escapeXml(id)}</text>
      </svg>
    `);
    composites.push({ input: image, left, top });
    composites.push({ input: label, left, top: top + tileHeight });
  }

  await sharp({
    create: {
      width: tileWidth * 3,
      height: rowHeight * 2,
      channels: 4,
      background: { r: 10, g: 8, b: 22, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(SCREENSHOTS, outputName));
}

Promise.all(VIEWPORTS.map(([viewport, output]) => buildSheet(viewport, output)))
  .then(() => console.log("UNIT3_COMPASS_RESULT_BROWSER_SHEETS: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
