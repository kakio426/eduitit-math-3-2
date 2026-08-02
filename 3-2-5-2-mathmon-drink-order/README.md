# 매스몬 음료 제조 주문

## 최종 결과 6단계 v5

- 결과 장면: `작은 컵 주문 → 맛있는 주문 → 음료 쟁반 주문 → 인기 가게 주문 → 황금 축제 주문 → 무지개 음료 주문`
- 기준 크기: `1280×800`, 결과 화면 표시 방식은 단계별 완성 장면 6장과 `object-fit: contain`이다.
- 결과 컨택시트: `result-tiers-v5-contact-sheet.png`
- 결과 계약: `result-layout-v5.json`
- 원본: `result-order-*-v5-source.png`
- 브라우저 QA: `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`

## 문제 화면 왼쪽 진행 보상 v1

- 표준: `stage-left-play-progress-v1` / `generated-play-progress-v3-left-character`
- 단계: 최종 결과와 같은 `cup → tasty → tray → popular → festival → rainbow` 6단계
- 전용 이미지: `768×1536`, `object-fit: contain`, 최종 결과 이미지 크롭 재사용 없음
- 소스: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/source/`
- 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-contact-sheet.png`
- 패널: Stage 기준 `left 1.65%`, `top 11%`, `width 19.2%`, `height 84%`
- 전환: 보상 모달 닫힘 → `320ms` → 이미지 교체와 Stage 폭 `35%` 효과 → `1560ms` 유지

에듀잇티 수학 게임 시리즈 3학년 2학기 5단원 2차시 단일 HTML 패키지입니다.

- 대상: 초등학교 3학년 2학기
- 배움주제: 들이의 덧셈·뺄셈과 어림
- 학생 행동: 주문에 맞는 들이를 골라요.
- 문제: 10문제, addCarryMl, subtractBorrowMl, orderCheck
- 보상: 주문 변화
- 실행: `index.html`을 브라우저에서 열기

## 화면 흐름

```text
첫 화면 -> 설명 -> 문제 -> 보상 -> 결과
```

문제 화면은 큰 문제, 현재 계산판, 한 줄 지시, 선택지만 기본으로 보여 줍니다. 정답을 고르면 값이 칸에 들어간 뒤 다음 단계나 보상으로 넘어갑니다.

## 생성 이미지 자산

`index.html`은 `generated-title-overlay`, `generated-button-art`, `modal-controls`, `generated-assets` 기준을 선언합니다.

| 파일명 | 용도 |
| --- | --- |
| `cover-source.png` / `cover-generated.webp` | 글자 없는 첫 화면 배경 |
| `title-logo-chromakey.png` / `title-logo-generated.png` / `title-logo-generated.webp` | 생성형 제목 아트 |
| `../_shared/mathmon/cover-start-button/start-button-generated.webp` | 공용 시작 버튼 아트 |
| `reward-event-closed-v2-generated.webp` | 닫힌 보상 장면 |
| `reward-event-*-generated.webp` | 공개 보상 6상태 개별 512×512 장면 |
| `reward-events-v3-contact-sheet.png` | 닫힘·공개 7상태 컨택시트 |
| `result-order-*-source.png` / `result-order-*-generated.webp` | 결과 장면 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 결과 이름 타이틀 아트 |
| `result-retry-button-source.png` / `result-retry-button-generated.webp` | 결과 화면 다시 버튼 아트 |

## 매스몬 기준

현재 실행 장면의 매스몬 기준은 `zero-factory-animal-pack`의 냥냥몬(`zfa-04-nyangnyangmon`)입니다. 첫 화면, 보상, 결과 장면 안에 함께 생성하며 런타임 WebP를 별도 오버레이로 얹지 않습니다.

## 보상 구조

정답을 처음에 맞히면 기본 보상값이 붙고, 랜덤 보상이 한 번 더해집니다. 오답 뒤에 맞히면 작은 회복 보상만 붙습니다. 낮은 결과도 빈손처럼 보이지 않게 주문 변화로 보여 줍니다.

| 결과 | 조건 |
| --- | --- |
| 작은 컵 주문 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 맛있는 주문 | 30 이상, 바로 맞힌 문제 3개 이상 |
| 인기 가게 주문 | 70 이상, 바로 맞힌 문제 7개 이상 |
| 무지개 음료 주문 | 100 이상, 바로 맞힌 문제 1개 이상, 특별 보상 필요 |

## Humanizer QA

학생에게 보이는 문구는 짧은 행동 말로 점검합니다.

- 첫 화면 목표: `주문에 맞는 들이를 골라요.`
- 문제 지시: 현재 단계에서 하나만 고르게 함
- 피드백: `다시 골라요.`, `...이 들어갔어요.`
- 버튼: `시작`, `문제 시작`, `주문 보기`, `다음`, `보기`, `다시`

## 스크린샷

스크린샷은 `screenshots/`에 저장합니다.

- `cover.png`
- `tutorial-1.png`
- `tutorial-2.png`
- `play-step1.png`
- `play-confirm.png`
- `wrong-hint.png`
- `reward.png`
- `result-*.png`
- `tablet-cover.png`
- `tablet-tutorial-1.png`
- `tablet-tutorial-2.png`
- `tablet-play-step1.png`
- `tablet-play-confirm.png`
- `tablet-reward.png`
- `tablet-result-*.png`

세로 휴대폰은 기본 지원 대상이 아닙니다.

## 엔진 소스와 2쪽 설명 포스터

- 공용 엔진: `_engine/v1/`
- 차시 설정: `_lessons/3-2-5-2-mathmon-drink-order/lesson.json`
- 들이·무게 공용 문제 모델: `_lessons/3-2-5-1-mathmon-water-fill/model.js`
- 설명 1쪽: `mL`를 계산하고 `1000mL`를 `1L`로 바꾸는 행동
- 설명 2쪽: 10문제, 학생이 확인하는 주문 보상, 마지막 결과
- 런타임 포스터: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp` (`1280×800`)
- 결과 4상태 컨택시트: `result-states-contact-sheet.png`
- 실제 매스몬 팩: `zero-factory-animal-pack` / `zfa-04-nyangnyangmon`
- 브라우저 QA: `1280×800`, `1024×768`
- 문제 왼쪽 진행 픽셀 앵커 검수: `../_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-2/play-progress-v1/contact-sheets/play-drink-progress-v1-anchor-audit.png`

## 2026-07-28 전 차시 점검

- 닫힌 보상과 공개 보상을 서로 다른 생성 이미지로 교체했습니다.
- 결과 4상태에 현재 가게 인기, 바로 맞힌 수, 다음 목표를 한 축으로 정렬했습니다.
- 공용 시작 버튼으로 통일하고 차시별 복사본은 사용하지 않습니다.
- 수학 모델 100,000문항, 보상 시뮬레이션 10,000회, 데스크톱·태블릿 전체 흐름 QA를 통과했습니다.
