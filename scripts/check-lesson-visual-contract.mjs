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
  assert(
    set.canvas === EXPECTED_CANVAS
      && [EXPECTED_CANVAS, "result-stage-fullscene"].includes(set.runtimeSlot),
    `${prefix} 결과 이미지는 ${EXPECTED_CANVAS}, 슬롯은 ${EXPECTED_CANVAS} 또는 result-stage-fullscene이어야 합니다.`,
  );
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

  const contactSheet = set.contactSheet?.startsWith("_shared/")
    ? path.join(ROOT, set.contactSheet)
    : path.join(outputDir, set.contactSheet || "");
  assert(existsSync(contactSheet), `${prefix} 결과 컨택시트가 없습니다.`);
  assert(readme.includes(set.contactSheet), `${prefix} README에 컨택시트 경로가 없습니다.`);
  assert(report.includes(set.contactSheet), `${prefix} REPORT에 컨택시트 경로가 없습니다.`);
  assert(`${readme}\n${report}`.includes(config.mathmonPack), `${prefix} README와 REPORT 어디에도 매스몬 팩 id가 없습니다.`);

  if (config.standards?.playProgress?.startsWith("generated-play-progress-")) {
    const playSet = config.workbench?.playStateImageSet;
    assert(playSet?.standard === config.standards.playProgress, `${prefix} 문제 화면 진행 이미지 세트 표준이 설정과 다릅니다.`);
    assert(playSet.count === config.results.length, `${prefix} 문제 화면 진행 이미지 개수와 결과 단계 수가 다릅니다.`);
    assert(playSet.objectFit === "contain", `${prefix} 문제 화면 진행 이미지는 object-fit: contain이어야 합니다.`);
    const playAssets = config.results.map((result) => result.playImage);
    assert(playAssets.every(Boolean), `${prefix} 모든 결과 단계에 전용 playImage가 필요합니다.`);
    assert(new Set(playAssets).size === config.results.length, `${prefix} 문제 화면 진행 단계는 서로 다른 이미지여야 합니다.`);
    const sharedPlayProgressRoot = playSet.sourceSetPath
      ? path.resolve(ROOT, playSet.sourceSetPath, "..")
      : null;
    for (const asset of playAssets) {
      const pngPath = sharedPlayProgressRoot
        ? path.join(sharedPlayProgressRoot, "runtime-png", pngFor(asset))
        : path.join(outputDir, pngFor(asset));
      assert(existsSync(pngPath), `${prefix} 문제 화면 진행 PNG가 없습니다: ${path.basename(pngPath)}`);
      assert(readPngSize(pngPath) === playSet.canvas, `${prefix} 문제 화면 진행 이미지 캔버스가 계약과 다릅니다: ${path.basename(pngPath)}`);
    }
    const playContactSheet = path.resolve(playSet.contactSheet?.startsWith("_shared/")
      ? ROOT
      : outputDir, playSet.contactSheet || "");
    assert(existsSync(playContactSheet), `${prefix} 문제 화면 진행 컨택시트가 없습니다.`);
    const playSourceEvidence = playSet.sourceSetPath
      ? path.resolve(ROOT, playSet.sourceSetPath)
      : path.join(outputDir, playSet.sourceSheet || "");
    assert(existsSync(playSourceEvidence), `${prefix} 문제 화면 진행 생성 원본이 없습니다.`);
    assert(readme.includes(playSet.contactSheet), `${prefix} README에 문제 화면 진행 컨택시트 경로가 없습니다.`);
    assert(readme.includes(playSet.sourceSetPath || playSet.sourceSheet), `${prefix} README에 문제 화면 진행 생성 원본 경로가 없습니다.`);
    assert(report.includes(playSet.contactSheet), `${prefix} REPORT에 문제 화면 진행 컨택시트 경로가 없습니다.`);
    assert(report.includes(playSet.sourceSetPath || playSet.sourceSheet), `${prefix} REPORT에 문제 화면 진행 생성 원본 경로가 없습니다.`);
    assert(css.includes(".compass-play-progress-art") && css.includes("object-fit: contain"), `${prefix} 문제 화면 진행 이미지 contain CSS 계약이 없습니다.`);

    if (["generated-play-progress-v2-character-centered", "generated-play-progress-v3-left-character"].includes(playSet.standard)) {
      assert(playSet.protagonist === config.mathmonId, `${prefix} 문제 화면 진행 장면의 매스몬이 차시 매스몬과 다릅니다.`);
      assert(playSet.requiredSubjects?.includes(config.mathmonName + " 전신"), `${prefix} 문제 화면 진행 장면에 매스몬 전신 계약이 없습니다.`);
      assert(playSet.layoutContract?.characterFullBody === true, `${prefix} 문제 화면 진행 장면의 전신 잘림 금지 계약이 없습니다.`);
      assert(playSet.layoutContract?.sameCameraAcrossStates === true, `${prefix} 문제 화면 진행 장면의 동일 카메라 계약이 없습니다.`);
      assert(playSet.layoutContract?.combinedFocalCenterX === 0.5, `${prefix} 문제 화면 진행 장면의 가로 중심 계약이 없습니다.`);
      assert(playSet.layoutContract?.safeMarginRatio >= 0.05, `${prefix} 문제 화면 진행 장면의 안전 여백이 부족합니다.`);
      const mathmonPlacement = playSet.layoutContract?.mathmonPlacement;
      assert(mathmonPlacement && Number.isFinite(mathmonPlacement.centerX) && Number.isFinite(mathmonPlacement.centerY), `${prefix} 문제 화면 매스몬 중심 좌표 계약이 없습니다.`);
      assert(Number.isFinite(mathmonPlacement.footY), `${prefix} 문제 화면 매스몬 발 기준선 계약이 없습니다.`);
      assert(mathmonPlacement.toleranceRatio > 0 && mathmonPlacement.toleranceRatio <= 0.03, `${prefix} 문제 화면 매스몬 위치 허용 오차가 너무 큽니다.`);
      assert(mathmonPlacement.sameScaleAcrossStates === true, `${prefix} 문제 화면 매스몬 동일 크기 계약이 없습니다.`);
      assert(config.qa?.playProgressAudit?.standard === "stage-left-play-progress-v1", `${prefix} 왼쪽 진행 보상 위치 표준이 없습니다.`);
      assert(config.qa?.playProgressAudit?.stateCount === 6 && playSet.count === 6, `${prefix} 왼쪽 진행 보상 이미지 수는 6장이어야 합니다.`);
      assert(config.qa?.playProgressAudit?.canvas === playSet.canvas, `${prefix} 왼쪽 진행 보상 브라우저 캔버스 계약이 다릅니다.`);
      assert(JSON.stringify(config.qa?.playProgressAudit?.mathmonPlacement) === JSON.stringify(mathmonPlacement), `${prefix} 매스몬 이미지·브라우저 위치 계약이 다릅니다.`);
      const placement = config.qa?.playProgressAudit?.panelPlacement;
      assert(placement && Number.isFinite(placement.leftRatio) && Number.isFinite(placement.topRatio) && Number.isFinite(placement.widthRatio), `${prefix} 왼쪽 진행 패널 Stage 좌표 계약이 없습니다.`);
      assert(placement.heightRatio > 0 && placement.heightRatio <= 1, `${prefix} 왼쪽 진행 패널 고정 높이 계약이 잘못되었습니다.`);
      assert(placement.topRatio + placement.heightRatio <= 1, `${prefix} 왼쪽 진행 패널이 Stage 세로 범위를 벗어납니다.`);
      assert(placement.tolerancePx <= 1, `${prefix} 왼쪽 진행 패널 좌표 허용값은 1px 이하여야 합니다.`);
      assert(config.qa?.playProgressAudit?.expectedProtagonist === config.mathmonId, `${prefix} 브라우저 진행 장면 매스몬 검증 계약이 없습니다.`);
      assert(config.qa?.playProgressAudit?.panelLaneCenterTolerancePx <= 1, `${prefix} 왼쪽 진행 패널 중심 오차 허용값이 너무 큽니다.`);
      assert(config.qa?.playProgressAudit?.imagePanelCenterTolerancePx <= 1, `${prefix} 진행 이미지와 패널 중심 오차 허용값이 너무 큽니다.`);
    }
  }

  if (config.qa?.topControlsAudit) {
    const audit = config.qa.topControlsAudit;
    assert(audit.standard === "stage-top-controls-v1", `${prefix} 상단 조작 정렬 표준이 다릅니다.`);
    assert(typeof audit.unitBadge === "string" && audit.unitBadge.length > 0, `${prefix} 단원 배지 측정 선택자가 없습니다.`);
    assert(typeof audit.settingsButton === "string" && audit.settingsButton.length > 0, `${prefix} 설정 버튼 측정 선택자가 없습니다.`);
    assert(audit.topTolerancePx <= 1, `${prefix} 상단 모서리 정렬 허용값은 1px 이하여야 합니다.`);
    assert(audit.centerYTolerancePx <= 1, `${prefix} 세로 중심 정렬 허용값은 1px 이하여야 합니다.`);
    assert(audit.heightTolerancePx <= 1, `${prefix} 높이 차이 허용값은 1px 이하여야 합니다.`);
    assert(audit.minGapPx >= 8, `${prefix} 상단 조작 사이 간격은 8px 이상이어야 합니다.`);
    assert(css.includes("top: var(--stage-inset)"), `${prefix} 상단 조작은 공용 --stage-inset 좌표를 써야 합니다.`);
  }

  if (config.qa?.rewardModalAudit) {
    const audit = config.qa.rewardModalAudit;
    assert(config.reward?.mode === "modal-art", `${prefix} 보상 모달 하네스는 reward.mode=modal-art에서만 씁니다.`);
    assert(config.reward?.stateImageSet?.runtimeSlot === "reward-modal", `${prefix} 보상 상태 이미지 슬롯은 reward-modal이어야 합니다.`);
    assert(audit.standard === "unit3-modal-art-v1", `${prefix} 3단원 보상 모달 표준이 다릅니다.`);
    for (const key of ["card", "visual", "label", "openButton", "nextButton"]) {
      assert(typeof audit[key] === "string" && audit[key].length > 0, `${prefix} 보상 모달 ${key} 측정 선택자가 없습니다.`);
    }
    assert(audit.canvas === REWARD_CANVAS, `${prefix} 보상 모달 이미지 캔버스는 ${REWARD_CANVAS}이어야 합니다.`);
    assert(audit.cardWidthPx === 560 && audit.cardHeightPx === 480, `${prefix} 보상 모달 카드는 560×480px이어야 합니다.`);
    assert(audit.cardAspectRatio === "7:6", `${prefix} 보상 모달 카드 비율은 7:6이어야 합니다.`);
    assert(audit.visualSizePx === 250, `${prefix} 보상 모달 이미지 슬롯은 250×250px이어야 합니다.`);
    assert(audit.cardCenterTolerancePx <= 1, `${prefix} 보상 카드 중심 오차 허용값은 1px 이하여야 합니다.`);
    assert(audit.cardSizeTolerancePx <= 1, `${prefix} 보상 카드 크기 오차 허용값은 1px 이하여야 합니다.`);
    assert(audit.visualSquareTolerancePx <= 1, `${prefix} 보상 이미지 정사각 오차 허용값은 1px 이하여야 합니다.`);
    assert(audit.visualSizeTolerancePx <= 1, `${prefix} 보상 이미지 크기 오차 허용값은 1px 이하여야 합니다.`);
    assert(audit.minVisualPx >= 180, `${prefix} 보상 이미지 최소 표시 크기는 180px 이상이어야 합니다.`);
    if (audit.backdropBlurMinPx != null) {
      assert(audit.backdropBlurMinPx >= 8, `${prefix} 보상 모달 배경 블러는 8px 이상이어야 합니다.`);
      assert(css.includes("backdrop-filter: blur("), `${prefix} 보상 모달 배경 블러 CSS가 없습니다.`);
    }
    assert(config.imageAssets?.rewardClosed, `${prefix} 닫힌 보상 이미지가 없습니다.`);
    assert(css.includes(".reward-card") && css.includes("width: min(560px, 88%)"), `${prefix} 보상 카드 폭 계약 CSS가 없습니다.`);
    assert(css.includes("height: 480px") && css.includes("min-height: 480px"), `${prefix} 보상 카드 높이 계약 CSS가 없습니다.`);
    assert(css.includes(".reward-visual") && css.includes("background-size: cover"), `${prefix} 보상 이미지 채움 CSS 계약이 없습니다.`);
  }

  if (config.qa?.rewardEffectAudit) {
    const audit = config.qa.rewardEffectAudit;
    assert(["modal-dismiss-world-impact-v1", "modal-dismiss-world-impact-v2"].includes(audit.standard), `${prefix} 모달 뒤 보상 효과 표준이 다릅니다.`);
    assert(typeof audit.panel === "string" && audit.panel.length > 0, `${prefix} 보상 효과 패널 측정 선택자가 없습니다.`);
    assert(typeof audit.image === "string" && audit.image.length > 0, `${prefix} 보상 효과 이미지 측정 선택자가 없습니다.`);
    assert(Array.isArray(audit.activeClasses) && audit.activeClasses.length >= 3, `${prefix} 보상 효과 상태 클래스 계약이 부족합니다.`);
    assert(audit.durationMs >= 700, `${prefix} 보상 효과를 읽을 시간이 부족합니다.`);
    assert(audit.deferNextProblem === true, `${prefix} 보상 효과가 끝나기 전에 다음 문제로 넘어가면 안 됩니다.`);
    assert(audit.modalKeepsBackgroundStable === true, `${prefix} 모달이 열린 동안 뒤 진행 장면이 바뀌면 안 됩니다.`);
    if (audit.standard === "modal-dismiss-world-impact-v2") {
      assert(audit.requiresModalClosedBeforeStart === true, `${prefix} 보상 효과는 모달이 닫힌 뒤 시작해야 합니다.`);
      assert(audit.preEffectDelayMs >= 250 && audit.preEffectDelayMs <= 450, `${prefix} 모달 뒤 시선 이동 여백은 250~450ms여야 합니다.`);
      assert(audit.minVisibleMs >= 1200, `${prefix} 단계 상승 효과가 너무 짧습니다.`);
      assert(audit.durationMs >= audit.minVisibleMs, `${prefix} 효과 전체 시간이 최소 표시 시간보다 짧습니다.`);
      assert(typeof audit.impactLayer === "string" && audit.impactLayer.length > 0, `${prefix} Stage 크기 보상 효과 레이어가 없습니다.`);
      assert(audit.minImpactStageWidthRatio >= 0.32, `${prefix} 단계 상승 효과가 Stage에서 너무 작습니다.`);
      assert(typeof audit.tierUpClass === "string" && audit.activeClasses.includes(audit.tierUpClass), `${prefix} 단계 상승 효과 클래스 계약이 없습니다.`);
      assert(Array.isArray(audit.positiveClasses) && audit.positiveClasses.length >= 2, `${prefix} 양수 보상 효과 클래스 계약이 부족합니다.`);
      assert(audit.tierChangeRequiresImageSwap === true, `${prefix} 단계 상승 때 진행 이미지 교체를 검사해야 합니다.`);
      assert(audit.forceTierTransition?.beforeTier && audit.forceTierTransition?.afterTier, `${prefix} 단계 상승 회귀 fixture가 없습니다.`);
      assert(Number.isFinite(audit.forceTierTransition?.restoreCorrect), `${prefix} 단계 상승 fixture의 정답 수 복원값이 없습니다.`);
      assert(css.includes(audit.impactLayer.replace(/^[.#]/, "")), `${prefix} Stage 크기 보상 효과 CSS가 없습니다.`);
    }
    for (const className of audit.activeClasses) {
      assert(css.includes(`.${className}`), `${prefix} 보상 효과 CSS 클래스 .${className}가 없습니다.`);
    }
  }

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
