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
const PLACEMENT = { centerX: 0.3, centerY: 0.66, footY: 0.88 };
const ANCHORS = Object.freeze(Object.fromEntries(STATES.map(([id]) => [
  id,
  { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
])));

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
  const anchorComposites = [];

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

    const anchor = ANCHORS[id];
    const overlay = Buffer.from(`
      <svg width="${tileWidth}" height="${tileHeight}" xmlns="http://www.w3.org/2000/svg">
        <line x1="${PLACEMENT.centerX * tileWidth}" y1="0" x2="${PLACEMENT.centerX * tileWidth}" y2="${tileHeight}" stroke="#63ff98" stroke-width="2" stroke-dasharray="7 5" opacity=".86"/>
        <line x1="0" y1="${PLACEMENT.footY * tileHeight}" x2="${tileWidth}" y2="${PLACEMENT.footY * tileHeight}" stroke="#63ff98" stroke-width="2" stroke-dasharray="7 5" opacity=".86"/>
        <line x1="${anchor.centerX * tileWidth}" y1="${(anchor.footY - anchor.height) * tileHeight}" x2="${anchor.centerX * tileWidth}" y2="${anchor.footY * tileHeight}" stroke="#4de5ff" stroke-width="3"/>
        <circle cx="${anchor.centerX * tileWidth}" cy="${anchor.centerY * tileHeight}" r="5" fill="#4de5ff" stroke="#07101d" stroke-width="2"/>
        <circle cx="${anchor.centerX * tileWidth}" cy="${anchor.footY * tileHeight}" r="5" fill="#ff75d8" stroke="#07101d" stroke-width="2"/>
      </svg>
    `);
    const anchorLabel = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#10192c"/>
        <text x="10" y="23" fill="#fff2c2" font-size="16" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${index + 1}. ${escapeXml(name)}</text>
        <text x="10" y="44" fill="#8ff5ff" font-size="11" font-weight="700"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">x ${anchor.centerX.toFixed(2)} · y ${anchor.centerY.toFixed(2)} · foot ${anchor.footY.toFixed(2)} · h ${anchor.height.toFixed(2)}</text>
      </svg>
    `);
    anchorComposites.push({ input: preview, left, top });
    anchorComposites.push({ input: overlay, left, top });
    anchorComposites.push({ input: anchorLabel, left, top: top + tileHeight });
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

  await sharp({
    create: {
      width: tileWidth * 3,
      height: rowHeight * 2,
      channels: 4,
      background: { r: 13, g: 9, b: 25, alpha: 1 },
    },
  })
    .composite(anchorComposites)
    .png()
    .toFile(path.join(CONTACT_SHEETS, "play-progress-v3-anchor-audit.png"));
}

buildRuntimeAssets()
  .then(() => console.log("UNIT3_COMPASS_PLAY_PROGRESS_V3: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
