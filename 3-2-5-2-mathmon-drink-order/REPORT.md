# 매스몬 음료 제조 주문 구현 보고서

## 구현 결과

받아올림·받아내림 계산판이 학생의 오답을 먼저 보존하도록 바꿨습니다. 다음 단계는 `?`로 잠기며, 정답값을 현재 L/mL 열에서 확인한 뒤에만 넘어갑니다.

- 오답 피드백: `1000mL를 아직 바꾸지 않았어요.`, `100mL 적어요.`, `100mL 많아요.`
- 주문 비교: 만든 양과 주문량을 같은 축에 표시
- 선택지: 구조화된 수학 선택지만 사용
- 단계 수: 더하기 3, 빼기 3, 주문 비교 1
- 비수학 선택지: 0건

## 정답 확인과 Humanizer QA

학생 문구는 한 문장에 행동 하나만 담았습니다.

- `mL끼리 더한 값을 골라요.`
- `1000mL를 1L로 바꿔요.`
- `주문과 비교해 골라요.`

정답 뒤에는 계산판에 값이 들어간 상태가 1.1초 머물고, 마지막 완성 계산판을 본 뒤 `주문 보기`를 누릅니다.

## 자산과 엔진

- 엔진: `mathmon-engine-v1`
- 소스 manifest: `_lessons/3-2-5-2-mathmon-drink-order/lesson.json`
- 공유 모델·뷰: 1차시 공통 소스
- 시작 버튼: 공용 `shared-canonical-v1`
- 기존 커버·설명·보상·결과 이미지는 유지
- 결과 컨택시트: `result-states-contact-sheet.png`
- 매스몬 팩: `zero-factory-animal-pack`

## 텍스트 넘침·요소 겹침 QA

`node scripts/qa-lesson5-flow.mjs`에서 세 viewport의 표지, 설정, 설명 1·2, 문제 대기, 작은/큰 오답, 각 단계 정답 확인과 다음 단계 대기, 완성 계산판, 보상, 낮음·중간·최고 결과를 각각 캡처했습니다.

현재 결과:

- 텍스트 넘침 0건
- 문제·계산판·선택지 교차 0px
- 터치 영역 42×42px 이상
- 완료 전후 계산판 중심축 차이 1px 이하

대표 증거는 `screenshots/qa5-tablet-landscape-06-wrong-low.png`, `screenshots/qa5-desktop-09-step-2-waiting.png`, `screenshots/qa5-short-dpr2-10-complete.png`입니다.

## 화면 재점검 보완

여러 오답을 차례로 눌러도 마지막 선택만 빨간색으로 남도록 고쳤습니다. 정답이 계산판에 들어가면 L/mL 결과 열은 초록색으로 바뀝니다. 완성 화면에서는 긴 식을 아래에 반복하지 않고, 계산판과 가운데 `주문 보기`만 보여 줍니다. 보상 화면에는 현재 힘의 높이와 변화 방향이 보입니다.

`addCarryMl`, `subtractBorrowMl`, `orderCheck`를 세 viewport에서 각각 열어 대기·오답 두 방향·각 단계 확인·완성을 검사했습니다. 핵심 글씨 최소 크기와 계산판·선택지 실제 폭도 함께 측정했습니다.

## 검증

- `node scripts/qa-lesson5-drink-order-model.mjs --runs 10000`
- `node scripts/simulate-lesson5-drink-order.mjs --runs 10000`
- `node scripts/qa-lesson5-flow.mjs`

정답 경로 수학 입력은 최소 `1`, 중앙값 `3`, 평균 `2.4`, 최대 `3`입니다.
