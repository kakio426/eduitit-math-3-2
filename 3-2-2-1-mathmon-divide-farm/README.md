# 매스몬 나누기 농장

3학년 2학기 2단원 1차시, 내림 없는 두 자리 수 나눗셈 게임입니다. 동행 매스몬 팩은 `base-pack`, 주인공은 여우몬입니다.

## 학습 조작

4지선다와 채소 반복 옮기기를 쓰지 않습니다. 학생이 먼저 **한 바구니에 몇 개씩 들어가는지**를 숫자로 결정하고, 생성 이미지 채소가 모든 바구니에 놓이는 장면은 그 답을 확인하는 역할만 합니다.

1. `60을 바구니 3개에 똑같이 나눠요.`를 보고 한 바구니의 실제 값 `20`을 입력합니다.
2. 적게 쓰면 남는 채소, 많이 쓰면 부족한 채소를 현재 바구니에서 확인합니다.
3. 정답을 확정한 뒤에만 `10개 묶음` 이미지가 바구니 3개에 차곡차곡 놓입니다.
4. 낱개도 같은 방식으로 나누어 일의 자리 몫을 만듭니다.
5. `20 + 2`를 보고 전체 몫을 숫자로 입력합니다.

문제당 수학적 판단은 `십의 자리 몫`, `일의 자리 몫`, `전체 몫` 3번입니다. 정답 경로의 물리 입력은 두 자리 입력+확인, 한 자리 입력+확인, 두 자리 입력+확인으로 정확히 8회입니다. 예전 목적지 선택 방식의 13~41회 반복 입력을 제거했습니다.

## 화면과 보상

- 첫 설명: `40 ÷ 4`, `8 ÷ 4`, `10 + 2 = 12`로 각 단계가 필요한 이유를 보여 줍니다.
- 둘째 설명: 문제 뒤 수확이 달라지고 10문제 뒤 농장을 본다는 목표를 알려 줍니다.
- 문제: 큰 식, 현재 단계 이유, 전체 채소, 바구니, 숫자판만 보여 줍니다.
- 정답 확인: 학생의 답을 바구니와 생성 이미지 채소에 반영한 뒤 다음 단계로 넘어갑니다.
- 보상: 닫힌 바구니를 직접 열면 수확이 늘거나 줄고, 드물게 크게 도약합니다.
- 결과: 낮은 결과도 씨앗·새싹 농장으로 남으며, 최고 `황금밭`은 희귀 보상 조건을 요구합니다.

## 이미지 계약

- 표지: 글자 없는 `cover-generated.webp` + 생성형 제목·시작 버튼
- 설명: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp`
- 문제 장면: `대기 / 진행 / 완료` 3장, 각 1280×800
- 문제 조작: 생성형 빈 바구니, `10개 묶음`, 낱개 당근 WebP
- 조작 원본: `farm-basket-empty-source.png`, `farm-bundle-ten-source.png`, `farm-carrot-single-source.png`
- 매스몬 반응: 여우몬 `정답 / 오답 / 보상` 3장
- 보상: 닫힌 바구니 1장 + `3×2` 사건 스프라이트 6종
- 결과: UI 없는 농장 장면 + 등급명 이미지 6장 + 공용 정답 수 이미지 + 생성형 `다시` 버튼
- 컨택시트: `problem-state-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/foxmon-reactions-contact-sheet.png`

## 전국 순위

- 결과 화면의 생성형 `순위 보기` 버튼으로 `전국 수확 순위`를 엽니다.
- 순위 점수는 `내 수확`, 목록은 `수확 순위`, 서버 차시 ID는 `3-2-2-1-mathmon-divide-farm`입니다.
- 서버는 10문제의 식·단계별 시도·정답 수·보상 사건을 다시 계산해 제출 점수를 검증합니다.
- 연결 중·빈 순위·오류·오프라인·긴 이름 10위 목록과 1~10위 스크롤을 데스크톱·태블릿·`918×897`에서 확인합니다.
- 공용 생성 자산은 `_shared/scoreboard/scoreboard-result-button-generated.webp`입니다.

## 실행과 검증

```bash
node scripts/build-lesson.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-model.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson-flow.mjs 3-2-2-1-mathmon-divide-farm
node scripts/qa-lesson2-divide-farm.mjs
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

흐름 QA는 `1280×800`, `1024×768`, 사용자가 문제를 발견한 크기와 가까운 `918×897`에서 설명·대기·오답·단계별 정답 확인·완성식·닫힌/열린 보상·결과·전국 순위를 캡처합니다.

소스는 `_lessons/3-2-2-1-mathmon-divide-farm/`, 독립 실행 배포본은 이 폴더의 `index.html`입니다.
