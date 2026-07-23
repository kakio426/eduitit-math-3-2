# 매스몬 택배 무게 맞추기 구현 보고서

## 구현 결과

4차시를 `_lessons` 소스와 `mathmon-engine-v1`로 전환했습니다. 기존 3단계 더하기·빼기, 2단계 한도 판단, 보상 확률, 커버·설명·결과·트럭 이미지는 유지했습니다.

- kg/g 열을 맞춘 교과서식 계산판
- 학생이 고른 오답을 현재 열에 보존
- 받아올림·받아내림 누락과 100g 부족·초과를 한 줄로 표시
- 택배 무게와 한도를 같은 축에 표시
- 다음 단계는 정답 전까지 `?` 잠금
- 비수학 선택지 0건

## 보상 흐름

```text
완성 계산판 → 트럭 보기 → 닫힌 상자와 현재 트럭
→ 상자 열기 → 이전 트럭과 다음 트럭 → 결과 한 줄 → 다음/결과 보기
```

공통 엔진에 선택형 `formatLessonRewardTarget({ event, beforeResult, afterResult, state })` 훅을 추가했습니다. 4차시는 이 훅으로 `살짝 멋진 트럭까지 29 남았어요.` 같은 문구를 만들고, 다른 차시는 기존 기본 문구를 유지합니다.

보상 버튼 중복 클릭은 공통 엔진의 `rewardPhase`와 `pendingAdvance` 가드로 한 번만 처리합니다.

## Humanizer QA

학생 문구는 한 문장 한 행동, 보상 문구 한 덩어리를 기준으로 점검했습니다.

- `g끼리 더한 값을 골라요.`
- `1kg을 1000g으로 바꿔요.`
- `한도와 비교해 골라요.`
- `100g 적어요.`
- `한도보다 90g 무거워요.`
- `상자 열기`

제작자 용어와 농장 보상 문구는 학생 화면에 노출되지 않습니다.

## 자산과 엔진

- 엔진: `mathmon-engine-v1`
- 소스 manifest: `_lessons/3-2-5-4-mathmon-package-weight/lesson.json`
- 시작 버튼: 공용 `shared-canonical-v1`
- 결과 컨택시트: `result-states-contact-sheet.png`
- 트럭 컨택시트: `truck-evolution-contact-sheet.png`
- 매스몬 팩: `base-pack`
- 이전 스크린샷: `_archive/pre-engine-screenshots/`
- 이전 클릭 가드: `scripts/_archive/unit5-pre-engine/qa-lesson5-package-weight-click-guards.mjs`

## 텍스트 넘침·요소 겹침 QA

세 viewport에서 표지, 설정, 설명 1·2, 문제 대기, 작은/큰 오답, 각 단계 확인과 대기, 마지막 완성 계산판, 닫힌/열린 보상, 낮음·중간·최고 결과를 캡처했습니다.

- 텍스트 넘침 0건
- 문제·계산판·선택지 교차 0px
- 터치 영역 42×42px 이상
- 완료 전후 계산판 중심축 차이 1px 이하
- `1280×720 / DPR 2` 보상 버튼 아래 여백 16px 이상
- 중복 보상 적용 0건

대표 증거는 `screenshots/qa5-tablet-landscape-06-wrong-low.png`, `screenshots/qa5-short-dpr2-11-reward-closed.png`, `screenshots/qa5-short-dpr2-12-reward-open.png`입니다.

## 화면 재점검 보완

kg/g 계산판이 내용 폭만큼 작아지던 원인을 고쳐 핵심 문제 영역 안에서 충분히 크게 보이게 했습니다. 정답 결과 열은 초록색으로 바뀌며 이전 오답 색은 남지 않습니다. 한도 문제는 축을 넓히고, 가까운 `택배`와 `한도` 라벨 및 두 무게를 선의 양쪽으로 나눠 겹치지 않게 했습니다. 완성 화면은 계산판과 가운데 `트럭 보기`만 남깁니다.

`addCarry`, `subtractBorrow`, `limit`을 세 viewport에서 각각 검사했습니다. 한도 축의 라벨·수치 교차, 계산판 실제 폭, 핵심 글자 크기, Stage 경계, 닫힌·열린 보상 버튼 여백을 브라우저 좌표로 확인했습니다.

## 검증

- `node scripts/qa-lesson5-package-weight-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-package-weight.mjs --runs 10000`
- `node scripts/qa-lesson5-flow.mjs`

정답 경로 수학 입력은 최소 `2`, 중앙값 `3`, 평균 `2.7`, 최대 `3`입니다.
