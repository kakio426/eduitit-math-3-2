#!/usr/bin/env node
import { runLesson5Simulation } from "./lib/run-lesson5-simulation.mjs";

runLesson5Simulation({
  root: process.cwd(),
  lessonFolder: "3-2-5-3-mathmon-scale-balance",
  passLabel: "LESSON5_SCALE_BALANCE_SIMULATION",
});
