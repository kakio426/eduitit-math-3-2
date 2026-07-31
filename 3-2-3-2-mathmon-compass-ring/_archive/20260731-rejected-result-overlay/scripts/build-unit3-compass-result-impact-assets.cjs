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
const root = process.cwd();
const setRoot = path.join(
  root,
  "_shared",
  "mathmon",
  "diversity-reward-pack",
  "lesson-scenes",
  "3-2-3-2",
  "result-tier-impact-v1",
);
const lessonRoot = path.join(root, "3-2-3-2-mathmon-compass-ring");
const sourceRoot = path.join(setRoot, "source");
const pngRoot = path.join(setRoot, "runtime-png");
const webpRoot = path.join(setRoot, "runtime-webp");
const contactRoot = path.join(setRoot, "contact-sheets");

const states = [
  { id: "faint", name: "흐린 원", rank: 0 },
  { id: "small", name: "작은 마법진", rank: 1 },
  { id: "ring", name: "마법진", rank: 2 },
  { id: "big", name: "큰 마법진", rank: 3 },
  { id: "grand", name: "대마법진", rank: 4 },
  { id: "legend", name: "전설 마법진", rank: 5 },
];

for (const directory of [pngRoot, webpRoot, contactRoot]) {
  fs.mkdirSync(directory, { recursive: true });
}

const xmlEscape = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

async function build() {
  for (const state of states) {
    const source = path.join(sourceRoot, `result-impact-${state.id}-source.png`);
    const png = path.join(pngRoot, `result-impact-${state.id}-generated.png`);
    const webp = path.join(webpRoot, `result-impact-${state.id}-generated.webp`);
    const lessonWebp = path.join(lessonRoot, `result-impact-${state.id}-generated.webp`);
    if (!fs.existsSync(source)) throw new Error(`Missing source: ${source}`);

    await sharp(source)
      .resize(1024, 1024, { fit: "fill" })
      .png({ compressionLevel: 9 })
      .toFile(png);
    await sharp(source)
      .resize(1024, 1024, { fit: "fill" })
      .webp({ quality: 86 })
      .toFile(webp);
    fs.copyFileSync(webp, lessonWebp);
  }

  const cellWidth = 420;
  const imageHeight = 360;
  const labelHeight = 74;
  const gap = 18;
  const margin = 24;
  const sheetWidth = margin * 2 + cellWidth * 3 + gap * 2;
  const sheetHeight = margin * 2 + (imageHeight + labelHeight) * 2 + gap;
  const composites = [];

  for (let index = 0; index < states.length; index += 1) {
    const state = states[index];
    const column = index % 3;
    const row = Math.floor(index / 3);
    const left = margin + column * (cellWidth + gap);
    const top = margin + row * (imageHeight + labelHeight + gap);
    const input = path.join(pngRoot, `result-impact-${state.id}-generated.png`);
    const image = await sharp(input)
      .resize(cellWidth, imageHeight, { fit: "contain", background: "#000000" })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${cellWidth}" height="${labelHeight}" fill="#16112b"/>
        <text x="18" y="31" fill="#ffe07b" font-family="Arial, sans-serif" font-size="20" font-weight="700">${xmlEscape(state.name)}</text>
        <text x="18" y="57" fill="#d6c9f5" font-family="Arial, sans-serif" font-size="15">rank ${state.rank} · 1024×1024 · screen blend</text>
      </svg>
    `);
    composites.push({ input: image, left, top });
    composites.push({ input: label, left, top: top + imageHeight });
  }

  const contactSheet = path.join(contactRoot, "result-tier-impact-v1-contact-sheet.png");
  await sharp({
    create: {
      width: sheetWidth,
      height: sheetHeight,
      channels: 4,
      background: "#090713",
    },
  }).composite(composites).png().toFile(contactSheet);

  console.log("BUILD_UNIT3_COMPASS_RESULT_IMPACT_ASSETS: PASS");
  console.log(contactSheet);
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
