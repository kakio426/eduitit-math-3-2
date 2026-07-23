#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const EXPECTED_CANVAS = "1280x800";
const REWARD_CANVAS = "512x512";
const SHARED_START_ASSET = "../_shared/mathmon/cover-start-button/start-button-generated.webp";
const REWARD_STATES = ["closed", "normal", "loss", "mega", "perfect", "empty", "rainbow"];
const MATHMON_ROOT = path.join(ROOT, "_shared", "mathmon");

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

function readMathmonIds(packId) {
  const manifestPath = path.join(MATHMON_ROOT, packId, "manifest.json");
  assert(existsSync(manifestPath), `${packId}: 매스몬 팩 manifest가 없습니다.`);
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  return new Set((manifest.items || manifest.characters || []).map((item) => item.id));
}

function checkV2(folder, config, css, readme, report) {
  const prefix = `${folder}:`;
  const outputDir = path.join(ROOT, folder);
  const rewardSet = config.reward?.stateImageSet;
  const uiScale = config.qa?.uiScaleContract;

  assert(config.standards?.coverStartAsset === "shared-canonical-v1", `${prefix} standards.coverStartAsset은 shared-canonical-v1이어야 합니다.`);
  assert(config.imageAssets?.startButton === SHARED_START_ASSET, `${prefix} 공용 시작 버튼 경로가 다릅니다.`);
  assert((config.assets || []).includes(SHARED_START_ASSET), `${prefix} assets에 공용 시작 버튼 경로가 없습니다.`);
  assert(config.imageAssets?.rewardClosed === "reward-event-closed-generated.webp", `${prefix} 닫힌 보상 이미지 경로가 다릅니다.`);
  assert((config.assets || []).includes(config.imageAssets.rewardClosed), `${prefix} assets에 닫힌 보상 이미지가 없습니다.`);

  assert(rewardSet, `${prefix} reward.stateImageSet 계약이 없습니다.`);
  assert(rewardSet.count === REWARD_STATES.length, `${prefix} 보상 상태 이미지 개수는 7장이어야 합니다.`);
  assert(rewardSet.canvas === REWARD_CANVAS, `${prefix} 보상 상태 이미지 캔버스는 ${REWARD_CANVAS}이어야 합니다.`);
  assert(rewardSet.runtimeSlot === "reward-modal", `${prefix} 보상 상태 이미지 슬롯은 reward-modal이어야 합니다.`);
  assert(
    JSON.stringify(rewardSet.states) === JSON.stringify(REWARD_STATES),
    `${prefix} 보상 상태 순서는 ${REWARD_STATES.join(", ")}이어야 합니다.`,
  );

  const rewardAssets = [
    config.imageAssets.rewardClosed,
    ...REWARD_STATES.slice(1).map((state) => config.reward?.artMap?.[state]),
  ];
  assert(rewardAssets.every(Boolean), `${prefix} 닫힌 상태와 보상 6종 이미지가 모두 필요합니다.`);
  assert(new Set(rewardAssets).size === REWARD_STATES.length, `${prefix} 보상 상태 7장은 서로 다른 파일이어야 합니다.`);
  for (const asset of rewardAssets) {
    const pngPath = path.join(outputDir, pngFor(asset));
    assert(existsSync(pngPath), `${prefix} 보상 상태 PNG가 없습니다: ${path.basename(pngPath)}`);
    assert(readPngSize(pngPath) === REWARD_CANVAS, `${prefix} 보상 상태 이미지는 ${REWARD_CANVAS}이어야 합니다: ${path.basename(pngPath)}`);
  }

  const rewardContactSheet = path.join(outputDir, rewardSet.contactSheet || "");
  assert(existsSync(rewardContactSheet), `${prefix} 보상 상태 컨택시트가 없습니다.`);
  assert(readme.includes(rewardSet.contactSheet), `${prefix} README에 보상 상태 컨택시트 경로가 없습니다.`);
  assert(report.includes(rewardSet.contactSheet), `${prefix} REPORT에 보상 상태 컨택시트 경로가 없습니다.`);
  assert(existsSync(path.join(outputDir, "BENCHMARK_AUDIT.md")), `${prefix} BENCHMARK_AUDIT.md가 없습니다.`);

  assert(uiScale, `${prefix} qa.uiScaleContract가 없습니다.`);
  assert(uiScale.minimumTouchPx === 42, `${prefix} 최소 터치 영역은 42px이어야 합니다.`);
  assert(uiScale.minimumSmallLabelPx === 14, `${prefix} 작은 라벨 글씨는 최소 14px이어야 합니다.`);
  assert(uiScale.minimumProblemPx === 32, `${prefix} 문제 글씨는 최소 32px이어야 합니다.`);
  assert(uiScale.minimumInstructionPx === 14, `${prefix} 지시문 글씨는 최소 14px이어야 합니다.`);
  assert(uiScale.minimumChoicePx === 20, `${prefix} 선택지 글씨는 최소 20px이어야 합니다.`);
  assert(uiScale.minimumHeaderProblemGapPx === 6, `${prefix} 상단 행과 문제판 사이는 최소 6px이어야 합니다.`);
  assert(css.includes("--sound-button-size: 42px"), `${prefix} 설정 버튼 42px CSS 계약이 없습니다.`);
  assert(css.includes("font-size: .9rem"), `${prefix} 상단 라벨 14px 이상 CSS 계약이 없습니다.`);
  assert(
    css.includes("top: calc(var(--stage-inset) + var(--sound-button-size) + 6px)"),
    `${prefix} 상단 행과 문제판 6px 간격 CSS 계약이 없습니다.`,
  );
  assert(report.includes("42×42px") && report.includes("14.4px"), `${prefix} REPORT에 실제 터치·글씨 측정값이 없습니다.`);
}

function checkLesson(folder, config) {
  const prefix = `${folder}:`;
  const outputDir = path.join(ROOT, folder);
  const sourceDir = path.join(SOURCE_ROOT, folder);
  const localCss = readFileSync(path.join(sourceDir, "lesson.css"), "utf8");
  const sharedCssPath = config.sourceFiles?.style
    ? path.resolve(sourceDir, config.sourceFiles.style)
    : null;
  const css = [
    sharedCssPath && existsSync(sharedCssPath) ? readFileSync(sharedCssPath, "utf8") : "",
    localCss,
  ].join("\n");
  const readme = readFileSync(path.join(outputDir, "README.md"), "utf8");
  const report = readFileSync(path.join(outputDir, "REPORT.md"), "utf8");

  assert(config.mathmonPack, `${prefix} mathmonPack이 없습니다.`);
  assert(config.mathmonId, `${prefix} mathmonId가 없습니다.`);
  assert(config.mathmonName, `${prefix} mathmonName이 없습니다.`);
  assert(readMathmonIds(config.mathmonPack).has(config.mathmonId), `${prefix} mathmonId가 ${config.mathmonPack}에 없습니다: ${config.mathmonId}`);

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
  const protagonistKind = set.protagonistKind || "mathmon";
  if (protagonistKind === "mathmon") {
    assert(set.protagonist === config.mathmonId, `${prefix} 결과 주인공과 mathmonId가 다릅니다.`);
  } else {
    assert(protagonistKind === "reward", `${prefix} 알 수 없는 결과 주인공 종류입니다: ${protagonistKind}`);
    assert(typeof set.protagonist === "string" && set.protagonist.length > 0, `${prefix} 중심 보상 주인공 id가 없습니다.`);
    assert(set.fixedGeneratedElements?.some((element) => element.endsWith("-scene")), `${prefix} 중심 보상 결과 장면이 생성 이미지 요소여야 합니다.`);
  }
  assert(set.fixedGeneratedElements?.includes("result-title"), `${prefix} 결과 제목은 생성 이미지 요소여야 합니다.`);
  assert(set.fixedGeneratedElements?.includes("retry-button"), `${prefix} 다시 버튼은 생성 이미지 요소여야 합니다.`);
  const hidesLegacyResultSurface = (
    css.includes("#resultDestinationSvg")
    && css.includes(".result-restart-surface")
    && css.includes("display: none")
  ) || (
    css.includes(".result-dynamic-ui")
    && css.includes("display: none")
    && css.includes(".result-retry-art")
  );
  assert(hidesLegacyResultSurface, `${prefix} 중복 SVG 결과 제목/다시 버튼을 숨겨야 합니다.`);

  for (const result of config.results) {
    const pngPath = path.join(outputDir, pngFor(result.image));
    assert(existsSync(pngPath), `${prefix} 결과 PNG가 없습니다: ${path.basename(pngPath)}`);
    assert(readPngSize(pngPath) === EXPECTED_CANVAS, `${prefix} 결과 이미지는 ${EXPECTED_CANVAS}이어야 합니다: ${path.basename(pngPath)}`);
  }

  const contactSheet = path.join(outputDir, set.contactSheet || "");
  assert(existsSync(contactSheet), `${prefix} 결과 컨택시트가 없습니다.`);
  assert(readme.includes(set.contactSheet), `${prefix} README에 컨택시트 경로가 없습니다.`);
  assert(report.includes(set.contactSheet), `${prefix} REPORT에 컨택시트 경로가 없습니다.`);
  assert(`${readme}\n${report}`.includes(config.mathmonPack), `${prefix} README와 REPORT 어디에도 매스몬 팩 id가 없습니다.`);

  if (config.qa?.visualContractVersion === 2) {
    checkV2(folder, config, css, readme, report);
  }
}

const requested = process.argv.slice(2);
const folders = requested.length ? requested : readdirSync(SOURCE_ROOT);
const checked = [];
for (const folder of folders) {
  const configPath = path.join(SOURCE_ROOT, folder, "lesson.json");
  assert(existsSync(configPath), `${folder}: lesson source does not exist`);
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  if (![1, 2].includes(config.qa?.visualContractVersion)) {
    assert(!requested.length, `${folder}: visualContractVersion 1 또는 2가 필요합니다.`);
    continue;
  }
  checkLesson(folder, config);
  checked.push(folder);
}

assert(checked.length > 0, "visualContractVersion 1 또는 2를 선언한 차시가 없습니다.");
console.log(`LESSON_VISUAL_CONTRACT: PASS (${checked.length})`);
for (const folder of checked) console.log(`- ${folder}`);
