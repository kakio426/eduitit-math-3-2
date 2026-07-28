# 매스몬 분수만큼 담기

3학년 2학기 4단원 2차시용 분수 게임입니다.

- 학습 행동 1: 전체를 분모만큼 나눈 한 묶음 수를 고릅니다.
- 학습 행동 2: 한 묶음 수에 분자를 곱한 수를 고릅니다.
- 문제 수: 두 단계가 모두 필요한 10문제
- 문제 화면: 생성형 과일 작업장 배경 위에 현재 계산만 크게 보여 줍니다.
- 정답 확인: `전체 ÷ 분모 → 한 묶음 × 분자` 완성식을 본 뒤 `바구니 보기`를 누릅니다.
- 오답 피드백: 분모를 답으로 고르기, 전체를 그대로 고르기, 한 묶음만 담기 등 선택 이유에 맞춰 한 줄로 나옵니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-2-mathmon-fraction-scoop/`
- 문제·오개념 모델: `model.js`
- 문제 화면: `view.js`, `lesson.css`
- 빌드 결과: `3-2-4-2-mathmon-fraction-scoop/index.html`
- 공용 시작 버튼: `../_shared/mathmon/cover-start-button/start-button-generated.webp` (`shared-canonical-v1`, 360×152px, 최소 300×127px)
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 동행 매스몬: 승인된 `zero-factory-animal-pack`의 토끼몬(`zfa-02-rabbitmon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장
- 랜덤 보상 상태 세트: 덮인 바구니 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 배경: 글자와 버튼이 없는 `result-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp` 6장
- 결과 제목: 투명 생성 자산 `result-title-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp` 6장
- 결과 버튼: 투명 생성 자산 `result-restart-button-generated.webp`
- 결과 배경 컨택시트: `result-tiers-v3-contact-sheet.png`
- 결과 제목 컨택시트: `result-titles-v3-contact-sheet.png`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
