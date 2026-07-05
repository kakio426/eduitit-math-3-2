# 매스몬 검산 자물쇠

에듀잇티 수학 게임 시리즈 3학년 2학기 2단원 4차시 게임입니다.

- 대상: 3학년 2학기 2단원 4차시
- 학습: 곱셈으로 나눗셈 검산하기
- 목표: `몫 × 나누는 수 + 나머지 = 나누어지는 수` 관계를 사용해 원래 수를 확인한다.
- 문제: 나머지가 있는 나눗셈 결과를 보고 검산식으로 원래 수를 찾는 문제 10개 랜덤 출제
- 방식: `곱하기 -> 나머지 더하기 -> 원래 수 확인` 3단계 선택형
- 보상: 한 문제를 끝낼 때마다 금고 여는 힘 이벤트가 1번 일어남
- 결과: 금고 여는 힘과 정답 수를 함께 보고 `자물쇠 -> 금고 -> 대형금고 -> 비밀금고 -> 보물고` 중 도달한 금고 이름을 보여 줌. 무지개 코어를 얻으면 `전설 금고`가 열림
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 검산 자물쇠`는 2단원 나눗셈의 종합 차시입니다. 학생은 나눗셈 결과를 보고 답을 다시 검산합니다.

예를 들어 `47 ÷ 5 = 9 ... 2`는 `9 × 5 = 45`, `45 + 2 = 47` 순서로 확인합니다. 핵심 오개념인 `나머지 더하기 누락`을 보기 안에 넣어, `45`에서 멈추면 원래 수가 돌아오지 않는다는 점을 반복해서 확인하게 했습니다.

보상은 `금고 여는 힘` 하나로만 유지합니다. 문제 안에서 한 번이라도 틀리면 해당 문제는 오류 처리 이벤트로 이어져 일부러 틀려 보상을 노리는 흐름을 막습니다. 플레이 중에는 금고 이름을 미리 공개하지 않고, 한 판이 끝난 뒤 결과 화면에서만 도달 이름을 보여 줍니다. 결과는 차시 자체 완결형 금고 이름이며, 도감 수집 구조는 사용하지 않습니다.

## 화면

스크린샷은 `screenshots/` 폴더에 저장합니다.

## RasterStage 이미지

- `cover-generated-source.png`: 킹드래곤몬이 들어간 첫 화면 커버 생성 원본
- `cover-generated.png/webp`: 킹드래곤몬이 금고방 장면 안에 포함된 첫 화면 금고 보안실 표지
- `title-logo-chromakey.png`: GPT Image/imagegen으로 생성한 제목 로고 원본
- `title-logo-generated.png/webp`: 첫 화면 제목 래스터 오버레이
- `start-button-source.png`, `start-button-generated.png/webp`: 생성형 시작 버튼 원본과 배포본
- `tutorial-generated.png/webp`: 설명 화면 검산 흐름 배경
- `board-vault-generated.png/webp`: 문제 화면 보안실 배경
- `lock-generated.png/webp`: 보상 팝업 자물쇠 그림
- `result-lock-generated.png/webp`: 자물쇠 결과 화면
- `result-safe-generated.png/webp`: 금고 결과 화면
- `result-large-safe-generated.png/webp`: 대형금고 결과 화면
- `result-secret-safe-generated.png/webp`: 비밀금고 결과 화면
- `result-treasure-generated.png/webp`: 보물고 결과 화면
- `result-rainbow-generated.png/webp`: 전설 금고 결과 화면
- `result-retry-generated.png/webp`: 다시하기 결과 화면
- `assets/mathmon/base-pack/mathmon-9-kingdragonmon.webp`: 보존된 base-pack 킹드래곤몬 배포본

첫 화면은 킹드래곤몬이 금고방 조명과 바닥 그림자 안에 함께 들어간 RasterStage 배경을 씁니다. 커버 위에 `.cover-mathmon` HTML 이미지를 따로 얹지 않습니다. 첫 화면은 `generated-title-overlay`와 `generated-button-art` 표준으로, 제목은 `title-logo-generated.webp`, 시작 버튼은 `start-button-generated.webp` 래스터 오버레이로 얹고 실제 제목 텍스트는 접근성용 숨김 제목으로 남깁니다. 문제 화면의 계산판과 선택지는 HTML/CSS로 유지해 숫자가 선명하게 보이도록 했습니다. 결과 화면은 금고 이름별 생성 배경 위에 SVG 오버레이로 도달 이름·정답 수·금고 여는 힘·다시하기 버튼 외형을 표시합니다.

## 작업실 파일 구성

- `index.html`: 게임 본문
- `cover-generated.webp`, `tutorial-generated.webp`, `board-vault-generated.webp`: 주요 화면 배경
- `title-logo-generated.webp`: 첫 화면 제목 오버레이
- `start-button-generated.webp`: 첫 화면 생성형 시작 버튼
- `result-*-generated.webp`: 금고 이름별 결과 배경
- `assets/mathmon/base-pack/mathmon-9-kingdragonmon.webp`: 보존된 base-pack 킹드래곤몬 배포본
- `lock-generated.webp`: 보상 자물쇠 그림
- `eduitit-logo-mark.png`: 에듀잇티 로고
- `screenshots/`: 화면별 검증 스크린샷
- `REPORT.md`: 게임 설명, 화면 흐름, 보상 구조
- `scripts/qa-lesson2-check-lock.mjs`: 커버·설정·설명·문제·최종 확인·보상·결과 화면 QA 스크립트

학생용 static 사본에는 실행에 필요한 `index.html`, WebP 배경, 로고, 문서만 복사합니다. PNG 원본과 `screenshots/`는 작업실에 보관합니다.

## 검증 산출물

- `screenshots/01-cover.png`: 첫 화면
- `screenshots/02-tutorial.png`: 설명 화면
- `screenshots/03-problem.png`: 문제 화면
- `screenshots/04-reward.png`: 보상 화면
- `screenshots/08-result.png`: 성공 결과 화면
- `screenshots/tablet-01-cover.png`: 태블릿 가로 첫 화면
- `screenshots/tablet-08-result.png`: 태블릿 가로 결과 화면
- `screenshots/raster-assets-contact-sheet.png`: RasterStage 이미지 세트
- `screenshots/screen-flow-contact-sheet.png`: 화면 흐름 확인용 모음
