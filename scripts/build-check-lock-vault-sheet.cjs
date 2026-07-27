#!/usr/bin/env node
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "3-2-2-4-mathmon-check-lock");
const STATES = [
  ["lock", "작은 자물쇠", "play-vault-lock-generated.webp"],
  ["safe", "튼튼한 금고", "play-vault-safe-generated.webp"],
  ["largeSafe", "커다란 금고", "play-vault-large-safe-generated.webp"],
  ["secretSafe", "비밀 금고", "play-vault-secret-safe-generated.webp"],
  ["treasure", "보물 금고", "play-vault-treasure-generated.webp"],
  ["rainbow", "무지개 금고", "play-vault-rainbow-generated.webp"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function buildContactSheet() {
  const tileWidth = 200;
  const tileHeight = 437;
  const labelHeight = 60;
  const rowHeight = tileHeight + labelHeight;
  const composites = [];

  for (const [index, [id, name, filename]] of STATES.entries()) {
    const left = (index % 3) * tileWidth;
    const top = Math.floor(index / 3) * rowHeight;
    const image = await sharp(path.join(TARGET, filename))
      .resize(tileWidth, tileHeight, { fit: "cover" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#07131f"/>
        <text x="10" y="22" fill="#ffe7a0" font-size="16" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(name)}</text>
        <text x="10" y="40" fill="#9bb3bc" font-size="10"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(id)} · 600×1312</text>
        <text x="10" y="54" fill="#6f8992" font-size="7"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(filename)}</text>
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
      background: { r: 7, g: 19, b: 31, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(TARGET, "play-vault-world-contact-sheet.png"));
}

buildContactSheet()
  .then(() => console.log("CHECK_LOCK_VAULT_CONTACT_SHEET: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
