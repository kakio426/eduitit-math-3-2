#!/usr/bin/env node
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const ROOT = process.cwd();
const lessonFolder = process.argv[2];
const sourceTag = process.argv[3] || "v4";

if (!lessonFolder) {
  console.error("Usage: node scripts/build-result-tier-assets.mjs <lesson-folder> [source-tag]");
  process.exit(1);
}

const lessonDir = path.join(ROOT, lessonFolder);
const configPath = path.join(ROOT, "_lessons", lessonFolder, "lesson.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const results = config.results || [];
if (!results.length) throw new Error(`${lessonFolder}: results are missing`);
const stateSet = config.result?.stateImageSet || {};
const sourceRoot = stateSet.sourceSetPath
  ? path.resolve(ROOT, stateSet.sourceSetPath)
  : lessonDir;
const runtimePngRoot = stateSet.runtimePngPath
  ? path.resolve(ROOT, stateSet.runtimePngPath)
  : lessonDir;
const configuredContactSheet = stateSet.contactSheet || `result-tiers-${sourceTag}-contact-sheet.png`;
const contactSheetPath = configuredContactSheet.startsWith("_shared/")
  ? path.resolve(ROOT, configuredContactSheet)
  : path.resolve(lessonDir, configuredContactSheet);
await Promise.all([
  mkdir(sourceRoot, { recursive: true }),
  mkdir(runtimePngRoot, { recursive: true }),
  mkdir(path.dirname(contactSheetPath), { recursive: true }),
]);

const width = 1280;
const height = 800;
const cellWidth = 640;
const imageHeight = 400;
const labelHeight = 56;
const columns = 2;
const rows = Math.ceil(results.length / columns);
const composites = [];

const xml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

for (const [index, result] of results.entries()) {
  const runtimeName = result.image;
  if (!runtimeName?.endsWith("-generated.webp")) {
    throw new Error(`${lessonFolder}: invalid result image for ${result.id}`);
  }
  const stem = runtimeName.replace(/-generated\.webp$/, "");
  const source = path.join(sourceRoot, `${stem}-${sourceTag}-source.png`);
  const runtimePng = path.join(runtimePngRoot, `${stem}-generated.png`);
  const runtimeWebp = path.join(lessonDir, runtimeName);
  const normalized = await sharp(source)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();

  await Promise.all([
    sharp(normalized).toFile(runtimePng),
    sharp(normalized).webp({ quality: 88, alphaQuality: 100 }).toFile(runtimeWebp),
  ]);

  const preview = await sharp(normalized)
    .resize(cellWidth, imageHeight, { fit: "fill" })
    .png()
    .toBuffer();
  const label = Buffer.from(`
    <svg width="${cellWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#142335"/>
      <text x="20" y="35" fill="#fff8e8" font-family="Apple SD Gothic Neo, Noto Sans KR, sans-serif"
        font-size="20" font-weight="700">${xml(runtimeName)}  •  ${xml(result.name)}  •  1280×800</text>
    </svg>`);
  const left = (index % columns) * cellWidth;
  const top = Math.floor(index / columns) * (imageHeight + labelHeight);
  composites.push({ input: preview, left, top });
  composites.push({ input: label, left, top: top + imageHeight });
}

await sharp({
  create: {
    width: columns * cellWidth,
    height: rows * (imageHeight + labelHeight),
    channels: 4,
    background: "#142335",
  },
})
  .composite(composites)
  .png()
  .toFile(contactSheetPath);

const contractPath = stateSet.contract
  ? path.resolve(ROOT, stateSet.contract)
  : path.join(lessonDir, `result-layout-${sourceTag}.json`);
await mkdir(path.dirname(contractPath), { recursive: true });
await writeFile(
  contractPath,
  `${JSON.stringify({
    id: `${config.id}-result-fullscene-v1`,
    standard: stateSet.standard || `result-tier-fullscene-native-${sourceTag}`,
    usedBy: [config.id],
    canvas: `${width}x${height}`,
    runtimeSlot: stateSet.runtimeSlot || "result-stage-fullscene",
    sceneCount: results.length,
    states: results.map((result, visualRank) => ({ id: result.id, name: result.name, visualRank, image: result.image })),
    contactSheet: path.relative(path.dirname(contractPath), contactSheetPath),
    sourceSetPath: stateSet.sourceSetPath || path.relative(ROOT, sourceRoot),
    runtimePngPath: stateSet.runtimePngPath || path.relative(ROOT, runtimePngRoot),
    sourceTag,
    nativeScenePerState: stateSet.nativeScenePerState === true,
    fixedGeneratedElements: stateSet.fixedGeneratedElements || [],
    forbiddenRuntimeTechniques: ["effect overlay", "mix-blend-mode", "tier CSS filter", "result crop reuse for play progress"],
  }, null, 2)}\n`,
);

console.log(`RESULT_TIER_ASSETS: PASS ${lessonFolder} (${results.length} states, ${sourceTag}, ${path.relative(ROOT, contactSheetPath)})`);
