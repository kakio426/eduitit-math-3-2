#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const sharp = require("sharp");

const args = process.argv.slice(2);
const outputIndex = args.indexOf("--out");
if (outputIndex < 0 || outputIndex === args.length - 1) {
  console.error("Usage: node scripts/build-image-contact-sheet.mjs <images...> --out <sheet.png>");
  process.exit(1);
}

const inputs = args.slice(0, outputIndex).map((file) => path.resolve(file));
const output = path.resolve(args[outputIndex + 1]);
if (!inputs.length) {
  console.error("At least one input image is required.");
  process.exit(1);
}

const columns = Math.min(3, inputs.length);
const rows = Math.ceil(inputs.length / columns);
const tileWidth = 260;
const previewHeight = 420;
const labelHeight = 54;
const tileHeight = previewHeight + labelHeight;
const composites = [];

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

for (const [index, input] of inputs.entries()) {
  const metadata = await sharp(input).metadata();
  const preview = await sharp(input)
    .resize(tileWidth, previewHeight, { fit: "contain", background: "#090d1b" })
    .png()
    .toBuffer();
  const name = path.basename(input);
  const label = Buffer.from(`
    <svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#15102a"/>
      <text x="10" y="22" fill="#fff1b8" font-size="13" font-weight="800"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${index + 1}. ${xml(name)}</text>
      <text x="10" y="42" fill="#b9acd9" font-size="12"
        font-family="Arial, Apple SD Gothic Neo, sans-serif">${metadata.width}×${metadata.height}</text>
    </svg>
  `);
  const left = (index % columns) * tileWidth;
  const top = Math.floor(index / columns) * tileHeight;
  composites.push({ input: preview, left, top });
  composites.push({ input: label, left, top: top + previewHeight });
}

await sharp({
  create: {
    width: columns * tileWidth,
    height: rows * tileHeight,
    channels: 4,
    background: "#090d1b",
  },
})
  .composite(composites)
  .png()
  .toFile(output);

console.log(`CONTACT_SHEET: ${output}`);
