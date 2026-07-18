import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const lessonPattern = /^3-2-[1-6]-\d+-mathmon-/;
const entries = await readdir(root, { withFileTypes: true });
const lessonDirs = entries
  .filter((entry) => entry.isDirectory() && lessonPattern.test(entry.name))
  .map((entry) => entry.name)
  .sort();

const failures = [];

for (const lessonDir of lessonDirs) {
  const indexPath = path.join(root, lessonDir, "index.html");
  const html = await readFile(indexPath, "utf8");
  if (/data-scoreboard-enabled="true"/.test(html)) {
    failures.push(`${lessonDir}: data-scoreboard-enabled must not be true`);
  }
}

const lessonSourceRoot = path.join(root, "_lessons");
const sourceEntries = await readdir(lessonSourceRoot, { withFileTypes: true });
for (const entry of sourceEntries) {
  if (!entry.isDirectory() || !lessonPattern.test(entry.name)) continue;
  const lessonJsonPath = path.join(lessonSourceRoot, entry.name, "lesson.json");
  const lessonJson = JSON.parse(await readFile(lessonJsonPath, "utf8"));
  if (lessonJson.scoreboard?.enabled === true) {
    failures.push(`_lessons/${entry.name}/lesson.json: scoreboard.enabled must not be true`);
  }
  if (lessonJson.qa?.requiredFlow?.includes("scoreboard")) {
    failures.push(`_lessons/${entry.name}/lesson.json: scoreboard must not be a required QA screen`);
  }
}

const sharedJs = await readFile(path.join(root, "_shared/scoreboard/scoreboard-ui.js"), "utf8");
if (!sharedJs.includes("const SCOREBOARD_PRODUCT_ENABLED = false")) {
  failures.push("_shared/scoreboard/scoreboard-ui.js: default-disabled API guard is missing");
}

const sharedCss = await readFile(path.join(root, "_shared/scoreboard/scoreboard-ui.css"), "utf8");
if (!sharedCss.includes(".mathmon-scoreboard") || !sharedCss.includes("display: none !important")) {
  failures.push("_shared/scoreboard/scoreboard-ui.css: ranking UI hide guard is missing");
}

const rocketHtml = await readFile(path.join(root, "3-2-1-2-mathmon-rocket-charge/index.html"), "utf8");
if (!rocketHtml.includes('const SCOREBOARD_API_URL = "";')) {
  failures.push("3-2-1-2-mathmon-rocket-charge: direct score API must stay disabled");
}

if (failures.length) {
  console.error("Ranking-disabled contract failed:\n" + failures.map((item) => `- ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Ranking-disabled contract passed for ${lessonDirs.length} lesson packages.`);
