#!/usr/bin/env node
import { runLesson5ModelQa } from "./lib/run-lesson5-model-qa.mjs";

runLesson5ModelQa({
  root: process.cwd(),
  lessonFolder: "3-2-5-3-mathmon-scale-balance",
  passLabel: "LESSON5_SCALE_BALANCE_MODEL_QA",
});
