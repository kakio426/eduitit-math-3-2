# 매스몬 택배 무게 맞추기 검증 보고서

검증일: 2026-07-31
실행본: `3-2-5-4-mathmon-package-weight/index.html`

## 현재 구현

- 16:10 Stage, 기준 크기 1280×800
- 표지: 글자 없는 생성 배경 + 생성 제목 아트 + HTML 목표 + 공용 생성 시작 버튼
- 설정: Stage 안 원형 톱니 모달, `mathmon-audio-bgm-enabled` / `mathmon-audio-sfx-enabled` 저장
- 학습: kg·g 덧셈, 받아내림이 있는 뺄셈, 택배 한도 판단 10문제
- 확인: 고른 답이 계산판에 들어간 뒤 확인 문구를 보여 주며, 마지막에는 완성식을 본 뒤 `트럭 보기`를 누름
- 랭킹: 비활성, 네트워크 제출·조회 없음
- 매스몬 자산: 승인 활성 팩 `base-pack`, 여우몬 `base-02-foxmon`; 커버·결과의 생성 장면 안에 포함
- 공통 소스 계약: `_lessons/3-2-5-4-mathmon-package-weight/lesson.json`의 `standalone-html-v1` 메타데이터와 위임형 브라우저 하네스 사용

## 문제 화면 QA

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

기존 차시의 4단계 결과 기준은 보존합니다.

| 단계 | 조건 |
| --- | --- |
| 평범 트럭 | 기본 |
| 살짝 멋진 트럭 | 힘 30, 바로 맞힌 문제 3개 |
| 번쩍 멋진 트럭 | 힘 70, 바로 맞힌 문제 7개 |
| 슈퍼 초울트라 트럭 | 힘 100, 바로 맞힌 문제 1개, 특별 부품 |

- 고정 제목과 `다시` 장식은 생성 이미지입니다.
- 정답 수는 공용 생성 이미지 세트를 씁니다.
- 넓은 값인 현재 힘·진행 막대·다음 목표만 하나의 SVG 동적 레이어가 표시합니다.
- 제목, 정답 수, 힘 패널, 다시 버튼은 같은 세로축에 놓고 형제 요소 교차 0px, 중심 오차 0px를 확인했습니다.
- 4단계×2개 viewport를 전수 캡처했습니다: `screenshots/result-tier-*-desktop.png`, `screenshots/result-tier-*-tablet-landscape.png`.

## 텍스트 넘침·요소 겹침 QA

브라우저 하네스가 desktop 1280×800과 tablet landscape 1024×768에서 다음을 검사합니다.

- 카드 560×480, 그림 250×250 실측 오차 1px 이하
- 닫힘 1상태와 열린 6사건 전수
- 모달 안 글자 넘침 0건, 보이는 행동 버튼 1개
- 닫힘 제목과 버튼의 같은 말 반복 0건, 열린 상태 설명 문장 0개, 한글 낱글자 줄바꿈 0건
- 결과 4단계 전수, 제목/정답 수/힘 패널/다시 버튼 교차 0px
- 결과 공통축 중심 오차 1px 이하
- 결과 배경 natural size 1280×800
- 연속 클릭·물리 더블클릭·오래된 pointer/keyboard 이벤트의 다음 문제 이월 0건
- 현재 증거: `screenshots/current-*.png`, `screenshots/reward-event-*-open-*.png`, `screenshots/reward-event-closed-*.png`, `screenshots/result-tier-*-*.png`
- 이전 명칭의 캡처 27장은 `screenshots/_archive/pre-20260731-modal-art-v2/`로 옮겨 현재 증거와 분리했습니다.

## 검증 결과

- `node scripts/check-stage-ratio.mjs` → PASS (24 packages)
- `node scripts/check-lesson-contract.mjs 3-2-5-4-mathmon-package-weight` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-5-4-mathmon-package-weight` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-5-4-mathmon-package-weight` → PASS (위임형 브라우저 하네스)
- `node scripts/qa-lesson5-package-weight-model.mjs` → PASS (1,000,000문항)
- `node scripts/simulate-lesson5-package-weight.mjs` → PASS
- `node scripts/qa-lesson5-package-weight-click-guards.mjs` → PASS
  - `reward_modal_all_events_all_viewports` PASS
  - `result_all_tiers_all_viewports` PASS
- 깨진 이미지, Stage 이탈, 글자 넘침, 의도하지 않은 요소 교차: 0건

## 생성 자산 보관

- 보상 사건 생성 원본: `reward-event-*-source.png`
- 런타임 PNG/WebP: `reward-event-*-generated.png`, `reward-event-*-generated.webp`
- 닫힌 상자: `reward-event-closed-v2-source.png`, `reward-event-closed-v2-generated.png`, `reward-event-closed-v2-generated.webp`
- 자산 전수표: `reward-events-v1-contact-sheet.png`
- 결과 4장과 제목 원본/런타임 파일은 기존 이름을 유지합니다.

## 2026-08-01 학생 문구·한도 비교 회귀

- 첫 빌림 지시는 `1kg을 1000g으로 바꿔요.` 한 줄입니다. `word-break: keep-all`, `overflow-wrap: normal`, 데스크톱·태블릿 한 줄과 넘침 0건을 전용 브라우저 하네스로 확인했습니다.
- 한도 문제의 `/` 구분과 `알 수 없어요`를 없앴습니다. `한도와 같아요`는 10,000회 실행에서 5,902회 실제 정답으로 생성됐습니다.
- 결과 힘 문구는 `트럭 힘 70`처럼 한 덩어리로 표시합니다. 4단계×2 viewport 공통축과 형제 교차 0건을 다시 확인했습니다.
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
