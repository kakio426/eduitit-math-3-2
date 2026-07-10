# 매스몬 나누기 농장

3학년 2학기 2단원 1차시, 내림 없는 `(몇십몇) ÷ (몇)` 게임입니다.

## 현재 구조

- 소스: `_lessons/3-2-2-1-mathmon-divide-farm/`
- 공통 엔진: `_engine/v1/`
- 배포본: 이 폴더의 독립 실행 `index.html`
- Stage: `1280×800`, `16:10`
- 문제 화면 배경: 생성 이미지 `farm-board-generated.webp`
- 동적 수학판: SVG `place-value-farm-svg`

## 학습 흐름

한 문제는 세 개의 한 행동 화면으로 진행됩니다.

1. `10개 묶음 몫` 고르기
2. `낱개 몫` 고르기
3. 십의 자리와 일의 자리를 이어 `전체 몫` 만들기

색만으로 뜻을 구별하지 않습니다. 계산판과 모든 선택지에 `10개 묶음 몫`, `낱개 몫`, `전체 몫`을 글자로 표시합니다. 오답을 고르면 그 값이 현재 칸에 들어가고, 대표 오개념에 맞는 한 줄 피드백을 보여 줍니다.

## 게임 흐름

`첫 화면 → 설명 2장 → 10문제 → 정답 확인 → 랜덤 수확 → 결과`

랜덤 수확은 유지하며, 정답을 많이 맞힐수록 유리하지만 한 판의 결과를 완전히 보장하지는 않습니다. 결과는 `씨앗 → 새싹 → 텃밭 → 농장 → 대농장`과 특별 결과 `황금밭`으로 이어집니다.

## 검증

```bash
node scripts/qa-engine-unit2-divide-farm-source.mjs
node scripts/build-lesson.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-flow.mjs 3-2-2-1-mathmon-divide-farm
node scripts/check-lesson-contract.mjs
node scripts/check-stage-ratio.mjs
```

최신 화면은 `screenshots/engine-flow-*`에 있습니다.
