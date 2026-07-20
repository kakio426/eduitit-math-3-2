# 매스몬 엘리베이터

3학년 2학기 2단원 2차시, 내림 있는 두 자리 수 나눗셈 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 독수리몬입니다.

## 학습 조작

1. 십의 자리에서 `몫 20`, `남은 수 10`처럼 실제 값을 고릅니다.
2. 남은 수와 일의 자리 수를 합쳐 아래 칸으로 내립니다.
3. 내려온 수를 나눈 몫을 고릅니다.

내림 단계도 네 선택지에서 합친 수를 고릅니다. 몫과 남은 수는 색이 아니라 글자로 표시합니다. 한 문제의 정답 경로는 서로 다른 수학 판단 3회이며, 마지막에는 완성식을 확인한 뒤 `문 열기`를 한 번 누릅니다.

문제 풀이 중에는 고를 자리의 상자가 보이지만, 마지막 확인에서는 상자를 모두 접고 교과서식 세로셈만 보여 줍니다. `65÷5`라면 `13 → 65 → −5 → 15 → −15 → 0`의 계산 순서가 한눈에 이어집니다.

## 이미지 계약

- 설명 배경 2장: 글자 없는 엘리베이터 장면, 각 1280×800. `76÷2=38` 세로셈과 10문제·도착 층 안내는 정확한 SVG/HTML UI로 따로 그립니다.
- 문제 장면 3장: 대기 / 하강 / 도착, 각 1280×800
- 독수리몬 반응 3장: 정답 / 오답 / 보상, 각 512×640
- 보상: 닫힌 문 1장 + 사건 6종
- 결과: 제목·다시 버튼이 포함된 도착 장면 6장 + 정답 수 + 올라갈 힘
- 최저 결과: `0/10`, 힘 0이어도 `지하 정비층`에 도착합니다. `다시 준비` 결과는 현재 실행 흐름에서 사용하지 않습니다.
- 컨택시트: `problem-state-contact-sheet.png`, `result-tiers-v2-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/eaglemon-reactions-contact-sheet.png`

## 제품 정책

- 전국 순위 문구, 버튼, 화면, 점수 제출·조회는 비활성화되어 학생 흐름에 나타나지 않습니다.

## 검증

```bash
node scripts/build-lesson.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-model.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson-flow.mjs 3-2-2-2-mathmon-elevator
node scripts/qa-lesson2-elevator.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

추가 화면 QA는 Codex 브라우저와 같은 931×897 및 사용자가 SVG 겹침과 완료 계산판 과밀을 발견한 934×987(DPR 2)에서도 진행합니다. `seed=61`로 첫 문제 `65÷5`를 고정하고 몫 과대·과소, 내림 오답, 마지막 몫 과대·과소, 상자 없는 완료 세로셈을 결정적으로 재현한 뒤 `0/10` 최저 결과까지 완주합니다.

- 몫 과대: `screenshots/engine-flow-codex-browser-05b-play-wrong.png`
- 몫 과소: `screenshots/engine-flow-codex-browser-05b2-play-quotient-too-low.png`
- 내림 오답: `screenshots/engine-flow-codex-browser-05d2-play-down-wrong.png`
- 마지막 몫 과대·과소: `screenshots/engine-flow-codex-browser-05e2-play-ones-too-high.png`, `screenshots/engine-flow-codex-browser-05e3-play-ones-too-low.png`
- `0/10` 결과: `screenshots/engine-flow-codex-browser-08-result-low-0-of-10.png`
- SVG 겹침 회귀: `screenshots/engine-flow-reported-svg-overlap-934x987-03-tutorial-1.png`, `screenshots/engine-flow-reported-svg-overlap-934x987-06-confirm.png`
