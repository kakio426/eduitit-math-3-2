# 매스몬 분수 분류 컨베이어

에듀잇티 수학 게임 시리즈 4단원(분수) 3차시입니다.

- 대상: 3학년 2학기 4단원 3차시
- 학습: 진분수·가분수·대분수 구분
- 문제: 분수 1개를 보고 진분수/가분수/대분수 통 3개 중 알맞은 곳에 넣는 문제 10개 균형 출제
- 방식: 중앙의 큰 분수 카드를 `진분수 통`/`가분수 통`/`대분수 통`에 넣는 1단계 조작형. 카드를 탭한 뒤 통을 탭해도 제출됨
- 보상: 한 문제를 끝낼 때마다 랜덤 분류 점수 이벤트(정확 분류/오분류/라인 막힘/완벽 분류/무지개)
- 결과: 10판이 끝나면 분류 점수로 `첫 분류 → 줄 분류 → 라인 → 큰 라인 → 공장장` 중 어디까지 갔는지 보여 줌. 무지개면 `전설 라인`
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 분수 분류 컨베이어`는 분수의 세 종류를 **이름이 아니라 모양으로** 구분하게 합니다. 분수를 숫자(분수·대분수 표기)와 함께 원 조각 그림으로 보여 줘, 분자가 분모보다 작은지(진분수), 같거나 큰지(가분수), 자연수와 진분수가 함께 있는지(대분수)를 눈으로 비교해 알맞은 통에 넣습니다. `5/5` 같은 분자=분모 사례를 섞어, 진분수로 착각하기 쉬운 지점을 직접 다루게 합니다.

10문제 안에는 진분수·가분수·대분수가 모두 나오도록 먼저 유형을 나누고, 순서만 섞습니다. 한 판을 해도 세 분수 모양을 모두 비교하게 하기 위한 장치입니다.

이번 문제 화면은 분수와 원 그림을 하나의 **큰 분수 카드**로 묶고, 아래 통에 넣게 했습니다. 큰 카드와 세 통을 화면 중심에 두고 분류 점수는 아래 작은 줄로 줄였습니다. 분류라는 수학 행동이 화면 조작과 바로 맞물리도록 해, 학생이 “이 분수는 어떤 종류인가?”를 누르기보다 실제로 나누어 담는 느낌으로 판단하게 했습니다.

한 문제를 끝낼 때마다 분류 점수에 일이 일어납니다. 보통은 점수가 오르지만, 가끔 크게 오르거나, 줄거나, 라인이 막히거나, 완벽 분류로 직행하거나, 무지개 점수가 켜집니다. 문제 안에서 한 번이라도 틀리면 누수 이벤트로 처리합니다. 점수는 한 판이 끝난 뒤 등급으로 보여 줍니다. `공장장`은 어려운 최상위, `전설 라인`은 그보다 보기 힘든 secret 등급입니다.

## 시리즈 정체성

- 화면 골격(첫 화면 → 설명 → 문제 → 보상 → 결과), 상단 배지, 설정 모달, 16:10/1280×800 Stage 계약은 시리즈 공통입니다.
- 설명은 2장 흐름입니다. 2페이지는 진분수·가분수·대분수 통에 넣는 방법, 3페이지는 10문제·분류 점수·마지막 등급을 안내합니다.
- 문제 화면 분수 그림(원 조각)은 생성 이미지가 아니라 **SVG**로 그립니다.
- 문제 화면은 Pointer Events 기반 카드/자리 조작과 탭 대체 조작을 함께 지원합니다.

## 전국 순위 API

- 결과 화면에서 `순위`를 누르면 `_shared/scoreboard/scoreboard-ui.js` 공통 순위 화면으로 이동합니다.
- `LESSON_ID`는 `3-2-4-3-mathmon-fraction-sorter`, 순위 종류는 `fraction-sorter`입니다.
- 답안 로그는 `sort` 1단계입니다. 첫 선택을 `proper`, `improper`, `mixed` 중 하나로 보냅니다.
- API 주소는 `window.MATHMON_SCOREBOARD_API_URL` 또는 `?scoreboardApi=`로 받습니다. 주소가 없거나 호출에 실패해도 게임 결과는 정상으로 남고, 순위 화면만 안내 상태로 보입니다.

## 자산 상태 (완료)

- 첫 화면은 `data-cover-standard="generated-title-overlay"`와 `data-cover-start-standard="generated-button-art"` 표준입니다. `cover-generated.webp`는 글자 없는 분류 컨베이어 배경이고, 제목은 생성형 이미지 산출물 `title-logo-generated.webp`, 시작 버튼은 `start-button-generated.webp`로 얹습니다.
- 보관 자산: `title-logo-source.png`, `title-logo-generated.png`, `title-logo-generated.webp`, `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`.
- 결과 화면은 `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`입니다. 결과 등급 6장(`result-{first,row,line,bigline,manager,rainbow}-generated.webp`)과 `result-retry-generated.webp`를 사용하고, 보이는 CSS 결과 카드·본문·큰 버튼 장식은 두지 않습니다.
- 활성 매스몬 기준은 `_shared/mathmon/zero-factory-animal-pack`의 `판다몬`(`zfa-08-pandamon`)입니다. 커버/결과 장면 안에 함께 생성했으며, 별도 HTML 매스몬 오버레이는 쓰지 않습니다.
- QA 스크린샷은 기존 `qa-*`/`verify-*`/`drag-qa-*` 세트에 더해 `screenshots/intuitive-qa-{desktop-1280x800,tablet-1024x768}-{play-first,play-wrong,play-correct-drag,reward,result}.png`로 갱신했습니다.
