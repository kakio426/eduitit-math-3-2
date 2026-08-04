#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST_PATH = path.join(ROOT, "manifest.json");
const AUDIO_PATH = path.join(ROOT, "_shared", "audio", "mathmon-audio-v1.js");
const MARKER = 'data-mathmon-audio-standard="mathmon-audio-v1"';
const LEGACY_EXTERNAL_TAG = /\s*<script\s+src=["']\.\.\/_shared\/audio\/mathmon-audio-v1\.js(?:\?[^"']*)?["']><\/script>/i;
const INLINE_BLOCK = /\s*<script\s+data-mathmon-audio-standard=["']mathmon-audio-v1["'][^>]*>[\s\S]*?<\/script>/i;

function indent(source, spaces = 4) {
  const padding = " ".repeat(spaces);
  return source
    .trimEnd()
    .split("\n")
    .map((line) => (line ? padding + line : ""))
    .join("\n");
}

const manifest = JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
const audioSource = await readFile(AUDIO_PATH, "utf8");
if (audioSource.includes("</script>")) {
  throw new Error("shared audio source contains a closing script tag");
}
const inlineTag = `\n  <script ${MARKER} data-mathmon-audio-base="../_shared/audio/">\n${indent(audioSource)}\n  </script>`;

for (const lesson of manifest.lessons) {
  const indexPath = path.join(ROOT, lesson.folder, lesson.entryFile || "index.html");
  const before = await readFile(indexPath, "utf8");
  const withoutInline = before.replace(INLINE_BLOCK, "");
  const withoutLegacy = withoutInline.replace(LEGACY_EXTERNAL_TAG, "");
  const after = withoutLegacy.replace("</head>", `${inlineTag}\n</head>`);
  if (!after.includes(MARKER)) throw new Error(`${lesson.id}: inline audio marker was not written`);
  if (after !== before) await writeFile(indexPath, after);
  console.log(`${lesson.id}: ${after === before ? "current" : "synced"}`);
}
