# 매스몬 두 배 다리

에듀잇티 수학 게임 시리즈 3학년 2학기 3단원 3차시입니다.

- 학습: 지름은 반지름의 두 배, 반지름은 지름의 반
- 문제: 지름 구하기 5개와 반지름 구하기 5개를 섞은 10문제
- 행동: 두 배 또는 반이 되는 다리 길이 1개 고르기
- 흐름: 첫 화면 → 방법 보기 → 문제 → 정답 확인 → 랜덤 다리 힘 → 결과
- 실행: `index.html`을 브라우저에서 열기

## 학습 화면

원 안의 지름을 중심에서 두 반지름으로 나눠 보여 줍니다. 반지름이 주어지면 두 반지름을 이은 지름을 고르고, 지름이 주어지면 반으로 나눈 반지름을 고릅니다.

선택지는 숫자만 있는 버튼이 아니라 길이가 다른 다리 막대와 cm를 함께 보여 줍니다. 오답에서는 빈칸을 잘못된 값으로 채우지 않고 `4 + 4 ≠ 10`처럼 비교만 합니다. 정답에서만 지름 또는 반지름 칸을 채우고 완성식을 보여 줍니다.

## 화면과 자산

- `problem-stage-generated.webp`: 1280×800 밝은 판타지 다리 공방 문제 배경
- `problem-stage-generated.png`: 1280×800 작업 원본
- `problem-stage-source.png`: imagegen 생성 원본
- 동행 매스몬: `zero-factory-animal-pack`의 수달몬(`zfa-03-sudalmon`)
- 설명 1: 반지름 3 cm 두 개가 `3+3=6`, 지름 6 cm가 되는 모습을 연결
- 설명 2: 10문제·다리 힘 변화·마지막 다리 이름만 안내
- 랜덤 보상: 사건별 `reward-event-*-generated.webp` 6종
- 결과 상태 세트: 6장, 각 1280×800, 고정 제목과 `다시` 버튼 포함
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 원·중심·반지름·지름·다리 길이: SVG
- 선택: 같은 좌표의 HTML 버튼과 접근성 이름

문제 화면에는 큰 질문, 현재 원 관계, 한 줄 지시 또는 피드백, 다리 길이 선택지만 둡니다. 다리 힘과 결과 등급은 문제를 푸는 동안 숨깁니다.

## 보상

중심 보상은 다리 힘 하나입니다. 문제를 끝낼 때 증가·감소·큰 증가·한 번에 완공·0·무지개 중 하나가 나오며, 오답을 거친 문제는 감소 보상을 적용합니다.

## 엔진 소스

- `_lessons/3-2-3-3-mathmon-double-bridge/lesson.json`: 차시 설정·문제·보상·결과
- `_lessons/3-2-3-3-mathmon-double-bridge/model.js`: 문제와 보상 상태
- `_lessons/3-2-3-3-mathmon-double-bridge/view.js`: 원·다리 SVG와 화면 렌더링
- `_lessons/3-2-3-3-mathmon-double-bridge/lesson.css`: 차시 전용 레이아웃
- `index.html`: 빌드 산출물

## 검증 화면

`screenshots/engine-flow-{desktop,tablet-landscape}-*.png`에 1280×800과 1024×768의 첫 화면, 설정, 방법 보기, 문제, 오답, 정답 확인, 보상, 결과 화면이 있습니다.

추가 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
