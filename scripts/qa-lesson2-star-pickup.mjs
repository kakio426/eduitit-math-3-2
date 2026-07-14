#!/usr/bin/env node
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SEED = process.argv[2] || "3223";
const QA_SCRIPT = path.join(ROOT, "scripts", "qa-lesson-flow.mjs");

const child = spawn(
  process.execPath,
  [QA_SCRIPT, "3-2-2-3-mathmon-star-pickup", SEED],
  { cwd: ROOT, stdio: "inherit" }
);

child.on("error", (error) => {
  console.error(error);
  process.exitCode = 1;
});

child.on("exit", (code, signal) => {
  if (signal) {
    console.error(`Star Pickup QA stopped by ${signal}`);
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
