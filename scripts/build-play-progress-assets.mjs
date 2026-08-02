#!/usr/bin/env node
import { createRequire } from "node:module";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const require = createRequire(import.meta.url);
const sharp = require("sharp");
const ROOT = process.cwd();
const lessonFolder = process.argv[2];

if (!lessonFolder) {
  console.error("Usage: node scripts/build-play-progress-assets.mjs <lesson-folder>");
  process.exit(1);
}

const sourceLesson = path.join(ROOT, "_lessons", lessonFolder, "lesson.json");
const config = JSON.parse(await readFile(sourceLesson, "utf8"));
const set = config.workbench?.playStateImageSet;
if (!set || set.standard !== "generated-play-progress-v3-left-character") {
  throw new Error(`${lessonFolder}: workbench.playStateImageSet is missing`);
}

const [width, height] = String(set.canvas || "").split("x").map(Number);
if (width !== 768 || height !== 1536) {
  throw new Error(`${lessonFolder}: play progress canvas must be 768x1536`);
}
if (Number(set.count) !== config.results.length) {
  throw new Error(`${lessonFolder}: play progress count must match results`);
}

const sourceDir = path.resolve(ROOT, set.sourceSetPath);
const sharedRoot = path.dirname(sourceDir);
const runtimePngDir = path.join(sharedRoot, "runtime-png");
const contactDir = path.join(sharedRoot, "contact-sheets");
const lessonDir = path.join(ROOT, lessonFolder);
await Promise.all([
  mkdir(runtimePngDir, { recursive: true }),
  mkdir(contactDir, { recursive: true }),
  mkdir(lessonDir, { recursive: true }),
]);

const previews = [];
for (const [index, result] of config.results.entries()) {
  if (!result.playImage) throw new Error(`${lessonFolder}: ${result.id} has no playImage`);
  const stem = result.playImage.replace(/-generated\.webp$/, "");
  const source = path.join(sourceDir, `${stem}-source.png`);
  const runtimePng = path.join(runtimePngDir, `${stem}-generated.png`);
  const runtimeWebp = path.join(lessonDir, result.playImage);
  const normalized = await sharp(source)
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
  await Promise.all([
    sharp(normalized).toFile(runtimePng),
    sharp(normalized).webp({ quality: 86, alphaQuality: 100 }).toFile(runtimeWebp),
  ]);
  previews.push({ index, id: result.id, name: result.name, file: result.playImage, image: normalized });
}

const anchorContract = set.layoutContract?.subjectAnchors;
const placementContract = set.layoutContract?.mathmonPlacement;
if (!anchorContract || anchorContract.standard !== "source-pixel-anchor-v1" || !placementContract) {
  throw new Error(`${lessonFolder}: source-pixel-anchor-v1 contract is missing`);
}
const anchorTolerance = Number(placementContract.toleranceRatio);
const anchors = previews.map((item) => {
  const anchor = anchorContract[item.id];
  if (!anchor) throw new Error(`${lessonFolder}: missing subject anchor for ${item.id}`);
  for (const key of ["centerX", "centerY", "footY", "height"]) {
    if (!Number.isFinite(Number(anchor[key]))) throw new Error(`${lessonFolder}: invalid ${item.id}.${key}`);
  }
  if (Math.abs(anchor.centerX - placementContract.centerX) > anchorTolerance
    || Math.abs(anchor.centerY - placementContract.centerY) > anchorTolerance
    || Math.abs(anchor.footY - placementContract.footY) > anchorTolerance) {
    throw new Error(`${lessonFolder}: ${item.id} subject anchor exceeds placement tolerance`);
  }
  return { ...item, anchor };
});
const heights = anchors.map((item) => item.anchor.height);
const medianHeight = heights.slice().sort((a, b) => a - b)[Math.floor(heights.length / 2)];
if (anchors.some((item) => Math.abs(item.anchor.height - medianHeight) > anchorTolerance)) {
  throw new Error(`${lessonFolder}: subject scale exceeds tolerance`);
}

const columns = Math.min(3, previews.length);
const rows = Math.ceil(previews.length / columns);
const tileWidth = 256;
const previewHeight = 512;
const labelHeight = 64;
const composites = [];

const xml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

for (const item of previews) {
  const preview = await sharp(item.image)
    .resize(tileWidth, previewHeight, { fit: "contain", background: "#091025" })
    .png()
    .toBuffer();
  const label = Buffer.from(`
    <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#17102d"/>
      <text x="9" y="21" fill="#fff0b8" font-size="15" font-weight="800"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${item.index + 1}. ${xml(item.name)}</text>
      <text x="9" y="40" fill="#d8c8f6" font-size="11"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${xml(item.id)} · ${width}×${height}</text>
      <text x="9" y="56" fill="#8f82ad" font-size="8"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${xml(item.file)}</text>
    </svg>
  `);
  const left = (item.index % columns) * tileWidth;
  const top = Math.floor(item.index / columns) * (previewHeight + labelHeight);
  composites.push({ input: preview, left, top });
  composites.push({ input: label, left, top: top + previewHeight });
}

const contactName = path.basename(set.contactSheet);
await sharp({
  create: {
    width: columns * tileWidth,
    height: rows * (previewHeight + labelHeight),
    channels: 4,
    background: "#091025",
  },
})
  .composite(composites)
  .png()
  .toFile(path.join(contactDir, contactName));

const anchorComposites = [];
for (const item of anchors) {
  const preview = await sharp(item.image)
    .resize(tileWidth, previewHeight, { fit: "contain", background: "#091025" })
    .png()
    .toBuffer();
  const targetX = placementContract.centerX * tileWidth;
  const targetFootY = placementContract.footY * previewHeight;
  const actualX = item.anchor.centerX * tileWidth;
  const actualFootY = item.anchor.footY * previewHeight;
  const actualTopY = (item.anchor.footY - item.anchor.height) * previewHeight;
  const overlay = Buffer.from(`
    <svg width="${tileWidth}" height="${previewHeight}" xmlns="http://www.w3.org/2000/svg">
      <line x1="${targetX}" y1="0" x2="${targetX}" y2="${previewHeight}" stroke="#63ff98" stroke-width="2" stroke-dasharray="7 5" opacity=".86"/>
      <line x1="0" y1="${targetFootY}" x2="${tileWidth}" y2="${targetFootY}" stroke="#63ff98" stroke-width="2" stroke-dasharray="7 5" opacity=".86"/>
      <line x1="${actualX}" y1="${actualTopY}" x2="${actualX}" y2="${actualFootY}" stroke="#4de5ff" stroke-width="3"/>
      <circle cx="${actualX}" cy="${item.anchor.centerY * previewHeight}" r="5" fill="#4de5ff" stroke="#07101d" stroke-width="2"/>
      <circle cx="${actualX}" cy="${actualFootY}" r="5" fill="#ff75d8" stroke="#07101d" stroke-width="2"/>
    </svg>
  `);
  const label = Buffer.from(`
    <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#10192c"/>
      <text x="9" y="21" fill="#fff0b8" font-size="15" font-weight="800"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${item.index + 1}. ${xml(item.name)}</text>
      <text x="9" y="43" fill="#8ff5ff" font-size="11" font-weight="700"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">x ${item.anchor.centerX.toFixed(2)} · y ${item.anchor.centerY.toFixed(2)} · foot ${item.anchor.footY.toFixed(2)} · h ${item.anchor.height.toFixed(2)}</text>
    </svg>
  `);
  const left = (item.index % columns) * tileWidth;
  const top = Math.floor(item.index / columns) * (previewHeight + labelHeight);
  anchorComposites.push({ input: preview, left, top });
  anchorComposites.push({ input: overlay, left, top });
  anchorComposites.push({ input: label, left, top: top + previewHeight });
}
const anchorAuditName = path.basename(set.anchorAuditSheet || contactName.replace("-contact-sheet", "-anchor-audit"));
await sharp({
  create: {
    width: columns * tileWidth,
    height: rows * (previewHeight + labelHeight),
    channels: 4,
    background: "#091025",
  },
})
  .composite(anchorComposites)
  .png()
  .toFile(path.join(contactDir, anchorAuditName));

const contract = {
  id: `${config.id}-play-progress-v1`,
  standard: set.standard,
  usedBy: [config.id],
  stateCount: config.results.length,
  states: config.results.map((result) => result.id),
  sourceCanvas: "887x1774",
  runtimeCanvas: set.canvas,
  runtimeSlot: "stage-left-play-progress-v1",
  filePattern: set.filePattern,
  requiredSubjects: set.requiredSubjects,
  layoutContract: set.layoutContract,
  contactSheet: `contact-sheets/${contactName}`,
  anchorAuditSheet: `contact-sheets/${anchorAuditName}`,
};
await writeFile(path.join(sharedRoot, "contract.json"), `${JSON.stringify(contract, null, 2)}\n`);

console.log(`PLAY_PROGRESS_ASSETS: PASS ${lessonFolder} (${config.results.length} states)`);
