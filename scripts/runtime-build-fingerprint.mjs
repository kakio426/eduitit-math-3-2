import { createHash } from "node:crypto";

export function hashRuntimeBuildInputs(entries) {
  const hash = createHash("sha256");
  for (const [name, value] of Object.entries(entries).sort(([left], [right]) => left.localeCompare(right))) {
    const source = String(value ?? "");
    hash.update(`${name.length}:${name}:${Buffer.byteLength(source)}:`);
    hash.update(source);
  }
  return hash.digest("hex");
}
