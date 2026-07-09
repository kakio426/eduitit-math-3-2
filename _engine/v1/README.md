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

The first pilot is `3-2-5-1-mathmon-water-fill`; later migrations should keep existing lesson folders and URLs stable while moving their source into `_lessons/`.
