# 매스몬 피자 분수 가게

3학년 2학기 4단원 1차시용 분수 게임입니다.

- 학습 행동: 피자 그림을 보고 `색칠된 조각 수 / 전체 조각 수`를 고릅니다.
- 문제 수: 서로 다른 분수 관계를 연습하는 10문제
- 문제 화면: 생성형 피자 가게 배경 위에 큰 피자, 조각 수 표지, 분수 선택지만 보여 줍니다.
- 정답 확인: 학생이 고른 분수가 큰 계산판에 들어가고, 조각 수와 같은지 확인한 뒤 `피자 보기`를 누릅니다.
- 오답 피드백: 분자·분모 뒤바꿈, 색칠하지 않은 조각 세기 등 선택 이유에 맞는 한 줄 힌트를 보여 줍니다.
- 보상: 문제마다 피자 빛이 무작위로 달라지고, 10문제 뒤 차시 전용 결과 장면을 보여 줍니다.
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
- 커버: `cover-generated.webp`, `title-logo-generated.webp`, 공용 시작 버튼 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 동행 매스몬: 승인된 `base-pack`의 여우몬(`base-02-foxmon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장. 첫 장은 분자·분모, 둘째 장은 랜덤 보상과 마지막 피자 이름을 보여 줍니다.
- 랜덤 보상 상태 세트: 닫힌 피자 상자 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과: `result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp` 6장. 각 이미지에 등급명과 `다시` 버튼이 들어 있습니다.
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`

시작 버튼은 `shared-canonical-v1` 한 세트만 쓰며, 1280×800 Stage에서 360×152px, 작은 화면에서 최소 300×127px로 표시합니다. 모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
