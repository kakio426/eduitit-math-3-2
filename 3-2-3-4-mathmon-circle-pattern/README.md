# 매스몬 원 무늬 디자이너 ★ 단원 정점

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 4차시입니다.

- 학습: 반지름과 지름의 관계를 이용해 컴퍼스로 여러 크기의 원 그리기
- 문제: 반지름 조건 5문제와 지름 조건 5문제
- 행동: 자에서 컴퍼스의 반지름을 맞춘 뒤 `원 그리기` 누르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 → 원의 점수 → 완성한 정원
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

문제 화면은 왼쪽 도구 칸과 오른쪽 원 칸으로 나뉩니다. 학생은 컴퍼스 바늘을 자의 `0`에 둔 채 연필 다리를 조건에 맞는 눈금으로 옮깁니다.

- 반지름 조건: 주어진 길이와 같은 눈금에 맞춥니다.
- 지름 조건: 지름의 반을 반지름으로 맞춥니다.
- 짧은 오답: 선택한 반지름으로 작은 원을 그린 뒤 `반지름이 조건보다 짧아요.`라고 알려 줍니다.
- 긴 오답: 선택한 반지름으로 큰 원을 그린 뒤 `반지름이 조건보다 길어요.`라고 알려 줍니다.

정답을 고르면 자와 컴퍼스를 그대로 남긴 채 오른쪽에 완성 원을 크게 그립니다. 반지름 문제는 `반지름 N cm`, 지름 문제는 `지름 N cm` 이름표를 보여 준 뒤 학생이 `정원 보기`를 눌러 보상을 확인합니다.

## 화면과 자산

- `problem-stage-generated.webp`: 1280×800 밝은 판타지 무늬 공방 문제 배경
- `problem-stage-generated.png`: 1280×800 작업 원본
- `problem-stage-source.png`: imagegen 생성 원본
- 동행 매스몬: `diversity-reward-pack`의 무지개유니몬(`mathmon-drv-09-rainbowunicorn`)
- 설명 1: 바늘을 `0`에 대기 → 연필 다리를 눈금에 맞추기 → 원 그리기
- 설명 2: 10문제·원의 점수 변화·마지막에 완성한 정원 안내
- 닫힌 보상: `reward-event-closed-v2-generated.webp` 1종
- 랜덤 보상: 사건별 `reward-event-*-generated.webp` 6종
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`(닫힘 포함 7종)
- 결과 상태 세트: 동글 씨앗·반짝 꽃·별빛 꽃·달빛 정원·황금 정원·무지개 정원 6장, 각 1280×800
- 결과 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/result-fullscene-v2/contact-sheets/result-garden-v2-contact-sheet.png`
- 문제 화면 진행 보상: 결과 6단계와 1:1인 `play-pattern-v1-*-generated.webp` 6장, 각 768×1536
- 진행 보상 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/source`
- 진행 보상 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/contact-sheets/play-pattern-progress-v1-contact-sheet.png`
- 매스몬 픽셀 앵커 검수: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/contact-sheets/play-pattern-progress-v1-anchor-audit.png`
- 자·컴퍼스·중심점·반지름선·완성 원: SVG
- 조작: Pointer Events와 키보드 방향키를 지원하는 반지름 슬라이더, `원 그리기` HTML 버튼

컴퍼스 연필 다리는 `role="slider"`로 현재값·최솟값·최댓값을 읽어 주며, 손잡이 터치 영역은 `50×50px`입니다.

문제 화면 왼쪽에는 지금 완성한 정원 장면 하나만 보여 줍니다. 오른쪽에는 조건 한 줄, 자와 컴퍼스, 중심점과 원, `원 그리기` 버튼만 둡니다.

## 보상

중심 보상은 `원의 점수` 하나입니다. 문제를 끝낼 때 증가·감소·큰 증가·완벽·0·무지개 중 하나가 나오며, 오답을 거친 문제는 감소 보상을 적용합니다. 최종 결과에서는 내부 점수와 막대를 숨기고 학생이 완성한 정원을 가장 크게 보여 줍니다.

## 공통 화면·QA 계약

- 시작 버튼: `shared-canonical-v1`, 공용 자산 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 표시 크기: 1280 화면 360×152px, 1024 화면 최소 300×127px, 비율 `1611 / 680`
- 문제 HUD: 왼쪽 브랜드, 가운데 `1/10`, 오른쪽 `3단원 원`; 진행 막대는 숨김
- 왼쪽 진행 보상: `stage-left-play-progress-v1`, Stage 기준 `left 2.5% / top 11% / width 24.5% / height 84%`, `object-fit: contain`
- 작업 영역 최소 폭: Stage의 65%. 현재 등록 화면에서 실제 폭은 약 68%
- 읽기·조작 최소값: 설정 42×42px, 배지 14px, 문제 수 16.8px, 지시문 18px, 패널 간격 8px
- 대표 오개념: 반지름이 짧음, 반지름이 김, 지름을 그대로 반지름으로 사용함
- 수학적 판단: 문제당 반지름 결정 1회. `원 그리기`는 선택한 길이를 확정하고 결과를 보는 행동입니다.
- 이전 흐름 캡처: `_archive/20260723-pre-harness-remediation/screenshots/`
- 상세 기준 비교: `BENCHMARK_AUDIT.md`

## 엔진 소스

- `_lessons/3-2-3-4-mathmon-circle-pattern/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-4-mathmon-circle-pattern/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-4-mathmon-circle-pattern/view.js`: 자·컴퍼스·원 SVG와 화면 렌더링
- `_lessons/3-2-3-4-mathmon-circle-pattern/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape}-*.png`에 1280×800과 1024×768의 첫 화면, 설정, 방법 보기, 문제, 오답, 정답 확인, 보상, 결과 화면이 있습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
