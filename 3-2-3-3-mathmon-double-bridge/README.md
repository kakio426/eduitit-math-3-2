# 매스몬 두 배 다리

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 3차시입니다.

- 학습: 지름은 반지름의 두 배, 반지름은 지름의 반
- 목표: 반지름 두 개를 이으면 지름이 돼요.
- 문제: 지름 구하기 5개와 반지름 구하기 5개를 섞은 10문제
- 행동: 두 배 또는 반이 되는 다리 길이 1개 고르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 효과 → 점수 보기 → 랜덤 다리 힘 → 결과
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

원 안의 지름을 중심에서 두 반지름으로 나눠 보여 줍니다. 반지름이 주어지면 두 반지름을 이은 지름을 고르고, 지름이 주어지면 반으로 나눈 반지름을 고릅니다.

네 선택지는 카드가 아니라 하나의 목재 부품 선반에 놓인 다리로 보입니다. 원, 정답 자리, 네 후보는 문제마다 같은 `px/cm`를 씁니다. 고르면 그 다리가 원 아래 첫 기둥부터 실제 길이만큼 놓입니다. 짧으면 남은 틈, 길면 기둥 밖으로 나간 부분이 보이고 `4 + 4 ≠ 10`처럼 비교합니다. 정답에서만 양끝이 잠기고 완성식이 남습니다.

## 화면과 자산

- `problem-workshop-v3-generated.webp`: 1586×992 밝은 판타지 다리 공방 문제 배경. 오른쪽은 글자·카드·선반이 없는 넓은 작업면이며 1280×800 Stage에서 `object-fit: cover`로 표시
- `problem-workshop-v3-generated.png`: 배포용 PNG
- `problem-workshop-v3-source.png`: imagegen 최종 원본
- 동행 매스몬: `zero-factory-animal-pack`의 수달몬(`zfa-03-sudalmon`)
- 설명 1: 반지름 3 cm 두 개가 `3+3=6`, 지름 6 cm가 되는 모습을 연결
- 설명 2: 10문제를 푼 뒤 다리가 더 멋져지거나 작아질 수 있고, 마지막에 내가 만든 다리를 본다고 안내. 첫 칸은 최종 결과와 같은 외나무다리부터 무지개 다리까지 6단계를 보여 줌
- 설명 2 생성 원본: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-3-3/tutorial-page-2-v4/source/tutorial-page-2-v4-source.png`
- 설명 2 배포본: `tutorial-page-2-v4-generated.webp`(1280×800)
- 랜덤 보상: 닫힌 상자 1종과 사건별 열린 상태 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 결과 상태 세트: 6장, 각 1280×800, 고정 제목과 `다시` 버튼 포함
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 문제 화면 왼쪽 진행 보상: `play-bridge-v1-{log,small,bridge,big,grand,rainbow}-generated.webp` 6장, 각 768×1536, `object-fit: contain`
- 진행 보상 생성 원본: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-3-3/play-progress-v1/source`
- 진행 보상 컨택시트: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-3-3/play-progress-v1/contact-sheets/play-bridge-progress-v1-contact-sheet.png`
- 매스몬 픽셀 앵커 검수: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-3-3/play-progress-v1/contact-sheets/play-bridge-progress-v1-anchor-audit.png`
- 원·중심·반지름·지름·다리 길이: SVG
- 선택: 같은 좌표의 HTML 버튼과 접근성 이름

문제 화면 왼쪽에는 현재 다리 한 장과 짧은 단계 이름, 다리 힘 막대만 둡니다. 학습 작업대는 Stage `left 22.5%`를 유지하고, 진행 패널은 `left 1.65% / top 11% / width 19.2% / height 84%`의 고정 좌표를 씁니다. 두 영역은 서로 겹치지 않습니다.

## 보상

중심 보상은 다리 힘 하나입니다. 문제를 끝낼 때 증가·감소·큰 증가·한 번에 완공·0·무지개 중 하나가 나오며, 오답을 거친 문제는 감소 보상을 적용합니다.

## 공통 화면·QA 계약

- 시작 버튼: `shared-canonical-v1`, 공용 자산 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 표시 크기: 1280 화면 360×152px, 1024 화면 최소 300×127px, 비율 `1611 / 680`
- 문제 HUD: 왼쪽 브랜드, 가운데 `1/10`, 오른쪽 `3단원 원`; 다리 힘은 왼쪽 진행 보상 패널 한 곳에서만 표시
- 진행 보상 표준: `stage-left-play-progress-v1`; 패널 네 변 오차 1px 이하, 학습 영역 교차 0px, 수달몬 전신 잘림 0건
- 보상 뒤 전환: `modal-dismiss-world-impact-v2`; 모달 닫힘 → 320ms → 진행 이미지 교체와 1560ms 효과 → 다음 문제
- 정답 확인 효과: `bridge-answer-lock-effect-v1`; 고른 답·원 관계·문제판을 680ms 동안 약하게 빛낸 뒤 완성식과 `점수 보기`를 표시
- 작업 영역 최소 폭: Stage의 65%. 최신 실제 측정은 세 QA 화면 모두 69.00%
- 읽기·조작 최소값: 설정 42×42px, 배지 14px, 문제 수 16.8px, 지시문·선택지 글자 18px, 패널 간격 8px
- 대표 오개념: 두 배를 하지 않음·하나 짧음·너무 김, 반으로 나누지 않음·너무 김·너무 짧음
- 입력 통계: 문제당 4/4/4/4회(최소/중앙값/평균/최대), 한 판 총 43회
- 이전 흐름 캡처: `_archive/20260723-pre-harness-remediation/screenshots/`
- 상세 기준 비교: `BENCHMARK_AUDIT.md`

## 엔진 소스

- `_lessons/3-2-3-3-mathmon-double-bridge/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-3-mathmon-double-bridge/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-3-mathmon-double-bridge/view.js`: 원·다리 SVG와 화면 렌더링
- `_lessons/3-2-3-3-mathmon-double-bridge/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape,codex-in-app}-*.png`에 1280×800, 1024×768, 1280×720의 첫 화면, 설정, 방법 보기, 문제 대기, 짧은 오답, 긴 오답, 정답 확인, 닫힌/열린 보상, 결과 화면이 있습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
