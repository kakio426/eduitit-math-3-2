#!/usr/bin/env node

const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const sharp = require("sharp");

const ROOT = process.cwd();
const REMOVE_CHROMA = path.join(
  process.env.CODEX_HOME || path.join(os.homedir(), ".codex"),
  "skills/.system/imagegen/scripts/remove_chroma_key.py",
);

const SETS = [
  {
    folder: "3-2-4-1-mathmon-pizza-fraction",
    axisX: 840,
    states: [
      ["slice", "한 조각"],
      ["half", "반 판"],
      ["whole", "한 판"],
      ["jumbo", "특대 피자"],
      ["shopstar", "가게 대박"],
      ["legend", "전설 피자"],
    ],
  },
  {
    folder: "3-2-4-2-mathmon-fraction-scoop",
    axisX: 900,
    states: [
      ["handful", "한 줌"],
      ["smallbasket", "작은 바구니"],
      ["basket", "바구니"],
      ["bigbasket", "큰 바구니"],
      ["cartfull", "수레 가득"],
      ["rainbow", "전설 바구니"],
    ],
  },
  {
    folder: "3-2-4-3-mathmon-fraction-sorter",
    axisX: 805,
    states: [
      ["first", "첫 분류"],
      ["row", "한 줄 완성"],
      ["line", "두 줄 완성"],
      ["bigline", "분류 달인"],
      ["manager", "공장장"],
      ["rainbow", "전설의 분류"],
    ],
  },
  {
    folder: "3-2-4-4-mathmon-fraction-tug",
    axisX: 765,
    states: [
      ["draw", "무승부"],
      ["smallwin", "아슬아슬 승리"],
      ["win", "승리"],
      ["bigwin", "큰 승리"],
      ["champion", "챔피언"],
      ["rainbow", "전설의 승리"],
    ],
  },
];

const OUTPUT_WIDTH = 1280;
const OUTPUT_HEIGHT = 800;
const TITLE_WIDTH = 900;
const TITLE_HEIGHT = 190;
const CONTACT_CELL_WIDTH = 640;
const CONTACT_IMAGE_HEIGHT = 400;
const CONTACT_META_HEIGHT = 56;
const TITLE_CONTACT_HEIGHT = 160;

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll('"', "&quot;");
}

function cellRect(meta, index) {
  const col = index % 2;
  const row = Math.floor(index / 2);
  const left = Math.round((col * meta.width) / 2);
  const right = Math.round(((col + 1) * meta.width) / 2);
  const top = Math.round((row * meta.height) / 3);
  const bottom = Math.round(((row + 1) * meta.height) / 3);
  return { col, row, left, top, width: right - left, height: bottom - top };
}

function metadataStrip(filename, stateName, canvas = "1280×800") {
  const label = `${filename}  •  ${stateName}  •  ${canvas}`;
  return Buffer.from(`
    <svg width="${CONTACT_CELL_WIDTH}" height="${CONTACT_META_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#142335"/>
      <text x="20" y="35" fill="#fff8e8" font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif"
        font-size="20" font-weight="700">${escapeXml(label)}</text>
    </svg>`);
}

function checkerboard(width, height) {
  const size = 16;
  let rects = "";
  for (let y = 0; y < height; y += size) {
    for (let x = 0; x < width; x += size) {
      const fill = ((x / size) + (y / size)) % 2 ? "#d7dde3" : "#f4f6f8";
      rects += `<rect x="${x}" y="${y}" width="${size}" height="${size}" fill="${fill}"/>`;
    }
  }
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">${rects}</svg>`);
}

async function removeSmallAlphaIslands(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const pixelCount = info.width * info.height;
  const labels = new Int32Array(pixelCount);
  const queue = new Int32Array(pixelCount);
  const areas = [0];
  let label = 0;
  for (let index = 0; index < pixelCount; index += 1) {
    if (labels[index] || data[index * 4 + 3] < 24) continue;
    label += 1;
    let head = 0;
    let tail = 1;
    let area = 0;
    queue[0] = index;
    labels[index] = label;
    while (head < tail) {
      const current = queue[head++];
      const x = current % info.width;
      const y = Math.floor(current / info.width);
      area += 1;
      for (const next of [current - 1, current + 1, current - info.width, current + info.width]) {
        if (next < 0 || next >= pixelCount || labels[next] || data[next * 4 + 3] < 24) continue;
        const nextX = next % info.width;
        const nextY = Math.floor(next / info.width);
        if (Math.abs(nextX - x) + Math.abs(nextY - y) !== 1) continue;
        labels[next] = label;
        queue[tail++] = next;
      }
    }
    areas[label] = area;
  }
  const largest = Math.max(...areas);
  const minimumArea = largest * 0.04;
  for (let index = 0; index < pixelCount; index += 1) {
    const component = labels[index];
    if (!component || areas[component] >= minimumArea) continue;
    const offset = index * 4;
    data[offset] = 0;
    data[offset + 1] = 0;
    data[offset + 2] = 0;
    data[offset + 3] = 0;
  }
  await sharp(data, { raw: info }).png().toFile(file);
}

async function buildTitle(folder, titleSource, titleMeta, state, index) {
  const [id] = state;
  const rect = cellRect(titleMeta, index);
  const chromaCell = path.join(folder, `result-title-${id}-chromakey.png`);
  const transparentCell = path.join(folder, `result-title-${id}-transparent.png`);
  const runtimePng = path.join(folder, `result-title-${id}-generated.png`);
  const runtimeWebp = path.join(folder, `result-title-${id}-generated.webp`);

  await sharp(titleSource).extract(rect).png().toFile(chromaCell);
  const remove = spawnSync("python3", [
    REMOVE_CHROMA,
    "--input", chromaCell,
    "--out", transparentCell,
    "--auto-key", "border",
    "--soft-matte",
    "--transparent-threshold", "12",
    "--opaque-threshold", "220",
    "--despill",
  ], { encoding: "utf8" });
  if (remove.status !== 0) {
    throw new Error(`chroma removal failed for ${chromaCell}\n${remove.stderr || remove.stdout}`);
  }
  await removeSmallAlphaIslands(transparentCell);

  const trimmed = await sharp(transparentCell).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const fitted = await sharp(trimmed)
    .resize(TITLE_WIDTH - 40, TITLE_HEIGHT - 24, { fit: "inside", withoutEnlargement: false })
    .png()
    .toBuffer();
  const fittedMeta = await sharp(fitted).metadata();
  await sharp({
    create: {
      width: TITLE_WIDTH,
      height: TITLE_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{
      input: fitted,
      left: Math.round((TITLE_WIDTH - fittedMeta.width) / 2),
      top: Math.round((TITLE_HEIGHT - fittedMeta.height) / 2),
    }])
    .png()
    .toFile(runtimePng);
  await sharp(runtimePng).webp({ quality: 88, alphaQuality: 100 }).toFile(runtimeWebp);

  await fs.rm(chromaCell);
  await fs.rm(transparentCell);
  return { runtimePng, runtimeWebp };
}

async function buildSet(set) {
  const folder = path.join(ROOT, set.folder);
  const sceneSource = path.join(folder, "result-tiers-v3-source.png");
  const titleSource = path.join(folder, "result-titles-v3-chromakey.png");
  const sceneMeta = await sharp(sceneSource).metadata();
  const titleMeta = await sharp(titleSource).metadata();
  if (!sceneMeta.width || !sceneMeta.height || !titleMeta.width || !titleMeta.height) {
    throw new Error(`invalid result source sheet in ${folder}`);
  }

  const sceneContact = [];
  const titleContact = [];
  const titleChecker = await checkerboard(CONTACT_CELL_WIDTH, TITLE_CONTACT_HEIGHT);

  for (let index = 0; index < set.states.length; index += 1) {
    const [id, name] = set.states[index];
    const rect = cellRect(sceneMeta, index);
    const runtimePng = path.join(folder, `result-${id}-generated.png`);
    const runtimeWebp = path.join(folder, `result-${id}-generated.webp`);
    const title = await buildTitle(folder, titleSource, titleMeta, set.states[index], index);

    const tile = sharp(sceneSource)
      .extract(rect)
      .resize(OUTPUT_WIDTH, OUTPUT_HEIGHT, { fit: "fill" });
    await tile.clone().png().toFile(runtimePng);
    await tile.clone().webp({ quality: 86 }).toFile(runtimeWebp);

    const preview = await sharp(runtimePng)
      .resize(CONTACT_CELL_WIDTH, CONTACT_IMAGE_HEIGHT, { fit: "fill" })
      .png()
      .toBuffer();
    const metadata = metadataStrip(path.basename(runtimeWebp), name);
    sceneContact.push(
      { input: preview, left: rect.col * CONTACT_CELL_WIDTH, top: rect.row * (CONTACT_IMAGE_HEIGHT + CONTACT_META_HEIGHT) },
      { input: metadata, left: rect.col * CONTACT_CELL_WIDTH, top: rect.row * (CONTACT_IMAGE_HEIGHT + CONTACT_META_HEIGHT) + CONTACT_IMAGE_HEIGHT },
    );

    const titlePreview = await sharp(title.runtimePng)
      .resize(CONTACT_CELL_WIDTH - 32, TITLE_CONTACT_HEIGHT - 24, { fit: "inside" })
      .png()
      .toBuffer();
    const titlePreviewMeta = await sharp(titlePreview).metadata();
    titleContact.push(
      { input: titleChecker, left: rect.col * CONTACT_CELL_WIDTH, top: rect.row * (TITLE_CONTACT_HEIGHT + CONTACT_META_HEIGHT) },
      {
        input: titlePreview,
        left: rect.col * CONTACT_CELL_WIDTH + Math.round((CONTACT_CELL_WIDTH - titlePreviewMeta.width) / 2),
        top: rect.row * (TITLE_CONTACT_HEIGHT + CONTACT_META_HEIGHT) + Math.round((TITLE_CONTACT_HEIGHT - titlePreviewMeta.height) / 2),
      },
      {
        input: metadataStrip(path.basename(title.runtimeWebp), name, `${TITLE_WIDTH}×${TITLE_HEIGHT}`),
        left: rect.col * CONTACT_CELL_WIDTH,
        top: rect.row * (TITLE_CONTACT_HEIGHT + CONTACT_META_HEIGHT) + TITLE_CONTACT_HEIGHT,
      },
    );
  }

  await sharp({
    create: {
      width: CONTACT_CELL_WIDTH * 2,
      height: (CONTACT_IMAGE_HEIGHT + CONTACT_META_HEIGHT) * 3,
      channels: 4,
      background: "#142335",
    },
  }).composite(sceneContact).png().toFile(path.join(folder, "result-tiers-v3-contact-sheet.png"));

  await sharp({
    create: {
      width: CONTACT_CELL_WIDTH * 2,
      height: (TITLE_CONTACT_HEIGHT + CONTACT_META_HEIGHT) * 3,
      channels: 4,
      background: "#142335",
    },
  }).composite(titleContact).png().toFile(path.join(folder, "result-titles-v3-contact-sheet.png"));

  await fs.writeFile(
    path.join(folder, "result-layout-v3.json"),
    `${JSON.stringify({
      version: "unit4-result-cohesion-v3",
      canvas: `${OUTPUT_WIDTH}x${OUTPUT_HEIGHT}`,
      sceneCount: set.states.length,
      titleCount: set.states.length,
      sceneContactSheet: "result-tiers-v3-contact-sheet.png",
      titleContactSheet: "result-titles-v3-contact-sheet.png",
      axisX: set.axisX,
      axisTolerance: "1.5% stage width",
      layers: ["blank generated scene", "generated transparent title", "dynamic score and goal", "generated retry button"],
    }, null, 2)}\n`,
  );
  return { folder: set.folder, axisX: set.axisX, states: set.states.length };
}

async function main() {
  const results = [];
  for (const set of SETS) results.push(await buildSet(set));
  console.log(JSON.stringify(results, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
