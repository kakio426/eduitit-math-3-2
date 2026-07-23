#!/usr/bin/env node
import { runLesson5ModelQa } from "./lib/run-lesson5-model-qa.mjs";

runLesson5ModelQa({
  root: process.cwd(),
  lessonFolder: "3-2-5-1-mathmon-water-fill",
  passLabel: "LESSON5_WATER_FILL_MODEL_QA",
});
