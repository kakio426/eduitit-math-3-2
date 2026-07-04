# 매스몬 피자 분수 가게 제작 보고 (3-2-4-1)

## 한 일

- `3-2-3-1-mathmon-target-hit`(검증된 SVG 보드 스캐폴드)을 복제해 **4단원(분수) 도입 차시**로 개조했습니다.
- 원 도형 선택 보드를 **피자 등분 SVG + 분수 1단계 선택**으로 교체했습니다.
- 보상 룰렛(5종)·결과 보기·등급 트랙·정답 수 게이트·오디오·Stage/설정 모달 계약은 그대로 재사용하고 라벨만 피자 테마로 바꿨습니다.

## 핵심 구현

- 문제 생성: `buildProblems`(10문제) → `buildPizzaProblem()`.
  - `den ∈ {2,3,4,5,6,8}`, `num = randomInt(1, den-1)`. 정답 `num/den`.
  - 오답 풀: 뒤바꿈 `den/num`, 여집합 `(den-num)/den`, 전체±1, 색칠±1 → 4개 distinct 보장(부족 시 분모 키워 보충).
- SVG 렌더: `drawPizzaSlices`(원을 `den`등분, `problem.shaded` 배열에 따라 `num`조각 색칠. 일부 문제는 색칠 조각을 떨어뜨려 배치) + `wedgePath`/`polarPt`(부채꼴 경로) + `pulseBoard`(정답 pop·오답 shake).
- 분수 표기: `fracHtml`(분자/분모 세로 스택, `.frac` CSS). 선택지 버튼에 분수 그대로 렌더.
- 단계 엔진: `buildSteps`(1단계, `correctKey`/`correctText`), `renderStep`(피자+선택지), `handleStepChoice`(보드 펄스+공개). 원·산술 전용 함수(candSvg/highlightCandidate/labelPos 등)는 제거.
- 설명 흐름: `tutorialScreen`은 피자 조각을 분수로 보는 2페이지, `goalScreen`은 10문제·피자 점수·마지막 등급을 안내하는 3페이지로 분리했습니다. 설정의 `방법 다시 보기`는 두 설명 페이지를 거친 뒤 원래 화면으로 돌아옵니다.

## 검증

- 인라인 JS 문법 검사: 네 차시 `index.html`의 `<script>`를 추출해 `new Function(js)`로 확인, 모두 통과.
- 정적 자산 검사: 네 차시의 `src`/`href`/CSS `url()` 참조 파일 존재 확인, 모두 통과.
- Stage 계약: 루트에서 `node scripts/check-stage-ratio.mjs` 실행, `Stage ratio contract OK (18 lesson packages, 16:10 / 1280x800).` 확인.
- 브라우저 QA: Chrome DevTools CDP로 1280×800과 1024×768에서 첫 화면, 설정 모달, 설명 1(풀이 방법), 설명 2(보상 안내), 문제 1상태, 문제 2상태, 보상 모달, 결과 화면을 캡처했습니다. 설정의 `방법 다시 보기`도 `tutorialScreen → goalScreen → 원래 화면` 복귀를 확인했습니다. 텍스트 넘침·요소 겹침·이미지 로드 실패·레거시 결과 카드/전역 버튼 잔존 0건.
- Humanizer 학생 문구 QA: 설명 문구를 `피자 조각을 분수로 봐요.`, `10문제를 풀어요.`, `맞히면 피자 점수를 받을 기회가 커져요.`, `점수는 오르거나 조금 내려갈 수도 있어요.`처럼 짧은 행동 말로 정리했습니다. 제작자용 표현은 학생 화면에 쓰지 않았습니다.

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

- 문제 조작을 선택 버튼에서 `분수 카드 → 분수 접시` 구조로 바꿨습니다. 큰 분수 카드를 접시에 놓으면 정답이 붙고, 틀리면 카드가 제자리로 돌아가며 한 줄 힌트만 보입니다.
- `setupDragChoice`를 추가해 Pointer Events 기반 이동, 정답 snap-in, 오답 snap-back, 탭 대체 조작, 키보드 Enter/Space, `pointercancel`/`Escape`/`blur` 정리를 처리합니다. HTML5 native `dragstart`/`draggable="true"`는 쓰지 않았습니다.
- 수학적 이유: 피자 조각을 보고 `색칠/전체` 카드를 접시에 대응시키게 해 분모와 분자를 행동으로 연결했습니다. 색칠 조각이 떨어진 문제도 섞어, 붙은 모양이 아니라 전체 중 몇 조각인지 세는 데 집중하게 했습니다.
- 설명 2페이지 예시는 `분수 카드를 접시에 놓아요.` 흐름으로 바꿨고, 학생 화면 문구는 `드래그`/`드롭` 같은 기술어 대신 `놓아요`로 통일했습니다.
- QA: Chrome에서 1280×800과 1024×768 `drag-qa-*-{cover,tutorial-1,tutorial-2,play-first,play-wrong,play-correct-drop,reward,result}.png`를 캡처했습니다. 실제 Pointer Events 정답 이동과 탭 대체 제출 모두 보상 화면까지 확인했습니다.
- 정적 검증: 네 차시 인라인 JS 파싱, `node scripts/check-stage-ratio.mjs`, native drag/drop·레거시 `.sound-toggle`·학생 화면 기술어 `rg` 검사를 통과했습니다.

## 2026-07-04 문제 화면 전면 재구성

- 기존 play 화면의 큰 좌측 보상판을 아래 작은 진행 스트립으로 줄이고, 중앙 수학 작업대가 화면 대부분을 쓰도록 재배치했습니다.
- 피자 그림, 분수 카드, `분수 접시`가 한 시선 안에 들어오게 하고, 정답 뒤에는 `분수 접시`에 카드가 붙은 상태와 피자 색칠 조각 강조가 0.9초 정도 보이게 했습니다.
- 오답 문구는 `전체 조각을 먼저 봐요.`처럼 한 줄만 보이게 유지했습니다.
- fresh CDP QA: 1280×800과 1024×768에서 `play-first`, `play-wrong`, `play-correct-drag`, `reward`, `result`를 새로 캡처했습니다. 텍스트 넘침, 요소 겹침, Stage 밖 이탈 0건입니다.
- Humanizer 학생 문구 QA: 새 문제 화면 문구에는 `드래그`/`드롭` 같은 기술어를 쓰지 않고 `놓아요`, `봐요`, `다시 골라요` 중심으로 유지했습니다.

## 2026-07-04 결과 화면 하네스 보정

- 결과 화면의 큰 SVG 통계 패널을 제거하고, 생성형 결과 장면 위에는 `가게 대박 등급`, `정답 10/10`, `점수 90`, 얇은 점수바만 남겼습니다.
- 보이는 다시 버튼은 imagegen 생성 자산 `result-restart-button-source.png` → `result-restart-button-generated.png` → `result-restart-button-generated.webp`로 추가했습니다. 학생 화면 문구는 짧게 `다시`만 보입니다.
- 실제 조작은 같은 좌표의 투명 `#restartButton` hitbox가 맡습니다. 1280×800에서 버튼 아트와 hitbox는 약 `331.5×135.7`, 1024×768에서는 약 `270.8×110.8`로 일치합니다.
- 브라우저 QA: `result-top-desktop-1280x800.png`, `result-top-tablet-1024x768.png`, `result-retry-desktop-1280x800.png`, `result-retry-tablet-1024x768.png`를 새로 캡처했습니다. 결과 WebP 로드, SVG 텍스트 영역, 버튼 hitbox 정렬, 클릭/Enter/Space 재시작을 확인했습니다.
- 텍스트 넘침·요소 겹침 QA: 1280×800과 1024×768의 최고 결과/다시 도전 상태에서 글자 넘침, CJK 어색한 줄바꿈, 결과 카드 잔존, 버튼 클릭 영역 이탈 0건입니다.

## 동적 HTML 오버레이 범위

- 문제 화면 피자(SVG), 분수 선택지, 한 줄 지시문, 진행도, 하단 피자 점수 미터·등급 트랙은 HTML/JS로 매 판 갱신합니다.
- 결과 화면은 생성형 결과 장면(`resultRaster`) 위에 동적 SVG 점수/점수바/도착 등급만 얹습니다. 칭찬 문구는 접근성용 숨김 텍스트로 남기고, 보이는 다시 버튼은 생성형 버튼 아트가, 실제 조작은 투명 hitbox `#restartButton`이 맡습니다.

## 생성형 이미지 자산 연결

- `cover-generated.webp`는 글자 없는 피자 가게 배경이고, 첫 화면 제목은 `title-logo-source.png` → `title-logo-generated.png` → `title-logo-generated.webp` 3종으로 보관했습니다.
- 시작 버튼은 생성형 버튼 자산 `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`를 네 차시에 연결했습니다.
- 결과 등급 6장(`result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp`)과 실패/재도전 장면 `result-retry-generated.webp`를 생성형 결과 표준에 맞춰 연결했습니다.
- 결과 화면 다시 버튼은 생성형 버튼 자산 `result-restart-button-source.png`, `result-restart-button-generated.png`, `result-restart-button-generated.webp`로 연결했습니다.
- 공용 캐릭터 팩은 `fraction-pack`입니다. `mathmon-fr-01-lambchef`는 `_shared/mathmon/fraction-pack/manifest.json`과 `_shared/mathmon/catalog.json`에서 관리하며, 차시 화면에서는 생성형 커버/결과 장면 안의 매스몬으로 표현합니다.
