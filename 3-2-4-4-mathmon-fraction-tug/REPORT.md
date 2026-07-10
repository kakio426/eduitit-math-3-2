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

## 검증

- `node scripts/qa-engine-unit4-tug-source.mjs` 통과
- lesson engine build, lesson contract, Stage ratio 검사 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-4-mathmon-fraction-tug` 통과

브라우저 QA는 1280×800과 1024×768에서 첫 화면, 설정, 설명 2장, 문제, 오답, 정답 확인, 보상, 결과를 확인했습니다. 스크린샷은 `screenshots/engine-flow-desktop-*`와 `screenshots/engine-flow-tablet-landscape-*`에 있습니다.

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 1280×800, 1024×768
- 결과: 글자 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건, 이미지 로드 실패 0건

## Humanizer 학생 문구 QA

`색칠된 칸이 많은 쪽이 더 커요.`, `똑같이 나눈 한 칸이 긴 쪽이 더 커요.`처럼 한 문장에 비교 기준 하나만 남겼습니다. 같은 행동을 반복해서 설명하는 문장은 제거했습니다.
