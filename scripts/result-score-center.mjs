import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function loadSharp() {
  try {
    return require("sharp");
  } catch {
    return require("/Users/yubyeongju/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
  }
}

function getDarkTextBox(data, width, bounds) {
  const xs = [];
  const ys = [];
  for (let y = bounds.top; y <= bounds.bottom; y += 1) {
    for (let x = bounds.left; x <= bounds.right; x += 1) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      if (r < 90 && g < 75 && b < 55) {
        xs.push(x);
        ys.push(y);
      }
    }
  }
  if (xs.length <= 120) return null;
  return {
    left: Math.min(...xs),
    right: Math.max(...xs),
    top: Math.min(...ys),
    bottom: Math.max(...ys)
  };
}

export async function measureScoreCenter(imagePath, screenRect, scoreBoxPct) {
  const image = loadSharp()(imagePath).ensureAlpha();
  const { width, height } = await image.metadata();
  const data = await image.raw().toBuffer();
  const scoreBox = {
    left: screenRect.left + screenRect.width * scoreBoxPct.left / 100,
    top: screenRect.top + screenRect.height * scoreBoxPct.top / 100,
    width: screenRect.width * scoreBoxPct.width / 100,
    height: screenRect.height * scoreBoxPct.height / 100
  };
  const insetX = scoreBox.width * 0.12;
  const insetY = scoreBox.height * 0.12;
  const bounds = {
    left: Math.max(0, Math.floor(scoreBox.left + insetX)),
    top: Math.max(0, Math.floor(scoreBox.top + insetY)),
    right: Math.min(width - 1, Math.ceil(scoreBox.left + scoreBox.width - insetX)),
    bottom: Math.min(height - 1, Math.ceil(scoreBox.top + scoreBox.height - insetY))
  };
  const textBox = getDarkTextBox(data, width, bounds);
  if (!textBox) throw new Error(`${imagePath}: score pixels were not found in the score box`);
  const boxCenter = {
    x: scoreBox.left + scoreBox.width / 2,
    y: scoreBox.top + scoreBox.height / 2
  };
  const textCenter = {
    x: (textBox.left + textBox.right) / 2,
    y: (textBox.top + textBox.bottom) / 2
  };
  return {
    dx: textCenter.x - boxCenter.x,
    dy: textCenter.y - boxCenter.y,
    tolerance: Math.max(4, Math.round(screenRect.width * 0.004)),
    textBox,
    scoreBox
  };
}

export async function measureForbiddenScoreLabel(imagePath, screenRect, scoreBoxPct) {
  const image = loadSharp()(imagePath).ensureAlpha();
  const { width } = await image.metadata();
  const data = await image.raw().toBuffer();
  const scoreBox = {
    left: screenRect.left + screenRect.width * scoreBoxPct.left / 100,
    top: screenRect.top + screenRect.height * scoreBoxPct.top / 100,
    width: screenRect.width * scoreBoxPct.width / 100,
    height: screenRect.height * scoreBoxPct.height / 100
  };
  const bounds = {
    left: Math.max(0, Math.floor(scoreBox.left - scoreBox.width * 0.04)),
    top: Math.max(0, Math.floor(scoreBox.top - screenRect.height * 0.075)),
    right: Math.min(width - 1, Math.ceil(scoreBox.left + scoreBox.width * 0.96)),
    bottom: Math.max(0, Math.floor(scoreBox.top - scoreBox.height * 0.08))
  };
  let darkPixels = 0;
  for (let y = bounds.top; y <= bounds.bottom; y += 1) {
    for (let x = bounds.left; x <= bounds.right; x += 1) {
      const offset = (y * width + x) * 4;
      const r = data[offset];
      const g = data[offset + 1];
      const b = data[offset + 2];
      if (r < 110 && g < 95 && b < 80) darkPixels += 1;
    }
  }
  return {
    darkPixels,
    maxAllowed: Math.round(screenRect.width * screenRect.height * 0.00008),
    bounds
  };
}
