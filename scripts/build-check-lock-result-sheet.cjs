#!/usr/bin/env node
const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "3-2-2-4-mathmon-check-lock");
const STATES = [
  ["lock", "작은 자물쇠", "result-lock-generated.png"],
  ["safe", "튼튼한 금고", "result-safe-generated.png"],
  ["largeSafe", "커다란 금고", "result-large-safe-generated.png"],
  ["secretSafe", "비밀 금고", "result-secret-safe-generated.png"],
  ["treasure", "보물 금고", "result-treasure-generated.png"],
  ["rainbow", "무지개 금고", "result-rainbow-generated.png"],
];

async function buildContactSheet() {
  const tileWidth = 640;
  const tileHeight = 400;
  const composites = [];

  for (const [index, [, , filename]] of STATES.entries()) {
    const image = await sharp(path.join(TARGET, filename))
      .resize(tileWidth, tileHeight, { fit: "fill" })
      .png()
      .toBuffer();
    composites.push({
      input: image,
      left: (index % 3) * tileWidth,
      top: Math.floor(index / 3) * tileHeight,
    });
  }

  await sharp({
    create: {
      width: tileWidth * 3,
      height: tileHeight * 2,
      channels: 4,
      background: { r: 7, g: 19, b: 31, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(TARGET, "result-tiers-v3-contact-sheet.png"));
}

buildContactSheet()
  .then(() => console.log("CHECK_LOCK_RESULT_CONTACT_SHEET: PASS"))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
