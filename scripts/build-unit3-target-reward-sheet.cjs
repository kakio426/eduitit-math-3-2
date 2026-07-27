#!/usr/bin/env node
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "3-2-3-1-mathmon-target-hit");
const STATES = [
  ["closed", "닫힌 표적", "reward-event-closed-generated.webp"],
  ["normal", "점수 증가", "reward-event-normal-generated.webp"],
  ["loss", "작은 손해", "reward-event-loss-generated.webp"],
  ["mega", "큰 증가", "reward-event-mega-generated.webp"],
  ["bullseye", "정중앙", "reward-event-bullseye-generated.webp"],
  ["empty", "점수 그대로", "reward-event-empty-generated.webp"],
  ["rainbow", "무지개 명중", "reward-event-rainbow-generated.webp"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buildContactSheet() {
  const tile = 256;
  const labelHeight = 68;
  const rowHeight = tile + labelHeight;
  const composites = [];

  for (const [index, [state, name, filename]] of STATES.entries()) {
    const left = (index % 4) * tile;
    const top = Math.floor(index / 4) * rowHeight;
    const image = await sharp(path.join(TARGET, filename))
      .resize(tile, tile, { fit: "cover" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tile}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#0b2737"/>
        <text x="14" y="24" fill="#ffdc73" font-size="17" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(name)}</text>
        <text x="14" y="44" fill="#b9e9e5" font-size="10"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(state)} · 512×512</text>
        <text x="14" y="59" fill="#7daeb4" font-size="8"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(filename)}</text>
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
      background: { r: 11, g: 39, b: 55, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(TARGET, "reward-events-v3-contact-sheet.png"));
}

buildContactSheet()
  .then(() => console.log("UNIT3_TARGET_REWARD_CONTACT_SHEET: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
