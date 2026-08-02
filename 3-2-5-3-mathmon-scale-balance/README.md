# 매스몬 저울 균형

## 최종 결과 6단계 v6

- 결과 장면: `살짝 기운 저울 → 거의 균형 → 균형 저울 → 반짝 균형 → 황금 균형 → 무지개 균형`
- 기준 크기: `1280×800`, 결과 화면 표시 방식은 단계별 완성 장면 6장과 `object-fit: cover`이다.
- 결과 컨택시트: `result-tiers-v6-contact-sheet.png`
- 자산 팩 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/result-fullscene-v1/contact-sheets/result-tiers-v6-contact-sheet.png`
- 실제 브라우저 결과 컨택시트: `result-tiers-v6-browser-contact-sheet.png`
- 결과 계약: `result-layout-v6.json`
- 원본: `result-scale-*-v6-source.png`
- 고정 등급 제목과 `다시` 버튼 표면은 각 완성 장면에 들어 있다. 런타임은 균형 힘·진행 막대·정답 수·다음 목표·투명 버튼 hitbox만 올린다.
- 브라우저 QA 대상: `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`

## 문제 화면 왼쪽 진행 보상 v1

- 표준: `stage-left-play-progress-v1` / `generated-play-progress-v3-left-character`
- 단계: 최종 결과와 같은 `tilted → almost → balanced → shining → gold → rainbow` 6단계
- 전용 이미지: `768×1536`, `object-fit: contain`, 최종 결과 이미지 크롭 재사용 없음
- 소스: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/source/`
- 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/contact-sheets/play-scale-progress-v1-contact-sheet.png`
- 패널: Stage 기준 `left 1.65%`, `top 11%`, `width 19.2%`, `height 84%`
- 전환: 보상 모달 닫힘 → `320ms` → 이미지 교체와 Stage 폭 `35%` 효과 → `1560ms` 유지

에듀잇티 수학 게임 시리즈 3학년 2학기 5단원 3차시 단일 HTML 패키지입니다.

- 대상: 초등학교 3학년 2학기
- 배움주제: 무게 비교와 kg, g, t
- 학생 행동: 저울에 맞는 무게를 골라요.
- 문제: 10문제, compareKgG, balanceMissing, compareTonKg
- 보상: 저울 변화
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
| `result-scale-*-v6-source.png` / `result-scale-*-generated.webp` | 제목·빈 결과판·다시 버튼 표면을 포함한 결과 완성 장면 |
| `result-title-*-source.png` / `result-title-*-generated.webp` | 완성 장면 제작에 사용한 생성형 결과 이름 원본 |
| `../_shared/result-actions/retry-button-v2-generated.webp` | 완성 장면 제작에 사용한 공용 생성형 다시 버튼 원본 |

## 매스몬 기준

현재 실행 장면의 매스몬 기준은 `diversity-reward-pack`의 수정부엉몬(`mathmon-drv-05-crystalowl`)입니다. 첫 화면, 보상, 결과 장면 안에 함께 생성하며 런타임 WebP를 별도 오버레이로 얹지 않습니다.

## 보상 구조

정답을 처음에 맞히면 기본 보상값이 붙고, 랜덤 보상이 한 번 더해집니다. 오답 뒤에 맞히면 작은 회복 보상만 붙습니다. 낮은 결과도 빈손처럼 보이지 않게 저울 변화로 보여 줍니다.

| 결과 | 조건 |
| --- | --- |
| 살짝 기운 저울 | 0 이상, 바로 맞힌 문제 0개 이상 |
| 거의 균형 | 15 이상, 바로 맞힌 문제 2개 이상 |
| 균형 저울 | 35 이상, 바로 맞힌 문제 4개 이상 |
| 반짝 균형 | 55 이상, 바로 맞힌 문제 6개 이상 |
| 황금 균형 | 78 이상, 바로 맞힌 문제 8개 이상 |
| 무지개 균형 | 100 이상, 바로 맞힌 문제 1개 이상, 특별 보상 필요 |

## Humanizer QA

학생에게 보이는 문구는 짧은 행동 말로 점검합니다.

- 첫 화면 목표: `저울에 맞는 무게를 골라요.`
- 문제 지시: 현재 단계에서 하나만 고르게 함
- 피드백: `다시 골라요.`, `...이 들어갔어요.`
- 버튼: `시작`, `문제 시작`, `저울 보기`, `다음`, `보기`, `다시`

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
- 차시 설정: `_lessons/3-2-5-3-mathmon-scale-balance/lesson.json`
- 들이·무게 공용 문제 모델: `_lessons/3-2-5-1-mathmon-water-fill/model.js`
- 설명 1쪽: 양쪽 무게를 보고 저울을 맞추는 한 가지 행동
- 설명 2쪽: 10문제, 학생이 확인하는 보석 보상, 마지막 결과
- 런타임 포스터: `tutorial-page-1-generated.webp`, `tutorial-page-2-generated.webp` (`1280×800`)
- 결과 6상태 컨택시트: `result-tiers-v6-contact-sheet.png`
- 실제 매스몬 팩: `diversity-reward-pack` / `mathmon-drv-05-crystalowl`
- 브라우저 QA: `1280×800`, `1024×768`
- 문제 왼쪽 진행 픽셀 앵커 검수: `../_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-3/play-progress-v1/contact-sheets/play-scale-progress-v1-anchor-audit.png`

## 2026-07-28 전 차시 점검

- 닫힌 보상과 공개 보상을 서로 다른 생성 이미지로 교체했습니다.
- 결과 4상태의 정보 축을 오른쪽으로 옮겨 수정부엉몬을 가리지 않게 했습니다.
- 공용 시작 버튼으로 통일하고 차시별 복사본은 사용하지 않습니다.
- 수학 모델 100,000문항, 보상 시뮬레이션 10,000회, 데스크톱·태블릿 전체 흐름 QA를 통과했습니다.
