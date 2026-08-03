# Tutorial page 2 v4 imagegen prompt

Use case: text-localization

Asset type: 1280x800 Korean elementary math game tutorial poster, page 2

Input images: Image 1 is the edit target and the sole visual source.

Primary request: Change only three Korean sentences in Image 1. Preserve every other pixel-level visual idea, illustration, character, bridge, panel, button, layout, spacing, hierarchy, lighting, and color as closely as possible.

Text replacements, verbatim:

1. Replace `맞히면 다리 힘이 늘어요.` with `맞히면 다리가 더 멋져질 수 있어요.`
2. Replace `가끔 줄어들 수도 있어요.` with `가끔은 다리가 작아질 수도 있어요.`
3. Replace `마지막에 다리 이름을 봐요.` with `마지막에 내가 만든 다리를 봐요.`

Text that must remain verbatim:

- `무엇을 얻어요?`
- `10문제를 풀어요.`
- `이전`
- `문제 시작`

Typography and placement:

- Keep the same bold rounded Korean game-poster lettering, color, outline, panel alignment, and visual hierarchy as Image 1.
- Fit each replacement naturally inside its existing text area with comfortable padding; no clipping, no overflow, no awkward forced line break.
- Keep the first and third top panel sentences white. Keep the middle lower sentence red.
- Render every Korean syllable and punctuation mark exactly as written. No extra text, no missing particles, no spelling variants.

Critical invariants:

- Change text only.
- Keep the canvas landscape 16:10 and the full composition unchanged.
- Keep the left otter with exactly two arms and exactly two visible paws/hands; no extra limb, paw, finger cluster, or duplicated body part.
- Keep all six bridge progression examples in the left card: single log, small plank bridge, wooden arch bridge, stone arch bridge, ornate golden double-arch bridge, rainbow crystal bridge.
- Keep the two middle bridge change diagrams and the right completion-board scene unchanged.
- Keep both otter characters, all anatomy, poses, expressions, accessories, arrows, bridge shapes, panel borders, background scenery, and buttons unchanged.
- No new objects, no extra symbols, no watermark, no logo changes, no text outside the existing text regions.
