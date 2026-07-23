# 매스몬 표적 맞히기 제작 보고 (3-2-3-1)

## 이번 고도화

- 기존 검은 패널 중심 화면을 생성 이미지 기반의 밝은 표적 훈련장으로 교체했습니다.
- 한 원에 후보 4개를 겹쳐 표시하던 방식을 독립된 미니 원 선택지 4개로 바꿨습니다.
- 문제 화면에서 점수 장치·등급 트랙·긴 설명을 빼고 `큰 질문 → 원 → 한 줄 지시 → 선택지`만 남겼습니다.
- 정답 뒤 선택한 점 또는 선분이 큰 원에 확정되어 보이는 확인 화면을 추가했습니다.
- 소스 엔진을 `_lessons/3-2-3-1-mathmon-target-hit/`로 분리하고 `index.html`을 빌드 산출물로 전환했습니다.

## 2026-07-12 1단원 기준 시각 흐름 보강

- 커버의 번개늑대몬을 설명·보상·결과까지 유지하고, 팩은 `diversity-reward-pack` 하나로 고정했습니다.
- 설명 1에서 `중심`, `반지름`, `지름`을 명시하고 각각 `원 한가운데 점`, `중심에서 원까지`, `중심을 지나 양쪽 끝까지`로 연결했습니다.
- 설명 2에서는 풀이법을 반복하지 않고 `10문제 → 표적 점수 변화 → 표적 이름`만 보여 줍니다.
- 랜덤 보상 6종은 일반 명중·가장자리·대량 명중·정중앙·빗나감·무지개 명중을 별도 이미지로 구분했습니다.
- 결과 6장은 모두 1280×800이며, 번개늑대몬의 위치·오른쪽 동적 정보판·고정 제목·`다시` 버튼 슬롯을 통일했습니다.
- 결과 컨택시트: `result-tiers-v2-contact-sheet.png`
- 표지 왼쪽 위는 실제 `eduitit-logo-mark.png`를 쓰며, 공용 상단 슬롯 좌표를 따릅니다.

## 수학 설계

- 10문제는 중심 4개, 반지름 3개, 지름 3개를 섞어 출제합니다.
- 각 문제는 정답 1개와 대표 오개념 3개를 갖습니다.
- 모든 오답에는 `misconceptionId`와 한 줄 피드백이 있습니다.
- 중심·반지름·지름은 색이 아니라 점과 선분의 기하 관계로 구분합니다.
- 오답 뒤에는 선택한 잘못된 관계를 큰 원에서 보여 주고, 다시 고르게 합니다.

## 이미지·동적 UI 역할

- 생성 이미지: 배경 공간, 빛, 목재, 표적 훈련 장치
- SVG: 원, 중심점, 반지름, 지름, 현, 선택·확인 상태
- HTML: 질문과 한 줄 문구, 접근성 버튼 hitbox
- 문제 배경: `problem-stage-generated.webp` 1280×800

## 보상 구조

- 중심 보상은 `표적 점수` 하나입니다.
- 일반 증감, 큰 증가, 정중앙, 0, 무지개 이벤트를 유지했습니다.
- 문제 화면에서는 현재 점수와 결과 미리보기를 숨겼습니다.
- 정답 확인 뒤 학생이 `점수 보기`를 눌러 보상을 엽니다.

## Humanizer 학생 문구 QA

- 추상적인 `묻는 관계`를 `알맞은 점이나 선분이 그려진 원`으로 바꿨습니다.
- 문제 지시와 피드백은 한 문장에 행동이나 이유 하나만 담았습니다.
- `중심`, `반지름`, `지름`은 교과 수학 용어이므로 유지하고, 바로 아래에 위치 관계를 쉬운 말로 붙였습니다.

## 텍스트 넘침·요소 겹침 QA

- 1280×800: 첫 화면, 설정, 방법 2장, 문제, 오답, 정답 확인, 보상, 결과 확인
- 1024×768 태블릿 가로: 같은 전체 흐름 확인
- 자동 측정 결과: overflow 0, missingImages 0
- 눈으로 확인한 결과: 질문·원·지시문·선택지 겹침 0, 정답 확인 패널 겹침 0

## 2026-07-23 하네스 보완

- 공용 시작 버튼과 hitbox의 중심·너비·높이 차이는 두 화면 모두 1px 이하입니다.
- 문제 HUD의 브랜드·문제 수·단원·설정 버튼은 서로 겹치지 않습니다.
- 1280×800 브라우저에서 실제 Stage는 1203.19×751.98px, 작업 영역은 758.02×659.98px입니다. Stage 폭의 63.00%, 면적의 55.29%입니다.
- 1024×768 브라우저에서 실제 Stage는 983.06×614.41px, 작업 영역은 619.34×522.41px입니다. Stage 폭의 63.00%, 면적의 53.57%입니다.
- 핵심 문제판 면적은 데스크톱 26.96%, 태블릿 24.65%로 선택지 묶음보다 큽니다.
- 최소 선택지 크기는 데스크톱 374.50×130.95px, 태블릿 305.17×101.50px입니다.
- 설정 버튼은 42×42px, 브랜드·단원 배지는 14px, 문제 수는 16.8px, 태블릿 지시문은 18.43px 이상입니다.
- 문제판·지시판·선택지 사이 실제 간격은 8px 이상이며, 문제 SVG의 바깥 표면도 문제판 안에 들어옵니다.
- 대기 문제판과 완료 패널의 좌우 경계·중심 차이는 1px 이하입니다.
- 최저 결과를 `practice / 연습 표적`으로 교체했습니다. `0점·0/10` 강제 화면에서도 새 1280×800 결과 장면과 동적 숫자판이 맞게 보입니다.
- 결과 6장 컨택시트를 갱신했고, 이전 `result-miss-*`와 이전 전체 흐름 캡처는 `_archive/20260723-pre-harness-remediation/`에 보관했습니다.
- Humanizer 전수 검사에서 목표·설명·지시·오답·확인·보상·결과·접근성 이름을 확인했습니다. 교과 용어 외 제작자 말투와 번역투 잔여는 없습니다.

## 검증 결과

- `node scripts/qa-engine-unit3-target-source.mjs` → PASS
- `node scripts/build-lesson.mjs 3-2-3-1-mathmon-target-hit` → PASS
- `node scripts/check-lesson-contract.mjs 3-2-3-1-mathmon-target-hit 3-2-3-2-mathmon-compass-ring 3-2-3-3-mathmon-double-bridge 3-2-3-4-mathmon-circle-pattern` → PASS
- `node scripts/check-lesson-visual-contract.mjs 3-2-3-1-mathmon-target-hit` → PASS
- `node scripts/check-stage-ratio.mjs --lesson=3-2-3-1-mathmon-target-hit --lesson=3-2-3-2-mathmon-compass-ring --lesson=3-2-3-3-mathmon-double-bridge --lesson=3-2-3-4-mathmon-circle-pattern` → PASS (대상 4개)
- `node scripts/check-rule-consistency.mjs` → PASS
- `node scripts/check-ranking-disabled.mjs` → PASS
- `node scripts/check-run-randomness.mjs` → PASS
- `node scripts/qa-lesson-flow.mjs 3-2-3-1-mathmon-target-hit` → PASS
- 브라우저 QA: 1280×800, 1024×768 전체 흐름에서 이미지 누락·텍스트 넘침·요소 겹침 0

## 검증 자산

- 데스크톱: `screenshots/engine-flow-desktop-01-cover.png`부터 `08-result.png`
- 태블릿 가로: `screenshots/engine-flow-tablet-landscape-01-cover.png`부터 `08-result.png`
- 오답 상태: 각 화면군의 `05b-play-wrong.png`
- 정답 확인: 각 화면군의 `06-confirm.png`
- 닫힌 보상·열린 보상: 각 화면군의 `07-reward-closed.png`, `07b-reward-open.png`
- 최저 결과: 각 화면군의 `08a-result-practice-0-of-10.png`
- 기준 비교와 입력 통계: `BENCHMARK_AUDIT.md`
