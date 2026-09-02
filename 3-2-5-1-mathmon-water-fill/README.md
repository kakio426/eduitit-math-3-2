# 매스몬 물통 채우기 시합

3학년 2학기 5단원 1차시 실행 패키지입니다. 이 차시에서는 들이를 직접 비교하고, 같은 컵을 기준으로 재어 비교합니다.

- 학생 목표: `들이를 직접 비교하고 같은 컵으로 재어 비교해요.`
- 문제: 10문제
- 핵심: 직접 옮겨 붓기, 같은 모양의 통에 옮겨 비교하기, 같은 종이컵으로 재기, 컵 수 비교와 차이 구하기, 공정하지 않은 측정 고치기
- 실행: `index.html`

## 구현

- 공용 엔진: `_engine/v1/`
- 공용 Unit 5 모델·뷰·스타일: `_lessons/_shared/unit5-measurement/`
- 차시 설정: `_lessons/3-2-5-1-mathmon-water-fill/lesson.json`
- 빌드: `node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill`

문제 화면은 상단 공용 조작부, 왼쪽 진행 장면, 가운데 측정 작업대로 구성합니다. 첫 문제에서는 학생이 실제로 `물을 옮겨 붓기`를 눌러 전·중·후 장면을 확인합니다. 뒤 문제에서는 같은 모양의 통에 옮기거나 같은 종이컵으로 잰 뒤에 비교 결과를 고릅니다.

## 흐름

```text
표지 → 방법 1 → 방법 2 → 10문제 → 단계 보상 → 결과
```

문제마다 먼저 조작하거나 비교 방법을 고르고, 드러난 결과를 근거로 답합니다. 과정 버튼을 누르기 전에는 컵 수나 비교 결과를 미리 보여 주지 않습니다.

## 생성 자산

- 설명: `tutorial-page-1-v3-generated.webp`, `tutorial-page-2-v3-generated.webp`
- 직접 붓기 전: `capacity-direct-before-v1-source.png` / `capacity-direct-before-v1-generated.webp`
- 직접 붓는 중: `capacity-direct-pouring-v1-source.png` / `capacity-direct-pouring-v1-generated.webp`
- 직접 붓기 후: `capacity-direct-after-v1-source.png` / `capacity-direct-after-v1-generated.webp`
- 측정 물통: `measuring-vessel-v1-source.png` / `measuring-vessel-v1-generated.webp`

생성 그림은 `context-only`, `not-evidence`입니다. 문제의 수치와 정답은 구조화된 모델 데이터가 결정하며, 직접 붓기 장면에는 조작 뒤 상태를 설명하는 HTML 근거 문장도 함께 표시합니다. 새 직접 붓기 자산의 생성 기록은 `assets/DIRECT_POUR_GENERATION_RECEIPT.json`에 있습니다.

기존 보상 주인공은 `zero-factory-animal-pack`의 펭귄몬을 유지합니다.

결과 6단계는 `result-tiers-v5-contact-sheet.png`에서, 문제 화면의 물통 진행 6단계는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-contact-sheet.png`에서 함께 확인합니다. 진행 장면 생성 원본은 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/source`에 있고, 매스몬 위치는 `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-5-1/play-progress-v1/contact-sheets/play-water-progress-v1-anchor-audit.png`에서 점검합니다.

## 검증

```sh
node scripts/build-lesson.mjs 3-2-5-1-mathmon-water-fill
node scripts/qa-lesson5-water-fill-model.mjs --runs 10000
node scripts/qa-lesson-flow.mjs 3-2-5-1-mathmon-water-fill 1
node scripts/verify-mathmon-delivery.mjs --lesson=3-2-5-1-mathmon-water-fill
```
