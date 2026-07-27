# 매스몬 검산 자물쇠

3학년 2학기 2단원 4차시, 곱셈으로 나눗셈을 검산하는 게임입니다.

동행 매스몬 팩은 `base-pack`, 주인공은 킹드래곤몬입니다.

## 학습 조작

1. 먼저 곱할 두 수가 `나누는 수×몫`인지 관계 보기 4개에서 고릅니다.
2. 시스템이 곱을 계산하면, 그 값에 더할 수가 `나머지`인지 역할 보기 4개에서 고릅니다.
3. 계산판이 처음 수와 같은지 `=` 또는 `≠`로 바로 보여 줍니다.
4. 틀린 식에서만 몫 또는 나머지 가운데 다른 곳을 찾습니다.

매 단계는 큰 문제, 현재 계산, 한 줄 지시문, 선택지만 보여 줍니다. 다음 계산과 전체 검산판은 미리 펼치지 않습니다. 학생이 고른 오답 관계도 현재 계산판에 먼저 들어가며, `처음 수×나누는 수`와 `나누는 수×나머지`처럼 검산 순서를 잘못 잡은 상태를 보여 준 뒤 다시 고르게 합니다.

문제 화면은 3-2-2-3의 실제 비율을 기준으로 다시 만들었습니다. 왼쪽 `23.4375%×82%`에는 킹드래곤몬과 현재 금고가 이어지는 세로 장면 하나를 두고, `지금 / 열쇠 힘 / 다음`은 장면 위 정보층으로만 표시합니다. 오른쪽 약 70%에는 큰 문제, 검산 자물쇠, 한 줄 안내, 선택지만 한 열로 둡니다. 검산 SVG의 사각 표면은 하나뿐이며 몫·나머지는 비교가 필요한 단계에서만 원형 기능 슬롯으로 보입니다.

## 판단·입력 수

현재 모델 500개 시드, 5,000문제 기준입니다.

- 수학적 판단: 최소 2회, 중앙값 2회, 평균 2.4회, 최대 3회
- 선택 입력: 최소 2회, 중앙값 2회, 평균 2.4회, 최대 3회
- 맞는 식은 곱할 두 수와 더할 수를 학생이 판단합니다. 곱·합과 같고 다름은 선택한 관계로 이미 결정되므로 시스템이 계산해 보여 줍니다. 틀린 식은 다른 곳 찾기가 한 번 더 필요합니다.
- 정답을 알고 난 뒤 자릿수와 `넣기`를 반복해서 누르던 숫자판 조작은 없습니다. 수학적 판단 1회와 물리 입력 1회가 일치합니다.

## 보상과 결과

- 닫힌 보상은 금고 이미지와 `열기` 버튼만 보여 줍니다.
- 열린 보상은 사건 이미지, 열쇠 힘 변화량, `다음` 버튼만 보여 줍니다.
- 열쇠 힘은 늘거나 줄거나 0이 될 수 있고, 희귀 무지개 열쇠는 최고 결과를 엽니다.
- 특별 결과는 낮은 일반 금고를 다음 목표로 가리키지 않습니다.

## 전국 순위 정책

- 현재 제품 정책에 따라 랭킹 문구, 진입 버튼, 순위 화면, 점수 제출·조회 요청을 모두 비활성화합니다.
- `lesson.json > scoreboard.enabled`는 `false`이며 학생 흐름과 현재 QA에 순위 화면이 없습니다.

## 겹침 회귀 계약

- 사용자 제보 조건은 `codex-browser-regression`이라는 이름으로 `lesson.json > qa.viewports`에 고정합니다.
- 기준 브라우저는 `1280×720`, DPR 2이며, 높이에 맞춰 줄어든 실제 Stage는 `1075.19×671.98`입니다.
- 이번 정보 과밀 제보 이미지는 물리 크기 `2048×1280`이므로 CSS viewport를 `1024×640`, DPR 2로 추정해 `user-reported-overload` 회귀 조건에 추가했습니다. 실제 Stage는 `947.19×591.98`입니다.
- 현재 Codex 패널 조건은 `codex-live-panel-regression`이라는 이름으로 `931×897`, DPR 2에 고정합니다. 실제 Stage는 `893.78×558.61`입니다.
- 왼쪽 보상판 누락 제보 조건은 `user-reported-missing-reward-panel`이라는 이름으로 `1082×897`, DPR 2에 고정합니다. 실제 Stage는 `1038.75×649.22`입니다.
- QA는 SVG 계산판 표면, 단계판, 지시문, 피드백, 선택지, 버튼 hitbox의 실제 렌더 경계를 재서 형제 요소 겹침 0px와 Stage 이탈 0건을 확인합니다.
- 핵심 계산판은 Stage 너비의 65% 이상을 차지해야 합니다. 곱하기 관계·더할 수·자동 비교·틀린 곳 찾기의 대기/정답 확인 상태와 대표 관계 오답 2종을 각각 캡처합니다.
- 왼쪽 보상판은 Stage 폭 18%, 높이 55% 이상이어야 합니다. 현재 그림·이름·열쇠 힘·다음 금고를 모두 담고 계산 작업 영역과 8px 이상 떨어져야 합니다. 작은 숫자 배지로 줄어들거나 어느 하나가 빠지면 실패합니다.
- 곱셈 관계는 검산 자물쇠의 중앙축에서 5px 이상 벗어나면 실패합니다.
- 모든 단계에서 SVG 사각형은 바깥 표면 1개로 제한합니다. 한 줄 지시문은 선택지와 분리되는 크림색 판 하나만 사용합니다.

## 이미지 계약

- 설명 2장: `나누는 수×몫`과 `나머지`를 고르는 검산 / 10문제·금고 열기·결과
- 설명 1 원본은 `tutorial-page-1-v6-source.png`, 배포본은 `tutorial-page-1-generated.png/.webp` 1280×800입니다.
- 문제 장면 3장: 잠김 / 핀 맞음 / 열림, 각 1280×800
- 문제 중 세로 금고 세계 6장: 작은 자물쇠 / 튼튼한 금고 / 커다란 금고 / 비밀 금고 / 보물 금고 / 무지개 금고, 각 `600×1312`
- 킹드래곤몬 반응 자산 3장은 보관하지만, 문제 선택지를 가리지 않도록 현재 문제 화면에서는 반응 오버레이를 쓰지 않습니다.
- 보상: 닫힌 금고 1장 + 열쇠 사건 6종
- 결과: UI 없는 보물 금고 장면 + 등급명 이미지 6장 + 정답 수 + 열쇠 힘 + 생성형 다시 버튼
- 컨택시트: `problem-state-contact-sheet.png`, `play-vault-world-contact-sheet.png`, `result-title-contact-sheet.png`, `_shared/mathmon/base-pack/contact-sheets/reactions-unit2/kingdragonmon-reactions-contact-sheet.png`

## 검증

```bash
node scripts/build-lesson.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson-model.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson-flow.mjs 3-2-2-4-mathmon-check-lock
node scripts/qa-lesson2-check-lock.mjs 20260727
node scripts/check-stage-ratio.mjs
node scripts/check-rule-consistency.mjs
node scripts/check-lesson-contract.mjs
node scripts/check-lesson-visual-contract.mjs
```

현재 화면 증거는 `screenshots/engine-flow-desktop-*.png`, `screenshots/engine-flow-tablet-landscape-*.png`, `screenshots/engine-flow-user-reported-overload-*.png`, `screenshots/engine-flow-codex-browser-regression-*.png`, `screenshots/engine-flow-codex-live-panel-regression-*.png`, `screenshots/engine-flow-user-reported-missing-reward-panel-*.png`입니다. 대표 관계 오답 2종, 단계별 대기·정답 확인, 자동 `=`·`≠`, 마지막 확인, 닫힌·열린 보상, 결과를 각각 포함합니다.
