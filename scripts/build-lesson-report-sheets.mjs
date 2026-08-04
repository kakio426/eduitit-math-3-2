#!/usr/bin/env node
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const require = createRequire(import.meta.url);
let sharp;
try {
  sharp = require("sharp");
} catch {
  sharp = require("/Users/yubyeongju/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
}

const ROOT = process.cwd();
const lesson = process.argv[2];
if (!lesson) {
  console.error("Usage: node scripts/build-lesson-report-sheets.mjs <lesson-folder>");
  process.exit(1);
}

const lessonDir = path.join(ROOT, lesson);
const sourceDir = path.join(ROOT, "_lessons", lesson);
const screenshotsDir = path.join(lessonDir, "screenshots");
const config = JSON.parse(await readFile(path.join(sourceDir, "lesson.json"), "utf8"));
const indexBuffer = await readFile(path.join(lessonDir, "index.html"));
const filenames = await readdir(screenshotsDir);
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const natural = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function stateLabel(filename, viewport) {
  return filename
    .replace(`engine-flow-${viewport}-`, "")
    .replace(/\.png$/u, "")
    .replaceAll("-", " ");
}

function stateOrder(filename, viewport) {
  const state = filename.replace(`engine-flow-${viewport}-`, "").replace(/\.png$/u, "");
  const resultMatch = state.match(/^08a-result-(.+)$/u);
  if (resultMatch) {
    const resultStates = config.qa?.resultVisualAudit?.expectedStates || [];
    const index = resultStates.indexOf(resultMatch[1]);
    return 800 + (index < 0 ? 99 : index);
  }
  const prefix = Number.parseInt(state, 10);
  if (!Number.isFinite(prefix)) return 9999;
  if (state.startsWith("05-play")) return 500;
  if (state.startsWith("05m-")) return 510;
  if (state.startsWith("05b-")) return 590;
  if (state === "08-result") return 790;
  return prefix * 100;
}

async function buildViewportSheet(viewport) {
  const prefix = `engine-flow-${viewport.name}-`;
  const sources = filenames
    .filter((filename) => filename.startsWith(prefix) && filename.endsWith(".png"))
    .sort((a, b) => stateOrder(a, viewport.name) - stateOrder(b, viewport.name) || natural.compare(a, b));
  if (!sources.length) throw new Error(`No current flow screenshots found for ${viewport.name}`);

  const columns = 4;
  const tileWidth = 320;
  const imageHeight = 200;
  const labelHeight = 42;
  const headerHeight = 66;
  const rows = Math.ceil(sources.length / columns);
  const width = columns * tileWidth;
  const height = headerHeight + rows * (imageHeight + labelHeight);
  const composites = [];
  const evidence = [];

  const dpr = viewport.deviceScaleFactor || viewport.dpr || 1;
  const header = Buffer.from(`
    <svg width="${width}" height="${headerHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#0b1020"/>
      <text x="24" y="30" fill="#ffe07b" font-size="22" font-weight="800"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(lesson)} · ${escapeXml(viewport.name)}</text>
      <text x="24" y="52" fill="#c9d2e8" font-size="14" font-weight="600"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${viewport.width}×${viewport.height} · DPR ${dpr} · ${sources.length} screens</text>
    </svg>
  `);
  composites.push({ input: header, left: 0, top: 0 });

  for (const [index, filename] of sources.entries()) {
    const sourcePath = path.join(screenshotsDir, filename);
    const sourceBuffer = await readFile(sourcePath);
    const left = (index % columns) * tileWidth;
    const top = headerHeight + Math.floor(index / columns) * (imageHeight + labelHeight);
    const image = await sharp(sourceBuffer)
      .resize(tileWidth, imageHeight, {
        fit: "contain",
        background: { r: 8, g: 10, b: 20, alpha: 1 },
      })
      .png()
      .toBuffer();
    const label = Buffer.from(`
      <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#151b31"/>
        <text x="12" y="27" fill="#eef2ff" font-size="13" font-weight="700"
          font-family="Arial, Apple SD Gothic Neo, sans-serif">${escapeXml(stateLabel(filename, viewport.name))}</text>
      </svg>
    `);
    composites.push({ input: image, left, top });
    composites.push({ input: label, left, top: top + imageHeight });
    evidence.push({
      path: `screenshots/${filename}`,
      sha256: hash(sourceBuffer),
    });
  }

  const outputName = `report-flow-${viewport.name}-contact-sheet.png`;
  const outputPath = path.join(screenshotsDir, outputName);
  await sharp({
    create: {
      width,
      height,
      channels: 4,
      background: { r: 8, g: 10, b: 20, alpha: 1 },
    },
  })
    .composite(composites)
    .png()
    .toFile(outputPath);
  const sheetBuffer = await readFile(outputPath);

  return {
    ...viewport,
    dpr,
    screenshotCount: sources.length,
    sheet: `screenshots/${outputName}`,
    sheetSha256: hash(sheetBuffer),
    screenshots: evidence,
  };
}

const viewports = [];
for (const viewport of config.qa?.viewports || []) {
  viewports.push(await buildViewportSheet(viewport));
}
if (!viewports.length) throw new Error(`${lesson} has no qa.viewports`);

const manifest = {
  standard: "report-current-screen-evidence-v1",
  lesson,
  generatedAt: new Date().toISOString(),
  indexSha256: hash(indexBuffer),
  sourceScreenshotsCommitted: true,
  viewports,
};
await writeFile(
  path.join(screenshotsDir, "report-evidence-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`BUILD_LESSON_REPORT_SHEETS: PASS (${viewports.length} viewports, ${viewports.reduce((sum, item) => sum + item.screenshotCount, 0)} screenshots)`);
