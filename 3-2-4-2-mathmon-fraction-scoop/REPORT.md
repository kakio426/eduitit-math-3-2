# 매스몬 분수만큼 담기 제작 보고

## 이번 개편

- CSS 패널과 드래그 칸이 많던 화면을 밝은 이미지형 과일 작업장으로 바꿨습니다.
- 한 문제를 `한 묶음 구하기`와 `분자만큼 담기` 두 화면 행동으로 나눴습니다.
- 현재 단계만 진한 테두리로 강조하고, 다음 단계는 흐리게 잠가 둡니다. 첫 단계가 끝나면 계산값을 남긴 채 둘째 단계로 넘어갑니다.
- 묶음마다 같은 수의 열매 점을 그려 `전체 ÷ 분모`를 눈으로 확인하게 했습니다. 담을 묶음은 색과 테두리 상태를 함께 바꿉니다.
- 네 개의 보기에는 정답과 대표 오개념을 넣고, 선택 이유에 맞는 한 줄 피드백을 제공합니다.
- 마지막에는 두 계산이 한 화면에서 완성된 뒤 학생이 직접 `바구니 보기`를 눌러 보상으로 이동합니다.

## 생성형 이미지 자산

- 문제 무대 계약: 1280×800, 밝은 온실 과일 작업장, 왼쪽 바구니·과일·계량 도구, 오른쪽 넓은 작업 공간, 글자·숫자·UI·분수 도형 없음
- 원본: `problem-stage-source.png`
- 배포 PNG: `problem-stage-generated.png`
- 런타임 WebP: `problem-stage-generated.webp`

## 검증

- `node scripts/qa-engine-unit4-scoop-source.mjs` 통과
- lesson engine build 통과
- `node scripts/check-lesson-contract.mjs` 통과
- `node scripts/check-stage-ratio.mjs` 통과
- `node scripts/qa-lesson-flow.mjs 3-2-4-2-mathmon-fraction-scoop` 통과

브라우저 QA는 1280×800과 1024×768에서 첫 화면, 설정, 설명 2장, 첫 단계, 오답, 둘째 단계와 최종 확인, 보상, 결과를 실제 흐름으로 확인했습니다. 스크린샷은 `screenshots/engine-flow-desktop-*`와 `screenshots/engine-flow-tablet-landscape-*`에 있습니다.

## 텍스트 넘침·요소 겹침 QA

- 확인 크기: 1280×800, 1024×768
- 확인 상태: 첫 화면, 설정, 설명 1·2, 문제 1·2단계, 오답, 최종 확인, 보상, 결과
- 결과: 글자 넘침 0건, 요소 겹침 0건, Stage 밖 이탈 0건, 이미지 로드 실패 0건

## Humanizer 학생 문구 QA

학생 화면 문구는 `먼저 전체를 분모로 나눠요.`, `이제 분자만큼 담아요.`처럼 한 문장에 행동 하나만 남겼습니다. `부분곱`, `단계 엔진`, `진행도` 같은 제작자 말은 화면에서 제거했습니다.
