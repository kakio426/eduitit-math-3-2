# 매스몬 분수 분류 컨베이어

3학년 2학기 4단원 3차시용 분수 게임입니다.

- 학습 행동: 분수 모형과 분자·분모를 보고 `진분수·가분수·대분수` 중 하나를 고릅니다.
- 문제 수: 진분수 4개, 가분수 3개, 대분수 3개로 구성된 10문제
- 문제 화면: 큰 분수 표기와 같은 양을 나타낸 막대 모형, 세 개의 이름 선택지만 보여 줍니다.
- 선택 근거: `분자 < 분모`, `분자 ≥ 분모`, `자연수 + 진분수`를 이름과 함께 표시합니다.
- 정답 확인: 고른 이름이 모형 옆에 붙고, 확인 문장을 본 뒤 `상자 보기`를 누릅니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-3-mathmon-fraction-sorter/`
- 공용 시작 버튼: `../_shared/mathmon/cover-start-button/start-button-generated.webp` (`shared-canonical-v1`, 360×152px, 최소 300×127px)
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 동행 매스몬: 승인된 `zero-factory-animal-pack`의 판다몬(`zfa-08-pandamon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장
- 랜덤 보상 상태 세트: 봉인된 분류 상자 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과: `result-{first,row,line,bigline,manager,rainbow}-generated.webp` 6장
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 빌드 결과: `3-2-4-3-mathmon-fraction-sorter/index.html`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
