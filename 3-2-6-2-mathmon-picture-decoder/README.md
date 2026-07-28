# 매스몬 그림 단위 해독

에듀잇티 수학 게임 3학년 2학기 6단원 2차시입니다.

- 학습: 그림 하나가 뜻하는 수로 그림그래프의 전체 값 구하기
- 문제: 단위 2·5·10, 그림 2~8개, 전체 80 이하인 10문제
- 행동: 그림의 단위와 개수를 보고 전체 값 하나 고르기
- 확인: 각 그림의 단위가 합쳐진 곱셈식을 본 뒤 해독 상자 열기
- 실행: `index.html`

## 문제와 오답

선택지는 정답, 그림 개수만 센 값, 한 단위 적은 값, 한 단위 많은 값입니다. 오답 뒤 작업판에 `단위 × 그림 수 ≠ 고른 값`이 남고, 정답 뒤에는 `단위 × 그림 수 = 전체 값`으로 바뀝니다.

## 화면과 자산

- 매스몬: `base-pack`의 독수리몬 `base-05-eaglemon`
- 커버: `cover-source.png` → `cover-generated.webp`
- 설명: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp`
- 문제 배경: `problem-background-source.png` → `problem-background-generated.webp`
- 보상 7상태: `reward-event-closed-generated.webp`와 `reward-{normal,loss,mega,complete,empty,rainbow}-generated.webp`
- 닫힌 상자 원본: `reward-event-closed-source.png` → `reward-event-closed-generated.png` → `reward-event-closed-generated.webp`
- 결과 장면·제목: `result-scene-1-generated.webp`~`6`, `result-title-1-generated.webp`~`6`
- QA 컨택시트: `reward-contact-sheet.png`, `result-scenes-contact-sheet.png`, `result-titles-contact-sheet.png`
- 생성 원본 시트: `reward-source-sheet.png`, `result-scenes-source-sheet.png`, `result-titles-source-sheet.png`
- 공용 자산: `../_shared/mathmon/cover-start-button/start-button-generated.webp`, `../_shared/result-actions/retry-button-generated.webp`, `../_shared/result-count/`

## 보상과 결과

중심 보상은 `해독 힘`입니다. 일반 `+6~10`, 감소 `-5~-2`, 큰 증가 `+14~22`, 대박 `+30`, 그대로 `0`, 특별 `100`을 쓰고, 오답을 거친 문제는 최초 한 번만 `-6~-3`을 적용합니다. 정답 확인 뒤 닫힌 상자를 여는 Stage-Reveal 흐름입니다.

결과는 `첫 그림표 → 반짝 돋보기 → 그림 해독판 → 해독 책상 → 자료 해독실 → 무지개 해독탑` 순서이며 문턱은 `0/0, 15/2, 35/4, 55/6, 78/8, 특별 100/1`입니다.

## 검증 자료

`screenshots/engine-flow-{desktop,tablet-landscape,unit6-reported-overlap-1024x768-dpr1}-*.png`에 전체 흐름, 작은·큰 오답, 완성, 보상, 결과 6단계를 보관합니다.
