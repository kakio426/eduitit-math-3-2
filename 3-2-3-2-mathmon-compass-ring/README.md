# 매스몬 컴퍼스 마법진

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 2차시입니다.

- 학습: 컴퍼스의 벌린 길이와 반지름의 관계
- 목표: 반지름만큼 컴퍼스를 벌려요.
- 문제: 반지름 2~6 cm를 각각 두 번씩 섞은 10문제
- 행동: 반지름만큼 벌어진 컴퍼스 그림 1개 고르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 → 랜덤 마법진 빛 → 결과
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

큰 원에서 주어진 반지름을 먼저 보고, 눈금 위에 놓인 컴퍼스 그림 4개 중 알맞은 벌림을 고릅니다. 모든 문제에는 반지름을 지름으로 착각한 보기와 한 칸 좁거나 넓은 보기가 들어갑니다.

오답을 고르면 원의 반지름과 선택한 컴퍼스 벌림을 `≠`로 비교합니다. 정답을 고르면 두 길이를 `=`로 연결하고, `컴퍼스를 3 cm만큼 벌려요. 이 길이가 반지름이에요.`처럼 확인합니다.

## 화면과 자산

- `problem-stage-generated.webp`: 1280×800 밝은 마법 기하 작업실 문제 배경
- `problem-stage-generated.png`: 1280×800 작업 원본
- `problem-stage-source.png`: imagegen 생성 원본
- 동행 매스몬: `diversity-reward-pack`의 수정부엉몬(`mathmon-drv-05-crystalowl`)
- 설명 1: `반지름 3 cm = 컴퍼스 벌림 3 cm`를 원·눈금·컴퍼스로 직접 연결
- 설명 2: 10문제·마법진 빛 변화·마지막 마법진 이름만 안내
- 랜덤 보상: 사건별 `reward-event-*-generated.webp` 6종
- 결과 상태 세트: 6장, 각 1280×800, 고정 제목과 `다시` 버튼 포함
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 원·반지름·눈금·컴퍼스: 정확한 길이 관계가 필요한 SVG
- 선택: 같은 좌표의 HTML 버튼과 접근성 이름

문제 화면에는 큰 질문, 현재 반지름 그림, 한 줄 지시 또는 피드백, 컴퍼스 선택지만 둡니다. 마법진 점수와 결과 등급은 문제를 푸는 동안 숨깁니다.

## 보상

중심 보상은 마법진 빛 하나입니다. 문제를 끝낼 때 증가·감소·큰 증가·완벽한 원·0·무지개 중 하나가 나오며, 오답을 거친 문제는 감소 보상을 적용합니다.

## 공통 화면·QA 계약

- 시작 버튼: `shared-canonical-v1`, 공용 자산 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 표시 크기: 1280 화면 360×152px, 1024 화면 최소 300×127px, 비율 `1611 / 680`
- 문제 HUD: 왼쪽 브랜드, 가운데 `1/10`, 오른쪽 `3단원 원`; 진행 막대는 숨김
- 작업 영역 최소 폭: Stage의 65%. 실제 측정은 두 QA 화면 모두 66.00%
- 읽기·조작 최소값: 설정 42×42px, 배지 14px, 문제 수 16.8px, 지시문·선택지 글자 18px, 패널 간격 8px
- 대표 오개념: 컴퍼스를 좁게 벌림, 넓게 벌림, 지름만큼 벌림
- 입력 통계: 문제당 4/4/4/4회(최소/중앙값/평균/최대), 한 판 총 43회
- 이전 흐름 캡처: `_archive/20260723-pre-harness-remediation/screenshots/`
- 상세 기준 비교: `BENCHMARK_AUDIT.md`

## 엔진 소스

- `_lessons/3-2-3-2-mathmon-compass-ring/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-2-mathmon-compass-ring/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-2-mathmon-compass-ring/view.js`: 원·컴퍼스 SVG와 화면 렌더링
- `_lessons/3-2-3-2-mathmon-compass-ring/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape}-*.png`에 1280×800과 1024×768의 첫 화면, 설정, 방법 보기, 문제, 오답, 정답 확인, 보상, 결과 화면이 있습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
