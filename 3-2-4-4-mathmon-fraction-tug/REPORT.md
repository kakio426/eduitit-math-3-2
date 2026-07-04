# 매스몬 분수 줄다리기 제작 보고 (3-2-4-4) ★ 단원 정점

## 한 일

- `3-2-4-1-mathmon-pizza-fraction`을 복제해 **분수 크기 비교(단원 정점)** 차시로 개조했습니다.
- 피자 분수 보드를 **두 분수 비교 막대 카드 + 승리 자리**로 바꿨습니다.
- 보상 룰렛(5종)·결과 보기·등급 트랙·정답 수 게이트·오디오·Stage/설정 모달 계약·rAF 모션은 그대로 재사용하고 라벨만 줄다리기 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildCompareProblem()`.
  - 10문제 안에 분모 같은 분수 비교 5문항, 단위분수 비교 5문항이 나오도록 유형을 먼저 나누고 순서만 섞습니다.
  - 분모 같음(같은 den 3~8, 서로 다른 num) 또는 단위분수(num=1, 서로 다른 den 2~8)를 생성합니다.
  - 정답 위치(좌/우) 랜덤. `candidates`=두 분수, 더 큰 쪽이 `isAnswer`. `biggerText`로 정답 표기.
- 보드: `drawFractionBars(problem)` + `fractionBar(y,f,side,W,padx)` — 두 분수를 같은 전체 길이 막대에 `den`칸으로 나누고 `num`칸 채움. 길이로 크기 비교가 보이게.
- 단계 엔진: `buildSteps`(1단계 비교, 유형별 hint), `renderStep`(막대+2선택지), `handleStepChoice`(보드 펄스+공개).
- 설명 흐름: `tutorialScreen`은 막대 길이로 더 큰 분수를 찾는 2페이지, `goalScreen`은 10문제·줄다리기 점수·마지막 등급을 안내하는 3페이지로 분리했습니다. 설정의 `방법 다시 보기`는 두 설명 페이지를 거친 뒤 원래 화면으로 돌아옵니다.

## 검증

- 인라인 JS 문법 검사: 네 차시 `index.html`의 `<script>`를 추출해 `new Function(js)`로 확인, 모두 통과.
- 정적 자산 검사: 네 차시의 `src`/`href`/CSS `url()` 참조 파일 존재 확인, 모두 통과.
- Stage 계약: 루트에서 `node scripts/check-stage-ratio.mjs` 실행, `Stage ratio contract OK (18 lesson packages, 16:10 / 1280x800).` 확인.
- 브라우저 QA: Chrome DevTools CDP로 1280×800과 1024×768에서 첫 화면, 설정 모달, 설명 1(풀이 방법), 설명 2(보상 안내), 문제 1상태, 문제 2상태, 보상 모달, 결과 화면을 캡처했습니다. 설정의 `방법 다시 보기`도 `tutorialScreen → goalScreen → 원래 화면` 복귀를 확인했습니다. 텍스트 넘침·요소 겹침·이미지 로드 실패·레거시 결과 카드/전역 버튼 잔존 0건.
- Humanizer 학생 문구 QA: 설명 문구를 `더 큰 분수를 찾아요.`, `막대 길이를 나란히 봐요.`, `분모가 같으면 분자가 큰 쪽을 골라요.`, `10문제를 풀어요.`처럼 짧은 행동 말로 정리했습니다. 제작자용 표현은 학생 화면에 쓰지 않았습니다.

## 2026-07-04 재검증 및 보정

- 루트에서 `node scripts/check-stage-ratio.mjs`, `node scripts/check-rule-consistency.mjs`, 네 차시 인라인 JS 파싱 검사를 다시 실행해 모두 통과했습니다.
- Chrome DevTools CDP로 1280×800과 1024×768에서 `cover`, `settings`, `tutorial-1`, `tutorial-2-goal`, `play-step1`, `play-confirm`, `reward`, `result`를 다시 캡처했습니다. 10문항 정답 흐름으로 결과 화면까지 도착했고 `정답 10/10`을 확인했습니다.
- 2쪽/3쪽 설명 화면 전용 QA: `verify-guide-*-tutorial.png`, `verify-guide-*-goal.png`를 새로 캡처했습니다. 설명 버튼은 Stage 하단 중앙 안전영역으로 옮겼고, 기준 표시 크기는 1280×800에서 약 `457.5×125.5`, 1024×768에서 약 `447.9×130.2`입니다.
- 텍스트 넘침·요소 겹침 QA: 위 두 화면 크기와 상태 전체에서 글자 넘침, 선택지 겹침, 설정 버튼 충돌, 이미지 로드 실패, SVG 텍스트 영역 이탈 0건입니다.
- 설명 화면 보정: 제목 크기, 단계 카드 높이, 예시 보드와 태블릿 예시 칩 간격을 줄여 풀이 방법/보상 설명과 하단 버튼이 서로 덮이지 않게 했습니다.
- 태블릿 가로에서 보상 카드가 Stage 높이에 걸릴 수 있어 `@media (max-width: 1100px)`에서 보상 아트 크기와 카드 간격을 줄였습니다.
- 결과 화면 `#restartButton` hitbox는 1280px 고정 좌표 대신 Stage 비율 기준 퍼센트 좌표로 바꿔 1024×768에서도 결과 화면 안에 정확히 머물게 했습니다.
- 새 리마스터용 매스몬 팩 `_shared/mathmon/fraction-friends-pack`을 생성하고 catalog에 `ready` 상태로 등록했습니다. 현재 커버/결과 장면의 매스몬은 생성 이미지 안에 baked-in 되어 있어, 새 팩을 실제 화면에 보이게 하려면 커버·결과 장면 재생성이 필요합니다.

## 2026-07-04 드래그 기반 문제 화면 개선

- 문제 조작을 선택 버튼에서 `분수 카드 → 더 큰 분수 승리 자리` 구조로 바꿨습니다. 두 막대 전체를 각각 큰 분수 카드로 다루고, 더 긴 막대의 카드를 중앙 승리 자리에 옮깁니다.
- `setupDragChoice`를 추가해 Pointer Events 기반 이동, 정답 snap-in, 오답 snap-back, 탭 대체 조작, 키보드 Enter/Space, `pointercancel`/`Escape`/`blur` 정리를 처리합니다. HTML5 native `dragstart`/`draggable="true"`는 쓰지 않았습니다.
- 수학적 이유: 분모가 같은 분수는 채운 칸 수, 단위분수는 한 칸 길이를 먼저 보게 하려고 `더 큰 분수`를 승리 자리로 옮기게 했습니다. 카드 탭만으로도 제출되게 해, 태블릿에서 조작 부담이 커지지 않게 했습니다.
- 설명 2페이지 예시는 `더 긴 분수 카드를 승리 자리에 놓아요.` 흐름으로 바꿨고, 학생 화면 문구는 `드래그`/`드롭` 같은 기술어 대신 `옮겨요`와 `놓아요`로 통일했습니다.
- QA: Chrome에서 1280×800과 1024×768 `drag-qa-*-{cover,tutorial-1,tutorial-2,play-first,play-wrong,play-correct-drop,reward,result}.png`를 캡처했습니다. 실제 Pointer Events 정답 이동과 카드 탭 대체 제출 모두 보상 화면까지 확인했습니다.
- 정적 검증: 네 차시 인라인 JS 파싱, `node scripts/check-stage-ratio.mjs`, native drag/drop·레거시 `.sound-toggle`·학생 화면 기술어 `rg` 검사를 통과했습니다.

## 2026-07-04 문제 화면 전면 재구성

- 기존 play 화면의 큰 좌측 보상판을 아래 작은 진행 스트립으로 줄이고, 중앙 수학 작업대가 화면 대부분을 쓰도록 재배치했습니다.
- 보기 카드도 숫자만이 아니라 작은 분수 막대로 바꿔, 중앙 막대와 아래 막대가 같은 판단 기준을 쓰게 했습니다.
- 정답 뒤에는 더 긴 막대가 승리 자리에 붙고, 중앙 비교 막대의 이긴 쪽이 강조된 상태로 보입니다.
- fresh CDP QA: 1280×800과 1024×768에서 `play-first`, `play-wrong`, `play-correct-drag`, `reward`, `result`를 새로 캡처했습니다. 텍스트 넘침, 요소 겹침, Stage 밖 이탈 0건입니다.
- Humanizer 학생 문구 QA: 새 문제 화면 문구에는 `드래그`/`드롭` 같은 기술어를 쓰지 않고 `옮겨요`, `놓아요`, `골라요` 중심으로 유지했습니다.

## 2026-07-04 수학 출제 균형 보정

- 10문제 생성 시 분모 같은 분수 비교 5문항, 단위분수 비교 5문항이 나오도록 `buildProblems()`에서 유형 계획을 먼저 만들고 순서만 섞게 했습니다.
- 수학적 이유: 이 차시의 핵심 비교 규칙이 두 가지라, 완전 랜덤으로 한 규칙이 적게 나오거나 빠지는 판을 막았습니다.
- 검증: fresh CDP QA에서 `buildProblems()` 결과가 `unit 5 / same-den 5`로 생성되는 것을 다시 확인했습니다.

## 2026-07-04 결과 화면 하네스 보정

- 결과 화면의 큰 SVG 통계 패널을 제거하고, 생성형 결과 장면 위에는 `챔피언 등급`, `정답 10/10`, `점수 90`, 얇은 점수바만 남겼습니다.
- 보이는 다시 버튼은 imagegen 생성 자산 `result-restart-button-source.png` → `result-restart-button-generated.png` → `result-restart-button-generated.webp`로 추가했습니다. 학생 화면 문구는 짧게 `다시`만 보입니다.
- 실제 조작은 같은 좌표의 투명 `#restartButton` hitbox가 맡습니다. 1280×800에서 버튼 아트와 hitbox는 약 `331.5×135.7`, 1024×768에서는 약 `270.8×110.8`로 일치합니다.
- 브라우저 QA: `result-top-desktop-1280x800.png`, `result-top-tablet-1024x768.png`, `result-retry-desktop-1280x800.png`, `result-retry-tablet-1024x768.png`를 새로 캡처했습니다. 결과 WebP 로드, SVG 텍스트 영역, 버튼 hitbox 정렬, 클릭/Enter/Space 재시작을 확인했습니다.
- 텍스트 넘침·요소 겹침 QA: 1280×800과 1024×768의 최고 결과/다시 도전 상태에서 글자 넘침, CJK 어색한 줄바꿈, 결과 카드 잔존, 버튼 클릭 영역 이탈 0건입니다.

## 2026-07-04 스코어보드 API 연동

- 결과 화면에 SVG `순위` 버튼과 투명 hitbox `#leaderboardButton`을 추가하고, 별도 `#scoreboardScreen`을 `_shared/scoreboard/scoreboard-ui.js`의 `MathmonScoreboard.createApiBridge(...)`에 연결했습니다.
- `LESSON_ID`는 `3-2-4-4-mathmon-fraction-tug`, `data-scoreboard-result-kind`는 `fraction-tug`입니다. 차시별 생성형 순위 제목 자산은 아직 없어서 공통 SVG 제목 fallback을 씁니다.
- 답안 로그는 `compare` 1단계입니다. 정답 쪽 `left/right`를 `expected`, 학생이 처음 고른 쪽을 `selected`로 저장합니다.
- API 주소는 `window.MATHMON_SCOREBOARD_API_URL` 또는 `?scoreboardApi=`로 받습니다. API 주소가 없거나 호출 실패 시 게임 완료는 막지 않고, 순위 화면만 안내 상태로 보입니다.
- 브라우저 QA: 메모리 API 서버(`http://127.0.0.1:4179`)와 정적 서버(`http://127.0.0.1:4180`)로 1280×800/1024×768에서 `결과 → 순위 → 점수 제출 → 주간 랭킹 조회`를 확인했습니다. 스크린샷은 `scoreboard-api-desktop-1280x800.png`, `scoreboard-api-tablet-1024x768.png`입니다. SVG 텍스트 `getBBox()` Stage 밖 이탈 0건입니다.

## 동적 HTML 오버레이 범위

- 문제 화면 비교 막대(SVG), 분수 2선택지, 한 줄 지시문, 진행도, 하단 줄다리기 점수 미터·등급 트랙은 HTML/JS로 매 판 갱신합니다.
- 결과 화면은 생성형 결과 장면(`resultRaster`) 위에 동적 SVG 점수/점수바/도착 등급만 얹습니다. 칭찬 문구는 접근성용 숨김 텍스트로 남기고, 보이는 다시 버튼은 생성형 버튼 아트가, 실제 조작은 투명 hitbox `#restartButton`이 맡습니다.

## 생성형 이미지 자산 연결

- `cover-generated.webp`는 글자 없는 줄다리기 배경이고, 첫 화면 제목은 `title-logo-source.png` → `title-logo-generated.png` → `title-logo-generated.webp` 3종으로 보관했습니다.
- 시작 버튼은 생성형 버튼 자산 `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`를 네 차시에 연결했습니다.
- 결과 등급 6장(`result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp`)과 실패/재도전 장면 `result-retry-generated.webp`를 생성형 결과 표준에 맞춰 연결했습니다.
- 결과 화면 다시 버튼은 생성형 버튼 자산 `result-restart-button-source.png`, `result-restart-button-generated.png`, `result-restart-button-generated.webp`로 연결했습니다.
- 공용 캐릭터 팩은 `fraction-pack`입니다. `mathmon-fr-04-championseahorse`는 `_shared/mathmon/fraction-pack/manifest.json`과 `_shared/mathmon/catalog.json`에서 관리하며, 차시 화면에서는 생성형 커버/결과 장면 안의 매스몬으로 표현합니다.
