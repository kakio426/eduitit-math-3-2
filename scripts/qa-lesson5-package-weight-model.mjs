#!/usr/bin/env node
import { runLesson5ModelQa } from "./lib/run-lesson5-model-qa.mjs";

runLesson5ModelQa({
  root: process.cwd(),
  lessonFolder: "3-2-5-4-mathmon-package-weight",
  passLabel: "LESSON5_PACKAGE_WEIGHT_MODEL_QA",
});
