#!/usr/bin/env node
import { runLesson5Simulation } from "./lib/run-lesson5-simulation.mjs";

runLesson5Simulation({
  root: process.cwd(),
  lessonFolder: "3-2-5-2-mathmon-drink-order",
  passLabel: "LESSON5_DRINK_ORDER_SIMULATION",
});
