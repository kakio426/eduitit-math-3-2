# Mathmon Engine v1

This engine keeps the student-facing package shape unchanged: each lesson still ships as a folder with one inline `index.html` plus local/shared image assets.

The source shape is split:

- `_engine/v1/template.html` owns the shared Stage markup and screen skeleton.
- `_engine/v1/styles/core.css` owns shared 1280x800 Stage, cover, settings, tutorial, play, reward, and result styles.
- `_engine/v1/runtime/core.js` owns shared flow: cover -> tutorial -> play -> reward -> result, settings modal, audio preferences, random reward application, and result rendering.
- `_lessons/<lesson-folder>/lesson.json` declares lesson text, result tiers, reward events, standards, QA targets, and asset filenames.
- `_lessons/<lesson-folder>/model.js` generates problems and validates choices.
- `_lessons/<lesson-folder>/view.js` renders the current problem workbench.

Build a lesson with:

```bash
node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill
```

Check source-driven lessons with:

```bash
node scripts/check-lesson-contract.mjs
```

Run browser flow QA with:

```bash
node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers
```

The migration pilot is `3-2-5-1-mathmon-water-fill`; the first new source-built lesson pilot is `3-2-6-1-mathmon-data-rangers`. Later migrations should keep existing lesson folders and URLs stable while moving their source into `_lessons/`.

## v1.1 contract expansion

Current `v1` is a pilot shell, not yet the full common platform for migrated lessons. Before using it as the default migration target for existing lessons, expand the contract in these areas:

- Wireframe and screen registry: cover, tutorial, play, inline reward, modal reward, full-stage reward, result, and scoreboard.
- Cover UX: generated title overlay, generated start button art, start button layout variants, and hitbox/art geometry checks.
- Tutorial UX: two-poster generated tutorial flow as a first-class mode, separate from card-grid tutorials.
- Problem workbench API: lesson-owned mount/render/confirm/reset hooks so each lesson keeps its math manipulation board while the engine owns the shell.
- Reward modes: `inline-panel`, `modal-art`, and `stage-full`, all sharing reward event weighting, result payload, and QA hooks.
- Result modes: `hybrid-generated-dynamic`, `fullscene-score-slot`, and `simple-generated`, with reveal timing and action hitboxes.
- Scoreboard: shared scoreboard screen slot using `_shared/scoreboard` UI and the existing Railway `/api/v1/sessions`, `/api/v1/scores`, and `/api/v1/leaderboards/weekly` contract, with lesson adapters normalized to the `createApiBridge` interface.
- Browser QA: real cover -> tutorial -> play -> reward -> result -> scoreboard flow checks, plus geometry overflow and broken image audits at 1280x800 and 1024x768.

## Unit 2 gold standard

`3-2-2-2-mathmon-elevator` established the Unit 2 gold standard. The same contract now drives all four Unit 2 lessons: divide farm, elevator, star pickup, and check lock.

- The full generated `board-shaft-generated.webp` owns the problem scene.
- The lesson view owns one precise SVG division board and labelled choice hitboxes.
- Compound choices carry explicit parts such as `십의 자리 몫` and `나머지`; the SVG board connects the latter to `나머지(남은 십)`. Color is never the only meaning.
- Wrong choices carry `misconceptionId` and short visual feedback.
- The runtime records every attempt in `stepRecord.attempts` instead of discarding later corrections.
- Poster tutorials use generated page art with transparent next/back hitboxes.
- `modal-art` rewards and `hybrid-generated-dynamic` results are first-class schema modes.

Build and verify Unit 2 with:

```bash
node scripts/build-lesson.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-engine-unit2-elevator-source.mjs
node scripts/qa-lesson-flow.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-engine-unit2-divide-farm-source.mjs
node scripts/qa-engine-unit2-star-source.mjs
node scripts/qa-engine-unit2-check-lock-source.mjs
```
