# 매스몬 저울 균형 구현 보고서

## 구현 결과

정답 방향을 선택 전에 보여 주던 저울 기울기를 제거했습니다. 선택 뒤에만 학생이 고른 무게 또는 무게추를 저울에 올리고, 실제 차이에 따라 기울입니다.

- 비교 대기: `tilt: 0deg`
- 비교 오답: 반대쪽이 얼마나 무거운지 표시
- 균형 오답: 고른 무게추를 접시에 표시하고 부족·초과 방향을 표시
- 선택지: 구조화된 수학 선택지만 사용
- 비수학 선택지: 0건

## 정답 확인과 Humanizer QA

학생 문구는 현재 보이는 물건과 행동을 직접 말하도록 고쳤습니다.

- `더 무거운 쪽을 골라요.`
- `저울을 맞출 무게추를 골라요.`
- `100g 부족해요.`
- `오른쪽이 100g 더 무거워요.`

정답 뒤에는 수평이 된 저울이나 실제 기울기를 먼저 확인하고 `저울 보기`로 이동합니다.

## 자산과 엔진

- 엔진: `mathmon-engine-v1`
- 소스 manifest: `_lessons/3-2-5-3-mathmon-scale-balance/lesson.json`
- 공유 모델·뷰: 1차시 공통 소스
- 시작 버튼: 공용 `shared-canonical-v1`
- 기존 커버·설명·보상·결과 이미지는 유지
- 결과 컨택시트: `result-states-contact-sheet.png`
- 승인 팩: `diversity-reward-pack`

자산 스킬, 루트 하네스, `_shared/mathmon/MATHMON_ASSET_CONTRACT.md`의 승인 팩 목록을 카탈로그의 `active-approved` 상태와 맞췄습니다.

## 텍스트 넘침·요소 겹침 QA

세 viewport에서 표지, 설정, 설명 1·2, 수평 대기, 작은/큰 무게추 오답, 정답 확인, 완성, 보상, 낮음·중간·최고 결과를 캡처했습니다.

- 텍스트 넘침 0건
- 문제·저울·선택지 교차 0px
- 터치 영역 42×42px 이상
- 선택 전 정답 방향 노출 0건

대표 증거는 `screenshots/qa5-desktop-05-play-waiting.png`, `screenshots/qa5-desktop-06-wrong-low.png`, `screenshots/qa5-short-dpr2-08-step-1-confirm.png`입니다.

## 화면 재점검 보완

오답 색이 여러 선택지에 누적되지 않도록 고쳤고, 정답 뒤에는 고른 쪽과 실제 기울기만 남깁니다. 완성 화면은 저울 상태와 가운데 `저울 보기`에 집중하도록 정리했습니다. 보상 화면의 중심에는 현재 힘의 높이와 변화 방향을 보여 줍니다.

`compareKgG`, `balanceMissing`, `compareTonKg`을 세 viewport에서 각각 검사했습니다. 선택 전 수평, 반대쪽 선택, 단위 혼동, 부족·초과, 정답 확인 상태까지 독립 캡처로 남겼습니다.

## 검증

- `node scripts/qa-lesson5-scale-balance-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-scale-balance.mjs --runs 10000`
- `node scripts/qa-lesson5-flow.mjs`

정답 경로 수학 입력은 최소 `1`, 중앙값 `1`, 평균 `1.0`, 최대 `1`입니다.
