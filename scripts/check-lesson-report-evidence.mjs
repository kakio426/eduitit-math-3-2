#!/usr/bin/env node
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const lesson = process.argv[2];
if (!lesson) {
  console.error("Usage: node scripts/check-lesson-report-evidence.mjs <lesson-folder>");
  process.exit(1);
}

const lessonDir = path.join(ROOT, lesson);
const config = JSON.parse(await readFile(path.join(ROOT, "_lessons", lesson, "lesson.json"), "utf8"));
const report = await readFile(path.join(lessonDir, "REPORT.md"), "utf8");
const indexBuffer = await readFile(path.join(lessonDir, "index.html"));
const manifest = JSON.parse(await readFile(path.join(lessonDir, "screenshots", "report-evidence-manifest.json"), "utf8"));
const hash = (buffer) => createHash("sha256").update(buffer).digest("hex");
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const exhaustiveStartMarker = "<!-- REPORT-EVIDENCE-ALL:START -->";
const exhaustiveEndMarker = "<!-- REPORT-EVIDENCE-ALL:END -->";
const exhaustiveStart = report.indexOf(exhaustiveStartMarker);
const exhaustiveEnd = report.indexOf(exhaustiveEndMarker);
assert(exhaustiveStart >= 0 && exhaustiveEnd > exhaustiveStart, "REPORT.md is missing the exhaustive screenshot section");
const exhaustiveSection = report.slice(exhaustiveStart, exhaustiveEnd + exhaustiveEndMarker.length);

assert(manifest.standard === "report-current-screen-evidence-v1", "report evidence standard is missing");
assert(manifest.lesson === lesson, "report evidence lesson id does not match");
assert(manifest.indexSha256 === hash(indexBuffer), "screenshots are older than the current index.html; recapture them");
assert(manifest.sourceScreenshotsCommitted === true, "raw browser screenshots must be committed so every REPORT.md image renders on GitHub");

const expectedViewports = config.qa?.viewports || [];
assert(manifest.viewports.length === expectedViewports.length, "not every qa viewport has a report contact sheet");
for (const expected of expectedViewports) {
  const viewport = manifest.viewports.find((item) => item.name === expected.name);
  assert(viewport, `missing report evidence viewport: ${expected.name}`);
  const expectedDpr = expected.deviceScaleFactor || expected.dpr || 1;
  assert(viewport.width === expected.width && viewport.height === expected.height && (viewport.dpr || 1) === expectedDpr, `viewport contract changed: ${expected.name}`);
  assert(report.includes(viewport.sheet), `REPORT.md does not embed ${viewport.sheet}`);
  const sheetBuffer = await readFile(path.join(lessonDir, viewport.sheet));
  assert(hash(sheetBuffer) === viewport.sheetSha256, `report contact sheet changed after manifest creation: ${viewport.sheet}`);

  const paths = viewport.screenshots.map((item) => item.path);
  const required = ["01-cover", "02-settings", "03-tutorial-1", "05-play-step1", "06-confirm", "08-result"];
  if (config.reward?.mode === "modal-art" && config.reward?.revealOnOpen === true) {
    required.push("07-reward-immediate");
  } else {
    required.push("07-reward-closed", "07b-reward-open");
  }
  if ((config.tutorial?.mode || "card-grid") === "poster-two-step") required.push("04-tutorial-2");
  const isEmptyRewardFixture = config.qa?.emptyRewardAudit === true
    && config.qa?.emptyRewardAuditViewport === expected.name;
  if (config.qa?.rewardEffectAudit && !isEmptyRewardFixture) required.push("07c-reward-impact");
  for (const token of required) {
    assert(paths.some((item) => item.includes(token)), `${expected.name} is missing ${token}`);
  }
  for (const state of config.qa?.resultVisualAudit?.expectedStates || []) {
    assert(paths.some((item) => item.endsWith(`08a-result-${state}.png`)), `${expected.name} is missing result state ${state}`);
  }
  if (config.qa?.resultPanelContainmentAudit?.standard === "result-panel-containment-v2") {
    for (const result of config.results || []) {
      assert(
        paths.some((item) => item.endsWith(`08d-result-panel-${result.id}.png`)),
        `${expected.name} is missing four-edge result-panel evidence for ${result.id}`,
      );
    }
  }
  assert(paths.filter((item) => item.includes("05m-")).length >= (config.qa?.misconceptionCoverage?.length || 0), `${expected.name} is missing misconception screenshots`);

}

const screenshotCount = manifest.viewports.reduce((sum, item) => sum + item.screenshotCount, 0);
for (const label of ["학생이 보는 것:", "판단하거나 누르는 것:", "화면에서 확인되는 수학 관계:", "다음 상태로 넘어가는 이유:"]) {
  const count = exhaustiveSection.split(label).length - 1;
  assert(count >= screenshotCount, `REPORT.md needs ${screenshotCount} '${label}' explanations, found ${count}`);
}

for (const heading of ["시작", "설명", "문제", "보상", "결과", "화면 크기"]) {
  assert(report.includes(heading), `REPORT.md needs a current-screen explanation for: ${heading}`);
}

console.log(`CHECK_LESSON_REPORT_EVIDENCE: PASS (${manifest.viewports.length} viewports, ${screenshotCount} screenshots)`);
