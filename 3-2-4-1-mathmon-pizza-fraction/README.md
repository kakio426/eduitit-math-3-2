# 매스몬 피자 분수 가게

에듀잇티 수학 게임 시리즈 4단원(분수) 1차시입니다.

- 대상: 3학년 2학기 4단원 1차시
- 학습: 부분과 전체로 분수 나타내기
- 문제: 피자(원)를 전체 조각으로 나누고 일부를 색칠한 그림을 분수로 나타내는 문제 10개 랜덤 출제
- 방식: 중앙의 큰 피자 작업대에서 분수 카드를 `분수 접시`에 놓는 1단계 조작형. 카드를 탭한 뒤 접시를 탭해도 제출됨
- 보상: 한 문제를 끝낼 때마다 랜덤 피자 점수 이벤트가 일어남(토핑 추가/한 입 먹힘/바닥/완벽한 피자/무지개)
- 결과: 10판이 끝나면 피자 점수로 `한 조각 → 반 판 → 한 판 → 특대 판 → 가게 대박` 중 어디까지 갔는지 보여 줌. 무지개 점수면 `전설 피자`. 점수가 0이면 다시하기
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 피자 분수 가게`는 분수의 시작인 **부분과 전체**를 피자 그림으로 보여 줍니다. 전체 조각 수가 분모, 색칠한 조각 수가 분자라는 것을 글 설명이 아니라 **색칠된 피자 조각**으로 직접 보고 고르게 합니다. 보기에는 정답 `색칠/전체`와 함께 이 차시 핵심 오개념인 **분자·분모 뒤바꿈(`전체/색칠`)**, **색칠 안 된 조각으로 분자 세기(`(전체−색칠)/전체`)**를 항상 함께 둡니다.

이번 문제 화면은 단순 선택 대신 **분수 카드를 접시에 놓는 행동**으로 바꿨습니다. 큰 피자, 카드, 접시만 먼저 보이게 하고 피자 점수는 아래 작은 줄로 줄였습니다. 학생이 피자를 보고 `전체 중 색칠된 조각`을 하나의 분수 카드로 대응시키게 하기 위해서입니다. 일부 문제에서는 색칠 조각이 떨어져 있을 수 있어, 붙어 있는 모양보다 **전체 중 몇 조각인지 세는 것**이 중요하다는 점을 드러냅니다.

한 문제를 끝낼 때마다 피자 점수에 일이 일어납니다. 보통은 점수가 오르지만, 가끔 크게 오르거나, 줄거나, 바닥이 되거나, 완벽한 피자로 직행하거나, 무지개 점수가 켜집니다. 문제 안에서 한 번이라도 틀리면 누수 이벤트로 처리합니다. 점수는 푸는 동안 전면에 두지 않고 한 판이 끝난 뒤 등급으로 보여 줍니다. `가게 대박`은 어려운 최상위, `전설 피자`는 그보다 보기 힘든 secret 등급입니다.

## 시리즈 정체성

- 화면 골격(첫 화면 → 설명 → 문제 → 보상 → 결과), 상단 배지, 설정 모달, 16:10/1280×800 Stage 계약은 시리즈 공통입니다.
- 설명은 2장 흐름입니다. 2페이지는 피자 조각을 분수로 보는 방법, 3페이지는 10문제·피자 점수·마지막 등급을 안내합니다.
- 문제 화면 도형(피자)은 생성 이미지가 아니라 **SVG**로 그립니다(읽기 쉬운 UI 우선).
- 문제 화면은 Pointer Events 기반 카드/자리 조작과 탭 대체 조작을 함께 지원합니다.

## 전국 순위 API

- 결과 화면에서 `순위`를 누르면 `_shared/scoreboard/scoreboard-ui.js` 공통 순위 화면으로 이동합니다.
- `LESSON_ID`는 `3-2-4-1-mathmon-pizza-fraction`, 순위 종류는 `fraction-pizza`입니다.
- 답안 로그는 `name` 1단계입니다. 학생이 처음 고른 분수 카드를 `selected`, 정답 분수를 `expected`로 보냅니다.
- API 주소는 `window.MATHMON_SCOREBOARD_API_URL` 또는 `?scoreboardApi=`로 받습니다. 주소가 없거나 호출에 실패해도 게임 결과는 정상으로 남고, 순위 화면만 안내 상태로 보입니다.

## 자산 상태 (완료)

- 첫 화면은 `data-cover-standard="generated-title-overlay"`와 `data-cover-start-standard="generated-button-art"` 표준입니다. `cover-generated.webp`는 글자 없는 피자 가게 배경이고, 제목은 생성형 이미지 산출물 `title-logo-generated.webp`, 시작 버튼은 `start-button-generated.webp`로 얹습니다.
- 보관 자산: `title-logo-source.png`, `title-logo-generated.png`, `title-logo-generated.webp`, `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`.
- 결과 화면은 `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`입니다. 결과 등급 6장(`result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp`)과 `result-retry-generated.webp`를 사용하고, 보이는 CSS 결과 카드·본문·큰 버튼 장식은 두지 않습니다.
- 공용 매스몬 관리는 `_shared/mathmon/fraction-pack/`와 `_shared/mathmon/catalog.json`에서 합니다. 이 차시는 `mathmon-fr-01-lambchef` 콘셉트를 기준으로 한 생성형 커버/결과 장면을 사용하며, 별도 HTML 매스몬 오버레이는 쓰지 않습니다.
- QA 스크린샷은 기존 `qa-*`/`verify-*`/`drag-qa-*` 세트에 더해 `screenshots/intuitive-qa-{desktop-1280x800,tablet-1024x768}-{play-first,play-wrong,play-correct-drag,reward,result}.png`로 갱신했습니다.
