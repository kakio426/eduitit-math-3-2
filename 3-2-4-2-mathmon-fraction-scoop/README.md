# 매스몬 분수만큼 담기

에듀잇티 수학 게임 시리즈 4단원(분수) 2차시입니다.

- 대상: 3학년 2학기 4단원 2차시
- 학습: 전체의 분수만큼 구하기
- 문제: 전체 개수 `N`의 `분수(num/den)`만큼이 몇 개인지 구하는 문제 10개 랜덤 출제 (예: 12개의 3/4 = 9)
- 방식: 중앙의 큰 묶음 작업대에서 ① 숫자 카드를 `한 묶음 칸`에 놓고 → ② 숫자 카드를 `바구니 칸`에 놓는 2단계 조작형. 카드를 탭한 뒤 칸을 탭해도 제출됨
- 보상: 한 문제를 끝낼 때마다 랜덤 담기 점수 이벤트(가득 담기/흘림/빈 바구니/정확히 담기/무지개)
- 결과: 10판이 끝나면 담기 점수로 `한 줌 → 작은 바구니 → 바구니 → 큰 바구니 → 수레 가득` 중 어디까지 갔는지 보여 줌. 무지개면 `전설 바구니`
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 분수만큼 담기`는 "전체의 분수만큼"을 **두 단계의 보이는 조작**으로 가르칩니다. 먼저 전체 묶음을 분모 수만큼 똑같이 나눠 **한 묶음 크기(N÷분모)**를 구하고, 그다음 분자 수만큼 묶음을 담아 **전체 개수((N÷분모)×분자)**를 구합니다. 학생은 식 설명을 읽는 대신 그룹으로 묶인 토큰을 보고 한 묶음과 담는 묶음을 직접 셉니다. 보기에는 정답과 함께 이 차시 핵심 오개념인 **한 묶음만 답하기**, **분모 개수만큼 담기**를 항상 둡니다.

이번 문제 화면은 점을 하나씩 옮기지 않고 **숫자 카드를 칸에 놓는 방식**으로 제한했습니다. 큰 묶음 보드, 숫자 카드, 놓을 칸만 먼저 보이게 하고 담기 점수는 아래 작은 줄로 줄였습니다. 손동작이 길어지면 수학보다 조작이 앞서기 때문에, 1단계는 한 묶음 수를 보드에 붙이고 2단계는 분자만큼 담은 수를 바구니에 붙이는 데 집중하게 했습니다.

한 문제를 끝낼 때마다 담기 점수에 일이 일어납니다. 보통은 점수가 오르지만, 가끔 크게 오르거나, 줄거나, 빈 바구니가 되거나, 정확히 담기로 직행하거나, 무지개 점수가 켜집니다. 문제 안에서 한 번이라도 틀리면 누수 이벤트로 처리합니다. 점수는 한 판이 끝난 뒤 등급으로 보여 줍니다. `수레 가득`은 어려운 최상위, `전설 바구니`는 그보다 보기 힘든 secret 등급입니다.

## 시리즈 정체성

- 화면 골격(첫 화면 → 설명 → 문제 → 보상 → 결과), 상단 배지, 설정 모달, 16:10/1280×800 Stage 계약은 시리즈 공통입니다.
- 설명은 2장 흐름입니다. 2페이지는 전체를 똑같이 나누고 분자만큼 담는 방법, 3페이지는 10문제·담기 점수·마지막 등급을 안내합니다.
- 문제 화면 도형(그룹 토큰)은 생성 이미지가 아니라 **SVG**로 그립니다.
- 문제 화면은 Pointer Events 기반 카드/자리 조작과 탭 대체 조작을 함께 지원합니다.

## 전국 순위 API

- 결과 화면에서 `순위`를 누르면 `_shared/scoreboard/scoreboard-ui.js` 공통 순위 화면으로 이동합니다.
- `LESSON_ID`는 `3-2-4-2-mathmon-fraction-scoop`, 순위 종류는 `fraction-scoop`입니다.
- 답안 로그는 `group`, `scoop` 2단계입니다. 한 묶음 수와 바구니에 담을 수를 각각 `selected`/`expected`로 보냅니다.
- API 주소는 `window.MATHMON_SCOREBOARD_API_URL` 또는 `?scoreboardApi=`로 받습니다. 주소가 없거나 호출에 실패해도 게임 결과는 정상으로 남고, 순위 화면만 안내 상태로 보입니다.

## 자산 상태 (완료)

- 첫 화면은 `data-cover-standard="generated-title-overlay"`와 `data-cover-start-standard="generated-button-art"` 표준입니다. `cover-generated.webp`는 글자 없는 담기 배경이고, 제목은 생성형 이미지 산출물 `title-logo-generated.webp`, 시작 버튼은 `start-button-generated.webp`로 얹습니다.
- 보관 자산: `title-logo-source.png`, `title-logo-generated.png`, `title-logo-generated.webp`, `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`.
- 결과 화면은 `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`입니다. 결과 등급 6장(`result-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp`)과 `result-retry-generated.webp`를 사용하고, 보이는 CSS 결과 카드·본문·큰 버튼 장식은 두지 않습니다.
- 활성 매스몬 기준은 `_shared/mathmon/zero-factory-animal-pack`의 `토끼몬`(`zfa-02-rabbitmon`)입니다. 커버/결과 장면 안에 함께 생성했으며, 별도 HTML 매스몬 오버레이는 쓰지 않습니다.
- QA 스크린샷은 기존 `qa-*`/`verify-*`/`drag-qa-*` 세트에 더해 `screenshots/intuitive-qa-{desktop-1280x800,tablet-1024x768}-{play-first,play-wrong,play-correct-drag,play-step2,play-step2-correct-tap,reward,result}.png`로 갱신했습니다.
