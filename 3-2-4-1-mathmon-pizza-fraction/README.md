# 매스몬 피자 분수 가게

3학년 2학기 4단원 1차시용 분수 게임입니다.

- 학습 행동: 피자 그림을 보고 `색칠된 조각 수 / 전체 조각 수`를 고릅니다.
- 문제 수: 서로 다른 분수 관계를 연습하는 10문제
- 문제 화면: 생성형 피자 가게 배경 위에 큰 피자, 조각 수 표지, 분수 선택지만 보여 줍니다.
- 정답 확인: 학생이 고른 분수가 큰 계산판에 들어가고, 조각 수와 같은지 확인한 뒤 `피자 보기`를 누릅니다.
- 오답 피드백: 분자·분모 뒤바꿈, 색칠하지 않은 조각 세기 등 선택 이유에 맞는 한 줄 힌트를 보여 줍니다.
- 보상: 문제마다 피자 점수가 무작위로 달라지고, 10문제 뒤 차시 전용 결과 장면을 보여 줍니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 화면 원칙

문제 화면에는 큰 문제, 피자 조각판, 한 줄 안내, 네 개의 분수 선택지만 둡니다. 점수판이나 등급판은 문제를 푸는 동안 펼쳐 두지 않습니다. 색만으로 뜻을 구분하지 않도록 SVG 피자 옆에 `색칠된 조각`과 `전체 조각`을 글자와 수로 함께 표시합니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-1-mathmon-pizza-fraction/`
- 설정: `lesson.json`
- 문제·오개념 모델: `model.js`
- 문제 화면: `view.js`, `lesson.css`
- 빌드 결과: `3-2-4-1-mathmon-pizza-fraction/index.html`
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 커버: `cover-generated.webp`, `title-logo-generated.webp`, `start-button-generated.webp`
- 결과: `result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp`, `result-retry-generated.webp`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.
