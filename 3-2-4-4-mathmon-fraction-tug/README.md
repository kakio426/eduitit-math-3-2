# 매스몬 분수 줄다리기

3학년 2학기 4단원 4차시용 분수 비교 게임입니다. 4단원의 정점 차시입니다.

- 학습 행동: 같은 길이의 두 분수 막대를 보고 더 큰 쪽 하나를 고릅니다.
- 문제 수: 분모가 같은 분수 5문제, 단위분수 5문제
- 판단 기준: 분모가 같으면 색칠된 칸 수, 단위분수면 한 칸의 길이를 비교합니다.
- 문제 화면: 위의 큰 문제판에서 두 분수 막대를 비교하고, 아래의 작은 보기에는 쌓인 분수만 보여 줍니다.
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
- 최종 보상: 등급 제목·환경·호랑몬·보상물·빈 동적 점수판·`다시` 버튼 표면을 한 장에 담은 `result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp` 6장, 각 `1280×800`
- 최종 보상 상승 흐름: 비 오는 빈 연습장 → 따뜻한 학교 운동장 → 협곡 다리 → 설산 정상 → 황금 챔피언 경기장 → 우주 무지개 신전
- 최종 보상 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`
- 최종 보상 브라우저 컨택시트: `screenshots/result-all-tiers-{desktop,tablet-landscape}-contact-sheet.png`
- 문제 왼쪽 진행 보상: 최종 보상 여섯 등급을 같은 호랑몬 중심·크기·발 기준선으로 다시 그린 `play-tug-v1-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp` 6장, 각 `768×1536`
- 문제 왼쪽 자산 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-contact-sheet.png`
- 문제 왼쪽 생성 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/source`
- 문제 왼쪽 기준선 검사: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-4-4/play-progress-v1/contact-sheets/play-tug-progress-v1-anchor-audit.png`
- 문제 왼쪽 패널: `stage-left-play-progress-v1`, Stage 기준 `left 1.65% / top 11% / width 24.5% / height 84%`, `object-fit: contain`
- 빌드 결과: `3-2-4-4-mathmon-fraction-tug/index.html`

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

현재 브라우저 증거는 `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`, 브라우저 댓글 화면 `934×987 DPR 2`, 최종 결과판 회귀 화면 `934×987 DPR 2`와 빈 보상 fixture에서 생성합니다. 추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
