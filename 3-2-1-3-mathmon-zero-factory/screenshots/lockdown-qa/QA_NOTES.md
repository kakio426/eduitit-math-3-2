# 3-2-1-3 Lockdown QA

Date: 2026-06-25

## Scope

- Browser target: `http://127.0.0.1:8876/3-2-1-3-mathmon-zero-factory/index.html`
- Viewport: `1280x800`
- Flow checked: cover -> tutorial -> play -> reward -> result
- Event hook used only for localhost QA: `?qaEvent=normal|megaFuel|leak|instantLaunch|emptyTank|rainbowFuel`

## Full Round

- Deterministic event: `qaEvent=normal`
- First sampled problem: `36 x 50`
- Correct core step: `36 x 5 = 180`
- Correct zero step: `0을 1개 붙이기`
- Completed problems: `10/10`
- Result: `세계`
- Final factory power: `100`
- Download card: `카드 받기`

## Reward Event Checks

| Event | Visible label | Closed box | Overlay | Percent hidden | Mathmon hidden |
| --- | --- | --- | --- | --- | --- |
| `normal` | `상자 출발!` | OK | Hidden | OK | OK |
| `megaFuel` | `상자 3개 출발!` | OK | Hidden | OK | OK |
| `leak` | `상자 고치기` | OK | Visible | OK | OK |
| `instantLaunch` | `문이 열렸어요!` | OK | Hidden | OK | OK |
| `emptyTank` | `컨베이어 멈춤` | OK | Visible | OK | OK |
| `rainbowFuel` | `무지개 상자!` | OK | Visible | OK | OK |

## Screenshots

- `01-cover.png`
- `02-tutorial.png`
- `03-problem-step1.png`
- `04-problem-step2-after-next.png`
- `05-reward.png`
- `06-result.png`
- `event-normal.png`
- `event-megaFuel.png`
- `event-leak.png`
- `event-instantLaunch.png`
- `event-instantLaunch-result.png`
- `event-emptyTank.png`
- `event-rainbowFuel.png`

## Notes

- Tutorial image now shows the zero flow and closed shipping boxes only. It does not reveal a Mathmon reward early.
- Problem screen keeps the main math action on top: large problem, current step, one-line prompt, and choices.
- Reward modal uses one visible reward label plus one button. It does not show `%`, long explanations, or Mathmon character art.
- Official screenshots were refreshed again after the product-design + humanizer audit.
