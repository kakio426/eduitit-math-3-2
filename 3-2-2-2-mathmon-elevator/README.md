# 매스몬 엘리베이터

3학년 2학기 2단원 2차시, 내림 있는 두 자리 수 나눗셈 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 독수리몬입니다.

## 학습 조작

1. 십의 자리에서 `몫 20`, `남은 수 10`처럼 실제 값을 고릅니다.
2. 남은 수와 일의 자리 수를 합쳐 아래 칸으로 내립니다.
3. 마지막 몫을 도착 층 버튼으로 누릅니다.

내림 단계는 드래그와 `선택 → 아래 칸 선택`을 모두 지원합니다. 몫과 남은 십은 색이 아니라 글자로 표시합니다.

## 이미지 계약

- 설명 포스터 2장: 실제 내림 조작 / 10문제·직접 여는 보상·결과
- 문제 장면 3장: 대기 / 하강 / 도착, 각 1280×800
- 독수리몬 반응 3장: 정답 / 오답 / 보상, 각 512×640
- 보상: 닫힌 문 1장 + 사건 6종
- 결과: UI 없는 전망층 장면 + 현재 도착지 제목 이미지 6장 + 정답 수 + 올라갈 힘 + 생성형 다시 버튼
- 최저 결과: `0/10`, 힘 0이어도 `지하 정비층`에 도착합니다. `다시 준비` 결과는 현재 실행 흐름에서 사용하지 않습니다.
- 컨택시트: `problem-state-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/eaglemon-reactions-contact-sheet.png`

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

추가 화면 QA는 Codex 브라우저와 같은 931×897에서도 진행했습니다. 몫 과대·과소, 내림 오답, 마지막 몫 과대·과소를 결정적으로 재현하고, `0/10` 최저 결과까지 완주합니다.

- 몫 과대: `screenshots/engine-flow-codex-browser-05b-play-wrong.png`
- 몫 과소: `screenshots/engine-flow-codex-browser-05b2-play-quotient-too-low.png`
- 내림 오답: `screenshots/engine-flow-codex-browser-05d2-play-down-wrong.png`
- 마지막 몫 과대·과소: `screenshots/engine-flow-codex-browser-05e2-play-ones-too-high.png`, `screenshots/engine-flow-codex-browser-05e3-play-ones-too-low.png`
- `0/10` 결과: `screenshots/engine-flow-codex-browser-08-result-low-0-of-10.png`
