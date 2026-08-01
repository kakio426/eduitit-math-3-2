#!/usr/bin/env node
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CHROME = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
].find(existsSync);

function isTarget(folder) {
  const match = folder.match(/^3-2-(\d+)-(\d+)-/);
  if (!match) return false;
  const unit = Number(match[1]);
  const lesson = Number(match[2]);
  return (unit === 3 && lesson >= 3) || (unit >= 4 && unit <= 6);
}

function hash(file) {
  return createHash("sha256").update(readFileSync(file)).digest("hex");
}

function selectEvidence(files, screenshotDir) {
  const states = [
    /desktop.*cover.*\.png$/, /tablet-landscape.*cover.*\.png$/,
    /desktop.*play.*\.png$/, /tablet-landscape.*play.*\.png$/,
    /desktop.*wrong.*\.png$/, /tablet-landscape.*wrong.*\.png$/,
    /desktop.*(?:confirm|complete).*\.png$/, /tablet-landscape.*(?:confirm|complete).*\.png$/,
    /(?:desktop.*reward|reward.*desktop).*closed.*\.png$/, /(?:desktop.*reward|reward.*open.*desktop).*\.png$/,
    /(?:desktop.*result|result.*desktop).*\.png$/, /(?:tablet-landscape.*result|result.*tablet-landscape).*\.png$/,
  ];
  const selected = [];
  for (const pattern of states) {
    const match = files
      .filter((file) => pattern.test(file))
      .sort((a, b) => statSync(path.join(screenshotDir, b)).mtimeMs - statSync(path.join(screenshotDir, a)).mtimeMs)[0];
    if (match && !selected.includes(match)) selected.push(match);
  }
  return selected.slice(0, 12);
}

const requested = process.argv.slice(2);
const folders = requested.length ? requested : readdirSync(ROOT).filter(isTarget).sort();
if (!CHROME) throw new Error("Chrome binary not found; report contact sheets cannot be rendered.");

for (const folder of folders) {
  if (!isTarget(folder)) throw new Error(`${folder}: outside the unit 3 lesson 3 through unit 6 lesson 4 audit range`);
  const lessonDir = path.join(ROOT, folder);
  const screenshotDir = path.join(lessonDir, "screenshots");
  const indexPath = path.join(lessonDir, "index.html");
  if (!existsSync(indexPath) || !existsSync(screenshotDir)) throw new Error(`${folder}: index or screenshots directory is missing`);
  const allPng = readdirSync(screenshotDir).filter((file) => file.endsWith(".png")).sort();
  const evidence = selectEvidence(allPng, screenshotDir);
  if (evidence.length < 6) throw new Error(`${folder}: fewer than six representative browser screenshots`);
  const cards = evidence.map((file) => `<figure><img src="${encodeURI(file)}" alt=""><figcaption>${file}</figcaption></figure>`).join("\n");
  const htmlPath = path.join(screenshotDir, "report-contact-sheet.html");
  const pngPath = path.join(screenshotDir, "report-contact-sheet.png");
  writeFileSync(htmlPath, `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#18201d;color:#fff;font:16px system-ui}h1{margin:0 0 20px}.grid{display:grid;grid-template-columns:repeat(2,600px);gap:18px}figure{margin:0;padding:10px;background:#fff;color:#14201b;border-radius:12px}img{display:block;width:580px;height:363px;object-fit:contain;background:#dfe8e3}figcaption{padding-top:7px;font-size:13px;overflow-wrap:anywhere}</style><h1>${folder} · current browser evidence</h1><div class="grid">${cards}</div>`, "utf8");
  const rows = Math.ceil(evidence.length / 2);
  execFileSync(CHROME, [
    "--headless=new", "--hide-scrollbars", "--disable-gpu", "--allow-file-access-from-files",
    "--virtual-time-budget=2000", `--window-size=1280,${Math.max(800, 100 + rows * 410)}`,
    `--screenshot=${pngPath}`, `file://${htmlPath}`,
  ], { stdio: "ignore" });
  const files = evidence.map((file) => {
    const absolute = path.join(screenshotDir, file);
    return { file, sha256: hash(absolute), bytes: statSync(absolute).size, mtimeMs: statSync(absolute).mtimeMs };
  });
  const indexMtimeMs = statSync(indexPath).mtimeMs;
  if (files.some((entry) => entry.mtimeMs + 1000 < indexMtimeMs)) {
    throw new Error(`${folder}: representative screenshot predates the current index.html`);
  }
  const manifest = {
    standard: "lesson-report-evidence-v1",
    lesson: folder,
    generatedAt: new Date().toISOString(),
    index: { file: "index.html", sha256: hash(indexPath), mtimeMs: indexMtimeMs },
    contactSheet: { file: "screenshots/report-contact-sheet.png", sha256: hash(pngPath) },
    sourceScreenshotsCommitted: false,
    screenshots: files,
  };
  writeFileSync(path.join(screenshotDir, "report-evidence-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  console.log(`REPORT_SHEET: ${folder} (${evidence.length} screenshots)`);
}
