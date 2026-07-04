#!/usr/bin/env node
// Build the GitHub Pages upload tree and fail early when deploy-only assets drift.
import { cp, lstat, mkdir, readdir, readFile, rm, stat } from "node:fs/promises";
import path from "node:path";

const ASSET_EXTENSIONS = "png|webp|jpe?g|gif|svg|css|js|wav|mp3|json|html";
const WARN_BYTES = 500 * 1024 * 1024;
const FAIL_BYTES = 750 * 1024 * 1024;
const ROOT_ASSET_FILES = [".nojekyll", "manifest.json"];
const TEXT_EXTENSIONS = new Set([".html", ".css", ".js", ".mjs", ".svg"]);
const DOCUMENT_FILES = new Set([
  "README.md",
  "REPORT.md",
  "PLAN.md",
  "IMAGE_PLAN.md",
  "QUALITY_AUDIT.md",
]);
const PRUNE_DIRS = new Set(["screenshots", "raw-chromakey", "contact-sheets"]);

function parseArgs(argv) {
  const args = {
    check: false,
    out: "_site",
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--check") {
      args.check = true;
    } else if (arg === "--out") {
      index += 1;
      if (!argv[index]) throw new Error("--out requires a path");
      args.out = argv[index];
    } else {
      throw new Error(`unknown argument: ${arg}`);
    }
  }

  return args;
}

async function pathExists(filePath) {
  try {
    await lstat(filePath);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function isLessonDir(name) {
  return /^3-2-/.test(name);
}

function isDocumentationFile(name) {
  return DOCUMENT_FILES.has(name) || name.endsWith(".md");
}

function isSourceAsset(name) {
  const lower = name.toLowerCase();
  return lower.includes("-source.")
    || lower.endsWith("-transparent-raw.png")
    || lower.includes("chromakey");
}

function isExternalReference(value) {
  return /^(?:[a-z][a-z0-9+.-]*:|#)/i.test(value);
}

function stripQueryAndHash(value) {
  return value.split("#")[0].split("?")[0];
}

function decodePathname(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeReference(value) {
  const cleaned = decodePathname(stripQueryAndHash(value.trim()));
  if (!cleaned || isExternalReference(cleaned)) return null;
  if (!new RegExp(`\\.(${ASSET_EXTENSIONS})$`, "i").test(cleaned)) return null;
  return cleaned;
}

function resolveReference(siteRoot, fromFile, value) {
  const normalized = normalizeReference(value);
  if (!normalized) return null;
  const base = normalized.startsWith("/")
    ? siteRoot
    : path.dirname(fromFile);
  const resolved = path.resolve(base, normalized.replace(/^\/+/, ""));
  if (!resolved.startsWith(`${siteRoot}${path.sep}`) && resolved !== siteRoot) return null;
  return resolved;
}

function collectReferences(text, siteRoot, fromFile, references, missing) {
  const attrPattern = new RegExp(
    `([\\w:-]+)=["']([^"']+\\.(${ASSET_EXTENSIONS})(?:[?#][^"']*)?)["']`,
    "gi"
  );
  const urlPattern = new RegExp(
    `url\\(\\s*["']?([^"')]+\\.(${ASSET_EXTENSIONS})(?:[?#][^"')]+)?)["']?\\s*\\)`,
    "gi"
  );
  const jsAssetPattern = new RegExp(
    `\\b(?:asset|background|image|src|titleArt|titleImage)\\s*:\\s*["']([^"']+\\.(${ASSET_EXTENSIONS})(?:[?#][^"']*)?)["']`,
    "gi"
  );

  for (const match of text.matchAll(attrPattern)) {
    if (match[1].toLowerCase() === "download") continue;
    const resolved = resolveReference(siteRoot, fromFile, match[2]);
    if (!resolved) continue;
    references.add(resolved);
    missing.push({ fromFile, resolved, value: match[2] });
  }

  for (const pattern of [urlPattern, jsAssetPattern]) {
    for (const match of text.matchAll(pattern)) {
      const resolved = resolveReference(siteRoot, fromFile, match[1]);
      if (!resolved) continue;
      references.add(resolved);
      missing.push({ fromFile, resolved, value: match[1] });
    }
  }
}

async function walk(dir, visitor) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const filePath = path.join(dir, entry.name);
    if (await visitor(filePath, entry) === false) continue;
    if (entry.isDirectory()) await walk(filePath, visitor);
  }
}

async function collectFiles(dir) {
  const files = [];
  await walk(dir, async (filePath, entry) => {
    if (entry.isFile()) files.push(filePath);
  });
  return files;
}

async function copyRootEntries(root, outDir) {
  await rm(outDir, { force: true, recursive: true });
  await mkdir(outDir, { recursive: true });

  for (const file of ROOT_ASSET_FILES) {
    const source = path.join(root, file);
    if (await pathExists(source)) await cp(source, path.join(outDir, file));
  }

  const entries = await readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name !== "_shared" && !isLessonDir(entry.name)) continue;
    await cp(path.join(root, entry.name), path.join(outDir, entry.name), {
      recursive: true,
    });
  }
}

async function pruneDeployExcludedFiles(outDir) {
  await walk(outDir, async (filePath, entry) => {
    if (entry.isDirectory() && PRUNE_DIRS.has(entry.name)) {
      await rm(filePath, { force: true, recursive: true });
      return false;
    }

    if (!entry.isFile()) return true;
    if (isDocumentationFile(entry.name) || isSourceAsset(entry.name)) {
      await rm(filePath, { force: true });
    }
    return true;
  });
}

async function collectRuntimeReferences(siteRoot) {
  const files = await collectFiles(siteRoot);
  const references = new Set();
  const candidates = [];

  for (const file of files) {
    if (!TEXT_EXTENSIONS.has(path.extname(file))) continue;
    if (relative(siteRoot, file) === "_shared/scoreboard/scoreboard-ui.js") continue;
    const text = await readFile(file, "utf8");
    collectReferences(text, siteRoot, file, references, candidates);
  }

  const missing = [];
  for (const candidate of candidates) {
    if (!(await pathExists(candidate.resolved))) missing.push(candidate);
  }

  return { missing, references };
}

async function removeUnreferencedPngAlternates(siteRoot, references) {
  const files = await collectFiles(siteRoot);
  let removed = 0;
  let removedBytes = 0;

  for (const file of files) {
    if (path.extname(file).toLowerCase() !== ".png") continue;
    if (references.has(file)) continue;

    const webpAlternative = file.replace(/\.png$/i, ".webp");
    if (!(await pathExists(webpAlternative))) continue;

    const stats = await stat(file);
    await rm(file, { force: true });
    removed += 1;
    removedBytes += stats.size;
  }

  return { removed, removedBytes };
}

async function directorySize(dir) {
  let total = 0;
  await walk(dir, async (filePath, entry) => {
    if (entry.isFile()) total += (await stat(filePath)).size;
  });
  return total;
}

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function relative(root, filePath) {
  return path.relative(root, filePath).split(path.sep).join("/");
}

const args = parseArgs(process.argv.slice(2));
const root = process.cwd();
const outDir = path.resolve(root, args.out);

if (outDir === root) {
  throw new Error("--out must not point at the repository root");
}

await copyRootEntries(root, outDir);
await pruneDeployExcludedFiles(outDir);

let referenceCheck = await collectRuntimeReferences(outDir);
if (referenceCheck.missing.length > 0) {
  console.error("Missing deploy asset references before PNG pruning:");
  for (const item of referenceCheck.missing.slice(0, 30)) {
    console.error(`- ${relative(outDir, item.fromFile)} -> ${item.value}`);
  }
  process.exit(1);
}

const removedPng = await removeUnreferencedPngAlternates(outDir, referenceCheck.references);
referenceCheck = await collectRuntimeReferences(outDir);
if (referenceCheck.missing.length > 0) {
  console.error("Missing deploy asset references after PNG pruning:");
  for (const item of referenceCheck.missing.slice(0, 30)) {
    console.error(`- ${relative(outDir, item.fromFile)} -> ${item.value}`);
  }
  process.exit(1);
}

const totalBytes = await directorySize(outDir);
console.log(`Pages artifact directory: ${relative(root, outDir)}`);
console.log(`Pages artifact size: ${formatBytes(totalBytes)}`);
console.log(`Removed unreferenced PNG alternates: ${removedPng.removed} (${formatBytes(removedPng.removedBytes)})`);

if (totalBytes >= FAIL_BYTES) {
  console.error(`Pages artifact exceeds hard limit: ${formatBytes(totalBytes)} >= ${formatBytes(FAIL_BYTES)}`);
  process.exit(1);
}

if (totalBytes >= WARN_BYTES) {
  console.warn(`::warning::Pages artifact is large: ${formatBytes(totalBytes)} >= ${formatBytes(WARN_BYTES)}`);
}

if (args.check) {
  console.log("Pages artifact check passed.");
}
