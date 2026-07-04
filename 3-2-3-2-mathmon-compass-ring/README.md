# 매스몬 컴퍼스 마법진

에듀잇티 수학 게임 시리즈 3단원(원) 2차시입니다.

- 대상: 3학년 2학기 3단원 2차시
- 학습: 컴퍼스로 원 그리기 (반지름 = 컴퍼스 벌림)
- 문제: "반지름 N cm 원 그리기"에 맞는 컴퍼스 벌림(cm)을 고르는 문제 10개
- 방식: 눈금자 + 컴퍼스 그림을 보고 알맞은 벌림(cm)을 고르는 1단계 선택형
- 보상: 한 문제마다 랜덤 마법진 점수 이벤트(증가/감소/0/완벽한 원/무지개)
- 결과: `흐린 원 → 작은 마법진 → 마법진 → 큰 마법진 → 대마법진`(무지개면 `전설 마법진`)
- 실행: `index.html`을 브라우저에서 열기

## 설계 의도

`매스몬 컴퍼스 마법진`은 "컴퍼스 벌린 길이가 곧 반지름"이라는 원리를 **눈금과 컴퍼스 그림으로** 익히게 합니다. 보기에는 항상 **지름(반지름×2) 함정**을 넣어, 벌림을 지름으로 착각하는 대표 오개념을 짚습니다. 학생은 "반지름 4cm" 밴드와 컴퍼스 그림을 보고 4cm를 고르며, 8cm(지름)를 고르지 않도록 배웁니다.

보상·등급 구조는 시리즈 공통 엔진을 그대로 쓰고 마법진 테마로 이름만 바꿨습니다. 문제 화면 도형은 생성 이미지가 아니라 **SVG**로 그립니다.

## 자산 상태

- 첫 화면은 `cover-generated.webp` 배경, `title-logo-generated.webp` 제목 아트, `start-button-generated.webp` 시작 버튼 아트를 연결했습니다.
- 결과는 `result-{faint,small,ring,big,grand,legend}-generated.webp`와 `result-retry-generated.webp`를 사용합니다.
- 공용 매스몬 팩은 `_shared/mathmon/circle-pack`의 `컴퍼스나방몬` 콘셉트를 기준으로 등록했습니다.
- 하네스는 `generated-title-overlay`, `generated-button-art`, `modal-controls`, `generated-assets` + `hybrid-generated-dynamic` 기준입니다.
