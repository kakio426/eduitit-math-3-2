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

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. standalone 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- standalone 클릭 가드 하네스가 `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2` 및 6개 결과 단계를 전수 검사해 `PASS`했습니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.

<!-- REPORT-EVIDENCE-ALL:START -->

## 2026-08-04 최신 원본 스크린샷 전수

- 실행본 SHA-256: `7fc7701beb456a133d0869cfc48de02f8173db07d906dd98ce705a528fa8d77c`
- 생성 시각: `2026-08-04T15:46:09.801Z`
- 등록 화면 크기: `6개`
- 아래에 직접 삽입한 원본 캡처: `96장`
- 컨택시트만으로 대신하지 않고 manifest에 기록된 원본 캡처를 한 장씩 모두 연결했습니다.

### desktop · 1280×800 · DPR 1 · 16장

![desktop 전체 상태 컨택시트](screenshots/report-flow-desktop-contact-sheet.png)

#### 시작 화면 · `engine-flow-desktop-01-cover.png`

![desktop 시작 화면](screenshots/engine-flow-desktop-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-desktop-02-settings.png`

![desktop 설정 화면](screenshots/engine-flow-desktop-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-desktop-03-tutorial-1.png`

![desktop 설명 1 · 풀이 방법](screenshots/engine-flow-desktop-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-desktop-04-tutorial-2.png`

![desktop 설명 2 · 보상과 목표](screenshots/engine-flow-desktop-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-desktop-05-play-step1.png`

![desktop 문제 상태 · 05-play-step1](screenshots/engine-flow-desktop-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-desktop-06-confirm.png`

![desktop 마지막 확인 · 06-confirm](screenshots/engine-flow-desktop-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-desktop-07-reward-closed.png`

![desktop 닫힌 보상](screenshots/engine-flow-desktop-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-desktop-07b-reward-open.png`

![desktop 열린 보상](screenshots/engine-flow-desktop-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-desktop-07c-reward-impact.png`

![desktop 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-desktop-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-desktop-08-result.png`

![desktop 실제 결과](screenshots/engine-flow-desktop-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-desktop-08a-result-plain.png`

![desktop 결과 단계 · plain](screenshots/engine-flow-desktop-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-desktop-08a-result-slight.png`

![desktop 결과 단계 · slight](screenshots/engine-flow-desktop-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-desktop-08a-result-swift.png`

![desktop 결과 단계 · swift](screenshots/engine-flow-desktop-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-desktop-08a-result-cool.png`

![desktop 결과 단계 · cool](screenshots/engine-flow-desktop-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-desktop-08a-result-gold.png`

![desktop 결과 단계 · gold](screenshots/engine-flow-desktop-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-desktop-08a-result-super.png`

![desktop 결과 단계 · super](screenshots/engine-flow-desktop-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### tablet-landscape · 1024×768 · DPR 1 · 16장

![tablet-landscape 전체 상태 컨택시트](screenshots/report-flow-tablet-landscape-contact-sheet.png)

#### 시작 화면 · `engine-flow-tablet-landscape-01-cover.png`

![tablet-landscape 시작 화면](screenshots/engine-flow-tablet-landscape-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-tablet-landscape-02-settings.png`

![tablet-landscape 설정 화면](screenshots/engine-flow-tablet-landscape-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-tablet-landscape-03-tutorial-1.png`

![tablet-landscape 설명 1 · 풀이 방법](screenshots/engine-flow-tablet-landscape-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-tablet-landscape-04-tutorial-2.png`

![tablet-landscape 설명 2 · 보상과 목표](screenshots/engine-flow-tablet-landscape-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-tablet-landscape-05-play-step1.png`

![tablet-landscape 문제 상태 · 05-play-step1](screenshots/engine-flow-tablet-landscape-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-tablet-landscape-06-confirm.png`

![tablet-landscape 마지막 확인 · 06-confirm](screenshots/engine-flow-tablet-landscape-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-tablet-landscape-07-reward-closed.png`

![tablet-landscape 닫힌 보상](screenshots/engine-flow-tablet-landscape-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-tablet-landscape-07b-reward-open.png`

![tablet-landscape 열린 보상](screenshots/engine-flow-tablet-landscape-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-tablet-landscape-07c-reward-impact.png`

![tablet-landscape 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-tablet-landscape-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-tablet-landscape-08-result.png`

![tablet-landscape 실제 결과](screenshots/engine-flow-tablet-landscape-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-tablet-landscape-08a-result-plain.png`

![tablet-landscape 결과 단계 · plain](screenshots/engine-flow-tablet-landscape-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-tablet-landscape-08a-result-slight.png`

![tablet-landscape 결과 단계 · slight](screenshots/engine-flow-tablet-landscape-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-tablet-landscape-08a-result-swift.png`

![tablet-landscape 결과 단계 · swift](screenshots/engine-flow-tablet-landscape-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-tablet-landscape-08a-result-cool.png`

![tablet-landscape 결과 단계 · cool](screenshots/engine-flow-tablet-landscape-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-tablet-landscape-08a-result-gold.png`

![tablet-landscape 결과 단계 · gold](screenshots/engine-flow-tablet-landscape-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-tablet-landscape-08a-result-super.png`

![tablet-landscape 결과 단계 · super](screenshots/engine-flow-tablet-landscape-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### codex-in-app · 1280×720 · DPR 2 · 16장

![codex-in-app 전체 상태 컨택시트](screenshots/report-flow-codex-in-app-contact-sheet.png)

#### 시작 화면 · `engine-flow-codex-in-app-01-cover.png`

![codex-in-app 시작 화면](screenshots/engine-flow-codex-in-app-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-codex-in-app-02-settings.png`

![codex-in-app 설정 화면](screenshots/engine-flow-codex-in-app-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-codex-in-app-03-tutorial-1.png`

![codex-in-app 설명 1 · 풀이 방법](screenshots/engine-flow-codex-in-app-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-codex-in-app-04-tutorial-2.png`

![codex-in-app 설명 2 · 보상과 목표](screenshots/engine-flow-codex-in-app-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-codex-in-app-05-play-step1.png`

![codex-in-app 문제 상태 · 05-play-step1](screenshots/engine-flow-codex-in-app-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-codex-in-app-06-confirm.png`

![codex-in-app 마지막 확인 · 06-confirm](screenshots/engine-flow-codex-in-app-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-codex-in-app-07-reward-closed.png`

![codex-in-app 닫힌 보상](screenshots/engine-flow-codex-in-app-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-codex-in-app-07b-reward-open.png`

![codex-in-app 열린 보상](screenshots/engine-flow-codex-in-app-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-codex-in-app-07c-reward-impact.png`

![codex-in-app 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-codex-in-app-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-codex-in-app-08-result.png`

![codex-in-app 실제 결과](screenshots/engine-flow-codex-in-app-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-codex-in-app-08a-result-plain.png`

![codex-in-app 결과 단계 · plain](screenshots/engine-flow-codex-in-app-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-codex-in-app-08a-result-slight.png`

![codex-in-app 결과 단계 · slight](screenshots/engine-flow-codex-in-app-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-codex-in-app-08a-result-swift.png`

![codex-in-app 결과 단계 · swift](screenshots/engine-flow-codex-in-app-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-codex-in-app-08a-result-cool.png`

![codex-in-app 결과 단계 · cool](screenshots/engine-flow-codex-in-app-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-codex-in-app-08a-result-gold.png`

![codex-in-app 결과 단계 · gold](screenshots/engine-flow-codex-in-app-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-codex-in-app-08a-result-super.png`

![codex-in-app 결과 단계 · super](screenshots/engine-flow-codex-in-app-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-visibility · 994×632 · DPR 1 · 16장

![user-visibility 전체 상태 컨택시트](screenshots/report-flow-user-visibility-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-visibility-01-cover.png`

![user-visibility 시작 화면](screenshots/engine-flow-user-visibility-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-visibility-02-settings.png`

![user-visibility 설정 화면](screenshots/engine-flow-user-visibility-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-visibility-03-tutorial-1.png`

![user-visibility 설명 1 · 풀이 방법](screenshots/engine-flow-user-visibility-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-visibility-04-tutorial-2.png`

![user-visibility 설명 2 · 보상과 목표](screenshots/engine-flow-user-visibility-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-visibility-05-play-step1.png`

![user-visibility 문제 상태 · 05-play-step1](screenshots/engine-flow-user-visibility-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-visibility-06-confirm.png`

![user-visibility 마지막 확인 · 06-confirm](screenshots/engine-flow-user-visibility-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-visibility-07-reward-closed.png`

![user-visibility 닫힌 보상](screenshots/engine-flow-user-visibility-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-visibility-07b-reward-open.png`

![user-visibility 열린 보상](screenshots/engine-flow-user-visibility-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-visibility-07c-reward-impact.png`

![user-visibility 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-visibility-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-visibility-08-result.png`

![user-visibility 실제 결과](screenshots/engine-flow-user-visibility-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-user-visibility-08a-result-plain.png`

![user-visibility 결과 단계 · plain](screenshots/engine-flow-user-visibility-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-user-visibility-08a-result-slight.png`

![user-visibility 결과 단계 · slight](screenshots/engine-flow-user-visibility-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-user-visibility-08a-result-swift.png`

![user-visibility 결과 단계 · swift](screenshots/engine-flow-user-visibility-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-user-visibility-08a-result-cool.png`

![user-visibility 결과 단계 · cool](screenshots/engine-flow-user-visibility-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-user-visibility-08a-result-gold.png`

![user-visibility 결과 단계 · gold](screenshots/engine-flow-user-visibility-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-user-visibility-08a-result-super.png`

![user-visibility 결과 단계 · super](screenshots/engine-flow-user-visibility-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### user-reported-missing-left-progress · 1082×987 · DPR 2 · 16장

![user-reported-missing-left-progress 전체 상태 컨택시트](screenshots/report-flow-user-reported-missing-left-progress-contact-sheet.png)

#### 시작 화면 · `engine-flow-user-reported-missing-left-progress-01-cover.png`

![user-reported-missing-left-progress 시작 화면](screenshots/engine-flow-user-reported-missing-left-progress-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-user-reported-missing-left-progress-02-settings.png`

![user-reported-missing-left-progress 설정 화면](screenshots/engine-flow-user-reported-missing-left-progress-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-user-reported-missing-left-progress-03-tutorial-1.png`

![user-reported-missing-left-progress 설명 1 · 풀이 방법](screenshots/engine-flow-user-reported-missing-left-progress-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-user-reported-missing-left-progress-04-tutorial-2.png`

![user-reported-missing-left-progress 설명 2 · 보상과 목표](screenshots/engine-flow-user-reported-missing-left-progress-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-user-reported-missing-left-progress-05-play-step1.png`

![user-reported-missing-left-progress 문제 상태 · 05-play-step1](screenshots/engine-flow-user-reported-missing-left-progress-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-user-reported-missing-left-progress-06-confirm.png`

![user-reported-missing-left-progress 마지막 확인 · 06-confirm](screenshots/engine-flow-user-reported-missing-left-progress-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-user-reported-missing-left-progress-07-reward-closed.png`

![user-reported-missing-left-progress 닫힌 보상](screenshots/engine-flow-user-reported-missing-left-progress-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-user-reported-missing-left-progress-07b-reward-open.png`

![user-reported-missing-left-progress 열린 보상](screenshots/engine-flow-user-reported-missing-left-progress-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-impact · `engine-flow-user-reported-missing-left-progress-07c-reward-impact.png`

![user-reported-missing-left-progress 보상 뒤 변화 · 07c-reward-impact](screenshots/engine-flow-user-reported-missing-left-progress-07c-reward-impact.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-user-reported-missing-left-progress-08-result.png`

![user-reported-missing-left-progress 실제 결과](screenshots/engine-flow-user-reported-missing-left-progress-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-user-reported-missing-left-progress-08a-result-plain.png`

![user-reported-missing-left-progress 결과 단계 · plain](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-user-reported-missing-left-progress-08a-result-slight.png`

![user-reported-missing-left-progress 결과 단계 · slight](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-user-reported-missing-left-progress-08a-result-swift.png`

![user-reported-missing-left-progress 결과 단계 · swift](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-user-reported-missing-left-progress-08a-result-cool.png`

![user-reported-missing-left-progress 결과 단계 · cool](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-user-reported-missing-left-progress-08a-result-gold.png`

![user-reported-missing-left-progress 결과 단계 · gold](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-user-reported-missing-left-progress-08a-result-super.png`

![user-reported-missing-left-progress 결과 단계 · super](screenshots/engine-flow-user-reported-missing-left-progress-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

### empty-reward-fixture · 1280×800 · DPR 1 · 16장

![empty-reward-fixture 전체 상태 컨택시트](screenshots/report-flow-empty-reward-fixture-contact-sheet.png)

#### 시작 화면 · `engine-flow-empty-reward-fixture-01-cover.png`

![empty-reward-fixture 시작 화면](screenshots/engine-flow-empty-reward-fixture-01-cover.png)

- 학생이 보는 것: 매스몬 택배 무게 제목과 한 줄 목표, 시작 버튼을 봅니다.
- 판단하거나 누르는 것: 게임을 시작할 준비가 되면 시작을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 배우는 차시임을 확인합니다.
- 다음 상태로 넘어가는 이유: 문제를 푸는 방법을 보는 설명 화면으로 이동합니다.

#### 설정 화면 · `engine-flow-empty-reward-fixture-02-settings.png`

![empty-reward-fixture 설정 화면](screenshots/engine-flow-empty-reward-fixture-02-settings.png)

- 학생이 보는 것: 배경 소리·효과 소리와 방법 다시 보기, 처음부터, 닫기를 봅니다.
- 판단하거나 누르는 것: 필요한 소리나 이동 행동 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: 수학 문제는 바꾸지 않고 게임 조작만 설정합니다.
- 다음 상태로 넘어가는 이유: 설정을 마치면 열기 전 화면으로 돌아갑니다.

#### 설명 1 · 풀이 방법 · `engine-flow-empty-reward-fixture-03-tutorial-1.png`

![empty-reward-fixture 설명 1 · 풀이 방법](screenshots/engine-flow-empty-reward-fixture-03-tutorial-1.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 다음 설명으로 이동합니다.

#### 설명 2 · 보상과 목표 · `engine-flow-empty-reward-fixture-04-tutorial-2.png`

![empty-reward-fixture 설명 2 · 보상과 목표](screenshots/engine-flow-empty-reward-fixture-04-tutorial-2.png)

- 학생이 보는 것: kg과 g의 계산 문제를 푸는 방법과 게임 흐름을 그림으로 봅니다.
- 판단하거나 누르는 것: 그림 속 순서와 누를 곳을 확인한 뒤 다음 행동 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산에서 무엇을 비교하거나 계산하는지 확인합니다.
- 다음 상태로 넘어가는 이유: 첫 문제로 이동합니다.

#### 문제 상태 · 05-play-step1 · `engine-flow-empty-reward-fixture-05-play-step1.png`

![empty-reward-fixture 문제 상태 · 05-play-step1](screenshots/engine-flow-empty-reward-fixture-05-play-step1.png)

- 학생이 보는 것: 현재 문제, 핵심 계산판이나 물건, 고를 수 있는 답을 봅니다.
- 판단하거나 누르는 것: 문제에서 묻는 값이나 관계에 맞는 답 하나를 고릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산을 이용해 선택지를 판단합니다.
- 다음 상태로 넘어가는 이유: 고른 답에 따라 오답 또는 정답 확인 상태로 이동합니다.

#### 마지막 확인 · 06-confirm · `engine-flow-empty-reward-fixture-06-confirm.png`

![empty-reward-fixture 마지막 확인 · 06-confirm](screenshots/engine-flow-empty-reward-fixture-06-confirm.png)

- 학생이 보는 것: 마지막으로 완성된 계산이나 값과 보상으로 가는 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 완성된 관계를 읽은 뒤 보상 확인 버튼을 누릅니다.
- 화면에서 확인되는 수학 관계: kg과 g의 계산의 완성값을 보상 화면 전에 다시 확인합니다.
- 다음 상태로 넘어가는 이유: 수학 관계를 확인한 뒤 보상 상태로 이동합니다.

#### 닫힌 보상 · `engine-flow-empty-reward-fixture-07-reward-closed.png`

![empty-reward-fixture 닫힌 보상](screenshots/engine-flow-empty-reward-fixture-07-reward-closed.png)

- 학생이 보는 것: 결과가 아직 드러나지 않은 보상 그림과 열기 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 점수 변화를 확인하기 위해 열기를 누릅니다.
- 화면에서 확인되는 수학 관계: 뒤 문제 화면에는 방금 완성한 계산이나 관계가 그대로 남습니다.
- 다음 상태로 넘어가는 이유: 학생이 직접 연 뒤에만 이번 보상 사건이 공개됩니다.

#### 열린 보상 · `engine-flow-empty-reward-fixture-07b-reward-open.png`

![empty-reward-fixture 열린 보상](screenshots/engine-flow-empty-reward-fixture-07b-reward-open.png)

- 학생이 보는 것: 보상 사건 그림과 이번 점수 변화, 다음 행동 버튼을 봅니다.
- 판단하거나 누르는 것: 이번 변화를 확인하고 다음을 누릅니다.
- 화면에서 확인되는 수학 관계: 수학 정답과 무작위 보상 변화가 서로 분리되어 있음을 확인합니다.
- 다음 상태로 넘어가는 이유: 현재 진행 장면의 변화를 본 뒤 다음 문제나 결과로 이동합니다.

#### 보상 뒤 변화 · 07c-reward-empty · `engine-flow-empty-reward-fixture-07c-reward-empty.png`

![empty-reward-fixture 보상 뒤 변화 · 07c-reward-empty](screenshots/engine-flow-empty-reward-fixture-07c-reward-empty.png)

- 학생이 보는 것: 보상 모달이 닫힌 뒤 현재 진행 장면과 점수 변화가 반영되는 모습을 봅니다.
- 판단하거나 누르는 것: 별도 입력 없이 이번 보상이 진행 단계에 반영되는 모습을 확인합니다.
- 화면에서 확인되는 수학 관계: 한 문제의 보상이 현재 진행값에 정확히 한 번 반영됩니다.
- 다음 상태로 넘어가는 이유: 효과를 충분히 본 뒤 다음 문제 또는 결과로 이동합니다.

#### 실제 결과 · `engine-flow-empty-reward-fixture-08-result.png`

![empty-reward-fixture 실제 결과](screenshots/engine-flow-empty-reward-fixture-08-result.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · plain · `engine-flow-empty-reward-fixture-08a-result-plain.png`

![empty-reward-fixture 결과 단계 · plain](screenshots/engine-flow-empty-reward-fixture-08a-result-plain.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · slight · `engine-flow-empty-reward-fixture-08a-result-slight.png`

![empty-reward-fixture 결과 단계 · slight](screenshots/engine-flow-empty-reward-fixture-08a-result-slight.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · swift · `engine-flow-empty-reward-fixture-08a-result-swift.png`

![empty-reward-fixture 결과 단계 · swift](screenshots/engine-flow-empty-reward-fixture-08a-result-swift.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · cool · `engine-flow-empty-reward-fixture-08a-result-cool.png`

![empty-reward-fixture 결과 단계 · cool](screenshots/engine-flow-empty-reward-fixture-08a-result-cool.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · gold · `engine-flow-empty-reward-fixture-08a-result-gold.png`

![empty-reward-fixture 결과 단계 · gold](screenshots/engine-flow-empty-reward-fixture-08a-result-gold.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

#### 결과 단계 · super · `engine-flow-empty-reward-fixture-08a-result-super.png`

![empty-reward-fixture 결과 단계 · super](screenshots/engine-flow-empty-reward-fixture-08a-result-super.png)

- 학생이 보는 것: 완성 장면과 결과 이름, 정답 수, 다음 목표, 다시 버튼을 봅니다.
- 판단하거나 누르는 것: 현재 결과와 다음 목표를 비교하고 다시 도전할지 결정합니다.
- 화면에서 확인되는 수학 관계: 한 판의 정답과 점수 변화가 하나의 결과 단계로 정리됩니다.
- 다음 상태로 넘어가는 이유: 다시를 누르면 새 문제 순서와 새 보상 흐름으로 시작합니다.

<!-- REPORT-EVIDENCE-ALL:END -->
