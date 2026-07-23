#!/usr/bin/env node
import { runLesson5ModelQa } from "./lib/run-lesson5-model-qa.mjs";

runLesson5ModelQa({
  root: process.cwd(),
  lessonFolder: "3-2-5-2-mathmon-drink-order",
  passLabel: "LESSON5_DRINK_ORDER_MODEL_QA",
});
