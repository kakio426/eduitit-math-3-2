# 매스몬 원 무늬 디자이너 제작 보고 (3-2-3-4) ★ 단원 정점

## 이번 고도화

- 기존 검은 패널과 왼쪽 점수 장치를 생성 이미지 기반의 밝은 판타지 무늬 공방으로 교체했습니다.
- 한 보드에 가·나·다·라 후보 원을 겹치던 방식을 완성된 미니 무늬 4개 선택으로 바꿨습니다.
- 문제 화면을 `큰 질문 → 원 3개와 다음 자리 → 한 줄 지시 → 미니 무늬 선택지`로 줄였습니다.
- 오답을 고르면 선택한 잘못된 무늬를 크게 보여 주고 한 가지 이유만 안내합니다.
- 소스 엔진을 `_lessons/3-2-3-4-mathmon-circle-pattern/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 수학 설계

- 가로 무늬 4개, 위로 이어지는 무늬 3개, 아래로 이어지는 무늬 3개가 한 판에 나옵니다.
- 각 문제는 정답 1개와 간격·줄·크기 오개념 3개를 갖습니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 기준선은 원 중심을 이어 같은 줄을 볼 수 있게 돕고, 원의 위치와 크기가 실제 정답을 결정합니다.
- 색은 선택 결과를 돕는 보조 신호이며, 규칙은 위치·간격·크기로 구별합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 무늬 공방, 빛, 리본, 수정 조각, 장식용 제작 기계
- SVG: 기준선, 같은 크기의 원 3개, 다음 자리, 완성 후보
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `무늬 빛` 하나입니다.
- 일반 증감, 큰 증가, 완벽한 무늬, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면에서는 현재 빛과 결과 미리보기를 숨겼습니다.
- 정답 확인 뒤 학생이 `무늬 보기`를 눌러 보상을 엽니다.

## Humanizer 학생 문구 QA

- `규칙에 맞는 후보 자리`를 `같은 크기와 간격으로 이어진 그림`으로 바꿨습니다.
- 오답 피드백은 `간격이 넓어졌어요`, `줄에서 벗어났어요`, `원 크기가 달라졌어요`처럼 한 차이만 말합니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·무늬·지시문·선택지 겹침 0, 원과 카드 경계 잘림 0

## 검증 결과

- `node scripts/qa-engine-unit3-circle-pattern-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-contract.mjs` → PASS
- `node scripts/check-stage-ratio.mjs` → PASS (21개 패키지)
- `node scripts/qa-lesson-flow.mjs 3-2-3-4-mathmon-circle-pattern` → PASS
- 브라우저 QA: 1280×800, 1024×768 전체 흐름에서 이미지 누락·텍스트 넘침·요소 겹침 0

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
