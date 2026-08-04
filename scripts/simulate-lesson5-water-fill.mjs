#!/usr/bin/env node
import { runLesson5Simulation } from "./lib/run-lesson5-simulation.mjs";

runLesson5Simulation({
  root: process.cwd(),
  lessonFolder: "3-2-5-1-mathmon-water-fill",
  passLabel: "LESSON5_WATER_FILL_SIMULATION",
});
