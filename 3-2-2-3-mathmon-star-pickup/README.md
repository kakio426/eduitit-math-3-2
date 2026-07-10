# 매스몬 별 줍기

3학년 2학기 2단원 3차시, 나머지가 있는 나눗셈 게임입니다.

## 현재 구조

- 소스: `_lessons/3-2-2-3-mathmon-star-pickup/`
- 공통 엔진: `_engine/v1/`
- 배포본: 이 폴더의 독립 실행 `index.html`
- 문제 배경: 생성 이미지 `result-stage.webp`
- 동적 수학판: SVG `star-math-svg`

한 문제는 `가능한 묶음 수 고르기 → 남은 별 고르기`로 진행됩니다. 문제 화면에는 `전체 별`, `한 묶음`, `만든 묶음`, 현재 한 줄 지시와 선택지만 보입니다. 몫을 너무 크게 또는 작게 고르면 막대 길이로 바로 확인합니다. 다음 단계의 `남은 별`은 미리 펼치지 않습니다.

## 검증

```bash
node scripts/qa-engine-unit2-star-source.mjs
node scripts/build-lesson.mjs 3-2-2-3-mathmon-star-pickup
node scripts/qa-lesson-flow.mjs 3-2-2-3-mathmon-star-pickup
```

최신 화면은 `screenshots/engine-flow-*`에 있습니다.
