# 매스몬 표적 맞히기 제작 보고 (3-2-3-1)

## 한 일

- `3-2-1-2-mathmon-rocket-charge`(최신 엔진)를 복제해 **시리즈 최초 도형 차시**로 개조했습니다.
- 산술 세로셈 보드/단계 엔진을 **원 SVG 도형 + 1단계 요소 선택**으로 교체했습니다.
- 보상 룰렛(5종)·결과 측정·등급 트랙·정답 수 게이트·오디오·Stage/소리 계약은 그대로 재사용하고 라벨만 표적 테마로 바꿨습니다.
- 생성형 커버 배경, 제목 아트, 시작 버튼 아트, 결과 등급 이미지 6장과 retry 이미지를 연결했습니다.
- `circle-pack`을 공용 매스몬 팩으로 등록하고 1차시는 `표적다람몬` 콘셉트로 문서화했습니다.
- 설정 버튼을 `modal-controls` 기준으로 이관하고 배경 소리/효과 소리를 분리했습니다.
- 설명 화면을 2장 흐름(풀이 방법 → 보상/등급/전국 순위)으로 승격했습니다.
- 결과 화면에 `순위` SVG 버튼과 투명 hitbox를 추가하고, `_shared/scoreboard` API bridge를 연결했습니다.

## 핵심 구현

- 문제 생성: `buildProblems`(세 용어 균형 10문제) → `buildCircleProblem(term)`.
  - 320×320 viewBox, 중심(160,160) 반지름 120, `pointAt(각도)`로 테두리 점.
  - 후보 4개에 가·나·다·라 배정, 정답 정확히 1개(`buildCircleProblem` 검증 스크립트 통과).
- SVG 렌더: `drawTargetDiagram` + `candSvg`(점/선분) + `segLabelPos`(선분 라벨을 중심에서 떨어뜨려 겹침 방지) + `highlightCandidate`(정답 민트/오답 로즈).
- 단계 엔진: `buildSteps`(1단계), `renderStep`(보드+선택지), `handleStepChoice`(하이라이트+공개), `completeStep`(스텝 길이 기반 종료). 산술 전용 함수(updateStepChips/updateCurrentAnswerCell/applyStepToBoard/triggerStepEffect)는 no-op 처리.

## 전국 순위 구현

- `LESSON_ID`는 폴더명과 같게 두고, `MathmonScoreboard.createApiBridge`로 세션 생성·점수 제출·주간 순위 조회 흐름을 연결했습니다.
- 답안 로그는 문제 번호, 문제 요약, 선택값, 정답값, 정오답, 풀이 시간, 보상 이벤트를 담습니다.
- 결과 화면 `순위` 버튼은 측정 애니메이션이 끝난 뒤 나타나고, 순위판의 `결과로`와 `다시하기` hitbox도 동작합니다.

## 설명 화면 보정

- 설명 1: 차시별 수학 개념을 짧은 단계와 SVG 예시로 보여 줍니다.
- 설명 2: 10문제, 표적 점수, 점수 변동 가능성, 전국 순위를 분리해서 보여 줍니다.
- 1024×768과 1180×760에서 버튼·설정 모달·보상 모달이 잘리지 않도록 설명/모달 compact CSS를 추가했습니다.

## 검증

- `node scripts/check-stage-ratio.mjs` → OK(18 lesson packages).
- 인라인 JS `node --check` 통과.
- 로직 시뮬레이션: 세 용어 × 2000회 모두 정답 1개 + 핵심 오답(지름→radius, 반지름→diameter) 포함.
- JSON 검증: `_shared/mathmon/catalog.json`, `_shared/mathmon/circle-pack/manifest.json` 파싱 통과.
- 브라우저 QA: 로컬 서버 `http://127.0.0.1:4173`에서 1280×800, 1024×768, 1180×760 각각 첫 화면·설명 1·설명 2·첫 문제·정답 선택·보상·결과·전국 순위·설정의 방법 다시 보기 복귀를 Playwright로 확인했습니다. 콘솔 에러 0, 이미지 404 0, SVG text viewBox 이탈 0, 텍스트 넘침·요소 겹침 0.
- 순위 API QA: mock API로 `POST /api/v1/sessions`, `POST /api/v1/scores`, `GET /api/v1/leaderboards/weekly` 호출을 네 차시×세 뷰포트에서 확인했습니다. 긴 닉네임/10행 목록/결과 복귀/다시하기 hitbox도 통과했습니다.
- Humanizer 학생 문구 QA: 새로 보이는 설정/커버/결과 문구를 점검하고 `측정`을 `보기`로 바꿨습니다.

## 동적 HTML 오버레이 범위

- 문제 화면 원 그림(SVG), 선택지, 한 줄 지시문, 진행도, 좌측 표적 점수 미터·등급 트랙은 HTML/JS로 매 판 갱신합니다.
- 결과 화면은 생성형 배경 이미지 위에 SVG 동적 슬롯(`정답 n/10`, 짧은 점수값, `순위`)과 투명 다시하기/순위 hitbox만 둡니다.

## 최종 자산

- 커버/제목/시작: `cover-generated.webp`, `title-logo-generated.webp`, `start-button-generated.webp`.
- 결과: `result-retry-generated.webp`, `result-{miss,edge,hit,bullseye,targetking,legend}-generated.webp`.
- 공용 팩: `_shared/mathmon/circle-pack` (`ci-01-target-chipmunk`).
- 스크린샷: `screenshots/qa-{desktop-1280x800,tablet-1024x768}-{cover,settings,tutorial-1,tutorial-2,play-step1,play-step2,reward,result,scoreboard}.png`와 `screenshots/qa-mid-1180x760-{tutorial-1,tutorial-2,settings,result,scoreboard}.png`.
