# 매스몬 검산 자물쇠

3학년 2학기 2단원 4차시, 곱셈으로 나눗셈을 검산하는 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 킹드래곤몬입니다.

## 학습 조작

1. 금고 숫자판에 `나누는 수×몫`을 넣습니다.
2. 나머지를 더한 값을 숫자판에 넣습니다.
3. `같아요 / 달라요` 레버를 누릅니다.
4. 틀린 식은 몫 또는 나머지 레버로 다른 곳을 찾습니다.

학생이 입력한 오답도 계산판에 먼저 들어갑니다. 곱한 값이 너무 크거나 작은 경우를 서로 다른 화면 상태로 보여 준 뒤 다시 입력하게 합니다.

## 판단·입력 수

현재 모델 500개 시드, 5,000문제 기준입니다.

- 수학적 판단: 최소 3회, 중앙값 3회, 평균 3.4회, 최대 4회
- 숫자·레버 입력: 최소 7회, 중앙값 7회, 평균 7.41회, 최대 10회
- 맞는 식은 곱하기·더하기·비교, 틀린 식은 다른 곳 찾기가 한 번 더 필요합니다.

## 보상과 결과

- 닫힌 보상은 금고 이미지와 `열기` 버튼만 보여 줍니다.
- 열린 보상은 사건 이미지, 열쇠 힘 변화량, `다음` 버튼만 보여 줍니다.
- 열쇠 힘은 늘거나 줄거나 0이 될 수 있고, 희귀 무지개 열쇠는 최고 결과를 엽니다.
- 특별 결과는 낮은 일반 금고를 다음 목표로 가리키지 않습니다.

## 전국 순위

- 결과 화면의 생성형 `순위 보기` 버튼으로 `전국 열쇠 순위`를 엽니다.
- 순위 점수는 `내 열쇠 힘`, 목록은 `열쇠 힘 순위`, 서버 차시 ID는 `3-2-2-4-mathmon-check-lock`입니다.
- 서버는 곱하기·더하기·같고 다름·틀린 곳 찾기와 보상 사건을 다시 계산해 제출 점수를 검증합니다.
- 오프라인·연결 중·오류·빈 목록·긴 이름 10개와 1~10위 스크롤을 `1280×800`, `1024×768`, `1280×720`에서 확인합니다.

## 겹침 회귀 계약

- 사용자 제보 조건은 `codex-browser-regression`이라는 이름으로 `lesson.json > qa.viewports`에 고정합니다.
- 기준 브라우저는 `1280×720`, DPR 2이며, 높이에 맞춰 줄어든 실제 Stage는 `1075.19×671.98`입니다.
- QA는 SVG 계산판 표면, 단계판, 지시문, 피드백, 선택지·숫자판, 버튼 hitbox의 실제 렌더 경계를 재서 형제 요소 겹침 0px와 Stage 이탈 0건을 확인합니다.
- 곱하기·더하기·같고 다름의 대기/정답 확인 상태와 곱한 값 과대·과소 상태를 각각 캡처합니다.

## 이미지 계약

- 설명 2장: 숫자판 검산 / 10문제·금고 열기·결과
- 문제 장면 3장: 잠김 / 핀 맞음 / 열림, 각 1280×800
- 킹드래곤몬 반응 3장: 정답 / 오답 / 보상
- 보상: 닫힌 금고 1장 + 열쇠 사건 6종
- 결과: UI 없는 보물 금고 장면 + 등급명 이미지 6장 + 정답 수 + 열쇠 힘 + 생성형 다시 버튼
- 컨택시트: `problem-state-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/kingdragonmon-reactions-contact-sheet.png`

## 검증

```bash
node scripts/build-lesson.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson-model.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson-flow.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson2-check-lock.mjs 20260714
node scripts/check-stage-ratio.mjs
node scripts/check-rule-consistency.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

현재 화면 증거는 `screenshots/engine-flow-desktop-*.png`, `screenshots/engine-flow-tablet-landscape-*.png`, `screenshots/engine-flow-codex-browser-regression-*.png`입니다. 곱한 값 과대·과소, 단계별 대기·정답 확인, 마지막 확인, 닫힌·열린 보상, 결과, 전국 순위를 각각 포함합니다.
