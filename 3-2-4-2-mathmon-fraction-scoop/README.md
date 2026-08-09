# 매스몬 분수만큼 담기

3학년 2학기 4단원 2차시용 분수 게임입니다.

- 학습 행동 1: 전체를 분모만큼 나눈 한 묶음 수를 고릅니다.
- 학습 행동 2: 한 묶음 수에 분자를 곱한 수를 고릅니다.
- 문제 수: 두 단계가 모두 필요한 10문제
- 문제 화면: 생성형 과일 작업장 배경 위에 현재 계산만 크게 보여 줍니다.
- 정답 확인: `전체 ÷ 분모 → 한 묶음 × 분자` 완성식을 본 뒤 `바구니 보기`를 누릅니다.
- 오답 피드백: 분모를 답으로 고르기, 전체를 그대로 고르기, 한 묶음만 담기 등 선택 이유에 맞춰 한 줄로 나옵니다.
- 실행: `index.html`을 브라우저에서 엽니다.

## 엔진과 자산

- 편집 원본: `_lessons/3-2-4-2-mathmon-fraction-scoop/`
- 문제·오개념 모델: `model.js`
- 문제 화면: `view.js`, `lesson.css`
- 빌드 결과: `3-2-4-2-mathmon-fraction-scoop/index.html`
- 공용 시작 버튼: `../_shared/mathmon/cover-start-button/start-button-generated.webp` (`shared-canonical-v1`, 360×152px, 최소 300×127px)
- 문제 배경: `problem-stage-source.png` → `problem-stage-generated.png` → `problem-stage-generated.webp`
- 동행 매스몬: 승인된 `zero-factory-animal-pack`의 토끼몬(`zfa-02-rabbitmon`)
- 설명: `tutorial-page-{1,2}-generated.webp` 2장
- 랜덤 보상 상태 세트: 덮인 바구니 `reward-event-closed-generated.webp` + 열린 이벤트 6종, 모두 512×512
- 보상 상태 컨택시트: `reward-events-v3-contact-sheet.png`
- 최종 보상 장면: `result-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp` 6장. 각 장은 1280×800 완성 장면이며 배경·토끼몬·바구니·등급 제목·빈 결과판·`다시` 버튼 표면을 한 이미지 안에 넣었습니다.
- 최종 보상 생성 원본: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/result-fullscene-v1/source/result-*-v4-source.png`
- 최종 보상 런타임 PNG: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/result-fullscene-v1/runtime-png/result-*-generated.png`
- 최종 보상 컨택시트: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/result-fullscene-v1/contact-sheets/result-tiers-v4-contact-sheet.png`
- 문제 왼쪽 진행 장면: `play-basket-v1-{handful,smallbasket,basket,bigbasket,cartfull,rainbow}-generated.webp` 6장, 모두 전용 768×1536 생성 이미지입니다.
- 문제 왼쪽 진행 생성 원본: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/source/play-basket-v1-*-source.png`
- 문제 왼쪽 진행 전수표: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/contact-sheets/play-basket-progress-v1-contact-sheet.png`
- 토끼몬 중심·발 기준선 검수표: `_shared/mathmon/zero-factory-animal-pack/lesson-scenes/3-2-4-2/play-progress-v1/contact-sheets/play-basket-progress-v1-anchor-audit.png`

최종 보상은 비 오는 빈 채집터의 `한 줌`에서 시작해 작은 시골 밭, 맑은 과수원, 마법 숲, 황금 수확 축제, 무지개 수정 하늘정원으로 올라갑니다. 인접 단계마다 장소·날씨·바구니 크기·빛·토끼몬 반응 가운데 두 가지 이상이 달라지며, 최상위 두 단계는 황금과 무지개 색 계열로 분명히 구분합니다. 현재 바구니 빛·진행 막대·정답 수·다음 목표만 빈 결과판 위에 동적으로 표시합니다.

최종 보상 6등급은 `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`에서 전수 검사했습니다. 실제 결과판 픽셀 중심과 동적 요소 중심 차이는 3px 이내이며 글자 넘침·요소 교차·Stage 이탈은 0건입니다. 실제 브라우저 전수표는 `screenshots/result-all-tiers-desktop-contact-sheet.png`, `screenshots/result-all-tiers-tablet-landscape-contact-sheet.png`입니다.

문제 왼쪽 진행 장면은 최종 보상 6등급을 먼저 확정하고 브라우저 검증한 뒤 별도로 만들었습니다. 결과 화면을 자르거나 재사용하지 않으며, 여섯 장 모두 토끼몬 중심 `0.50`, 발 기준선 `0.68~0.70`, 전신 높이 `0.32~0.35`를 유지합니다. 실제 패널은 Stage의 `left 1.65% / top 11% / width 19.2% / height 84%`에 놓이며, 다섯 화면 크기에서 네 변 오차 1px 이하·학습 영역 교차 0px를 통과했습니다. 보상 모달이 닫힌 뒤 320ms를 기다리고, 장면 교체와 Stage 폭 35%의 빛 효과를 1560ms 보여 준 다음에만 다음 문제로 넘어갑니다.

모든 화면은 16:10, 기준 크기 1280×800 Stage를 사용합니다.

추가 시각 계약 검사는 `node scripts/check-lesson-visual-contract.mjs`로 실행합니다.
