# 매스몬 원 무늬 디자이너 ★ 단원 정점

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 4차시입니다.

- 학습: 같은 크기와 간격으로 원 규칙·무늬 만들기
- 문제: 가로 4개, 위로 이어지는 무늬 3개, 아래로 이어지는 무늬 3개
- 행동: 규칙대로 이어진 미니 원 무늬 1개 고르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 → 랜덤 무늬 빛 → 결과
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

큰 화면에는 놓인 원 3개와 다음 자리 `?` 하나만 보여 줍니다. 네 선택지는 각각 완성된 독립 미니 무늬입니다. 한 보드에 후보 가·나·다·라를 겹치지 않습니다.

- 정답: 같은 크기, 같은 줄, 같은 간격
- 간격 오답: 다음 원만 더 멀리 놓임
- 줄 오답: 다음 원이 이어지던 줄에서 벗어남
- 크기 오답: 다음 원만 크기가 달라짐

오답을 고르면 선택한 무늬가 큰 화면에 나타나고 한 가지 이유만 보여 줍니다. 정답 뒤에는 완성된 무늬가 크게 남습니다.

## 화면과 자산

- `problem-stage-generated.webp`: 1280×800 밝은 판타지 무늬 공방 문제 배경
- `problem-stage-generated.png`: 1280×800 작업 원본
- `problem-stage-source.png`: imagegen 생성 원본
- 동행 매스몬: `diversity-reward-pack`의 무지개유니몬(`mathmon-drv-09-rainbowunicorn`)
- 설명 1: 원 크기 확인 → 사이 간격 확인 → 같은 크기와 간격으로 잇기
- 설명 2: 10문제·무늬 빛 변화·마지막 무늬 이름만 안내
- 닫힌 보상: `reward-event-closed-v2-generated.webp` 1종
- 랜덤 보상: 사건별 `reward-event-*-generated.webp` 6종
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`(닫힘 포함 7종)
- 결과 상태 세트: 6장, 각 1280×800, 고정 제목과 `다시` 버튼 포함
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 원·중심선·다음 자리·완성 무늬: SVG
- 선택: 같은 좌표의 HTML 버튼과 접근성 이름

접근성 이름은 화면의 관계를 그대로 말합니다. 네 선택지는 `같은 크기와 간격`, `간격이 넓음`, `줄에서 벗어남`, `원 크기가 다름`으로 읽힙니다.

문제 화면에는 큰 질문, 현재 원 무늬, 한 줄 지시 또는 피드백, 미니 무늬 선택지만 둡니다. 무늬 빛과 결과 등급은 문제를 푸는 동안 숨깁니다.

## 보상

중심 보상은 무늬 빛 하나입니다. 문제를 끝낼 때 증가·감소·큰 증가·완벽한 무늬·0·무지개 중 하나가 나오며, 오답을 거친 문제는 감소 보상을 적용합니다.

## 공통 화면·QA 계약

- 시작 버튼: `shared-canonical-v1`, 공용 자산 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 표시 크기: 1280 화면 360×152px, 1024 화면 최소 300×127px, 비율 `1611 / 680`
- 문제 HUD: 왼쪽 브랜드, 가운데 `1/10`, 오른쪽 `3단원 원`; 진행 막대는 숨김
- 작업 영역 최소 폭: Stage의 60%. 실제 측정은 두 QA 화면 모두 61.00%
- 읽기·조작 최소값: 설정 42×42px, 배지 14px, 문제 수 16.8px, 지시문 18px, 패널 간격 8px
- 대표 오개념: 간격이 달라짐, 줄에서 벗어남, 원 크기가 달라짐
- 입력 통계: 문제당 4/4/4/4회(최소/중앙값/평균/최대), 한 판 총 43회
- 이전 흐름 캡처: `_archive/20260723-pre-harness-remediation/screenshots/`
- 상세 기준 비교: `BENCHMARK_AUDIT.md`

## 엔진 소스

- `_lessons/3-2-3-4-mathmon-circle-pattern/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-4-mathmon-circle-pattern/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-4-mathmon-circle-pattern/view.js`: 원 무늬 SVG와 화면 렌더링
- `_lessons/3-2-3-4-mathmon-circle-pattern/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape}-*.png`에 1280×800과 1024×768의 첫 화면, 설정, 방법 보기, 문제, 오답, 정답 확인, 보상, 결과 화면이 있습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.

## 문제 화면 진행 장면

- 생성 원본: `play-progress-source.png`
- 6단계 컨택시트: `play-progress-contact-sheet.png`
- 런타임 자산: `play-progress-{dot,small,pattern,big,design,rainbow}-generated.webp`
- 여섯 장 모두 같은 카메라에서 무지개유니몬 전신과 원 무늬의 변화를 보여 주며, 문제 화면 왼쪽 고정 패널에서 `object-fit: contain`으로 표시합니다.
