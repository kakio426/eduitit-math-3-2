import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const LESSON = "3-2-3-2-mathmon-compass-ring";
const SOURCE_DIR = path.join(ROOT, "_lessons", LESSON);
const config = JSON.parse(await readFile(path.join(SOURCE_DIR, "lesson.json"), "utf8"));
const modelSource = await readFile(path.join(SOURCE_DIR, "model.js"), "utf8");
const viewSource = await readFile(path.join(SOURCE_DIR, "view.js"), "utf8");
const cssSource = await readFile(path.join(SOURCE_DIR, "lesson.css"), "utf8");
const closedRewardPng = await readFile(path.join(ROOT, LESSON, "reward-event-closed-generated.png"));
await readFile(path.join(ROOT, LESSON, "reward-event-closed-generated.webp"));
await readFile(path.join(ROOT, LESSON, "reward-events-v3-contact-sheet.png"));
const playProgressRoot = path.join(
  ROOT,
  "_shared",
  "mathmon",
  "diversity-reward-pack",
  "lesson-scenes",
  "3-2-3-2",
  "play-progress-v3",
);
await readFile(path.join(playProgressRoot, "contract.json"));
await readFile(path.join(playProgressRoot, "contact-sheets", "play-progress-v3-contact-sheet.png"));
await readFile(path.join(playProgressRoot, "contact-sheets", "play-progress-v3-anchor-audit.png"));
const resultFullsceneRoot = path.join(
  ROOT,
  "_shared",
  "mathmon",
  "diversity-reward-pack",
  "lesson-scenes",
  "3-2-3-2",
  "result-fullscene-v3",
);
const resultFullsceneContract = JSON.parse(await readFile(
  path.join(resultFullsceneRoot, "contract.json"),
  "utf8",
));
await readFile(path.join(
  resultFullsceneRoot,
  "contact-sheets",
  "result-fullscene-v3-contact-sheet.png",
));

const context = vm.createContext({ LESSON_CONFIG: config, console, Math });
vm.runInContext(`${modelSource}\nglobalThis.__lessonModel = ${config.modelName};`, context);
const model = context.__lessonModel;

assert.equal(config.workbench.type, "compass-opening");
assert.equal(config.imageAssets.problemStage, "problem-stage-generated.webp");
assert.equal(config.standards.playProgress, "generated-play-progress-v3-left-character");
assert.deepEqual(config.workbench.playStateImageSet, {
  standard: "generated-play-progress-v3-left-character",
  count: 6,
  canvas: "418x627",
  runtimeSlot: "left-progress-panel",
  objectFit: "contain",
  filePattern: "play-progress-v3-*-generated.webp",
  sourceSetPath: "_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/source",
  contactSheet: "_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-contact-sheet.png",
  anchorAuditSheet: "_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-2/play-progress-v3/contact-sheets/play-progress-v3-anchor-audit.png",
  cacheVersion: "2026-07-31-left-character-impact",
  protagonist: "mathmon-drv-05-crystalowl",
  requiredSubjects: ["마법진", "수정부엉몬 전신"],
  layoutContract: {
    combinedFocalCenterX: 0.5,
    combinedFocalCenterY: 0.58,
    safeMarginRatio: 0.05,
    characterFullBody: true,
    sameCameraAcrossStates: true,
    mathmonPlacement: {
      centerX: 0.3,
      centerY: 0.66,
      footY: 0.88,
      toleranceRatio: 0.03,
      sameScaleAcrossStates: true,
    },
    subjectAnchors: {
      standard: "source-pixel-anchor-v1",
      faint: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
      small: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
      ring: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
      big: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
      grand: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
      legend: { centerX: 0.3, centerY: 0.68, footY: 0.86, height: 0.34 },
    },
  },
});
assert.equal(config.workbench.playStateImageSet.protagonist, config.mathmonId);
assert.equal(Object.keys(config.imageAssets.playProgressStates).length, config.results.length);
assert.equal(new Set(config.results.map((result) => result.playImage)).size, config.results.length);
for (const result of config.results) {
  assert.equal(result.playImage, config.imageAssets.playProgressStates[result.id]);
  const playPng = await readFile(path.join(
    playProgressRoot,
    "runtime-png",
    result.playImage.replace(/\.webp$/, ".png"),
  ));
  assert.equal(playPng.readUInt32BE(16), 418, `${result.id} play progress PNG width`);
  assert.equal(playPng.readUInt32BE(20), 627, `${result.id} play progress PNG height`);
}
assert.equal(config.goal, "반지름만큼 컴퍼스를 벌려요.");
assert.equal(config.standards.coverStartAsset, "shared-canonical-v1");
assert.equal(config.imageAssets.startButton, "../_shared/mathmon/cover-start-button/start-button-generated.webp");
assert.equal(config.imageAssets.resultRetryButton, "../_shared/result-actions/retry-button-generated.webp");
assert.deepEqual(config.result.layout, {
  axisX: 802,
  axisXByTier: {
    faint: 804,
    small: 803,
    ring: 810,
    big: 828,
    grand: 925,
    legend: 871,
  },
  measureY: 275,
  barY: 302,
  barWidth: 360,
  barHeight: 28,
  correctTop: 350,
  correctWidth: 180,
  nextY: 520,
  retryRect: { x: 735, y: 618, width: 335, height: 120 },
});
assert.equal(config.result.renderMode, "fullscene-generated-dynamic-slots");
assert.equal(config.result.stateImageSet.standard, "generated-result-fullscene-v3");
assert.equal(config.result.stateImageSet.canvas, "1280x800");
assert.equal(config.result.stateImageSet.runtimeSlot, "result-stage-fullscene");
assert.equal(config.result.stateImageSet.nativeScenePerState, true);
assert.equal(config.result.stateImageSet.forbidEffectOverlay, true);
assert.equal(config.result.stateImageSet.forbidBlendMode, true);
assert.equal(config.result.stateImageSet.forbidTierCssFilter, true);
assert.deepEqual(
  config.results.map(({ id, visualRank, image }) => ({ id, visualRank, image })),
  [
    { id: "faint", visualRank: 0, image: "result-faint-generated.webp" },
    { id: "small", visualRank: 1, image: "result-small-generated.webp" },
    { id: "ring", visualRank: 2, image: "result-ring-generated.webp" },
    { id: "big", visualRank: 3, image: "result-big-generated.webp" },
    { id: "grand", visualRank: 4, image: "result-grand-generated.webp" },
    { id: "legend", visualRank: 5, image: "result-legend-generated.webp" },
  ],
);
assert.equal(new Set(config.results.map((result) => result.image)).size, 6);
assert.deepEqual(resultFullsceneContract.states, config.results.map((result) => result.id));
assert.deepEqual(resultFullsceneContract.visualRanks, [0, 1, 2, 3, 4, 5]);
assert.equal(resultFullsceneContract.nativeScenePerState, true);
assert.equal(resultFullsceneContract.forbidEffectOverlay, true);
assert.equal(resultFullsceneContract.forbidBlendMode, true);
assert.equal(resultFullsceneContract.forbidTierCssFilter, true);
assert.equal(resultFullsceneContract.visualProgression.at(-2).colorFamily, "gold-amethyst");
assert.equal(resultFullsceneContract.visualProgression.at(-1).colorFamily, "rainbow-gold");
const resultSceneHashes = [];
for (const result of config.results) {
  assert.equal("impactImage" in result, false, `${result.id} must not declare a composited impact image`);
  const scenePng = await readFile(path.join(
    resultFullsceneRoot,
    "runtime-png",
    result.image.replace(/\.webp$/, ".png"),
  ));
  assert.equal(scenePng.readUInt32BE(16), 1280, `${result.id} full-scene PNG width`);
  assert.equal(scenePng.readUInt32BE(20), 800, `${result.id} full-scene PNG height`);
  resultSceneHashes.push(createHash("sha256").update(scenePng).digest("hex"));
  await readFile(path.join(ROOT, LESSON, result.image));
}
assert.equal(new Set(resultSceneHashes).size, 6, "all result tiers need distinct complete scene pixels");
assert.deepEqual(config.qa.resultVisualAudit.expectedStates, config.results.map((result) => result.id));
assert.deepEqual(config.qa.resultVisualAudit.expectedRanks, [0, 1, 2, 3, 4, 5]);
assert.equal(config.qa.resultVisualAudit.dynamicAxisX, config.result.layout.axisX);
assert.deepEqual(
  config.qa.resultVisualAudit.dynamicAxisByTier,
  config.result.layout.axisXByTier,
);
assert.equal(config.qa.resultVisualAudit.panelPixelAudit.standard, "dark-panel-contiguous-run-v1");
assert.equal(config.qa.resultVisualAudit.panelPixelAudit.centerTolerancePx, 3);
assert.deepEqual(
  resultFullsceneContract.dynamicPanelByState.centersX,
  config.result.layout.axisXByTier,
);
assert.equal(config.qa.resultVisualAudit.standard, "result-tier-fullscene-native-v1");
assert.equal(config.qa.resultVisualAudit.sceneCanvas, "1280x800");
assert.equal(config.qa.resultVisualAudit.sceneObjectFit, "cover");
assert.equal(config.qa.resultVisualAudit.forbidEffectOverlay, true);
assert.equal(config.qa.resultVisualAudit.forbidBlendMode, true);
assert.equal(config.qa.resultVisualAudit.forbidTierCssFilter, true);
assert.equal(config.qa.resultVisualAudit.axisTolerancePx, 1);
assert.equal(config.qa.resultVisualAudit.minVerticalGapPx, 12);
assert.equal(config.imageAssets.resultImpactStates, undefined);
assert.doesNotMatch(viewSource, /compass-result-impact|resultImpactStates|impactImage|globalThis\.onResult\s*=/);
assert.doesNotMatch(cssSource, /#screen-result[\s\S]{0,180}mix-blend-mode:\s*screen/);
assert.doesNotMatch(cssSource, /#screen-result\[data-result-tier=.*>\s*\.raster-bg[\s\S]{0,100}filter:/);
assert.match(cssSource, /#screen-result > \.raster-bg[\s\S]*?filter:\s*none[\s\S]*?mix-blend-mode:\s*normal/);
assert.equal(config.imageAssets.rewardClosed, "reward-event-closed-generated.webp");
assert.ok(config.assets.includes(config.imageAssets.rewardClosed), "closed reward runtime asset must be listed");
assert.equal(config.action, "바늘과 연필 사이의 길이를 골라요.");
assert.equal(config.reward.mode, "modal-art");
assert.equal(config.reward.standard, "mathmon-unified-reward-v1");
assert.equal(config.reward.version, "magic-circle-modal-art-v1");
assert.equal(config.reward.unitLabel, "마법진 빛");
assert.equal(config.reward.closedLabel, "무엇이 나올까요?");
assert.equal(config.reward.fairness.emptyKeepsProgress, true);
assert.equal(config.reward.fairness.lossCapAtCommonGainMin, true);
assert.deepEqual(config.reward.stateImageSet, {
  count: 7,
  canvas: "512x512",
  runtimeSlot: "reward-modal",
  states: ["closed", "normal", "loss", "mega", "perfect", "empty", "rainbow"],
  contactSheet: "reward-events-v3-contact-sheet.png",
});
assert.equal(closedRewardPng.readUInt32BE(16), 512, "closed reward PNG width");
assert.equal(closedRewardPng.readUInt32BE(20), 512, "closed reward PNG height");
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-reward-closed-1082x897-dpr2"
    && viewport.width === 1082 && viewport.height === 897 && viewport.dpr === 2),
  "reported reward viewport must stay in regression QA",
);
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-complete-1082x897-dpr2"
    && viewport.width === 1082 && viewport.height === 897 && viewport.dpr === 2),
  "reported complete viewport must stay in regression QA",
);
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-top-controls-1082x987-dpr2"
    && viewport.width === 1082 && viewport.height === 987 && viewport.dpr === 2),
  "reported top-controls viewport must stay in regression QA",
);
assert.ok(
  config.qa.viewports.some((viewport) => viewport.name === "reported-reward-modal-1082x987-dpr2"
    && viewport.width === 1082 && viewport.height === 987 && viewport.dpr === 2),
  "reported modal reward viewport must stay in regression QA",
);
assert.deepEqual(config.qa.rewardModalAudit, {
  standard: "unit3-modal-art-v1",
  card: "#rewardPop .reward-card",
  visual: "#rewardVisual",
  label: "#modalRewardLabel",
  openButton: "#modalRewardOpenButton",
  nextButton: "#modalRewardNextButton",
  canvas: "512x512",
  cardWidthPx: 560,
  cardHeightPx: 480,
  cardAspectRatio: "7:6",
  visualSizePx: 250,
  cardCenterTolerancePx: 1,
  cardSizeTolerancePx: 1,
  visualSquareTolerancePx: 1,
  visualSizeTolerancePx: 1,
  minVisualPx: 180,
  backdropBlurMinPx: 8,
});
assert.deepEqual(config.qa.rewardEffectAudit, {
  standard: "modal-dismiss-world-impact-v2",
  panel: ".compass-play-progress",
  image: ".compass-play-progress-art",
  activeClasses: ["is-changing", "is-dimming", "is-celebrating", "is-tier-up"],
  positiveClasses: ["is-changing", "is-celebrating"],
  tierUpClass: "is-tier-up",
  impactLayer: ".compass-play-progress-impact-stage",
  preEffectDelayMs: 320,
  durationMs: 1560,
  minVisibleMs: 1200,
  minImpactStageWidthRatio: 0.32,
  deferNextProblem: true,
  modalKeepsBackgroundStable: true,
  requiresModalClosedBeforeStart: true,
  tierChangeRequiresImageSwap: true,
  forceTierTransition: {
    beforePower: 14,
    beforeCorrect: 2,
    restoreCorrect: 1,
    eventId: "normal",
    amount: 6,
    beforeTier: "faint",
    afterTier: "small",
  },
});
assert.deepEqual(config.qa.topControlsAudit, {
  standard: "stage-top-controls-v1",
  unitBadge: "#screen-play .hud-right .unit-badge",
  settingsButton: "#settingsButton",
  topTolerancePx: 1,
  bottomTolerancePx: 1,
  centerYTolerancePx: 1,
  heightTolerancePx: 1,
  minGapPx: 8,
});
assert.match(
  cssSource,
  /\.game\[data-workbench-type="compass-opening"\] \.hud\s*\{[^}]*top:\s*var\(--top-control-y\)/s,
  "play HUD must share the top-control-y coordinate with the settings button",
);
assert.doesNotMatch(
  cssSource,
  /\.game\[data-workbench-type="compass-opening"\] \.hud\s*\{[^}]*top:\s*18px/s,
  "play HUD must not keep a screen-specific fixed top correction",
);
assert.ok(config.qa.requiredFlow.includes("reward-closed"), "closed reward state must be audited");
assert.ok(config.qa.requiredFlow.includes("reward-open"), "open reward state must be audited");
assert.ok(!config.assets.includes("start-button-generated.webp"), "local start button must not be listed");
assert.equal(config.qa.layoutAudit.minStageWidthRatio, 0.65);
assert.equal(config.qa.playProgressAudit.standard, "stage-left-play-progress-v1");
assert.equal(config.qa.playProgressAudit.stateCount, 6);
assert.equal(config.qa.playProgressAudit.canvas, config.workbench.playStateImageSet.canvas);
assert.equal(config.qa.playProgressAudit.objectFit, "contain");
assert.equal(config.qa.playProgressAudit.expectedStandard, config.standards.playProgress);
assert.equal(config.qa.playProgressAudit.expectedProtagonist, config.mathmonId);
assert.deepEqual(config.qa.playProgressAudit.panelPlacement, {
  leftRatio: 0.029,
  topRatio: 0.11,
  widthRatio: 0.252,
  heightRatio: 0.84,
  tolerancePx: 1,
});
assert.deepEqual(
  config.qa.playProgressAudit.mathmonPlacement,
  config.workbench.playStateImageSet.layoutContract.mathmonPlacement,
);
assert.equal(config.qa.playProgressAudit.panelLaneCenterTolerancePx, 1);
assert.equal(config.qa.playProgressAudit.imagePanelCenterTolerancePx, 1);
assert.deepEqual(config.qa.playProgressAudit.expectedStates, config.results.map((result) => result.id));
assert.deepEqual([...config.qa.misconceptionCoverage], [
  "COMPASS_TOO_NARROW",
  "COMPASS_TOO_WIDE",
  "COMPASS_USES_DIAMETER",
]);

for (let seed = 1; seed <= 200; seed += 1) {
  const problems = model.generateRun(seed);
  assert.equal(problems.length, 10, `seed ${seed}: ten problems`);
  const counts = new Map();
  for (const problem of problems) {
    counts.set(problem.radius, (counts.get(problem.radius) || 0) + 1);
    assert.ok(problem.radius >= 2 && problem.radius <= 6, `${problem.id}: radius is grade-appropriate`);
    assert.equal(problem.steps.length, 1, `${problem.id}: one visible action`);
    const step = problem.steps[0];
    assert.equal(problem.prompt, `반지름이 ${problem.radius} cm인 원을 그리려면?`);
    assert.equal(problem.finalExpression, `그대로 돌리면 반지름 ${problem.radius} cm인 원이 돼요.`);
    assert.equal(step.instruction, "바늘과 연필 사이의 길이를 골라요.");
    assert.equal(step.choices.length, 4, `${problem.id}: four compass choices`);
    assert.equal(step.choices.filter((choice) => choice.id === step.answerChoiceId).length, 1, `${problem.id}: one answer`);
    assert.equal(new Set(step.choices.map((choice) => choice.value)).size, 4, `${problem.id}: four distinct openings`);
    assert.ok(step.choices.some((choice) => choice.value === problem.radius * 2 && choice.misconceptionId === "COMPASS_USES_DIAMETER"), `${problem.id}: diameter misconception`);
    for (const choice of step.choices.filter((item) => item.id !== step.answerChoiceId)) {
      assert.ok(choice.misconceptionId, `${problem.id}: misconception id`);
      assert.ok(choice.feedback, `${problem.id}: short feedback`);
    }
  }
  for (const radius of [2, 3, 4, 5, 6]) {
    assert.equal(counts.get(radius), 2, `seed ${seed}: radius ${radius} appears twice`);
  }
}

const commonGain = config.rewardEvents.find((event) => event.id === "normal");
const smallLoss = config.rewardEvents.find((event) => event.id === "loss");
const empty = config.rewardEvents.find((event) => event.id === "empty");
assert.deepEqual(
  config.rewardEvents.map(({ id, weight, min, max }) => ({ id, weight, min, max })),
  [
    { id: "normal", weight: 6400, min: 6, max: 10 },
    { id: "loss", weight: 1500, min: -5, max: -2 },
    { id: "mega", weight: 1200, min: 14, max: 22 },
    { id: "perfect", weight: 500, min: 30, max: 30 },
    { id: "empty", weight: 380, min: 0, max: 0 },
    { id: "rainbow", weight: 20, min: 100, max: 100 },
  ],
  "reward probabilities and amounts must match mathmon-unified-reward-v1",
);
assert.deepEqual(
  config.results.map(({ minPower, minCorrect, needsSpecial = false }) => ({ minPower, minCorrect, needsSpecial })),
  [
    { minPower: 0, minCorrect: 0, needsSpecial: false },
    { minPower: 15, minCorrect: 2, needsSpecial: false },
    { minPower: 35, minCorrect: 4, needsSpecial: false },
    { minPower: 55, minCorrect: 6, needsSpecial: false },
    { minPower: 78, minCorrect: 8, needsSpecial: false },
    { minPower: 100, minCorrect: 1, needsSpecial: true },
  ],
  "result thresholds must match mathmon-unified-reward-v1",
);
assert.deepEqual(
  { min: config.wrongEvent.min, max: config.wrongEvent.max },
  { min: -6, max: -3 },
  "first wrong attempt must use the unified -6..-3 loss",
);
assert.ok(Math.abs(smallLoss.min) <= commonGain.min, "small loss must not erase more than the minimum common gain");
assert.ok(Math.abs(config.wrongEvent.min) <= commonGain.min, "wrong reward loss must stay within one minimum common gain");
assert.equal(empty.emptiesPower, undefined, "empty reward must not reset progress");
assert.deepEqual(
  JSON.parse(JSON.stringify(model.applyReward({ power: 37, specialSeen: false }, { ...empty, amount: 0 }))),
  { power: 37, specialSeen: false },
  "empty reward keeps current progress",
);
const perfect = config.rewardEvents.find((event) => event.id === "perfect");
assert.deepEqual(
  JSON.parse(JSON.stringify(model.applyReward({ power: 10, specialSeen: false }, { ...perfect, amount: 30 }))),
  { power: 40, specialSeen: false },
  "perfect reward must add 30 instead of jumping to an old fixed threshold",
);
const specialResult = model.getResult(100, 1, true);
assert.equal(model.getNextResult(specialResult).id, specialResult.id, "special result must remain the highest result");

assert.match(viewSource, /compass-choice-svg/, "each answer surface must show a compass opening");
const waitingMarkupSource = viewSource.match(/function targetRadiusMarkup[\s\S]*?function compassProofMarkup/)?.[0] || "";
assert.match(waitingMarkupSource, /waiting-trace-rotor/, "waiting screen must show the drawing path without an opened compass");
assert.match(viewSource, /waiting-draw-preview/, "waiting screen must trace the circle path before a choice");
assert.doesNotMatch(waitingMarkupSource, /proof-compass-leg|proof-opening-band|proof-joint/, "waiting screen must not reveal the correct compass opening");
assert.match(viewSource, /correct-anchor/, "correct proof must anchor the needle");
assert.match(viewSource, /correct-open/, "correct proof must show the matched opening");
assert.match(viewSource, /correct-draw/, "correct proof must draw the circle");
assert.match(viewSource, /complete-ready/, "completed circle must remain before reward");
assert.match(viewSource, /pathLength="1"/, "circle drawing path must expose normalized progress");
assert.match(viewSource, /COMPASS_TARGET_RADIUS \* opening \/ radius/, "compass opening and target radius must share one geometry scale");
assert.doesNotMatch(viewSource, /compass-reward-story|function onRewardPrepare/, "reward must not rebuild a full Stage story");
assert.match(viewSource, /function onRewardReveal/, "revealed reward state must have a lesson hook");
assert.match(viewSource, /function onRewardDismiss/, "reward dismissal must synchronize the problem screen");
assert.match(viewSource, /pendingCompassRewardImpact/, "background progress must wait until the modal is dismissed");
assert.match(viewSource, /function syncCompassPlayProgress\(state, options = \{\}\)/, "problem screen must synchronize and animate the current reward stage");
assert.match(viewSource, /animate:\s*true/, "reward dismissal must explicitly start the progress-panel effect");
assert.match(viewSource, /celebrate:\s*impact\.delta > 0/, "positive reward must trigger the celebratory effect");
assert.match(viewSource, /return syncCompassPlayProgress\(state, \{/, "next problem must await the progress-panel effect");
assert.match(viewSource, /globalThis\.onRewardReveal = onRewardReveal/, "reward reveal hook must be explicitly registered with the engine");
assert.match(viewSource, /globalThis\.onRewardDismiss = onRewardDismiss/, "reward dismissal hook must be explicitly registered with the engine");
assert.match(viewSource, /is-changing/, "positive progress changes must have an effect class");
assert.match(viewSource, /is-dimming/, "negative progress changes must have an effect class");
assert.match(viewSource, /is-celebrating/, "positive progress changes must have a strong celebratory effect class");
assert.match(viewSource, /is-tier-up/, "tier changes must have a dedicated high-impact effect class");
assert.match(viewSource, /effectStartedWithModalHidden/, "post-modal impact must record that the modal was already hidden");
assert.match(viewSource, /effectArmedAt/, "post-modal impact must expose its pre-effect attention delay");
assert.match(viewSource, /effectKind/, "reward impact kind must be exposed to the browser harness");
assert.match(viewSource, /syncProgress/, "browser harness must be able to establish a deterministic pre-tier fixture");
assert.match(viewSource, /compass-play-progress-flare/, "progress panel must include a visible flare layer");
assert.match(viewSource, /playProgressStates/, "problem screen must use dedicated play progress assets");
assert.match(viewSource, /primeCompassRewardArt\(\)/, "reward art must preload before the reveal");
assert.match(viewSource, /compassRewardPreloads/, "reward art must have a runtime-safe loading path");
assert.doesNotMatch(viewSource, /마법진 점수|마법진 등급|진행도/, "problem view must not contain reward panels");
assert.match(cssSource, /\.game\[data-workbench-type="compass-opening"\] \.reward-card\s*\{[^}]*width:\s*min\(560px,\s*88%\)/s, "reward modal card must follow the unit 3 modal width");
assert.match(cssSource, /\.game\[data-workbench-type="compass-opening"\] \.reward-card\s*\{[^}]*height:\s*480px/s, "reward modal card must follow the fixed unit 3 modal height");
assert.match(cssSource, /\.game\[data-workbench-type="compass-opening"\] \.reward-visual\s*\{[^}]*background-size:\s*cover/s, "reward modal art must fill its square");
assert.match(cssSource, /\.compass-play-progress\s*\{[^}]*top:\s*11%;\s*left:\s*2\.9%/s, "left progress panel must use its fixed Stage-relative position");
assert.doesNotMatch(cssSource, /@media\s*\(max-width:\s*980px\)[\s\S]*?\.compass-play-progress\s*\{[^}]*\b(?:top|left|width|max-height)\s*:/s, "responsive CSS must not move the fixed left progress panel");
assert.match(cssSource, /\.game\[data-workbench-type="compass-opening"\] \.reward-pop\s*\{[^}]*backdrop-filter:\s*blur\(9px\)/s, "reward modal must visibly blur the problem screen");
assert.match(cssSource, /@keyframes compass-play-progress-impact/, "reward dismissal must produce a strong progress-panel glow");
assert.match(cssSource, /@keyframes compass-play-progress-flare/, "reward dismissal must sweep a visible flare across the progress panel");
assert.match(cssSource, /@keyframes compass-play-progress-stage-impact/, "reward dismissal must spread a large impact beyond the progress card");
assert.match(cssSource, /\.compass-play-progress-impact-stage\s*\{[^}]*width:\s*35%/s, "large reward impact layer must occupy the left Stage lane");
assert.match(cssSource, /\.reward-card\[data-reward-phase="closed"\] \.reward-label\s*\{[^}]*display:\s*none/s, "closed reward must remove duplicate copy");
assert.doesNotMatch(cssSource, /\.compass-reward-story/, "Stage-Reveal lesson CSS must be removed");

console.log("QA_ENGINE_UNIT3_COMPASS_SOURCE: PASS");
