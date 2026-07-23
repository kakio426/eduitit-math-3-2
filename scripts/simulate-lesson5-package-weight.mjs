#!/usr/bin/env node
import { runLesson5Simulation } from "./lib/run-lesson5-simulation.mjs";

runLesson5Simulation({
  root: process.cwd(),
  lessonFolder: "3-2-5-4-mathmon-package-weight",
  passLabel: "LESSON5_PACKAGE_WEIGHT_REWARD_SIM",
});
