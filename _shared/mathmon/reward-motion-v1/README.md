# Reward motion raster actors

Generated with the built-in image_gen tool on 2026-09-08. Original: `sprites-source.png` (1254×1254 RGBA). Cropped actors are runtime WebP; no drawing or compositing was used to manufacture scene assets. The sprites are animated as separate DOM images during play, not presented as generated final result scenes.

Prompt: Create a production game animation asset sheet with a truly transparent background. Four isolated assets: front-facing navy/gold treasure vault body without a door, filled with gold and purple gems; matching opaque door with left hinges; right-facing side-view navy/gold steam locomotive and short carriage; isolated steam puffs. Polished warmly outlined colorful 2D fantasy game illustration. No characters, labels, text, shared ground, border or checkerboard drawing.

Runtime uses vault/door in lesson 4 and train in lesson 5. Steam is a generated spare and is not part of the runtime dependency graph. All actors share the existing lesson's gold/navy palette. The cabinet uses a 2D hinged door animation; the train translates and stops along the fixed route. Wheel rotation and 3D back-face geometry are not implemented.

Verification: `scripts/qa-mathmon-effect-perception.mjs` and `scripts/qa-mathmon-effect-edge.mjs`. Numeric thresholds are a minimum failure detector, not a substitute for visual sequence review.
