#!/usr/bin/env node
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "3-2-2-3-mathmon-star-pickup");
const EVENTS = [
  ["meteor", "reward-event-meteor-generated.webp"],
  ["cloud", "reward-event-cloud-generated.webp"],
  ["bigMeteor", "reward-event-big-meteor-generated.webp"],
  ["shooting", "reward-event-shooting-generated.webp"],
  ["dark", "reward-event-dark-generated.webp"],
  ["rainbow", "reward-event-rainbow-generated.webp"],
  ["protected", "reward-event-protected-generated.webp"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buildSprite() {
  const tile = 512;
  const composites = EVENTS.map(([, filename], index) => ({
    input: path.join(TARGET, filename),
    left: (index % 4) * tile,
    top: Math.floor(index / 4) * tile,
  }));
  await sharp({
    create: {
      width: tile * 4,
      height: tile * 2,
      channels: 4,
      background: { r: 6, g: 16, b: 42, alpha: 1 },
    },
  })
    .composite(composites)
    .webp({ quality: 90 })
    .toFile(path.join(TARGET, "reward-events-sprite-generated.webp"));
}

async function buildContactSheet() {
  const tile = 256;
  const labelHeight = 68;
  const rowHeight = tile + labelHeight;
  const composites = [];

  for (const [index, [state, filename]] of EVENTS.entries()) {
    const left = (index % 4) * tile;
    const top = Math.floor(index / 4) * rowHeight;
    const image = await sharp(path.join(TARGET, filename))
      .resize(tile, tile, { fit: "cover" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tile}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#081226"/>
        <text x="14" y="25" fill="#ffe58a" font-size="18" font-weight="700"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(state)}</text>
        <text x="14" y="45" fill="#c7d4f2" font-size="8"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(filename)}</text>
        <text x="14" y="60" fill="#8fa6d5" font-size="9"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">512×512</text>
      </svg>
    `);
    composites.push({ input: image, left, top });
    composites.push({ input: label, left, top: top + tile });
  }

  await sharp({
    create: {
      width: tile * 4,
      height: rowHeight * 2,
      channels: 4,
      background: { r: 8, g: 18, b: 38, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(TARGET, "reward-events-contact-sheet.png"));
}

Promise.all([buildSprite(), buildContactSheet()])
  .then(() => console.log("STAR_PICKUP_REWARD_SHEETS: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
