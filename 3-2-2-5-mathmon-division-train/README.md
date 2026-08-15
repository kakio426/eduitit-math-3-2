# 매스몬 나눔열차

에듀잇티 수학 게임 3학년 2학기 2단원 5차시입니다.

- 학습: 나머지가 없는 `(세 자리 수)÷(한 자리 수)`
- 목표: 왼쪽부터 나눌 수 있는 수를 찾아 몫 구하기
- 문제: 10문제
- 행동: 현재 자리의 몫과 남은 수 고르기
- 확인: 몫·곱한 값·남은 수·내려온 수가 계산판에 차례로 나타남
- 실행: `index.html`

## 학습 흐름

`540÷3`처럼 백의 자리부터 나누는 문제와 `364÷7`처럼 십의 자리부터 나누는 문제를 함께 다룹니다. 계산판에는 자리 숫자를 놓고, 지시문과 선택지에는 `몫 200`, `남은 수 100`처럼 실제 값을 보여 줍니다. 마지막 자리까지 맞히면 완성식을 확인한 뒤 `선물 상자 열기`를 눌러 보상을 봅니다.

## 화면과 자산

- 매스몬: `base-pack`의 새끼용몬 `base-03-babydragonmon`
- 커버: `cover-source.png` → `cover-generated.png` → `cover-generated.webp`
- 제목: `title-logo-source.png` → `title-logo-generated.png` → `title-logo-generated.webp`
- 설명: `tutorial-page-1-v4-generated.webp`, `tutorial-page-2-v2-generated.webp`
- 설명 원본: `tutorial-page-1-v4-source.png`, `tutorial-page-2-v2-source.png`
- 문제 배경: `problem-background-source.png` → `problem-background-generated.webp`
- 보상 7상태: `reward-event-closed-generated.webp`와 `reward-{normal,loss,mega,complete,empty,rainbow}-generated.webp`
- 보상 컨택시트: `reward-contact-sheet.png`
- 문제 왼쪽 진행 장면 6장: `play-train-v1-{departure,village,forest,cloud,gold,rainbow}-generated.webp`
- 진행 장면 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/play-progress-v1/source`
- 진행 장면 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/play-progress-v1/contact-sheets/play-train-v1-contact-sheet.png`
- 진행 장면 기준선 시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/play-progress-v1/contact-sheets/play-train-v1-anchor-audit.png`
- 진행 장면 계약: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/play-progress-v1/contract.json`
- 최종 결과 6장: `result-{departure,village,forest,cloud,gold,rainbow}-generated.webp`
- 최종 결과 계약: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/result-fullscene-v1/contract.json`
- 최종 결과 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-2-5/result-fullscene-v1/contact-sheets/result-tiers-v1-contact-sheet.png`
- 결과 제목 세트: `result-title-*-generated-v2.webp`, `generated-titles-contact-sheet.png`
- 공용 시작: `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 공용 다시: `../_shared/result-actions/retry-button-v2-generated.webp`

진행 장면은 각 `768×1536`, 결과 장면은 각 `1280×800`, 보상 그림은 각 `512×512`입니다. 여섯 단계는 출발역부터 무지개역까지 1:1로 연결됩니다. 진행 장면은 레일·열차·새끼용몬이 한 장면 안에서 화면 끝까지 이어지는 `division-train-fullbleed-portrait-v1`이며, 캐릭터나 이동 효과를 별도 오버레이로 얹지 않습니다.

설명 두 장은 `generated-tutorial-poster-two-step-v1`을 따릅니다. 각 장은 `1280×800` 생성 포스터 한 장이 Stage를 채우며, 제목·풀이·화살표·계산 예·버튼 표면까지 이미지 안에 들어 있습니다. HTML은 접근성 문구와 생성 버튼 위 투명 hitbox만 맡습니다.

첫 설명은 같은 `364÷7` 세로셈 틀을 세 장면에 반복해 `36부터 나누기 → 35를 빼고 1 남기기 → 4를 내려 14 나누기`가 한눈에 이어지도록 만들었습니다. 숫자 위치가 장면마다 바뀌지 않아 학생이 세로셈의 변화를 그대로 따라갈 수 있습니다.

문제 계산판은 괄호의 세로선과 윗선을 하나의 ㄱ자 획으로 그리고 숫자 격자 밖에 둡니다. 따라서 선은 끊김 없이 이어지고 몫·나누어지는 수·곱한 수·남은 수는 백·십·일의 같은 열 중심을 공유합니다. 디자인 피드백 화면 `1079×929 DPR1`도 브라우저 회귀 화면으로 등록했습니다.

## 보상과 결과

중간 보상은 `mathmon-unified-reward-v1`과 Stage-Reveal 흐름을 씁니다. 정사각 보상 그림을 중앙에 두고 아래의 낮은 경로 띠에서 `현재 역 → 변화량 → 다음 역`을 확인합니다. 일반 결과 기준은 `0/0, 15/2, 35/4, 55/6, 78/8`, 특별 결과는 특별 사건이 나온 `100/1`입니다.

결과는 `출발역 → 마을역 → 숲길역 → 구름역 → 황금역 → 무지개역` 순서입니다. 각 단계는 독립 생성 장면이며 CSS 필터·블렌드·별도 효과 오버레이로 단계 차이를 만들지 않습니다.

## 빌드와 검증

```sh
node scripts/build-lesson.mjs 3-2-2-5-mathmon-division-train
node scripts/check-stage-ratio.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs 3-2-2-5-mathmon-division-train
node scripts/qa-lesson-flow.mjs 3-2-2-5-mathmon-division-train
```

현재 확인 내역과 남은 브라우저 증거는 `REPORT.md`에 기록합니다.
