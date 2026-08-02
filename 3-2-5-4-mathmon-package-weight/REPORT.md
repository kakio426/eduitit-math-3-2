# 매스몬 택배 무게 맞추기 검증 보고서

검증일: 2026-08-01
실행본: `3-2-5-4-mathmon-package-weight/index.html`

## 현재 구현

- 16:10 Stage, 기준 크기 1280×800
- 표지: 글자 없는 생성 배경 + 생성 제목 아트 + HTML 목표 + 공용 생성 시작 버튼
- 설정: Stage 안 원형 톱니 모달, `mathmon-audio-bgm-enabled` / `mathmon-audio-sfx-enabled` 저장
- 학습: kg·g 덧셈, 받아내림이 있는 뺄셈, 택배 한도 판단 10문제
- 문제 왼쪽 진행 보상: 최종 트럭 6단계와 1:1인 768×1536 전용 생성 장면 6장
- 확인: 고른 답이 계산판에 들어간 뒤 확인 문구를 보여 주며, 마지막에는 완성식을 본 뒤 `트럭 보기`를 누름
- 랭킹: 비활성, 네트워크 제출·조회 없음
- 매스몬 자산: 승인 활성 팩 `base-pack`, 여우몬 `base-02-foxmon`; 커버·결과의 생성 장면 안에 포함
- 공통 소스 계약: `_lessons/3-2-5-4-mathmon-package-weight/lesson.json`의 `standalone-html-v1` 메타데이터와 위임형 브라우저 하네스 사용

## 문제 화면 QA

- 왼쪽 진행 패널은 Stage 기준 `left 1.65% / top 11% / width 19.2% / height 84%`로 고정하고, 학습 영역은 `left 22.5%`부터 시작합니다.
- 여섯 진행 장면은 최종 결과 크롭이 아닌 전용 세로 장면이며 `object-fit: contain`으로 표시합니다.
- 생성 원본은 `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/source`, 전수표는 `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-contact-sheet.png`입니다.
- 실제 전신 픽셀 경계로 잰 여우몬 중심·발 기준선·크기 검수표는 `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-anchor-audit.png`입니다. 여섯 장의 중심과 발 기준선은 목표값에서 0.03 이내이고, 높이는 세트 중앙값에서 0.03 이내입니다.
- 계산판과 문제 카드를 화면의 주 영역으로 넓혔습니다. 데스크톱·태블릿 가로에서 문제판/지시/선택지 교차는 0px입니다.
- 핵심 숫자는 tabular 숫자를 사용하며 선택지와 터치 버튼은 42×42px 이상입니다.
- Humanizer 수정:
  - `kg까지 더한 무게를 골라요.` → `다 더한 무게를 골라요.`
  - `kg까지 뺀 무게를 골라요.` → `다 뺀 뒤의 무게를 골라요.`
- 오답 뒤에도 현재 단계와 계산판이 유지되고, 정답 확인 뒤에만 다음 단계로 이동합니다.

## 보상 계약

`data-reward-mode="modal-art"`, `data-reward-standard="unit5-package-modal-art-v2"`를 선언합니다.

- 카드: 560×480px
- 그림 슬롯: 250×250px
- 흐름: 마지막 문제 계산판을 뒤에 유지 → `두근두근!` 닫힌 상자 → 학생이 `상자 열기` → 사건 그림·실제 변화량 한 덩어리 → `다음`/`결과 보기`
- 전환: 카드를 완전히 닫음 → 320ms 시선 이동 여백 → 왼쪽 트럭 장면 교체와 Stage 폭 32% 이상 빛 효과를 1560ms 표시 → 다음 문제/결과
- 상태별 보이는 행동 버튼: 1개
- 닫힘/열림 모두 문제 진행을 중복 적용하지 않음

| 사건 | 확률 | 변화 | 그림 |
| --- | ---: | ---: | --- |
| normal | 64% | +6~+10 | `reward-event-normal-generated.webp` |
| loss | 15% | -5~-2 | `reward-event-loss-generated.webp` |
| mega | 12% | +14~+22 | `reward-event-mega-generated.webp` |
| jackpot | 5% | +30 | `reward-event-jackpot-generated.webp` |
| empty | 3.8% | 0, 누적 유지 | `reward-event-empty-generated.webp` |
| special | 0.2% | 100 | `reward-event-special-generated.webp` |
| 문제당 첫 오답 | 최초 1회 | -6~-3 | 감소·수리 그림 |

정답의 숨은 기본 가산값은 0입니다. 원본 접촉표는 `reward-events-truck-v1-source.png`, 최종 자산 전수표는 `reward-events-v1-contact-sheet.png`입니다. 닫힌 상자 1장과 열린 사건 6장은 모두 512×512이며 글자·숫자·UI를 포함하지 않습니다.

## 결과 화면

최종 보상 장면을 먼저 6단계로 다시 만들었습니다. 단계가 오를수록 트럭만 바뀌는 방식이 아니라 장소·날씨·빛·트럭의 크기와 움직임·여우몬의 반응이 함께 달라집니다.

| 단계 | 조건 |
| --- | --- |
| 평범 트럭 | 기본 |
| 살짝 멋진 트럭 | 힘 15, 바로 맞힌 문제 2개 |
| 파란 번개 트럭 | 힘 35, 바로 맞힌 문제 4개 |
| 번쩍 멋진 트럭 | 힘 55, 바로 맞힌 문제 6개 |
| 황금 축제 트럭 | 힘 78, 바로 맞힌 문제 8개 |
| 무지개 하늘 트럭 | 힘 100, 바로 맞힌 문제 1개, 무지개 부품 |

- 고정 제목과 `다시` 장식은 각 1280×800 생성 완성 장면 안에 포함됩니다. 별도 제목·다시 버튼 이미지는 화면에서 숨깁니다.
- 정답 수는 공용 생성 이미지 세트를 씁니다.
- 넓은 값인 현재 힘·진행 막대·다음 목표만 하나의 SVG 동적 레이어가 표시합니다.
- 단계별 빈 결과판 중심은 `958, 992, 958, 1034, 1015, 991px`이며, 동적 값과 투명 다시 hitbox가 각 축을 함께 따라갑니다.
- 자산 전수표는 `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/result-fullscene-v1/contact-sheets/result-tiers-v5-contact-sheet.png`, 생성 원본은 그 세트의 `source/result-truck-*-v5-source.png`입니다.

## 텍스트 넘침·요소 겹침 QA

브라우저 하네스가 desktop 1280×800, tablet landscape 1024×768, Codex 1280×720, 사용자 화면 994×632, 사용자 제보 화면 1082×987에서 다음을 검사합니다.

- 카드 560×480, 그림 250×250 실측 오차 1px 이하
- 닫힘 1상태와 열린 6사건 전수
- 모달 안 글자 넘침 0건, 보이는 행동 버튼 1개
- 닫힘 제목과 버튼의 같은 말 반복 0건, 열린 상태 설명 문장 0개, 한글 낱글자 줄바꿈 0건
- 결과 6단계 전수, 정답 수/힘/다음 목표/다시 hitbox 교차 0px
- 문제 왼쪽 진행 장면 6단계 전수, 패널 네 변 오차 1px 이하, 학습 영역 교차 0px
- 결과 공통축 중심 오차 1px 이하
- 결과 배경 natural size 1280×800
- 별도 결과 제목·다시 버튼 표면 표시 0개, CSS 효과·블렌드·단계별 필터 0개
- 연속 클릭·물리 더블클릭·오래된 pointer/keyboard 이벤트의 다음 문제 이월 0건
- 보상 전환 실측: 카드 닫힘→효과 시작 약 323ms, 효과 표시 약 1562ms, 문제 번호는 효과 종료 뒤에만 `1/10`→`2/10`으로 변경, 활성 효과 폭 Stage 약 35.5%
- 현재 증거: `screenshots/current-*.png`, `screenshots/reward-event-*-open-*.png`, `screenshots/reward-event-closed-*.png`, `screenshots/reward-transition-*.png`, `screenshots/play-progress-*-*.png`, `screenshots/result-tier-*-*.png`
- 이전 명칭의 캡처 27장은 `screenshots/_archive/pre-20260731-modal-art-v2/`로 옮겨 현재 증거와 분리했습니다.

### 화면 크기별 현재 실행 증거

현재 `index.html`과 같은 실행에서 시작 화면, 설정, 설명 1·2, 문제, 정답 확인, 닫힌 보상, 열린 보상, 보상 뒤 장면 변화, 결과 6등급을 모두 다시 캡처했습니다. DPR 2 화면은 실제 2배 픽셀로 저장했으며, `report-evidence-manifest.json`이 실행본과 각 캡처의 SHA-256을 묶어 검사합니다.

- 1280×800, DPR 1: `screenshots/report-flow-desktop-contact-sheet.png`
- 1024×768, DPR 1: `screenshots/report-flow-tablet-landscape-contact-sheet.png`
- 1280×720, DPR 2: `screenshots/report-flow-codex-in-app-contact-sheet.png`
- 994×632, DPR 1: `screenshots/report-flow-user-visibility-contact-sheet.png`
- 1082×987, DPR 2, 사용자 제보 회귀: `screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png`
- 1280×800, DPR 1, 빈 보상 고정 화면: `screenshots/report-flow-empty-reward-fixture-contact-sheet.png`
- 현재 증거 목록·해시: `screenshots/report-evidence-manifest.json`

## 검증 결과

- `node scripts/check-stage-ratio.mjs` → PASS (24 packages)
- `node scripts/check-lesson-contract.mjs 3-2-5-4-mathmon-package-weight` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-5-4-mathmon-package-weight` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-5-4-mathmon-package-weight` → PASS (위임형 브라우저 하네스)
- `node scripts/qa-lesson5-package-weight-model.mjs` → PASS (1,000,000문항)
- `node scripts/simulate-lesson5-package-weight.mjs` → PASS
- `node scripts/qa-lesson5-package-weight-click-guards.mjs` → PASS
  - `reward_modal_all_events_all_viewports` PASS
  - `modal_dismiss_world_impact_v2` PASS
  - `play_progress_all_tiers_all_viewports` PASS
  - `result_all_tiers_all_viewports` PASS
- 깨진 이미지, Stage 이탈, 글자 넘침, 의도하지 않은 요소 교차: 0건

## 생성 자산 보관

- 보상 사건 생성 원본: `reward-event-*-source.png`
- 런타임 PNG/WebP: `reward-event-*-generated.png`, `reward-event-*-generated.webp`
- 닫힌 상자: `reward-event-closed-v2-source.png`, `reward-event-closed-v2-generated.png`, `reward-event-closed-v2-generated.webp`
- 자산 전수표: `reward-events-v1-contact-sheet.png`
- 결과 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/result-fullscene-v1/source/result-truck-*-v5-base-source.png`, `result-truck-*-v5-source.png`
- 결과 런타임: 공용 세트 `runtime-png/result-truck-*-generated.png`, 차시 실행본 `result-truck-*-generated.webp`
- 결과 자산 전수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/result-fullscene-v1/contact-sheets/result-tiers-v5-contact-sheet.png`
- 문제 왼쪽 진행 생성 원본: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/source/play-truck-v1-*-source.png`
- 문제 왼쪽 진행 런타임: `play-truck-v1-*-generated.webp`
- 문제 왼쪽 진행 전수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-contact-sheet.png`
- 문제 왼쪽 진행 중심·발 기준선 검수표: `_shared/mathmon/base-pack/lesson-scenes/3-2-5-4/play-progress-v1/contact-sheets/play-truck-progress-v1-anchor-audit.png`

## 2026-08-01 학생 문구·한도 비교 회귀

- 첫 설명 그림의 번역투 `1000g= 1kg로 바꿔요.`를 `1000g은 1kg으로 바꿔요.`로 고쳤습니다. 한도와 같은 무게도 정답이므로 `한도보다 가벼운지 봐요.`는 `한도와 비교해요.`로 바꾸고, 숨은 설명 데이터도 같은 문구로 맞췄습니다. 생성 원본은 `tutorial-page-1-humanized-source.png`, 1280×800 런타임은 `tutorial-page-1-generated.png`와 `tutorial-page-1-generated.webp`입니다.
- 첫 빌림 지시는 `1kg은 1000g이에요.` 한 줄입니다. `word-break: keep-all`, `overflow-wrap: normal`, 데스크톱·태블릿 한 줄과 넘침 0건을 전용 브라우저 하네스로 확인합니다.
- 한도 문제의 `/` 구분과 `알 수 없어요`를 없앴습니다. `한도와 같아요`는 10,000회 실행에서 5,902회 실제 정답으로 생성됐습니다.
- 결과 힘 문구는 `트럭 힘 70`처럼 한 덩어리로 표시합니다.
- 보상 다음 행동은 `다음`으로 줄였습니다. 전용 Chrome QA에서 지시문의 세로 넘침도 다시 측정해 `0건`으로 확인했습니다.

## 2026-08-01 계산판 전환 상태 회귀

- 빼기 문제는 처음 무게를 계속 남겨 둔 채, 1kg을 빌린 수를 원래 수 위에 주석으로 표시합니다. 빌리기 단계에는 거짓 `=` 결과 행을 만들지 않습니다. g 차 단계에는 kg 칸을 비우고, 마지막에만 완성 무게를 표시합니다.
- 전용 Chrome fixture가 첫 문제를 받아내림 문제로 고정하고 `8kg 1295g`, `789g`, `3kg 789g`의 세 상태를 desktop·tablet에서 따로 캡처했습니다.
- 숫자 행의 오른쪽 경계 편차는 `1px 이하`, 계산판 넘침·잘림은 `0건`입니다. 증거는 `screenshots/calculation-*-01-borrowed.png`, `02-grams.png`, `03-complete.png`입니다.

## 2026-08-01 Kiro 8차 심층 회귀

- 전용 fixture가 원래 피감수 유지, 빌린 수가 원래 수보다 위에 있음, 빌리기 단계 결과 행 없음, g 단계 kg 칸 비움, 마지막 kg·g 완성값을 DOM과 실제 rect로 검사합니다.
- 100,000회 실행·1,000,000문항에서 한도와 같은 문제가 `60,151건` 생성됐고, 모델·클릭 방지·계산판·보상·결과 하네스가 모두 통과했습니다.

## 2026-08-01 Kiro 9차 차단 항목 회귀

- 독립 실행 HTML 구조를 `standalone-html-v1` 소스 계약으로 선언해 공통 계약·시각 계약·브라우저 명령에서 빠지지 않게 했습니다.
- 보상 화면은 문제 화면을 유지한 채 여는 실제 모달입니다. 보상 전용 전체 화면 배경은 숨기고, 카드가 열린 동안 뒤 계산판과 마지막 확인 상태가 그대로 남는지 두 viewport·일곱 보상 상태에서 검사합니다.
- 승인된 `base-pack`의 `base-02-foxmon` 연결, 런타임 자산, 문서 선언을 공통 계약에서 함께 확인합니다.
