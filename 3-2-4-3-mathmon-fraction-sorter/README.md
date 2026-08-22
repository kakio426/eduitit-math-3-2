# 매스몬 분수 분류 컨베이어

3학년 2학기 4단원 3차시용 분수 게임입니다.

- 학습 행동: 분수 모형과 분자·분모를 보고 `진분수·가분수·대분수` 중 하나를 고릅니다.
- 문제 은행: 서로 다른 분수 20개. 한 판에는 중복 없이 10문제를 무작위로 뽑습니다.
- 한 판 구성: 진분수 4개, 가분수 3개(분자=분모 1개 포함), 대분수 3개(자연수 1·2·3 각 1개)
- 문제 화면: 큰 분수 표기와 같은 양을 나타낸 막대 모형, 생성 이미지 선택 카드 세 장만 보여 줍니다.
- 선택 근거: `분자가 더 작아요`, `분자가 같거나 커요`, `자연수와 진분수`를 이름과 함께 표시합니다.
- 정답 확인: 종류 이름은 아래 확인판에서 처음 공개합니다. 현재 문제와 정확히 같은 생성 그림, 수 비교, 짧은 이유 한 문장을 확인한 뒤 `상자 보기`를 누릅니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-3-mathmon-fraction-sorter/`
- 공용 시작 버튼: `../_shared/mathmon/cover-start-button/start-button-generated.webp` (`shared-canonical-v1`, 360×152px, 최소 300×127px)
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 동행 매스몬: 승인된 `zero-factory-animal-pack`의 판다몬(`zfa-08-pandamon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장
- 분류 선택 카드: `choice-{proper,improper,mixed}-generated.webp` 3장
- 문제별 정답 설명: 문제 은행 20개와 각각 정확히 일치하는 `explanation-*-generated.webp` 20장
- 정답 설명 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-3/fraction-learning-v1/contact-sheets/exact-fraction-explanations-v2-contact-sheet.png`
- 완료·보상 버튼: `box-view-button-generated.webp`, `box-open-button-generated.webp`, 공용 `next-button-generated.webp`, `result-view-button-generated.webp`
- 랜덤 보상 상태 세트: 봉인된 분류 상자 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 배경: 글자와 버튼이 없는 `result-{first,row,line,bigline,manager,rainbow}-generated.webp` 6장
- 결과 제목: 투명 생성 자산 `result-title-{first,row,line,bigline,manager,rainbow}-generated.webp` 6장
- 결과 버튼: 투명 생성 자산 `result-restart-button-generated.webp`
- 결과 배경 컨택시트: `result-tiers-v4-contact-sheet.png`
- 결과 제목 컨택시트: `result-titles-v3-contact-sheet.png`
- 문제 왼쪽 진행 장면: `play-sorter-v1-{first,row,line,bigline,manager,rainbow}-generated.webp` 6장, 각 768×1536, `object-fit: contain`
- 진행 장면 생성 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-3/play-progress-v1/source/`
- 진행 장면 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-3/play-progress-v1/contact-sheets/play-sorter-progress-v1-contact-sheet.png`
- 매스몬 픽셀 앵커 검수: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-3/play-progress-v1/contact-sheets/play-sorter-progress-v1-anchor-audit.png`
- 빌드 결과: `3-2-4-3-mathmon-fraction-sorter/index.html`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
