# 매스몬 피자 분수 가게

3학년 2학기 4단원 1차시용 분수 게임입니다.

- 학습 행동: 피자 그림을 보고 `색칠된 조각 수 / 전체 조각 수`를 고릅니다.
- 문제 수: 서로 다른 분수 관계를 연습하는 10문제
- 문제 화면: 생성형 피자 가게 배경 위에 큰 피자, 조각 수 표지, 분수 선택지만 보여 줍니다.
- 정답 확인: 학생이 고른 분수가 큰 계산판에 들어가고, 조각 수와 같은지 확인한 뒤 `피자 보기`를 누릅니다.
- 오답 피드백: 분자·분모 뒤바꿈, 색칠하지 않은 조각 세기 등 선택 이유에 맞는 한 줄 힌트를 보여 줍니다.
- 보상: 문제마다 피자 빛이 무작위로 달라지고, 10문제 뒤 차시 전용 결과 장면을 보여 줍니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 화면 원칙

문제 화면에는 큰 문제, 피자 조각판, 한 줄 안내, 네 개의 분수 선택지만 둡니다. 점수판이나 등급판은 문제를 푸는 동안 펼쳐 두지 않습니다. 색만으로 뜻을 구분하지 않도록 SVG 피자 옆에 `색칠된 조각`과 `전체 조각`을 글자와 수로 함께 표시합니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-1-mathmon-pizza-fraction/`
- 설정: `lesson.json`
- 문제·오개념 모델: `model.js`
- 문제 화면: `view.js`, `lesson.css`
- 빌드 결과: `3-2-4-1-mathmon-pizza-fraction/index.html`
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 커버: `cover-generated.webp`, `title-logo-generated.webp`, 공용 시작 버튼 `../_shared/mathmon/cover-start-button/start-button-generated.webp`
- 동행 매스몬: 승인된 `base-pack`의 여우몬(`base-02-foxmon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장. 첫 장은 분자·분모, 둘째 장은 랜덤 보상과 마지막 피자 이름을 보여 줍니다.
- 랜덤 보상 상태 세트: 닫힌 피자 상자 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v4-contact-sheet.png`
- 최종 보상 장면: `result-{slice,half,whole,jumbo,shopstar,legend}-generated.webp` 6장. 각 장은 1280×800 완성 장면이며 배경·여우몬·피자·공통 빈 결과판을 담고, 등급 제목·정답 수·다음 목표·`다시` 버튼은 정렬 가능한 독립 자산/오버레이로 둡니다.
- 최종 보상 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/result-fullscene-v1/source/result-*-v4-base-source.png`
- 최종 보상 런타임 PNG: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/result-fullscene-v1/runtime-png/result-*-generated.png`
- 최종 보상 컨택시트: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`
- 실제 브라우저 결과 전수표: `screenshots/result-all-tiers-desktop-contact-sheet.png`, `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`
- 문제 왼쪽 진행 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/play-progress-v1/source/play-pizza-v1-*-source.png`
- 문제 왼쪽 진행 런타임: `play-pizza-v1-*-generated.webp`, 768×1536, `object-fit: contain`
- 문제 왼쪽 진행 전수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/play-progress-v1/contact-sheets/play-pizza-progress-v1-contact-sheet.png`
- 여우몬 중심·발 기준선 검수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-4-1/play-progress-v1/contact-sheets/play-pizza-progress-v1-anchor-audit.png`

최종 보상은 비 오는 낡은 손수레의 `한 조각`에서 시작해 꽃이 핀 가게, 벽돌 화덕 식당, 네온 축제 무대, 황금 피자 궁전, 무지개 피자 세계로 올라갑니다. 인접 단계마다 장소·날씨·피자 크기·빛·여우몬 반응 가운데 두 가지 이상이 달라지며, 최상위 두 단계는 황금과 무지개 색 계열로 분명히 구분합니다. 결과판에는 정답 수와 다음 목표만 동적으로 표시하고, 진행 중 피자 빛·진행 막대는 결과 화면에서 숨깁니다.

최종 보상 6등급은 `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`, 사용자 회귀 `1079×840`에서 전수 검사했습니다. 공통 결과판의 실제 픽셀 검출 영역은 `854,120,386×581`이고 단계별 차이는 `1px` 이하, 독립 UI 축 오차는 `1px` 이하이며 중복 패널·글자 넘침·요소 교차·Stage 이탈은 0건입니다.

문제 왼쪽 진행은 최종 보상 6등급을 확정한 뒤 같은 성장 순서로 별도 제작했습니다. Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%` 슬롯에서 여섯 장을 모두 `contain`으로 표시하며, 학습판 교차와 여우몬 전신 잘림은 0건입니다. 보상 카드를 닫은 뒤 `320ms` 후 진행 장면을 바꾸고 `1560ms` 동안 변화 효과를 보여 준 다음에만 다음 문제로 이동합니다.

시작 버튼은 `shared-canonical-v1` 한 세트만 쓰며, 1280×800 Stage에서 360×152px, 작은 화면에서 최소 300×127px로 표시합니다. 모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
