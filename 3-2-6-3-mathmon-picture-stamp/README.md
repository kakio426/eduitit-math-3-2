# 매스몬 그림 도장 찍기

에듀잇티 수학 게임 3학년 2학기 6단원 3차시입니다.

- 학습: 큰 그림 10과 작은 그림 1로 수 나타내기
- 문제: 10·14·21·26·30·37·42·48·53·59를 섞은 10문제
- 1단계: 큰 도장 수 고르기
- 2단계: 작은 도장 수 고르기
- 확인: `큰 도장×10 + 작은 도장×1 = 전체 수`를 본 뒤 도장 상자 열기
- 실행: `index.html`

## 문제와 오답

십의 자리와 일의 자리를 바꿔 고르는 값, 하나 적은 값, 하나 많은 값을 대표 오답으로 둡니다. 오답 뒤에는 고른 수만큼의 도장이 작업판에 남고 식에는 `≠`가 나타납니다. 첫 단계 정답 뒤에는 `작은 도장 보기`를 눌러 두 번째 판단으로 넘어갑니다.

## 화면과 자산

- 매스몬: `base-pack`의 유니콘몬 `base-08-unicornmon`
- 생성 자산: 커버, 설명 2장, 문제 배경, 보상 6장, 결과 장면 6장, 결과 제목 6장
- QA 컨택시트: `reward-contact-sheet.png`, `result-scenes-contact-sheet.png`, `result-titles-contact-sheet.png`
- 생성 원본 시트: `reward-source-sheet.png`, `result-scenes-source-sheet.png`, `result-titles-source-sheet.png`
- 공용 시작: `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 공용 다시: `../_shared/result-actions/retry-button-generated.webp`
- 공용 정답 수: `../_shared/result-count/`

## 보상과 결과

중심 보상은 `그래프 힘`입니다. 결과는 `첫 도장판 → 알록 도장판 → 그림그래프판 → 그래프 전시대 → 그래프 전시실 → 무지개 그래프탑` 순서입니다. 결과 문턱과 여섯 보상 가족은 Unit 6 공통 계약을 따릅니다.

## 검증 자료

`screenshots/engine-flow-{desktop,tablet-landscape,unit6-reported-overlap-1024x768-dpr1}-*.png`에 두 단계 대기·오답·정답 확인, 마지막 완성식, 보상, 결과 6단계를 보관합니다.
