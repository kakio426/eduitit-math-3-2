# 매스몬 두 배 다리

에듀잇티 수학 게임 시리즈 3단원(원) 3차시입니다.

- 대상: 3학년 2학기 3단원 3차시
- 학습: 지름 = 반지름 × 2
- 문제: 반지름→지름(두 배) 또는 지름→반지름(반으로) 한 방향을 묻는 문제 10개
- 방식: 두 배 다리 그림(반지름 칸 두 개 = 지름 칸)을 보고 알맞은 길이(cm)를 고르는 1단계 선택형
- 보상: 한 문제마다 랜덤 다리 점수 이벤트(증가/감소/0/한 번에 완공/무지개)
- 결과: `외나무다리 → 작은 다리 → 다리 → 큰 다리 → 대교`(무지개면 `무지개 다리`)
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 두 배 다리`는 "지름은 반지름의 두 배"라는 관계를 **반지름 칸 두 개가 모여 지름 칸이 되는 다리 그림**으로 익히게 합니다. 보기에는 항상 핵심 오개념을 넣습니다 — 반지름→지름에서는 **두 배를 잊은 값(r)**, 지름→반지름에서는 **반으로 안 나눈 값(2r)**. 주어진 칸은 색으로 채우고 묻는 칸은 점선+물음표로 두어, 학생이 두 배·반의 관계를 직접 보고 고릅니다.

보상·등급 구조는 시리즈 공통 엔진을 그대로 쓰고 다리 테마로 이름만 바꿨습니다. 문제 화면 도형은 생성 이미지가 아니라 **SVG**로 그립니다.

## 자산 상태

- 첫 화면은 `cover-generated.webp` 배경, `title-logo-generated.webp` 제목 아트, `start-button-generated.webp` 시작 버튼 아트를 연결했습니다.
- 결과는 `result-{log,small,bridge,big,grand,rainbow}-generated.webp`와 `result-retry-generated.webp`를 사용합니다.
- 공용 매스몬 팩은 `_shared/mathmon/circle-pack`의 `두배수달몬` 콘셉트를 기준으로 등록했습니다.
- 하네스는 `generated-title-overlay`, `generated-button-art`, `modal-controls`, `generated-assets` + `hybrid-generated-dynamic` 기준입니다.
