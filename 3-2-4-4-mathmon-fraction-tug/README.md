# 매스몬 분수 줄다리기

3학년 2학기 4단원 4차시용 분수 비교 게임입니다. 4단원의 정점 차시입니다.

- 학습 행동: 같은 길이의 두 분수 막대를 보고 더 큰 쪽 하나를 고릅니다.
- 문제 수: 분모가 같은 분수 5문제, 단위분수 5문제
- 판단 기준: 분모가 같으면 색칠된 칸 수, 단위분수면 한 칸의 길이를 비교합니다.
- 문제 화면: 큰 문제, 줄 그림, 한 줄 안내, 두 개의 분수 막대만 보여 줍니다.
- 정답 확인: 더 큰 분수를 왼쪽에 놓은 `>` 완성식을 본 뒤 `승부 보기`를 누릅니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-4-mathmon-fraction-tug/`
- 공용 시작 버튼: `../_shared/mathmon/cover-start-button/start-button-generated.webp` (`shared-canonical-v1`, 360×152px, 최소 300×127px)
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 동행 매스몬: 승인된 `diversity-reward-pack`의 호랑몬(`mathmon-drv-04-bravetiger`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장
- 랜덤 보상 상태 세트: 줄다리기 선물 상자 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과: `result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp` 6장
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 빌드 결과: `3-2-4-4-mathmon-fraction-tug/index.html`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
