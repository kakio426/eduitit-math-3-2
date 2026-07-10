# 매스몬 검산 자물쇠

3학년 2학기 2단원 4차시, 곱셈으로 나눗셈을 검산하는 게임입니다.

## 현재 구조

- 소스: `_lessons/3-2-2-4-mathmon-check-lock/`
- 공통 엔진: `_engine/v1/`
- 배포본: 이 폴더의 독립 실행 `index.html`
- 문제 배경: 생성 이미지 `board-vault-generated.webp`
- 동적 수학판: SVG `check-lock-svg`

한 문제는 `나누는 수×몫 → 나머지 더하기 → 처음 수와 비교하기`로 진행됩니다. 틀린 나눗셈식은 마지막에 `몫` 또는 `나머지` 중 다른 곳을 찾습니다. 비교판에는 `검산값`과 `처음 수`가 글자로 보이므로 색을 해석하지 않아도 됩니다.

## 검증

```bash
node scripts/qa-engine-unit2-check-lock-source.mjs
node scripts/build-lesson.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson-flow.mjs 3-2-2-4-mathmon-check-lock
```

최신 화면은 `screenshots/engine-flow-*`에 있습니다.
