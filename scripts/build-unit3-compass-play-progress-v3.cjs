#!/usr/bin/env node
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const LESSON = path.join(ROOT, "3-2-3-2-mathmon-compass-ring");
const SHARED = path.join(
  ROOT,
  "_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3",
);
const SOURCE = path.join(SHARED, "source");
const RUNTIME_PNG = path.join(SHARED, "runtime-png");
const CONTACT_SHEETS = path.join(SHARED, "contact-sheets");
const WIDTH = 418;
const HEIGHT = 627;
const STATES = [
  ["faint", "흐린 원"],
  ["small", "작은 마법진"],
  ["ring", "마법진"],
  ["big", "큰 마법진"],
  ["grand", "대마법진"],
  ["legend", "전설 마법진"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buildRuntimeAssets() {
  const tileWidth = 279;
  const tileHeight = 418;
  const labelHeight = 58;
  const rowHeight = tileHeight + labelHeight;
  const composites = [];

  for (const [index, [id, name]] of STATES.entries()) {
    const source = path.join(SOURCE, `${id}-source.png`);
    const runtimePng = path.join(RUNTIME_PNG, `play-progress-v3-${id}-generated.png`);
    const runtimeWebp = path.join(LESSON, `play-progress-v3-${id}-generated.webp`);
    const pngBuffer = await sharp(source)
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "centre" })
      .png()
      .toBuffer();

    await sharp(pngBuffer).toFile(runtimePng);
    await sharp(pngBuffer).webp({ quality: 86, alphaQuality: 100 }).toFile(runtimeWebp);

    const preview = await sharp(pngBuffer)
      .resize(tileWidth, tileHeight, { fit: "contain", background: "#07111f" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0d0919"/>
        <text x="10" y="23" fill="#fff2c2" font-size="16" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${index + 1}. ${escapeXml(name)}</text>
        <text x="10" y="42" fill="#cbbde8" font-size="10"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(id)} · ${WIDTH}×${HEIGHT}</text>
        <text x="10" y="54" fill="#887ca4" font-size="8"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">play-progress-v3-${escapeXml(id)}-generated.webp</text>
      </svg>
    `);
    const left = (index % 3) * tileWidth;
    const top = Math.floor(index / 3) * rowHeight;
    composites.push({ input: preview, left, top });
    composites.push({ input: label, left, top: top + tileHeight });
  }

  await sharp({
    create: {
      width: tileWidth * 3,
      height: rowHeight * 2,
      channels: 4,
      background: { r: 13, g: 9, b: 25, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(CONTACT_SHEETS, "play-progress-v3-contact-sheet.png"));
}

buildRuntimeAssets()
  .then(() => console.log("UNIT3_COMPASS_PLAY_PROGRESS_V3: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
