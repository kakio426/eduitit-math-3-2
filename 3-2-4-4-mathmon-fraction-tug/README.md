# 매스몬 분수 줄다리기

에듀잇티 수학 게임 시리즈 4단원(분수) 4차시입니다. **★ 단원 정점**

- 대상: 3학년 2학기 4단원 4차시
- 학습: 분모가 같은 분수와 단위분수의 크기 비교
- 문제: 두 분수 중 더 큰 분수를 고르는 문제 10개 균형 출제 (분모 같은 분수 비교 5개 / 단위분수 비교 5개)
- 방식: 두 분수를 같은 길이 막대로 보여 주고, 더 큰 분수 막대를 `더 큰 분수` 승리 자리에 옮기는 1단계 조작형. 막대 카드를 탭해도 제출됨
- 보상: 한 문제를 끝낼 때마다 랜덤 줄다리기 점수 이벤트(세게 당기기/밀림/헛심/한판승/무지개)
- 결과: 10번을 겨루면 줄다리기 점수로 `무승부 → 작은 승 → 승리 → 큰 승 → 챔피언` 중 어디까지 갔는지 보여 줌. 무지개면 `전설 승부`
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 분수 줄다리기`는 4단원의 정점으로, 앞 세 차시(부분/전체, 전체의 분수만큼, 분수의 종류)에서 키운 분수 감각을 **두 분수의 크기 비교**로 모읍니다. 두 분수를 같은 길이의 막대에 칸으로 채워 보여 줘, 분모가 같으면 **채운 칸 수**로, 단위분수면 **한 칸의 크기**로 길이를 직접 비교하게 합니다. 단위분수에서 분모가 큰 쪽을 더 크다고 착각하기 쉬운 지점(`1/5`와 `1/3`)을 막대 길이로 바로 보게 해 바로잡습니다.

10문제는 분모가 같은 분수 비교 5개와 단위분수 비교 5개로 나누고, 순서만 섞습니다. 학생이 두 비교 규칙을 한 판 안에서 모두 연습하게 하기 위한 장치입니다.

이번 문제 화면은 더 긴 막대의 **분수 막대를 승리 자리로 옮기는 방식**입니다. 큰 비교 막대와 승리 자리만 먼저 보이게 하고 줄다리기 점수는 아래 작은 줄로 줄였습니다. 학생이 숫자 크기만 보고 고르기보다 막대 길이를 먼저 확인하고, 더 큰 분수를 물리적으로 골라내게 하려는 설계입니다.

한 문제를 끝낼 때마다 줄다리기 점수에 일이 일어납니다. 보통은 점수가 오르지만, 가끔 크게 오르거나, 줄거나, 헛심이 되거나, 한판승으로 직행하거나, 무지개 점수가 켜집니다. 문제 안에서 한 번이라도 틀리면 누수 이벤트로 처리합니다. 점수는 한 판이 끝난 뒤 등급으로 보여 줍니다. `챔피언`은 어려운 최상위, `전설 승부`는 그보다 보기 힘든 secret 등급입니다.

## 시리즈 정체성

- 화면 골격(첫 화면 → 설명 → 문제 → 보상 → 결과), 상단 배지, 설정 모달, 16:10/1280×800 Stage 계약은 시리즈 공통입니다.
- 설명은 2장 흐름입니다. 2페이지는 막대 길이로 더 큰 분수를 찾는 방법, 3페이지는 10문제·줄다리기 점수·마지막 등급을 안내합니다.
- 문제 화면 도형(비교 막대)은 생성 이미지가 아니라 **SVG**로 그립니다.
- 문제 화면은 Pointer Events 기반 카드/자리 조작과 탭 대체 조작을 함께 지원합니다.

## 자산 상태 (완료)

- 첫 화면은 `data-cover-standard="generated-title-overlay"`와 `data-cover-start-standard="generated-button-art"` 표준입니다. `cover-generated.webp`는 글자 없는 줄다리기 배경이고, 제목은 생성형 이미지 산출물 `title-logo-generated.webp`, 시작 버튼은 `start-button-generated.webp`로 얹습니다.
- 보관 자산: `title-logo-source.png`, `title-logo-generated.png`, `title-logo-generated.webp`, `start-button-source.png`, `start-button-generated.png`, `start-button-generated.webp`.
- 결과 화면은 `data-result-visual-standard="generated-assets"`, `data-result-render-mode="hybrid-generated-dynamic"`입니다. 결과 등급 6장(`result-{draw,smallwin,win,bigwin,champion,rainbow}-generated.webp`)과 `result-retry-generated.webp`를 사용하고, 보이는 CSS 결과 카드·본문·큰 버튼 장식은 두지 않습니다.
- 공용 매스몬 관리는 `_shared/mathmon/fraction-pack/`와 `_shared/mathmon/catalog.json`에서 합니다. 이 차시는 `mathmon-fr-04-championseahorse` 콘셉트를 기준으로 한 생성형 커버/결과 장면을 사용하며, 별도 HTML 매스몬 오버레이는 쓰지 않습니다.
- QA 스크린샷은 기존 `qa-*`/`verify-*`/`drag-qa-*` 세트에 더해 `screenshots/intuitive-qa-{desktop-1280x800,tablet-1024x768}-{play-first,play-wrong,play-correct-drag,reward,result}.png`로 갱신했습니다.
