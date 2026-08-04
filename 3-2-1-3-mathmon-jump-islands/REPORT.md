# 매스몬 10배 점프섬 REPORT

## 구현 요약

- 대상: 3학년 2학기 1단원 3차시 `(몇십)×(몇십), (몇십몇)×(몇십)`
- 배포 파일: `3-2-1-3-mathmon-jump-islands/index.html`
- 제작 원본: `_lessons/3-2-1-3-mathmon-jump-islands/lesson.json`, `model.js`, `view.js`, `lesson.css`
- 공용 엔진: `_engine/v1` 산출물
- Stage: `16:10`, `1280x800`
- 선언 마커: `data-engine-version="mathmon-engine-v1"`, `data-workbench-type="jump-islands"`, `data-reward-mode="modal-art"`, `data-result-render-mode="fullscene-score-slot"`, `data-scoreboard-enabled="false"`

## 엔진 이관 범위

공용 엔진이 맡는 부분:

- 첫 화면, 설명 화면, 문제 흐름, 설정 모달
- 정답 확인 후 보상 버튼 노출
- 보상 이벤트 선택과 적용
- 보상 이미지 모달
- 결과 화면 전환과 공용 정답 수 이미지 연결
- 순위 진입과 관련 네트워크 요청 차단

1-3 차시가 맡는 부분:

- 10배/100배 문제 생성
- 작은 곱 선택과 0 붙이기 검증
- 점프섬 지도 조작판 렌더링
- 바람 이미지와 결과 섬 이미지 연결

## 문제 구조

한 판은 10문제입니다.

- `(A0)×(B0)`: `A×B`를 고르고 `0 두 개 붙이기`
- `(AB)×(C0)`: `AB×C`를 고르고 `0 한 개 붙이기`
- 각 문제는 두 단계를 모두 첫 시도에 맞혀야 정답 수 1개로 셉니다.
- 최종 답은 한 판 안에서 겹치지 않게 뽑습니다.

## 보상과 결과

보상은 `modal-art` 모드입니다. 문제 화면을 가리지 않도록 보상은 모달 이미지 한 장과 바람 이름, 다음 버튼만 보여 줍니다.

보상 이벤트:

| 바람 | 변화 | 가중치 |
| --- | ---: | ---: |
| 살랑 바람 | +2~+5 | 6400 |
| 앞바람 | -8~-4 | 1700 |
| 잠깐 멈춤 | 0 | 1284 |
| 쌩쌩 바람 | +8~+13 | 598 |
| 무지개 길 | +14 | 18 |
| 길이 흔들렸어요 | -14~-8 | 오답 문제 |

결과는 `fullscene-score-slot` 모드입니다. `result-final-*` 이미지가 도착 섬 장면과 버튼 표면을 맡고, 정답 수는 `_shared/result-count/result-correct-*-generated.webp` 공용 이미지로 표시합니다.

## 순위 기능

현재 제품 정책에 따라 순위 기능은 비활성화했습니다. `scoreboard.enabled=false`이며 결과 화면의 진입 버튼은 숨김·비활성 상태입니다. 현재 흐름 QA는 순위·리더보드·점수 API 관련 네트워크 요청이 0건인지 함께 검사합니다.

## 검증

실행한 검사:

- `node scripts/build-lesson.mjs 3-2-1-3-mathmon-jump-islands`
- `node scripts/check-lesson-contract.mjs`
- `node scripts/qa-lesson-flow.mjs 3-2-1-3-mathmon-jump-islands 12345`
- `node scripts/qa-unit1-result-screens.mjs`
- 생성된 `index.html` 인라인 스크립트 문법 검사
- 브라우저 QA `1280x800`: cover → tutorial → 10문제 → reward modal → result
- 브라우저 QA `1024x768`: 같은 흐름 완주

브라우저 QA 결과:

- 텍스트 넘침 0건
- 보이는 이미지 누락 0건
- 결과 정답 수 생성 이미지 정상 표시
- 결과 화면 다시 하기 hitbox 정상 작동
- 순위 화면 진입 0건
- 순위 관련 네트워크 요청 0건

증거 파일:

- 데스크톱 전체 흐름: `screenshots/report-flow-desktop-contact-sheet.png`
- 태블릿 가로 전체 흐름: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- 현재 실행본 해시와 캡처 목록: `screenshots/report-evidence-manifest.json`

## 현재 화면 설명과 화면 크기

- 시작: 제목, 한 줄 목표, 공용 시작 버튼이 먼저 보입니다.
- 설명: 곱셈에서 0을 붙이는 순서를 한 장에서 확인합니다.
- 문제: 작은 곱을 고른 뒤 0을 붙여 답을 완성합니다.
- 보상: 정답 확인 뒤 바람 상자를 열고 다음 문제로 갑니다.
- 결과: 도착한 섬과 정답 수, 다시 하기 버튼을 보여 줍니다.
- 화면 크기: 1280×800과 1024×768에서 같은 흐름을 확인했습니다.
