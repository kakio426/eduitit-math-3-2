#!/usr/bin/env node
// Check source-driven Mathmon lesson packages against the engine manifest contract.
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, "_lessons");
const SHARED_RESULT_COUNT = path.join(ROOT, "_shared", "result-count");
const ENGINE_VERSION = "mathmon-engine-v1";
const EXPECTED_STAGE = Object.freeze({ ratio: "16:10", size: "1280x800" });
const EXPECTED_STANDARDS = Object.freeze({
  cover: "generated-title-overlay",
  coverStart: "generated-button-art",
  settings: "modal-controls",
  resultVisual: "generated-assets",
});
const SHARED_COVER_START_ASSET = "../_shared/mathmon/cover-start-button/start-button-generated.webp";
const SHARED_RESULT_RETRY_ASSETS = new Set([
  "../_shared/result-actions/retry-button-generated.webp",
  "../_shared/result-actions/retry-button-v2-generated.webp",
]);
const UNIFIED_REWARD_STANDARD = "mathmon-unified-reward-v1";
const UNIFIED_REWARD_EVENTS = Object.freeze([
  ["normal", 6400, 6, 10],
  ["loss", 1500, -5, -2],
  ["mega", 1200, 14, 22],
  ["jackpot", 500, 30, 30],
  ["empty", 380, 0, 0],
  ["special", 20, 100, 100],
]);
const UNIFIED_RESULT_THRESHOLDS = Object.freeze([
  [0, 0],
  [15, 2],
  [35, 4],
  [55, 6],
  [78, 8],
  [100, 1],
]);
const RESULT_TIER_FULLSCENE_STANDARD = "result-tier-fullscene-native-v1";
const RESULT_TIER_FULLSCENE_SLOT_KEYS = Object.freeze(["measure", "track", "correct", "next", "retry"]);
const RESULT_TIER_AXIS_SLOT_KEYS = Object.freeze(["measure", "track", "correct", "next"]);
const RESULT_PANEL_CONTAINMENT_STANDARD = "result-panel-containment-v2";
const RESULT_REWARD_DOMINANCE_STANDARD = "result-primary-reward-dominance-v1";
const RESULT_PANEL_CONTAINMENT_SCOPE = /^3-2-(?:3-4|4-[1-4]|5-[1-4]|6-[1-4])$/;
const RESULT_PANEL_CONTAINMENT_FIXTURES = Object.freeze([
  "axis-correct-but-outside-panel",
  "panel-too-short",
  "retry-hitbox-outside-panel",
  "baked-title-outside-panel",
  "viewport-crops-stage",
  "stale-runtime-build",
]);

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function findLessonSources() {
  const entries = await readdir(SOURCE_ROOT, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("_"))
    .map((entry) => entry.name)
    .sort();
}

function addFailure(failures, lesson, message) {
  failures.push(`${lesson}: ${message}`);
}

async function checkLocalAsset(failures, lesson, config, assetPath, label) {
  if (!assetPath) {
    addFailure(failures, lesson, `missing ${label} in lesson.json`);
    return;
  }
  const resolved = path.join(ROOT, config.folder, assetPath);
  if (!(await pathExists(resolved))) {
    addFailure(failures, lesson, `${label} does not exist: ${assetPath}`);
  }
}

function checkRequiredValue(failures, lesson, config, key) {
  if (!config[key]) {
    addFailure(failures, lesson, `lesson.json missing ${key}`);
  }
}

function checkArrayLength(failures, lesson, value, key, expectedLength) {
  if (!Array.isArray(value) || value.length !== expectedLength) {
    addFailure(failures, lesson, `${key} must contain exactly ${expectedLength} items`);
  }
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function checkTutorialCards(failures, lesson, config) {
  if (!Array.isArray(config.tutorialCards) || config.tutorialCards.length < 2) {
    addFailure(failures, lesson, "tutorialCards must contain at least two cards");
    return;
  }
  for (const [index, card] of config.tutorialCards.entries()) {
    const parts = Array.isArray(card)
      ? card
      : [card?.visual, card?.title, card?.body];
    if (parts.length < 3 || !parts.every(isNonEmptyString)) {
      addFailure(failures, lesson, `tutorialCards[${index}] needs visual, title, and body text`);
    }
  }
}

function checkEnumValue(failures, lesson, value, key, allowed) {
  if (!allowed.includes(value)) {
    addFailure(failures, lesson, `${key} must be one of ${allowed.join(", ")}`);
  }
}

function checkRewardEvents(failures, lesson, config) {
  if (!Array.isArray(config.rewardEvents) || config.rewardEvents.length === 0) {
    addFailure(failures, lesson, "rewardEvents must contain at least one event");
    return;
  }
  const totalWeight = config.rewardEvents.reduce((sum, event) => sum + (Number(event.weight) || 0), 0);
  if (totalWeight !== 10000) {
    addFailure(failures, lesson, `rewardEvents weights must total 10000, got ${totalWeight}`);
  }
  for (const event of config.rewardEvents) {
    if (!event.id || !event.text || !event.family) {
      addFailure(failures, lesson, "each rewardEvent needs id, text, and family");
    }
    if (!Number.isFinite(event.min) || !Number.isFinite(event.max) || event.min > event.max) {
      addFailure(failures, lesson, `rewardEvent ${event.id || "(missing id)"} has invalid min/max`);
    }
    if (config.id.startsWith("3-2-2-") && !["common", "rare", "legend"].includes(event.rarity)) {
      addFailure(failures, lesson, `rewardEvent ${event.id || "(missing id)"} needs common/rare/legend rarity`);
    }
  }
  const wrongEvent = config.wrongEvent || {};
  if (!wrongEvent.id || !wrongEvent.text || !wrongEvent.family) {
    addFailure(failures, lesson, "wrongEvent needs id, text, and family");
  }
  if (!Number.isFinite(wrongEvent.min) || !Number.isFinite(wrongEvent.max) || wrongEvent.min > wrongEvent.max) {
    addFailure(failures, lesson, "wrongEvent has invalid min/max");
  }
  if (config.reward?.fairness?.lossCapAtCommonGainMin === true) {
    const commonGain = config.rewardEvents
      .filter((event) => Number(event.min) > 0 && Number(event.weight) > 0)
      .sort((left, right) => Number(right.weight) - Number(left.weight))[0];
    if (!commonGain) {
      addFailure(failures, lesson, "lossCapAtCommonGainMin needs a positive common reward event");
    } else {
      const cap = Number(commonGain.min);
      const lossEvents = config.rewardEvents.filter((event) => Number(event.min) < 0);
      for (const event of lossEvents) {
        if (Math.abs(Number(event.min)) > cap) {
          addFailure(failures, lesson, `rewardEvent ${event.id} loss exceeds common gain minimum ${cap}`);
        }
      }
      if (Number.isFinite(wrongEvent.min) && Math.abs(Number(wrongEvent.min)) > cap) {
        addFailure(failures, lesson, `wrongEvent loss exceeds common gain minimum ${cap}`);
      }
    }
  }
}

function checkUnifiedReward(failures, lesson, config) {
  const fullStandard = config.reward?.standard === UNIFIED_REWARD_STANDARD;
  const eventStandard = config.reward?.eventStandard === UNIFIED_REWARD_STANDARD;
  if (!fullStandard && !eventStandard) return;
  if (config.reward?.maxPower !== 100) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} must use reward.maxPower=100`);
  }
  if (config.reward?.fairness?.emptyKeepsProgress !== true
    || config.reward?.fairness?.lossCapAtCommonGainMin !== true) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} needs both reward.fairness flags`);
  }
  const events = config.rewardEvents || [];
  if (events.length !== UNIFIED_REWARD_EVENTS.length) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} must contain six reward events`);
  } else {
    UNIFIED_REWARD_EVENTS.forEach(([id, weight, min, max], index) => {
      const event = events[index];
      if (event?.id !== id || event?.weight !== weight || event?.min !== min || event?.max !== max) {
        addFailure(
          failures,
          lesson,
          `${UNIFIED_REWARD_STANDARD} event ${index + 1} must be ${id} with weight/min/max ${weight}/${min}/${max}`
        );
      }
    });
  }
  if (events.at(-1)?.special !== true || events.slice(0, -1).some((event) => event.special === true)) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} special flag must belong only to the final special event`);
  }
  if (events.some((event) => event.emptiesPower)) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} must not reset accumulated power`);
  }
  if (config.wrongEvent?.min !== -6 || config.wrongEvent?.max !== -3) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} wrongEvent must be -6..-3`);
  }
  if (!fullStandard) return;
  const results = config.results || [];
  if (results.length !== UNIFIED_RESULT_THRESHOLDS.length) {
    addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} must contain six result tiers`);
  } else {
    UNIFIED_RESULT_THRESHOLDS.forEach(([minPower, minCorrect], index) => {
      const result = results[index];
      if (result?.minPower !== minPower || result?.minCorrect !== minCorrect) {
        addFailure(
          failures,
          lesson,
          `${UNIFIED_REWARD_STANDARD} result ${index + 1} must be ${minPower}/${minCorrect}`
        );
      }
    });
    if (results[5]?.needsSpecial !== true) {
      addFailure(failures, lesson, `${UNIFIED_REWARD_STANDARD} final result must require the special event`);
    }
  }
}

function isValidStageRect(rect) {
  if (!rect || typeof rect !== "object") return false;
  const { x, y, width, height } = rect;
  return [x, y, width, height].every(Number.isFinite)
    && width > 0
    && height > 0
    && x >= 0
    && y >= 0
    && x + width <= 1280
    && y + height <= 800;
}

function rectsIntersect(a, b) {
  return Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x))
    * Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y)) > 0;
}

function isResultPanelContainmentScope(config) {
  return RESULT_PANEL_CONTAINMENT_SCOPE.test(config.id || "");
}

function checkResultPanelContainmentAudit(failures, lesson, config) {
  if (!isResultPanelContainmentScope(config)) return;
  const audit = config.qa?.resultPanelContainmentAudit;
  if (!audit) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} is required for every audited result screen`);
    return;
  }
  if (audit.standard !== RESULT_PANEL_CONTAINMENT_STANDARD) {
    addFailure(failures, lesson, `qa.resultPanelContainmentAudit.standard must be ${RESULT_PANEL_CONTAINMENT_STANDARD}`);
  }
  if (audit.stage !== EXPECTED_STAGE.size || !["#resultBg", "#resultPanelArt"].includes(audit.sceneImage) || audit.safeInsetPx !== 24) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} must use a raster result scene/panel layer, 1280x800, and a 24px safe inset`);
  }
  const detector = audit.panelDetector || {};
  const pixelDetector = detector.standard === "raster-panel-bounds-v2"
    && ["dark", "light"].includes(detector.mode)
    && isValidStageRect(detector.searchRect)
    && Number.isFinite(detector.minRunWidth)
    && detector.minRunWidth >= 180
    && detector.threshold
    && typeof detector.threshold === "object";
  const elementBoundsDetector = detector.standard === "raster-panel-layer-bounds-v1"
    && detector.mode === "element-bounds"
    && isNonEmptyString(detector.source);
  if (!pixelDetector && !elementBoundsDetector) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} needs either a bounded raster detector or an independent panel-layer bounds detector`);
  }
  if (detector.searchRectByTier !== undefined
    && (!detector.searchRectByTier || typeof detector.searchRectByTier !== "object")) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} searchRectByTier must be an object when declared`);
  }
  const elements = audit.elements || {};
  for (const key of ["title", "measure", "track", "correct", "next", "retryArt", "retryHitbox"]) {
    if (!isNonEmptyString(elements[key])) addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} element selector ${key} is required`);
  }
  for (const key of ["axisTolerancePx", "hitboxTolerancePx"]) {
    if (!(Number.isFinite(audit[key]) && audit[key] <= 1)) {
      addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} ${key} must be <=1px`);
    }
  }
  for (const key of ["elementContainment", "noIntersections", "samePanelSizeAcrossTiers", "sameSafeRectAcrossTiers", "hiddenNextMustBeZero", "viewportCropsStage"]) {
    const expected = key === "viewportCropsStage" ? false : true;
    if (audit[key] !== expected) addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} ${key} must be ${expected}`);
  }
  const axisNodes = Array.isArray(audit.axisNodes) ? audit.axisNodes : [];
  if (!axisNodes.includes("measure") || !axisNodes.includes("track") || !axisNodes.includes("correct")
    || !axisNodes.includes("next") || !axisNodes.includes("retryHitbox")) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} axisNodes must cover the dynamic result group and retry hitbox`);
  }
  for (const fixture of RESULT_PANEL_CONTAINMENT_FIXTURES) {
    if (!audit.fixtures?.includes(fixture)) addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} missing fixture ${fixture}`);
  }
  const metadata = audit.runtimeMetadata || {};
  if (metadata.selector !== "#mathmonRuntimeBuildMeta"
    || metadata.commitShaAttribute !== "data-commit-sha"
    || metadata.lessonJsonShaAttribute !== "data-lesson-json-sha256") {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} runtime metadata selectors are incomplete`);
  }
}

function checkResultRewardDominanceContract(failures, lesson, config) {
  const declaredStandard = config.standards?.resultRewardDominance;
  const audit = config.qa?.resultRewardDominanceAudit;
  if (declaredStandard === undefined && audit === undefined) return;
  if (declaredStandard !== RESULT_REWARD_DOMINANCE_STANDARD) {
    addFailure(failures, lesson, `standards.resultRewardDominance must be ${RESULT_REWARD_DOMINANCE_STANDARD}`);
  }
  if (audit?.standard !== RESULT_REWARD_DOMINANCE_STANDARD) {
    addFailure(failures, lesson, `qa.resultRewardDominanceAudit.standard must be ${RESULT_REWARD_DOMINANCE_STANDARD}`);
    return;
  }
  if (!isNonEmptyString(audit.sceneImage) || audit.panelDetector !== "resultBoardAudit") {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} must use a visible result scene and resultBoardAudit pixel detector`);
  }
  if (config.qa?.resultBoardAudit?.standard !== "generated-result-board-pixel-axis-v1") {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} requires qa.resultBoardAudit pixel thresholds`);
  }
  const resultIds = (config.results || []).map((result) => result.id);
  const bounds = audit.primaryRewardBoundsByTier;
  if (!bounds || typeof bounds !== "object" || Object.keys(bounds).length !== resultIds.length) {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} needs one primary reward source rect per result tier`);
  }
  for (const id of resultIds) {
    if (!isValidStageRect(bounds?.[id])) {
      addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} primaryRewardBoundsByTier.${id} must be inside 1280x800`);
    }
  }
  const ratioRules = [
    ["minimumPrimaryRewardWidthRatio", 0.5, 1],
    ["minimumPrimaryRewardAreaRatio", 0.08, 1],
    ["minimumRewardRightEdgeRatio", 0.5, 1],
    ["minimumPanelLeftRatio", 0.5, 1],
    ["maximumPanelWidthRatio", 0.1, 0.45],
    ["maximumPanelAreaRatio", 0.1, 0.4],
    ["minimumRewardToPanelWidthRatio", 1, 4],
    ["maximumRewardPanelOverlapRatio", 0, 0.2],
  ];
  for (const [key, minimum, maximum] of ratioRules) {
    const value = audit[key];
    if (!Number.isFinite(value) || value < minimum || value > maximum) {
      addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} ${key} must be between ${minimum} and ${maximum}`);
    }
  }
  if (!Array.isArray(audit.forbiddenVisibleSelectors) || audit.forbiddenVisibleSelectors.length === 0
    || audit.forbiddenVisibleSelectors.some((selector) => !isNonEmptyString(selector))) {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} needs forbiddenVisibleSelectors for internal result metrics`);
  }
  if (!Array.isArray(audit.forbiddenVisibleTextPatterns) || audit.forbiddenVisibleTextPatterns.length === 0) {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} needs forbiddenVisibleTextPatterns`);
  } else {
    for (const pattern of audit.forbiddenVisibleTextPatterns) {
      try {
        new RegExp(pattern, "u");
      } catch {
        addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} has an invalid forbidden text pattern: ${pattern}`);
      }
    }
  }
  if (!Array.isArray(audit.informationSelectors) || audit.informationSelectors.length === 0
    || audit.informationSelectors.some((selector) => !isNonEmptyString(selector))) {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} needs informationSelectors`);
  }
  if (!Number.isInteger(audit.maximumVisibleInformationNodes)
    || audit.maximumVisibleInformationNodes < 1
    || audit.maximumVisibleInformationNodes > 5) {
    addFailure(failures, lesson, `${RESULT_REWARD_DOMINANCE_STANDARD} maximumVisibleInformationNodes must be 1..5`);
  }
}

function checkResultTierFullsceneContract(failures, lesson, config) {
  const audit = config.qa?.resultVisualAudit;
  if (!audit) return;
  if (audit.standard !== RESULT_TIER_FULLSCENE_STANDARD) {
    addFailure(failures, lesson, `qa.resultVisualAudit.standard must be ${RESULT_TIER_FULLSCENE_STANDARD}`);
    return;
  }

  const results = Array.isArray(config.results) ? config.results : [];
  const expectedStates = results.map((result) => result.id);
  const expectedRanks = results.map((result) => result.visualRank);
  const sceneImages = results.map((result) => result.image);
  const stateCount = results.length;
  const stateImageSet = config.result?.stateImageSet || {};
  if (audit.stateCount !== stateCount || stateImageSet.count !== stateCount) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} state counts must match results.length`);
  }
  if (JSON.stringify(audit.expectedStates) !== JSON.stringify(expectedStates)) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} expectedStates must match result ids`);
  }
  if (JSON.stringify(audit.expectedRanks) !== JSON.stringify(expectedRanks)
    || expectedRanks.some((rank, index) => rank !== index)) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} visualRank must be 0..N-1`);
  }
  if (sceneImages.some((image) => !isNonEmptyString(image)) || new Set(sceneImages).size !== stateCount) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} needs one distinct complete scene image per tier`);
  }
  if (stateImageSet.standard !== "generated-result-fullscene-v3"
    || stateImageSet.canvas !== "1280x800"
    || stateImageSet.runtimeSlot !== "result-stage-fullscene"
    || stateImageSet.nativeScenePerState !== true
    || stateImageSet.forbidEffectOverlay !== true
    || stateImageSet.forbidBlendMode !== true
    || stateImageSet.forbidTierCssFilter !== true) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} complete-scene metadata is inconsistent`);
  }
  if (stateImageSet.impactSet !== undefined
    || config.imageAssets?.resultImpactStates !== undefined
    || results.some((result) => result.impactImage !== undefined)) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} forbids separate impact/effect assets`);
  }

  const resultPanelV2 = config.qa?.resultPanelContainmentAudit?.standard === RESULT_PANEL_CONTAINMENT_STANDARD;
  if (!resultPanelV2) {
  const slots = audit.slots || {};
  for (const key of RESULT_TIER_FULLSCENE_SLOT_KEYS) {
    if (!isValidStageRect(slots[key])) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} slot ${key} must be inside 1280x800`);
    }
  }
  for (let index = 0; index < RESULT_TIER_FULLSCENE_SLOT_KEYS.length; index += 1) {
    const firstKey = RESULT_TIER_FULLSCENE_SLOT_KEYS[index];
    if (!isValidStageRect(slots[firstKey])) continue;
    for (let nextIndex = index + 1; nextIndex < RESULT_TIER_FULLSCENE_SLOT_KEYS.length; nextIndex += 1) {
      const secondKey = RESULT_TIER_FULLSCENE_SLOT_KEYS[nextIndex];
      if (isValidStageRect(slots[secondKey]) && rectsIntersect(slots[firstKey], slots[secondKey])) {
        addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} slots ${firstKey}/${secondKey} must not intersect`);
      }
    }
  }
  if (!Number.isFinite(audit.dynamicAxisX) || !(Number(audit.axisTolerancePx) <= 1)) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} needs a dynamic axis with <=1px tolerance`);
  } else {
    for (const key of RESULT_TIER_AXIS_SLOT_KEYS) {
      const slot = slots[key];
      if (isValidStageRect(slot) && Math.abs(slot.x + slot.width / 2 - audit.dynamicAxisX) > audit.axisTolerancePx) {
        addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} slot ${key} must share dynamicAxisX`);
      }
    }
  }
  if (audit.dynamicAxisByTier !== undefined) {
    if (!audit.dynamicAxisByTier || typeof audit.dynamicAxisByTier !== "object") {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} dynamicAxisByTier must be an object`);
    } else {
      for (const state of expectedStates) {
        if (!Number.isFinite(audit.dynamicAxisByTier[state])) {
          addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} needs a finite raster-panel axis for ${state}`);
        }
      }
      const layoutAxes = config.result?.layout?.axisXByTier;
      if (JSON.stringify(layoutAxes) !== JSON.stringify(audit.dynamicAxisByTier)) {
        addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} runtime and QA tier axes must match`);
      }
    }
    const panelAudit = audit.panelPixelAudit;
    const darkPanelAudit = ["dark-panel-contiguous-run-v1", "dark-panel-row-run-v1"].includes(panelAudit?.standard)
      && Number.isFinite(panelAudit.darkRgbMax?.r)
      && Number.isFinite(panelAudit.darkRgbMax?.g)
      && Number.isFinite(panelAudit.darkRgbMax?.b)
      && (panelAudit.standard === "dark-panel-row-run-v1"
        || Number.isFinite(panelAudit.minColumnDarkPixels));
    const lightPanelAudit = ["light-panel-contiguous-run-v1", "light-panel-row-run-v1"].includes(panelAudit?.standard)
      && Number.isFinite(panelAudit.lightRgbMin?.r)
      && Number.isFinite(panelAudit.lightRgbMin?.g)
      && Number.isFinite(panelAudit.lightRgbMin?.b)
      && Number.isFinite(panelAudit.channelSpreadMax)
      && (panelAudit.standard === "light-panel-row-run-v1"
        || Number.isFinite(panelAudit.minColumnLightPixels));
    if ((!darkPanelAudit && !lightPanelAudit)
      || !isValidStageRect(panelAudit?.searchRect)
      || !Number.isFinite(panelAudit?.minRunWidth)
      || !(Number(panelAudit?.centerTolerancePx) <= 3)) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} needs a bounded raster panel pixel audit with <=3px tolerance`);
    }
    if (audit.shiftRetryWithTierAxis === true && isValidStageRect(slots.retry)
      && Math.abs(slots.retry.x + slots.retry.width / 2 - audit.dynamicAxisX) > audit.axisTolerancePx) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} retry slot must share dynamicAxisX when shiftRetryWithTierAxis is enabled`);
    }
  }
  }
  if (audit.sceneCanvas !== "1280x800"
    || audit.sceneObjectFit !== "cover"
    || audit.nativeScenePerState !== true
    || audit.forbidEffectOverlay !== true
    || audit.forbidBlendMode !== true
    || audit.forbidTierCssFilter !== true
    || audit.requireDistinctSceneSource !== true
    || !Array.isArray(audit.forbiddenSelectors)
    || !audit.forbiddenSelectors.includes("[class*='result-impact']")
    || !isNonEmptyString(audit.grandColorFamily)
    || !isNonEmptyString(audit.legendColorFamily)) {
    addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} native full-scene requirements are incomplete`);
  }
}

function checkEngineSurface(failures, lesson, config) {
  if (config.standards?.coverStartAsset !== undefined) {
    checkEnumValue(failures, lesson, config.standards.coverStartAsset, "standards.coverStartAsset", ["lesson-local", "shared-canonical-v1"]);
    if (config.standards.coverStartAsset === "shared-canonical-v1"
      && config.imageAssets?.startButton !== SHARED_COVER_START_ASSET) {
      addFailure(failures, lesson, `shared-canonical-v1 must use ${SHARED_COVER_START_ASSET}`);
    }
    if (config.standards.coverStartAsset === "shared-canonical-v1"
      && config.assets?.includes("start-button-generated.webp")) {
      addFailure(failures, lesson, "shared-canonical-v1 must not list a lesson-local start button");
    }
  }
  if (config.id.startsWith("3-2-3-") && config.standards?.coverStartAsset === "shared-canonical-v1"
    && !SHARED_RESULT_RETRY_ASSETS.has(config.imageAssets?.resultRetryButton)) {
    addFailure(failures, lesson, "Unit 3 shared cover lessons must use an approved shared result retry asset");
  }
  if (config.tutorial?.mode !== undefined) {
    checkEnumValue(failures, lesson, config.tutorial.mode, "tutorial.mode", ["card-grid", "poster-two-step"]);
  }
  if (config.reward?.mode !== undefined) {
    checkEnumValue(failures, lesson, config.reward.mode, "reward.mode", ["stage-full", "stage-reveal", "modal-art", "inline-panel"]);
  }
  if (config.result?.renderMode !== undefined) {
    checkEnumValue(failures, lesson, config.result.renderMode, "result.renderMode", ["card-art", "simple-generated", "fullscene-score-slot", "hybrid-generated-dynamic", "fullscene-generated-dynamic-slots"]);
  }
  if (config.workbench && !isNonEmptyString(config.workbench.type)) {
    addFailure(failures, lesson, "workbench.type must declare the lesson interaction surface");
  }
  if (config.scoreboard?.enabled === true) {
    for (const key of ["title", "resultKind", "scoreLabel", "listTitle", "unit"]) {
      if (!isNonEmptyString(config.scoreboard[key])) {
        addFailure(failures, lesson, `scoreboard.${key} is required when scoreboard.enabled is true`);
      }
    }
    if (!Array.isArray(config.qa?.requiredFlow) || !config.qa.requiredFlow.includes("scoreboard")) {
      addFailure(failures, lesson, "qa.requiredFlow must include scoreboard when scoreboard.enabled is true");
    }
  }
}

function checkManifestShape(failures, lesson, config) {
  const required = [
    "id",
    "folder",
    "modelName",
    "title",
    "shortTitle",
    "topic",
    "unitBadge",
    "goal",
    "buttonLabel",
    "rewardScreenTitle",
    "progressLabel",
    "rewardComplete",
    "tutorialTitle",
    "tutorialButton",
  ];
  for (const key of required) checkRequiredValue(failures, lesson, config, key);
  if (config.stage?.ratio !== EXPECTED_STAGE.ratio || config.stage?.size !== EXPECTED_STAGE.size) {
    addFailure(failures, lesson, `stage must be ${EXPECTED_STAGE.ratio} ${EXPECTED_STAGE.size}`);
  }
  for (const [key, expected] of Object.entries(EXPECTED_STANDARDS)) {
    if (config.standards?.[key] !== expected) {
      addFailure(failures, lesson, `standards.${key} must be ${expected}`);
    }
  }
  checkTutorialCards(failures, lesson, config);
  checkEngineSurface(failures, lesson, config);
  checkArrayLength(failures, lesson, config.typesPerRun, "typesPerRun", 10);
  if (!Array.isArray(config.qa?.viewports) || config.qa.viewports.length === 0) {
    addFailure(failures, lesson, "qa.viewports must contain at least one viewport");
  }
  if (!Array.isArray(config.qa?.requiredFlow) || !config.qa.requiredFlow.includes("result")) {
    addFailure(failures, lesson, "qa.requiredFlow must include result");
  }
  if (/^3-2-(?:3-[34]|[456]-[1-4])$/.test(config.id)
    && (!config.qa?.requiredFlow?.includes("reward-closed")
      || !config.qa?.requiredFlow?.includes("reward-open"))) {
    addFailure(failures, lesson, "qa.requiredFlow must declare reward-closed and reward-open for the audited 3-3 through 6-4 scope");
  }
  if (config.id.startsWith("3-2-3-")) {
    if (config.result?.showNextGoal !== true) {
      addFailure(failures, lesson, "Unit 3 result must visibly show the next result goal");
    }
    const layout = config.qa?.layoutAudit;
    for (const key of ["workArea", "primary", "secondary", "tertiary", "complete"]) {
      if (!isNonEmptyString(layout?.[key])) {
        addFailure(failures, lesson, `qa.layoutAudit.${key} must be a selector`);
      }
    }
    if (!(Number(layout?.minStageWidthRatio) > 0 && Number(layout?.minStageWidthRatio) <= 1)) {
      addFailure(failures, lesson, "qa.layoutAudit.minStageWidthRatio must be between 0 and 1");
    }
    if (!Array.isArray(config.qa?.misconceptionCoverage) || config.qa.misconceptionCoverage.length === 0) {
      addFailure(failures, lesson, "qa.misconceptionCoverage must list representative misconception ids");
    }
  }
  if (config.id.startsWith("3-2-2-") && config.qa?.directInteractionRequired !== true) {
    addFailure(failures, lesson, "Unit 2 lessons must require direct interaction");
  }
}

async function checkStandaloneLesson(lesson, failures, config, html) {
  if (config.engineVersion !== "mathmon-standalone-v1") {
    addFailure(failures, lesson, "standalone package must use engineVersion=mathmon-standalone-v1");
  }
  if (config.folder !== lesson || config.id !== "3-2-5-4") {
    addFailure(failures, lesson, "standalone package id/folder metadata is inconsistent");
  }
  if (config.stage?.ratio !== EXPECTED_STAGE.ratio || config.stage?.size !== EXPECTED_STAGE.size) {
    addFailure(failures, lesson, `standalone stage must be ${EXPECTED_STAGE.ratio} ${EXPECTED_STAGE.size}`);
  }
  for (const [key, expected] of Object.entries(EXPECTED_STANDARDS)) {
    if (config.standards?.[key] !== expected) {
      addFailure(failures, lesson, `standalone standards.${key} must be ${expected}`);
    }
  }
  const requiredMarkers = [
    'data-engine-version="mathmon-standalone-v1"',
    'data-stage-ratio="16:10"',
    'data-stage-size="1280x800"',
    'data-cover-standard="generated-title-overlay"',
    'data-cover-start-standard="generated-button-art"',
    'data-cover-start-asset="shared-canonical-v1"',
    'data-settings-standard="modal-controls"',
    'data-result-visual-standard="generated-assets"',
    'data-reward-mode="modal-art"',
    'data-scoreboard-enabled="false"',
    `data-mathmon-pack="${config.mathmonPack}"`,
    `data-mathmon-id="${config.mathmonId}"`,
  ];
  if (isResultPanelContainmentScope(config)) {
    requiredMarkers.push(`data-result-panel-containment="${RESULT_PANEL_CONTAINMENT_STANDARD}"`);
  }
  for (const marker of requiredMarkers) {
    if (!html.includes(marker)) addFailure(failures, lesson, `standalone index.html missing ${marker}`);
  }
  if (isResultPanelContainmentScope(config)
    && (!html.includes('id="mathmonRuntimeBuildMeta"')
      || !html.includes('data-commit-sha=')
      || !html.includes('data-lesson-json-sha256='))) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} runtime metadata is missing from standalone index.html`);
  }
  if (/<script\s+[^>]*src=/i.test(html) || /<link\s+[^>]*rel=["']stylesheet/i.test(html)) {
    addFailure(failures, lesson, "standalone package must inline scripts and styles");
  }
  if (!html.includes("window.Lesson5PackageWeightModel") || !html.includes("window.__lesson5PackageQa")) {
    addFailure(failures, lesson, "standalone model and browser QA exports are required");
  }
  const modalOverlayMarkers = [
    'function showRewardOverlay()',
    'screens.play.classList.add("is-active")',
    '#screen-reward .raster-bg',
    'display: none',
  ];
  if (config.qa?.standalonePackageAudit?.requiresPlayBehindModal === true
    && modalOverlayMarkers.some((marker) => !html.includes(marker))) {
    addFailure(failures, lesson, "modal-art reward must keep the problem screen behind the reward card");
  }
  const flowScript = path.resolve(ROOT, config.qa?.flowHarness?.script || "");
  if (config.qa?.flowHarness?.standard !== "delegated-browser-v1"
    || !flowScript.startsWith(`${ROOT}${path.sep}`)
    || !(await pathExists(flowScript))) {
    addFailure(failures, lesson, "standalone package needs an existing delegated browser harness");
  }
  const readme = await readFile(path.join(ROOT, lesson, config.qa?.standalonePackageAudit?.readme || "README.md"), "utf8");
  const report = await readFile(path.join(ROOT, lesson, config.qa?.standalonePackageAudit?.report || "REPORT.md"), "utf8");
  for (const documentText of [readme, report]) {
    if (!documentText.includes(config.mathmonPack) || !documentText.includes(config.mathmonId)) {
      addFailure(failures, lesson, "README/REPORT must declare the standalone Mathmon pack and id");
    }
  }
  const manifestPath = path.join(ROOT, "_shared", "mathmon", config.mathmonPack || "", "manifest.json");
  if (!(await pathExists(manifestPath))) {
    addFailure(failures, lesson, "standalone Mathmon pack manifest is missing");
  } else {
    const manifest = await readJson(manifestPath);
    const ids = new Set((manifest.items || manifest.characters || []).map((item) => item.id));
    if (!ids.has(config.mathmonId)) addFailure(failures, lesson, "standalone Mathmon id is not present in its pack manifest");
  }
  checkRewardEvents(failures, lesson, config);
  checkUnifiedReward(failures, lesson, config);
  checkResultTierFullsceneContract(failures, lesson, config);
  checkResultPanelContainmentAudit(failures, lesson, config);
  checkResultRewardDominanceContract(failures, lesson, config);
  for (const asset of config.assets || []) {
    await checkLocalAsset(failures, lesson, config, asset, `standalone declared asset ${asset}`);
  }
  for (let index = 0; index <= 10; index += 1) {
    const resultCount = path.join(SHARED_RESULT_COUNT, `result-correct-${index}-generated.webp`);
    if (!(await pathExists(resultCount))) addFailure(failures, lesson, `missing shared result count art ${index}/10`);
  }
}

async function checkLesson(lesson, failures) {
  const sourceDir = path.join(SOURCE_ROOT, lesson);
  const configPath = path.join(sourceDir, "lesson.json");
  const config = await readJson(configPath);
  const outputPath = path.join(ROOT, config.folder || lesson, "index.html");
  const html = await readFile(outputPath, "utf8");
  if (config.packageType === "standalone-html") {
    await checkStandaloneLesson(lesson, failures, config, html);
    return;
  }
  const viewPath = path.join(sourceDir, config.sourceFiles?.view || "view.js");
  const cssPath = path.join(sourceDir, config.sourceFiles?.css || "lesson.css");
  const viewSource = await readFile(viewPath, "utf8");
  const cssSource = await readFile(cssPath, "utf8");

  checkManifestShape(failures, lesson, config);
  checkResultRewardDominanceContract(failures, lesson, config);
  if (config.engineVersion !== ENGINE_VERSION) {
    addFailure(failures, lesson, `engineVersion must be ${ENGINE_VERSION}`);
  }
  if (config.folder !== lesson) {
    addFailure(failures, lesson, "folder must match _lessons directory name");
  }
  if (!config.modelName || !/^[A-Z][A-Za-z0-9]*$/.test(config.modelName)) {
    addFailure(failures, lesson, "modelName must be a PascalCase identifier");
  }
  for (const file of ["model", "view"]) {
    const configured = config.sourceFiles?.[file] || `${file}.js`;
    const resolved = path.resolve(sourceDir, configured);
    if (!(await pathExists(resolved))) {
      addFailure(failures, lesson, `missing source file ${configured}`);
    }
  }

  const expectedMarkers = [
    `data-engine-version="${ENGINE_VERSION}"`,
    `data-stage-ratio="${EXPECTED_STAGE.ratio}"`,
    `data-stage-size="${EXPECTED_STAGE.size}"`,
    `data-cover-standard="${EXPECTED_STANDARDS.cover}"`,
    `data-cover-start-standard="${EXPECTED_STANDARDS.coverStart}"`,
    `data-settings-standard="${EXPECTED_STANDARDS.settings}"`,
    `data-result-visual-standard="${EXPECTED_STANDARDS.resultVisual}"`,
  ];
  if (config.standards?.coverStartAsset) expectedMarkers.push(`data-cover-start-asset="${config.standards.coverStartAsset}"`);
  if (config.result?.renderMode) expectedMarkers.push(`data-result-render-mode="${config.result.renderMode}"`);
  if (isResultPanelContainmentScope(config)) expectedMarkers.push(`data-result-panel-containment="${RESULT_PANEL_CONTAINMENT_STANDARD}"`);
  if (config.reward?.mode) expectedMarkers.push(`data-reward-mode="${config.reward.mode}"`);
  if (config.tutorial?.mode) expectedMarkers.push(`data-tutorial-mode="${config.tutorial.mode}"`);
  if (config.workbench?.type) expectedMarkers.push(`data-workbench-type="${config.workbench.type}"`);
  if (config.scoreboard) expectedMarkers.push(`data-scoreboard-enabled="${config.scoreboard.enabled === true ? "true" : "false"}"`);
  for (const marker of expectedMarkers) {
    if (!html.includes(marker)) addFailure(failures, lesson, `generated index.html missing ${marker}`);
  }
  if (isResultPanelContainmentScope(config)
    && (!html.includes('id="mathmonRuntimeBuildMeta"')
      || !html.includes('data-commit-sha=')
      || !html.includes('data-lesson-json-sha256='))) {
    addFailure(failures, lesson, `${RESULT_PANEL_CONTAINMENT_STANDARD} runtime metadata is missing from index.html`);
  }
  if (html.includes("{{")) {
    addFailure(failures, lesson, "generated index.html still contains template placeholders");
  }
  const externalScriptSources = [...html.matchAll(/<script\s+[^>]*src=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]);
  const approvedSharedScriptPattern = /^\.\.\/_shared\/audio\/mathmon-audio-v1\.js(?:\?v=[A-Za-z0-9._-]+)?$/;
  if (externalScriptSources.some((source) => !approvedSharedScriptPattern.test(source))) {
    addFailure(failures, lesson, "generated index.html must not reference unapproved external scripts");
  }
  if (/<link\s+[^>]*rel=["']stylesheet/i.test(html)) {
    addFailure(failures, lesson, "generated index.html must inline CSS");
  }
  if (!html.includes(`const ${config.modelName} = (() => {`)) {
    addFailure(failures, lesson, `generated index.html missing ${config.modelName} model block`);
  }
  if (!html.includes(`window.${config.modelName} = ${config.modelName};`)) {
    addFailure(failures, lesson, `generated index.html missing window.${config.modelName} QA export`);
  }

  const imageAssets = config.imageAssets || {};
  await checkLocalAsset(failures, lesson, config, imageAssets.cover, "cover image");
  await checkLocalAsset(failures, lesson, config, imageAssets.titleArt, "title art");
  await checkLocalAsset(failures, lesson, config, imageAssets.startButton, "start button art");
  await checkLocalAsset(failures, lesson, config, imageAssets.rewardScene, "reward scene");
  await checkLocalAsset(failures, lesson, config, imageAssets.resultRetryButton, "result retry button art");
  if (imageAssets.problemStage) {
    await checkLocalAsset(failures, lesson, config, imageAssets.problemStage, "problem stage art");
  }
  if (config.scoreboard?.enabled === true) {
    await checkLocalAsset(failures, lesson, config, imageAssets.resultLeaderboardButton, "result leaderboard button art");
    if (config.scoreboard.titleArt) {
      await checkLocalAsset(failures, lesson, config, config.scoreboard.titleArt, "scoreboard title art");
    }
  }

  if (!Array.isArray(config.results) || config.results.length === 0) {
    addFailure(failures, lesson, "results must contain at least one tier");
  } else {
    const fixedResultElements = config.result?.stateImageSet?.fixedGeneratedElements;
    const titleIsBakedIntoTierScene = Array.isArray(fixedResultElements) && fixedResultElements.includes("tier-scene-with-title");
    const requiresSeparateResultTitle = isResultPanelContainmentScope(config);
    let previousPower = -1;
    let previousCorrect = -1;
    for (const result of config.results) {
      if (typeof result.minPower !== "number" || result.minPower < previousPower) {
        addFailure(failures, lesson, `result ${result.id || "(missing id)"} minPower must be ascending`);
      }
      if (typeof result.minCorrect !== "number" || (!result.needsSpecial && result.minCorrect < previousCorrect)) {
        addFailure(failures, lesson, `result ${result.id || "(missing id)"} minCorrect must be ascending`);
      }
      previousPower = result.minPower;
      if (!result.needsSpecial) previousCorrect = result.minCorrect;
      await checkLocalAsset(failures, lesson, config, result.image, `result image ${result.id}`);
      if (!titleIsBakedIntoTierScene || requiresSeparateResultTitle) {
        await checkLocalAsset(failures, lesson, config, result.titleImage, `result title image ${result.id}`);
      }
    }
  }
  checkRewardEvents(failures, lesson, config);
  checkUnifiedReward(failures, lesson, config);
  checkResultTierFullsceneContract(failures, lesson, config);
  checkResultPanelContainmentAudit(failures, lesson, config);
  if (config.qa?.resultVisualAudit?.standard === RESULT_TIER_FULLSCENE_STANDARD) {
    if (/compass-result-impact|resultImpactStates|impactImage/.test(viewSource)
      || /class=["'][^"']*result-impact/.test(html)) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} forbids a result effect DOM/image runtime`);
    }
    const resultCssBlocks = [...cssSource.matchAll(/([^{}]+)\{([^{}]*)\}/g)]
      .filter((match) => match[1].includes("#screen-result"));
    const declarationValue = (body, property) => body
      .match(new RegExp(`${property}\\s*:\\s*([^;]+)`))?.[1]
      ?.trim();
    if (resultCssBlocks.some((match) => {
      const value = declarationValue(match[2], "mix-blend-mode");
      return value !== undefined && value !== "normal";
    })) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} forbids result blend modes`);
    }
    if (resultCssBlocks.some((match) => {
      const value = declarationValue(match[2], "filter");
      return value !== undefined && value !== "none";
    })) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} forbids result tier CSS filters`);
    }
    if (resultCssBlocks.some((match) => {
      const value = Number(declarationValue(match[2], "opacity"));
      return Number.isFinite(value) && value !== 1;
    })) {
      addFailure(failures, lesson, `${RESULT_TIER_FULLSCENE_STANDARD} forbids result scene opacity treatment`);
    }
  }
  for (const result of config.results || []) {
    if (result.impactImage) {
      await checkLocalAsset(failures, lesson, config, result.impactImage, `result impact image ${result.id}`);
    }
  }
  for (const event of [...(config.rewardEvents || []), config.wrongEvent].filter(Boolean)) {
    if (event.image) {
      await checkLocalAsset(failures, lesson, config, event.image, `reward event image ${event.id}`);
    }
  }

  if (Array.isArray(config.assets)) {
    for (const asset of config.assets) {
      await checkLocalAsset(failures, lesson, config, asset, `declared asset ${asset}`);
    }
  }

  for (let index = 0; index <= 10; index += 1) {
    const resultCount = path.join(SHARED_RESULT_COUNT, `result-correct-${index}-generated.webp`);
    if (!(await pathExists(resultCount))) {
      addFailure(failures, lesson, `missing shared result count art ${index}/10`);
    }
  }
}

async function main() {
  if (!(await pathExists(SOURCE_ROOT))) {
    console.log("CHECK_LESSON_CONTRACT: PASS (no _lessons directory)");
    return;
  }
  const requested = process.argv.slice(2);
  const lessons = requested.length ? requested : await findLessonSources();
  const failures = [];
  const engineVersions = new Set();
  for (const lesson of lessons) {
    const lessonConfigPath = path.join(SOURCE_ROOT, lesson, "lesson.json");
    if (!(await pathExists(lessonConfigPath))) {
      addFailure(failures, lesson, "lesson source does not exist");
      continue;
    }
    const lessonConfig = JSON.parse(await readFile(lessonConfigPath, "utf8"));
    if (lessonConfig.engineVersion) engineVersions.add(lessonConfig.engineVersion);
    await checkLesson(lesson, failures);
  }
  if (failures.length) {
    console.error("CHECK_LESSON_CONTRACT: FAIL");
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
    return;
  }
  console.log("CHECK_LESSON_CONTRACT: PASS");
  console.log(JSON.stringify({ lessonsChecked: lessons.length, engineVersions: [...engineVersions].sort() }, null, 2));
}

main().catch((error) => {
  console.error(error?.stack || error);
  process.exitCode = 1;
});
