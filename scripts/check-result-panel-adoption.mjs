#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const PANEL_STANDARD = "result-panel-containment-v2";
const DOMINANCE_STANDARD = "result-primary-reward-dominance-v1";
const baseRef = process.argv[2] || process.env.MATHMON_CHANGED_BASE || "origin/main";

function git(args, options = {}) {
  return execFileSync("git", args, { cwd:ROOT, encoding:"utf8", stdio:["ignore", "pipe", "pipe"], ...options }).trim();
}

function lessonFromResultAsset(file) {
  const direct = file.match(/^(3-2-[1-6]-[1-4]-[^/]+)\/result-[^/]+\.(?:png|webp)$/);
  if (direct) {
    const lesson = direct[1];
    if (file.endsWith(".webp")) return lesson;
    // Source/provenance PNGs do not alter the running result screen. A PNG only
    // triggers adoption when lesson.json actually connects it to the package.
    const configPath = path.join(ROOT, "_lessons", lesson, "lesson.json");
    const configSource = readFileSync(configPath, "utf8");
    return configSource.includes(path.basename(file)) ? lesson : null;
  }
  const shared = file.match(/lesson-scenes\/(3-2-[1-6]-[1-4])\//);
  if (!shared || !/\/result(?:-|\/|_)/.test(file)) return null;
  const prefix = `${shared[1]}-`;
  const folders = git(["ls-tree", "-d", "--name-only", "HEAD", "_lessons/*"])
    .split("\n")
    .map((entry) => path.basename(entry))
    .filter((entry) => entry.startsWith(prefix));
  return folders.length === 1 ? folders[0] : null;
}

function resultContractChanged(file) {
  const match = file.match(/^_lessons\/([^/]+)\/lesson\.json$/);
  if (!match) return null;
  const lesson = match[1];
  let before = null;
  try {
    before = JSON.parse(git(["show", `${baseRef}:${file}`]));
  } catch {}
  const after = JSON.parse(readFileSync(path.join(ROOT, file), "utf8"));
  if (!before) return lesson;
  const pickResultContract = (config) => ({
    result: config.result,
    results: config.results,
    standard: config.standards?.resultPanelContainment,
    audit: config.qa?.resultPanelContainmentAudit,
    dominanceStandard: config.standards?.resultRewardDominance,
    dominanceAudit: config.qa?.resultRewardDominanceAudit,
  });
  return JSON.stringify(pickResultContract(before))
    === JSON.stringify(pickResultContract(after)) ? null : lesson;
}

let changedFiles;
try {
  const tracked = git(["diff", "--name-only", "--diff-filter=ACMR", baseRef, "--"]);
  const untracked = git(["ls-files", "--others", "--exclude-standard"]);
  changedFiles = [...new Set(`${tracked}\n${untracked}`.split("\n").filter(Boolean))];
} catch (error) {
  console.error(`CHECK_RESULT_PANEL_ADOPTION: FAIL (${baseRef} is not available)`);
  process.exitCode = 1;
  process.exit();
}

const lessons = new Set();
for (const file of changedFiles) {
  const fromAsset = lessonFromResultAsset(file);
  if (fromAsset) lessons.add(fromAsset);
  const fromConfig = resultContractChanged(file);
  if (fromConfig) lessons.add(fromConfig);
}

const failures = [];
for (const lesson of [...lessons].sort()) {
  const config = JSON.parse(await readFile(path.join(ROOT, "_lessons", lesson, "lesson.json"), "utf8"));
  if (config.standards?.resultPanelContainment !== PANEL_STANDARD
    || config.qa?.resultPanelContainmentAudit?.standard !== PANEL_STANDARD) {
    failures.push(`${lesson}: changed result assets/config must adopt ${PANEL_STANDARD}`);
  }
  if (config.standards?.resultRewardDominance !== DOMINANCE_STANDARD
    || config.qa?.resultRewardDominanceAudit?.standard !== DOMINANCE_STANDARD) {
    failures.push(`${lesson}: changed result assets/config must adopt ${DOMINANCE_STANDARD}`);
  }
}

if (failures.length) {
  console.error("CHECK_RESULT_PANEL_ADOPTION: FAIL");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("CHECK_RESULT_PANEL_ADOPTION: PASS");
  console.log(JSON.stringify({ baseRef, lessonsChecked:[...lessons].sort() }, null, 2));
}
