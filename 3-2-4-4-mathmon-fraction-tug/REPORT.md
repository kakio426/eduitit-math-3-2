# 매스몬 분수 줄다리기 제작 보고

## 이번 개편

- 어두운 줄다리기 패널과 드래그 자리를 밝은 이미지형 야외 경기장으로 교체했습니다.
- 한 화면 한 행동을 `더 긴 분수 막대 하나 고르기`로 고정했습니다.
- 두 선택지는 항상 같은 전체 길이로 그립니다. 분모가 같은 문제는 색칠된 칸 수, 단위분수 문제는 한 칸의 실제 길이가 바로 비교됩니다.
- 색만으로 판단하지 않도록 각 카드에 분수를 크게 표기하고, 칸 경계와 길이를 함께 보여 줍니다.
- 문제 안내는 비교 규칙 한 줄만 남겼습니다. 줄 그림 아래 중복 안내는 제거했습니다.
- 정답 뒤에는 더 큰 분수를 왼쪽에 놓은 두 막대와 `>`를 크게 보여 줍니다. 학생이 확인한 뒤 `승부 보기`를 눌러 보상으로 이동합니다.

## 생성형 이미지 자산

- 문제 무대 계약: 1280×800, 왼쪽 밧줄·깃발·정원, 오른쪽 넓은 야외 경기장, 글자·숫자·UI·분수 막대 없음
- 원본: `problem-stage-source.png`
- 배포 PNG: `problem-stage-generated.png`
- 런타임 WebP: `problem-stage-generated.webp`

## 2026-07-12 시각 흐름 리마스터

- 승인된 `diversity-reward-pack` 호랑몬을 커버·설명·보상·결과까지 같은 주인공으로 유지했습니다.
- 설명 1은 `분모가 같으면 색칠된 칸`, `단위분수면 한 칸 길이`를 좌우 막대로 비교합니다.
- 설명 2는 `10문제 → 줄다리기 힘 변화 → 마지막 승부 이름`만 보여 줍니다.
- 랜덤 보상 6종과 결과 6단계를 각각 다른 이미지로 만들었습니다.
- 결과 6장은 1280×800이며 고정 등급명·`다시` 버튼과 빈 동적 정보판을 같은 위치에 맞췄습니다.
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 공용 상단 슬롯에 표시합니다.
- 닫힌 보상과 열린 보상은 각각 `07-reward-closed.png`, `07b-reward-open.png`로 검수했습니다.

## 검증

- `node scripts/qa-engine-unit4-tug-source.mjs` 통과
- lesson engine build, lesson contract, Stage ratio 검사 통과
- `node scripts/check-lesson-visual-contract.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-4-mathmon-fraction-tug` 통과

브라우저 QA는 1280×800과 1024×768에서 첫 화면, 설정, 설명 2장, 문제, 오답, 정답 확인, 보상, 결과를 확인했습니다. 스크린샷은 `screenshots/engine-flow-desktop-*`와 `screenshots/engine-flow-tablet-landscape-*`에 있습니다.

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 1280×800, 1024×768
- 결과: 글자 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건, 이미지 로드 실패 0건

## Humanizer 학생 문구 QA

`색칠된 칸이 많은 쪽이 더 커요.`, `똑같이 나눈 한 칸이 긴 쪽이 더 커요.`처럼 한 문장에 비교 기준 하나만 남겼습니다. 같은 행동을 반복해서 설명하는 문장은 제거했습니다.
