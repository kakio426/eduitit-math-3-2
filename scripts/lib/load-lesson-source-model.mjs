import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function loadLessonSourceModel(root, lessonFolder) {
  const sourceDir = path.join(root, "_lessons", lessonFolder);
  const configPath = path.join(sourceDir, "lesson.json");
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const modelPath = path.resolve(sourceDir, config.sourceFiles?.model || "model.js");
  const source = fs.readFileSync(modelPath, "utf8");
  const context = vm.createContext({ console, LESSON_CONFIG: config, Math });
  const model = vm.runInContext(`${source}\n${config.modelName};`, context, { filename: modelPath });
  return { config, model, modelPath, sourceDir };
}
