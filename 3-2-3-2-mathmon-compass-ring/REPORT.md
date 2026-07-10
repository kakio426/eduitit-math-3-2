# 매스몬 컴퍼스 마법진 제작 보고 (3-2-3-2)

## 이번 고도화

- 기존 검은 패널과 왼쪽 점수 장치를 생성 이미지 기반의 밝은 마법 기하 작업실로 교체했습니다.
- 숫자 버튼만 고르던 방식을 눈금과 실제 벌림이 보이는 컴퍼스 그림 4개 선택으로 바꿨습니다.
- 문제 화면을 `큰 질문 → 반지름 그림 → 한 줄 지시 → 컴퍼스 선택지`로 줄였습니다.
- 오답에는 반지름과 선택한 벌림을 `≠`로, 정답에는 `=`로 비교하는 확인 상태를 추가했습니다.
- 소스 엔진을 `_lessons/3-2-3-2-mathmon-compass-ring/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 수학 설계

- 반지름 2~6 cm가 한 판에 각각 두 번 나옵니다.
- 각 문제는 정답, 지름만큼 벌린 보기, 1 cm 좁은 보기, 1 cm 넓은 보기로 구성합니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 컴퍼스의 침과 연필 끝 사이 길이가 눈금에서 직접 보입니다.
- 정답 확인 화면은 `원의 반지름 = 컴퍼스 벌림`을 같은 화면에서 연결합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 마법 기하 작업실, 빛, 책상, 장식용 컴퍼스와 수정 도구
- SVG: 원, 중심점, 반지름, 눈금, 컴퍼스 두 다리, `=`·`≠`
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `마법진 빛` 하나입니다.
- 일반 증감, 큰 증가, 완벽한 원, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면에서는 현재 빛과 결과 미리보기를 숨겼습니다.
- 정답 확인 뒤 학생이 `마법 보기`를 눌러 보상을 엽니다.

## Humanizer 학생 문구 QA

- `컴퍼스 벌림과 반지름의 관계`는 목표 문장에서만 쓰고, 실제 행동은 `반지름만큼 벌어진 컴퍼스를 골라요.`로 줄였습니다.
- 오답 피드백은 `조금 좁아요`, `조금 넓어요`, `지름이 아니라 반지름만큼`처럼 눈앞의 차이를 바로 말합니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·원·지시문·선택지 겹침 0, 컴퍼스 눈금 잘림 0

## 검증 결과

- `node scripts/qa-engine-unit3-compass-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- `node scripts/check-lesson-contract.mjs` → PASS
- `node scripts/check-stage-ratio.mjs` → PASS (21개 패키지)
- `node scripts/qa-lesson-flow.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- 브라우저 QA: 1280×800, 1024×768 전체 흐름에서 이미지 누락·텍스트 넘침·요소 겹침 0

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
