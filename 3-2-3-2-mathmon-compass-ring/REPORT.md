# 매스몬 컴퍼스 마법진 제작 보고 (3-2-3-2)

## 이번 고도화

- 기존 검은 패널과 왼쪽 점수 장치를 생성 이미지 기반의 밝은 마법 기하 작업실로 교체했습니다.
- 숫자 버튼만 고르던 방식을 눈금과 실제 벌림이 보이는 컴퍼스 그림 4개 선택으로 바꿨습니다.
- 문제 화면을 `큰 질문 → 반지름 그림 → 한 줄 지시 → 컴퍼스 선택지`로 줄였습니다.
- 오답에는 선택한 벌림으로 그려질 원의 호를, 정답에는 실제 컴퍼스 회전과 완성 원을 보여 주는 SVG 확인 상태를 추가했습니다.
- 소스 엔진을 `_lessons/3-2-3-2-mathmon-compass-ring/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 2026-07-12 1단원 기준 시각 흐름 보강

- 커버의 수정부엉몬을 설명·보상·결과까지 유지하고, 팩은 `diversity-reward-pack` 하나로 고정했습니다.
- 설명 1은 `반지름 3 cm`, `컴퍼스 벌림 3 cm`, `반지름 = 컴퍼스 벌림`을 실제 그림과 눈금으로 연결합니다.
- 설명 2에서는 풀이법을 반복하지 않고 `10문제 → 마법진 빛 변화 → 마법진 이름`만 보여 줍니다.
- 랜덤 보상 6종은 빛 증가·감소·큰 증가·완벽한 원·빛 0·무지개 원을 별도 이미지로 구분했습니다.
- 열기 전 봉인 상자 1장을 더해 보상 상태 세트는 7장이며, 컨택시트는 `reward-events-v3-contact-sheet.png`입니다.
- 결과 6장은 모두 1280×800이며, 수정부엉몬·왼쪽 마법진·오른쪽 동적 정보판·고정 제목·`다시` 버튼 슬롯을 통일했습니다.
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 쓰며, 공용 상단 슬롯 좌표를 따릅니다.

## 수학 설계

- 반지름 2~6 cm가 한 판에 각각 두 번 나옵니다.
- 각 문제는 정답, 지름만큼 벌린 보기, 1 cm 좁은 보기, 1 cm 넓은 보기로 구성합니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 컴퍼스의 침과 연필 끝 사이 길이가 눈금에서 직접 보입니다.
- 정답 확인 화면은 `원의 반지름 = 컴퍼스 벌림`을 같은 화면에서 연결합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 마법 기하 작업실, 빛, 책상, 장식용 컴퍼스와 수정 도구
- SVG: 원, 중심점, 반지름, 눈금, 컴퍼스 두 다리, `=`·`≠`
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `마법진 빛` 하나입니다.
- 일반 증감, 큰 증가, 완벽한 원, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면에서는 현재 빛과 결과 미리보기를 숨겼습니다.
- 정답 확인 뒤 학생이 `마법 보기`를 눌러 전체 Stage 보상으로 이동하고, 닫힌 상자를 다시 눌러 사건을 공개합니다.
- 0 사건은 현재 누적값을 보존하고, 오답 손해는 `-4~-2`로 제한했습니다.

## Humanizer 학생 문구 QA

- 문제 행동은 `바늘과 연필 사이의 길이를 골라요.`로 바꿔 화면에서 실제로 볼 부분을 말했습니다.
- 오답 피드백은 `이대로 돌리면 원이 작아져요`, `원이 커져요`, `목표 원보다 커져요`처럼 선택 결과를 바로 말합니다.
- 정답 확인은 `그대로 돌리면 반지름 3 cm인 원이 돼요.`처럼 그림과 맞는 한 문장으로 줄였습니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·원·지시문·선택지 겹침 0, 컴퍼스 눈금 잘림 0

## 2026-07-23 하네스 보완

- 목표를 `반지름만큼 컴퍼스를 벌려요.`로 다듬고 학생 문구 전체를 Humanizer 기준으로 다시 읽었습니다.
- 공용 시작 버튼과 hitbox의 중심·너비·높이 차이는 두 화면 모두 1px 이하입니다.
- 문제 HUD의 브랜드·문제 수·단원·설정 버튼은 서로 겹치지 않습니다.
- 1280×800 브라우저에서 실제 Stage는 1203.19×751.98px, 작업 영역은 794.11×659.98px입니다. Stage 폭의 66.00%, 면적의 57.93%입니다.
- 1024×768 브라우저에서 실제 Stage는 983.06×614.41px, 작업 영역은 648.84×522.41px입니다. Stage 폭의 66.00%, 면적의 56.12%입니다.
- 핵심 문제판 면적은 데스크톱 28.24%, 태블릿 25.83%로 선택지 묶음보다 큽니다.
- 최소 선택지 크기는 데스크톱 392.55×130.95px, 태블릿 319.92×101.50px입니다.
- 설정 버튼은 42×42px, 브랜드·단원 배지는 14px, 문제 수는 16.8px, 태블릿 지시문은 18.43px 이상입니다.
- 선택지의 실제 렌더 글자는 18px 이상이며, 문제판·지시판·선택지 사이 실제 간격은 8px 이상입니다.
- 문제 SVG의 바깥 표면은 문제판 안에 들어오고, 컴퍼스 눈금·수치·선택지 이름은 SVG 경계를 벗어나지 않습니다.
- 대기 문제판과 완료 패널의 좌우 경계·중심 차이는 1px 이하입니다.
- `좁게 벌림`, `넓게 벌림`, `지름만큼 벌림` 오답 상태를 두 화면에서 각각 캡처했습니다.
- 이전 전체 흐름 캡처는 `_archive/20260723-pre-harness-remediation/screenshots/`에 보관했습니다.

## 2026-07-27 SVG 원 그리기·Stage-Reveal 보상 수정

- 실패 화면은 `1082×897`, DPR 2였습니다. 실제 Stage는 1038.75×649.22px이고 좌상단은 (21.63, 123.89)이었습니다.
- 정답 뒤 정적인 `원 = 컴퍼스` 그림만 보이던 상태를 `중심에 바늘 놓기 → 벌림 맞추기 → 컴퍼스 회전 → 원 완성` SVG 연속 상태로 바꿨습니다.
- 좁음·넓음·지름 오답은 선택한 벌림으로 실제로 그려질 원호와 목표 원을 겹쳐 보여 줍니다.
- 기존의 큰 빈 설명 상자를 높이 `88~104px` 확인 레일로 줄이고, 완성 그림과 같은 중앙 축 아래에 한 줄 확인과 `마법 보기` 버튼만 남겼습니다.
- 닫힌 보상 이미지를 작은 중앙 모달에 넣던 구조를 제거하고, 3-2-2-1과 같은 `Stage-Reveal` 흐름으로 이관했습니다. 왼쪽 사건 이미지와 오른쪽 현재 단계·진행·버튼이 같은 Stage 안에서 닫힘/열림으로 바뀝니다.
- 보상 상태 계약은 `closed`, `normal`, `loss`, `mega`, `perfect`, `empty`, `rainbow` 7장으로 고정했습니다.
- 결과 화면에서 배경에 이미 생성된 `다시` 버튼 위로 불투명 공용 버튼이 중복되던 문제를 없앴습니다. 실제 HTML은 배경 버튼과 맞춘 투명 hitbox만 맡고, 정답 수 이미지는 위로 옮겨 교차 0px를 확보했습니다.
- `reported-reward-closed-1082x897-dpr2`와 `reported-complete-1082x897-dpr2`를 `lesson.json > qa.viewports`에 영구 회귀 항목으로 등록했습니다.
- 현재 전체 흐름 QA는 데스크톱, 태블릿 가로, 제보 화면 2종에서 모두 종료 코드 0입니다. 잔여 P0/P1은 없습니다.

## 검증 결과

- `node scripts/qa-engine-unit3-compass-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- `node scripts/check-lesson-contract.mjs 3-2-3-1-mathmon-target-hit 3-2-3-2-mathmon-compass-ring 3-2-3-3-mathmon-double-bridge 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-3-2-mathmon-compass-ring` → PASS
- `node scripts/check-stage-ratio.mjs --lesson=3-2-3-1-mathmon-target-hit --lesson=3-2-3-2-mathmon-compass-ring --lesson=3-2-3-3-mathmon-double-bridge --lesson=3-2-3-4-mathmon-circle-pattern` → PASS (대상 4개)
- `node scripts/check-rule-consistency.mjs` → PASS
- `node scripts/check-ranking-disabled.mjs` → PASS
- `node scripts/check-run-randomness.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-3-2-mathmon-compass-ring` → PASS (1280×800, 1024×768, 1082×897 DPR 2 회귀 화면 2종)
- 브라우저 QA: 1280×800, 1024×768, 1082×897 DPR 2에서 SVG 오답·완성, 닫힌·열린 보상, 결과의 이미지 누락·텍스트 넘침·요소 겹침 0

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 사용자 제보 화면: `screenshots/engine-flow-reported-{reward-closed,complete}-1082x897-dpr2-*.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
- 닫힌 보상·열린 보상: 각 화면군의 `07-reward-closed.png`, `07b-reward-open.png`
- 오개념별 화면: 각 화면군의 `05m-p1-compass-*.png`
- 기준 비교와 입력 통계: `BENCHMARK_AUDIT.md`
