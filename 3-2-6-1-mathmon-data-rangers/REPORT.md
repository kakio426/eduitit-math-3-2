# 매스몬 자료 정리단 REPORT

## 구현 기준

- 엔진: `mathmon-engine-v1`
- Stage: `16:10`, `1280x800`
- 커버 표준: `generated-title-overlay`
- 시작 버튼 표준: `generated-button-art`
- 설정 표준: `modal-controls`
- 결과 표준: `generated-assets`

## 문제 구조

- 10문제
- 한 화면 한 행동 유지
- 문제 유형
  - 가장 많은 줄 고르기
  - 한 줄의 점 개수 읽기
  - 가장 많은 줄과 가장 적은 줄의 차이 고르기

## 보상 구조

- 정답이면 자료 불빛이 켜지고, 무작위 보상량이 더해집니다.
- 오답 뒤 정답이면 작은 복구 보상만 줍니다.
- 최고 결과 `무지개 자료탑`은 10개 정답과 특별 보상이 함께 필요합니다.

## 생성 이미지

- 첫 화면 배경: `cover-generated.webp`
- 제목: `title-logo-generated.webp`
- 시작 버튼: `start-button-generated.webp`
- 보상 배경: `reward-scene-generated.webp`
- 결과 배경: `result-data-table/spark/town/rainbow-generated.webp`
- 결과 제목: `result-title-table/spark/town/rainbow-generated.webp`
- 다시 버튼: `result-retry-button-generated.webp`

## 텍스트 넘침·요소 겹침 QA

- `node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers`
- 확인 화면 크기: 1280x800, 1024x768
- 확인 화면 상태: 첫 화면, 설정 모달, 설명 1, 설명 2, 문제 1단계, 정답 확인, 보상, 결과
- 결과: 템플릿 placeholder 0개, 누락 이미지 0개, 텍스트 넘침 0개
- 주요 캡처:
  - `screenshots/engine-flow-desktop-01-cover.png`
  - `screenshots/engine-flow-desktop-05-play-step1.png`
  - `screenshots/engine-flow-desktop-08-result.png`
  - `screenshots/engine-flow-tablet-landscape-05-play-step1.png`
  - `screenshots/engine-flow-tablet-landscape-08-result.png`

## 검증 명령

```bash
node scripts/build-lesson.mjs 3-2-6-1-mathmon-data-rangers
node scripts/check-lesson-contract.mjs
node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers
```

## 검증 결과

- `node --check scripts/build-lesson.mjs`: 통과
- `node --check scripts/check-lesson-contract.mjs`: 통과
- `node --check scripts/qa-lesson-flow.mjs`: 통과
- `node scripts/check-lesson-contract.mjs`: 통과, 엔진 차시 2개 확인
- `node scripts/check-rule-consistency.mjs`: 통과
- `node scripts/qa-lesson-flow.mjs 3-2-6-1-mathmon-data-rangers`: 통과
- `node scripts/qa-lesson-flow.mjs 3-2-5-1-mathmon-water-fill`: 통과
