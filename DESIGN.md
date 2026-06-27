# AI Mart Mathmon Design System

## 1. Atmosphere & Identity

Eduitit Mathmon lessons feel like a bright classroom game board: playful, readable, and built around one clear learning action at a time. The signature is a 1280x800 stage with generated raster scenes behind crisp HTML controls, where the lesson reward object is always the visual hero.

## 2. Color

### Palette

| Role | Token | Value | Usage |
| --- | --- | --- | --- |
| Page | `--page` | `#111018` | Outer browser background |
| Panel | `--panel` | `#201a2d` | Dark lesson panels |
| Panel soft | `--panel-soft` | `#2b243a` | Secondary lesson panels |
| Ink | `--ink` | `#fff8e8` | Main student-facing text |
| Muted | `--muted` | `#d7cadb` | Supporting labels |
| Line | `--line` | `rgba(255, 255, 255, 0.16)` | Thin separators |
| Mint | `--mint` | `#35d9b2` | Progress and correct state |
| Amber | `--amber` | `#ffc857` | Primary buttons and reward focus |
| Rose | `--rose` | `#ff5d7a` | Mistake and repair state |
| Sky | `--sky` | `#60d7ff` | Unit badges and cool highlights |
| Violet | `--violet` | `#b88cff` | Rare reward accents |
| Deep | `--deep` | `#0e0c16` | Deep contrast surfaces |

### Rules

- Reward screens must spotlight the one lesson reward object before secondary status.
- Generated backgrounds stay visible; overlays may improve contrast but must not turn the scene black.
- Use warm amber for reward celebration and mint for measured progress.

## 3. Typography

### Scale

| Level | Size | Weight | Line Height | Usage |
| --- | --- | --- | --- | --- |
| Display | `clamp(2.4rem, 5.8vw, 4.7rem)` | 1000 | 0.98 | Result and cover titles |
| H2 | `clamp(1.8rem, 3.2vw, 2.8rem)` | 1000 | 1.05 | Major panel headings |
| Body large | `clamp(1.06rem, 2vw, 1.32rem)` | 950 | 1.35 | One-line praise and goal text |
| Body | `1rem` | 850-900 | 1.3-1.45 | Student instructions |
| Caption | `0.82rem` | 850-950 | 1.2 | Chips, labels, status |

### Font Stack

- Primary: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`

### Rules

- Student-facing Korean must stay short enough to read aloud in one breath.
- Avoid repeated title/body/button wording inside the same modal or result panel.
- Keep letter spacing at 0.

## 4. Spacing & Layout

### Base Unit

Spacing follows a 4px base. Existing lessons use compact multiples such as 8px, 10px, 12px, 16px, 24px, and 32px inside the fixed stage.

### Grid

- Stage size: 1280x800.
- Stage ratio: 16:10.
- Primary shell: `.stage-shell` owns width and aspect ratio.
- Controls: top badges and sound button share a fixed top-right reserve.

### Rules

- Problem screens prioritize big problem, current step, one-line instruction, and choices.
- Result screens show final score and one reward image first, with no more than two short supporting summaries.

## 5. Components

### Stage Shell

- **Structure**: `.game > .stage-shell > .screen`.
- **States**: one `.screen.is-active` at a time.
- **Accessibility**: sound button uses SVG and `aria-label`, not visible text.

### Reward Result

- **Structure**: generated raster background, oversized reward object, short title, one-line praise, compact progress/next-goal summary.
- **Variants**: normal tier, rare rainbow tier, retry.
- **Motion**: reveal with `transform` and `opacity`; avoid layout animation.

## 6. Motion & Interaction

### Timing

| Type | Duration | Usage |
| --- | --- | --- |
| Micro | 120-180ms | Button hover and active states |
| Standard | 300-700ms | Choice feedback and object pulse |
| Result reveal | 1200-2500ms | Final reward measuring and reveal |

### Rules

- Animate only `transform`, `opacity`, `filter`, or progress width where already established.
- Respect `prefers-reduced-motion`.

## 7. Depth & Surface

### Strategy

Mixed, with generated raster depth plus restrained HTML surfaces.

- Use borders and translucent panels for controls.
- Use drop shadows only to separate important reward objects from the scene.
- Do not stack cards inside cards unless it is a modal or a framed tool.
