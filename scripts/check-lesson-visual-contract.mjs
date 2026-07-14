#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const EXPECTED_CANVAS = "1280x800";

function fail(message) {
  throw new Error(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function readPngSize(filePath) {
  const buffer = readFileSync(filePath);
  assert(buffer.length >= 24 && buffer.toString("ascii", 1, 4) === "PNG", `${filePath}: PNG 원본을 읽을 수 없습니다.`);
  return `${buffer.readUInt32BE(16)}x${buffer.readUInt32BE(20)}`;
}

function pngFor(runtimeAsset) {
  return runtimeAsset.replace(/\.webp$/i, ".png");
}

function uniqueSlotCount(slots) {
  return new Set(Object.values(slots).map((slot) => JSON.stringify(slot))).size;
}

function checkLesson(folder, config) {
  const prefix = `${folder}:`;
  const outputDir = path.join(ROOT, folder);
  const sourceDir = path.join(SOURCE_ROOT, folder);
  const css = readFileSync(path.join(sourceDir, "lesson.css"), "utf8");
  const readme = readFileSync(path.join(outputDir, "README.md"), "utf8");
  const report = readFileSync(path.join(outputDir, "REPORT.md"), "utf8");

  assert(config.mathmonPack, `${prefix} mathmonPack이 없습니다.`);
  assert(config.mathmonId, `${prefix} mathmonId가 없습니다.`);
  assert(config.mathmonName, `${prefix} mathmonName이 없습니다.`);

  const purposes = new Set((config.tutorialCards || []).map((card) => card.purpose));
  assert(purposes.has("mechanic"), `${prefix} 설명 1장에 mechanic 역할이 없습니다.`);
  assert(purposes.has("reward-goal"), `${prefix} 설명 2장에 reward-goal 역할이 없습니다.`);
  for (const card of config.tutorialCards || []) {
    const pngPath = path.join(outputDir, pngFor(card.image || ""));
    assert(existsSync(pngPath), `${prefix} 설명 PNG가 없습니다: ${path.basename(pngPath)}`);
    assert(readPngSize(pngPath) === EXPECTED_CANVAS, `${prefix} 설명 이미지는 ${EXPECTED_CANVAS}이어야 합니다: ${path.basename(pngPath)}`);
  }

  const sprite = config.reward?.spriteSheet;
  const rewardFamilies = [...new Set((config.rewardEvents || []).map((event) => event.family))];
  const mappedRewardAssets = rewardFamilies.map((family) => config.reward?.artMap?.[family]).filter(Boolean);
  const hasUniqueRewardAssets = mappedRewardAssets.length === rewardFamilies.length
    && new Set(mappedRewardAssets).size === rewardFamilies.length;
  const hasUniqueSpriteSlots = sprite?.columns > 0
    && sprite?.rows > 0
    && uniqueSlotCount(sprite.slots || {}) === rewardFamilies.length
    && rewardFamilies.every((family) => Array.isArray(sprite.slots?.[family]));
  assert(hasUniqueRewardAssets || hasUniqueSpriteSlots, `${prefix} 보상 가족마다 다른 이미지나 스프라이트 슬롯이 필요합니다.`);

  const set = config.result?.stateImageSet;
  assert(set, `${prefix} result.stateImageSet 계약이 없습니다.`);
  assert(set.count === config.results.length, `${prefix} 결과 이미지 개수 계약이 실제 결과 수와 다릅니다.`);
  assert(set.canvas === EXPECTED_CANVAS && set.runtimeSlot === EXPECTED_CANVAS, `${prefix} 결과 이미지/슬롯은 ${EXPECTED_CANVAS}이어야 합니다.`);
  assert(set.protagonist === config.mathmonId, `${prefix} 결과 주인공과 mathmonId가 다릅니다.`);
  assert(set.fixedGeneratedElements?.includes("result-title"), `${prefix} 결과 제목은 생성 이미지 요소여야 합니다.`);
  assert(set.fixedGeneratedElements?.includes("retry-button"), `${prefix} 다시 버튼은 생성 이미지 요소여야 합니다.`);
  assert(css.includes("#resultDestinationSvg") && css.includes(".result-restart-surface") && css.includes("display: none"), `${prefix} 중복 SVG 결과 제목/다시 버튼을 숨겨야 합니다.`);

  for (const result of config.results) {
    const pngPath = path.join(outputDir, pngFor(result.image));
    assert(existsSync(pngPath), `${prefix} 결과 PNG가 없습니다: ${path.basename(pngPath)}`);
    assert(readPngSize(pngPath) === EXPECTED_CANVAS, `${prefix} 결과 이미지는 ${EXPECTED_CANVAS}이어야 합니다: ${path.basename(pngPath)}`);
  }

  const contactSheet = path.join(outputDir, set.contactSheet || "");
  assert(existsSync(contactSheet), `${prefix} 결과 컨택시트가 없습니다.`);
  assert(readme.includes(set.contactSheet), `${prefix} README에 컨택시트 경로가 없습니다.`);
  assert(report.includes(set.contactSheet), `${prefix} REPORT에 컨택시트 경로가 없습니다.`);
  assert(readme.includes(config.mathmonPack) && report.includes(config.mathmonPack), `${prefix} README/REPORT에 매스몬 팩 id가 없습니다.`);
}

const requested = process.argv.slice(2);
const folders = requested.length ? requested : readdirSync(SOURCE_ROOT);
const checked = [];
for (const folder of folders) {
  const configPath = path.join(SOURCE_ROOT, folder, "lesson.json");
  assert(existsSync(configPath), `${folder}: lesson source does not exist`);
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  if (config.qa?.visualContractVersion !== 1) {
    assert(!requested.length, `${folder}: visualContractVersion 1 is required for a targeted check`);
    continue;
  }
  checkLesson(folder, config);
  checked.push(folder);
}

assert(checked.length > 0, "visualContractVersion 1을 선언한 차시가 없습니다.");
console.log(`LESSON_VISUAL_CONTRACT: PASS (${checked.length})`);
for (const folder of checked) console.log(`- ${folder}`);
