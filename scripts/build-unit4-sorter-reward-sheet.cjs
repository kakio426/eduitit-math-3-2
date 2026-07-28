#!/usr/bin/env node

const path = require("node:path");
const sharp = require("sharp");

const ROOT = path.resolve(__dirname, "..");
const TARGET = path.join(ROOT, "3-2-4-3-mathmon-fraction-sorter");
const STATES = [
  ["closed", "닫힌 상자"],
  ["normal", "빛 증가"],
  ["loss", "빛 감소"],
  ["mega", "빠른 분류"],
  ["perfect", "완벽 분류"],
  ["empty", "이번 변화 없음"],
  ["rainbow", "무지개 분류"],
];

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function build() {
  const megaSource = path.join(TARGET, "reward-event-mega-v3-source.png");
  const megaPng = path.join(TARGET, "reward-event-mega-generated.png");
  const megaWebp = path.join(TARGET, "reward-event-mega-generated.webp");
  const mega = sharp(megaSource).resize(512, 512, { fit: "cover" });
  await mega.clone().png().toFile(megaPng);
  await mega.clone().webp({ quality: 88 }).toFile(megaWebp);
  const { data: megaPixels, info: megaInfo } = await sharp(megaPng).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let whiteEdgePixels = 0;
  const auditedRows = 20;
  for (let y = 0; y < auditedRows; y += 1) {
    for (let x = 0; x < megaInfo.width; x += 1) {
      const offset = (y * megaInfo.width + x) * megaInfo.channels;
      if (megaPixels[offset] > 245 && megaPixels[offset + 1] > 245 && megaPixels[offset + 2] > 245) whiteEdgePixels += 1;
    }
  }
  const whiteEdgeRatio = whiteEdgePixels / (megaInfo.width * auditedRows);
  if (whiteEdgeRatio > 0.02) {
    throw new Error(`mega reward has a white top-edge defect (${(whiteEdgeRatio * 100).toFixed(2)}%)`);
  }

  const tile = 256;
  const labelHeight = 68;
  const rowHeight = tile + labelHeight;
  const composites = [];
  for (const [index, [state, name]] of STATES.entries()) {
    const filename = `reward-event-${state}-generated.png`;
    const left = (index % 4) * tile;
    const top = Math.floor(index / 4) * rowHeight;
    const image = await sharp(path.join(TARGET, filename))
      .resize(tile, tile, { fit: "cover" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tile}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#142335"/>
        <text x="14" y="24" fill="#ffdc73" font-size="17" font-weight="800"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(name)}</text>
        <text x="14" y="44" fill="#d9e6f2" font-size="10"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(state)} · 512×512</text>
        <text x="14" y="59" fill="#8fa7bc" font-size="8"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(filename)}</text>
      </svg>`);
    composites.push({ input: image, left, top });
    composites.push({ input: label, left, top: top + tile });
  }

  await sharp({
    create: {
      width: tile * 4,
      height: rowHeight * 2,
      channels: 4,
      background: "#142335",
    },
  })
    .composite(composites)
    .png()
    .toFile(path.join(TARGET, "reward-events-v3-contact-sheet.png"));
  console.log("UNIT4_SORTER_REWARD_CONTACT_SHEET: PASS");
}

build().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
