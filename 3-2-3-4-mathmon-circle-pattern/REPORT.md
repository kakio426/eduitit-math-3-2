# 매스몬 원 무늬 디자이너 제작 보고 (3-2-3-4) ★ 단원 정점

## 이번 고도화

- 기존 검은 패널과 왼쪽 점수 장치를 생성 이미지 기반의 밝은 판타지 무늬 공방으로 교체했습니다.
- 한 보드에 가·나·다·라 후보 원을 겹치던 방식을 완성된 미니 무늬 4개 선택으로 바꿨습니다.
- 문제 화면을 `큰 질문 → 원 3개와 다음 자리 → 한 줄 지시 → 미니 무늬 선택지`로 줄였습니다.
- 오답을 고르면 선택한 잘못된 무늬를 크게 보여 주고 한 가지 이유만 안내합니다.
- 소스 엔진을 `_lessons/3-2-3-4-mathmon-circle-pattern/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 2026-07-12 1단원 기준 시각 흐름 보강

- 커버를 승인된 `diversity-reward-pack` 무지개유니몬 장면으로 다시 만들고 설명·보상·결과까지 같은 주인공을 유지했습니다.
- 설명 1은 `원 크기`, `사이 간격`, `같은 크기와 간격으로 잇기`를 세 그림으로 분리해 보여 줍니다.
- 설명 2에서는 풀이법을 반복하지 않고 `10문제 → 무늬 빛 변화 → 무늬 이름`만 보여 줍니다.
- 랜덤 보상 6종은 무늬 연장·감소·큰 무늬·완벽한 무늬·점무늬·무지개 무늬를 별도 이미지로 구분했습니다.
- 결과 6장은 모두 1280×800이며, 무지개유니몬·원 무늬·오른쪽 동적 정보판·고정 제목·`다시` 버튼 슬롯을 통일했습니다.
- 결과 컨택시트: `result-tiers-v3-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 쓰며, 공용 상단 슬롯 좌표를 따릅니다.

## 수학 설계

- 가로 무늬 4개, 위로 이어지는 무늬 3개, 아래로 이어지는 무늬 3개가 한 판에 나옵니다.
- 각 문제는 정답 1개와 간격·줄·크기 오개념 3개를 갖습니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 기준선은 원 중심을 이어 같은 줄을 볼 수 있게 돕고, 원의 위치와 크기가 실제 정답을 결정합니다.
- 색은 선택 결과를 돕는 보조 신호이며, 규칙은 위치·간격·크기로 구별합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 무늬 공방, 빛, 리본, 수정 조각, 장식용 제작 기계
- SVG: 기준선, 같은 크기의 원 3개, 다음 자리, 완성 후보
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `무늬 빛` 하나입니다.
- 일반 증감, 큰 증가, 완벽한 무늬, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면에서는 현재 빛과 결과 미리보기를 숨겼습니다.
- 정답 확인 뒤 학생이 `무늬 보기`를 눌러 보상을 엽니다.

## Humanizer 학생 문구 QA

- `규칙에 맞는 후보 자리`를 `같은 크기와 간격으로 이어진 그림`으로 바꿨습니다.
- 오답 피드백은 `간격이 넓어졌어요`, `줄에서 벗어났어요`, `원 크기가 달라졌어요`처럼 한 차이만 말합니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·무늬·지시문·선택지 겹침 0, 원과 카드 경계 잘림 0

## 2026-07-23 하네스 보완

- 선택지 접근성 이름을 `같은 크기와 간격`, `간격이 넓음`, `줄에서 벗어남`, `원 크기가 다름`으로 바꾸고 학생 문구 전체를 Humanizer 기준으로 다시 읽었습니다.
- 공용 시작 버튼과 hitbox의 중심·너비·높이 차이는 두 화면 모두 1px 이하입니다.
- 문제 HUD의 브랜드·문제 수·단원·설정 버튼은 서로 겹치지 않습니다.
- 2026-08-01 현재 실행본의 1280×800 브라우저에서 실제 Stage는 1203.19×751.98px, 작업 영역은 782.08×659.98px입니다. Stage 폭의 65.00%, 면적의 57.05%입니다.
- 2026-08-01 현재 실행본의 1024×768 브라우저에서 실제 Stage는 983.06×614.41px, 작업 영역은 639.00×522.41px입니다. Stage 폭의 65.00%, 면적의 55.27%입니다.
- 핵심 문제판 면적은 데스크톱 27.82%, 태블릿 25.43%이며 하네스 최소 작업영역 계약도 65%로 올렸습니다.
- 최소 선택지 크기는 데스크톱 386.53×129.59px, 태블릿 315.00×101.50px입니다.
- 설정 버튼은 42×42px, 브랜드·단원 배지는 14px, 문제 수는 16.8px, 태블릿 지시문은 18.43px 이상입니다.
- 문제판·지시판·선택지 사이 실제 간격은 8px 이상이며, 문제 SVG와 선택지 원은 각 패널 경계 안에 들어옵니다.
- 그림 선택지는 보이는 글자 대신 실제 무늬를 크게 유지하고, 네 접근성 이름으로 차이를 설명합니다.
- 대기 문제판과 완료 패널의 좌우 경계·중심 차이는 1px 이하입니다.
- 간격·줄·크기 오개념 3종을 두 화면에서 각각 캡처했습니다.
- 이전 전체 흐름 캡처는 `_archive/20260723-pre-harness-remediation/screenshots/`에 보관했습니다.

## 검증 결과

- 2026-07-31: 결과 장면으로 잘못 대체되던 닫힌 보상을 무지개유니몬 전용 512×512 생성 장면으로 교체했습니다.
- 닫힘·일반·감소·큰 증가·완벽·0·무지개 7종 컨택시트: `reward-events-v3-contact-sheet.png`
- 보상 모달 실측: 카드 560×480px, 이미지 250×250px, 카드↔Stage 중심 오차 1px 이하, 닫힘·열림 각각 행동 버튼 1개, 글자 넘침·요소 교차 0건

- `node scripts/qa-engine-unit3-circle-pattern-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-contract.mjs 3-2-3-1-mathmon-target-hit 3-2-3-2-mathmon-compass-ring 3-2-3-3-mathmon-double-bridge 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-stage-ratio.mjs --lesson=3-2-3-1-mathmon-target-hit --lesson=3-2-3-2-mathmon-compass-ring --lesson=3-2-3-3-mathmon-double-bridge --lesson=3-2-3-4-mathmon-circle-pattern` → PASS (대상 4개)
- `node scripts/check-rule-consistency.mjs` → PASS
- `node scripts/check-ranking-disabled.mjs` → PASS
- `node scripts/check-run-randomness.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-3-4-mathmon-circle-pattern` → PASS
- 브라우저 QA: 1280×800, 1024×768 전체 흐름에서 이미지 누락·텍스트 넘침·요소 겹침 0

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
- 닫힌 보상·열린 보상: 각 화면군의 `07-reward-closed.png`, `07b-reward-open.png`
- 오개념별 화면: 각 화면군의 `05m-p1-pattern-*.png`
- 기준 비교와 입력 통계: `BENCHMARK_AUDIT.md`

## 2026-07-31 최종 회귀

- 현재 소스로 다시 빌드한 뒤 `1280×800`, `1024×768`에서 표지·설정·방법 2장·문제 대기·오답 유형별 상태·정답 확인·닫힌/열린 보상·결과를 다시 캡처했습니다.
- 결과 막대·값·정답 수·다음 목표·다시하기 hitbox의 공통 축 편차는 Stage 폭 `1.5%` 이하이며, 텍스트 넘침·요소 교차·이미지 누락은 모두 `0건`입니다.
- 문제 선택지 배경은 완전 불투명한 `#fffdf8`로 고정해 뒤 장면이 원 무늬와 글자 사이로 비치는 현상을 없앴습니다.

## 2026-08-01 빈 보상 누적 유지 회귀

- `empty` 사건은 무늬 힘을 비우지 않고 이번 변화만 `0`으로 처리합니다.
- 브라우저 하네스가 누적값 `47`에서 `이번 변화 0`과 누적값 유지가 동시에 성립하는지 검사합니다.

## 2026-08-01 최종 결과 대비·왼쪽 진행 보상 루프

- 최종 결과를 먼저 전수 비교하고, 구분이 약했던 `점무늬 → 작은 무늬` 사이를 다시 생성했습니다.
- `작은 무늬`는 점무늬보다 연결 원·매스몬 반응·공간 빛이 커지고, 다음 `무늬`보다 효과 밀도가 낮게 보이도록 조정했습니다.
- 승인된 결과 6단계를 기준으로 문제 화면 전용 세로 장면 6장을 새로 만들었습니다. 최종 결과 이미지를 자르거나 재사용하지 않았습니다.
- 실행 파일: `play-pattern-v1-*-generated.webp`, 각 768×1536, `object-fit: contain`
- 공유 원본: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/source`
- 진행 보상 컨택시트: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/contact-sheets/play-pattern-progress-v1-contact-sheet.png`
- 실제 픽셀 앵커 검수: `_shared/mathmon/diversity-reward-pack/lesson-scenes/3-2-3-4/play-progress-v1/contact-sheets/play-pattern-progress-v1-anchor-audit.png`
- 고정 패널 계약: Stage 기준 `left 1.65%`, `top 11%`, `width 19.2%`, `height 84%`
- 보상 모달이 완전히 닫힌 뒤 320ms를 두고 장면을 바꾸며, 큰 변화 효과는 1560ms 동안 Stage 폭 35%로 보입니다.
- 현재 빌드에서 `1280×800`, `1024×768`, `1280×720 DPR 2`, `994×632`, `1082×987 DPR 2`를 전수 재실행했습니다. 패널 네 변의 선언 좌표 오차 최댓값은 `0.02px` 미만, 학습 영역 교차는 `0px`, 이미지 누락·글자 넘침·요소 겹침은 모두 `0건`입니다.
- `994×632`에서는 선택지 영역이 계산판보다 약간 커지던 기존 행 높이도 함께 고쳐, 계산판이 가장 큰 학습 영역이라는 계약을 다시 통과했습니다.

## 2026-08-02 현재 화면 증거

- 시작·설명·문제·보상·결과 상태와 화면 크기별 현재 캡처: `screenshots/report-flow-desktop-contact-sheet.png`, `screenshots/report-flow-tablet-landscape-contact-sheet.png`, `screenshots/report-flow-codex-in-app-contact-sheet.png`, `screenshots/report-flow-user-visibility-994x632-contact-sheet.png`, `screenshots/report-flow-user-reported-missing-left-progress-1082x987-dpr2-contact-sheet.png`
- 현재 실행본 해시와 캡처 목록: `screenshots/report-evidence-manifest.json`

## 결과판 내부 결속 v2 (2026-08-03)

- `qa.resultPanelContainmentAudit.standard`를 `result-panel-containment-v2`로 선언했습니다. 결과 배경, 결과 패널, 단계명·정답 수·다시 버튼은 각각 선택 가능한 raster/WebP 레이어이며, 진행값·진행 막대·다음 목표만 동적 UI입니다.
- 안전 여백 `24px` 안에서 패널 네 변, 실제 보이는 rect, hitbox, 요소 간 교차, 공통 중심축 `1px`, 다시 버튼 아트↔hitbox 네 변 `1px`을 검사합니다. 숨긴 다음 목표는 `display:none`과 `0×0` rect를 확인합니다.
- `1280×800`, `1024×768`, `1280×720 DPR2`, `994×632`, `1082×987 DPR2`에서 결과 6단계를 전수 재실행했고, 넘침·요소 겹침·Stage 잘림은 `0건`입니다. 런타임 commit SHA와 lesson JSON SHA도 일치했습니다.
